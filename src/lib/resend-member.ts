import { Resend } from "resend";
import type Stripe from "stripe";
import { tierForPrice } from "@/lib/membership";

/**
 * Resend contact property that marks a paying member.
 * The installed SDK types custom attributes as `properties`, and each
 * value is a string or number. `member` is stored as the string "true"
 * or "false". Contacts with no property are free subscribers.
 */
const MEMBER_PROPERTY = "member";

let memberPropertyReady: Promise<void> | null = null;

function memberValue(member: boolean): "true" | "false" {
  return member ? "true" : "false";
}

/**
 * Whether this subscription event should change the member attribute.
 * active sets it true. A deleted subscription, or status canceled or
 * past_due, sets it false. Any other status is left alone.
 */
export function memberFlagForSubscription(
  eventType: string,
  status: string,
): boolean | null {
  if (eventType === "customer.subscription.deleted") return false;
  if (status === "canceled" || status === "past_due") return false;
  if (status === "active") return true;
  return null;
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

async function ensureMemberProperty(resend: Resend): Promise<void> {
  if (!memberPropertyReady) {
    memberPropertyReady = (async () => {
      const listed = await resend.contactProperties.list({ limit: 100 });
      if (listed.error) {
        throw new Error(listed.error.message);
      }
      const keys = new Set((listed.data?.data ?? []).map((item) => item.key));
      if (keys.has(MEMBER_PROPERTY)) return;
      const created = await resend.contactProperties.create({
        key: MEMBER_PROPERTY,
        type: "string",
      });
      if (!created.error) return;
      const duplicate =
        created.error.statusCode === 409 ||
        /already|exist/i.test(created.error.message);
      if (!duplicate) throw new Error(created.error.message);
    })().catch((err: unknown) => {
      memberPropertyReady = null;
      throw err;
    });
  }
  await memberPropertyReady;
}

function missingContact(error: { name: string; statusCode: number | null; message: string }): boolean {
  return (
    error.name === "not_found" ||
    error.statusCode === 404 ||
    /not found/i.test(error.message)
  );
}

/**
 * Sets the Resend `member` property for one email.
 * Returns false when the call is skipped or Resend reports an error.
 * Never throws: a Resend failure must not fail the Stripe webhook.
 * Missing RESEND_API_KEY or RESEND_AUDIENCE_ID skips the call.
 */
export async function setResendMember(email: string, member: boolean): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.error(
      "Resend member attribute skipped: RESEND_API_KEY or RESEND_AUDIENCE_ID is not set",
    );
    return false;
  }

  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    console.error("Resend member attribute skipped: missing email");
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    try {
      await ensureMemberProperty(resend);
    } catch (err) {
      console.error("Resend member property check failed:", errorText(err));
    }

    const properties = { [MEMBER_PROPERTY]: memberValue(member) };
    const updated = await resend.contacts.update({
      email: normalized,
      audienceId,
      properties,
    });
    if (!updated.error) return true;

    if (missingContact(updated.error)) {
      // A cancellation for someone who was never on the list should stay
      // without the attribute. Only an active member is added.
      if (!member) return true;
      const created = await resend.contacts.create({
        email: normalized,
        audienceId,
        unsubscribed: false,
        properties,
      });
      if (!created.error) return true;
      console.error(
        `Resend member attribute create failed for ${normalized}: ${created.error.message}`,
      );
      return false;
    }

    console.error(
      `Resend member attribute update failed for ${normalized}: ${updated.error.message}`,
    );
    return false;
  } catch (err) {
    console.error(
      `Resend member attribute update failed for ${normalized}: ${errorText(err)}`,
    );
    return false;
  }
}

/**
 * After the membership row is synced, mirror active / ended status onto
 * the Resend contact. Non-membership prices are ignored, same as the
 * database sync. Errors are logged and swallowed.
 */
export async function syncResendMembership(
  stripe: Stripe,
  subscription: Stripe.Subscription,
  eventType: string,
): Promise<void> {
  const member = memberFlagForSubscription(eventType, subscription.status);
  if (member === null) return;

  const priceId = subscription.items.data[0]?.price?.id ?? "";
  if (!tierForPrice(priceId)) return;

  try {
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted || !customer.email) {
      console.error("Resend member attribute skipped: customer has no email");
      return;
    }
    await setResendMember(customer.email, member);
  } catch (err) {
    console.error("Resend member attribute update failed:", errorText(err));
  }
}

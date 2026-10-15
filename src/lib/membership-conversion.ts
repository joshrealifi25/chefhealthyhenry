import Stripe from "stripe";
import { tierForPrice } from "@/lib/membership";

export type MembershipSignupPurchase = {
  transactionId: string;
  value: number;
  currency: string;
};

const CHECKOUT_SESSION_ID = /^cs_(?:test|live)_[A-Za-z0-9]+$/;

/** True for a Stripe Checkout session id, and nothing else. */
export function isCheckoutSessionId(value: string | undefined): value is string {
  return Boolean(value && value.length <= 255 && CHECKOUT_SESSION_ID.test(value));
}

/**
 * The amount Stripe charged for a completed Kitchen or Community checkout.
 * Returns null unless the session is a paid membership in one of
 * kitchen_monthly, kitchen_annual, or community_monthly.
 */
export async function membershipSignupPurchase(
  sessionId: string,
): Promise<MembershipSignupPurchase | null> {
  if (!isCheckoutSessionId(sessionId)) return null;
  const apiKey = process.env.STRIPE_API_KEY;
  if (!apiKey) return null;

  try {
    const stripe = new Stripe(apiKey, { timeout: 8000 });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.mode !== "subscription" || session.status !== "complete") return null;
    if (session.amount_total == null) return null;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 5,
    });
    const isMembership = lineItems.data.some((item) => {
      const tier = tierForPrice(item.price?.id ?? "");
      return tier === "kitchen" || tier === "community";
    });
    if (!isMembership) return null;

    return {
      transactionId: session.id,
      value: session.amount_total / 100,
      currency: (session.currency ?? "usd").toUpperCase(),
    };
  } catch (err) {
    console.error("Membership conversion: could not read checkout session");
    console.error(err instanceof Error ? err.message : err);
    return null;
  }
}

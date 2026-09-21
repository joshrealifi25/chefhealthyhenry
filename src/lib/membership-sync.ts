import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db, users, memberships } from "@/lib/db";
import { tierForPrice } from "@/lib/membership";
import { sendMetaConversionEvent } from "@/lib/ad-tracking";

/**
 * Keeps the memberships table in sync with Stripe subscription events.
 * Never throws: membership sync must not break cookbook order fulfillment
 * running in the same webhook.
 */
export async function syncSubscription(
  stripe: Stripe,
  subscription: Stripe.Subscription,
  options?: { isNew?: boolean }
): Promise<void> {
  try {
    const priceId = subscription.items.data[0]?.price?.id ?? "";
    const tier = tierForPrice(priceId);
    if (!tier) {
      // Not a membership price (or env vars not set); nothing to sync.
      return;
    }

    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted || !customer.email) {
      console.error("Membership sync: customer has no email", customerId);
      return;
    }
    const email = customer.email.toLowerCase();

    // Find or create the user for this email.
    const [existing] = await db()
      .select()
      .from(users)
      .where(eq(users.email, email));
    const user =
      existing ??
      (
        await db()
          .insert(users)
          .values({ email, name: customer.name ?? null })
          .returning()
      )[0];
    if (user.stripeCustomerId !== customerId) {
      await db()
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, user.id));
    }

    // Newer Stripe API versions put current_period_end on the item.
    const periodEndUnix =
      subscription.items.data[0]?.current_period_end ??
      (subscription as unknown as { current_period_end?: number })
        .current_period_end;

    await db()
      .insert(memberships)
      .values({
        userId: user.id,
        tier,
        status: subscription.status,
        stripeSubscriptionId: subscription.id,
        currentPeriodEnd: periodEndUnix ? new Date(periodEndUnix * 1000) : null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: memberships.userId,
        set: {
          tier,
          status: subscription.status,
          stripeSubscriptionId: subscription.id,
          currentPeriodEnd: periodEndUnix
            ? new Date(periodEndUnix * 1000)
            : null,
          updatedAt: new Date(),
        },
      });

    if (options?.isNew) {
      const price = subscription.items.data[0]?.price;
      await sendMetaConversionEvent({
        eventName: "Subscribe",
        email,
        value: price?.unit_amount ? price.unit_amount / 100 : undefined,
        currency: price?.currency?.toUpperCase(),
      });
    }
  } catch (err) {
    console.error("Membership sync failed:", err);
  }
}

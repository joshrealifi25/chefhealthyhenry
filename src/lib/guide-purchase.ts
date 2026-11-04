import Stripe from "stripe";
import { whenNothingSoundsGood } from "@/data/cookbooks";
import { isCheckoutSessionId } from "@/lib/membership-conversion";

export type GuidePurchase = {
  value: number;
  currency: string;
};

/**
 * The amount Stripe charged for a completed When Nothing Sounds Good
 * checkout. Null for any other session, so the thank-you page can still
 * render without firing a purchase event.
 */
export async function wnsgGuidePurchase(sessionId: string): Promise<GuidePurchase | null> {
  if (!isCheckoutSessionId(sessionId)) return null;
  const apiKey = process.env.STRIPE_API_KEY;
  const priceId = process.env.STRIPE_PRICE_WNSG_GUIDE;
  if (!apiKey || !priceId) return null;

  try {
    const stripe = new Stripe(apiKey, { timeout: 8000 });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.product !== whenNothingSoundsGood.slug) return null;
    if (session.mode !== "payment" || session.status !== "complete") return null;
    if (session.payment_status !== "paid" || session.amount_total == null) return null;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 10,
    });
    const boughtGuide = lineItems.data.some((item) => item.price?.id === priceId);
    if (!boughtGuide) return null;

    return {
      value: session.amount_total / 100,
      currency: (session.currency ?? "usd").toUpperCase(),
    };
  } catch (err) {
    console.error("Guide thank-you: could not read checkout session");
    console.error(err instanceof Error ? err.message : err);
    return null;
  }
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { whenNothingSoundsGood } from "@/data/cookbooks";
import { PRICE_TO_PRODUCT } from "@/lib/fulfillment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** $19.00, in cents. Must match the price shown on the cookbook card. */
const WNSG_UNIT_AMOUNT = 1900;

/** Opens Stripe Checkout for the $19 guide. Same payment mode as the other digital books. */
export async function GET(req: NextRequest) {
  const apiKey = process.env.STRIPE_API_KEY;
  const priceId = process.env.STRIPE_PRICE_WNSG_GUIDE;
  if (!apiKey || !priceId) {
    console.error("Guide checkout: STRIPE_API_KEY or STRIPE_PRICE_WNSG_GUIDE is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  if (PRICE_TO_PRODUCT[priceId]) {
    console.error(
      "Guide checkout: STRIPE_PRICE_WNSG_GUIDE is already used by another book"
    );
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }

  const baseUrl =
    process.env.VERCEL_ENV === "production"
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin)
      : req.nextUrl.origin;

  const stripe = new Stripe(apiKey);
  let price: Stripe.Price;
  try {
    price = await stripe.prices.retrieve(priceId);
  } catch (err) {
    console.error("Guide checkout: price could not be loaded");
    console.error(err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }

  if (
    !price.active ||
    price.type !== "one_time" ||
    price.currency !== "usd" ||
    price.unit_amount !== WNSG_UNIT_AMOUNT
  ) {
    console.error(
      `Guide checkout: price must be an active one-time USD price of ${WNSG_UNIT_AMOUNT} cents`
    );
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/guides/when-nothing-sounds-good/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cookbook`,
    allow_promotion_codes: true,
    metadata: { product: whenNothingSoundsGood.slug },
  });

  if (!session.url) {
    console.error("Guide checkout: session has no URL");
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
  const response = NextResponse.redirect(session.url, { status: 303 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

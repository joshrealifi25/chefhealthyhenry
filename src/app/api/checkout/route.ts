import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getMember } from "@/lib/auth";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

const PLAN_TO_PRICE_ENV: Record<string, string | undefined> = {
  kitchen_monthly: process.env.STRIPE_PRICE_KITCHEN_MONTHLY,
  kitchen_annual: process.env.STRIPE_PRICE_KITCHEN_ANNUAL,
  community_monthly: process.env.STRIPE_PRICE_COMMUNITY_MONTHLY,
};

// Use the coupon IDs directly (not promotion code IDs) to avoid the
// first_time_transaction restriction on the promo codes, which blocks
// the discount from applying to customers who have any prior Stripe history.
const FOUNDING_COUPON: Record<string, string> = {
  kitchen_monthly: "GHa8ZBqH",
  kitchen_annual: "GHa8ZBqH",
  community_monthly: "Elcp83dU",
};

/** $20 digital deluxe cookbook, offered as an optional item at membership checkout. */
const DIGITAL_COOKBOOK_PRICE = "price_1URK37LtGtU7n5docwMPGVpx";

async function digitalCookbookAddon(
  stripe: Stripe,
): Promise<Stripe.Checkout.SessionCreateParams.OptionalItem | undefined> {
  try {
    const price = await stripe.prices.retrieve(DIGITAL_COOKBOOK_PRICE);
    if (!price.active) return undefined;
    return { price: DIGITAL_COOKBOOK_PRICE, quantity: 1 };
  } catch (err) {
    console.error("Checkout: digital cookbook add-on is not in this Stripe mode");
    console.error(err instanceof Error ? err.message : err);
    return undefined;
  }
}

/** Redirects to Stripe Checkout for a membership plan. */
export async function GET(req: NextRequest) {
  const apiKey = process.env.STRIPE_API_KEY;
  if (!apiKey) {
    console.error("Checkout: STRIPE_API_KEY not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const plan = req.nextUrl.searchParams.get("plan") ?? "";
  const priceId = PLAN_TO_PRICE_ENV[plan];
  if (!priceId) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const baseUrl =
    process.env.VERCEL_ENV === "production"
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin)
      : req.nextUrl.origin;

  // If the visitor is already signed in, tie checkout to their identity so
  // the subscription lands on the right account immediately.
  const member = await getMember();
  let customerId: string | undefined;
  if (member) {
    const [row] = await db()
      .select({ stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, member.id));
    customerId = row?.stripeCustomerId ?? undefined;
  }

  const stripe = new Stripe(apiKey);
  const couponId = FOUNDING_COUPON[plan];
  const cookbookAddon = await digitalCookbookAddon(stripe);

  const discount: Stripe.Checkout.SessionCreateParams.Discount | undefined = couponId
    ? { coupon: couponId }
    : undefined;

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/members/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/membership`,
    ...(cookbookAddon ? { optional_items: [cookbookAddon] } : {}),
    ...(customerId
      ? { customer: customerId }
      : member
        ? { customer_email: member.email }
        : {}),
  };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      ...params,
      ...(discount ? { discounts: [discount] } : { allow_promotion_codes: true }),
    });
  } catch (err) {
    if (!discount) throw err;
    console.error("Checkout: founding discount rejected, opening checkout without it");
    console.error(err instanceof Error ? err.message : err);
    session = await stripe.checkout.sessions.create({
      ...params,
      allow_promotion_codes: true,
    });
  }

  if (!session.url) {
    console.error("Checkout: session has no URL");
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
  return NextResponse.redirect(session.url, { status: 303 });
}

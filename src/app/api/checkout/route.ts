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
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${baseUrl}/members/welcome`,
    cancel_url: `${baseUrl}/membership`,
    ...(customerId
      ? { customer: customerId }
      : member
        ? { customer_email: member.email }
        : {}),
  });

  if (!session.url) {
    console.error("Checkout: session has no URL");
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
  return NextResponse.redirect(session.url, { status: 303 });
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getMember } from "@/lib/auth";
import { db, users } from "@/lib/db";

export const runtime = "nodejs";

/** Redirects a signed-in member to the Stripe billing portal. */
export async function GET(req: NextRequest) {
  const apiKey = process.env.STRIPE_API_KEY;
  if (!apiKey) {
    console.error("Billing: STRIPE_API_KEY not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const baseUrl =
    process.env.VERCEL_ENV === "production"
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin)
      : req.nextUrl.origin;

  const member = await getMember();
  if (!member) {
    return NextResponse.redirect(`${baseUrl}/members/login`, { status: 303 });
  }

  const [row] = await db()
    .select({ stripeCustomerId: users.stripeCustomerId })
    .from(users)
    .where(eq(users.id, member.id));
  if (!row?.stripeCustomerId) {
    // No Stripe customer yet (e.g. seeded test membership).
    return NextResponse.redirect(`${baseUrl}/members`, { status: 303 });
  }

  const stripe = new Stripe(apiKey);
  const session = await stripe.billingPortal.sessions.create({
    customer: row.stripeCustomerId,
    return_url: `${baseUrl}/members`,
  });
  return NextResponse.redirect(session.url, { status: 303 });
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getMember, loginPath } from "@/lib/auth";
import { db, memberships, users } from "@/lib/db";

export const runtime = "nodejs";

type BillingAction = "portal" | "card" | "cancel";

function billingAction(raw: string | null): BillingAction {
  if (raw === "card" || raw === "cancel") return raw;
  return "portal";
}

function membersUrl(baseUrl: string, query?: string): string {
  return query ? `${baseUrl}/members?${query}` : `${baseUrl}/members`;
}

function flowData(
  action: BillingAction,
  subscriptionId: string | null,
  returnUrl: string
): Stripe.BillingPortal.SessionCreateParams.FlowData | undefined {
  if (action === "card") {
    return {
      type: "payment_method_update",
      after_completion: {
        type: "redirect",
        redirect: { return_url: returnUrl },
      },
    };
  }
  if (action === "cancel" && subscriptionId) {
    return {
      type: "subscription_cancel",
      subscription_cancel: { subscription: subscriptionId },
      after_completion: {
        type: "redirect",
        redirect: { return_url: returnUrl },
      },
    };
  }
  return undefined;
}

/** Redirects a signed-in member to the Stripe billing portal. */
export async function GET(req: NextRequest) {
  const baseUrl =
    process.env.VERCEL_ENV === "production"
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin)
      : req.nextUrl.origin;
  const returnUrl = membersUrl(baseUrl);
  const action = billingAction(req.nextUrl.searchParams.get("action"));

  const member = await getMember();
  if (!member) {
    return NextResponse.redirect(`${baseUrl}${loginPath("/members")}`, {
      status: 303,
    });
  }

  const apiKey = process.env.STRIPE_API_KEY;
  if (!apiKey) {
    console.error("Billing: STRIPE_API_KEY not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const [row] = await db()
    .select({
      stripeCustomerId: users.stripeCustomerId,
      stripeSubscriptionId: memberships.stripeSubscriptionId,
    })
    .from(users)
    .leftJoin(memberships, eq(memberships.userId, users.id))
    .where(eq(users.id, member.id));

  if (!row?.stripeCustomerId) {
    // No Stripe customer yet (e.g. seeded test membership).
    return NextResponse.redirect(membersUrl(baseUrl, "billing=unavailable"), {
      status: 303,
    });
  }

  const stripe = new Stripe(apiKey);
  const params: Stripe.BillingPortal.SessionCreateParams = {
    customer: row.stripeCustomerId,
    return_url: returnUrl,
  };
  const flow = flowData(action, row.stripeSubscriptionId, returnUrl);
  if (flow) params.flow_data = flow;

  try {
    const session = await stripe.billingPortal.sessions.create(params);
    if (!session.url) {
      console.error("Billing: portal session has no URL");
      return NextResponse.redirect(membersUrl(baseUrl, "billing=unavailable"), {
        status: 303,
      });
    }
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (err) {
    // Portal configuration in Stripe may not allow this deep link yet.
    // Fall back to the default portal rather than stranding the member.
    console.error("Billing portal flow failed, using default portal:", err);
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: row.stripeCustomerId,
        return_url: returnUrl,
      });
      if (!session.url) {
        console.error("Billing: fallback portal session has no URL");
        return NextResponse.redirect(membersUrl(baseUrl, "billing=unavailable"), {
          status: 303,
        });
      }
      return NextResponse.redirect(session.url, { status: 303 });
    } catch (fallbackErr) {
      console.error("Billing portal unavailable:", fallbackErr);
      return NextResponse.redirect(membersUrl(baseUrl, "billing=unavailable"), {
        status: 303,
      });
    }
  }
}

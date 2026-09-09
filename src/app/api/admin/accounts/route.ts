import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getAdmin, isAdminEmail } from "@/lib/admin";
import { db, users, memberships, TIERS, type Tier } from "@/lib/db";

export const runtime = "nodejs";

function isTier(value: unknown): value is Tier {
  return typeof value === "string" && (TIERS as readonly string[]).includes(value);
}

function normaliseEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : null;
}

/**
 * Whether Stripe is still billing this customer. The danger in deleting an
 * account is not the row: it is that the subscription keeps charging while
 * the member loses everything, and the next webhook recreates the user from
 * scratch. Unreachable Stripe returns "unknown" so the caller can refuse
 * rather than guess.
 */
async function stripeSubscriptionState(
  customerId: string | null
): Promise<"none" | "active" | "unknown"> {
  if (!customerId) return "none";
  const apiKey = process.env.STRIPE_API_KEY;
  if (!apiKey) return "unknown";
  try {
    const stripe = new Stripe(apiKey);
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 100,
    });
    const live = subs.data.some((s) =>
      ["active", "trialing", "past_due", "unpaid", "incomplete"].includes(s.status)
    );
    return live ? "active" : "none";
  } catch (err) {
    console.error("Admin: could not read Stripe subscriptions", err);
    return "unknown";
  }
}

/** Creates a member, or comps an existing one onto a tier. */
export async function POST(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const email = normaliseEmail(body?.email);
  if (!email) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const tier = body?.tier;
  if (tier != null && !isTier(tier)) {
    return NextResponse.json({ error: "Unknown membership tier." }, { status: 400 });
  }
  const name = typeof body?.name === "string" && body.name.trim() ? body.name.trim() : null;

  const [existing] = await db().select().from(users).where(eq(users.email, email));
  const user =
    existing ??
    (await db().insert(users).values({ email, name }).returning())[0];

  if (!existing && name == null) {
    // Nothing more to set; the row was just created with a null name.
  } else if (existing && name && existing.name !== name) {
    await db().update(users).set({ name }).where(eq(users.id, user.id));
  }

  if (tier) {
    // A comp is a membership with no Stripe subscription behind it. If this
    // person later subscribes for real, the webhook overwrites this row with
    // the Stripe record, so the two cannot drift apart.
    await db()
      .insert(memberships)
      .values({
        userId: user.id,
        tier,
        status: "active",
        stripeSubscriptionId: null,
        currentPeriodEnd: null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: memberships.userId,
        set: { tier, status: "active", updatedAt: new Date() },
      });
  }

  return NextResponse.json({
    ok: true,
    created: !existing,
    userId: user.id,
    email,
  });
}

/** Changes or removes a member's comped tier. */
export async function PATCH(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const userId = typeof body?.userId === "string" ? body.userId : null;
  if (!userId) {
    return NextResponse.json({ error: "Missing account." }, { status: 400 });
  }

  const [row] = await db()
    .select({ id: users.id, email: users.email, subId: memberships.stripeSubscriptionId })
    .from(users)
    .leftJoin(memberships, eq(memberships.userId, users.id))
    .where(eq(users.id, userId));
  if (!row) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }
  if (row.subId) {
    return NextResponse.json(
      {
        error:
          "This membership is paid through Stripe. Change or cancel it in Stripe so the two stay in step.",
      },
      { status: 409 }
    );
  }

  if (body?.tier === null) {
    await db().delete(memberships).where(eq(memberships.userId, userId));
    return NextResponse.json({ ok: true, tier: null });
  }
  if (!isTier(body?.tier)) {
    return NextResponse.json({ error: "Unknown membership tier." }, { status: 400 });
  }
  await db()
    .insert(memberships)
    .values({
      userId,
      tier: body.tier,
      status: "active",
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: memberships.userId,
      set: { tier: body.tier, status: "active", updatedAt: new Date() },
    });
  return NextResponse.json({ ok: true, tier: body.tier });
}

/**
 * Deletes an account and everything that cascades from it: sessions, saved
 * lists, Sous history, build credits. Refused while Stripe still has a live
 * subscription, and refused for an admin, who would lock themselves out.
 */
export async function DELETE(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const userId = typeof body?.userId === "string" ? body.userId : null;
  const confirm = normaliseEmail(body?.confirmEmail);
  if (!userId || !confirm) {
    return NextResponse.json({ error: "Missing account or confirmation." }, { status: 400 });
  }

  const [row] = await db()
    .select({
      id: users.id,
      email: users.email,
      customerId: users.stripeCustomerId,
      subId: memberships.stripeSubscriptionId,
    })
    .from(users)
    .leftJoin(memberships, eq(memberships.userId, users.id))
    .where(eq(users.id, userId));
  if (!row) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }
  if (row.email !== confirm) {
    return NextResponse.json(
      { error: "The email you typed does not match this account." },
      { status: 400 }
    );
  }
  if (row.id === admin.id || isAdminEmail(row.email)) {
    return NextResponse.json(
      { error: "You cannot delete an admin account from here." },
      { status: 409 }
    );
  }

  const state = await stripeSubscriptionState(row.customerId);
  if (state === "active" || row.subId) {
    return NextResponse.json(
      {
        error:
          "Stripe is still billing this customer. Cancel the subscription in Stripe first, otherwise they keep paying and the account comes back on the next Stripe update.",
      },
      { status: 409 }
    );
  }
  if (state === "unknown") {
    return NextResponse.json(
      {
        error:
          "Could not reach Stripe to check for a live subscription, so the account was left alone. Try again shortly.",
      },
      { status: 503 }
    );
  }

  await db().delete(users).where(eq(users.id, userId));
  console.log(`Admin ${admin.email} deleted account ${row.email}`);
  return NextResponse.json({ ok: true, deleted: row.email });
}

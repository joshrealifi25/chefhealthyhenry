import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";
import { getAdmin, isAdminEmail } from "@/lib/admin";
import { db, users, memberships, savedLists, sousMessages } from "@/lib/db";
import { AdminAccounts, type AccountRow } from "@/components/admin-accounts";

export const metadata: Metadata = {
  title: "Accounts",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getAdmin();
  // A 404 rather than a redirect: someone without access should not learn
  // that this page exists.
  if (!admin) notFound();

  const rows = await db()
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      stripeCustomerId: users.stripeCustomerId,
      tier: memberships.tier,
      status: memberships.status,
      stripeSubscriptionId: memberships.stripeSubscriptionId,
      currentPeriodEnd: memberships.currentPeriodEnd,
      listCount: sql<number>`(select count(*)::int from ${savedLists} where ${savedLists.userId} = ${users.id})`,
      sousCount: sql<number>`(select count(*)::int from ${sousMessages} where ${sousMessages.userId} = ${users.id})`,
    })
    .from(users)
    .leftJoin(memberships, eq(memberships.userId, users.id))
    .orderBy(desc(users.createdAt));

  const accounts: AccountRow[] = rows.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    joined: r.createdAt.toISOString(),
    tier: r.tier ?? null,
    status: r.status ?? null,
    paidThroughStripe: r.stripeSubscriptionId != null,
    hasStripeCustomer: r.stripeCustomerId != null,
    periodEnd: r.currentPeriodEnd ? r.currentPeriodEnd.toISOString() : null,
    listCount: r.listCount,
    sousCount: r.sousCount,
    isAdmin: isAdminEmail(r.email),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        Accounts
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Everyone with a Chef Healthy Henry account, newest first. Memberships
        paid through Stripe are managed in Stripe. Comped memberships are
        managed here.
      </p>

      <AdminAccounts accounts={accounts} />
    </div>
  );
}

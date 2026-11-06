#!/usr/bin/env -S npx tsx
/**
 * One-time backfill: set the Resend contact property member to "true"
 * for every account with an active membership.
 *
 * memberships.status stores the Stripe subscription status
 * (active, trialing, past_due, canceled, and the rest). Comped accounts
 * are also stored as active. This run selects status = "active" only.
 * past_due and canceled are left unchanged, matching the webhook, which
 * sets member to "false" for those.
 *
 * Do not run this until the webhook deploy is live. Then, from the repo
 * root, with DATABASE_URL, RESEND_API_KEY, and RESEND_AUDIENCE_ID set:
 *
 *   npx tsx scripts/backfill-resend-members.ts
 *
 * Chef Henry creates the Resend segments after this succeeds.
 */

import { eq } from "drizzle-orm";
import { db, memberships, users } from "../src/lib/db";
import { setResendMember } from "../src/lib/resend-member";

function requireEnv(name: "DATABASE_URL" | "RESEND_API_KEY" | "RESEND_AUDIENCE_ID"): void {
  if (!process.env[name]) {
    console.error(`Resend member backfill: ${name} is not set`);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  requireEnv("DATABASE_URL");
  requireEnv("RESEND_API_KEY");
  requireEnv("RESEND_AUDIENCE_ID");

  const rows = await db()
    .select({ email: users.email })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .where(eq(memberships.status, "active"));

  let success = 0;
  let failure = 0;
  for (const row of rows) {
    const ok = await setResendMember(row.email, true);
    if (ok) success += 1;
    else failure += 1;
  }

  console.log(
    `Resend member backfill: ${success} succeeded, ${failure} failed, ${rows.length} active memberships.`,
  );
  if (failure > 0) process.exitCode = 1;
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

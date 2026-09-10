import { and, count, eq } from "drizzle-orm";
import { db, comboBuilds, memberships, type Tier } from "@/lib/db";
import type { ComboCredits } from "@/lib/combo-build";

export type { ComboCredits } from "@/lib/combo-build";

/** Custom grocery-list builds per billing period. Infinity = unlimited. */
export const CUSTOM_BUILD_LIMIT: Record<Tier, number> = {
  kitchen: 2,
  community: Infinity,
  chefs_table: Infinity,
};

export function formatPeriodEnd(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Last moment of the current UTC month. Used only when Stripe has no period end. */
function calendarMonthEnd(now = new Date()): Date {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)
  );
}

export async function getComboCredits(
  userId: string,
  tier: Tier
): Promise<ComboCredits> {
  const limit = CUSTOM_BUILD_LIMIT[tier] ?? 2;
  const unlimited = !Number.isFinite(limit);

  const [membership] = await db()
    .select({ currentPeriodEnd: memberships.currentPeriodEnd })
    .from(memberships)
    .where(eq(memberships.userId, userId));

  const periodDate = membership?.currentPeriodEnd ?? calendarMonthEnd();
  const periodEnd = periodDate.toISOString();
  const periodEndLabel = formatPeriodEnd(periodDate);

  if (unlimited) {
    return {
      limit: 0,
      used: 0,
      remaining: 0,
      unlimited: true,
      periodEnd,
      periodEndLabel,
    };
  }

  const [{ used }] = await db()
    .select({ used: count() })
    .from(comboBuilds)
    .where(
      and(eq(comboBuilds.userId, userId), eq(comboBuilds.periodEnd, periodDate))
    );

  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    unlimited: false,
    periodEnd,
    periodEndLabel,
  };
}

export async function recordCustomBuild(
  userId: string,
  periodEnd: Date
): Promise<void> {
  await db().insert(comboBuilds).values({ userId, periodEnd });
}

export function periodEndDate(credits: ComboCredits): Date {
  return credits.periodEnd
    ? new Date(credits.periodEnd)
    : calendarMonthEnd();
}

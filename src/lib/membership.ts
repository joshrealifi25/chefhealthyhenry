import type { Tier } from "@/lib/db";

/** Display names for each tier, per the membership plan. */
export const TIER_NAMES: Record<Tier, string> = {
  kitchen: "Protein Flip™ Kitchen",
  community: "Protein Flip™ Community",
  chefs_table: "Chef's Table",
};

/**
 * Maps Stripe subscription Price IDs to tiers. The price IDs are created in
 * the Stripe dashboard and supplied via environment variables so test and
 * live mode can differ without a code change.
 */
export function tierForPrice(priceId: string): Tier | null {
  if (!priceId) return null;
  if (
    priceId === process.env.STRIPE_PRICE_KITCHEN_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_KITCHEN_ANNUAL
  ) {
    return "kitchen";
  }
  if (priceId === process.env.STRIPE_PRICE_COMMUNITY_MONTHLY) {
    return "community";
  }
  if (priceId === process.env.STRIPE_PRICE_CHEFS_TABLE_MONTHLY) {
    return "chefs_table";
  }
  return null;
}

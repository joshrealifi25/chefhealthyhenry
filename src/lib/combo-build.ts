export interface ComboCredits {
  limit: number;
  used: number;
  remaining: number;
  unlimited: boolean;
  /** ISO timestamp of the current billing period end, when known. */
  periodEnd: string | null;
  /** Human date for the credit-reset copy, e.g. "September 15, 2026". */
  periodEndLabel: string | null;
}

export function customBuildsRemainingNote(credits: ComboCredits): string {
  return `${credits.remaining} of ${credits.limit} custom builds remaining this month. Upgrade for unlimited builds and edits.`;
}

export function customBuildsUsedUpNote(credits: ComboCredits): string {
  return `You have used your ${credits.limit} custom builds for this month. Upgrade to Community for unlimited builds and edits.`;
}

export function isAtCustomBuildLimit(credits?: ComboCredits): boolean {
  return Boolean(credits && !credits.unlimited && credits.remaining <= 0);
}

function sameSelection(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const left = [...a].map((v) => v.toLowerCase()).sort();
  const right = [...b].map((v) => v.toLowerCase()).sort();
  return left.every((v, i) => v === right[i]);
}

/**
 * A credit is spent on a new custom list, or on updating a saved list after
 * the ingredients or recipes change. Name-only and cart-only updates are free.
 * Generating from a Chef Henry preset is also free.
 */
export function consumesCustomBuild(args: {
  isNew: boolean;
  fromPreset: boolean;
  previous: { ingredients: string[]; recipeSlugs: string[] } | null;
  next: { ingredients: string[]; recipeSlugs: string[] };
}): boolean {
  if (args.fromPreset) return false;
  if (args.isNew) return true;
  if (!args.previous) return true;
  return (
    !sameSelection(args.previous.ingredients, args.next.ingredients) ||
    !sameSelection(args.previous.recipeSlugs, args.next.recipeSlugs)
  );
}

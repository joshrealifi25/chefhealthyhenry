import featuredData from "@/data/featured-ingredients.json";
import type { ContentBlock } from "@/lib/content-blocks";
import type { Tier } from "@/lib/db";

export interface FeaturedIngredient {
  slug: string;
  ingredient: string;
  /** ISO date, used for sort and current lookup. */
  date: string;
  /** One-line tease for the dashboard card. */
  blurb: string;
  /** Public recipe that introduced this ingredient, when there is one. */
  recipeSlug?: string;
  /** Exclusive member content. */
  blocks: ContentBlock[];
  /** Optional YouTube embed (unlisted). */
  videoId?: string | null;
}

export const featuredIngredients = [
  ...(featuredData as FeaturedIngredient[]),
].sort((a, b) => b.date.localeCompare(a.date));

export function currentFeaturedIngredient(): FeaturedIngredient | undefined {
  return featuredIngredients[0];
}

export function getFeaturedIngredient(
  slug: string
): FeaturedIngredient | undefined {
  return featuredIngredients.find((f) => f.slug === slug);
}

export function canSeeFeatured(tier: Tier | null): boolean {
  return tier === "community" || tier === "chefs_table";
}

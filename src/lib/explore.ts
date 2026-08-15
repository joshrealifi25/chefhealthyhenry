import exploreData from "@/data/explore.json";
import { recipes, recipesByIngredient, ingredientFromSlug, type Recipe } from "@/lib/recipes";
import type { ContentBlock } from "@/lib/content-blocks";

export interface ProductLink {
  name: string;
  url: string;
}

/** Closing call-to-action shown at the end of a long-form article page. */
export interface ExploreCta {
  heading: string;
  text: string;
  label: string;
  href: string;
}

export interface ExploreCard {
  slug: string;
  title: string;
  /** One or more of EXPLORE_COLLECTIONS; a card can belong to more than one. */
  collections: string[];
  blurb: string;
  /** Publish date, used to sort /explore newest-first. */
  date: string;
  /** Optional cover image shown on the teaser card and the article page. */
  hero?: string | null;
  videoId: string | null;
  /**
   * Manual curated list of recipe slugs. Leave empty to auto-derive: recipes
   * are pulled in automatically when their keyIngredients includes a tag
   * matching this card's slug (same slug convention as
   * /recipes/ingredient/[tag]). Set this only to override that default.
   */
  recipeSlugs: string[];
  productLinks: ProductLink[];
  relatedPostSlug: string | null;
  /** Optional italic tagline shown under the title on the article page. */
  subtitle?: string;
  /**
   * Optional full article body. When present, the card gets a "Read the
   * full guide" link to /explore/article/[slug], a dedicated detail page
   * generated for it, and it becomes eligible for that page's sitemap entry.
   * Cards without blocks stay teaser-only, same as before this field existed.
   */
  blocks?: ContentBlock[];
  /** Optional closing CTA rendered at the end of the article page. */
  cta?: ExploreCta;
}

export const exploreCards = [...(exploreData as ExploreCard[])].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export function getExploreCard(slug: string): ExploreCard | undefined {
  return exploreCards.find((c) => c.slug === slug);
}

/** True when this card has a full article body and should get its own
 * /explore/article/[slug] detail page. */
export function hasArticle(card: ExploreCard): boolean {
  return Boolean(card.blocks && card.blocks.length > 0);
}

/** The six fixed Explore collections. Not derived from content, since the
 * section must render (with empty states) before any cards exist. */
export const EXPLORE_COLLECTIONS: { name: string; slug: string }[] = [
  { name: "Ingredient Adventures", slug: "ingredient-adventures" },
  { name: "Flavor Builders", slug: "flavor-builders" },
  { name: "Kitchen Skills", slug: "kitchen-skills" },
  { name: "Protein Flip™ Foundations", slug: "protein-flip-foundations" },
  { name: "Seasonal Kitchen", slug: "seasonal-kitchen" },
  { name: "Grocery Intelligence", slug: "grocery-intelligence" },
];

export function collectionFromSlug(slug: string): string | undefined {
  return EXPLORE_COLLECTIONS.find((c) => c.slug === slug)?.name;
}

export function collectionSlug(name: string): string | undefined {
  return EXPLORE_COLLECTIONS.find((c) => c.name === name)?.slug;
}

export function exploreCardsByCollection(collection: string): ExploreCard[] {
  return exploreCards.filter((c) => c.collections.includes(collection));
}

/** Recipes to surface on a card: the manual recipeSlugs list if set,
 * otherwise recipes tagged with the ingredient matching this card's slug. */
export function recipesForCard(card: ExploreCard, count = 6): Recipe[] {
  if (card.recipeSlugs.length > 0) {
    return card.recipeSlugs
      .map((slug) => recipes.find((r) => r.slug === slug))
      .filter((r): r is Recipe => Boolean(r))
      .slice(0, count);
  }
  const tag = ingredientFromSlug(card.slug);
  if (!tag) return [];
  return recipesByIngredient(tag).slice(0, count);
}

/** True when this card has an auto-derived ingredient tag with recipes to
 * link a "see all" into /recipes/ingredient/[tag]. */
export function ingredientTagForCard(card: ExploreCard): string | undefined {
  if (card.recipeSlugs.length > 0) return undefined;
  return ingredientFromSlug(card.slug);
}

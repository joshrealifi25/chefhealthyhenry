import recipesData from "@/data/recipes.json";

export interface DirectionStep {
  title: string | null;
  text: string;
}

export interface ExtraSection {
  title: string;
  items: string[];
}

/**
 * Per-serving nutrition. Optional because it is filled in per recipe as
 * verified numbers become available: an absent value is left out of the
 * structured data rather than guessed, since search engines and readers both
 * treat these as factual claims.
 */
export interface Nutrition {
  /** Kilocalories per serving. */
  calories?: number;
  proteinGrams?: number;
  fiberGrams?: number;
  carbGrams?: number;
  fatGrams?: number;
  saturatedFatGrams?: number;
  sugarGrams?: number;
  sodiumMilligrams?: number;
  /** Free text, e.g. "1 bowl" or "2 tostadas". */
  servingSize?: string;
}

export interface Recipe {
  slug: string;
  title: string;
  image: string | null;
  description: string;
  serves: string | null;
  prepTime: string | null;
  totalTime: string | null;
  ingredients: string[];
  directions: DirectionStep[];
  extras: ExtraSection[];
  category: string;
  proteinFlip: boolean;
  /** e.g. "vegetarian", "vegan", "gluten-free", "dairy-free", "high-protein",
   * "high-fiber". */
  dietaryTags?: string[];
  youtubeId: string | null;
  keyIngredients?: string[];
  /** Per-serving nutrition, when known. Drives the Nutrition Facts panel and
   * the nutrition block in the recipe's structured data. */
  nutrition?: Nutrition;
  /** ISO date (YYYY-MM-DD) this recipe was published, when known. */
  datePublished?: string;
  /** Overrides for the <title>/meta description search engines see, when
   * they need to differ from the on-page title/description (e.g. a CTR
   * fix). Falls back to title/description when unset. */
  seoTitle?: string;
  seoDescription?: string;
}

// recipes.json has no explicit date field; new recipes are always appended
// to the end of the file, so array order already tracks when each recipe
// was added. Reverse it so the newest recipe shows first everywhere.
export const recipes = [...(recipesData as Recipe[])].reverse();

/** The six supported dietaryTags values, with their display labels. Shared
 * by the /recipes filter bar and the Grocery Combo Builder so both stay in
 * sync with what tag-recipes.ts actually writes. `badge` is the small label
 * the Combo Builder shows on a suggestion pill to mark it as a non-
 * ingredient filter; the /recipes filter bar ignores it. */
export const DIETARY_TAGS: { value: string; label: string; badge: string }[] = [
  { value: "vegetarian", label: "Vegetarian", badge: "Diet" },
  { value: "vegan", label: "Vegan", badge: "Diet" },
  { value: "gluten-free", label: "Gluten-Free", badge: "Diet" },
  { value: "dairy-free", label: "Dairy-Free", badge: "Diet" },
  { value: "high-protein", label: "High-Protein", badge: "Diet" },
  { value: "high-fiber", label: "High-Fiber", badge: "Diet" },
];

/** Recipe slug to its dietaryTags, for components that only carry a lite
 * recipe shape (e.g. the Combo Builder) and need to look tags up by slug. */
export const dietaryTagsBySlug: Record<string, string[]> = Object.fromEntries(
  recipes.map((r) => [r.slug, r.dietaryTags ?? []])
);

export const categories = [
  "All",
  ...Array.from(new Set(recipes.map((r) => r.category))).sort(),
];

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function relatedRecipes(recipe: Recipe, count = 3): Recipe[] {
  return recipes
    .filter((r) => r.slug !== recipe.slug && r.category === recipe.category)
    .slice(0, count);
}

function slugifyIngredient(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** All distinct keyIngredients tags in use, with their slug and recipe count, most-used first. */
export const ingredientTags: { name: string; slug: string; count: number }[] =
  (() => {
    const counts = new Map<string, number>();
    recipes.forEach((r) =>
      (r.keyIngredients ?? []).forEach((tag) =>
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      )
    );
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, slug: slugifyIngredient(name), count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  })();

export function ingredientFromSlug(slug: string): string | undefined {
  return ingredientTags.find((t) => t.slug === slug)?.name;
}

export function recipesByIngredient(tag: string): Recipe[] {
  return recipes.filter((r) => (r.keyIngredients ?? []).includes(tag));
}

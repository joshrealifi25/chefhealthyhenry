import recipesData from "@/data/recipes.json";

export interface DirectionStep {
  title: string | null;
  text: string;
}

export interface ExtraSection {
  title: string;
  items: string[];
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
  youtubeId: string | null;
  keyIngredients?: string[];
}

export const recipes = recipesData as Recipe[];

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

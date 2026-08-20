import data from "@/data/ingredients.json";
import { recipes, type Recipe } from "@/lib/recipes";

/**
 * Canonical shopping-ingredient tags, reviewed by Chef Henry. Powers the free
 * Explore grocery combo pages and the Tier 1 combo builder.
 *
 * Pantry staples are excluded from the vocabulary on purpose: they match
 * nearly every recipe, so including them would make combo matching useless.
 */

export interface IngredientTag {
  name: string;
  slug: string;
  recipeCount: number;
}

interface IngredientsFile {
  ingredients: IngredientTag[];
  recipeTags: Record<string, string[]>;
}

const file = data as unknown as IngredientsFile;

/** Every canonical shopping ingredient, most-used first. */
export const ingredientTags: IngredientTag[] = file.ingredients;

/** Recipe slug to its canonical shopping-ingredient names. */
export const recipeTags: Record<string, string[]> = file.recipeTags;

const bySlug = new Map(ingredientTags.map((i) => [i.slug, i]));
const byName = new Map(ingredientTags.map((i) => [i.name, i]));

export function ingredientBySlug(slug: string): IngredientTag | undefined {
  return bySlug.get(slug);
}

export function ingredientByName(name: string): IngredientTag | undefined {
  return byName.get(name);
}

/** Ingredients worth offering in the builder: used by more than one recipe. */
export const selectableIngredients: IngredientTag[] = ingredientTags.filter(
  (i) => i.recipeCount >= 2
);

/** Recipes whose tags include every one of the given ingredient names. */
export function recipesWithAll(names: string[]): Recipe[] {
  if (names.length === 0) return [];
  return recipes.filter((r) => {
    const tags = recipeTags[r.slug];
    return Boolean(tags) && names.every((n) => tags.includes(n));
  });
}

/**
 * Ingredients that still co-occur with everything already chosen, so the
 * builder can only ever offer a next pick that yields at least one recipe.
 * This is what makes a zero-result combo structurally impossible.
 */
export function coOccurring(selected: string[]): IngredientTag[] {
  const pool =
    selected.length === 0
      ? recipes.filter((r) => recipeTags[r.slug]?.length)
      : recipesWithAll(selected);
  const counts = new Map<string, number>();
  for (const r of pool) {
    for (const tag of recipeTags[r.slug] ?? []) {
      if (selected.includes(tag)) continue;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => {
      const tag = byName.get(name);
      return tag ? { ...tag, recipeCount: count } : null;
    })
    .filter((t): t is IngredientTag => t !== null)
    .sort((a, b) => b.recipeCount - a.recipeCount || a.name.localeCompare(b.name));
}

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

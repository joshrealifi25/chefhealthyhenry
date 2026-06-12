import type { Metadata } from "next";
import { recipes, categories } from "@/lib/recipes";
import { RecipesGrid } from "@/components/recipes-grid";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Nutrition-smart recipes built on the Protein Flip™ method: seafood, salads, soups, plant-forward bowls, and more. Most ready in under 30 minutes.",
};

export default function RecipesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Recipes
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every recipe is built on the Protein Flip™ method: protein leads,
          flavor stays, and you leave the table full and satisfied.
        </p>
      </div>
      <div className="mt-12">
        <RecipesGrid recipes={recipes} categories={categories} />
      </div>
    </div>
  );
}

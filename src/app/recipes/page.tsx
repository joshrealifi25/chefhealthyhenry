import type { Metadata } from "next";
import Link from "next/link";
import { recipes, categories } from "@/lib/recipes";
import { RecipesGrid } from "@/components/recipes-grid";

export const metadata: Metadata = {
  title: "Healthy Recipes",
  description:
    "Browse all recipes from Chef Healthy Henry: protein-forward, flavor-first dishes for real home cooking, from quick weeknight dinners to make-ahead meals.",
};

export default function RecipesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Recipes
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Many of these recipes follow the Protein Flip™ method: protein leads,
          flavor stays, and you leave the table full and satisfied.
        </p>
        <p className="mt-3 text-sm">
          <Link href="/saved" className="text-primary hover:underline">
            Saved recipes
          </Link>
        </p>
      </div>
      <div className="mt-12">
        <RecipesGrid recipes={recipes} categories={categories} />
      </div>
    </div>
  );
}

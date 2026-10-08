import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { getMember, loginPath } from "@/lib/auth";
import { db, savedRecipes } from "@/lib/db";
import { getRecipe, type Recipe } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipe-card";

export const metadata: Metadata = {
  title: "Saved",
  description: "Recipes you saved from Chef Healthy Henry to cook again.",
};

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const member = await getMember();
  if (!member) redirect(loginPath("/saved"));

  let unavailable = false;
  let recipes: Recipe[] = [];
  try {
    const rows = await db()
      .select({ recipeSlug: savedRecipes.recipeSlug })
      .from(savedRecipes)
      .where(eq(savedRecipes.userId, member.id))
      .orderBy(desc(savedRecipes.createdAt));
    recipes = rows.flatMap((row) => {
      const recipe = getRecipe(row.recipeSlug);
      return recipe ? [recipe] : [];
    });
  } catch (err) {
    console.error("Saved recipes: could not load list", err);
    unavailable = true;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        Saved recipes
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Recipes you tapped Save on, kept with your account so you can find
        them on any device.
      </p>

      {unavailable ? (
        <p className="mt-10 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Saved recipes are not available right now. Try again in a few
          minutes.
        </p>
      ) : recipes.length === 0 ? (
        <div className="mt-10">
          <p className="text-muted-foreground">
            You have not saved a recipe yet.
          </p>
          <Link
            href="/recipes"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse recipes
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

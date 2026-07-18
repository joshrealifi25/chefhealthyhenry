import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ingredientTags, ingredientFromSlug, recipesByIngredient } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipe-card";

export function generateStaticParams() {
  return ingredientTags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const name = ingredientFromSlug(tag);
  if (!name) return {};
  return {
    title: `${name} recipes`,
    description: `Chef Healthy Henry recipes built around ${name}.`,
  };
}

export default async function IngredientPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const name = ingredientFromSlug(tag);
  if (!name) notFound();

  const ingredientRecipes = recipesByIngredient(name);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          <Link href="/recipes" className="hover:underline">
            Recipes
          </Link>{" "}
          / {name}
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold capitalize tracking-tight sm:text-5xl">
          {name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {ingredientRecipes.length} recipe
          {ingredientRecipes.length === 1 ? "" : "s"} built around {name}.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ingredientRecipes.map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        <Link href="/recipes" className="text-primary hover:underline">
          Browse all recipes
        </Link>
      </p>
    </div>
  );
}

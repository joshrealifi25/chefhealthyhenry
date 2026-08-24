import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/auth";
import { recipes, dietaryTagsBySlug } from "@/lib/recipes";
import {
  selectableIngredients,
  ingredientFamilies,
  recipeTags,
  recipeLines,
} from "@/lib/ingredients";
import { ComboBuilder } from "@/components/combo-builder";
import { db, savedLists } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Grocery Combo Builder",
  description:
    "Pick the ingredients you want to shop for once, and see every Chef Healthy Henry recipe that shares them, with one combined grocery list.",
};

export const dynamic = "force-dynamic";

export default async function CombosPage({
  searchParams,
}: {
  searchParams: Promise<{ list?: string }>;
}) {
  const member = await getMember();
  if (!member) redirect("/members/login");
  if (!member.tier) redirect("/membership");

  const saved = await db()
    .select()
    .from(savedLists)
    .where(eq(savedLists.userId, member.id))
    .orderBy(desc(savedLists.updatedAt));

  const { list: listParam } = await searchParams;

  const lite = recipes
    .filter((r) => (recipeTags[r.slug] ?? []).length > 0)
    .map((r) => ({ slug: r.slug, title: r.title }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Grocery Combo Builder
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Choosing recipes that share ingredients shrinks the grocery bill and
        cuts waste. Pick what you want to buy once, and see every recipe that
        uses it, with one combined list.
      </p>

      <div className="mt-10">
        <ComboBuilder
          all={selectableIngredients}
          families={ingredientFamilies}
          tags={recipeTags}
          lines={recipeLines}
          dietaryTags={dietaryTagsBySlug}
          recipes={lite}
          saved={saved.map((l) => ({
            id: l.id,
            name: l.name,
            ingredients: l.ingredients,
            recipeSlugs: l.recipeSlugs,
            inCart: l.inCart,
          }))}
          openListId={listParam ?? null}
        />
      </div>
    </div>
  );
}

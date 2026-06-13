"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipe-card";

export function RecipesGrid({
  recipes,
  categories,
}: {
  recipes: Recipe[];
  categories: string[];
}) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [proteinFlipOnly, setProteinFlipOnly] = useState(false);

  const filtered = recipes.filter((r) => {
    const matchesCategory = category === "All" || r.category === category;
    const matchesQuery =
      query === "" || r.title.toLowerCase().includes(query.toLowerCase());
    const matchesFlip = !proteinFlipOnly || r.proteinFlip;
    return matchesCategory && matchesQuery && matchesFlip;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              )}
            >
              {c}
            </button>
          ))}
          <button
            onClick={() => setProteinFlipOnly((v) => !v)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors whitespace-nowrap",
              proteinFlipOnly
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            )}
          >
            Protein Flip™
          </button>
        </div>
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes…"
            className="w-full rounded-full border border-input bg-card py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No recipes match your search. Try a different ingredient or category.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}

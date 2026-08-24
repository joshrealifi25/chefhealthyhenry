"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIETARY_TAGS, type Recipe } from "@/lib/recipes";
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
  /** Multiple dietary pills can be active at once; a recipe must match all
   * of them (AND logic), same as the Grocery Combo Builder's filters. */
  const [activeDietTags, setActiveDietTags] = useState<string[]>([]);

  function toggleDietTag(tag: string) {
    setActiveDietTags((tags) =>
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
    );
  }

  const filtered = recipes.filter((r) => {
    const matchesCategory = category === "All" || r.category === category;
    const matchesQuery =
      query === "" || r.title.toLowerCase().includes(query.toLowerCase());
    const matchesFlip = !proteinFlipOnly || r.proteinFlip;
    const matchesDiet = activeDietTags.every((tag) =>
      (r.dietaryTags ?? []).includes(tag)
    );
    return matchesCategory && matchesQuery && matchesFlip && matchesDiet;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
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
            aria-pressed={proteinFlipOnly}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors whitespace-nowrap",
              proteinFlipOnly
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            )}
          >
            Protein Flip™
          </button>
          {DIETARY_TAGS.map((t) => (
            <button
              key={t.value}
              onClick={() => toggleDietTag(t.value)}
              aria-pressed={activeDietTags.includes(t.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors whitespace-nowrap",
                activeDietTags.includes(t.value)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <label htmlFor="recipe-search" className="sr-only">
            Search recipes
          </label>
          <input
            id="recipe-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes…"
            className="w-full rounded-full border border-input bg-card py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {filtered.length} recipes shown
      </p>

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

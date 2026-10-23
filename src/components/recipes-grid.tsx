"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIETARY_TAGS, type Recipe } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipe-card";

const FILTERS_KEY = "chh-recipe-filters";

type RecipeFilters = {
  category: string;
  query: string;
  proteinFlipOnly: boolean;
  /** Multiple dietary pills can be active at once; a recipe must match all
   * of them (AND logic), same as the Grocery Combo Builder's filters. */
  activeDietTags: string[];
};

const EMPTY_FILTERS: RecipeFilters = {
  category: "All",
  query: "",
  proteinFlipOnly: false,
  activeDietTags: [],
};

function readFilters(categories: string[]): RecipeFilters {
  try {
    const raw = sessionStorage.getItem(FILTERS_KEY);
    if (!raw) return EMPTY_FILTERS;
    const parsed = JSON.parse(raw) as Partial<RecipeFilters>;
    const allowed = new Set(DIETARY_TAGS.map((tag) => tag.value));
    return {
      category:
        typeof parsed.category === "string" && categories.includes(parsed.category)
          ? parsed.category
          : "All",
      query: typeof parsed.query === "string" ? parsed.query : "",
      proteinFlipOnly: parsed.proteinFlipOnly === true,
      activeDietTags: Array.isArray(parsed.activeDietTags)
        ? parsed.activeDietTags.filter(
            (tag): tag is string => typeof tag === "string" && allowed.has(tag)
          )
        : [],
    };
  } catch {
    return EMPTY_FILTERS;
  }
}

function writeFilters(filters: RecipeFilters) {
  sessionStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}

export function RecipesGrid({
  recipes,
  categories,
}: {
  recipes: Recipe[];
  categories: string[];
}) {
  const [filters, setFilters] = useState<RecipeFilters>(EMPTY_FILTERS);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setFilters(readFilters(categories));
    });
    return () => cancelAnimationFrame(frame);
  }, [categories]);

  function update(next: RecipeFilters) {
    setFilters(next);
    writeFilters(next);
  }

  const { category, query, proteinFlipOnly, activeDietTags } = filters;

  function toggleDietTag(tag: string) {
    update({
      ...filters,
      activeDietTags: activeDietTags.includes(tag)
        ? activeDietTags.filter((current) => current !== tag)
        : [...activeDietTags, tag],
    });
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
              onClick={() => update({ ...filters, category: c })}
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
            onClick={() => update({ ...filters, proteinFlipOnly: !proteinFlipOnly })}
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
            onChange={(e) => update({ ...filters, query: e.target.value })}
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

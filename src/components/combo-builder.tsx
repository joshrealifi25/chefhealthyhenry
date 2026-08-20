"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { IngredientTag, GroceryItem } from "@/lib/ingredients";

interface RecipeLite {
  slug: string;
  title: string;
}

interface Props {
  /** Every selectable ingredient, most-used first. */
  all: IngredientTag[];
  /** Recipe slug to its canonical ingredient names. */
  tags: Record<string, string[]>;
  /** Recipe slug to canonical ingredient to the recipe's own wording. */
  lines: Record<string, Record<string, string[]>>;
  recipes: RecipeLite[];
  /** Optional preset to start from, e.g. from a free Explore combo page. */
  initial?: string[];
}

export function ComboBuilder({ all, tags, lines, recipes, initial = [] }: Props) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"full" | "byRecipe">("full");

  const matches = useMemo(
    () =>
      selected.length === 0
        ? []
        : recipes.filter((r) =>
            selected.every((n) => (tags[r.slug] ?? []).includes(n))
          ),
    [selected, recipes, tags]
  );

  // Only offer ingredients that still co-occur with everything chosen, so a
  // dead-end combination is impossible to build.
  const options = useMemo(() => {
    const pool = selected.length === 0 ? recipes : matches;
    const counts = new Map<string, number>();
    for (const r of pool) {
      for (const t of tags[r.slug] ?? []) {
        if (selected.includes(t)) continue;
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    const q = query.trim().toLowerCase();
    return all
      .filter((i) => counts.has(i.name))
      .map((i) => ({ ...i, recipeCount: counts.get(i.name) ?? 0 }))
      .filter((i) => (q ? i.name.toLowerCase().includes(q) : true))
      .sort((a, b) => b.recipeCount - a.recipeCount || a.name.localeCompare(b.name))
      .slice(0, 8);
  }, [all, matches, query, recipes, selected, tags]);

  const list: GroceryItem[] = useMemo(() => {
    const items = new Map<string, GroceryItem>();
    for (const r of matches) {
      for (const name of tags[r.slug] ?? []) {
        const item = items.get(name) ?? { name, needs: [] };
        item.needs.push({
          recipeSlug: r.slug,
          recipeTitle: r.title,
          lines: lines[r.slug]?.[name] ?? [],
        });
        items.set(name, item);
      }
    }
    return [...items.values()].sort(
      (a, b) => b.needs.length - a.needs.length || a.name.localeCompare(b.name)
    );
  }, [matches, tags, lines]);

  function add(name: string) {
    setSelected((s) => (s.includes(name) ? s : [...s, name]));
    setQuery("");
  }

  return (
    <div>
      {/* Pick ingredients */}
      <label htmlFor="combo-search" className="text-sm font-medium">
        Add an ingredient
      </label>
      <input
        id="combo-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing, for example cilantro"
        autoComplete="off"
        className="mt-2 w-full rounded-full border border-input bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      {options.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o.slug}
              onClick={() => add(o.name)}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm transition-colors hover:border-primary/50 hover:text-primary"
            >
              {o.name}{" "}
              <span className="text-muted-foreground">({o.recipeCount})</span>
            </button>
          ))}
        </div>
      )}

      {/* Chosen ingredients */}
      {selected.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            {selected.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm"
              >
                {name}
                <button
                  onClick={() => setSelected((s) => s.filter((n) => n !== name))}
                  aria-label={`Remove ${name}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </span>
            ))}
            <button
              onClick={() => setSelected([])}
              className="ml-auto text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
            >
              Start over
            </button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
            {matches.length === 1
              ? "1 recipe uses all of these"
              : `${matches.length} recipes use all of these`}
          </p>
        </div>
      )}

      {/* Results */}
      {matches.length > 0 && (
        <div className="mt-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Your recipes
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {matches.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/recipes/${r.slug}`}
                  className="text-primary hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Your grocery list
            </h2>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={() => setView("full")}
                aria-pressed={view === "full"}
                className={
                  view === "full"
                    ? "rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground"
                    : "rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:text-primary"
                }
              >
                Full list
              </button>
              <button
                onClick={() => setView("byRecipe")}
                aria-pressed={view === "byRecipe"}
                className={
                  view === "byRecipe"
                    ? "rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground"
                    : "rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:text-primary"
                }
              >
                By recipe
              </button>
              <button
                onClick={() => window.print()}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:text-primary"
              >
                Print
              </button>
            </div>
          </div>

          {view === "full" ? (
            <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
              {list.map((item) => (
                <li key={item.name} className="px-5 py-3">
                  <p className="text-sm font-medium capitalize">{item.name}</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                    {item.needs.map((n) => (
                      <li key={n.recipeSlug}>
                        {n.lines.length > 0 ? n.lines.join("; ") : "as needed"}{" "}
                        <span className="opacity-70">({n.recipeTitle})</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 space-y-4">
              {matches.map((r) => (
                <section
                  key={r.slug}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <h3 className="font-heading text-lg font-semibold">
                    {r.title}
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {(tags[r.slug] ?? []).map((name) => {
                      const l = lines[r.slug]?.[name] ?? [];
                      return (
                        <li key={name}>
                          {l.length > 0 ? l.join("; ") : name}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      {selected.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          Pick two or three ingredients you already have, or want to buy once
          and use all week. Every option shown still leads to at least one
          recipe, so you can never build a combination with no results.
        </p>
      )}
    </div>
  );
}

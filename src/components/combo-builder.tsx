"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { IngredientTag, GroceryItem } from "@/lib/ingredients";

const TRIP_KEY = "chh-combo-trip";

interface Trip {
  selected: string[];
  chosen: string[];
  inCart: string[];
}

const EMPTY_TRIP: Trip = { selected: [], chosen: [], inCart: [] };

/**
 * The whole trip is restored together: the ingredients, the meals chosen, and
 * what is already in the cart. Persisting only the ticks would leave a shopper
 * who reloads mid-aisle with an empty page and meaningless checkmarks.
 *
 * Restoring happens after mount, never during the server render, so the
 * markup the server produced and the markup React hydrates always match.
 */
function readTrip(): Trip {
  if (typeof window === "undefined") return EMPTY_TRIP;
  try {
    const saved = window.localStorage.getItem(TRIP_KEY);
    if (!saved) return EMPTY_TRIP;
    const t = JSON.parse(saved) as Partial<Trip>;
    return {
      selected: Array.isArray(t.selected) ? t.selected : [],
      chosen: Array.isArray(t.chosen) ? t.chosen : [],
      inCart: Array.isArray(t.inCart) ? t.inCart : [],
    };
  } catch {
    // Private browsing or blocked storage: the tool still works this session.
    return EMPTY_TRIP;
  }
}

interface RecipeLite {
  slug: string;
  title: string;
}

export interface SavedList {
  id: string;
  name: string;
  ingredients: string[];
  recipeSlugs: string[];
  inCart: string[];
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
  /** The member's saved trips, newest first. */
  saved?: SavedList[];
}

export function ComboBuilder({
  all,
  tags,
  lines,
  recipes,
  initial = [],
  saved = [],
}: Props) {
  const restored = initial.length > 0 ? EMPTY_TRIP : readTrip();
  const [selected, setSelected] = useState<string[]>(
    initial.length > 0 ? initial : restored.selected
  );
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"full" | "byRecipe">("full");
  /** Recipe slugs the cook actually plans to make. */
  const [chosen, setChosen] = useState<string[]>(restored.chosen);
  /** Ingredients already in the cart. Kept in localStorage so a phone that
   *  reloads mid-aisle does not lose the trip. */
  const [inCart, setInCart] = useState<string[]>(restored.inCart);
  const [lists, setLists] = useState<SavedList[]>(saved);
  /** The saved list currently open, so Save updates it instead of duplicating. */
  const [openListId, setOpenListId] = useState<string | null>(null);
  const [listName, setListName] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        TRIP_KEY,
        JSON.stringify({ selected, chosen, inCart })
      );
    } catch {
      // Ignore: persistence is a convenience, not a requirement.
    }
  }, [selected, chosen, inCart]);

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

  // Narrowing the ingredients can drop a recipe out of the matches, so derive
  // the plan from the current matches instead of letting stale slugs linger.
  const planned = useMemo(
    () => matches.filter((r) => chosen.includes(r.slug)),
    [matches, chosen]
  );

  const list: GroceryItem[] = useMemo(() => {
    const items = new Map<string, GroceryItem>();
    for (const r of planned) {
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
  }, [planned, tags, lines]);

  const defaultName = useMemo(() => {
    if (planned.length === 1) return planned[0].title;
    return selected.slice(0, 3).join(", ") || "My list";
  }, [planned, selected]);

  const gotCount = useMemo(
    () => list.filter((i) => inCart.includes(i.name)).length,
    [list, inCart]
  );

  async function save() {
    const name = listName.trim() || defaultName;
    setSaveState("saving");
    setSaveError(null);
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: openListId,
          name,
          ingredients: selected,
          recipeSlugs: chosen,
          inCart,
        }),
      });
      const data = (await res.json()) as { list?: SavedList; error?: string };
      if (!res.ok || !data.list) {
        setSaveState("error");
        setSaveError(data.error ?? "Could not save. Please try again.");
        return;
      }
      setLists((ls) => [data.list!, ...ls.filter((l) => l.id !== data.list!.id)]);
      setOpenListId(data.list.id);
      setListName(data.list.name);
      setSaveState("saved");
    } catch {
      setSaveState("error");
      setSaveError("Could not save. Please try again.");
    }
  }

  function open(list: SavedList) {
    setSelected(list.ingredients);
    setChosen(list.recipeSlugs);
    setInCart(list.inCart);
    setOpenListId(list.id);
    setListName(list.name);
    setSaveState("idle");
  }

  async function remove(id: string) {
    setLists((ls) => ls.filter((l) => l.id !== id));
    if (openListId === id) {
      setOpenListId(null);
      setListName("");
    }
    await fetch(`/api/lists?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  function add(name: string) {
    setSelected((s) => (s.includes(name) ? s : [...s, name]));
    setQuery("");
  }

  return (
    <div>
      {lists.length > 0 && (
        <section className="mb-8 rounded-2xl border border-border bg-card p-5 print:hidden">
          <h2 className="font-heading text-lg font-semibold">My Lists</h2>
          <ul className="mt-3 divide-y divide-border">
            {lists.map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-2">
                <button
                  onClick={() => open(l)}
                  className="flex-1 text-left text-sm hover:text-primary"
                >
                  <span className={l.id === openListId ? "font-semibold" : ""}>
                    {l.name}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {l.recipeSlugs.length}{" "}
                    {l.recipeSlugs.length === 1 ? "recipe" : "recipes"}
                    {l.inCart.length > 0
                      ? `, ${l.inCart.length} in the cart`
                      : ""}
                  </span>
                </button>
                <button
                  onClick={() => remove(l.id)}
                  aria-label={`Delete ${l.name}`}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pick ingredients */}
      <div className="print:hidden">
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
      </div>

      {selected.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-4 print:hidden">
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
              onClick={() => {
                setSelected([]);
                setChosen([]);
                setInCart([]);
              }}
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
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Which of these are you cooking?
            </h2>
            <button
              onClick={() =>
                setChosen(
                  planned.length === matches.length
                    ? []
                    : matches.map((r) => r.slug)
                )
              }
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary print:hidden"
            >
              {planned.length === matches.length ? "Clear all" : "Select all"}
            </button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Tick the meals you plan to make. Your grocery list covers just
            those.
          </p>
          <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card print:border-0">
            {matches.map((r) => {
              const on = chosen.includes(r.slug);
              return (
                <li
                  key={r.slug}
                  className={`flex items-center gap-3 px-5 py-3 ${
                    on ? "" : "print:hidden"
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`pick-${r.slug}`}
                    checked={on}
                    onChange={() =>
                      setChosen((c) =>
                        on ? c.filter((s) => s !== r.slug) : [...c, r.slug]
                      )
                    }
                    className="size-4 accent-primary print:hidden"
                  />
                  <label
                    htmlFor={`pick-${r.slug}`}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {r.title}
                  </label>
                  <Link
                    href={`/recipes/${r.slug}`}
                    className="text-xs text-primary hover:underline print:hidden"
                  >
                    View
                  </Link>
                </li>
              );
            })}
          </ul>

          {planned.length > 0 && (
            <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-5 print:hidden">
              <label htmlFor="list-name" className="text-sm font-medium">
                {openListId ? "Update this list" : "Save this list"}
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                Saved lists keep your recipes and what you have already picked
                up, so you can plan here and shop from your phone.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <input
                  id="list-name"
                  value={listName}
                  onChange={(e) => {
                    setListName(e.target.value);
                    setSaveState("idle");
                  }}
                  placeholder={defaultName}
                  className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={save}
                  disabled={saveState === "saving"}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {saveState === "saving"
                    ? "Saving..."
                    : openListId
                      ? "Update"
                      : "Save"}
                </button>
                {openListId && (
                  <button
                    onClick={() => {
                      setOpenListId(null);
                      setListName("");
                      setSaveState("idle");
                    }}
                    className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    Save as new
                  </button>
                )}
              </div>
              {saveState === "saved" && (
                <p className="mt-2 text-xs text-primary">Saved to My Lists.</p>
              )}
              {saveState === "error" && saveError && (
                <p className="mt-2 text-xs text-destructive">{saveError}</p>
              )}
            </div>
          )}

          {planned.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-border bg-secondary/40 px-5 py-4 text-sm text-muted-foreground">
              Choose at least one recipe above and your grocery list appears
              here.
            </p>
          ) : (
          <>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Grocery list for {planned.length}{" "}
              {planned.length === 1 ? "recipe" : "recipes"}
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

          {/* The consolidated list is the one that prints, whichever view is
              on screen: a by-recipe printout makes a shopper walk the store
              once per dish. */}
          <div className={view === "full" ? undefined : "hidden print:block"}>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted-foreground print:hidden">
                <span aria-live="polite">
                  {gotCount} of {list.length} in the cart
                </span>
                {gotCount > 0 && (
                  <button
                    onClick={() => setInCart([])}
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Uncheck all
                  </button>
                )}
              </div>
              <ul className="print-list mt-2 divide-y divide-border rounded-2xl border border-border bg-card">
                {list.map((item) => {
                  const got = inCart.includes(item.name);
                  return (
                    <li key={item.name} className="flex gap-3 px-5 py-3">
                      <input
                        type="checkbox"
                        id={`got-${item.name}`}
                        checked={got}
                        onChange={() =>
                          setInCart((c) =>
                            got
                              ? c.filter((n) => n !== item.name)
                              : [...c, item.name]
                          )
                        }
                        className="mt-0.5 size-4 shrink-0 accent-primary"
                      />
                      <div className={got ? "opacity-45" : undefined}>
                        <label
                          htmlFor={`got-${item.name}`}
                          className={`cursor-pointer text-sm font-medium capitalize ${
                            got ? "line-through" : ""
                          }`}
                        >
                          {item.name}
                        </label>
                        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                          {item.needs.map((n) => (
                            <li key={n.recipeSlug}>
                              {n.lines.length > 0
                                ? n.lines.join("; ")
                                : "as needed"}{" "}
                              <span className="opacity-70">
                                ({n.recipeTitle})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
          </div>

          <div className={view === "byRecipe" ? "print:hidden" : "hidden"}>
            <div className="mt-4 space-y-4">
              {planned.map((r) => (
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
          </div>
          </>
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

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type {
  IngredientTag,
  IngredientFamily,
  GroceryItem,
} from "@/lib/ingredients";
import { DIETARY_TAGS } from "@/lib/recipes";

/** Protein Flip™ as a search filter, alongside the six dietary tags. Kept
 * local to the Combo Builder rather than added to the shared DIETARY_TAGS
 * list, since /recipes already has its own dedicated Protein Flip™ toggle
 * pill and doesn't need a second, duplicate one from that shared list. */
const PROTEIN_FLIP_FILTER = {
  value: "protein-flip",
  label: "Protein Flip™",
  badge: "Flip",
};

/** Every non-ingredient filter the search box can suggest: the six dietary
 * tags plus Protein Flip™. */
const SPECIAL_FILTERS = [...DIETARY_TAGS, PROTEIN_FLIP_FILTER];

const TRIP_KEY = "chh-combo-trip";

interface Trip {
  selected: string[];
  chosen: string[];
  inCart: string[];
  /** Active dietary filter pills (vegan, gluten-free, etc). */
  dietary: string[];
}

const EMPTY_TRIP: Trip = { selected: [], chosen: [], inCart: [], dietary: [] };

/** Random per-visit id so searches can be grouped into a session without
 *  identifying anyone. Regenerated on every page load. */
const sessionId =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

/**
 * Records which ingredients members reach for, so Henry can see demand the
 * recipe library does not cover yet. Fire and forget: a failure here must
 * never interrupt someone building a list.
 */
function logSearch(term: string): void {
  try {
    const body = JSON.stringify({ term, sessionId });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/ingredient-searches",
        new Blob([body], { type: "application/json" })
      );
      return;
    }
    void fetch("/api/ingredient-searches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Ignore: logging is diagnostic, not part of the member's task.
  }
}

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
      dietary: Array.isArray(t.dietary) ? t.dietary : [],
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
  /** Ingredient groups a shopper buys as one item. */
  families?: IngredientFamily[];
  /** Recipe slug to its canonical ingredient names. */
  tags: Record<string, string[]>;
  /** Recipe slug to canonical ingredient to the recipe's own wording. */
  lines: Record<string, Record<string, string[]>>;
  /** Recipe slug to its non-ingredient filter tags: dietaryTags (vegan,
   * gluten-free, etc) plus "protein-flip" when the recipe is Protein Flip™.
   * Kept separate from `tags` on purpose: these are filters, not shopping
   * ingredients, and must never end up as a line item on the grocery list. */
  dietaryTags: Record<string, string[]>;
  recipes: RecipeLite[];
  /** Optional preset to start from, e.g. from a free Explore combo page. */
  initial?: string[];
  /** The member's saved trips, newest first. */
  saved?: SavedList[];
  /** A saved list to open on arrival, e.g. from a dashboard link. */
  openListId?: string | null;
}

export function ComboBuilder({
  all,
  families = [],
  tags,
  lines,
  dietaryTags,
  recipes,
  initial = [],
  saved = [],
  openListId: openOnArrival = null,
}: Props) {
  // A list opened by link owns the session; otherwise fall back to a preset,
  // then to whatever trip this browser had in progress.
  const arriving = openOnArrival
    ? saved.find((l) => l.id === openOnArrival)
    : undefined;
  const restored = arriving
    ? {
        selected: arriving.ingredients,
        chosen: arriving.recipeSlugs,
        inCart: arriving.inCart,
        // Saved lists don't carry dietary filters: they're a search
        // refinement, not part of what the list actually contains.
        dietary: [] as string[],
      }
    : initial.length > 0
      ? EMPTY_TRIP
      : readTrip();
  const [selected, setSelected] = useState<string[]>(
    initial.length > 0 && !arriving ? initial : restored.selected
  );
  /** Active dietary filter pills. Stacks with `selected` (ingredients) using
   * AND logic, same as the ingredient filters stack with each other. */
  const [dietarySelected, setDietarySelected] = useState<string[]>(restored.dietary);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"full" | "byRecipe">("full");
  /** Recipe slugs the cook actually plans to make. */
  const [chosen, setChosen] = useState<string[]>(restored.chosen);
  /** Ingredients already in the cart. Kept in localStorage so a phone that
   *  reloads mid-aisle does not lose the trip. */
  const [inCart, setInCart] = useState<string[]>(restored.inCart);
  const [lists, setLists] = useState<SavedList[]>(saved);
  /** The saved list currently open, so Save updates it instead of duplicating. */
  const [openListId, setOpenListId] = useState<string | null>(
    arriving ? arriving.id : null
  );
  const [listName, setListName] = useState(arriving ? arriving.name : "");
  /** True once the session has changes that are not in a saved list. */
  const [dirty, setDirty] = useState(false);
  /** A list waiting on the discard confirmation before it opens. */
  const [pendingOpen, setPendingOpen] = useState<SavedList | null>(null);
  /** A list waiting on the delete confirmation. */
  const [pendingDelete, setPendingDelete] = useState<SavedList | null>(null);
  /** Name of the list just saved, shown after the window clears. */
  const [savedName, setSavedName] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        TRIP_KEY,
        JSON.stringify({ selected, chosen, inCart, dietary: dietarySelected })
      );
    } catch {
      // Ignore: persistence is a convenience, not a requirement.
    }
  }, [selected, chosen, inCart, dietarySelected]);

  /** Ingredient names a selection stands for: a family means any member. */
  const membersOf = useMemo(() => {
    const byName = new Map(families.map((f) => [f.name, f.members]));
    return (label: string) => byName.get(label) ?? [label];
  }, [families]);

  const matches = useMemo(
    () =>
      selected.length === 0 && dietarySelected.length === 0
        ? []
        : recipes.filter((r) => {
            const t = tags[r.slug] ?? [];
            const ingredientsMatch = selected.every((n) =>
              membersOf(n).some((m) => t.includes(m))
            );
            const diet = dietaryTags[r.slug] ?? [];
            const dietMatch = dietarySelected.every((d) => diet.includes(d));
            return ingredientsMatch && dietMatch;
          }),
    [selected, dietarySelected, recipes, tags, dietaryTags, membersOf]
  );

  // Suggestions for the non-ingredient filters themselves: the six dietary
  // tags plus Protein Flip™, surfaced once the query matches one of their
  // values (e.g. "veg" -> vegetarian, vegan; "flip" or "protein" -> Protein
  // Flip™), excluding whichever are already active.
  const dietaryOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SPECIAL_FILTERS.filter(
      (t) => !dietarySelected.includes(t.value) && t.value.includes(q)
    );
  }, [query, dietarySelected]);

  // Only offer ingredients that still co-occur with everything chosen, so a
  // dead-end combination is impossible to build.
  const options = useMemo(() => {
    const pool = selected.length === 0 && dietarySelected.length === 0 ? recipes : matches;
    const counts = new Map<string, number>();
    for (const r of pool) {
      for (const t of tags[r.slug] ?? []) {
        if (selected.includes(t)) continue;
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    // Roll family members up into one entry, counting distinct recipes so a
    // dish using two members is not counted twice.
    const familyOfMember = new Map<string, IngredientFamily>();
    for (const f of families) {
      for (const m of f.members) familyOfMember.set(m, f);
    }
    const familyRecipes = new Map<string, Set<string>>();
    for (const r of pool) {
      for (const t of tags[r.slug] ?? []) {
        const fam = familyOfMember.get(t);
        if (!fam || selected.includes(fam.name)) continue;
        const set = familyRecipes.get(fam.name) ?? new Set<string>();
        set.add(r.slug);
        familyRecipes.set(fam.name, set);
      }
    }

    const q = query.trim().toLowerCase();
    const singles = all
      .filter((i) => counts.has(i.name) && !familyOfMember.has(i.name))
      .map((i) => ({
        name: i.name,
        slug: i.slug,
        recipeCount: counts.get(i.name) ?? 0,
        members: [] as string[],
      }));
    const grouped = families
      .filter((f) => familyRecipes.has(f.name))
      .map((f) => ({
        name: f.name,
        slug: f.slug,
        recipeCount: familyRecipes.get(f.name)?.size ?? 0,
        // Refinements are the narrower cuts only: a member sharing the
        // family's name would just repeat the pill above it.
        members: f.members.filter((m) => counts.has(m) && m !== f.name),
      }));

    return [...singles, ...grouped]
      .filter((i) =>
        q
          ? i.name.toLowerCase().includes(q) ||
            i.members.some((m) => m.toLowerCase().includes(q))
          : true
      )
      .sort((a, b) => b.recipeCount - a.recipeCount || a.name.localeCompare(b.name))
      .slice(0, 8);
  }, [all, families, matches, query, recipes, selected, tags, dietarySelected]);

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

  /** Empties the active window so the next list starts from scratch. */
  function clearSession() {
    setSelected([]);
    setDietarySelected([]);
    setChosen([]);
    setInCart([]);
    setQuery("");
    setOpenListId(null);
    setListName("");
    setDirty(false);
  }

  async function save({ asNew = false }: { asNew?: boolean } = {}) {
    const name = listName.trim() || defaultName;
    setSaveState("saving");
    setSaveError(null);
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: asNew ? null : openListId,
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
      setSavedName(data.list.name);
      setSaveState("saved");
      // The active window empties after every save, so the member always
      // knows whether they are starting fresh or editing something.
      clearSession();
    } catch {
      setSaveState("error");
      setSaveError("Could not save. Please try again.");
    }
  }

  function openNow(list: SavedList) {
    setSelected(list.ingredients);
    // Saved lists don't carry dietary filters (see the `restored` comment
    // above), so opening one always starts with a clean filter set.
    setDietarySelected([]);
    setChosen(list.recipeSlugs);
    setInCart(list.inCart);
    setOpenListId(list.id);
    setListName(list.name);
    setSaveState("idle");
    setSavedName(null);
    setDirty(false);
    setPendingOpen(null);
  }

  /** Opening a list would replace unsaved work, so ask first. */
  function requestOpen(list: SavedList) {
    if (dirty && (selected.length > 0 || dietarySelected.length > 0)) setPendingOpen(list);
    else openNow(list);
  }

  async function remove(id: string) {
    setLists((ls) => ls.filter((l) => l.id !== id));
    setPendingDelete(null);
    if (openListId === id) clearSession();
    await fetch(`/api/lists?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  function add(name: string) {
    setSelected((s) => (s.includes(name) ? s : [...s, name]));
    setQuery("");
    setDirty(true);
    setSaveState("idle");
    setSavedName(null);
    logSearch(name);
  }

  /** Adds a dietary filter pill (e.g. "vegan"). Kept separate from add():
   * dietary tags aren't ingredients, so they never get logged to the
   * ingredient-demand endpoint and never touch `selected`/the grocery list. */
  function addDietary(tag: string) {
    setDietarySelected((s) => (s.includes(tag) ? s : [...s, tag]));
    setQuery("");
    setDirty(true);
    setSaveState("idle");
    setSavedName(null);
  }

  /** Enter adds what was typed. Commas add several at once. Each comma-
   * separated part resolves to either a special filter (dietary tag or
   * Protein Flip™, exact match only, so typing "veg" and pressing Enter
   * doesn't guess between vegetarian and vegan) or an ingredient/family,
   * same as before. Spaces are normalized to hyphens for the exact match so
   * typing "protein flip" or "gluten free" resolves the same as the
   * hyphenated value. */
  function submitQuery() {
    const parts = query
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const names: string[] = [];
    const dietaryNames: string[] = [];
    for (const part of parts) {
      const q = part.toLowerCase();
      const qHyphenated = q.replace(/\s+/g, "-");
      const exactDietary = SPECIAL_FILTERS.find(
        (t) => t.value === q || t.value === qHyphenated
      );
      if (exactDietary) {
        if (!dietarySelected.includes(exactDietary.value) && !dietaryNames.includes(exactDietary.value)) {
          dietaryNames.push(exactDietary.value);
        }
        continue;
      }
      // A family name wins over a single ingredient, so typing "chicken"
      // picks up every cut rather than one of them.
      const exactFamily = families.find((f) => f.name.toLowerCase() === q);
      const exact = all.find((i) => i.name.toLowerCase() === q);
      const candidate =
        exactFamily?.name ??
        exact?.name ??
        families.find(
          (f) =>
            (f.name.toLowerCase().includes(q) ||
              f.members.some((m) => m.toLowerCase().includes(q))) &&
            !selected.includes(f.name) &&
            !names.includes(f.name)
        )?.name ??
        all.find(
          (i) =>
            i.name.toLowerCase().includes(q) &&
            !selected.includes(i.name) &&
            !names.includes(i.name)
        )?.name;
      if (candidate && !selected.includes(candidate) && !names.includes(candidate)) {
        names.push(candidate);
      }
    }
    if (names.length === 0 && dietaryNames.length === 0) return;
    if (names.length > 0) {
      setSelected((s) => [...s, ...names.filter((n) => !s.includes(n))]);
      names.forEach(logSearch);
    }
    if (dietaryNames.length > 0) {
      setDietarySelected((s) => [...s, ...dietaryNames.filter((n) => !s.includes(n))]);
    }
    setQuery("");
    setDirty(true);
    setSaveState("idle");
    setSavedName(null);
  }

  return (
    <div>
      {savedName && (
        <p className="mb-6 rounded-2xl border border-border bg-accent/40 px-5 py-3 text-sm print:hidden">
          Saved <strong>{savedName}</strong> to My Lists. The window below is
          clear and ready for a new list.
        </p>
      )}

      {pendingOpen && (
        <div
          role="alertdialog"
          aria-labelledby="discard-title"
          className="mb-6 rounded-2xl border border-border bg-secondary/60 p-5 print:hidden"
        >
          <p id="discard-title" className="text-sm font-medium">
            You have an unsaved list in progress. Discard it and open
            &ldquo;{pendingOpen.name}&rdquo;?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => openNow(pendingOpen)}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Discard and open
            </button>
            <button
              onClick={() => setPendingOpen(null)}
              className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:text-primary"
            >
              Keep what I have
            </button>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div
          role="alertdialog"
          aria-labelledby="delete-title"
          className="mb-6 rounded-2xl border border-border bg-secondary/60 p-5 print:hidden"
        >
          <p id="delete-title" className="text-sm font-medium">
            Delete &ldquo;{pendingDelete.name}&rdquo;? This cannot be undone.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => remove(pendingDelete.id)}
              className="rounded-full bg-destructive px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Delete
            </button>
            <button
              onClick={() => setPendingDelete(null)}
              className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {lists.length > 0 && (
        <section className="mb-8 rounded-2xl border border-border bg-card p-5 print:hidden">
          <h2 className="font-heading text-lg font-semibold">My Lists</h2>
          <ul className="mt-3 divide-y divide-border">
            {lists.map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-2">
                <button
                  onClick={() => requestOpen(l)}
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
                  onClick={() => requestOpen(l)}
                  aria-label={`Edit ${l.name}`}
                  className="text-xs text-primary hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => setPendingDelete(l)}
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submitQuery();
          }
        }}
        placeholder="Type an ingredient and press Enter, or separate several with commas"
        autoComplete="off"
        className="mt-2 w-full rounded-full border border-input bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      {options.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((o) => (
            <span key={o.slug} className="inline-flex flex-col gap-1">
              <button
                onClick={() => add(o.name)}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm transition-colors hover:border-primary/50 hover:text-primary"
              >
                {o.name}{" "}
                <span className="text-muted-foreground">({o.recipeCount})</span>
              </button>
              {o.members.length > 1 && (
                <span className="flex flex-wrap gap-1 px-1">
                  {o.members.map((m) => (
                    <button
                      key={m}
                      onClick={() => add(m)}
                      className="text-xs text-muted-foreground underline underline-offset-2 hover:text-primary"
                    >
                      {m}
                    </button>
                  ))}
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Special filter suggestions (dietary tags + Protein Flip™): a
          separate source from ingredient options above, visually distinct
          (tinted background + badge) so a shopper can tell at a glance
          these filter the results, not what goes on the grocery list. */}
      {dietaryOptions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {dietaryOptions.map((t) => (
            <button
              key={t.value}
              onClick={() => addDietary(t.value)}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
            >
              <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                {t.badge}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Chosen ingredients */}
      </div>

      {(selected.length > 0 || dietarySelected.length > 0) && (
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
            {dietarySelected.map((tag) => {
              const filter = SPECIAL_FILTERS.find((t) => t.value === tag);
              return (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm text-primary"
                >
                  <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                    {filter?.badge ?? "Filter"}
                  </span>
                  {filter?.label ?? tag}
                  <button
                    onClick={() => setDietarySelected((s) => s.filter((t) => t !== tag))}
                    aria-label={`Remove ${tag} filter`}
                    className="text-primary/70 hover:text-primary"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
            <button
              onClick={() => {
                setSelected([]);
                setDietarySelected([]);
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
              {/* Two distinct flows, never blended: building something new,
                  or editing a list opened from My Lists. */}
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {openListId ? "Editing a saved list" : "New list"}
              </p>
              <label htmlFor="list-name" className="mt-1 block text-sm font-medium">
                {openListId
                  ? `You are editing "${listName || defaultName}"`
                  : "Save this list"}
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
                  aria-label="List name"
                  className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={() => save()}
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
                    onClick={() => save({ asNew: true })}
                    disabled={saveState === "saving"}
                    className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:text-primary disabled:opacity-60"
                  >
                    Save as new
                  </button>
                )}
              </div>
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

      {selected.length === 0 && dietarySelected.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          Pick two or three ingredients you already have, or want to buy once
          and use all week. Every option shown still leads to at least one
          recipe, so you can never build a combination with no results.
        </p>
      )}
    </div>
  );
}

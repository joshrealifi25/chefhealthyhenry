"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  customBuildsRemainingNote,
  isAtCustomBuildLimit,
  type ComboCredits,
} from "@/lib/combo-build";

interface PresetLink {
  id: string;
  name: string;
}

interface SavedListRow {
  id: string;
  name: string;
  ingredients: string[];
}

interface Props {
  showPresets: boolean;
  presets: PresetLink[];
  lists: SavedListRow[];
  credits?: ComboCredits | null;
}

export function GroceryComboCard({
  showPresets,
  presets,
  lists: initialLists,
  credits,
}: Props) {
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [listsOpen, setListsOpen] = useState(false);
  const [lists, setLists] = useState(initialLists);
  const [pendingDelete, setPendingDelete] = useState<SavedListRow | null>(null);
  const atLimit = isAtCustomBuildLimit(credits ?? undefined);

  async function remove(id: string) {
    setLists((current) => current.filter((l) => l.id !== id));
    setPendingDelete(null);
    await fetch(`/api/lists?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Grocery combo builder
      </p>
      <h2 className="mt-1 font-heading text-xl font-semibold">My Lists</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick your ingredients, get every recipe that shares them, plus one
        combined grocery list.
      </p>
      {credits && !credits.unlimited && (
        <p className="mt-2 text-sm text-muted-foreground">
          {customBuildsRemainingNote(credits)}
        </p>
      )}

      {showPresets && presets.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setPresetsOpen((open) => !open)}
            aria-expanded={presetsOpen}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Chef Henry combinations
            </span>
            {presetsOpen ? (
              <ChevronUp className="size-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
            )}
          </button>
          {presetsOpen && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Curated lists you can open any time. They do not use a custom
                build.
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {presets.map((preset) => (
                  <li key={preset.id}>
                    <Link
                      href={`/members/combos?preset=${preset.id}`}
                      className="text-primary hover:underline"
                    >
                      {preset.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => setListsOpen((open) => !open)}
          aria-expanded={listsOpen}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            My custom lists ({lists.length})
          </span>
          {listsOpen ? (
            <ChevronUp className="size-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
          )}
        </button>
        {listsOpen && (
          <div className="mt-2">
            {lists.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No custom lists yet. Use the button below to build your first
                one.
              </p>
            ) : (
              <ul className="space-y-3 text-sm">
                {lists.map((list) => {
                  const label =
                    list.ingredients.length > 0
                      ? list.ingredients.join(", ")
                      : list.name;
                  return (
                    <li key={list.id}>
                      <p className="text-foreground">{label}</p>
                      <div className="mt-1 flex flex-wrap gap-3">
                        <Link
                          href={`/members/combos?list=${list.id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          Open
                        </Link>
                        {atLimit ? (
                          <span
                            className="cursor-not-allowed text-xs text-muted-foreground"
                            title="Build limit reached. Upgrade to edit."
                          >
                            Edit
                          </span>
                        ) : (
                          <Link
                            href={`/members/combos?list=${list.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            Edit
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => setPendingDelete(list)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {pendingDelete && (
        <div
          role="alertdialog"
          aria-labelledby="dashboard-delete-title"
          className="mt-4 rounded-2xl border border-border bg-secondary/60 p-4"
        >
          <p id="dashboard-delete-title" className="text-sm font-medium">
            Delete &ldquo;{pendingDelete.name}&rdquo;? This cannot be undone.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => remove(pendingDelete.id)}
              className="rounded-full bg-destructive px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {atLimit ? (
        <span
          className="mt-4 inline-block cursor-not-allowed rounded-full bg-primary/40 px-5 py-2 text-sm font-medium text-primary-foreground"
          title="Build limit reached. Upgrade to Community for unlimited builds."
        >
          Build a new list
        </span>
      ) : (
        <Link
          href="/members/combos"
          className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Build a new list
        </Link>
      )}
    </section>
  );
}

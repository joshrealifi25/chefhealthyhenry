"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FAVORITE_CATEGORIES,
  FAVORITE_LABELS,
  categoryLabel,
  recommendationLabel,
  type FavoriteCategory,
  type FavoriteLabel,
} from "@/lib/favorite-things";

/** A favorite thing as the server hands it to the client: dates as strings. */
export interface FavoriteRow {
  id: string;
  name: string;
  category: string;
  imageUrl: string | null;
  linkUrl: string;
  isAffiliate: boolean;
  note: string;
  whyILikeIt: string | null;
  label: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

/** What the form edits. Strings throughout so inputs stay controlled. */
interface Draft {
  name: string;
  category: FavoriteCategory;
  imageUrl: string;
  linkUrl: string;
  isAffiliate: boolean;
  note: string;
  whyILikeIt: string;
  label: FavoriteLabel;
  featured: boolean;
  active: boolean;
  sortOrder: string;
}

const EMPTY: Draft = {
  name: "",
  category: "pantry-staples",
  imageUrl: "",
  linkUrl: "",
  isAffiliate: false,
  note: "",
  whyILikeIt: "",
  label: "recommends",
  featured: false,
  active: true,
  sortOrder: "0",
};

function toDraft(row: FavoriteRow): Draft {
  return {
    name: row.name,
    category: (FAVORITE_CATEGORIES.some((c) => c.value === row.category)
      ? row.category
      : "pantry-staples") as FavoriteCategory,
    imageUrl: row.imageUrl ?? "",
    linkUrl: row.linkUrl,
    isAffiliate: row.isAffiliate,
    note: row.note,
    whyILikeIt: row.whyILikeIt ?? "",
    label: (FAVORITE_LABELS.some((l) => l.value === row.label)
      ? row.label
      : "recommends") as FavoriteLabel,
    featured: row.featured,
    active: row.active,
    sortOrder: String(row.sortOrder),
  };
}

function toBody(draft: Draft): Record<string, unknown> {
  return {
    name: draft.name,
    category: draft.category,
    imageUrl: draft.imageUrl || null,
    linkUrl: draft.linkUrl,
    isAffiliate: draft.isAffiliate,
    note: draft.note,
    whyILikeIt: draft.whyILikeIt || null,
    label: draft.label,
    featured: draft.featured,
    active: draft.active,
    sortOrder: Number(draft.sortOrder || 0),
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
const labelClass = "block text-xs font-medium text-muted-foreground";

/** The shared field set for both the add form and the inline edit form. */
function Fields({
  draft,
  onChange,
  idPrefix,
}: {
  draft: Draft;
  onChange: (next: Draft) => void;
  idPrefix: string;
}) {
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    onChange({ ...draft, [key]: value });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-name`} className={labelClass}>
          Name
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          required
          maxLength={160}
          value={draft.name}
          onChange={(e) => set("name", e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-category`} className={labelClass}>
          Category
        </label>
        <select
          id={`${idPrefix}-category`}
          required
          value={draft.category}
          onChange={(e) => set("category", e.target.value as FavoriteCategory)}
          className={`mt-1 ${inputClass}`}
        >
          {FAVORITE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-label`} className={labelClass}>
          Recommendation label
        </label>
        <select
          id={`${idPrefix}-label`}
          value={draft.label}
          onChange={(e) => set("label", e.target.value as FavoriteLabel)}
          className={`mt-1 ${inputClass}`}
        >
          {FAVORITE_LABELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-link`} className={labelClass}>
          Link URL
        </label>
        <input
          id={`${idPrefix}-link`}
          type="url"
          required
          placeholder="https://"
          value={draft.linkUrl}
          onChange={(e) => set("linkUrl", e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-image`} className={labelClass}>
          Image URL (optional)
        </label>
        <input
          id={`${idPrefix}-image`}
          type="text"
          placeholder="https:// or /images/..."
          value={draft.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-note`} className={labelClass}>
          Note
        </label>
        <textarea
          id={`${idPrefix}-note`}
          required
          rows={2}
          maxLength={600}
          value={draft.note}
          onChange={(e) => set("note", e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-why`} className={labelClass}>
          Why I Like It (optional)
        </label>
        <textarea
          id={`${idPrefix}-why`}
          rows={3}
          maxLength={2000}
          value={draft.whyILikeIt}
          onChange={(e) => set("whyILikeIt", e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-sort`} className={labelClass}>
          Sort order
        </label>
        <input
          id={`${idPrefix}-sort`}
          type="number"
          step={1}
          value={draft.sortOrder}
          onChange={(e) => set("sortOrder", e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Lower numbers show first within a category.
        </p>
      </div>

      <div className="flex flex-col justify-center gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.isAffiliate}
            onChange={(e) => set("isAffiliate", e.target.checked)}
          />
          Affiliate link
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured (shows first in its category)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(e) => set("active", e.target.checked)}
          />
          Active (visible on the public page)
        </label>
      </div>
    </div>
  );
}

export function AdminFavorites({ items }: { items: FavoriteRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(
    null
  );
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(EMPTY);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function send(
    method: "POST" | "PUT" | "DELETE",
    key: string,
    body?: Record<string, unknown>,
    query?: string
  ): Promise<boolean> {
    setBusy(key);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/favorites${query ?? ""}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ text: data.error ?? "Something went wrong.", error: true });
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setMessage({ text: "Could not reach the server.", error: true });
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const ok = await send("POST", "new", toBody(draft));
    if (ok) {
      setMessage({ text: `Added ${draft.name}.`, error: false });
      setDraft(EMPTY);
    }
  }

  async function save(e: React.FormEvent, id: string) {
    e.preventDefault();
    const ok = await send("PUT", id, { id, ...toBody(editDraft) });
    if (ok) {
      setMessage({ text: `Saved ${editDraft.name}.`, error: false });
      setEditingId(null);
    }
  }

  async function remove(row: FavoriteRow) {
    const ok = await send(
      "DELETE",
      row.id,
      undefined,
      `?id=${encodeURIComponent(row.id)}`
    );
    if (ok) {
      setMessage({ text: `Deleted ${row.name}.`, error: false });
      setConfirmingId(null);
    }
  }

  return (
    <div className="mt-10 space-y-8">
      {message && (
        <p
          role="status"
          className={`rounded-xl border p-4 text-sm ${
            message.error
              ? "border-destructive/40 bg-destructive/5 text-destructive"
              : "border-border bg-secondary"
          }`}
        >
          {message.text}
        </p>
      )}

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-semibold">Add item</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The note always shows on the card. Why I Like It appears under it
          when filled in. Mark the affiliate box on any link that pays a
          commission so the card carries the right link attributes.
        </p>
        <form onSubmit={add} className="mt-5 space-y-5">
          <Fields draft={draft} onChange={setDraft} idPrefix="new" />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={busy === "new"}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy === "new" ? "Adding" : "Add item"}
            </button>
          </div>
        </form>
      </section>

      <p className="text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"},{" "}
        {items.filter((i) => i.active).length} active
      </p>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
          No items yet. Add the first one above and it appears on the public
          page right away.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              {editingId === row.id ? (
                <form onSubmit={(e) => save(e, row.id)} className="space-y-5">
                  <h3 className="font-heading text-lg font-semibold">
                    Editing {row.name}
                  </h3>
                  <Fields
                    draft={editDraft}
                    onChange={setEditDraft}
                    idPrefix={`edit-${row.id}`}
                  />
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-sm text-muted-foreground underline underline-offset-4"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={busy === row.id}
                      className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {busy === row.id ? "Saving" : "Save changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {row.imageUrl ? (
                    // Admin-entered external image hosts cannot be allowlisted for next/image.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.imageUrl}
                      alt=""
                      className="size-20 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-secondary/60 font-heading text-2xl text-muted-foreground/60"
                    >
                      {row.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-lg font-semibold">
                        {row.name}
                      </h3>
                      {!row.active && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                          Inactive
                        </span>
                      )}
                      {row.featured && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-xs">
                          Featured
                        </span>
                      )}
                      {row.isAffiliate && (
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          Affiliate
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {categoryLabel(row.category)} ·{" "}
                      {recommendationLabel(row.label)} · sort {row.sortOrder} ·
                      added {formatDate(row.createdAt)}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{row.note}</p>
                    <a
                      href={row.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block max-w-full truncate text-xs text-primary underline underline-offset-4"
                    >
                      {row.linkUrl}
                    </a>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(row.id);
                        setEditDraft(toDraft(row));
                        setConfirmingId(null);
                        setMessage(null);
                      }}
                      className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-secondary"
                    >
                      Edit
                    </button>
                    {confirmingId === row.id ? (
                      <span className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={busy === row.id}
                          onClick={() => remove(row)}
                          className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-white disabled:opacity-40"
                        >
                          Delete for good
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingId(null)}
                          className="text-xs text-muted-foreground underline underline-offset-4"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmingId(row.id);
                          setMessage(null);
                        }}
                        className="text-xs text-destructive underline underline-offset-4"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

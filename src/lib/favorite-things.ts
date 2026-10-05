import type { favoriteThings } from "@/lib/db/schema";

/**
 * Shared vocabulary for Chef Henry's Favorite Things. The public page, the
 * admin form, and the API all read from here so a category or label can
 * never drift between the three.
 */

export const FAVORITE_CATEGORIES = [
  { value: "pantry-staples", label: "Pantry Staples" },
  { value: "spices-seasonings", label: "Spices, Seasonings & Flavor Builders" },
  { value: "kitchen-tools", label: "Kitchen Tools" },
  { value: "cookware-bakeware", label: "Cookware & Bakeware" },
  { value: "small-appliances", label: "Small Appliances" },
  { value: "storage-prep-organization", label: "Storage, Prep & Organization" },
  { value: "books-learning", label: "Books & Learning" },
] as const;

export type FavoriteCategory = (typeof FAVORITE_CATEGORIES)[number]["value"];

export const FAVORITE_LABELS = [
  { value: "pick", label: "Chef Henry's Pick" },
  { value: "worth-considering", label: "Worth Considering" },
] as const;

export type FavoriteLabel = (typeof FAVORITE_LABELS)[number]["value"];

export type FavoriteThing = typeof favoriteThings.$inferSelect;

export function isFavoriteCategory(value: unknown): value is FavoriteCategory {
  return FAVORITE_CATEGORIES.some((c) => c.value === value);
}

export function isFavoriteLabel(value: unknown): value is FavoriteLabel {
  return FAVORITE_LABELS.some((l) => l.value === value);
}

export function categoryLabel(value: string): string {
  return FAVORITE_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function recommendationLabel(value: string): string {
  return FAVORITE_LABELS.find((l) => l.value === value)?.label ?? value;
}

/** Only http(s) links, so a typo cannot turn a card into a javascript: link. */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Fields an admin can set. Everything else is server-owned. */
export interface FavoriteThingInput {
  name: string;
  category: FavoriteCategory;
  imageUrl: string | null;
  linkUrl: string;
  isAffiliate: boolean;
  note: string;
  whyILikeIt: string | null;
  label: FavoriteLabel;
  featured: boolean;
  active: boolean;
  sortOrder: number;
}

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/**
 * Validates a request body into a complete input, or returns the first
 * problem in words the admin form can show as-is.
 */
export function parseFavoriteThingInput(
  body: unknown
): { ok: true; value: FavoriteThingInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Nothing was submitted." };
  }
  const b = body as Record<string, unknown>;

  const name = optionalText(b.name);
  if (!name) return { ok: false, error: "Give the item a name." };
  if (name.length > 160) return { ok: false, error: "Keep the name under 160 characters." };

  if (!isFavoriteCategory(b.category)) {
    return { ok: false, error: "Choose one of the listed categories." };
  }

  const linkUrl = optionalText(b.linkUrl);
  if (!linkUrl || !isHttpUrl(linkUrl)) {
    return { ok: false, error: "Enter a full link that starts with https://." };
  }

  const imageUrl = optionalText(b.imageUrl);
  if (imageUrl && !(isHttpUrl(imageUrl) || imageUrl.startsWith("/"))) {
    return {
      ok: false,
      error: "The image needs a full https:// address or a path that starts with /.",
    };
  }

  const note = optionalText(b.note);
  if (!note) return { ok: false, error: "Add a short note about the item." };
  if (note.length > 600) return { ok: false, error: "Keep the note under 600 characters." };

  const whyILikeIt = optionalText(b.whyILikeIt);
  if (whyILikeIt && whyILikeIt.length > 2000) {
    return { ok: false, error: "Keep Why I Like It under 2000 characters." };
  }

  const label = b.label ?? "pick";
  if (!isFavoriteLabel(label)) {
    return { ok: false, error: "Choose one of the listed recommendation labels." };
  }

  const sortOrderRaw = b.sortOrder ?? 0;
  const sortOrder =
    typeof sortOrderRaw === "number"
      ? sortOrderRaw
      : typeof sortOrderRaw === "string" && sortOrderRaw.trim() !== ""
        ? Number(sortOrderRaw)
        : 0;
  if (!Number.isInteger(sortOrder) || Math.abs(sortOrder) > 100000) {
    return { ok: false, error: "Sort order has to be a whole number." };
  }

  return {
    ok: true,
    value: {
      name,
      category: b.category,
      imageUrl,
      linkUrl,
      isAffiliate: b.isAffiliate === true,
      note,
      whyILikeIt,
      label,
      featured: b.featured === true,
      active: b.active !== false,
      sortOrder,
    },
  };
}

/**
 * Display order for the public page: by category in the fixed list order,
 * then featured first, then sort order, then oldest first so new items do
 * not jump ahead of ones Henry already arranged.
 */
export function sortForDisplay(items: FavoriteThing[]): FavoriteThing[] {
  const rank = new Map<string, number>(
    FAVORITE_CATEGORIES.map((c, i) => [c.value, i])
  );
  return [...items].sort((a, b) => {
    const ca = rank.get(a.category) ?? 99;
    const cb = rank.get(b.category) ?? 99;
    if (ca !== cb) return ca - cb;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

/** Groups already-sorted items by category, keeping category order. */
export function groupByCategory(
  items: FavoriteThing[]
): { category: FavoriteCategory; label: string; items: FavoriteThing[] }[] {
  return FAVORITE_CATEGORIES.map((c) => ({
    category: c.value,
    label: c.label,
    items: items.filter((i) => i.category === c.value),
  })).filter((g) => g.items.length > 0);
}

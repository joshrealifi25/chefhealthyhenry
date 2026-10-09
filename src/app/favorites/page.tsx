import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db, favoriteThings } from "@/lib/db";
import {
  groupByCategory,
  sortForDisplay,
  type FavoriteThing,
} from "@/lib/favorite-things";
import { FavoritesList } from "@/components/favorites-list";

export const metadata: Metadata = {
  title: "Favorite Things",
  description:
    "A curated look inside Chef Henry's kitchen, pantry, bookshelf, and cooking setup: the ingredients, tools, cookware, and books he uses and recommends.",
};

// Items live in the database and change without a deploy.
export const dynamic = "force-dynamic";

const DISCLOSURE =
  "Some links on this page may be affiliate links. Chef Healthy Henry may receive a small commission at no additional cost to you. Products are recommended because Chef Henry genuinely uses, trusts, or believes they are worth sharing.";

/**
 * The list of active items, or an empty list if the database is not
 * reachable. A public page should never 500 because an admin table is
 * missing on a preview branch.
 */
async function loadActiveItems(): Promise<FavoriteThing[]> {
  try {
    const rows = await db()
      .select()
      .from(favoriteThings)
      .where(eq(favoriteThings.active, true));
    return sortForDisplay(rows);
  } catch (err) {
    console.error("Favorites: could not load items", err);
    return [];
  }
}

export default async function FavoritesPage() {
  const items = await loadActiveItems();
  const groups = groupByCategory(items);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl text-balance">
          Chef Henry&apos;s Favorite Things
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A curated look inside Chef Henry&apos;s kitchen, pantry, bookshelf,
          and cooking setup.
        </p>
      </div>

      <p
        role="note"
        className="mt-8 max-w-3xl rounded-2xl border border-border bg-secondary/40 px-5 py-4 text-sm leading-relaxed text-muted-foreground"
      >
        {DISCLOSURE}
      </p>

      {groups.length === 0 ? (
        <div className="mt-16 max-w-xl rounded-2xl border border-dashed border-border bg-card p-10">
          <p className="font-heading text-2xl font-semibold">
            The shelves are being stocked.
          </p>
          <p className="mt-3 text-muted-foreground">
            Chef Henry is choosing the first round of pantry staples, tools,
            and books worth sharing. Check back soon.
          </p>
        </div>
      ) : (
        <FavoritesList
          items={items.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            note: item.note,
            whyILikeIt: item.whyILikeIt,
            label: item.label,
            linkUrl: item.linkUrl,
            isAffiliate: item.isAffiliate,
          }))}
          categories={groups.map((group) => ({
            value: group.category,
            label: group.label,
          }))}
        />
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db, favoriteThings } from "@/lib/db";
import {
  groupByCategory,
  recommendationLabel,
  sortForDisplay,
  type FavoriteThing,
} from "@/lib/favorite-things";
import { OpensInNewWindow } from "@/components/opens-in-new-window";

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

function LabelBadge({ label }: { label: string }) {
  const tone =
    label === "pick"
      ? "bg-primary text-primary-foreground"
      : "bg-secondary text-secondary-foreground";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${tone}`}
    >
      {recommendationLabel(label)}
    </span>
  );
}

function ItemCard({ item }: { item: FavoriteThing }) {
  const rel = item.isAffiliate ? "nofollow noopener noreferrer" : "noopener noreferrer";
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-1 flex-col p-6">
        <LabelBadge label={item.label} />
        <h3 className="mt-3 font-heading text-xl font-semibold">{item.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {item.note}
        </p>
        {item.whyILikeIt && (
          <div className="mt-4 border-l-2 border-primary/40 pl-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Why I like it
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.whyILikeIt}
            </p>
          </div>
        )}
        <div className="mt-auto pt-6">
          <a
            href={item.linkUrl}
            target="_blank"
            rel={rel}
            className="inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            See it →
            <OpensInNewWindow />
          </a>
        </div>
      </div>
    </article>
  );
}

export default async function FavoritesPage() {
  const items = await loadActiveItems();
  const groups = groupByCategory(items);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl text-balance">
          Chef Henry&apos;s Favorite Things
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          A curated look inside Chef Henry&apos;s kitchen, pantry, bookshelf,
          and cooking setup.
        </p>
      </div>

      <p
        role="note"
        className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border bg-secondary/40 px-5 py-4 text-center text-sm leading-relaxed text-muted-foreground"
      >
        {DISCLOSURE}
      </p>

      {groups.length === 0 ? (
        <div className="mx-auto mt-16 max-w-xl rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-2xl font-semibold">
            The shelves are being stocked.
          </p>
          <p className="mt-3 text-muted-foreground">
            Chef Henry is choosing the first round of pantry staples, tools,
            and books worth sharing. Check back soon.
          </p>
        </div>
      ) : (
        <>
          <nav
            aria-label="Categories"
            className="mt-10 flex flex-wrap justify-center gap-2"
          >
            {groups.map((g) => (
              <a
                key={g.category}
                href={`#${g.category}`}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {g.label}
              </a>
            ))}
          </nav>

          {groups.map((g) => (
            <section
              key={g.category}
              id={g.category}
              className="mt-16 scroll-mt-24"
            >
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                {g.label}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}

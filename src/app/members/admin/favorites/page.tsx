import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { desc } from "drizzle-orm";
import { getAdmin } from "@/lib/admin";
import { db, favoriteThings } from "@/lib/db";
import { AdminFavorites, type FavoriteRow } from "@/components/admin-favorites";

export const metadata: Metadata = {
  title: "Favorite Things",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminFavoritesPage() {
  const admin = await getAdmin();
  // A 404 rather than a redirect: someone without access should not learn
  // that this page exists.
  if (!admin) notFound();

  const rows = await db()
    .select()
    .from(favoriteThings)
    .orderBy(desc(favoriteThings.createdAt));

  const items: FavoriteRow[] = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Admin
      </p>
      <h1 className="mt-1 font-heading text-4xl font-semibold tracking-tight">
        Favorite Things
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Everything on the public Favorite Things page, newest first. Items
        marked inactive stay here but do not show to visitors.
      </p>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <Link
          href="/favorites"
          className="text-primary underline underline-offset-4"
        >
          View the public page
        </Link>
        <Link
          href="/members/admin"
          className="text-muted-foreground underline underline-offset-4 hover:text-primary"
        >
          Accounts
        </Link>
      </p>

      <AdminFavorites items={items} />
    </div>
  );
}

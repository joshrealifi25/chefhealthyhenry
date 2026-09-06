import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMember, loginPath } from "@/lib/auth";
import {
  LIBRARY_CATEGORIES,
  LATEST_SLUG,
  libraryItems,
  categoryFromSlug,
} from "@/lib/lessons";
import { LibraryCard } from "@/components/library-card";

export const metadata: Metadata = {
  title: "Member Library",
  description:
    "Every Protein Flip™ Kitchen Application Lesson and Kitchen Guide, in one place.",
};

export const dynamic = "force-dynamic";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const member = await getMember();
  if (!member) {
    redirect(
      loginPath(
        category
          ? `/members/library?category=${encodeURIComponent(category)}`
          : "/members/library"
      )
    );
  }
  if (!member.tier) redirect("/membership");

  const active =
    category && categoryFromSlug(category) ? category : LATEST_SLUG;
  const items = libraryItems(active);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Member Library
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every Application Lesson and Kitchen Guide, gathered in one place.
          Lessons teach the decisions behind good cooking. Guides are the
          one-page references you keep next to the stove.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {LIBRARY_CATEGORIES.map((c) => {
            const isActive = c.slug === active;
            return (
              <Link
                key={c.slug}
                href={
                  c.slug === LATEST_SLUG
                    ? "/members/library"
                    : `/members/library?category=${c.slug}`
                }
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "rounded-full border border-primary bg-primary px-4 py-1.5 text-sm text-primary-foreground"
                    : "rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                }
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {items.map((item) => (
            <LibraryCard key={`${item.kind}-${item.slug}`} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-16 max-w-xl text-muted-foreground">
          Nothing in this category yet. New lessons and guides are added every
          month.{" "}
          <Link href="/members/library" className="text-primary hover:underline">
            See everything
          </Link>
          .
        </p>
      )}
    </div>
  );
}

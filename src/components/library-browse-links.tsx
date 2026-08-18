import Link from "next/link";

/**
 * The two standing browse links every lesson and guide page carries, per the
 * Member Library Navigation spec. They appear whether or not the current page
 * has a related Kitchen Guide.
 */
export function LibraryBrowseLinks({ guidesSlug }: { guidesSlug: string }) {
  return (
    <nav
      aria-label="Browse the member library"
      className="mt-14 flex flex-wrap gap-3 border-t border-border pt-6"
    >
      <Link
        href="/members/library"
        className="rounded-full border border-border px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
      >
        Browse all lessons
      </Link>
      <Link
        href={`/members/library?category=${guidesSlug}`}
        className="rounded-full border border-border px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
      >
        Browse all guides
      </Link>
    </nav>
  );
}

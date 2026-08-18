import Link from "next/link";
import type { LibraryItem } from "@/lib/lessons";

/** One lesson or Kitchen Guide teaser in the member library grid. */
export function LibraryCard({ item }: { item: LibraryItem }) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center gap-2">
        {item.kind === "guide" && (
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium">
            Kitchen Guide
          </span>
        )}
        {item.categories
          .filter((c) => c !== "Kitchen Guides")
          .map((c) => (
            <span key={c} className="text-xs text-muted-foreground">
              {c}
            </span>
          ))}
      </div>
      <h2 className="mt-3 font-heading text-xl font-semibold tracking-tight">
        <Link href={item.href} className="hover:text-primary">
          {item.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {item.blurb}
      </p>
      <Link
        href={item.href}
        className="mt-4 text-sm font-medium text-primary hover:underline"
      >
        {item.kind === "guide" ? "Open the Kitchen Guide" : "Read the lesson"}
      </Link>
    </article>
  );
}

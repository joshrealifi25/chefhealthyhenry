import type { Metadata } from "next";
import Link from "next/link";
import { exploreCards, EXPLORE_COLLECTIONS } from "@/lib/explore";
import { ExploreCard } from "@/components/explore-card";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Quick-hit ingredient explainers, flavor building blocks, and kitchen skills from Chef Healthy Henry: what it is, how to use it, and where to cook with it.",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Explore
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Practical guidance for cooking with more confidence, curiosity, and
          intention. Discover new ingredients, build better flavor,
          strengthen your kitchen skills, make smarter grocery choices, and
          learn how the Protein Flip™ Method can help you create balanced,
          satisfying meals.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {EXPLORE_COLLECTIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/explore/${c.slug}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {exploreCards.length > 0 ? (
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {exploreCards.map((card) => (
            <ExploreCard key={card.slug} card={card} />
          ))}
        </div>
      ) : (
        <p className="mt-16 max-w-xl text-muted-foreground">
          New cards are on the way. Check back soon, or browse{" "}
          <Link href="/recipes" className="text-primary hover:underline">
            recipes
          </Link>{" "}
          and the{" "}
          <Link href="/blog" className="text-primary hover:underline">
            blog
          </Link>{" "}
          in the meantime.
        </p>
      )}
    </div>
  );
}

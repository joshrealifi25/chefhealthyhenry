import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  EXPLORE_COLLECTIONS,
  collectionFromSlug,
  exploreCardsByCollection,
} from "@/lib/explore";
import { ExploreCard } from "@/components/explore-card";

// Per-collection copy, matching the descriptions from the section brief.
const COLLECTION_COPY: Record<string, string> = {
  "Ingredient Adventures":
    "Unfamiliar or underused ingredients: what it is, and how to use it.",
  "Flavor Builders":
    "What makes healthier food taste satisfying: vinegars, herbs, chiles, spice blends, citrus, umami, and finishing touches.",
  "Kitchen Skills":
    "Technique explainers: the small moves that make a real difference at the stove.",
  "Protein Flip™ Foundations":
    "The Protein Flip™ method itself, broken into digestible pieces.",
  "Seasonal Kitchen":
    "Garden and produce notes: what's in season, and what to do with it.",
  "Grocery Intelligence":
    "Buying decisions: which version to buy, and whether it's worth it.",
};

export function generateStaticParams() {
  return EXPLORE_COLLECTIONS.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const name = collectionFromSlug(collection);
  if (!name) return {};
  return {
    title: name,
    description: COLLECTION_COPY[name] ?? `${name} on Chef Healthy Henry.`,
  };
}

export default async function ExploreCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const name = collectionFromSlug(collection);
  if (!name) notFound();

  const cards = exploreCardsByCollection(name);
  const description = COLLECTION_COPY[name] ?? `${name} on Chef Healthy Henry.`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          <Link href="/explore" className="hover:underline">
            Explore
          </Link>{" "}
          / {name}
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          {name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {EXPLORE_COLLECTIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/explore/${c.slug}`}
              className={
                c.name === name
                  ? "rounded-full border border-primary bg-primary px-4 py-1.5 text-sm text-primary-foreground"
                  : "rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40"
              }
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {cards.length > 0 ? (
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {cards.map((card) => (
            <ExploreCard key={card.slug} card={card} />
          ))}
        </div>
      ) : (
        <p className="mt-16 max-w-xl text-muted-foreground">
          No {name} cards yet. Check back soon.
        </p>
      )}
    </div>
  );
}

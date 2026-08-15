import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  exploreCards,
  getExploreCard,
  hasArticle,
  collectionSlug,
  recipesForCard,
  ingredientTagForCard,
} from "@/lib/explore";
import { getPost } from "@/lib/posts";
import { ContentBlocks } from "@/components/content-blocks";

export function generateStaticParams() {
  return exploreCards.filter(hasArticle).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = getExploreCard(slug);
  if (!card || !hasArticle(card)) return {};
  return {
    title: card.title,
    description: card.blurb,
    openGraph: {
      title: card.title,
      description: card.blurb,
      type: "article",
      images: card.hero ? [card.hero] : undefined,
    },
  };
}

export default async function ExploreArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = getExploreCard(slug);
  if (!card || !hasArticle(card)) notFound();

  const teaserRecipes = recipesForCard(card);
  const seeAllTag = ingredientTagForCard(card);
  const relatedPost = card.relatedPostSlug ? getPost(card.relatedPostSlug) : undefined;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> All guides
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap gap-2">
          {card.collections.map((name) => {
            const slug = collectionSlug(name);
            return slug ? (
              <Link
                key={name}
                href={`/explore/${slug}`}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground hover:bg-secondary/70"
              >
                {name}
              </Link>
            ) : null;
          })}
        </div>
        <h1 className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {card.title}
        </h1>
        {card.subtitle && (
          <p className="mt-3 font-heading text-lg italic text-muted-foreground">
            {card.subtitle}
          </p>
        )}
      </header>

      {card.hero && (
        <div className="relative mt-8 aspect-square overflow-hidden rounded-2xl shadow-md">
          <Image
            src={card.hero}
            alt={card.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-8">
        <ContentBlocks blocks={card.blocks ?? []} />
      </div>

      {teaserRecipes.length > 0 && (
        <div className="mt-10 border-t border-border pt-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Try it in
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {teaserRecipes.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/recipes/${r.slug}`}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground/90 hover:border-primary/40 hover:text-primary"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
          {seeAllTag && (
            <Link
              href={`/recipes/ingredient/${card.slug}`}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              See all {seeAllTag} recipes <ArrowUpRight className="size-3.5" />
            </Link>
          )}
        </div>
      )}

      {card.productLinks.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {card.productLinks.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
            >
              {p.name} <ArrowUpRight className="size-3.5" />
            </a>
          ))}
        </div>
      )}

      {relatedPost && (
        <Link
          href={`/post/${relatedPost.slug}`}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Read the full {relatedPost.category} post <ArrowUpRight className="size-3.5" />
        </Link>
      )}

      {card.cta && (
        <div className="mt-12 rounded-3xl bg-primary px-8 py-12 text-center text-primary-foreground">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            {card.cta.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">{card.cta.text}</p>
          <Link
            href={card.cta.href}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-card px-7 py-3 font-medium text-primary transition-opacity hover:opacity-90"
          >
            {card.cta.label} <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}
    </article>
  );
}

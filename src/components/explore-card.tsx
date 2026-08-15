import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  type ExploreCard as ExploreCardData,
  collectionSlug,
  recipesForCard,
  ingredientTagForCard,
  hasArticle,
} from "@/lib/explore";
import { getPost } from "@/lib/posts";
import { YouTubeEmbed } from "@/components/youtube-embed";

export function ExploreCard({ card }: { card: ExploreCardData }) {
  const teaserRecipes = recipesForCard(card);
  const seeAllTag = ingredientTagForCard(card);
  const relatedPost = card.relatedPostSlug ? getPost(card.relatedPostSlug) : undefined;
  const article = hasArticle(card);
  const heroHref = article ? `/explore/article/${card.slug}` : undefined;

  return (
    <article className="overflow-hidden rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60 sm:p-7">
      {card.hero && (
        <Link
          href={heroHref ?? "#"}
          aria-hidden={!heroHref}
          tabIndex={heroHref ? undefined : -1}
          className={`-mx-6 -mt-6 mb-5 block aspect-square overflow-hidden sm:-mx-7 sm:-mt-7 ${heroHref ? "" : "pointer-events-none"}`}
        >
          <Image
            src={card.hero}
            alt={card.title}
            width={800}
            height={800}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="size-full object-cover"
          />
        </Link>
      )}
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

      <h3 className="mt-3 font-heading text-xl font-semibold leading-snug sm:text-2xl">
        {card.title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        {card.blurb}
      </p>

      {article && (
        <Link
          href={`/explore/article/${card.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Read the full guide <ArrowUpRight className="size-3.5" />
        </Link>
      )}

      {card.videoId && (
        <div className="mt-5">
          <YouTubeEmbed videoId={card.videoId} title={card.title} />
        </div>
      )}

      {teaserRecipes.length > 0 && (
        <div className="mt-5">
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
        <div className="mt-5 flex flex-wrap gap-2">
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
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Read the full {relatedPost.category} post <ArrowUpRight className="size-3.5" />
        </Link>
      )}
    </article>
  );
}

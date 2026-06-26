import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  postCategories,
  postsByCategory,
  categoryFromSlug,
} from "@/lib/posts";
import { PostCard } from "@/components/post-card";

// Per-category copy (ported from the original static category pages).
const CATEGORY_COPY: Record<string, { description: string; meta: string }> = {
  "Chef's Notes": {
    description:
      "Technique, philosophy, and kitchen thinking from Henry: how the Protein Flip™ works, why it works, and how to make it your own.",
    meta:
      "Chef Healthy Henry's notes on cooking technique, the Protein Flip™ method, and building a healthier plate without giving up the food you love.",
  },
  "Table Talk": {
    description:
      "Stories about food, family, and the conversations that happen when you slow down and share a meal together.",
    meta:
      "Table Talk with Chef Healthy Henry: stories about food, family, and the moments that happen around a shared meal.",
  },
};

export function generateStaticParams() {
  return postCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = categoryFromSlug(category);
  if (!name) return {};
  return {
    title: name,
    description:
      CATEGORY_COPY[name]?.meta ??
      `${name} essays from Chef Healthy Henry on cooking and the Protein Flip™ method.`,
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const name = categoryFromSlug(category);
  if (!name) notFound();

  const categoryPosts = postsByCategory(name);
  const description =
    CATEGORY_COPY[name]?.description ??
    `Essays in ${name} from Chef Healthy Henry.`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>{" "}
          / {name}
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          {name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {postCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/${c.slug}`}
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

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categoryPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

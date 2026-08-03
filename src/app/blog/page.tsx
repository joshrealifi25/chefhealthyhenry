import type { Metadata } from "next";
import Link from "next/link";
import { posts, postCategories } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const metadata: Metadata = {
  title: "Recipes & Cooking Tips Blog",
  description:
    "Cooking tips, nutrition guides, and behind-the-scenes stories from Chef Healthy Henry, practical, protein-forward advice for real home cooks.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Notes from the kitchen
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Essays on cooking, satiety, and building a healthier plate, written
          the way Henry teaches: honestly, generously, and with flavor first.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {postCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/${c.slug}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { postsByCategory } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const metadata: Metadata = {
  title: "Table Talk",
  description:
    "Table Talk with Chef Healthy Henry: stories about food, family, and the moments that happen around a shared meal.",
};

export default function TableTalkPage() {
  const tableTalkPosts = postsByCategory("Table Talk");
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>{" "}
          / Table Talk
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Table Talk
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Stories about food, family, and the conversations that happen when
          you slow down and share a meal together.
        </p>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tableTalkPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

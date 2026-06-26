import type { Metadata } from "next";
import Link from "next/link";
import { postsByCategory } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const metadata: Metadata = {
  title: "Chef's Notes",
  description:
    "Chef Healthy Henry's notes on cooking technique, the Protein Flip™ method, and building a healthier plate without giving up the food you love.",
};

export default function ChefsNotesPage() {
  const notePosts = postsByCategory("Chef's Notes");
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>{" "}
          / Chef&apos;s Notes
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Chef&apos;s Notes
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Technique, philosophy, and kitchen thinking from Henry: how the
          Protein Flip™ works, why it works, and how to make it your own.
        </p>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {notePosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

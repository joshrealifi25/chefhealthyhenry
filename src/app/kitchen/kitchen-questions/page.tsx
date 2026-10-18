import type { Metadata } from "next";
import Link from "next/link";
import { postsByCategory } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const metadata: Metadata = {
  title: "Kitchen Questions",
  description:
    "Short answers to specific cooking questions from Chef Healthy Henry.",
  alternates: { canonical: "/kitchen/kitchen-questions" },
};

const TABS = [
  { name: "Kitchen Guides", href: "/kitchen" },
  { name: "Kitchen Questions", href: "/kitchen/kitchen-questions" },
];

export default function KitchenQuestionsPage() {
  const questions = postsByCategory("Kitchen Questions");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          <Link href="/kitchen" className="hover:underline">
            In the Kitchen
          </Link>{" "}
          / Kitchen Questions
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Kitchen Questions
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Short answers to specific cooking questions, then the recipes and
          membership that help you use them.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={
                tab.href === "/kitchen/kitchen-questions"
                  ? "rounded-full border border-primary bg-primary px-4 py-1.5 text-sm text-primary-foreground"
                  : "rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              }
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {questions.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { kitchenGuides } from "@/lib/kitchen-guides";
import { KitchenGuideCard } from "@/components/kitchen-guide-card";

export const metadata: Metadata = {
  title: "In the Kitchen",
  description:
    "Practical cooking guides, ingredient breakdowns, and kitchen Q&A from Chef Healthy Henry.",
  alternates: { canonical: "/kitchen" },
};

const TABS = [
  { name: "Kitchen Guides", href: "/kitchen" },
  { name: "Kitchen Questions", href: "/kitchen/kitchen-questions" },
];

export default function KitchenPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          In the Kitchen
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Practical guides for home cooks: how to work with ingredients, make
          smart grocery decisions, and build better meals.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={
                tab.href === "/kitchen"
                  ? "rounded-full border border-primary bg-primary px-4 py-1.5 text-sm text-primary-foreground"
                  : "rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              }
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>

      {kitchenGuides.length === 0 ? (
        <p className="mt-16 text-muted-foreground">Guides coming soon.</p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {kitchenGuides.map((guide) => (
            <KitchenGuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      )}
    </div>
  );
}

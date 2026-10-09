"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  categoryLabel,
  recommendationLabel,
} from "@/lib/favorite-things";
import { OpensInNewWindow } from "@/components/opens-in-new-window";

export type FavoriteCardData = {
  id: string;
  name: string;
  category: string;
  note: string;
  whyILikeIt: string | null;
  label: string;
  linkUrl: string;
  isAffiliate: boolean;
};

const ALL = "all";

function isJustBetter(item: FavoriteCardData): boolean {
  return item.name.toLowerCase().includes("just better");
}

function LabelBadge({ label }: { label: string }) {
  const tone =
    label === "pick"
      ? "bg-primary text-primary-foreground"
      : "bg-secondary text-secondary-foreground";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${tone}`}
    >
      {recommendationLabel(label)}
    </span>
  );
}

function ItemCard({ item }: { item: FavoriteCardData }) {
  const rel = item.isAffiliate
    ? "nofollow noopener noreferrer"
    : "noopener noreferrer";
  return (
    <article className="flex flex-col rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60 sm:p-7">
      <div className="flex flex-wrap gap-2">
        <LabelBadge label={item.label} />
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground">
          {categoryLabel(item.category)}
        </span>
      </div>
      <h2 className="mt-3 font-heading text-xl font-semibold leading-snug sm:text-2xl">
        {item.name}
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        {item.note}
      </p>
      {item.whyILikeIt && (
        <div className="mt-4 border-l-2 border-primary/40 pl-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Why I like it
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {item.whyILikeIt}
          </p>
        </div>
      )}
      <div className="mt-auto pt-6">
        <a
          href={item.linkUrl}
          target="_blank"
          rel={rel}
          className="inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          See it →
          <OpensInNewWindow />
        </a>
      </div>
    </article>
  );
}

export function FavoritesList({
  items,
  categories,
}: {
  items: FavoriteCardData[];
  categories: { value: string; label: string }[];
}) {
  const [active, setActive] = useState(ALL);
  const matching =
    active === ALL ? items : items.filter((item) => item.category === active);
  const visible = [
    ...matching.filter(isJustBetter),
    ...matching.filter((item) => !isJustBetter(item)),
  ];

  return (
    <>
      <div
        role="group"
        aria-label="Filter by category"
        className="mt-6 flex flex-wrap gap-3"
      >
        <button
          type="button"
          onClick={() => setActive(ALL)}
          aria-pressed={active === ALL}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition-colors",
            active === ALL
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => setActive(category.value)}
            aria-pressed={active === category.value}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              active === category.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {visible.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}

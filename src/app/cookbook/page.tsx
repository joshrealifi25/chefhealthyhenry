import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { flagship, cookbooks } from "@/data/cookbooks";

export const metadata: Metadata = {
  title: "Cookbooks & Guides",
  description:
    "The Protein Flip™ Deluxe Edition cookbook plus seasonal collections, the GLP-1 & Bariatric Success Guide, The Family Flip™, and the Dining Out Guide, from $8.99.",
};

export default function CookbookPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Flagship */}
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl shadow-xl">
          <Image
            src={flagship.image}
            alt={`${flagship.title} cover`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="absolute left-4 top-4 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
            {flagship.badge}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            {flagship.tagline}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            {flagship.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {flagship.description}
          </p>
          <ul className="mt-6 space-y-3 text-muted-foreground">
            {[
              "The complete Protein Flip™ framework, step by step",
              "Built for home cooks and bariatric/GLP-1 journeys alike",
              "Works by addition and proportion, never restriction",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <Check className="mt-1 size-4 shrink-0 text-primary" />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            {flagship.formats?.map((f) => (
              <a
                key={f.name}
                href={f.buyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {f.name} · {f.price} <ArrowRight className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Companion guides */}
      <div className="mt-24">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Companion guides &amp; seasonal collections
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Focused guides that take the Protein Flip™ everywhere the Deluxe
            Edition doesn&apos;t reach: restaurants, family dinners, GLP-1
            journeys, and every season.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cookbooks.map((book) => (
            <div
              key={book.slug}
              className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={book.image}
                  alt={`${book.title} cover`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                {book.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                    {book.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {book.tagline}
                </p>
                <h3 className="mt-1 font-heading text-xl font-semibold leading-snug">
                  {book.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {book.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-heading text-2xl font-semibold text-primary">
                    {book.price}
                  </span>
                  <a
                    href={book.buyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Buy now <ArrowRight className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        Orders are fulfilled securely through chefhealthyhenry.com.
      </p>
    </div>
  );
}

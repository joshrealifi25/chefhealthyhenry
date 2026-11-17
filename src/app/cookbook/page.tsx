import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { flagship, cookbooks, whenNothingSoundsGood, samplerFree } from "@/data/cookbooks";

/** Site paths open here. Checkout and external buy links open in a new tab. */
function opensInSameTab(buyUrl: string): boolean {
  return buyUrl.startsWith("/") && !buyUrl.startsWith("/api/");
}

export const metadata: Metadata = {
  title: "Protein Flip™ Cookbook",
  description:
    "The Protein Flip™ Cookbook: real recipes built around Henry's signature protein-flip method, high-protein comfort food without the fuss. Get your copy today.",
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

      {/* When Nothing Sounds Good: featured pair */}
      <div className="mt-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            When nothing sounds good
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for low-appetite days
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Start with the free sampler to see if it fits, or go straight to the full guide.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-2 ring-primary/20">
            <div className="relative aspect-[4/3] bg-muted">
              <Image
                src={whenNothingSoundsGood.image}
                alt={`${whenNothingSoundsGood.title} cover`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
              {whenNothingSoundsGood.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                  {whenNothingSoundsGood.badge}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {whenNothingSoundsGood.tagline}
              </p>
              <h3 className="mt-1 font-heading text-xl font-semibold leading-snug">
                {whenNothingSoundsGood.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {whenNothingSoundsGood.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-heading text-2xl font-semibold text-primary">
                  {whenNothingSoundsGood.price}
                </span>
                <a
                  href={whenNothingSoundsGood.buyUrl}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Buy now <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
            <div className="relative aspect-[4/3] bg-muted">
              <Image
                src={samplerFree.image}
                alt={`${samplerFree.title} cover`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
              {samplerFree.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                  {samplerFree.badge}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {samplerFree.tagline}
              </p>
              <h3 className="mt-1 font-heading text-xl font-semibold leading-snug">
                {samplerFree.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {samplerFree.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-heading text-2xl font-semibold text-primary">
                  {samplerFree.price}
                </span>
                <a
                  href={samplerFree.buyUrl}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Get it free <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Companion guides */}
      <div className="mt-24">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            More guides &amp; seasonal collections
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Focused guides that take the Protein Flip™ everywhere: restaurants, family
            dinners, GLP-1 journeys, and every season.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cookbooks.map((book) => (
            <div
              key={book.slug}
              id={book.slug}
              className="flex scroll-mt-24 flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60"
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
                    {...(opensInSameTab(book.buyUrl)
                      ? {}
                      : { target: "_blank", rel: "noreferrer" })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {book.price === "Free" ? "Get it free" : "Buy now"}{" "}
                    <ArrowRight className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        Secure checkout powered by Stripe. Digital guides are delivered by
        email right after purchase. Our books share cooking guidance, not
        medical advice. See the{" "}
        <Link
          href="/disclaimer"
          className="text-primary hover:underline"
        >
          Health &amp; Nutrition Disclaimer
        </Link>
        .
      </p>
    </div>
  );
}

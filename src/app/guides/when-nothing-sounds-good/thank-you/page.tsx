import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { flagship } from "@/data/cookbooks";
import { wnsgGuidePurchase } from "@/lib/guide-purchase";
import { TrackGuidePurchase } from "@/components/track-guide-purchase";

export const metadata: Metadata = {
  title: "Your guide",
  description:
    "Your download is on the way. Open The Appetite Compass first, then see the Deluxe Edition.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function GuideThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const purchase = sessionId ? await wnsgGuidePurchase(sessionId) : null;
  const digital = flagship.formats?.find((format) => format.name === "Digital PDF");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24">
      {purchase ? (
        <TrackGuidePurchase value={purchase.value} currency={purchase.currency} />
      ) : null}
      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        Your guide is ready
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Check your email for the download link. It usually arrives within a
        couple of minutes. The link works for 7 days, so save the file once
        you open it.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-semibold tracking-tight">
        Open The Appetite Compass first
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        It is the page titled The Appetite Compass, before any recipe. Name
        what feels hard right now: little interest in food, strong smells,
        food that feels heavy, chewing that sounds tiring, or food that all
        seems bland. Then pick one lane: cold and mild, warm and soft, crisp
        and fresh, bright and light, or five minutes.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-semibold tracking-tight">
        The full method
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        This guide is the plan for hard days. The book below is the system
        for ordinary weeks.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60 sm:grid sm:grid-cols-[148px_1fr]">
        <div className="relative aspect-[3/4] sm:aspect-auto sm:min-h-full">
          <Image
            src={flagship.image}
            alt=""
            fill
            sizes="148px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {flagship.tagline}
          </p>
          <h3 className="mt-1 font-heading text-xl font-semibold leading-snug">
            {flagship.title}
          </h3>
          {digital ? (
            <a
              href={digital.buyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {digital.name} · {digital.price} <ArrowRight className="size-4" />
            </a>
          ) : null}
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Cooking guidance, not medical advice. See the{" "}
        <Link href="/disclaimer" className="text-primary hover:underline">
          Health &amp; Nutrition Disclaimer
        </Link>
        .
      </p>
    </div>
  );
}

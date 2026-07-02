import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Health & Nutrition Disclaimer",
  description:
    "Chef Healthy Henry's content is for informational purposes only and is not medical advice. Read this before making changes to your diet, especially on GLP-1 medications or after bariatric surgery.",
};

const LAST_UPDATED = "July 1, 2026";

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Health &amp; Nutrition Disclaimer
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {LAST_UPDATED}
      </p>

      <h2 className="mt-10 font-heading text-2xl font-semibold">
        We are cooks, not your doctors
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Everything on this site and in our books and guides, including
        recipes, the Protein Flip™ method, and discussions of protein,
        satiety, and blood sugar, is shared for general informational and
        educational purposes only. It reflects Henry&apos;s experience as a
        chef and his own health journey. It is not medical advice, nutrition
        therapy, or a substitute for care from a physician, registered
        dietitian, or other qualified health professional.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        If you are on GLP-1 medication or have had bariatric surgery
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Some of our content speaks to people on medications such as Ozempic,
        Wegovy, Zepbound, Mounjaro, or tirzepatide, and to people on a
        bariatric journey. These are medical treatments with individual
        requirements. Nothing we publish replaces the guidance of your
        prescribing doctor, surgeon, or care team. Always follow their
        instructions about protein targets, portion sizes, food progression,
        and supplements, and talk to them before making changes to how you
        eat.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Allergies and ingredients
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        You are responsible for checking every ingredient in every recipe
        against your own allergies, intolerances, and dietary requirements.
        Ingredient formulations change, so check labels on the products you
        buy. Any nutrition information we mention is an estimate, not a
        laboratory analysis.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Results vary
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Henry&apos;s transformation is his own story. Individual results from
        any way of eating vary with health status, medications, activity, and
        many other factors. No outcome is promised or implied.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">Questions</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        If you are unsure whether a recipe or approach fits your situation,
        ask your health professional first. For anything else,{" "}
        <Link href="/contact" className="text-primary underline underline-offset-2">
          contact us
        </Link>
        .
      </p>
    </div>
  );
}

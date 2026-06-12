import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Leaf, Scale } from "lucide-react";
import { recipes } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipe-card";
import { NewsletterForm } from "@/components/newsletter-form";

const featuredSlugs = [
  "seared-salmon-with-warm-tomato-white-bean-vinaigrette",
  "spicy-chicken-french-lentil-bowl",
  "marry-me-chickpea-soup-with-kale-zptq5",
  "korean-inspired-gochujang-glazed-salmon-with-garlic-spinach-5ay5k",
  "grilled-peach-salad-with-marinated-chicken-blakc-rice-75hzb",
  "royal-tempeh-sweet-potato-tacos-with-chili-lime-yogurt-protein-flip-tm-weeknight-meal",
];

const stats = [
  { value: "220+", label: "Tailored recipes" },
  { value: "200+", label: "People coached" },
  { value: "1.3M", label: "Monthly reach" },
];

export default function HomePage() {
  const featured = featuredSlugs
    .map((slug) => recipes.find((r) => r.slug === slug))
    .filter((r) => r !== undefined);
  const hero = recipes.find(
    (r) => r.slug === "seared-salmon-with-warm-tomato-white-bean-vinaigrette"
  );

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            A Healthy &amp; Tasty Life
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Most recipes guess.
            <br />
            <em className="text-primary">Ours know.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Nutrition-smart cooking built on the Protein Flip™ method. Keep
            the flavors you love while staying full longer and keeping blood
            sugar steady. No calorie counting required.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse Recipes <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/cookbook"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3 font-medium transition-colors hover:bg-secondary"
            >
              Get the Cookbook
            </Link>
          </div>
        </div>
        {hero?.image && (
          <div className="relative aspect-square overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={hero.image}
              alt={hero.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-4 py-12 text-center sm:px-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-3xl font-semibold text-primary sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Method */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            The Protein Flip™ Method
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Most health cookbooks work by subtraction, cutting out the foods
            you love. The Protein Flip works by addition and proportion.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Scale,
              title: "Redistribute the plate",
              text: "Keep the meat, carbs, and bold spices you love, rebalanced so protein leads and satiety follows.",
            },
            {
              icon: Leaf,
              title: "No counting, no cutting",
              text: "Skip the calorie math. Portion-smart proportions keep blood sugar stable, plate by plate.",
            },
            {
              icon: BookOpen,
              title: "A framework for life",
              text: "Whether you're a home cook or on a bariatric/GLP-1 journey, build kitchen confidence that lasts.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border/60"
            >
              <f.icon className="size-8 text-primary" />
              <h3 className="mt-4 font-heading text-xl font-semibold">
                {f.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured recipes */}
      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Fresh from the kitchen
              </h2>
              <p className="mt-2 text-muted-foreground">
                Balanced, flavor-first meals, most ready in under 30 minutes.
              </p>
            </div>
            <Link
              href="/recipes"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              All recipes <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Cookbook CTA */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="/images/cookbook-cover.jpg"
            alt="Protein Flip™ Method and Cookbook Deluxe Edition cover"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            The Cookbook
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Protein Flip™ Deluxe Edition
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            You don&apos;t have to give up meat. You don&apos;t need to count
            every gram. This cookbook isn&apos;t just a collection of recipes.
            It&apos;s a new way of thinking about your plate.
          </p>
          <ul className="mt-6 space-y-3 text-muted-foreground">
            <li>• The complete Protein Flip™ framework, explained step by step</li>
            <li>• Recipes that keep the flavors you love on the plate</li>
            <li>• Built for home cooks and bariatric/GLP-1 journeys alike</li>
          </ul>
          <Link
            href="/cookbook"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get your copy from $27.99 <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border bg-secondary/50 py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Follow the flavor
          </h2>
          <p className="mt-3 text-muted-foreground">
            One new nutrition-smart recipe in your inbox every week. No spam,
            just dinner solved.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}

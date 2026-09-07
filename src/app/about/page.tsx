import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Chef Henry: The Story Behind the Protein Flip™ Method",
  description:
    "Meet the chef behind Chef Healthy Henry: a protein-forward approach to real food, no fad diets, no shortcuts. Here's the story, the philosophy, and why it works.",
};

const services = [
  {
    title: "1:1 Culinary Coaching",
    text: "Work directly with Henry on the cooking goals that matter to you. Whether you want to apply the Protein Flip™ to real meals, build confidence in the kitchen, or rethink the food you already love, the coaching is tailored around where you are and what you want to change. Three private sessions, $450.",
    cta: { label: "Get in touch", href: "/contact" },
  },
  {
    title: "Cooking Classes",
    text: "Online and in-person classes that build real kitchen skills. Not just recipes. The kind of understanding that lets you cook without needing one.",
    cta: { label: "Get in touch", href: "/contact" },
  },
  {
    title: "The Cookbook",
    text: "The Protein Flip™ Method and Cookbook, Deluxe Edition. 155 pages on the method, how it works, and how to apply it, including 30 recipes. The 220+ recipes on this site are free. The book is where the method itself lives.",
    cta: { label: "Get the Cookbook", href: "/cookbook" },
  },
  {
    title: "Events and Workshops",
    text: "Corporate and community culinary events that bring people together around good food. Workshops, demonstrations, and experiences built for groups.",
    cta: { label: "Get in touch", href: "/contact" },
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            About
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            The kitchen is where better habits begin
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Henry is a chef and food essayist who writes about cooking the way
            he teaches it: with flavor first, nothing forbidden, and no
            pretense that eating well has to feel like a sacrifice. He trained
            as a chef in Chicago about twenty years ago, cooking seriously
            long before he thought much about nutrition.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            In 2020, after years of diets that subtracted until there was
            nothing left to enjoy, he stopped dieting and started cooking
            differently. He rebuilt his health around strength training,
            purposeful cooking, and a method that added nutrition around the
            food he loved instead of replacing it. That process became the
            Protein Flip™.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Today he helps others do the same. His belief is that the kitchen
            is where confidence develops, families connect, and people rebuild
            trust in themselves. Cooking is not a chore to optimize. It is
            one of the most practical tools a person has.
          </p>
        </div>
        <div className="relative flex aspect-square items-end justify-center overflow-hidden rounded-3xl bg-accent shadow-lg">
          <Image
            src="/images/henry-portrait.png"
            alt="Chef Healthy Henry"
            width={560}
            height={580}
            priority
            className="h-[92%] w-auto object-contain"
          />
        </div>
      </div>

      {/* Henry's journey */}
      <div className="mt-20 grid items-center gap-12 md:grid-cols-2">
        <div className="relative order-2 aspect-square overflow-hidden rounded-3xl shadow-lg md:order-1">
          <Image
            src="/images/henry-transformation.jpg"
            alt="Henry's transformation, before and after rebuilding his lifestyle around purposeful cooking"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            His own journey
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight">
            He lived the flip first
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            The Protein Flip™ is not theory. It is how Henry transformed his
            own health. After years of restriction diets that eventually left
            him heavier than when he started, he stopped looking for things to
            remove and started asking a different question: what can I add
            around the food I already love?
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Protein first. Flavor always. Nothing forbidden. The method is
            simple on purpose, because anything complicated eventually stops
            working. The photos speak for themselves, and so do the years
            since.
          </p>
        </div>
      </div>

      {/* Out in the community */}
      <div className="mt-20">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          From his kitchen to yours
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/images/henry-christmas.jpg"
              alt="Henry cooking a holiday meal with community members"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/images/henry-expo.jpg"
              alt="Henry talking nutrition at a community health event"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-3 gap-4 rounded-2xl bg-secondary/60 px-4 py-10 text-center">
        {[
          { value: "220+", label: "Tailored recipes created" },
          { value: "200+", label: "People coached" },
          { value: "1.3M", label: "Average monthly reach" },
        ].map((s) => (
          <div key={s.label}>
            <p className="font-heading text-3xl font-semibold text-primary sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          How Henry can help
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border/60"
            >
              <h3 className="font-heading text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {s.text}
              </p>
              <Link
                href={s.cta.href}
                className="mt-4 inline-block rounded-full border border-border px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
              >
                {s.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground">
        <h2 className="font-heading text-3xl font-semibold">
          Ready to flip your plate?
        </h2>
        <p className="mx-auto mt-3 max-w-md opacity-90">
          Start with the cookbook, explore the free recipes and guides, or get
          in touch about coaching.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/cookbook"
            className="inline-flex items-center gap-2 rounded-full bg-card px-7 py-3 font-medium text-primary transition-opacity hover:opacity-90"
          >
            Get the Cookbook <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-7 py-3 font-medium transition-colors hover:bg-primary-foreground/10"
          >
            Contact Henry
          </Link>
        </div>
      </div>
    </div>
  );
}

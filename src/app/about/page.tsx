import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Chef Healthy Henry trained in Chicago 20 years ago and rebuilt his life around wellness-centered cooking. Today he's coached 200+ people and reaches 1.3M monthly with the Protein Flip™ method.",
};

const services = [
  {
    title: "Tailored recipes",
    text: "Custom recipe development and ingredient sourcing matched to your goals and tastes.",
  },
  {
    title: "Coaching",
    text: "One-on-one and group coaching to build sustainable habits, plate by plate.",
  },
  {
    title: "Cooking classes",
    text: "Online and in-person classes that build real kitchen confidence.",
  },
  {
    title: "Events & workshops",
    text: "Corporate and community culinary events that bring people together around good food.",
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
            he teaches it: honestly, generously, and with flavor first. He
            trained as a chef in Chicago about twenty years ago. After years
            of unsustainable weight-loss diets, he rebuilt his life in 2020
            around strength, purposeful cooking, and habits that last, and
            rediscovered cooking as something joyful, empowering, and even
            healing.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Today he helps others do the same. His belief is simple: the
            kitchen is a gathering place for confidence, creativity, and
            health. Cooking is a tool. It&apos;s where better habits develop,
            families connect, and people rebuild trust in themselves.
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
            The Protein Flip™ isn&apos;t theory. It&apos;s how Henry
            transformed his own health. After years of diets that subtracted
            until there was nothing left to enjoy, he flipped the plate
            instead: protein first, flavor always, nothing forbidden. The
            photos speak for themselves.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            That experience is why every recipe on this site is built to be
            sustainable: food you genuinely want to eat, plate after plate,
            for years.
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
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground">
        <h2 className="font-heading text-3xl font-semibold">
          Ready to flip your plate?
        </h2>
        <p className="mx-auto mt-3 max-w-md opacity-90">
          Start with the cookbook, or get in touch about coaching, classes, and
          events.
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

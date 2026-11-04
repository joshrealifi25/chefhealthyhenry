import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SamplerForm } from "@/components/sampler-form";
import {
  hrefWithSource,
  leadSourceFromParams,
  SAMPLER_PATH,
} from "@/lib/lead-source";

export const metadata: Metadata = {
  title: "When Nothing Sounds Good",
  description:
    "Three chef-built meals for low-appetite days: a cold breakfast, a five-minute savory plate, and one family dinner served two ways. Free from Chef Healthy Henry.",
  alternates: { canonical: SAMPLER_PATH },
};

const OUTCOMES = [
  {
    title: "A cold breakfast",
    text: "Greek yogurt, cooled oats, berries, and flax. No stove, and it comes together in a few minutes.",
  },
  {
    title: "A five-minute savory plate",
    text: "Lentils, a little feta, roasted pepper, and yogurt. Nothing to heat when deciding feels harder than eating.",
  },
  {
    title: "One dinner, two plates",
    text: "Lemon chicken, white beans, and carrots from one pan. A smaller plate and a family plate, so a small appetite does not mean a second dinner.",
  },
];

const SAMPLE_PAGES = [
  {
    src: "/images/sampler/cold-breakfast.jpg",
    alt: "Sampler page for the berry, oat, and Greek yogurt spoon bowl",
    caption: "Cold breakfast: berry, oat, and Greek yogurt. No stove.",
  },
  {
    src: "/images/sampler/savory-plate.jpg",
    alt: "Sampler page for the lentil, feta, and yogurt plate",
    caption: "Five-minute plate: lentils, feta, roasted pepper, and yogurt.",
  },
  {
    src: "/images/sampler/two-plates.jpg",
    alt: "Sampler page showing one dinner plated two ways",
    caption: "One dinner plated two ways, from the same pan.",
  },
];

const FAQS = [
  {
    q: "What arrives in the email?",
    a: "A PDF called 3 Meals for When Nothing Sounds Good: the cold breakfast, the five-minute plate, the family dinner plated two ways, and a seven-item refrigerator list.",
  },
  {
    q: "Is there a cost?",
    a: "The sampler is free. This page does not ask you to buy anything.",
  },
  {
    q: "Is this medical advice?",
    a: "It is cooking guidance from a chef. It does not set gram targets, give dosing, or promise a change in weight. If you take medication or follow a medical eating plan, talk with your clinician before you change how you eat.",
  },
  {
    q: "Will Henry keep emailing?",
    a: "The sampler email comes first. Each note has an unsubscribe link.",
  },
  {
    q: "How is this different from the cookbook?",
    a: "This page offers the free sampler only. The Protein Flip™ Method and Cookbook, Deluxe Edition is the full method, sold separately.",
  },
];

export default async function WhenNothingSoundsGoodPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; utm_source?: string }>;
}) {
  const source = leadSourceFromParams(await searchParams);

  return (
    <div className="pb-8">
      <section className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Free sampler
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            When nothing sounds good
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Three chef-built meals for low-appetite days. A cold breakfast, a
            five-minute savory plate, and one dinner that serves a small plate
            and a family plate from the same pan.
          </p>
          <div className="mt-8 max-w-lg">
            <SamplerForm source={source} />
          </div>
        </div>
        <div className="mx-auto w-full max-w-sm">
          <Image
            src="/images/sampler/cover.jpg"
            alt="Cover of 3 Meals for When Nothing Sounds Good, the free sampler from Chef Healthy Henry"
            width={980}
            height={1268}
            priority
            className="h-auto w-full rounded-2xl shadow-xl ring-1 ring-border/60"
          />
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Three meals you can make this week
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            The PDF also includes seven foods to keep in the refrigerator for
            the next low-hunger day.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {OUTCOMES.map((item, index) => (
              <li
                key={item.title}
                className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60"
              >
                <p className="text-sm font-medium text-primary">
                  {index + 1}
                </p>
                <h3 className="mt-2 font-heading text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[12rem_1fr] md:gap-14">
        <Image
          src="/images/henry-portrait.png"
          alt="Henry Baker, chef"
          width={560}
          height={580}
          className="mx-auto h-48 w-48 rounded-full object-cover object-top shadow-md md:h-52 md:w-52"
        />
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            From Henry
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight">
            Start with the bite you can imagine
          </h2>
          <blockquote className="mt-5 text-lg leading-relaxed">
            When nothing sounds good, do not start with a recipe. Start with
            the kind of bite you can imagine eating.
          </blockquote>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Henry Baker cooks with the Protein Flip™: flavor first, with
            protein and fiber from more than one thing on the plate. This
            sampler is that approach on a day when a full plate feels like too
            much.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            A look at the three meals
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            These pages are in the free PDF, along with the refrigerator list.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {SAMPLE_PAGES.map((page) => (
              <figure
                key={page.src}
                className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60"
              >
                <Image
                  src={page.src}
                  alt={page.alt}
                  width={980}
                  height={1268}
                  className="h-auto w-full"
                />
                <figcaption className="p-4 text-sm leading-relaxed text-muted-foreground">
                  {page.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          Questions
        </h2>
        <dl className="mt-6 divide-y divide-border">
          {FAQS.map((item) => (
            <div key={item.q} className="py-5">
              <dt className="font-medium">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Where cooking advice stops
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            This sampler is culinary education. It is not medical advice,
            nutrition therapy, or a substitute for your clinician. It does not
            give dosing, side-effect advice, or weight-loss promises. If you
            take a GLP-1 medication or follow a medical eating plan, talk with
            your care team before you change how you eat.
          </p>
          <p className="mt-4 text-sm">
            <Link
              href={hrefWithSource("/disclaimer", source)}
              className="font-medium text-primary underline underline-offset-4"
            >
              Read the full disclaimer
            </Link>
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/50">
        <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Get the free meal map
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three meals, sent to your inbox as a PDF.
          </p>
          <div className="mt-6 text-left">
            <SamplerForm source={source} />
          </div>
        </div>
      </section>
    </div>
  );
}

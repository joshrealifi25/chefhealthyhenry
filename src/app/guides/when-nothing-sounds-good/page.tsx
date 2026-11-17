import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { whenNothingSoundsGood } from "@/data/cookbooks";
import { GUIDE_CHECKOUT_PATH } from "@/lib/lead-source";

const DESCRIPTION =
  "Chef-built meals for low appetite and changing hunger. 20 Protein Flip™ meals, the Appetite Compass, and five family dinners plated two ways. Instant PDF, $19.";

export const metadata: Metadata = {
  title: "When Nothing Sounds Good",
  description: DESCRIPTION,
  alternates: { canonical: "/guides/when-nothing-sounds-good" },
  openGraph: {
    title: "When Nothing Sounds Good",
    description: DESCRIPTION,
    type: "website",
  },
};

const STEPS = [
  "Temperature: cold, room temperature, or warm",
  "Texture: smooth, soft, crisp, or handheld",
  "Effort: assemble, five minutes, or about fifteen",
  "Flavor: mild, savory, bright, or herb-forward",
];

const INSIDE = [
  "The Appetite Compass: four lanes that match a meal to how you feel today.",
  "20 chef-built meals: cold breakfasts, five-minute savory plates, warm spoonable bowls, and portable lunches.",
  "One Dinner, Two Appetites: five family dinners, cooked once and plated two ways.",
  "The low-hunger grocery map: five shopping groups, each one a set of ready meals.",
  "When Hunger Returns: how the plate grows while the balance stays the same.",
  "Your fallback plan: three go-to meals chosen before you need them.",
];

const MEALS = [
  "Raspberry, Orange and Pistachio Yogurt Oats",
  "Mediterranean Lentils with Lemon Yogurt, Roasted Peppers and Feta",
  "Ginger, Edamame and Silken Tofu Egg Drop Cup",
  "Lemony Salmon and Lentil Bowl with Zucchini and Dill Yogurt",
  "Lemon Herb Chicken and Chickpea Pita with Cucumber Yogurt and Sumac",
  "Smoky Turkey and Black Bean Quesadilla with Lime Cabbage Slaw",
];

const CHEF_QUOTE =
  "I built this guide for the days when knowing what to eat is easy and choosing what to eat is hard. Every meal in it I've made, enjoyed, and would serve at my own table anytime.";

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "What format is it?",
    a: "An instant PDF, delivered right after purchase. Read it on your phone or tablet, or print it for the kitchen.",
  },
  {
    q: "Is this guide for GLP-1 users and bariatric patients?",
    a: "Yes. Every meal is built for a smaller appetite, with protein and fiber spread across the plate so a few bites still feel complete. After surgery, follow your care team's guidance on stages and portions, then use the guide to make those plates taste like food.",
  },
  {
    q: "How much cooking does it take?",
    a: "Most meals assemble in minutes from cooked, canned, or ready-to-warm ingredients. A few take about fifteen minutes. Cook at your level.",
  },
  {
    q: "Does it work for plant-based eating?",
    a: "Yes. Many meals are built on lentils, beans, tofu, and edamame, and either protein role on the plate can be filled by plants.",
  },
  {
    q: "Is this medical or nutrition advice?",
    a: "It is a culinary guide, built to help you cook and eat well. For medical or nutrition guidance, follow your care team.",
  },
  {
    q: "Can I try it first?",
    a: (
      <>
        Yes.{" "}
        <Link
          href="/sampler"
          className="font-medium text-primary underline underline-offset-4"
        >
          Get three meals free
        </Link>
        {": a breakfast, a savory plate, and a family dinner."}
      </>
    ),
  },
];

function GuideBuyLink() {
  return (
    <a
      href={GUIDE_CHECKOUT_PATH}
      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
    >
      Get the guide, $19 <ArrowRight className="size-4" aria-hidden="true" />
    </a>
  );
}

function SamplerLink({ children }: { children: string }) {
  return (
    <Link
      href="/sampler"
      className="font-medium text-primary underline underline-offset-4"
    >
      {children}
    </Link>
  );
}

export default function WhenNothingSoundsGoodGuidePage() {
  return (
    <div className="pb-8">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div>
          <p className="text-sm font-medium tracking-widest text-primary">
            A COMPANION GUIDE FROM CHEF HEALTHY HENRY
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            When Nothing Sounds Good
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Chef-built meals for low appetite, changing hunger, and real life.
            Find a meal that sounds good right now, in under a minute.
          </p>
          <p className="mt-6 text-sm font-medium tracking-widest text-primary">
            PROTEIN. FIBER. SATISFACTION.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            $19 · Instant PDF · 20 meals + 5 family dinners
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <GuideBuyLink />
            <SamplerLink>Try 3 meals free</SamplerLink>
          </div>
        </div>
        <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl shadow-xl ring-1 ring-border/60">
          <Image
            src={whenNothingSoundsGood.image}
            alt="When Nothing Sounds Good, a companion guide from Chef Healthy Henry"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            A real answer for that refrigerator moment.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            You open the refrigerator. You know you should eat something, and
            nothing jumps out. Some days you want cold and creamy. Other days,
            warm and soft, or something with a little crunch.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            This guide meets your appetite where it is. Four quick questions
            lead you to one specific meal, built to taste finished and feel
            complete.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Four questions. One meal.
        </h2>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60"
            >
              <p className="text-sm font-medium text-primary">{index + 1}</p>
              <p className="mt-2 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          The Appetite Compass turns your answers into a meal number. Turn to
          it, make it, and eat.
        </p>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            What&apos;s inside.
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {INSIDE.map((item) => {
              const colon = item.indexOf(": ");
              const lead = item.slice(0, colon + 1);
              const rest = item.slice(colon + 2);
              return (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60"
                >
                  <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <p className="leading-relaxed">
                    <span className="font-medium">{lead}</span>{" "}
                    <span className="text-muted-foreground">{rest}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          A taste of what you&apos;ll make.
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {MEALS.map((meal) => (
            <li
              key={meal}
              className="rounded-2xl bg-card px-5 py-4 font-heading text-lg font-medium leading-snug shadow-sm ring-1 ring-border/60"
            >
              {meal}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Every meal follows the Protein Flip™ Method: a primary protein, a
          secondary protein, meaningful fiber, and a chef&apos;s finish.
        </p>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Built on the Protein Flip™ Method.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              The Protein Flip™ Method is protein and fiber-forward. Protein
              comes from more than one source and is spread across the plate.
              Beans and lentils carry protein and fiber at the same time.
              Yogurt doubles as a sauce. Herbs, acid, and texture make it taste
              like a meal.
            </p>
          </div>
          <blockquote className="rounded-2xl bg-card p-8 font-heading text-2xl font-medium leading-snug shadow-sm ring-1 ring-border/60">
            Portion Smart is distribution, not reduction.
          </blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          For the days hunger changes the plan.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          This guide was built for people using GLP-1 medications and for
          bariatric patients: anyone eating on a smaller appetite who still
          wants food that tastes like a real meal. It also works for busy
          weeks, stressful days, cooking for one, and anyone whose hunger
          shows up differently from day to day.
        </p>
        <h3 className="mt-10 font-heading text-2xl font-semibold tracking-tight">
          And for the whole table.
        </h3>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          One Dinner, Two Appetites means one pan and one dinner, plated for
          every appetite in the house.
        </p>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[12rem_1fr] md:gap-14">
          <Image
            src="/images/henry-portrait.png"
            alt="Chef Henry"
            width={560}
            height={580}
            className="mx-auto h-48 w-48 rounded-full object-cover object-top shadow-md md:h-52 md:w-52"
          />
          <div>
            <blockquote className="font-heading text-2xl font-medium leading-snug sm:text-3xl">
              &ldquo;{CHEF_QUOTE}&rdquo;
            </blockquote>
            <p className="mt-5 font-medium">Chef Henry</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Chef Healthy Henry. 20+ years in cooking, catering, and culinary
              education. Creator of the Protein Flip™ Method.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6" aria-label="Questions">
        <dl className="divide-y divide-border">
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

      <section className="border-t border-border bg-secondary/50">
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Your next plate is already in this guide.
          </h2>
          <div className="mt-8">
            <GuideBuyLink />
          </div>
          <p className="mt-4">
            <SamplerLink>Or start with 3 free meals</SamplerLink>
          </p>
        </div>
      </section>
    </div>
  );
}

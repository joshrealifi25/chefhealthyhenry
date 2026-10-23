import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { LegalConsent } from "@/components/legal-consent";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Join the Chef Healthy Henry membership: learn to make better cooking decisions with the Protein Flip™ Method, from monthly lessons to live coaching with Chef Henry.",
};

interface TierDef {
  name: string;
  price: string;
  cadence: string;
  annual?: string;
  annualHref?: string;
  tagline: string;
  features: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
  comingSoon?: boolean;
}

const TIERS: TierDef[] = [
  {
    name: "Protein Flip™ Kitchen",
    price: "$12",
    cadence: "per month",
    annual: "or $120/year ($10 a month)",
    tagline: "Help me make better cooking decisions.",
    features: [
      "Sous, your Protein Flip™ cooking assistant, unlimited questions",
      "A new cooking lesson every month, added to a library you keep access to",
      "Browse Chef Henry's ingredient pairings anytime to build better plates",
      "Build 2 shopping lists a month around the recipes you want to cook",
    ],
    cta: {
      label: "Join Protein Flip™ Kitchen",
      href: "/api/checkout?plan=kitchen_monthly",
    },
    annualHref: "/api/checkout?plan=kitchen_annual",
  },
  {
    name: "Protein Flip™ Community",
    price: "$29",
    cadence: "per month",
    tagline: "Help me practice, participate, and learn with others.",
    features: [
      "Everything in Protein Flip™ Kitchen",
      "Build as many shopping lists as you need, any time",
      "The private Protein Flip™ community",
      "Monthly Recipe Makeover: submit a dish you love, watch Chef Henry rethink it",
      "Every other month, a deep dive into one ingredient: how to buy it, cook it, and flip it",
    ],
    cta: {
      label: "Join Protein Flip™ Community",
      href: "/api/checkout?plan=community_monthly",
    },
    highlight: true,
  },
  {
    name: "Chef's Table",
    price: "$69",
    cadence: "per month",
    tagline: "Let me bring my questions directly to Chef Henry.",
    features: [
      "Everything in Kitchen and Community",
      "Monthly live group coaching with Chef Henry",
      "Submit your questions before each session",
      "Session replays and Watch Chef Henry demonstrations",
      "Limited 30-minute Strategy Calls",
      "Submit a recipe for a possible Protein Flip™ makeover",
      "Unlimited custom grocery-list builds",
    ],
    cta: { label: "Contact us", href: "/contact" },
    comingSoon: true,
  },
];

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "Aren't the recipes free?",
    a: "Yes, and they stay free. The membership is not a recipe paywall. It teaches you what to do with recipes: how to adapt them, substitute with confidence, and make better decisions in your own kitchen.",
  },
  {
    q: "What is the Protein Flip™ Method?",
    a: "A way of building meals where protein, fiber, flavor, and satisfaction come from multiple parts of the plate instead of one dominant protein source. It is not a diet, not a weight-loss program, and not about giving up the foods you love.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Membership renews monthly until you cancel, and you keep access through the end of the period you paid for. No cancellation fees, no hoops.",
  },
  {
    q: "Can I change my plan?",
    a: (
      <>
        Yes, anytime. Changes take effect right away and billing adjusts automatically. Founding members: to upgrade your plan, contact us at{" "}
        <a href="mailto:henry@ChefHealthyHenry.com" className="underline underline-offset-4 hover:text-primary">
          henry@ChefHealthyHenry.com
        </a>{" "}
        and we&apos;ll apply your founding rate to your new tier.
      </>
    ),
  },
  {
    q: "Is this medical or nutrition advice?",
    a: "No. The membership is culinary education. For medical or nutrition guidance, talk with your healthcare provider.",
  },
  {
    q: "What is the Recipe Makeover feature?",
    a: "Protein Flip™ Community members can submit a recipe they love for a possible Protein Flip™ makeover. Chef Henry selects examples periodically to show how the method applies to real home cooking. Submission is not a guarantee of a personal review, but every makeover he shares starts with an actual member recipe.",
  },
];

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl text-balance">
          Stop collecting recipes. Start cooking with confidence.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          The recipes are free and always will be. Membership teaches you the
          judgment behind them: how to adapt, substitute, and build satisfying
          meals with the Protein Flip™ Method.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="#join"
            className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Become a Founding Member
          </a>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
          <Image
            src="/images/henry-portrait.png"
            alt="Chef Henry Baker"
            width={192}
            height={192}
            className="h-24 w-24 shrink-0 rounded-full object-cover object-top"
          />
          <div>
            <h2 className="font-heading text-xl font-semibold">Henry Baker</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              I am Henry Baker, a chef and the creator of the Protein Flip™ Method.
              I built this platform because I kept seeing the same problem: people
              who wanted to eat better but felt like doing that meant giving up the
              food they actually love.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              The Protein Flip™ is not a diet. It is a way of thinking about a plate
              where meat, vegetables, beans, grains, and other ingredients each pull
              their weight in protein, fiber, flavor, and texture. You end up with
              meals that are more satisfying, more nutritious, and still worth
              sitting down for.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-2xl text-center">
        <p className="text-base leading-relaxed text-muted-foreground">
          Every month you get a new lesson, a growing library of kitchen guides, and
          access to Sous, a cooking assistant built entirely around the Protein
          Flip™ Method. Ask it anything. Build your grocery list around the recipes
          you want to cook. Show up in the kitchen with more confidence every week.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <div className="grid gap-8 text-center sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl">🔪</span>
            <h3 className="font-heading font-semibold">Learn</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A new lesson every month plus a growing library of kitchen guides built
              around the Protein Flip™ Method.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl">💬</span>
            <h3 className="font-heading font-semibold">Ask</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sous answers your cooking questions, how to shop smarter, build a
              plate, and cook with what you have, grounded in this kitchen.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl">🛒</span>
            <h3 className="font-heading font-semibold">Plan</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Build a grocery list around the recipes you want to cook. See which
              ingredients overlap so you buy less and waste less.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-xl space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          Cancel anytime. No contracts. Your recipes stay free regardless of whether
          you join.
        </p>
        <p className="text-sm text-muted-foreground">
          7-day refund guarantee.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xl text-center">
        <p className="text-sm text-muted-foreground">
          New to the Protein Flip™ Method?{" "}
          <Link href="/cookbook" className="underline underline-offset-4 hover:text-primary">
            It starts with the cookbook.
          </Link>{" "}
          Membership is where you put it to work every week.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-primary/30 bg-primary/5 px-6 py-4 text-center">
        <p className="text-sm font-medium text-primary">
          Founding member offer: first 100 members lock in a reduced rate for life.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Kitchen members: use code <strong>FOUNDING100K</strong> at checkout for $10/month for life.
          Community members: use code <strong>FOUNDING100C</strong> at checkout for $25/month for life.
          Once 100 members join, the codes expire.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3" id="join">
        {TIERS.map((tier) => (
          <section
            key={tier.name}
            className={`flex flex-col rounded-2xl border bg-card p-7 ${
              tier.highlight ? "border-primary shadow-sm" : "border-border"
            }`}
          >
            {tier.comingSoon && (
              <p className="mb-3 self-start rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Contact for more info
              </p>
            )}
            {tier.highlight && (
              <p className="mb-3 self-start rounded-full bg-accent px-3 py-1 text-xs font-medium">
                Most popular
              </p>
            )}
            <h2 className="font-heading text-2xl font-semibold">{tier.name}</h2>
            <p className="mt-1 text-sm italic text-muted-foreground">
              &ldquo;{tier.tagline}&rdquo;
            </p>
            <p className="mt-5">
              <span className="flex items-baseline gap-2">
                <span className="font-heading text-4xl font-semibold">
                  {tier.price}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  {tier.cadence}
                </span>
              </span>
            </p>
            {tier.annual &&
              (tier.annualHref ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  <Link
                    href={tier.annualHref}
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    {tier.annual}
                  </Link>
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.annual}
                </p>
              ))}
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-0.5 text-primary">
                    ✓
                  </span>
                  {f}
                </li>
              ))}

            </ul>
            <Link
              href={tier.cta.href}
              className={`mt-8 rounded-full px-6 py-3 text-center text-sm font-medium transition-opacity hover:opacity-90 ${
                tier.comingSoon
                  ? "border border-border text-primary"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {tier.cta.label}
            </Link>
          </section>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-xl space-y-3 text-center">
        <p className="text-sm text-muted-foreground">
          Founding member rates are locked in for life as long as your membership stays active.
          Cancel anytime. Access runs through the period you paid for.
        </p>
        <LegalConsent preface="By joining, you agree to our" />
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-border bg-card p-8">
        <h2 className="font-heading text-2xl font-semibold">
          Submit a Recipe for a Makeover
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Protein Flip™ Community members can periodically submit a recipe
          they love for a possible Protein Flip™ makeover. Chef Henry selects
          examples to show how the method applies to real home cooking: how to
          add protein, build nutrition around what is already there, and
          preserve what makes the dish worth making in the first place.
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Not every submitted recipe gets selected, but every makeover Chef
          Henry shares comes from a real member recipe. The goal is to show
          that the Protein Flip™ works on the food you actually cook, not just
          the food on a recipe site.
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-2xl">
        <h2 className="font-heading text-2xl font-semibold">
          Common questions
        </h2>
        <dl className="mt-6 divide-y divide-border">
          {FAQS.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-sm text-muted-foreground">
          Already a member?{" "}
          <Link
            href="/members/login"
            className="font-medium text-primary underline underline-offset-4"
          >
            Sign in here
          </Link>
          . Questions about membership?{" "}
          <Link
            href="/contact"
            className="font-medium text-primary underline underline-offset-4"
          >
            Get in touch
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

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
      "Sous, your Protein Flip™ cooking assistant, up to 20 questions a day",
      "One Member Application Lesson every month",
      "The growing lesson library and Kitchen Guides",
      "Grocery combo builder with saved lists (coming soon)",
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
      "Unlimited questions with Sous",
      "The private Protein Flip™ community",
      "Monthly Recipe Makeover: submit a dish you love, watch Chef Henry rethink it",
      "This Season's Featured Ingredient, every other month",
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
    ],
    cta: { label: "Join the waitlist", href: "#join" },
    comingSoon: true,
  },
];

const FAQS: { q: string; a: string }[] = [
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
    q: "Can I upgrade or downgrade?",
    a: "Yes, anytime. Changes take effect right away and billing adjusts automatically.",
  },
  {
    q: "Is this medical or nutrition advice?",
    a: "No. The membership is culinary education. For medical or nutrition guidance, talk with your healthcare provider.",
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
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3" id="join">
        {TIERS.map((tier) => (
          <section
            key={tier.name}
            className={`flex flex-col rounded-2xl border bg-card p-7 ${
              tier.highlight ? "border-primary shadow-sm" : "border-border"
            }`}
          >
            {tier.comingSoon && (
              <p className="mb-3 self-start rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Launching this fall
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
              <span className="font-heading text-4xl font-semibold">
                {tier.price}
              </span>
              <span className="ml-1 text-sm text-muted-foreground">
                {tier.cadence}
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

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Founding members who join in launch week lock in the annual price for
        life. Cancel anytime; access runs through the period you paid for.
      </p>

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

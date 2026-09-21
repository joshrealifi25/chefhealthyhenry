import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for chefhealthyhenry.com: membership, digital downloads, shipped books, and content.",
};

const LAST_UPDATED = "September 21, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Terms
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {LAST_UPDATED}
      </p>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Welcome to chefhealthyhenry.com, operated by Chef Healthy Henry LLC.
        By using this site, joining a membership, or buying our books and
        guides, you agree to these terms. They are written to be read, not to
        scare you.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">Membership</h2>
      <ul className="mt-5 space-y-3 text-muted-foreground">
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Paid memberships renew automatically each month or year until you
          cancel. The price you pay is the price shown at checkout.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          You can cancel anytime from the billing card in your kitchen, or by
          writing to us if your account has no card on file. There is no
          cancellation fee. If you cancel, you keep access through the end of
          the period you already paid for.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Upgrades and downgrades take effect when Stripe confirms the
          change, and billing adjusts for the new plan.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Membership is a personal license to the member tools and library.
          Please do not share your sign-in link or resell access.
        </li>
      </ul>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Accounts and sign-in
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        You sign in with a one-time link sent to your email. Keep that inbox
        under your control. You are responsible for activity on your account.
        We may close an account that is abused, unpaid past the access
        period, or used in a way that harms other members.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Digital purchases
      </h2>
      <ul className="mt-5 space-y-3 text-muted-foreground">
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Digital guides and cookbooks are delivered by email as a download
          link shortly after purchase. Links expire after 7 days, so save your
          file. If your link expires or the email never arrives, contact us
          and we will send a fresh one at no charge.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Because digital files are delivered instantly and cannot be
          returned, digital sales are final once the download is delivered. By
          purchasing, you consent to immediate delivery and acknowledge this.
          That said, if something is genuinely wrong with your order, write to
          us. We would rather fix it than argue about it.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Your purchase is for personal use. Please do not redistribute,
          resell, or post the files publicly.
        </li>
      </ul>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Shipped books
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Signed softcover orders ship to the address you provide at checkout.
        If your book arrives damaged or goes missing in transit,{" "}
        <Link href="/contact" className="text-primary underline underline-offset-2">
          contact us
        </Link>{" "}
        within 30 days of your order and we will replace it.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">Payments</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Checkout is processed securely by Stripe. We never see or store your
        card details. Prices are in US dollars and may change, but the price
        you pay is the price shown at checkout.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Sous and member tools
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Sous, grocery lists, lessons, and the other kitchen tools are
        culinary education. They are not medical or nutrition advice. See our{" "}
        <Link href="/disclaimer" className="text-primary underline underline-offset-2">
          Health &amp; Nutrition Disclaimer
        </Link>
        . Replies from Sous can be incomplete or wrong. Use your own judgment
        in the kitchen, and check ingredients against your dietary needs.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Recipe makeovers
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        If you submit a recipe for a possible Protein Flip™ makeover, you
        confirm you have the right to send it. If Henry selects it, you grant
        Chef Healthy Henry LLC a non-exclusive license to use the submitted
        recipe, your notes, and any photo on the membership site and in the
        private member community, to teach the method. Submission is not a
        promise that the recipe will be selected or that you will receive a
        personal review.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Member community
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The private Protein Flip™ community is hosted on Facebook. Opening
        that group takes you to Meta&apos;s service, which has its own terms
        and privacy policy. Be kind. Do not share other members&apos; posts
        outside the group.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Our content
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        All recipes, essays, photographs, lessons, and guides on this site,
        and the Protein Flip™ name and method, are the property of Chef
        Healthy Henry LLC. You are welcome to cook the recipes, print them
        for your kitchen, and share links to the site. Republishing recipes
        or book content wholesale, or using them commercially, requires our
        written permission.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        No warranty and limitation of liability
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The site, membership, and its content are provided as is, without
        warranties of any kind. Cooking involves heat, sharp tools, and
        ingredients that can cause allergic reactions. You are responsible
        for using safe kitchen practices and checking every ingredient
        against your own dietary needs. To the fullest extent permitted by
        law, Chef Healthy Henry LLC is not liable for indirect or
        consequential damages arising from your use of the site, membership,
        or its content, and our total liability for any claim is limited to
        the amount you paid us for the product or membership period at issue.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Governing law
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        These terms are governed by the laws of the State of California,
        without regard to conflict-of-law rules.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">Questions</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        If anything here is unclear, or you have a problem with an order or
        membership,{" "}
        <Link href="/contact" className="text-primary underline underline-offset-2">
          contact us
        </Link>{" "}
        and we will make it right.
      </p>
    </div>
  );
}

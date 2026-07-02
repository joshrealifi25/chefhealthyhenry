import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Purchases",
  description:
    "Terms of use and purchase terms for chefhealthyhenry.com: digital downloads, shipped books, refunds, and content ownership.",
};

const LAST_UPDATED = "July 1, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Terms &amp; Purchases
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {LAST_UPDATED}
      </p>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Welcome to chefhealthyhenry.com, operated by Chef Healthy Henry LLC.
        By using this site or buying our books and guides, you agree to these
        terms. They are written to be read, not to scare you.
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
        Our content
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        All recipes, essays, photographs, and guides on this site, and the
        Protein Flip™ name and method, are the property of Chef Healthy Henry
        LLC. You are welcome to cook the recipes, print them for your kitchen,
        and share links to the site. Republishing recipes or book content
        wholesale, or using them commercially, requires our written
        permission.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        No warranty and limitation of liability
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The site and its content are provided as is, without warranties of any
        kind. Cooking involves heat, sharp tools, and ingredients that can
        cause allergic reactions. You are responsible for using safe kitchen
        practices and checking every ingredient against your own dietary
        needs. See our{" "}
        <Link href="/disclaimer" className="text-primary underline underline-offset-2">
          Health &amp; Nutrition Disclaimer
        </Link>
        . To the fullest extent permitted by law, Chef Healthy Henry LLC is
        not liable for indirect or consequential damages arising from your use
        of the site or its content, and our total liability for any claim is
        limited to the amount you paid us for the product at issue.
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
        If anything here is unclear, or you have a problem with an order,{" "}
        <Link href="/contact" className="text-primary underline underline-offset-2">
          contact us
        </Link>{" "}
        and we will make it right.
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Chef Healthy Henry collects, uses, and protects your information: purchases, email signup, contact messages, and analytics.",
};

const LAST_UPDATED = "July 1, 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {LAST_UPDATED}
      </p>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        This site is operated by Chef Healthy Henry LLC. We collect as little
        personal information as we can, and we never sell it. This page
        explains what we collect, why, and the choices you have.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        What we collect and why
      </h2>
      <ul className="mt-5 space-y-4 text-muted-foreground">
        <li>
          <strong className="text-foreground">Purchases.</strong> When you buy
          a cookbook or guide, checkout is handled by Stripe. We receive your
          name, email address, what you bought, and (for shipped books) your
          shipping address so we can deliver your order and answer questions
          about it. We never see or store your card number. Stripe&apos;s
          handling of your payment details is described in{" "}
          <a
            href="https://stripe.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Stripe&apos;s privacy policy
          </a>
          .
        </li>
        <li>
          <strong className="text-foreground">Digital delivery.</strong> When
          you buy a digital guide, we email your download link using Resend,
          our email delivery provider. Your email address is shared with them
          for that purpose only.
        </li>
        <li>
          <strong className="text-foreground">Newsletter.</strong> If you sign
          up, we store your email address and use it to send recipes and
          updates. Every email includes an unsubscribe link, and unsubscribing
          takes effect promptly.
        </li>
        <li>
          <strong className="text-foreground">Contact messages.</strong> When
          you write to us, we keep your name, email, and message so we can
          reply.
        </li>
        <li>
          <strong className="text-foreground">Analytics.</strong> We use
          Vercel Analytics and Speed Insights to understand which pages are
          popular and how fast the site loads. These tools are cookieless and
          collect aggregate, anonymized data. They do not track you across
          other websites.
        </li>
      </ul>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        What we do not do
      </h2>
      <ul className="mt-5 space-y-3 text-muted-foreground">
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          We do not sell or rent your personal information to anyone.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          We do not use advertising trackers or cross-site cookies.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          We do not share your information except with the service providers
          named above (Stripe, Resend, Vercel), who process it on our behalf.
        </li>
      </ul>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Your choices and rights
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        You can unsubscribe from emails at any time using the link in any
        message. Depending on where you live (including California and the
        EU), you may have the right to request a copy of the personal
        information we hold about you, ask us to correct it, or ask us to
        delete it. To make any of these requests,{" "}
        <Link href="/contact" className="text-primary underline underline-offset-2">
          contact us
        </Link>{" "}
        and we will respond promptly.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">Retention</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        We keep order records for as long as needed for accounting and tax
        purposes. Newsletter addresses are kept until you unsubscribe. Contact
        messages are kept only as long as needed to resolve your question.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">Children</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        This site is not directed at children under 13, and we do not
        knowingly collect their personal information.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Changes to this policy
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        If we make meaningful changes, we will update this page and the date
        at the top. Questions?{" "}
        <Link href="/contact" className="text-primary underline underline-offset-2">
          Get in touch
        </Link>
        .
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Chef Healthy Henry collects, uses, and protects your information: membership, purchases, email, grocery lists, and the tools that run the kitchen.",
};

const LAST_UPDATED = "October 5, 2026";

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
          <strong className="text-foreground">Purchases and membership.</strong>{" "}
          When you buy a cookbook or join a membership, checkout is handled by
          Stripe. We receive your name, email address, what you bought or
          subscribed to, subscription status, and (for shipped books) your
          shipping address so we can deliver your order, keep your membership
          active, and answer questions about it. We never see or store your
          card number. Stripe&apos;s handling of your payment details is
          described in{" "}
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
          <strong className="text-foreground">Membership account.</strong> We
          store your email address, an optional name, and the membership tier
          and billing period Stripe reports to us. That record lives in our
          database, hosted by Neon, so you can sign in and pick up where you
          left off.
        </li>
        <li>
          <strong className="text-foreground">Sign-in links.</strong> There is
          no password. We email a one-time sign-in link using Resend, our
          email delivery provider. Your email address is shared with them for
          that purpose. The link expires in 15 minutes. We also keep a signed-in
          session on your device until you sign out or the session expires.
        </li>
        <li>
          <strong className="text-foreground">Digital delivery.</strong> When
          you buy a digital guide, we email your download link using Resend.
          Your email address is shared with them for that purpose only.
        </li>
        <li>
          <strong className="text-foreground">Sous.</strong> When you ask Sous
          a cooking question, the question and recent chat turns are sent to
          Anthropic so Sous can reply. We store a timestamp of each question
          so we can apply membership limits. We do not store the text of your
          questions on our servers. Your browser may keep the last question
          and answer in local storage so the chat can reopen where you left
          it. You can clear that last reply from the dashboard.
        </li>
        <li>
          <strong className="text-foreground">Saved recipes.</strong> When
          you save a recipe, we store that recipe with your account so you can
          open it again on any device. Signing out does not delete the list.
        </li>
        <li>
          <strong className="text-foreground">Grocery lists.</strong> Custom
          lists you save (ingredients, chosen recipes, and what is already in
          the cart) are stored with your account so you can reopen them on
          any device. We also count custom list builds against your current
          billing period. Chef Henry combinations you open are not stored as
          your lists.
        </li>
        <li>
          <strong className="text-foreground">Ingredient lookups.</strong> When
          someone adds an ingredient in the grocery builder, we record the
          ingredient name with a random visit id. That helps Henry see which
          ingredients the recipe library does not cover yet. The visit id is
          not your member id, and the row is not linked to your account.
        </li>
        <li>
          <strong className="text-foreground">Recipe makeovers.</strong> If you
          submit a recipe, we receive the recipe, your notes, an optional
          photo, and the email on your account. We email that packet to Henry
          using Resend so he can read it. If a recipe is selected, the
          makeover may appear on the membership site and in the private
          community, as described when you submit.
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
        <li>
          <strong className="text-foreground">Advertising.</strong> If we are
          running a paid ad campaign, we may use Meta (Facebook/Instagram)
          and Google advertising tools to measure how well those ads work and
          to show ads to people likely to be interested in Chef Healthy
          Henry. This can include a cryptographically hashed (not plain-text)
          version of your email address, shared with Meta and Google so a
          purchase or signup you made can be matched to the ad that led to
          it. See{" "}
          <a
            href="https://www.facebook.com/privacy/policy/"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Meta&apos;s privacy policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Google&apos;s privacy policy
          </a>
          . You can opt out of interest-based Meta ads through your{" "}
          <a
            href="https://www.facebook.com/adpreferences/ad_settings"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Meta ad settings
          </a>{" "}
          and of Google ad personalization through{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Google ad settings
          </a>
          .
        </li>
      </ul>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Who we share with
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        We share information only with the service providers who run this
        site for us, and only for the purposes above:
      </p>
      <ul className="mt-5 space-y-3 text-muted-foreground">
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Stripe, for checkout, subscriptions, and the billing portal.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Resend, for sign-in links, digital delivery, contact messages, and
          recipe makeover submissions.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Neon, for the membership database.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Anthropic, for Sous replies.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Vercel, for hosting and cookieless analytics.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          Meta and Google, when a paid ad campaign is running, for the hashed
          email described above.
        </li>
      </ul>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The private Protein Flip™ community lives on Facebook. If you open
        that group, you leave this site and Meta&apos;s privacy policy
        applies to whatever you do there. We do not send your membership
        record to Facebook for you.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Affiliate links
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Some recipe and grocery-list items include a Shop link to Just Better
        or Amazon. If you buy through one of those links, Chef Healthy Henry
        LLC may earn a commission. Just Better links open getjustbetter.com.
        Amazon links take you to Amazon, and{" "}
        <a
          href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-2"
        >
          Amazon&apos;s privacy policy
        </a>{" "}
        applies to what you do there. As an Amazon Associate, Chef Healthy
        Henry earns from qualifying purchases.
      </p>

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
          We do not share plain-text personal information with advertising
          platforms, only a hashed email address, and only as described
          above.
        </li>
        <li className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          We do not share your information except with the service providers
          named above, who process it on our behalf.
        </li>
      </ul>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Your choices and rights
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        You can unsubscribe from emails at any time using the link in any
        message. You can sign out from your kitchen, clear the last Sous
        reply stored in your browser, and cancel a membership from the
        billing card (or by writing to us if your account has no card on
        file). Canceling stops future charges. Access continues through the
        end of the period you already paid for.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Depending on where you live (including California and the EU), you
        may have the right to request a copy of the personal information we
        hold about you, ask us to correct it, or ask us to delete it. From
        your kitchen you can start a{" "}
        <a
          href="mailto:henry@chefhealthyhenry.com?subject=Chef%20Healthy%20Henry%3A%20Request%20my%20data"
          className="text-primary underline underline-offset-2"
        >
          data request
        </a>{" "}
        or an{" "}
        <a
          href="mailto:henry@chefhealthyhenry.com?subject=Chef%20Healthy%20Henry%3A%20Delete%20my%20account"
          className="text-primary underline underline-offset-2"
        >
          account deletion request
        </a>
        , or{" "}
        <Link href="/contact" className="text-primary underline underline-offset-2">
          contact us
        </Link>
        . We will respond promptly.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">Retention</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        We keep order and subscription records for as long as needed for
        accounting, tax, and to honor a membership you already paid for.
        Account, grocery-list, and combo-build records stay until you ask us
        to delete the account, or until the membership has been inactive long
        enough that we no longer need them to run the kitchen. Sign-in
        sessions expire on their own. Sous timestamps are kept only as long
        as needed to apply limits. Newsletter addresses are kept until you
        unsubscribe. Contact messages and makeover submissions are kept as
        long as needed to reply, teach from a selected recipe, or resolve
        your question. Ingredient lookups are kept in aggregate so Henry can
        see demand over time.
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

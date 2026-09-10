import { TIER_NAMES } from "@/lib/membership";
import type { Tier } from "@/lib/db";

export type ManageBillingCardProps = {
  tier: Tier;
  status: string | null;
  currentPeriodEnd: Date | null;
  canOpenPortal: boolean;
  unavailable: boolean;
};

function formatDate(value: Date): string {
  return value.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function periodCopy(
  status: string | null,
  currentPeriodEnd: Date | null
): string | null {
  const date = currentPeriodEnd ? formatDate(currentPeriodEnd) : null;
  if (status === "past_due") {
    return "A recent payment did not go through. Update the card on file to keep access.";
  }
  if (status === "canceled" && date) {
    return `Canceled. Access continues through ${date}.`;
  }
  if (date) {
    return `Renews on ${date}.`;
  }
  return null;
}

/**
 * Sidebar card that sends members to the Stripe customer portal to update
 * the card on file or cancel. The portal itself is hosted by Stripe.
 */
export function ManageBillingCard({
  tier,
  status,
  currentPeriodEnd,
  canOpenPortal,
  unavailable,
}: ManageBillingCardProps) {
  const period = periodCopy(status, currentPeriodEnd);

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Billing
      </p>
      <h2 className="mt-1 font-heading text-xl font-semibold">
        Manage billing
      </h2>
      <p className="mt-2 text-sm font-medium">{TIER_NAMES[tier]}</p>
      {period && (
        <p className="mt-1 text-sm text-muted-foreground">{period}</p>
      )}
      <p className="mt-2 text-sm text-muted-foreground">
        Update the card on file or cancel your membership. If you cancel, you
        keep access through the end of the period you paid for.
      </p>
      {unavailable && (
        <p className="mt-3 rounded-lg bg-secondary px-4 py-3 text-sm">
          Billing is not connected to a card on this account yet.
        </p>
      )}
      {canOpenPortal ? (
        <div className="mt-4 flex flex-col gap-2">
          <a
            href="/api/billing?action=card"
            className="inline-block rounded-full bg-primary px-5 py-2 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Update card
          </a>
          <a
            href="/api/billing?action=cancel"
            className="inline-block rounded-full border border-border px-5 py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-secondary"
          >
            Cancel membership
          </a>
          <a
            href="/api/billing"
            className="mt-1 text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            View invoices or change plan
          </a>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Email{" "}
          <a
            href="mailto:hello@chefhealthyhenry.com"
            className="underline underline-offset-4 hover:text-primary"
          >
            hello@chefhealthyhenry.com
          </a>{" "}
          to update payment details or cancel.
        </p>
      )}
    </section>
  );
}

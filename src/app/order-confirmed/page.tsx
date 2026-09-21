"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { trackPurchase } from "@/lib/track-events";

// Digital products sell through Stripe Payment Links, which redirect
// off-site, so a client pixel never fires on the buy click. Pointing a
// Payment Link's "after payment" redirect at this page (a Stripe Dashboard
// setting, no code) closes that gap: the purchase event fires here instead.
function Confirmation() {
  const params = useSearchParams();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const value = params.get("value");
    trackPurchase(value ? Number(value) : undefined);
  }, [params]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        You&apos;re all set
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Check your email for your download link. It usually arrives within a
        couple of minutes.
      </p>
      <Link
        href="/recipes"
        className="mt-8 inline-block rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Browse recipes
      </Link>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <Confirmation />
    </Suspense>
  );
}

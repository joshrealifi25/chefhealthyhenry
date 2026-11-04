"use client";

import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/track-events";

/** Fires the purchase pixel once for a verified guide checkout. */
export function TrackGuidePurchase({
  value,
  currency,
}: {
  value: number;
  currency: string;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackPurchase(value, currency);
  }, [value, currency]);

  return null;
}

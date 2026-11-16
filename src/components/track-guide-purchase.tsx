"use client";

import { useEffect, useRef } from "react";
import { trackGuidePurchase, trackPurchase } from "@/lib/track-events";

/**
 * Fires the purchase pixel and the Google Ads Guide Purchase conversion once
 * for a verified guide checkout. Google dedupes repeats of the same
 * transaction_id.
 */
export function TrackGuidePurchase({
  transactionId,
  value,
  currency,
}: {
  transactionId: string;
  value: number;
  currency: string;
}) {
  const fired = useRef(false);
  const googleFired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackPurchase(value, currency);
  }, [value, currency]);

  useEffect(() => {
    if (googleFired.current || !transactionId) return;
    let attempts = 0;
    let timer = 0;

    const send = () => {
      if (googleFired.current) return;
      if (trackGuidePurchase(transactionId, value, currency)) {
        googleFired.current = true;
        return;
      }
      attempts += 1;
      if (attempts < 20) timer = window.setTimeout(send, 250);
    };

    send();
    return () => window.clearTimeout(timer);
  }, [transactionId, value, currency]);

  return null;
}

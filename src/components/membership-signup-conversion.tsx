"use client";

import { useEffect, useRef } from "react";
import { trackMembershipSignup } from "@/lib/track-events";

/**
 * Fires the Membership Signup conversion once per visit to the post-payment
 * page. Google dedupes repeats of the same transaction_id.
 */
export function MembershipSignupConversion({
  transactionId,
}: {
  transactionId: string;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !transactionId) return;
    let attempts = 0;
    let timer = 0;

    const send = () => {
      if (fired.current) return;
      if (trackMembershipSignup(transactionId)) {
        fired.current = true;
        return;
      }
      attempts += 1;
      if (attempts < 20) timer = window.setTimeout(send, 250);
    };

    send();
    return () => window.clearTimeout(timer);
  }, [transactionId]);

  return null;
}

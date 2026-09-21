declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Client-side pixel events. Safe to call unconditionally: a no-op until the
 * base Meta Pixel / Google tag snippets are installed (NEXT_PUBLIC_META_PIXEL_ID
 * / NEXT_PUBLIC_GOOGLE_ADS_ID in layout.tsx), and ad blockers routinely make
 * window.fbq/gtag throw, so every call is wrapped rather than trusted.
 */
export function trackLead(): void {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", "Lead");
    window.gtag?.("event", "generate_lead");
  } catch {
    /* ad blockers routinely throw here; never break the page for it */
  }
}

export function trackPurchase(value?: number, currency = "USD"): void {
  if (typeof window === "undefined") return;
  try {
    const data = value !== undefined ? { value, currency } : undefined;
    window.fbq?.("track", "Purchase", data);
    window.gtag?.("event", "conversion", data);
  } catch {
    /* ad blockers routinely throw here; never break the page for it */
  }
}

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
export function trackLead(detail?: {
  source?: string;
  contentName?: string;
}): void {
  if (typeof window === "undefined") return;
  try {
    if (detail?.source || detail?.contentName) {
      const fb: Record<string, string> = {};
      const google: Record<string, string> = {};
      if (detail.contentName) {
        fb.content_name = detail.contentName;
        google.content_name = detail.contentName;
      }
      if (detail.source) {
        fb.content_category = detail.source;
        google.source = detail.source;
      }
      window.fbq?.("track", "Lead", fb);
      window.gtag?.("event", "generate_lead", google);
    } else {
      window.fbq?.("track", "Lead");
      window.gtag?.("event", "generate_lead");
    }
  } catch {
    /* ad blockers routinely throw here; never break the page for it */
  }
}

/** Google Ads "Membership Signup" conversion. */
export const MEMBERSHIP_SIGNUP_SEND_TO =
  "AW-18475081271/jRWxCJu4pJ4dELe8zelE";

export function trackMembershipSignup(
  transactionId: string,
  value: number,
  currency: string,
): boolean {
  if (typeof window === "undefined" || !window.gtag || !transactionId) return false;
  if (!Number.isFinite(value) || value < 0 || !currency) return false;
  try {
    window.gtag("event", "conversion", {
      send_to: MEMBERSHIP_SIGNUP_SEND_TO,
      transaction_id: transactionId,
      value,
      currency,
    });
    return true;
  } catch {
    /* ad blockers routinely throw here; never break the page for it */
    return false;
  }
}

/** Google Ads "Sampler Lead" conversion. */
export const SAMPLER_LEAD_SEND_TO = "AW-18475081271/6m3oCP2gwrMdELe8zelE";

/** Google Ads "Guide Purchase" conversion for When Nothing Sounds Good. */
export const GUIDE_PURCHASE_SEND_TO = "AW-18475081271/V5EECIChwrMdELe8zelE";

export function trackSamplerLead(): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", "conversion", { send_to: SAMPLER_LEAD_SEND_TO });
  } catch {
    /* ad blockers routinely throw here; never break the page for it */
  }
}

export function trackGuidePurchase(
  transactionId: string,
  value: number,
  currency: string,
): boolean {
  if (typeof window === "undefined" || !window.gtag || !transactionId) return false;
  if (!Number.isFinite(value) || value < 0 || !currency) return false;
  try {
    window.gtag("event", "conversion", {
      send_to: GUIDE_PURCHASE_SEND_TO,
      transaction_id: transactionId,
      value,
      currency,
    });
    return true;
  } catch {
    /* ad blockers routinely throw here; never break the page for it */
    return false;
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

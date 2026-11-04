/**
 * Where a sampler subscriber came from. Campaign links use ?source=.
 * utm_source is accepted only when source is absent, so a standard tagged
 * link still records a lead. The value is stored on the lead event.
 *
 * First ad test: meta-fridge, meta-dinner, meta-still, google-search.
 * A new slug does not need a code change. Anything outside the pattern
 * below is stored as "direct".
 */
export const SAMPLER_PATH = "/when-nothing-sounds-good";

/** $19 guide checkout. Owned by the guide checkout pull request. */
export const GUIDE_CHECKOUT_PATH = "/api/checkout/when-nothing-sounds-good";

/** Meta content_name / Google content_name for a sampler lead. */
export const SAMPLER_LEAD_NAME = "3-meals-sampler";

const SOURCE_RE = /^[a-z0-9][a-z0-9_-]{0,40}$/;

export function cleanLeadSource(raw: unknown): string {
  if (typeof raw !== "string") return "direct";
  const value = raw.trim().toLowerCase();
  return SOURCE_RE.test(value) ? value : "direct";
}

/** Prefer source, then utm_source. */
export function leadSourceFromParams(params: {
  source?: unknown;
  utm_source?: unknown;
}): string {
  if (typeof params.source === "string" && params.source.trim()) {
    return cleanLeadSource(params.source);
  }
  return cleanLeadSource(params.utm_source);
}

/** Keep the traffic source on an in-page link. */
export function hrefWithSource(href: string, source: string): string {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf("?");
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const params = new URLSearchParams(
    queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : ""
  );
  params.set("source", cleanLeadSource(source));
  return `${path}?${params.toString()}${hash}`;
}

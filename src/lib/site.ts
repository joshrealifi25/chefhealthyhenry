/**
 * Canonical site URL. Drives metadataBase, JSON-LD, sitemap, and OG tags.
 * At domain cutover, set NEXT_PUBLIC_SITE_URL=https://chefhealthyhenry.com in
 * Vercel and everything updates without code changes.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chef-healthy-henry.vercel.app";

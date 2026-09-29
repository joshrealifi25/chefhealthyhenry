import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const publicRules = {
  allow: "/",
  disallow: ["/api/", "/members/"],
};

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", ...publicRules },
      { userAgent: "Googlebot", ...publicRules },
      { userAgent: "bingbot", ...publicRules },
      { userAgent: "OAI-SearchBot", ...publicRules },
      { userAgent: "Claude-SearchBot", ...publicRules },
      { userAgent: "Claude-User", ...publicRules },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: new URL(SITE_URL).host,
  };
}

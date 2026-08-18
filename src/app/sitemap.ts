import type { MetadataRoute } from "next";
import { recipes } from "@/lib/recipes";
import { posts, postCategories } from "@/lib/posts";
import { exploreCards, hasArticle, EXPLORE_COLLECTIONS } from "@/lib/explore";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryPaths = postCategories.map((c) => `/blog/${c.slug}`);
  const collectionPaths = EXPLORE_COLLECTIONS.map((c) => `/explore/${c.slug}`);
  const staticPages = ["", "/recipes", "/cookbook", "/blog", ...categoryPaths, "/explore", ...collectionPaths, "/about", "/contact", "/accessibility", "/privacy", "/terms", "/disclaimer"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const recipePages = recipes.map((r) => ({
    url: `${SITE_URL}/recipes/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const postPages = posts.map((p) => ({
    url: `${SITE_URL}/post/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const explorePages = exploreCards.filter(hasArticle).map((c) => ({
    url: `${SITE_URL}/explore/article/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...recipePages, ...postPages, ...explorePages];
}

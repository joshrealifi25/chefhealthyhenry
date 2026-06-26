import postsData from "@/data/posts.json";

export interface PostBlock {
  type: "paragraph" | "heading" | "list" | "quote" | "image";
  html?: string;
  text?: string;
  level?: number;
  ordered?: boolean;
  items?: string[];
  src?: string;
}

export interface Post {
  slug: string;
  title: string;
  category: string;
  date: string;
  hero: string | null;
  excerpt: string;
  blocks: PostBlock[];
}

export const posts = [...(postsData as Post[])].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function postsByCategory(category: string): Post[] {
  return posts.filter((p) => p.category === category);
}

// Clean URL slugs for the known categories; falls back to a generated slug.
const CATEGORY_SLUGS: Record<string, string> = {
  "Chef's Notes": "notes",
  "Table Talk": "table-talk",
  "Fast Food": "fast-food",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function categorySlug(category: string): string {
  return CATEGORY_SLUGS[category] ?? slugify(category);
}

/** All categories present in the posts, in first-seen order, with their slugs. */
export const postCategories: { name: string; slug: string }[] = Array.from(
  new Set(posts.map((p) => p.category))
).map((name) => ({ name, slug: categorySlug(name) }));

export function categoryFromSlug(slug: string): string | undefined {
  return postCategories.find((c) => c.slug === slug)?.name;
}

export function relatedPosts(post: Post, count = 3): Post[] {
  const sameCategory = posts.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  );
  const others = posts.filter(
    (p) => p.slug !== post.slug && p.category !== post.category
  );
  return [...sameCategory, ...others].slice(0, count);
}

/** ISO date (YYYY-MM-DD) for schema and the <time> element. */
export function isoDate(date: string): string {
  const d = new Date(date);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

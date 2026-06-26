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

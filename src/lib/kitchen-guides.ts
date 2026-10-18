import guidesData from "@/data/kitchen-guides.json";
import type { ContentBlock } from "@/lib/content-blocks";

export interface KitchenGuide {
  slug: string;
  title: string;
  date: string;
  hero: string | null;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  blocks: ContentBlock[];
}

export const kitchenGuides = [...(guidesData as KitchenGuide[])].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export function getKitchenGuide(slug: string): KitchenGuide | undefined {
  return kitchenGuides.find((g) => g.slug === slug);
}

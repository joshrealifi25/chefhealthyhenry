import lessonsData from "@/data/lessons.json";
import guidesData from "@/data/guides.json";
import type { ContentBlock } from "@/lib/content-blocks";

/**
 * Tier 1 member library: Application Lessons and Kitchen Guides.
 * Shapes follow Tier1_Protein_Flip_Kitchen_Spec_Final.md (lesson structure,
 * library categories) and Kitchen_Guides_Presentation_Spec.md (guide pages,
 * callout cards, many-to-many lesson links).
 */

/** A link out to free content, another lesson, or a companion offer. */
export interface RelatedLink {
  label: string;
  href: string;
}

/** Optional closing offer (Tier 2, a Cooking Course) shown after a lesson. */
export interface LessonCta {
  heading: string;
  text: string;
  label: string;
  href: string;
}

export interface Lesson {
  slug: string;
  title: string;
  /** One or more of LIBRARY_CATEGORIES names. */
  categories: string[];
  blurb: string;
  /** Publish date; the newest lesson is the dashboard's current lesson. */
  date: string;
  hero?: string | null;
  subtitle?: string;
  /**
   * The free content that introduced this subject (spec §3.1): the recipe,
   * Explore page, or Journal article the lesson builds on.
   */
  fromFreeContent?: RelatedLink[];
  /** Focused demonstration, only when seeing the technique matters (§3.6). */
  videoId?: string | null;
  /** Other Tier 1 lessons to read next (§3.10). */
  relatedLessonSlugs?: string[];
  /** Optional companion Cooking Course or Tier 2 offer (§5). */
  cta?: LessonCta;
  blocks: ContentBlock[];
}

export interface Guide {
  slug: string;
  title: string;
  categories: string[];
  blurb: string;
  date: string;
  /** Slugs of every lesson this guide supports (many-to-many). */
  relatedLessonSlugs: string[];
  blocks: ContentBlock[];
}

/** The nine Tier 1 library categories, per spec §6. */
export const LIBRARY_CATEGORIES: { name: string; slug: string }[] = [
  { name: "Latest", slug: "latest" },
  { name: "Recipe Applications", slug: "recipe-applications" },
  { name: "Ingredient Applications", slug: "ingredient-applications" },
  { name: "Kitchen Skills Applications", slug: "kitchen-skills-applications" },
  { name: "Flavor Builder Applications", slug: "flavor-builder-applications" },
  {
    name: "Protein Flip™ Foundation Applications",
    slug: "protein-flip-foundation-applications",
  },
  { name: "Grocery Decisions", slug: "grocery-decisions" },
  { name: "Seasonal Applications", slug: "seasonal-applications" },
  { name: "Kitchen Guides", slug: "kitchen-guides" },
];

/** Category slug that means "everything, newest first". */
export const LATEST_SLUG = "latest";
/** Category slug the "Browse all guides" link deep-links into. */
export const GUIDES_SLUG = "kitchen-guides";

const byDateDesc = <T extends { date: string }>(a: T, b: T) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export const lessons = [...(lessonsData as Lesson[])].sort(byDateDesc);
export const guides = [...(guidesData as Guide[])].sort(byDateDesc);

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/** The lesson the dashboard's "This Month's Application Lesson" card opens. */
export function currentLesson(): Lesson | undefined {
  return lessons[0];
}

export function categoryFromSlug(slug: string): string | undefined {
  return LIBRARY_CATEGORIES.find((c) => c.slug === slug)?.name;
}

export function categorySlug(name: string): string | undefined {
  return LIBRARY_CATEGORIES.find((c) => c.name === name)?.slug;
}

/** Guides that support a given lesson (many-to-many, so there may be several). */
export function guidesForLesson(lessonSlug: string): Guide[] {
  return guides.filter((g) => g.relatedLessonSlugs.includes(lessonSlug));
}

/** Lessons a guide supports, in library order. */
export function lessonsForGuide(guide: Guide): Lesson[] {
  return guide.relatedLessonSlugs
    .map((slug) => getLesson(slug))
    .filter((l): l is Lesson => Boolean(l));
}

/** Other Tier 1 lessons this lesson points forward to. */
export function relatedLessons(lesson: Lesson): Lesson[] {
  return (lesson.relatedLessonSlugs ?? [])
    .map((slug) => getLesson(slug))
    .filter((l): l is Lesson => Boolean(l) && l!.slug !== lesson.slug);
}

/** A library card is either a lesson or a guide; both browse in one grid. */
export type LibraryItem =
  | ({ kind: "lesson"; href: string } & Lesson)
  | ({ kind: "guide"; href: string } & Guide);

const allItems: LibraryItem[] = [
  ...lessons.map((l) => ({
    ...l,
    kind: "lesson" as const,
    href: `/members/library/lessons/${l.slug}`,
  })),
  ...guides.map((g) => ({
    ...g,
    kind: "guide" as const,
    href: `/members/library/guides/${g.slug}`,
  })),
].sort(byDateDesc);

/**
 * Library items for a category pill. "Latest" is everything newest-first;
 * "Kitchen Guides" is every guide; other pills match category tags.
 */
export function libraryItems(categorySlugValue: string): LibraryItem[] {
  if (categorySlugValue === LATEST_SLUG) return allItems;
  if (categorySlugValue === GUIDES_SLUG) {
    return allItems.filter((i) => i.kind === "guide");
  }
  const name = categoryFromSlug(categorySlugValue);
  if (!name) return [];
  return allItems.filter((i) => i.categories.includes(name));
}

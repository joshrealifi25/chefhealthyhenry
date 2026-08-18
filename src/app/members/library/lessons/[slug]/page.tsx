import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getMember } from "@/lib/auth";
import { getLesson, guidesForLesson, GUIDES_SLUG } from "@/lib/lessons";
import { ContentBlocks } from "@/components/content-blocks";
import { LibraryBrowseLinks } from "@/components/library-browse-links";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return {
    title: lesson?.title ?? "Lesson",
    description: lesson?.blurb,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const member = await getMember();
  if (!member) redirect("/members/login");
  if (!member.tier) redirect("/membership");

  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const relatedGuides = guidesForLesson(lesson.slug);

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {lesson.categories.join(" · ")}
      </p>
      <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-balance">
        {lesson.title}
      </h1>
      {lesson.subtitle && (
        <p className="mt-3 text-lg italic text-muted-foreground">
          {lesson.subtitle}
        </p>
      )}

      {/* A guide tied to this lesson is called out inline, separate from the
          standing browse links below. */}
      {relatedGuides.map((guide) => (
        <aside
          key={guide.slug}
          className="mt-8 rounded-2xl border border-border bg-accent/40 p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Kitchen Guide
          </p>
          <h2 className="mt-1 font-heading text-lg font-semibold">
            {guide.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{guide.blurb}</p>
          <Link
            href={`/members/library/guides/${guide.slug}`}
            className="mt-3 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open the Kitchen Guide
          </Link>
        </aside>
      ))}

      <div className="mt-8">
        <ContentBlocks blocks={lesson.blocks} />
      </div>

      <LibraryBrowseLinks guidesSlug={GUIDES_SLUG} />
    </article>
  );
}

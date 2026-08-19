import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getMember } from "@/lib/auth";
import {
  getLesson,
  guidesForLesson,
  relatedLessons,
  GUIDES_SLUG,
} from "@/lib/lessons";
import { ContentBlocks } from "@/components/content-blocks";
import { LibraryBrowseLinks } from "@/components/library-browse-links";
import { YouTubeEmbed } from "@/components/youtube-embed";

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

  const guides = guidesForLesson(lesson.slug);
  const nextLessons = relatedLessons(lesson);

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

      {/* Spec §3.1: the free content that introduced this subject. */}
      {lesson.fromFreeContent && lesson.fromFreeContent.length > 0 && (
        <p className="mt-5 text-sm text-muted-foreground">
          Builds on:{" "}
          {lesson.fromFreeContent.map((link, i) => (
            <span key={link.href}>
              {i > 0 && ", "}
              <Link
                href={link.href}
                className="text-primary underline underline-offset-4"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </p>
      )}

      {/* Kitchen Guide callout: a card near the top, per the guides spec.
          Separate from the standing browse links at the foot of the page. */}
      {guides.map((guide) => (
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

      {/* Spec §3.6: a focused demonstration, only when seeing it matters. */}
      {lesson.videoId && (
        <section className="mt-10">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Watch the technique
          </h2>
          <div className="mt-4">
            <YouTubeEmbed videoId={lesson.videoId} title={lesson.title} />
          </div>
        </section>
      )}

      {/* Spec §3.10: related content, forward to other lessons and guides. */}
      {nextLessons.length > 0 && (
        <section className="mt-12 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold">Keep going</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {nextLessons.map((next) => (
              <li key={next.slug}>
                <Link
                  href={`/members/library/lessons/${next.slug}`}
                  className="text-primary hover:underline"
                >
                  {next.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Spec §5: an optional companion offer. The lesson stands alone. */}
      {lesson.cta && (
        <section className="mt-8 rounded-2xl border border-dashed border-border bg-secondary/50 p-6">
          <h2 className="font-heading text-lg font-semibold">
            {lesson.cta.heading}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {lesson.cta.text}
          </p>
          <Link
            href={lesson.cta.href}
            className="mt-4 inline-block rounded-full border border-border px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
          >
            {lesson.cta.label}
          </Link>
        </section>
      )}

      <LibraryBrowseLinks guidesSlug={GUIDES_SLUG} />
    </article>
  );
}

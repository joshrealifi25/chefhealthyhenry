import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getMember } from "@/lib/auth";
import { getGuide, lessonsForGuide, GUIDES_SLUG } from "@/lib/lessons";
import { ContentBlocks } from "@/components/content-blocks";
import { LibraryBrowseLinks } from "@/components/library-browse-links";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  return {
    title: guide?.title ?? "Kitchen Guide",
    description: guide?.blurb,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const member = await getMember();
  if (!member) redirect("/members/login");
  if (!member.tier) redirect("/membership");

  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const relatedLessons = lessonsForGuide(guide);

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Kitchen Guide
      </p>
      <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-balance">
        {guide.title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{guide.blurb}</p>

      <div className="mt-8">
        <ContentBlocks blocks={guide.blocks} />
      </div>

      {relatedLessons.length > 0 && (
        <section className="mt-12 rounded-2xl border border-border bg-card p-6 print:hidden">
          <h2 className="font-heading text-lg font-semibold">
            {relatedLessons.length > 1
              ? "Lessons that use this guide"
              : "The lesson behind this guide"}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {relatedLessons.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  href={`/members/library/lessons/${lesson.slug}`}
                  className="text-primary hover:underline"
                >
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="print:hidden">
        <LibraryBrowseLinks guidesSlug={GUIDES_SLUG} />
      </div>
    </article>
  );
}

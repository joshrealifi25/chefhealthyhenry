import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { kitchenGuides, getKitchenGuide } from "@/lib/kitchen-guides";
import { ContentBlocks } from "@/components/content-blocks";

export function generateStaticParams() {
  return kitchenGuides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getKitchenGuide(slug);
  if (!guide) return {};
  return {
    title: guide.seoTitle ?? guide.title,
    description: guide.seoDescription ?? guide.excerpt,
    alternates: { canonical: `/kitchen/${slug}` },
    openGraph: guide.hero ? { images: [{ url: guide.hero }] } : undefined,
  };
}

export default async function KitchenGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getKitchenGuide(slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">
        <Link href="/kitchen" className="hover:underline">
          In the Kitchen
        </Link>{" "}
        / Kitchen Guides
      </p>

      <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        {guide.title}
      </h1>

      {guide.hero && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-muted">
          <Image
            src={guide.hero}
            alt={guide.title}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>
      )}

      <div className="mt-10">
        <ContentBlocks blocks={guide.blocks} />
      </div>
    </article>
  );
}

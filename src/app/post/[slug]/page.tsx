import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  posts,
  getPost,
  relatedPosts,
  isoDate,
  categorySlug,
  type PostBlock,
} from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.hero ? [post.hero] : undefined,
    },
  };
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "heading": {
      const Tag = (`h${block.level ?? 2}`) as "h2" | "h3" | "h4";
      return (
        <Tag className="mt-10 font-heading text-2xl font-semibold tracking-tight">
          {block.text}
        </Tag>
      );
    }
    case "list":
      return block.ordered ? (
        <ol className="my-4 list-decimal space-y-2 pl-6 text-foreground/90">
          {block.items?.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
          ))}
        </ol>
      ) : (
        <ul className="my-4 list-disc space-y-2 pl-6 text-foreground/90">
          {block.items?.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-6 border-l-2 border-primary pl-5 font-heading text-xl italic text-foreground/80">
          {block.text}
        </blockquote>
      );
    case "image":
      return null;
    default:
      return (
        <p
          className="mt-5 leading-relaxed text-foreground/90"
          dangerouslySetInnerHTML={{ __html: block.html ?? "" }}
        />
      );
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = relatedPosts(post);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.hero ? [`${SITE_URL}${post.hero}`] : undefined,
    datePublished: isoDate(post.date) || undefined,
    articleSection: post.category,
    author: { "@type": "Person", name: "Chef Healthy Henry" },
    publisher: { "@type": "Person", name: "Chef Healthy Henry" },
    mainEntityOfPage: `${SITE_URL}/post/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> All posts
      </Link>

      <header className="mt-6">
        <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
          <Link
            href={`/blog/${categorySlug(post.category)}`}
            className="text-primary hover:underline"
          >
            {post.category}
          </Link>
          {post.date && (
            <time dateTime={isoDate(post.date)}>· {post.date}</time>
          )}
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
      </header>

      {post.hero && (
        <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-2xl shadow-md">
          <Image
            src={post.hero}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-8">
        {post.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>

      <p className="mt-12 border-t border-border pt-8 font-heading text-lg text-primary">
        Balanced Protein. Better Living. Healthier Planet.
      </p>

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-heading text-2xl font-semibold">Keep reading</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

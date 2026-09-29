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
  type Post,
} from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { ContentBlocks } from "@/components/content-blocks";
import { SITE_URL } from "@/lib/site";

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function buildFaqSchema(post: Post) {
  const pairs: { question: string; answer: string }[] = [];

  const firstParagraph = post.blocks.find((b) => b.type === "paragraph");
  if (firstParagraph?.html) {
    pairs.push({
      question: post.title,
      answer: stripHtml(firstParagraph.html),
    });
  }

  let currentHeading: string | null = null;
  let currentAnswerParts: string[] = [];

  for (const block of post.blocks) {
    if (block.type === "heading" && block.level === 2) {
      if (currentHeading && currentAnswerParts.length > 0) {
        pairs.push({
          question: currentHeading,
          answer: currentAnswerParts.join(" "),
        });
      }
      currentHeading = block.text ?? null;
      currentAnswerParts = [];
    } else if (block.type === "paragraph" && currentHeading && block.html) {
      currentAnswerParts.push(stripHtml(block.html));
    }
  }

  if (currentHeading && currentAnswerParts.length > 0) {
    pairs.push({
      question: currentHeading,
      answer: currentAnswerParts.join(" "),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map((p) => ({
      "@type": "Question",
      name: p.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: p.answer,
      },
    })),
  };
}

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
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: post.hero ? [post.hero] : undefined,
    },
  };
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
  const faqSchema =
    post.category === "Kitchen Questions" ? buildFaqSchema(post) : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
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
        <ContentBlocks blocks={post.blocks} />
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

import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-md"
    >
      {post.hero && (
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <Image
            src={post.hero}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <span className="text-primary">{post.category}</span>
          {post.date && <span>· {post.date}</span>}
        </div>
        <h3 className="mt-2 font-heading text-xl font-semibold leading-snug group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

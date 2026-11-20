"use client";

import Link from "next/link";

const TOKEN = /(\[[^\]]+\]\([^)]+\))/g;

/** Renders recipe copy and turns [label](/path) into a site link. */
export function InlineLinks({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <span>
      {parts.map((part, i) => {
        if (!part) return null;
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) return <span key={i}>{part}</span>;
        return (
          <Link key={i} href={match[2]} className="text-primary hover:underline">
            {match[1]}
          </Link>
        );
      })}
    </span>
  );
}

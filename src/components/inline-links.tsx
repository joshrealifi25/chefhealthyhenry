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
        const href = match[2];
        // Amazon shop searches open in a new tab, the same way Shop links do.
        // Other external links, including getjustbetter.com, stay in this tab,
        // matching the existing recipe extras.
        if (href.startsWith("https://www.amazon.com/")) {
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-primary hover:underline"
            >
              {match[1]}
              <span className="sr-only"> on Amazon (opens in a new window)</span>
            </a>
          );
        }
        return (
          <Link key={i} href={href} className="text-primary hover:underline">
            {match[1]}
          </Link>
        );
      })}
    </span>
  );
}

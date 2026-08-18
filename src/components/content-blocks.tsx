import type { ContentBlock } from "@/lib/content-blocks";

/** Renders one rich-text block (paragraph, heading, list, quote, image). */
function Block({ block }: { block: ContentBlock }) {
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

/** Renders a full array of rich-text blocks in order. */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-80">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

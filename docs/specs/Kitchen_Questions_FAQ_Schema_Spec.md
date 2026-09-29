# FAQ Schema for Kitchen Questions Posts

## ⚠️ Scope boundary — read this first

This task is for the **public blog only**. It touches a single file:
- `src/app/post/[slug]/page.tsx`

Do NOT touch anything under:
- `src/app/members/` — that is the paid Kitchen membership area
- `src/data/lessons.json` or `src/data/guides.json` — those are member library files

The name overlap is intentional: "Kitchen Questions" is the public Q&A blog section. "Kitchen" is the paid membership tier. They are separate features in separate parts of the site.

## Goal

Add `FAQPage` JSON-LD structured data to every post in the Kitchen Questions
category. This surfaces expandable Q&A pairs directly in Google search results
beneath the blue link, without requiring a click, which is one of the
highest-value schema enhancements for question-answer content.

## File to change

`src/app/post/[slug]/page.tsx`

## What to add

### 1. A helper that extracts FAQ pairs from post blocks

Add this function inside or above the `PostPage` component:

```ts
function buildFaqSchema(post: Post) {
  // Pair each H2 heading with all paragraph blocks that follow it,
  // until the next heading or end of blocks.
  const pairs: { question: string; answer: string }[] = [];

  // First entry: the post title as the question, first paragraph as the answer.
  const firstParagraph = post.blocks.find((b) => b.type === "paragraph");
  if (firstParagraph && "html" in firstParagraph) {
    pairs.push({
      question: post.title,
      answer: stripHtml(firstParagraph.html),
    });
  }

  // Subsequent entries: each H2 + the paragraphs that follow it.
  let currentHeading: string | null = null;
  let currentAnswerParts: string[] = [];

  for (const block of post.blocks) {
    if (block.type === "heading" && "level" in block && block.level === 2) {
      if (currentHeading && currentAnswerParts.length > 0) {
        pairs.push({
          question: currentHeading,
          answer: currentAnswerParts.join(" "),
        });
      }
      currentHeading = "text" in block ? block.text : null;
      currentAnswerParts = [];
    } else if (block.type === "paragraph" && currentHeading && "html" in block) {
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}
```

### 2. Call it inside PostPage and inject the result as a second JSON-LD script

In the `PostPage` component, after the existing `schema` object, add:

```ts
const faqSchema =
  post.category === "Kitchen Questions" ? buildFaqSchema(post) : null;
```

Then in the JSX, directly after the existing `<script type="application/ld+json">` block, add:

```tsx
{faqSchema && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
  />
)}
```

Keep the existing `Article` schema. Google accepts both on the same page.

## Types to check

Before writing the code, read `src/lib/content-blocks.ts` to confirm the
exact shape of `ContentBlock` (especially the `heading` type and how `text`
and `level` are typed). The helper above assumes:

```ts
{ type: "heading"; level: number; text: string }
{ type: "paragraph"; html: string }
```

Adjust field names if the actual types differ.

## Validation after merge

1. Run `npm run check` — must pass with no errors.
2. Open any Kitchen Questions post in the Vercel preview.
3. Copy the page URL into Google's Rich Results Test:
   https://search.google.com/test/rich-results
4. Confirm it detects "FAQ" as an eligible rich result type.

## Branch name

`feat/faq-schema-kitchen-questions`

## Notes

- Do not add FAQPage schema to Chef's Notes or Table Talk posts. The
  condition `post.category === "Kitchen Questions"` gates it correctly.
- The `stripHtml` helper must strip all tags cleanly. The answer text in
  schema must be plain text, not HTML.
- Keep answer text under 300 words per entry — Google may truncate longer
  answers in the search result display anyway.
- No em dashes in any text that passes through `stripHtml`. The source posts
  already comply.

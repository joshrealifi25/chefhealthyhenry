# Kitchen Questions: New Blog Category

## ⚠️ Scope boundary — read this first

This task is for the **public blog only**. It touches:
- `src/lib/posts.ts`
- `src/data/posts.json`
- `src/app/blog/` pages

Do NOT touch anything under:
- `src/app/members/` — that is the paid Kitchen membership area
- `src/data/lessons.json` or `src/data/guides.json` — those are member library content
- Any file with "kitchen" in the path under the members route

The name overlap is intentional: "Kitchen Questions" is the public Q&A blog section. "Kitchen" is the paid membership tier. They are separate features in separate parts of the site.

## Overview

Add a new blog category called **Kitchen Questions** to the site. These are short, search-optimized posts that answer specific cooking questions directly, then link to relevant recipes and the Kitchen membership. They live at `/blog` alongside Chef's Notes and Table Talk, with their own filter tab.

## What to build

### 1. Add the new category slug (src/lib/posts.ts)

In the `CATEGORY_SLUGS` map, add:

```ts
"Kitchen Questions": "kitchen-questions",
```

That is all the code change needed. The blog index and category pages are already dynamic and will pick up the new category automatically once posts exist with that category name.

### 2. Add posts to src/data/posts.json

The file `docs/kitchen-questions-posts.json` now contains all 25 Kitchen Questions posts. 16 of them are already in `src/data/posts.json` (the September 28 batch). Append only the 9 new posts dated September 15, 2026 — slugs: what-is-the-mediterranean-diet, how-long-to-boil-eggs, vegan-protein-sources, vegetarian-protein-sources, what-does-season-to-taste-mean, how-to-meal-prep-proteins, white-rice-vs-brown-rice, healthiest-cooking-oils, how-to-make-healthy-food-taste-good. Do not duplicate the 16 already live.

Hero images are set to `null` for now. Images will be added in a follow-up pass once photography is ready. The content check accepts `null` for hero.

### 3. Run the check

```bash
npm run check
```

Fix any errors before opening a PR. The most common issue will be an internal link pointing at a slug that does not exist — double-check any `/recipes/` links in the post blocks.

## Branch name

`feature/kitchen-questions-category`

## Notes

- No em dashes anywhere in the post content.
- No exclamation points.
- Sous is never called "AI" — it is described as a personal kitchen resource.
- All internal links use relative paths (`/recipes/slug`, `/post/slug`).
- The category name in the JSON must match exactly: `Kitchen Questions` (with a capital K and Q, space between words).
- Posts are ordered by date. Use dates in the September 2026 or October 2026 range.

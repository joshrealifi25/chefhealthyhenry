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

The file `docs/kitchen-questions-posts.json` now contains **48 Kitchen Questions posts** total.

25 of them are already live in `src/data/posts.json` (the original batch). Append only the 23 new posts — all dated October 1, 2026. Their slugs are:

- what-can-i-use-instead-of-heavy-cream
- can-i-use-dried-herbs-instead-of-fresh
- can-i-substitute-canned-beans-for-dried-beans
- can-i-use-frozen-vegetables-instead-of-fresh
- do-i-need-to-press-tofu-before-cooking
- do-i-need-to-salt-eggplant-before-cooking
- do-i-need-to-rinse-rice-before-cooking
- should-i-peel-squash-before-roasting
- how-do-i-get-tofu-crispy
- how-do-i-cook-fish-without-drying-it-out
- how-do-i-keep-garlic-from-burning
- how-do-i-cook-dried-beans
- how-do-i-fix-food-that-is-too-spicy
- how-do-i-thicken-soup-without-cream
- why-is-my-meat-tough-after-cooking-for-hours
- what-can-i-make-with-ingredients-i-have
- which-meals-freeze-and-reheat-well
- how-do-i-reheat-chicken-without-drying-it-out
- how-to-meal-prep-without-eating-the-same-thing
- how-to-make-a-salad-filling-enough-for-dinner
- how-to-turn-soup-into-a-complete-meal
- how-to-add-more-protein-without-more-meat
- how-to-add-more-fiber-to-everyday-meals

Do not duplicate any post already in `src/data/posts.json`. Check slugs before appending.

### 3. Run the check

```bash
npm run check
```

Fix any errors before opening a PR. The most common issue will be an internal link pointing at a slug that does not exist — double-check any `/recipes/` links in the post blocks.

## Branch name

`fix/kitchen-questions-membership-link`

## Notes

- No em dashes anywhere in the post content.
- No exclamation points.
- Sous is never called "AI" — it is described as a personal kitchen resource.
- All internal links use relative paths (`/recipes/slug`, `/post/slug`).
- Membership CTAs must link to `/membership` (the public sign-up page). Never use `/members`. That route is the logged-in dashboard and sends visitors to login.
- The category name in the JSON must match exactly: `Kitchen Questions` (with a capital K and Q, space between words).
- Posts are ordered by date. Use dates in the September 2026 or October 2026 range.

<!-- AUTO-GENERATED from AGENTS.md — do not edit directly.
     Run `bash scripts/sync-agent-rules.sh` to regenerate. -->

---
description: Project conventions for Chef Healthy Henry
alwaysApply: true
---
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Chef Healthy Henry

The website for Chef Healthy Henry: recipes, essays, cookbooks, and a
membership library, built around the Protein Flip™ method. Live at
chefhealthyhenry.com, deployed from `main` on Vercel.

This repository began life as a website cloning template. That phase is long
over. Ignore any leftover references to cloning, target sites, or
pixel-perfect emulation. This is a real production site with its own content
and its own house rules, and those rules are below.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript strict
- Tailwind CSS v4 with oklch design tokens in `src/app/globals.css`
- shadcn/ui on Radix primitives, `cn()` from `src/lib/utils.ts`
- Lucide React icons
- Neon Postgres via Drizzle, Stripe, Resend, Vercel Blob

## Design

Deliciously Ella-inspired: clean white and cream, Fraunces serif headings,
sage-green accents. The tokens are oklch values in `src/app/globals.css`.
Change them there, not in components.

## Deployment

Vercel project `chef-healthy-henry` on account josh-2807, currently serving
https://chef-healthy-henry.vercel.app. `SITE_URL` in `src/lib/site.ts` reads
`NEXT_PUBLIC_SITE_URL`, so the domain cutover is an env var change with no
code change. Recipe and cookbook content originates from Henry's Webflow CMS
at chefhealthyhenry.com.

## Commands

- `npm run dev` starts the dev server
- `npm run check` runs everything CI runs: lint, typecheck, content, style, build
- `npm run check:content` is the fast one, and catches most content mistakes

Run `npm run check` before every commit. The full suite passes with no
environment variables set, so content work never needs credentials.

## Content model

All content is JSON in `src/data/`. There is no CMS and no folder of markdown
posts. Adding content means appending an object to the right array.

| What | File | Renders at |
| --- | --- | --- |
| Recipes | `src/data/recipes.json` | `/recipes/<slug>` |
| Blog posts | `src/data/posts.json` | `/post/<slug>` |
| Explore articles | `src/data/explore.json` | `/explore/article/<slug>` |
| Member lessons | `src/data/lessons.json` | `/members/library/lessons/<slug>` |
| Member guides | `src/data/guides.json` | `/members/library/guides/<slug>` |
| Cookbooks for sale | `src/data/cookbooks.ts` | `/cookbook` |

Types live alongside each collection in `src/lib/` (`recipes.ts`, `posts.ts`,
`explore.ts`, `lessons.ts`). Read the type before writing an entry.

### Recipes

Required: `slug`, `title`, `image`, `ingredients`, `directions`. A recipe
missing any of ingredients, directions, or an image fails the content check.

- `directions` is a list of `{title, text}` and holds cooking steps ONLY
- `extras` is a list of `{title, items}` for Chef's Tips, Serving Notes, Why
  It Works. Never fold tips into numbered steps
- Images go in `public/images/recipes/`, named from the slug truncated to 60
  characters

### Blog posts

Body content is structured blocks, not markdown. `blocks` is an array of
typed objects and only three types are in use: `paragraph`, `heading`, and
`list`.

- Required: `slug`, `title`, `category`, `date`, `hero`, `excerpt`, `blocks`,
  `seoTitle`, `seoDescription`
- `category` is exactly `Chef's Notes` or `Table Talk`
- `date` is a human string, for example `May 6, 2026`
- `hero` is `/images/blog/<slug>.jpg`, and the file goes in
  `public/images/blog/`

### Importing recipes from the Webflow CMS

Export a CSV from Webflow, then re-run the import and reparse scripts. See
git history for the `/tmp/import_csv.py` and `/tmp/reparse_directions.py`
patterns. Watch for Excel artifacts: serving ranges turn into dates, so
"3-Feb" means "2-3".

## Writing style (locked rules)

- NO em dashes anywhere in site copy. Use a period, a comma, or a colon.
- No exclamation points. No buzzwords.
- Benefit-led and specific. One primary call to action per page.
- The flagship book is "The Protein Flip™ Method and Cookbook, Deluxe
  Edition". Always "The", always "and", never "&".
- Page titles are short. Write "About", not "About Chef Henry". The template
  appends " | Chef Healthy Henry".

`npm run check:style` enforces the first, third, and fifth of these, and only
on lines you changed.

## What the content check catches

`npm run check:content` exists because a green build proves nothing about
content. It fails on duplicate slugs within a collection, a draft in
`docs/member-lessons/` sharing a slug with live content, an image path not
present in `public/`, a recipe missing ingredients or directions or an image,
an internal link pointing at a page that does not exist, and an env var read
by code but absent from `.env.example`.

## Publishing a change

1. `git checkout main` then `git pull`. Never commit onto an old branch.
2. Create a NEW branch with a short descriptive name, for example
   `recipe-harissa-salmon` or `tweak-home-subtitle`.
3. Make the change, then run `npm run check`.
4. Commit, push, open a pull request, check the Vercel preview, merge.
5. Merging deploys to production in about a minute.

Never push directly to `main`. `main` is the live site.

## Files that need Josh's review

Listed in `.github/CODEOWNERS`. A mistake in these breaks checkout or takes
the site down rather than just looking wrong:

- `src/app/api/` and `src/lib/fulfillment.ts`: payments and PDF delivery
- `src/data/cookbooks.ts`: what is for sale and at what price
- `next.config.ts`, `src/lib/site.ts`, `package.json`, `.github/`

Adding recipes, posts, lessons, guides, and images touches none of these. If
a merge is blocked on one, stop and tag Josh. Do not work around it.

## Strategy documents

- `docs/marketing-plan.md`: funnel, priorities, email rules. Read it before
  any marketing, copy, or growth work.
- `docs/for-henry.md`: the plain-English guide to shipping a change.
- `docs/emails/`: the welcome sequence, sent via Resend Broadcasts.

## Code style

- TypeScript strict, no `any`
- Named exports, PascalCase components, camelCase utilities
- Tailwind utility classes, no inline styles
- 2-space indentation, mobile-first responsive

## Cursor Cloud specific instructions

Cloud agents run with no secrets, which is fine: lint, typecheck, content,
style, and build all pass without them. Anything that calls Stripe, Neon,
Resend, or Anthropic at runtime cannot be exercised in this environment, so
do not try to verify membership, checkout, or email flows here.

The dev server is already running on port 3000 via the configured terminal.
Use it to screenshot pages and attach them to the pull request so changes can
be reviewed from a phone.

## Maintaining this file

`AGENTS.md` is the single source of truth for agent instructions. After
editing it, run `bash scripts/sync-agent-rules.sh` to regenerate the
platform-specific copies. `CLAUDE.md` and `GEMINI.md` import it and need no
regeneration.

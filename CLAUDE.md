@AGENTS.md

# Chef Healthy Henry — House Rules

## Site overview
- Live site: https://chef-healthy-henry.vercel.app (Vercel project `chef-healthy-henry`, account josh-2807)
- Design: Deliciously Ella-inspired. Clean white/cream, Fraunces serif headings, sage-green accents (oklch tokens in `src/app/globals.css`).
- Content source: chefhealthyhenry.com (Henry's Webflow CMS). Cookbook purchases link to that site's checkout.

## Writing style (locked rules)
- NO em dashes anywhere in site copy. Use periods, commas, or colons.
- Benefit-led, specific copy. One primary CTA per page. No exclamation points, no buzzwords.
- The flagship book is "The Protein Flip™ Method and Cookbook, Deluxe Edition" (always "The", always "and", never "&").
- Page titles use the template "%s | Chef Healthy Henry" (set short titles like "About", not "About Chef Henry").

## Recipe data model
- All recipes live in `src/data/recipes.json` (single source of truth). Types in `src/lib/recipes.ts`.
- `directions` is a list of `{title, text}` steps (cooking steps ONLY).
- `extras` is a list of `{title, items}` for Chef's Tips, Serving Notes, Why It Works, etc. Never mix tips into numbered steps.
- Recipe images: `public/images/recipes/<slug-truncated-60>.jpg`. Cookbook covers: `public/images/books/`.
- New recipes from Henry's CMS: export CSV from Webflow, then re-run the import/reparse scripts (see git history for `/tmp/import_csv.py` and `/tmp/reparse_directions.py` patterns; quality bar: must have ingredients, directions, and an image).
- Watch for Excel artifacts in CSVs: serving ranges become dates ("3-Feb" means "2-3").

## Workflow
- Never push directly to main. Branch + PR; check the Vercel preview before merging.
- Run `npm run check` (lint + typecheck + build) before every commit.
- Deploys happen automatically via Vercel Git integration on merge to main.

## Publishing a change (follow these steps EVERY time, in order)
1. Start clean: `git checkout main` then `git pull` so you are on the latest `main`. Never reuse or commit onto an old/existing feature branch.
2. Create a NEW branch off main with a short descriptive name (e.g. `recipe-harissa-salmon`, `tweak-home-subtitle`).
3. Make the change, then run `npm run check`.
4. Commit, push the new branch, open a pull request, and merge it.
5. If the merge is blocked because the change touches protected files (Stripe/checkout, delivery, config — see `.github/CODEOWNERS`), stop and tell the user it needs Josh's review. Do not try to bypass it.
6. After merging, the change deploys automatically to chefhealthyhenry.com in about a minute.

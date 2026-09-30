# Recipe Schema: Add url to HowToStep

## Overview

Google Search Console flagged a non-critical structured data issue: missing `url` field in `recipeInstructions`. This is a one-line fix in the recipe page schema.

## ⚠️ Scope boundary

This task touches **one file only**:
- `src/app/recipes/[slug]/page.tsx`

Do NOT touch any data files, other page components, or anything under `src/app/members/`.

## What to change

In `src/app/recipes/[slug]/page.tsx`, find the `recipeInstructions` block:

```ts
recipeInstructions: recipe.directions.map((step, i) => ({
  "@type": "HowToStep",
  position: i + 1,
  ...(step.title && { name: step.title }),
  text: step.text,
})),
```

Add a `url` field pointing to an anchor on the recipe page:

```ts
recipeInstructions: recipe.directions.map((step, i) => ({
  "@type": "HowToStep",
  position: i + 1,
  url: `${SITE_URL}/recipes/${recipe.slug}#step-${i + 1}`,
  ...(step.title && { name: step.title }),
  text: step.text,
})),
```

`SITE_URL` is already imported/defined in this file — do not add a new import.

## Verify

After making the change, run:

```bash
npm run check
```

Then confirm the schema output on any recipe page contains `"url": "https://chefhealthyhenry.com/recipes/..."` inside each step object.

## Branch name

`fix/recipe-schema-step-url`

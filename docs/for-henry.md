# Making changes to the site

This is the short version of how to get a change onto chefhealthyhenry.com
safely. You do not need anyone's approval for content. You do need the
automatic checks to pass, and this explains what they are and what to do when
one of them stops you.

## The one rule

**Never edit `main` directly.** `main` is the live site. Anything that lands
there deploys to the real website about a minute later.

Every change goes onto its own branch first, gets checked automatically, and
then you merge it yourself.

## Making a change

1. Start from the latest `main`.

   ```bash
   git checkout main
   git pull
   ```

2. Make a new branch. Give it a short name that says what it is.

   ```bash
   git checkout -b recipe-harissa-salmon
   ```

3. Make your change: add the recipe, fix the typo, swap the image.

4. Run the checks yourself before pushing. This is the same thing the robot
   runs, so if it passes here it will pass there.

   ```bash
   npm run check
   ```

5. Commit and push.

   ```bash
   git add -A
   git commit -m "Add harissa salmon recipe"
   git push -u origin recipe-harissa-salmon
   ```

6. Open a pull request on GitHub. Two things then happen on their own:
   - **CI** runs the checks. Takes a couple of minutes.
   - **Vercel** builds a preview link so you can click through the change
     before it is live.

7. Look at the preview. When the checks are green and the preview looks right,
   merge it. The live site updates about a minute later.

## What the checks are

Five things run. If any one fails you get a red X and cannot merge until it is
fixed.

| Check | What it means |
| --- | --- |
| **Lint** | Code formatting and common mistakes. |
| **Typecheck** | The code is internally consistent. |
| **Content integrity** | Your content is complete and links go somewhere real. |
| **Writing style** | The house writing rules, on lines you changed. |
| **Build** | The whole site compiles, all 200+ pages. |

The one worth understanding is **content integrity**, because it is the one
that catches ordinary content mistakes. It fails if:

- **Two things share a slug.** Only one page can live at a given address, so
  the other silently disappears. This includes a draft in `docs/` that has the
  same slug as something already live: that means two versions of the same
  piece exist and nobody can tell which one is real.
- **An image is missing.** A recipe points at a photo that was never added to
  `public/images/`, so the page renders with a hole in it.
- **A link goes nowhere.** A recipe or lesson links to a page that does not
  exist, usually because the slug was typed slightly differently.
- **A recipe is incomplete.** Every recipe needs ingredients, directions, and
  an image. All three.
- **A setting is undocumented.** The code reads a configuration value that is
  not written down in `.env.example`. These fail on the live site rather than
  during the build, so this check is the only thing that catches them.

## When something goes red

Read the message. They are written to tell you the file, the slug, and what to
do. For example:

```
[image] src/data/recipes.json: "harissa-salmon" points image at
        /images/recipes/harissa-salmon.jpg, which is not in public/.
```

That one means the recipe is fine but the photo was never added. Add the photo,
commit, push. The checks re-run on their own.

You can run the same checks locally any time:

```bash
npm run check:content   # just the content checks, fast
npm run check           # everything, including the full build
```

Nothing about a red check is urgent or dangerous. It caught the problem before
the live site did, which is the entire point. Fix it and push again.

## The writing rules it enforces

These are in `CLAUDE.md` in full. The automatic check covers three of them, and
only on lines you actually changed, so older content will not trip you up:

- **No em dashes.** Use a period, a comma, or a colon.
- **The book is "The Protein Flip™ Method and Cookbook, Deluxe Edition".**
  Always "The", always "and", never "&".
- **Page titles are short.** Write "About", not "About Chef Henry". The site
  adds " | Chef Healthy Henry" for you.

The rest of the rules are still real, they are just not machine checkable:
benefit-led and specific copy, one main call to action per page, no exclamation
points, no buzzwords.

## The few files that still need Josh

Almost everything is yours to merge. A short list of files needs Josh's review
first, because a mistake in them breaks checkout or takes the site down rather
than just looking wrong:

- `src/app/api/` and `src/lib/fulfillment.ts`: payments and cookbook delivery
- `src/data/cookbooks.ts`: what is for sale and at what price
- `next.config.ts`, `src/lib/site.ts`, `package.json`: site configuration

Adding recipes, posts, lessons, guides, and images never touches any of these,
so in day to day work you will not run into it. If you do get blocked on one,
that is the system working as intended. Tag Josh and he will take a look.

## If you get stuck

The checks tell you what is wrong but not always why. When a message does not
make sense, leave the pull request open and ask. An open pull request with a red
check changes nothing about the live site, so there is no rush and nothing is
broken while you wait.

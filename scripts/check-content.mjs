#!/usr/bin/env node
/**
 * Content integrity checks.
 *
 * A green `next build` proves the code compiles. It proves nothing about the
 * content: a recipe can ship with no image, a lesson can link to a page that
 * does not exist, and two files can claim the same slug without git ever
 * noticing a conflict. This script covers that gap so content changes can be
 * merged without a human reviewing every one.
 *
 * Run: npm run check:content
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, basename, extname } from "node:path";

const root = process.cwd();
const errors = [];
const notes = [];

const fail = (rule, message) => errors.push({ rule, message });
const note = (message) => notes.push(message);

/** Datasets that are absent until a feature branch lands are skipped, not failed. */
function loadJson(relPath) {
  const full = join(root, relPath);
  if (!existsSync(full)) return null;
  try {
    return JSON.parse(readFileSync(full, "utf8"));
  } catch (err) {
    fail("json", `${relPath} is not valid JSON: ${err.message}`);
    return null;
  }
}

// Every content collection, with the URL namespace it renders into.
const COLLECTIONS = [
  { file: "src/data/recipes.json", label: "recipe", urlPrefix: "/recipes" },
  { file: "src/data/posts.json", label: "post", urlPrefix: "/post" },
  { file: "src/data/explore.json", label: "explore article", urlPrefix: "/explore/article" },
  { file: "src/data/lessons.json", label: "lesson", urlPrefix: "/members/library/lessons" },
  { file: "src/data/guides.json", label: "guide", urlPrefix: "/members/library/guides" },
];

const loaded = COLLECTIONS.map((c) => ({ ...c, entries: loadJson(c.file) })).filter(
  (c) => Array.isArray(c.entries),
);

for (const c of COLLECTIONS) {
  if (!loaded.some((l) => l.file === c.file)) note(`skipped ${c.file} (not present on this branch)`);
}

// ---------------------------------------------------------------------------
// 1. Slugs are unique inside each collection.
// ---------------------------------------------------------------------------
for (const { file, label, entries } of loaded) {
  const seen = new Map();
  for (const entry of entries) {
    const slug = entry?.slug;
    if (!slug) {
      fail("slug", `${file}: an entry titled ${JSON.stringify(entry?.title ?? "(untitled)")} has no slug`);
      continue;
    }
    if (seen.has(slug)) {
      fail(
        "slug",
        `${file}: two ${label} entries share the slug "${slug}" (${seen.get(slug)} and ${JSON.stringify(entry.title)}). ` +
          `Only one can render at ${label === "recipe" ? "/recipes" : ""}/${slug}.`,
      );
    }
    seen.set(slug, JSON.stringify(entry.title));
  }
}

// ---------------------------------------------------------------------------
// 2. A draft in docs/ must not share a slug with live content.
//
// This is the failure that shipped a placeholder over finished copy: the real
// lesson sat in docs/member-lessons/*.md while a scaffold with the same slug
// rendered on the site. Two sources of truth, no merge conflict, green build.
// ---------------------------------------------------------------------------
const DRAFT_DIRS = ["docs/member-lessons"];
const liveSlugs = new Map();
for (const { label, entries } of loaded) {
  for (const entry of entries) if (entry?.slug) liveSlugs.set(entry.slug, label);
}

for (const dir of DRAFT_DIRS) {
  const full = join(root, dir);
  if (!existsSync(full)) continue;
  for (const file of readdirSync(full)) {
    if (extname(file) !== ".md") continue;
    const slug = basename(file, ".md");
    if (liveSlugs.has(slug)) {
      fail(
        "duplicate-source",
        `${dir}/${file} and the live ${liveSlugs.get(slug)} "${slug}" are two versions of the same thing. ` +
          `Whichever is final, only one should exist: move the draft into the data file, or delete it.`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Every referenced image actually exists in public/.
// ---------------------------------------------------------------------------
const IMAGE_FIELDS = ["image", "hero", "articleHero", "cover"];
for (const { file, entries } of loaded) {
  for (const entry of entries) {
    for (const field of IMAGE_FIELDS) {
      const path = entry?.[field];
      if (typeof path !== "string" || !path.startsWith("/")) continue;
      if (!existsSync(join(root, "public", path))) {
        fail("image", `${file}: "${entry.slug}" points ${field} at ${path}, which is not in public/.`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Recipes meet the quality bar from CLAUDE.md: ingredients, directions, image.
// ---------------------------------------------------------------------------
const recipes = loaded.find((c) => c.file === "src/data/recipes.json");
if (recipes) {
  for (const r of recipes.entries) {
    const missing = [];
    if (!Array.isArray(r.ingredients) || r.ingredients.length === 0) missing.push("ingredients");
    if (!Array.isArray(r.directions) || r.directions.length === 0) missing.push("directions");
    if (!r.image) missing.push("an image");
    if (missing.length) {
      fail("recipe-quality", `Recipe "${r.slug}" is missing ${missing.join(", ")}. Every recipe needs all three.`);
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Internal links resolve to a real page.
// ---------------------------------------------------------------------------
const validPaths = new Set();
for (const { urlPrefix, entries } of loaded) {
  for (const entry of entries) if (entry?.slug) validPaths.add(`${urlPrefix}/${entry.slug}`);
}

/** Static routes, read off the App Router tree so this never goes stale. */
function collectRoutes(dir, urlPath = "") {
  const full = join(root, dir);
  if (!existsSync(full)) return;
  for (const item of readdirSync(full, { withFileTypes: true })) {
    if (!item.isDirectory()) {
      if (/^page\.(tsx|ts|jsx|js)$/.test(item.name)) validPaths.add(urlPath || "/");
      continue;
    }
    // Route groups (auth) do not appear in the URL; dynamic segments are covered above.
    if (item.name.startsWith("[")) continue;
    const segment = item.name.startsWith("(") ? "" : `/${item.name}`;
    collectRoutes(join(dir, item.name), urlPath + segment);
  }
}
collectRoutes("src/app");

const linkPattern = /"(\/[a-z0-9\-/[\]]*)"/gi;
for (const { file, entries } of loaded) {
  const raw = JSON.stringify(entries);
  for (const [, href] of raw.matchAll(linkPattern)) {
    // Image and asset paths are checked above; skip anything with a file extension.
    if (extname(href)) continue;
    if (href.startsWith("/images") || href.startsWith("/seo") || href.startsWith("/videos")) continue;
    const clean = href.replace(/\/$/, "") || "/";
    if (!validPaths.has(clean)) {
      fail("link", `${file}: links to ${href}, which is not a page on this site.`);
    }
  }
}

// ---------------------------------------------------------------------------
// 6. Every env var the code reads is documented in .env.example.
//
// These throw at request time, not build time, so a missing one ships green
// and 500s in production.
// ---------------------------------------------------------------------------
const PLATFORM_PROVIDED = new Set(["NODE_ENV", "VERCEL_ENV", "VERCEL_URL", "CI"]);

function walkFiles(dir, out = []) {
  const full = join(root, dir);
  if (!existsSync(full)) return out;
  for (const item of readdirSync(full, { withFileTypes: true })) {
    if (item.isDirectory()) walkFiles(join(dir, item.name), out);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(item.name)) out.push(join(dir, item.name));
  }
  return out;
}

const usedEnv = new Set();
for (const file of walkFiles("src")) {
  const src = readFileSync(join(root, file), "utf8");
  for (const [, name] of src.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
    if (!PLATFORM_PROVIDED.has(name)) usedEnv.add(name);
  }
}

const examplePath = join(root, ".env.example");
if (!existsSync(examplePath)) {
  fail("env", ".env.example is missing. It is the only record of which env vars production needs.");
} else {
  const documented = new Set(
    readFileSync(examplePath, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split("=")[0].trim()),
  );
  for (const name of [...usedEnv].sort()) {
    if (!documented.has(name)) {
      fail("env", `${name} is read by the code but not listed in .env.example. Add it, and set it in Vercel.`);
    }
  }
  for (const name of [...documented].sort()) {
    if (!usedEnv.has(name)) note(`.env.example lists ${name}, which no longer appears in src/.`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
for (const n of notes) console.log(`note: ${n}`);

if (errors.length === 0) {
  console.log(`\nContent checks passed (${loaded.length} collections).`);
  process.exit(0);
}

console.error(`\n${errors.length} content problem${errors.length === 1 ? "" : "s"} found:\n`);
for (const { rule, message } of errors) console.error(`  [${rule}] ${message}`);
console.error("");
process.exit(1);

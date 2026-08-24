#!/usr/bin/env -S npx tsx
/**
 * Auto-tags every recipe in src/data/recipes.json with dietaryTags, derived
 * from a keyword scan of each recipe's ingredients list.
 *
 * This is a blunt instrument: it does a substring scan over the joined,
 * lowercased ingredients array, with a couple of targeted safeguards (see
 * below). It will get some recipes wrong at the margins. Known false-positive
 * risks worth a manual spot-check after running:
 *   - "butter" matches peanut/almond/cashew butter, not just dairy butter,
 *     so a vegan recipe using a nut butter can lose its vegan/dairy-free tag.
 *   - "cream" matches "creamy" as a texture word (e.g. "creamy tahini"),
 *     which can falsely disqualify vegan/dairy-free.
 *   - "oat" matches inside "goat" (e.g. "goat cheese"), which can falsely
 *     add high-fiber.
 * "egg" is explicitly guarded against matching "eggplant" (see EGG_RE)
 * since that false positive is common and affects two tags (vegan,
 * high-protein). No other keyword gets that treatment; the above three
 * are left as-is per the literal spec and flagged here instead.
 *
 * Run: npx tsx scripts/tag-recipes.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RECIPES_PATH = join(process.cwd(), "src/data/recipes.json");

interface Recipe {
  slug: string;
  ingredients: string[];
  dietaryTags?: string[];
  [key: string]: unknown;
}

// "egg" as a plain substring also matches "eggplant". Match "egg" only when
// it is not immediately followed by "plant" (covers egg, eggs, egg white,
// egg yolk, egg substitute, etc., while sparing eggplant).
const EGG_RE = /egg(?!plant)/;

function includesWord(haystack: string, word: string): boolean {
  if (word === "egg") return EGG_RE.test(haystack);
  return haystack.includes(word);
}

function anyMatch(haystack: string, words: string[]): boolean {
  return words.some((w) => includesWord(haystack, w));
}

/** Removes every occurrence of each phrase from the string, so a keyword
 * scan run afterward can't be triggered by text that's inside an allowed
 * exception phrase (e.g. "almond flour" shouldn't trigger on "flour"). */
function maskExceptions(haystack: string, exceptions: string[]): string {
  let masked = haystack;
  for (const phrase of exceptions) {
    masked = masked.split(phrase).join(" ");
  }
  return masked;
}

// ---------------------------------------------------------------------------
// Keyword lists (from the tagging brief)
// ---------------------------------------------------------------------------

const MEAT_SEAFOOD = [
  "chicken", "beef", "pork", "turkey", "lamb", "veal", "duck", "bison",
  "venison", "bacon", "ham", "sausage", "chorizo", "pepperoni", "anchovies",
  "fish", "salmon", "tuna", "shrimp", "crab", "lobster", "scallop", "clam",
  "oyster", "tilapia", "cod", "halibut", "mahi", "canned tuna", "ground meat",
];

const NON_VEGAN_ANIMAL_PRODUCTS = [
  "milk", "cream", "butter", "cheese", "yogurt", "egg", "honey", "ghee",
  "whey", "casein", "parmesan", "mozzarella", "cheddar", "cotija", "queso",
  "feta", "ricotta", "brie",
];

const GLUTEN_KEYWORDS = [
  "wheat", "flour", "whole wheat", "bread crumb", "panko", "pasta",
  "soy sauce", "barley", "rye", "bulgur", "farro", "semolina", "couscous",
  "spelt", "pita", "naan",
];
// "tortilla (flour)" in the brief refers to flour tortillas specifically;
// the standalone "flour" keyword already catches "flour tortilla" text, so
// bare "tortilla" is intentionally not in GLUTEN_KEYWORDS (that would also
// disqualify corn tortillas, which are gluten-free).
const GLUTEN_FLOUR_EXCEPTIONS = [
  "chickpea flour", "almond flour", "oat flour", "rice flour",
  "coconut flour", "tapioca flour",
];

const DAIRY_KEYWORDS = [
  "milk", "cream", "butter", "cheese", "yogurt", "ghee", "parmesan",
  "mozzarella", "cheddar", "cotija", "queso", "feta", "ricotta", "brie",
  "half-and-half", "sour cream", "crema",
];
const DAIRY_EXCEPTIONS = [
  "coconut milk", "oat milk", "almond milk", "cashew cream", "dairy-free",
];

const HIGH_PROTEIN_KEYWORDS = [
  "chicken", "beef", "pork", "turkey", "lamb", "fish", "salmon", "tuna",
  "shrimp", "egg", "lentil", "chickpea", "black bean", "white bean",
  "kidney bean", "edamame", "tofu", "tempeh", "greek yogurt",
  "cottage cheese", "quinoa", "hemp seed",
];

const HIGH_FIBER_KEYWORDS = [
  "lentil", "chickpea", "black bean", "white bean", "kidney bean",
  "split pea", "edamame", "quinoa", "oat", "flax", "chia", "hemp seed",
  "beet", "broccoli", "cauliflower", "spinach", "kale", "whole wheat",
  "brown rice", "barley", "farro", "avocado", "artichoke",
];

function tagRecipe(ingredientsText: string): string[] {
  const tags: string[] = [];

  const isVegetarian = !anyMatch(ingredientsText, MEAT_SEAFOOD);
  if (isVegetarian) tags.push("vegetarian");

  if (isVegetarian && !anyMatch(ingredientsText, NON_VEGAN_ANIMAL_PRODUCTS)) {
    tags.push("vegan");
  }

  const glutenScanText = maskExceptions(ingredientsText, GLUTEN_FLOUR_EXCEPTIONS);
  if (!anyMatch(glutenScanText, GLUTEN_KEYWORDS)) {
    tags.push("gluten-free");
  }

  const dairyScanText = maskExceptions(ingredientsText, DAIRY_EXCEPTIONS);
  if (!anyMatch(dairyScanText, DAIRY_KEYWORDS)) {
    tags.push("dairy-free");
  }

  if (anyMatch(ingredientsText, HIGH_PROTEIN_KEYWORDS)) {
    tags.push("high-protein");
  }

  if (anyMatch(ingredientsText, HIGH_FIBER_KEYWORDS)) {
    tags.push("high-fiber");
  }

  return tags;
}

function main() {
  const raw = readFileSync(RECIPES_PATH, "utf8");
  const recipes: Recipe[] = JSON.parse(raw);

  const counts: Record<string, number> = {
    vegetarian: 0,
    vegan: 0,
    "gluten-free": 0,
    "dairy-free": 0,
    "high-protein": 0,
    "high-fiber": 0,
  };
  let noneCount = 0;

  for (const recipe of recipes) {
    const ingredientsText = (recipe.ingredients ?? []).join(" ").toLowerCase();
    const tags = tagRecipe(ingredientsText);
    recipe.dietaryTags = tags;

    if (tags.length === 0) noneCount++;
    for (const tag of tags) counts[tag] = (counts[tag] ?? 0) + 1;
  }

  writeFileSync(RECIPES_PATH, JSON.stringify(recipes, null, 1) + "\n");

  console.log(`Tagged ${recipes.length} recipes.\n`);
  console.log("Tag counts:");
  for (const [tag, count] of Object.entries(counts)) {
    console.log(`  ${tag.padEnd(14)} ${count}`);
  }
  console.log(`  ${"(no tags)".padEnd(14)} ${noneCount}`);
}

main();

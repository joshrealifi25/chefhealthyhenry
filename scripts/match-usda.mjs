/**
 * Proposes a USDA FoodData Central match for every canonical ingredient.
 *
 * Search relevance alone is poor for cooking terms: "chicken breast" returns
 * lunchmeat and breaded tenders before plain chicken. So candidates are
 * rescored here, preferring whole raw ingredients over prepared products, and
 * every match is written out for human review rather than trusted outright.
 *
 * Usage: USDA_API_KEY=... node scripts/match-usda.mjs [--limit N]
 * Writes scripts/data/usda-matches.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const KEY = process.env.USDA_API_KEY;
if (!KEY) {
  console.error("USDA_API_KEY is not set");
  process.exit(1);
}

const API = "https://api.nal.usda.gov/fdc/v1/foods/search";
// Foundation and SR Legacy are the curated reference datasets. Branded is
// tens of thousands of supermarket products and swamps the results.
const DATA_TYPES = "Foundation,SR Legacy";

/** Terms that signal a processed product where a whole ingredient was meant. */
const PENALTY = [
  "lunchmeat", "luncheon", "breaded", "battered", "canned in oil", "fried",
  "baby food", "infant", "formula", "sauce with", "soup", "frozen entree",
  "restaurant", "fast food", "school", "dish", "casserole", "salad with",
  "prepared", "reduced sodium", "low sodium", "unprepared", "dehydrated",
  "freeze-dried", "juice drink", "beverage", "candy", "snack",
];
/** Terms that signal the plain ingredient a recipe means. */
const BONUS = ["raw", "all classes", "whole", "fresh", "plain", "unsalted"];

/**
 * Words that narrow a food to a specific variety. Harmless when the recipe
 * asked for them, misleading when it did not: a recipe calling for "carrots"
 * does not mean baby carrots, and "onion" does not mean red onion.
 */
const NARROWING = [
  "baby", "red", "grape", "roma", "cherry", "green", "yellow", "white",
  "purple", "wild", "dried", "frozen", "canned", "cooked", "boiled",
  "roasted", "grilled", "smoked", "sweet", "italian", "spanish", "japanese",
  "chinese", "mexican", "greek", "whole milk", "nonfat", "low fat",
];

function score(term, food) {
  const d = food.description.toLowerCase();
  const t = deaccent(term.toLowerCase());
  let s = 0;

  // Exact description match, or the term as the leading noun phrase.
  if (d === t) s += 100;
  const head = d.split(",")[0].trim();
  if (head === t) s += 60;
  if (head.includes(t)) s += 25;
  if (d.includes(t)) s += 10;

  // Every word of the term present at all.
  const words = t.split(/\s+/).filter((w) => w.length > 2);
  if (words.length && words.every((w) => d.includes(w))) s += 15;

  for (const p of PENALTY) if (d.includes(p)) s -= 30;
  for (const b of BONUS) if (d.includes(b)) s += 8;

  // A variety the recipe never asked for is the wrong food, even when the
  // words otherwise line up.
  for (const w of NARROWING) {
    if (d.includes(w) && !t.includes(w)) s -= 20;
  }

  // Shorter descriptions are usually the base ingredient.
  s -= Math.floor(d.length / 25);
  if (food.dataType === "Foundation") s += 5;

  // Guard against confident nonsense: "kalamata olives" matching "Olive loaf,
  // pork" only because both contain "olive". Require the term's main noun to
  // appear as a whole word somewhere in the description.
  const main = words.at(-1) ?? t;
  if (main.length > 3 && !new RegExp(`\\b${main}`).test(d)) s -= 45;
  return s;
}

/** Per-100g nutrients, taking kcal rather than the kJ Energy row. */
/**
 * Atwater factors, used only when a curated entry omits Energy in kcal.
 * Flagged on the row so the estimate is never mistaken for a measurement.
 */
function derivedCalories(n) {
  if (n.proteinGrams == null || n.carbGrams == null || n.fatGrams == null) {
    return undefined;
  }
  return Math.round(4 * n.proteinGrams + 4 * n.carbGrams + 9 * n.fatGrams);
}

function nutrients(food) {
  const out = {};
  for (const n of food.foodNutrients ?? []) {
    const name = n.nutrientName;
    const unit = (n.unitName ?? "").toUpperCase();
    const v = n.value;
    if (v == null) continue;
    if (name === "Energy" && unit === "KCAL") out.calories = v;
    else if (name === "Protein") out.proteinGrams = v;
    else if (name === "Fiber, total dietary") out.fiberGrams = v;
    else if (name === "Carbohydrate, by difference") out.carbGrams = v;
    else if (name === "Total lipid (fat)") out.fatGrams = v;
    else if (name.startsWith("Fatty acids, total saturated")) out.saturatedFatGrams = v;
    else if (name.startsWith("Sugars, total")) out.sugarGrams = v;
    else if (name === "Sodium, Na") out.sodiumMilligrams = v;
  }
  return out;
}

/** USDA descriptions are plain ASCII, so "jalapeño" finds nothing. */
function deaccent(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function searchOnce(term) {
  const url = `${API}?api_key=${KEY}&query=${encodeURIComponent(term)}&dataType=${encodeURIComponent(DATA_TYPES)}&pageSize=25`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for "${term}"`);
  const data = await res.json();
  return data.foods ?? [];
}

/**
 * Tries the term, then progressively looser forms. USDA indexes the botanical
 * or singular name ("Beans, cannellini") more often than the way a recipe
 * writes it, so a plain search misses foods that are plainly there.
 */
async function search(term) {
  const seen = new Map();
  const variants = [term];
  const plain = deaccent(term);
  if (plain !== term) variants.push(plain);
  // "cannellini beans" also as "beans, cannellini" and "cannellini".
  const words = plain.split(/\s+/);
  if (words.length > 1) {
    variants.push([words.at(-1), ...words.slice(0, -1)].join(" "));
    variants.push(words.slice(0, -1).join(" "));
  }
  if (plain.endsWith("es")) variants.push(plain.slice(0, -2));
  else if (plain.endsWith("s")) variants.push(plain.slice(0, -1));

  for (const v of variants) {
    if (!v.trim()) continue;
    for (const f of await searchOnce(v)) {
      if (!seen.has(f.fdcId)) seen.set(f.fdcId, f);
    }
    // Stop early once there is plenty to rank.
    if (seen.size >= 25) break;
    await new Promise((r) => setTimeout(r, 80));
  }
  return [...seen.values()];
}

/** Fills in calories from macros when the entry omits them. */
function withCalories(n) {
  if (n.calories != null) return n;
  const c = derivedCalories(n);
  return c == null ? n : { ...n, calories: c };
}

const file = JSON.parse(readFileSync("src/data/ingredients.json", "utf8"));
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;
const ingredients = file.ingredients
  .filter((i) => i.recipeCount >= 1)
  .slice(0, limit);

const results = [];
for (const [i, ing] of ingredients.entries()) {
  try {
    const foods = await search(ing.name);
    const ranked = foods
      .map((f) => ({ food: f, s: score(ing.name, f), n: nutrients(f) }))
      .sort((a, b) => b.s - a.s);
    // An entry with no protein figure is unusable, and one with real
    // calories beats a close-scoring neighbour that lacks them.
    const usable = ranked.filter((r) => r.n.proteinGrams != null);
    const withCals = usable.filter((r) => r.n.calories != null);
    const best =
      withCals.find((r) => r.s >= (usable[0]?.s ?? 0) - 15) ??
      usable[0] ??
      ranked[0];
    results.push({
      name: ing.name,
      recipeCount: ing.recipeCount,
      fdcId: best?.food.fdcId ?? null,
      description: best?.food.description ?? null,
      dataType: best?.food.dataType ?? null,
      score: best?.s ?? null,
      per100g: best ? withCalories(best.n ?? nutrients(best.food)) : {},
      caloriesDerived: best
        ? (best.n ?? nutrients(best.food)).calories == null
        : false,
      alternatives: ranked.slice(1, 4).map((r) => ({
        fdcId: r.food.fdcId,
        description: r.food.description,
        score: r.s,
      })),
    });
  } catch (err) {
    results.push({ name: ing.name, recipeCount: ing.recipeCount, error: String(err) });
  }
  if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/${ingredients.length}`);
  // Stay well inside the hourly quota.
  await new Promise((r) => setTimeout(r, 120));
}

mkdirSync("scripts/data", { recursive: true });
writeFileSync("scripts/data/usda-matches.json", JSON.stringify(results, null, 1));
const good = results.filter((r) => (r.score ?? -1) >= 60).length;
const weak = results.filter((r) => r.score != null && r.score < 60).length;
console.log(`\nmatched ${results.length}: ${good} confident, ${weak} need review`);

/**
 * Fetches per-serving nutrition for every recipe from Edamam's Nutrition
 * Analysis API and writes proposals for review.
 *
 * Recipe ingredient lists carry section headers, "to taste" seasonings and
 * "A or B" choices that Edamam rejects, taking the whole recipe down with
 * them, so lines are sanitised first. Nothing here is written to the site:
 * the output is a proposal for Chef Henry to confirm, since these numbers
 * are published as factual claims under his name.
 *
 * Usage: EDAMAM_APP_ID=... EDAMAM_APP_KEY=... node scripts/fetch-nutrition.mjs [--limit N]
 * Writes scripts/data/nutrition-proposals.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const ID = process.env.EDAMAM_APP_ID;
const KEY = process.env.EDAMAM_APP_KEY;
if (!ID || !KEY) {
  console.error("EDAMAM_APP_ID and EDAMAM_APP_KEY must be set");
  process.exit(1);
}

const UNITS =
  "cups?|tablespoons?|tbsp|teaspoons?|tsp|ounces?|oz|pounds?|lbs?|lb|grams?|kg|ml|cloves?|cans?|jars?|packages?|bunch(?:es)?|heads?|stalks?|sprigs?|slices?|pieces?|pinch(?:es)?|handfuls?|quarts?|pints?|sticks?|fillets?|filets?|ears?|leaves|containers?|bags?|bottles?|sheets?|strips?|wedges?|inch(?:es)?";

/** A bare title like "Avocado Crema" that groups the lines beneath it. */
function isHeader(line) {
  return (
    !/\d|½|⅓|⅔|¼|¾|⅛/.test(line) &&
    line.split(/\s+/).length <= 6 &&
    !new RegExp(`\\b(?:${UNITS})\\b`, "i").test(line)
  );
}

/**
 * Rewrites a line into something the parser accepts, or drops it.
 * Seasonings "to taste" carry no measurable quantity and contribute nothing
 * to the totals, so losing them costs nothing.
 */
function sanitise(line) {
  let s = line.replace(/™|®/g, "").trim();

  // Some recipes carry a step in the ingredients array. A cooking verb plus
  // real length is the giveaway.
  if (
    s.length > 90 &&
    /\b(preheat|roast|stir|whisk|combine|bake|blend|transfer|spread|pour|simmer|heat the)\b/i.test(s)
  ) {
    return null;
  }
  // "For the Matcha Pesto: 1 cup fresh basil" -> "1 cup fresh basil"
  s = s.replace(/^(?:for\s+)?the?\s+[^:]{0,40}:\s*/i, "");
  s = s.replace(/^[A-Z][^:]{0,40}:\s*/, "");
  // Parentheses hold notes and alternates, never the quantity that counts.
  s = s.replace(/\([^)]*\)/g, " ");

  if (/to taste|^a pinch|^pinch of|as needed|for (serving|garnish)/i.test(s)) {
    return null;
  }
  // "2 tablespoons water or reserved bean liquid" -> keep the first option,
  // which is what the recipe leads with.
  s = s.replace(/\s+\bor\b\s+.*$/i, "");
  // Trailing preparation notes confuse quantities more than they help.
  s = s.replace(/,\s*(?:plus more.*|divided|optional)$/i, "");
  return s.trim() || null;
}

/** "6 (2 tostadas per serving)" -> 6 */
function servings(serves) {
  const m = String(serves ?? "").match(/\d+/);
  return m ? Number(m[0]) : null;
}

const NUTRIENTS = {
  calories: null,
  proteinGrams: "PROCNT",
  fiberGrams: "FIBTG",
  carbGrams: "CHOCDF",
  fatGrams: "FAT",
  saturatedFatGrams: "FASAT",
  sugarGrams: "SUGAR",
  sodiumMilligrams: "NA",
};

async function analyse(title, ingr) {
  const url = `https://api.edamam.com/api/nutrition-details?app_id=${ID}&app_key=${KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, ingr }),
  });
  if (res.status === 555) return { lowQuality: true };
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const recipes = JSON.parse(readFileSync("src/data/recipes.json", "utf8"));
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;
const targets = recipes.slice(0, limit);

const out = [];
for (const [i, r] of targets.entries()) {
  const ingr = r.ingredients
    .filter((l) => !isHeader(l))
    .map(sanitise)
    .filter(Boolean);
  const n = servings(r.serves);

  const row = {
    slug: r.slug,
    title: r.title,
    serves: r.serves,
    servings: n,
    linesSent: ingr.length,
    linesDropped: r.ingredients.length - ingr.length,
  };

  if (ingr.length === 0) {
    row.error = "no parseable ingredient lines";
  } else {
    try {
      const data = await analyse(r.title, ingr);
      if (data.lowQuality) {
        row.error = "edamam: low_quality";
      } else {
        const total = data.totalNutrients ?? {};
        const per = {};
        const divisor = n && n > 0 ? n : 1;
        per.calories = Math.round((data.calories ?? 0) / divisor);
        for (const [field, code] of Object.entries(NUTRIENTS)) {
          if (!code) continue;
          const v = total[code]?.quantity;
          if (v != null) per[field] = Math.round((v / divisor) * 10) / 10;
        }
        row.perServing = per;
        // Edamam's own diet/health read, useful as a cross-check on the
        // dietary tags the site already assigns.
        row.edamamHealthLabels = (data.healthLabels ?? []).slice(0, 12);
        if (!n) row.warning = "servings not parsed; totals are for whole recipe";
      }
    } catch (err) {
      row.error = String(err);
    }
  }
  out.push(row);
  if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${targets.length}`);
  await new Promise((r) => setTimeout(r, 400));
}

mkdirSync("scripts/data", { recursive: true });
writeFileSync("scripts/data/nutrition-proposals.json", JSON.stringify(out, null, 1));
const ok = out.filter((r) => r.perServing).length;
console.log(`\n${ok}/${out.length} analysed, ${out.length - ok} need attention`);

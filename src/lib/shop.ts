/**
 * Shop links for specialty pantry items. Everyday produce and proteins stay
 * unlinked. Most items open an Amazon search with one Associates tag. Just
 * Better Fiber, fiber, and allulose open Henry's Just Better discount page.
 */
export const AMAZON_ASSOCIATE_TAG = "henrybaker-20";

export const JUST_BETTER_URL =
  "https://getjustbetter.com/discount/CHEFHEALTHYHENRY";

/**
 * Grocery-tag names that open a specific product page instead of Amazon.
 */
const DIRECT_URLS: Record<string, string> = {
  allulose: JUST_BETTER_URL,
  alulose: JUST_BETTER_URL,
  fiber: JUST_BETTER_URL,
  "just better": JUST_BETTER_URL,
  "just better fiber": JUST_BETTER_URL,
};

/**
 * Canonical grocery-tag name to the Amazon search that should open.
 * Missing names are not shoppable unless they appear in DIRECT_URLS.
 */
const SHOP_QUERIES: Record<string, string> = {
  "protein powder": "Unjury unflavored protein powder",
  "scoop unjury flavorless protein powder": "Unjury unflavored protein powder",
  gochujang: "gochujang",
  gochugaru: "gochugaru",
  mirin: "mirin",
  miso: "white miso paste",
  dashi: "dashi",
  nori: "nori sheets",
  doubanjiang: "doubanjiang",
  donjong: "doenjang",
  "samjang sauce": "ssamjang",
  "shichimi togarashi": "shichimi togarashi",
  "shaoxing wine": "shaoxing wine",
  "oyster sauce": "oyster sauce",
  "chili garlic sauce": "chili garlic sauce",
  "garlic chili sauce": "chili garlic sauce",
  "sesame garlic sauce": "sesame garlic sauce",
  "bean sauce": "black bean sauce",
  "fish sauce": "fish sauce",
  "rice wine": "Shaoxing rice wine",
  "plum vinegar": "ume plum vinegar",
  harissa: "harissa paste",
  sumac: "sumac spice",
  tahini: "tahini",
  tajín: "Tajin seasoning",
  saffron: "saffron threads",
  "ladolemono": "ladolemono",
  "nutritional yeast": "nutritional yeast",
  "lupini beans": "lupini beans",
  "aleppo pepper": "Aleppo pepper",
  "mexican oregano": "Mexican oregano",
  epazote: "epazote",
  "masa harina": "masa harina",
  hominy: "white hominy",
  "almond flour": "blanched almond flour",
  "blanched almond flour": "blanched almond flour",
  "chickpea flour": "chickpea flour",
  "coconut flour": "coconut flour",
  "arrowroot powder": "arrowroot powder",
  "matcha powder": "culinary matcha",
  "moringa powder": "moringa powder",
  "chia seeds": "chia seeds",
  hemp: "hemp hearts",
  "almond butter": "almond butter",
  "cashew butter": "cashew butter",
  pepitas: "pepitas",
  "pine nuts": "pine nuts",
  "black rice": "black rice",
  quinoa: "quinoa",
  "panko": "panko breadcrumbs",
  "gluten free flour": "gluten free flour",
  "coconut milk": "unsweetened coconut milk",
  "coconut oil": "coconut oil",
  "almond milk": "unsweetened almond milk",
  "unsweetened almond milk": "unsweetened almond milk",
  "sun-dried tomatoes": "sun dried tomatoes",
  "castelvetrano olives": "Castelvetrano olives",
  "kalamata olives": "Kalamata olives",
  kalamata: "Kalamata olives",
  "artichoke hearts": "artichoke hearts",
  tempeh: "tempeh",
  "silken tofu": "silken tofu",
  tofu: "extra firm tofu",
  "garam masala": "garam masala",
  "yellow curry powder": "yellow curry powder",
  "curry powder": "curry powder",
  "fenugreek leaves": "kasuri methi",
  "porcini powder": "porcini powder",
  "chipotle chile": "chipotle in adobo",
  "chipotle peppers": "chipotle in adobo",
  "ancho chile powder": "ancho chile powder",
  "guajillo chiles": "guajillo chiles",
  "guajillo chilies": "guajillo chiles",
  "chile de arbol": "chile de arbol",
  kashmiri: "Kashmiri chili powder",
  "hungarian paprika": "Hungarian paprika",
};

/** Phrases that appear in recipe lines but are not the grocery-tag name. */
const LINE_ALIASES: { needle: string; query?: string; url?: string }[] = [
  { needle: "just better", url: JUST_BETTER_URL },
  { needle: "allulose", url: JUST_BETTER_URL },
  { needle: "alulose", url: JUST_BETTER_URL },
  { needle: "unjury", query: "Unjury unflavored protein powder" },
  { needle: "black garlic", query: "black garlic" },
];

function mentions(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, "i").test(
    haystack
  );
}

export function amazonSearchUrl(query: string): string {
  const params = new URLSearchParams({
    k: query,
    tag: AMAZON_ASSOCIATE_TAG,
  });
  return `https://www.amazon.com/s?${params.toString()}`;
}

export function shopUrlForIngredient(name: string): string | null {
  const key = name.toLowerCase();
  if (DIRECT_URLS[key]) return DIRECT_URLS[key];
  const query = SHOP_QUERIES[key] ?? SHOP_QUERIES[name];
  return query ? amazonSearchUrl(query) : null;
}

const QUERY_NEEDLES = [...Object.keys(DIRECT_URLS), ...Object.keys(SHOP_QUERIES)]
  .filter((name, i, all) => all.indexOf(name) === i)
  .sort((a, b) => b.length - a.length);
const ALIAS_NEEDLES = [...LINE_ALIASES].sort(
  (a, b) => b.needle.length - a.needle.length
);

/** True when a recipe line should show a Shop link. */
export function shopUrlForLine(line: string): string | null {
  for (const alias of ALIAS_NEEDLES) {
    if (!mentions(line, alias.needle)) continue;
    if (alias.url) return alias.url;
    if (alias.query) return amazonSearchUrl(alias.query);
  }
  for (const name of QUERY_NEEDLES) {
    if (mentions(line, name)) {
      const url = shopUrlForIngredient(name);
      if (url) return url;
    }
  }
  return null;
}

export const AFFILIATE_DISCLOSURE =
  "As an Amazon Associate, Chef Healthy Henry earns from qualifying purchases.";

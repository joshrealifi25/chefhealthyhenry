import presetsData from "@/data/combo-presets.json";

export interface ComboPreset {
  id: string;
  name: string;
  ingredients: string[];
  recipeSlugs: string[];
}

interface PresetsFile {
  presets: ComboPreset[];
}

const file = presetsData as PresetsFile;

/** Curated combinations that are ready to open. Empty ingredients are skipped. */
export const comboPresets: ComboPreset[] = (file.presets ?? []).filter(
  (p) =>
    typeof p.id === "string" &&
    p.id.length > 0 &&
    typeof p.name === "string" &&
    p.name.length > 0 &&
    Array.isArray(p.ingredients) &&
    p.ingredients.length > 0 &&
    Array.isArray(p.recipeSlugs)
);

function sorted(values: string[]): string {
  return [...values].map((v) => v.toLowerCase()).sort().join("\0");
}

/** True when the current selection is exactly this preset. */
export function matchesPreset(
  preset: ComboPreset,
  ingredients: string[],
  recipeSlugs: string[]
): boolean {
  return (
    sorted(preset.ingredients) === sorted(ingredients) &&
    sorted(preset.recipeSlugs) === sorted(recipeSlugs)
  );
}

export function matchingPreset(
  ingredients: string[],
  recipeSlugs: string[]
): ComboPreset | undefined {
  return comboPresets.find((p) => matchesPreset(p, ingredients, recipeSlugs));
}

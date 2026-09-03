import type { Nutrition } from "@/lib/recipes";

/** One nutrient row, rendered only when the recipe records that value. */
function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string | undefined;
  emphasis?: boolean;
}) {
  if (!value) return null;
  return (
    <div
      className={`flex items-baseline justify-between border-b border-border py-2 last:border-0 ${
        emphasis ? "font-medium" : ""
      }`}
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

/**
 * Per-serving nutrition. Protein and fiber lead, because those are the two
 * numbers the Protein Flip™ Method is actually about.
 */
export function NutritionPanel({
  nutrition,
  serves,
}: {
  nutrition: Nutrition;
  serves?: string | null;
}) {
  const n = nutrition;
  const per = n.servingSize ?? (serves ? "1 serving" : undefined);

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        Nutrition
      </h2>
      {per && (
        <p className="mt-1 text-sm text-muted-foreground">Per {per}</p>
      )}
      <div className="mt-4 text-sm">
        <Row
          label="Protein"
          value={n.proteinGrams != null ? `${n.proteinGrams} g` : undefined}
          emphasis
        />
        <Row
          label="Fiber"
          value={n.fiberGrams != null ? `${n.fiberGrams} g` : undefined}
          emphasis
        />
        <Row
          label="Calories"
          value={n.calories != null ? `${n.calories}` : undefined}
        />
        <Row
          label="Carbohydrates"
          value={n.carbGrams != null ? `${n.carbGrams} g` : undefined}
        />
        <Row
          label="Fat"
          value={n.fatGrams != null ? `${n.fatGrams} g` : undefined}
        />
        <Row
          label="Saturated fat"
          value={
            n.saturatedFatGrams != null ? `${n.saturatedFatGrams} g` : undefined
          }
        />
        <Row
          label="Sugar"
          value={n.sugarGrams != null ? `${n.sugarGrams} g` : undefined}
        />
        <Row
          label="Sodium"
          value={
            n.sodiumMilligrams != null ? `${n.sodiumMilligrams} mg` : undefined
          }
        />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Estimated per serving. Actual values vary with brands, substitutions,
        and portion size. This is general information, not medical or
        nutrition advice.
      </p>
    </section>
  );
}

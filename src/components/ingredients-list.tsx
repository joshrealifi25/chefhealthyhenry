"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const UNICODE_FRACTIONS: Record<string, number> = {
  "½": 0.5, "⅓": 1 / 3, "⅔": 2 / 3, "¼": 0.25, "¾": 0.75,
  "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8, "⅙": 1 / 6, "⅚": 5 / 6,
  "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
};

const FRACTION_STEPS: [number, string][] = [
  [0, ""], [0.125, "⅛"], [0.25, "¼"], [1 / 3, "⅓"], [0.375, "⅜"],
  [0.5, "½"], [0.625, "⅝"], [2 / 3, "⅔"], [0.75, "¾"], [0.875, "⅞"], [1, ""],
];

function formatQty(n: number): string {
  const whole = Math.floor(n + 1e-9);
  const frac = n - whole;
  let best = FRACTION_STEPS[0];
  for (const step of FRACTION_STEPS) {
    if (Math.abs(step[0] - frac) < Math.abs(best[0] - frac)) best = step;
  }
  if (best[0] === 1) return String(whole + 1);
  if (best[1] === "") return whole === 0 ? n.toFixed(2).replace(/\.?0+$/, "") : String(whole);
  return whole === 0 ? best[1] : `${whole} ${best[1]}`;
}

// Matches a leading quantity: "2", "1/2", "1 1/2", "2.5", "½", "1½", "2-3", "2–3"
const QTY = String.raw`(?:\d+\s+\d+/\d+|\d+/\d+|\d*\.?\d+|[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]|\d+\s*[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])`;
const LEADING = new RegExp(String.raw`^(${QTY})(\s*[-–—]\s*(${QTY}))?(?=[\s a-zA-Z(])`);

function parseQty(s: string): number {
  s = s.trim();
  const mixed = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = s.match(/^(\d+)\/(\d+)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const uni = s.match(/^(\d*)\s*([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])$/);
  if (uni) return Number(uni[1] || 0) + UNICODE_FRACTIONS[uni[2]];
  return Number(s);
}

export function scaleIngredient(line: string, factor: number): string {
  if (factor === 1) return line;
  return line.replace(LEADING, (match, q1, _range, q2) => {
    const a = formatQty(parseQty(q1) * factor);
    if (q2) return `${a}–${formatQty(parseQty(q2) * factor)}`;
    return a;
  });
}

const isHeading = (ing: string) => ing.length < 25 && !/\d/.test(ing);

export function IngredientsList({ ingredients }: { ingredients: string[] }) {
  const [factor, setFactor] = useState(1);

  return (
    <div>
      <div className="mt-4 flex items-center gap-2 print:hidden">
        <span className="text-sm text-muted-foreground">Scale:</span>
        {[0.5, 1, 2, 3].map((f) => (
          <button
            key={f}
            onClick={() => setFactor(f)}
            className={cn(
              "rounded-full border px-3.5 py-1 text-sm transition-colors",
              factor === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            )}
          >
            {f === 0.5 ? "½x" : `${f}x`}
          </button>
        ))}
      </div>
      <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed">
        {ingredients.map((ing, i) =>
          isHeading(ing) ? (
            <li key={i} className="pt-2 font-medium text-primary">
              {ing}
            </li>
          ) : (
            <li key={i} className="flex gap-2.5">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
              {scaleIngredient(ing, factor)}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

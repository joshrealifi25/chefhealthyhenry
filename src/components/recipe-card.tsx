import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { Recipe } from "@/lib/recipes";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {recipe.image && (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {recipe.proteinFlip && (
          <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
            Protein Flip™
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {recipe.category}
        </p>
        <h3 className="mt-1 line-clamp-2 font-heading text-lg font-semibold leading-snug group-hover:text-primary">
          {recipe.title}
        </h3>
        {recipe.totalTime && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" /> {recipe.totalTime}
          </p>
        )}
      </div>
    </Link>
  );
}

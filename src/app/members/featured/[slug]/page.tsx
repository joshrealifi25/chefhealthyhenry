import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getMember, loginPath } from "@/lib/auth";
import {
  canSeeFeatured,
  getFeaturedIngredient,
} from "@/lib/featured-ingredients";
import { getRecipe } from "@/lib/recipes";
import { ContentBlocks } from "@/components/content-blocks";
import { YouTubeEmbed } from "@/components/youtube-embed";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeaturedIngredient(slug);
  return {
    title: feature?.ingredient ?? "Featured Ingredient",
    description: feature?.blurb,
  };
}

export default async function FeaturedIngredientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getMember();
  if (!member) redirect(loginPath(`/members/featured/${slug}`));
  if (!canSeeFeatured(member.tier)) redirect("/membership");

  const feature = getFeaturedIngredient(slug);
  if (!feature) notFound();

  const recipe = feature.recipeSlug
    ? getRecipe(feature.recipeSlug)
    : undefined;

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        This season&apos;s featured ingredient
      </p>
      <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-balance">
        {feature.ingredient}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{feature.blurb}</p>

      {recipe && (
        <Link
          href={`/recipes/${recipe.slug}`}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          See the recipe
          <ArrowUpRight className="size-4" />
        </Link>
      )}

      <div className="mt-8">
        <ContentBlocks blocks={feature.blocks} />
      </div>

      {feature.videoId && (
        <section className="mt-10">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Watch the technique
          </h2>
          <div className="mt-4">
            <YouTubeEmbed
              videoId={feature.videoId}
              title={feature.ingredient}
            />
          </div>
        </section>
      )}

      <p className="mt-14 border-t border-border pt-6">
        <Link
          href="/members/library"
          className="text-sm font-medium text-primary hover:underline"
        >
          All Featured Ingredients
        </Link>
      </p>
    </article>
  );
}

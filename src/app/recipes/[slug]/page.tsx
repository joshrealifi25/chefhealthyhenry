import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { recipes, getRecipe, relatedRecipes } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipe-card";
import { PrintButton } from "@/components/print-button";
import { IngredientsList } from "@/components/ingredients-list";

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return {};
  return {
    title: recipe.title,
    description: recipe.description || recipe.title,
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const related = relatedRecipes(recipe);

  const minutes = (t: string | null) => t?.match(/\d+/)?.[0];
  const prepMin = minutes(recipe.prepTime);
  const totalMin = minutes(recipe.totalTime);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description || recipe.title,
    image: recipe.image
      ? [`https://chef-healthy-henry.vercel.app${recipe.image}`]
      : undefined,
    author: { "@type": "Person", name: "Chef Healthy Henry" },
    recipeCategory: recipe.category,
    recipeYield: recipe.serves ? `${recipe.serves} servings` : undefined,
    prepTime: prepMin ? `PT${prepMin}M` : undefined,
    totalTime: totalMin ? `PT${totalMin}M` : undefined,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.directions.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      ...(step.title && { name: step.title }),
      text: step.text,
    })),
    ...(recipe.youtubeId && {
      video: {
        "@type": "VideoObject",
        name: `Video: ${recipe.title}`,
        description: recipe.description || recipe.title,
        thumbnailUrl: `https://i.ytimg.com/vi/${recipe.youtubeId}/hqdefault.jpg`,
        contentUrl: `https://www.youtube.com/watch?v=${recipe.youtubeId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${recipe.youtubeId}`,
      },
    }),
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> All recipes
        </Link>
        <PrintButton />
      </div>

      <header className="mt-6">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {recipe.category}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {recipe.title}
        </h1>
        {recipe.description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
          {recipe.serves && (
            <span className="flex items-center gap-1.5">
              <Users className="size-4" /> Serves {recipe.serves}
            </span>
          )}
          {recipe.prepTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" /> Prep {recipe.prepTime}
            </span>
          )}
          {recipe.totalTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" /> Total {recipe.totalTime}
            </span>
          )}
        </div>
      </header>

      {recipe.image && (
        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl shadow-md print:mx-auto print:mt-4 print:aspect-[16/7] print:max-w-md print:shadow-none">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.6fr]">
        <section>
          <h2 className="font-heading text-2xl font-semibold">Ingredients</h2>
          <IngredientsList ingredients={recipe.ingredients} />
        </section>

        <section>
          <h2 className="font-heading text-2xl font-semibold">Directions</h2>
          <ol className="mt-5 space-y-6">
            {recipe.directions.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  {step.title && (
                    <p className="font-medium text-primary">{step.title}</p>
                  )}
                  <p className="leading-relaxed text-foreground/90">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {recipe.extras.length > 0 && (
            <div className="mt-10 space-y-6">
              {recipe.extras.map((extra) => (
                <div
                  key={extra.title}
                  className="rounded-2xl bg-secondary/60 p-6"
                >
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    {extra.title.replace(/:$/, "")}
                  </h3>
                  <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-foreground/90">
                    {extra.items.map((item, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {recipe.youtubeId && (
        <section className="mt-16 print:hidden">
          <h2 className="font-heading text-2xl font-semibold">
            Watch Henry make it
          </h2>
          <div className="mt-5 aspect-video overflow-hidden rounded-2xl shadow-md">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${recipe.youtubeId}`}
              title={`Video: ${recipe.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="size-full"
            />
          </div>
        </section>
      )}

      <p className="mt-10 hidden border-t border-border pt-4 text-center text-sm text-muted-foreground print:block">
        Recipe by Chef Healthy Henry · A Healthy &amp; Tasty Life ·
        chef-healthy-henry.vercel.app
      </p>

      {related.length > 0 && (
        <section className="mt-20 border-t border-border pt-12 print:hidden">
          <h2 className="font-heading text-2xl font-semibold">
            More {recipe.category.toLowerCase()}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

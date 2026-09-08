import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getMember, loginPath } from "@/lib/auth";
import { MakeoverForm } from "@/components/makeover-form";

export const metadata: Metadata = {
  title: "Recipe Makeover",
  description:
    "Submit a recipe you love for a possible Protein Flip™ makeover from Chef Henry.",
};

export const dynamic = "force-dynamic";

export default async function MakeoverPage() {
  const member = await getMember();
  if (!member) redirect(loginPath("/members/makeover"));
  if (!member.tier) redirect("/membership");

  const canSubmit =
    member.tier === "community" || member.tier === "chefs_table";

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/members"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Back to your kitchen
      </Link>

      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Protein Flip™ Community
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Submit a Recipe for a Protein Flip™ Makeover
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a recipe you love but wonder how it could work with the Protein
          Flip™ Method?
        </p>
      </header>

      <div className="mt-8 space-y-5 leading-relaxed text-foreground/90">
        <p>
          Protein Flip™ Community members can submit recipes for consideration
          in an upcoming Protein Flip™ Recipe Makeover.
        </p>
        <p>
          Chef Henry will periodically select member submissions and walk
          through how he would rethink the recipe while keeping the flavor,
          character, and reason you enjoy the dish in the first place.
        </p>
        <p>
          The goal is not to turn every recipe into something completely
          different. It is to show how Protein Flip™ thinking can be applied to
          a real dish by looking at the meal as a whole and finding
          opportunities to distribute nutrition more intentionally.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          What can I submit?
        </h2>
        <p className="mt-4 leading-relaxed text-foreground/90">
          Your recipe can be:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-foreground/90">
          <li>A family recipe</li>
          <li>A favorite weeknight meal</li>
          <li>A comfort food</li>
          <li>A recipe you cook often</li>
          <li>A dish you would like to make more nutritionally balanced</li>
          <li>
            A recipe you found in a cookbook, magazine, website, or other
            source
          </li>
          <li>
            A recipe you have already started adapting but are unsure how to
            improve further
          </li>
        </ul>
        <p className="mt-4 leading-relaxed text-foreground/90">
          It does not need to be a Chef Healthy Henry recipe.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          What should I include?
        </h2>
        <p className="mt-4 leading-relaxed text-foreground/90">
          Please provide as much of the following as you can.
        </p>
        <div className="mt-6 space-y-5">
          <div>
            <h3 className="font-heading text-xl font-semibold">Recipe name</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Tell us what the dish is called.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-semibold">The recipe</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Paste the ingredients and directions into the form, or provide a
              link if the recipe is published online.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-semibold">
              Where the recipe came from
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Let us know whether it is your own recipe, a family recipe, or
              from another source. If it came from a website, cookbook,
              magazine, creator, or chef, please identify the source.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-semibold">
              What you love about it
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              What makes you want to keep this recipe? The flavor? Convenience?
              Family connection? A particular ingredient or texture? This helps
              Chef Henry understand what should be protected during the
              makeover.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-semibold">
              What you would like help with
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Tell us what you are wondering about. For example:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                How could I better distribute nutrition throughout this meal?
              </li>
              <li>Is there an opportunity to add or rethink the proteins?</li>
              <li>
                How could I improve the balance without losing the flavor?
              </li>
              <li>Could I use ingredients differently?</li>
              <li>
                Is there a better side, topping, sauce, or accompaniment?
              </li>
              <li>How could I make this work better as an everyday meal?</li>
            </ul>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              You do not need to know exactly what is &ldquo;wrong&rdquo; with
              the recipe. Sometimes the best submission is simply: &ldquo;I
              love this. What would Chef Henry do with it?&rdquo;
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-semibold">
              Optional photo
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              If you have a photo of the dish as you normally prepare it, feel
              free to include it.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          What happens after I submit?
        </h2>
        <div className="mt-4 space-y-5 leading-relaxed text-foreground/90">
          <p>Submitting a recipe does not guarantee that it will be selected.</p>
          <p>
            Chef Henry will periodically choose submissions that create useful
            teaching opportunities for the membership. A selected recipe may be
            used to demonstrate one or more Protein Flip™ principles that other
            members can apply in their own kitchens.
          </p>
          <p>
            If your recipe is selected, the finished makeover will be added to
            the membership website and may also be shared in the private member
            community for discussion.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Submission form
        </h2>
        <div className="mt-6">
          {canSubmit ? (
            <MakeoverForm />
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-8">
              <p className="leading-relaxed text-muted-foreground">
                Recipe submissions are part of Protein Flip™ Community. Upgrade
                and you can send Chef Henry a dish you actually cook.
              </p>
              <a
                href="/api/billing"
                className="mt-5 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Upgrade to Community
              </a>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}

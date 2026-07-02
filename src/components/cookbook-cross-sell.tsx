import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";

export function CookbookCrossSell() {
  return (
    <aside
      aria-label="Cookbook and newsletter"
      className="mt-12 space-y-6 print:hidden"
    >
      <div className="flex items-center gap-5 rounded-2xl bg-secondary/60 p-5 sm:p-6">
        <Link
          href="/cookbook"
          className="relative block h-24 w-20 shrink-0 overflow-hidden rounded-lg shadow-md sm:h-28 sm:w-24"
        >
          <Image
            src="/images/cookbook-cover.jpg"
            alt="The Protein Flip™ Method and Cookbook, Deluxe Edition cover"
            fill
            sizes="96px"
            className="object-cover"
          />
        </Link>
        <div>
          <p className="font-heading text-lg font-semibold leading-snug">
            Want the full method behind this recipe?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            The Protein Flip™ Method and Cookbook, Deluxe Edition: the complete
            framework, from $27.99.
          </p>
          <Link
            href="/cookbook"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            See the cookbook <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60 sm:p-6">
        <p className="font-heading text-lg font-semibold">
          Get a recipe like this every week
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Join the list and we&apos;ll send you the free Protein Flip™ Starter
          Guide today.
        </p>
        <div className="mt-4 max-w-md">
          <NewsletterForm />
        </div>
      </div>
    </aside>
  );
}

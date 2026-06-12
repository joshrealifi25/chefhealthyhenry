import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50 print:hidden">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-semibold">Chef Healthy Henry</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Stay inspired with daily bites of flavor, health, and kitchen
            wisdom. Fresh content served each week.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="mb-3 font-medium">Explore</p>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/recipes" className="hover:text-primary">Recipes</Link></li>
              <li><Link href="/cookbook" className="hover:text-primary">Cookbook</Link></li>
              <li><Link href="/about" className="hover:text-primary">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-medium">Follow</p>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="https://www.facebook.com/Chefhealthyhenry" target="_blank" rel="noreferrer" className="hover:text-primary">Facebook</a></li>
              <li><a href="https://www.facebook.com/groups/proteinflipcommunity" target="_blank" rel="noreferrer" className="hover:text-primary">Protein Flip™ Community</a></li>
              <li><a href="https://chefhealthyhenry.com" target="_blank" rel="noreferrer" className="hover:text-primary">chefhealthyhenry.com</a></li>
            </ul>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium">Get one new recipe every week</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Chef Healthy Henry LLC. All rights reserved.
      </div>
    </footer>
  );
}

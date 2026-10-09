"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const exploreLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/blog", label: "Journal" },
  { href: "/favorites", label: "Favorites" },
];

const membershipLinks = [
  { href: "/membership", label: "Join" },
  { href: "/members/login", label: "Sign In" },
];

const aboutLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const isExploreActive = exploreLinks.some((l) => pathname === l.href);
  const isMembershipActive = membershipLinks.some((l) => pathname === l.href) || pathname.startsWith("/members");
  const isAboutActive = aboutLinks.some((l) => pathname === l.href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md print:hidden">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-center gap-10 px-4 sm:px-6">
        <Link href="/" className="absolute left-4 flex items-center gap-2.5 sm:left-6 lg:static">
          <Image
            src="/images/logo.png"
            alt="Healthy Henry logo"
            width={44}
            height={44}
            className="size-11"
            priority
          />
          <span className="font-heading text-xl font-semibold tracking-tight">
            Chef Healthy Henry
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {/* Recipes */}
          <Link
            href="/recipes"
            aria-current={pathname === "/recipes" ? "page" : undefined}
            className={cn(
              "text-sm transition-colors hover:text-primary",
              pathname === "/recipes" ? "font-medium text-primary" : "text-muted-foreground"
            )}
          >
            Recipes
          </Link>

          {/* Explore dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button
              className={cn(
                "flex items-center gap-1 text-sm transition-colors hover:text-primary",
                isExploreActive ? "font-medium text-primary" : "text-muted-foreground"
              )}
              aria-expanded={exploreOpen}
            >
              Explore
              <ChevronDown className={cn("size-3.5 transition-transform", exploreOpen && "rotate-180")} />
            </button>
            {exploreOpen && (
              <div className="absolute left-0 top-full pt-2">
                <div className="min-w-[160px] rounded-xl border border-border bg-background shadow-md">
                  {exploreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block px-4 py-2.5 text-sm transition-colors hover:bg-secondary first:rounded-t-xl last:rounded-b-xl",
                        pathname === link.href ? "font-medium text-primary" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Membership dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setMembershipOpen(true)}
            onMouseLeave={() => setMembershipOpen(false)}
          >
            <button
              className={cn(
                "flex items-center gap-1 text-sm transition-colors hover:text-primary",
                isMembershipActive ? "font-medium text-primary" : "text-muted-foreground"
              )}
              aria-expanded={membershipOpen}
            >
              Membership
              <ChevronDown className={cn("size-3.5 transition-transform", membershipOpen && "rotate-180")} />
            </button>
            {membershipOpen && (
              <div className="absolute left-0 top-full pt-2">
                <div className="min-w-[140px] rounded-xl border border-border bg-background shadow-md">
                  {membershipLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block px-4 py-2.5 text-sm transition-colors hover:bg-secondary first:rounded-t-xl last:rounded-b-xl",
                        pathname === link.href ? "font-medium text-primary" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* About dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              className={cn(
                "flex items-center gap-1 text-sm transition-colors hover:text-primary",
                isAboutActive ? "font-medium text-primary" : "text-muted-foreground"
              )}
              aria-expanded={aboutOpen}
            >
              About
              <ChevronDown className={cn("size-3.5 transition-transform", aboutOpen && "rotate-180")} />
            </button>
            {aboutOpen && (
              <div className="absolute left-0 top-full pt-2">
                <div className="min-w-[140px] rounded-xl border border-border bg-background shadow-md">
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block px-4 py-2.5 text-sm transition-colors hover:bg-secondary first:rounded-t-xl last:rounded-b-xl",
                        pathname === link.href ? "font-medium text-primary" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Get the Cookbook button */}
          <Link
            href="/cookbook"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get the Cookbook
          </Link>
        </nav>

        <button
          className="absolute right-4 sm:right-6 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-border/60 bg-background px-4 py-4 lg:hidden"
        >
          <Link href="/recipes" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">
            Recipes
          </Link>
          <p className="pb-1 pt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Explore</p>
          {exploreLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block py-2 pl-3 text-sm">
              {link.label}
            </Link>
          ))}
          <p className="pb-1 pt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Membership</p>
          {membershipLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block py-2 pl-3 text-sm">
              {link.label}
            </Link>
          ))}
          <p className="pb-1 pt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">About</p>
          {aboutLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block py-2 pl-3 text-sm">
              {link.label}
            </Link>
          ))}
          <Link
            href="/cookbook"
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-full bg-primary px-5 py-2 text-center text-sm font-medium text-primary-foreground"
          >
            Get the Cookbook
          </Link>
        </nav>
      )}
    </header>
  );
}

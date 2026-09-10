import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/auth";
import { TIER_NAMES } from "@/lib/membership";
import { SOUS_DAILY_CAP } from "@/lib/sous";
import { getComboCredits } from "@/lib/combo-limits";
import {
  customBuildsRemainingNote,
  customBuildsUsedUpNote,
  isAtCustomBuildLimit,
} from "@/lib/combo-build";
import { currentLesson } from "@/lib/lessons";
import {
  canSeeFeatured,
  currentFeaturedIngredient,
} from "@/lib/featured-ingredients";
import { db, savedLists } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { SousChat } from "@/components/sous-chat";
import { isAdminEmail } from "@/lib/admin";

export const metadata: Metadata = {
  title: "My Kitchen",
  description: "Your Chef Healthy Henry membership dashboard.",
};

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const member = await getMember();
  if (!member) redirect("/members/login");

  const firstName = member.name?.split(" ")[0];
  const tier = member.tier;
  const cap = tier ? SOUS_DAILY_CAP[tier] : 0;
  const capNote = Number.isFinite(cap)
    ? `Up to ${cap} questions a day with your membership.`
    : "Unlimited questions with your membership.";
  const lesson = currentLesson();
  const featuredIngredient = currentFeaturedIngredient();
  const [lists, comboCredits] = tier
    ? await Promise.all([
        db()
          .select({ id: savedLists.id, name: savedLists.name })
          .from(savedLists)
          .where(eq(savedLists.userId, member.id))
          .orderBy(desc(savedLists.updatedAt))
          .limit(3),
        getComboCredits(member.id, tier),
      ])
    : [[], null];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here&apos;s what&apos;s new in your kitchen this month.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          {tier ? (
            <span className="rounded-full bg-accent px-4 py-2 text-sm font-medium">
              {TIER_NAMES[tier]} member
            </span>
          ) : (
            <span className="rounded-full bg-secondary px-4 py-2 text-sm font-medium">
              No active membership
            </span>
          )}
          {(tier === "community" || tier === "chefs_table") && (
            <div className="flex flex-col items-start gap-1 text-sm sm:items-end">
              <a
                href="https://www.facebook.com/Chefhealthyhenry"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                Facebook
              </a>
              <a
                href="https://www.facebook.com/groups/proteinflipcommunity"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                Protein Flip™ Community
              </a>
            </div>
          )}
        </div>
      </div>

      {tier ? (
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          {/* Main column */}
          <div className="flex min-w-0 flex-col gap-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Ask anything, anytime
              </p>
              <h2 className="mt-1 font-heading text-2xl font-semibold">Sous</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your Protein Flip™ sous chef, trained on Chef Henry&apos;s
                recipes and method.
              </p>
              <SousChat capNote={capNote} />
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                This month&apos;s application lesson
              </p>
              {lesson ? (
                <>
                  <h2 className="mt-1 font-heading text-xl font-semibold">
                    <Link
                      href={`/members/library/lessons/${lesson.slug}`}
                      className="hover:text-primary"
                    >
                      {lesson.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {lesson.blurb}
                  </p>
                  <Link
                    href={`/members/library/lessons/${lesson.slug}`}
                    className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Read the lesson
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="mt-1 font-heading text-xl font-semibold">
                    Coming with launch
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Chef Henry&apos;s first Member Application Lesson lands
                    here. Each month teaches one transferable cooking decision
                    you can use across your whole kitchen.
                  </p>
                </>
              )}
            </section>

            {canSeeFeatured(tier) && featuredIngredient && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  This season&apos;s featured ingredient
                </p>
                <h2 className="mt-1 font-heading text-xl font-semibold">
                  <Link
                    href={`/members/featured/${featuredIngredient.slug}`}
                    className="hover:text-primary"
                  >
                    {featuredIngredient.ingredient}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {featuredIngredient.blurb}
                </p>
                <Link
                  href={`/members/featured/${featuredIngredient.slug}`}
                  className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  See this month&apos;s feature
                </Link>
              </section>
            )}

            {tier === "kitchen" && (
              <section className="rounded-2xl border border-dashed border-border bg-secondary/50 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Protein Flip™ Community
                </p>
                <h2 className="mt-1 font-heading text-xl font-semibold">
                  Join the conversation
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Recipe Makeovers, seasonal features, and a private community
                  cooking alongside you. Included with Community membership.
                </p>
                <Link
                  href="/members/makeover"
                  className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                >
                  See how recipe makeovers work
                </Link>
              </section>
            )}

            {(tier === "community" || tier === "chefs_table") && (
              <>
                <section className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Protein Flip™ Makeover
                  </p>
                  <h2 className="mt-1 font-heading text-xl font-semibold">
                    Submit a recipe you love
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Send Chef Henry a family recipe, a weeknight favorite, or a
                    dish you keep coming back to. He periodically chooses
                    submissions and shows how the Protein Flip™ keeps what
                    makes the meal worth cooking.
                  </p>
                  <Link
                    href="/members/makeover"
                    className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Submit a recipe
                  </Link>
                </section>
                <section className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Protein Flip™ Community
                  </p>
                  <h2 className="mt-1 font-heading text-xl font-semibold">
                    Your community
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The private Protein Flip™ group is where members share meals,
                    swaps, and questions.
                  </p>
                  <a
                    href="https://www.facebook.com/groups/proteinflipcommunity"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block rounded-full border border-border px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
                  >
                    Open the community
                  </a>
                </section>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex min-w-0 flex-col gap-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Grocery combo builder
              </p>
              <h2 className="mt-1 font-heading text-xl font-semibold">
                My Lists
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pick your ingredients, get every recipe that shares them, plus
                one combined grocery list.
              </p>
              {comboCredits && !comboCredits.unlimited && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {customBuildsRemainingNote(comboCredits)}
                </p>
              )}
              {lists.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-sm">
                  {lists.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={`/members/combos?list=${l.id}`}
                        className="text-primary hover:underline"
                      >
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {isAtCustomBuildLimit(comboCredits ?? undefined) && comboCredits ? (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    {customBuildsUsedUpNote(comboCredits)}
                  </p>
                  <Link
                    href="/membership"
                    className="mt-3 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Upgrade
                  </Link>
                </div>
              ) : (
                <Link
                  href="/members/combos"
                  className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {lists.length > 0 ? "Build a new list" : "Build your first list"}
                </Link>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Member library
              </p>
              {canSeeFeatured(tier) ? (
                <>
                  <h2 className="mt-1 font-heading text-xl font-semibold">
                    Member Library
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Application Lessons, Kitchen Guides, and Featured Ingredient
                    archives, browsable by category.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-1 font-heading text-xl font-semibold">
                    Lessons and Kitchen Guides
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Every Application Lesson and one-page Kitchen Guide,
                    browsable by category.
                  </p>
                </>
              )}
              <Link
                href="/members/library"
                className="mt-4 inline-block rounded-full border border-border px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
              >
                Open the library
              </Link>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Your membership
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <p>{tier ? TIER_NAMES[tier] : ""}</p>
                <a
                  href="/api/billing"
                  className="inline-block text-muted-foreground underline underline-offset-4 hover:text-primary"
                >
                  Manage billing, upgrade, or cancel
                </a>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-border bg-card p-8">
          <h2 className="font-heading text-2xl font-semibold">
            Choose your membership
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            You&apos;re signed in, but you don&apos;t have an active membership
            yet. Head to the membership page to join.
          </p>
          <Link
            href="/membership"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            See membership options
          </Link>
        </div>
      )}

      {isAdminEmail(member.email) && (
        <section className="mt-12 rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Admin
          </p>
          <h2 className="mt-1 font-heading text-xl font-semibold">Accounts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everyone with an account, who is on which membership, and the
            controls to comp or remove one.
          </p>
          <Link
            href="/members/admin"
            className="mt-4 inline-block rounded-full border border-border px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
          >
            Manage accounts
          </Link>
        </section>
      )}

      <div className="mt-12 space-y-3">
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            Sign out ({member.email})
          </button>
        </form>
        <p>
          <a
            href="mailto:hbaker1118@gmail.com?subject=Chef%20Healthy%20Henry%3A%20Site%20Feedback"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Report an issue
          </a>
        </p>
      </div>
    </div>
  );
}

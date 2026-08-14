import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/auth";
import { TIER_NAMES } from "@/lib/membership";

export const metadata: Metadata = {
  title: "My Kitchen",
  description: "Your Chef Healthy Henry membership dashboard.",
};

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const member = await getMember();
  if (!member) redirect("/members/login");

  const firstName = member.name?.split(" ")[0];

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
        {member.tier ? (
          <span className="rounded-full bg-accent px-4 py-2 text-sm font-medium">
            {TIER_NAMES[member.tier]} member
          </span>
        ) : (
          <span className="rounded-full bg-secondary px-4 py-2 text-sm font-medium">
            No active membership
          </span>
        )}
      </div>

      {member.tier ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-xl font-semibold">
              This month&apos;s lesson
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Member Application Lessons land here when the membership content
              launches.
            </p>
          </section>
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-xl font-semibold">My Lists</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The grocery combo builder is coming soon. Your saved lists will
              live here.
            </p>
          </section>
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
            href="/"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            See membership options
          </Link>
        </div>
      )}

      <form action="/api/auth/logout" method="post" className="mt-12">
        <button
          type="submit"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
        >
          Sign out ({member.email})
        </button>
      </form>
    </div>
  );
}

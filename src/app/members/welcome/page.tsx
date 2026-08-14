import type { Metadata } from "next";
import Link from "next/link";
import { getMember } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Your Chef Healthy Henry membership is active.",
};

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const member = await getMember();
  if (member?.tier) redirect("/members");

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        Welcome to the membership
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Your payment went through and your membership is active. One last step:
        sign in with the same email you used at checkout to open your kitchen.
      </p>
      <Link
        href="/members/login"
        className="mt-8 inline-block rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Sign in to get started
      </Link>
      <p className="mt-6 text-sm text-muted-foreground">
        We&apos;ll email you a sign-in link. No password needed.
      </p>
    </div>
  );
}

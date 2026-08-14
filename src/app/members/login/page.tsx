import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your Chef Healthy Henry membership with a magic link sent to your email.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const member = await getMember();
  if (member) redirect("/members");

  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-24 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Member sign in
      </h1>
      <p className="mt-3 text-muted-foreground">
        Enter your email and we&apos;ll send you a sign-in link. No password
        needed.
      </p>
      {error === "expired" && (
        <p className="mt-4 rounded-lg bg-secondary px-4 py-3 text-sm">
          That sign-in link has expired or was already used. Request a fresh
          one below.
        </p>
      )}
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}

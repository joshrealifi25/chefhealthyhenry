import type { Metadata } from "next";
import { getMember } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingNameForm } from "@/components/onboarding-name-form";

export const metadata: Metadata = {
  title: "Welcome",
};

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const member = await getMember();
  if (!member) redirect("/members/login");
  // Already has a name, so skip onboarding.
  if (member.name) redirect("/members");

  return (
    <div className="mx-auto max-w-sm px-4 py-24 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Welcome. What should we call you?
      </h1>
      <p className="mt-3 text-muted-foreground">
        Just your first name is fine.
      </p>
      <div className="mt-8">
        <OnboardingNameForm />
      </div>
    </div>
  );
}

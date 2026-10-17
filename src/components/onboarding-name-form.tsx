"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OnboardingNameForm() {
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setState("saving");
    try {
      const res = await fetch("/api/auth/set-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        router.push("/members");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="First name"
        autoFocus
        className="rounded-full border border-input bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        disabled={state === "saving" || !name.trim()}
        className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "saving" ? "Saving..." : "Continue"}
      </button>
      <button
        type="button"
        onClick={() => router.push("/members")}
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Skip for now
      </button>
      {state === "error" && (
        <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

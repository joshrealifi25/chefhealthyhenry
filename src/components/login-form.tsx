"use client";

import { useState } from "react";

/** `next` is the page the member was trying to reach before signing in. */
export function LoginForm({ next }: { next?: string | null }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next ? { email, next } : { email }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p className="rounded-lg bg-accent px-4 py-3 text-sm">
        Check your inbox. We sent a sign-in link to{" "}
        <strong>{email}</strong>. It expires in 15 minutes.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label htmlFor="login-email" className="text-sm font-medium">
        Email address
      </label>
      <input
        id="login-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="rounded-full border border-input bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "sending" ? "Sending..." : "Email me a sign-in link"}
      </button>
      {state === "error" && (
        <p className="text-sm text-destructive">
          Something went wrong sending the link. Please try again.
        </p>
      )}
    </form>
  );
}

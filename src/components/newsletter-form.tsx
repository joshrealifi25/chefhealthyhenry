"use client";

import { useId, useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export function NewsletterForm({ submitLabel = "Get the free guide" }: { submitLabel?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  // Several pages render this form alongside the one in the footer, so the
  // field needs an id unique to each instance for the label to point at it.
  const fieldId = useId();

  if (status === "done") {
    return (
      <p role="status" className="text-sm text-primary">
        Check your inbox. Your free Grocery Store Test is on its way.
      </p>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
          const res = await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          setStatus(res.ok ? "done" : "error");
        } catch {
          setStatus("error");
        }
      }}
    >
      <div className="flex gap-2">
        <label htmlFor={fieldId} className="sr-only">
          Email address
        </label>
        <input
          id={fieldId}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full rounded-full border border-input bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : submitLabel}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}

"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { trackLead } from "@/lib/track-events";
import { hrefWithSource, SAMPLER_LEAD_NAME } from "@/lib/lead-source";
import { SUBSCRIBED_STORAGE_KEY } from "@/components/newsletter-form";

type Status = "idle" | "loading" | "done" | "error";

export function SamplerForm({ source }: { source: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const fieldId = useId();

  if (status === "done") {
    return (
      <p role="status" className="text-sm text-primary">
        Check your inbox for 3 Meals for When Nothing Sounds Good.
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
            body: JSON.stringify({ email, offer: "sampler", source }),
          });
          if (res.ok) {
            trackLead({ source, contentName: SAMPLER_LEAD_NAME });
            try {
              localStorage.setItem(SUBSCRIBED_STORAGE_KEY, "1");
            } catch {
              /* private mode */
            }
          }
          setStatus(res.ok ? "done" : "error");
        } catch {
          setStatus("error");
        }
      }}
    >
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={fieldId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full rounded-full border border-input bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Get the free meal map"}
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Free PDF by email. By requesting it, you agree to the{" "}
        <Link
          href={hrefWithSource("/privacy", source)}
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          href={hrefWithSource("/terms", source)}
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms
        </Link>
        .
      </p>
      {status === "error" && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}

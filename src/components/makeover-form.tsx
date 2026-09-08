"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40";

const SOURCES = [
  "My own recipe",
  "Family recipe",
  "Website",
  "Cookbook",
  "Magazine",
  "Other",
] as const;

type Status = "idle" | "loading" | "done" | "error";

export function MakeoverForm() {
  const [status, setStatus] = useState<Status>("idle");

  if (status === "done") {
    return (
      <p
        role="status"
        className="rounded-2xl border border-border bg-accent/40 p-8 text-lg leading-relaxed"
      >
        Your recipe is in. Chef Henry reads every submission and periodically
        selects the ones that make useful teaching examples for the membership.
      </p>
    );
  }

  return (
    <form
      className="space-y-5 rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border/60"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
          const res = await fetch("/api/makeover", {
            method: "POST",
            body: new FormData(e.currentTarget),
          });
          setStatus(res.ok ? "done" : "error");
        } catch {
          setStatus("error");
        }
      }}
    >
      <div>
        <label htmlFor="recipeName" className="mb-1.5 block text-sm font-medium">
          Recipe name
        </label>
        <input
          id="recipeName"
          name="recipeName"
          required
          maxLength={120}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="source" className="mb-1.5 block text-sm font-medium">
          Recipe source
        </label>
        <select id="source" name="source" required className={inputClass}>
          <option value="">Choose one</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="sourceDetail"
          className="mb-1.5 block text-sm font-medium"
        >
          Source name or link, if applicable
        </label>
        <input
          id="sourceDetail"
          name="sourceDetail"
          maxLength={400}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="recipe" className="mb-1.5 block text-sm font-medium">
          Ingredients and directions
        </label>
        <textarea
          id="recipe"
          name="recipe"
          required
          rows={10}
          maxLength={20000}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="love" className="mb-1.5 block text-sm font-medium">
          What do you love about this recipe?
        </label>
        <textarea
          id="love"
          name="love"
          required
          rows={5}
          maxLength={4000}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="help" className="mb-1.5 block text-sm font-medium">
          What would you like Chef Henry to help you rethink?
        </label>
        <textarea
          id="help"
          name="help"
          required
          rows={5}
          maxLength={4000}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="photo" className="mb-1.5 block text-sm font-medium">
          Optional photo
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          JPEG, PNG, or WebP, up to 3 MB.
        </p>
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-primary py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Submit my recipe"}
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          Something went wrong sending your recipe. Please try again.
        </p>
      )}
    </form>
  );
}

"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40";

type Status = "idle" | "loading" | "done" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  if (status === "done") {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-card p-12 text-center shadow-sm ring-1 ring-border/60">
        <p role="status" className="text-lg">
          Thank you! Your message has been received. Henry will be in touch
          soon.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border/60"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        const form = e.currentTarget;
        const data = {
          name: (form.elements.namedItem("name") as HTMLInputElement).value,
          email: (form.elements.namedItem("email") as HTMLInputElement).value,
          topic: (form.elements.namedItem("topic") as HTMLSelectElement).value,
          message: (form.elements.namedItem("message") as HTMLTextAreaElement)
            .value,
        };
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          setStatus(res.ok ? "done" : "error");
        } catch {
          setStatus("error");
        }
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="topic" className="mb-1.5 block text-sm font-medium">
          Topic
        </label>
        <select id="topic" name="topic" className={inputClass} defaultValue="General">
          <option>General</option>
          <option>Coaching</option>
          <option>Cooking classes</option>
          <option>Corporate / community events</option>
          <option>Brand partnership</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-primary py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          Something went wrong sending your message. Please try again.
        </p>
      )}
    </form>
  );
}

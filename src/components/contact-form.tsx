"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-card p-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-lg">
          Thank you! Your message has been received. Henry will be in touch
          soon.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border/60"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name
          </label>
          <input id="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input id="email" type="email" required className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="topic" className="mb-1.5 block text-sm font-medium">
          Topic
        </label>
        <select id="topic" className={inputClass} defaultValue="General">
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
        <textarea id="message" rows={5} required className={inputClass} />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-primary py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Send message
      </button>
    </form>
  );
}

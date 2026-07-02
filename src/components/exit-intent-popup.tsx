"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";

const STORAGE_KEY = "chh-exit-popup-shown";

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => setOpen(false), []);

  useEffect(() => {
    // Desktop exit-intent only: skip touch devices, show once per visitor.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget || e.clientY > 10) return;
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private mode */
      }
      setOpen(true);
      document.removeEventListener("mouseout", onMouseOut);
    };
    // Arm after a short delay so instant bounces don't get popped.
    const timer = setTimeout(
      () => document.addEventListener("mouseout", onMouseOut),
      5000
    );
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector("input")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/40 p-4"
      onClick={dismiss}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-popup-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-card p-8 shadow-xl"
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Before you go
        </p>
        <h2
          id="exit-popup-title"
          className="mt-2 font-heading text-2xl font-semibold leading-snug"
        >
          Take the free Protein Flip™ Grocery Store Test with you
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Shop smart in any aisle, from Chef Healthy Henry. Delivered to your
          inbox, plus one new recipe every week.
        </p>
        <div className="mt-5">
          <NewsletterForm />
        </div>
        <button
          onClick={dismiss}
          className="mt-4 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}

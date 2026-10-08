"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

/**
 * Saves or removes this recipe for the signed-in account. Signed-out
 * visitors go to the magic-link sign-in and return to the recipe.
 */
export function SaveRecipeButton({ slug }: { slug: string }) {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/saved-recipes?slug=${encodeURIComponent(slug)}`)
      .then(async (res) => {
        const data = (await res.json()) as {
          signedIn?: boolean;
          saved?: boolean;
          error?: string;
        };
        if (cancelled) return;
        setSignedIn(Boolean(data.signedIn));
        setSaved(Boolean(data.saved));
        if (!res.ok && data.error) setError(data.error);
      })
      .catch(() => {
        if (!cancelled) setError("Could not check saved recipes.");
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const loginHref = `/members/login?next=${encodeURIComponent(`/recipes/${slug}`)}`;

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        saved
          ? `/api/saved-recipes?slug=${encodeURIComponent(slug)}`
          : "/api/saved-recipes",
        saved
          ? { method: "DELETE" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slug }),
            }
      );
      const data = (await res.json()) as {
        signedIn?: boolean;
        saved?: boolean;
        error?: string;
      };
      if (res.status === 401 || data.signedIn === false) {
        window.location.href = loginHref;
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Could not update saved recipes.");
        return;
      }
      setSignedIn(true);
      setSaved(Boolean(data.saved));
    } catch {
      setError("Could not update saved recipes.");
    } finally {
      setBusy(false);
    }
  }

  const label = saved ? "Saved" : "Save recipe";
  const buttonClass =
    "inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-60";

  return (
    <div className="print:hidden">
      {!ready ? (
        <button type="button" disabled className={buttonClass}>
          <Heart className="size-4" />
          Save recipe
        </button>
      ) : !signedIn ? (
        <Link href={loginHref} className={buttonClass}>
          <Heart className="size-4" />
          Save recipe
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => void toggle()}
          disabled={busy}
          aria-pressed={saved}
          className={buttonClass}
        >
          <Heart className={`size-4 ${saved ? "fill-primary text-primary" : ""}`} />
          {busy ? (saved ? "Removing" : "Saving") : label}
        </button>
      )}
      {saved && signedIn && (
        <Link
          href="/saved"
          className="ml-3 text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
        >
          View saved recipes
        </Link>
      )}
      {error && <p className="mt-2 text-sm text-muted-foreground">{error}</p>}
    </div>
  );
}

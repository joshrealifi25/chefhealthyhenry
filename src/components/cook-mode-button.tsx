"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

function subscribe() {
  return () => {};
}

function wakeLockSupported() {
  return typeof navigator !== "undefined" && "wakeLock" in navigator;
}

export function CookModeButton() {
  const supported = useSyncExternalStore(
    subscribe,
    wakeLockSupported,
    () => false
  );
  const [on, setOn] = useState(false);
  const lockRef = useRef<WakeLockSentinel | null>(null);

  async function acquire(): Promise<boolean> {
    if (!wakeLockSupported()) return false;
    try {
      lockRef.current = await navigator.wakeLock.request("screen");
      return true;
    } catch {
      return false;
    }
  }

  function release() {
    void lockRef.current?.release();
    lockRef.current = null;
  }

  async function toggle() {
    if (on) {
      release();
      setOn(false);
      return;
    }
    if (await acquire()) setOn(true);
  }

  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "visible" && on) {
        void acquire();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [on]);

  useEffect(() => {
    return () => {
      release();
    };
  }, []);

  if (!supported) return null;

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => void toggle()}
      className={cn(
        "mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors print:hidden",
        on
          ? "bg-primary text-primary-foreground"
          : "border border-border bg-card hover:bg-secondary"
      )}
    >
      <Flame className="size-4" />
      {on ? "Cook Mode On" : "Cook Mode"}
    </button>
  );
}

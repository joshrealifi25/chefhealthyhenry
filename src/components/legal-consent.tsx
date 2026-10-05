import Link from "next/link";

/** One-line Privacy and Terms agreement used on login and membership join. */
export function LegalConsent({ preface }: { preface: string }) {
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      {preface}{" "}
      <Link
        href="/privacy"
        className="underline underline-offset-4 hover:text-primary"
      >
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link
        href="/terms"
        className="underline underline-offset-4 hover:text-primary"
      >
        Terms
      </Link>
      .
    </p>
  );
}

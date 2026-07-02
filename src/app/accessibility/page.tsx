import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Chef Healthy Henry's accessibility statement: our commitment to WCAG 2.1 Level AA, what we do, and how to reach us if something isn't working for you.",
};

const practices = [
  "Semantic, structured HTML with clear headings and landmark regions",
  "Descriptive alternative text on meaningful images",
  "Keyboard navigation with a visible focus indicator on every interactive element",
  "A skip to content link for keyboard and screen-reader users",
  "Color contrast that meets AA guidelines for body text and controls",
  "Respect for the reduce motion system setting on animations",
  "Labeled forms and accessible names on buttons and links",
];

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Accessibility
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        We are committed to ensuring our website is accessible to as many
        people as possible, including those who rely on assistive
        technologies. We aim to conform to the Web Content Accessibility
        Guidelines (WCAG) 2.1 Level AA.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">What we do</h2>
      <ul className="mt-5 space-y-3 text-muted-foreground">
        {practices.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50"
            />
            {item}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Ongoing effort
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Accessibility is an ongoing process, not a one-time fix. We test with
        keyboard navigation and automated tooling, and we continue to refine
        the site as it grows. Some third-party embedded content, such as
        video players and checkout pages, may not be fully under our control,
        and we work to provide accessible alternatives where possible.
      </p>

      <h2 className="mt-12 font-heading text-2xl font-semibold">
        Tell us if something is not working
      </h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        If you run into any barrier on this site, or need information in a
        different format, please{" "}
        <Link href="/contact" className="text-primary underline underline-offset-2">
          contact us
        </Link>{" "}
        and we will do our best to help promptly.
      </p>
    </div>
  );
}

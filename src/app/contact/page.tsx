import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Chef Healthy Henry about coaching, cooking classes, corporate events, and brand partnerships.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Let&apos;s talk
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            Questions about a recipe, interested in coaching or classes, or
            exploring a partnership? Send a note and Henry will get back to
            you.
          </p>
          <div className="mt-10 space-y-4 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Community:</span>{" "}
              <a
                href="https://www.facebook.com/groups/proteinflipcommunity"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Protein Flip™ Community on Facebook
              </a>
            </p>
            <p>
              <span className="font-medium text-foreground">Social:</span>{" "}
              <a
                href="https://www.facebook.com/Chefhealthyhenry"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                @Chefhealthyhenry
              </a>
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}

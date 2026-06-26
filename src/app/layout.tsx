import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chef Healthy Henry | A Healthy & Tasty Life",
    template: "%s | Chef Healthy Henry",
  },
  description:
    "Nutrition-smart recipes built on the Protein Flip™ method. Keep the flavors you love while prioritizing satiety and blood sugar stability, with no calorie counting required.",
  openGraph: {
    title: "Chef Healthy Henry | A Healthy & Tasty Life",
    description:
      "Nutrition-smart recipes built on the Protein Flip™ method. 220+ recipes that work by addition, not subtraction.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import {
  PRICE_TO_PRODUCT,
  createDownloadToken,
  type DigitalProduct,
} from "@/lib/fulfillment";
import { deliveryEmailHtml } from "@/lib/delivery-email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const apiKey = process.env.STRIPE_API_KEY;
  const signingSecret = process.env.DOWNLOAD_SIGNING_SECRET;
  const resendKey = process.env.RESEND_API_KEY;

  if (!webhookSecret || !apiKey || !signingSecret || !resendKey) {
    console.error("Stripe webhook: missing required environment variables");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const stripe = new Stripe(apiKey);
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature ?? "", webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;

    if (email) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 20,
      });
      const products = lineItems.data
        .map((li) => (li.price?.id ? PRICE_TO_PRODUCT[li.price.id] : undefined))
        .filter((p): p is DigitalProduct => Boolean(p));

      if (products.length > 0) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
        const links = products.map((p) => ({
          name: p.name,
          url: `${baseUrl}/api/download?token=${createDownloadToken(
            p.pathname,
            signingSecret
          )}`,
        }));

        const resend = new Resend(resendKey);
        const { error } = await resend.emails.send({
          from:
            process.env.EMAIL_FROM ??
            "Chef Healthy Henry <onboarding@resend.dev>",
          to: email,
          subject:
            links.length > 1
              ? "Your Chef Healthy Henry downloads"
              : "Your Chef Healthy Henry download",
          html: deliveryEmailHtml(links),
        });
        if (error) {
          console.error("Resend delivery email failed:", error);
          // Surface a 500 so Stripe retries the webhook rather than dropping the order.
          return NextResponse.json({ error: "Email failed" }, { status: 500 });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}

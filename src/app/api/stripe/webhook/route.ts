import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import {
  PRICE_TO_PRODUCT,
  createDownloadToken,
  type DigitalProduct,
} from "@/lib/fulfillment";
import { deliveryEmailHtml } from "@/lib/delivery-email";
import { notifyHenry, escapeHtml } from "@/lib/notify";

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

      // Owner notification: every order, digital or physical. Never blocks
      // customer delivery.
      await sendOrderNotification(session, lineItems.data, products.length);

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

async function sendOrderNotification(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[],
  digitalCount: number
): Promise<void> {
  const cd = session.customer_details;
  const name = cd?.name ?? "Unknown";
  const email = cd?.email ?? "unknown";
  const total = ((session.amount_total ?? 0) / 100).toFixed(2);

  const itemsHtml = lineItems
    .map((li) => {
      const qty = li.quantity && li.quantity > 1 ? ` x${li.quantity}` : "";
      return `<li>${escapeHtml(li.description ?? "Item")}${qty}</li>`;
    })
    .join("");

  // Physical orders collect a shipping address; surface it prominently.
  // Stripe has moved this field across API versions, so check both homes.
  interface ShippingInfo {
    name?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  }
  const s = session as unknown as {
    shipping_details?: ShippingInfo | null;
    collected_information?: { shipping_details?: ShippingInfo | null } | null;
  };
  const shipping = s.shipping_details ?? s.collected_information?.shipping_details;
  const addr = shipping?.address;
  const needsShipping = Boolean(addr?.line1);

  const shippingHtml = needsShipping
    ? `<div style="background:#f5f1e7;border-radius:10px;padding:14px 16px;margin:14px 0;">
        <strong>SHIP THIS ORDER</strong><br>
        ${escapeHtml(shipping?.name ?? name)}<br>
        ${escapeHtml(addr?.line1 ?? "")}${addr?.line2 ? "<br>" + escapeHtml(addr.line2) : ""}<br>
        ${escapeHtml(addr?.city ?? "")}, ${escapeHtml(addr?.state ?? "")} ${escapeHtml(addr?.postal_code ?? "")}<br>
        ${escapeHtml(addr?.country ?? "")}
      </div>`
    : "";

  const kind = needsShipping
    ? "Physical order, needs shipping"
    : "Digital order, delivered automatically";
  const subject = needsShipping
    ? `Ship it: $${total} order from ${name}`
    : `New order: $${total} from ${name}`;

  await notifyHenry(
    subject,
    `<p><strong>${kind}</strong></p>
     <p>From: ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;<br>
     Total: $${total}</p>
     <ul>${itemsHtml}</ul>
     ${shippingHtml}
     <p style="color:#8a938b;font-size:13px;">${
       digitalCount > 0
         ? "The buyer's download email has been sent automatically."
         : "No digital items in this order."
     } Details in the Stripe dashboard.</p>`
  );
}

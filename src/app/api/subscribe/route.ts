import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createDownloadToken } from "@/lib/fulfillment";
import { deliveryEmailHtml } from "@/lib/delivery-email";

export const runtime = "nodejs";

const STARTER_GUIDE_PATHNAME = "cookbooks/protein-flip-starter-guide.pdf";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const resendKey = process.env.RESEND_API_KEY;
  const signingSecret = process.env.DOWNLOAD_SIGNING_SECRET;
  if (!resendKey || !signingSecret) {
    console.error("Subscribe: missing environment variables");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  let email: string;
  try {
    const body = (await req.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
  } catch {
    email = "";
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const resend = new Resend(resendKey);

  // Add to the newsletter audience. Best effort: if the audience is not
  // configured yet (or the key lacks audience access), still deliver the
  // guide so the visitor gets what they were promised.
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    if (error) console.error("Subscribe: audience add failed:", error);
  } else {
    console.error("Subscribe: RESEND_AUDIENCE_ID not set; skipping list add");
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const downloadUrl = `${baseUrl}/api/download?token=${createDownloadToken(
    STARTER_GUIDE_PATHNAME,
    signingSecret
  )}`;

  const { error: sendError } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Chef Healthy Henry <onboarding@resend.dev>",
    to: email,
    subject: "Your free Protein Flip™ Starter Guide",
    html: deliveryEmailHtml([
      { name: "The Protein Flip™ Starter Guide (free)", url: downloadUrl },
    ]),
  });
  if (sendError) {
    console.error("Subscribe: guide email failed:", sendError);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

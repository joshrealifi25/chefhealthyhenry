import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createDownloadToken } from "@/lib/fulfillment";
import { deliveryEmailHtml } from "@/lib/delivery-email";
import { notifyHenry, escapeHtml } from "@/lib/notify";
import { sendMetaConversionEvent } from "@/lib/ad-tracking";
import { startSampleSequence } from "@/lib/email-sequences";
import {
  cleanLeadSource,
  SAMPLER_LEAD_NAME,
  SAMPLER_PATH,
} from "@/lib/lead-source";
import { createSamplerDownloadToken } from "@/lib/sampler-link";

export const runtime = "nodejs";

const FREE_GUIDE_PATHNAME = "cookbooks/grocery-store-test.pdf";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let email = "";
  let offer = "";
  let source = "direct";
  try {
    const body = (await req.json()) as {
      email?: unknown;
      offer?: unknown;
      source?: unknown;
    };
    email = typeof body.email === "string" ? body.email.trim() : "";
    offer = body.offer === "sampler" ? "sampler" : "grocery";
    source = cleanLeadSource(body.source);
  } catch {
    email = "";
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const signingSecret = process.env.DOWNLOAD_SIGNING_SECRET;
  if (!resendKey || !signingSecret) {
    console.error("Subscribe: missing environment variables");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

  if (offer === "sampler") {
    const signupId = email.toLowerCase();
    const samplerUrl = `${baseUrl}/api/sampler?token=${createSamplerDownloadToken(signingSecret)}&source=${encodeURIComponent(source)}`;
    // The $19 guide page is not on this branch. Later sequence buttons use
    // the sampler landing until that page exists, so they do not 404.
    const guideUrl = `${baseUrl}${SAMPLER_PATH}?source=${encodeURIComponent(source)}`;
    try {
      await startSampleSequence({
        email,
        signupId,
        samplerUrl,
        guideUrl,
      });
    } catch (err) {
      console.error(
        "Subscribe: sampler sequence failed:",
        err instanceof Error ? err.message : "unknown error"
      );
      return NextResponse.json({ error: "Email failed" }, { status: 500 });
    }

    await notifyHenry(
      `New sampler signup (${source}): ${email}`,
      `<p><strong>${escapeHtml(email)}</strong> requested the free 3-meal sampler.</p>
       <p>Source: ${escapeHtml(source)}</p>`
    );

    await sendMetaConversionEvent({
      eventName: "Lead",
      email,
      eventSourceUrl: `${baseUrl}${SAMPLER_PATH}?source=${encodeURIComponent(source)}`,
      source,
      contentName: SAMPLER_LEAD_NAME,
    });

    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(resendKey);

  // Add to the newsletter audience. Best effort: if the audience is not
  // configured yet (or the key lacks audience access), still deliver the
  // file so the visitor gets what they were promised.
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

  const downloadUrl = `${baseUrl}/api/download?token=${createDownloadToken(
    FREE_GUIDE_PATHNAME,
    signingSecret
  )}`;

  const { error: sendError } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Chef Healthy Henry <onboarding@resend.dev>",
    to: email,
    subject: "Your free Protein Flip™ Grocery Store Test",
    html: deliveryEmailHtml([
      { name: "The Protein Flip™ Grocery Store Test (free)", url: downloadUrl },
    ]),
  });
  if (sendError) {
    console.error("Subscribe: guide email failed:", sendError);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  await notifyHenry(
    `New newsletter signup: ${email}`,
    `<p><strong>${escapeHtml(email)}</strong> just joined the list and was
     sent the free Grocery Store Test.</p>
     <p style="color:#8a938b;font-size:13px;">Full list in Resend under
     Audiences.</p>`
  );

  await sendMetaConversionEvent({
    eventName: "Lead",
    email,
    eventSourceUrl: baseUrl,
  });

  return NextResponse.json({ ok: true });
}

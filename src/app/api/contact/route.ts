import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_TO = "henry@chefhealthyhenry.com";

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function POST(req: NextRequest) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("Contact: missing RESEND_API_KEY");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  let name = "", email = "", topic = "", message = "";
  try {
    const body = (await req.json()) as Record<string, unknown>;
    name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    email = typeof body.email === "string" ? body.email.trim() : "";
    topic = typeof body.topic === "string" ? body.topic.trim().slice(0, 60) : "";
    message =
      typeof body.message === "string" ? body.message.trim().slice(0, 5000) : "";
  } catch {
    /* fall through to validation */
  }
  if (!name || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Chef Healthy Henry <onboarding@resend.dev>",
    to: CONTACT_TO,
    replyTo: email,
    subject: `Website contact: ${topic || "General"} from ${name}`,
    html: `
      <p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p>
      <p><strong>Topic:</strong> ${esc(topic || "General")}</p>
      <p style="white-space:pre-wrap;">${esc(message)}</p>`,
  });
  if (error) {
    console.error("Contact: send failed:", error);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

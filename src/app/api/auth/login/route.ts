import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createLoginToken } from "@/lib/auth";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Emails a magic sign-in link. Always returns ok to avoid email probing. */
export async function POST(req: NextRequest) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || !process.env.AUTH_SECRET) {
    console.error("Auth login: missing environment variables");
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

  // In development, always link back to the local server; the configured
  // site URL points at production, where this branch may not be deployed.
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin)
      : req.nextUrl.origin;
  const url = `${baseUrl}/api/auth/callback?token=${createLoginToken(email)}`;

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Chef Healthy Henry <onboarding@resend.dev>",
    to: email,
    subject: "Your sign-in link",
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="font-weight:600;">Sign in to Chef Healthy Henry</h2>
        <p>Click the button below to sign in. This link works once and expires
        in 15 minutes.</p>
        <p style="margin:28px 0;">
          <a href="${url}"
             style="background:#3d5c46;color:#fff;text-decoration:none;
                    padding:12px 28px;border-radius:999px;font-weight:600;">
            Sign in
          </a>
        </p>
        <p style="color:#8a938b;font-size:13px;">If you didn't request this,
        you can safely ignore this email.</p>
      </div>`,
  });
  if (error) {
    console.error("Auth login: email failed:", error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import {
  verifyLoginToken,
  createSession,
  setSessionCookie,
  safeNextPath,
  DEFAULT_MEMBER_LANDING,
} from "@/lib/auth";

export const runtime = "nodejs";

/** Completes a magic-link sign-in and redirects to the member area. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const email = verifyLoginToken(token);
  const baseUrl =
    process.env.VERCEL_ENV === "production"
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin)
      : req.nextUrl.origin;

  // Only a path on this site is accepted, so the link cannot be doctored to
  // redirect a member somewhere else.
  const next = safeNextPath(req.nextUrl.searchParams.get("next"));

  if (!email) {
    const retry = next ? `&next=${encodeURIComponent(next)}` : "";
    return NextResponse.redirect(
      `${baseUrl}/members/login?error=expired${retry}`
    );
  }

  const sessionId = await createSession(email);
  await setSessionCookie(sessionId);
  return NextResponse.redirect(`${baseUrl}${next ?? DEFAULT_MEMBER_LANDING}`);
}

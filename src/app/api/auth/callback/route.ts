import { NextRequest, NextResponse } from "next/server";
import { verifyLoginToken, createSession, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

/** Completes a magic-link sign-in and redirects to the member area. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const email = verifyLoginToken(token);
  const baseUrl =
    process.env.VERCEL_ENV === "production"
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin)
      : req.nextUrl.origin;

  if (!email) {
    return NextResponse.redirect(`${baseUrl}/members/login?error=expired`);
  }

  const sessionId = await createSession(email);
  await setSessionCookie(sessionId);
  return NextResponse.redirect(`${baseUrl}/members`);
}

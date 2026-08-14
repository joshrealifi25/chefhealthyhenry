import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  await clearSession();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  return NextResponse.redirect(`${baseUrl}/`, { status: 303 });
}

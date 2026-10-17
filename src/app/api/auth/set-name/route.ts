import { NextRequest, NextResponse } from "next/server";
import { getMember } from "@/lib/auth";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const member = await getMember();
  if (!member) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let name: string;
  try {
    const body = (await req.json()) as { name?: unknown };
    name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
  } catch {
    name = "";
  }

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  await db().update(users).set({ name }).where(eq(users.id, member.id));
  return NextResponse.json({ ok: true });
}

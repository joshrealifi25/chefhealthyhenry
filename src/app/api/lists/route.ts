import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db, savedLists } from "@/lib/db";
import { getMember } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_LISTS = 50;
const MAX_NAME = 80;
const MAX_ITEMS = 200;

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string").slice(0, MAX_ITEMS)
    : [];
}

/** A member's saved shopping trips, newest first. */
export async function GET() {
  const member = await getMember();
  if (!member?.tier) {
    return NextResponse.json({ error: "Membership required" }, { status: 403 });
  }
  const rows = await db()
    .select()
    .from(savedLists)
    .where(eq(savedLists.userId, member.id))
    .orderBy(desc(savedLists.updatedAt));
  return NextResponse.json({ lists: rows });
}

/** Creates a trip, or updates one in place when an id is supplied. */
export async function POST(req: NextRequest) {
  const member = await getMember();
  if (!member?.tier) {
    return NextResponse.json({ error: "Membership required" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name =
    typeof body.name === "string" ? body.name.trim().slice(0, MAX_NAME) : "";
  const ingredients = strings(body.ingredients);
  const recipeSlugs = strings(body.recipeSlugs);
  const inCart = strings(body.inCart);
  if (!name) {
    return NextResponse.json({ error: "Name your list" }, { status: 400 });
  }
  if (ingredients.length === 0) {
    return NextResponse.json({ error: "Pick an ingredient first" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : null;
  if (id) {
    // Scope the update to the owner so an id from elsewhere cannot touch it.
    const [row] = await db()
      .update(savedLists)
      .set({ name, ingredients, recipeSlugs, inCart, updatedAt: new Date() })
      .where(and(eq(savedLists.id, id), eq(savedLists.userId, member.id)))
      .returning();
    if (!row) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }
    return NextResponse.json({ list: row });
  }

  const existing = await db()
    .select({ id: savedLists.id })
    .from(savedLists)
    .where(eq(savedLists.userId, member.id));
  if (existing.length >= MAX_LISTS) {
    return NextResponse.json(
      { error: `You can keep up to ${MAX_LISTS} lists. Delete one to make room.` },
      { status: 400 }
    );
  }

  const [row] = await db()
    .insert(savedLists)
    .values({ userId: member.id, name, ingredients, recipeSlugs, inCart })
    .returning();
  return NextResponse.json({ list: row });
}

export async function DELETE(req: NextRequest) {
  const member = await getMember();
  if (!member?.tier) {
    return NextResponse.json({ error: "Membership required" }, { status: 403 });
  }
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await db()
    .delete(savedLists)
    .where(and(eq(savedLists.id, id), eq(savedLists.userId, member.id)));
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getAdmin } from "@/lib/admin";
import { db, favoriteThings } from "@/lib/db";
import { parseFavoriteThingInput } from "@/lib/favorite-things";

export const runtime = "nodejs";

/**
 * Admin CRUD for Chef Henry's Favorite Things. Every method answers 404 to a
 * non-admin, matching the accounts route, so the endpoint does not advertise
 * itself.
 */

/** All items, active and inactive, in display order. */
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const items = await db()
    .select()
    .from(favoriteThings)
    .orderBy(
      asc(favoriteThings.category),
      asc(favoriteThings.sortOrder),
      asc(favoriteThings.createdAt)
    );
  return NextResponse.json({ items });
}

/** Creates an item. */
export async function POST(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = parseFavoriteThingInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const [item] = await db().insert(favoriteThings).values(parsed.value).returning();
  return NextResponse.json({ ok: true, item });
}

/** Replaces an item's editable fields. The id comes in the body. */
export async function PUT(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;
  if (!id) {
    return NextResponse.json({ error: "Missing item." }, { status: 400 });
  }
  const parsed = parseFavoriteThingInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const [item] = await db()
    .update(favoriteThings)
    .set(parsed.value)
    .where(eq(favoriteThings.id, id))
    .returning();
  if (!item) {
    return NextResponse.json({ error: "That item no longer exists." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, item });
}

/** Deletes an item. The id comes in the query string: ?id=... */
export async function DELETE(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing item." }, { status: 400 });
  }

  const [item] = await db()
    .delete(favoriteThings)
    .where(eq(favoriteThings.id, id))
    .returning({ id: favoriteThings.id, name: favoriteThings.name });
  if (!item) {
    return NextResponse.json({ error: "That item no longer exists." }, { status: 404 });
  }
  console.log(`Admin ${admin.email} deleted favorite thing ${item.name}`);
  return NextResponse.json({ ok: true, deleted: item.id });
}

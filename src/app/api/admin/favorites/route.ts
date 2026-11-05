import { NextRequest, NextResponse } from "next/server";
import { asc, eq, ne } from "drizzle-orm";
import { getAdmin } from "@/lib/admin";
import { db, favoriteThings } from "@/lib/db";
import {
  parseFavoriteThingInput,
  type FavoriteThing,
  type FavoriteThingInput,
} from "@/lib/favorite-things";

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

/**
 * Saves the one Product of the Month.
 *
 * neon-http rejects an interactive transaction callback. batch() is the
 * transaction that driver does support: both statements go out in one Neon
 * HTTP transaction and commit or roll back together. There is no unique
 * constraint. This route is what keeps a single featured row.
 */
async function saveAsOnlyFeatured(
  value: FavoriteThingInput,
  id: string | null
): Promise<FavoriteThing | undefined> {
  const database = db();
  if (id) {
    const [, updated] = await database.batch([
      database
        .update(favoriteThings)
        .set({ isFeatured: false })
        .where(ne(favoriteThings.id, id)),
      database
        .update(favoriteThings)
        .set(value)
        .where(eq(favoriteThings.id, id))
        .returning(),
    ]);
    return updated[0];
  }

  const [, inserted] = await database.batch([
    database.update(favoriteThings).set({ isFeatured: false }),
    database.insert(favoriteThings).values(value).returning(),
  ]);
  return inserted[0];
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

  const item = parsed.value.isFeatured
    ? await saveAsOnlyFeatured(parsed.value, null)
    : (await db().insert(favoriteThings).values(parsed.value).returning())[0];
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

  if (parsed.value.isFeatured) {
    const [existing] = await db()
      .select({ id: favoriteThings.id })
      .from(favoriteThings)
      .where(eq(favoriteThings.id, id))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: "That item no longer exists." }, { status: 404 });
    }
  }

  const item = parsed.value.isFeatured
    ? await saveAsOnlyFeatured(parsed.value, id)
    : (
        await db()
          .update(favoriteThings)
          .set(parsed.value)
          .where(eq(favoriteThings.id, id))
          .returning()
      )[0];
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

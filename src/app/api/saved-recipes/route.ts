import { NextRequest, NextResponse } from "next/server";
import { and, count, eq } from "drizzle-orm";
import { getMember } from "@/lib/auth";
import { db, savedRecipes } from "@/lib/db";
import { getRecipe } from "@/lib/recipes";

export const runtime = "nodejs";

/** Enough for a home cook's library, not an unbounded write target. */
const MAX_SAVED = 200;

function readSlug(raw: string | null | undefined): string {
  return typeof raw === "string" ? raw.trim() : "";
}

/** Whether this signed-in account has saved one recipe. */
export async function GET(req: NextRequest) {
  const member = await getMember();
  const slug = readSlug(req.nextUrl.searchParams.get("slug"));
  if (!member) {
    return NextResponse.json({ signedIn: false, saved: false });
  }
  if (!slug || !getRecipe(slug)) {
    return NextResponse.json({ signedIn: true, saved: false });
  }

  try {
    const [row] = await db()
      .select({ id: savedRecipes.id })
      .from(savedRecipes)
      .where(
        and(eq(savedRecipes.userId, member.id), eq(savedRecipes.recipeSlug, slug))
      );
    return NextResponse.json({ signedIn: true, saved: Boolean(row) });
  } catch (err) {
    console.error("Saved recipes: could not read", err);
    return NextResponse.json(
      {
        signedIn: true,
        saved: false,
        error: "Saved recipes are not available right now.",
      },
      { status: 503 }
    );
  }
}

/** Saves a recipe for the signed-in account. Saving twice is a no-op. */
export async function POST(req: NextRequest) {
  const member = await getMember();
  if (!member) {
    return NextResponse.json({ signedIn: false, saved: false }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const slug = readSlug(typeof body.slug === "string" ? body.slug : "");
  if (!getRecipe(slug)) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  try {
    const [existing] = await db()
      .select({ id: savedRecipes.id })
      .from(savedRecipes)
      .where(
        and(eq(savedRecipes.userId, member.id), eq(savedRecipes.recipeSlug, slug))
      );
    if (existing) {
      return NextResponse.json({ signedIn: true, saved: true });
    }

    const [{ n }] = await db()
      .select({ n: count() })
      .from(savedRecipes)
      .where(eq(savedRecipes.userId, member.id));
    if (Number(n) >= MAX_SAVED) {
      return NextResponse.json(
        {
          error: `You have ${MAX_SAVED} saved recipes. Remove one before saving another.`,
        },
        { status: 400 }
      );
    }

    await db().insert(savedRecipes).values({
      userId: member.id,
      recipeSlug: slug,
    });
    return NextResponse.json({ signedIn: true, saved: true });
  } catch (err) {
    console.error("Saved recipes: could not save", err);
    return NextResponse.json(
      { error: "Could not save this recipe. Please try again." },
      { status: 503 }
    );
  }
}

/** Removes a saved recipe. Removing one that is not saved is a no-op. */
export async function DELETE(req: NextRequest) {
  const member = await getMember();
  if (!member) {
    return NextResponse.json({ signedIn: false, saved: false }, { status: 401 });
  }

  const slug = readSlug(req.nextUrl.searchParams.get("slug"));
  if (!slug) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 400 });
  }

  try {
    await db()
      .delete(savedRecipes)
      .where(
        and(eq(savedRecipes.userId, member.id), eq(savedRecipes.recipeSlug, slug))
      );
    return NextResponse.json({ signedIn: true, saved: false });
  } catch (err) {
    console.error("Saved recipes: could not remove", err);
    return NextResponse.json(
      { error: "Could not update saved recipes. Please try again." },
      { status: 503 }
    );
  }
}

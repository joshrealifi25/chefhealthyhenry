import { NextRequest, NextResponse } from "next/server";
import { db, ingredientSearches } from "@/lib/db";
import { getMember } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_TERM = 80;
const MAX_SESSION = 64;

/**
 * Records an ingredient a member added in the combo builder, so Henry can see
 * what people look for. Stores the term and a random per-visit id only, never
 * anything identifying. Always answers 204 so a logging failure is invisible
 * to the member.
 */
export async function POST(req: NextRequest) {
  try {
    const member = await getMember();
    if (!member?.tier) return new NextResponse(null, { status: 204 });

    const body = (await req.json()) as { term?: unknown; sessionId?: unknown };
    const term =
      typeof body.term === "string" ? body.term.trim().slice(0, MAX_TERM) : "";
    const sessionId =
      typeof body.sessionId === "string"
        ? body.sessionId.slice(0, MAX_SESSION)
        : "";
    if (term && sessionId) {
      await db().insert(ingredientSearches).values({ term, sessionId });
    }
  } catch (err) {
    console.error("Ingredient search logging failed:", err);
  }
  return new NextResponse(null, { status: 204 });
}

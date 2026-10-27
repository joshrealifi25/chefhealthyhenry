import { NextRequest, NextResponse } from "next/server";
import { db, postComments } from "@/lib/db";
import { getMember } from "@/lib/auth";
import { eq, and, asc } from "drizzle-orm";

export const runtime = "nodejs";

/** GET /api/comments?post=slug — returns approved comments for a post */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("post");
  if (!slug) return NextResponse.json({ error: "Missing post" }, { status: 400 });

  const comments = await db()
    .select({
      id: postComments.id,
      name: postComments.name,
      body: postComments.body,
      createdAt: postComments.createdAt,
    })
    .from(postComments)
    .where(and(eq(postComments.postSlug, slug), eq(postComments.approved, true)))
    .orderBy(asc(postComments.createdAt));

  return NextResponse.json(comments);
}

/** POST /api/comments — submit a new comment (pending approval) */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { postSlug, name, email, comment } = body as Record<string, string>;
  if (!postSlug || !name || !email || !comment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (comment.trim().length < 2 || comment.length > 2000) {
    return NextResponse.json({ error: "Comment length invalid" }, { status: 400 });
  }

  const member = await getMember();

  await db().insert(postComments).values({
    postSlug,
    userId: member?.id ?? null,
    name: name.trim().slice(0, 100),
    email: email.trim().toLowerCase().slice(0, 255),
    body: comment.trim(),
    approved: false,
  });

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { and, count, eq, gte } from "drizzle-orm";
import { db, sousMessages } from "@/lib/db";
import { getMember } from "@/lib/auth";
import { SOUS_SYSTEM_PROMPT, SOUS_DAILY_CAP } from "@/lib/sous";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_TURNS = 20;
const MAX_MESSAGE_CHARS = 2000;

/** Streams a Sous reply. Members only; Kitchen tier has a daily cap. */
export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Sous: ANTHROPIC_API_KEY not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const member = await getMember();
  if (!member) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (!member.tier) {
    return NextResponse.json({ error: "Membership required" }, { status: 403 });
  }

  let messages: ChatMessage[];
  try {
    const body = (await req.json()) as { messages?: unknown };
    messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter(
        (m): m is ChatMessage =>
          typeof m === "object" &&
          m !== null &&
          ((m as ChatMessage).role === "user" ||
            (m as ChatMessage).role === "assistant") &&
          typeof (m as ChatMessage).content === "string"
      )
      .slice(-MAX_TURNS)
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, MAX_MESSAGE_CHARS),
      }));
  } catch {
    messages = [];
  }
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "No message" }, { status: 400 });
  }

  // Daily cap (per calendar day, UTC) for tiers with a limit.
  const cap = SOUS_DAILY_CAP[member.tier] ?? 0;
  if (Number.isFinite(cap)) {
    const dayStart = new Date();
    dayStart.setUTCHours(0, 0, 0, 0);
    const [{ used }] = await db()
      .select({ used: count() })
      .from(sousMessages)
      .where(
        and(
          eq(sousMessages.userId, member.id),
          gte(sousMessages.createdAt, dayStart)
        )
      );
    if (used >= cap) {
      return NextResponse.json(
        {
          error:
            "You've reached today's question limit. Your questions reset tomorrow, or upgrade for unlimited access.",
        },
        { status: 429 }
      );
    }
  }
  await db().insert(sousMessages).values({ userId: member.id });

  const anthropic = new Anthropic();
  const stream = anthropic.messages.stream({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SOUS_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (delta) => controller.enqueue(encoder.encode(delta)));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => {
        console.error("Sous stream error:", err);
        controller.error(err);
      });
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

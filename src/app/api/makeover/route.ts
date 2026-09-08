import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getMember } from "@/lib/auth";
import { escapeHtml } from "@/lib/notify";

export const runtime = "nodejs";

const HENRY = "henry@chefhealthyhenry.com";
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function field(form: FormData, name: string, max: number): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  const member = await getMember();
  if (!member) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (member.tier !== "community" && member.tier !== "chefs_table") {
    return NextResponse.json({ error: "Community required" }, { status: 403 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("Makeover: missing RESEND_API_KEY");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }

  const recipeName = field(form, "recipeName", 120);
  const source = field(form, "source", 60);
  const sourceDetail = field(form, "sourceDetail", 400);
  const recipe = field(form, "recipe", 20000);
  const love = field(form, "love", 4000);
  const help = field(form, "help", 4000);

  if (!recipeName || !source || !recipe || !love || !help) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const photo = form.get("photo");
  let attachment:
    | { filename: string; content: Buffer; contentType: string }
    | undefined;
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > MAX_PHOTO_BYTES || !PHOTO_TYPES.has(photo.type)) {
      return NextResponse.json({ error: "Photo not accepted" }, { status: 400 });
    }
    attachment = {
      filename: photo.name.slice(0, 80) || "recipe.jpg",
      content: Buffer.from(await photo.arrayBuffer()),
      contentType: photo.type,
    };
  }

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Chef Healthy Henry <onboarding@resend.dev>",
    to: HENRY,
    replyTo: member.email,
    subject: `Recipe makeover: ${recipeName}`,
    html: `
      <p>A Community member submitted a recipe for a possible Protein Flip™ makeover.</p>
      <p><strong>From:</strong> ${escapeHtml(member.name ?? "Member")} &lt;${escapeHtml(member.email)}&gt;</p>
      <p><strong>Recipe name:</strong> ${escapeHtml(recipeName)}</p>
      <p><strong>Source:</strong> ${escapeHtml(source)}</p>
      <p><strong>Source name or link:</strong> ${escapeHtml(sourceDetail || "Not given")}</p>
      <p><strong>What they love:</strong></p>
      <p style="white-space:pre-wrap;">${escapeHtml(love)}</p>
      <p><strong>What they want rethought:</strong></p>
      <p style="white-space:pre-wrap;">${escapeHtml(help)}</p>
      <p><strong>Ingredients and directions:</strong></p>
      <p style="white-space:pre-wrap;">${escapeHtml(recipe)}</p>
    `,
    attachments: attachment
      ? [
          {
            filename: attachment.filename,
            content: attachment.content,
            contentType: attachment.contentType,
          },
        ]
      : undefined,
  });
  if (error) {
    console.error("Makeover: send failed:", error);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

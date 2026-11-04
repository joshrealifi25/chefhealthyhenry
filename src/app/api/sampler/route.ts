import { readFileSync } from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { verifySamplerDownloadToken } from "@/lib/sampler-link";

export const runtime = "nodejs";

const SAMPLER_PDF_PATH = path.join(
  process.cwd(),
  "private/sampler/3-meals-for-when-nothing-sounds-good.pdf"
);

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const signingSecret = process.env.DOWNLOAD_SIGNING_SECRET;
  if (!token || !signingSecret || !verifySamplerDownloadToken(token, signingSecret)) {
    return new Response(
      "This download link is invalid or has expired. Reply to your sampler email and Henry will send a fresh one.",
      { status: 403 }
    );
  }

  try {
    const pdf = readFileSync(SAMPLER_PDF_PATH);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="3-Meals-for-When-Nothing-Sounds-Good.pdf"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("Sampler download: PDF missing:", err);
    return new Response("File not found.", { status: 404 });
  }
}

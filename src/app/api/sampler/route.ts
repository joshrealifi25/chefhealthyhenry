import { NextRequest } from "next/server";
import { get } from "@vercel/blob";
import { verifySamplerDownloadToken } from "@/lib/sampler-link";

export const runtime = "nodejs";

const SAMPLER_PATHNAME = "cookbooks/wnsg-3-meal-sampler.pdf";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const signingSecret = process.env.DOWNLOAD_SIGNING_SECRET;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token || !signingSecret || !blobToken) {
    return new Response("Invalid request.", { status: 400 });
  }

  if (!verifySamplerDownloadToken(token, signingSecret)) {
    return new Response(
      "This download link is invalid or has expired. Reply to your sampler email and Henry will send a fresh one.",
      { status: 403 }
    );
  }

  try {
    const result = await get(SAMPLER_PATHNAME, { access: "private", token: blobToken });
    if (!result || result.statusCode !== 200 || !result.stream) {
      console.error("Sampler download: PDF missing.");
      return new Response("File not found.", { status: 404 });
    }

    return new Response(result.stream, {
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

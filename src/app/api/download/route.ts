import { NextRequest } from "next/server";
import { get } from "@vercel/blob";
import { verifyDownloadToken, fileNameFor } from "@/lib/fulfillment";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const signingSecret = process.env.DOWNLOAD_SIGNING_SECRET;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token || !signingSecret || !blobToken) {
    return new Response("Invalid request.", { status: 400 });
  }

  const pathname = verifyDownloadToken(token, signingSecret);
  if (!pathname) {
    return new Response(
      "This download link is invalid or has expired. Reply to your receipt and we'll send a fresh one.",
      { status: 403 }
    );
  }

  const result = await get(pathname, { access: "private", token: blobToken });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return new Response("File not found.", { status: 404 });
  }

  return new Response(result.stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileNameFor(pathname)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

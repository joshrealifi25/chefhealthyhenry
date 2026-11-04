import { NextRequest, NextResponse } from "next/server";
import { escapeHtml } from "@/lib/notify";
import {
  unsubscribeMarketingEmails,
  verifyUnsubscribeToken,
} from "@/lib/email-sequences";

export const runtime = "nodejs";

function attr(value: string): string {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function page(title: string, body: string, status: number): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta name="robots" content="noindex">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;background:#f5f1e7;font-family:Georgia,'Times New Roman',serif;color:#34433a;">
  <main style="max-width:32rem;margin:0 auto;padding:48px 24px;">
    <p style="font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:3px;color:#4f6b54;">CHEF HEALTHY HENRY</p>
    <h1 style="font-size:32px;font-weight:600;line-height:1.2;">${escapeHtml(title)}</h1>
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#4a564c;">${body}</div>
  </main>
</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function tokenFrom(req: NextRequest, emailField: string | null, tokenField: string | null): {
  email: string;
  token: string;
} {
  const email = (emailField ?? req.nextUrl.searchParams.get("email") ?? "").trim();
  const token = (tokenField ?? req.nextUrl.searchParams.get("token") ?? "").trim();
  return { email, token };
}

export async function GET(req: NextRequest) {
  const { email, token } = tokenFrom(req, null, null);
  if (!verifyUnsubscribeToken(email, token)) {
    return page(
      "Link not valid",
      "<p>This unsubscribe link is not valid. Reply to any email from Henry and ask to be removed.</p>",
      400,
    );
  }
  const action = req.nextUrl.pathname + req.nextUrl.search;
  return page(
    "Unsubscribe",
    `<p>This stops marketing email from Chef Healthy Henry, including the small-appetite notes. A receipt or download you already earned can still arrive.</p>
     <form method="post" action="${attr(action)}">
       <input type="hidden" name="email" value="${attr(email)}">
       <input type="hidden" name="token" value="${attr(token)}">
       <button type="submit" style="margin-top:8px;background:#4f6b54;color:#ffffff;border:0;border-radius:9999px;padding:12px 24px;font-size:15px;">Unsubscribe</button>
     </form>`,
    200,
  );
}

export async function POST(req: NextRequest) {
  let emailField: string | null = null;
  let tokenField: string | null = null;
  const contentType = req.headers.get("content-type") ?? "";
  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await req.formData();
    const emailValue = form.get("email");
    const tokenValue = form.get("token");
    emailField = typeof emailValue === "string" ? emailValue : null;
    tokenField = typeof tokenValue === "string" ? tokenValue : null;
  }
  const { email, token } = tokenFrom(req, emailField, tokenField);
  if (!verifyUnsubscribeToken(email, token)) {
    return page(
      "Link not valid",
      "<p>This unsubscribe link is not valid. Reply to any email from Henry and ask to be removed.</p>",
      400,
    );
  }
  try {
    await unsubscribeMarketingEmails(email);
  } catch (err) {
    console.error(
      "unsubscribe failed",
      err instanceof Error ? err.message : "unknown error",
    );
    return page(
      "Try again",
      "<p>We could not unsubscribe this address just now. Reply to any email from Henry and ask to be removed.</p>",
      500,
    );
  }
  return page(
    "You are unsubscribed",
    "<p>Henry will not send more marketing email to this address.</p>",
    200,
  );
}

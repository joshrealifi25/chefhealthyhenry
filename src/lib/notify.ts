import { Resend } from "resend";

/** Where owner notifications go. */
const NOTIFY_TO = "henry@chefhealthyhenry.com";

export function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * Send Henry an owner notification. Never throws: a failed notification
 * must not break the customer-facing flow that triggered it.
 */
export async function notifyHenry(subject: string, html: string): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("notifyHenry: RESEND_API_KEY missing");
    return;
  }
  try {
    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM ?? "Chef Healthy Henry <onboarding@resend.dev>",
      to: NOTIFY_TO,
      subject,
      html: `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#34433a;max-width:520px;">${html}</div>`,
    });
    if (error) console.error("notifyHenry: send failed:", error);
  } catch (err) {
    console.error("notifyHenry: send threw:", err);
  }
}

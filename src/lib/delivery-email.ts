interface DownloadLink {
  name: string;
  url: string;
}

/** Builds the on-brand HTML for the cookbook delivery email. No em dashes (house rule). */
export function deliveryEmailHtml(links: DownloadLink[]): string {
  const items = links
    .map(
      (l) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;">
            <div style="font-weight:600;color:#2d3a2e;">${l.name}</div>
            <a href="${l.url}"
               style="display:inline-block;margin-top:8px;padding:10px 20px;background:#4a6a4d;color:#fff;text-decoration:none;border-radius:9999px;font-size:14px;">
              Download your copy
            </a>
          </td>
        </tr>`
    )
    .join("");

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;color:#2d3a2e;">
    <h1 style="font-size:22px;margin:0 0 4px;">Thank you for your order</h1>
    <p style="color:#5a6b5c;font-size:15px;line-height:1.6;">
      Your cookbook is ready to download. Your link works for 7 days, so save the
      file somewhere safe once you open it.
    </p>
    <table style="width:100%;border-collapse:collapse;">${items}</table>
    <p style="color:#5a6b5c;font-size:14px;line-height:1.6;margin-top:20px;">
      Questions about your order? Just reply to this email and Henry will help.
    </p>
    <p style="color:#5a6b5c;font-size:14px;margin-top:24px;">
      Happy cooking,<br/>Chef Healthy Henry
    </p>
  </div>`;
}

import { createHash } from "crypto";

const GRAPH_VERSION = "v21.0";

interface MetaConversionEvent {
  eventName: "Lead" | "Purchase" | "Subscribe";
  email: string;
  value?: number;
  currency?: string;
  eventSourceUrl?: string;
  /** Traffic source from the link. Sent as content_category. */
  source?: string;
  /** Offer name. Sent as content_name so a sampler lead is distinct. */
  contentName?: string;
}

function hashEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

function metaCustomData(
  event: MetaConversionEvent
): Record<string, string | number> | undefined {
  const data: Record<string, string | number> = {};
  if (event.value !== undefined) {
    data.value = event.value;
    data.currency = event.currency ?? "USD";
  }
  if (event.contentName) data.content_name = event.contentName;
  if (event.source) data.content_category = event.source;
  return Object.keys(data).length > 0 ? data : undefined;
}

/**
 * Sends a server-side conversion event to Meta's Conversions API. Best
 * effort only, like notifyHenry: ad tracking must never block fulfillment
 * or delivery, so every failure is caught and logged, never thrown. A no-op
 * until NEXT_PUBLIC_META_PIXEL_ID and META_CONVERSIONS_API_TOKEN are set.
 */
export async function sendMetaConversionEvent(
  event: MetaConversionEvent
): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;
  if (!pixelId || !accessToken) return;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: event.eventName,
              event_time: Math.floor(Date.now() / 1000),
              action_source: "website",
              event_source_url: event.eventSourceUrl,
              user_data: { em: [hashEmail(event.email)] },
              custom_data: metaCustomData(event),
            },
          ],
        }),
      }
    );
    if (!res.ok) {
      console.error("Meta Conversions API event failed:", await res.text());
    }
  } catch (err) {
    console.error("Meta Conversions API event threw:", err);
  }
}

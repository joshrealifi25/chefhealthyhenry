import crypto from "crypto";
import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";
import {
  DAY_MS,
  GUIDE_PREVIEW_IMAGE_URL,
  renderBuyerSequence,
  renderRecoveryMessage,
  renderSampleSequence,
  type RecoveryStep,
  type SequenceMessage,
} from "@/lib/email-sequence-messages";

/**
 * When Nothing Sounds Good email sequences.
 *
 * Sender is always Chef Healthy Henry <henry@chefhealthyhenry.com>.
 * Every message includes an unsubscribe link. Nothing here has been
 * sent through a live Resend account.
 *
 * Sampler signup (the other agent owns /api/subscribe):
 *   startSampleSequence({ email, name, signupId, samplerUrl, guideUrl })
 *   The first message is the sampler delivery. Do not send a second one.
 *   signupId must stay the same if the request is retried. The normalized
 *   email is a safe signupId. Throws if a message cannot be scheduled.
 *
 * Guide purchase (call after the download email has already been sent):
 *   startBuyerSequence({ email, name, sessionId, downloadUrl })
 *   Stops the sample sales emails and any checkout reminders, then
 *   schedules the buyer notes (day 2, day 5, day 10, day 21).
 *   Does not send another download email. sessionId is the idempotency
 *   key. Throws on failure. The caller logs that error and does not retry.
 *
 * Abandoned checkout (checkout.session.expired, once the session has an email):
 *   startCheckoutRecovery({ email, name, sessionId, checkoutUrl })
 *   checkoutUrl may be a site path. It is not an expired Stripe URL.
 *   sessionId is the idempotency key. Throws on failure so the caller
 *   can return 500 and Stripe will retry. A retry does not send a second set.
 *
 * Membership (not wired; call from the membership webhook when you own it):
 *   stopMembershipPitches(email)
 *   Cancels the Protein Flip Kitchen note if it has not been sent.
 *
 * Unsubscribe route:
 *   unsubscribeMarketingEmails(email)
 *   verifyUnsubscribeToken(email, token)
 *
 * Henry still has to decide the recovery clock. Change
 * CHECKOUT_RECOVERY_SCHEDULE and nothing else. The 1-hour note is
 * written and is not in that list.
 */

/** Plan sender. Not EMAIL_FROM, which may be a different address. */
export const WNSG_FROM = "Chef Healthy Henry <henry@chefhealthyhenry.com>";

/**
 * Landing page for "See inside" and "Get the free sampler".
 * The page agent owns the real slug. Change this if that slug differs.
 */
export const WNSG_LANDING_PATH = "/when-nothing-sounds-good";

/**
 * Quote the $10 founding price in the day 5 buyer note.
 * The plan says to mention it only while it is real. Off until Henry
 * confirms this sequence should name it.
 */
export const MENTION_FOUNDING_PRICE = false;

const HOUR_MS = 60 * 60 * 1000;

/**
 * Delays after startCheckoutRecovery runs. That call is
 * checkout.session.expired, about 24 hours after checkout starts.
 * A 1-hour reminder cannot be sent from that webhook.
 *
 * Henry has not picked a clock:
 * - from checkout start (1 hour, 24 hours, 72 hours), or
 * - from expiry (24 hours, 48 hours, 96 hours after they left).
 *
 * delayMs waits from this function call, not from checkout start.
 * The default treats the call as the 24-hour mark: "A look inside
 * the guide" sends on the call, and "Keep the free meal map" sends
 * 48 hours later (about 72 hours after checkout started).
 *
 * The 1-hour note is step "one-hour". It is not listed here.
 * Add it only after Henry decides, for example
 * { step: "one-hour", delayMs: 0 }.
 */
export const CHECKOUT_RECOVERY_SCHEDULE: readonly {
  step: RecoveryStep;
  delayMs: number;
}[] = [
  { step: "look-inside", delayMs: 0 },
  { step: "keep-free-map", delayMs: 48 * HOUR_MS },
];

const SAMPLE_STEPS = 8;
const BUYER_STEPS = 4;

const PROP = {
  sampleIds: "wnsg_sample_ids",
  sampleState: "wnsg_sample_state",
  sampleSignup: "wnsg_sample_signup",
  recoveryIds: "wnsg_recovery_ids",
  recoverySession: "wnsg_recovery_session",
  buyerIds: "wnsg_buyer_ids",
  buyerState: "wnsg_buyer_state",
  buyerSession: "wnsg_buyer_session",
} as const;

const PROPERTY_KEYS = Object.values(PROP);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PropMap = Record<string, string>;

interface StoredId {
  id: string;
  step: string;
}

let propertiesReady: Promise<void> | null = null;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function requireEmail(email: string): string {
  const normalized = normalizeEmail(email);
  if (!EMAIL_RE.test(normalized) || normalized.length > 254) {
    throw new Error("Email address is not valid");
  }
  return normalized;
}

function requireId(value: string, label: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`${label} is required`);
  return trimmed;
}

function idempotencyKey(scopeId: string, step: string): string {
  const clean = scopeId.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 120);
  return `wnsg-${clean}-${step}`.slice(0, 200);
}

function absoluteUrl(value: string, label: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("/")) {
    return new URL(trimmed, SITE_URL).toString();
  }
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(`${label} is not a URL`);
  }
  if (
    parsed.protocol !== "https:" &&
    parsed.protocol !== "http:" &&
    parsed.protocol !== "mailto:"
  ) {
    throw new Error(`${label} must be an http(s) link`);
  }
  return parsed.toString();
}

export function unsubscribeUrlFor(email: string): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set, so this email cannot include an unsubscribe link",
    );
  }
  const token = crypto
    .createHmac("sha256", secret)
    .update(`wnsg-unsub:${email}`)
    .digest("base64url");
  const url = new URL("/api/email/unsubscribe", SITE_URL);
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);
  return url.toString();
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const secret = process.env.AUTH_SECRET;
  if (!secret || !token) return false;
  const normalized = normalizeEmail(email);
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`wnsg-unsub:${normalized}`)
    .digest("base64url");
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function resendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function propValue(raw: unknown): string {
  if (!raw || typeof raw !== "object" || !("value" in raw)) return "";
  const value = (raw as { value?: unknown }).value;
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

async function ensureProperties(resend: Resend): Promise<void> {
  if (!propertiesReady) {
    propertiesReady = (async () => {
      const listed = await resend.contactProperties.list({ limit: 100 });
      if (listed.error) {
        throw new Error(
          `Could not list contact properties: ${listed.error.message}`,
        );
      }
      const have = new Set((listed.data?.data ?? []).map((item) => item.key));
      for (const key of PROPERTY_KEYS) {
        if (have.has(key)) continue;
        const created = await resend.contactProperties.create({
          key,
          type: "string",
        });
        if (!created.error) continue;
        const duplicate =
          created.error.statusCode === 409 ||
          /already|exist/i.test(created.error.message);
        if (!duplicate) {
          throw new Error(
            `Could not create contact property ${key}: ${created.error.message}`,
          );
        }
      }
    })().catch((err: unknown) => {
      propertiesReady = null;
      throw err;
    });
  }
  await propertiesReady;
}

async function readContact(
  resend: Resend,
  email: string,
): Promise<{ unsubscribed: boolean; props: PropMap }> {
  const got = await resend.contacts.get({ email });
  if (got.error || !got.data) {
    return { unsubscribed: false, props: {} };
  }
  const props: PropMap = {};
  const properties = got.data.properties ?? {};
  for (const [key, value] of Object.entries(properties)) {
    const text = propValue(value);
    if (text) props[key] = text;
  }
  return { unsubscribed: Boolean(got.data.unsubscribed), props };
}

async function ensureContact(
  resend: Resend,
  email: string,
  opts: { resubscribe: boolean; joinAudience: boolean },
): Promise<{ unsubscribed: boolean; props: PropMap }> {
  const audienceId = opts.joinAudience ? process.env.RESEND_AUDIENCE_ID : undefined;
  const existing = await resend.contacts.get({ email });
  if (existing.error || !existing.data) {
    const created = audienceId
      ? await resend.contacts.create({ email, audienceId, unsubscribed: false })
      : await resend.contacts.create({ email, unsubscribed: false });
    if (created.error) {
      const again = await resend.contacts.get({ email });
      if (again.error || !again.data) {
        throw new Error(`Could not save contact: ${created.error.message}`);
      }
    }
  } else if (audienceId) {
    await resend.contacts.create({ email, audienceId, unsubscribed: false });
  }
  if (opts.resubscribe) {
    const updated = await resend.contacts.update({
      email,
      unsubscribed: false,
      ...(audienceId ? { audienceId } : {}),
    });
    if (updated.error) {
      throw new Error(`Could not update contact: ${updated.error.message}`);
    }
  }
  return readContact(resend, email);
}

async function writeProps(
  resend: Resend,
  email: string,
  properties: Record<string, string | null>,
): Promise<void> {
  const updated = await resend.contacts.update({ email, properties });
  if (updated.error) {
    throw new Error(`Could not store sequence state: ${updated.error.message}`);
  }
}

function parseIds(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseStored(value: string | undefined): StoredId[] {
  return parseIds(value).map((part) => {
    const splitAt = part.lastIndexOf(":");
    if (splitAt === -1) return { id: part, step: "" };
    return { id: part.slice(0, splitAt), step: part.slice(splitAt + 1) };
  });
}

function formatStored(items: StoredId[]): string {
  return items.map((item) => (item.step ? `${item.id}:${item.step}` : item.id)).join(",");
}

async function cancelIds(resend: Resend, ids: string[]): Promise<void> {
  await Promise.all(
    ids.map(async (id) => {
      try {
        const result = await resend.emails.cancel(id);
        if (result.error) {
          console.error(
            "email-sequences: could not cancel scheduled email",
            result.error.message,
          );
        }
      } catch (err) {
        console.error(
          "email-sequences: cancel threw",
          err instanceof Error ? err.message : "unknown error",
        );
      }
    }),
  );
}

async function sendMessage(
  resend: Resend,
  email: string,
  message: SequenceMessage,
  delayMs: number,
  scopeId: string,
): Promise<string> {
  const scheduledAt =
    delayMs > 0 ? new Date(Date.now() + delayMs).toISOString() : undefined;
  const unsubscribeUrl = unsubscribeUrlFor(email);
  const result = await resend.emails.send(
    {
      from: WNSG_FROM,
      to: email,
      replyTo: "henry@chefhealthyhenry.com",
      subject: message.subject,
      html: message.html,
      text: message.text,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      ...(scheduledAt ? { scheduledAt } : {}),
    },
    { idempotencyKey: idempotencyKey(scopeId, message.step) },
  );
  if (result.error || !result.data?.id) {
    throw new Error(result.error?.message ?? "Resend did not return an email id");
  }
  return result.data.id;
}

async function sendAll(
  resend: Resend,
  email: string,
  messages: SequenceMessage[],
  scopeId: string,
  delayFor: (message: SequenceMessage) => number,
): Promise<StoredId[]> {
  const sent: StoredId[] = [];
  const errors: string[] = [];
  for (const message of messages) {
    try {
      const id = await sendMessage(
        resend,
        email,
        message,
        delayFor(message),
        scopeId,
      );
      sent.push({ id, step: message.step });
    } catch (err) {
      errors.push(
        `${message.step}: ${err instanceof Error ? err.message : "send failed"}`,
      );
    }
  }
  if (errors.length > 0) {
    const error = new Error(errors.join("; "));
    (error as Error & { sent?: StoredId[] }).sent = sent;
    throw error;
  }
  return sent;
}

async function stopSampleAndRecovery(
  resend: Resend,
  email: string,
  props: PropMap,
): Promise<void> {
  const ids = [
    ...parseIds(props[PROP.sampleIds]),
    ...parseStored(props[PROP.recoveryIds]).map((item) => item.id),
  ];
  await cancelIds(resend, ids);
  await writeProps(resend, email, {
    [PROP.sampleIds]: null,
    [PROP.sampleState]: "bought",
    [PROP.recoveryIds]: null,
    [PROP.recoverySession]: null,
  });
}

/**
 * Start the sampler sequence after someone asks for
 * 3 Meals for When Nothing Sounds Good.
 */
export async function startSampleSequence(input: {
  email: string;
  name?: string | null;
  signupId: string;
  samplerUrl: string;
  guideUrl: string;
}): Promise<void> {
  const email = requireEmail(input.email);
  const signupId = requireId(input.signupId, "signupId");
  const samplerUrl = absoluteUrl(input.samplerUrl, "samplerUrl");
  const guideUrl = absoluteUrl(input.guideUrl, "guideUrl");
  const resend = resendClient();
  await ensureProperties(resend);
  const contact = await ensureContact(resend, email, {
    resubscribe: true,
    joinAudience: true,
  });
  if (contact.props[PROP.sampleState] === "bought") return;
  const existing = parseIds(contact.props[PROP.sampleIds]);
  if (
    contact.props[PROP.sampleState] === "active" &&
    existing.length >= SAMPLE_STEPS
  ) {
    return;
  }

  const messages = renderSampleSequence({
    name: input.name ?? null,
    samplerUrl,
    guideUrl,
    unsubscribeUrl: unsubscribeUrlFor(email),
  });
  let sent: StoredId[] = [];
  try {
    sent = await sendAll(resend, email, messages, signupId, (message) => message.delayMs);
  } catch (err) {
    const partial = (err as Error & { sent?: StoredId[] }).sent ?? [];
    if (partial.length > 0) {
      await writeProps(resend, email, {
        [PROP.sampleIds]: partial.map((item) => item.id).join(","),
        [PROP.sampleState]: "active",
        [PROP.sampleSignup]: signupId,
      });
    }
    throw err;
  }
  await writeProps(resend, email, {
    [PROP.sampleIds]: sent.map((item) => item.id).join(","),
    [PROP.sampleState]: "active",
    [PROP.sampleSignup]: signupId,
  });
}

/**
 * Buyer sequence. The download email was already sent by checkout.
 * This does not send another one.
 */
export async function startBuyerSequence(input: {
  email: string;
  name: string | null;
  sessionId: string;
  downloadUrl: string;
}): Promise<void> {
  const email = requireEmail(input.email);
  const sessionId = requireId(input.sessionId, "sessionId");
  const downloadUrl = absoluteUrl(input.downloadUrl, "downloadUrl");
  const resend = resendClient();
  await ensureProperties(resend);
  const contact = await ensureContact(resend, email, {
    resubscribe: false,
    joinAudience: false,
  });
  await stopSampleAndRecovery(resend, email, contact.props);
  if (contact.unsubscribed) return;

  const already = parseStored(contact.props[PROP.buyerIds]);
  if (
    contact.props[PROP.buyerSession] === sessionId &&
    already.length >= BUYER_STEPS
  ) {
    return;
  }
  if (
    contact.props[PROP.buyerState] === "active" &&
    contact.props[PROP.buyerSession] &&
    contact.props[PROP.buyerSession] !== sessionId
  ) {
    return;
  }

  const messages = renderBuyerSequence({
    name: input.name,
    downloadUrl,
    membershipUrl: absoluteUrl("/membership", "membership"),
    deluxeUrl: absoluteUrl("/cookbook", "cookbook"),
    replyUrl: "mailto:henry@chefhealthyhenry.com?subject=What%20I%20need%20next",
    unsubscribeUrl: unsubscribeUrlFor(email),
    mentionFoundingPrice: MENTION_FOUNDING_PRICE,
  });
  let sent: StoredId[] = [];
  try {
    sent = await sendAll(
      resend,
      email,
      messages,
      sessionId,
      (message) => message.delayMs,
    );
  } catch (err) {
    const partial = (err as Error & { sent?: StoredId[] }).sent ?? [];
    if (partial.length > 0) {
      await writeProps(resend, email, {
        [PROP.buyerIds]: formatStored(partial),
        [PROP.buyerState]: "active",
        [PROP.buyerSession]: sessionId,
      });
    }
    throw err;
  }
  await writeProps(resend, email, {
    [PROP.buyerIds]: formatStored(sent),
    [PROP.buyerState]: "active",
    [PROP.buyerSession]: sessionId,
  });
}

/**
 * Checkout reminders. See CHECKOUT_RECOVERY_SCHEDULE for when they send.
 * Does not schedule the 1-hour note.
 */
export async function startCheckoutRecovery(input: {
  email: string;
  name: string | null;
  sessionId: string;
  checkoutUrl: string;
}): Promise<void> {
  const email = requireEmail(input.email);
  const sessionId = requireId(input.sessionId, "sessionId");
  const checkoutUrl = absoluteUrl(input.checkoutUrl, "checkoutUrl");
  const resend = resendClient();
  await ensureProperties(resend);
  const contact = await ensureContact(resend, email, {
    resubscribe: false,
    joinAudience: false,
  });
  if (contact.unsubscribed) return;
  if (contact.props[PROP.buyerState] === "active") return;
  if (contact.props[PROP.sampleState] === "bought") return;

  const expected = CHECKOUT_RECOVERY_SCHEDULE.length;
  const existing = parseStored(contact.props[PROP.recoveryIds]);
  if (
    contact.props[PROP.recoverySession] === sessionId &&
    existing.length >= expected
  ) {
    return;
  }
  if (
    contact.props[PROP.recoverySession] &&
    contact.props[PROP.recoverySession] !== sessionId &&
    existing.length > 0
  ) {
    await cancelIds(
      resend,
      existing.map((item) => item.id),
    );
  }

  const hasSampler =
    contact.props[PROP.sampleState] === "active" ||
    contact.props[PROP.sampleState] === "bought";
  const landing = absoluteUrl(WNSG_LANDING_PATH, "landing");
  const recoveryInput = {
    name: input.name,
    checkoutUrl,
    insideUrl: landing,
    samplerUrl: landing,
    unsubscribeUrl: unsubscribeUrlFor(email),
    hasSampler,
    previewImageUrl: GUIDE_PREVIEW_IMAGE_URL,
  };
  const messages = CHECKOUT_RECOVERY_SCHEDULE.map((item) => {
    const message = renderRecoveryMessage(item.step, recoveryInput);
    return { ...message, delayMs: item.delayMs };
  });

  let sent: StoredId[] = [];
  try {
    sent = await sendAll(
      resend,
      email,
      messages,
      sessionId,
      (message) => message.delayMs,
    );
  } catch (err) {
    const partial = (err as Error & { sent?: StoredId[] }).sent ?? [];
    if (partial.length > 0) {
      await writeProps(resend, email, {
        [PROP.recoveryIds]: formatStored(partial),
        [PROP.recoverySession]: sessionId,
      });
    }
    throw err;
  }
  await writeProps(resend, email, {
    [PROP.recoveryIds]: formatStored(sent),
    [PROP.recoverySession]: sessionId,
  });
}

/** Cancel the Kitchen pitch. Other buyer notes stay scheduled. */
export async function stopMembershipPitches(emailInput: string): Promise<void> {
  const email = requireEmail(emailInput);
  const resend = resendClient();
  await ensureProperties(resend);
  await ensureContact(resend, email, { resubscribe: false, joinAudience: false });
  const contact = await readContact(resend, email);
  const stored = parseStored(contact.props[PROP.buyerIds]);
  const pitches = stored.filter((item) => item.step === "buyer-d5");
  if (pitches.length === 0) return;
  await cancelIds(
    resend,
    pitches.map((item) => item.id),
  );
  const kept = stored.filter((item) => item.step !== "buyer-d5");
  await writeProps(resend, email, {
    [PROP.buyerIds]: kept.length > 0 ? formatStored(kept) : null,
  });
}

/** Stop sample, recovery, and buyer marketing mail for this address. */
export async function unsubscribeMarketingEmails(emailInput: string): Promise<void> {
  const email = requireEmail(emailInput);
  const resend = resendClient();
  await ensureProperties(resend);
  await ensureContact(resend, email, { resubscribe: false, joinAudience: false });
  const contact = await readContact(resend, email);
  const ids = [
    ...parseIds(contact.props[PROP.sampleIds]),
    ...parseStored(contact.props[PROP.recoveryIds]).map((item) => item.id),
    ...parseStored(contact.props[PROP.buyerIds]).map((item) => item.id),
  ];
  await cancelIds(resend, ids);
  const updated = await resend.contacts.update({
    email,
    unsubscribed: true,
    properties: {
      [PROP.sampleIds]: null,
      [PROP.sampleState]: "unsubscribed",
      [PROP.recoveryIds]: null,
      [PROP.recoverySession]: null,
      [PROP.buyerIds]: null,
      [PROP.buyerState]: "unsubscribed",
    },
  });
  if (updated.error) {
    throw new Error(`Could not unsubscribe contact: ${updated.error.message}`);
  }
}

/** Used by the reading-copy script. Not part of the send API. */
export function previewMessages(): { file: string; note: string; html: string; subject: string }[] {
  const unsubscribeUrl = "https://chefhealthyhenry.com/api/email/unsubscribe";
  const landing = "https://chefhealthyhenry.com/when-nothing-sounds-good";
  const samples = renderSampleSequence({
    name: "Maya",
    samplerUrl: landing,
    guideUrl: landing,
    unsubscribeUrl,
  });
  const buyers = renderBuyerSequence({
    name: "Maya",
    downloadUrl: "https://chefhealthyhenry.com/api/download?token=example",
    membershipUrl: "https://chefhealthyhenry.com/membership",
    deluxeUrl: "https://chefhealthyhenry.com/cookbook",
    replyUrl: "mailto:henry@chefhealthyhenry.com?subject=What%20I%20need%20next",
    unsubscribeUrl,
    mentionFoundingPrice: false,
  });
  const buyersFounding = renderBuyerSequence({
    name: "Maya",
    downloadUrl: "https://chefhealthyhenry.com/api/download?token=example",
    membershipUrl: "https://chefhealthyhenry.com/membership",
    deluxeUrl: "https://chefhealthyhenry.com/cookbook",
    replyUrl: "mailto:henry@chefhealthyhenry.com?subject=What%20I%20need%20next",
    unsubscribeUrl,
    mentionFoundingPrice: true,
  });
  const recoveryBase = {
    name: "Maya" as string | null,
    checkoutUrl: "https://chefhealthyhenry.com/checkout/when-nothing-sounds-good",
    insideUrl: landing,
    samplerUrl: landing,
    unsubscribeUrl,
    hasSampler: false,
    previewImageUrl: "",
  };
  const files: { file: string; note: string; message: SequenceMessage }[] = [
    ...samples.map((message) => ({
      file: `${message.step}.html`,
      note: `Sample sequence. Send ${message.delayMs / DAY_MS} day(s) after signup.`,
      message,
    })),
    ...buyers.map((message) => ({
      file: `${message.step}.html`,
      note: `Buyer sequence. Send ${message.delayMs / DAY_MS} day(s) after purchase. The download email is sent separately and is not in this sequence.`,
      message,
    })),
    {
      file: "buyer-d5-founding.html",
      note: "Buyer day 5 only if MENTION_FOUNDING_PRICE is true. That flag is false until Henry confirms the founding price.",
      message: buyersFounding.find((message) => message.step === "buyer-d5") as SequenceMessage,
    },
    {
      file: "recovery-1h.html",
      note: "Not scheduled. The 1-hour note waits until Henry decides the recovery clock. It is not in CHECKOUT_RECOVERY_SCHEDULE.",
      message: renderRecoveryMessage("one-hour", recoveryBase),
    },
    {
      file: "recovery-24h.html",
      note: "Scheduled from CHECKOUT_RECOVERY_SCHEDULE step look-inside. Default delay is 0 because the call happens when Stripe expires the session, about 24 hours after checkout starts.",
      message: renderRecoveryMessage("look-inside", recoveryBase),
    },
    {
      file: "recovery-72h.html",
      note: "Scheduled from CHECKOUT_RECOVERY_SCHEDULE step keep-free-map when the person does not already have the sampler. Default delay is 48 hours after the expiry call.",
      message: renderRecoveryMessage("keep-free-map", recoveryBase),
    },
    {
      file: "recovery-72h-has-sampler.html",
      note: "Same last note when the contact already joined the sample sequence. Offers checkout again instead of a second sampler.",
      message: renderRecoveryMessage("keep-free-map", { ...recoveryBase, hasSampler: true }),
    },
  ];
  return files.map(({ file, note, message }) => ({
    file,
    note,
    subject: message.subject,
    html: `<!-- Subject: ${message.subject} -->\n<!-- ${note} -->\n${message.html}`,
  }));
}

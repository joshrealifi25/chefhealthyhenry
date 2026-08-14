import crypto from "crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, users, sessions, memberships, type Tier } from "@/lib/db";

/**
 * Passwordless auth: members sign in via an emailed magic link.
 * - Login tokens are stateless HMAC tokens (same pattern as fulfillment.ts),
 *   valid for 15 minutes.
 * - Sessions are random 256-bit tokens stored in Postgres, kept in an
 *   httpOnly cookie for 90 days.
 */

const SESSION_COOKIE = "chh_session";
const LOGIN_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
}

function sign(data: string): string {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url");
}

/** Creates a signed, expiring magic-link token for an email address. */
export function createLoginToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ e: email.toLowerCase(), exp: Date.now() + LOGIN_TOKEN_TTL_MS })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Returns the email if the login token is valid and unexpired, else null. */
export function verifyLoginToken(token: string): string | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      e?: unknown;
      exp?: unknown;
    };
    if (typeof data.exp !== "number" || Date.now() > data.exp) return null;
    if (typeof data.e !== "string" || !data.e.includes("@")) return null;
    return data.e;
  } catch {
    return null;
  }
}

/** Creates (or finds) the user for an email and opens a session for them. */
export async function createSession(email: string): Promise<string> {
  const normalized = email.toLowerCase();
  const [existing] = await db()
    .select()
    .from(users)
    .where(eq(users.email, normalized));
  const user =
    existing ??
    (await db().insert(users).values({ email: normalized }).returning())[0];

  const sessionId = crypto.randomBytes(32).toString("base64url");
  await db().insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });
  return sessionId;
}

export async function setSessionCookie(sessionId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await db().delete(sessions).where(eq(sessions.id, sessionId));
  }
  store.delete(SESSION_COOKIE);
}

export interface Member {
  id: string;
  email: string;
  name: string | null;
  /** null = signed in but no active membership. */
  tier: Tier | null;
}

/** Returns the signed-in member, or null when there is no valid session. */
export async function getMember(): Promise<Member | null> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const [row] = await db()
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      expiresAt: sessions.expiresAt,
      tier: memberships.tier,
      status: memberships.status,
      currentPeriodEnd: memberships.currentPeriodEnd,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .leftJoin(memberships, eq(memberships.userId, users.id))
    .where(eq(sessions.id, sessionId));

  if (!row || row.expiresAt < new Date()) return null;

  // Access continues through the end of the paid period after cancellation.
  const active =
    row.tier != null &&
    (["active", "trialing", "past_due"].includes(row.status ?? "") ||
      (row.currentPeriodEnd != null && row.currentPeriodEnd > new Date()));

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    tier: active ? row.tier : null,
  };
}

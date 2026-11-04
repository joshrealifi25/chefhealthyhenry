import crypto from "crypto";

/** Long enough for the sampler-sequence buttons that reuse this link (through day 5). */
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(`wnsg-sampler.${payload}`).digest("base64url");
}

/** Signed link payload for the private sampler PDF. Not a public file URL. */
export function createSamplerDownloadToken(secret: string): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySamplerDownloadToken(token: string, secret: string): boolean {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload, secret);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      exp?: unknown;
    };
    return typeof data.exp === "number" && Date.now() <= data.exp;
  } catch {
    return false;
  }
}

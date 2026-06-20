import crypto from "crypto";

export interface DigitalProduct {
  /** Pathname of the PDF inside the private Vercel Blob store. */
  pathname: string;
  /** Display name used in the delivery email. */
  name: string;
  /** Friendly filename presented to the buyer on download. */
  fileName: string;
}

/**
 * Maps each Stripe Price ID to the digital file it delivers.
 * The physical signed softcover is intentionally omitted (it ships, no download).
 */
export const PRICE_TO_PRODUCT: Record<string, DigitalProduct> = {
  price_1TkWXiLtGtU7n5dodQYKON9X: {
    pathname: "cookbooks/protein-flip-deluxe.pdf",
    name: "The Protein Flip™ Method and Cookbook, Deluxe Edition",
    fileName: "The Protein Flip Method and Cookbook - Deluxe Edition.pdf",
  },
  price_1TkWXkLtGtU7n5do1gqGwzvb: {
    pathname: "cookbooks/glp-1-bariatric-success-guide.pdf",
    name: "GLP-1 & Bariatric Success Guide",
    fileName: "GLP-1 and Bariatric Success Guide.pdf",
  },
  price_1TkWXlLtGtU7n5dofMzsHNgd: {
    pathname: "cookbooks/spring-summer-cookbook.pdf",
    name: "Fresh & Fearless: Spring/Summer",
    fileName: "Fresh and Fearless - Spring Summer.pdf",
  },
  price_1TkWXnLtGtU7n5do6lzjHslg: {
    pathname: "cookbooks/confident-cook-fall-winter.pdf",
    name: "The Confident Cook: Fall/Winter",
    fileName: "The Confident Cook - Fall Winter.pdf",
  },
  price_1TkWXoLtGtU7n5dofDVI7fr8: {
    pathname: "cookbooks/family-flip.pdf",
    name: "The Family Flip™",
    fileName: "The Family Flip.pdf",
  },
  price_1TkWXpLtGtU7n5dofji9JppO: {
    pathname: "cookbooks/dining-out-guide.pdf",
    name: "The Protein Flip™ Dining Out Guide",
    fileName: "The Protein Flip Dining Out Guide.pdf",
  },
  price_1TkWkRLtGtU7n5doYmfrQXW7: {
    pathname: "cookbooks/protein-flip-starter-guide.pdf",
    name: "The Protein Flip™ Starter Guide",
    fileName: "The Protein Flip Starter Guide.pdf",
  },
  price_1TkWkSLtGtU7n5docHggdQc2: {
    pathname: "cookbooks/grocery-store-test.pdf",
    name: "The Protein Flip™ Grocery Store Test",
    fileName: "The Protein Flip Grocery Store Test.pdf",
  },
};

const PATHNAME_TO_FILENAME: Record<string, string> = Object.fromEntries(
  Object.values(PRICE_TO_PRODUCT).map((p) => [p.pathname, p.fileName])
);

export function fileNameFor(pathname: string): string {
  return PATHNAME_TO_FILENAME[pathname] ?? "cookbook.pdf";
}

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function sign(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

/** Creates a signed, expiring token that authorizes downloading one blob pathname. */
export function createDownloadToken(pathname: string, secret: string): string {
  const payload = Buffer.from(
    JSON.stringify({ p: pathname, exp: Date.now() + TOKEN_TTL_MS })
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

/** Returns the authorized pathname if the token is valid and unexpired, else null. */
export function verifyDownloadToken(token: string, secret: string): string | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload, secret);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      p?: unknown;
      exp?: unknown;
    };
    if (typeof data.exp !== "number" || Date.now() > data.exp) return null;
    if (typeof data.p !== "string" || !data.p.startsWith("cookbooks/")) return null;
    return data.p;
  } catch {
    return null;
  }
}

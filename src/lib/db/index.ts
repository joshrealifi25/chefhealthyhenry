import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Neon Postgres client. DATABASE_URL is provided by the Neon integration in
 * the Vercel dashboard (and .env.local for local development).
 */
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return drizzle(neon(url), { schema });
}

let cached: ReturnType<typeof createDb> | undefined;

export function db() {
  cached ??= createDb();
  return cached;
}

export * from "./schema";

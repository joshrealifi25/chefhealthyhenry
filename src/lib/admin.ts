import { getMember, type Member } from "@/lib/auth";

/**
 * Admin access is an allowlist of email addresses, not a column on the user.
 * Nobody can grant themselves admin by editing data, and losing the database
 * does not lose the answer to who is allowed in. Henry signs in with the same
 * magic link as everyone else; this only widens what he sees once he is in.
 */
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return adminEmails().includes(email.toLowerCase());
}

/**
 * The signed-in member when they are an admin, otherwise null. Returns null
 * rather than throwing so pages can render a normal 404 and not advertise
 * that an admin area exists.
 */
export async function getAdmin(): Promise<Member | null> {
  const member = await getMember();
  if (!member) return null;
  return isAdminEmail(member.email) ? member : null;
}

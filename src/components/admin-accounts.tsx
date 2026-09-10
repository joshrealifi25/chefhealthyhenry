"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TIER_NAMES } from "@/lib/membership";
import type { Tier } from "@/lib/db";

export interface AccountRow {
  id: string;
  email: string;
  name: string | null;
  joined: string;
  tier: Tier | null;
  status: string | null;
  paidThroughStripe: boolean;
  hasStripeCustomer: boolean;
  periodEnd: string | null;
  listCount: number;
  sousCount: number;
  /** Admins are managed in the env allowlist, not from this page. */
  isAdmin: boolean;
}

const TIER_OPTIONS: Tier[] = ["kitchen", "community", "chefs_table"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AdminAccounts({ accounts }: { accounts: AccountRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(
    null
  );
  const [confirming, setConfirming] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newTier, setNewTier] = useState<Tier | "">("");

  const q = query.trim().toLowerCase();
  const shown = q
    ? accounts.filter(
        (a) =>
          a.email.toLowerCase().includes(q) ||
          (a.name ?? "").toLowerCase().includes(q)
      )
    : accounts;

  async function send(
    method: "POST" | "PATCH" | "DELETE",
    body: Record<string, unknown>,
    key: string
  ) {
    setBusy(key);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/accounts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ text: data.error ?? "Something went wrong.", error: true });
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setMessage({ text: "Could not reach the server.", error: true });
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function addAccount(e: React.FormEvent) {
    e.preventDefault();
    const ok = await send(
      "POST",
      { email: newEmail, name: newName || null, tier: newTier || null },
      "new"
    );
    if (ok) {
      setMessage({
        text: newTier
          ? `${newEmail} now has ${TIER_NAMES[newTier as Tier]} access.`
          : `${newEmail} added. They can sign in with a magic link.`,
        error: false,
      });
      setNewEmail("");
      setNewName("");
      setNewTier("");
    }
  }

  async function remove(account: AccountRow) {
    const ok = await send(
      "DELETE",
      { userId: account.id, confirmEmail: typed },
      account.id
    );
    if (ok) {
      setMessage({ text: `Deleted ${account.email}.`, error: false });
      setConfirming(null);
      setTyped("");
    }
  }

  return (
    <div className="mt-10 space-y-8">
      {message && (
        <p
          role="status"
          className={`rounded-xl border p-4 text-sm ${
            message.error
              ? "border-destructive/40 bg-destructive/5 text-destructive"
              : "border-border bg-secondary"
          }`}
        >
          {message.text}
        </p>
      )}

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-semibold">Add an account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Creates the account and, with a tier chosen, comps that membership
          free of charge. Use this for reviewers, family, and giveaways. People
          who pay arrive on their own through checkout.
        </p>
        <form onSubmit={addAccount} className="mt-4 grid gap-3 sm:grid-cols-4">
          <input
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="email address"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2"
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="name (optional)"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <select
            value={newTier}
            onChange={(e) => setNewTier(e.target.value as Tier | "")}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">No membership</option>
            {TIER_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {TIER_NAMES[t]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={busy === "new"}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 sm:col-start-4"
          >
            {busy === "new" ? "Adding" : "Add account"}
          </button>
        </form>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <p className="text-sm text-muted-foreground">
          {shown.length} of {accounts.length}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="bg-secondary/60">
            <tr>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Membership</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Activity</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((a) => (
              <tr key={a.id} className="border-t border-border align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{a.name ?? "No name"}</div>
                  <div className="text-muted-foreground">{a.email}</div>
                </td>
                <td className="px-4 py-3">
                  {a.tier ? (
                    <>
                      <div>{TIER_NAMES[a.tier]}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.paidThroughStripe
                          ? `Paid, ${a.status}`
                          : "Comped, no charge"}
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(a.joined)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {a.listCount} lists, {a.sousCount} Sous
                </td>
                <td className="px-4 py-3">
                  {a.isAdmin ? (
                    <span className="text-xs text-muted-foreground">
                      Admin, set in ADMIN_EMAILS
                    </span>
                  ) : a.paidThroughStripe ? (
                    <span className="text-xs text-muted-foreground">
                      Managed in Stripe
                    </span>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={a.tier ?? ""}
                        disabled={busy === a.id}
                        onChange={(e) =>
                          send(
                            "PATCH",
                            {
                              userId: a.id,
                              tier: e.target.value === "" ? null : e.target.value,
                            },
                            a.id
                          )
                        }
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                      >
                        <option value="">No membership</option>
                        {TIER_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {TIER_NAMES[t]}
                          </option>
                        ))}
                      </select>
                      {confirming === a.id ? (
                        <span className="flex flex-wrap items-center gap-2">
                          <input
                            type="text"
                            value={typed}
                            onChange={(e) => setTyped(e.target.value)}
                            placeholder="type the email to confirm"
                            className="rounded-lg border border-destructive/50 bg-background px-2 py-1 text-xs"
                          />
                          <button
                            type="button"
                            disabled={busy === a.id || typed.trim() === ""}
                            onClick={() => remove(a)}
                            className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-white disabled:opacity-40"
                          >
                            Delete for good
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirming(null);
                              setTyped("");
                            }}
                            className="text-xs text-muted-foreground underline underline-offset-4"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setConfirming(a.id);
                            setTyped("");
                            setMessage(null);
                          }}
                          className="text-xs text-destructive underline underline-offset-4"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No accounts match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

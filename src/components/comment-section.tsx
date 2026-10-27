"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

export function CommentSection({
  postSlug,
  defaultName = "",
  defaultEmail = "",
}: {
  postSlug: string;
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const loadComments = useCallback(async () => {
    const res = await fetch(`/api/comments?post=${postSlug}`);
    if (res.ok) setComments(await res.json());
  }, [postSlug]);

  useEffect(() => { loadComments(); }, [loadComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postSlug, name, email, comment }),
    });
    if (res.ok) {
      setStatus("success");
      setComment("");
    } else {
      setStatus("error");
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="font-heading text-2xl font-semibold">Comments</h2>

      {comments.length > 0 ? (
        <ul className="mt-8 space-y-8">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts.</p>
      )}

      <div className="mt-12">
        <h3 className="font-heading text-lg font-semibold">Leave a comment</h3>

        {status === "success" ? (
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 px-6 py-5">
            <p className="text-sm font-medium text-primary">Thank you for your comment.</p>
            <p className="mt-1 text-sm text-muted-foreground">It will appear here once reviewed. Chef Henry reads every one.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="comment-name" className="mb-1.5 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="comment-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label htmlFor="comment-email" className="mb-1.5 block text-sm font-medium">
                  Email <span className="text-muted-foreground">(not published)</span>
                </label>
                <input
                  id="comment-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <div>
              <label htmlFor="comment-body" className="mb-1.5 block text-sm font-medium">
                Comment
              </label>
              <textarea
                id="comment-body"
                required
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            {status === "error" && (
              <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
            )}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting..." : "Post comment"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Adapt a recipe to my pantry",
  "Make tonight's dinner higher protein",
  "What's a good swap for heavy cream?",
];

/** Renders assistant text, turning markdown links into real links. */
function AssistantText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m && (m[2].startsWith("/") || m[2].startsWith("https://"))) {
          return (
            <a
              key={i}
              href={m[2]}
              className="font-medium text-primary underline underline-offset-2"
            >
              {m[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function SousChat({ capNote }: { capNote: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setError(null);
    setBusy(true);
    setInput("");
    const history = [...messages, { role: "user" as const, content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/sous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setMessages(history);
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: reply }]);
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      }
    } catch {
      setMessages(history);
      setError("Connection lost. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        ref={scrollRef}
        className="mt-4 flex max-h-96 flex-col gap-3 overflow-y-auto"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <p className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm">
            Hi, I&apos;m Sous. Ask me about ingredients, swaps, or any of Chef
            Henry&apos;s recipes, or tell me what&apos;s in your fridge and
            we&apos;ll figure out dinner.
          </p>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <p
              key={i}
              className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground"
            >
              {m.content}
            </p>
          ) : (
            <p
              key={i}
              className="max-w-[85%] self-start whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm"
            >
              {m.content ? (
                <AssistantText text={m.content} />
              ) : (
                <span className="text-muted-foreground">Thinking...</span>
              )}
            </p>
          )
        )}
      </div>

      {messages.length === 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Sous anything about cooking..."
          aria-label="Ask Sous"
          className="flex-1 rounded-full border border-input bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          Ask
        </button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">{capNote}</p>
    </div>
  );
}

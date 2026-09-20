/**
 * Temporary browser-only store for the last Sous exchange. Isolated here so
 * we can swap it for server-side history later without touching the chat UI.
 */
export const SOUS_CONVERSATION_KEY = "sous_last_conversation";

export interface SousLastConversation {
  question: string;
  answer: string;
  timestamp: number;
}

function isConversation(value: unknown): value is SousLastConversation {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.question === "string" &&
    typeof v.answer === "string" &&
    v.question.trim().length > 0 &&
    v.answer.trim().length > 0 &&
    typeof v.timestamp === "number"
  );
}

export function readSousConversation(): SousLastConversation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SOUS_CONVERSATION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isConversation(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSousConversation(
  conversation: SousLastConversation
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SOUS_CONVERSATION_KEY,
      JSON.stringify(conversation)
    );
  } catch {
    // Private browsing or blocked storage: the chat still works this session.
  }
}

/** Visible words of a [label](href) mark, with the link syntax removed. */
export function stripInlineLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/** True when the line already contains a markdown link.
 * The ingredient list then skips the separate Shop control, which would
 * otherwise open the Just Better discount page. */
export function hasInlineLink(text: string): boolean {
  return /\[[^\]]+\]\([^)]+\)/.test(text);
}

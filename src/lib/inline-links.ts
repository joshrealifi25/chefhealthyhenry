/** Visible words of a [label](href) mark, with the link syntax removed. */
export function stripInlineLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/** True when the line already links to a page on this site. */
export function hasInternalLink(text: string): boolean {
  return /\[[^\]]+\]\(\/[^)]+\)/.test(text);
}

// Shared rich-text block shape for long-form content (blog posts, Explore
// articles). A block is one paragraph, heading, list, quote, or image.
export interface ContentBlock {
  type: "paragraph" | "heading" | "list" | "quote" | "image";
  html?: string;
  text?: string;
  level?: number;
  ordered?: boolean;
  items?: string[];
  src?: string;
}

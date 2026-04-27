// Markdown rendering helper. Uses `marked` with GFM + soft-break-as-newline
// so chat replies and markdown bubbles render with the formatting they were
// authored in. Output is HTML; consumers inject via dangerouslySetInnerHTML
// inside a `.markdown-body` container that scopes the rendered styles.
//
// XSS scope: this is a single-user demo with the user's own Anthropic key.
// Not sanitizing for now — if multi-user lands, add DOMPurify here.

import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdown(text: string): string {
  return marked.parse(text) as string;
}

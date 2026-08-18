// Shared HTML → block decomposer for the module exporters.
//
// `first_layer_html` / `answer_html` are constrained, machine-generated HTML:
// top-level <p>, <ul>/<ol>, <table>, <div class="cm-callout">, and
// <p class="cm-fl-caption">, with inline <strong>/<em>/<code> that all
// exporters flatten. Extracted from generateDocx.ts so generateInterfacePptx
// can reuse the same decomposition (DOCX renders blocks as paragraphs; the
// interface PPTX renders them as text boxes / tables / callout shapes).
//
// Two parse paths with identical block output for this constrained HTML:
//  - DOM path (browser) — the original generateDocx implementation.
//  - scanner path (no `document`, e.g. Node-side generation for testing) —
//    a depth-counting top-level element scanner. Not a general HTML parser;
//    only sound for the well-formed element vocabulary above.

import { stripRefMarkers } from './refMarkers';

export interface HtmlBlock {
  kind: 'prose' | 'caption' | 'callout' | 'bullet' | 'tableRow';
  // Flattened text. For tableRow this is the pipe-joined cells (DOCX shape);
  // bullets carry NO '• ' prefix — presentation is the renderer's job.
  text: string;
  // tableRow only: the individual cell texts, for renderers that build real
  // table rows (interface PPTX) instead of pipe-joined paragraphs (DOCX).
  cells?: string[];
}

export function htmlToPlain(html: string): string {
  return stripRefMarkers(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' '),
  ).trim();
}

export function htmlToBlocks(html: string): HtmlBlock[] {
  return typeof document === 'undefined' ? scanBlocks(html) : domBlocks(html);
}

// ─── DOM path (browser) ─────────────────────────────────────────────────

function domBlocks(html: string): HtmlBlock[] {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const blocks: HtmlBlock[] = [];
  for (const el of Array.from(tmp.children) as HTMLElement[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'p' && el.classList.contains('cm-fl-caption')) {
      blocks.push({ kind: 'caption', text: htmlToPlain(el.innerHTML) });
    } else if (tag === 'div' && el.classList.contains('cm-callout')) {
      blocks.push({ kind: 'callout', text: htmlToPlain(el.innerHTML) });
    } else if (tag === 'ul' || tag === 'ol') {
      for (const li of Array.from(el.querySelectorAll('li')) as HTMLElement[]) {
        blocks.push({ kind: 'bullet', text: htmlToPlain(li.innerHTML) });
      }
    } else if (tag === 'table') {
      for (const row of Array.from(el.querySelectorAll('tr')) as HTMLElement[]) {
        const cells = (Array.from(row.querySelectorAll('th, td')) as HTMLElement[]).map((c) => htmlToPlain(c.innerHTML));
        blocks.push({ kind: 'tableRow', text: cells.join(' | '), cells });
      }
    } else {
      const text = htmlToPlain(el.innerHTML);
      if (text) blocks.push({ kind: 'prose', text });
    }
  }
  return blocks;
}

// ─── Scanner path (no DOM) ──────────────────────────────────────────────

const TOP_LEVEL_RE = /<(p|ul|ol|table|div|h[1-6]|blockquote)\b([^>]*)>/gi;

function scanBlocks(html: string): HtmlBlock[] {
  const blocks: HtmlBlock[] = [];
  let i = 0;
  for (;;) {
    TOP_LEVEL_RE.lastIndex = i;
    const m = TOP_LEVEL_RE.exec(html);
    if (!m) {
      pushProse(blocks, html.slice(i));
      break;
    }
    if (m.index > i) pushProse(blocks, html.slice(i, m.index));
    const tag = m[1].toLowerCase();
    const attrs = m[2] ?? '';
    const [inner, next] = takeElement(html, tag, m.index + m[0].length);
    i = next;

    if (tag === 'p' && /class\s*=\s*["'][^"']*cm-fl-caption/.test(attrs)) {
      blocks.push({ kind: 'caption', text: htmlToPlain(inner) });
    } else if (tag === 'div' && /class\s*=\s*["'][^"']*cm-callout/.test(attrs)) {
      blocks.push({ kind: 'callout', text: htmlToPlain(inner) });
    } else if (tag === 'ul' || tag === 'ol') {
      for (const li of inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) {
        blocks.push({ kind: 'bullet', text: htmlToPlain(li[1]) });
      }
    } else if (tag === 'table') {
      for (const tr of inner.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
        const cells = Array.from(tr[1].matchAll(/<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)).map((c) => htmlToPlain(c[1]));
        blocks.push({ kind: 'tableRow', text: cells.join(' | '), cells });
      }
    } else {
      pushProse(blocks, inner);
    }
  }
  return blocks;
}

// Returns [innerHtml, indexAfterCloseTag], counting nested same-tag opens.
function takeElement(html: string, tag: string, from: number): [string, number] {
  const re = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, 'gi');
  re.lastIndex = from;
  let depth = 1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    depth += m[0][1] === '/' ? -1 : 1;
    if (depth === 0) return [html.slice(from, m.index), m.index + m[0].length];
  }
  return [html.slice(from), html.length]; // unclosed — take the rest
}

function pushProse(blocks: HtmlBlock[], fragment: string): void {
  const text = htmlToPlain(fragment);
  if (text) blocks.push({ kind: 'prose', text });
}

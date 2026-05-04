// Reference-marker helpers for clinical-module v1.1.0 schema.
//
// Modules at schema_version 1.1.0 carry a top-level `references[]` array of
// { ref_id, citation, url } and inline `[ref:X]` markers in answer_html,
// context_strip.text, and footer_note. This module owns the bidirectional
// translation between marker text and rendered output:
//
//  - expandRefMarkers(html, module)  → marker substring → numbered <sup> link
//  - getCitedReferences(module)      → citations actually referenced, in
//                                       first-appearance order, numbered to
//                                       match the superscripts.
//  - stripRefMarkers(text)           → removes markers from plain text (used
//                                       in DOCX/PPTX export to keep markers
//                                       from leaking into Word/PowerPoint).
//  - normalizeReferences(refs)       → collapses string|ModuleReference to
//                                       a uniform ModuleReference[] for
//                                       legacy-shape compatibility.
//
// The numbering is per-module and per-render-call; we assign 1..N in the order
// the helper is asked about each unique ref_id. The shared assigner is built
// by getRefNumberer() so that an HTML expansion pass and the references-list
// pass agree on which ref got which number.

import type { ModuleData, ModuleReference } from '../types';

const MARKER_RE = /\[ref:([a-z0-9-]+)\]/gi;

export function stripRefMarkers(text: string): string {
  return text.replace(MARKER_RE, '');
}

export function normalizeReferences(refs: ModuleData['references']): ModuleReference[] {
  if (!refs) return [];
  return refs.map((r, i) =>
    typeof r === 'string'
      ? { ref_id: `ref-${i + 1}`, citation: r }
      : r,
  );
}

interface RefNumberer {
  numberFor: (refId: string) => number | null;
  cited: () => Array<{ number: number; ref: ModuleReference }>;
}

// Builds a stateful numberer that assigns sequential numbers as ref_ids are
// encountered for the first time. Returns null for ref_ids not declared in
// the module (so callers can decide whether to render a placeholder or skip).
function makeRefNumberer(refs: ModuleReference[]): RefNumberer {
  const byId = new Map(refs.map((r) => [r.ref_id, r]));
  const order: Array<{ number: number; ref: ModuleReference }> = [];
  const seen = new Map<string, number>();

  return {
    numberFor(refId: string): number | null {
      const ref = byId.get(refId);
      if (!ref) return null;
      const cached = seen.get(refId);
      if (cached) return cached;
      const n = order.length + 1;
      seen.set(refId, n);
      order.push({ number: n, ref });
      return n;
    },
    cited(): Array<{ number: number; ref: ModuleReference }> {
      return order;
    },
  };
}

// Pre-computes numbering by walking every cite-bearing field of the module in
// a stable order (faqs in declaration order, then context_strip, then
// footer_note). Returned numberer is "primed" so the FAQ bubble — which only
// renders one FAQ at a time — still gets the same number for ref X that the
// PrintView would.
export function getModuleRefNumberer(module: ModuleData): RefNumberer {
  const refs = normalizeReferences(module.references);
  const numberer = makeRefNumberer(refs);
  for (const faq of module.faqs) {
    for (const qa of faq.items) {
      let m: RegExpExecArray | null;
      MARKER_RE.lastIndex = 0;
      while ((m = MARKER_RE.exec(qa.answer_html)) !== null) {
        numberer.numberFor(m[1]);
      }
    }
  }
  if (module.context_strip) {
    let m: RegExpExecArray | null;
    MARKER_RE.lastIndex = 0;
    while ((m = MARKER_RE.exec(module.context_strip.text)) !== null) {
      numberer.numberFor(m[1]);
    }
  }
  if (module.footer_note) {
    let m: RegExpExecArray | null;
    MARKER_RE.lastIndex = 0;
    while ((m = MARKER_RE.exec(module.footer_note)) !== null) {
      numberer.numberFor(m[1]);
    }
  }
  return numberer;
}

// Replace every `[ref:X]` in `html` with a superscript anchor linking to
// `#ref-{ref_id}`. Markers whose ref_id isn't declared in the module fall
// back to rendering as a small grey `[ref:X]` token so the loss is visible
// rather than silent.
export function expandRefMarkers(html: string, module: ModuleData, numberer?: RefNumberer): string {
  const n = numberer ?? getModuleRefNumberer(module);
  return html.replace(MARKER_RE, (_match, refId: string) => {
    const num = n.numberFor(refId);
    if (num === null) {
      return `<span class="ref-marker ref-marker--missing" title="Reference ${refId} not declared">[ref:${refId}]</span>`;
    }
    return `<sup class="ref-marker"><a href="#ref-${refId}" data-ref="${refId}">[${num}]</a></sup>`;
  });
}

// Returns just the cited refs (in numbering order) — what the FAQ panel and
// the print view should render as a numbered list.
export function getCitedReferences(module: ModuleData, numberer?: RefNumberer): Array<{ number: number; ref: ModuleReference }> {
  const n = numberer ?? getModuleRefNumberer(module);
  return n.cited();
}

// Returns the cited refs that appear in just the supplied HTML fragment(s),
// numbered against the module's full numbering. Used by the FAQ bubble to
// show only the citations relevant to the focused FAQ rather than the full
// module list.
export function getReferencesUsedIn(htmlFragments: string[], module: ModuleData, numberer?: RefNumberer): Array<{ number: number; ref: ModuleReference }> {
  const n = numberer ?? getModuleRefNumberer(module);
  const seen = new Set<string>();
  const out: Array<{ number: number; ref: ModuleReference }> = [];
  for (const html of htmlFragments) {
    let m: RegExpExecArray | null;
    MARKER_RE.lastIndex = 0;
    while ((m = MARKER_RE.exec(html)) !== null) {
      const refId = m[1];
      if (seen.has(refId)) continue;
      const num = n.numberFor(refId);
      if (num === null) continue;
      const refs = normalizeReferences(module.references);
      const ref = refs.find((r) => r.ref_id === refId);
      if (!ref) continue;
      seen.add(refId);
      out.push({ number: num, ref });
    }
  }
  return out.sort((a, b) => a.number - b.number);
}

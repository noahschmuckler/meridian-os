// Citation block builder used by the "Cite this decision" popover (Track 3).
//
// Given a Selection range that lives inside a rendered FAQ / module surface,
// extract the supporting citations and return:
//   { decision: <selected text>, citations: [{ number, ref }, ...] }
//
// The walk relies on the markup that `expandRefMarkers` produces:
//   <sup class="ref-marker"><a href="#ref-X" data-ref="X">[N]</a></sup>
//
// `range.cloneContents()` preserves these anchors (with their data-ref
// attribute) for any partial-or-whole sup that the selection touches, so
// `querySelectorAll('[data-ref]')` on the cloned fragment yields exactly the
// refs that appear inside the selection in document order. Each ref is run
// through the module's canonical numberer (`getModuleRefNumberer`) so the
// number we surface in the popover matches the superscript number the user
// just selected on the page.
//
// Empty result is the explicit "no supporting citations identified" case —
// caller decides how to render it.

import type { ModuleData, ModuleReference } from '../types';
import { getModuleRefNumberer, normalizeReferences } from './refMarkers';

export interface CitationEntry {
  number: number;
  ref: ModuleReference;
}

export interface CitationResult {
  decision: string;
  citations: CitationEntry[];
}

export function extractCitations(range: Range, module: ModuleData | null): CitationResult {
  const decision = range.toString().trim();
  if (!module) return { decision, citations: [] };

  const fragment = range.cloneContents();
  const anchors = fragment.querySelectorAll('[data-ref]');
  if (anchors.length === 0) return { decision, citations: [] };

  const numberer = getModuleRefNumberer(module);
  const refs = normalizeReferences(module.references);
  const seen = new Set<string>();
  const out: CitationEntry[] = [];
  for (const a of Array.from(anchors)) {
    const refId = (a as HTMLElement).dataset.ref ?? '';
    if (!refId || seen.has(refId)) continue;
    seen.add(refId);
    const number = numberer.numberFor(refId);
    if (number === null) continue;
    const ref = refs.find((r) => r.ref_id === refId);
    if (!ref) continue;
    out.push({ number, ref });
  }
  return { decision, citations: out.sort((a, b) => a.number - b.number) };
}

export function formatCitationPlain(result: CitationResult): string {
  const { decision, citations } = result;
  const lines: string[] = [`Decision: ${decision}`];
  if (citations.length > 0) {
    lines.push('', 'Supported by:');
    for (const { number, ref } of citations) {
      const url = ref.url ? ` ${ref.url}` : '';
      lines.push(`[${number}] ${ref.citation}${url}`);
    }
  }
  return lines.join('\n');
}

export function formatCitationMarkdown(result: CitationResult): string {
  const { decision, citations } = result;
  const lines: string[] = [`**Decision:** ${decision}`];
  if (citations.length > 0) {
    lines.push('', '**Supported by:**');
    for (const { number, ref } of citations) {
      const link = ref.url ? ` ([link](${ref.url}))` : '';
      lines.push(`${number}. ${ref.citation}${link}`);
    }
  }
  return lines.join('\n');
}

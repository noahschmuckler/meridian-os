// Consult-mention decorator (Track 4b). Wraps "{specialty} consult" /
// "consult to {specialty}" mentions in rendered HTML with a clickable
// anchor that spawns the consult-builder bubble focused on the matching
// `consults[].consult_id`.
//
// Mirrors src/lib/glossary.ts in shape — TreeWalker over text nodes,
// SKIP_TAGS / SKIP_CLASSES so we don't decorate inside citations,
// glossary spans, anchors, or code. Combined regex over all specialties
// declared in the active module's `consults[]`. Specialties default to
// `path.label.toLowerCase()` minus a trailing " consult" if `path.specialty`
// isn't set explicitly.
//
// Match patterns per specialty:
//   "{Specialty} consult"
//   "{Specialty} consultation"
//   "consult to {specialty}"
//   "consultation to {specialty}"
// Case-insensitive matching on the specialty word; "consult" itself is
// also case-insensitive so "Consult to psychiatry" matches.

import type { ConsultPath } from '../types';

const SKIP_TAGS = new Set([
  'A', 'CODE', 'PRE', 'SCRIPT', 'STYLE', 'SUP', 'SUB',
  'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'KBD',
]);

const SKIP_CLASSES = new Set([
  'glossary-term', 'ref-marker', 'consult-link',
]);

interface CompiledMatcher {
  re: RegExp;
  byMatch: Map<string, ConsultPath>;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function specialtyOf(path: ConsultPath): string {
  if (path.specialty) return path.specialty;
  let s = path.label.toLowerCase().trim();
  s = s.replace(/\s+consult(ation)?$/, '');
  return s;
}

function compileMatcher(consults: ConsultPath[]): CompiledMatcher | null {
  if (consults.length === 0) return null;
  const byMatch = new Map<string, ConsultPath>();
  const tokens: string[] = [];
  for (const path of consults) {
    const sp = specialtyOf(path);
    if (!sp) continue;
    const escaped = escapeRegex(sp);
    // "{specialty} consult(ation)?"
    tokens.push(`${escaped}\\s+consult(?:ation)?`);
    // "consult(ation)? to {specialty}"
    tokens.push(`consult(?:ation)?\\s+to\\s+${escaped}`);
    byMatch.set(sp.toLowerCase(), path);
  }
  if (tokens.length === 0) return null;
  // Sort by length descending so multi-word specialties win first.
  tokens.sort((a, b) => b.length - a.length);
  const re = new RegExp(`\\b(?:${tokens.join('|')})\\b`, 'gi');
  return { re, byMatch };
}

function matchToConsult(matched: string, byMatch: Map<string, ConsultPath>): ConsultPath | null {
  const lc = matched.toLowerCase();
  // Most candidates: longest specialty key contained in the matched string.
  let best: ConsultPath | null = null;
  let bestLen = 0;
  for (const [key, path] of byMatch) {
    if (lc.includes(key) && key.length > bestLen) {
      best = path;
      bestLen = key.length;
    }
  }
  return best;
}

function decorateRoot(root: Element, matcher: CompiledMatcher): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Node): number {
      let p: HTMLElement | null = node.parentElement;
      while (p && p !== root) {
        if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        for (const cls of SKIP_CLASSES) {
          if (p.classList.contains(cls)) return NodeFilter.FILTER_REJECT;
        }
        p = p.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const targets: Text[] = [];
  let n: Node | null = walker.nextNode();
  while (n) {
    targets.push(n as Text);
    n = walker.nextNode();
  }

  const { re, byMatch } = matcher;
  for (const node of targets) {
    const text = node.nodeValue ?? '';
    if (!text) continue;
    re.lastIndex = 0;
    if (!re.test(text)) continue;

    re.lastIndex = 0;
    let last = 0;
    const frag = document.createDocumentFragment();
    let touched = false;
    let m: RegExpExecArray | null = re.exec(text);
    while (m !== null) {
      const matched = m[0];
      const path = matchToConsult(matched, byMatch);
      if (!path) {
        m = re.exec(text);
        continue;
      }
      if (m.index > last) {
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      }
      const span = document.createElement('span');
      span.className = 'consult-link';
      span.dataset.consult = path.consult_id;
      span.setAttribute('role', 'button');
      span.setAttribute('tabindex', '0');
      span.title = `Open ${path.label}`;
      span.textContent = matched;
      frag.appendChild(span);
      last = m.index + matched.length;
      touched = true;
      m = re.exec(text);
    }
    if (!touched) continue;
    if (last < text.length) {
      frag.appendChild(document.createTextNode(text.slice(last)));
    }
    node.parentNode?.replaceChild(frag, node);
  }
}

export function decorateConsultMentionsHtml(html: string, consults: ConsultPath[]): string {
  const matcher = compileMatcher(consults);
  if (!matcher) return html;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  decorateRoot(wrapper, matcher);
  return wrapper.innerHTML;
}

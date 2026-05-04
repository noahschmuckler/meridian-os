// Glossary decorator + lookup helpers (Track 2 — auto-detect terms,
// underline first mention, popover on tap, pop-out to glossary-browser
// bubble). Mirrors the refMarkers.ts pattern but works at the DOM level
// instead of with a string regex, since first-mention tracking spans
// multiple text nodes inside a single rendered HTML fragment and we need
// to skip wrappers like <a>, <code>, <sup class="ref-marker"> so we
// don't decorate inside an already-rendered citation superscript.
//
// Public API:
//
//  - getMergedGlossary(module?, global)        Module entries override
//                                              global by exact term match.
//                                              Returned in stable order:
//                                              module first, then global.
//
//  - decorateGlossaryHtml(html, entries)       Walk the HTML, wrap every
//                                              occurrence of each term in
//                                              a <span class="glossary-term"
//                                              data-term="..."> ... </span>.
//                                              Repeats are intentional —
//                                              the dotted-underline cue is
//                                              subtle enough that decorating
//                                              every mention reads as
//                                              consistent vocabulary, not
//                                              visual noise.
//
//  - decorateGlossaryText(text, entries)       Same, but input is plain
//                                              text — escapes via
//                                              textContent before walking
//                                              so the HTML round-trip
//                                              never injects unescaped
//                                              markup.
//
// All functions require a browser DOM. They run inline in render paths so
// that's fine; if we ever need to decorate at module-load time (SSR), we'd
// need a string-based regex equivalent.

import type { GlossaryEntry, ModuleData } from '../types';

// Tags whose text contents should NOT be decorated. Anchors and code
// blocks already have their own semantics; <sup>/<sub> are how
// expandRefMarkers wraps citation superscripts so we must not walk into
// them; <script>/<style> are obvious. <button>/<input> etc. don't appear
// inside answer_html in practice but we exclude them defensively.
const SKIP_TAGS = new Set([
  'A', 'CODE', 'PRE', 'SCRIPT', 'STYLE', 'SUP', 'SUB',
  'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'KBD',
]);

const SKIP_CLASSES = new Set([
  'glossary-term', 'ref-marker',
]);

interface CompiledMatcher {
  re: RegExp;
  byMatch: Map<string, GlossaryEntry>;
}

// Build a single combined regex over all term + alias strings. Sorting by
// length descending ensures longer aliases win over shorter substrings
// (`MED` won't shadow `MEDS` if both are present). Word boundaries `\b`
// keep us from matching mid-word — this works for hyphenated terms like
// `I-STOP` because `\b` sits between word chars and the hyphen.
function compileMatcher(entries: GlossaryEntry[]): CompiledMatcher | null {
  if (entries.length === 0) return null;
  const byMatch = new Map<string, GlossaryEntry>();
  const tokens: string[] = [];
  for (const e of entries) {
    const variants = [e.term, ...(e.aliases ?? [])];
    for (const v of variants) {
      if (!v) continue;
      // Module entries take precedence: we walk module-first in the
      // entries list, so the first time a string is registered wins.
      if (!byMatch.has(v)) {
        byMatch.set(v, e);
        tokens.push(v);
      }
    }
  }
  if (tokens.length === 0) return null;
  tokens.sort((a, b) => b.length - a.length);
  const escaped = tokens.map(escapeRegex);
  // Case-sensitive by design — acronyms like PDMP shouldn't match `pdmp`
  // inside `pdmp.example.com`. Add a lowercase alias to a glossary entry
  // if the lowercase form should match.
  const re = new RegExp(`\\b(?:${escaped.join('|')})\\b`, 'g');
  return { re, byMatch };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getMergedGlossary(
  module: ModuleData | null | undefined,
  global: GlossaryEntry[],
): GlossaryEntry[] {
  const moduleEntries = module?.glossary ?? [];
  if (moduleEntries.length === 0) return global;
  const moduleTerms = new Set(moduleEntries.map((e) => e.term));
  const filteredGlobal = global.filter((e) => !moduleTerms.has(e.term));
  return [...moduleEntries, ...filteredGlobal];
}

// Walks `root` and decorates every occurrence of each glossary term in
// any text node not under a SKIP_TAG / SKIP_CLASS ancestor. Mutates the
// DOM in place.
function decorateRoot(
  root: Element,
  matcher: CompiledMatcher,
): void {
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
      const matchedStr = m[0];
      const entry = byMatch.get(matchedStr);
      if (!entry) {
        m = re.exec(text);
        continue;
      }
      if (m.index > last) {
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      }
      const span = document.createElement('span');
      span.className = 'glossary-term';
      span.dataset.term = entry.term;
      span.textContent = matchedStr;
      frag.appendChild(span);
      last = m.index + matchedStr.length;
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

export function decorateGlossaryHtml(
  html: string,
  entries: GlossaryEntry[],
): string {
  const matcher = compileMatcher(entries);
  if (!matcher) return html;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  decorateRoot(wrapper, matcher);
  return wrapper.innerHTML;
}

export function decorateGlossaryText(
  text: string,
  entries: GlossaryEntry[],
): string {
  const matcher = compileMatcher(entries);
  if (!matcher) {
    // Still need to escape so the caller can dangerouslySetInnerHTML safely.
    const escape = document.createElement('div');
    escape.textContent = text;
    return escape.innerHTML;
  }
  const wrapper = document.createElement('div');
  wrapper.textContent = text;
  decorateRoot(wrapper, matcher);
  return wrapper.innerHTML;
}

// Lookup by term — used by the popover when the user taps a decorated
// span. Tries module + global merged so a module-overridden definition
// wins. Aliases also resolve to their canonical entry.
export function findGlossaryEntry(
  term: string,
  entries: GlossaryEntry[],
): GlossaryEntry | null {
  for (const e of entries) {
    if (e.term === term) return e;
    if (e.aliases?.includes(term)) return e;
  }
  return null;
}

// "Cite this decision" popover. Mounted once at the App level in main.tsx.
//
// Triggered by the Cite item in SelectionMenu. Renders the selected text as
// the decision and a numbered list of supporting citations (extracted via
// citationGenerator from the selection's DOM range). Buttons: Copy plain,
// Copy as Markdown, Close. Mirrors GlossaryPopover's positioning + dismiss
// pattern (above-by-default, flip below, viewport clamp; Esc / scroll /
// outside-click dismiss).

import { useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import {
  citePopoverSignal,
  closeCitePopover,
} from '../data/citeSignal';
import {
  formatCitationMarkdown,
  formatCitationPlain,
} from '../lib/citationGenerator';

const POPOVER_W = 380;
const GAP = 10;

export function CiteBlockPopover(): JSX.Element | null {
  const popRef = useRef<HTMLDivElement>(null);
  const [copyState, setCopyState] = useState<'idle' | 'plain' | 'markdown'>('idle');

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape' && citePopoverSignal.value.open) {
        closeCitePopover();
      }
    }
    function onScroll(): void {
      if (citePopoverSignal.value.open) closeCitePopover();
    }
    function onPointerDown(e: PointerEvent): void {
      if (!citePopoverSignal.value.open) return;
      const target = e.target as Node | null;
      if (popRef.current && target && popRef.current.contains(target)) return;
      closeCitePopover();
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, []);

  const state = citePopoverSignal.value;
  if (!state.open || !state.anchor) return null;

  // Rough height estimate so above/below placement picks the side with room.
  // The popover itself is bounded by max-height so very long decisions or
  // citation lists scroll internally rather than push past the viewport.
  const baseH = 140;
  const perCite = 38;
  const POPOVER_H = Math.min(440, baseH + Math.min(state.citations.length, 6) * perCite);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const a = state.anchor;
  const placeAbove = a.top > POPOVER_H + GAP + 8;
  const y = placeAbove ? a.top - POPOVER_H - GAP : a.bottom + GAP;
  let x = a.left + (a.right - a.left) / 2 - POPOVER_W / 2;
  if (x < 8) x = 8;
  if (x + POPOVER_W > vw - 8) x = vw - 8 - POPOVER_W;
  const yClamped = Math.max(8, Math.min(vh - POPOVER_H - 8, y));

  const result = { decision: state.decision, citations: state.citations };

  async function copy(format: 'plain' | 'markdown'): Promise<void> {
    const text = format === 'markdown'
      ? formatCitationMarkdown(result)
      : formatCitationPlain(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(format);
      window.setTimeout(() => setCopyState('idle'), 1100);
    } catch {
      // Clipboard may be denied; do nothing — the popover stays open so the
      // user can still read the citations.
    }
  }

  return (
    <div
      ref={popRef}
      class={`cite-popover cite-popover--${placeAbove ? 'above' : 'below'}`}
      style={{
        position: 'fixed',
        top: `${yClamped}px`,
        left: `${x}px`,
        width: `${POPOVER_W}px`,
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div class="cite-popover__label">Decision</div>
      <div class="cite-popover__decision">{state.decision}</div>

      {state.citations.length > 0 ? (
        <>
          <div class="cite-popover__sub">Supported by</div>
          <ol class="cite-popover__list">
            {state.citations.map(({ number, ref }) => (
              <li class="cite-popover__item">
                <span class="cite-popover__num">[{number}]</span>
                <span class="cite-popover__cite">
                  {ref.citation}
                  {ref.url && (
                    <>
                      {' '}
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="cite-popover__link"
                      >
                        link
                      </a>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div class="cite-popover__empty">
          No supporting citations identified — extend the selection to include a cited claim.
        </div>
      )}

      <div class="cite-popover__actions">
        <button
          type="button"
          class="cite-popover__btn"
          onClick={() => void copy('plain')}
          disabled={!state.decision}
        >
          {copyState === 'plain' ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          class="cite-popover__btn"
          onClick={() => void copy('markdown')}
          disabled={!state.decision}
        >
          {copyState === 'markdown' ? 'Copied' : 'Copy as Markdown'}
        </button>
        <button
          type="button"
          class="cite-popover__btn cite-popover__btn--secondary"
          onClick={closeCitePopover}
        >
          Close
        </button>
      </div>
    </div>
  );
}

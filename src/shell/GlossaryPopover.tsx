// Floating glossary popover. Mounted once at the App level in main.tsx.
//
// Listens at document scope for clicks on `<span class="glossary-term">`
// and surfaces a dark-glass popover above (or below) the term with the
// term's expansion, definition, and an "Open glossary" button that
// spawns the glossary-browser bubble adjacent to the source via the
// `meridian:spawn-bubble` CustomEvent. Mirrors SelectionMenu's
// positioning + dismissal pattern.

import { useEffect, useRef } from 'preact/hooks';
import type { JSX } from 'preact';
import type { GlossaryEntry, ModuleData } from '../types';
import { activeWorkspaceIdSignal } from '../data/workspaceNav';
import { moduleFocusSignal } from '../data/moduleFocus';
import { userModulesSignal } from '../data/userModules';
import {
  glossaryPopoverSignal,
  openGlossaryPopover,
  closeGlossaryPopover,
} from '../data/glossarySignal';
import { findGlossaryEntry, getMergedGlossary } from '../lib/glossary';

interface Props {
  modules: ModuleData[];
  globalGlossary: GlossaryEntry[];
}

const POPOVER_W = 320;
const POPOVER_H = 140; // approximate; may grow with definition length
const GAP = 10;

export function GlossaryPopover({ modules, globalGlossary }: Props): JSX.Element | null {
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent): void {
      const target = e.target as Element | null;
      if (!target) return;
      // Click inside the open popover is handled by its own buttons.
      if (popRef.current && popRef.current.contains(target as Node)) return;

      const span = target.closest('.glossary-term') as HTMLElement | null;
      if (span) {
        const term = span.dataset.term ?? '';
        if (!term) return;
        const rect = span.getBoundingClientRect();
        const bubbleEl = span.closest('[data-bubble-id]') as HTMLElement | null;
        const nearBubbleId = bubbleEl?.dataset.bubbleId ?? null;
        e.stopPropagation();
        e.preventDefault();
        openGlossaryPopover({
          term,
          anchor: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
          nearBubbleId,
        });
        return;
      }

      // Click outside any term and outside the popover dismisses.
      if (glossaryPopoverSignal.value.open) {
        closeGlossaryPopover();
      }
    }

    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape' && glossaryPopoverSignal.value.open) {
        closeGlossaryPopover();
      }
    }

    function onScroll(): void {
      if (glossaryPopoverSignal.value.open) closeGlossaryPopover();
    }

    document.addEventListener('click', onClick, true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, []);

  const state = glossaryPopoverSignal.value;
  if (!state.open || !state.anchor) return null;

  // Resolve the term against the active module's merged glossary so
  // module-specific definitions win when present.
  const focus = moduleFocusSignal('clinical-modules').value;
  const allModules: ModuleData[] = [...modules, ...userModulesSignal.value];
  const activeModule = activeWorkspaceIdSignal.value === 'clinical-modules'
    ? allModules.find((m) => m.module_id === focus.moduleId) ?? null
    : null;
  const merged = getMergedGlossary(activeModule, globalGlossary);
  const entry = findGlossaryEntry(state.term, merged);

  if (!entry) {
    // Term span exists but the glossary entry is gone (e.g. user edited
    // glossary.json mid-session). Close gracefully.
    closeGlossaryPopover();
    return null;
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const a = state.anchor;
  const placeAbove = a.top > POPOVER_H + GAP + 8;
  const y = placeAbove ? a.top - POPOVER_H - GAP : a.bottom + GAP;
  let x = a.left + (a.right - a.left) / 2 - POPOVER_W / 2;
  if (x < 8) x = 8;
  if (x + POPOVER_W > vw - 8) x = vw - 8 - POPOVER_W;
  const yClamped = Math.max(8, Math.min(vh - POPOVER_H - 8, y));

  function openBrowser(): void {
    window.dispatchEvent(new CustomEvent('meridian:spawn-bubble', {
      detail: {
        workspaceId: activeWorkspaceIdSignal.value,
        spec: {
          type: 'glossary-browser',
          title: 'Glossary',
          props: {
            initialTerm: state.term,
          },
          nearBubbleId: state.nearBubbleId ?? undefined,
        },
      },
    }));
    closeGlossaryPopover();
  }

  return (
    <div
      ref={popRef}
      class={`glossary-popover glossary-popover--${placeAbove ? 'above' : 'below'}`}
      style={{
        position: 'fixed',
        top: `${yClamped}px`,
        left: `${x}px`,
        width: `${POPOVER_W}px`,
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div class="glossary-popover__head">
        <span class="glossary-popover__term">{entry.term}</span>
        {entry.expansion && (
          <span class="glossary-popover__expansion">{entry.expansion}</span>
        )}
      </div>
      <div class="glossary-popover__def">{entry.definition}</div>
      <div class="glossary-popover__actions">
        <button
          type="button"
          class="glossary-popover__btn"
          onClick={openBrowser}
        >
          Open glossary
        </button>
      </div>
    </div>
  );
}

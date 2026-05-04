// Floating menu that surfaces above any text selection inside a bubble
// body. Replaces the iOS callout (suppressed via `-webkit-touch-callout`
// in reset.css) with an action menu that's identical on iPhone and
// desktop. Mounted once at the App level.
//
// Items: Copy, Select all, Cite, OpenEvidence, Feedback. The Cite action
// extracts supporting citations from the selection's DOM range (via
// citationGenerator) and opens the CiteBlockPopover. The OpenEvidence
// action spawns the openevidence-builder bubble adjacent to the source
// via the `meridian:spawn-bubble` CustomEvent that BspWorkspace listens
// for. Feedback opens the FeedbackModal pre-filled with the active
// module + selected snippet.
//
// Selection detection uses `selectionchange` with a 250ms debounce so we
// only render after the user has stopped extending the selection.

import { useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ModuleData } from '../types';
import { activeWorkspaceIdSignal } from '../data/workspaceNav';
import { moduleFocusSignal } from '../data/moduleFocus';
import { userModulesSignal } from '../data/userModules';
import { openFeedback } from '../data/feedbackSignal';
import { buildOEPrefill } from '../lib/oeQuery';
import { extractCitations } from '../lib/citationGenerator';
import { openCitePopover } from '../data/citeSignal';

interface Props {
  modules: ModuleData[];
}

interface MenuState {
  visible: boolean;
  x: number;
  y: number;
  placeAbove: boolean;
  snippet: string;
  nearBubbleId: string | null;
}

const HIDDEN: MenuState = {
  visible: false,
  x: 0,
  y: 0,
  placeAbove: true,
  snippet: '',
  nearBubbleId: null,
};

const MENU_W = 320;   // approximate; CSS width is the source of truth
const MENU_H = 36;
const GAP = 8;

export function SelectionMenu({ modules }: Props): JSX.Element | null {
  const [state, setState] = useState<MenuState>(HIDDEN);
  const debounceRef = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function recompute(): void {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setState(HIDDEN);
        return;
      }
      const text = sel.toString();
      if (!text.trim()) {
        setState(HIDDEN);
        return;
      }
      const anchorNode = sel.anchorNode;
      if (!anchorNode) {
        setState(HIDDEN);
        return;
      }
      const anchorEl = anchorNode.nodeType === Node.ELEMENT_NODE
        ? (anchorNode as Element)
        : anchorNode.parentElement;
      if (!anchorEl) {
        setState(HIDDEN);
        return;
      }
      const body = anchorEl.closest('.bubble__body');
      if (!body) {
        setState(HIDDEN);
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        setState(HIDDEN);
        return;
      }

      const bubbleEl = anchorEl.closest('[data-bubble-id]') as HTMLElement | null;
      const nearBubbleId = bubbleEl?.dataset.bubbleId ?? null;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const placeAbove = rect.top > MENU_H + GAP + 8;
      const y = placeAbove ? rect.top - MENU_H - GAP : rect.bottom + GAP;
      let x = rect.left + rect.width / 2 - MENU_W / 2;
      if (x < 8) x = 8;
      if (x + MENU_W > vw - 8) x = vw - 8 - MENU_W;
      const yClamped = Math.max(8, Math.min(vh - MENU_H - 8, y));

      setState({
        visible: true,
        x,
        y: yClamped,
        placeAbove,
        snippet: text,
        nearBubbleId,
      });
    }

    function onSelectionChange(): void {
      if (debounceRef.current != null) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        debounceRef.current = null;
        recompute();
      }, 250);
    }
    function onScroll(): void {
      // Hide while scrolling to avoid stale positions; user can re-select.
      setState((prev) => (prev.visible ? HIDDEN : prev));
    }
    function onPointerDown(e: PointerEvent): void {
      const target = e.target as Element | null;
      if (!target) return;
      if (menuRef.current && menuRef.current.contains(target as Node)) return;
      // Click outside menu collapses selection (browser default), which
      // will fire selectionchange and hide the menu.
    }
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') setState(HIDDEN);
    }

    document.addEventListener('selectionchange', onSelectionChange);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKey);
      if (debounceRef.current != null) window.clearTimeout(debounceRef.current);
    };
  }, []);

  if (!state.visible) return null;

  // Active module / FAQ — only meaningful when we're in the
  // clinical-modules workspace and a module is focused. Other workspaces
  // get a context-less menu (still useful for Copy + Feedback).
  const focus = moduleFocusSignal('clinical-modules').value;
  const allModules: ModuleData[] = [...modules, ...userModulesSignal.value];
  const activeModule = activeWorkspaceIdSignal.value === 'clinical-modules'
    ? allModules.find((m) => m.module_id === focus.moduleId) ?? null
    : null;
  const focusedFaq = activeModule && focus.focusedItemId
    ? activeModule.faqs.find((f) => f.faq_id === focus.focusedItemId)
    : null;

  function clearSelection(): void {
    window.getSelection()?.removeAllRanges();
    setState(HIDDEN);
  }

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(state.snippet);
    } catch {
      // clipboard may be denied — fall back to no-op; user can copy
      // manually from the still-active selection.
    }
    clearSelection();
  }

  function selectAll(): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const anchor = sel.anchorNode?.parentElement;
    const body = anchor?.closest('.bubble__body');
    if (!body) return;
    const range = document.createRange();
    range.selectNodeContents(body);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function openCite(): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const result = extractCitations(range, activeModule);
    openCitePopover({
      decision: result.decision,
      citations: result.citations,
      anchor: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
      nearBubbleId: state.nearBubbleId,
    });
    clearSelection();
  }

  function openOpenEvidence(): void {
    const prefill = buildOEPrefill({
      selectedText: state.snippet,
      module: activeModule,
      faqTopic: focusedFaq?.topic ?? null,
    });
    window.dispatchEvent(new CustomEvent('meridian:spawn-bubble', {
      detail: {
        workspaceId: activeWorkspaceIdSignal.value,
        spec: {
          type: 'openevidence-builder',
          title: 'OpenEvidence',
          props: {
            prefilledTopic: prefill.topic,
            prefilledContext: prefill.context,
            prefilledQuestionType: prefill.questionType,
          },
          nearBubbleId: state.nearBubbleId ?? undefined,
        },
      },
    }));
    clearSelection();
  }

  function openFeedbackModal(): void {
    openFeedback({
      moduleTitle: activeModule?.default_title ?? null,
      moduleId: activeModule?.module_id ?? null,
      faqTopic: focusedFaq?.topic ?? null,
      itemText: state.snippet,
    });
    clearSelection();
  }

  return (
    <div
      ref={menuRef}
      class={`selection-menu selection-menu--${state.placeAbove ? 'above' : 'below'}`}
      style={{ position: 'fixed', top: `${state.y}px`, left: `${state.x}px`, width: `${MENU_W}px` }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.preventDefault() /* don't collapse selection */}
    >
      <button class="selection-menu__btn" type="button" onClick={() => void copy()}>
        Copy
      </button>
      <button class="selection-menu__btn" type="button" onClick={selectAll}>
        Select all
      </button>
      <button
        class="selection-menu__btn"
        type="button"
        onClick={openCite}
        disabled={!activeModule}
        title={activeModule ? 'Generate a citation block from this selection' : 'Open a clinical module first'}
      >
        Cite
      </button>
      <button
        class="selection-menu__btn"
        type="button"
        onClick={openOpenEvidence}
        disabled={!activeModule}
        title={activeModule ? 'Open in OpenEvidence with this snippet as context' : 'Open a clinical module first'}
      >
        OE
      </button>
      <button class="selection-menu__btn" type="button" onClick={openFeedbackModal}>
        Feedback
      </button>
    </div>
  );
}

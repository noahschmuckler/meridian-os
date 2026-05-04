// App-level state for the "Cite this decision" popover (Track 3). The
// SelectionMenu's Cite button extracts citations via citationGenerator and
// flips this signal open. The popover (mounted at App level in main.tsx)
// reads the signal to position itself + render the decision/citations
// block. `nearBubbleId` is captured for symmetry with the glossary popover
// in case future actions need to spawn an adjacent bubble.

import { signal } from '@preact/signals';
import type { CitationEntry } from '../lib/citationGenerator';

export interface CitePopoverState {
  open: boolean;
  decision: string;
  citations: CitationEntry[];
  // Bounding rect of the selection at the moment the user pressed Cite.
  // Drives popover position. Null when closed.
  anchor: { left: number; top: number; right: number; bottom: number } | null;
  nearBubbleId: string | null;
}

const HIDDEN: CitePopoverState = {
  open: false,
  decision: '',
  citations: [],
  anchor: null,
  nearBubbleId: null,
};

export const citePopoverSignal = signal<CitePopoverState>(HIDDEN);

export function openCitePopover(state: Omit<CitePopoverState, 'open'>): void {
  citePopoverSignal.value = { ...state, open: true };
}

export function closeCitePopover(): void {
  citePopoverSignal.value = HIDDEN;
}

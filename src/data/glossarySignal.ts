// App-level state for the glossary popover. The popover (mounted at App
// level in main.tsx) listens for clicks on `.glossary-term` spans and
// flips this signal open. The `nearBubbleId` is captured at click time
// so the popover's "Open glossary" button can spawn the browser bubble
// adjacent to the source.

import { signal } from '@preact/signals';

export interface GlossaryPopoverState {
  open: boolean;
  term: string;
  // Bounding rect of the clicked .glossary-term span. Used to position
  // the popover. `null` when closed.
  anchor: { left: number; top: number; right: number; bottom: number } | null;
  nearBubbleId: string | null;
}

const HIDDEN: GlossaryPopoverState = {
  open: false,
  term: '',
  anchor: null,
  nearBubbleId: null,
};

export const glossaryPopoverSignal = signal<GlossaryPopoverState>(HIDDEN);

export function openGlossaryPopover(state: Omit<GlossaryPopoverState, 'open'>): void {
  glossaryPopoverSignal.value = { ...state, open: true };
}

export function closeGlossaryPopover(): void {
  glossaryPopoverSignal.value = HIDDEN;
}

import { signal } from '@preact/signals';

// Cross-app deep-link signal. Lets a click in the Mentorship Tracker (or
// any future surface) request that the Epic Quick Reference open with a
// specific entry pre-expanded. The shell consumes the signal post-mount,
// scrolls to the matching entry, clicks its header to expand, then clears.
// Source is metadata for telemetry / debug; not load-bearing today.
export interface EpicReferenceFocus {
  entryId: string | null;
  source: 'tracker-md-curriculum' | 'manual' | null;
}

const empty: EpicReferenceFocus = { entryId: null, source: null };

export const epicReferenceFocusSignal = signal<EpicReferenceFocus>(empty);

export function focusEpicReferenceEntry(
  entryId: string,
  source: EpicReferenceFocus['source'] = 'manual',
): void {
  epicReferenceFocusSignal.value = { entryId, source };
}

export function clearEpicReferenceFocus(): void {
  epicReferenceFocusSignal.value = empty;
}

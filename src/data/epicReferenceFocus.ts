import { signal } from '@preact/signals';
import { launcherAppSignal, type LauncherApp } from './launcherState';

// Cross-app deep-link signal. Lets a click in the Mentorship Tracker (or
// any future surface) request that the Epic Quick Reference open with a
// specific entry pre-expanded. The shell consumes the signal post-mount,
// scrolls to the matching entry, clicks its header to expand, then clears
// the entryId (but keeps source + returnTo so the back chevron can navigate
// the user back to where they came from).
export interface EpicReferenceFocus {
  entryId: string | null;
  source: 'tracker-md-curriculum' | 'manual' | null;
  returnTo: LauncherApp | null;
}

const empty: EpicReferenceFocus = { entryId: null, source: null, returnTo: null };

export const epicReferenceFocusSignal = signal<EpicReferenceFocus>(empty);

export function focusEpicReferenceEntry(
  entryId: string,
  source: EpicReferenceFocus['source'] = 'manual',
): void {
  // Capture the current launcher app as the back-target so the user can
  // return after expanding the entry. If the user is opening Epic QR from
  // the launcher itself (no prior app), returnTo stays null and only the
  // ‹ meridian chevron is shown.
  const current = launcherAppSignal.value;
  const returnTo: LauncherApp | null =
    current === 'mentorship' || current === 'mondrian' ? current : null;
  epicReferenceFocusSignal.value = { entryId, source, returnTo };
}

// Called by the shell after auto-expanding the deep-linked entry. Keeps
// source + returnTo alive so the back chevron stays visible; only the
// entryId is cleared so a re-mount won't re-trigger the expansion.
export function clearEpicReferenceEntry(): void {
  const cur = epicReferenceFocusSignal.value;
  if (cur.entryId === null) return;
  epicReferenceFocusSignal.value = { ...cur, entryId: null };
}

// Called when the user explicitly navigates away from Epic QR via the back
// chevron. Wipes the whole focus so a future entry starts clean.
export function clearEpicReferenceFocus(): void {
  epicReferenceFocusSignal.value = empty;
}

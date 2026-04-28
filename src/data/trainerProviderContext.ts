// Cross-workspace context: which provider is the Trainer workspace
// currently being shown for, when launched from the Mentorship workspace.
//
// The mentee-overview bubble in Mentorship sets this before navigating to
// Trainer. Trainer reads it to render a "viewing X" banner and (eventually,
// in v2) override seed content with per-mentee dummy state. Cleared on
// Trainer dismiss.
//
// Persisted across page refresh so a refresh-mid-launch lands the user
// back on the right Trainer view, not the default one.

import { signal, type Signal } from '@preact/signals';

export interface TrainerProviderContext {
  providerId: string | null;
}

const EMPTY: TrainerProviderContext = { providerId: null };
const STORAGE_KEY = 'meridian-os.trainerProviderContext';

function hydrate(): TrainerProviderContext {
  if (typeof localStorage === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return JSON.parse(raw) as TrainerProviderContext;
  } catch {
    return EMPTY;
  }
}

export const trainerProviderContextSignal: Signal<TrainerProviderContext> =
  signal<TrainerProviderContext>(hydrate());

let firstFire = true;
trainerProviderContextSignal.subscribe((value) => {
  if (firstFire) { firstFire = false; return; }
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore — quota etc.
  }
});

export function clearTrainerProviderContext(): void {
  trainerProviderContextSignal.value = { providerId: null };
}

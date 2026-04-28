// Workspace-scoped focus signal for the mentorship workspace.
//
// Tracks the current "role" the workspace is presented as (the role-selector
// bubble drives this), plus the cursor state for drilldowns: which director
// is selected when in exec mode, which mentee is selected when in mentor mode,
// and which provider/phase pair is selected when in provider-detail mode.
//
// Role doubles as the primary "mode" — analogous to gallery/module in
// clinical-modules. Persisted to localStorage so refreshes restore role +
// selection in lockstep with the BSP layout.
//
// Note: dismissing the role-selector bubble does NOT clear the role.
// The role is meta-state of the workspace; the selector is just a UI for
// changing it.
//
// Mirrors the moduleFocus.ts pattern.

import { signal, type Signal } from '@preact/signals';

export type MentorshipRole = 'idle' | 'exec' | 'director' | 'mentor';

export interface MentorshipFocus {
  role: MentorshipRole;
  // Set when an exec drills into a director's slice. Cleared on role change
  // or explicit "back to exec" affordance.
  selectedDirectorId: string | null;
  // Set by the mentees-list bubble when mentor selects a mentee. Drives the
  // mentee-overview bubble.
  selectedMenteeId: string | null;
  // Set when a matrix cell or mentee detail is opened. Triggers provider
  // detail mode (phase-tabs + checklist + notes).
  selectedProviderId: string | null;
  selectedPhase: string | null;
}

const EMPTY: MentorshipFocus = {
  role: 'idle',
  selectedDirectorId: null,
  selectedMenteeId: null,
  selectedProviderId: null,
  selectedPhase: null,
};

const STORAGE_KEY = 'meridian-os.mentorshipFocus';

const focusByWorkspace = new Map<string, Signal<MentorshipFocus>>();

let hydrated: Record<string, MentorshipFocus> = {};
try {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (raw) hydrated = JSON.parse(raw) as Record<string, MentorshipFocus>;
} catch {
  // ignore — corrupt JSON or no localStorage
}

function persist(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const obj: Record<string, MentorshipFocus> = {};
    for (const [k, v] of focusByWorkspace.entries()) obj[k] = v.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // ignore — quota etc.
  }
}

export function mentorshipFocusSignal(workspaceId: string): Signal<MentorshipFocus> {
  let s = focusByWorkspace.get(workspaceId);
  if (!s) {
    const initial = hydrated[workspaceId] ?? EMPTY;
    s = signal<MentorshipFocus>(initial);
    let firstFire = true;
    s.subscribe(() => {
      if (firstFire) { firstFire = false; return; }
      persist();
    });
    focusByWorkspace.set(workspaceId, s);
  }
  return s;
}

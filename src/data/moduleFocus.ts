// Workspace-scoped focus signal for the clinical-modules workspace.
//
// Tracks (a) which mode the workspace is in (gallery vs module), (b) which
// module is selected when in module mode, and (c) which checklist/escalation
// item is currently focused (so the FAQ bubble can render its detail).
// Keyed by workspace id so other workspaces (future patient-integrated form)
// can host their own gallery+module pair without colliding.
//
// Persisted to localStorage so refreshes restore both the BSP layout state
// (handled by BspWorkspace) and the focus state in lockstep.

import { signal, type Signal } from '@preact/signals';

export type WorkspaceMode = 'gallery' | 'module';

export interface ModuleFocus {
  mode: WorkspaceMode;
  moduleId: string | null;
  focusedItemId: string | null;
}

const EMPTY: ModuleFocus = { mode: 'gallery', moduleId: null, focusedItemId: null };
const STORAGE_KEY = 'meridian-os.moduleFocus';

const focusByWorkspace = new Map<string, Signal<ModuleFocus>>();

let hydrated: Record<string, ModuleFocus> = {};
try {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (raw) hydrated = JSON.parse(raw) as Record<string, ModuleFocus>;
} catch {
  // ignore — corrupt JSON or no localStorage
}

function persist(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const obj: Record<string, ModuleFocus> = {};
    for (const [k, v] of focusByWorkspace.entries()) obj[k] = v.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // ignore — quota etc.
  }
}

export function moduleFocusSignal(workspaceId: string): Signal<ModuleFocus> {
  let s = focusByWorkspace.get(workspaceId);
  if (!s) {
    const initial = hydrated[workspaceId] ?? EMPTY;
    s = signal<ModuleFocus>(initial);
    let firstFire = true;
    s.subscribe(() => {
      if (firstFire) { firstFire = false; return; }
      persist();
    });
    focusByWorkspace.set(workspaceId, s);
  }
  return s;
}

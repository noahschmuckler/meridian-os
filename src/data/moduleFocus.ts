// Workspace-scoped focus signal for the clinical-modules workspace.
//
// Two bubbles share the same focus state: the module-card emits "focus this
// item" when a checklist or escalation row is tapped; the FAQ bubble reads
// the focus to render the matching faq entry. Keyed by workspace id so other
// workspaces (future patient-integrated form) can host their own card+faq
// pair without colliding.
//
// In-memory only — focus is ephemeral, like a cursor. Don't persist.

import { signal, type Signal } from '@preact/signals';

export interface ModuleFocus {
  moduleId: string | null;
  focusedItemId: string | null;
}

const EMPTY: ModuleFocus = { moduleId: null, focusedItemId: null };

const focusByWorkspace = new Map<string, Signal<ModuleFocus>>();

export function moduleFocusSignal(workspaceId: string): Signal<ModuleFocus> {
  let s = focusByWorkspace.get(workspaceId);
  if (!s) {
    s = signal<ModuleFocus>(EMPTY);
    focusByWorkspace.set(workspaceId, s);
  }
  return s;
}

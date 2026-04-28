// Programmatic workspace navigation.
//
// The home-screen tile-tap path stays in main.tsx (it has the source rect
// for the fly animation). This file exposes the state + a helper for
// programmatic transitions — used by cross-workspace launches (e.g.,
// Mentorship → Trainer with a per-provider context).
//
// Programmatic navigation has no source tile-rect, so animations are
// best-effort: fly-back-to-home plays normally, then the new workspace
// mounts without a fly-in animation. Acceptable for v1.

import { signal, type Signal } from '@preact/signals';

export const activeWorkspaceIdSignal: Signal<string | null> = signal<string | null>(null);
export const entryFromSignal: Signal<DOMRect | null> = signal<DOMRect | null>(null);

const FLY_BACK_MS = 540; // matches WorkspaceShell's TRANSITION_MS + 60 buffer

/**
 * Navigate to a different workspace from inside another workspace.
 * Triggers the fly-back-to-home animation, then mounts the target workspace.
 * The target mounts without a fly-in animation since there is no source rect.
 */
export function navigateToWorkspace(targetWorkspaceId: string): void {
  const current = activeWorkspaceIdSignal.value;
  if (current === targetWorkspaceId) return;
  if (current == null) {
    // No workspace active; just open the target directly.
    entryFromSignal.value = null;
    activeWorkspaceIdSignal.value = targetWorkspaceId;
    return;
  }
  // Trigger fly-back, then schedule the new workspace to mount.
  activeWorkspaceIdSignal.value = null;
  window.setTimeout(() => {
    entryFromSignal.value = null;
    activeWorkspaceIdSignal.value = targetWorkspaceId;
  }, FLY_BACK_MS);
}

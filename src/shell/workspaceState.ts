// Shared workspace state — module-level Map keyed by workspace id.
//
// Each workspace's bubble registry + BSP root persist across switches so
// bubbles feel tangible. JSON is authoritative on first entry; after that,
// the user's arrangement (and the chat's accumulated state) wins.
//
// HomeScreen reads from this same map to render tile previews that reflect
// the *current* workspace state, not just the original layout.

import type { BubbleInstance, BubblePrimitiveType, GridPlacement, WorkspaceConfig } from '../types';
import { renderBSP, type BSPRoot } from '../mechanics/bsp';

export interface BubbleBundle {
  kind: 'cell' | 'standalone';
  cellRef: WorkspaceConfig['cells'][number] | null;
  instance: BubbleInstance | null;
  placement: GridPlacement;
  minW: number;
  minH: number;
}

export interface PersistedState {
  registry: Record<string, BubbleBundle>;
  root: BSPRoot;
}

export const persistentWorkspaceStates = new Map<string, PersistedState>();

// Per-workspace named layout save states. Numbered slots; user fills slot N
// from the FAB save row, slot N+1 then appears as the next empty slot.
export interface SavedLayout {
  registry: Record<string, BubbleBundle>;
  root: BSPRoot;
  savedAt: number;
}
export const savedLayouts = new Map<string, SavedLayout[]>();

/**
 * Clone a save snapshot via JSON round-trip. Registry + BSP root are
 * plain-data-shaped (numbers, strings, arrays, nested objects) so this is
 * safe and ensures saved state is decoupled from current mutations.
 */
export function cloneSnapshot<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export interface PreviewBubble {
  id: string;
  type: BubblePrimitiveType;
  region: GridPlacement;
  title?: string;
}

export interface WorkspacePreview {
  id: string;
  title: string;
  icon: { glyph: string; tint: string };
  bubbles: PreviewBubble[];
  grid: { cols: number; rows: number };
}

/**
 * Build a tile-preview view of a workspace. If the user has already
 * interacted with this workspace (state is persisted), preview reflects
 * that. Otherwise the JSON's declared layout is used.
 */
export function getWorkspacePreview(workspace: WorkspaceConfig): WorkspacePreview {
  const stored = persistentWorkspaceStates.get(workspace.id);
  if (stored) {
    const { leaves } = renderBSP(stored.root);
    return {
      id: workspace.id,
      title: workspace.title,
      icon: workspace.icon,
      grid: { cols: workspace.layoutHints.grid.cols, rows: workspace.layoutHints.grid.rows },
      bubbles: leaves.map((l) => {
        const inst = stored.registry[l.bubbleId]?.instance;
        const cellRef = stored.registry[l.bubbleId]?.cellRef;
        return {
          id: l.bubbleId,
          type: (inst?.type ?? 'placeholder') as BubblePrimitiveType,
          region: { col: l.region.col, row: l.region.row, width: l.region.w, height: l.region.h },
          title: inst?.title ?? cellRef?.id,
        };
      }),
    };
  }

  // No persisted state — derive preview from JSON.
  const placements = workspace.layoutHints.placements;
  const bubbles: PreviewBubble[] = [];
  for (const c of workspace.cells) {
    const p = placements[c.id];
    if (p) bubbles.push({ id: c.id, type: 'llm-chat', region: p, title: c.id });
  }
  for (const b of workspace.standalones) {
    const p = placements[b.id];
    if (p) bubbles.push({ id: b.id, type: b.type, region: p, title: b.title });
  }
  return {
    id: workspace.id,
    title: workspace.title,
    icon: workspace.icon,
    grid: { cols: workspace.layoutHints.grid.cols, rows: workspace.layoutHints.grid.rows },
    bubbles,
  };
}

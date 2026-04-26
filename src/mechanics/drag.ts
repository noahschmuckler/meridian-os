// Cross-workspace drag router: when a bubble's drag crosses the workspace boundary,
// route through HydrationBus and trigger onDrop in the target workspace.
// Phase 0 stub.

import type { BubbleInstance } from '../types';

export interface DragRoute {
  sourceWorkspaceId: string;
  targetWorkspaceId: string;
  bubble: BubbleInstance;
}

export function routeCrossWorkspaceDrag(_route: DragRoute): Promise<{ ok: boolean }> {
  return Promise.resolve({ ok: false });
}

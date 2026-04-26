// HydrationBus: routes cross-workspace bubble drops into the target workspace's chat context.
// Phase 0: skeleton. Real wiring lands in Phase 4 alongside cross-workspace drag.

import type { BubbleInstance } from '../types';

export interface HydrationRequest {
  sourceWorkspaceId: string;
  targetWorkspaceId: string;
  bubble: BubbleInstance;
  targetCellId?: string;
}

type Listener = (req: HydrationRequest) => void;

const listeners = new Set<Listener>();

export const HydrationBus = {
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  publish(req: HydrationRequest): void {
    listeners.forEach((fn) => fn(req));
  },
};

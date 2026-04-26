// Attach/detach contract: bubbles can become organelles in cells and detach back to standalone.
// Phase 0 stub.

import type { BubbleInstance } from '../types';

export interface AttachRequest {
  bubbleId: string;
  cellId: string;
  slot: 'organelle' | 'nucleus';
}

export interface AttachResult {
  ok: boolean;
  serialized?: BubbleInstance;
  reason?: string;
}

export function performAttach(_req: AttachRequest): AttachResult {
  return { ok: false, reason: 'phase-0-stub' };
}

export function performDetach(_bubbleId: string): AttachResult {
  return { ok: false, reason: 'phase-0-stub' };
}

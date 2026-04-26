// Cluster snap: bubbles snap together on edge contact, clusters move as units.
// Phase 0 stub — interface fixed; behavior built out alongside Phase 1.

export interface ClusterRef {
  id: string;
  bubbleIds: string[];
}

export function detectSnap(_a: DOMRect, _b: DOMRect): { snap: false } | { snap: true; edge: 'l' | 'r' | 't' | 'b' } {
  return { snap: false };
}

export function buildClusters(_bubbleRects: Map<string, DOMRect>): ClusterRef[] {
  return [];
}

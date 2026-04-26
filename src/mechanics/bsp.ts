// Binary Space Partition layout for workspaces.
//
// Mental model: the workspace is a soap-bubble cluster bounded by the screen.
// Every bubble is a leaf in a BSP tree. Splits between siblings are walls.
// Inflating one bubble pushes walls outward; min-size constraints stop walls
// from squeezing a neighbor below readable size.
//
// We construct the BSP from existing placements (col, row, w, h) and re-render
// placements from BSP state. Mutations happen via splitter / corner drag.

import type { GridPlacement } from '../types';

export type Orientation = 'h' | 'v';

export interface Region {
  col: number;
  row: number;
  w: number;
  h: number;
}

export interface BSPLeaf {
  kind: 'leaf';
  bubbleId: string;
  minW: number;
  minH: number;
}

export interface BSPSplit {
  kind: 'split';
  id: string;          // stable id assigned at construction; used by drag handles
  orientation: Orientation; // 'h' = horizontal wall (top child / bottom child); 'v' = vertical wall
  splitAt: number;     // for 'h', the row index of the wall; for 'v', the col index
  children: [BSPNode, BSPNode];
}

export type BSPNode = BSPLeaf | BSPSplit;

export interface BubblePlacement {
  id: string;
  placement: GridPlacement;
  minW?: number;
  minH?: number;
}

export interface BSPRoot {
  node: BSPNode;
  region: Region;       // whole-workspace region
  splitCounter: number; // monotonically incremented when constructing/mutating
}

// === Construction =====================================================

let _splitIdSeq = 0;
const nextSplitId = (): string => `s${++_splitIdSeq}`;

/**
 * Build a BSP from a flat list of bubble placements. Throws if the layout
 * isn't BSP-decomposable (i.e. a bubble straddles every potential split).
 */
export function buildBSP(bubbles: BubblePlacement[], region: Region): BSPRoot {
  if (bubbles.length === 0) {
    throw new Error('cannot build BSP from empty bubble list');
  }
  return { node: buildNode(bubbles, region), region, splitCounter: _splitIdSeq };
}

function buildNode(bubbles: BubblePlacement[], region: Region): BSPNode {
  if (bubbles.length === 1) {
    const b = bubbles[0];
    return {
      kind: 'leaf',
      bubbleId: b.id,
      minW: b.minW ?? 2,
      minH: b.minH ?? 2,
    };
  }

  // Try horizontal splits at each row inside the region.
  for (let r = region.row + 1; r < region.row + region.h; r++) {
    const top = bubbles.filter((b) => b.placement.row + b.placement.height <= r);
    const bottom = bubbles.filter((b) => b.placement.row >= r);
    if (top.length + bottom.length === bubbles.length && top.length > 0 && bottom.length > 0) {
      return {
        kind: 'split',
        id: nextSplitId(),
        orientation: 'h',
        splitAt: r,
        children: [
          buildNode(top, { col: region.col, row: region.row, w: region.w, h: r - region.row }),
          buildNode(bottom, { col: region.col, row: r, w: region.w, h: region.row + region.h - r }),
        ],
      };
    }
  }

  // Try vertical splits at each column inside the region.
  for (let c = region.col + 1; c < region.col + region.w; c++) {
    const left = bubbles.filter((b) => b.placement.col + b.placement.width <= c);
    const right = bubbles.filter((b) => b.placement.col >= c);
    if (left.length + right.length === bubbles.length && left.length > 0 && right.length > 0) {
      return {
        kind: 'split',
        id: nextSplitId(),
        orientation: 'v',
        splitAt: c,
        children: [
          buildNode(left, { col: region.col, row: region.row, w: c - region.col, h: region.h }),
          buildNode(right, { col: c, row: region.row, w: region.col + region.w - c, h: region.h }),
        ],
      };
    }
  }

  throw new Error(
    `BSP decomposition failed for region ${JSON.stringify(region)} with bubbles ${bubbles.map((b) => b.id).join(',')}`,
  );
}

// === Rendering ========================================================

export interface RenderedLeaf {
  bubbleId: string;
  region: Region;
  minW: number;
  minH: number;
}

export interface RenderedSplit {
  id: string;
  orientation: Orientation;
  splitAt: number;
  region: Region; // the parent region the split lives inside
  // splitter line endpoints in grid coords (for hit-testing)
  lineCol1: number; lineCol2: number;
  lineRow1: number; lineRow2: number;
}

/**
 * Walk the BSP and produce flat lists of leaves and splits with their absolute regions.
 */
export function renderBSP(root: BSPRoot): { leaves: RenderedLeaf[]; splits: RenderedSplit[] } {
  const leaves: RenderedLeaf[] = [];
  const splits: RenderedSplit[] = [];
  walk(root.node, root.region, leaves, splits);
  return { leaves, splits };
}

function walk(node: BSPNode, region: Region, leaves: RenderedLeaf[], splits: RenderedSplit[]): void {
  if (node.kind === 'leaf') {
    leaves.push({ bubbleId: node.bubbleId, region, minW: node.minW, minH: node.minH });
    return;
  }
  if (node.orientation === 'h') {
    splits.push({
      id: node.id,
      orientation: 'h',
      splitAt: node.splitAt,
      region,
      lineCol1: region.col,
      lineCol2: region.col + region.w,
      lineRow1: node.splitAt,
      lineRow2: node.splitAt,
    });
    walk(node.children[0], { col: region.col, row: region.row, w: region.w, h: node.splitAt - region.row }, leaves, splits);
    walk(node.children[1], { col: region.col, row: node.splitAt, w: region.w, h: region.row + region.h - node.splitAt }, leaves, splits);
  } else {
    splits.push({
      id: node.id,
      orientation: 'v',
      splitAt: node.splitAt,
      region,
      lineCol1: node.splitAt,
      lineCol2: node.splitAt,
      lineRow1: region.row,
      lineRow2: region.row + region.h,
    });
    walk(node.children[0], { col: region.col, row: region.row, w: node.splitAt - region.col, h: region.h }, leaves, splits);
    walk(node.children[1], { col: node.splitAt, row: region.row, w: region.col + region.w - node.splitAt, h: region.h }, leaves, splits);
  }
}

// === Min-size aggregation =============================================

/**
 * For a subtree, compute the minimum width and height the subtree can occupy
 * given its leaves' min sizes. Used as a constraint when moving splitters.
 */
export function subtreeMin(node: BSPNode): { minW: number; minH: number } {
  if (node.kind === 'leaf') return { minW: node.minW, minH: node.minH };
  const a = subtreeMin(node.children[0]);
  const b = subtreeMin(node.children[1]);
  if (node.orientation === 'h') {
    // Children stacked top/bottom: width is max of children, height is sum.
    return { minW: Math.max(a.minW, b.minW), minH: a.minH + b.minH };
  } else {
    return { minW: a.minW + b.minW, minH: Math.max(a.minH, b.minH) };
  }
}

// === Splitter mutation ================================================

/**
 * Set a split node's splitAt, clamped by both children's subtree minimums.
 * Returns a new BSP root (immutable mutation; tree shape preserved).
 */
export function setSplitAt(root: BSPRoot, splitId: string, requested: number): BSPRoot {
  const newNode = mutateSplit(root.node, root.region, splitId, requested);
  return { ...root, node: newNode };
}

function mutateSplit(node: BSPNode, region: Region, targetId: string, requested: number): BSPNode {
  if (node.kind === 'leaf') return node;

  if (node.id === targetId) {
    const minA = subtreeMin(node.children[0]);
    const minB = subtreeMin(node.children[1]);
    if (node.orientation === 'h') {
      const lo = region.row + minA.minH;
      const hi = region.row + region.h - minB.minH;
      // Fractional splitAt allowed — soap-bubble deformation needs sub-cell precision.
      const clamped = Math.max(lo, Math.min(hi, requested));
      return { ...node, splitAt: clamped };
    } else {
      const lo = region.col + minA.minW;
      const hi = region.col + region.w - minB.minW;
      const clamped = Math.max(lo, Math.min(hi, requested));
      return { ...node, splitAt: clamped };
    }
  }

  // Recurse into children with their respective regions.
  if (node.orientation === 'h') {
    return {
      ...node,
      children: [
        mutateSplit(node.children[0], { col: region.col, row: region.row, w: region.w, h: node.splitAt - region.row }, targetId, requested),
        mutateSplit(node.children[1], { col: region.col, row: node.splitAt, w: region.w, h: region.row + region.h - node.splitAt }, targetId, requested),
      ],
    };
  } else {
    return {
      ...node,
      children: [
        mutateSplit(node.children[0], { col: region.col, row: region.row, w: node.splitAt - region.col, h: region.h }, targetId, requested),
        mutateSplit(node.children[1], { col: node.splitAt, row: region.row, w: region.col + region.w - node.splitAt, h: region.h }, targetId, requested),
      ],
    };
  }
}

// === Add / remove operations =========================================

/**
 * Remove a leaf from the BSP. Its parent split node is replaced by the
 * sibling subtree (the slot collapses; neighbors flow in to fill).
 * Throws if the bubble is the only leaf in the tree.
 */
export function removeLeaf(root: BSPRoot, bubbleId: string): BSPRoot {
  const result = removeFromNode(root.node, bubbleId);
  if (result.mode === 'not-found') return root;
  if (result.mode === 'removed') {
    throw new Error('cannot remove the last leaf in the workspace');
  }
  return { ...root, node: result.node };
}

type RemoveResult =
  | { mode: 'removed' }
  | { mode: 'kept'; node: BSPNode }
  | { mode: 'not-found' };

function removeFromNode(node: BSPNode, id: string): RemoveResult {
  if (node.kind === 'leaf') {
    return node.bubbleId === id ? { mode: 'removed' } : { mode: 'not-found' };
  }
  const a = removeFromNode(node.children[0], id);
  if (a.mode === 'removed') {
    return { mode: 'kept', node: node.children[1] };
  }
  if (a.mode === 'kept') {
    return { mode: 'kept', node: { ...node, children: [a.node, node.children[1]] } };
  }
  const b = removeFromNode(node.children[1], id);
  if (b.mode === 'removed') {
    return { mode: 'kept', node: node.children[0] };
  }
  if (b.mode === 'kept') {
    return { mode: 'kept', node: { ...node, children: [node.children[0], b.node] } };
  }
  return { mode: 'not-found' };
}

/**
 * Split a target leaf in two and insert a new bubble on the specified side.
 * The new leaf occupies `ratio` of the target's space (default 0.5).
 */
export function splitLeafInsert(
  root: BSPRoot,
  targetBubbleId: string,
  side: 'left' | 'right' | 'top' | 'bottom',
  newBubbleId: string,
  newMinW = 1,
  newMinH = 1,
  ratio = 0.5,
): BSPRoot {
  const result = splitInNode(root.node, root.region, targetBubbleId, side, newBubbleId, newMinW, newMinH, ratio);
  if (!result) return root;
  return { ...root, node: result };
}

function splitInNode(
  node: BSPNode,
  region: Region,
  targetId: string,
  side: 'left' | 'right' | 'top' | 'bottom',
  newId: string,
  newMinW: number,
  newMinH: number,
  ratio: number,
): BSPNode | null {
  if (node.kind === 'leaf') {
    if (node.bubbleId !== targetId) return null;

    const orientation: Orientation = side === 'left' || side === 'right' ? 'v' : 'h';
    const splitAt =
      orientation === 'v'
        ? region.col + region.w * (side === 'left' ? ratio : 1 - ratio)
        : region.row + region.h * (side === 'top' ? ratio : 1 - ratio);

    const newLeaf: BSPLeaf = {
      kind: 'leaf',
      bubbleId: newId,
      minW: newMinW,
      minH: newMinH,
    };

    const isFirstChild = side === 'left' || side === 'top';
    return {
      kind: 'split',
      id: nextSplitId(),
      orientation,
      splitAt,
      children: isFirstChild ? [newLeaf, node] : [node, newLeaf],
    };
  }

  if (node.orientation === 'h') {
    const topR = { col: region.col, row: region.row, w: region.w, h: node.splitAt - region.row };
    const botR = { col: region.col, row: node.splitAt, w: region.w, h: region.row + region.h - node.splitAt };
    const a = splitInNode(node.children[0], topR, targetId, side, newId, newMinW, newMinH, ratio);
    if (a) return { ...node, children: [a, node.children[1]] };
    const b = splitInNode(node.children[1], botR, targetId, side, newId, newMinW, newMinH, ratio);
    if (b) return { ...node, children: [node.children[0], b] };
  } else {
    const leftR = { col: region.col, row: region.row, w: node.splitAt - region.col, h: region.h };
    const rightR = { col: node.splitAt, row: region.row, w: region.col + region.w - node.splitAt, h: region.h };
    const a = splitInNode(node.children[0], leftR, targetId, side, newId, newMinW, newMinH, ratio);
    if (a) return { ...node, children: [a, node.children[1]] };
    const b = splitInNode(node.children[1], rightR, targetId, side, newId, newMinW, newMinH, ratio);
    if (b) return { ...node, children: [node.children[0], b] };
  }
  return null;
}

/**
 * Replace one leaf's bubbleId with another (used for placeholder consumption).
 */
export function replaceLeaf(root: BSPRoot, targetId: string, newId: string): BSPRoot {
  return { ...root, node: replaceInNode(root.node, targetId, newId) };
}

function replaceInNode(node: BSPNode, targetId: string, newId: string): BSPNode {
  if (node.kind === 'leaf') {
    return node.bubbleId === targetId ? { ...node, bubbleId: newId } : node;
  }
  return {
    ...node,
    children: [replaceInNode(node.children[0], targetId, newId), replaceInNode(node.children[1], targetId, newId)],
  };
}

/**
 * Insert a new bubble at the workspace edge — wrap the existing root in a
 * new split. Used for "drop near screen edge" gestures that create a new
 * row or column spanning the full width/height of the workspace.
 */
export function splitRootInsert(
  root: BSPRoot,
  side: 'left' | 'right' | 'top' | 'bottom',
  newBubbleId: string,
  newMinW = 1,
  newMinH = 1,
  ratio = 0.3,
): BSPRoot {
  const orientation: Orientation = side === 'left' || side === 'right' ? 'v' : 'h';
  const splitAt =
    orientation === 'v'
      ? root.region.col + root.region.w * (side === 'left' ? ratio : 1 - ratio)
      : root.region.row + root.region.h * (side === 'top' ? ratio : 1 - ratio);

  const newLeaf: BSPLeaf = {
    kind: 'leaf',
    bubbleId: newBubbleId,
    minW: newMinW,
    minH: newMinH,
  };

  const isFirstChild = side === 'left' || side === 'top';
  const newNode: BSPSplit = {
    kind: 'split',
    id: nextSplitId(),
    orientation,
    splitAt,
    children: isFirstChild ? [newLeaf, root.node] : [root.node, newLeaf],
  };

  return { ...root, node: newNode };
}

/**
 * Find the largest leaf in the tree (by area). Used for "+ summon" to know
 * where to insert a new placeholder when no specific drop target is given.
 */
export function findLargestLeaf(root: BSPRoot): { bubbleId: string; region: Region } | null {
  const { leaves } = renderBSP(root);
  if (leaves.length === 0) return null;
  let best = leaves[0];
  for (const l of leaves) {
    if (l.region.w * l.region.h > best.region.w * best.region.h) best = l;
  }
  return { bubbleId: best.bubbleId, region: best.region };
}

// === Maximize a leaf to fill its workspace ===========================

interface PathStep {
  splitId: string;
  orientation: Orientation;
  region: Region;
  childIdx: 0 | 1; // which child of the split contains the target leaf
  otherMin: { minW: number; minH: number };
}

function findPathToLeaf(
  node: BSPNode,
  region: Region,
  bubbleId: string,
  acc: PathStep[] = [],
): PathStep[] | null {
  if (node.kind === 'leaf') {
    return node.bubbleId === bubbleId ? acc : null;
  }
  const aRegion: Region =
    node.orientation === 'h'
      ? { col: region.col, row: region.row, w: region.w, h: node.splitAt - region.row }
      : { col: region.col, row: region.row, w: node.splitAt - region.col, h: region.h };
  const bRegion: Region =
    node.orientation === 'h'
      ? { col: region.col, row: node.splitAt, w: region.w, h: region.row + region.h - node.splitAt }
      : { col: node.splitAt, row: region.row, w: region.col + region.w - node.splitAt, h: region.h };

  const a = findPathToLeaf(
    node.children[0],
    aRegion,
    bubbleId,
    [...acc, { splitId: node.id, orientation: node.orientation, region, childIdx: 0, otherMin: subtreeMin(node.children[1]) }],
  );
  if (a) return a;
  const b = findPathToLeaf(
    node.children[1],
    bRegion,
    bubbleId,
    [...acc, { splitId: node.id, orientation: node.orientation, region, childIdx: 1, otherMin: subtreeMin(node.children[0]) }],
  );
  return b;
}

/**
 * Push every ancestor split's wall outward so the target leaf takes as
 * much region as the constraint cascade allows. Other bubbles compress
 * to their min sizes (becoming border ribbons via the existing
 * borderization). Idempotent — calling twice does nothing extra.
 */
export function maximizeLeaf(root: BSPRoot, bubbleId: string): BSPRoot {
  let current = root;
  // Iterate a few times because the regions feeding subtreeMin shift as
  // we push splits; convergence is fast (BSP is shallow).
  for (let pass = 0; pass < 4; pass++) {
    const path = findPathToLeaf(current.node, current.region, bubbleId);
    if (!path || path.length === 0) break;
    let changed = false;
    for (const step of path) {
      let desired: number;
      if (step.childIdx === 0) {
        // Leaf is in first child — push splitAt outward (toward end).
        desired =
          step.orientation === 'h'
            ? step.region.row + step.region.h - step.otherMin.minH
            : step.region.col + step.region.w - step.otherMin.minW;
      } else {
        // Leaf is in second child — pull splitAt inward (toward start).
        desired =
          step.orientation === 'h'
            ? step.region.row + step.otherMin.minH
            : step.region.col + step.otherMin.minW;
      }
      const next = setSplitAt(current, step.splitId, desired);
      if (next !== current) {
        current = next;
        changed = true;
      }
    }
    if (!changed) break;
  }
  return current;
}

// === Corner detection =================================================

export interface BSPCorner {
  // Grid coords of this corner (where 4 leaf regions meet).
  col: number;
  row: number;
  // The H-split whose wall passes through this row at this col, and the V-split whose wall passes through this col at this row.
  hSplitId: string;
  vSplitId: string;
}

/**
 * Find all interior "corners" — grid points where an H-split wall crosses a V-split wall.
 * Each is a candidate handle for the corner-drag-maximize gesture.
 */
export function findCorners(root: BSPRoot): BSPCorner[] {
  const { splits } = renderBSP(root);
  const hSplits = splits.filter((s) => s.orientation === 'h');
  const vSplits = splits.filter((s) => s.orientation === 'v');
  const corners: BSPCorner[] = [];
  for (const h of hSplits) {
    for (const v of vSplits) {
      // h is a horizontal line at row h.splitAt spanning cols [h.lineCol1, h.lineCol2]
      // v is a vertical line at col v.splitAt spanning rows [v.lineRow1, v.lineRow2]
      // They cross if v.splitAt is inside h's col span AND h.splitAt is inside v's row span.
      if (
        v.splitAt > h.lineCol1 && v.splitAt < h.lineCol2 &&
        h.splitAt > v.lineRow1 && h.splitAt < v.lineRow2
      ) {
        corners.push({ col: v.splitAt, row: h.splitAt, hSplitId: h.id, vSplitId: v.id });
      } else if (v.splitAt === h.lineCol1 || v.splitAt === h.lineCol2 || h.splitAt === v.lineRow1 || h.splitAt === v.lineRow2) {
        // Edge corners (3 bubbles meet at a T-junction). Still useful for corner drag.
        if (
          v.splitAt >= h.lineCol1 && v.splitAt <= h.lineCol2 &&
          h.splitAt >= v.lineRow1 && h.splitAt <= v.lineRow2
        ) {
          corners.push({ col: v.splitAt, row: h.splitAt, hSplitId: h.id, vSplitId: v.id });
        }
      }
    }
  }
  return corners;
}

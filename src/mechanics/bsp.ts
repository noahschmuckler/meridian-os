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

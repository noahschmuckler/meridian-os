// BSP-driven workspace renderer with rearrangement gestures.
//
// Splitter / corner drag: deform existing layout (resize bubbles).
// Long-press a bubble's body: lift it. Original slot collapses (BSP removeLeaf),
//   neighbors flow in. Ghost follows finger.
// Drop on a target leaf: that leaf splits to make room (left/right/top/bottom
//   based on pointer position within target). Drop on a placeholder: placeholder
//   is consumed and the dropped bubble takes the slot exactly.
// + button (top-right): summon a placeholder by splitting the largest leaf.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { AttachRelationship, BubbleInstance, BubblePrimitiveType, ChatProps, GridPlacement, MiniBubble, WorkspaceConfig } from '../types';
import { Cell } from '../cell/Cell';
import { getPrimitiveComponent } from '../bubbles';
import { PRIMITIVE_LABELS } from '../bubbles/labels';
import type { SeedDict } from '../data/seedResolver';
import { resolveSeedTokens } from '../data/seedResolver';
import {
  listFiles,
  createFile,
  updateFileName,
  updateFileInstance,
  type MeridianFile,
} from '../data/filesystem';
import { buildBrainContext } from '../data/brainContext';
import { moduleFocusSignal } from '../data/moduleFocus';
import {
  buildBSP,
  renderBSP,
  setSplitAt,
  findCorners,
  removeLeaf,
  splitLeafInsert,
  splitRootInsert,
  replaceLeaf,
  findLargestLeaf,
  maximizeLeaf,
  type BSPRoot,
  type BSPNode,
  type Region,
  type RenderedSplit,
  type BSPCorner,
  type RenderedLeaf,
} from '../mechanics/bsp';

interface Props {
  workspace: WorkspaceConfig;
  seeds: SeedDict;
  onBackToHome?: () => void;
}

import {
  persistentWorkspaceStates,
  savedLayouts,
  setWorkspaceState,
  deleteWorkspaceState,
  setSavedLayouts as persistSavedLayouts,
  cloneSnapshot,
  type BubbleBundle,
  type SavedLayout,
} from './workspaceState';

const DEFAULT_MIN_W = 1;
const DEFAULT_MIN_H = 1;
const CELL_MIN_W = 1;
const CELL_MIN_H = 1;
const LONG_PRESS_MS = 380;
const LONG_PRESS_MOVE_TOLERANCE_PX = 8;

// Module → companion bubble types that auto-show when that module is picked
// in the clinical-modules workspace. Outside this map the companion is
// auto-hidden on module switch UNLESS the user manually summoned it during
// the non-companion module session.
const COMPANIONS_BY_MODULE: Record<string, BubblePrimitiveType[]> = {
  'lipid-management': ['prevent-calculator'],
};
const OPTIONAL_COMPANION_TYPES: BubblePrimitiveType[] = ['prevent-calculator'];

// True when the pointerdown landed on a native scrollbar gutter of any
// scrollable ancestor. Walks from the event target upward; for each scrollable
// element checks whether the pointer x/y is past its clientWidth / clientHeight
// (the scrollbar gutter sits in that strip). Used to avoid hijacking
// scrollbar drags as bubble lifts.
function isPointerOnScrollbar(e: PointerEvent): boolean {
  let el = e.target as HTMLElement | null;
  while (el) {
    const cs = window.getComputedStyle(el);
    const scrollableY =
      (cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
    const scrollableX =
      (cs.overflowX === 'auto' || cs.overflowX === 'scroll') && el.scrollWidth > el.clientWidth;
    if (scrollableY || scrollableX) {
      const rect = el.getBoundingClientRect();
      const xInEl = e.clientX - rect.left;
      const yInEl = e.clientY - rect.top;
      if (scrollableY && xInEl > el.clientWidth && xInEl <= rect.width) return true;
      if (scrollableX && yInEl > el.clientHeight && yInEl <= rect.height) return true;
    }
    el = el.parentElement;
  }
  return false;
}

interface LiftedState {
  bubbleId: string;
  ghostW: number;
  ghostH: number;
  offsetX: number;
  offsetY: number;
  pointerX: number;
  pointerY: number;
  originalRoot: BSPRoot;
}

let _placeholderSeq = 0;

export function BspWorkspace({ workspace, seeds, onBackToHome }: Props): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const grid = workspace.layoutHints.grid;
  const placements = workspace.layoutHints.placements;

  // Bubble registry — load persisted state for this workspace if present,
  // otherwise initialize from JSON. Persistence makes bubbles tangible.
  const [registry, setRegistry] = useState<Record<string, BubbleBundle>>(() => {
    const stored = persistentWorkspaceStates.get(workspace.id);
    return stored ? stored.registry : initialRegistry(workspace, placements);
  });

  const [root, setRoot] = useState<BSPRoot | null>(() => {
    const stored = persistentWorkspaceStates.get(workspace.id);
    return stored ? stored.root : null;
  });

  // On workspace change, swap in this workspace's persisted state (if any).
  useEffect(() => {
    const stored = persistentWorkspaceStates.get(workspace.id);
    if (stored) {
      setRegistry(stored.registry);
      setRoot(stored.root);
    } else {
      setRegistry(initialRegistry(workspace, placements));
      setRoot(null); // will be rebuilt by the buildBSP effect below
    }
    setLifted(null);
  }, [workspace.id]);
  const [isWallDragging, setIsWallDragging] = useState(false);
  const [lifted, setLifted] = useState<LiftedState | null>(null);
  const [attachMenu, setAttachMenu] = useState<{
    sourceBubbleId: string;
    sourceTitle: string;
    chatId: string;
    chatTitle: string;
    originalRoot: BSPRoot;
    anchorX: number;
    anchorY: number;
  } | null>(null);
  const [vaultOpen, setVaultOpen] = useState<{ placeholderId: string } | null>(null);
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  // Bumped every time a file mutation should re-list — the filesystem is module-level
  // (not React state), so we tell React when to re-render manually.
  const [fsTick, setFsTick] = useState(0);
  const bumpFs = () => setFsTick((n) => n + 1);
  const [fabExpanded, setFabExpanded] = useState(false);
  const [trashHovered, setTrashHovered] = useState(false);
  const [saves, setSaves] = useState<SavedLayout[]>(() => savedLayouts.get(workspace.id) ?? []);
  // Maximize state: which bubble is currently expanded + the BSP to restore on second double-tap.
  const [maximized, setMaximized] = useState<{ bubbleId: string; prevRoot: BSPRoot } | null>(null);

  useEffect(() => {
    setSaves(savedLayouts.get(workspace.id) ?? []);
    setMaximized(null);
  }, [workspace.id]);

  // Build BSP from registry only when we don't already have one (first entry
  // to a workspace). Persisted root is preserved across switches.
  useEffect(() => {
    if (root !== null) return;
    try {
      const built = buildBSP(
        Object.entries(registry).map(([id, b]) => ({
          id,
          placement: b.placement,
          minW: b.minW,
          minH: b.minH,
        })),
        { col: 0, row: 0, w: grid.cols, h: grid.rows },
      );
      setRoot(built);
    } catch (err) {
      console.warn('BSP construction failed', err);
    }
  }, [root, workspace.id]);

  // Persist registry + root to the module-level map (and localStorage) so
  // the next entry — including across page refreshes — finds the same
  // bubbles in the same arrangement.
  useEffect(() => {
    if (root) {
      setWorkspaceState(workspace.id, { registry, root });
    }
  }, [registry, root, workspace.id]);

  // Module-companion auto-show/hide. Subscribes to the workspace's module
  // focus signal; on module change, optional companion bubbles (e.g. the
  // PREVENT calculator) follow the new module's manifest. Manual user
  // additions during a non-companion module session are preserved — the
  // hide rule only fires when leaving a module that listed the companion
  // as a default. Reset on workspace switch via the prev-module ref.
  const prevModuleIdRef = useRef<string | null>(null);
  const registryRef = useRef(registry);
  useEffect(() => { registryRef.current = registry; });
  useEffect(() => { prevModuleIdRef.current = null; }, [workspace.id]);
  useEffect(() => {
    if (workspace.id !== 'clinical-modules') return;
    const focus = moduleFocusSignal(workspace.id);
    return focus.subscribe((current) => {
      const nextMod = current.moduleId;
      if (!nextMod) return;
      const prevMod = prevModuleIdRef.current;
      if (prevMod === nextMod) return;

      const prevComp = new Set(prevMod ? COMPANIONS_BY_MODULE[prevMod] ?? [] : []);
      const nextComp = new Set(COMPANIONS_BY_MODULE[nextMod] ?? []);
      const isInitial = prevMod === null;

      for (const type of OPTIONAL_COMPANION_TYPES) {
        const reg = registryRef.current;
        const entry = Object.entries(reg).find(([, b]) => b.instance?.type === type);
        if (!entry) continue;
        const [bubbleId, bundle] = entry;
        const shouldShow = nextComp.has(type);
        const wasCompanionOfPrev = prevComp.has(type);

        setRoot((prev) => {
          if (!prev) return prev;
          const { leaves } = renderBSP(prev);
          const isVisible = leaves.some((l) => l.bubbleId === bubbleId);

          if (shouldShow && !isVisible) {
            const rightmost = leaves.reduce(
              (acc, l) => (l.region.col + l.region.w > acc.region.col + acc.region.w ? l : acc),
              leaves[0],
            );
            if (!rightmost) return prev;
            try {
              return splitLeafInsert(prev, rightmost.bubbleId, 'left', bubbleId, bundle.minW, bundle.minH, 0.5);
            } catch (err) {
              console.warn('companion auto-show failed', err);
              return prev;
            }
          }

          // Hide rule: leaving a module that owned this companion, OR initial
          // entry and the chosen module doesn't include it (cleanup of JSON
          // default when the user opened on a non-companion module).
          if (!shouldShow && isVisible && (wasCompanionOfPrev || isInitial)) {
            try {
              return removeLeaf(prev, bubbleId);
            } catch {
              return prev;
            }
          }
          return prev;
        });
      }

      prevModuleIdRef.current = nextMod;
    });
  }, [workspace.id]);

  // === Coord helpers ===
  function pxToCol(px: number): number {
    const c = containerRef.current;
    if (!c) return 0;
    const rect = c.getBoundingClientRect();
    return ((px - rect.left) / rect.width) * grid.cols;
  }
  function pxToRow(py: number): number {
    const c = containerRef.current;
    if (!c) return 0;
    const rect = c.getBoundingClientRect();
    return ((py - rect.top) / rect.height) * grid.rows;
  }

  // === Splitter / corner drag (existing behavior) ===
  const wallDragRef = useRef<{ kind: 'splitter' | 'corner'; ids: string[] } | null>(null);
  function onSplitterDown(e: PointerEvent, split: RenderedSplit): void {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    wallDragRef.current = { kind: 'splitter', ids: [split.id] };
    setIsWallDragging(true);
    e.preventDefault();
    e.stopPropagation();
  }
  function onSplitterMove(e: PointerEvent, split: RenderedSplit): void {
    if (!wallDragRef.current || !root) return;
    const target = split.orientation === 'h' ? pxToRow(e.clientY) : pxToCol(e.clientX);
    setRoot((prev) => (prev ? setSplitAt(prev, split.id, target) : prev));
  }
  function onSplitterUp(e: PointerEvent): void {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    wallDragRef.current = null;
    setIsWallDragging(false);
  }
  function onCornerDown(e: PointerEvent, corner: BSPCorner): void {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    wallDragRef.current = { kind: 'corner', ids: [corner.hSplitId, corner.vSplitId] };
    setIsWallDragging(true);
    e.preventDefault();
    e.stopPropagation();
  }
  function onCornerMove(e: PointerEvent, corner: BSPCorner): void {
    if (!wallDragRef.current || !root) return;
    const newRow = pxToRow(e.clientY);
    const newCol = pxToCol(e.clientX);
    setRoot((prev) => {
      if (!prev) return prev;
      const afterH = setSplitAt(prev, corner.hSplitId, newRow);
      return setSplitAt(afterH, corner.vSplitId, newCol);
    });
  }
  function onCornerUp(e: PointerEvent): void {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    wallDragRef.current = null;
    setIsWallDragging(false);
  }

  // === Long-press lift ===
  const longPressRef = useRef<{
    bubbleId: string;
    timer: number | null;
    startX: number;
    startY: number;
    leafRect: DOMRect | null;
  } | null>(null);

  function onBubblePointerDown(e: PointerEvent, leaf: RenderedLeaf, leafEl: HTMLElement): void {
    if (lifted || isWallDragging) return;
    // If the press lands on a native scrollbar gutter inside the bubble, let the
    // browser handle the scrollbar drag — don't capture the pointer or start
    // the lift timer. Otherwise dragging the scrollbar elevator would lift
    // the bubble.
    if (isPointerOnScrollbar(e)) return;
    // Capture so the long-press timer is bound to *this* press, regardless of
    // where the pointer wanders next. Splitter/corner handlers still take
    // priority via z-index for direct hits on those elements.
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    longPressRef.current = {
      bubbleId: leaf.bubbleId,
      timer: window.setTimeout(() => triggerLift(leaf, leafEl), LONG_PRESS_MS),
      startX: e.clientX,
      startY: e.clientY,
      leafRect: leafEl.getBoundingClientRect(),
    };
  }
  function onBubblePointerMove(e: PointerEvent): void {
    const lp = longPressRef.current;
    if (!lp) return;
    const dx = Math.abs(e.clientX - lp.startX);
    const dy = Math.abs(e.clientY - lp.startY);
    if (dx > LONG_PRESS_MOVE_TOLERANCE_PX || dy > LONG_PRESS_MOVE_TOLERANCE_PX) {
      // Movement cancels the long-press
      if (lp.timer) window.clearTimeout(lp.timer);
      longPressRef.current = null;
    }
  }
  function onBubblePointerUp(e: PointerEvent): void {
    const lp = longPressRef.current;
    if (lp?.timer) {
      window.clearTimeout(lp.timer);
      // Tap (long-press hadn't fired). Route through handleBubbleTap for
      // single vs double detection.
      handleBubbleTap(lp.bubbleId);
    }
    longPressRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // already released
    }
  }

  // === Double-tap detection =============================================
  const DOUBLE_TAP_MS = 300;
  const tapPendingRef = useRef<{ bubbleId: string; timer: number; time: number } | null>(null);

  function handleBubbleTap(bubbleId: string): void {
    const pending = tapPendingRef.current;
    if (pending && pending.bubbleId === bubbleId && Date.now() - pending.time < DOUBLE_TAP_MS) {
      // Second tap on the same bubble within the window → double-tap.
      window.clearTimeout(pending.timer);
      tapPendingRef.current = null;
      handleDoubleTapBubble(bubbleId);
      return;
    }
    if (pending) window.clearTimeout(pending.timer);
    tapPendingRef.current = {
      bubbleId,
      time: Date.now(),
      timer: window.setTimeout(() => {
        tapPendingRef.current = null;
        handleSingleTapBubble(bubbleId);
      }, DOUBLE_TAP_MS),
    };
  }

  function handleSingleTapBubble(bubbleId: string): void {
    const bundle = registry[bubbleId];
    if (bundle?.instance?.type === 'placeholder') {
      setVaultOpen({ placeholderId: bubbleId });
    }
    // Other bubble types currently have no single-tap action.
  }

  function handleDoubleTapBubble(bubbleId: string): void {
    if (!root) return;
    if (maximized && maximized.bubbleId === bubbleId) {
      // Toggling off — restore to the layout from before the first maximize.
      setRoot(maximized.prevRoot);
      setMaximized(null);
      return;
    }
    if (maximized) {
      // Different bubble — restore first, then maximize the new one from
      // the original layout (not the current maximized one).
      const base = maximized.prevRoot;
      setRoot(maximizeLeaf(base, bubbleId));
      setMaximized({ bubbleId, prevRoot: base });
      return;
    }
    setRoot(maximizeLeaf(root, bubbleId));
    setMaximized({ bubbleId, prevRoot: root });
  }

  function triggerLift(leaf: RenderedLeaf, _leafEl: HTMLElement): void {
    if (!root) return;
    const lp = longPressRef.current;
    if (!lp) return;
    const rect = lp.leafRect ?? _leafEl.getBoundingClientRect();
    const oldRoot = root;
    try {
      const removed = removeLeaf(root, leaf.bubbleId);
      setRoot(removed);
      setLifted({
        bubbleId: leaf.bubbleId,
        ghostW: rect.width,
        ghostH: rect.height,
        offsetX: lp.startX - rect.left,
        offsetY: lp.startY - rect.top,
        pointerX: lp.startX,
        pointerY: lp.startY,
        originalRoot: oldRoot,
      });
    } catch (err) {
      // Last leaf — can't lift
      console.warn('cannot lift the only bubble in the workspace', err);
    }
    longPressRef.current = null;
  }

  // While lifted: track pointer at window level + commit on release.
  // Also watch whether the pointer is hovering the trash zone (bottom-right
  // FAB area) so the FAB can show its trash state.
  useEffect(() => {
    if (!lifted) {
      setTrashHovered(false);
      return;
    }
    function onMove(e: PointerEvent): void {
      setLifted((prev) => (prev ? { ...prev, pointerX: e.clientX, pointerY: e.clientY } : null));
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      setTrashHovered(px > rect.width - 80 && py > rect.height - 80);
    }
    function onUp(e: PointerEvent): void {
      handleDrop(e);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [lifted]);

  function handleDrop(e: PointerEvent): void {
    setLifted((current) => {
      if (!current || !root) return current;
      const liftedBundle = registry[current.bubbleId];
      if (!liftedBundle) return null;

      // 0) Trash drop — pointer in the bottom-right FAB zone removes the
      //    lifted bubble. Before removing, snapshot the bubble to the
      //    filesystem so it can be summoned back from the vault later.
      //    Skip placeholders (they have no content worth saving).
      const cRect = containerRef.current?.getBoundingClientRect();
      if (cRect) {
        const px = e.clientX - cRect.left;
        const py = e.clientY - cRect.top;
        if (px > cRect.width - 80 && py > cRect.height - 80) {
          const inst = liftedBundle.instance;
          if (inst && inst.type !== 'placeholder') {
            if (inst.fileId) {
              updateFileInstance(inst.fileId, inst);
            } else {
              const defaultLabel = PRIMITIVE_LABELS[inst.type];
              const isDefaultName = inst.title === defaultLabel;
              createFile({
                name: isDefaultName ? undefined : inst.title,
                type: inst.type,
                scope: 'workspace',
                workspaceId: workspace.id,
                instance: inst,
              });
            }
            bumpFs();
          }
          setRegistry((prev) => {
            const next = { ...prev };
            delete next[current.bubbleId];
            return next;
          });
          return null;
        }
      }

      // 1) Screen-edge drop — segmented by which bubbles actually touch that
      //    edge in the pointer's perpendicular position. If two bubbles stack
      //    vertically against the left edge, the left edge has two zones;
      //    dropping in either becomes an in-bubble left-side split of that
      //    specific bubble (not a full-height column).
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const EDGE_PX = 24;
        const px = e.clientX - containerRect.left;
        const py = e.clientY - containerRect.top;
        let edge: 'top' | 'bottom' | 'left' | 'right' | null = null;
        if (py < EDGE_PX) edge = 'top';
        else if (py > containerRect.height - EDGE_PX) edge = 'bottom';
        else if (px < EDGE_PX) edge = 'left';
        else if (px > containerRect.width - EDGE_PX) edge = 'right';
        if (edge) {
          const col = pxToCol(e.clientX);
          const row = pxToRow(e.clientY);
          const { leaves } = renderBSP(root);
          // Find the leaf adjacent to this edge whose perpendicular span
          // contains the pointer.
          const segment = leaves.find((l) => {
            if (edge === 'top') return l.region.row === 0 && col >= l.region.col && col < l.region.col + l.region.w;
            if (edge === 'bottom') return l.region.row + l.region.h === grid.rows && col >= l.region.col && col < l.region.col + l.region.w;
            if (edge === 'left') return l.region.col === 0 && row >= l.region.row && row < l.region.row + l.region.h;
            return l.region.col + l.region.w === grid.cols && row >= l.region.row && row < l.region.row + l.region.h;
          });
          if (segment) {
            const after = splitLeafInsert(
              root,
              segment.bubbleId,
              edge,
              current.bubbleId,
              liftedBundle.minW,
              liftedBundle.minH,
              0.3,
            );
            setRoot(after);
            return null;
          }
          // Fallback (shouldn't normally happen — workspace is fully tiled).
          const after = splitRootInsert(root, edge, current.bubbleId, liftedBundle.minW, liftedBundle.minH, 0.3);
          setRoot(after);
          return null;
        }
      }

      // 2) In-bubble drop. Split point follows the pointer (not 50/50), and
      //    snaps to nearby existing alignment lines so the dropped bubble
      //    naturally lines up with the rest of the layout.
      const col = pxToCol(e.clientX);
      const row = pxToRow(e.clientY);
      const { leaves, splits } = renderBSP(root);
      const target = leaves.find(
        (l) =>
          col >= l.region.col &&
          col < l.region.col + l.region.w &&
          row >= l.region.row &&
          row < l.region.row + l.region.h,
      );
      if (!target) {
        setRoot(current.originalRoot);
        return null;
      }

      const targetBundle = registry[target.bubbleId];

      // Drop on chat: open the attach-relationship menu instead of splitting.
      // The lifted bubble sits in limbo (BSP already excludes it) until the
      // user picks a relationship or cancels.
      if (
        targetBundle?.instance?.type === 'llm-chat' &&
        current.bubbleId !== target.bubbleId
      ) {
        const sourceBundle = registry[current.bubbleId];
        const sourceTitle = sourceBundle?.instance?.title ?? sourceBundle?.cellRef?.id ?? current.bubbleId;
        setAttachMenu({
          sourceBubbleId: current.bubbleId,
          sourceTitle,
          chatId: target.bubbleId,
          chatTitle: targetBundle.instance.title,
          originalRoot: current.originalRoot,
          anchorX: e.clientX,
          anchorY: e.clientY,
        });
        return null;
      }

      // Drop on placeholder: consume the placeholder, take its exact slot.
      if (targetBundle?.instance?.type === 'placeholder') {
        const after = replaceLeaf(root, target.bubbleId, current.bubbleId);
        setRoot(after);
        setRegistry((prev) => {
          const next = { ...prev };
          delete next[target.bubbleId];
          return next;
        });
        return null;
      }

      // Side = closest edge of target.
      const relX = (col - target.region.col) / target.region.w;
      const relY = (row - target.region.row) / target.region.h;
      const distLeft = relX;
      const distRight = 1 - relX;
      const distTop = relY;
      const distBottom = 1 - relY;
      const minDist = Math.min(distLeft, distRight, distTop, distBottom);
      let side: 'left' | 'right' | 'top' | 'bottom';
      if (minDist === distLeft) side = 'left';
      else if (minDist === distRight) side = 'right';
      else if (minDist === distTop) side = 'top';
      else side = 'bottom';

      // Desired split position = pointer's grid coord on the perpendicular axis.
      const orientation: 'v' | 'h' = side === 'left' || side === 'right' ? 'v' : 'h';
      const desiredSplitAt = orientation === 'v' ? col : row;

      // Snap to a nearby existing splitter line in the same orientation —
      // gives "drop and align with what's already there" behavior.
      const SNAP_THRESHOLD = 1.5;
      let snappedSplitAt = desiredSplitAt;
      let bestDist = SNAP_THRESHOLD;
      for (const s of splits) {
        if (s.orientation !== orientation) continue;
        const dist = Math.abs(s.splitAt - desiredSplitAt);
        if (dist < bestDist) {
          bestDist = dist;
          snappedSplitAt = s.splitAt;
        }
      }

      // Convert split position to a ratio of target's relevant dimension,
      // clamped so neither half collapses past min size.
      let ratio: number;
      if (side === 'left') {
        ratio = (snappedSplitAt - target.region.col) / target.region.w;
      } else if (side === 'right') {
        ratio = (target.region.col + target.region.w - snappedSplitAt) / target.region.w;
      } else if (side === 'top') {
        ratio = (snappedSplitAt - target.region.row) / target.region.h;
      } else {
        ratio = (target.region.row + target.region.h - snappedSplitAt) / target.region.h;
      }
      ratio = Math.max(0.1, Math.min(0.9, ratio));

      const after = splitLeafInsert(
        root,
        target.bubbleId,
        side,
        current.bubbleId,
        liftedBundle.minW,
        liftedBundle.minH,
        ratio,
      );
      setRoot(after);
      return null;
    });
  }

  // === Attach to chat ===
  function commitAttach(rel: AttachRelationship): void {
    if (!attachMenu) return;
    const { sourceBubbleId, chatId, originalRoot, sourceTitle } = attachMenu;
    // Ensure the source bubble is file-backed before attaching. If it's
    // unnamed (title == its primitive's default label), auto-name it. The
    // mini-bubble label and brain entry then reflect the algorithmic name.
    const source = registry[sourceBubbleId]?.instance;
    let attachLabel = sourceTitle;
    if (source && source.type !== 'placeholder' && !source.fileId) {
      const defaultLabel = PRIMITIVE_LABELS[source.type];
      const isDefaultName = source.title === defaultLabel;
      const file = createFile({
        name: isDefaultName ? undefined : source.title,
        type: source.type,
        scope: 'workspace',
        workspaceId: workspace.id,
        instance: source,
      });
      attachLabel = file.name;
      bumpFs();
      // Mutate the registry instance to carry the fileId and updated title.
      setRegistry((prev) => {
        const b = prev[sourceBubbleId];
        if (!b?.instance) return prev;
        return {
          ...prev,
          [sourceBubbleId]: {
            ...b,
            instance: { ...b.instance, fileId: file.id, title: file.name },
          },
        };
      });
    }
    // Add a mini-bubble to the chat's brain (mutate registry).
    setRegistry((prev) => {
      const chat = prev[chatId];
      if (!chat?.instance) return prev;
      const oldProps = chat.instance.props as ChatProps;
      const oldMini: MiniBubble[] = oldProps.brain?.miniBubbles ?? [];
      const newMini: MiniBubble = {
        id: `mb-${sourceBubbleId}-${rel}-${Date.now()}`,
        label: attachLabel,
        source: sourceBubbleId,
        pinned: rel === 'edit' || rel === 'summary',
        relationship: rel,
      };
      return {
        ...prev,
        [chatId]: {
          ...chat,
          instance: {
            ...chat.instance,
            props: {
              ...oldProps,
              brain: {
                miniBubbles: [...oldMini, newMini],
                hydrationRules: oldProps.brain?.hydrationRules ?? {},
              },
            },
          },
        },
      };
    });
    if (rel === 'summary') {
      // Source is consumed — remove from registry; BSP already excludes it.
      setRegistry((prev) => {
        const next = { ...prev };
        delete next[sourceBubbleId];
        return next;
      });
    } else {
      // Source returns to its original slot (still on screen, now linked).
      setRoot(originalRoot);
    }
    setAttachMenu(null);
  }

  function cancelAttach(): void {
    if (!attachMenu) return;
    setRoot(attachMenu.originalRoot);
    setAttachMenu(null);
  }

  function updateChatMessages(chatId: string, messages: unknown[]): void {
    setRegistry((prev) => {
      const chat = prev[chatId];
      if (!chat?.instance) return prev;
      return {
        ...prev,
        [chatId]: {
          ...chat,
          instance: {
            ...chat.instance,
            props: { ...chat.instance.props, messages },
          },
        },
      };
    });
  }

  // Markdown body edits flow back here. If the bubble is file-backed, we also
  // write through to the underlying MeridianFile so a reload restores edits.
  function updateMarkdownBody(bubbleId: string, body: string): void {
    setRegistry((prev) => {
      const b = prev[bubbleId];
      if (!b?.instance) return prev;
      const nextInstance = {
        ...b.instance,
        props: { ...b.instance.props, body },
      };
      if (nextInstance.fileId) {
        updateFileInstance(nextInstance.fileId, nextInstance);
        bumpFs();
      }
      return { ...prev, [bubbleId]: { ...b, instance: nextInstance } };
    });
  }

  // Asked by a bubble to grow a sibling toward `targetShare` of the immediate
  // parent split. Used by clinical-module-card to give the FAQ panel room
  // when a row is tapped — without losing sight of the checkbox. Idempotent:
  // if the target already has at least targetShare of its parent split,
  // we don't push it bigger (so manual user-drags aren't fought).
  function requestSiblingFocus(targetBubbleId: string, targetShare: number): void {
    setRoot((prev) => {
      if (!prev) return prev;
      const parent = findParentSplit(prev.node, prev.region, targetBubbleId, null);
      if (!parent) return prev;
      const span = parent.orientation === 'h' ? parent.region.h : parent.region.w;
      const start = parent.orientation === 'h' ? parent.region.row : parent.region.col;
      const currentTargetShare =
        parent.childIdx === 0
          ? (parent.splitAt - start) / span
          : (start + span - parent.splitAt) / span;
      if (currentTargetShare >= targetShare - 0.02) return prev;
      const desired =
        parent.childIdx === 0
          ? start + targetShare * span
          : start + (1 - targetShare) * span;
      return setSplitAt(prev, parent.splitId, desired);
    });
  }

  function toggleMarkdownEditable(bubbleId: string): void {
    setRegistry((prev) => {
      const b = prev[bubbleId];
      if (!b?.instance) return prev;
      const cur = (b.instance.props as { editable?: boolean }).editable === true;
      const nextInstance = {
        ...b.instance,
        props: { ...b.instance.props, editable: !cur },
      };
      if (nextInstance.fileId) {
        updateFileInstance(nextInstance.fileId, nextInstance);
        bumpFs();
      }
      return { ...prev, [bubbleId]: { ...b, instance: nextInstance } };
    });
  }

  function dismissMini(chatId: string, miniId: string): void {
    setRegistry((prev) => {
      const chat = prev[chatId];
      if (!chat?.instance) return prev;
      const oldProps = chat.instance.props as ChatProps;
      const oldMini: MiniBubble[] = oldProps.brain?.miniBubbles ?? [];
      return {
        ...prev,
        [chatId]: {
          ...chat,
          instance: {
            ...chat.instance,
            props: {
              ...oldProps,
              brain: {
                miniBubbles: oldMini.filter((m) => m.id !== miniId),
                hydrationRules: oldProps.brain?.hydrationRules ?? {},
              },
            },
          },
        },
      };
    });
  }

  function setMiniRelationship(chatId: string, miniId: string, rel: AttachRelationship): void {
    setRegistry((prev) => {
      const chat = prev[chatId];
      if (!chat?.instance) return prev;
      const oldProps = chat.instance.props as ChatProps;
      const oldMini: MiniBubble[] = oldProps.brain?.miniBubbles ?? [];
      return {
        ...prev,
        [chatId]: {
          ...chat,
          instance: {
            ...chat.instance,
            props: {
              ...oldProps,
              brain: {
                miniBubbles: oldMini.map((m) =>
                  m.id === miniId
                    ? { ...m, relationship: rel, pinned: rel === 'edit' || rel === 'summary' }
                    : m,
                ),
                hydrationRules: oldProps.brain?.hydrationRules ?? {},
              },
            },
          },
        },
      };
    });
  }

  // === Vault (tap a placeholder to assign a real type) ===
  function pickFromVault(type: BubblePrimitiveType, label: string): void {
    if (!vaultOpen) return;
    const id = vaultOpen.placeholderId;
    setRegistry((prev) => {
      const ph = prev[id];
      if (!ph?.instance) return prev;
      return {
        ...prev,
        [id]: {
          ...ph,
          instance: {
            ...ph.instance,
            type,
            title: label,
            props: {},
          },
        },
      };
    });
    setVaultOpen(null);
  }

  // Restore a file's saved bubble into the placeholder's slot. The placeholder's
  // own id, attach, resize stay — we adopt the file's type, title, and props,
  // and link back via fileId so future trash overwrites this file.
  function pickFromFile(file: MeridianFile): void {
    if (!vaultOpen) return;
    const id = vaultOpen.placeholderId;
    setRegistry((prev) => {
      const ph = prev[id];
      if (!ph?.instance) return prev;
      return {
        ...prev,
        [id]: {
          ...ph,
          instance: {
            ...ph.instance,
            type: file.instance.type,
            title: file.name,
            props: file.instance.props,
            fileId: file.id,
          },
        },
      };
    });
    setVaultOpen(null);
    setRenamingFileId(null);
  }

  function commitRename(fileId: string): void {
    const trimmed = renameDraft.trim();
    if (trimmed) {
      const updated = updateFileName(fileId, trimmed);
      // If a live bubble is viewing this file, refresh its title too.
      if (updated) {
        setRegistry((prev) => {
          let changed = false;
          const next: typeof prev = {};
          for (const [k, b] of Object.entries(prev)) {
            if (b.instance?.fileId === fileId && b.instance.title !== updated.name) {
              next[k] = { ...b, instance: { ...b.instance, title: updated.name } };
              changed = true;
            } else {
              next[k] = b;
            }
          }
          return changed ? next : prev;
        });
      }
      bumpFs();
    }
    setRenamingFileId(null);
  }

  // === Summon placeholder ===
  function summonPlaceholder(): void {
    if (!root) return;
    const target = findLargestLeaf(root);
    if (!target) return;
    const id = `placeholder-${++_placeholderSeq}`;
    const newBundle: BubbleBundle = {
      kind: 'standalone',
      cellRef: null,
      instance: {
        id,
        type: 'placeholder',
        title: 'Empty slot',
        props: {},
        resize: { initial: 'm', states: {} },
      },
      placement: { col: 0, row: 0, width: 1, height: 1 }, // not used post-insert
      minW: DEFAULT_MIN_W,
      minH: DEFAULT_MIN_H,
    };
    setRegistry((prev) => ({ ...prev, [id]: newBundle }));
    setRoot(splitLeafInsert(root, target.bubbleId, 'right', id, DEFAULT_MIN_W, DEFAULT_MIN_H, 0.5));
  }

  // === Reset workspace LAYOUT (positions only) ===
  // Returns every JSON-template bubble to its original placement and size.
  // PRESERVES chat history, attached brain items, and any other state on
  // template bubbles. Drops bubbles that aren't in the JSON template
  // (summoned placeholders, vault picks). Chat content has its own
  // compact/clear inside the chat — workspace reset doesn't touch it.
  function resetWorkspace(): void {
    setRegistry((prev) => {
      const next: Record<string, BubbleBundle> = {};
      for (const cell of workspace.cells) {
        const p = placements[cell.id];
        if (!p) continue;
        const existing = prev[cell.id];
        next[cell.id] = existing
          ? { ...existing, placement: p }
          : {
              kind: 'cell',
              cellRef: cell,
              instance: null,
              placement: p,
              minW: CELL_MIN_W,
              minH: CELL_MIN_H,
            };
      }
      for (const std of workspace.standalones) {
        const p = placements[std.id];
        if (!p) continue;
        const existing = prev[std.id];
        next[std.id] = existing
          ? { ...existing, placement: p }
          : {
              kind: 'standalone',
              cellRef: null,
              instance: std,
              placement: p,
              minW: DEFAULT_MIN_W,
              minH: DEFAULT_MIN_H,
            };
      }
      return next;
    });
    setMaximized(null);
    setRoot(null); // buildBSP rebuilds from the now-template-positioned registry
    deleteWorkspaceState(workspace.id); // next persist will write the post-reset state
  }

  // === Save / load layouts ===
  function saveCurrentLayout(): void {
    if (!root) return;
    const snapshot: SavedLayout = {
      registry: cloneSnapshot(registry),
      root: cloneSnapshot(root),
      savedAt: Date.now(),
    };
    const next = [...saves, snapshot];
    setSaves(next);
    persistSavedLayouts(workspace.id, next);
  }

  function loadLayout(idx: number): void {
    const layout = saves[idx];
    if (!layout) return;
    setRegistry(cloneSnapshot(layout.registry));
    setRoot(cloneSnapshot(layout.root));
    setFabExpanded(false);
  }

  function deleteLayout(idx: number): void {
    const next = saves.filter((_, i) => i !== idx);
    setSaves(next);
    persistSavedLayouts(workspace.id, next);
  }

  // === FAB long-press ===
  const fabPressRef = useRef<{ timer: number | null } | null>(null);
  // Marks the pointerup that releases the gesture that just opened the
  // menu — so we don't immediately collapse it on finger-lift.
  const justExpandedRef = useRef(false);

  function onFabPointerDown(e: PointerEvent): void {
    e.stopPropagation();
    if (fabExpanded) return;
    fabPressRef.current = {
      timer: window.setTimeout(() => {
        setFabExpanded(true);
        justExpandedRef.current = true;
        fabPressRef.current = null;
      }, 380),
    };
  }
  function onFabPointerUp(e: PointerEvent): void {
    e.stopPropagation();
    if (justExpandedRef.current) {
      // The gesture that just expanded the menu is now releasing — ignore
      // this pointerup so the menu stays open until an actual selection.
      justExpandedRef.current = false;
      return;
    }
    if (fabExpanded) {
      // Tap while expanded = close. The "×" the FAB shows in this state
      // now does what it suggests.
      setFabExpanded(false);
      return;
    }
    const lp = fabPressRef.current;
    if (lp?.timer) {
      // Tap before long-press fired → summon placeholder (default action).
      window.clearTimeout(lp.timer);
      fabPressRef.current = null;
      summonPlaceholder();
    }
  }
  function onFabPointerCancel(e: PointerEvent): void {
    e.stopPropagation();
    if (fabPressRef.current?.timer) {
      window.clearTimeout(fabPressRef.current.timer);
      fabPressRef.current = null;
    }
    justExpandedRef.current = false;
  }

  // === Render ===
  const rendered = root ? renderBSP(root) : null;
  const corners = root ? findCorners(root) : [];

  const resolvedById = useMemo(() => {
    const m: Record<string, BubbleInstance> = {};
    for (const [id, b] of Object.entries(registry)) {
      if (b.instance) m[id] = { ...b.instance, props: resolveSeedTokens(b.instance.props, seeds) };
    }
    return m;
  }, [registry, seeds]);

  return (
    <div
      ref={containerRef}
      class={`bsp-workspace${lifted ? ' is-lifting' : ''}`}
      style={{ position: 'fixed', inset: 0, padding: 0, background: 'var(--bg)' }}
    >
      {rendered === null && (
        <div style={{ padding: 24, color: 'var(--ink-faint)' }}>
          BSP layout failed to construct.
        </div>
      )}

      {/* Leaves */}
      {rendered?.leaves.map((leaf) => {
        const b = registry[leaf.bubbleId];
        if (!b) return null;
        const left = (leaf.region.col / grid.cols) * 100;
        const top = (leaf.region.row / grid.rows) * 100;
        const width = (leaf.region.w / grid.cols) * 100;
        const height = (leaf.region.h / grid.rows) * 100;
        const isPlaceholder = b.instance?.type === 'placeholder';
        const baseClass = b.kind === 'cell' ? 'cell' : 'bubble';
        const phClass = isPlaceholder ? ' bubble--placeholder' : '';
        const typeClass = b.instance?.type ? ` t-${b.instance.type}` : '';
        const isHidden = lifted?.bubbleId === leaf.bubbleId;

        const style: JSX.CSSProperties = {
          position: 'absolute',
          left: `calc(${left}% + 4px)`,
          top: `calc(${top}% + 4px)`,
          width: `calc(${width}% - 8px)`,
          height: `calc(${height}% - 8px)`,
          transition: isWallDragging
            ? 'none'
            : 'left 240ms cubic-bezier(0.2, 0.8, 0.2, 1), top 240ms cubic-bezier(0.2, 0.8, 0.2, 1), width 240ms cubic-bezier(0.2, 0.8, 0.2, 1), height 240ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms',
          overflow: 'hidden',
          opacity: isHidden ? 0 : 1,
          touchAction: 'none',
        };

        const handlers = {
          onPointerDown: (e: PointerEvent) =>
            onBubblePointerDown(e, leaf, e.currentTarget as HTMLElement),
          onPointerMove: onBubblePointerMove,
          onPointerUp: onBubblePointerUp,
          onPointerCancel: onBubblePointerUp,
        };

        if (b.kind === 'cell' && b.cellRef) {
          return (
            <div key={leaf.bubbleId} class={`${baseClass}${phClass}${typeClass}`} style={style} {...handlers}>
              <Cell cell={b.cellRef} workspace={workspace} seeds={seeds} />
            </div>
          );
        }
        const inst = resolvedById[leaf.bubbleId];
        if (!inst) return null;
        const Comp = getPrimitiveComponent(inst.type);
        const extraProps = inst.type === 'llm-chat'
          ? {
              onDismissMini: (miniId: string) => dismissMini(leaf.bubbleId, miniId),
              onSetMiniRelationship: (miniId: string, rel: AttachRelationship) =>
                setMiniRelationship(leaf.bubbleId, miniId, rel),
              onMessagesChange: (messages: unknown[]) => updateChatMessages(leaf.bubbleId, messages),
              brainContext: buildBrainContext(
                ((inst.props as ChatProps).brain?.miniBubbles) ?? [],
                registry,
              ),
              workspaceTitle: workspace.title,
            }
          : inst.type === 'markdown'
          ? {
              onBodyChange: (body: string) => updateMarkdownBody(leaf.bubbleId, body),
              onToggleEditable: () => toggleMarkdownEditable(leaf.bubbleId),
            }
          : inst.type === 'clinical-module-checklist'
            || inst.type === 'clinical-module-escalations'
            || inst.type === 'clinical-module-faq'
          ? {
              workspaceId: workspace.id,
              selfBubbleId: leaf.bubbleId,
              onRequestSiblingFocus: (targetId: string, share: number) => requestSiblingFocus(targetId, share),
            }
          : {};
        return (
          <div key={leaf.bubbleId} class={`${baseClass}${phClass}${typeClass}`} style={style} {...handlers}>
            <Comp instance={inst} seeds={seeds} {...extraProps} />
          </div>
        );
      })}

      {/* Splitter walls */}
      {rendered?.splits.map((s) => (
        <SplitterHandle
          key={s.id}
          split={s}
          gridCols={grid.cols}
          gridRows={grid.rows}
          isDragging={isWallDragging}
          onPointerDown={(e) => onSplitterDown(e, s)}
          onPointerMove={(e) => onSplitterMove(e, s)}
          onPointerUp={onSplitterUp}
        />
      ))}

      {/* Corner handles */}
      {corners.map((c, i) => (
        <CornerHandle
          key={`${c.hSplitId}-${c.vSplitId}-${i}`}
          corner={c}
          gridCols={grid.cols}
          gridRows={grid.rows}
          isDragging={isWallDragging}
          onPointerDown={(e) => onCornerDown(e, c)}
          onPointerMove={(e) => onCornerMove(e, c)}
          onPointerUp={onCornerUp}
        />
      ))}

      {/* Ghost bubble (during lift) */}
      {lifted && (() => {
        const b = registry[lifted.bubbleId];
        if (!b) return null;
        if (b.kind === 'cell' && b.cellRef) {
          return (
            <div
              key="ghost"
              class="cell bubble--ghost"
              style={{
                position: 'fixed',
                left: lifted.pointerX - lifted.offsetX,
                top: lifted.pointerY - lifted.offsetY,
                width: lifted.ghostW,
                height: lifted.ghostH,
                pointerEvents: 'none',
                zIndex: 200,
                transform: 'scale(1.04)',
                opacity: 0.92,
                boxShadow: 'var(--shadow-2)',
                transition: 'none',
              }}
            >
              <Cell cell={b.cellRef} workspace={workspace} seeds={seeds} />
            </div>
          );
        }
        const inst = resolvedById[lifted.bubbleId];
        if (!inst) return null;
        const Comp = getPrimitiveComponent(inst.type);
        return (
          <div
            key="ghost"
            class="bubble bubble--ghost"
            style={{
              position: 'fixed',
              left: lifted.pointerX - lifted.offsetX,
              top: lifted.pointerY - lifted.offsetY,
              width: lifted.ghostW,
              height: lifted.ghostH,
              pointerEvents: 'none',
              zIndex: 200,
              transform: 'scale(1.04)',
              opacity: 0.92,
              boxShadow: 'var(--shadow-2)',
              transition: 'none',
            }}
          >
            <Comp instance={inst} seeds={seeds} />
          </div>
        );
      })()}

      {/* Edge drop zones (visible during lift) — segmented per bubble that touches each edge */}
      {lifted && rendered && (
        <>
          {rendered.leaves
            .filter((l) => l.region.row === 0)
            .map((l) => (
              <div
                key={`et-${l.bubbleId}`}
                class="bsp-edge bsp-edge--top"
                style={{
                  left: `calc(${(l.region.col / grid.cols) * 100}% + 3px)`,
                  width: `calc(${(l.region.w / grid.cols) * 100}% - 6px)`,
                }}
              />
            ))}
          {rendered.leaves
            .filter((l) => l.region.row + l.region.h === grid.rows)
            .map((l) => (
              <div
                key={`eb-${l.bubbleId}`}
                class="bsp-edge bsp-edge--bottom"
                style={{
                  left: `calc(${(l.region.col / grid.cols) * 100}% + 3px)`,
                  width: `calc(${(l.region.w / grid.cols) * 100}% - 6px)`,
                }}
              />
            ))}
          {rendered.leaves
            .filter((l) => l.region.col === 0)
            .map((l) => (
              <div
                key={`el-${l.bubbleId}`}
                class="bsp-edge bsp-edge--left"
                style={{
                  top: `calc(${(l.region.row / grid.rows) * 100}% + 3px)`,
                  height: `calc(${(l.region.h / grid.rows) * 100}% - 6px)`,
                }}
              />
            ))}
          {rendered.leaves
            .filter((l) => l.region.col + l.region.w === grid.cols)
            .map((l) => (
              <div
                key={`er-${l.bubbleId}`}
                class="bsp-edge bsp-edge--right"
                style={{
                  top: `calc(${(l.region.row / grid.rows) * 100}% + 3px)`,
                  height: `calc(${(l.region.h / grid.rows) * 100}% - 6px)`,
                }}
              />
            ))}
        </>
      )}

      {/* Vault — tap a placeholder to assign it a real bubble type, or restore
          a previously saved file (the dismissed-then-summoned-back flow). */}
      {vaultOpen && (() => {
        // fsTick forces re-evaluation when the filesystem mutates; reference it
        // so React re-renders. Module-level filesystem isn't reactive on its own.
        void fsTick;
        const localFiles = listFiles({ scope: 'workspace', workspaceId: workspace.id });
        const otherFiles = listFiles({ scope: 'workspace' }).filter(
          (f) => f.workspaceId !== workspace.id,
        );
        const globalFiles = listFiles({ scope: 'global' });
        const otherByWs: Record<string, MeridianFile[]> = {};
        for (const f of otherFiles) {
          const k = f.workspaceId ?? '?';
          (otherByWs[k] ??= []).push(f);
        }
        return (
          <div class="attach-menu-backdrop" onClick={() => { setVaultOpen(null); setRenamingFileId(null); }}>
            <div class="vault" onClick={(e) => e.stopPropagation()}>
              <div class="vault__hdr">
                <strong>Vault</strong>
                <div class="vault__sub">pick a primitive — or summon a saved file</div>
              </div>
              <div class="vault__grid">
                {VAULT_ITEMS.map((it) => (
                  <button key={it.type} class="vault__item" onClick={() => pickFromVault(it.type, it.label)}>
                    <span class="vault__glyph">{it.glyph}</span>
                    <span class="vault__lbl">{it.label}</span>
                    <span class="vault__desc">{it.desc}</span>
                  </button>
                ))}
              </div>

              <div class="vault__section">
                <div class="vault__section-hdr">This workspace · {workspace.title}</div>
                {localFiles.length === 0 ? (
                  <div class="vault__empty">no files yet — dismiss a bubble or attach an unnamed one to chat</div>
                ) : (
                  localFiles.map((f) => renderFileRow(f))
                )}
              </div>

              <div class="vault__section">
                <div class="vault__section-hdr">Other workspaces</div>
                {Object.keys(otherByWs).length === 0 ? (
                  <div class="vault__empty">nothing saved in other workspaces</div>
                ) : (
                  Object.entries(otherByWs).map(([wsid, files]) => (
                    <div key={wsid} class="vault__sub-section">
                      <div class="vault__sub-section-hdr">{wsid}</div>
                      {files.map((f) => renderFileRow(f))}
                    </div>
                  ))
                )}
              </div>

              <div class="vault__section">
                <div class="vault__section-hdr">Global</div>
                {globalFiles.length === 0 ? (
                  <div class="vault__empty">no global files yet</div>
                ) : (
                  globalFiles.map((f) => renderFileRow(f))
                )}
              </div>

              <button class="attach-menu__cancel" onClick={() => { setVaultOpen(null); setRenamingFileId(null); }}>Cancel</button>
            </div>
          </div>
        );

        function renderFileRow(f: MeridianFile): JSX.Element {
          const renaming = renamingFileId === f.id;
          return (
            <div key={f.id} class="vault__file">
              {renaming ? (
                <input
                  class="vault__file-rename"
                  autoFocus
                  value={renameDraft}
                  onInput={(e) => setRenameDraft((e.currentTarget as HTMLInputElement).value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename(f.id);
                    else if (e.key === 'Escape') setRenamingFileId(null);
                  }}
                  onBlur={() => commitRename(f.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <button
                  type="button"
                  class="vault__file-row"
                  onClick={() => pickFromFile(f)}
                  title="Summon into this slot"
                >
                  <span class="vault__file-name">{f.name}</span>
                  <span class="vault__file-type">{PRIMITIVE_LABELS[f.type] ?? f.type}</span>
                </button>
              )}
              {!renaming && (
                <button
                  type="button"
                  class="vault__file-rename-btn"
                  title="Rename"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenameDraft(f.name);
                    setRenamingFileId(f.id);
                  }}
                >
                  ✏️
                </button>
              )}
            </div>
          );
        }
      })()}

      {/* Attach-to-chat menu (modal) */}
      {attachMenu && (
        <div class="attach-menu-backdrop" onClick={cancelAttach}>
          <div class="attach-menu" onClick={(e) => e.stopPropagation()}>
            <div class="attach-menu__hdr">
              <strong>{attachMenu.sourceTitle}</strong> → <em>{attachMenu.chatTitle}</em>
              <div class="attach-menu__sub">What should I do with this?</div>
            </div>
            <button class="attach-menu__opt" onClick={() => commitAttach('deep')}>
              <span class="attach-menu__glyph">📖</span>
              <span class="attach-menu__lbl">Read deeply</span>
              <span class="attach-menu__desc">full content in active context · ready for open-book questions</span>
            </button>
            <button class="attach-menu__opt" onClick={() => commitAttach('summary')}>
              <span class="attach-menu__glyph">📝</span>
              <span class="attach-menu__lbl">Scan + summarize</span>
              <span class="attach-menu__desc">commit a summary to memory · dismiss the original</span>
            </button>
            <button class="attach-menu__opt" onClick={() => commitAttach('held')}>
              <span class="attach-menu__glyph">🔗</span>
              <span class="attach-menu__lbl">Held only</span>
              <span class="attach-menu__desc">title + a sentence of context · don't read the full document</span>
            </button>
            <button class="attach-menu__opt" onClick={() => commitAttach('edit')}>
              <span class="attach-menu__glyph">✏️</span>
              <span class="attach-menu__lbl">Editable</span>
              <span class="attach-menu__desc">I have write access · I'll modify this</span>
            </button>
            <button class="attach-menu__cancel" onClick={cancelAttach}>Cancel</button>
          </div>
        </div>
      )}

      {/* Multi-function FAB (bottom-right) */}
      {fabExpanded && (
        <div class="bsp-fab-backdrop" onClick={() => setFabExpanded(false)} />
      )}
      <div class={`bsp-fab-stack${fabExpanded ? ' is-expanded' : ''}${lifted ? ' is-trash' : ''}${trashHovered ? ' is-trash-active' : ''}`}>
        {fabExpanded && (
          <>
            <div class="bsp-fab-saves">
              {saves.map((_, i) => (
                <button
                  key={`save-${i}`}
                  class="bsp-fab-save bsp-fab-save--filled"
                  onClick={() => loadLayout(i)}
                  onContextMenu={(e) => { e.preventDefault(); deleteLayout(i); }}
                  title={`Load layout ${i + 1} (right-click or two-finger tap to delete)`}
                  aria-label={`Load saved layout ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                class="bsp-fab-save bsp-fab-save--empty"
                onClick={saveCurrentLayout}
                title={`Save current layout to slot ${saves.length + 1}`}
                aria-label={`Save layout to slot ${saves.length + 1}`}
              >
                {saves.length + 1}
              </button>
            </div>
            <button
              class="bsp-fab-action"
              onClick={() => { setFabExpanded(false); resetWorkspace(); }}
              title="Reset layout to template"
              aria-label="Reset layout"
            >
              ⟲
            </button>
            <button
              class="bsp-fab-action"
              onClick={() => { setFabExpanded(false); onBackToHome?.(); }}
              title="Back to home"
              aria-label="Back to home"
            >
              ←
            </button>
            <button
              class="bsp-fab-action"
              onClick={() => { setFabExpanded(false); summonPlaceholder(); }}
              title="Add empty bubble"
              aria-label="Add empty bubble"
            >
              +
            </button>
          </>
        )}
        <button
          class={`bsp-fab${lifted ? ' bsp-fab--trash' : ''}${trashHovered ? ' bsp-fab--trash-active' : ''}`}
          onPointerDown={lifted ? undefined : onFabPointerDown}
          onPointerUp={lifted ? undefined : onFabPointerUp}
          onPointerCancel={onFabPointerCancel}
          title={lifted ? 'Drop here to discard' : 'Tap to add bubble · long-press for menu'}
          aria-label={lifted ? 'Trash' : 'Workspace controls'}
        >
          {lifted ? '🗑' : fabExpanded ? '×' : '+'}
        </button>
      </div>
    </div>
  );
}

interface VaultItem {
  type: BubblePrimitiveType;
  label: string;
  glyph: string;
  desc: string;
}

const VAULT_ITEMS: VaultItem[] = [
  { type: 'markdown', label: 'Markdown notes', glyph: '📄', desc: 'free-text notes, agendas, plans' },
  { type: 'spreadsheet', label: 'Spreadsheet', glyph: '📊', desc: 'tabular data; exportable to Excel' },
  { type: 'email-thread', label: 'Email thread', glyph: '✉️', desc: 'discussion thread + drafting' },
  { type: 'faq-block', label: 'FAQ / reference', glyph: '📚', desc: 'expandable Q&A reference' },
  { type: 'blueprint-tree', label: 'Phased blueprint', glyph: '🗂', desc: 'phased checklist with status pills' },
  { type: 'dashboard-numbers', label: 'Metrics', glyph: '📈', desc: 'numbers + trends, resize-aware' },
  { type: 'meeting-tracker', label: 'Meeting tracker', glyph: '📅', desc: 'past + planned meetings, summaries' },
  { type: 'glidepath-chart', label: 'Glidepath', glyph: '🎯', desc: 'goal vs. current with target line' },
];

// Walks the BSP tree to find the immediate parent split of `bubbleId`.
// Returns the split's id, orientation, current splitAt, the parent split's
// own region, and which child (0 or 1) contains the target. Used by
// requestSiblingFocus to grow a target bubble toward a target share.
interface ParentSplitInfo {
  splitId: string;
  orientation: 'h' | 'v';
  splitAt: number;
  region: Region;
  childIdx: 0 | 1;
}

function findParentSplit(
  node: BSPNode,
  region: Region,
  bubbleId: string,
  parent: ParentSplitInfo | null,
): ParentSplitInfo | null {
  if (node.kind === 'leaf') {
    return node.bubbleId === bubbleId ? parent : null;
  }
  const aRegion: Region =
    node.orientation === 'h'
      ? { col: region.col, row: region.row, w: region.w, h: node.splitAt - region.row }
      : { col: region.col, row: region.row, w: node.splitAt - region.col, h: region.h };
  const bRegion: Region =
    node.orientation === 'h'
      ? { col: region.col, row: node.splitAt, w: region.w, h: region.row + region.h - node.splitAt }
      : { col: node.splitAt, row: region.row, w: region.col + region.w - node.splitAt, h: region.h };
  const a = findParentSplit(node.children[0], aRegion, bubbleId, {
    splitId: node.id, orientation: node.orientation, splitAt: node.splitAt, region, childIdx: 0,
  });
  if (a) return a;
  return findParentSplit(node.children[1], bRegion, bubbleId, {
    splitId: node.id, orientation: node.orientation, splitAt: node.splitAt, region, childIdx: 1,
  });
}

function initialRegistry(workspace: WorkspaceConfig, placements: Record<string, GridPlacement>): Record<string, BubbleBundle> {
  const m: Record<string, BubbleBundle> = {};
  for (const cell of workspace.cells) {
    const p = placements[cell.id];
    if (!p) continue;
    m[cell.id] = {
      kind: 'cell',
      cellRef: cell,
      instance: null,
      placement: p,
      minW: CELL_MIN_W,
      minH: CELL_MIN_H,
    };
  }
  for (const b of workspace.standalones) {
    const p = placements[b.id];
    if (!p) continue;
    m[b.id] = {
      kind: 'standalone',
      cellRef: null,
      instance: b,
      placement: p,
      minW: DEFAULT_MIN_W,
      minH: DEFAULT_MIN_H,
    };
  }
  return m;
}

interface SplitterProps {
  split: RenderedSplit;
  gridCols: number;
  gridRows: number;
  isDragging: boolean;
  onPointerDown: (e: PointerEvent) => void;
  onPointerMove: (e: PointerEvent) => void;
  onPointerUp: (e: PointerEvent) => void;
}

function SplitterHandle({ split, gridCols, gridRows, isDragging, onPointerDown, onPointerMove, onPointerUp }: SplitterProps): JSX.Element {
  const horizontal = split.orientation === 'h';
  const transition = isDragging ? 'none' : 'left 240ms cubic-bezier(0.2, 0.8, 0.2, 1), top 240ms cubic-bezier(0.2, 0.8, 0.2, 1)';
  const style: JSX.CSSProperties = horizontal
    ? {
        position: 'absolute',
        left: `${(split.lineCol1 / gridCols) * 100}%`,
        width: `${((split.lineCol2 - split.lineCol1) / gridCols) * 100}%`,
        top: `calc(${(split.splitAt / gridRows) * 100}% - 8px)`,
        height: 16,
        cursor: 'row-resize',
        touchAction: 'none',
        zIndex: 50,
        transition,
      }
    : {
        position: 'absolute',
        top: `${(split.lineRow1 / gridRows) * 100}%`,
        height: `${((split.lineRow2 - split.lineRow1) / gridRows) * 100}%`,
        left: `calc(${(split.splitAt / gridCols) * 100}% - 8px)`,
        width: 16,
        cursor: 'col-resize',
        touchAction: 'none',
        zIndex: 50,
        transition,
      };
  return (
    <div
      class={`bsp-splitter bsp-splitter--${split.orientation}`}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
}

interface CornerProps {
  corner: BSPCorner;
  gridCols: number;
  gridRows: number;
  isDragging: boolean;
  onPointerDown: (e: PointerEvent) => void;
  onPointerMove: (e: PointerEvent) => void;
  onPointerUp: (e: PointerEvent) => void;
}

function CornerHandle({ corner, gridCols, gridRows, isDragging, onPointerDown, onPointerMove, onPointerUp }: CornerProps): JSX.Element {
  const transition = isDragging ? 'none' : 'left 240ms cubic-bezier(0.2, 0.8, 0.2, 1), top 240ms cubic-bezier(0.2, 0.8, 0.2, 1)';
  const style: JSX.CSSProperties = {
    position: 'absolute',
    left: `calc(${(corner.col / gridCols) * 100}% - 14px)`,
    top: `calc(${(corner.row / gridRows) * 100}% - 14px)`,
    width: 28,
    height: 28,
    cursor: 'move',
    touchAction: 'none',
    zIndex: 60,
    borderRadius: '50%',
    transition,
  };
  return (
    <div
      class="bsp-corner"
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
}

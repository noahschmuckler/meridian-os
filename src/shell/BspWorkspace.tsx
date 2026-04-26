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
import type { BubbleInstance, GridPlacement, WorkspaceConfig } from '../types';
import { Cell } from '../cell/Cell';
import { getPrimitiveComponent } from '../bubbles';
import type { SeedDict } from '../data/seedResolver';
import { resolveSeedTokens } from '../data/seedResolver';
import {
  buildBSP,
  renderBSP,
  setSplitAt,
  findCorners,
  removeLeaf,
  splitLeafInsert,
  replaceLeaf,
  findLargestLeaf,
  type BSPRoot,
  type RenderedSplit,
  type BSPCorner,
  type RenderedLeaf,
} from '../mechanics/bsp';

interface Props {
  workspace: WorkspaceConfig;
  seeds: SeedDict;
}

interface BubbleBundle {
  kind: 'cell' | 'standalone';
  cellRef: WorkspaceConfig['cells'][number] | null;
  instance: BubbleInstance | null;
  placement: GridPlacement;
  minW: number;
  minH: number;
}

const DEFAULT_MIN_W = 1;
const DEFAULT_MIN_H = 1;
const CELL_MIN_W = 1;
const CELL_MIN_H = 1;
const LONG_PRESS_MS = 380;
const LONG_PRESS_MOVE_TOLERANCE_PX = 8;

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

export function BspWorkspace({ workspace, seeds }: Props): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const grid = workspace.layoutHints.grid;
  const placements = workspace.layoutHints.placements;

  // Bubble registry: dynamic — placeholders summoned at runtime live here.
  const [registry, setRegistry] = useState<Record<string, BubbleBundle>>(() =>
    initialRegistry(workspace, placements),
  );

  // Reset on workspace change.
  useEffect(() => {
    setRegistry(initialRegistry(workspace, placements));
    setLifted(null);
  }, [workspace.id]);

  const [root, setRoot] = useState<BSPRoot | null>(null);
  const [isWallDragging, setIsWallDragging] = useState(false);
  const [lifted, setLifted] = useState<LiftedState | null>(null);

  useEffect(() => {
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
      setRoot(null);
    }
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
    if (lp?.timer) window.clearTimeout(lp.timer);
    longPressRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // already released
    }
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

  // While lifted: track pointer at window level + commit on release
  useEffect(() => {
    if (!lifted) return;
    function onMove(e: PointerEvent): void {
      setLifted((prev) => (prev ? { ...prev, pointerX: e.clientX, pointerY: e.clientY } : null));
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

      // Find target leaf under pointer
      const col = pxToCol(e.clientX);
      const row = pxToRow(e.clientY);
      const { leaves } = renderBSP(root);
      const target = leaves.find(
        (l) =>
          col >= l.region.col &&
          col < l.region.col + l.region.w &&
          row >= l.region.row &&
          row < l.region.row + l.region.h,
      );

      if (!target) {
        // Invalid drop — restore original layout
        setRoot(current.originalRoot);
        return null;
      }

      const targetBundle = registry[target.bubbleId];

      // Special: drop on placeholder = consume placeholder, take its slot
      if (targetBundle?.instance?.type === 'placeholder') {
        const after = replaceLeaf(root, target.bubbleId, current.bubbleId);
        setRoot(after);
        // Remove the placeholder from registry
        setRegistry((prev) => {
          const next = { ...prev };
          delete next[target.bubbleId];
          return next;
        });
        return null;
      }

      // Determine which side of target to drop on
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

      // 50/50 split — the dropped bubble takes half of the target's region
      const after = splitLeafInsert(root, target.bubbleId, side, current.bubbleId, liftedBundle.minW, liftedBundle.minH, 0.5);
      setRoot(after);
      return null;
    });
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
            <div key={leaf.bubbleId} class={`${baseClass}${phClass}`} style={style} {...handlers}>
              <Cell cell={b.cellRef} workspace={workspace} seeds={seeds} />
            </div>
          );
        }
        const inst = resolvedById[leaf.bubbleId];
        if (!inst) return null;
        const Comp = getPrimitiveComponent(inst.type);
        return (
          <div key={leaf.bubbleId} class={`${baseClass}${phClass}`} style={style} {...handlers}>
            <Comp instance={inst} seeds={seeds} />
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

      {/* Summon button */}
      <button
        class="bsp-summon"
        onClick={summonPlaceholder}
        title="Summon empty bubble"
        aria-label="Summon empty bubble"
      >
        +
      </button>
    </div>
  );
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

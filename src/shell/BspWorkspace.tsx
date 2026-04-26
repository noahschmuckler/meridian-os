// BSP-driven workspace renderer. Bubbles tile a soap-bubble cluster; splitter
// handles (between two siblings) and corner handles (where two splitters meet)
// drive the layout. Min-size constraints stop walls from squeezing a neighbor
// past readable size. Sub-cell-precision splitAt for continuous deformation.

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
  type BSPRoot,
  type RenderedSplit,
  type BSPCorner,
} from '../mechanics/bsp';

interface Props {
  workspace: WorkspaceConfig;
  seeds: SeedDict;
}

interface BubbleBundle {
  instance: BubbleInstance | null;
  cellRef: WorkspaceConfig['cells'][number] | null;
  placement: GridPlacement;
  minW: number;
  minH: number;
}

// Aggressive borderization: bubbles can shrink to a finger-catchable strip.
// At smallest sizes, content is hidden via container queries — just visible
// as a glass ribbon. User pulls the wall back out to restore it.
const DEFAULT_MIN_W = 1;
const DEFAULT_MIN_H = 1;
const CELL_MIN_W = 1;
const CELL_MIN_H = 1;

export function BspWorkspace({ workspace, seeds }: Props): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const grid = workspace.layoutHints.grid;
  const placements = workspace.layoutHints.placements;

  const bubbles = useMemo<BubbleBundle[]>(() => {
    const out: BubbleBundle[] = [];
    for (const cell of workspace.cells) {
      const p = placements[cell.id];
      if (!p) continue;
      out.push({ instance: null, cellRef: cell, placement: p, minW: CELL_MIN_W, minH: CELL_MIN_H });
    }
    for (const b of workspace.standalones) {
      const p = placements[b.id];
      if (!p) continue;
      out.push({
        instance: b,
        cellRef: null,
        placement: p,
        minW: DEFAULT_MIN_W,
        minH: DEFAULT_MIN_H,
      });
    }
    return out;
  }, [workspace]);

  const [root, setRoot] = useState<BSPRoot | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    try {
      const built = buildBSP(
        bubbles.map((b) => ({
          id: b.cellRef ? b.cellRef.id : b.instance!.id,
          placement: b.placement,
          minW: b.minW,
          minH: b.minH,
        })),
        { col: 0, row: 0, w: grid.cols, h: grid.rows },
      );
      setRoot(built);
    } catch (err) {
      console.warn('BSP construction failed; falling back to raw placements', err);
      setRoot(null);
    }
  }, [workspace.id]);

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

  const dragRef = useRef<{ kind: 'splitter' | 'corner'; ids: string[] } | null>(null);

  function onSplitterDown(e: PointerEvent, split: RenderedSplit): void {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { kind: 'splitter', ids: [split.id] };
    setIsDragging(true);
    e.preventDefault();
    e.stopPropagation();
  }
  function onSplitterMove(e: PointerEvent, split: RenderedSplit): void {
    if (!dragRef.current) return;
    if (!root) return;
    const target = split.orientation === 'h' ? pxToRow(e.clientY) : pxToCol(e.clientX);
    setRoot((prev) => (prev ? setSplitAt(prev, split.id, target) : prev));
  }
  function onSplitterUp(e: PointerEvent): void {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;
    setIsDragging(false);
  }

  function onCornerDown(e: PointerEvent, corner: BSPCorner): void {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { kind: 'corner', ids: [corner.hSplitId, corner.vSplitId] };
    setIsDragging(true);
    e.preventDefault();
    e.stopPropagation();
  }
  function onCornerMove(e: PointerEvent, corner: BSPCorner): void {
    if (!dragRef.current) return;
    if (!root) return;
    const newRow = pxToRow(e.clientY);
    const newCol = pxToCol(e.clientX);
    setRoot((prev) => {
      if (!prev) return prev;
      const afterH = setSplitAt(prev, corner.hSplitId, newRow);
      const afterV = setSplitAt(afterH, corner.vSplitId, newCol);
      return afterV;
    });
  }
  function onCornerUp(e: PointerEvent): void {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;
    setIsDragging(false);
  }

  const rendered = root ? renderBSP(root) : null;
  const corners = root ? findCorners(root) : [];

  const byId = useMemo<Record<string, BubbleBundle>>(() => {
    const m: Record<string, BubbleBundle> = {};
    for (const b of bubbles) {
      const id = b.cellRef ? b.cellRef.id : b.instance!.id;
      m[id] = b;
    }
    return m;
  }, [bubbles]);

  const resolvedStandalones = useMemo(() => {
    const m: Record<string, BubbleInstance> = {};
    for (const b of workspace.standalones) {
      m[b.id] = { ...b, props: resolveSeedTokens(b.props, seeds) };
    }
    return m;
  }, [workspace, seeds]);

  // Pixels for one grid cell — used to position handles.
  // (Bubbles themselves position via percentages; handles do too for consistency.)

  return (
    <div
      ref={containerRef}
      class="bsp-workspace"
      style={{
        position: 'fixed',
        inset: 0,
        padding: 0,
        background: 'var(--bg)',
      }}
    >
      {rendered === null && (
        <div style={{ padding: 24, color: 'var(--ink-faint)' }}>
          BSP layout failed to construct — workspace may have non-tileable placements.
        </div>
      )}

      {/* Leaves: bubbles in their BSP-computed regions, absolutely positioned by percent */}
      {rendered?.leaves.map((leaf) => {
        const b = byId[leaf.bubbleId];
        if (!b) return null;
        const left = (leaf.region.col / grid.cols) * 100;
        const top = (leaf.region.row / grid.rows) * 100;
        const width = (leaf.region.w / grid.cols) * 100;
        const height = (leaf.region.h / grid.rows) * 100;
        const style: JSX.CSSProperties = {
          position: 'absolute',
          left: `calc(${left}% + 4px)`,
          top: `calc(${top}% + 4px)`,
          width: `calc(${width}% - 8px)`,
          height: `calc(${height}% - 8px)`,
          transition: isDragging
            ? 'none'
            : 'left 240ms cubic-bezier(0.2, 0.8, 0.2, 1), top 240ms cubic-bezier(0.2, 0.8, 0.2, 1), width 240ms cubic-bezier(0.2, 0.8, 0.2, 1), height 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          overflow: 'hidden',
        };
        if (b.cellRef) {
          return (
            <div key={leaf.bubbleId} class="cell" style={style}>
              <Cell cell={b.cellRef} workspace={workspace} seeds={seeds} />
            </div>
          );
        }
        const inst = resolvedStandalones[leaf.bubbleId];
        if (!inst) return null;
        const Comp = getPrimitiveComponent(inst.type);
        return (
          <div key={leaf.bubbleId} class="bubble" style={style}>
            <Comp instance={inst} seeds={seeds} />
          </div>
        );
      })}

      {/* Splitter handles: percent-positioned over the wall between siblings */}
      {rendered?.splits.map((s) => (
        <SplitterHandle
          key={s.id}
          split={s}
          gridCols={grid.cols}
          gridRows={grid.rows}
          isDragging={isDragging}
          onPointerDown={(e) => onSplitterDown(e, s)}
          onPointerMove={(e) => onSplitterMove(e, s)}
          onPointerUp={onSplitterUp}
        />
      ))}

      {/* Corner handles: percent-positioned at each splitter intersection */}
      {corners.map((c, i) => (
        <CornerHandle
          key={`${c.hSplitId}-${c.vSplitId}-${i}`}
          corner={c}
          gridCols={grid.cols}
          gridRows={grid.rows}
          isDragging={isDragging}
          onPointerDown={(e) => onCornerDown(e, c)}
          onPointerMove={(e) => onCornerMove(e, c)}
          onPointerUp={onCornerUp}
        />
      ))}
    </div>
  );
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

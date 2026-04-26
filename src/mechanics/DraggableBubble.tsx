// DraggableBubble: wraps a child in a CSS-grid-placed container that supports
// pointer-driven drag (from anywhere on the bubble) and corner-resize.
// Touch-capable via Pointer Events + touch-action: none.
//
// During drag/resize: live tracked via CSS transform / size override (no layout thrash).
// On release: snaps to nearest grid cell and commits via onChange.

import { useRef, useState } from 'preact/hooks';
import type { ComponentChildren, JSX } from 'preact';
import type { GridPlacement } from '../types';

interface Props {
  placement: GridPlacement;
  gridCols: number;
  gridRows: number;
  containerRef: { current: HTMLDivElement | null };
  onChange: (next: GridPlacement) => void;
  children: ComponentChildren;
  className?: string;
  minWidth?: number;
  minHeight?: number;
}

interface DragState {
  dx: number;
  dy: number;
}
interface ResizeState {
  dw: number;
  dh: number;
}

const RESIZE_HANDLE_THRESHOLD = 18; // pixels from bottom-right corner

export function DraggableBubble({
  placement,
  gridCols,
  gridRows,
  containerRef,
  onChange,
  children,
  className,
  minWidth = 1,
  minHeight = 1,
}: Props): JSX.Element {
  const [drag, setDrag] = useState<DragState | null>(null);
  const [resize, setResize] = useState<ResizeState | null>(null);
  const startRef = useRef<{ x: number; y: number; mode: 'drag' | 'resize' } | null>(null);

  function getCellSize(): { w: number; h: number } {
    const c = containerRef.current;
    if (!c) return { w: 80, h: 80 };
    const r = c.getBoundingClientRect();
    return { w: r.width / gridCols, h: r.height / gridRows };
  }

  function isOnResizeHandle(target: HTMLElement, e: PointerEvent): boolean {
    const rect = target.getBoundingClientRect();
    return (
      e.clientX >= rect.right - RESIZE_HANDLE_THRESHOLD &&
      e.clientY >= rect.bottom - RESIZE_HANDLE_THRESHOLD
    );
  }

  function onPointerDown(e: PointerEvent): void {
    const el = e.currentTarget as HTMLElement;
    // Don't start drag/resize if the user clicked into a button or input nested inside.
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    el.setPointerCapture(e.pointerId);
    const mode: 'drag' | 'resize' = isOnResizeHandle(el, e) ? 'resize' : 'drag';
    startRef.current = { x: e.clientX, y: e.clientY, mode };
    if (mode === 'drag') setDrag({ dx: 0, dy: 0 });
    else setResize({ dw: 0, dh: 0 });
    e.preventDefault();
  }

  function onPointerMove(e: PointerEvent): void {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (startRef.current.mode === 'drag') setDrag({ dx, dy });
    else setResize({ dw: dx, dh: dy });
  }

  function onPointerUp(e: PointerEvent): void {
    if (!startRef.current) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    const { w, h } = getCellSize();
    if (startRef.current.mode === 'drag' && drag) {
      const newCol = clamp(placement.col + Math.round(drag.dx / w), 0, gridCols - placement.width);
      const newRow = clamp(placement.row + Math.round(drag.dy / h), 0, gridRows - placement.height);
      if (newCol !== placement.col || newRow !== placement.row) {
        onChange({ ...placement, col: newCol, row: newRow });
      }
    } else if (startRef.current.mode === 'resize' && resize) {
      const newWidth = clamp(
        placement.width + Math.round(resize.dw / w),
        minWidth,
        gridCols - placement.col,
      );
      const newHeight = clamp(
        placement.height + Math.round(resize.dh / h),
        minHeight,
        gridRows - placement.row,
      );
      if (newWidth !== placement.width || newHeight !== placement.height) {
        onChange({ ...placement, width: newWidth, height: newHeight });
      }
    }
    setDrag(null);
    setResize(null);
    startRef.current = null;
  }

  const isActive = drag !== null || resize !== null;
  const style: JSX.CSSProperties = {
    gridColumn: `${placement.col + 1} / span ${placement.width}`,
    gridRow: `${placement.row + 1} / span ${placement.height}`,
    transform: drag ? `translate(${drag.dx}px, ${drag.dy}px) scale(1.02)` : undefined,
    width: resize ? `calc(100% + ${resize.dw}px)` : undefined,
    height: resize ? `calc(100% + ${resize.dh}px)` : undefined,
    transition: isActive ? 'none' : 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 200ms',
    zIndex: isActive ? 100 : 1,
    boxShadow: isActive ? 'var(--shadow-2)' : undefined,
    touchAction: 'none', // prevent the browser from interpreting touch as scroll
    cursor: drag ? 'grabbing' : 'grab',
    position: 'relative',
  };

  return (
    <div
      class={className}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {children}
      <div class="bubble__resize" aria-label="resize" />
    </div>
  );
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

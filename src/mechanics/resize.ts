// Resize controller: corner-drag updates (cols, rows); threshold dispatch picks SizeKey.
// Continuous-with-snap. CSS picks up cell-grid sizing; primitive owns content adaptation via applyResize.

import type { SizeKey, ResizeState } from '../types';

export interface ResizeThresholds {
  // Order matters: smallest first. The first whose (cols, rows) is >= current size wins.
  steps: { size: SizeKey; minCols: number; minRows: number }[];
}

export const DEFAULT_THRESHOLDS: ResizeThresholds = {
  steps: [
    { size: 'xs', minCols: 1, minRows: 1 },
    { size: 's', minCols: 2, minRows: 1 },
    { size: 'm', minCols: 3, minRows: 2 },
    { size: 'l', minCols: 4, minRows: 3 },
    { size: 'xl', minCols: 6, minRows: 4 },
  ],
};

export function pickSizeKey(cols: number, rows: number, t: ResizeThresholds = DEFAULT_THRESHOLDS): SizeKey {
  let pick: SizeKey = 'xs';
  for (const step of t.steps) {
    if (cols >= step.minCols && rows >= step.minRows) {
      pick = step.size;
    }
  }
  return pick;
}

export interface ResizeHandleOptions {
  gridCellPx: number;
  minCols?: number;
  minRows?: number;
  maxCols?: number;
  maxRows?: number;
  onResize: (cols: number, rows: number, size: SizeKey) => void;
  thresholds?: ResizeThresholds;
}

/**
 * Attach a corner-drag resize handle to a host element.
 * Returns a cleanup function.
 */
export function attachResizeHandle(host: HTMLElement, handle: HTMLElement, opts: ResizeHandleOptions): () => void {
  const { gridCellPx, onResize } = opts;
  const minCols = opts.minCols ?? 1;
  const minRows = opts.minRows ?? 1;
  const maxCols = opts.maxCols ?? 12;
  const maxRows = opts.maxRows ?? 8;
  const thresholds = opts.thresholds ?? DEFAULT_THRESHOLDS;

  let startX = 0;
  let startY = 0;
  let startW = 0;
  let startH = 0;
  let dragging = false;

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dw = e.clientX - startX;
    const dh = e.clientY - startY;
    const w = startW + dw;
    const h = startH + dh;
    const cols = Math.max(minCols, Math.min(maxCols, Math.round(w / gridCellPx)));
    const rows = Math.max(minRows, Math.min(maxRows, Math.round(h / gridCellPx)));
    onResize(cols, rows, pickSizeKey(cols, rows, thresholds));
  };

  const onPointerUp = () => {
    dragging = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  const onPointerDown = (e: PointerEvent) => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = host.getBoundingClientRect();
    startW = rect.width;
    startH = rect.height;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    e.preventDefault();
  };

  handle.addEventListener('pointerdown', onPointerDown);

  return () => {
    handle.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };
}

/**
 * Resolve the final ResizeState for a primitive given its declared states.
 * Falls back to a default state shape if the primitive didn't declare this size.
 */
export function resolveResizeState(
  declared: Partial<Record<SizeKey, ResizeState>>,
  size: SizeKey,
): ResizeState {
  const d = declared[size];
  if (d) return d;
  // Sensible default: scale cols/rows with size, generic content modes.
  const defaults: Record<SizeKey, ResizeState> = {
    xs: { cols: 1, rows: 1, contentMode: 'compact', showChrome: false },
    s: { cols: 2, rows: 1, contentMode: 'compact', showChrome: true },
    m: { cols: 3, rows: 2, contentMode: 'detail', showChrome: true },
    l: { cols: 4, rows: 3, contentMode: 'detail', showChrome: true },
    xl: { cols: 6, rows: 4, contentMode: 'full', showChrome: true },
  };
  return defaults[size];
}

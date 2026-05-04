// Per-bubble font scale persistence. Each bubble (keyed by its instance id)
// can carry a multiplier that the BspWorkspace surfaces as the
// `--font-scale` CSS custom property. The bubble body's `zoom` rule reads
// the variable so inline px font sizes scale proportionally without
// per-bubble style changes. v1 stores in localStorage rather than on
// `instance.props` so the read path is dead simple — workspace ⟲ is
// layout-only and shouldn't reset reading preferences anyway.

import { signal } from '@preact/signals';

const STORAGE_KEY = 'meridian-os.bubbleFontScale.v1';
const MIN = 0.85;
const MAX = 1.4;
const STEP = 0.05;

function load(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, number>;
  } catch {
    /* ignore */
  }
  return {};
}

const _scales: Record<string, number> = load();

// Bumped on every mutation so any subscriber re-renders. Components that
// surface font-scale UI (FontSizeControls, BspWorkspace) read this in
// their render path to subscribe.
export const fontScaleVersionSignal = signal(0);

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_scales));
  } catch {
    /* ignore */
  }
  fontScaleVersionSignal.value++;
}

function clamp(v: number): number {
  return Math.max(MIN, Math.min(MAX, Math.round(v / STEP) * STEP));
}

export function getBubbleFontScale(bubbleId: string): number {
  return _scales[bubbleId] ?? 1;
}

export function setBubbleFontScale(bubbleId: string, scale: number): void {
  const next = clamp(scale);
  if (Math.abs(next - 1) < 0.001) {
    delete _scales[bubbleId];
  } else {
    _scales[bubbleId] = next;
  }
  persist();
}

export function adjustBubbleFontScale(bubbleId: string, delta: number): void {
  setBubbleFontScale(bubbleId, getBubbleFontScale(bubbleId) + delta);
}

export function resetBubbleFontScale(bubbleId: string): void {
  delete _scales[bubbleId];
  persist();
}

export const FONT_SCALE_STEP = STEP;

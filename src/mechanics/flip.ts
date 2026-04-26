// FLIP transition helper. First-Last-Invert-Play.
// Used for home→workspace expansion, workspace-to-workspace morph, attach/detach animations.

export interface FlipOptions {
  duration?: number;
  easing?: string;
}

export interface FlipSnapshot {
  rects: Map<string, DOMRect>;
}

/**
 * Capture bounding rects for a set of elements keyed by id.
 * Call before the layout change.
 */
export function captureFlip(elements: Map<string, HTMLElement>): FlipSnapshot {
  const rects = new Map<string, DOMRect>();
  elements.forEach((el, id) => {
    rects.set(id, el.getBoundingClientRect());
  });
  return { rects };
}

/**
 * After the layout change has been applied (DOM reordered / styles changed),
 * play the FLIP animation back to the new positions.
 */
export function playFlip(
  snapshot: FlipSnapshot,
  elements: Map<string, HTMLElement>,
  opts: FlipOptions = {},
): Promise<void> {
  const duration = opts.duration ?? 480;
  const easing = opts.easing ?? 'cubic-bezier(0.2, 0.8, 0.2, 1)';

  const animations: Animation[] = [];
  elements.forEach((el, id) => {
    const before = snapshot.rects.get(id);
    if (!before) return;
    const after = el.getBoundingClientRect();
    const dx = before.left - after.left;
    const dy = before.top - after.top;
    const sx = before.width / Math.max(after.width, 1);
    const sy = before.height / Math.max(after.height, 1);
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) {
      return;
    }
    const anim = el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
        { transform: 'translate(0, 0) scale(1, 1)' },
      ],
      { duration, easing, fill: 'both' },
    );
    animations.push(anim);
  });

  return Promise.all(animations.map((a) => a.finished)).then(() => {
    animations.forEach((a) => a.cancel());
  });
}

/**
 * Convenience: capture, run a layout-mutating function, then play.
 */
export async function flip(
  elements: Map<string, HTMLElement>,
  mutate: () => void | Promise<void>,
  opts?: FlipOptions,
): Promise<void> {
  const snap = captureFlip(elements);
  await mutate();
  await playFlip(snap, elements, opts);
}

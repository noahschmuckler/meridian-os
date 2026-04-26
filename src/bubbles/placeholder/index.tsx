// placeholder primitive: grey, non-functional bubble that holds a slot.
// Special drop behavior: when a real bubble is dropped onto it, the placeholder
// is consumed (replaced) — unlike all other bubbles which deform/move aside.

import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

export function Placeholder(_props: Props): JSX.Element {
  return (
    <div class="placeholder">
      <span class="placeholder__hint">empty slot</span>
      <span class="placeholder__sub">drop a bubble here</span>
    </div>
  );
}

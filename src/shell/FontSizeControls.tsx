// Three-button chrome control for adjusting a bubble's font size.
// Persists via bubbleFontScale's localStorage; BspWorkspace renders the
// resulting scale as a CSS custom property on the leaf so the body zooms.

import type { JSX } from 'preact';
import {
  FONT_SCALE_STEP,
  adjustBubbleFontScale,
  fontScaleVersionSignal,
  getBubbleFontScale,
  resetBubbleFontScale,
} from '../data/bubbleFontScale';

interface Props {
  bubbleId: string;
}

export function FontSizeControls({ bubbleId }: Props): JSX.Element {
  // subscribe — re-renders this component when scale changes anywhere
  fontScaleVersionSignal.value;
  const scale = getBubbleFontScale(bubbleId);
  const isDefault = Math.abs(scale - 1) < 0.001;
  return (
    <span
      class="font-size-controls"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        class="font-size-controls__btn"
        title="Smaller text"
        aria-label="Smaller text"
        onClick={() => adjustBubbleFontScale(bubbleId, -FONT_SCALE_STEP)}
      >A−</button>
      <button
        type="button"
        class="font-size-controls__btn font-size-controls__btn--reset"
        title={`Reset (currently ${Math.round(scale * 100)}%)`}
        aria-label="Reset text size"
        disabled={isDefault}
        onClick={() => resetBubbleFontScale(bubbleId)}
      >↺</button>
      <button
        type="button"
        class="font-size-controls__btn"
        title="Larger text"
        aria-label="Larger text"
        onClick={() => adjustBubbleFontScale(bubbleId, FONT_SCALE_STEP)}
      >A+</button>
    </span>
  );
}

import type { JSX } from 'preact';
import type { BrainBubbleConfig } from '../types';

export function BrainBubble({ brain }: { brain: BrainBubbleConfig }): JSX.Element {
  return (
    <div class="brain" aria-label="LLM context">
      {brain.miniBubbles.length === 0 ? (
        <span style={{ color: 'var(--ink-faint)', fontSize: 11 }}>empty context</span>
      ) : (
        brain.miniBubbles.map((m) => (
          <span key={m.id} class={`brain__mini${m.pinned ? ' is-pinned' : ''}`} title={m.source}>
            {m.label}
          </span>
        ))
      )}
    </div>
  );
}

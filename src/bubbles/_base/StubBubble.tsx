import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';

interface StubBubbleProps {
  instance: BubbleInstance;
  seeds: SeedDict;
}

export function StubBubble({ instance }: StubBubbleProps): JSX.Element {
  return (
    <div class="stub-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title">{instance.title}</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>{instance.type}</span>
      </div>
      <div class="bubble__body" style={{ flex: 1 }}>
        <small style={{ color: 'var(--ink-faint)' }}>stub · {instance.type}</small>
      </div>
    </div>
  );
}

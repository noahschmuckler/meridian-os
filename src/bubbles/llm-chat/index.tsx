// llm-chat primitive: chat surface with its own brain bubble (visible context).
// Independent of any cell — chat is a peer bubble, brain belongs to the chat.

import type { JSX } from 'preact';
import type { BrainBubbleConfig, BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { BrainBubble } from '../../cell/BrainBubble';

interface LlmChatProps {
  greeting?: string;
  defaultPersona?: string;
  brain?: BrainBubbleConfig;
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  onDismissMini?: (miniId: string) => void;
}

export function LlmChat({ instance, onDismissMini }: Props): JSX.Element {
  const p = instance.props as LlmChatProps;
  return (
    <div class="llm-chat" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title">{instance.title}</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>chat · {p.defaultPersona ?? 'default'}</span>
      </div>
      {p.brain && <BrainBubble brain={p.brain} onDismiss={onDismissMini} />}
      <div class="bubble__body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div class="llm-chat__messages">
          {p.greeting && (
            <div class="llm-chat__msg llm-chat__msg--system">{p.greeting}</div>
          )}
          <div class="llm-chat__msg llm-chat__msg--note">scripted in v1 · drag a bubble onto me to attach</div>
        </div>
        <div class="llm-chat__input">
          <input type="text" disabled placeholder="ask anything…" />
        </div>
      </div>
    </div>
  );
}

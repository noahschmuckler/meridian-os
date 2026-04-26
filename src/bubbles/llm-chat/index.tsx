// llm-chat primitive: chat surface with its own brain bubble (visible context).
// Independent of any cell — chat is a peer bubble, brain belongs to the chat.
// v1: input is functional; the assistant returns a Lorem ipsum segment so the
// chat-history weight grows in the brain fullness bar as messages accumulate.
//
// Messages are persisted to the parent BspWorkspace via onMessagesChange so
// the chat survives workspace switches — bubbles have tangible identity.

import { useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BrainBubbleConfig, BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { BrainBubble } from '../../cell/BrainBubble';

interface LlmChatProps {
  greeting?: string;
  defaultPersona?: string;
  brain?: BrainBubbleConfig;
  messages?: Message[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  onDismissMini?: (miniId: string) => void;
  onMessagesChange?: (messages: Message[]) => void;
}

const LOREM_CHUNKS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.',
  'Et harum quidem rerum facilis est et expedita distinctio; nam libero tempore cum soluta nobis.',
  'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates.',
];

function loremReply(): string {
  const n = 1 + Math.floor(Math.random() * 3);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(LOREM_CHUNKS[Math.floor(Math.random() * LOREM_CHUNKS.length)]);
  }
  return out.join(' ');
}

function chatHistoryWeight(messages: Message[]): number {
  const totalChars = messages.reduce((s, m) => s + m.text.length, 0);
  return Math.min(0.95, 0.05 + totalChars / 20000);
}

export function LlmChat({ instance, onDismissMini, onMessagesChange }: Props): JSX.Element {
  const p = instance.props as LlmChatProps;
  // Initial messages: persisted ones from props, or seed with the greeting.
  const initial: Message[] =
    p.messages && p.messages.length > 0
      ? p.messages
      : p.greeting
        ? [{ id: 'sys-greeting', role: 'system', text: p.greeting }]
        : [];
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const seq = useRef(0);

  // Persist to parent on every change (debounced via Preact's batching).
  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages]);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  function nextId(prefix: string): string {
    return `${prefix}-${Date.now()}-${++seq.current}`;
  }

  function submit(e: Event): void {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: nextId('u'), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    window.setTimeout(() => {
      const reply: Message = { id: nextId('a'), role: 'assistant', text: loremReply() };
      setMessages((prev) => [...prev, reply]);
    }, 350 + Math.random() * 350);
  }

  const weight = chatHistoryWeight(messages);

  return (
    <div class="llm-chat" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title">{instance.title}</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>chat · {p.defaultPersona ?? 'default'}</span>
      </div>
      {p.brain && <BrainBubble brain={p.brain} chatHistoryWeight={weight} onDismiss={onDismissMini} />}
      <div class="bubble__body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>
        <div class="llm-chat__messages" ref={messagesRef}>
          {messages.map((m) => (
            <div key={m.id} class={`llm-chat__msg llm-chat__msg--${m.role}`}>
              {m.text}
            </div>
          ))}
          {messages.length <= 1 && (
            <div class="llm-chat__msg llm-chat__msg--note">scripted in v1 · drag a bubble onto me to attach · type anything for a Lorem ipsum reply</div>
          )}
        </div>
        <form class="llm-chat__input" onSubmit={submit}>
          <input
            type="text"
            placeholder="ask anything…"
            value={input}
            onInput={(e) => setInput((e.currentTarget as HTMLInputElement).value)}
          />
          <button type="submit" disabled={!input.trim()}>send</button>
        </form>
      </div>
    </div>
  );
}

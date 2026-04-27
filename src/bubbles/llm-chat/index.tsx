// llm-chat primitive: chat surface with its own brain bubble (visible context).
// Independent of any cell — chat is a peer bubble, brain belongs to the chat.
//
// Fully controlled: messages live in the parent's registry (instance.props.messages)
// and flow back via onMessagesChange. No local message state, so a workspace
// reset (which clears registry messages) immediately empties the chat. Same
// for save-state load.
//
// Replies come from /api/chat (Cloudflare Pages Function calling Anthropic).
// Brain context — content extracted per attached mini-bubble's relationship —
// is assembled by the host (BspWorkspace) and threaded in via brainContext.

import { useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { AttachRelationship, BrainBubbleConfig, BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { BrainBubble } from '../../cell/BrainBubble';
import type { BrainContext } from '../../data/brainContext';
import { renderMarkdown } from '../../lib/md';

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
  onSetMiniRelationship?: (miniId: string, rel: AttachRelationship) => void;
  onMessagesChange?: (messages: Message[]) => void;
  // Built by the host from this chat's brain + workspace registry. Sent to
  // /api/chat as the structured context the LLM should reason from.
  brainContext?: BrainContext;
  workspaceTitle?: string;
}

function chatHistoryWeight(messages: Message[]): number {
  const totalChars = messages.reduce((s, m) => s + m.text.length, 0);
  return Math.min(0.95, 0.05 + totalChars / 20000);
}

// A compacted chat is the single ⤓-prefixed system message produced by compact().
const COMPACT_PREFIX = '⤓ ';
function isCompactedChat(messages: Message[]): boolean {
  return messages.length === 1 && messages[0].role === 'system' && messages[0].text.startsWith(COMPACT_PREFIX);
}

export function LlmChat({
  instance,
  onDismissMini,
  onSetMiniRelationship,
  onMessagesChange,
  brainContext,
  workspaceTitle,
}: Props): JSX.Element {
  const p = instance.props as LlmChatProps;
  const propsMessages = p.messages;
  const messages: Message[] = propsMessages ?? [];

  // Seed the greeting message whenever there are no messages and a greeting
  // is configured. Fires on first mount and again after a reset / fresh load.
  useEffect(() => {
    if ((!propsMessages || propsMessages.length === 0) && p.greeting) {
      onMessagesChange?.([{ id: 'sys-greeting', role: 'system', text: p.greeting }]);
    }
  }, [propsMessages, p.greeting]);

  // Latest-messages ref so async assistant replies can append to whatever the
  // current state is, not a stale closure copy.
  const latestRef = useRef<Message[]>(messages);
  latestRef.current = messages;

  // Ref to the in-flight reply so a new send can cancel it.
  const abortRef = useRef<AbortController | null>(null);

  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const messagesElRef = useRef<HTMLDivElement>(null);
  const seq = useRef(0);

  useEffect(() => {
    const el = messagesElRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, pending]);

  function nextId(prefix: string): string {
    return `${prefix}-${Date.now()}-${++seq.current}`;
  }

  function appendMessage(m: Message): void {
    const next = [...latestRef.current, m];
    latestRef.current = next;
    onMessagesChange?.(next);
  }

  async function submit(e: Event): Promise<void> {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    const userMsg: Message = { id: nextId('u'), role: 'user', text };
    appendMessage(userMsg);
    setInput('');

    // Abort any in-flight reply.
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setPending(true);
    try {
      // Build the conversation payload from history. System / compacted-history
      // messages get folded into a leading "context" user-turn so they reach
      // the model without being typed as 'system'.
      const apiMessages = messages
        .concat(userMsg)
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.text }));

      const sysContext = messages
        .filter((m) => m.role === 'system')
        .map((m) => m.text)
        .join('\n');

      const reqBody = {
        messages: sysContext
          ? [{ role: 'user' as const, content: `Prior context: ${sysContext}` }, ...apiMessages]
          : apiMessages,
        brain: brainContext,
        persona: p.defaultPersona,
        workspaceTitle,
      };

      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(reqBody),
        signal: ac.signal,
      });

      if (!r.ok) {
        const err = (await r.json().catch(() => ({}))) as { error?: string };
        appendMessage({
          id: nextId('a'),
          role: 'assistant',
          text: `⚠️ ${err.error ?? 'Server error ' + r.status}`,
        });
        return;
      }
      const data = (await r.json()) as { text?: string };
      const replyText = (data.text ?? '').trim() || '(empty reply)';
      appendMessage({ id: nextId('a'), role: 'assistant', text: replyText });
    } catch (err: unknown) {
      if ((err as { name?: string }).name === 'AbortError') return;
      appendMessage({
        id: nextId('a'),
        role: 'assistant',
        text: `⚠️ couldn't reach the model — ${String(err)}`,
      });
    } finally {
      if (abortRef.current === ac) abortRef.current = null;
      setPending(false);
    }
  }

  function compactConversation(): void {
    if (messages.length <= 1) return;
    const summaryText =
      '⤓ Conversation compacted — ' +
      messages
        .filter((m) => m.role !== 'system')
        .slice(-4)
        .map((m) => `${m.role}: ${m.text.slice(0, 80)}`)
        .join(' · ');
    const summary: Message = { id: nextId('compact'), role: 'system', text: summaryText };
    latestRef.current = [summary];
    onMessagesChange?.([summary]);
  }

  function clearConversation(): void {
    if (p.greeting) {
      const seed: Message = { id: nextId('sys-greet'), role: 'system', text: p.greeting };
      latestRef.current = [seed];
      onMessagesChange?.([seed]);
    } else {
      latestRef.current = [];
      onMessagesChange?.([]);
    }
  }

  const compacted = isCompactedChat(messages);
  const weight = compacted ? 0.04 : chatHistoryWeight(messages);

  return (
    <div class="llm-chat" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title">{instance.title}</span>
        <div class="llm-chat__chrome-actions">
          <button
            class="llm-chat__action"
            onClick={(e) => { e.stopPropagation(); compactConversation(); }}
            title="Summarize prior turns and continue"
            disabled={messages.length <= 1}
          >
            compact
          </button>
          <button
            class="llm-chat__action"
            onClick={(e) => { e.stopPropagation(); clearConversation(); }}
            title="Clear conversation"
          >
            clear
          </button>
        </div>
      </div>
      {p.brain && (
        <BrainBubble
          brain={p.brain}
          chatHistoryWeight={weight}
          chatCompacted={compacted}
          onDismissMini={onDismissMini}
          onSetMiniRelationship={onSetMiniRelationship}
          onCompactChat={compactConversation}
          onClearChat={clearConversation}
        />
      )}
      <div class="bubble__body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>
        <div class="llm-chat__messages" ref={messagesElRef}>
          {messages.map((m) => (
            <div
              key={m.id}
              class={`llm-chat__msg llm-chat__msg--${m.role} markdown-body`}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }}
            />
          ))}
          {pending && (
            <div class="llm-chat__msg llm-chat__msg--assistant llm-chat__msg--pending">
              <span class="llm-chat__dots"><span /><span /><span /></span>
            </div>
          )}
          {messages.length <= 1 && !pending && (
            <div class="llm-chat__msg llm-chat__msg--note">drag a bubble onto me to attach · ask me anything</div>
          )}
        </div>
        <form class="llm-chat__input" onSubmit={submit}>
          <input
            type="text"
            placeholder={pending ? 'thinking…' : 'ask anything…'}
            value={input}
            disabled={pending}
            onInput={(e) => setInput((e.currentTarget as HTMLInputElement).value)}
          />
          <button type="submit" disabled={!input.trim() || pending}>send</button>
        </form>
      </div>
    </div>
  );
}

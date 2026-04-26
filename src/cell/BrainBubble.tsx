import type { JSX } from 'preact';
import type { AttachRelationship, BrainBubbleConfig, MiniBubble } from '../types';

const REL_GLYPH: Record<AttachRelationship, string> = {
  deep: '📖',
  summary: '📝',
  reference: '🔗',
  edit: '✏️',
};

const REL_LABEL: Record<AttachRelationship, string> = {
  deep: 'reading',
  summary: 'summary',
  reference: 'reference',
  edit: 'editable',
};

// Approximate share of the LLM context window each relationship type
// occupies. Hand-tuned for v1; real implementation would use token counts.
const REL_WEIGHT: Record<AttachRelationship, number> = {
  deep: 0.25,
  summary: 0.04,
  reference: 0.015,
  edit: 0.18,
};

// Always-present base: the chat history itself takes some context.
const CHAT_HISTORY_WEIGHT = 0.05;

const REL_FILL_COLOR: Record<AttachRelationship, string> = {
  deep: 'hsl(150, 60%, 35%)',
  summary: 'hsl(150, 45%, 52%)',
  reference: 'hsl(150, 30%, 70%)',
  edit: 'hsl(30, 60%, 55%)',
};

const CHAT_HISTORY_COLOR = 'hsl(150, 50%, 60%)';
const EMPTY_COLOR = 'hsl(150, 30%, 92%)';

interface BrainProps {
  brain: BrainBubbleConfig;
  onDismiss?: (miniId: string) => void;
}

export function BrainBubble({ brain, onDismiss }: BrainProps): JSX.Element {
  const { gradient, usage, overfilled } = computeFill(brain.miniBubbles);

  return (
    <div
      class={`brain${overfilled ? ' brain--overfilled' : ''}`}
      aria-label="LLM context"
      style={{ background: gradient }}
    >
      <div class="brain__items">
        {brain.miniBubbles.length === 0 ? (
          <span style={{ color: 'var(--ink-faint)', fontSize: 11 }}>empty context · {pct(usage)}</span>
        ) : (
          brain.miniBubbles.map((m) => {
            const glyph = m.relationship ? REL_GLYPH[m.relationship] : '·';
            const tooltip = m.relationship ? `${REL_LABEL[m.relationship]} · ${m.source}` : m.source;
            return (
              <span
                key={m.id}
                class={`brain__mini brain__mini--${m.relationship ?? 'plain'}${m.pinned ? ' is-pinned' : ''}`}
                title={tooltip}
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss?.(m.id);
                }}
              >
                <span class="brain__glyph">{glyph}</span>
                {m.label}
              </span>
            );
          })
        )}
      </div>
      <div class="brain__meter" title={`context window: ${pct(usage)}${overfilled ? ' — overfilled, compaction needed' : ''}`}>
        {pct(usage)}
      </div>
    </div>
  );
}

function pct(u: number): string {
  return `${Math.round(u * 100)}%`;
}

function computeFill(miniBubbles: MiniBubble[]): { gradient: string; usage: number; overfilled: boolean } {
  const segments: { color: string; size: number }[] = [
    { color: CHAT_HISTORY_COLOR, size: CHAT_HISTORY_WEIGHT },
  ];
  for (const m of miniBubbles) {
    const w = m.relationship ? REL_WEIGHT[m.relationship] : 0.01;
    const color = m.relationship ? REL_FILL_COLOR[m.relationship] : 'hsl(150, 30%, 60%)';
    segments.push({ color, size: w });
  }
  const total = segments.reduce((s, x) => s + x.size, 0);
  const overfilled = total > 1.0;

  // Normalize to fit the bar if overfilled — relative shares are still legible.
  const scale = overfilled ? 1.0 / total : 1.0;
  let cursor = 0;
  const stops: string[] = [];
  for (const seg of segments) {
    const w = seg.size * scale;
    stops.push(`${seg.color} ${(cursor * 100).toFixed(2)}%`);
    cursor += w;
    stops.push(`${seg.color} ${(cursor * 100).toFixed(2)}%`);
  }
  if (cursor < 1.0) {
    stops.push(`${EMPTY_COLOR} ${(cursor * 100).toFixed(2)}%`);
    stops.push(`${EMPTY_COLOR} 100%`);
  }
  return {
    gradient: `linear-gradient(90deg, ${stops.join(', ')})`,
    usage: Math.min(1, total),
    overfilled,
  };
}

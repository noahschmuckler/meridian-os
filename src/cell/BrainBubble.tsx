import type { JSX } from 'preact';
import type { BrainBubbleConfig, AttachRelationship } from '../types';

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

interface BrainProps {
  brain: BrainBubbleConfig;
  onDismiss?: (miniId: string) => void;
}

export function BrainBubble({ brain, onDismiss }: BrainProps): JSX.Element {
  return (
    <div class="brain" aria-label="LLM context">
      {brain.miniBubbles.length === 0 ? (
        <span style={{ color: 'var(--ink-faint)', fontSize: 11 }}>empty context</span>
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
  );
}

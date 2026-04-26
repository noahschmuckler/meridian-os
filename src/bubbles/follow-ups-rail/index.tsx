// follow-ups-rail primitive: list of carry-forward items from prior 1:1.
// Ported from meridian-onboarding renderFollowupsRail (lines 5707–5724).

import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';

interface FollowUp {
  id: string;
  topic: string;
  trainee_question?: string;
  priority: 'high' | 'med' | 'low';
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

const PRIORITY_TINT: Record<FollowUp['priority'], string> = {
  high: 'var(--warn)',
  med: '#7C6FB8',
  low: 'var(--ink-faint)',
};

export function FollowUpsRail({ instance, seeds }: Props): JSX.Element {
  const items = (instance.props.items as FollowUp[] | undefined)
    ?? (seeds['patel.followups'] as FollowUp[] | undefined)
    ?? [];

  return (
    <div class="fur" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title">Follow-ups</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>{items.length} carried forward</span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto' }}>
        {items.length === 0 ? (
          <small style={{ color: 'var(--ink-faint)' }}>none yet</small>
        ) : (
          items.map((f) => (
            <div key={f.id} class="fur__item">
              <span class="fur__pri" style={{ background: PRIORITY_TINT[f.priority] }}>{f.priority}</span>
              <div class="fur__body">
                <div class="fur__topic">{f.topic}</div>
                {f.trainee_question && <div class="fur__q">"{f.trainee_question}"</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

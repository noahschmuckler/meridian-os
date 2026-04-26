// generated-sessions-rail primitive: rail of LLM-generated session modules from prior 1:1s.
// Ported from meridian-onboarding renderGeneratedSessionsRail (lines 5745–5768).

import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';

interface GeneratedSession {
  module_id: string;
  title: string;
  generated_at: string; // ISO
  source_session_id?: string;
  carry_forward_count?: number;
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

export function GeneratedSessionsRail({ instance, seeds }: Props): JSX.Element {
  const sessions = (instance.props.sessions as GeneratedSession[] | undefined)
    ?? (seeds['patel.generated_modules'] as GeneratedSession[] | undefined)
    ?? [];

  return (
    <div class="gsr" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title">Generated sessions</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>{sessions.length}</span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sessions.length === 0 ? (
          <small style={{ color: 'var(--ink-faint)' }}>no sessions generated yet</small>
        ) : (
          sessions.map((s) => (
            <button key={s.module_id} class="gsr__card" onClick={() => console.log('open', s.module_id)}>
              <div class="gsr__title">{s.title}</div>
              <div class="gsr__meta">
                <span>{formatDate(s.generated_at)}</span>
                {s.carry_forward_count !== undefined && <span>· {s.carry_forward_count} carry-forward</span>}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

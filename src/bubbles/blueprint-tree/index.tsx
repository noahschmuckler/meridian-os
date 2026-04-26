// blueprint-tree primitive: phased onboarding blueprint with status pills.
// Ported from meridian-onboarding's renderHomePage (lines 7159–7185) + renderStatusPill (lines 5632–5656).
// Manual-override-sticky logic preserved (line 5510 in setHubItemStatus).

import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';

interface BlueprintItem {
  item_id: string;
  position: number;
  phase: string;
  statement: string;
}

interface ItemStatusEntry {
  status: 'covered' | 'covered-reminder' | 'missed' | 'scheduled' | 'untouched';
  source: 'manual' | 'transcript';
}

type HubState = Record<string, ItemStatusEntry>;

const STATUS_LABELS: Record<ItemStatusEntry['status'], { glyph: string; label: string; color: string }> = {
  covered: { glyph: '✓', label: 'covered', color: 'var(--accent)' },
  'covered-reminder': { glyph: '↺', label: 'reminder', color: '#5B8FB9' },
  missed: { glyph: '!', label: 'missed', color: 'var(--warn)' },
  scheduled: { glyph: '◷', label: 'scheduled', color: '#7C6FB8' },
  untouched: { glyph: '·', label: '—', color: 'var(--ink-faint)' },
};

const STATUS_CYCLE: ItemStatusEntry['status'][] = ['untouched', 'covered', 'missed', 'scheduled'];

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

export function BlueprintTree({ instance, seeds }: Props): JSX.Element {
  const items = (instance.props.items as BlueprintItem[] | undefined)
    ?? (seeds['patel.blueprint'] as BlueprintItem[] | undefined)
    ?? [];
  const initialState = (instance.props.hubState as HubState | undefined)
    ?? (seeds['patel.hub_state_full'] as HubState | undefined)
    ?? {};

  const [hubState, setHubState] = useState<HubState>(initialState);

  const cycleStatus = (itemId: string): void => {
    const current = hubState[itemId]?.status ?? 'untouched';
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    setHubState((prev) => ({ ...prev, [itemId]: { status: next, source: 'manual' } }));
  };

  // Group items by phase preserving first-occurrence order
  const phaseOrder: string[] = [];
  const grouped: Record<string, BlueprintItem[]> = {};
  for (const item of items) {
    if (!grouped[item.phase]) {
      grouped[item.phase] = [];
      phaseOrder.push(item.phase);
    }
    grouped[item.phase].push(item);
  }

  return (
    <div class="bp-tree" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title">Onboarding Blueprint</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>{summarize(hubState, items.length)}</span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto' }}>
        {phaseOrder.map((phase) => (
          <div key={phase} class="bp-phase">
            <div class="bp-phase__hdr">{phase} · {phaseStat(grouped[phase], hubState)}</div>
            {grouped[phase].map((item) => (
              <div key={item.item_id} class="bp-item">
                <button
                  class="bp-pill"
                  style={{ background: STATUS_LABELS[hubState[item.item_id]?.status ?? 'untouched'].color }}
                  onClick={() => cycleStatus(item.item_id)}
                  title={STATUS_LABELS[hubState[item.item_id]?.status ?? 'untouched'].label}
                  aria-label={`status: ${STATUS_LABELS[hubState[item.item_id]?.status ?? 'untouched'].label}`}
                >
                  {STATUS_LABELS[hubState[item.item_id]?.status ?? 'untouched'].glyph}
                </button>
                <span class="bp-stmt">{item.statement}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function summarize(state: HubState, total: number): string {
  let covered = 0, missed = 0;
  for (const e of Object.values(state)) {
    if (e.status === 'covered' || e.status === 'covered-reminder') covered++;
    else if (e.status === 'missed') missed++;
  }
  return `${covered}/${total} covered · ${missed} missed`;
}

function phaseStat(items: BlueprintItem[], state: HubState): string {
  let covered = 0;
  for (const i of items) {
    const s = state[i.item_id]?.status;
    if (s === 'covered' || s === 'covered-reminder') covered++;
  }
  return `${covered}/${items.length}`;
}

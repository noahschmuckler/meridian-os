// mentorship-mentees-list primitive: mentor's "my mentees" picker.
//
// Lists providers assigned to the demo-time representative mentor (mt1) with
// current phase + progress. Tapping a row sets focus.selectedMenteeId, which
// the mentee-overview bubble reads. Auto-selects the first mentee on entry
// so mentee-overview always has content.

import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import {
  mentorshipDataSignal,
  PHASES,
  getPhaseProgress,
  getOverallProgress,
} from '../../data/mentorshipData';
import { mentorshipFocusSignal } from '../../data/mentorshipFocus';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
}

const REPRESENTATIVE_MENTOR_ID = 'mt1';

export function MentorshipMenteesList({ workspaceId }: Props): JSX.Element {
  const data = mentorshipDataSignal.value;
  const focus = mentorshipFocusSignal(workspaceId);
  const f = focus.value;

  const myMentees = data.providers.filter((p) => p.mentorId === REPRESENTATIVE_MENTOR_ID);

  // Auto-select first mentee on entry if none selected.
  useEffect(() => {
    if (f.role !== 'mentor') return;
    if (f.selectedMenteeId) return;
    if (myMentees.length === 0) return;
    focus.value = { ...f, selectedMenteeId: myMentees[0].id };
  }, [f.role, f.selectedMenteeId, myMentees.length]);

  function pick(menteeId: string): void {
    focus.value = { ...f, selectedMenteeId: menteeId };
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>My mentees</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.6 }}>
          {myMentees.length} {myMentees.length === 1 ? 'mentee' : 'mentees'}
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '6px 0' }}>
        {myMentees.map((prov) => {
          const ph = PHASES.find((p) => p.id === prov.currentPhase);
          const ps = getPhaseProgress(data, prov.id, prov.currentPhase);
          const overall = getOverallProgress(data, prov.id);
          const isSelected = prov.id === f.selectedMenteeId;
          const dotColor = ps.pct === 100 ? '#22c55e' : ps.pct > 0 ? '#eab308' : '#8899a6';
          return (
            <button
              key={prov.id}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); pick(prov.id); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 14px',
                border: 'none',
                borderLeft: isSelected ? `3px solid var(--type-color)` : '3px solid transparent',
                background: isSelected ? 'rgba(0,0,0,0.04)' : 'transparent',
                cursor: 'pointer',
                font: 'inherit',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: dotColor,
                flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1c2b3a' }}>{prov.name}</div>
                <div style={{ fontSize: 10.5, color: '#8899a6' }}>
                  {prov.role} · {ph?.label ?? '—'}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f1b2d' }}>{ps.done}/{ps.total}</div>
                <div style={{ fontSize: 9.5, color: '#8899a6' }}>{overall}% overall</div>
              </div>
            </button>
          );
        })}
        {myMentees.length === 0 && (
          <div style={{ padding: '14px', fontSize: 11, color: '#8899a6', fontStyle: 'italic' }}>
            No mentees assigned.
          </div>
        )}
      </div>
    </div>
  );
}

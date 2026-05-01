// mentorship-mentees-list primitive: mentor's "my mentees" picker.
//
// Lists providers assigned to the demo-time representative mentor (mt1) with
// current phase + progress. Tapping a row sets focus.selectedMenteeId, which
// the mentee-overview bubble reads. Auto-selects the first mentee on entry
// so mentee-overview always has content.

import { useEffect, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import {
  mentorshipDataSignal,
  PHASES,
  getPhaseProgress,
  getOverallProgress,
  addProvider,
  DEFAULT_MENTOR_ID,
  type ProviderRecord,
} from '../../data/mentorshipData';
import { mentorshipFocusSignal } from '../../data/mentorshipFocus';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
}

const REPRESENTATIVE_MENTOR_ID = DEFAULT_MENTOR_ID;
const TODAY_ISO = (): string => new Date().toISOString().slice(0, 10);
const PROVIDER_ROLES: ProviderRecord['role'][] = ['MD', 'DO', 'NP', 'PA'];

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

  // ---- Add-mentee inline form
  const [adding, setAdding] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftRole, setDraftRole] = useState<ProviderRecord['role']>('MD');
  const [draftStart, setDraftStart] = useState(TODAY_ISO());
  const [draftPhase, setDraftPhase] = useState('w1');

  function resetForm(): void {
    setDraftName('');
    setDraftRole('MD');
    setDraftStart(TODAY_ISO());
    setDraftPhase('w1');
  }

  function submitAdd(): void {
    const name = draftName.trim();
    if (!name) return;
    const next = addProvider(mentorshipDataSignal.value, {
      name,
      role: draftRole,
      startDate: draftStart,
      currentPhase: draftPhase,
      mentorId: REPRESENTATIVE_MENTOR_ID,
    });
    mentorshipDataSignal.value = next;
    // Auto-select the newly added provider.
    const justAdded = next.providers[next.providers.length - 1];
    focus.value = { ...f, selectedMenteeId: justAdded.id };
    resetForm();
    setAdding(false);
  }

  function cancelAdd(): void {
    resetForm();
    setAdding(false);
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>My mentees</span>
        <button
          type="button"
          title={adding ? 'Cancel' : 'Add a new mentee'}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); adding ? cancelAdd() : setAdding(true); }}
          style={{
            marginLeft: 'auto',
            border: '1px solid rgba(0,0,0,0.15)',
            background: adding ? '#fef2f2' : 'rgba(255,255,255,0.55)',
            color: adding ? '#7f1d1d' : 'inherit',
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 3,
          }}
        >{adding ? '× cancel' : '+ add'}</button>
        <span style={{ marginLeft: 8, fontSize: 10, opacity: 0.6 }}>
          {myMentees.length} {myMentees.length === 1 ? 'mentee' : 'mentees'}
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '6px 0' }}>
        {adding && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              padding: '12px 14px',
              background: 'rgba(2,128,144,0.05)',
              borderBottom: '2px solid rgba(2,128,144,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#028090', letterSpacing: 0.3 }}>NEW MENTEE</div>
            <input
              type="text"
              autoFocus
              placeholder="Provider name (e.g. Dr. Patel)"
              value={draftName}
              onInput={(e) => setDraftName((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); submitAdd(); }
                if (e.key === 'Escape') { e.preventDefault(); cancelAdd(); }
              }}
              style={{
                font: 'inherit', fontSize: 13, padding: '6px 8px',
                border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4, width: '100%',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 10, color: '#8899a6' }}>Role</span>
                <select
                  value={draftRole}
                  onChange={(e) => setDraftRole((e.target as HTMLSelectElement).value as ProviderRecord['role'])}
                  style={{ font: 'inherit', fontSize: 12, padding: '5px 6px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4 }}
                >
                  {PROVIDER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 10, color: '#8899a6' }}>Start date</span>
                <input
                  type="date"
                  value={draftStart}
                  onInput={(e) => setDraftStart((e.target as HTMLInputElement).value)}
                  style={{ font: 'inherit', fontSize: 12, padding: '5px 6px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4 }}
                />
              </label>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 10, color: '#8899a6' }}>Current phase</span>
              <select
                value={draftPhase}
                onChange={(e) => setDraftPhase((e.target as HTMLSelectElement).value)}
                style={{ font: 'inherit', fontSize: 12, padding: '5px 6px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4 }}
              >
                {PHASES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </label>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); cancelAdd(); }}
                style={{
                  font: 'inherit', fontSize: 11, padding: '5px 10px',
                  border: '1px solid rgba(0,0,0,0.15)', background: 'white', borderRadius: 4, cursor: 'pointer',
                }}
              >Cancel</button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); submitAdd(); }}
                disabled={!draftName.trim()}
                style={{
                  font: 'inherit', fontSize: 11, fontWeight: 700, padding: '5px 10px',
                  border: '1px solid #028090',
                  background: draftName.trim() ? '#028090' : 'rgba(2,128,144,0.4)',
                  color: 'white', borderRadius: 4,
                  cursor: draftName.trim() ? 'pointer' : 'not-allowed',
                }}
              >Add mentee</button>
            </div>
          </div>
        )}
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
        {myMentees.length === 0 && !adding && (
          <div style={{ padding: '14px', fontSize: 11, color: '#8899a6', fontStyle: 'italic', lineHeight: 1.5 }}>
            No mentees yet — click <strong style={{ color: '#028090', fontStyle: 'normal' }}>+ add</strong> above to enter a new provider, or use the matrix's <strong style={{ color: '#028090', fontStyle: 'normal' }}>import</strong> button to load a saved .xlsx.
          </div>
        )}
      </div>
    </div>
  );
}

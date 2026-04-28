// mentorship-mentee-overview primitive: detail card for the currently
// selected mentee. Shows name/role/start, current phase + progress, recent
// notes across phases, and two affordances:
//   - "Open phase detail →" drills into provider-detail mode for the
//     mentee's current phase (sets selectedProviderId + selectedPhase)
//   - "Open Trainer view →" is a stub in Phase 3; Phase 5 wires the
//     cross-workspace launch to Trainer with a per-mentee dummy seed.

import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import {
  mentorshipDataSignal,
  PHASES,
  getPhaseProgress,
  getOverallProgress,
  type NoteEntry,
} from '../../data/mentorshipData';
import { mentorshipFocusSignal } from '../../data/mentorshipFocus';
import { trainerProviderContextSignal } from '../../data/trainerProviderContext';
import { navigateToWorkspace } from '../../data/workspaceNav';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
}

interface RecentNote extends NoteEntry {
  phaseId: string;
}

function recentNotes(
  notes: Record<string, NoteEntry[]>,
  providerId: string,
  limit: number,
): RecentNote[] {
  const all: RecentNote[] = [];
  for (const [key, list] of Object.entries(notes)) {
    const [pid, phid] = key.split(':');
    if (pid !== providerId) continue;
    list.forEach((n) => all.push({ ...n, phaseId: phid }));
  }
  // Notes carry locale-formatted date strings; can't sort reliably, so just
  // take the last `limit` in insertion order.
  return all.slice(-limit).reverse();
}

export function MentorshipMenteeOverview({ workspaceId }: Props): JSX.Element {
  const data = mentorshipDataSignal.value;
  const focus = mentorshipFocusSignal(workspaceId);
  const f = focus.value;

  const mentee = f.selectedMenteeId
    ? data.providers.find((p) => p.id === f.selectedMenteeId)
    : null;

  if (!mentee) {
    return (
      <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div class="bubble__chrome">
          <span class="bubble__title" style={{ color: 'var(--type-color)' }}>Mentee detail</span>
        </div>
        <div class="bubble__body" style={{ flex: 1, padding: 14, color: '#8899a6', fontSize: 11 }}>
          Pick a mentee on the left to see details.
        </div>
      </div>
    );
  }

  const phase = PHASES.find((p) => p.id === mentee.currentPhase);
  const ps = getPhaseProgress(data, mentee.id, mentee.currentPhase);
  const overall = getOverallProgress(data, mentee.id);
  const notes = recentNotes(data.notes, mentee.id, 5);
  const mentor = data.users.find((u) => u.id === mentee.mentorId);

  function openPhaseDetail(): void {
    focus.value = { ...f, selectedProviderId: mentee!.id, selectedPhase: mentee!.currentPhase };
  }

  function openTrainer(): void {
    if (!mentee) return;
    // Set the cross-workspace context first so Trainer mounts already aware
    // of which mentee is being viewed; then trigger the navigation (fly back
    // to home, fly into Trainer).
    trainerProviderContextSignal.value = { providerId: mentee.id };
    navigateToWorkspace('trainer');
  }

  const overallColor = overall >= 70 ? '#22c55e' : overall >= 30 ? '#eab308' : '#d92e2e';

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>{mentee.name}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.6 }}>
          {mentee.role} · started {mentee.startDate}
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <Stat label="Current phase" value={phase?.label ?? '—'} color="#0f1b2d" />
          <Stat label="Phase progress" value={`${ps.done}/${ps.total}`} color="#0f1b2d" />
          <Stat label="Overall" value={`${overall}%`} color={overallColor} />
        </div>

        {/* Mentor row */}
        <div style={{ fontSize: 11, color: '#8899a6' }}>
          Mentor: <strong style={{ color: '#1c2b3a', fontWeight: 600 }}>{mentor?.name ?? '—'}</strong>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); openPhaseDetail(); }}
            style={btnStyle('var(--type-color)', '#1a1a1a')}
          >Open phase detail →</button>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); openTrainer(); }}
            style={btnStyle('#5f6b7a', 'white')}
            title="Phase 5: cross-workspace launch (stub)"
          >Open Trainer view →</button>
        </div>

        {/* Recent notes */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#8899a6', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
            Recent notes
          </div>
          {notes.length === 0 && (
            <div style={{ fontSize: 11, color: '#8899a6', fontStyle: 'italic' }}>
              No notes yet for this mentee.
            </div>
          )}
          {notes.map((n, i) => {
            const phLabel = PHASES.find((p) => p.id === n.phaseId)?.label ?? n.phaseId;
            return (
              <div
                key={i}
                style={{
                  background: 'rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 6,
                  padding: '6px 9px',
                  marginBottom: 5,
                }}
              >
                <div style={{ fontSize: 11.5, color: '#1c2b3a', lineHeight: 1.4 }}>{n.text}</div>
                <div style={{ fontSize: 9.5, color: '#8899a6', marginTop: 2 }}>
                  {phLabel} · {n.by} · {n.at}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface StatProps { label: string; value: string; color: string; }
function Stat({ label, value, color }: StatProps): JSX.Element {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.03)',
      borderRadius: 6,
      padding: '6px 8px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 9, color: '#8899a6', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function btnStyle(bg: string, fg: string): JSX.CSSProperties {
  return {
    font: 'inherit',
    fontSize: 11,
    fontWeight: 600,
    padding: '6px 11px',
    border: 'none',
    borderRadius: 5,
    background: bg,
    color: fg,
    cursor: 'pointer',
  };
}

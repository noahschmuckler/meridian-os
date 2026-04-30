// mentorship-phase-checklist primitive: the toggleable check-off list for the
// currently-selected provider × phase. Reads selectedProviderId + selectedPhase
// from mentorshipFocusSignal; reads checkoffs from mentorshipDataSignal; writes
// back to data on toggle.
//
// Permissions (matching Freiberg's artifact):
//   - mentor + director can toggle
//   - executive is read-only
//
// "By" is recorded as a representative user for the active role since there is
// no real per-user login (the role-selector is the demo equivalent).

import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import {
  mentorshipDataSignal,
  PHASES,
  OM_PHASES,
  ALL_PHASES,
  getPhaseProgress,
  type Phase,
} from '../../data/mentorshipData';
import {
  mentorshipFocusSignal,
  ALL_MENTOR_PHASES,
  ALL_OPS_PHASES,
} from '../../data/mentorshipFocus';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
}

const TYPE_COLOR: Record<string, string> = {
  weekly:    '#028090',
  monthly:   '#f97316',
  quarterly: '#8b5cf6',
  ops:       '#0ea5e9',
};

// Demo-time author per role. Real deployment would resolve this from SSO.
// Ops-track checkoffs are always authored by a director; mentor-track checkoffs
// can be authored by either mentor or director.
function authorIdForCheckoff(role: string, isOpsPhase: boolean): string | null {
  if (isOpsPhase) {
    return role === 'director' ? 'md1' : null;
  }
  switch (role) {
    case 'mentor':   return 'mt1';
    case 'director': return 'md1';
    default:         return null;
  }
}

export function MentorshipPhaseChecklist({ workspaceId }: Props): JSX.Element {
  const data = mentorshipDataSignal.value;
  const focus = mentorshipFocusSignal(workspaceId);
  const f = focus.value;

  const provider = f.selectedProviderId
    ? data.providers.find((p) => p.id === f.selectedProviderId)
    : null;
  const isAllMentor = f.selectedPhase === ALL_MENTOR_PHASES;
  const isAllOps = f.selectedPhase === ALL_OPS_PHASES;
  const isAllMode = isAllMentor || isAllOps;
  const phase = !isAllMode && f.selectedPhase
    ? ALL_PHASES.find((p) => p.id === f.selectedPhase)
    : null;

  if (!provider) {
    return (
      <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div class="bubble__chrome">
          <span class="bubble__title" style={{ color: 'var(--type-color)' }}>Phase checklist</span>
        </div>
        <div class="bubble__body" style={{ flex: 1, padding: 12, color: '#8899a6', fontSize: 11 }}>
          Pick a phase tab to see check-offs.
        </div>
      </div>
    );
  }

  if (isAllMode) {
    return renderAllPhasesView({
      provider,
      data,
      role: f.role,
      track: isAllMentor ? 'mentor' : 'ops',
    });
  }

  if (!phase) {
    return (
      <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div class="bubble__chrome">
          <span class="bubble__title" style={{ color: 'var(--type-color)' }}>Phase checklist</span>
        </div>
        <div class="bubble__body" style={{ flex: 1, padding: 12, color: '#8899a6', fontSize: 11 }}>
          Pick a phase tab to see check-offs.
        </div>
      </div>
    );
  }

  const isOpsPhase = phase.track === 'ops';
  const editorId = authorIdForCheckoff(f.role, isOpsPhase);
  const canEdit = editorId !== null;
  const ps = getPhaseProgress(data, provider.id, phase.id);
  const accent = TYPE_COLOR[phase.type];

  function toggle(itemId: string): void {
    if (!canEdit || !provider || !phase || !editorId) return;
    const key = `${provider.id}:${phase.id}:${itemId}`;
    const current = mentorshipDataSignal.value;
    const next = { ...current.checkoffs };
    if (next[key]) {
      delete next[key];
    } else {
      next[key] = { by: editorId, at: new Date().toLocaleString() };
    }
    mentorshipDataSignal.value = { ...current, checkoffs: next };
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>{phase.label}</span>
        <span style={{
          marginLeft: 6,
          fontSize: 9,
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: 8,
          background: `${accent}18`,
          color: accent,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}>{isOpsPhase ? 'office mgr' : phase.type}</span>
        {(phase.md || isOpsPhase) && (
          <span style={{
            marginLeft: 4,
            fontSize: 9,
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 8,
            background: 'rgba(139,92,246,0.16)',
            color: '#8b5cf6',
          }}>{isOpsPhase ? 'MD + OM' : 'MD'}</span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: ps.pct === 100 ? '#22c55e' : '#0f1b2d' }}>
          {ps.pct}%
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '6px 0' }}>
        {phase.items.map((item) => {
          const key = `${provider.id}:${phase.id}:${item.id}`;
          const info = data.checkoffs[key];
          const checked = !!info;
          const who = info ? data.users.find((u) => u.id === info.by)?.name ?? info.by : null;
          return (
            <button
              key={item.id}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); toggle(item.id); }}
              disabled={!canEdit}
              style={{
                display: 'grid',
                gridTemplateColumns: '24px 1fr',
                gap: 10,
                alignItems: 'flex-start',
                padding: '9px 14px',
                cursor: canEdit ? 'pointer' : 'default',
                background: checked ? 'rgba(34,197,94,0.05)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                width: '100%',
                font: 'inherit',
                fontSize: 12.5,
                textAlign: 'left',
                color: 'inherit',
              }}
            >
              <span style={{
                width: 20,
                height: 20,
                marginTop: 1,
                borderRadius: 4,
                border: `2px solid ${checked ? '#22c55e' : 'rgba(0,0,0,0.2)'}`,
                background: checked ? '#22c55e' : 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
                transition: 'all 160ms',
              }}>{checked ? '✓' : ''}</span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{
                  color: checked ? '#8899a6' : '#1c2b3a',
                  textDecoration: checked ? 'line-through' : 'none',
                  lineHeight: 1.4,
                }}>{item.text}</span>
                {checked && who && (
                  <span style={{ fontSize: 10, color: '#8899a6' }}>
                    Completed by {who} · {info.at}
                  </span>
                )}
              </span>
            </button>
          );
        })}
        {!canEdit && (
          <div style={{ padding: '10px 14px', fontSize: 10, fontStyle: 'italic', color: '#8899a6' }}>
            {isOpsPhase
              ? 'Read-only — Office Manager phases are completed by the medical director.'
              : 'Read-only view (executive role). Switch to mentor or director to edit.'}
          </div>
        )}
      </div>
    </div>
  );
}

// "All phases" demo view: every phase of the chosen track stacked vertically
// in one long scroll, each phase a section with its own header + items. Used
// when the user clicks the "All" tab on a phase strip — lets a director walk
// the entire onboarding pathway in one view instead of bite-sized phases.
function renderAllPhasesView(props: {
  provider: { id: string };
  data: typeof mentorshipDataSignal.value;
  role: string;
  track: 'mentor' | 'ops';
}): JSX.Element {
  const { provider, data, role, track } = props;
  const phases: Phase[] = track === 'mentor' ? PHASES : OM_PHASES;
  const trackAccent = track === 'mentor' ? '#028090' : '#0ea5e9';
  const isOpsTrack = track === 'ops';
  const editorId = authorIdForCheckoff(role, isOpsTrack);
  const canEdit = editorId !== null;

  // Aggregate completion across the whole track.
  let totalItems = 0;
  let totalDone = 0;
  for (const ph of phases) {
    totalItems += ph.items.length;
    for (const it of ph.items) {
      if (data.checkoffs[`${provider.id}:${ph.id}:${it.id}`]) totalDone++;
    }
  }
  const totalPct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

  function toggleItem(phaseId: string, itemId: string): void {
    if (!canEdit || !editorId) return;
    const key = `${provider.id}:${phaseId}:${itemId}`;
    const current = mentorshipDataSignal.value;
    const next = { ...current.checkoffs };
    if (next[key]) {
      delete next[key];
    } else {
      next[key] = { by: editorId, at: new Date().toLocaleString() };
    }
    mentorshipDataSignal.value = { ...current, checkoffs: next };
  }

  const trackTitle = track === 'mentor' ? 'Mentor track — full pathway' : 'Office Manager track — full pathway';

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: trackAccent }}>{trackTitle}</span>
        <span style={{
          marginLeft: 6,
          fontSize: 9,
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: 8,
          background: `${trackAccent}1a`,
          color: trackAccent,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}>{phases.length} phases</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 12,
          fontWeight: 700,
          color: totalPct === 100 ? '#22c55e' : '#0f1b2d',
        }}>{totalPct}% · {totalDone}/{totalItems}</span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: 0 }}>
        {phases.map((ph) => {
          const ps = getPhaseProgress(data, provider.id, ph.id);
          const accent = TYPE_COLOR[ph.type];
          return (
            <section key={ph.id} style={{ borderBottom: '2px solid rgba(0,0,0,0.06)' }}>
              <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                background: '#f8f9fb',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                padding: '7px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>{ph.label}</span>
                {(ph.md || isOpsTrack) && (
                  <span style={{
                    fontSize: 8.5,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 6,
                    background: 'rgba(139,92,246,0.16)',
                    color: '#8b5cf6',
                  }}>{isOpsTrack ? 'MD + OM' : 'MD'}</span>
                )}
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  fontWeight: 700,
                  color: ps.pct === 100 ? '#22c55e' : '#0f1b2d',
                }}>{ps.done}/{ps.total}</span>
              </div>
              {ph.items.map((item) => {
                const key = `${provider.id}:${ph.id}:${item.id}`;
                const info = data.checkoffs[key];
                const checked = !!info;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); toggleItem(ph.id, item.id); }}
                    disabled={!canEdit}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '22px 1fr',
                      gap: 9,
                      alignItems: 'center',
                      padding: '7px 14px',
                      cursor: canEdit ? 'pointer' : 'default',
                      background: checked ? 'rgba(34,197,94,0.05)' : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                      width: '100%',
                      font: 'inherit',
                      fontSize: 12,
                      textAlign: 'left',
                      color: 'inherit',
                    }}
                  >
                    <span style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: `2px solid ${checked ? '#22c55e' : 'rgba(0,0,0,0.2)'}`,
                      background: checked ? '#22c55e' : 'white',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>{checked ? '✓' : ''}</span>
                    <span style={{
                      color: checked ? '#8899a6' : '#1c2b3a',
                      textDecoration: checked ? 'line-through' : 'none',
                      lineHeight: 1.35,
                    }}>{item.text}</span>
                  </button>
                );
              })}
            </section>
          );
        })}
        {!canEdit && (
          <div style={{ padding: '10px 14px', fontSize: 10, fontStyle: 'italic', color: '#8899a6' }}>
            {isOpsTrack
              ? 'Read-only — Office Manager phases are completed by the medical director.'
              : 'Read-only view (executive role). Switch to mentor or director to edit.'}
          </div>
        )}
      </div>
    </div>
  );
}


// mentorship-phase-tabs primitive: horizontal phase strip in provider-detail
// mode. Each tab is a phase (W1..Q4) showing the selected provider's
// completion for that phase. Tapping a tab updates focus.selectedPhase, which
// the checklist + notes bubbles read. Includes a back-arrow that clears the
// provider selection (returning to whichever role's prior layout was active).

import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import {
  mentorshipDataSignal,
  PHASES,
  OM_PHASES,
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

const TYPE_COLORS: Record<string, string> = {
  weekly:    '#028090',
  monthly:   '#f97316',
  quarterly: '#8b5cf6',
  ops:       '#0ea5e9',
};
const OPS_COLOR = TYPE_COLORS.ops;

export function MentorshipPhaseTabs({ workspaceId }: Props): JSX.Element {
  const data = mentorshipDataSignal.value;
  const focus = mentorshipFocusSignal(workspaceId);
  const f = focus.value;

  const provider = f.selectedProviderId
    ? data.providers.find((p) => p.id === f.selectedProviderId)
    : null;

  function pickPhase(phaseId: string): void {
    focus.value = { ...f, selectedPhase: phaseId };
  }

  function back(): void {
    focus.value = { ...f, selectedProviderId: null, selectedPhase: null };
  }

  if (!provider) {
    return (
      <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div class="bubble__chrome">
          <span class="bubble__title" style={{ color: 'var(--type-color)' }}>Phases</span>
        </div>
        <div class="bubble__body" style={{ flex: 1, padding: 12, color: '#8899a6', fontSize: 11 }}>
          No provider selected.
        </div>
      </div>
    );
  }

  const curIdx = PHASES.findIndex((p) => p.id === provider.currentPhase);
  // Mentors don't see the ops track at all (director × OM conversations).
  const showOps = f.role === 'exec' || f.role === 'director';

  function renderAllButton(track: 'mentor' | 'ops'): JSX.Element {
    const sentinel = track === 'mentor' ? ALL_MENTOR_PHASES : ALL_OPS_PHASES;
    const accent = track === 'mentor' ? '#028090' : OPS_COLOR;
    const isActive = f.selectedPhase === sentinel;
    const phaseCount = track === 'mentor' ? PHASES.length : OM_PHASES.length;
    return (
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); pickPhase(sentinel); }}
        title={`Show all ${track === 'mentor' ? 'mentor-track' : 'office-manager-track'} phases`}
        style={{
          padding: '5px 10px',
          borderRadius: 5,
          border: `2px solid ${isActive ? '#0f1b2d' : accent}`,
          background: isActive ? '#0f1b2d' : `${accent}14`,
          cursor: 'pointer',
          font: 'inherit',
          minWidth: 50,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: isActive ? 'white' : accent, letterSpacing: 0.4 }}>ALL</div>
        <div style={{ fontSize: 8, color: isActive ? 'rgba(255,255,255,0.7)' : '#8899a6' }}>
          {phaseCount} phases
        </div>
      </button>
    );
  }

  function renderTab(ph: Phase, opts: { isCurrent: boolean; isFuture: boolean }): JSX.Element {
    const { isCurrent, isFuture } = opts;
    const ps = getPhaseProgress(data, provider!.id, ph.id);
    const isActive = ph.id === f.selectedPhase;
    const accent = TYPE_COLORS[ph.type];
    const trackBorder = ph.track === 'ops' ? OPS_COLOR : '#028090';
    return (
      <button
        key={ph.id}
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); pickPhase(ph.id); }}
        style={{
          position: 'relative',
          padding: '5px 9px',
          borderRadius: 5,
          border: `2px solid ${
            isActive
              ? '#0f1b2d'
              : isCurrent
                ? trackBorder
                : ps.pct === 100
                  ? 'rgba(34,197,94,0.5)'
                  : 'rgba(0,0,0,0.1)'
          }`,
          background: isActive ? '#0f1b2d' : isFuture ? '#f0f2f5' : 'white',
          cursor: 'pointer',
          font: 'inherit',
          minWidth: 44,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: isActive ? 'white' : accent }}>{ph.short}</div>
        <div style={{ fontSize: 8, color: isActive ? 'rgba(255,255,255,0.7)' : '#8899a6' }}>
          {isFuture ? '—' : `${ps.done}/${ps.total}`}
        </div>
        {isCurrent && !isActive && (
          <span style={{
            position: 'absolute',
            top: -3,
            right: -3,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: trackBorder,
          }} />
        )}
      </button>
    );
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); back(); }}
          title="Back"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 12,
            padding: '0 8px 0 0',
            opacity: 0.75,
            color: 'var(--type-color)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>‹</span>
          <span style={{ fontSize: 11 }}>back</span>
        </button>
        <span class="bubble__title" style={{ color: 'var(--type-color)', fontSize: 12 }}>
          {provider.name}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.6 }}>
          Current: {PHASES.find((p) => p.id === provider.currentPhase)?.label ?? '—'}
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, padding: '6px 10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#028090', letterSpacing: 0.4 }}>MENTOR TRACK</div>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 4, paddingBottom: 2 }}>
            {renderAllButton('mentor')}
            {PHASES.map((ph, i) => renderTab(ph, {
              isCurrent: ph.id === provider.currentPhase,
              isFuture: i > curIdx,
            }))}
          </div>
        </div>
        {showOps && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: OPS_COLOR, letterSpacing: 0.4 }}>
              OFFICE MANAGER TRACK <span style={{ fontWeight: 400, color: '#8899a6' }}>· MD + OM conversations</span>
            </div>
            <div style={{ display: 'flex', overflowX: 'auto', gap: 4, paddingBottom: 2 }}>
              {renderAllButton('ops')}
              {OM_PHASES.map((ph) => renderTab(ph, { isCurrent: false, isFuture: false }))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

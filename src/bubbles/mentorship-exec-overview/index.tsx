// mentorship-exec-overview primitive: aggregate cards per medical director
// for the executive view. Pushes the artifact past parity — original treats
// exec ≡ director; here exec sees a layer above. Tap a director card to drill
// into that director's matrix (sets focus.selectedDirectorId; BSP morphs to
// MENTORSHIP_EXEC_DRILLED_LAYOUT, which renders mentorship-matrix filtered to
// that director's providers).

import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import {
  mentorshipDataSignal,
  getDirectors,
  getProvidersForDirector,
  getMentorsForDirector,
  getOverallProgress,
} from '../../data/mentorshipData';
import { mentorshipFocusSignal } from '../../data/mentorshipFocus';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
}

interface DirectorAggregate {
  id: string;
  name: string;
  title: string;
  providerCount: number;
  mentorCount: number;
  avgCompletion: number;
  onTrack: number;
  needsAttention: number;
  atRisk: number;
  openFlags: number;
}

export function MentorshipExecOverview({ workspaceId }: Props): JSX.Element {
  const data = mentorshipDataSignal.value;
  const focus = mentorshipFocusSignal(workspaceId);
  const directors = getDirectors(data);

  const aggregates: DirectorAggregate[] = directors.map((d) => {
    const provs = getProvidersForDirector(data, d.id);
    const mentors = getMentorsForDirector(data, d.id);
    const completions = provs.map((p) => getOverallProgress(data, p.id));
    const avg = completions.length > 0
      ? Math.round(completions.reduce((s, n) => s + n, 0) / completions.length)
      : 0;
    const onTrack = completions.filter((c) => c >= 70).length;
    const needsAttention = completions.filter((c) => c >= 30 && c < 70).length;
    const atRisk = completions.filter((c) => c < 30).length;
    const openFlags = data.flags.filter(
      (fl) => !fl.resolved && provs.some((p) => p.id === fl.providerId),
    ).length;
    return {
      id: d.id,
      name: d.name,
      title: d.title,
      providerCount: provs.length,
      mentorCount: mentors.length,
      avgCompletion: avg,
      onTrack,
      needsAttention,
      atRisk,
      openFlags,
    };
  });

  function drill(directorId: string): void {
    focus.value = { ...focus.value, selectedDirectorId: directorId };
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>Region overview</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.6 }}>
          {directors.length} {directors.length === 1 ? 'director' : 'directors'} ·{' '}
          {data.providers.length} providers
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {aggregates.map((agg) => {
          const avgColor = agg.avgCompletion >= 70 ? '#22c55e' : agg.avgCompletion >= 30 ? '#eab308' : '#d92e2e';
          return (
            <button
              key={agg.id}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); drill(agg.id); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                padding: '14px 16px',
                border: '1.5px solid rgba(0,0,0,0.08)',
                borderRadius: 8,
                background: 'white',
                cursor: 'pointer',
                font: 'inherit',
                textAlign: 'left',
                transition: 'all 160ms',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f1b2d' }}>{agg.name}</div>
                  <div style={{ fontSize: 11, color: '#8899a6' }}>{agg.title}</div>
                </div>
                <div style={{ fontSize: 11, color: '#8899a6' }}>
                  drill in →
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                <Tile label="Providers" value={String(agg.providerCount)} color="#0f1b2d" />
                <Tile label="Mentors"   value={String(agg.mentorCount)} color="#0f1b2d" />
                <Tile label="Avg done"  value={`${agg.avgCompletion}%`} color={avgColor} />
                <Tile label="Open flags" value={String(agg.openFlags)} color={agg.openFlags > 0 ? '#d92e2e' : '#0f1b2d'} />
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 10.5 }}>
                <span style={{ color: '#22c55e' }}>● {agg.onTrack} on track</span>
                <span style={{ color: '#eab308' }}>● {agg.needsAttention} needs attn</span>
                <span style={{ color: '#d92e2e' }}>● {agg.atRisk} at risk</span>
              </div>
            </button>
          );
        })}
        {aggregates.length === 0 && (
          <div style={{ fontSize: 11, color: '#8899a6', fontStyle: 'italic', padding: 8 }}>
            No directors in seed data.
          </div>
        )}
      </div>
    </div>
  );
}

interface TileProps { label: string; value: string; color: string; }
function Tile({ label, value, color }: TileProps): JSX.Element {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.03)',
      borderRadius: 5,
      padding: '6px 4px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 17, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 9, color: '#8899a6', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 }}>{label}</div>
    </div>
  );
}

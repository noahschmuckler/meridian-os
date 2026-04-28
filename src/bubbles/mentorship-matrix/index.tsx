// mentorship-matrix primitive: the provider × phase grid.
//
// Centerpiece of director mode (and exec-drilled mode, filtered to that
// director's providers). Each row is a provider; each cell is the completion
// status for that provider × phase, color-coded by the artifact's tiering:
// green (100%), light-green (≥50%), yellow (>0%), red (current phase, 0%
// done — "due"), gray (not started, not current), very-light (future phase).
// Tapping a cell transitions the workspace to provider-detail mode.

import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import {
  mentorshipDataSignal,
  PHASES,
  OM_PHASES,
  getPhaseProgress,
  getOverallProgress,
  type ProviderRecord,
} from '../../data/mentorshipData';
import { mentorshipFocusSignal } from '../../data/mentorshipFocus';

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

type TrackFilter = 'all' | 'mentor' | 'ops';

function cellBg(pct: number, isCurrent: boolean, isFuture: boolean): string {
  if (isFuture) return '#f0f2f5';
  if (pct === 100) return '#22c55e';
  if (pct >= 50)   return '#86efac';
  if (pct > 0)     return '#fbbf24';
  if (isCurrent)   return '#fca5a5';
  return '#e5e7eb';
}

function cellFg(pct: number, isFuture: boolean): string {
  if (isFuture)    return '#c0c7d0';
  if (pct === 100) return '#ffffff';
  if (pct >= 50)   return '#14532d';
  if (pct > 0)     return '#78350f';
  return '#6b7280';
}

function overallTone(pct: number): { bg: string; fg: string } {
  if (pct >= 70) return { bg: '#dcfce7', fg: '#166534' };
  if (pct >= 30) return { bg: '#fefce8', fg: '#854d0e' };
  return { bg: '#fef2f2', fg: '#d92e2e' };
}

function opsTone(pct: number): { bg: string; fg: string } {
  if (pct >= 70) return { bg: '#e0f2fe', fg: '#0c4a6e' };
  if (pct > 0)   return { bg: '#fefce8', fg: '#854d0e' };
  return { bg: '#f3f4f6', fg: '#8899a6' };
}

export function MentorshipMatrix({ workspaceId }: Props): JSX.Element {
  const data = mentorshipDataSignal.value;
  const focus = mentorshipFocusSignal(workspaceId);
  const f = focus.value;

  // Exec-drilled mode filters to a single director's providers; director mode
  // shows all (in v1, every director can see every provider — director-scoping
  // can layer in later if needed).
  const providers: ProviderRecord[] = f.role === 'exec' && f.selectedDirectorId
    ? data.providers.filter((p) => p.directorId === f.selectedDirectorId)
    : data.providers;

  const drilledDirector = f.selectedDirectorId
    ? data.users.find((u) => u.id === f.selectedDirectorId)
    : null;

  function backToExec(): void {
    focus.value = { ...f, selectedDirectorId: null };
  }

  function openDetail(providerId: string, phaseId: string): void {
    focus.value = { ...f, selectedProviderId: providerId, selectedPhase: phaseId };
  }

  const [exporting, setExporting] = useState(false);
  const [trackFilter, setTrackFilter] = useState<TrackFilter>('all');
  const showMentor = trackFilter === 'all' || trackFilter === 'mentor';
  const showOps = trackFilter === 'all' || trackFilter === 'ops';
  const totalPhaseCols = (showMentor ? PHASES.length : 0) + (showOps ? OM_PHASES.length : 0);
  const totalOverallCols = (showMentor ? 1 : 0) + (showOps ? 1 : 0);
  // 4 base columns: provider, mentor, then conditional M%/O% chips (counted via totalOverallCols)
  const colSpan = 2 + totalOverallCols + totalPhaseCols + (showMentor && showOps ? 1 : 0);

  async function exportXlsx(): Promise<void> {
    if (exporting) return;
    setExporting(true);
    try {
      const { generateMentorshipMatrixXlsx } = await import('../../lib/generateMentorshipMatrixXlsx');
      const blob = await generateMentorshipMatrixXlsx({
        data,
        directorId: f.selectedDirectorId ?? null,
      });
      const dateStr = new Date().toISOString().slice(0, 10);
      const slug = drilledDirector
        ? drilledDirector.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
        : 'region';
      const filename = `mentorship-matrix-${slug}-${dateStr}.xlsx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err) {
      alert('XLSX export failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setExporting(false);
    }
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        {drilledDirector && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); backToExec(); }}
            title="Back to executive overview"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 11,
              padding: '0 8px 0 0',
              opacity: 0.75,
              color: 'var(--type-color)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>‹</span>
            <span>exec</span>
          </button>
        )}
        <span class="bubble__title" style={{ color: 'var(--type-color)', fontSize: 12 }}>
          {drilledDirector ? `${drilledDirector.name}'s providers` : 'Provider × Phase'}
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            title={exporting ? 'Generating…' : 'Export as Excel spreadsheet'}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); void exportXlsx(); }}
            disabled={exporting || providers.length === 0}
            style={{
              border: '1px solid rgba(0,0,0,0.15)',
              background: 'rgba(255,255,255,0.55)',
              cursor: exporting ? 'wait' : 'pointer',
              font: 'inherit',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 3,
            }}
          >{exporting ? '…' : '.xlsx'}</button>
          <span style={{ fontSize: 10, opacity: 0.6 }}>
            {providers.length} providers · {totalPhaseCols} phases
          </span>
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: 0 }}>
        <div style={{
          display: 'flex',
          gap: 6,
          padding: '8px 10px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          background: '#fafbfc',
          position: 'sticky',
          top: 0,
          zIndex: 3,
        }}>
          {([
            { id: 'all',    label: 'Both Tracks' },
            { id: 'mentor', label: 'Mentor' },
            { id: 'ops',    label: 'Ops (Office Mgr)' },
          ] as { id: TrackFilter; label: string }[]).map((t) => {
            const active = trackFilter === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setTrackFilter(t.id); }}
                style={{
                  padding: '4px 11px',
                  borderRadius: 12,
                  border: `1px solid ${active ? '#0f1b2d' : 'rgba(0,0,0,0.12)'}`,
                  background: active ? '#0f1b2d' : 'white',
                  color: active ? 'white' : '#8899a6',
                  font: 'inherit',
                  fontSize: 10.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >{t.label}</button>
            );
          })}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: trackFilter === 'all' ? 1080 : 720 }}>
          <thead>
            <tr style={{ background: '#f8f9fb' }}>
              <th style={{
                padding: '8px 10px',
                textAlign: 'left',
                fontWeight: 700,
                color: '#0f1b2d',
                borderBottom: '2px solid rgba(0,0,0,0.08)',
                position: 'sticky',
                left: 0,
                background: '#f8f9fb',
                zIndex: 2,
                minWidth: 130,
              }}>Provider</th>
              <th style={headStyle()}>Mentor</th>
              {showMentor && (
                <th style={{ ...headStyle(), textAlign: 'center', minWidth: 44, color: TYPE_COLORS.weekly }}>M%</th>
              )}
              {showMentor && PHASES.map((ph) => (
                <th
                  key={ph.id}
                  style={{
                    padding: '6px 2px',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: TYPE_COLORS[ph.type],
                    borderBottom: '2px solid rgba(0,0,0,0.08)',
                    minWidth: 38,
                    background: '#f8f9fb',
                  }}
                >
                  <div style={{ fontSize: 10 }}>{ph.short}</div>
                  {ph.md && <div style={{ fontSize: 8, color: '#8b5cf6' }}>MD</div>}
                </th>
              ))}
              {showMentor && showOps && (
                <th style={{ borderLeft: '2px solid rgba(0,0,0,0.12)', borderBottom: '2px solid rgba(0,0,0,0.08)', background: '#f8f9fb', width: 4 }} />
              )}
              {showOps && (
                <th style={{ ...headStyle(), textAlign: 'center', minWidth: 44, color: OPS_COLOR }}>O%</th>
              )}
              {showOps && OM_PHASES.map((ph) => (
                <th
                  key={ph.id}
                  style={{
                    padding: '6px 2px',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: OPS_COLOR,
                    borderBottom: '2px solid rgba(0,0,0,0.08)',
                    minWidth: 42,
                    background: '#f8f9fb',
                  }}
                >
                  <div style={{ fontSize: 10 }}>{ph.short}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {providers.map((prov) => {
              const mentor = data.users.find((u) => u.id === prov.mentorId);
              const phIdx = PHASES.findIndex((p) => p.id === prov.currentPhase);
              const mPct = getOverallProgress(data, prov.id, 'mentor');
              const oPct = getOverallProgress(data, prov.id, 'ops');
              const mTone = overallTone(mPct);
              const oTone = opsTone(oPct);
              const flagged = data.flags.some((fl) => fl.providerId === prov.id && !fl.resolved);
              return (
                <tr key={prov.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{
                    padding: '8px 10px',
                    fontWeight: 600,
                    color: '#1c2b3a',
                    position: 'sticky',
                    left: 0,
                    background: 'white',
                    zIndex: 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {flagged && <span style={{ color: '#d92e2e', fontSize: 12 }} title="Has unresolved flag">⚠</span>}
                      <div>
                        <div>{prov.name}</div>
                        <div style={{ fontSize: 9.5, fontWeight: 400, color: '#8899a6' }}>
                          {prov.role} · {prov.startDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '8px 6px', fontSize: 10, color: '#8899a6' }}>
                    {mentor?.name?.split(' ').pop() ?? '—'}
                  </td>
                  {showMentor && (
                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 700,
                        background: mTone.bg,
                        color: mTone.fg,
                      }}>{mPct}%</span>
                    </td>
                  )}
                  {showMentor && PHASES.map((ph, pi) => {
                    const ps = getPhaseProgress(data, prov.id, ph.id);
                    const isCurrent = ph.id === prov.currentPhase;
                    const isFuture = pi > phIdx;
                    const bg = cellBg(ps.pct, isCurrent, isFuture);
                    const fg = cellFg(ps.pct, isFuture);
                    return (
                      <td
                        key={ph.id}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); if (!isFuture) openDetail(prov.id, ph.id); }}
                        style={{ padding: '3px 2px', textAlign: 'center', cursor: isFuture ? 'default' : 'pointer' }}
                      >
                        <div style={{
                          padding: '6px 2px',
                          borderRadius: 4,
                          background: bg,
                          color: fg,
                          fontWeight: 700,
                          fontSize: 10,
                          border: isCurrent ? '2px solid #0f1b2d' : '2px solid transparent',
                          minHeight: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {isFuture ? '—' : ps.pct === 100 ? '✓' : `${ps.done}/${ps.total}`}
                        </div>
                      </td>
                    );
                  })}
                  {showMentor && showOps && (
                    <td style={{ borderLeft: '2px solid rgba(0,0,0,0.12)', width: 4 }} />
                  )}
                  {showOps && (
                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 700,
                        background: oTone.bg,
                        color: oTone.fg,
                      }}>{oPct}%</span>
                    </td>
                  )}
                  {showOps && OM_PHASES.map((ph) => {
                    const ps = getPhaseProgress(data, prov.id, ph.id);
                    const bg = cellBg(ps.pct, false, false);
                    const fg = cellFg(ps.pct, false);
                    return (
                      <td
                        key={ph.id}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); openDetail(prov.id, ph.id); }}
                        style={{ padding: '3px 2px', textAlign: 'center', cursor: 'pointer' }}
                      >
                        <div style={{
                          padding: '6px 2px',
                          borderRadius: 4,
                          background: bg,
                          color: fg,
                          fontWeight: 700,
                          fontSize: 10,
                          border: '2px solid transparent',
                          minHeight: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {ps.pct === 100 ? '✓' : `${ps.done}/${ps.total}`}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {providers.length === 0 && (
              <tr>
                <td colSpan={colSpan} style={{ padding: 24, textAlign: 'center', color: '#8899a6', fontSize: 12 }}>
                  No providers under this director.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function headStyle(): JSX.CSSProperties {
  return {
    padding: '8px 6px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#8899a6',
    borderBottom: '2px solid rgba(0,0,0,0.08)',
    minWidth: 70,
    background: '#f8f9fb',
  };
}

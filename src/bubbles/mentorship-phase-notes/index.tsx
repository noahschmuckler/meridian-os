// mentorship-phase-notes primitive: timestamped notes thread for the
// currently-selected provider × phase. Mentor + director roles can add notes;
// executive role is read-only.

import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { mentorshipDataSignal, ALL_PHASES } from '../../data/mentorshipData';
import { mentorshipFocusSignal } from '../../data/mentorshipFocus';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
}

// Ops-track notes are authored by a director; mentor-track notes can be either
// mentor or director.
function authorForRole(
  role: string,
  isOpsPhase: boolean,
  users: { id: string; name: string }[],
): { id: string; name: string } | null {
  const lookup = (id: string) => users.find((u) => u.id === id) ?? null;
  if (isOpsPhase) {
    return role === 'director' ? lookup('md1') : null;
  }
  switch (role) {
    case 'mentor':   return lookup('mt1');
    case 'director': return lookup('md1');
    default:         return null;
  }
}

export function MentorshipPhaseNotes({ workspaceId }: Props): JSX.Element {
  const [draft, setDraft] = useState('');
  const data = mentorshipDataSignal.value;
  const focus = mentorshipFocusSignal(workspaceId);
  const f = focus.value;

  const provider = f.selectedProviderId
    ? data.providers.find((p) => p.id === f.selectedProviderId)
    : null;
  const phase = f.selectedPhase
    ? ALL_PHASES.find((p) => p.id === f.selectedPhase)
    : null;

  if (!provider || !phase) {
    return (
      <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div class="bubble__chrome">
          <span class="bubble__title" style={{ color: 'var(--type-color)' }}>Notes</span>
        </div>
        <div class="bubble__body" style={{ flex: 1, padding: 12, color: '#8899a6', fontSize: 11 }}>
          Pick a phase tab to see notes.
        </div>
      </div>
    );
  }

  const isOpsPhase = phase.track === 'ops';
  const author = authorForRole(f.role, isOpsPhase, data.users);
  const canEdit = author !== null;
  const key = `${provider.id}:${phase.id}`;
  const notes = data.notes[key] ?? [];

  function submit(): void {
    const text = draft.trim();
    if (!text || !author || !provider || !phase) return;
    const current = mentorshipDataSignal.value;
    const k = `${provider.id}:${phase.id}`;
    const list = current.notes[k] ?? [];
    const next = {
      ...current.notes,
      [k]: [...list, { by: author.name, at: new Date().toLocaleString(), text }],
    };
    mentorshipDataSignal.value = { ...current, notes: next };
    setDraft('');
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>Notes</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.6 }}>
          {phase.label} · {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {notes.length === 0 && (
            <div style={{ fontSize: 11, color: '#8899a6', fontStyle: 'italic' }}>
              No notes yet for this phase.
            </div>
          )}
          {notes.map((n, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 6,
                padding: '7px 10px',
              }}
            >
              <div style={{ fontSize: 12, color: '#1c2b3a', lineHeight: 1.4 }}>{n.text}</div>
              <div style={{ fontSize: 9.5, color: '#8899a6', marginTop: 3 }}>
                {n.by} · {n.at}
              </div>
            </div>
          ))}
        </div>
        {canEdit ? (
          <div style={{
            padding: '8px 10px',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            gap: 6,
            alignItems: 'flex-start',
          }}>
            <textarea
              value={draft}
              placeholder="Add a note…"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onInput={(e) => setDraft((e.currentTarget as HTMLTextAreaElement).value)}
              onKeyDown={(e) => {
                if ((e as KeyboardEvent).key === 'Enter' && !(e as KeyboardEvent).shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={2}
              style={{
                flex: 1,
                font: 'inherit',
                fontSize: 12,
                padding: '6px 8px',
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: 4,
                background: 'rgba(255,255,255,0.6)',
                resize: 'vertical',
              }}
            />
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); submit(); }}
              disabled={!draft.trim()}
              style={{
                font: 'inherit',
                fontSize: 11,
                fontWeight: 600,
                padding: '7px 12px',
                border: 'none',
                borderRadius: 4,
                background: draft.trim() ? 'var(--type-color)' : 'rgba(0,0,0,0.08)',
                color: draft.trim() ? '#1a1a1a' : 'rgba(0,0,0,0.4)',
                cursor: draft.trim() ? 'pointer' : 'default',
              }}
            >Add</button>
          </div>
        ) : (
          <div style={{ padding: '8px 12px', fontSize: 10, fontStyle: 'italic', color: '#8899a6', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            {isOpsPhase ? 'Read-only — Office Manager notes are added by the medical director.' : 'Read-only (executive role).'}
          </div>
        )}
      </div>
    </div>
  );
}

// mentorship-role-selector primitive: persistent role-picker bubble.
//
// Three buttons (Executive / Director / Mentor) that write the active role to
// mentorshipFocusSignal(workspaceId). The bubble stays in place when the role
// changes; the *other* bubbles in the workspace rearrange via the BspWorkspace
// mode-aware layout effect (mirrors the clinical-modules gallery↔module
// pattern).
//
// This bubble is a meta/demo tool — final-form deployments may swap it for an
// SSO-derived role. Dismissing the bubble does not change the role; the role
// is workspace state, not bubble state.

import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { mentorshipFocusSignal, type MentorshipRole } from '../../data/mentorshipFocus';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
}

interface RoleOption {
  key: Exclude<MentorshipRole, 'idle'>;
  label: string;
  description: string;
  color: string;
}

const ROLES: RoleOption[] = [
  { key: 'exec',     label: 'Executive',        description: 'Aggregate view across directors', color: '#d92e2e' },
  { key: 'director', label: 'Medical Director', description: 'Full provider matrix · edit',     color: '#5B4FBF' },
  { key: 'mentor',   label: 'Mentor',           description: 'Own mentees · daily check-ins',   color: '#028090' },
];

export function MentorshipRoleSelector({ workspaceId }: Props): JSX.Element {
  const focus = mentorshipFocusSignal(workspaceId);
  const active = focus.value.role;

  function pick(role: Exclude<MentorshipRole, 'idle'>): void {
    // Reset selection cursors when switching role so the new role's layout
    // starts in its base state, not whatever was selected previously.
    focus.value = {
      role,
      selectedDirectorId: null,
      selectedMenteeId: null,
      selectedProviderId: null,
      selectedPhase: null,
    };
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>View as</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.55, fontStyle: 'italic' }}>demo control</span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ROLES.map((opt) => {
          const isActive = opt.key === active;
          return (
            <button
              key={opt.key}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); pick(opt.key); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2,
                padding: '8px 10px',
                border: `1.5px solid ${isActive ? opt.color : 'rgba(0,0,0,0.12)'}`,
                borderRadius: 6,
                background: isActive ? `${opt.color}14` : 'rgba(255,255,255,0.55)',
                cursor: 'pointer',
                font: 'inherit',
                textAlign: 'left',
                transition: 'all 160ms',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: isActive ? opt.color : '#1a1a1a',
                  letterSpacing: 0.2,
                }}
              >{opt.label}</span>
              <span
                style={{
                  fontSize: 10,
                  lineHeight: 1.3,
                  color: '#4a4a4a',
                  opacity: 0.85,
                }}
              >{opt.description}</span>
            </button>
          );
        })}
        {active === 'idle' && (
          <div style={{ fontSize: 10, opacity: 0.55, fontStyle: 'italic', marginTop: 4, lineHeight: 1.4 }}>
            Pick a role to load that view. Other bubbles will rearrange to match.
          </div>
        )}
      </div>
    </div>
  );
}

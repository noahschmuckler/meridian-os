// questionnaire primitive: read-only renderer for milestone-keyed onboarding
// questionnaires. In the mentorship workspace, watches the focus signal's
// selectedPhase and renders the questionnaires mapped to that phase. Honors
// the ALL_MENTOR_PHASES sentinel by stacking every questionnaire in pathway
// order (grouped by phase).
//
// Read-only by design — no inputs, no submit. Capturing responses is a
// follow-on once the harness has a place to write them.

import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import {
  mentorshipFocusSignal,
  ALL_MENTOR_PHASES,
  ALL_OPS_PHASES,
} from '../../data/mentorshipFocus';
import { ALL_PHASES } from '../../data/mentorshipData';
import {
  questionnairesForPhase,
  allQuestionnairesInOrder,
  type Questionnaire,
} from '../../data/onboardingQuestionnaires';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId?: string;
}

const ACCENT = '#028090'; // mentor-track teal, matches the Phases bubble

export function Questionnaire({ workspaceId }: Props): JSX.Element {
  if (!workspaceId) {
    return renderShell(<EmptyBody>Questionnaires bind to a workspace.</EmptyBody>);
  }

  const focus = mentorshipFocusSignal(workspaceId);
  const f = focus.value;

  if (!f.selectedProviderId) {
    return renderShell(<EmptyBody>Pick a mentee, then a phase tab to see the matching questionnaire.</EmptyBody>);
  }

  if (f.selectedPhase === ALL_OPS_PHASES) {
    return renderShell(
      <EmptyBody>Onboarding questionnaires are mentor-track only. The Office Manager track tracks operational signals separately.</EmptyBody>,
    );
  }

  if (f.selectedPhase === ALL_MENTOR_PHASES) {
    const groups = allQuestionnairesInOrder();
    return renderShell(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {groups.map(({ phaseId, questionnaires }) => {
          if (questionnaires.length === 0) return null;
          const phLabel = ALL_PHASES.find((p) => p.id === phaseId)?.label ?? phaseId;
          return (
            <section key={phaseId} style={{ borderBottom: '2px solid rgba(0,0,0,0.06)' }}>
              <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                background: '#f8f9fb',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 700,
                color: ACCENT,
              }}>
                {phLabel}
              </div>
              {questionnaires.map((q) => <QuestionnaireBlock key={q.id} questionnaire={q} compact />)}
            </section>
          );
        })}
      </div>,
      `Pathway · ${groups.filter((g) => g.questionnaires.length > 0).length} questionnaires`,
    );
  }

  if (!f.selectedPhase) {
    return renderShell(<EmptyBody>Pick a phase tab to see the matching questionnaire.</EmptyBody>);
  }

  const questionnaires = questionnairesForPhase(f.selectedPhase);
  const phLabel = ALL_PHASES.find((p) => p.id === f.selectedPhase)?.label ?? f.selectedPhase;

  if (questionnaires.length === 0) {
    return renderShell(
      <EmptyBody>No questionnaire scheduled for {phLabel}.</EmptyBody>,
      phLabel,
    );
  }

  return renderShell(
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {questionnaires.map((q) => <QuestionnaireBlock key={q.id} questionnaire={q} />)}
    </div>,
    phLabel,
  );
}

function renderShell(body: JSX.Element, headerSuffix?: string): JSX.Element {
  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: ACCENT }}>Questionnaire</span>
        {headerSuffix && (
          <span style={{ marginLeft: 8, fontSize: 11, color: '#8899a6' }}>{headerSuffix}</span>
        )}
        <span style={{
          marginLeft: 'auto',
          fontSize: 9,
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: 8,
          background: 'rgba(0,0,0,0.04)',
          color: '#8899a6',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}>read-only</span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto' }}>
        {body}
      </div>
    </div>
  );
}

function EmptyBody({ children }: { children: preact.ComponentChildren }): JSX.Element {
  return (
    <div style={{ padding: 14, color: '#8899a6', fontSize: 11.5, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function QuestionnaireBlock({ questionnaire, compact = false }: {
  questionnaire: Questionnaire;
  compact?: boolean;
}): JSX.Element {
  const padX = compact ? 14 : 14;
  const padY = compact ? 10 : 12;
  return (
    <div style={{ padding: `${padY}px ${padX}px`, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1c2b3a' }}>{questionnaire.title}</span>
        {questionnaire.subtitle && (
          <span style={{ fontSize: 10.5, color: '#8899a6', fontStyle: 'italic' }}>{questionnaire.subtitle}</span>
        )}
      </div>
      <ol style={{ margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {questionnaire.questions.map((q) => (
          <li key={q.id} style={{ fontSize: 12.5, lineHeight: 1.45, color: '#1c2b3a' }}>
            <div>{q.text}</div>
            {q.scale && (
              <div style={{ fontSize: 10.5, color: '#8899a6', marginTop: 2 }}>
                <ScalePill /> 10 = {q.scale.high} · 0 = {q.scale.low}
              </div>
            )}
            {q.openEnded && (
              <div style={{ fontSize: 10.5, color: '#8899a6', fontStyle: 'italic', marginTop: 2 }}>
                Open-ended response
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ScalePill(): JSX.Element {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 9,
      fontWeight: 700,
      padding: '1px 5px',
      borderRadius: 6,
      background: `${ACCENT}1a`,
      color: ACCENT,
      marginRight: 5,
      letterSpacing: 0.3,
    }}>0–10</span>
  );
}

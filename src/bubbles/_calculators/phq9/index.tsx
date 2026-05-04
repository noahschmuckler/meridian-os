// PHQ-9 — Patient Health Questionnaire-9, depression severity.
// Kroenke K, Spitzer RL, Williams JBW. "The PHQ-9: Validity of a Brief
// Depression Severity Measure." J Gen Intern Med 2001;16(9):606–613.
//
// Scoring: each item 0–3 over the past 2 weeks; sum is 0–27.
// Cutoffs: 5 (mild) / 10 (moderate) / 15 (mod-severe) / 20 (severe).
// Item 9 (suicidality) gets a separate alert regardless of total score —
// any non-zero answer warrants safety assessment, lethal-means counseling,
// and appropriate disposition. This is a clinical decision rule, not a
// scoring rule.

import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../../types';
import type { SeedDict } from '../../../data/seedResolver';
import {
  CalcShell,
  Intro,
  PSYCH_LIKERT,
  ResultBanner,
  ScaleRow,
  VerifyFooter,
  type Tier,
} from '../shared';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

const ITEMS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed; or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];

function classify(score: number): Tier {
  if (score >= 20) return {
    label: 'Severe depression',
    color: '#d92e2e',
    detail: 'Active treatment indicated. Consider specialist referral, intensive monitoring.',
  };
  if (score >= 15) return {
    label: 'Moderately severe',
    color: '#B45309',
    detail: 'Active treatment with pharmacotherapy and/or psychotherapy.',
  };
  if (score >= 10) return {
    label: 'Moderate depression',
    color: '#B45309',
    detail: 'Validated cut-point for major depression (sensitivity 88%, specificity 88%). Offer treatment.',
  };
  if (score >= 5) return {
    label: 'Mild depression',
    color: '#0F6B42',
    detail: 'Watchful waiting; reassess in 2–4 weeks. Consider behavioral activation.',
  };
  return {
    label: 'Minimal depression',
    color: '#0F6B42',
    detail: 'Below screening cutoff.',
  };
}

export function Phq9(_props: Props): JSX.Element {
  const [answers, setAnswers] = useState<Array<number | null>>(Array(ITEMS.length).fill(null));

  const score = answers.reduce<number>((s, v) => s + (v ?? 0), 0);
  const allAnswered = answers.every((v) => v !== null);
  const tier = classify(score);
  const item9 = answers[8];
  const item9Positive = item9 != null && item9 > 0;

  function set(i: number, v: number): void {
    setAnswers((p) => p.map((x, idx) => (idx === i ? v : x)));
  }
  function reset(): void {
    setAnswers(Array(ITEMS.length).fill(null));
  }

  return (
    <CalcShell title="PHQ-9" subtitle="Depression · 0–27" onReset={reset}>
      <Intro>
        Over the last <strong>2 weeks</strong>, how often have you been bothered by the following?
        <span style={{ display: 'block', opacity: 0.55, marginTop: 2 }}>
          0 — Not at all · 1 — Several days · 2 — More than half · 3 — Nearly every day
        </span>
      </Intro>
      {ITEMS.map((label, i) => (
        <ScaleRow
          key={i}
          index={i + 1}
          label={label}
          value={answers[i]}
          options={PSYCH_LIKERT}
          onChange={(v) => set(i, v)}
        />
      ))}
      <ResultBanner
        score={score}
        scoreSuffix=" / 27"
        tier={tier}
        partial={!allAnswered}
        partialMessage={`${answers.filter((v) => v == null).length} item(s) unanswered — partial total.`}
        notes={
          item9Positive ? (
            <div
              style={{
                marginTop: 8,
                padding: '8px 10px',
                fontSize: 11,
                lineHeight: 1.4,
                background: 'rgba(217, 46, 46, 0.10)',
                border: '1px solid rgba(217, 46, 46, 0.4)',
                borderRadius: 4,
                color: '#8b0000',
              }}
            >
              <strong>Item 9 positive (suicidality, score {item9}).</strong>{' '}
              Assess safety regardless of total score. Consider safety planning,
              lethal-means counseling, urgent psychiatric evaluation, or ED
              referral per acuity.
            </div>
          ) : null
        }
      />
      <VerifyFooter
        url="https://www.phqscreeners.com/select-screener"
        label="phqscreeners.com"
        blurb="Kroenke 2001; PHQ Screeners."
      />
    </CalcShell>
  );
}

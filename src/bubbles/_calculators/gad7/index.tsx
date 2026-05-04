// GAD-7 — Generalized Anxiety Disorder 7-item scale.
// Spitzer RL et al. "A Brief Measure for Assessing Generalized Anxiety
// Disorder: The GAD-7." Arch Intern Med 2006;166(10):1092–1097.
//
// Scoring: each item 0–3 over the past 2 weeks; sum is 0–21.
// Cutoffs: 5 (mild) / 10 (moderate) / 15 (severe). ≥10 is the typical
// referral threshold and the validated cut-point for probable GAD.

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
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
];

function classify(score: number): Tier {
  if (score >= 15) return {
    label: 'Severe anxiety',
    color: '#d92e2e',
    detail: 'Active treatment indicated. Consider specialist referral and same-week follow-up.',
  };
  if (score >= 10) return {
    label: 'Moderate anxiety',
    color: '#B45309',
    detail: 'Probable GAD per validation cohort (sensitivity 89%, specificity 82% at ≥10). Offer treatment.',
  };
  if (score >= 5) return {
    label: 'Mild anxiety',
    color: '#0F6B42',
    detail: 'Watchful waiting; reassess in 2–4 weeks. Consider behavioral strategies.',
  };
  return {
    label: 'Minimal anxiety',
    color: '#0F6B42',
    detail: 'Below screening cutoff.',
  };
}

export function Gad7(_props: Props): JSX.Element {
  const [answers, setAnswers] = useState<Array<number | null>>(Array(ITEMS.length).fill(null));

  const score = answers.reduce<number>((s, v) => s + (v ?? 0), 0);
  const allAnswered = answers.every((v) => v !== null);
  const tier = classify(score);

  function set(i: number, v: number): void {
    setAnswers((p) => p.map((x, idx) => (idx === i ? v : x)));
  }
  function reset(): void {
    setAnswers(Array(ITEMS.length).fill(null));
  }

  return (
    <CalcShell title="GAD-7" subtitle="Anxiety · 0–21" onReset={reset}>
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
        scoreSuffix=" / 21"
        tier={tier}
        partial={!allAnswered}
        partialMessage={`${answers.filter((v) => v == null).length} item(s) unanswered — partial total.`}
      />
      <VerifyFooter
        url="https://www.phqscreeners.com/select-screener"
        label="phqscreeners.com"
        blurb="Spitzer 2006; PHQ Screeners."
      />
    </CalcShell>
  );
}

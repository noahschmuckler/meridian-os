// CIWA-Ar — Clinical Institute Withdrawal Assessment for Alcohol, revised.
// Sullivan JT et al. "Assessment of Alcohol Withdrawal: The Revised Clinical
// Institute Withdrawal Assessment for Alcohol Scale (CIWA-Ar)." Br J Addict
// 1989;84(11):1353–1357.
//
// Scoring: items 1–9 score 0–7 each (max 63); item 10 (orientation/clouding
// of sensorium) scores 0–4 (max 4). Sum 0–67.
// Cutoffs: ≤8 mild · 9–15 moderate · ≥16 severe.
// Symptom-triggered benzodiazepine dosing typically begins at ≥8–10 with
// reassessment every 1–2 hours; ≥20 generally warrants ICU-level monitoring
// per ASAM guidelines.

import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../../types';
import type { SeedDict } from '../../../data/seedResolver';
import {
  CalcShell,
  Intro,
  ResultBanner,
  ScaleRow,
  VerifyFooter,
  type ScaleOption,
  type Tier,
} from '../shared';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

const ZERO_TO_SEVEN: ScaleOption[] = [0, 1, 2, 3, 4, 5, 6, 7].map((n) => ({
  value: n,
  label: String(n),
}));

const ZERO_TO_FOUR: ScaleOption[] = [0, 1, 2, 3, 4].map((n) => ({
  value: n,
  label: String(n),
}));

interface Item {
  label: string;
  description: string;
  options: ScaleOption[];
}

const ITEMS: Item[] = [
  {
    label: 'Nausea and vomiting',
    description: '0 None · 1 Mild nausea, no vomiting · 4 Intermittent nausea with dry heaves · 7 Constant nausea, frequent dry heaves and vomiting',
    options: ZERO_TO_SEVEN,
  },
  {
    label: 'Tremor (arms extended, fingers spread)',
    description: '0 None · 1 Not visible but felt at fingertips · 4 Moderate, with arms extended · 7 Severe, even with arms not extended',
    options: ZERO_TO_SEVEN,
  },
  {
    label: 'Paroxysmal sweats',
    description: '0 None · 1 Barely perceptible, palms moist · 4 Beads of sweat on forehead · 7 Drenching sweats',
    options: ZERO_TO_SEVEN,
  },
  {
    label: 'Anxiety',
    description: '0 At ease · 1 Mildly anxious · 4 Moderately anxious or guarded · 7 Acute panic state',
    options: ZERO_TO_SEVEN,
  },
  {
    label: 'Agitation',
    description: '0 Normal activity · 1 Somewhat more than normal · 4 Moderately fidgety/restless · 7 Constantly thrashes about',
    options: ZERO_TO_SEVEN,
  },
  {
    label: 'Tactile disturbances',
    description: '0 None · 1 Very mild itch / pins-and-needles · 4 Moderately severe hallucinations · 7 Continuous hallucinations',
    options: ZERO_TO_SEVEN,
  },
  {
    label: 'Auditory disturbances',
    description: '0 Not present · 1 Very mild harshness · 4 Moderately severe hallucinations · 7 Continuous hallucinations',
    options: ZERO_TO_SEVEN,
  },
  {
    label: 'Visual disturbances',
    description: '0 Not present · 1 Very mild sensitivity · 4 Moderately severe hallucinations · 7 Continuous hallucinations',
    options: ZERO_TO_SEVEN,
  },
  {
    label: 'Headache, fullness in head',
    description: '0 Not present · 1 Very mild · 4 Moderately severe · 7 Extremely severe (do NOT rate dizziness or lightheadedness)',
    options: ZERO_TO_SEVEN,
  },
  {
    label: 'Orientation and clouding of sensorium',
    description: '0 Oriented and can do serial additions · 1 Cannot do serial additions or is uncertain about date · 2 Disoriented for date by no more than 2 days · 3 Disoriented for date by more than 2 days · 4 Disoriented for place and/or person',
    options: ZERO_TO_FOUR,
  },
];

function classify(score: number): Tier {
  if (score >= 20) return {
    label: 'Severe withdrawal',
    color: '#d92e2e',
    detail: 'Severe — consider ICU-level monitoring; benzodiazepines per protocol; assess for DTs/seizure.',
  };
  if (score >= 16) return {
    label: 'Severe withdrawal',
    color: '#d92e2e',
    detail: 'Severe — symptom-triggered benzodiazepines; close monitoring; admit for medical detoxification.',
  };
  if (score >= 9) return {
    label: 'Moderate withdrawal',
    color: '#B45309',
    detail: 'Moderate — symptom-triggered benzodiazepines; reassess every 1–2 hours.',
  };
  if (score >= 1) return {
    label: 'Mild withdrawal',
    color: '#0F6B42',
    detail: 'Mild — supportive care; reassess. Symptom-triggered medication threshold typically ≥8–10.',
  };
  return {
    label: 'No withdrawal',
    color: '#0F6B42',
    detail: 'No active withdrawal symptoms.',
  };
}

export function CiwaAr(_props: Props): JSX.Element {
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
    <CalcShell title="CIWA-Ar" subtitle="Alcohol withdrawal · 0–67" onReset={reset}>
      <Intro>
        Score the patient's <strong>current</strong> symptoms. Items 1–9 are 0–7;
        item 10 (orientation) is 0–4. Symptom-triggered protocols typically dose
        benzodiazepines at score ≥8–10 and reassess every 1–2 hours.
      </Intro>
      {ITEMS.map((item, i) => (
        <ScaleRow
          key={i}
          index={i + 1}
          label={item.label}
          description={item.description}
          value={answers[i]}
          options={item.options}
          onChange={(v) => set(i, v)}
        />
      ))}
      <ResultBanner
        score={score}
        scoreSuffix=" / 67"
        tier={tier}
        partial={!allAnswered}
      />
      <VerifyFooter
        url="https://www.mdcalc.com/calc/3168/ciwa-ar-alcohol-withdrawal"
        label="MDCalc · CIWA-Ar"
        blurb="Sullivan 1989; ASAM 2020 alcohol-withdrawal-management practice guideline."
      />
    </CalcShell>
  );
}

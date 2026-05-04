// AUDIT-C — 3-item alcohol-use screen.
// Bush K et al. "The AUDIT Alcohol Consumption Questions (AUDIT-C)."
// Arch Intern Med 1998;158(16):1789–1795. NIAAA / VA endorsement.
//
// Scoring: each item 0–4; sum 0–12.
// Cutoffs (sex-specific):
//   Male:   ≥4 positive (alcohol misuse).
//   Female: ≥3 positive.
//   ≥6 in any patient suggests probable alcohol use disorder.
// "Female" cutoff is also the lower-risk threshold for patients ≥65 of any
// sex per VA guidance, but the validated study used birth sex; we keep the
// two-option toggle and surface the older-adult caveat as a footer note.

import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../../types';
import type { SeedDict } from '../../../data/seedResolver';
import {
  CalcShell,
  Intro,
  ResultBanner,
  ScaleRow,
  SegmentToggle,
  VerifyFooter,
  type ScaleOption,
  type Tier,
} from '../shared';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

type Sex = 'female' | 'male';

const FREQ_OPTS: ScaleOption[] = [
  { value: 0, label: '0', detail: 'Never' },
  { value: 1, label: '1', detail: 'Monthly or less' },
  { value: 2, label: '2', detail: '2–4 times a month' },
  { value: 3, label: '3', detail: '2–3 times a week' },
  { value: 4, label: '4', detail: '4 or more times a week' },
];

const QTY_OPTS: ScaleOption[] = [
  { value: 0, label: '0', detail: '1 or 2' },
  { value: 1, label: '1', detail: '3 or 4' },
  { value: 2, label: '2', detail: '5 or 6' },
  { value: 3, label: '3', detail: '7 to 9' },
  { value: 4, label: '4', detail: '10 or more' },
];

const BINGE_OPTS: ScaleOption[] = [
  { value: 0, label: '0', detail: 'Never' },
  { value: 1, label: '1', detail: 'Less than monthly' },
  { value: 2, label: '2', detail: 'Monthly' },
  { value: 3, label: '3', detail: 'Weekly' },
  { value: 4, label: '4', detail: 'Daily or almost daily' },
];

interface Item {
  label: string;
  description: string;
  options: ScaleOption[];
}

const ITEMS: Item[] = [
  {
    label: 'How often do you have a drink containing alcohol?',
    description: '0 Never · 1 Monthly or less · 2 2–4×/mo · 3 2–3×/wk · 4 ≥4×/wk',
    options: FREQ_OPTS,
  },
  {
    label: 'How many standard drinks containing alcohol do you have on a typical day when drinking?',
    description: '0 1–2 · 1 3–4 · 2 5–6 · 3 7–9 · 4 10+',
    options: QTY_OPTS,
  },
  {
    label: 'How often do you have 6 or more drinks on one occasion?',
    description: '0 Never · 1 < monthly · 2 Monthly · 3 Weekly · 4 Daily/almost daily',
    options: BINGE_OPTS,
  },
];

function classify(score: number, sex: Sex): Tier {
  const cutoff = sex === 'male' ? 4 : 3;
  if (score >= 6) return {
    label: 'Probable AUD',
    color: '#d92e2e',
    detail: `Score ≥6 — high likelihood of alcohol use disorder. Brief intervention + diagnostic interview (DSM-5 AUD criteria); consider MAT. (${sex === 'male' ? 'M ≥4' : 'F ≥3'} = positive screen.)`,
  };
  if (score >= cutoff) return {
    label: 'Positive screen',
    color: '#B45309',
    detail: `Score ≥${cutoff} (${sex} threshold) — at-risk drinking. Brief intervention; assess for AUD per DSM-5.`,
  };
  return {
    label: 'Negative',
    color: '#0F6B42',
    detail: `Below the ${sex} cutoff (≥${cutoff}).`,
  };
}

export function AuditC(_props: Props): JSX.Element {
  const [sex, setSex] = useState<Sex>('female');
  const [answers, setAnswers] = useState<Array<number | null>>([null, null, null]);

  const score = answers.reduce<number>((s, v) => s + (v ?? 0), 0);
  const allAnswered = answers.every((v) => v !== null);
  const tier = classify(score, sex);

  function set(i: number, v: number): void {
    setAnswers((p) => p.map((x, idx) => (idx === i ? v : x)));
  }
  function reset(): void {
    setAnswers([null, null, null]);
  }

  return (
    <CalcShell
      title="AUDIT-C"
      subtitle="Alcohol screen · 0–12"
      onReset={reset}
      rightChrome={
        <SegmentToggle
          value={sex}
          options={[
            { key: 'female', label: 'F (≥3)' },
            { key: 'male', label: 'M (≥4)' },
          ]}
          onChange={setSex}
        />
      }
    >
      <Intro>
        Past-year drinking. A standard drink ≈ 14 g ethanol (12 oz beer 5%, 5 oz wine 12%, 1.5 oz spirits 40%).
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
        scoreSuffix=" / 12"
        tier={tier}
        partial={!allAnswered}
      />
      <div style={{ fontSize: 10.5, opacity: 0.65, marginTop: 8, lineHeight: 1.4 }}>
        Older adults (≥65, any sex) — VA-DoD guidance lowers the at-risk threshold to ≥3.
        Pregnancy — any positive answer is significant; abstinence is the recommendation.
      </div>
      <VerifyFooter
        url="https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/screening-tests"
        label="NIAAA core resource"
        blurb="Bush 1998; NIAAA core-resource scoring."
      />
    </CalcShell>
  );
}

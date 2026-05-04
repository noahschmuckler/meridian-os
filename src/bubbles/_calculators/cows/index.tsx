// COWS — Clinical Opiate Withdrawal Scale.
// Wesson DR, Ling W. "The Clinical Opiate Withdrawal Scale (COWS)."
// J Psychoactive Drugs 2003;35(2):253–259. SAMHSA / ASAM endorsement.
//
// 11 items, non-uniform option values (0/1/2/4 etc.). Sum 0–48.
// Bands: 5–12 mild · 13–24 moderate · 25–36 mod-severe · ≥37 severe.
// ≥13 is the typical buprenorphine induction threshold (sufficient
// withdrawal to avoid precipitated withdrawal). Some protocols use
// ≥8 with conservative dosing or ≥11 (newer ASAM).

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

interface Item {
  label: string;
  description: string;
  options: ScaleOption[];
}

const ITEMS: Item[] = [
  {
    label: 'Resting pulse rate (bpm)',
    description: 'Measure for 1 minute',
    options: [
      { value: 0, label: '0', detail: '≤80' },
      { value: 1, label: '1', detail: '81–100' },
      { value: 2, label: '2', detail: '101–120' },
      { value: 4, label: '4', detail: '>120' },
    ],
  },
  {
    label: 'Sweating',
    description: 'Over the past 30 minutes, not attributable to room temperature or activity',
    options: [
      { value: 0, label: '0', detail: 'No reported chills or flushing' },
      { value: 1, label: '1', detail: 'Subjective chills or flushing' },
      { value: 2, label: '2', detail: 'Flushed or observable moisture on face' },
      { value: 3, label: '3', detail: 'Beads of sweat on brow or face' },
      { value: 4, label: '4', detail: 'Sweat streaming off face' },
    ],
  },
  {
    label: 'Restlessness',
    description: 'Observation during assessment',
    options: [
      { value: 0, label: '0', detail: 'Able to sit still' },
      { value: 1, label: '1', detail: 'Reports difficulty sitting still, but is able' },
      { value: 3, label: '3', detail: 'Frequent shifting or extraneous movements of legs/arms' },
      { value: 5, label: '5', detail: 'Unable to sit still for more than a few seconds' },
    ],
  },
  {
    label: 'Pupil size',
    options: [
      { value: 0, label: '0', detail: 'Pinned or normal for room light' },
      { value: 1, label: '1', detail: 'Possibly larger than normal' },
      { value: 2, label: '2', detail: 'Moderately dilated' },
      { value: 5, label: '5', detail: 'So dilated only the rim of the iris is visible' },
    ],
    description: '',
  },
  {
    label: 'Bone or joint aches',
    description: 'Rate only the additional pain over baseline if pre-existing',
    options: [
      { value: 0, label: '0', detail: 'Not present' },
      { value: 1, label: '1', detail: 'Mild diffuse discomfort' },
      { value: 2, label: '2', detail: 'Patient reports severe diffuse aching of joints/muscles' },
      { value: 4, label: '4', detail: 'Patient is rubbing joints/muscles, unable to sit still' },
    ],
  },
  {
    label: 'Runny nose or tearing',
    description: 'Not accounted for by cold or allergies',
    options: [
      { value: 0, label: '0', detail: 'Not present' },
      { value: 1, label: '1', detail: 'Nasal stuffiness or unusually moist eyes' },
      { value: 2, label: '2', detail: 'Nose running or tearing' },
      { value: 4, label: '4', detail: 'Nose constantly running or tears streaming down cheeks' },
    ],
  },
  {
    label: 'GI upset',
    description: 'Over the last 30 minutes',
    options: [
      { value: 0, label: '0', detail: 'No GI symptoms' },
      { value: 1, label: '1', detail: 'Stomach cramps' },
      { value: 2, label: '2', detail: 'Nausea or loose stool' },
      { value: 3, label: '3', detail: 'Vomiting or diarrhea' },
      { value: 5, label: '5', detail: 'Multiple episodes of diarrhea or vomiting' },
    ],
  },
  {
    label: 'Tremor',
    description: 'Observation of outstretched hands',
    options: [
      { value: 0, label: '0', detail: 'No tremor' },
      { value: 1, label: '1', detail: 'Tremor can be felt but not observed' },
      { value: 2, label: '2', detail: 'Slight tremor observable' },
      { value: 4, label: '4', detail: 'Gross tremor or muscle twitching' },
    ],
  },
  {
    label: 'Yawning',
    description: 'Observation during assessment',
    options: [
      { value: 0, label: '0', detail: 'No yawning' },
      { value: 1, label: '1', detail: 'Yawning once or twice during assessment' },
      { value: 2, label: '2', detail: 'Yawning ≥3 times during assessment' },
      { value: 4, label: '4', detail: 'Yawning several times per minute' },
    ],
  },
  {
    label: 'Anxiety or irritability',
    description: '',
    options: [
      { value: 0, label: '0', detail: 'None' },
      { value: 1, label: '1', detail: 'Patient reports increasing irritability or anxiousness' },
      { value: 2, label: '2', detail: 'Patient obviously irritable or anxious' },
      { value: 4, label: '4', detail: 'So irritable or anxious that participation in the assessment is difficult' },
    ],
  },
  {
    label: 'Gooseflesh skin',
    description: '',
    options: [
      { value: 0, label: '0', detail: 'Skin is smooth' },
      { value: 3, label: '3', detail: 'Piloerection of skin can be felt or hairs standing up on arms' },
      { value: 5, label: '5', detail: 'Prominent piloerection' },
    ],
  },
];

function classify(score: number): Tier {
  if (score >= 37) return {
    label: 'Severe withdrawal',
    color: '#d92e2e',
    detail: 'Severe withdrawal. Buprenorphine induction appropriate; consider higher initial dose with close monitoring.',
  };
  if (score >= 25) return {
    label: 'Mod–severe withdrawal',
    color: '#d92e2e',
    detail: 'Moderately severe. Buprenorphine induction indicated.',
  };
  if (score >= 13) return {
    label: 'Moderate withdrawal',
    color: '#B45309',
    detail: 'Moderate withdrawal. Buprenorphine induction threshold typically ≥13 — sufficient withdrawal to avoid precipitated withdrawal.',
  };
  if (score >= 5) return {
    label: 'Mild withdrawal',
    color: '#0F6B42',
    detail: 'Mild withdrawal. Below induction threshold; reassess; supportive care.',
  };
  return {
    label: 'No withdrawal',
    color: '#0F6B42',
    detail: 'No clinically significant withdrawal.',
  };
}

export function Cows(_props: Props): JSX.Element {
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
    <CalcShell title="COWS" subtitle="Opioid withdrawal · 0–48" onReset={reset}>
      <Intro>
        Score the patient's <strong>current</strong> opioid withdrawal symptoms.
        Buprenorphine induction is typically deferred until score ≥13 to avoid
        precipitated withdrawal.
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
        scoreSuffix=" / 48"
        tier={tier}
        partial={!allAnswered}
      />
      <VerifyFooter
        url="https://www.drugabuse.gov/sites/default/files/files/ClinicalOpiateWithdrawalScale.pdf"
        label="NIDA / SAMHSA · COWS"
        blurb="Wesson 2003; SAMHSA TIP 63 buprenorphine guidance."
      />
    </CalcShell>
  );
}

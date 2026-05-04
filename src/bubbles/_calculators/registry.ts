// Calculator registry for the Track-4a clinical-tools spawn cards.
// Each entry maps a calculator id (also the BubblePrimitiveType) to its
// display fields + the Preact component that renders the bubble body.
//
// The clinical-tools bubble reads CALCULATORS to render its card list and
// to spawn the corresponding bubble via the `meridian:spawn-bubble` /
// `onSpawnBubble` pattern. Modules can declare `recommended_calculators?:
// string[]` (matching ids here) and clinical-tools will float those cards
// to the top of the list when that module is in focus.
//
// PreventCalculator already has its own type / file outside this directory;
// we register it here too so clinical-tools has a single source of truth
// for the calculator catalog.

import type { ComponentType } from 'preact';
import type { BubbleInstance, BubblePrimitiveType } from '../../types';
import type { SeedDict } from '../../data/seedResolver';

import { Gad7 } from './gad7';
import { Phq9 } from './phq9';
import { AuditC } from './audit-c';
import { CiwaAr } from './ciwa-ar';
import { Cows } from './cows';
import { PreventCalculator } from '../prevent-calculator';

export interface CalcProps {
  instance: BubbleInstance;
  seeds: SeedDict;
}

export interface CalculatorEntry {
  id: string;
  type: BubblePrimitiveType;
  title: string;
  glyph: string;
  blurb: string;
  // Optional categorization for the clinical-tools list — kept open so
  // future entries can group differently without a schema bump.
  category?: 'cardiometabolic' | 'mental-health' | 'substance-use';
  component: ComponentType<CalcProps>;
}

export const CALCULATORS: CalculatorEntry[] = [
  {
    id: 'prevent-calculator',
    type: 'prevent-calculator',
    title: 'PREVENT',
    glyph: '🫀',
    blurb: '10-yr ASCVD · AHA/ACC 2023',
    category: 'cardiometabolic',
    component: PreventCalculator as ComponentType<CalcProps>,
  },
  {
    id: 'gad7',
    type: 'gad7',
    title: 'GAD-7',
    glyph: '🧠',
    blurb: 'Anxiety · 7 items · 0–21',
    category: 'mental-health',
    component: Gad7,
  },
  {
    id: 'phq9',
    type: 'phq9',
    title: 'PHQ-9',
    glyph: '💭',
    blurb: 'Depression · 9 items · 0–27',
    category: 'mental-health',
    component: Phq9,
  },
  {
    id: 'audit-c',
    type: 'audit-c',
    title: 'AUDIT-C',
    glyph: '🥂',
    blurb: 'Alcohol use · 3 items · sex-specific',
    category: 'substance-use',
    component: AuditC,
  },
  {
    id: 'ciwa-ar',
    type: 'ciwa-ar',
    title: 'CIWA-Ar',
    glyph: '🥃',
    blurb: 'Alcohol withdrawal · 10 items · 0–67',
    category: 'substance-use',
    component: CiwaAr,
  },
  {
    id: 'cows',
    type: 'cows',
    title: 'COWS',
    glyph: '💊',
    blurb: 'Opioid withdrawal · 11 items · 0–48',
    category: 'substance-use',
    component: Cows,
  },
];

export function findCalculator(id: string): CalculatorEntry | undefined {
  return CALCULATORS.find((c) => c.id === id);
}

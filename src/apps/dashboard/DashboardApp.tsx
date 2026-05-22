import type { ComponentChildren, JSX } from 'preact';
import { useState } from 'preact/hooks';
import { setLauncherApp } from '../../data/launcherState';
import cohortJson from '../../data/seed/dashboard-cohort.json';
import './dashboard.css';

type Layout = 'landscape' | 'portrait';
type SectionId = 'hedis' | 'awv' | 'rvu' | 'goals' | 'vbc' | 'patients';

interface Tile {
  id: SectionId;
  tint: 'sky' | 'sage' | 'gold' | 'warm' | 'coral' | 'teal';
  icon: string;
  bigNumber: string;
  title: string;
  body: string;
  tag: string;
}

const TILES: Tile[] = [
  {
    id: 'hedis',
    tint: 'sky',
    icon: '📊',
    bigNumber: '74.8%',
    title: 'HEDIS Composite',
    body: 'Quality measures across 12 HEDIS metrics — diabetes, cancer screening, BP, depression.',
    tag: 'Quality',
  },
  {
    id: 'awv',
    tint: 'sage',
    icon: '🩺',
    bigNumber: '62',
    title: 'Unscheduled AWVs',
    body: 'Medicare wellness visits overdue · 94 completed of 187 eligible.',
    tag: 'Medicare',
  },
  {
    id: 'rvu',
    tint: 'gold',
    icon: '💰',
    bigNumber: '+73',
    title: 'Above Par wRVU',
    body: 'YTD through Q2 · ~$3,066 estimated bonus accruing on overage.',
    tag: 'Revenue',
  },
  {
    id: 'goals',
    tint: 'warm',
    icon: '⚙️',
    bigNumber: '1 / 3',
    title: 'Epic Goals Met',
    body: 'Quarterly performance targets — in-basket time, note time, refill time.',
    tag: 'Operations',
  },
  {
    id: 'vbc',
    tint: 'coral',
    icon: '🔁',
    bigNumber: '22',
    title: 'HCC Pending',
    body: 'Awaiting attestation · plus 9 transitional-care patients unscheduled.',
    tag: 'Value-Based Care',
  },
  {
    id: 'patients',
    tint: 'teal',
    icon: '📅',
    bigNumber: '5',
    title: 'Patients Tomorrow',
    body: 'Click for the schedule with care gaps and major opportunities flagged.',
    tag: 'Schedule',
  },
];

// ── HEDIS data (port of ~/Downloads/meridian-dashboard.jsx HEDIS_MEASURES) ───
interface HedisMeasure { id: string; label: string; pct: number; target: number; panelN: number }
const HEDIS_MEASURES: HedisMeasure[] = [
  { id: 'dm-a1c', label: 'DM — A1c Control', pct: 74, target: 80, panelN: 188 },
  { id: 'dm-bp', label: 'DM — BP <140/90', pct: 81, target: 75, panelN: 188 },
  { id: 'dm-eye', label: 'DM — Eye Exam', pct: 58, target: 70, panelN: 188 },
  { id: 'dm-neph', label: 'DM — Nephropathy', pct: 88, target: 80, panelN: 188 },
  { id: 'cad-statin', label: 'CAD — Statin Therapy', pct: 91, target: 85, panelN: 97 },
  { id: 'bp-ctrl', label: 'HTN — BP Control', pct: 66, target: 75, panelN: 312 },
  { id: 'cancer-bc', label: 'Breast Cancer Screen', pct: 72, target: 80, panelN: 254 },
  { id: 'cancer-cc', label: 'Colorectal Screen', pct: 69, target: 75, panelN: 408 },
  { id: 'dep-f-up', label: 'Depression F/U', pct: 83, target: 80, panelN: 142 },
  { id: 'asthma', label: 'Asthma Med Ratio', pct: 79, target: 75, panelN: 88 },
  { id: 'prev-care', label: 'Preventive Care Visit', pct: 61, target: 70, panelN: 1842 },
  { id: 'immuniz', label: 'Childhood Immunization', pct: 88, target: 85, panelN: 64 },
];

// ── Per-measure drill-in detail — description, monthly glidepath (Jan–Oct
// actuals), and Epic-derived sub-cohorts. Sub-cohorts are hand-crafted to be
// the kind of patient list a director would want to pull for outreach.
interface SubCohort { id: string; label: string; count: number; description: string }
interface HedisMeasureDetail {
  description: string;
  baseline: number;     // Jan actual
  actual: number[];     // 10 monthly data points Jan–Oct
  subCohorts: SubCohort[];
}
const HEDIS_MEASURE_DETAILS: Record<string, HedisMeasureDetail> = {
  'dm-a1c': {
    description: 'Adults 18–75 with Type 1 or Type 2 diabetes whose most recent HbA1c result in the measurement year is ≤9%. Counted in compliance when the most recent A1c in the past 12 months meets threshold. A1c missing entirely is treated as non-compliant.',
    baseline: 68,
    actual: [68, 69, 70, 71, 71, 72, 72, 73, 74, 74],
    subCohorts: [
      { id: 'a1c-overdue', label: 'A1c >9 with overdue appointment', count: 14, description: 'Last A1c >9% AND no scheduled or completed visit in the last 120 days. Outreach candidates for proactive scheduling.' },
      { id: 'a1c-stale', label: 'No A1c on file in 12 months', count: 21, description: 'Has DM problem on chart but no HbA1c result in the past 12 months. Order panel + brief telehealth check-in closes the gap.' },
      { id: 'a1c-insulin-no-fu', label: 'Recently started insulin, no 90-day F/U', count: 6, description: 'Insulin initiated in past 6 months without a documented 90-day follow-up visit. High-risk for hypoglycemic events.' },
      { id: 'a1c-no-second-line', label: 'A1c >8 on metformin monotherapy', count: 11, description: 'A1c >8% on metformin alone for ≥6 months without GLP-1 / SGLT2 / DPP4 add-on or documented contraindication.' },
    ],
  },
  'dm-bp': {
    description: 'Adults 18–75 with diabetes whose most recent BP reading in the measurement year is <140/90 mm Hg. Most-recent reading rules: same-day duplicates use the lower systolic; office and home readings both count if documented in Epic.',
    baseline: 76,
    actual: [76, 77, 78, 79, 80, 80, 81, 81, 81, 81],
    subCohorts: [
      { id: 'bp-no-recheck', label: 'Elevated BP, no second-check documented', count: 9, description: 'Single in-office BP ≥140/90 at last visit without a documented repeat reading in the same encounter. Closes immediately with rooming protocol fix.' },
      { id: 'bp-diabetes-aceiarb', label: 'DM + uncontrolled BP, no ACEi/ARB', count: 18, description: 'BP ≥140/90 and on chronic DM Rx without ACEi or ARB. Renal-protective add-on indicated.' },
    ],
  },
  'dm-eye': {
    description: 'Adults 18–75 with diabetes who had a retinal or dilated eye exam by an optometrist or ophthalmologist in the measurement year (or a negative exam in the prior year). External-result documentation accepted via quality code 2022F.',
    baseline: 49,
    actual: [49, 51, 53, 54, 55, 56, 57, 57, 58, 58],
    subCohorts: [
      { id: 'eye-overdue', label: 'No exam on file >12 months', count: 79, description: 'Largest single sub-cohort. Bulk SmartList outreach + scheduling assist closes most. Consider in-office retinal imaging partnership.' },
      { id: 'eye-refused', label: 'Refused at last visit, no re-counsel', count: 14, description: 'Patient declined screening referral at last visit without documented re-discussion in the past 6 months.' },
      { id: 'eye-external-not-scanned', label: 'External exam result not in chart', count: 11, description: 'Provider verbally referenced an outside ophthalmology visit but no result document or 2022F quality code on file.' },
    ],
  },
  'dm-neph': {
    description: 'Adults 18–75 with diabetes who had at least one urine albumin-to-creatinine ratio (uACR) AND an eGFR in the measurement year. Both must be documented; one alone does not close the measure.',
    baseline: 84,
    actual: [84, 85, 85, 86, 86, 87, 87, 88, 88, 88],
    subCohorts: [
      { id: 'neph-no-uacr', label: 'eGFR done, uACR missing', count: 16, description: 'Order uACR at next routine lab draw — most patients are due for an eGFR repeat at the same interval.' },
      { id: 'neph-egfr-low-no-arb', label: 'eGFR <60 not on ACEi/ARB', count: 9, description: 'Kidney-protective Rx indicated unless contraindicated. Consider hyperkalemia risk and titrate.' },
    ],
  },
  'cad-statin': {
    description: 'Adults 21–75 with clinical ASCVD who received a statin prescription during the measurement year. Both moderate- and high-intensity statins count; ezetimibe alone does not.',
    baseline: 84,
    actual: [84, 85, 86, 87, 88, 89, 90, 90, 91, 91],
    subCohorts: [
      { id: 'cad-no-statin', label: 'ASCVD with no statin Rx', count: 5, description: 'Active ASCVD diagnosis without any statin prescription in the past 12 months. Highest-priority outreach.' },
      { id: 'cad-low-intensity', label: 'LDL >70 on low-intensity statin', count: 12, description: 'On simvastatin 10–20 or pravastatin 10–20 with LDL still >70. Up-titrate or switch to high-intensity.' },
      { id: 'cad-discontinued', label: 'Statin discontinued, reason undocumented', count: 4, description: 'Active statin Rx in prior year, no Rx in past 6 months, no chart documentation of intolerance or shared-decision-making.' },
    ],
  },
  'bp-ctrl': {
    description: 'Adults 18–85 with hypertension whose most recent BP reading in the measurement year is <140/90 mm Hg. Most challenging measure for our panel — represents ~312 patients with active HTN diagnoses across the practice.',
    baseline: 62,
    actual: [62, 63, 63, 64, 65, 65, 66, 66, 66, 66],
    subCohorts: [
      { id: 'bp-no-second-check', label: 'Out-of-range BP, no second check', count: 24, description: 'In-office BP ≥140/90 at last encounter without a documented repeat in the same visit. Rooming SOP catches these.' },
      { id: 'bp-uncontrolled-undertreated', label: 'BP >140/90 at ≥2 visits on <3 BP agents', count: 41, description: 'Persistent uncontrolled BP across two or more recent visits while on fewer than 3 antihypertensive agents — under-treatment cohort.' },
      { id: 'bp-no-home-bp', label: 'No home BP readings documented in 6 months', count: 56, description: 'No SmartForm or device-uploaded home BP readings in chart in the last 6 months. Pairing with home cuff loaner program closes the gap.' },
      { id: 'bp-sdoh', label: 'Med-noncompliance + SDoH flags', count: 7, description: 'Missed refills + documented SDoH risks (transportation, food insecurity). Care coordination referral indicated.' },
    ],
  },
  'cancer-bc': {
    description: 'Women 50–74 who had a mammogram in the measurement year or the prior year. Bilateral mastectomy history excludes from the denominator if documented with appropriate ICD-10.',
    baseline: 65,
    actual: [65, 66, 67, 68, 69, 70, 71, 71, 72, 72],
    subCohorts: [
      { id: 'bc-ordered-no-results', label: 'Mammogram ordered, results not scanned', count: 22, description: 'Order placed in Epic but no result document attached to the chart. Likely completed externally — manual reconciliation closes the gap.' },
      { id: 'bc-refused-no-recounsel', label: 'Refused mammogram, no documented re-counsel', count: 13, description: 'Patient declined at last visit with no re-discussion documented in the past 12 months.' },
      { id: 'bc-history-not-coded', label: 'Bilateral mastectomy hx, not on problem list', count: 4, description: 'Surgical history present in old notes but not formally coded — excluding these correctly improves the denominator.' },
    ],
  },
  'cancer-cc': {
    description: 'Adults 45–75 with a documented colorectal cancer screening in the appropriate interval — colonoscopy within 10 years, sigmoidoscopy within 5, FIT/Cologuard/Guardant-Shield within 1 year, or CT colonography within 5 years.',
    baseline: 60,
    actual: [60, 62, 63, 64, 65, 66, 67, 68, 69, 69],
    subCohorts: [
      { id: 'cc-ordered-no-results', label: 'Colonoscopy / Cologuard / Guardant order, no results', count: 31, description: 'Order placed in Epic but no result document in the chart. Largest gap-closure opportunity — most have been completed externally.' },
      { id: 'cc-refused-no-recounsel', label: 'Refused screening, no re-counsel in 12 mo', count: 18, description: 'Declined at last visit without documented re-discussion. Cologuard/Guardant-Shield often acceptable to colonoscopy-refusers.' },
      { id: 'cc-overdue-50plus', label: 'Age 50+, no screening on file ever', count: 9, description: 'Higher-risk cohort. Combined gap with breast and cervical cancer screening — bundle into a single preventive visit.' },
    ],
  },
  'dep-f-up': {
    description: 'Patients ≥12 with a PHQ-9 score indicating moderate to severe depression (≥10) who received follow-up within 30 days. Follow-up = in-person, telehealth, or telephone encounter with the prescriber or a behavioral health clinician.',
    baseline: 78,
    actual: [78, 79, 80, 81, 82, 82, 83, 83, 83, 83],
    subCohorts: [
      { id: 'phq9-mod-no-fu', label: 'PHQ-9 moderate, no F/U scheduled', count: 6, description: 'PHQ-9 score 10–14 at last visit with no follow-up encounter scheduled within 30 days. Briefcase outreach via care manager.' },
      { id: 'phq9-severe-no-psych', label: 'PHQ-9 ≥20, no psychiatry referral', count: 3, description: 'Severe-range PHQ-9 without a documented psychiatry / behavioral health referral. Urgent outreach indicated.' },
      { id: 'antidep-no-6wk', label: 'Started antidepressant, no 6-week check-in', count: 8, description: 'New SSRI / SNRI prescription >6 weeks ago without follow-up to assess response and tolerability.' },
    ],
  },
  'asthma': {
    description: 'Patients 5–64 with persistent asthma whose ratio of controller medications (ICS, ICS/LABA, LTRA) to total asthma medications is ≥0.5 over the measurement year.',
    baseline: 73,
    actual: [73, 74, 75, 76, 77, 78, 78, 79, 79, 79],
    subCohorts: [
      { id: 'asthma-saba-heavy', label: 'SABA fills > controller fills', count: 11, description: 'More short-acting beta-agonist fills than controller fills in the past 12 months. Over-reliance on rescue inhaler — controller step-up indicated.' },
      { id: 'asthma-ed-no-controller', label: 'ED visit for asthma, no controller on file', count: 4, description: 'Asthma-coded ED encounter in past 90 days with no active controller prescription. Highest-acuity gap closure.' },
    ],
  },
  'prev-care': {
    description: 'Patients with at least one preventive care visit (annual physical, AWV, well-child) in the measurement year. Overlaps with the Medicare AWV measure on the dashboard for Medicare-eligible patients.',
    baseline: 52,
    actual: [52, 54, 55, 57, 58, 59, 60, 60, 61, 61],
    subCohorts: [
      { id: 'prev-medicare-no-awv', label: 'Medicare-eligible, no AWV in 12 mo', count: 62, description: 'Mirrors the Medicare AWV unscheduled cohort. NP-led AWV expansion is the primary closure vector.' },
      { id: 'prev-commercial-no-physical', label: 'Commercial, no annual physical in 18 mo', count: 138, description: 'Non-Medicare patients overdue for any preventive visit. Bulk-outreach friendly with online self-scheduling.' },
      { id: 'prev-pediatric-overdue', label: 'Pediatric well-child >9 months overdue', count: 24, description: 'Children due for AAP-recommended well-child checks. Schedule alongside school/sports physical season.' },
    ],
  },
  'immuniz': {
    description: 'Combo 10 — children who turned 2 in the measurement year with the complete childhood vaccine schedule (DTaP, IPV, MMR, HiB, Hep B, VZV, PCV, Hep A, Rotavirus, Influenza).',
    baseline: 82,
    actual: [82, 83, 84, 85, 86, 87, 87, 88, 88, 88],
    subCohorts: [
      { id: 'immuniz-catchup', label: 'Missed catch-up dose, parent open to vaccination', count: 5, description: 'Single missing dose with no documented parental refusal. Routine outreach closes most.' },
      { id: 'immuniz-refused-recounsel', label: 'Documented refusal, no re-counsel in 12 mo', count: 3, description: 'Vaccine-hesitant families where last re-counseling was >12 months ago. AAP shared-decision conversation script in MyChart pre-visit.' },
    ],
  },
};

// ── Cross-measure non-compliance cohorts ─────────────────────────────────────
interface CrossMeasureGroup {
  id: string;
  n: number;
  title: string;
  description: string;
  measureLabels: string[];
  tone: 'red' | 'amber' | 'navy';
}
const CROSS_MEASURE_GROUPS: CrossMeasureGroup[] = [
  {
    id: 'dm-triple',
    n: 23,
    title: 'Diabetes triple-fail',
    description: 'A1c above goal AND BP ≥140/90 AND no eye exam in 12 months. The DM cohort that drives DCSI escalation risk.',
    measureLabels: ['DM A1c', 'DM BP', 'DM Eye'],
    tone: 'red',
  },
  {
    id: 'cad-htn',
    n: 41,
    title: 'ASCVD + uncontrolled BP',
    description: 'On guideline-indicated statin AND BP ≥140/90 at last reading. Highest-yield combined CV-risk reduction cohort.',
    measureLabels: ['CAD Statin', 'HTN BP'],
    tone: 'red',
  },
  {
    id: 'dm-cad',
    n: 32,
    title: 'Diabetes + off statin',
    description: 'A1c above goal AND no statin Rx despite ASCVD, age 40–75, or 10-year ASCVD risk ≥7.5%.',
    measureLabels: ['DM A1c', 'CAD Statin'],
    tone: 'amber',
  },
  {
    id: 'five-plus',
    n: 18,
    title: '5+ measures out of range',
    description: 'Non-compliant on at least 5 of 12 HEDIS measures. Complex-polychronic patients — candidates for CCM enrollment.',
    measureLabels: ['5+ measures'],
    tone: 'amber',
  },
  {
    id: 'all-12',
    n: 3,
    title: 'Out on all 12 measures',
    description: 'The full sweep — three patients miss every measure. Comprehensive care-plan reset visit indicated.',
    measureLabels: ['All 12'],
    tone: 'navy',
  },
];

// ── AWV data ─────────────────────────────────────────────────────────────────
const AWV_DATA: Array<{ key: string; n: number; label: string; tone: 'blue' | 'green' | 'amber' | 'red' }> = [
  { key: 'eligible', n: 187, label: 'Eligible', tone: 'blue' },
  { key: 'completed', n: 94, label: 'Completed', tone: 'green' },
  { key: 'scheduled', n: 31, label: 'Scheduled', tone: 'amber' },
  { key: 'unscheduled', n: 62, label: 'Unscheduled', tone: 'red' },
];

const UNSCHEDULED_AWV_PATIENTS = [
  { name: 'ALDERMAN, PATRICIA', dob: '04/12/1944', mrn: '1042817', lastVisit: '11/03/2024', insurance: 'Medicare' },
  { name: 'BERGMAN, HAROLD', dob: '09/28/1938', mrn: '1051293', lastVisit: '02/17/2025', insurance: 'Medicare' },
  { name: 'CASTELLANO, ROSE', dob: '11/14/1946', mrn: '1067831', lastVisit: '08/22/2024', insurance: 'Medicare Advantage' },
  { name: 'DEVEREAUX, LOUIS', dob: '03/05/1950', mrn: '1078420', lastVisit: '01/09/2025', insurance: 'Medicare' },
  { name: 'ENGSTROM, MARIAN', dob: '07/30/1942', mrn: '1084551', lastVisit: '06/15/2024', insurance: 'Medicare' },
];

// ── RVU data ─────────────────────────────────────────────────────────────────
const RVU_CODES = [
  { code: '99213', desc: 'Office visit — Level 3', ytd: 142, avg: 118 },
  { code: '99214', desc: 'Office visit — Level 4', ytd: 198, avg: 174 },
  { code: '99215', desc: 'Office visit — Level 5', ytd: 61, avg: 49 },
  { code: '99395', desc: 'Preventive — 18–39', ytd: 22, avg: 28 },
  { code: '99396', desc: 'Preventive — 40–64', ytd: 48, avg: 41 },
  { code: '99397', desc: 'Preventive — 65+', ytd: 31, avg: 27 },
  { code: 'G0438', desc: 'AWV — Initial', ytd: 14, avg: 12 },
  { code: 'G0439', desc: 'AWV — Subsequent', ytd: 38, avg: 34 },
  { code: 'G0468', desc: 'AWV — NP (IPPE)', ytd: 9, avg: 11 },
  { code: 'G2211', desc: 'Complexity add-on', ytd: 104, avg: 87 },
  { code: '99406', desc: 'Smoking cessation 3–10 min', ytd: 18, avg: 14 },
  { code: '99407', desc: 'Smoking cessation >10 min', ytd: 7, avg: 5 },
  { code: '99421', desc: 'Obesity counseling', ytd: 23, avg: 19 },
  { code: '99422', desc: 'ASCVD counseling', ytd: 11, avg: 9 },
];

interface QuarterDatum {
  wRVU: number; par: number; bonus: number; vatSign: number; vatRev: number; hccClosed: number; hccOpen: number; projected?: boolean;
}
const QUARTER_DATA: Record<'Q1' | 'Q2' | 'Q3', QuarterDatum> = {
  Q1: { wRVU: 892, par: 880, bonus: 1240, vatSign: 14, vatRev: 1820, hccClosed: 38, hccOpen: 12 },
  Q2: { wRVU: 941, par: 880, bonus: 1830, vatSign: 19, vatRev: 2470, hccClosed: 44, hccOpen: 9 },
  Q3: { wRVU: 877, par: 880, bonus: 0, vatSign: 11, vatRev: 1430, hccClosed: 29, hccOpen: 22, projected: true },
};

// ── Epic performance goals ───────────────────────────────────────────────────
type GoalStatus = 'met' | 'progress' | 'open';
interface Goal {
  metric: string;
  status: GoalStatus;
  baseline: string;
  target: string;
  current: string;
  quarters: Array<{ q: string; measurement: string; intervention: string; outcome: 'green' | 'amber' }>;
}
const GOALS: Goal[] = [
  {
    metric: 'In-Basket Time', status: 'met',
    baseline: '94 min/day', target: '45 min/day', current: '43 min/day',
    quarters: [
      { q: "Q3 '24", measurement: '94 min/day — significantly above avg (45 min)', intervention: 'Introduced in-basket quick actions and delegated routine refills to care team.', outcome: 'amber' },
      { q: "Q4 '24", measurement: '62 min/day — 34% improvement, not yet at goal', intervention: 'Lab interpretation paired with scheduled visit or telemedicine workflow.', outcome: 'amber' },
      { q: "Q1 '25", measurement: '43 min/day — at goal ✓', intervention: 'Goal met. Maintenance strategies reinforced.', outcome: 'green' },
    ],
  },
  {
    metric: 'Time Spent in Notes', status: 'progress',
    baseline: '80 min/day', target: '45 min/day', current: '58 min/day',
    quarters: [
      { q: "Q4 '24", measurement: '80 min/day — above avg (45 min)', intervention: 'DAX Copilot activation and onboarding session.', outcome: 'amber' },
      { q: "Q1 '25", measurement: '58 min/day — 28% improvement, not yet at goal', intervention: 'Optimized progress note template; custom DAX Copilot settings.', outcome: 'amber' },
    ],
  },
  {
    metric: 'Prescription Refill Time', status: 'open',
    baseline: '46 min/day', target: '25 min/day', current: '46 min/day',
    quarters: [
      { q: "Q1 '25", measurement: '46 min/day — 20 min above provider avg (26 min)', intervention: 'Opt-in In-Basket Assist activated; team protocols reviewed.', outcome: 'amber' },
    ],
  },
];

// ── Value-Based Care measures ────────────────────────────────────────────────
const VBCARE = [
  { measure: 'DM — A1c <8%', panelN: 84, compliant: 62, pct: 74 },
  { measure: 'HTN — BP <140/90', panelN: 211, compliant: 139, pct: 66 },
  { measure: 'Colorectal Screen', panelN: 178, compliant: 123, pct: 69 },
  { measure: 'Statin — ASCVD', panelN: 97, compliant: 88, pct: 91 },
  { measure: 'HCC — Confirmed', panelN: 51, compliant: 38, pct: 75 },
  { measure: 'AWV — Completed', panelN: 187, compliant: 94, pct: 50 },
];

// ── Patient cohort ───────────────────────────────────────────────────────────
interface PatientProblem { id: string; text: string; icd10: string }
interface PatientVital { id: string; label: string; value: string; date: string }
interface PatientLab { id: string; label: string; value: string; unit?: string; date: string; flag?: 'high' | 'low' }
interface PatientMed { id: string; text: string }
interface PatientHardStop { id: string; text: string; severity: 'high' | 'medium' }
interface PatientOppDetail { label: string; text: string }
interface PatientOpportunity {
  id: string; category: string; summary: string; codes: string; details: PatientOppDetail[];
}
interface Patient {
  name: string; mrn: string; age: string; sex: string;
  problems: PatientProblem[];
  vitals: PatientVital[];
  labs: PatientLab[];
  medications: PatientMed[];
  hardStops: PatientHardStop[];
  payer: { name: string; product: string; risk: string };
  opportunities: PatientOpportunity[];
}
const PATIENTS = (cohortJson as { demoPatients: Patient[] }).demoPatients;

// ── Helpers ──────────────────────────────────────────────────────────────────
function pctTone(pct: number, target: number): 'green' | 'amber' | 'red' {
  if (pct >= target) return 'green';
  if (pct >= target - 10) return 'amber';
  return 'red';
}
function vbcTone(pct: number): 'green' | 'amber' | 'red' {
  if (pct >= 80) return 'green';
  if (pct >= 65) return 'amber';
  return 'red';
}
function currency(n: number): string { return '$' + n.toLocaleString('en-US'); }

function majorOpportunities(p: Patient): PatientHardStop[] {
  const high = p.hardStops.filter((h) => h.severity === 'high');
  if (high.length >= 2) return high.slice(0, 2);
  const med = p.hardStops.filter((h) => h.severity === 'medium');
  return [...high, ...med].slice(0, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
//   COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardApp(): JSX.Element {
  const [layout, setLayout] = useState<Layout>('landscape');
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [activePatient, setActivePatient] = useState<string | null>(null);

  const selectedPatient = activePatient ? PATIENTS.find((p) => p.mrn === activePatient) ?? null : null;

  return (
    <div class="dashboard-app">
      <div class="orientation-bar">
        <div class="orientation-bar__left">
          <span class="orientation-bar__badge">Meridian</span>
          <span>Crystal Run Healthcare · Primary &amp; Urgent Care · Provider Dashboard</span>
        </div>
        <div class="orientation-bar__right">
          <span class="orientation-bar__layout-label">Layout:</span>
          <div class="toggle-group">
            <button
              type="button"
              class={`toggle-btn${layout === 'landscape' ? ' active' : ''}`}
              onClick={() => setLayout('landscape')}
            >
              Landscape
            </button>
            <button
              type="button"
              class={`toggle-btn${layout === 'portrait' ? ' active' : ''}`}
              onClick={() => setLayout('portrait')}
            >
              Portrait
            </button>
          </div>
        </div>
      </div>

      <div class={`page-wrapper${layout === 'portrait' ? ' portrait-mode' : ''}`}>
        {selectedPatient ? (
          <PatientDetail patient={selectedPatient} onBack={() => setActivePatient(null)} layout={layout} />
        ) : activeSection ? (
          <SectionDetail
            section={activeSection}
            layout={layout}
            onBack={() => setActiveSection(null)}
            onPatientSelect={(mrn) => setActivePatient(mrn)}
          />
        ) : (
          <GridView layout={layout} onTileClick={(id) => setActiveSection(id)} />
        )}

        <div class="page-footer">
          <div class="footer-links">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setLauncherApp('launcher');
              }}
            >
              Meridian Home
            </a>
            <a href="#">HEDIS Dashboard</a>
            <a href="#">Epic Learning Portal</a>
            <a href="#">Quality Dashboard</a>
            <a href="#">Submit Feedback</a>
          </div>
          <div class="footer-meta">
            <span>Medical Director, Primary &amp; Urgent Care · Crystal Run Healthcare · Optum NY/NJ</span>
            <button type="button" class="print-btn" onClick={() => window.print()}>
              🖨 Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//   GRID VIEW (6-tile home)
// ─────────────────────────────────────────────────────────────────────────────

function GridView({ layout, onTileClick }: { layout: Layout; onTileClick: (id: SectionId) => void }): JSX.Element {
  return (
    <>
      <div class="masthead">
        <div class="masthead-left">
          <div class="masthead-title">Provider Dashboard</div>
          <div class="masthead-subtitle">Primary &amp; Urgent Care · Optum NY/NJ</div>
        </div>
        <div class="masthead-meta">
          <strong>Dr. A. Provider · Monroe</strong>
          <br />
          Week of June 16, 2025 · Updated Daily
        </div>
      </div>

      <div class={`dashboard-grid ${layout}`}>
        {TILES.map((t) => (
          <button
            key={t.id}
            type="button"
            class={`dashboard-tile brief-card brief-card-${t.tint}`}
            onClick={() => onTileClick(t.id)}
            aria-label={`Open ${t.title}`}
          >
            <div class="dashboard-tile-icon">{t.icon}</div>
            <div class="dashboard-tile-number">{t.bigNumber}</div>
            <div class="dashboard-tile-title">{t.title}</div>
            <div class="dashboard-tile-body">{t.body}</div>
            <span class="dashboard-tile-tag">{t.tag}</span>
          </button>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//   SECTION DETAIL (full-bleed panel for one of the 6 sections)
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_LABEL: Record<SectionId, { title: string; subtitle: string }> = {
  hedis: { title: 'HEDIS / Quality Metrics', subtitle: 'Composite 74.8% · 5 measures at goal' },
  awv: { title: 'Medicare Annual Wellness Visit', subtitle: '94 completed · 62 unscheduled' },
  rvu: { title: 'Work RVU & Revenue', subtitle: '1,833 YTD · +73 above par' },
  goals: { title: 'Epic Performance Goals', subtitle: '1 met · 1 in progress · 1 active' },
  vbc: { title: 'Value-Based Care & HCC', subtitle: '22 HCC pending · 9 TCM unscheduled' },
  patients: { title: 'Patients Tomorrow', subtitle: '5 scheduled · click a row for full chart context' },
};

interface SectionDetailProps {
  section: SectionId;
  layout: Layout;
  onBack: () => void;
  onPatientSelect: (mrn: string) => void;
}

function SectionDetail({ section, onBack, onPatientSelect }: SectionDetailProps): JSX.Element {
  const meta = SECTION_LABEL[section];
  return (
    <div class="section-panel">
      <div class="panel-header">
        <button type="button" class="panel-back-btn" onClick={onBack} aria-label="Back to dashboard">
          ‹ Dashboard
        </button>
        <div class="panel-header-title">{meta.title}</div>
        <div class="panel-header-sub">{meta.subtitle}</div>
      </div>
      <div class="section-panel-body">
        {section === 'hedis' && <HedisSection />}
        {section === 'awv' && <AwvSection />}
        {section === 'rvu' && <RvuSection />}
        {section === 'goals' && <GoalsSection />}
        {section === 'vbc' && <VbcSection />}
        {section === 'patients' && <PatientListSection onPatientSelect={onPatientSelect} />}
      </div>
    </div>
  );
}

// ── HEDIS ────────────────────────────────────────────────────────────────────
function HedisSection(): JSX.Element {
  const [activeMeasure, setActiveMeasure] = useState<string | null>(null);

  if (activeMeasure) {
    const measure = HEDIS_MEASURES.find((m) => m.id === activeMeasure);
    const detail = HEDIS_MEASURE_DETAILS[activeMeasure];
    if (measure && detail) {
      return <HedisMeasureDetail measure={measure} detail={detail} onBack={() => setActiveMeasure(null)} />;
    }
  }

  return (
    <>
      <div class="info-banner">
        Panel composite: <strong>74.8%</strong> across all measures. Target: 78%. Click any measure to view its glidepath, sub-cohort breakdown, and outreach candidates.
      </div>
      <div class="hedis-grid">
        {HEDIS_MEASURES.map((m) => {
          const tone = pctTone(m.pct, m.target);
          return (
            <button
              key={m.id}
              type="button"
              class={`hedis-block tone-${tone}`}
              onClick={() => setActiveMeasure(m.id)}
              aria-label={`Open ${m.label} drill-in`}
            >
              <div class="hedis-measure">{m.label}</div>
              <div class="hedis-pct">{m.pct}%</div>
              <div class="hedis-bar-track">
                <div class="hedis-bar-fill" style={{ width: `${m.pct}%` }} />
              </div>
              <div class="hedis-target">Target: {m.target}%</div>
            </button>
          );
        })}
      </div>

      <div class="section-divider">Cross-measure non-compliance</div>
      <div class="cross-measure-grid">
        {CROSS_MEASURE_GROUPS.map((g) => (
          <div key={g.id} class={`cross-measure-card tone-${g.tone}`}>
            <div class="cross-measure-number">{g.n}</div>
            <div class="cross-measure-title">{g.title}</div>
            <div class="cross-measure-desc">{g.description}</div>
            <div class="cross-measure-chips">
              {g.measureLabels.map((l) => (
                <span key={l} class="cross-measure-chip">{l}</span>
              ))}
            </div>
            <button type="button" class="cross-measure-action">Generate patient list →</button>
          </div>
        ))}
      </div>
      <div class="list-export-note">
        Patient lists are previewable from any individual measure or any combination above — output includes MRN, full name, DOB, payer, and the specific gap(s) per row. CSV export wiring follows in v1.1.
      </div>
    </>
  );
}

// ── HEDIS metric drill-in (description + glidepath + sub-cohorts) ────────────

function HedisMeasureDetail({
  measure,
  detail,
  onBack,
}: {
  measure: HedisMeasure;
  detail: HedisMeasureDetail;
  onBack: () => void;
}): JSX.Element {
  const tone = pctTone(measure.pct, measure.target);
  return (
    <>
      <button type="button" class="measure-back-btn" onClick={onBack} aria-label="Back to all measures">
        ‹ Quality Metrics
      </button>
      <div class="measure-detail-header">
        <div>
          <div class="measure-detail-title">{measure.label}</div>
          <div class="measure-detail-sub">{measure.panelN.toLocaleString()} patients in measure denominator</div>
        </div>
        <div class="measure-detail-stat">
          <div class={`measure-detail-pct tone-${tone}`}>{measure.pct}%</div>
          <div class="measure-detail-target">Target {measure.target}%</div>
        </div>
      </div>

      <div class="measure-section-label">Measure description</div>
      <p class="measure-description">{detail.description}</p>

      <div class="measure-section-label">Glidepath — actual vs goal, year to date</div>
      <Glidepath baseline={detail.baseline} actual={detail.actual} target={measure.target} />

      <div class="measure-section-label">Outreach sub-cohorts (Epic-derived)</div>
      <table class="subcohort-table">
        <thead>
          <tr>
            <th>Cohort</th>
            <th class="ralign">Patients</th>
            <th>Why they're in this cohort</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {detail.subCohorts.map((c) => (
            <tr key={c.id}>
              <td class="subcohort-label">{c.label}</td>
              <td class="ralign mono"><strong>{c.count}</strong></td>
              <td class="subcohort-desc">{c.description}</td>
              <td><button type="button" class="subcohort-action">Generate list →</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div class="list-export-note">
        Sub-cohort definitions are tunable in Epic Reporting Workbench — these are starting points based on common gap-closure patterns. CSV export wiring follows in v1.1.
      </div>
    </>
  );
}

// ── Glidepath chart (small inline SVG) ──────────────────────────────────────
function Glidepath({ baseline, actual, target }: { baseline: number; actual: number[]; target: number }): JSX.Element {
  const width = 720;
  const height = 220;
  const PAD = { top: 18, right: 70, bottom: 28, left: 36 };
  const W = width - PAD.left - PAD.right;
  const H = height - PAD.top - PAD.bottom;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const yMin = 30;
  const yMax = 100;
  const y = (pct: number) => PAD.top + H - ((pct - yMin) / (yMax - yMin)) * H;
  const x = (i: number) => PAD.left + (i / 11) * W;

  const goalPath = `M ${x(0)} ${y(baseline)} L ${x(11)} ${y(target)}`;
  const actualPath = actual.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const lastIdx = actual.length - 1;
  const lastVal = actual[lastIdx];

  return (
    <svg class="glidepath" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Glidepath chart from ${baseline}% baseline to ${target}% goal, currently at ${lastVal}%`}>
      {[40, 60, 80, 100].map((g) => (
        <g key={g}>
          <line x1={PAD.left} x2={PAD.left + W} y1={y(g)} y2={y(g)} class="grid-h" />
          <text x={PAD.left - 6} y={y(g) + 3} class="axis-label" textAnchor="end">{g}%</text>
        </g>
      ))}
      {MONTHS.map((m, i) => (
        <text key={m} x={x(i)} y={PAD.top + H + 18} class="axis-label" textAnchor="middle">{m}</text>
      ))}
      <path d={goalPath} class="goal-line" />
      <text x={x(11) + 6} y={y(target) + 3} class="goal-label">Goal {target}%</text>
      <path d={actualPath} class="actual-line" />
      {actual.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3.5" class={`actual-dot${i === lastIdx ? ' is-latest' : ''}`} />
      ))}
      <text x={x(lastIdx) + 8} y={y(lastVal) - 8} class="latest-label">{lastVal}%</text>
    </svg>
  );
}

// ── AWV ──────────────────────────────────────────────────────────────────────
function AwvSection(): JSX.Element {
  const [open, setOpen] = useState<string | null>(null);
  const eligible = AWV_DATA.find((d) => d.key === 'eligible')!.n;
  return (
    <>
      <div class="info-banner">
        Annual wellness visits improve chronic disease detection, patient-provider relationships, and drive significant value-based incentive revenue. NP AWV (IPPE) applies to new Medicare patients and carries a different billing code — eligible patients are a small subset of the total.
      </div>
      <div class="awv-row">
        {AWV_DATA.map((d) => (
          <button
            key={d.key}
            type="button"
            class={`stat-block tone-${d.tone}`}
            onClick={() => setOpen(open === d.key ? null : d.key)}
          >
            <div class="stat-number">{d.n}</div>
            <div class="stat-label">{d.label}</div>
            <div class="stat-sub">
              {d.key === 'eligible' ? 'Medicare panel' : `${Math.round((d.n / eligible) * 100)}% of eligible`}
            </div>
          </button>
        ))}
      </div>
      {open === 'unscheduled' && (
        <div class="patient-drawer">
          <div class="patient-drawer-header" onClick={() => setOpen(null)}>
            <span>Unscheduled — Medicare AWV Eligible</span>
            <span class="patient-drawer-sub">showing 5 of 62 · click to close</span>
          </div>
          <table class="patient-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>DOB</th>
                <th>MRN</th>
                <th>Last Visit</th>
                <th>Insurance</th>
              </tr>
            </thead>
            <tbody>
              {UNSCHEDULED_AWV_PATIENTS.map((p) => (
                <tr key={p.mrn}>
                  <td>{p.name}</td>
                  <td>{p.dob}</td>
                  <td>{p.mrn}</td>
                  <td>{p.lastVisit}</td>
                  <td>{p.insurance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── RVU ──────────────────────────────────────────────────────────────────────
function RvuSection(): JSX.Element {
  const [activeQ, setActiveQ] = useState<'Q1' | 'Q2' | 'Q3'>('Q2');
  const qd = QUARTER_DATA[activeQ];
  const above = Math.max(0, qd.wRVU - qd.par);
  return (
    <>
      <div class="rvu-summary">
        <div class="stat-block tone-green">
          <div class="stat-number">1,833</div>
          <div class="stat-label">Work RVUs — YTD</div>
          <div class="stat-sub">Through Q2 2025</div>
        </div>
        <div class="stat-block tone-blue">
          <div class="stat-number">1,760</div>
          <div class="stat-label">Par Threshold — YTD</div>
          <div class="stat-sub">Prorated to Q2</div>
        </div>
        <div class="stat-block tone-amber">
          <div class="stat-number">+73</div>
          <div class="stat-label">Above Par</div>
          <div class="stat-sub">Est. {currency(73 * 42)} bonus</div>
        </div>
      </div>

      <div class="section-divider">Quarterly Detail</div>
      <div class="quarter-tabs">
        {(['Q1', 'Q2', 'Q3'] as const).map((q) => (
          <button
            key={q}
            type="button"
            class={`qtab ${activeQ === q ? 'active' : ''}`}
            onClick={() => setActiveQ(q)}
          >
            {q} {QUARTER_DATA[q].projected ? '(proj.)' : ''}
          </button>
        ))}
      </div>

      <div class="rvu-grid">
        <table class="rev-table">
          <thead><tr><th>Item</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Work RVUs</td><td class="mono">{qd.wRVU.toLocaleString()}</td></tr>
            <tr><td>Par Threshold</td><td class="mono">{qd.par.toLocaleString()}</td></tr>
            <tr><td>Above Par</td><td class="mono green">{above}</td></tr>
            <tr><td>Volume Bonus (est.)</td><td class="mono green">{currency(above * 42)}</td></tr>
            <tr><td>Vatica Sign-offs</td><td class="mono">{qd.vatSign}</td></tr>
            <tr><td>Vatica Revenue (est.)</td><td class="mono green">{currency(qd.vatRev)}</td></tr>
            <tr><td>HCC — Confirmed</td><td class="mono">{qd.hccClosed}</td></tr>
            <tr><td>HCC — Pending</td><td class="mono amber">{qd.hccOpen}</td></tr>
            <tr><td><strong>Est. Total Add-on Revenue</strong></td><td class="mono green"><strong>{currency(above * 42 + qd.vatRev)}</strong></td></tr>
          </tbody>
        </table>

        <table class="rev-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th class="ralign">YTD</th>
              <th class="ralign">Avg</th>
            </tr>
          </thead>
          <tbody>
            {RVU_CODES.map((r) => (
              <tr key={r.code}>
                <td class="mono">{r.code}</td>
                <td class="rvu-desc">{r.desc}</td>
                <td class={`mono ralign ${r.ytd > r.avg ? 'green' : 'amber'}`}>{r.ytd}</td>
                <td class="mono ralign muted">{r.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── Goals ────────────────────────────────────────────────────────────────────
function GoalsSection(): JSX.Element {
  const [open, setOpen] = useState<number | null>(0);
  const badgeLabel: Record<GoalStatus, string> = { met: 'Goal Met', progress: 'In Progress', open: 'Active' };
  return (
    <>
      <div class="info-banner">
        Epic performance goals are set during quarterly one-to-one counseling sessions. Metrics sourced from Signal at time of review. Goals persist across quarters for continuity of coaching.
      </div>
      {GOALS.map((g, i) => (
        <div class="goal-card" key={g.metric}>
          <button
            type="button"
            class="goal-header"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div class={`goal-status-dot tone-${g.status === 'met' ? 'green' : g.status === 'progress' ? 'amber' : 'blue'}`} />
            <span class="goal-metric-name">{g.metric}</span>
            <span class={`goal-badge badge-${g.status}`}>{badgeLabel[g.status]}</span>
            <span class="goal-current">Current: {g.current} · Goal: {g.target}</span>
            <span class="goal-chevron">{open === i ? '▲' : '▼'}</span>
          </button>
          {open === i && (
            <div class="goal-timeline">
              {g.quarters.map((qt) => (
                <div class="timeline-row" key={qt.q}>
                  <span class="tl-quarter">{qt.q}</span>
                  <div class={`tl-dot tone-${qt.outcome}`} />
                  <div class="tl-content">
                    <div class="tl-measurement">{qt.measurement}</div>
                    <div class="tl-intervention">↳ {qt.intervention}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

// ── VBC ──────────────────────────────────────────────────────────────────────
function VbcSection(): JSX.Element {
  return (
    <>
      <div class="info-banner">
        Value-based care metrics drive a significant portion of practice revenue. Patients with multiple out-of-compliance measures are candidates for a high-priority outreach list.
      </div>
      <div class="hedis-grid">
        {VBCARE.map((v) => {
          const tone = vbcTone(v.pct);
          return (
            <div key={v.measure} class={`hedis-block tone-${tone}`}>
              <div class="hedis-measure">{v.measure}</div>
              <div class="hedis-pct">{v.pct}%</div>
              <div class="hedis-bar-track">
                <div class="hedis-bar-fill" style={{ width: `${v.pct}%` }} />
              </div>
              <div class="hedis-target">{v.compliant}/{v.panelN} patients</div>
            </div>
          );
        })}
      </div>

      <div class="section-divider">HCC Opportunities</div>
      <div class="program-row">
        <span class="program-name">Confirmed this quarter</span>
        <span class="program-stat">29 patients</span>
        <span class="tag-green">Closed</span>
      </div>
      <div class="program-row">
        <span class="program-name">Awaiting provider attestation</span>
        <span class="program-stat">22 patients</span>
        <span class="tag-amber">Pending</span>
      </div>
      <div class="program-row">
        <span class="program-name">Vatica reviews pending sign-off</span>
        <span class="program-stat">11 charts</span>
        <span class="tag-amber">Action needed</span>
      </div>

      <div class="section-divider">Transitional Care / Wraparound</div>
      <div class="program-row">
        <span class="program-name">Complex patients — quarterly visit scheduled</span>
        <span class="program-stat">14 patients</span>
        <span class="tag-green">On track</span>
      </div>
      <div class="program-row">
        <span class="program-name">Complex patients — not yet scheduled</span>
        <span class="program-stat">9 patients</span>
        <span class="tag-red">Unscheduled</span>
      </div>
    </>
  );
}

// ── Patient list ─────────────────────────────────────────────────────────────
function PatientListSection({ onPatientSelect }: { onPatientSelect: (mrn: string) => void }): JSX.Element {
  return (
    <>
      <div class="info-banner">
        Tomorrow's schedule — Wednesday, June 17. Patients with high-severity care gaps are flagged so you can pre-review charts. Click a row for the full per-patient brief.
      </div>
      <table class="patient-list-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Age · Sex</th>
            <th>MRN</th>
            <th>Payer</th>
            <th>Major Opportunities</th>
          </tr>
        </thead>
        <tbody>
          {PATIENTS.map((p) => {
            const ops = majorOpportunities(p);
            return (
              <tr key={p.mrn} onClick={() => onPatientSelect(p.mrn)}>
                <td class="patient-list-name">{p.name}</td>
                <td>{p.age} · {p.sex}</td>
                <td class="mono">{p.mrn}</td>
                <td><span class="patient-payer-pill">{p.payer.name} · {p.payer.product}</span></td>
                <td>
                  {ops.length === 0 && <span class="muted">—</span>}
                  {ops.map((h) => (
                    <span key={h.id} class={`patient-op-chip chip-${h.severity}`}>{h.text}</span>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//   PATIENT DETAIL
// ─────────────────────────────────────────────────────────────────────────────

function PatientDetail({ patient, onBack, layout }: { patient: Patient; onBack: () => void; layout: Layout }): JSX.Element {
  return (
    <>
      <div class="masthead patient-masthead">
        <div class="masthead-left">
          <button type="button" class="patient-back-btn" onClick={onBack} aria-label="Back to schedule">
            ‹ Tomorrow's Schedule
          </button>
          <div>
            <div class="masthead-title">{patient.name}</div>
            <div class="masthead-subtitle">
              {patient.age}-year-old {patient.sex === 'F' ? 'female' : 'male'} · MRN {patient.mrn}
            </div>
          </div>
        </div>
        <div class="masthead-meta">
          <strong>{patient.payer.name} · {patient.payer.product}</strong>
          <br />
          {patient.payer.risk}
        </div>
      </div>

      {patient.hardStops.length > 0 && (
        <div class="hard-stops-banner">
          <div class="hard-stops-banner-title">
            <span class="hard-stops-banner-icon" aria-hidden="true">⚠</span>
            Hard Stops
          </div>
          <ul class="hard-stops-list">
            {patient.hardStops.map((h) => (
              <li key={h.id} class={`hard-stop hard-stop-${h.severity}`}>
                <span class={`hard-stop-badge badge-${h.severity}`}>{h.severity === 'high' ? 'High' : 'Med'}</span>
                <span class="hard-stop-text">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div class={`patient-grid ${layout}`}>
        <div class="patient-col">
          <PatientPanel title="Problem List">
            <table class="patient-table">
              <thead>
                <tr><th>Problem</th><th>ICD-10</th></tr>
              </thead>
              <tbody>
                {patient.problems.map((p) => (
                  <tr key={p.id}><td>{p.text}</td><td class="mono">{p.icd10}</td></tr>
                ))}
              </tbody>
            </table>
          </PatientPanel>

          <PatientPanel title="Medications">
            <ul class="med-list">
              {patient.medications.map((m) => (
                <li key={m.id}>{m.text}</li>
              ))}
            </ul>
          </PatientPanel>
        </div>

        <div class="patient-col">
          <PatientPanel title="Vital Signs">
            <table class="patient-table">
              <thead>
                <tr><th>Measure</th><th>Value</th><th>Date</th></tr>
              </thead>
              <tbody>
                {patient.vitals.map((v) => (
                  <tr key={v.id}>
                    <td>{v.label}</td>
                    <td class="mono">{v.value}</td>
                    <td class="mono muted">{v.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PatientPanel>

          <PatientPanel title="Recent Labs">
            <table class="patient-table">
              <thead>
                <tr><th>Lab</th><th>Value</th><th>Date</th></tr>
              </thead>
              <tbody>
                {patient.labs.map((l) => (
                  <tr key={l.id}>
                    <td>
                      {l.label}
                      {l.flag && <span class={`lab-flag flag-${l.flag}`}>{l.flag === 'high' ? 'H' : 'L'}</span>}
                    </td>
                    <td class="mono">
                      {l.value}{l.unit ? ` ${l.unit}` : ''}
                    </td>
                    <td class="mono muted">{l.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PatientPanel>
        </div>
      </div>

      {patient.opportunities.length > 0 && (
        <div class="opportunities-section">
          <div class="opportunities-header">Opportunities at this visit</div>
          {patient.opportunities.map((op) => (
            <div key={op.id} class="opportunity-card">
              <div class="opportunity-card-header">
                <span class={`opportunity-category cat-${op.category}`}>{op.category}</span>
                <span class="opportunity-summary">{op.summary}</span>
                <span class="opportunity-codes mono">{op.codes}</span>
              </div>
              <div class="opportunity-details">
                {op.details.map((d, idx) => (
                  <div key={idx} class="opportunity-detail-row">
                    <div class="opportunity-detail-label">{d.label}</div>
                    <div
                      class="opportunity-detail-text"
                      // Smart phrases / CPT codes inside text are pre-wrapped in
                      // <span class="opportunity-smartphrase">/<span class="opportunity-code">
                      // by the source data — render as HTML to preserve styling.
                      dangerouslySetInnerHTML={{ __html: d.text }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function PatientPanel({ title, children }: { title: string; children: ComponentChildren }): JSX.Element {
  return (
    <div class="patient-section-panel">
      <div class="patient-section-header">{title}</div>
      <div class="patient-section-body">{children}</div>
    </div>
  );
}

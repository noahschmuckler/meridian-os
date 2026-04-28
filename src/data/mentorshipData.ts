// Top-level data signal for the mentorship workspace.
//
// Holds the structured org state — directors, mentors, providers, checkoffs,
// notes, flags — that the various mentorship-* bubbles read from and write to.
// Persisted to localStorage so onboarding progress survives refreshes.
//
// Phases are static (not user-mutable) so they live as a const export, not
// in the signal.
//
// Hierarchy:
//   Executive (1) → sees aggregate of all directors
//   Director (2)  → each has own mentors + providers
//   Mentor (4)    → 2 per director, each with 2 mentees
//   Provider (8)  → being onboarded, assigned to one mentor + one director
//
// Mirrors the userModules.ts persistence pattern.

import { signal, type Signal } from '@preact/signals';

// ---- Phase definitions (static, ported verbatim from Freiberg's artifact)

export type PhaseType = 'weekly' | 'monthly' | 'quarterly';

export interface PhaseItem {
  id: string;
  text: string;
}

export interface Phase {
  id: string;
  label: string;
  short: string;
  type: PhaseType;
  /** True when the medical director is expected to attend this check-in. */
  md?: boolean;
  items: PhaseItem[];
}

export const PHASES: Phase[] = [
  { id: 'w1', label: 'Week 1', short: 'W1', type: 'weekly', items: [
    { id: 'w1-1', text: 'Checked in on first-day/first-week experience' },
    { id: 'w1-2', text: 'Confirmed Epic login and EHR access working' },
    { id: 'w1-3', text: 'Reviewed clinic layout, team introductions' },
    { id: 'w1-4', text: 'Discussed initial schedule and ramp-up expectations' },
    { id: 'w1-5', text: 'Answered workflow or logistics questions' },
  ]},
  { id: 'w2', label: 'Week 2', short: 'W2', type: 'weekly', items: [
    { id: 'w2-1', text: 'Checked in on EHR comfort level' },
    { id: 'w2-2', text: 'Reviewed SmartPhrase or order set progress' },
    { id: 'w2-3', text: 'Observed at least one patient encounter' },
    { id: 'w2-4', text: 'Discussed In Basket management setup' },
    { id: 'w2-5', text: 'Answered workflow or clinical questions' },
  ]},
  { id: 'w3', label: 'Week 3', short: 'W3', type: 'weekly', items: [
    { id: 'w3-1', text: 'Reviewed order set and preference list progress' },
    { id: 'w3-2', text: 'Discussed care gap identification workflow' },
    { id: 'w3-3', text: 'Reviewed Problem List management habits' },
    { id: 'w3-4', text: 'Observed encounter documentation quality' },
    { id: 'w3-5', text: 'Addressed any emerging concerns' },
  ]},
  { id: 'w4', label: 'Week 4', short: 'W4', type: 'weekly', md: true, items: [
    { id: 'w4-1', text: 'End-of-month progress assessment' },
    { id: 'w4-2', text: 'Reviewed patient volume and readiness to ramp' },
    { id: 'w4-3', text: 'Assessed EHR efficiency' },
    { id: 'w4-4', text: 'Discussed schedule adjustment needs' },
    { id: 'w4-5', text: 'Prepared for Medical Director review' },
  ]},
  { id: 'w5', label: 'Week 5', short: 'W5', type: 'weekly', items: [
    { id: 'w5-1', text: 'Checked in on volume ramp-up comfort' },
    { id: 'w5-2', text: 'Reviewed referral and order routing accuracy' },
    { id: 'w5-3', text: 'Discussed BPA navigation' },
    { id: 'w5-4', text: 'Observed encounter closing and billing' },
    { id: 'w5-5', text: 'Answered clinical or workflow questions' },
  ]},
  { id: 'w6', label: 'Week 6', short: 'W6', type: 'weekly', items: [
    { id: 'w6-1', text: 'Reviewed MyChart response quality' },
    { id: 'w6-2', text: 'Discussed medication reconciliation' },
    { id: 'w6-3', text: 'Assessed care gap closure consistency' },
    { id: 'w6-4', text: 'Reviewed workspace personalization' },
    { id: 'w6-5', text: 'Addressed emerging concerns' },
  ]},
  { id: 'w7', label: 'Week 7', short: 'W7', type: 'weekly', items: [
    { id: 'w7-1', text: 'Assessed independence readiness' },
    { id: 'w7-2', text: 'Reviewed quality metrics together' },
    { id: 'w7-3', text: 'Discussed billable encounter types' },
    { id: 'w7-4', text: 'Observed complex patient management' },
    { id: 'w7-5', text: 'Answered remaining workflow questions' },
  ]},
  { id: 'w8', label: 'Week 8', short: 'W8', type: 'weekly', md: true, items: [
    { id: 'w8-1', text: 'End-of-weekly-phase assessment' },
    { id: 'w8-2', text: 'Reviewed overall EHR proficiency' },
    { id: 'w8-3', text: 'Assessed readiness for monthly cadence' },
    { id: 'w8-4', text: 'Discussed ongoing learning goals' },
    { id: 'w8-5', text: 'Prepared for Medical Director review' },
  ]},
  { id: 'm3', label: 'Month 3', short: 'M3', type: 'monthly', md: true, items: [
    { id: 'm3-1', text: 'Patient volume vs. target review' },
    { id: 'm3-2', text: 'Care gap and Problem List habits assessed' },
    { id: 'm3-3', text: 'Referral routing and order accuracy' },
    { id: 'm3-4', text: 'Billing/coding proficiency' },
    { id: 'm3-5', text: 'Semi-independent practice readiness' },
  ]},
  { id: 'm4', label: 'Month 4', short: 'M4', type: 'monthly', items: [
    { id: 'm4-1', text: 'Ongoing optimization check-in' },
    { id: 'm4-2', text: 'EHR efficiency metrics review' },
    { id: 'm4-3', text: 'Complex case management discussion' },
    { id: 'm4-4', text: 'Workload sustainability assessment' },
    { id: 'm4-5', text: 'Emerging workflow issues addressed' },
  ]},
  { id: 'm5', label: 'Month 5', short: 'M5', type: 'monthly', items: [
    { id: 'm5-1', text: 'Full capacity approach assessment' },
    { id: 'm5-2', text: 'Burnout and wellbeing screening' },
    { id: 'm5-3', text: 'Quality and care gap closure rates' },
    { id: 'm5-4', text: 'Professional development goals' },
    { id: 'm5-5', text: 'Month 6 formal review readiness' },
  ]},
  { id: 'm6', label: 'Month 6', short: 'M6', type: 'monthly', md: true, items: [
    { id: 'm6-1', text: 'Formal 6-month milestone assessment' },
    { id: 'm6-2', text: 'Full capacity confirmation' },
    { id: 'm6-3', text: 'Quality dashboard comprehensive review' },
    { id: 'm6-4', text: 'Quarterly transition plan' },
    { id: 'm6-5', text: 'Summary prepared for Medical Director' },
  ]},
  { id: 'q3', label: 'Month 9', short: 'Q3', type: 'quarterly', md: true, items: [
    { id: 'q3-1', text: 'Continued development and CE planning' },
    { id: 'q3-2', text: 'Professional goals check-in' },
    { id: 'q3-3', text: 'Quality and patient satisfaction review' },
    { id: 'q3-4', text: 'Emerging issues or support needs' },
  ]},
  { id: 'q4', label: 'Month 12', short: 'Q4', type: 'quarterly', md: true, items: [
    { id: 'q4-1', text: 'Annual comprehensive integration review' },
    { id: 'q4-2', text: 'Full performance metrics assessment' },
    { id: 'q4-3', text: 'Mentorship transition (formal → peer)' },
    { id: 'q4-4', text: 'Year 2 development plan' },
  ]},
];

// ---- Org records

export type UserRole = 'executive' | 'director' | 'mentor';

export interface UserRecord {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  /** Mentors are scoped to a director. Directors and execs leave this null. */
  directorId?: string;
}

export interface ProviderRecord {
  id: string;
  name: string;
  /** Credentialed role: MD/DO/NP/PA. Distinct from `UserRole`. */
  role: 'MD' | 'DO' | 'NP' | 'PA';
  startDate: string; // ISO yyyy-mm-dd
  mentorId: string;
  directorId: string;
  currentPhase: string;
}

export interface CheckoffEntry {
  by: string;
  at: string;
}

export interface NoteEntry {
  by: string;
  at: string;
  text: string;
}

export interface FlagEntry {
  providerId: string;
  by: string;
  byId: string;
  at: string;
  text: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface MentorshipData {
  users: UserRecord[];
  providers: ProviderRecord[];
  /** Key shape: `${providerId}:${phaseId}:${itemId}`. */
  checkoffs: Record<string, CheckoffEntry>;
  /** Key shape: `${providerId}:${phaseId}`. */
  notes: Record<string, NoteEntry[]>;
  flags: FlagEntry[];
}

// ---- Initial seed (extends Freiberg's defaultData with a second director)

const SEED_USERS: UserRecord[] = [
  { id: 'ex1', name: 'Dr. Anderson', role: 'executive', title: 'Regional VP, Clinical Operations' },
  { id: 'md1', name: 'Dr. Rivera', role: 'director', title: 'Medical Director · Westside' },
  { id: 'md2', name: 'Dr. Patel', role: 'director', title: 'Medical Director · Eastside' },
  { id: 'mt1', name: 'Dr. Smith', role: 'mentor', title: 'Mentor Physician · Westside', directorId: 'md1' },
  { id: 'mt2', name: 'Dr. Lee', role: 'mentor', title: 'Mentor Physician · Westside', directorId: 'md1' },
  { id: 'mt3', name: 'Dr. Chen', role: 'mentor', title: 'Mentor Physician · Eastside', directorId: 'md2' },
  { id: 'mt4', name: 'Dr. Okafor', role: 'mentor', title: 'Mentor Physician · Eastside', directorId: 'md2' },
];

const SEED_PROVIDERS: ProviderRecord[] = [
  // Westside (Dr. Rivera, md1)
  { id: 'p1', name: 'Dr. Johnson',  role: 'MD', startDate: '2026-01-12', mentorId: 'mt1', directorId: 'md1', currentPhase: 'm4' },
  { id: 'p2', name: 'Dr. Patel',    role: 'DO', startDate: '2026-02-03', mentorId: 'mt1', directorId: 'md1', currentPhase: 'm3' },
  { id: 'p3', name: 'Dr. Williams', role: 'MD', startDate: '2026-03-10', mentorId: 'mt2', directorId: 'md1', currentPhase: 'w7' },
  { id: 'p4', name: 'Dr. Garcia',   role: 'DO', startDate: '2026-03-24', mentorId: 'mt2', directorId: 'md1', currentPhase: 'w5' },
  // Eastside (Dr. Patel-MD, md2)
  { id: 'p5', name: 'Dr. Kim',      role: 'MD', startDate: '2026-04-07', mentorId: 'mt3', directorId: 'md2', currentPhase: 'w3' },
  { id: 'p6', name: 'Dr. Thompson', role: 'MD', startDate: '2026-04-21', mentorId: 'mt3', directorId: 'md2', currentPhase: 'w1' },
  { id: 'p7', name: 'Dr. Nguyen',   role: 'NP', startDate: '2026-02-17', mentorId: 'mt4', directorId: 'md2', currentPhase: 'm3' },
  { id: 'p8', name: 'Dr. Brooks',   role: 'MD', startDate: '2026-03-31', mentorId: 'mt4', directorId: 'md2', currentPhase: 'w5' },
];

function buildSeedCheckoffs(): Record<string, CheckoffEntry> {
  const c: Record<string, CheckoffEntry> = {};
  // Far-along providers: complete first 8 phases
  ['p1', 'p2', 'p7'].forEach((pid) => {
    PHASES.slice(0, 8).forEach((ph) => {
      ph.items.forEach((it) => {
        c[`${pid}:${ph.id}:${it.id}`] = { by: 'auto', at: 'seed' };
      });
    });
  });
  // p1 also has m3 fully and m4 partial
  PHASES[8].items.forEach((it) => { c[`p1:m3:${it.id}`] = { by: 'auto', at: 'seed' }; });
  PHASES[9].items.slice(0, 3).forEach((it) => { c[`p1:m4:${it.id}`] = { by: 'auto', at: 'seed' }; });
  // p2 has m3 partial
  PHASES[8].items.slice(0, 3).forEach((it) => { c[`p2:m3:${it.id}`] = { by: 'auto', at: 'seed' }; });
  // p7 has m3 partial too
  PHASES[8].items.slice(0, 2).forEach((it) => { c[`p7:m3:${it.id}`] = { by: 'auto', at: 'seed' }; });
  // Mid-pack: p3 done through w5, partial w6
  ['p3'].forEach((pid) => {
    PHASES.slice(0, 5).forEach((ph) => {
      ph.items.forEach((it) => { c[`${pid}:${ph.id}:${it.id}`] = { by: 'auto', at: 'seed' }; });
    });
    PHASES[5].items.slice(0, 3).forEach((it) => {
      c[`${pid}:w6:${it.id}`] = { by: 'auto', at: 'seed' };
    });
  });
  // p4, p8: through w3, partial w4
  ['p4', 'p8'].forEach((pid) => {
    PHASES.slice(0, 3).forEach((ph) => {
      ph.items.forEach((it) => { c[`${pid}:${ph.id}:${it.id}`] = { by: 'auto', at: 'seed' }; });
    });
    PHASES[3].items.slice(0, 2).forEach((it) => {
      c[`${pid}:w4:${it.id}`] = { by: 'auto', at: 'seed' };
    });
  });
  // p5: through w2
  ['p5'].forEach((pid) => {
    PHASES.slice(0, 2).forEach((ph) => {
      ph.items.forEach((it) => { c[`${pid}:${ph.id}:${it.id}`] = { by: 'auto', at: 'seed' }; });
    });
  });
  // p6: just started, no checkoffs
  return c;
}

const SEED_FLAGS: FlagEntry[] = [
  {
    providerId: 'p4',
    by: 'Dr. Lee',
    byId: 'mt2',
    at: '4/25/2026, 4:32 PM',
    text: 'Struggling with encounter closure workflow — needs additional support',
    resolved: false,
  },
];

const INITIAL: MentorshipData = {
  users: SEED_USERS,
  providers: SEED_PROVIDERS,
  checkoffs: buildSeedCheckoffs(),
  notes: {},
  flags: SEED_FLAGS,
};

// ---- Persistence

const STORAGE_KEY = 'meridian-os.mentorshipData';

function hydrate(): MentorshipData {
  if (typeof localStorage === 'undefined') return INITIAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as Partial<MentorshipData>;
    return {
      users: parsed.users ?? INITIAL.users,
      providers: parsed.providers ?? INITIAL.providers,
      checkoffs: parsed.checkoffs ?? INITIAL.checkoffs,
      notes: parsed.notes ?? INITIAL.notes,
      flags: parsed.flags ?? INITIAL.flags,
    };
  } catch {
    return INITIAL;
  }
}

export const mentorshipDataSignal: Signal<MentorshipData> = signal<MentorshipData>(hydrate());

let firstFire = true;
mentorshipDataSignal.subscribe((value) => {
  if (firstFire) { firstFire = false; return; }
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore — quota etc.
  }
});

// ---- Convenience selectors (read-only)

export function getDirectors(data: MentorshipData): UserRecord[] {
  return data.users.filter((u) => u.role === 'director');
}

export function getMentorsForDirector(data: MentorshipData, directorId: string): UserRecord[] {
  return data.users.filter((u) => u.role === 'mentor' && u.directorId === directorId);
}

export function getProvidersForDirector(data: MentorshipData, directorId: string): ProviderRecord[] {
  return data.providers.filter((p) => p.directorId === directorId);
}

export function getProvidersForMentor(data: MentorshipData, mentorId: string): ProviderRecord[] {
  return data.providers.filter((p) => p.mentorId === mentorId);
}

export function getPhaseProgress(
  data: MentorshipData,
  providerId: string,
  phaseId: string,
): { done: number; total: number; pct: number } {
  const phase = PHASES.find((p) => p.id === phaseId);
  if (!phase) return { done: 0, total: 0, pct: 0 };
  const done = phase.items.filter((it) => data.checkoffs[`${providerId}:${phaseId}:${it.id}`]).length;
  return { done, total: phase.items.length, pct: Math.round((done / phase.items.length) * 100) };
}

export function getOverallProgress(data: MentorshipData, providerId: string): number {
  const prov = data.providers.find((p) => p.id === providerId);
  if (!prov) return 0;
  const phIdx = PHASES.findIndex((p) => p.id === prov.currentPhase);
  let total = 0;
  let done = 0;
  PHASES.forEach((ph, i) => {
    if (i <= phIdx) {
      ph.items.forEach((it) => {
        total++;
        if (data.checkoffs[`${providerId}:${ph.id}:${it.id}`]) done++;
      });
    }
  });
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

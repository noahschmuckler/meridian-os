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
//
// Two parallel tracks:
//   • mentor — physician-mentor's weekly/monthly/quarterly check-ins (PHASES)
//   • ops    — director × office-manager operational check-ins (OM_PHASES)
//
// Mentor track has a `currentPhase` cursor on each provider; ops track does not
// (every ops phase is "open" from day one and counted in the overall %).

export type PhaseType = 'weekly' | 'monthly' | 'quarterly' | 'ops';
export type PhaseTrack = 'mentor' | 'ops';

export interface PhaseItem {
  id: string;
  text: string;
}

export interface Phase {
  id: string;
  label: string;
  short: string;
  type: PhaseType;
  track: PhaseTrack;
  /** True when the medical director is expected to attend this check-in. */
  md?: boolean;
  items: PhaseItem[];
}

export const PHASES: Phase[] = [
  { id: 'w1', label: 'Week 1', short: 'W1', type: 'weekly', track: 'mentor', items: [
    { id: 'w1-1', text: 'Checked in on first-day/first-week experience' },
    { id: 'w1-2', text: 'Confirmed Epic login and EHR access working' },
    { id: 'w1-3', text: 'Reviewed clinic layout, team introductions' },
    { id: 'w1-4', text: 'Discussed initial schedule and ramp-up expectations' },
    { id: 'w1-5', text: 'Answered workflow or logistics questions' },
  ]},
  { id: 'w2', label: 'Week 2', short: 'W2', type: 'weekly', track: 'mentor', items: [
    { id: 'w2-1', text: 'Checked in on EHR comfort level' },
    { id: 'w2-2', text: 'Reviewed SmartPhrase or order set progress' },
    { id: 'w2-3', text: 'Observed at least one patient encounter' },
    { id: 'w2-4', text: 'Discussed In Basket management setup' },
    { id: 'w2-5', text: 'Answered workflow or clinical questions' },
  ]},
  { id: 'w3', label: 'Week 3', short: 'W3', type: 'weekly', track: 'mentor', items: [
    { id: 'w3-1', text: 'Reviewed order set and preference list progress' },
    { id: 'w3-2', text: 'Discussed care gap identification workflow' },
    { id: 'w3-3', text: 'Reviewed Problem List management habits' },
    { id: 'w3-4', text: 'Observed encounter documentation quality' },
    { id: 'w3-5', text: 'Addressed any emerging concerns' },
  ]},
  { id: 'w4', label: 'Week 4', short: 'W4', type: 'weekly', track: 'mentor', md: true, items: [
    { id: 'w4-1', text: 'End-of-month progress assessment' },
    { id: 'w4-2', text: 'Reviewed patient volume and readiness to ramp' },
    { id: 'w4-3', text: 'Assessed EHR efficiency' },
    { id: 'w4-4', text: 'Discussed schedule adjustment needs' },
    { id: 'w4-5', text: 'Prepared for Medical Director review' },
  ]},
  { id: 'w5', label: 'Week 5', short: 'W5', type: 'weekly', track: 'mentor', items: [
    { id: 'w5-1', text: 'Checked in on volume ramp-up comfort' },
    { id: 'w5-2', text: 'Reviewed referral and order routing accuracy' },
    { id: 'w5-3', text: 'Discussed BPA navigation' },
    { id: 'w5-4', text: 'Observed encounter closing and billing' },
    { id: 'w5-5', text: 'Answered clinical or workflow questions' },
  ]},
  { id: 'w6', label: 'Week 6', short: 'W6', type: 'weekly', track: 'mentor', items: [
    { id: 'w6-1', text: 'Reviewed MyChart response quality' },
    { id: 'w6-2', text: 'Discussed medication reconciliation' },
    { id: 'w6-3', text: 'Assessed care gap closure consistency' },
    { id: 'w6-4', text: 'Reviewed workspace personalization' },
    { id: 'w6-5', text: 'Addressed emerging concerns' },
  ]},
  { id: 'w7', label: 'Week 7', short: 'W7', type: 'weekly', track: 'mentor', items: [
    { id: 'w7-1', text: 'Assessed independence readiness' },
    { id: 'w7-2', text: 'Reviewed quality metrics together' },
    { id: 'w7-3', text: 'Discussed billable encounter types' },
    { id: 'w7-4', text: 'Observed complex patient management' },
    { id: 'w7-5', text: 'Answered remaining workflow questions' },
  ]},
  { id: 'w8', label: 'Week 8', short: 'W8', type: 'weekly', track: 'mentor', md: true, items: [
    { id: 'w8-1', text: 'End-of-weekly-phase assessment' },
    { id: 'w8-2', text: 'Reviewed overall EHR proficiency' },
    { id: 'w8-3', text: 'Assessed readiness for monthly cadence' },
    { id: 'w8-4', text: 'Discussed ongoing learning goals' },
    { id: 'w8-5', text: 'Prepared for Medical Director review' },
  ]},
  { id: 'm3', label: 'Month 3', short: 'M3', type: 'monthly', track: 'mentor', md: true, items: [
    { id: 'm3-1', text: 'Patient volume vs. target review' },
    { id: 'm3-2', text: 'Care gap and Problem List habits assessed' },
    { id: 'm3-3', text: 'Referral routing and order accuracy' },
    { id: 'm3-4', text: 'Billing/coding proficiency' },
    { id: 'm3-5', text: 'Semi-independent practice readiness' },
  ]},
  { id: 'm4', label: 'Month 4', short: 'M4', type: 'monthly', track: 'mentor', items: [
    { id: 'm4-1', text: 'Ongoing optimization check-in' },
    { id: 'm4-2', text: 'EHR efficiency metrics review' },
    { id: 'm4-3', text: 'Complex case management discussion' },
    { id: 'm4-4', text: 'Workload sustainability assessment' },
    { id: 'm4-5', text: 'Emerging workflow issues addressed' },
  ]},
  { id: 'm5', label: 'Month 5', short: 'M5', type: 'monthly', track: 'mentor', items: [
    { id: 'm5-1', text: 'Full capacity approach assessment' },
    { id: 'm5-2', text: 'Burnout and wellbeing screening' },
    { id: 'm5-3', text: 'Quality and care gap closure rates' },
    { id: 'm5-4', text: 'Professional development goals' },
    { id: 'm5-5', text: 'Month 6 formal review readiness' },
  ]},
  { id: 'm6', label: 'Month 6', short: 'M6', type: 'monthly', track: 'mentor', md: true, items: [
    { id: 'm6-1', text: 'Formal 6-month milestone assessment' },
    { id: 'm6-2', text: 'Full capacity confirmation' },
    { id: 'm6-3', text: 'Quality dashboard comprehensive review' },
    { id: 'm6-4', text: 'Quarterly transition plan' },
    { id: 'm6-5', text: 'Summary prepared for Medical Director' },
  ]},
  { id: 'q3', label: 'Month 9', short: 'Q3', type: 'quarterly', track: 'mentor', md: true, items: [
    { id: 'q3-1', text: 'Continued development and CE planning' },
    { id: 'q3-2', text: 'Professional goals check-in' },
    { id: 'q3-3', text: 'Quality and patient satisfaction review' },
    { id: 'q3-4', text: 'Emerging issues or support needs' },
  ]},
  { id: 'q4', label: 'Month 12', short: 'Q4', type: 'quarterly', track: 'mentor', md: true, items: [
    { id: 'q4-1', text: 'Annual comprehensive integration review' },
    { id: 'q4-2', text: 'Full performance metrics assessment' },
    { id: 'q4-3', text: 'Mentorship transition (formal → peer)' },
    { id: 'q4-4', text: 'Year 2 development plan' },
  ]},
];

// Office-manager / ops track. Director × OM monthly conversations focused on
// operational signals (patient flow, billing, no-shows, staff sentiment).
// Director-only edit; mentors do not see this track.
export const OM_PHASES: Phase[] = [
  { id: 'om1', label: 'Month 1 Ops', short: 'OM1', type: 'ops', track: 'ops', items: [
    { id: 'om1-1', text: 'Provider arriving on time and staying on schedule?' },
    { id: 'om1-2', text: 'Front desk handling patient flow smoothly?' },
    { id: 'om1-3', text: 'Any patient complaints or compliments?' },
    { id: 'om1-4', text: 'Operational bottlenecks? (rooming, checkout, labs)' },
    { id: 'om1-5', text: 'MA/nursing team adapting to workflow?' },
  ]},
  { id: 'om2', label: 'Month 2 Ops', short: 'OM2', type: 'ops', track: 'ops', items: [
    { id: 'om2-1', text: 'Patient volume ramping as expected?' },
    { id: 'om2-2', text: 'Referrals and orders routing correctly?' },
    { id: 'om2-3', text: 'Encounter closure turnaround impacting billing?' },
    { id: 'om2-4', text: 'Staff concerns about communication or teamwork?' },
    { id: 'om2-5', text: 'No-show/cancellation rates normal?' },
  ]},
  { id: 'om3', label: 'Month 3 Ops', short: 'OM3', type: 'ops', track: 'ops', items: [
    { id: 'om3-1', text: 'Provider functioning independently (ops view)?' },
    { id: 'om3-2', text: 'Patient satisfaction trends?' },
    { id: 'om3-3', text: 'Billing cycle and claim denial rates?' },
    { id: 'om3-4', text: 'Staff satisfaction with new provider?' },
    { id: 'om3-5', text: 'Operational changes needed for ramp-up?' },
  ]},
  { id: 'om6', label: 'Month 6 Ops', short: 'OM6', type: 'ops', track: 'ops', items: [
    { id: 'om6-1', text: 'At or near target volume (scheduling view)?' },
    { id: 'om6-2', text: 'Revenue per visit and coding accuracy?' },
    { id: 'om6-3', text: 'Patient retention — are patients rebooking?' },
    { id: 'om6-4', text: 'Ongoing operational friction points?' },
    { id: 'om6-5', text: 'Office manager overall integration assessment' },
  ]},
  { id: 'om9', label: 'Month 9 Ops', short: 'OM9', type: 'ops', track: 'ops', items: [
    { id: 'om9-1', text: 'Continued operational performance' },
    { id: 'om9-2', text: 'Patient access or scheduling challenges?' },
    { id: 'om9-3', text: 'Impact on team morale and workflow' },
    { id: 'om9-4', text: 'Upcoming needs (panel, template changes)' },
  ]},
  { id: 'om12', label: 'Month 12 Ops', short: 'OM12', type: 'ops', track: 'ops', items: [
    { id: 'om12-1', text: 'Comprehensive year-one operational assessment' },
    { id: 'om12-2', text: 'Comparison to established provider benchmarks' },
    { id: 'om12-3', text: 'Recommendations for Year 2 support' },
    { id: 'om12-4', text: 'Office manager formal evaluation input' },
  ]},
];

/** Combined phase list — used by phase-id lookups that don't care about track. */
export const ALL_PHASES: Phase[] = [...PHASES, ...OM_PHASES];

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

  // Ops-track seed: directors complete OM phases for far-along Westside +
  // Eastside providers. Each fill is by the provider's home director.
  const fillOps = (pid: string, phaseIds: string[], by: string): void => {
    phaseIds.forEach((phid) => {
      const ph = OM_PHASES.find((p) => p.id === phid);
      if (!ph) return;
      ph.items.forEach((it) => { c[`${pid}:${phid}:${it.id}`] = { by, at: 'seed' }; });
    });
  };
  // Westside (md1, Dr. Rivera): p1 furthest along, p2 mid, p3 just started
  fillOps('p1', ['om1', 'om2', 'om3'], 'md1');
  fillOps('p2', ['om1', 'om2'], 'md1');
  fillOps('p3', ['om1'], 'md1');
  // Eastside (md2, Dr. Patel): p7 mid (m3), p8 just started ops
  fillOps('p7', ['om1', 'om2'], 'md2');
  fillOps('p8', ['om1'], 'md2');
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
  const phase = ALL_PHASES.find((p) => p.id === phaseId);
  if (!phase) return { done: 0, total: 0, pct: 0 };
  const done = phase.items.filter((it) => data.checkoffs[`${providerId}:${phaseId}:${it.id}`]).length;
  return { done, total: phase.items.length, pct: Math.round((done / phase.items.length) * 100) };
}

// Mentor track only counts phases up through the provider's currentPhase
// (future phases are "not yet expected"). Ops track has no cursor — every ops
// phase is open from day one and counts toward the denominator.
export function getOverallProgress(
  data: MentorshipData,
  providerId: string,
  track: PhaseTrack = 'mentor',
): number {
  const prov = data.providers.find((p) => p.id === providerId);
  if (!prov) return 0;
  const phases = track === 'ops' ? OM_PHASES : PHASES;
  const phIdx = PHASES.findIndex((p) => p.id === prov.currentPhase);
  let total = 0;
  let done = 0;
  phases.forEach((ph, i) => {
    if (track === 'mentor' && i > phIdx) return;
    ph.items.forEach((it) => {
      total++;
      if (data.checkoffs[`${providerId}:${ph.id}:${it.id}`]) done++;
    });
  });
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

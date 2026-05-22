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
const HEDIS_MEASURES = [
  { id: 'dm-a1c', label: 'DM — A1c Control', pct: 74, target: 80 },
  { id: 'dm-bp', label: 'DM — BP <140/90', pct: 81, target: 75 },
  { id: 'dm-eye', label: 'DM — Eye Exam', pct: 58, target: 70 },
  { id: 'dm-neph', label: 'DM — Nephropathy', pct: 88, target: 80 },
  { id: 'cad-statin', label: 'CAD — Statin Therapy', pct: 91, target: 85 },
  { id: 'bp-ctrl', label: 'HTN — BP Control', pct: 66, target: 75 },
  { id: 'cancer-bc', label: 'Breast Cancer Screen', pct: 72, target: 80 },
  { id: 'cancer-cc', label: 'Colorectal Screen', pct: 69, target: 75 },
  { id: 'dep-f-up', label: 'Depression F/U', pct: 83, target: 80 },
  { id: 'asthma', label: 'Asthma Med Ratio', pct: 79, target: 75 },
  { id: 'prev-care', label: 'Preventive Care Visit', pct: 61, target: 70 },
  { id: 'immuniz', label: 'Childhood Immunization', pct: 88, target: 85 },
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
  return (
    <>
      <div class="info-banner">
        Panel composite: <strong>74.8%</strong> across all measures. Target: 78%. Click any measure to view care gaps.
      </div>
      <div class="hedis-grid">
        {HEDIS_MEASURES.map((m) => {
          const tone = pctTone(m.pct, m.target);
          return (
            <div key={m.id} class={`hedis-block tone-${tone}`}>
              <div class="hedis-measure">{m.label}</div>
              <div class="hedis-pct">{m.pct}%</div>
              <div class="hedis-bar-track">
                <div class="hedis-bar-fill" style={{ width: `${m.pct}%` }} />
              </div>
              <div class="hedis-target">Target: {m.target}%</div>
            </div>
          );
        })}
      </div>
    </>
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

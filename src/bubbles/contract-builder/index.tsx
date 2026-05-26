// Controlled-substances contract builder (Track 4d). Implements the
// CS Contract Builder schema v1.0.0 (NY/NJ only). The provider sets the
// substance class, state, and situational flags; the builder auto-suggests
// a risk tier (with rationale and override), assembles the matching clauses
// from the clause library, and produces a copy-ready agreement plus a
// .CSAGREE-[CLASS]-[STATE]-[TIER] SmartPhrase trigger.
//
// Source of truth for clause text is src/data/seed/controlled-substances-
// contracts.json (Section 6 versioning). Tier-suggestion logic lives here
// (Section 2) so clause text never embeds selection logic. Bracketed tokens
// like [MEDICATION] pass through verbatim — they are Epic SmartPhrase
// fill-ins; only [MEDICATION CLASS] and [VERSION STAMP] (values we know)
// are substituted.
//
// Spawn: from clinical-tools' Contracts card. When spawned inside a
// controlled-substance module, props.initialClass pre-selects the class
// (adhd -> stimulant, opiates -> opioid, benzos -> benzo).

import { useMemo, useState } from 'preact/hooks';
import type { ComponentChildren, JSX } from 'preact';
import type {
  BubbleInstance,
  CsContractClause,
  CsContractInputs,
  CsContractLibrary,
  CsRiskTier,
  CsState,
  CsSubstanceClass,
} from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import libraryJson from '../../data/seed/controlled-substances-contracts.json';

const LIB = libraryJson as unknown as CsContractLibrary;

interface ContractBuilderProps {
  initialClass?: CsSubstanceClass;
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId?: string;
  selfBubbleId?: string;
}

// ─── Section 2: risk-tier auto-suggestion ──────────────────────────────
// Returns the suggested tier and the human-readable triggers that fired.
// NOTE: schema Inputs expose dose/lost-med as booleans, while Section 2's
// high-risk wording references magnitude ("significantly above") and counts
// ("2+"). With only booleans available we map dose_above_threshold to the
// enhanced contributor and keep the explicit high-risk triggers below; the
// provider always confirms or overrides the tier, which is the schema's
// designed safety valve.
function suggestTier(inp: TierInputs): { tier: CsRiskTier; reasons: string[] } {
  const high: string[] = [];
  if (inp.sud_history === 'active' && !inp.specialist_involved) high.push('active SUD without specialist involvement');
  if (inp.combo_opioid_benzo) high.push('concurrent opioid + benzodiazepine');
  if (inp.concurrent_cs === 'cross-class') high.push('cross-class concurrent controlled substances');
  if (inp.prior_lost_medication) high.push('prior lost-medication report');
  if (inp.indication_status === 'none-pending-assessment' && inp.dose_above_threshold) high.push('no indication at high dose');
  if (high.length > 0) return { tier: 'high-risk', reasons: high };

  const enh: string[] = [];
  if ((inp.sud_history === 'past' || inp.sud_history === 'active') && !inp.specialist_involved) enh.push('SUD history without specialist involvement');
  if (inp.early_fill_history) enh.push('early-fill history');
  if (inp.dose_above_threshold) enh.push('dose at or above threshold');
  if (inp.age_65_plus) enh.push('age ≥ 65');
  if (inp.indication_status === 'inherited-presumptive') enh.push('inherited-presumptive indication');
  if (inp.concurrent_cs === 'same-class') enh.push('concurrent same-class controlled substance');
  if (enh.length > 0) return { tier: 'enhanced', reasons: enh };

  return { tier: 'standard', reasons: [] };
}

interface TierInputs {
  sud_history: CsContractInputs['sud_history'];
  concurrent_cs: CsContractInputs['concurrent_cs'];
  combo_opioid_benzo: boolean;
  age_65_plus: boolean;
  dose_above_threshold: boolean;
  early_fill_history: boolean;
  prior_lost_medication: boolean;
  indication_status: CsContractInputs['indication_status'];
  specialist_involved: boolean;
}

// Naloxone auto-logic (schema 1.2): opioid-involving class with a dose or SUD
// flag, or any opioid+benzo combination. Provider can override.
function autoNaloxone(cls: CsSubstanceClass, t: TierInputs): boolean {
  if (t.combo_opioid_benzo) return true;
  const opioidInvolving = cls === 'opioid' || cls === 'multi-class';
  return opioidInvolving && (t.dose_above_threshold || t.sud_history !== 'none');
}

function matchesCondition(clause: CsContractClause, inp: CsContractInputs): boolean {
  const c = clause.condition;
  if (!c) return true;
  const v = (inp as unknown as Record<string, unknown>)[c.field];
  if (c.in) return c.in.includes(String(v));
  if (c.eq !== undefined) return v === c.eq;
  return false;
}

function clauseText(clause: CsContractClause, state: CsState): string {
  return state === 'NJ' && clause.text_NJ ? clause.text_NJ : clause.text;
}

function substituteKnownTokens(text: string, inp: CsContractInputs): string {
  return text
    .replace(/\[MEDICATION CLASS\]/g, LIB.class_labels[inp.substance_class])
    .replace(/\[VERSION STAMP\]/g, `v${LIB.schema_version} (${LIB.change_log[0]?.date ?? ''})`);
}

interface AssembledSection {
  section_id: string;
  title: string;
  clauses: { clause_id: string; text: string; proposed: boolean }[];
}

interface Assembled {
  sections: AssembledSection[];
  fullText: string;
  flagsSummary: string;
  smartphraseTrigger: string;
  nextReviewDate: string;
  proposedCount: number;
  totalCount: number;
}

function isoPlusMonths(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function assemble(inp: CsContractInputs): Assembled {
  const sections: AssembledSection[] = [];
  let proposedCount = 0;
  let totalCount = 0;
  for (const sec of [...LIB.sections].sort((a, b) => a.order - b.order)) {
    const clauses = sec.clauses
      .filter((cl) => matchesCondition(cl, inp))
      .map((cl) => {
        totalCount += 1;
        if (cl.proposed_institutional_standard) proposedCount += 1;
        return {
          clause_id: cl.clause_id,
          text: substituteKnownTokens(clauseText(cl, inp.state), inp),
          proposed: cl.proposed_institutional_standard,
        };
      });
    if (clauses.length > 0) sections.push({ section_id: sec.section_id, title: sec.title, clauses });
  }

  const fullText = sections
    .map((s, i) => {
      const heading = `SECTION ${i + 1} — ${s.title.toUpperCase()}`;
      return `${heading}\n\n${s.clauses.map((c) => c.text).join('\n\n')}`;
    })
    .join('\n\n');

  const trigger = `.CSAGREE-${LIB.class_codes[inp.substance_class]}-${inp.state}-${LIB.tier_codes[inp.risk_tier]}`;

  const flagBits: string[] = [];
  if (inp.sud_history !== 'none') flagBits.push(`SUD-${inp.sud_history}`);
  if (inp.combo_opioid_benzo) flagBits.push('opioid+benzo');
  if (inp.concurrent_cs !== 'none') flagBits.push(inp.concurrent_cs);
  if (inp.dose_above_threshold) flagBits.push('dose≥threshold');
  if (inp.age_65_plus) flagBits.push('age≥65');
  if (inp.early_fill_history) flagBits.push('early-fills');
  if (inp.prior_lost_medication) flagBits.push('lost-med');
  if (inp.driving_or_safety_sensitive) flagBits.push('driving');
  if (inp.naloxone_indicated) flagBits.push('naloxone');
  if (inp.specialist_involved) flagBits.push('specialist');
  const classLabel = inp.substance_class === 'multi-class' ? 'Multi-class' : cap(LIB.class_labels[inp.substance_class]);
  const flagsSummary = `${classLabel} | ${inp.state} | ${cap(inp.risk_tier)}${flagBits.length ? ` | ${flagBits.join(', ')}` : ''}`;

  return {
    sections,
    fullText,
    flagsSummary,
    smartphraseTrigger: trigger,
    nextReviewDate: isoPlusMonths(LIB.next_review_offset_months[inp.risk_tier]),
    proposedCount,
    totalCount,
  };
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const CLASS_OPTIONS: { value: CsSubstanceClass; label: string }[] = [
  { value: 'opioid', label: 'Opioid' },
  { value: 'benzo', label: 'Benzodiazepine' },
  { value: 'stimulant', label: 'Stimulant' },
  { value: 'multi-class', label: 'Multi-class' },
];

export function ContractBuilder({ instance }: Props): JSX.Element {
  const props = (instance.props as unknown as ContractBuilderProps) ?? {};

  const [substanceClass, setSubstanceClass] = useState<CsSubstanceClass>(props.initialClass ?? 'opioid');
  const [state, setState] = useState<CsState>('NY');
  const [sudHistory, setSudHistory] = useState<CsContractInputs['sud_history']>('none');
  const [concurrentCs, setConcurrentCs] = useState<CsContractInputs['concurrent_cs']>('none');
  const [comboOpioidBenzo, setComboOpioidBenzo] = useState(false);
  const [age65, setAge65] = useState(false);
  const [doseAbove, setDoseAbove] = useState(false);
  const [earlyFill, setEarlyFill] = useState(false);
  const [driving, setDriving] = useState(false);
  const [priorLost, setPriorLost] = useState(false);
  const [indicationStatus, setIndicationStatus] = useState<CsContractInputs['indication_status']>('inherited-presumptive');
  const [specialistInvolved, setSpecialistInvolved] = useState(false);
  const [tierOverride, setTierOverride] = useState<CsRiskTier | null>(null);
  const [naloxoneOverride, setNaloxoneOverride] = useState<boolean | null>(null);

  const [view, setView] = useState<'build' | 'output'>('build');
  const [copied, setCopied] = useState(false);

  const tierInputs: TierInputs = {
    sud_history: sudHistory,
    concurrent_cs: concurrentCs,
    combo_opioid_benzo: comboOpioidBenzo,
    age_65_plus: age65,
    dose_above_threshold: doseAbove,
    early_fill_history: earlyFill,
    prior_lost_medication: priorLost,
    indication_status: indicationStatus,
    specialist_involved: specialistInvolved,
  };

  const suggestion = useMemo(() => suggestTier(tierInputs), [
    sudHistory, concurrentCs, comboOpioidBenzo, age65, doseAbove, earlyFill, priorLost, indicationStatus, specialistInvolved,
  ]);
  const effectiveTier: CsRiskTier = tierOverride ?? suggestion.tier;
  const autoNal = autoNaloxone(substanceClass, tierInputs);
  const effectiveNaloxone = naloxoneOverride ?? autoNal;

  const inputs: CsContractInputs = {
    substance_class: substanceClass,
    state,
    risk_tier: effectiveTier,
    sud_history: sudHistory,
    concurrent_cs: concurrentCs,
    combo_opioid_benzo: comboOpioidBenzo,
    age_65_plus: age65,
    dose_above_threshold: doseAbove,
    early_fill_history: earlyFill,
    driving_or_safety_sensitive: driving,
    prior_lost_medication: priorLost,
    indication_status: indicationStatus,
    naloxone_indicated: effectiveNaloxone,
    specialist_involved: specialistInvolved,
  };

  const assembled = useMemo(() => assemble(inputs), [JSON.stringify(inputs)]);

  async function copyText(): Promise<void> {
    try {
      await navigator.clipboard.writeText(assembled.fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1100);
    } catch {
      /* clipboard denied — ignore */
    }
  }

  return (
    <div class="contract-builder" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        {view === 'output' && (
          <button
            type="button"
            title="Back to inputs"
            aria-label="Back to inputs"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setView('build'); }}
            style={chromeBackStyle}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>‹</span>
            <span style={{ fontSize: 11 }}>inputs</span>
          </button>
        )}
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>
          {view === 'build' ? 'CS contract builder' : 'Assembled agreement'}
        </span>
        <span style={{ marginLeft: 8, fontSize: 10.5, opacity: 0.6 }}>NY / NJ · v{LIB.schema_version}</span>
      </div>

      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '10px 14px 14px' }}>
        {view === 'build' ? (
          <BuildView
            substanceClass={substanceClass} setSubstanceClass={setSubstanceClass}
            state={state} setState={setState}
            sudHistory={sudHistory} setSudHistory={setSudHistory}
            concurrentCs={concurrentCs} setConcurrentCs={setConcurrentCs}
            comboOpioidBenzo={comboOpioidBenzo} setComboOpioidBenzo={setComboOpioidBenzo}
            age65={age65} setAge65={setAge65}
            doseAbove={doseAbove} setDoseAbove={setDoseAbove}
            earlyFill={earlyFill} setEarlyFill={setEarlyFill}
            driving={driving} setDriving={setDriving}
            priorLost={priorLost} setPriorLost={setPriorLost}
            indicationStatus={indicationStatus} setIndicationStatus={setIndicationStatus}
            specialistInvolved={specialistInvolved} setSpecialistInvolved={setSpecialistInvolved}
            suggestion={suggestion}
            effectiveTier={effectiveTier}
            tierOverride={tierOverride} setTierOverride={setTierOverride}
            effectiveNaloxone={effectiveNaloxone} autoNal={autoNal}
            naloxoneOverride={naloxoneOverride} setNaloxoneOverride={setNaloxoneOverride}
            onGenerate={() => setView('output')}
          />
        ) : (
          <OutputView assembled={assembled} copied={copied} onCopy={copyText} />
        )}
      </div>
    </div>
  );
}

function BuildView(p: {
  substanceClass: CsSubstanceClass; setSubstanceClass: (v: CsSubstanceClass) => void;
  state: CsState; setState: (v: CsState) => void;
  sudHistory: CsContractInputs['sud_history']; setSudHistory: (v: CsContractInputs['sud_history']) => void;
  concurrentCs: CsContractInputs['concurrent_cs']; setConcurrentCs: (v: CsContractInputs['concurrent_cs']) => void;
  comboOpioidBenzo: boolean; setComboOpioidBenzo: (v: boolean) => void;
  age65: boolean; setAge65: (v: boolean) => void;
  doseAbove: boolean; setDoseAbove: (v: boolean) => void;
  earlyFill: boolean; setEarlyFill: (v: boolean) => void;
  driving: boolean; setDriving: (v: boolean) => void;
  priorLost: boolean; setPriorLost: (v: boolean) => void;
  indicationStatus: CsContractInputs['indication_status']; setIndicationStatus: (v: CsContractInputs['indication_status']) => void;
  specialistInvolved: boolean; setSpecialistInvolved: (v: boolean) => void;
  suggestion: { tier: CsRiskTier; reasons: string[] };
  effectiveTier: CsRiskTier;
  tierOverride: CsRiskTier | null; setTierOverride: (v: CsRiskTier | null) => void;
  effectiveNaloxone: boolean; autoNal: boolean;
  naloxoneOverride: boolean | null; setNaloxoneOverride: (v: boolean | null) => void;
  onGenerate: () => void;
}): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Substance class">
        <Segmented
          options={CLASS_OPTIONS}
          value={p.substanceClass}
          onChange={p.setSubstanceClass}
        />
      </Field>

      <Field label="State">
        <Segmented
          options={[{ value: 'NY', label: 'New York' }, { value: 'NJ', label: 'New Jersey' }]}
          value={p.state}
          onChange={p.setState}
        />
      </Field>

      <Field label="SUD history">
        <Segmented
          options={[{ value: 'none', label: 'None' }, { value: 'past', label: 'Past' }, { value: 'active', label: 'Active' }]}
          value={p.sudHistory}
          onChange={p.setSudHistory}
        />
      </Field>

      <Field label="Concurrent controlled substance">
        <Segmented
          options={[{ value: 'none', label: 'None' }, { value: 'same-class', label: 'Same class' }, { value: 'cross-class', label: 'Cross class' }]}
          value={p.concurrentCs}
          onChange={p.setConcurrentCs}
        />
      </Field>

      <Field label="Indication status">
        <Segmented
          options={[
            { value: 'established', label: 'Established' },
            { value: 'inherited-presumptive', label: 'Inherited' },
            { value: 'none-pending-assessment', label: 'None / pending' },
          ]}
          value={p.indicationStatus}
          onChange={p.setIndicationStatus}
        />
      </Field>

      <Field label="Situational flags">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <Chip label="Opioid + benzo" on={p.comboOpioidBenzo} onToggle={() => p.setComboOpioidBenzo(!p.comboOpioidBenzo)} />
          <Chip label="Dose ≥ threshold" on={p.doseAbove} onToggle={() => p.setDoseAbove(!p.doseAbove)} />
          <Chip label="Age ≥ 65" on={p.age65} onToggle={() => p.setAge65(!p.age65)} />
          <Chip label="Early-fill history" on={p.earlyFill} onToggle={() => p.setEarlyFill(!p.earlyFill)} />
          <Chip label="Prior lost meds" on={p.priorLost} onToggle={() => p.setPriorLost(!p.priorLost)} />
          <Chip label="Driving / safety-sensitive" on={p.driving} onToggle={() => p.setDriving(!p.driving)} />
          <Chip label="Specialist involved" on={p.specialistInvolved} onToggle={() => p.setSpecialistInvolved(!p.specialistInvolved)} />
        </div>
      </Field>

      <TierPanel
        suggestion={p.suggestion}
        effectiveTier={p.effectiveTier}
        tierOverride={p.tierOverride}
        onOverride={p.setTierOverride}
      />

      <Field label="Naloxone">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Chip
            label={p.effectiveNaloxone ? 'Naloxone offered' : 'Naloxone not indicated'}
            on={p.effectiveNaloxone}
            onToggle={() => p.setNaloxoneOverride(!p.effectiveNaloxone)}
          />
          <span style={{ fontSize: 10.5, opacity: 0.6 }}>
            {p.naloxoneOverride !== null
              ? 'manual override'
              : `auto-${p.autoNal ? 'indicated' : 'off'}`}
          </span>
        </div>
      </Field>

      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); p.onGenerate(); }}
        style={{
          marginTop: 2,
          padding: '10px 14px',
          border: '1.5px solid var(--type-color)',
          background: 'var(--type-color)',
          color: '#fff',
          borderRadius: 6,
          cursor: 'pointer',
          font: 'inherit',
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        Assemble agreement →
      </button>
    </div>
  );
}

function TierPanel({
  suggestion,
  effectiveTier,
  tierOverride,
  onOverride,
}: {
  suggestion: { tier: CsRiskTier; reasons: string[] };
  effectiveTier: CsRiskTier;
  tierOverride: CsRiskTier | null;
  onOverride: (v: CsRiskTier | null) => void;
}): JSX.Element {
  const color = TIER_COLOR[effectiveTier];
  const rationale = suggestion.reasons.length > 0
    ? `Suggested ${TIER_LABEL[suggestion.tier]} — ${suggestion.reasons.join('; ')}.`
    : 'Suggested Standard — no elevated-risk flags set.';
  return (
    <div
      style={{
        padding: '10px 12px',
        borderRadius: 6,
        border: `1px solid ${color}55`,
        borderLeft: `4px solid ${color}`,
        background: `${color}0f`,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, opacity: 0.7, marginBottom: 6 }}>
        Risk tier
      </div>
      <div style={{ fontSize: 11.5, lineHeight: 1.45, opacity: 0.85, marginBottom: 8 }}>{rationale}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['standard', 'enhanced', 'high-risk'] as CsRiskTier[]).map((t) => {
          const active = effectiveTier === t;
          const isOverride = tierOverride === t && tierOverride !== suggestion.tier;
          return (
            <button
              key={t}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onOverride(t === suggestion.tier ? null : t); }}
              style={{
                flex: 1,
                padding: '6px 4px',
                border: `1.5px solid ${active ? TIER_COLOR[t] : 'rgba(0,0,0,0.18)'}`,
                background: active ? `${TIER_COLOR[t]}22` : 'transparent',
                color: 'inherit',
                borderRadius: 4,
                cursor: 'pointer',
                font: 'inherit',
                fontSize: 11,
                fontWeight: active ? 700 : 500,
              }}
            >
              {TIER_LABEL[t]}{isOverride ? ' *' : ''}
            </button>
          );
        })}
      </div>
      {tierOverride !== null && tierOverride !== suggestion.tier && (
        <div style={{ fontSize: 10, opacity: 0.6, marginTop: 6 }}>
          * Manual override (logged). <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onOverride(null); }}
            style={{ border: 'none', background: 'transparent', color: 'var(--type-color)', cursor: 'pointer', font: 'inherit', fontSize: 10, textDecoration: 'underline', padding: 0 }}
          >reset to suggested</button>
        </div>
      )}
    </div>
  );
}

function OutputView({ assembled, copied, onCopy }: { assembled: Assembled; copied: boolean; onCopy: () => void }): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 11, opacity: 0.75, lineHeight: 1.4 }}>{assembled.flagsSummary}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <code style={{
            fontSize: 12, fontWeight: 700, color: 'var(--type-color)',
            background: 'rgba(0,0,0,0.05)', padding: '3px 8px', borderRadius: 4,
          }}>{assembled.smartphraseTrigger}</code>
          <span style={{ fontSize: 10.5, opacity: 0.6 }}>next review {assembled.nextReviewDate}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onCopy(); }}
          style={{
            border: '1.5px solid var(--type-color)',
            background: copied ? 'var(--type-color)' : 'transparent',
            color: copied ? '#fff' : 'inherit',
            padding: '7px 14px', borderRadius: 4, cursor: 'pointer', font: 'inherit', fontSize: 12, fontWeight: 600,
          }}
        >
          {copied ? 'Copied' : 'Copy agreement text'}
        </button>
      </div>

      <div
        style={{
          padding: '12px 14px',
          fontSize: 12,
          lineHeight: 1.55,
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 6,
          whiteSpace: 'pre-wrap',
          maxHeight: '46vh',
          overflowY: 'auto',
          userSelect: 'text',
        }}
      >
        {assembled.fullText}
      </div>

      <div style={{ fontSize: 10.5, opacity: 0.6, lineHeight: 1.5 }}>
        Bracketed fields like <code>[MEDICATION]</code> are Epic SmartPhrase fill-ins — paste this as the
        body of <code>{assembled.smartphraseTrigger}</code> and complete them at sign time.
        {assembled.proposedCount > 0 && (
          <> {assembled.proposedCount} of {assembled.totalCount} included clauses are <strong>proposed institutional standards</strong> (no national mandate) — flagged for compliance review.</>
        )}
      </div>
    </div>
  );
}

// ─── small presentational helpers ──────────────────────────────────────

function Field({ label, children }: { label: string; children: ComponentChildren }): JSX.Element {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.6 }}>{label}</span>
      {children}
    </label>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}): JSX.Element {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onChange(o.value); }}
            style={{
              padding: '6px 10px',
              border: `1.5px solid ${active ? 'var(--type-color)' : 'rgba(0,0,0,0.18)'}`,
              background: active ? 'var(--type-color)' : 'transparent',
              color: active ? '#fff' : 'inherit',
              borderRadius: 4,
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 11.5,
              fontWeight: active ? 700 : 500,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Chip({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }): JSX.Element {
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      style={{
        padding: '5px 10px',
        border: `1.5px solid ${on ? 'var(--type-color)' : 'rgba(0,0,0,0.18)'}`,
        background: on ? 'var(--type-color)' : 'transparent',
        color: on ? '#fff' : 'inherit',
        borderRadius: 999,
        cursor: 'pointer',
        font: 'inherit',
        fontSize: 11,
        fontWeight: on ? 700 : 500,
      }}
    >
      {label}
    </button>
  );
}

const chromeBackStyle = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: 13,
  padding: '0 8px 0 0',
  opacity: 0.75,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
} as const;

const TIER_LABEL: Record<CsRiskTier, string> = {
  standard: 'Standard',
  enhanced: 'Enhanced',
  'high-risk': 'High-risk',
};

const TIER_COLOR: Record<CsRiskTier, string> = {
  standard: '#0F6B42',
  enhanced: '#c98a00',
  'high-risk': '#d92e2e',
};

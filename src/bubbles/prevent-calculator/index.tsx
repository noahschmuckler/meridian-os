// PREVENT calculator — AHA/ACC 10-year ASCVD risk.
//
// Patient-agnostic: provider enters the inputs by hand. Recomputes live as
// inputs change. Tiers match the lipid module's thresholds (Low <5%,
// Borderline 5–7.5%, Intermediate 7.5–20%, High ≥20%).
//
// Coefficients are PREVENT-shape and modeled after Khan SS et al, "Novel
// Prediction Equations for Absolute Risk Assessment of Total Cardiovascular
// Disease," Circulation 2023;148(24):1982–2004 (Table S5 of the supplement),
// but the linear-predictor constant has been calibrated by hand here to
// produce sensible 10-year risk values across a few reference cases. This is
// **draft / demonstration code** — verify every result against acc.org/PREVENT
// before clinical use. Not validated against the official calculator.

import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

interface Inputs {
  age: number;
  sex: 'female' | 'male';
  totalChol: number; // mg/dL
  hdl: number;       // mg/dL
  sbp: number;       // mmHg
  bpMed: boolean;
  diabetes: boolean;
  smoker: boolean;
  egfr: number;      // mL/min/1.73m²
  statin: boolean;
}

const DEFAULTS: Inputs = {
  age: 55,
  sex: 'female',
  totalChol: 200,
  hdl: 50,
  sbp: 130,
  bpMed: false,
  diabetes: false,
  smoker: false,
  egfr: 90,
  statin: false,
};

// mg/dL → mmol/L
const TC_FACTOR = 0.02586;

interface Coefs {
  constant: number;
  age: number;
  nonHdl: number;
  hdl: number;
  sbpLow: number;   // min(SBP-110, 0) / 20
  sbpHigh: number;  // max(SBP-110, 0) / 20
  diabetes: number;
  smoker: number;
  egfrLow: number;  // min(eGFR-60, 0) / -15
  bpMed: number;
  statin: number;
  ageNonHdl: number;
  ageHdl: number;
  ageSbpHigh: number;
  ageDiabetes: number;
  ageSmoker: number;
}

const FEMALE: Coefs = {
  constant: -3.6,
  age: 0.7939329,
  nonHdl: 0.0305239,
  hdl: -0.1606857,
  sbpLow: -0.2394003,
  sbpHigh: 0.3600781,
  diabetes: 0.8667604,
  smoker: 0.5360739,
  egfrLow: 0.6045917,
  bpMed: 0.3151672,
  statin: -0.1477655,
  ageNonHdl: -0.0663612,
  ageHdl: 0.1015067,
  ageSbpHigh: -0.0855880,
  ageDiabetes: -0.2899091,
  ageSmoker: -0.1542850,
};

const MALE: Coefs = {
  constant: -3.3,
  age: 0.7688528,
  nonHdl: 0.0736174,
  hdl: -0.0954431,
  sbpLow: -0.4347345,
  sbpHigh: 0.3362658,
  diabetes: 0.7692857,
  smoker: 0.4386871,
  egfrLow: 0.5378979,
  bpMed: 0.2889610,
  statin: -0.1337349,
  ageNonHdl: -0.0475924,
  ageHdl: 0.0844398,
  ageSbpHigh: -0.0518984,
  ageDiabetes: -0.2553929,
  ageSmoker: -0.1521243,
};

interface Tier {
  label: string;
  color: string;
  detail: string;
}

function classifyTier(risk: number): Tier {
  if (risk < 5) return { label: 'Low', color: '#0F6B42', detail: 'No statin indicated.' };
  if (risk < 7.5) return { label: 'Borderline', color: '#B45309', detail: 'Shared decision-making · statin reasonable if LDL ≥70 plus risk enhancers.' };
  if (risk < 20) return { label: 'Intermediate', color: '#B45309', detail: 'Initiate statin.' };
  return { label: 'High', color: '#d92e2e', detail: 'High-intensity statin · no shared decision-making required.' };
}

function compute(inputs: Inputs): number | null {
  const { age, sex, totalChol, hdl, sbp, bpMed, diabetes, smoker, egfr, statin } = inputs;
  if (
    !Number.isFinite(age) || age < 30 || age > 79
    || !Number.isFinite(totalChol) || totalChol < 100 || totalChol > 400
    || !Number.isFinite(hdl) || hdl < 20 || hdl > 120
    || !Number.isFinite(sbp) || sbp < 80 || sbp > 220
    || !Number.isFinite(egfr) || egfr < 15 || egfr > 140
  ) return null;

  const c = sex === 'female' ? FEMALE : MALE;

  const ageTerm = (age - 55) / 10;
  const nonHdlMmol = (totalChol - hdl) * TC_FACTOR;
  const nonHdlTerm = nonHdlMmol - 3.5;
  const hdlMmol = hdl * TC_FACTOR;
  const hdlTerm = (hdlMmol - 1.3) / 0.3;
  const sbpLowTerm = Math.min(sbp - 110, 0) / 20;
  const sbpHighTerm = Math.max(sbp - 110, 0) / 20;
  const egfrLowTerm = Math.min(egfr - 60, 0) / -15;
  const dm = diabetes ? 1 : 0;
  const sm = smoker ? 1 : 0;
  const bpm = bpMed ? 1 : 0;
  const stat = statin ? 1 : 0;

  const lp =
    c.constant
    + c.age * ageTerm
    + c.nonHdl * nonHdlTerm
    + c.hdl * hdlTerm
    + c.sbpLow * sbpLowTerm
    + c.sbpHigh * sbpHighTerm
    + c.diabetes * dm
    + c.smoker * sm
    + c.egfrLow * egfrLowTerm
    + c.bpMed * bpm
    + c.statin * stat
    + c.ageNonHdl * ageTerm * nonHdlTerm
    + c.ageHdl * ageTerm * hdlTerm
    + c.ageSbpHigh * ageTerm * sbpHighTerm
    + c.ageDiabetes * ageTerm * dm
    + c.ageSmoker * ageTerm * sm;

  const risk = 1 / (1 + Math.exp(-lp));
  return Math.round(risk * 1000) / 10; // percent, one decimal
}

export function PreventCalculator(_props: Props): JSX.Element {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);

  const risk = compute(inputs);
  const tier = risk == null ? null : classifyTier(risk);

  function update<K extends keyof Inputs>(key: K, value: Inputs[K]): void {
    setInputs((p) => ({ ...p, [key]: value }));
  }

  function reset(): void { setInputs(DEFAULTS); }

  const eat = { onPointerDown: (e: Event) => e.stopPropagation() };

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>PREVENT · 10-yr ASCVD</span>
        <button
          type="button"
          {...eat}
          onClick={(e) => { e.stopPropagation(); reset(); }}
          title="Reset to defaults"
          style={{
            marginLeft: 'auto',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 11,
            opacity: 0.65,
          }}
        >reset</button>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '10px 12px 12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px', alignItems: 'start' }}>
          <NumberField label="Age" min={30} max={79} value={inputs.age} onChange={(v) => update('age', v)} />
          <SegmentField
            label="Sex"
            value={inputs.sex}
            options={[{ key: 'female', label: 'Female' }, { key: 'male', label: 'Male' }]}
            onChange={(v) => update('sex', v as Inputs['sex'])}
          />
          <NumberField label="Total chol (mg/dL)" min={100} max={400} value={inputs.totalChol} onChange={(v) => update('totalChol', v)} />
          <NumberField label="HDL (mg/dL)" min={20} max={120} value={inputs.hdl} onChange={(v) => update('hdl', v)} />
          <NumberField label="SBP (mmHg)" min={80} max={220} value={inputs.sbp} onChange={(v) => update('sbp', v)} />
          <NumberField label="eGFR" min={15} max={140} value={inputs.egfr} onChange={(v) => update('egfr', v)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12 }}>
          <ToggleRow label="On BP medication" value={inputs.bpMed} onChange={(v) => update('bpMed', v)} />
          <ToggleRow label="Diabetes" value={inputs.diabetes} onChange={(v) => update('diabetes', v)} />
          <ToggleRow label="Current smoker" value={inputs.smoker} onChange={(v) => update('smoker', v)} />
          <ToggleRow label="On statin" value={inputs.statin} onChange={(v) => update('statin', v)} />
        </div>

        <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.04)', borderLeft: tier ? `4px solid ${tier.color}` : '4px solid transparent' }}>
          {risk == null ? (
            <div style={{ fontSize: 12, opacity: 0.65 }}>Inputs out of valid range.</div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: tier!.color, lineHeight: 1 }}>{risk.toFixed(1)}%</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: tier!.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{tier!.label} risk</span>
              </div>
              <div style={{ fontSize: 11.5, lineHeight: 1.4, opacity: 0.8, marginTop: 6 }}>{tier!.detail}</div>
            </>
          )}
        </div>

        <div
          style={{
            marginTop: 10,
            padding: '8px 10px',
            fontSize: 10.5,
            lineHeight: 1.4,
            background: 'rgba(244, 192, 32, 0.18)',
            border: '1px solid rgba(244, 192, 32, 0.5)',
            borderRadius: 4,
          }}
        >
          <strong>Draft — not validated.</strong>{' '}
          PREVENT-shape model with hand-calibrated constants. Verify every result against{' '}
          <a
            href="https://professional.heart.org/en/guidelines-and-statements/prevent-calculator"
            target="_blank"
            rel="noreferrer"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >the official PREVENT calculator</a>{' '}
          before any clinical decision.
        </div>
      </div>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}

function NumberField({ label, min, max, value, onChange }: NumberFieldProps): JSX.Element {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, opacity: 0.85 }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onInput={(e) => {
          const raw = (e.currentTarget as HTMLInputElement).value;
          const parsed = raw === '' ? NaN : Number(raw);
          if (Number.isFinite(parsed)) onChange(parsed);
        }}
        style={{
          font: 'inherit',
          fontSize: 13,
          padding: '4px 6px',
          border: '1px solid rgba(0,0,0,0.15)',
          borderRadius: 4,
          background: 'rgba(255,255,255,0.6)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    </label>
  );
}

interface SegmentFieldProps<T extends string> {
  label: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}

function SegmentField<T extends string>({ label, value, options, onChange }: SegmentFieldProps<T>): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, opacity: 0.85 }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <div style={{ display: 'inline-flex', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.15)' }}>
        {options.map((opt) => {
          const active = opt.key === value;
          return (
            <button
              key={opt.key}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onChange(opt.key); }}
              style={{
                flex: 1,
                font: 'inherit',
                fontSize: 12,
                padding: '4px 0',
                border: 'none',
                background: active ? 'var(--type-color)' : 'rgba(255,255,255,0.6)',
                color: active ? '#fff' : 'inherit',
                cursor: 'pointer',
              }}
            >{opt.label}</button>
          );
        })}
      </div>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, value, onChange }: ToggleRowProps): JSX.Element {
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onChange(!value); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '4px 6px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        font: 'inherit',
        fontSize: 12,
        textAlign: 'left',
      }}
    >
      <span
        style={{
          width: 26,
          height: 16,
          borderRadius: 8,
          background: value ? 'var(--type-color)' : 'rgba(0,0,0,0.18)',
          position: 'relative',
          transition: 'background 160ms',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: value ? 12 : 2,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
            transition: 'left 160ms',
          }}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

// Shared PREVENT calculator state — single signal that the dashboard's
// embedded patient calculator and the lipid-module bubble both read from.
//
// Why: when a provider opens a clinical module from the dashboard's patient
// brief, they expect the module's PREVENT calculator to start where they left
// off (e.g., already toggled "on statin" because the patient is on
// atorvastatin). The signal also flows back — adjustments in the module are
// reflected on the dashboard when the user returns via the Patient Brief
// chevron.
//
// preventInputsSignal holds the current inputs (null = no patient context;
// bubble falls back to DEFAULTS). preventInputsPatientSignal tracks which
// patient owns the current state, so a different patient opening in the
// dashboard re-initializes from chart instead of clobbering on every remount.

import { signal } from '@preact/signals';

export interface PreventInputs {
  age: number;
  sex: 'female' | 'male';
  totalChol: number;
  hdl: number;
  sbp: number;
  bpMed: boolean;
  diabetes: boolean;
  smoker: boolean;
  egfr: number;
  statin: boolean;
}

export const PREVENT_DEFAULTS: PreventInputs = {
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

export const preventInputsSignal = signal<PreventInputs | null>(null);
// Patient identifier (MRN) that the current state belongs to. The dashboard
// sets this when binding to a patient. The bubble doesn't read it.
export const preventInputsPatientSignal = signal<string | null>(null);

// Bind state to a specific patient. Only re-initializes if the patient
// changed — preserves in-progress adjustments across the dashboard↔module
// round-trip.
export function initPreventForPatient(patientMrn: string, inputs: PreventInputs): void {
  if (preventInputsPatientSignal.value !== patientMrn) {
    preventInputsPatientSignal.value = patientMrn;
    preventInputsSignal.value = inputs;
  }
}

// Force-reset to a specific set of inputs (e.g., dashboard's "reset to chart").
export function resetPreventTo(inputs: PreventInputs, patientMrn: string | null = null): void {
  preventInputsSignal.value = inputs;
  preventInputsPatientSignal.value = patientMrn;
}

// In-place update of a single field; preserves the patient binding.
export function updatePreventInput<K extends keyof PreventInputs>(key: K, value: PreventInputs[K]): void {
  const cur = preventInputsSignal.value;
  if (!cur) {
    // No state yet — seed with defaults so the update lands somewhere.
    preventInputsSignal.value = { ...PREVENT_DEFAULTS, [key]: value };
    return;
  }
  preventInputsSignal.value = { ...cur, [key]: value };
}

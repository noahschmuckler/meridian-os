// Core types for meridian-os.
// 5-level hierarchy: HomeScreen → Workspace → Cell → Bubble → MiniBubble.

export type BubblePrimitiveType =
  | 'llm-chat'
  | 'brain-bubble'
  | 'blueprint-tree'
  | 'follow-ups-rail'
  | 'generated-sessions-rail'
  | 'dropzone'
  | 'patient-info'
  | 'modules-stack'
  | 'openevidence-builder'
  | 'smartphrase-directory'
  | 'glidepath-chart'
  | 'email-threads-tracker'
  | 'meeting-tracker'
  | 'provider-dossier'
  | 'care-gap-accumulator'
  | 'status-pill-grid'
  | 'faq-block'
  | 'questionnaire'
  | 'exports-panel'
  | 'dashboard-numbers'
  | 'markdown'
  | 'spreadsheet'
  | 'email-thread'
  | 'manual-control-search'
  | 'clinical-module-checklist'
  | 'clinical-module-escalations'
  | 'clinical-module-faq'
  | 'clinical-topic-cv'
  | 'clinical-topic-controlled'
  | 'clinical-topic-general'
  | 'clinical-tools'
  | 'prevent-calculator'
  | 'gad7'
  | 'phq9'
  | 'audit-c'
  | 'ciwa-ar'
  | 'cows'
  | 'mentorship-role-selector'
  | 'mentorship-exec-overview'
  | 'mentorship-matrix'
  | 'mentorship-mentees-list'
  | 'mentorship-mentee-overview'
  | 'mentorship-phase-tabs'
  | 'mentorship-phase-checklist'
  | 'mentorship-phase-notes'
  | 'glossary-browser'
  | 'consult-builder'
  | 'contract-builder'
  | 'smartphrase-selector'
  | 'placeholder';

export type SizeKey = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface ResizeState {
  cols: number;
  rows: number;
  contentMode: string; // primitive interprets ('compact' | 'detail' | 'full' | …)
  showChrome: boolean;
}

export interface GridPlacement {
  col: number;
  row: number;
  width: number;
  height: number;
}

export interface BubbleInstance {
  id: string;
  type: BubblePrimitiveType;
  title: string;
  props: Record<string, unknown>;
  resize: {
    initial: SizeKey;
    states: Partial<Record<SizeKey, ResizeState>>;
  };
  attach?: { cellId: string; slot: 'organelle' | 'nucleus' };
  search?: { enabled: boolean; placeholder?: string };
  // File-backed: present when this bubble is a view over a MeridianFile.
  // Set when summoned from the vault file picker, when auto-named on attach,
  // or when restored from a snapshot. Renames update the file, not the path.
  fileId?: string;
}

// 'held' replaces the older 'reference' — title + a sentence of context, no reading.
// Old persisted state may still carry 'reference'; readers normalize it to 'held'.
export type AttachRelationship = 'deep' | 'summary' | 'held' | 'edit';

export interface MiniBubble {
  id: string;
  label: string;
  source: string; // points at organelle id or seed key
  pinned: boolean;
  relationship?: AttachRelationship;
}

export interface BrainBubbleConfig {
  miniBubbles: MiniBubble[];
  hydrationRules: {
    onAttach?: 'auto-add';
    onDrop?: 'auto-add';
  };
}

export interface ChatProps {
  greeting?: string;
  defaultPersona?: string;
  brain?: BrainBubbleConfig;
  // canned response config is referenced via scripted actions, not embedded here
}

export interface ScriptedTriggerRef {
  id: string;
  on: 'mount' | 'search' | 'drop' | 'click';
  match?: string; // query / bubbleType / elementId per `on`
}

export type ScriptedAction =
  | { kind: 'chat-say'; cellId: string; lines: string[]; delayMs?: number }
  | { kind: 'brain-add'; cellId: string; mini: MiniBubble }
  | { kind: 'attach-bubble'; bubbleId: string; cellId: string }
  | { kind: 'spawn-bubble'; instance: BubbleInstance; placement: GridPlacement }
  | { kind: 'search-result'; bubbleId: string; results: SearchResult[] }
  | { kind: 'morph-layout'; to: 'workspace' | 'home' };

export interface SearchResult {
  id: string;
  label: string;
  primitiveType: BubblePrimitiveType;
  prefilledProps?: Record<string, unknown>;
}

export interface CellConfig {
  id: string;
  nucleus: { type: 'llm-chat'; props: ChatProps };
  brain: BrainBubbleConfig;
  organelles: BubbleInstance[]; // inline bubble instances attached as organelles
  scriptedTriggers: ScriptedTriggerRef[];
}

export interface WorkspaceConfig {
  id: string;
  title: string;
  icon: { glyph: string; tint: string };
  cells: CellConfig[];
  standalones: BubbleInstance[];
  layoutHints: {
    grid: { cols: number; rows: number };
    placements: Record<string, GridPlacement>;
  };
  scripted: {
    onMount?: ScriptedAction[];
    onSearch?: Record<string, ScriptedAction[]>;
    onDrop?: Record<string, ScriptedAction[]>;
  };
  seed: { sources: string[] };
}

export interface Desktop {
  id: string;
  grid: { cols: number; rows: number };
  icons: {
    workspaceId: string;
    pos: [number, number];
  }[];
}

export interface HomeConfig {
  desktops: Desktop[];
  active: number;
}

// The Bubble runtime interface — every primitive implements this.
export interface BubbleCtx<P = unknown> {
  instance: BubbleInstance;
  props: P;
  // resolved seed values (replacing `{ "$seed": "key" }` tokens in props)
  seed: Record<string, unknown>;
  // event hooks the host wires
  emit: (event: BubbleEvent) => void;
}

export type BubbleEvent =
  | { kind: 'request-attach'; targetCellId: string; slot: 'organelle' | 'nucleus' }
  | { kind: 'request-detach' }
  | { kind: 'request-resize'; size: SizeKey }
  | { kind: 'search-query'; query: string }
  | { kind: 'drag-out' }; // signals home-strip routing

// Clinical module schema (matches schema_version 1.0.0 used in the meridian
// JSON modules). Patient-agnostic content only — checklist items, escalations,
// FAQs, and a footer note. No patient context or live data.
export interface ModuleChecklistItem {
  item_id: string;
  position: number;
  statement: string;
  faq_ref: string;
}

export interface ModuleEscalationItem {
  item_id: string;
  position: number;
  statement: string;
  faq_ref: string;
}

export interface ModuleFaqQA {
  question: string;
  answer_html: string;
}

// Per-FAQ-entry consult-builder pre-fill (schema 1.3.0+). The
// clinical-module-faq bubble surfaces this as a non-clickable pill in the
// detail layer today; the optional `consult_id` reserves a future path
// where clicking spawns the consult-builder with `prefill_text` pre-loaded.
export interface ModuleConsultDecisionPoint {
  prefill_text: string;
  trigger_label?: string;
  consult_id?: string;
}

// Module-level SmartPhrase registry (schema 1.3.0+). Tracks both phrases
// that ship in this revision (`status: 'confirmed'` with `text`) and ones
// flagged for future development (`status: 'future'` with `description`).
// Without this registry, the "future" phrases referenced in per-entry
// `smartphrase_note` fields would have no addressable home.
export interface ModuleSmartPhrase {
  id: string;                  // trigger string incl. leading dot, e.g. ".CSADHD-CONT"
  status: 'confirmed' | 'future';  // confirmed = ship/Active in Epic; future = Draft
  text?: string;               // full HPI-compatible phrase text with [bracketed] fill-ins
  description?: string;        // legacy short description (back-compat for entries without text)
  decision_point?: string;     // clinical decision point the phrase documents (spec)
  anchor?: string;             // module anchor — checklist / escalation / faq id (spec)
}

// schema 1.3.0 added the two-tier "Simplified/Stratified Pass" FAQ shape:
//   - `first_layer_html` — the scannable bottom-line answer rendered above
//     the fold (mixed prose / <ul> / <table> / <div class="cm-callout">).
//   - `sub_questions[]` — first-person provider questions shown as
//     default-closed "More detail" expanders below the first layer.
//   - `smartphrase_note`, `consult_decision_point` — optional surface
//     affordances tied to clinical decision points within this topic.
// Entries authored at 1.2.0 or earlier carry `items[]` (now optional) and
// render via the legacy flat-Q&A path. 1.3.0 entries omit `items` and
// populate `first_layer_html` + `sub_questions`.
export interface ModuleFaqEntry {
  faq_id: string;
  topic: string;
  title: string;
  referenced_by?: string[];
  items?: ModuleFaqQA[];
  first_layer_html?: string;
  sub_questions?: ModuleFaqQA[];
  smartphrase_note?: string;
  consult_decision_point?: ModuleConsultDecisionPoint;
}

// schema_version 1.1.0 introduced structured references with stable ref_ids
// that match `[ref:X]` markers inline in answer_html / context / footer.
// 1.0.0 modules carry plain string citations and no inline markers.
export interface ModuleReference {
  ref_id: string;
  citation: string;
  url?: string;
}

// Glossary entry — auto-decorated at first mention in rendered prose.
// `term` is the canonical display string (also the matcher unless aliases
// override). `aliases` adds extra match strings that resolve to the same
// definition (e.g. "I-STOP" aliasing to "PDMP" since NY's PDMP is named
// I-STOP). `expansion` is the long-form spell-out shown at the top of the
// popover (e.g. "Prescription Drug Monitoring Program"). Matches are
// case-sensitive — write each casing variant as a separate alias if needed.
export interface GlossaryEntry {
  term: string;
  definition: string;
  aliases?: string[];
  expansion?: string;
}

// Consult builder (Track 4b). Per-module list of specialty-consult paths
// with a yes/no triage tree and a pre-filled output template. The
// consult-builder bubble walks the tree and lands on a "recommend"
// (consult is appropriate) / "block" (consult not indicated yet) /
// "continue" (advance to the next node) leaf.
//
// `if_yes` / `if_no` hold one of:
//   - 'continue'         — advance to the next ordered node
//   - 'recommend'        — terminal: consult IS indicated; show output_template
//   - 'block'            — terminal: consult NOT indicated; show recommend_text
//   - <node_id>          — jump to that node id (random-access edges)
// The walker terminates on the first 'recommend' or 'block'; ordered
// 'continue' edges fall through to the next array entry until the list ends
// (final entry's 'continue' is treated as 'recommend').
export type ConsultEdge = 'continue' | 'recommend' | 'block' | string;

export interface ConsultNode {
  node_id?: string;
  question: string;
  if_yes: ConsultEdge;
  if_no: ConsultEdge;
  // Surfaced when the walker terminates on a 'block' edge — explains why
  // the consult isn't indicated yet and what to do instead.
  block_text?: string;
  // Optional explainer rendered under the question to help the user answer.
  hint?: string;
}

export interface ConsultPath {
  consult_id: string;
  // Specialty match string used by the consult-mention decorator. e.g.
  // 'psychiatry' wraps "psychiatry consult" / "consult to psychiatry".
  // Defaults to label.toLowerCase().split(' ')[0] if omitted.
  specialty?: string;
  label: string;                     // e.g. "Addiction medicine consult"
  blurb?: string;                    // one-line summary for the catalog list
  modality?: 'in-person' | 'virtual' | 'either';
  decision_tree: ConsultNode[];
  // Pre-filled consult prose shown on a 'recommend' leaf. May contain
  // ${field} tokens that the bubble surfaces as editable inputs.
  output_template: string;
  // Optional fields/tokens the provider fills in before copying.
  fields?: Array<{ key: string; label: string; default?: string }>;
  refs?: string[];
}

export interface ModuleData {
  schema_version: string;
  module_id: string;
  default_title: string;
  landing_intro: string;
  checklist_section_label: string;
  checklist: ModuleChecklistItem[];
  green_zone: { zone_label: string; narrative_html: string; smartphrase?: string };
  escalation_section_label: string;
  escalation: ModuleEscalationItem[];
  context_strip?: { label: string; text: string };
  footer_note?: string;
  faqs: ModuleFaqEntry[];
  references?: Array<string | ModuleReference>;
  // Per-module glossary (schema 1.1.0+). Merged with the global glossary at
  // render time; module entries override global entries with the same term.
  glossary?: GlossaryEntry[];
  // Calculator ids (from src/bubbles/_calculators/registry.ts CALCULATORS[].id)
  // that are most relevant to this module — surfaced first in the
  // clinical-tools bubble's calculator list when the module is in focus.
  // Recognized today: 'gad7', 'phq9', 'audit-c', 'ciwa-ar', 'cows',
  // 'prevent-calculator'.
  recommended_calculators?: string[];
  // Consult paths (schema 1.2.0+). Drives the consult-builder bubble's
  // catalog and the decorateConsultMentions auto-link decorator. Modules
  // that omit `consults` get no auto-spawn and no consult anchors.
  consults?: ConsultPath[];
  // Module-level SmartPhrase registry (schema 1.3.0+). One entry per
  // SmartPhrase referenced anywhere in the module (green_zone, FAQ
  // entries, or future hooks). Future phrases live here even before they
  // have homes so they aren't lost on the next pass.
  smartphrases?: ModuleSmartPhrase[];
}

// ─── Controlled-substances contract builder (Track 4d) ─────────────────
// Top-level seed library at src/data/seed/controlled-substances-contracts.json
// is the source of truth for clause text (Section 6 versioning). The builder
// bubble assembles a contract by filtering clauses against provider inputs
// (substance class, state, risk tier, situational flags). Conditions are
// declarative so clause text never embeds selection logic.

export type CsSubstanceClass = 'opioid' | 'benzo' | 'stimulant' | 'multi-class';
export type CsState = 'NY' | 'NJ';
export type CsRiskTier = 'standard' | 'enhanced' | 'high-risk';

// A clause is included when `condition` is null (always) or the named input
// field equals `eq` / is one of `in`.
export interface CsContractCondition {
  field: string;
  eq?: string | boolean;
  in?: string[];
}

export interface CsContractClause {
  clause_id: string;
  section: string;
  type: 'fixed' | 'variable';
  condition: CsContractCondition | null;
  text: string;             // NY / default clause text
  text_NJ?: string;         // NJ override when wording differs (omit if identical)
  authority: string;
  proposed_institutional_standard: boolean;  // true = no national mandate
}

export interface CsContractSection {
  section_id: string;
  title: string;
  order: number;
  clauses: CsContractClause[];
}

export interface CsContractChangeLogEntry {
  version: string;
  date: string;
  author: string;
  summary: string;
}

export interface CsContractLibrary {
  schema_version: string;
  title: string;
  org: string;
  scope: string;
  change_log: CsContractChangeLogEntry[];
  next_review_offset_months: Record<CsRiskTier, number>;
  class_codes: Record<CsSubstanceClass, string>;
  tier_codes: Record<CsRiskTier, string>;
  class_labels: Record<CsSubstanceClass, string>;
  module_class_map: Record<string, CsSubstanceClass>;
  sections: CsContractSection[];
}

// Provider-collected inputs (schema Section 1.2). Drives tier auto-suggestion
// and clause selection.
export interface CsContractInputs {
  substance_class: CsSubstanceClass;
  state: CsState;
  risk_tier: CsRiskTier;
  sud_history: 'none' | 'past' | 'active';
  concurrent_cs: 'none' | 'same-class' | 'cross-class';
  combo_opioid_benzo: boolean;
  age_65_plus: boolean;
  dose_above_threshold: boolean;
  early_fill_history: boolean;
  driving_or_safety_sensitive: boolean;
  prior_lost_medication: boolean;
  indication_status: 'established' | 'inherited-presumptive' | 'none-pending-assessment';
  naloxone_indicated: boolean;
  specialist_involved: boolean;
}

export interface Bubble<P = unknown> {
  id: string;
  type: BubblePrimitiveType;
  mount(host: HTMLElement, ctx: BubbleCtx<P>): void;
  unmount(): void;
  applyResize(size: SizeKey, state: ResizeState): void;
  onSearch?(query: string): void;
  onAttach?(target: { cellId: string; slot: 'organelle' | 'nucleus' }): void;
  onDetach?(): void;
  serialize(): BubbleInstance;
}

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
  | 'mentorship-role-selector'
  | 'mentorship-exec-overview'
  | 'mentorship-matrix'
  | 'mentorship-mentees-list'
  | 'mentorship-mentee-overview'
  | 'mentorship-phase-tabs'
  | 'mentorship-phase-checklist'
  | 'mentorship-phase-notes'
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

export interface ModuleFaqEntry {
  faq_id: string;
  topic: string;
  title: string;
  referenced_by?: string[];
  items: ModuleFaqQA[];
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
  references?: string[];
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

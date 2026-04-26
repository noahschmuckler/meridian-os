// Default labels per primitive type. Used by:
//   - the auto-namer when a bubble is attached without a custom title
//   - the vault to render the type-tile labels
//   - the file system to label a file's underlying type
//
// Source of truth: keep in sync with BubblePrimitiveType in src/types.ts.
// Future: when each primitive carries a richer manifest (prompts, tools,
// companions), this table gets folded into that manifest. Today it's the
// only manifest field anything reads.

import type { BubblePrimitiveType } from '../types';

export const PRIMITIVE_LABELS: Record<BubblePrimitiveType, string> = {
  'llm-chat': 'Chat',
  'brain-bubble': 'Brain',
  'blueprint-tree': 'Blueprint',
  'follow-ups-rail': 'Follow-ups',
  'generated-sessions-rail': 'Generated sessions',
  'dropzone': 'Dropzone',
  'patient-info': 'Patient info',
  'modules-stack': 'Modules',
  'openevidence-builder': 'OpenEvidence',
  'smartphrase-directory': 'SmartPhrases',
  'glidepath-chart': 'Glidepath',
  'email-threads-tracker': 'Email threads',
  'meeting-tracker': 'Meetings',
  'provider-dossier': 'Provider',
  'care-gap-accumulator': 'Care gaps',
  'status-pill-grid': 'Status',
  'faq-block': 'FAQ',
  'questionnaire': 'Questionnaire',
  'exports-panel': 'Exports',
  'dashboard-numbers': 'Dashboard',
  'markdown': 'Markdown',
  'spreadsheet': 'Spreadsheet',
  'email-thread': 'Email thread',
  'manual-control-search': 'Search',
  'placeholder': 'Empty slot',
};

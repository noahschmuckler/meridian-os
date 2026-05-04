// Build pre-filled fields for the openevidence-builder bubble from the
// active clinical-modules focus + a selected text snippet. Adapted from
// meridian-server/index.html:6607-6650 (buildOEPreprompt).
//
// Output shape matches the openevidence-builder's existing form fields so a
// caller can spawn the bubble with `prefilledTopic` + `prefilledContext` +
// (optionally) `prefilledQuestionType` and the user lands on a primed
// query they can refine before hitting "Copy for OpenEvidence".

import type { ModuleData } from '../types';

export interface OEQueryPrefill {
  topic: string;
  context: string;
  questionType?: 'risk' | 'treatment' | 'diagnostic' | 'prognosis' | 'screening';
}

export interface OEQuerySource {
  selectedText?: string | null;
  module?: ModuleData | null;
  faqTopic?: string | null;
}

export function buildOEPrefill(src: OEQuerySource): OEQueryPrefill {
  const moduleName = src.module?.default_title?.split(' — ')[0] ?? null;
  const selected = (src.selectedText ?? '').trim();

  // Topic = a short tag describing the area of inquiry. Module name +
  // optional FAQ topic gives the OE search enough scaffolding to scope.
  const topicParts: string[] = [];
  if (moduleName) topicParts.push(moduleName);
  if (src.faqTopic) topicParts.push(src.faqTopic);
  const topic = topicParts.join(' · ');

  // Context = the actual claim or sentence the user is asking about. If
  // the user selected text, that's the question seed; otherwise leave
  // blank so the user types their own.
  const context = selected;

  return { topic, context };
}

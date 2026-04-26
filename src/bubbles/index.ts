// Primitive registry. Phase 0: every primitive resolves to StubBubble (just renders type + title).
// As primitives get real implementations, move them to their own folder and update the registry entry.

import { StubBubble } from './_base/Bubble';
import type { Bubble, BubbleInstance, BubblePrimitiveType } from '../types';

export type BubbleConstructor = (instance: BubbleInstance) => Bubble;

const stub: BubbleConstructor = (instance) => new StubBubble(instance);

export const PRIMITIVE_REGISTRY: Record<BubblePrimitiveType, BubbleConstructor> = {
  'llm-chat': stub,
  'brain-bubble': stub,
  'blueprint-tree': stub,
  'follow-ups-rail': stub,
  'generated-sessions-rail': stub,
  'dropzone': stub,
  'patient-info': stub,
  'modules-stack': stub,
  'openevidence-builder': stub,
  'smartphrase-directory': stub,
  'glidepath-chart': stub,
  'email-threads-tracker': stub,
  'meeting-tracker': stub,
  'provider-dossier': stub,
  'care-gap-accumulator': stub,
  'status-pill-grid': stub,
  'faq-block': stub,
  'questionnaire': stub,
  'exports-panel': stub,
  'dashboard-numbers': stub,
  'markdown': stub,
  'spreadsheet': stub,
  'email-thread': stub,
  'manual-control-search': stub,
};

export function constructBubble(instance: BubbleInstance): Bubble {
  const ctor = PRIMITIVE_REGISTRY[instance.type];
  if (!ctor) throw new Error(`unknown primitive type: ${instance.type}`);
  return ctor(instance);
}

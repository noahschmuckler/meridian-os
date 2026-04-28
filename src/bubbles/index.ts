// Primitive registry. Maps each BubblePrimitiveType to a Preact component.
// Phase 1: 5 primitives have real implementations; the rest fall through to StubBubble.

import type { ComponentType } from 'preact';
import type { BubbleInstance, BubblePrimitiveType } from '../types';
import type { SeedDict } from '../data/seedResolver';

import { StubBubble } from './_base/StubBubble';
import { BlueprintTree } from './blueprint-tree';
import { FollowUpsRail } from './follow-ups-rail';
import { GeneratedSessionsRail } from './generated-sessions-rail';
import { Dropzone } from './dropzone';
import { ProviderDossier } from './provider-dossier';
import { Placeholder } from './placeholder';
import { LlmChat } from './llm-chat';
import { Markdown } from './markdown';
import { ClinicalModuleChecklist } from './clinical-module-checklist';
import { ClinicalModuleEscalations } from './clinical-module-escalations';
import { ClinicalModuleFaq } from './clinical-module-faq';
import { ClinicalTopicBubble } from './clinical-topic-bubble';
import { ClinicalTools } from './clinical-tools';
import { OpenEvidenceBuilder } from './openevidence-builder';
import { PreventCalculator } from './prevent-calculator';
import { MentorshipRoleSelector } from './mentorship-role-selector';

export interface BubbleProps {
  instance: BubbleInstance;
  seeds: SeedDict;
}

const REGISTRY: Partial<Record<BubblePrimitiveType, ComponentType<BubbleProps>>> = {
  'blueprint-tree': BlueprintTree,
  'follow-ups-rail': FollowUpsRail,
  'generated-sessions-rail': GeneratedSessionsRail,
  'dropzone': Dropzone,
  'provider-dossier': ProviderDossier,
  'placeholder': Placeholder,
  'llm-chat': LlmChat,
  'markdown': Markdown,
  'clinical-module-checklist': ClinicalModuleChecklist as ComponentType<BubbleProps>,
  'clinical-module-escalations': ClinicalModuleEscalations as ComponentType<BubbleProps>,
  'clinical-module-faq': ClinicalModuleFaq as ComponentType<BubbleProps>,
  'clinical-topic-cv': ClinicalTopicBubble as ComponentType<BubbleProps>,
  'clinical-topic-controlled': ClinicalTopicBubble as ComponentType<BubbleProps>,
  'clinical-topic-general': ClinicalTopicBubble as ComponentType<BubbleProps>,
  'clinical-tools': ClinicalTools as ComponentType<BubbleProps>,
  'openevidence-builder': OpenEvidenceBuilder as ComponentType<BubbleProps>,
  'prevent-calculator': PreventCalculator as ComponentType<BubbleProps>,
  'mentorship-role-selector': MentorshipRoleSelector as ComponentType<BubbleProps>,
};

export function getPrimitiveComponent(type: BubblePrimitiveType): ComponentType<BubbleProps> {
  return REGISTRY[type] ?? StubBubble;
}

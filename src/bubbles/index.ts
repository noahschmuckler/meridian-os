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
};

export function getPrimitiveComponent(type: BubblePrimitiveType): ComponentType<BubbleProps> {
  return REGISTRY[type] ?? StubBubble;
}

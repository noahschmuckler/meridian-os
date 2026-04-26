// Portal host for FLIP morphs. Phase 0: pass-through; Phase 2 will add the morph orchestration.

import type { ComponentChildren, JSX } from 'preact';

export function TransitionStage({ children }: { children: ComponentChildren }): JSX.Element {
  return <div class="transition-stage" style={{ width: '100%', height: '100%' }}>{children}</div>;
}

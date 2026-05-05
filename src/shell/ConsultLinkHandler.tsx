// App-level click handler for [data-consult] anchors. Mounted once next to
// SelectionMenu / GlossaryPopover. Capture-phase document click listener
// finds the closest .consult-link, reads its consult_id, and dispatches
// `meridian:spawn-bubble` to land a consult-builder bubble adjacent to the
// source. Mirrors GlossaryPopover's click capture pattern, but without an
// intermediate popover — clicking goes straight to the builder.

import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import { activeWorkspaceIdSignal } from '../data/workspaceNav';

export function ConsultLinkHandler(): JSX.Element | null {
  useEffect(() => {
    function onClick(e: MouseEvent): void {
      const target = e.target as Element | null;
      if (!target) return;
      const link = target.closest('.consult-link') as HTMLElement | null;
      if (!link) return;
      const consultId = link.dataset.consult;
      if (!consultId) return;
      e.stopPropagation();
      e.preventDefault();
      const bubbleEl = link.closest('[data-bubble-id]') as HTMLElement | null;
      const nearBubbleId = bubbleEl?.dataset.bubbleId;
      window.dispatchEvent(new CustomEvent('meridian:spawn-bubble', {
        detail: {
          workspaceId: activeWorkspaceIdSignal.value ?? undefined,
          spec: {
            type: 'consult-builder',
            title: 'Consult builder',
            props: { initialConsultId: consultId },
            nearBubbleId,
          },
        },
      }));
    }
    function onKey(e: KeyboardEvent): void {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const target = e.target as HTMLElement | null;
      if (!target?.classList.contains('consult-link')) return;
      e.preventDefault();
      const consultId = target.dataset.consult;
      if (!consultId) return;
      const bubbleEl = target.closest('[data-bubble-id]') as HTMLElement | null;
      const nearBubbleId = bubbleEl?.dataset.bubbleId;
      window.dispatchEvent(new CustomEvent('meridian:spawn-bubble', {
        detail: {
          workspaceId: activeWorkspaceIdSignal.value ?? undefined,
          spec: {
            type: 'consult-builder',
            title: 'Consult builder',
            props: { initialConsultId: consultId },
            nearBubbleId,
          },
        },
      }));
    }
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  return null;
}

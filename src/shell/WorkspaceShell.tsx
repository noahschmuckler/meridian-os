import { useEffect, useRef } from 'preact/hooks';
import type { JSX } from 'preact';
import type { WorkspaceConfig } from '../types';
import { BspWorkspace } from './BspWorkspace';
import type { SeedDict } from '../data/seedResolver';

interface WorkspaceShellProps {
  workspace: WorkspaceConfig;
  seeds: SeedDict;
  onBackToHome: () => void;
  entryFrom: DOMRect | null;
}

const TRANSITION_MS = 480;
const TRANSITION_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Animate from tile rect to fullscreen on mount, and back to tile on
// dismiss. The wrapper carries the entire workspace (BSP + back pill) so
// it flies as one unit — bubbles scale together, preserving the recognizable
// preview layout you saw on the home tile.
export function WorkspaceShell({ workspace, seeds, onBackToHome, entryFrom }: WorkspaceShellProps): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || !entryFrom) return;
    const target = el.getBoundingClientRect();
    if (target.width === 0 || target.height === 0) return;
    const dx = entryFrom.left + entryFrom.width / 2 - (target.left + target.width / 2);
    const dy = entryFrom.top + entryFrom.height / 2 - (target.top + target.height / 2);
    const sx = entryFrom.width / target.width;
    const sy = entryFrom.height / target.height;
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.45, filter: 'blur(2px)' },
        { transform: 'translate(0, 0) scale(1, 1)', opacity: 1, filter: 'blur(0px)' },
      ],
      { duration: TRANSITION_MS, easing: TRANSITION_EASING, fill: 'both' },
    );
  }, [workspace.id, entryFrom]);

  function handleBack(): void {
    const el = wrapperRef.current;
    if (!el || !entryFrom) {
      onBackToHome();
      return;
    }
    const target = el.getBoundingClientRect();
    const dx = entryFrom.left + entryFrom.width / 2 - (target.left + target.width / 2);
    const dy = entryFrom.top + entryFrom.height / 2 - (target.top + target.height / 2);
    const sx = entryFrom.width / target.width;
    const sy = entryFrom.height / target.height;
    const anim = el.animate(
      [
        { transform: 'translate(0, 0) scale(1, 1)', opacity: 1, filter: 'blur(0px)' },
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.4, filter: 'blur(2px)' },
      ],
      { duration: TRANSITION_MS, easing: TRANSITION_EASING, fill: 'both' },
    );
    anim.onfinish = () => onBackToHome();
    // Safety: if onfinish never fires (page hide, etc.), still dismiss after a beat.
    window.setTimeout(() => onBackToHome(), TRANSITION_MS + 80);
  }

  return (
    <div ref={wrapperRef} class="workspace-shell" style={{ position: 'fixed', inset: 0, transformOrigin: 'center center' }}>
      <BspWorkspace workspace={workspace} seeds={seeds} onBackToHome={handleBack} />
    </div>
  );
}

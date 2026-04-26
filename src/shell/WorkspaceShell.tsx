import { useEffect, useRef, useState } from 'preact/hooks';
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

type Phase = 'entering' | 'idle' | 'exiting';

// Animate from tile rect to fullscreen on mount, and back on dismiss. While
// transitioning, the wrapper carries an is-entering / is-exiting class that
// CSS picks up to crossfade each bubble between "tile mode" (full color
// block, content hidden) and "workspace mode" (5px top stripe, content
// visible).
export function WorkspaceShell({ workspace, seeds, onBackToHome, entryFrom }: WorkspaceShellProps): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('entering');

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || !entryFrom) {
      setPhase('idle');
      return;
    }
    const target = el.getBoundingClientRect();
    if (target.width === 0 || target.height === 0) {
      setPhase('idle');
      return;
    }
    const dx = entryFrom.left + entryFrom.width / 2 - (target.left + target.width / 2);
    const dy = entryFrom.top + entryFrom.height / 2 - (target.top + target.height / 2);
    const sx = entryFrom.width / target.width;
    const sy = entryFrom.height / target.height;
    const anim = el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.6, filter: 'blur(2px)' },
        { transform: 'translate(0, 0) scale(1, 1)', opacity: 1, filter: 'blur(0px)' },
      ],
      { duration: TRANSITION_MS, easing: TRANSITION_EASING, fill: 'both' },
    );
    anim.onfinish = () => setPhase('idle');
    window.setTimeout(() => setPhase('idle'), TRANSITION_MS + 80);
  }, [workspace.id, entryFrom]);

  function handleBack(): void {
    const el = wrapperRef.current;
    if (!el || !entryFrom) {
      onBackToHome();
      return;
    }
    setPhase('exiting');
    const target = el.getBoundingClientRect();
    const dx = entryFrom.left + entryFrom.width / 2 - (target.left + target.width / 2);
    const dy = entryFrom.top + entryFrom.height / 2 - (target.top + target.height / 2);
    const sx = entryFrom.width / target.width;
    const sy = entryFrom.height / target.height;
    const anim = el.animate(
      [
        { transform: 'translate(0, 0) scale(1, 1)', opacity: 1, filter: 'blur(0px)' },
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.6, filter: 'blur(2px)' },
      ],
      { duration: TRANSITION_MS, easing: TRANSITION_EASING, fill: 'both' },
    );
    anim.onfinish = () => onBackToHome();
    window.setTimeout(() => onBackToHome(), TRANSITION_MS + 80);
  }

  const phaseClass =
    phase === 'entering' ? ' is-entering' : phase === 'exiting' ? ' is-exiting' : '';

  return (
    <div
      ref={wrapperRef}
      class={`workspace-shell${phaseClass}`}
      style={{ position: 'fixed', inset: 0, transformOrigin: 'center center' }}
    >
      <BspWorkspace workspace={workspace} seeds={seeds} onBackToHome={handleBack} />
    </div>
  );
}

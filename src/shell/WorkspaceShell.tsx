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

// Animate from tile rect to fullscreen on mount: "flying up" from the home grid
// to land on the screen plane. Uses Web Animations API on the outer wrapper so
// the entire workspace (BSP + back button) flies as one unit.
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
      { duration: 480, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' },
    );
  }, [workspace.id, entryFrom]);

  return (
    <div ref={wrapperRef} class="workspace-shell" style={{ position: 'fixed', inset: 0, transformOrigin: 'center center' }}>
      <BspWorkspace workspace={workspace} seeds={seeds} />
      <button
        onClick={onBackToHome}
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 200,
          padding: '6px 12px',
          borderRadius: 999,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          fontSize: 12,
        }}
      >
        ← Home · {workspace.title}
      </button>
    </div>
  );
}

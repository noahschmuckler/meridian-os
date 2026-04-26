import { useEffect, useMemo, useRef } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance, GridPlacement, WorkspaceConfig } from '../types';
import { Cell } from '../cell/Cell';
import { StubBubble } from '../bubbles/_base/Bubble';
import type { SeedDict } from '../data/seedResolver';
import { resolveSeedTokens } from '../data/seedResolver';

interface WorkspaceShellProps {
  workspace: WorkspaceConfig;
  seeds: SeedDict;
  onBackToHome: () => void;
}

function gridStyle(p: GridPlacement): JSX.CSSProperties {
  return {
    gridColumn: `${p.col + 1} / span ${p.width}`,
    gridRow: `${p.row + 1} / span ${p.height}`,
  };
}

export function WorkspaceShell({ workspace, seeds, onBackToHome }: WorkspaceShellProps): JSX.Element {
  const grid = workspace.layoutHints.grid;
  const placements = workspace.layoutHints.placements;

  // Resolve seed tokens once per render of the workspace.
  const resolvedStandalones = useMemo<BubbleInstance[]>(
    () => workspace.standalones.map((b) => ({ ...b, props: resolveSeedTokens(b.props, seeds) })),
    [workspace, seeds],
  );

  return (
    <div
      class="workspace"
      style={{
        position: 'fixed',
        inset: 0,
        padding: 'var(--gap)',
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
        gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        gap: 'var(--gap)',
        background: 'var(--bg)',
      }}
    >
      <button
        onClick={onBackToHome}
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 10,
          padding: '6px 12px',
          borderRadius: 999,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          fontSize: 12,
        }}
      >
        ← Home · {workspace.title}
      </button>

      {workspace.cells.map((cell) => {
        const p = placements[cell.id];
        if (!p) return null;
        return (
          <div key={cell.id} style={gridStyle(p)}>
            <Cell cell={cell} workspace={workspace} seeds={seeds} />
          </div>
        );
      })}

      {resolvedStandalones.map((b) => {
        const p = placements[b.id];
        if (!p) return null;
        return (
          <div key={b.id} class="bubble" style={gridStyle(p)}>
            <BubbleHost instance={b} />
          </div>
        );
      })}
    </div>
  );
}

function BubbleHost({ instance }: { instance: BubbleInstance }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const bubble = new StubBubble(instance);
    bubble.mount(ref.current, {
      instance,
      props: instance.props,
      seed: {},
      emit: () => {},
    });
    return () => bubble.unmount();
  }, [instance.id]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}

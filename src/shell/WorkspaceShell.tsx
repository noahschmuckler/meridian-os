import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance, GridPlacement, WorkspaceConfig } from '../types';
import { Cell } from '../cell/Cell';
import { getPrimitiveComponent } from '../bubbles';
import type { SeedDict } from '../data/seedResolver';
import { resolveSeedTokens } from '../data/seedResolver';
import { DraggableBubble } from '../mechanics/DraggableBubble';

interface WorkspaceShellProps {
  workspace: WorkspaceConfig;
  seeds: SeedDict;
  onBackToHome: () => void;
}

export function WorkspaceShell({ workspace, seeds, onBackToHome }: WorkspaceShellProps): JSX.Element {
  const grid = workspace.layoutHints.grid;
  const containerRef = useRef<HTMLDivElement>(null);

  const [placements, setPlacements] = useState<Record<string, GridPlacement>>(workspace.layoutHints.placements);
  useEffect(() => {
    setPlacements(workspace.layoutHints.placements);
  }, [workspace.id]);

  const updatePlacement = (id: string) => (next: GridPlacement) => {
    setPlacements((prev) => ({ ...prev, [id]: next }));
  };

  const resolvedStandalones = useMemo<BubbleInstance[]>(
    () => workspace.standalones.map((b) => ({ ...b, props: resolveSeedTokens(b.props, seeds) })),
    [workspace, seeds],
  );

  return (
    <div
      ref={containerRef}
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

      {workspace.cells.map((cell) => {
        const p = placements[cell.id];
        if (!p) return null;
        return (
          <DraggableBubble
            key={cell.id}
            placement={p}
            gridCols={grid.cols}
            gridRows={grid.rows}
            containerRef={containerRef}
            onChange={updatePlacement(cell.id)}
            className="cell"
            minWidth={3}
            minHeight={3}
          >
            <Cell cell={cell} workspace={workspace} seeds={seeds} />
          </DraggableBubble>
        );
      })}

      {resolvedStandalones.map((b) => {
        const p = placements[b.id];
        if (!p) return null;
        const Comp = getPrimitiveComponent(b.type);
        return (
          <DraggableBubble
            key={b.id}
            placement={p}
            gridCols={grid.cols}
            gridRows={grid.rows}
            containerRef={containerRef}
            onChange={updatePlacement(b.id)}
            className="bubble"
          >
            <Comp instance={b} seeds={seeds} />
          </DraggableBubble>
        );
      })}
    </div>
  );
}

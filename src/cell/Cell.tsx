import type { JSX } from 'preact';
import type { BubbleInstance, CellConfig, WorkspaceConfig } from '../types';
import { BrainBubble } from './BrainBubble';
import { getPrimitiveComponent } from '../bubbles';
import { resolveSeedTokens } from '../data/seedResolver';
import type { SeedDict } from '../data/seedResolver';

interface CellProps {
  cell: CellConfig;
  workspace: WorkspaceConfig;
  seeds: SeedDict;
}

// NOTE: Cell is no longer used by the trainer workspace (chat is now a peer
// bubble). Kept around for any future workspace that genuinely wants the
// nucleus-organelles framing.
export function Cell({ cell, workspace: _workspace, seeds }: CellProps): JSX.Element {
  const organelles: BubbleInstance[] = cell.organelles.map((b) => ({
    ...b,
    props: resolveSeedTokens(b.props, seeds),
  }));

  return (
    <div class="cell-inner" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
      <BrainBubble brain={cell.brain} />
      <div class="cell-organelles" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
        {organelles.map((b) => {
          const Comp = getPrimitiveComponent(b.type);
          return (
            <div key={b.id} class="cell-organelle bubble" style={{ flex: 1, minHeight: 0 }}>
              <Comp instance={b} seeds={seeds} />
            </div>
          );
        })}
      </div>
      <div class="cell-chat-stub">
        <span class="cell-chat-stub__lbl">{cell.nucleus.props.greeting ?? 'ask anything'}</span>
        <span class="cell-chat-stub__hint">scripted in v1</span>
      </div>
    </div>
  );
}

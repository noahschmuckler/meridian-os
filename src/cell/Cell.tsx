import { useEffect, useRef } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance, CellConfig, WorkspaceConfig } from '../types';
import { BrainBubble } from './BrainBubble';
import { ChatBubble } from './ChatBubble';
import { StubBubble } from '../bubbles/_base/Bubble';
import type { SeedDict } from '../data/seedResolver';

interface CellProps {
  cell: CellConfig;
  workspace: WorkspaceConfig;
  seeds: SeedDict;
}

export function Cell({ cell, workspace, seeds: _seeds }: CellProps): JSX.Element {
  const organelleInstances = cell.organelles
    .map((id) => workspace.standalones.find((b) => b.id === id))
    // Organelles can also be defined inline elsewhere; for Phase 0 we only resolve
    // bubbles whose ids were declared as standalone-but-attached. If not found, skip.
    .filter((b): b is BubbleInstance => Boolean(b));

  return (
    <div class="cell" style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto 1fr', height: '100%' }}>
      <div style={{ gridColumn: '1 / -1' }}>
        <ChatBubble props={cell.nucleus.props} />
        <BrainBubble brain={cell.brain} />
      </div>
      <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--gap)' }}>
        {organelleInstances.length === 0 ? (
          <div style={{ color: 'var(--ink-faint)', fontSize: 12, padding: 8 }}>
            no organelles attached (Phase 0)
          </div>
        ) : (
          organelleInstances.map((b) => <OrganelleHost key={b.id} instance={b} />)
        )}
      </div>
    </div>
  );
}

function OrganelleHost({ instance }: { instance: BubbleInstance }): JSX.Element {
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

  return <div class="bubble" ref={ref} style={{ width: '100%', minHeight: 80 }} />;
}

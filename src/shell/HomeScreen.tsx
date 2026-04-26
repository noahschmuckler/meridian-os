import { useRef } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubblePrimitiveType, HomeConfig, WorkspaceConfig } from '../types';
import { getWorkspacePreview, type PreviewBubble } from './workspaceState';

interface HomeScreenProps {
  home: HomeConfig;
  workspaces: Record<string, WorkspaceConfig>;
  activeWorkspaceId: string | null;
  onTapWorkspace: (id: string, fromRect: DOMRect) => void;
}

export function HomeScreen({ home, workspaces, activeWorkspaceId, onTapWorkspace }: HomeScreenProps): JSX.Element {
  const desktop = home.desktops[home.active] ?? home.desktops[0];
  const tileRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  return (
    <div class="home">
      <div class="home__perspective">
        <div class="home__grid" style={{ gridTemplateColumns: `repeat(${desktop.grid.cols}, 1fr)` }}>
          {desktop.icons.map((icon) => {
            const ws = workspaces[icon.workspaceId];
            if (!ws) return null;
            const greyed = ws.id === activeWorkspaceId;
            const preview = getWorkspacePreview(ws);
            return (
              <button
                key={ws.id}
                ref={(el) => {
                  if (el) tileRefs.current.set(ws.id, el);
                  else tileRefs.current.delete(ws.id);
                }}
                class={`home__tile${greyed ? ' is-greyed' : ''}`}
                style={{ '--tint': ws.icon.tint } as JSX.CSSProperties}
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  onTapWorkspace(ws.id, rect);
                }}
                data-workspace-id={ws.id}
              >
                <div class="home__tile-title">
                  <span class="home__tile-glyph">{ws.icon.glyph}</span>
                  <span class="home__tile-label">{ws.title}</span>
                </div>
                <div class="home__tile-preview">
                  {preview.bubbles.length === 0 ? (
                    <span class="home__tile-empty">empty</span>
                  ) : (
                    preview.bubbles.map((b) => (
                      <PreviewBubbleEl key={b.id} bubble={b} grid={preview.grid} />
                    ))
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PreviewBubbleEl({ bubble, grid }: { bubble: PreviewBubble; grid: { cols: number; rows: number } }): JSX.Element {
  const left = (bubble.region.col / grid.cols) * 100;
  const top = (bubble.region.row / grid.rows) * 100;
  const width = (bubble.region.width / grid.cols) * 100;
  const height = (bubble.region.height / grid.rows) * 100;
  return (
    <div
      class={`home__tile-bubble home__tile-bubble--${bubble.type}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
      title={bubble.title ?? bubble.type}
    />
  );
}

// Re-export type signature so main.tsx imports stay simple.
export type { BubblePrimitiveType };

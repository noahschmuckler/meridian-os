import type { JSX } from 'preact';
import type { HomeConfig, WorkspaceConfig } from '../types';

interface HomeScreenProps {
  home: HomeConfig;
  workspaces: Record<string, WorkspaceConfig>;
  activeWorkspaceId: string | null;
  onTapWorkspace: (id: string) => void;
}

export function HomeScreen({ home, workspaces, activeWorkspaceId, onTapWorkspace }: HomeScreenProps): JSX.Element {
  const desktop = home.desktops[home.active] ?? home.desktops[0];

  return (
    <div class="home">
      <div class="home__grid" style={{ gridTemplateColumns: `repeat(${desktop.grid.cols}, 1fr)` }}>
        {desktop.icons.map((icon) => {
          const ws = workspaces[icon.workspaceId];
          if (!ws) return null;
          const greyed = ws.id === activeWorkspaceId;
          return (
            <button
              key={ws.id}
              class={`home__tile${greyed ? ' is-greyed' : ''}`}
              style={{ '--tint': ws.icon.tint } as JSX.CSSProperties}
              onClick={() => onTapWorkspace(ws.id)}
              data-workspace-id={ws.id}
            >
              <span class="home__tile-glyph">{ws.icon.glyph}</span>
              <span class="home__tile-label">{ws.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

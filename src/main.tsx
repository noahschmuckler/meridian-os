import { render } from 'preact';
import { signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import './styles/reset.css';
import './styles/tokens.css';
import './styles/glass.css';

import type { HomeConfig, WorkspaceConfig } from './types';
import { HomeScreen } from './shell/HomeScreen';
import { WorkspaceShell } from './shell/WorkspaceShell';
import { loadSeeds } from './data/seedResolver';
import type { SeedDict } from './data/seedResolver';

import homeConfigJson from './data/home.json';
import trainerWs from './data/workspaces/trainer.json';
import patelSeed from './data/seed/patel-cohort.json';

const home = homeConfigJson as HomeConfig;

// Track the visualViewport height so iOS keyboard appearance shrinks the
// workspace's effective height instead of pushing content under the keys.
function useVisualViewport(): void {
  useEffect(() => {
    const vv = window.visualViewport;
    function set(h: number): void {
      document.documentElement.style.setProperty('--vh', `${h}px`);
    }
    if (!vv) {
      set(window.innerHeight);
      return;
    }
    const update = (): void => set(vv.height);
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);
}

// Phase 0: only the trainer workspace is hand-authored. Stub the others as title-only placeholders
// so the home screen renders with all five tiles and tapping any of them lands somewhere.
const stubWorkspace = (id: string, title: string, glyph: string, tint: string): WorkspaceConfig => ({
  id,
  title,
  icon: { glyph, tint },
  cells: [],
  standalones: [],
  layoutHints: { grid: { cols: 12, rows: 8 }, placements: {} },
  scripted: { onMount: [], onSearch: {}, onDrop: {} },
  seed: { sources: [] },
});

const workspaces: Record<string, WorkspaceConfig> = {
  trainer: trainerWs as WorkspaceConfig,
  provider: stubWorkspace('provider', 'Provider', '🩺', '#0F6B42'),
  'qi-statin': stubWorkspace('qi-statin', 'QI · Statin', '📊', '#B45309'),
  'provider-file': stubWorkspace('provider-file', 'Provider File', '📁', '#5B4FBF'),
  'admin-cockpit': stubWorkspace('admin-cockpit', 'Admin Cockpit', '🛰', '#1F4E79'),
};

const seeds: SeedDict = loadSeeds({ patel: patelSeed });

const activeWorkspaceId = signal<string | null>(null);
const entryFrom = signal<DOMRect | null>(null);

function App(): JSX.Element {
  useVisualViewport();
  const id = activeWorkspaceId.value;
  // HomeScreen is always rendered. The WorkspaceShell mounts on top of it
  // when a workspace is active. During the fly-back animation, the home
  // behind becomes progressively visible as the workspace shrinks, so by
  // the time the workspace unmounts there's nothing to "appear" — the tile
  // is already in place underneath. No snap on landing.
  return (
    <>
      <HomeScreen
        home={home}
        workspaces={workspaces}
        activeWorkspaceId={id}
        onTapWorkspace={(wid, rect) => {
          // Block while a workspace is already active (mid-transition or
          // settled). User must dismiss before tapping another tile.
          if (activeWorkspaceId.value) return;
          entryFrom.value = rect;
          activeWorkspaceId.value = wid;
        }}
      />
      {id && workspaces[id] && (
        <WorkspaceShell
          workspace={workspaces[id]}
          seeds={seeds}
          entryFrom={entryFrom.value}
          onBackToHome={() => {
            activeWorkspaceId.value = null;
          }}
        />
      )}
    </>
  );
}

render(<App />, document.getElementById('app')!);

import { render } from 'preact';
import { signal } from '@preact/signals';
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
  const id = activeWorkspaceId.value;
  if (id && workspaces[id]) {
    return (
      <WorkspaceShell
        workspace={workspaces[id]}
        seeds={seeds}
        entryFrom={entryFrom.value}
        onBackToHome={() => {
          activeWorkspaceId.value = null;
          entryFrom.value = null;
        }}
      />
    );
  }
  return (
    <HomeScreen
      home={home}
      workspaces={workspaces}
      activeWorkspaceId={id}
      onTapWorkspace={(wid, rect) => {
        entryFrom.value = rect;
        activeWorkspaceId.value = wid;
      }}
    />
  );
}

render(<App />, document.getElementById('app')!);

import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import './styles/reset.css';
import './styles/tokens.css';
import './styles/glass.css';

import type { HomeConfig, ModuleData, WorkspaceConfig } from './types';
import { HomeScreen } from './shell/HomeScreen';
import { WorkspaceShell } from './shell/WorkspaceShell';
import { PrintView } from './shell/PrintView';
import { Launcher, BackToLauncherChevron, HomeViewTogglePill } from './shell/Launcher';
import { MentorshipTrackerShell } from './shell/MentorshipTrackerShell';
import { loadSeeds } from './data/seedResolver';
import type { SeedDict } from './data/seedResolver';
import { activeWorkspaceIdSignal, entryFromSignal } from './data/workspaceNav';
import { launcherAppSignal } from './data/launcherState';
import { mondrianHomeViewSignal } from './data/mondrianHomeView';
import { clearTrainerProviderContext } from './data/trainerProviderContext';

import homeConfigJson from './data/home.json';
import trainerWs from './data/workspaces/trainer.json';
import clinicalModulesWs from './data/workspaces/clinical-modules.json';
import mentorshipWs from './data/workspaces/mentorship.json';
import patelSeed from './data/seed/patel-cohort.json';
import clinicalModulesSeed from './data/seed/clinical-modules.json';

const home = homeConfigJson as HomeConfig;

// Phase 1 production landing: a single Clinical Modules tile in the same
// physical slot it occupies in the archive grid (top row, middle). The
// archive view (full 6-tile grid) is reachable via the bottom-left pill.
const focusedHome: HomeConfig = {
  active: 0,
  desktops: [
    {
      id: 'focused',
      grid: { cols: 3, rows: 2 },
      icons: [{ workspaceId: 'clinical-modules', pos: [1, 0] }],
    },
  ],
};

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
  'clinical-modules': clinicalModulesWs as WorkspaceConfig,
  mentorship: mentorshipWs as WorkspaceConfig,
  provider: stubWorkspace('provider', 'Provider', '🩺', '#0F6B42'),
  'qi-statin': stubWorkspace('qi-statin', 'QI · Statin', '📊', '#B45309'),
  'admin-cockpit': stubWorkspace('admin-cockpit', 'Admin Cockpit', '🛰', '#1F4E79'),
};

const seeds: SeedDict = loadSeeds({ patel: patelSeed, clinical: clinicalModulesSeed });
const clinicalModules = (
  ((clinicalModulesSeed as { clinical?: { modules?: ModuleData[] } }).clinical?.modules) ?? []
);

function App(): JSX.Element {
  useVisualViewport();
  const app = launcherAppSignal.value;

  if (app === 'launcher') {
    return <Launcher />;
  }

  if (app === 'mentorship') {
    return <MentorshipTrackerShell />;
  }

  // Mondrian GUI — the existing meridian-os shell, with a back-to-launcher
  // chevron overlaid on the home grid. Inside a workspace the chevron is
  // hidden so it doesn't fight the FAB; the FAB still handles back-to-home.
  const id = activeWorkspaceIdSignal.value;
  const homeView = mondrianHomeViewSignal.value;
  const homeForRender = homeView === 'archive' ? home : focusedHome;
  return (
    <>
      {!id && <BackToLauncherChevron variant="on-light" />}
      {!id && <HomeViewTogglePill mode={homeView} />}
      <HomeScreen
        home={homeForRender}
        workspaces={workspaces}
        activeWorkspaceId={id}
        onTapWorkspace={(wid, rect) => {
          // Block while a workspace is already active (mid-transition or
          // settled). User must dismiss before tapping another tile.
          if (activeWorkspaceIdSignal.value) return;
          entryFromSignal.value = rect;
          activeWorkspaceIdSignal.value = wid;
        }}
      />
      {id && workspaces[id] && (
        <WorkspaceShell
          workspace={workspaces[id]}
          seeds={seeds}
          entryFrom={entryFromSignal.value}
          onBackToHome={() => {
            // Leaving Trainer always clears any cross-workspace context so
            // the next direct entry from home gets the default seed/state.
            if (id === 'trainer') clearTrainerProviderContext();
            activeWorkspaceIdSignal.value = null;
          }}
        />
      )}
      <PrintView modules={clinicalModules} />
    </>
  );
}

render(<App />, document.getElementById('app')!);

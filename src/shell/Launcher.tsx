import type { JSX } from 'preact';
import { setLauncherApp } from '../data/launcherState';
import { setMondrianHomeView, type MondrianHomeView } from '../data/mondrianHomeView';
import { moduleFocusSignal } from '../data/moduleFocus';
import { activeWorkspaceIdSignal } from '../data/workspaceNav';
import { clearTrainerProviderContext } from '../data/trainerProviderContext';

export function Launcher(): JSX.Element {
  return (
    <div class="launcher">
      <div class="launcher__wordmark">meridian</div>
      <div class="launcher__apps">
        <button
          type="button"
          class="launcher__app"
          onClick={() => setLauncherApp('mondrian')}
          aria-label="Open Mondrian GUI"
        >
          <div class="launcher__app-icon launcher__app-icon--mondrian">
            <MondrianMiniature />
          </div>
          <div class="launcher__app-caption">Mondrian GUI</div>
        </button>

        <button
          type="button"
          class="launcher__app"
          onClick={() => setLauncherApp('mentorship')}
          aria-label="Open Mentorship Tracker"
        >
          <div class="launcher__app-icon launcher__app-icon--mentorship">
            <span class="launcher__app-glyph" aria-hidden="true">👥</span>
          </div>
          <div class="launcher__app-caption">Mentorship Tracker</div>
        </button>
      </div>
    </div>
  );
}

// Compact Mondrian Composition rendered with plain divs — red, blue, yellow
// blocks on a black gridded white field. Sized to fill its rounded-square
// parent; aspect ratio is locked by the parent.
function MondrianMiniature(): JSX.Element {
  return (
    <div class="launcher__mondrian">
      <div class="launcher__mondrian-cell launcher__mondrian-cell--white" style={{ top: 0, left: 0, width: '60%', height: '55%' }} />
      <div class="launcher__mondrian-cell launcher__mondrian-cell--red" style={{ top: 0, left: '60%', width: '40%', height: '55%' }} />
      <div class="launcher__mondrian-cell launcher__mondrian-cell--blue" style={{ top: '55%', left: 0, width: '35%', height: '45%' }} />
      <div class="launcher__mondrian-cell launcher__mondrian-cell--white" style={{ top: '55%', left: '35%', width: '25%', height: '25%' }} />
      <div class="launcher__mondrian-cell launcher__mondrian-cell--yellow" style={{ top: '80%', left: '35%', width: '25%', height: '20%' }} />
      <div class="launcher__mondrian-cell launcher__mondrian-cell--white" style={{ top: '55%', left: '60%', width: '40%', height: '45%' }} />
    </div>
  );
}

interface BackToLauncherProps {
  variant?: 'on-light' | 'on-dark';
}

export function BackToLauncherChevron({ variant = 'on-light' }: BackToLauncherProps): JSX.Element {
  return (
    <button
      type="button"
      class={`back-to-launcher back-to-launcher--${variant}`}
      onClick={() => setLauncherApp('launcher')}
      aria-label="Back to launcher"
    >
      <span class="back-to-launcher__chevron" aria-hidden="true">‹</span>
      <span class="back-to-launcher__wordmark">meridian</span>
    </button>
  );
}

// Floating top-left back chevron that returns from any Mondrian workspace
// to the workspace selection grid. Sibling of ModuleBackChevron — when the
// Clinical Modules workspace is in module mode, both pills stack vertically
// (Mondrian on top at the iOS-standard 16px, modules below at 60px) so the
// user can hop one level up at a time. Mirrors the trainer-context cleanup
// the FAB-driven back-to-home does, so the shortcut and the FAB end up in
// the same state.
export function BackToMondrianChevron(): JSX.Element | null {
  const id = activeWorkspaceIdSignal.value;
  if (!id) return null;
  return (
    <button
      type="button"
      class="mondrian-back-chevron"
      onClick={() => {
        if (activeWorkspaceIdSignal.value === 'trainer') clearTrainerProviderContext();
        activeWorkspaceIdSignal.value = null;
      }}
      aria-label="Back to Mondrian workspace selector"
    >
      <span class="mondrian-back-chevron__chevron" aria-hidden="true">‹</span>
      <span class="mondrian-back-chevron__label">Mondrian</span>
    </button>
  );
}

// Floating top-left back chevron for the Clinical Modules workspace.
// Renders only while the workspace is in module mode; tapping it returns to
// gallery mode (the focus signal change drives the existing BSP rebuild).
// Lives at the App level so it's decoupled from any single bubble's chrome
// — the alpha tester reached for browser back from anywhere on the page,
// so the affordance has to survive the user dismissing or hiding the
// checklist bubble.
export function ModuleBackChevron(): JSX.Element | null {
  const focus = moduleFocusSignal('clinical-modules').value;
  if (focus.mode !== 'module') return null;
  return (
    <button
      type="button"
      class="module-back-chevron"
      onClick={() => {
        moduleFocusSignal('clinical-modules').value = {
          mode: 'gallery',
          moduleId: null,
          focusedItemId: null,
        };
      }}
      aria-label="Back to module gallery"
    >
      <span class="module-back-chevron__chevron" aria-hidden="true">‹</span>
      <span class="module-back-chevron__label">modules</span>
    </button>
  );
}

interface HomeViewTogglePillProps {
  mode: MondrianHomeView;
}

export function HomeViewTogglePill({ mode }: HomeViewTogglePillProps): JSX.Element {
  const next: MondrianHomeView = mode === 'focused' ? 'archive' : 'focused';
  return (
    <button
      type="button"
      class={`home-view-toggle home-view-toggle--${mode}`}
      onClick={() => setMondrianHomeView(next)}
      aria-label={mode === 'focused' ? 'Show archived workspaces' : 'Return to focused view'}
    >
      {mode === 'focused' ? (
        <>
          <span class="home-view-toggle__label">archive</span>
          <span class="home-view-toggle__chevron" aria-hidden="true">›</span>
        </>
      ) : (
        <>
          <span class="home-view-toggle__chevron" aria-hidden="true">‹</span>
          <span class="home-view-toggle__label">focused</span>
        </>
      )}
    </button>
  );
}

import type { JSX } from 'preact';
import { setLauncherApp } from '../data/launcherState';
import { setMondrianHomeView, type MondrianHomeView } from '../data/mondrianHomeView';

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

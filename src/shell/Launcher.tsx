import type { JSX, RefObject } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
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

// The two workspace-back chevrons (Mondrian + modules) sit fixed in the
// top-left corner and were covering bubble content when fully opaque. They
// now default to faint and fade in when the cursor (or any tap) approaches.
// Hover / focus-visible always pin to full opacity via CSS, so a deliberate
// reach-for-the-pill never feels gated. Touch users get a 2.5 s reveal
// window on any pointerdown so the affordance is findable without needing
// proximity tracking.
const REVEAL_PROXIMITY_PX = 220;
const TAP_REVEAL_MS = 2500;

function useProximityReveal(ref: RefObject<HTMLElement>): boolean {
  const [revealed, setRevealed] = useState(false);
  const tapUntilRef = useRef(0);

  useEffect(() => {
    function nearPill(clientX: number, clientY: number): boolean {
      const el = ref.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const cx = (r.left + r.right) / 2;
      const cy = (r.top + r.bottom) / 2;
      return Math.hypot(clientX - cx, clientY - cy) < REVEAL_PROXIMITY_PX;
    }
    function onMove(e: PointerEvent): void {
      const stillTapped = performance.now() < tapUntilRef.current;
      setRevealed(stillTapped || nearPill(e.clientX, e.clientY));
    }
    function onDown(e: PointerEvent): void {
      // Any tap reveals briefly so touch users can find the pill without
      // a hover trail. If the tap landed inside the pill itself the click
      // handler still fires and navigates away — no double-tap required.
      tapUntilRef.current = performance.now() + TAP_REVEAL_MS;
      setRevealed(true);
      window.setTimeout(() => {
        if (performance.now() >= tapUntilRef.current) {
          setRevealed(nearPill(e.clientX, e.clientY));
        }
      }, TAP_REVEAL_MS + 60);
    }
    function onLeave(): void {
      // Cursor left the document — let the pill fade.
      if (performance.now() >= tapUntilRef.current) setRevealed(false);
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [ref]);

  return revealed;
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
  const ref = useRef<HTMLButtonElement>(null);
  const revealed = useProximityReveal(ref);
  if (!id) return null;
  return (
    <button
      ref={ref}
      type="button"
      class={`mondrian-back-chevron${revealed ? ' is-revealed' : ''}`}
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
  const ref = useRef<HTMLButtonElement>(null);
  const revealed = useProximityReveal(ref);
  if (focus.mode !== 'module') return null;
  return (
    <button
      ref={ref}
      type="button"
      class={`module-back-chevron${revealed ? ' is-revealed' : ''}`}
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

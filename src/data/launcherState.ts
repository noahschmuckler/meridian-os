import { signal } from '@preact/signals';

export type LauncherApp = 'launcher' | 'mondrian' | 'mentorship';

const STORAGE_KEY = 'meridian-os.launcherApp.v1';

function hydrate(): LauncherApp {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'mondrian' || raw === 'mentorship') return raw;
  } catch {
    /* ignore — SSR or storage disabled */
  }
  return 'launcher';
}

export const launcherAppSignal = signal<LauncherApp>(hydrate());

export function setLauncherApp(app: LauncherApp): void {
  launcherAppSignal.value = app;
  try {
    localStorage.setItem(STORAGE_KEY, app);
  } catch {
    /* ignore */
  }
}

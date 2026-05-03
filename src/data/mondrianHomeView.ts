import { signal } from '@preact/signals';

export type MondrianHomeView = 'focused' | 'archive';

const STORAGE_KEY = 'meridian-os.mondrianHomeView.v1';

function hydrate(): MondrianHomeView {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'focused' || raw === 'archive') return raw;
  } catch {
    /* ignore — SSR or storage disabled */
  }
  return 'focused';
}

export const mondrianHomeViewSignal = signal<MondrianHomeView>(hydrate());

export function setMondrianHomeView(v: MondrianHomeView): void {
  mondrianHomeViewSignal.value = v;
  try {
    localStorage.setItem(STORAGE_KEY, v);
  } catch {
    /* ignore */
  }
}

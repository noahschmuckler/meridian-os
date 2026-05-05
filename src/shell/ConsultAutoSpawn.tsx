// Auto-spawn a consult-builder bubble the first time the user enters a
// module that declares `consults[]`. Tracks shown-state per module id in
// localStorage so subsequent entries don't re-spawn — providers can
// dismiss the auto-spawn and re-summon from clinical-tools' Consults card.
//
// Mounted once at the App level. Subscribes to the clinical-modules
// workspace's moduleFocusSignal; when focus.mode flips to 'module' for a
// module with consults that hasn't been shown before, dispatches the
// usual `meridian:spawn-bubble` so BspWorkspace creates the bubble.

import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ModuleData } from '../types';
import { moduleFocusSignal } from '../data/moduleFocus';
import { userModulesSignal } from '../data/userModules';
import { activeWorkspaceIdSignal } from '../data/workspaceNav';
import { launcherAppSignal } from '../data/launcherState';

const STORAGE_KEY = 'meridian-os.consultBuilderShown';

interface Props {
  modules: ModuleData[];
}

function readShown(): Record<string, true> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, true>;
  } catch {
    return {};
  }
}

function markShown(moduleId: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const obj = readShown();
    obj[moduleId] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // ignore
  }
}

export function ConsultAutoSpawn({ modules }: Props): JSX.Element | null {
  useEffect(() => {
    const focus = moduleFocusSignal('clinical-modules');
    return focus.subscribe((current) => {
      // Only fire when the user actively enters module mode in the
      // clinical-modules workspace.
      if (current.mode !== 'module' || !current.moduleId) return;
      if (launcherAppSignal.value !== 'mondrian') return;
      if (activeWorkspaceIdSignal.value !== 'clinical-modules') return;

      const allModules: ModuleData[] = [...modules, ...userModulesSignal.value];
      const mod = allModules.find((m) => m.module_id === current.moduleId);
      if (!mod) return;
      const consults = mod.consults ?? [];
      if (consults.length === 0) return;

      const shown = readShown();
      if (shown[mod.module_id]) return;

      markShown(mod.module_id);

      // Defer one tick so the BSP rebuild for the new module mode lands
      // before we ask BspWorkspace to add a new leaf.
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('meridian:spawn-bubble', {
          detail: {
            workspaceId: 'clinical-modules',
            spec: {
              type: 'consult-builder',
              title: 'Consult builder',
              props: {},
            },
          },
        }));
      }, 80);
    });
  }, [modules]);

  return null;
}

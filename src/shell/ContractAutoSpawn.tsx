// Auto-spawn a contract-builder bubble the first time the user enters a
// controlled-substance module (adhd / opiates / benzos — anything in the
// contract library's module_class_map). Mirrors ConsultAutoSpawn: the
// clinical-tools "Contracts" card can't surface in module mode (the tools
// bubble lives only in the gallery layout), so an app-level auto-spawn is
// how the builder reaches the provider while they're looking at a module.
//
// One-shot per module id via localStorage; providers can dismiss it. The
// spawned builder is pre-selected to the module's substance class.

import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import type { CsSubstanceClass, ModuleData } from '../types';
import { moduleFocusSignal } from '../data/moduleFocus';
import { userModulesSignal } from '../data/userModules';
import { activeWorkspaceIdSignal } from '../data/workspaceNav';
import { launcherAppSignal } from '../data/launcherState';
import csContractsSeed from '../data/seed/controlled-substances-contracts.json';

const STORAGE_KEY = 'meridian-os.contractBuilderShown';

const CONTRACT_CLASS_MAP: Record<string, CsSubstanceClass> = (
  (csContractsSeed as { module_class_map?: Record<string, CsSubstanceClass> }).module_class_map ?? {}
);

interface Props {
  modules: ModuleData[];
}

function readShown(): Record<string, true> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, true>) : {};
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

export function ContractAutoSpawn({ modules }: Props): JSX.Element | null {
  useEffect(() => {
    const focus = moduleFocusSignal('clinical-modules');
    return focus.subscribe((current) => {
      if (current.mode !== 'module' || !current.moduleId) return;
      if (launcherAppSignal.value !== 'mondrian') return;
      if (activeWorkspaceIdSignal.value !== 'clinical-modules') return;

      const substanceClass = CONTRACT_CLASS_MAP[current.moduleId];
      if (!substanceClass) return; // not a controlled-substance module

      const allModules: ModuleData[] = [...modules, ...userModulesSignal.value];
      if (!allModules.find((m) => m.module_id === current.moduleId)) return;

      const shown = readShown();
      if (shown[current.moduleId]) return;
      markShown(current.moduleId);

      // Defer one tick so the BSP rebuild for module mode lands before we
      // add the leaf. Slightly longer than ConsultAutoSpawn's delay so the
      // two auto-spawns don't race for the same largest leaf.
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('meridian:spawn-bubble', {
          detail: {
            workspaceId: 'clinical-modules',
            spec: {
              type: 'contract-builder',
              title: 'CS contract builder',
              props: { initialClass: substanceClass },
            },
          },
        }));
      }, 140);
    });
  }, [modules]);

  return null;
}

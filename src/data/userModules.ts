// User-uploaded clinical modules. Persisted to localStorage and merged with
// the seeded module catalog at render time. Bubbles that look up modules by
// id should consult both seed and user lists. Adding a module also pushes
// the workspace into module mode for the new module so the upload lands the
// provider directly into the imported content.

import { signal } from '@preact/signals';
import type { ModuleData } from '../types';
import { moduleFocusSignal } from './moduleFocus';

const STORAGE_KEY = 'meridian-os.userModules';

function load(): ModuleData[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ModuleData[];
  } catch {
    return [];
  }
}

function persist(modules: ModuleData[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
  } catch {
    // ignore — quota etc.
  }
}

export const userModulesSignal = signal<ModuleData[]>(load());

userModulesSignal.subscribe((next) => {
  persist(next);
});

export function addUserModule(mod: ModuleData): { mod: ModuleData; renamed: boolean } {
  // Avoid id collisions with seeded modules and prior user modules. If a
  // collision is detected, append -2, -3, … to keep both copies.
  const existing = userModulesSignal.value;
  let id = mod.module_id;
  let counter = 1;
  const taken = new Set([...existing.map((m) => m.module_id)]);
  let renamed = false;
  while (taken.has(id)) {
    counter += 1;
    id = `${mod.module_id}-${counter}`;
    renamed = true;
  }
  const final = renamed ? { ...mod, module_id: id } : mod;
  userModulesSignal.value = [...existing, final];

  // Land the workspace on this module immediately — the wow demo move.
  moduleFocusSignal('clinical-modules').value = {
    mode: 'module',
    moduleId: final.module_id,
    focusedItemId: null,
  };
  return { mod: final, renamed };
}

export function removeUserModule(moduleId: string): void {
  userModulesSignal.value = userModulesSignal.value.filter((m) => m.module_id !== moduleId);
}

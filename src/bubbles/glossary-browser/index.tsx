// Glossary browser bubble — pop-out from the term popover. Lists every
// glossary entry available in the current context (per-module + global,
// merged with module entries winning) with a substring search. When
// spawned with `props.initialTerm`, scrolls to and highlights that
// entry on first paint.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance, GlossaryEntry, ModuleData } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { moduleFocusSignal } from '../../data/moduleFocus';
import { userModulesSignal } from '../../data/userModules';

import clinicalModulesSeed from '../../data/seed/clinical-modules.json';
import glossarySeedRaw from '../../data/seed/glossary.json';

interface GlossaryBrowserProps {
  initialTerm?: string;
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
}

const SEED_MODULES: ModuleData[] = (
  ((clinicalModulesSeed as { clinical?: { modules?: ModuleData[] } }).clinical?.modules) ?? []
);
const GLOBAL_GLOSSARY: GlossaryEntry[] = (
  (glossarySeedRaw as { glossary?: { global?: GlossaryEntry[] } }).glossary?.global ?? []
);

interface DecoratedEntry extends GlossaryEntry {
  source: 'module' | 'global';
}

export function GlossaryBrowser({ instance, workspaceId }: Props): JSX.Element {
  const props = (instance.props as unknown as GlossaryBrowserProps) ?? {};
  const initialTerm = props.initialTerm;

  const focus = moduleFocusSignal(workspaceId).value;
  const allModules: ModuleData[] = [...SEED_MODULES, ...userModulesSignal.value];
  const activeModule = allModules.find((m) => m.module_id === focus.moduleId) ?? null;

  const merged: DecoratedEntry[] = useMemo(() => {
    const moduleTerms = new Set((activeModule?.glossary ?? []).map((e) => e.term));
    const fromModule: DecoratedEntry[] = (activeModule?.glossary ?? []).map((e) => ({ ...e, source: 'module' }));
    const fromGlobal: DecoratedEntry[] = GLOBAL_GLOSSARY
      .filter((e) => !moduleTerms.has(e.term))
      .map((e) => ({ ...e, source: 'global' }));
    return [...fromModule, ...fromGlobal].sort((a, b) =>
      a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }),
    );
  }, [activeModule]);

  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return merged;
    return merged.filter((e) =>
      e.term.toLowerCase().includes(q)
      || (e.expansion?.toLowerCase().includes(q) ?? false)
      || e.definition.toLowerCase().includes(q)
      || (e.aliases?.some((a) => a.toLowerCase().includes(q)) ?? false),
    );
  }, [merged, query]);

  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!initialTerm || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-term="${CSS.escape(initialTerm)}"]`);
    if (el && 'scrollIntoView' in el) {
      (el as HTMLElement).scrollIntoView({ block: 'center' });
    }
  }, [initialTerm]);

  return (
    <div class="glossary-browser" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title">Glossary</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.6 }}>
          {merged.length} term{merged.length === 1 ? '' : 's'}
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, padding: '8px 10px 10px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
        <input
          type="text"
          placeholder="Search terms…"
          value={query}
          onInput={(e) => setQuery((e.currentTarget as HTMLInputElement).value)}
          onPointerDown={(e) => e.stopPropagation()}
          class="glossary-browser__search"
        />
        <div ref={listRef} class="glossary-browser__list" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 12, fontSize: 12, opacity: 0.6 }}>No matches.</div>
          ) : (
            filtered.map((e) => (
              <div
                key={e.term}
                class={`glossary-browser__entry${initialTerm === e.term ? ' glossary-browser__entry--initial' : ''}`}
                data-term={e.term}
              >
                <div class="glossary-browser__head">
                  <span class="glossary-browser__term">{e.term}</span>
                  {e.expansion && <span class="glossary-browser__expansion">{e.expansion}</span>}
                  {e.source === 'module' && (
                    <span class="glossary-browser__src">module</span>
                  )}
                </div>
                <div class="glossary-browser__def">{e.definition}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

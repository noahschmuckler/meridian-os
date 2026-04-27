// Clinical module checklist primitive — green band, the "main page."
//
// Owns the module-picker dropdown (so swapping modules from this bubble
// updates focus for all three clinical-module bubbles in the workspace).
// Renders landing intro, the 4-item decision-gate checklist, then the
// footer (green-zone label + smartphrase chip, context strip, footer note).
// Tapping a row sets workspace focus to that item's faq_ref and asks the
// host to grow the FAQ bubble to ~60% of its parent split.

import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance, ModuleData } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { moduleFocusSignal } from '../../data/moduleFocus';
import { ModuleRow } from '../clinical-module-shared/row';

interface ClinicalModuleChecklistProps {
  modules?: ModuleData[];
  defaultModuleId?: string;
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
  onRequestSiblingFocus?: (targetBubbleId: string, targetShare: number) => void;
}

export function ClinicalModuleChecklist({ instance, workspaceId, onRequestSiblingFocus }: Props): JSX.Element {
  const p = instance.props as unknown as ClinicalModuleChecklistProps;
  const modules: ModuleData[] = p.modules ?? [];
  const focus = moduleFocusSignal(workspaceId);

  useEffect(() => {
    if (focus.value.moduleId == null && modules.length > 0) {
      const def = p.defaultModuleId ? modules.find((m) => m.module_id === p.defaultModuleId) : undefined;
      focus.value = { moduleId: (def ?? modules[0]).module_id, focusedItemId: null };
    }
  }, [modules.length, p.defaultModuleId]);

  const selected = modules.find((m) => m.module_id === focus.value.moduleId) ?? modules[0];
  if (!selected) {
    return (
      <div class="cm-bubble" style={{ padding: 16, color: 'var(--ink-faint)' }}>
        No clinical modules available.
      </div>
    );
  }

  const focusedId = focus.value.focusedItemId;

  function pickRow(faqRef: string): void {
    focus.value = { moduleId: selected.module_id, focusedItemId: faqRef };
    onRequestSiblingFocus?.('module-faq', 0.6);
  }

  function pickModule(e: Event): void {
    const next = (e.currentTarget as HTMLSelectElement).value;
    focus.value = { moduleId: next, focusedItemId: null };
    onRequestSiblingFocus?.('module-faq', 0.5);
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <select
          class="cm-bubble__picker"
          value={selected.module_id}
          onChange={pickModule}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          title="Switch module"
        >
          {modules.map((m) => (
            <option key={m.module_id} value={m.module_id}>{m.default_title}</option>
          ))}
        </select>
        <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 'auto' }}>
          {selected.checklist.length} checks
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '8px 12px 12px' }}>
        <p style={{ fontSize: 12, lineHeight: 1.45, opacity: 0.85, margin: '4px 0 12px' }}>
          {selected.landing_intro}
        </p>

        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              fontWeight: 700,
              color: 'var(--type-color)',
              marginBottom: 6,
              paddingLeft: 8,
              borderLeft: '3px solid var(--type-color)',
            }}
          >
            {selected.checklist_section_label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {selected.checklist.map((item) => (
              <ModuleRow
                key={item.item_id}
                statement={item.statement}
                marker={String(item.position)}
                markerShape="square"
                accent="var(--type-color)"
                focused={focusedId === item.faq_ref}
                onClick={() => pickRow(item.faq_ref)}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--type-color)', marginBottom: 4 }}>
            ✓ {selected.green_zone.zone_label}
            {selected.green_zone.smartphrase && (
              <code style={{ marginLeft: 8, fontSize: 10, padding: '1px 6px', background: 'rgba(0,0,0,0.06)', borderRadius: 4 }}>
                {selected.green_zone.smartphrase}
              </code>
            )}
          </div>
          {selected.context_strip && (
            <div style={{ fontSize: 10.5, lineHeight: 1.4, opacity: 0.75, marginBottom: 6 }}>
              <strong>{selected.context_strip.label}: </strong>
              {selected.context_strip.text}
            </div>
          )}
          {selected.footer_note && (
            <div style={{ fontSize: 10, lineHeight: 1.35, opacity: 0.55, fontStyle: 'italic' }}>
              {selected.footer_note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

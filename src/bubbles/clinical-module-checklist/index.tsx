// Clinical module checklist primitive — green band, the "main page."
//
// Owns the "Back to modules" affordance (returns the workspace to gallery
// mode, where topic bubbles host the module list). Renders landing intro,
// the 4-item decision-gate checklist, then the footer (green-zone label +
// smartphrase chip, context strip, footer note). Tapping a row sets
// workspace focus to that item's faq_ref and asks the host to grow the
// FAQ bubble to ~60% of its parent split.

import type { JSX } from 'preact';
import type { BubbleInstance, ModuleData } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { moduleFocusSignal } from '../../data/moduleFocus';
import { ModuleRow } from '../clinical-module-shared/row';

interface ClinicalModuleChecklistProps {
  modules?: ModuleData[];
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

  const selected = modules.find((m) => m.module_id === focus.value.moduleId);
  if (!selected) {
    return (
      <div class="cm-bubble" style={{ padding: 16, color: 'var(--ink-faint)' }}>
        No module selected.
      </div>
    );
  }

  const focusedId = focus.value.focusedItemId;

  function pickRow(faqRef: string): void {
    if (!selected) return;
    focus.value = { mode: 'module', moduleId: selected.module_id, focusedItemId: faqRef };
    onRequestSiblingFocus?.('module-faq', 0.6);
  }

  function backToModules(): void {
    focus.value = { mode: 'gallery', moduleId: null, focusedItemId: null };
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <button
          type="button"
          title="Back to modules"
          aria-label="Back to modules"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); backToModules(); }}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 12,
            padding: '0 8px 0 0',
            opacity: 0.75,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--type-color)',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>‹</span>
          <span style={{ fontSize: 11 }}>modules</span>
        </button>
        <span class="bubble__title" style={{ color: 'var(--type-color)', fontSize: 12 }}>
          {selected.default_title}
        </span>
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

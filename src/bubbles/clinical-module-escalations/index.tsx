// Clinical module escalations primitive — red band, the "alert" half.
//
// Reads the workspace-scoped focus signal to know which module is selected
// (the checklist bubble owns the picker). Renders the module's escalation
// list. Tapping a row sets focus to that escalation's faq_ref and asks the
// host to grow the FAQ bubble.

import type { JSX } from 'preact';
import type { BubbleInstance, ModuleData } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { moduleFocusSignal } from '../../data/moduleFocus';
import { ModuleRow } from '../clinical-module-shared/row';

interface ClinicalModuleEscalationsProps {
  modules?: ModuleData[];
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
  onRequestSiblingFocus?: (targetBubbleId: string, targetShare: number) => void;
}

export function ClinicalModuleEscalations({ instance, workspaceId, onRequestSiblingFocus }: Props): JSX.Element {
  const p = instance.props as unknown as ClinicalModuleEscalationsProps;
  const modules: ModuleData[] = p.modules ?? [];
  const focus = moduleFocusSignal(workspaceId);

  const selected = modules.find((m) => m.module_id === focus.value.moduleId);
  if (!selected) {
    return (
      <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div class="bubble__chrome"><span class="bubble__title">Escalations</span></div>
        <div class="bubble__body" style={{ flex: 1, padding: 16, color: 'var(--ink-faint)', fontSize: 12 }}>
          Pick a module from the checklist bubble.
        </div>
      </div>
    );
  }

  const focusedId = focus.value.focusedItemId;
  const moduleId = selected.module_id;

  function pickRow(faqRef: string): void {
    focus.value = { moduleId, focusedItemId: faqRef };
    onRequestSiblingFocus?.('module-faq', 0.6);
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>
          {selected.escalation_section_label}
        </span>
        <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 'auto' }}>
          {selected.escalation.length} triggers
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '8px 12px 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {selected.escalation.map((item) => (
            <ModuleRow
              key={item.item_id}
              statement={item.statement}
              marker="!"
              markerShape="circle"
              accent="var(--type-color)"
              focused={focusedId === item.faq_ref}
              onClick={() => pickRow(item.faq_ref)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

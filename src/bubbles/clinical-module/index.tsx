// Clinical module primitive — provider-facing decision-support card.
//
// One bubble shows: title + module picker, checklist, escalations, footer.
// Click a checklist or escalation row → sets workspace focus + asks the host
// to nudge the FAQ bubble to ~60% of the split if it's currently smaller.
// Provider keeps the card in view while the FAQ surfaces the matching detail.

import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance, ModuleData } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { moduleFocusSignal } from '../../data/moduleFocus';

interface ClinicalModuleProps {
  modules?: ModuleData[];
  defaultModuleId?: string;
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
  onRequestSiblingFocus?: (targetBubbleId: string, targetShare: number) => void;
}

export function ClinicalModule({ instance, workspaceId, onRequestSiblingFocus }: Props): JSX.Element {
  const p = instance.props as unknown as ClinicalModuleProps;
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
          {selected.checklist.length} checks · {selected.escalation.length} escalations
        </span>
      </div>
      <div class="bubble__body cm-bubble__body" style={{ flex: 1, overflow: 'auto', padding: '8px 12px 12px' }}>
        <p class="cm-bubble__intro" style={{ fontSize: 12, lineHeight: 1.45, opacity: 0.85, margin: '4px 0 12px' }}>
          {selected.landing_intro}
        </p>

        <Section
          label={selected.checklist_section_label}
          tone="default"
        >
          {selected.checklist.map((item) => (
            <Row
              key={item.item_id}
              statement={item.statement}
              position={item.position}
              focused={focusedId === item.faq_ref}
              tone="default"
              onClick={() => pickRow(item.faq_ref)}
            />
          ))}
        </Section>

        <Section
          label={selected.escalation_section_label}
          tone="warn"
        >
          {selected.escalation.map((item) => (
            <Row
              key={item.item_id}
              statement={item.statement}
              position={item.position}
              focused={focusedId === item.faq_ref}
              tone="warn"
              onClick={() => pickRow(item.faq_ref)}
            />
          ))}
        </Section>

        <div class="cm-bubble__footer" style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--ink-faintest, rgba(0,0,0,0.08))' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>
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

interface SectionProps {
  label: string;
  tone: 'default' | 'warn';
  children: JSX.Element | JSX.Element[];
}

function Section({ label, tone, children }: SectionProps): JSX.Element {
  const color = tone === 'warn' ? 'var(--warn)' : 'var(--type-color, var(--accent))';
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          fontWeight: 700,
          color,
          marginBottom: 6,
          paddingLeft: 8,
          borderLeft: `3px solid ${color}`,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {children}
      </div>
    </div>
  );
}

interface RowProps {
  statement: string;
  position: number;
  focused: boolean;
  tone: 'default' | 'warn';
  onClick: () => void;
}

function Row({ statement, position, focused, tone, onClick }: RowProps): JSX.Element {
  const accent = tone === 'warn' ? 'var(--warn)' : 'var(--type-color, var(--accent))';
  return (
    <button
      type="button"
      class="cm-row"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        display: 'grid',
        gridTemplateColumns: '20px 1fr',
        gap: 8,
        alignItems: 'start',
        textAlign: 'left',
        background: focused ? 'rgba(0,0,0,0.04)' : 'transparent',
        border: 'none',
        borderLeft: focused ? `3px solid ${accent}` : '3px solid transparent',
        padding: '6px 8px',
        cursor: 'pointer',
        font: 'inherit',
        fontSize: 12.5,
        lineHeight: 1.4,
        opacity: focused ? 1 : 0.85,
        borderRadius: 4,
        transition: 'background 160ms, opacity 160ms, border-color 160ms',
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: tone === 'warn' ? '50%' : 4,
          border: `1.5px solid ${accent}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 700,
          color: accent,
          marginTop: 1,
        }}
      >
        {tone === 'warn' ? '!' : position}
      </span>
      <span>{statement}</span>
    </button>
  );
}

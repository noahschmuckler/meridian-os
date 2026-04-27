// Clinical module FAQ panel — sibling to the clinical-module bubble.
//
// Reads workspace-scoped focus signal: shows the FAQ entry whose faq_id
// matches focusedItemId; falls back to a topic index when nothing is
// focused. Clicking a topic in idle state focuses that faq_id and asks
// the host to grow this bubble (so the answer is comfortable to read).

import type { JSX } from 'preact';
import type { BubbleInstance, ModuleData, ModuleFaqEntry } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { moduleFocusSignal } from '../../data/moduleFocus';
import { userModulesSignal } from '../../data/userModules';

interface ClinicalModuleFaqProps {
  modules?: ModuleData[];
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
  onRequestSiblingFocus?: (targetBubbleId: string, targetShare: number) => void;
  selfBubbleId: string;
}

export function ClinicalModuleFaq({ instance, workspaceId, onRequestSiblingFocus, selfBubbleId }: Props): JSX.Element {
  const p = instance.props as unknown as ClinicalModuleFaqProps;
  const seedModules: ModuleData[] = p.modules ?? [];
  const modules: ModuleData[] = [...seedModules, ...userModulesSignal.value];
  const focus = moduleFocusSignal(workspaceId);
  const { moduleId, focusedItemId } = focus.value;

  const selected = modules.find((m) => m.module_id === moduleId);

  function pickFaq(faqId: string): void {
    if (!selected) return;
    focus.value = { mode: 'module', moduleId: selected.module_id, focusedItemId: faqId };
    onRequestSiblingFocus?.(selfBubbleId, 0.6);
  }

  function clearFocus(): void {
    if (!selected) return;
    focus.value = { mode: 'module', moduleId: selected.module_id, focusedItemId: null };
  }

  if (!selected) {
    return (
      <div class="cm-faq" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div class="bubble__chrome">
          <span class="bubble__title">Module detail</span>
        </div>
        <div class="bubble__body" style={{ flex: 1, padding: 16, color: 'var(--ink-faint)', fontSize: 12 }}>
          Pick a module from the card to start.
        </div>
      </div>
    );
  }

  const focusedFaq = focusedItemId ? selected.faqs.find((f) => f.faq_id === focusedItemId) : null;

  return (
    <div class="cm-faq" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        {focusedFaq && (
          <button
            type="button"
            class="cm-faq__back"
            title="Back to all topics"
            aria-label="Back to all topics"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); clearFocus(); }}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 13,
              padding: '0 8px 0 0',
              opacity: 0.75,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>‹</span>
            <span style={{ fontSize: 11 }}>topics</span>
          </button>
        )}
        <span class="bubble__title">
          {focusedFaq ? focusedFaq.topic : `${selected.default_title.split(' — ')[0]} · detail`}
        </span>
        {focusedFaq && (
          <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 'auto' }}>
            {focusedFaq.items.length} Q
          </span>
        )}
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '10px 14px 14px' }}>
        {focusedFaq ? (
          <FocusedFaq entry={focusedFaq} />
        ) : (
          <IdleIndex faqs={selected.faqs} onPick={pickFaq} />
        )}
      </div>
    </div>
  );
}

function FocusedFaq({ entry }: { entry: ModuleFaqEntry }): JSX.Element {
  return (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3 }}>
        {entry.title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {entry.items.map((qa, i) => (
          <div key={i}>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: 'var(--type-color, var(--accent))' }}>
              {qa.question}
            </div>
            <div
              class="markdown-body"
              style={{ fontSize: 12.5, lineHeight: 1.5 }}
              dangerouslySetInnerHTML={{ __html: qa.answer_html }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function IdleIndex({ faqs, onPick }: { faqs: ModuleFaqEntry[]; onPick: (id: string) => void }): JSX.Element {
  return (
    <div>
      <p style={{ fontSize: 12, opacity: 0.7, margin: '0 0 12px', lineHeight: 1.4 }}>
        Tap a checklist or escalation item to see its detail — or pick a topic below.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {faqs.map((f) => (
          <button
            key={f.faq_id}
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onPick(f.faq_id); }}
            style={{
              textAlign: 'left',
              padding: '8px 10px',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 6,
              background: 'transparent',
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 12,
              lineHeight: 1.35,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{f.topic}</div>
            <div style={{ opacity: 0.65, fontSize: 11 }}>{f.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

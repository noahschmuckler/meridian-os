// Clinical topic bubble — a thematically grouped shelf of modules.
//
// One bubble per clinical topic (Cardiometabolic, Behavioral & Controlled Rx,
// General Internal Med, …). Each bubble lists the modules in its topic.
// Tapping a module switches the workspace to module mode (the topic bubbles
// fold away, the checklist + escalations + FAQ + persistent llm/oe bubbles
// take over).
//
// Same component, multiple primitive types — the type's CSS rule sets the
// topic color (--type-color). Module list comes from props.moduleIds (an
// allow-list of module_ids that belong in this topic) plus the seeded full
// module catalog.

import type { JSX } from 'preact';
import type { BubbleInstance, ModuleData } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { moduleFocusSignal } from '../../data/moduleFocus';

interface ClinicalTopicBubbleProps {
  topic?: string;
  blurb?: string;
  moduleIds?: string[];
  modules?: ModuleData[]; // full catalog, resolved from seed
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
}

export function ClinicalTopicBubble({ instance, workspaceId }: Props): JSX.Element {
  const p = instance.props as unknown as ClinicalTopicBubbleProps;
  const allModules: ModuleData[] = p.modules ?? [];
  const allowed = new Set(p.moduleIds ?? []);
  const modules = allModules.filter((m) => allowed.has(m.module_id));
  const focus = moduleFocusSignal(workspaceId);

  function pick(moduleId: string): void {
    focus.value = { mode: 'module', moduleId, focusedItemId: null };
  }

  return (
    <div class="cm-topic" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>
          {p.topic ?? instance.title}
        </span>
        <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 'auto' }}>
          {modules.length} {modules.length === 1 ? 'module' : 'modules'}
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '8px 12px 12px' }}>
        {p.blurb && (
          <p style={{ fontSize: 11.5, lineHeight: 1.4, opacity: 0.7, margin: '4px 0 10px' }}>{p.blurb}</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {modules.length === 0 ? (
            <div style={{ fontSize: 12, opacity: 0.5 }}>No modules in this topic yet.</div>
          ) : (
            modules.map((m) => (
              <button
                key={m.module_id}
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); pick(m.module_id); }}
                style={{
                  textAlign: 'left',
                  padding: '8px 10px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderLeft: '3px solid var(--type-color)',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.55)',
                  cursor: 'pointer',
                  font: 'inherit',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 12.5, lineHeight: 1.3 }}>{m.default_title}</div>
                <div style={{ fontSize: 10.5, opacity: 0.65, marginTop: 3 }}>
                  {m.checklist.length} checks · {m.escalation.length} escalations · {m.faqs.length} FAQs
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

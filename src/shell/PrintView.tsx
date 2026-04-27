// Print-friendly module view. Hidden on screen, shown on print.
//
// Subscribes to the clinical-modules workspace focus signal and renders the
// currently-focused module as a clean paginated document. Bubble UI is
// hidden via @media print rules (see glass.css). User triggers via Cmd+P or
// the FAB print button. To print a different module: enter module mode for
// that module first, then print.

import type { JSX } from 'preact';
import { moduleFocusSignal } from '../data/moduleFocus';
import type { ModuleData } from '../types';

interface Props {
  modules: ModuleData[];
}

export function PrintView({ modules }: Props): JSX.Element {
  const focus = moduleFocusSignal('clinical-modules');
  const m = modules.find((mod) => mod.module_id === focus.value.moduleId);

  if (!m) {
    return (
      <div class="print-view print-view--empty">
        <h1>Clinical Modules</h1>
        <p>Open a module before printing — gallery view doesn't have a printable form. Tap a module in any topic bubble, then print.</p>
      </div>
    );
  }

  return (
    <div class="print-view">
      <header class="print-header">
        <h1>{m.default_title}</h1>
        {m.landing_intro && <p class="print-intro">{m.landing_intro}</p>}
      </header>

      <section class="print-section print-section--checklist">
        <h2>{m.checklist_section_label}</h2>
        <ol class="print-list print-list--checklist">
          {m.checklist.map((item) => (
            <li key={item.item_id}>{item.statement}</li>
          ))}
        </ol>
      </section>

      <section class="print-green-zone">
        <h3>{m.green_zone.zone_label}</h3>
        <div dangerouslySetInnerHTML={{ __html: m.green_zone.narrative_html }} />
        {m.green_zone.smartphrase && (
          <p class="print-smartphrase"><code>{m.green_zone.smartphrase}</code></p>
        )}
      </section>

      <section class="print-section print-section--escalation">
        <h2>{m.escalation_section_label}</h2>
        <ul class="print-list print-list--escalation">
          {m.escalation.map((item) => (
            <li key={item.item_id}>{item.statement}</li>
          ))}
        </ul>
      </section>

      {m.context_strip && (
        <aside class="print-context">
          <strong>{m.context_strip.label}:</strong> {m.context_strip.text}
        </aside>
      )}

      <section class="print-section print-section--faqs">
        <h2>FAQs</h2>
        {m.faqs.map((faq) => (
          <article class="print-faq" key={faq.faq_id}>
            <h3>{faq.topic} — {faq.title}</h3>
            {faq.items.map((qa, i) => (
              <div class="print-qa" key={i}>
                <h4>{qa.question}</h4>
                <div dangerouslySetInnerHTML={{ __html: qa.answer_html }} />
              </div>
            ))}
          </article>
        ))}
      </section>

      {m.footer_note && (
        <footer class="print-footer-note">{m.footer_note}</footer>
      )}

      {m.references && m.references.length > 0 && (
        <section class="print-section print-section--references">
          <h2>References</h2>
          <ol class="print-references">
            {m.references.map((ref, i) => <li key={i}>{ref}</li>)}
          </ol>
        </section>
      )}
    </div>
  );
}

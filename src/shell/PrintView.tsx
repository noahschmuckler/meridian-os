// Print-friendly module view. Hidden on screen, shown on print.
//
// Subscribes to the clinical-modules workspace focus signal and renders the
// currently-focused module as a clean paginated document. Bubble UI is
// hidden via @media print rules (see glass.css). User triggers via Cmd+P or
// the FAB print button. To print a different module: enter module mode for
// that module first, then print.

import type { JSX } from 'preact';
import { moduleFocusSignal } from '../data/moduleFocus';
import { userModulesSignal } from '../data/userModules';
import type { ModuleData } from '../types';
import { expandRefMarkers, getCitedReferences, getModuleRefNumberer } from '../lib/refMarkers';

interface Props {
  modules: ModuleData[];
}

export function PrintView({ modules }: Props): JSX.Element {
  const focus = moduleFocusSignal('clinical-modules');
  const all: ModuleData[] = [...modules, ...userModulesSignal.value];
  const m = all.find((mod) => mod.module_id === focus.value.moduleId);

  if (!m) {
    return (
      <div class="print-view print-view--empty">
        <h1>Clinical Modules</h1>
        <p>Open a module before printing — gallery view doesn't have a printable form. Tap a module in any topic bubble, then print.</p>
      </div>
    );
  }

  // One numberer per render so superscripts and the references list agree on
  // numbering even though they're built in two separate passes.
  const numberer = getModuleRefNumberer(m);
  const cited = getCitedReferences(m, numberer);

  return (
    <div class="print-view">
      <header class="print-header">
        <h1>{m.default_title}</h1>
        {m.landing_intro && (
          <p
            class="print-intro"
            dangerouslySetInnerHTML={{ __html: expandRefMarkers(m.landing_intro, m, numberer) }}
          />
        )}
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
        <div dangerouslySetInnerHTML={{ __html: expandRefMarkers(m.green_zone.narrative_html, m, numberer) }} />
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
          <strong>{m.context_strip.label}:</strong>{' '}
          <span dangerouslySetInnerHTML={{ __html: expandRefMarkers(m.context_strip.text, m, numberer) }} />
        </aside>
      )}

      <section class="print-section print-section--faqs">
        <h2>FAQs</h2>
        {m.faqs.map((faq) => (
          <article class="print-faq" key={faq.faq_id}>
            <h3>{faq.topic} — {faq.title}</h3>
            {faq.first_layer_html && (
              <div class="print-first-layer" dangerouslySetInnerHTML={{ __html: expandRefMarkers(faq.first_layer_html, m, numberer) }} />
            )}
            {(faq.sub_questions ?? faq.items ?? []).map((qa, i) => (
              <div class="print-qa" key={i}>
                <h4>{qa.question}</h4>
                <div dangerouslySetInnerHTML={{ __html: expandRefMarkers(qa.answer_html, m, numberer) }} />
              </div>
            ))}
          </article>
        ))}
      </section>

      {m.footer_note && (
        <footer
          class="print-footer-note"
          dangerouslySetInnerHTML={{ __html: expandRefMarkers(m.footer_note, m, numberer) }}
        />
      )}

      {cited.length > 0 && (
        <section class="print-section print-section--references">
          <h2>References</h2>
          <ol class="print-references">
            {cited.map(({ number, ref }) => (
              <li key={ref.ref_id} id={`ref-${ref.ref_id}`} value={number}>
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.citation}</a>
                ) : (
                  <span>{ref.citation}</span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

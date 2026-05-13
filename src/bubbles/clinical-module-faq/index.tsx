// Clinical module FAQ panel — sibling to the clinical-module bubble.
//
// Reads workspace-scoped focus signal: shows the FAQ entry whose faq_id
// matches focusedItemId; falls back to a topic index when nothing is
// focused. Clicking a topic in idle state focuses that faq_id and asks
// the host to grow this bubble (so the answer is comfortable to read).

import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import type { BubbleInstance, GlossaryEntry, ModuleData, ModuleFaqEntry } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { moduleFocusSignal } from '../../data/moduleFocus';
import { userModulesSignal } from '../../data/userModules';
import { expandRefMarkers, getModuleRefNumberer, getReferencesUsedIn } from '../../lib/refMarkers';
import { decorateGlossaryHtml, getMergedGlossary } from '../../lib/glossary';
import { decorateConsultMentionsHtml } from '../../lib/consultDecorator';
import glossarySeedRaw from '../../data/seed/glossary.json';
import { FontSizeControls } from '../../shell/FontSizeControls';

const GLOBAL_GLOSSARY: GlossaryEntry[] = (
  (glossarySeedRaw as { glossary?: { global?: GlossaryEntry[] } }).glossary?.global ?? []
);

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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          {focusedFaq && (
            <span style={{ fontSize: 10, opacity: 0.6 }}>
              {(focusedFaq.sub_questions?.length ?? focusedFaq.items?.length ?? 0)} Q
            </span>
          )}
          <FontSizeControls bubbleId={selfBubbleId} />
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '10px 14px 14px' }}>
        {focusedFaq ? (
          // Key on faq_id so switching directly from one FAQ to another
          // (e.g. tapping a different checklist / escalation row without
          // going back to the topic index) remounts the subtree and resets
          // the local useState in sub-question expanders + the consult
          // decision-point pill. Without this, an open expander in topic A
          // carries its open=true state to the same-index expander in
          // topic B since Preact reuses the component instance.
          <FocusedFaq key={focusedFaq.faq_id} entry={focusedFaq} module={selected} />
        ) : (
          <IdleIndex faqs={selected.faqs} onPick={pickFaq} />
        )}
      </div>
    </div>
  );
}

function FocusedFaq({ entry, module }: { entry: ModuleFaqEntry; module: ModuleData }): JSX.Element {
  // Share a single numberer between the marker-expansion pass and the
  // citations-used-in lookup so superscripts and the references list agree
  // on which ref got which number for this module.
  const numberer = getModuleRefNumberer(module);
  const glossary = getMergedGlossary(module, GLOBAL_GLOSSARY);
  const decorate = (html: string): string => decorateConsultMentionsHtml(
    decorateGlossaryHtml(expandRefMarkers(html, module, numberer), glossary),
    module.consults ?? [],
  );

  // 1.3.0 two-tier path: first_layer_html present means the entry has been
  // through the Simplified/Stratified Pass. Render first-layer answer at top,
  // then optional SmartPhrase / Consult pills, then sub_questions as
  // default-closed expanders. Fall through to legacy items[] path otherwise.
  const isTwoTier = typeof entry.first_layer_html === 'string' && entry.first_layer_html.length > 0;

  // Citation list aggregates refs cited across whichever content is rendered.
  const renderedHtmls: string[] = isTwoTier
    ? [
        entry.first_layer_html ?? '',
        ...(entry.sub_questions?.map((qa) => qa.answer_html) ?? []),
      ]
    : (entry.items?.map((qa) => qa.answer_html) ?? []);
  const cited = getReferencesUsedIn(renderedHtmls, module, numberer);

  // Badge derivation from referenced_by[]: intersect with checklist/escalation
  // item_ids so the topic pill matches the surface item that links here.
  const checklistIds = new Set(module.checklist.map((c) => c.item_id));
  const escalationIds = new Set(module.escalation.map((e) => e.item_id));
  const refs = entry.referenced_by ?? [];
  const isChecklist = refs.some((r) => checklistIds.has(r));
  const isEscalation = refs.some((r) => escalationIds.has(r));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 10px', flexWrap: 'wrap' }}>
        {isChecklist && <span class="cm-faq__badge cm-faq__badge--checklist">Checklist</span>}
        {isEscalation && <span class="cm-faq__badge cm-faq__badge--escalation">Escalation</span>}
        {!isChecklist && !isEscalation && refs.length === 0 && (
          <span class="cm-faq__badge cm-faq__badge--neutral">Reference</span>
        )}
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3 }}>
        {entry.title}
      </h3>
      {isTwoTier ? (
        <TwoTierBody entry={entry} decorate={decorate} />
      ) : (
        <LegacyItemsBody items={entry.items ?? []} decorate={decorate} />
      )}
      {cited.length > 0 && (
        <ol class="faq-references">
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
      )}
    </div>
  );
}

function TwoTierBody({ entry, decorate }: { entry: ModuleFaqEntry; decorate: (html: string) => string }): JSX.Element {
  const subQuestions = entry.sub_questions ?? [];
  return (
    <div>
      {/* First layer — scannable bottom-line answer */}
      <div
        class="markdown-body cm-faq__first-layer"
        style={{ fontSize: 12.5, lineHeight: 1.5 }}
        dangerouslySetInnerHTML={{ __html: decorate(entry.first_layer_html ?? '') }}
      />
      {/* SmartPhrase note pill */}
      {entry.smartphrase_note && (
        <div class="cm-faq__sp-note" style={{ margin: '10px 0 0' }}>
          <span class="cm-faq__sp-pill">SmartPhrase</span>
          <span style={{ fontSize: 12, opacity: 0.85 }}>{entry.smartphrase_note}</span>
        </div>
      )}
      {/* Consult decision point pill */}
      {entry.consult_decision_point && (
        <ConsultDecisionPointPill point={entry.consult_decision_point} />
      )}
      {/* Sub-questions — default-closed expanders */}
      {subQuestions.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, opacity: 0.6, margin: '0 0 6px' }}>
            More detail
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {subQuestions.map((qa, i) => (
              <SubQuestionRow key={i} qa={qa} decorate={decorate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LegacyItemsBody({ items, decorate }: { items: { question: string; answer_html: string }[]; decorate: (html: string) => string }): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((qa, i) => (
        <div key={i}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: 'var(--type-color, var(--accent))' }}>
            {qa.question}
          </div>
          <div
            class="markdown-body"
            style={{ fontSize: 12.5, lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{ __html: decorate(qa.answer_html) }}
          />
        </div>
      ))}
    </div>
  );
}

function SubQuestionRow({ qa, decorate }: { qa: { question: string; answer_html: string }; decorate: (html: string) => string }): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <div class="cm-faq__subq" style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, overflow: 'hidden' }}>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        aria-expanded={open}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '8px 10px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          font: 'inherit',
          fontSize: 12,
          lineHeight: 1.35,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          fontWeight: 600,
        }}
      >
        <span style={{ flex: 1 }}>{qa.question}</span>
        <span style={{ flexShrink: 0, opacity: 0.45, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>▾</span>
      </button>
      {open && (
        <div
          class="markdown-body"
          style={{ padding: '0 10px 10px', fontSize: 12.5, lineHeight: 1.5 }}
          dangerouslySetInnerHTML={{ __html: decorate(qa.answer_html) }}
        />
      )}
    </div>
  );
}

function ConsultDecisionPointPill({ point }: { point: NonNullable<ModuleFaqEntry['consult_decision_point']> }): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <div class="cm-faq__consult-dp" style={{ margin: '10px 0 0' }}>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          border: '1px solid rgba(124, 58, 237, 0.35)',
          background: 'rgba(124, 58, 237, 0.08)',
          color: '#5b21b6',
          borderRadius: 999,
          cursor: 'pointer',
          font: 'inherit',
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        <span>Consult decision point</span>
        {point.trigger_label && (
          <span style={{ fontSize: 10, opacity: 0.7 }}>· {point.trigger_label}</span>
        )}
        <span style={{ fontSize: 9, opacity: 0.55, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>▾</span>
      </button>
      {open && (
        <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(124, 58, 237, 0.05)', borderRadius: 6, fontSize: 12, lineHeight: 1.5, fontStyle: 'italic' }}>
          {point.prefill_text}
        </div>
      )}
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

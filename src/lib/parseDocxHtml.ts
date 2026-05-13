// DOCX → ModuleData parser. Ported from vanilla Meridian's parseDocxHtml in
// ~/meridian/index-rendered.html (lines 7282–7491). Same format guide:
// see ~/meridian/meridian-docx-format-guide.txt.
//
// Pipeline: caller passes raw DOCX bytes through mammoth.convertToHtml first;
// that produces an HTML string with H1/H2/H3/p elements driven by Word's
// Heading 1/2/3 and Normal styles. This function walks that HTML and emits
// a ModuleData.
//
// Schema versions handled:
//   1.0.0 — flat checklist/escalation/FAQ; plain-string references; no
//           inline `[ref:X]` markers.
//   1.1.0 — adds structured `references[]` objects + inline `[ref:X]` markers.
//   1.2.0 — adds module-level `consults[]` (driven by the consult-builder).
//   1.3.0 — Simplified/Stratified Pass: per-FAQ-entry `first_layer_html` +
//           `sub_questions[]` two-tier shape, `smartphrase_note`,
//           `consult_decision_point`, and module-level `smartphrases[]`
//           registry. Discriminated by presence of "Sub-question:" /
//           "First Layer:" / "SmartPhrase note:" markers in the body.
//
// References-merge policy: when re-importing a DOCX into an existing module
// (caller supplies `existingModule` whose module_id matches the parsed
// title), we union the DOCX-extracted references with the existing ones
// keyed by `ref_id`. Existing-JSON refs win on conflict — clinical leadership
// editing in Word may abbreviate citations, and the JSON form is canonical.

import type {
  ModuleData,
  ModuleFaqEntry,
  ModuleFaqQA,
  ModuleReference,
  ModuleSmartPhrase,
  ModuleConsultDecisionPoint,
} from '../types';

interface PartialFaq extends Omit<ModuleFaqEntry, 'items' | 'referenced_by' | 'sub_questions'> {
  items: ModuleFaqQA[];
  sub_questions: ModuleFaqQA[];
  referenced_by: string[];
  // Accumulators for current first-layer block + open consult-decision-point
  // capture state.
  _firstLayerParts: string[];
  _pendingConsultTrigger: string | null;
}

type Section = 'intro' | 'checklist' | 'green_zone' | 'escalation' | 'context' | 'footer' | 'faq' | 'references' | 'smartphrases' | null;
type FaqMode = 'firstLayer' | 'subQuestion' | 'item' | null;

// Em-dash (U+2014), en-dash (U+2013), and ASCII hyphen are all tolerated in
// "First Layer — Caption" and "[id] — label" forms.
const DASH_PATTERN = '[\\u2014\\u2013-]';

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '');
}

export function parseDocxHtml(html: string, existingModule?: ModuleData): ModuleData {
  const div = document.createElement('div');
  div.innerHTML = sanitizeHtml(html);

  const mod: ModuleData = {
    schema_version: '1.0.0',
    module_id: '',
    default_title: '',
    landing_intro: '',
    checklist_section_label: 'Before you decide — verify all four',
    checklist: [],
    green_zone: { zone_label: '', narrative_html: '', smartphrase: undefined },
    escalation_section_label: 'Escalate if any apply',
    escalation: [],
    context_strip: undefined,
    footer_note: '',
    faqs: [],
    references: [],
  };

  let currentSection: Section = null;
  let currentFaq: PartialFaq | null = null;
  let currentQA: { question: string; answer_parts: string[] } | null = null;
  let faqMode: FaqMode = null;
  // 1.3.0 markers seen → bump version stamp at end.
  let sawTwoTierMarkers = false;
  let sawRefMarkers = false;
  let sawConsultsConcept = false;

  function flushQA(): void {
    if (currentQA && currentFaq) {
      const qa: ModuleFaqQA = {
        question: currentQA.question,
        answer_html: currentQA.answer_parts.join('\n'),
      };
      if (faqMode === 'subQuestion') currentFaq.sub_questions.push(qa);
      else currentFaq.items.push(qa);
      currentQA = null;
    }
  }

  function flushFaq(): void {
    flushQA();
    if (currentFaq) {
      // Finalize first-layer accumulator into a single HTML string.
      const firstLayer = currentFaq._firstLayerParts.join('\n').trim();
      const entry: ModuleFaqEntry = {
        faq_id: currentFaq.faq_id,
        topic: currentFaq.topic,
        title: currentFaq.title,
        referenced_by: currentFaq.referenced_by,
      };
      if (firstLayer.length > 0) entry.first_layer_html = firstLayer;
      if (currentFaq.sub_questions.length > 0) entry.sub_questions = currentFaq.sub_questions;
      if (currentFaq.items.length > 0) entry.items = currentFaq.items;
      if (currentFaq.smartphrase_note) entry.smartphrase_note = currentFaq.smartphrase_note;
      if (currentFaq.consult_decision_point) entry.consult_decision_point = currentFaq.consult_decision_point;
      mod.faqs.push(entry);
      currentFaq = null;
      faqMode = null;
    }
  }

  const elements = Array.from(div.children) as HTMLElement[];
  for (const el of elements) {
    const tag = el.tagName.toLowerCase();
    const text = (el.textContent ?? '').trim();

    if (text.startsWith('>>>')) continue;
    if (/^[─]{5,}$/.test(text)) continue;
    if (!text && tag !== 'table' && tag !== 'ul' && tag !== 'ol') continue;

    if (text.includes('[ref:')) sawRefMarkers = true;

    if (tag === 'h1') {
      mod.default_title = text;
      const titlePart = text.split(' — ')[0].split(' - ')[0];
      mod.module_id = titlePart.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      continue;
    }

    if (tag === 'h2') {
      flushFaq();
      const sectionName = text.toLowerCase();
      if (sectionName === 'introduction') currentSection = 'intro';
      else if (sectionName === 'checklist items') currentSection = 'checklist';
      else if (sectionName === 'green zone') currentSection = 'green_zone';
      else if (sectionName === 'escalation items') currentSection = 'escalation';
      else if (sectionName === 'context') currentSection = 'context';
      else if (sectionName === 'footer') currentSection = 'footer';
      else if (sectionName === 'faq reference') currentSection = 'faq';
      else if (sectionName === 'references') currentSection = 'references';
      else if (sectionName === 'smartphrases') { currentSection = 'smartphrases'; sawTwoTierMarkers = true; }
      else currentSection = null;
      continue;
    }

    if (tag === 'h3') {
      const idMatch = text.match(/^\[([^\]]+)\]\s*(.*)/);
      const itemId = idMatch ? idMatch[1] : text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const itemText = idMatch ? idMatch[2] : text;

      if (currentSection === 'checklist') {
        mod.checklist.push({
          item_id: itemId,
          position: mod.checklist.length + 1,
          statement: itemText,
          faq_ref: itemId,
        });
      } else if (currentSection === 'escalation') {
        mod.escalation.push({
          item_id: itemId,
          position: mod.escalation.length + 1,
          statement: itemText,
          faq_ref: itemId,
        });
      } else if (currentSection === 'faq') {
        flushFaq();
        currentFaq = {
          faq_id: itemId,
          topic: itemText,
          title: '',
          referenced_by: [],
          items: [],
          sub_questions: [],
          _firstLayerParts: [],
          _pendingConsultTrigger: null,
        };
        faqMode = null;
      }
      continue;
    }

    if (currentSection === 'intro' && tag === 'p') {
      mod.landing_intro = text;
      continue;
    }

    if (currentSection === 'green_zone' && tag === 'p') {
      const fieldMatch = text.match(/^(Label|Narrative|SmartPhrase):\s*(.*)/);
      if (fieldMatch) {
        const [, field, val] = fieldMatch;
        if (field === 'Label') mod.green_zone.zone_label = val;
        else if (field === 'Narrative') mod.green_zone.narrative_html = `<p>${escHtml(val)}</p>`;
        else if (field === 'SmartPhrase') mod.green_zone.smartphrase = val || undefined;
      }
      continue;
    }

    if (currentSection === 'context' && tag === 'p') {
      const fieldMatch = text.match(/^(Label|Text):\s*(.*)/);
      if (fieldMatch) {
        if (!mod.context_strip) mod.context_strip = { label: '', text: '' };
        if (fieldMatch[1] === 'Label') mod.context_strip.label = fieldMatch[2];
        else mod.context_strip.text = fieldMatch[2];
      }
      continue;
    }

    if (currentSection === 'footer' && tag === 'p') {
      mod.footer_note = text;
      continue;
    }

    if (currentSection === 'references' && tag === 'p') {
      if (!mod.references) mod.references = [];
      const structured = text.match(/^\[([a-z0-9-]+)\]\s*(.+?)(?:\s+(https?:\/\/\S+))?$/i);
      if (structured) {
        mod.references.push({
          ref_id: structured[1],
          citation: structured[2].trim(),
          url: structured[3],
        });
      } else {
        mod.references.push(text);
      }
      continue;
    }

    if (currentSection === 'smartphrases' && tag === 'p') {
      // Format: `[.ID] (confirmed|future) — description or text`
      const m = text.match(/^\[(\.[A-Z0-9-]+)\]\s*\((confirmed|future)\)\s*[—–-]\s*(.*)$/);
      if (m) {
        if (!mod.smartphrases) mod.smartphrases = [];
        const sp: ModuleSmartPhrase = {
          id: m[1],
          status: m[2] as 'confirmed' | 'future',
        };
        if (sp.status === 'confirmed') sp.text = m[3];
        else sp.description = m[3];
        mod.smartphrases.push(sp);
      }
      continue;
    }

    if (currentSection === 'faq' && currentFaq) {
      // FAQ Title:
      if (tag === 'p') {
        const titleMatch = text.match(/^FAQ Title:\s*(.*)/);
        if (titleMatch) { currentFaq.title = titleMatch[1]; continue; }

        // SmartPhrase note: stays attached to the entry, not body content.
        const spNoteMatch = text.match(/^SmartPhrase note:\s*(.+)$/);
        if (spNoteMatch) {
          flushQA();
          currentFaq.smartphrase_note = spNoteMatch[1].trim();
          sawTwoTierMarkers = true;
          continue;
        }

        // Consult trigger: + Consult prefill: pair → structured field.
        const cTrigMatch = text.match(/^Consult trigger:\s*(.+)$/);
        if (cTrigMatch) {
          flushQA();
          currentFaq._pendingConsultTrigger = cTrigMatch[1].trim();
          sawTwoTierMarkers = true;
          sawConsultsConcept = true;
          continue;
        }
        const cPrefillMatch = text.match(/^Consult prefill:\s*(.+)$/);
        if (cPrefillMatch) {
          flushQA();
          const dp: ModuleConsultDecisionPoint = { prefill_text: cPrefillMatch[1].trim() };
          if (currentFaq._pendingConsultTrigger) dp.trigger_label = currentFaq._pendingConsultTrigger;
          currentFaq.consult_decision_point = dp;
          currentFaq._pendingConsultTrigger = null;
          sawTwoTierMarkers = true;
          sawConsultsConcept = true;
          continue;
        }
        // Legacy single-line "Consult decision point:" — captured as prefill_text only.
        const cdpLegacyMatch = text.match(/^Consult decision point:\s*(.+)$/);
        if (cdpLegacyMatch) {
          flushQA();
          currentFaq.consult_decision_point = { prefill_text: cdpLegacyMatch[1].trim() };
          sawTwoTierMarkers = true;
          sawConsultsConcept = true;
          continue;
        }

        // First Layer: / First Layer — Caption: → enter first-layer mode.
        // The optional caption becomes a small caption paragraph above the
        // following block (<table>, <ul>, or <p>).
        const flMatch = text.match(new RegExp(`^First Layer(?:\\s*${DASH_PATTERN}\\s*(.+?))?:\\s*$`));
        if (flMatch) {
          flushQA();
          faqMode = 'firstLayer';
          sawTwoTierMarkers = true;
          const caption = flMatch[1]?.trim();
          if (caption) {
            currentFaq._firstLayerParts.push(`<p class="cm-fl-caption">${escHtml(caption)}</p>`);
          }
          continue;
        }

        // Sub-question: → start a sub-question Q/A in two-tier mode.
        const subQMatch = text.match(/^Sub-question:\s*(.+)$/);
        if (subQMatch) {
          flushQA();
          faqMode = 'subQuestion';
          currentQA = { question: subQMatch[1].trim(), answer_parts: [] };
          sawTwoTierMarkers = true;
          continue;
        }

        // Question: → legacy 1.2.0 item Q/A.
        const qMatch = text.match(/^Question:\s*(.+)$/);
        if (qMatch) {
          flushQA();
          faqMode = 'item';
          currentQA = { question: qMatch[1].trim(), answer_parts: [] };
          continue;
        }

        // Guideline tension / Note: prefixed paragraph inside first-layer →
        // promote to .cm-callout (PDF Section 3 "guideline tension" usage).
        if (faqMode === 'firstLayer') {
          const calloutPrefix = text.match(/^(Guideline tension|Note|Important caveat):\s*(.+)$/);
          if (calloutPrefix) {
            const calloutBody = `<strong>${escHtml(calloutPrefix[1])}:</strong> ${calloutPrefix[2]}`;
            currentFaq._firstLayerParts.push(`<div class="cm-callout">${calloutBody}</div>`);
            continue;
          }
          // Plain prose paragraph in first-layer.
          currentFaq._firstLayerParts.push(`<p>${el.innerHTML}</p>`);
          continue;
        }

        // Content paragraph belongs to current Q/A.
        if (currentQA) {
          currentQA.answer_parts.push(`<p>${el.innerHTML}</p>`);
        }
        continue;
      }

      // Block-level elements that join the current accumulation target.
      if (tag === 'table' || tag === 'ul' || tag === 'ol') {
        const blockHtml = el.outerHTML;
        if (faqMode === 'firstLayer') {
          currentFaq._firstLayerParts.push(blockHtml);
        } else if (currentQA) {
          currentQA.answer_parts.push(blockHtml);
        }
        continue;
      }
    }
  }

  flushFaq();

  // referenced_by: walk checklist + escalation faq_refs.
  const refMap: Record<string, string[]> = {};
  for (const item of [...mod.checklist, ...mod.escalation]) {
    if (item.faq_ref) {
      (refMap[item.faq_ref] ??= []).push(item.item_id);
    }
  }
  for (const faq of mod.faqs) {
    faq.referenced_by = refMap[faq.faq_id] ?? [];
  }

  if (mod.context_strip && !mod.context_strip.label && !mod.context_strip.text) {
    mod.context_strip = undefined;
  }

  // References-merge: if importing into an existing module (same module_id),
  // union with the existing references[] keyed by ref_id; existing wins on
  // conflict (longer / canonical citations). DOCX-only refs are appended.
  if (existingModule && existingModule.module_id === mod.module_id && existingModule.references) {
    const merged = mergeReferences(existingModule.references, mod.references);
    mod.references = merged;
  }

  // Schema-version stamp — replace the hard-coded '1.0.0' with detection.
  if (sawTwoTierMarkers) mod.schema_version = '1.3.0';
  else if (sawConsultsConcept || (existingModule?.schema_version === '1.2.0')) mod.schema_version = '1.2.0';
  else if (sawRefMarkers) mod.schema_version = '1.1.0';
  else mod.schema_version = '1.0.0';

  // Carry forward fields the DOCX doesn't model on round-trip (consults
  // walker, recommended_calculators, glossary). These live only in JSON.
  if (existingModule && existingModule.module_id === mod.module_id) {
    if (existingModule.consults && !mod.consults) mod.consults = existingModule.consults;
    if (existingModule.recommended_calculators && !mod.recommended_calculators) {
      mod.recommended_calculators = existingModule.recommended_calculators;
    }
    if (existingModule.glossary && !mod.glossary) mod.glossary = existingModule.glossary;
    // Merge smartphrases registry: union by id, DOCX wins on conflict for
    // text content, existing-JSON wins for entries not re-stated in DOCX.
    if (existingModule.smartphrases && mod.smartphrases) {
      const byId = new Map<string, ModuleSmartPhrase>();
      for (const sp of existingModule.smartphrases) byId.set(sp.id, sp);
      for (const sp of mod.smartphrases) byId.set(sp.id, sp);
      mod.smartphrases = Array.from(byId.values());
    } else if (existingModule.smartphrases && !mod.smartphrases) {
      mod.smartphrases = existingModule.smartphrases;
    }
  }

  if (!mod.default_title) throw new Error('No module title found (Heading 1).');
  if (mod.checklist.length === 0) throw new Error('No checklist items found.');
  if (mod.checklist.length > 4) throw new Error(`Maximum 4 checklist items allowed (found ${mod.checklist.length}).`);
  if (mod.escalation.length > 10) throw new Error(`Maximum 10 escalation items allowed (found ${mod.escalation.length}).`);

  return mod;
}

function mergeReferences(
  existing: Array<string | ModuleReference>,
  incoming: Array<string | ModuleReference> | undefined,
): Array<string | ModuleReference> {
  const out: Array<string | ModuleReference> = [];
  const seenIds = new Set<string>();
  const seenStrings = new Set<string>();

  for (const ref of existing) {
    if (typeof ref === 'string') {
      if (!seenStrings.has(ref)) { out.push(ref); seenStrings.add(ref); }
    } else {
      if (!seenIds.has(ref.ref_id)) { out.push(ref); seenIds.add(ref.ref_id); }
    }
  }
  for (const ref of incoming ?? []) {
    if (typeof ref === 'string') {
      if (!seenStrings.has(ref)) { out.push(ref); seenStrings.add(ref); }
    } else {
      if (!seenIds.has(ref.ref_id)) { out.push(ref); seenIds.add(ref.ref_id); }
    }
  }
  return out;
}

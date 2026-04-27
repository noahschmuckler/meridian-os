// DOCX → ModuleData parser. Ported from vanilla Meridian's parseDocxHtml in
// ~/meridian/index-rendered.html (lines 7282–7491). Same format guide:
// see ~/meridian/meridian-docx-format-guide.txt.
//
// Pipeline: caller passes raw DOCX bytes through mammoth.convertToHtml first;
// that produces an HTML string with H1/H2/H3/p elements driven by Word's
// Heading 1/2/3 and Normal styles. This function walks that HTML and emits
// a ModuleData matching the existing schema_version 1.0.0 format.

import type { ModuleData, ModuleChecklistItem, ModuleEscalationItem, ModuleFaqEntry } from '../types';

interface PartialFaq extends Omit<ModuleFaqEntry, 'items' | 'referenced_by'> {
  items: { question: string; answer_html: string }[];
  referenced_by: string[];
}

type Section = 'intro' | 'checklist' | 'green_zone' | 'escalation' | 'context' | 'footer' | 'faq' | 'references' | null;

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

export function parseDocxHtml(html: string): ModuleData {
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

  function flushQA(): void {
    if (currentQA && currentFaq) {
      currentFaq.items.push({
        question: currentQA.question,
        answer_html: currentQA.answer_parts.join('\n'),
      });
      currentQA = null;
    }
  }

  function flushFaq(): void {
    flushQA();
    if (currentFaq) {
      mod.faqs.push({
        faq_id: currentFaq.faq_id,
        topic: currentFaq.topic,
        title: currentFaq.title,
        referenced_by: currentFaq.referenced_by,
        items: currentFaq.items,
      });
      currentFaq = null;
    }
  }

  const elements = Array.from(div.children) as HTMLElement[];
  for (const el of elements) {
    const tag = el.tagName.toLowerCase();
    const text = (el.textContent ?? '').trim();

    if (text.startsWith('>>>')) continue;
    if (/^[─]{5,}$/.test(text)) continue;
    if (!text) continue;

    if (tag === 'h1') {
      mod.default_title = text;
      const titlePart = text.split(' — ')[0].split(' — ')[0];
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
      continue;
    }

    if (tag === 'h3') {
      const idMatch = text.match(/^\[([^\]]+)\]\s*(.*)/);
      const itemId = idMatch ? idMatch[1] : text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const itemText = idMatch ? idMatch[2] : text;

      if (currentSection === 'checklist') {
        const item: ModuleChecklistItem = {
          item_id: itemId,
          position: mod.checklist.length + 1,
          statement: itemText,
          faq_ref: itemId,
        };
        mod.checklist.push(item);
      } else if (currentSection === 'escalation') {
        const item: ModuleEscalationItem = {
          item_id: itemId,
          position: mod.escalation.length + 1,
          statement: itemText,
          faq_ref: itemId,
        };
        mod.escalation.push(item);
      } else if (currentSection === 'faq') {
        flushFaq();
        currentFaq = {
          faq_id: itemId,
          topic: itemText,
          title: '',
          referenced_by: [],
          items: [],
        };
      }
      continue;
    }

    if (tag === 'p') {
      if (currentSection === 'intro') {
        mod.landing_intro = text;
        continue;
      }

      if (currentSection === 'green_zone') {
        const fieldMatch = text.match(/^(Label|Narrative|SmartPhrase):\s*(.*)/);
        if (fieldMatch) {
          const [, field, val] = fieldMatch;
          if (field === 'Label') mod.green_zone.zone_label = val;
          else if (field === 'Narrative') mod.green_zone.narrative_html = `<p>${escHtml(val)}</p>`;
          else if (field === 'SmartPhrase') mod.green_zone.smartphrase = val || undefined;
        }
        continue;
      }

      if (currentSection === 'context') {
        const fieldMatch = text.match(/^(Label|Text):\s*(.*)/);
        if (fieldMatch) {
          if (!mod.context_strip) mod.context_strip = { label: '', text: '' };
          if (fieldMatch[1] === 'Label') mod.context_strip.label = fieldMatch[2];
          else mod.context_strip.text = fieldMatch[2];
        }
        continue;
      }

      if (currentSection === 'footer') {
        mod.footer_note = text;
        continue;
      }

      if (currentSection === 'references') {
        if (!mod.references) mod.references = [];
        mod.references.push(text);
        continue;
      }

      if (currentSection === 'faq' && currentFaq) {
        const titleMatch = text.match(/^FAQ Title:\s*(.*)/);
        if (titleMatch) {
          currentFaq.title = titleMatch[1];
          continue;
        }
        const qMatch = text.match(/^Question:\s*(.*)/);
        if (qMatch) {
          flushQA();
          currentQA = { question: qMatch[1], answer_parts: [] };
          continue;
        }
        if (currentQA) {
          currentQA.answer_parts.push(`<p>${el.innerHTML}</p>`);
        }
        continue;
      }
    }
  }

  flushFaq();

  // Build referenced_by from checklist/escalation faq_refs
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

  if (!mod.default_title) throw new Error('No module title found (Heading 1).');
  if (mod.checklist.length === 0) throw new Error('No checklist items found.');
  if (mod.checklist.length > 4) throw new Error(`Maximum 4 checklist items allowed (found ${mod.checklist.length}).`);
  if (mod.escalation.length > 10) throw new Error(`Maximum 10 escalation items allowed (found ${mod.escalation.length}).`);

  return mod;
}

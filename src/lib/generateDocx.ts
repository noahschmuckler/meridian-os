// Module → DOCX. Ported from ~/meridian/generate_docx.py.
//
// Output is round-trippable: the headings and field markers match what
// parseDocxHtml expects, so a user can export → edit in Word → re-import via
// the clinical-tools "Import .docx" button.

import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from 'docx';
import type { ModuleData, ModuleFaqEntry, ModuleFaqQA, ModuleSmartPhrase } from '../types';
import { normalizeReferences, stripRefMarkers } from './refMarkers';

const GREEN = '1A5C3A';
const DARK = '1C1A16';
const GRAY = '6B6560';
const LIGHT_GRAY = '999999';

function htmlToPlain(html: string): string {
  return stripRefMarkers(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' '),
  ).trim();
}

function instruction(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 40, after: 80 },
    children: [
      new TextRun({
        text: '>>> ' + text,
        size: 18,
        color: LIGHT_GRAY,
        italics: true,
      }),
    ],
  });
}

function field(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: label + ': ', bold: true, size: 22, color: DARK }),
      new TextRun({ text: value, size: 22, color: DARK }),
    ],
  });
}

function separator(): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({ text: '─'.repeat(60), size: 16, color: LIGHT_GRAY }),
    ],
  });
}

function heading(text: string, level: 'H1' | 'H2' | 'H3'): Paragraph {
  const map = {
    H1: HeadingLevel.HEADING_1,
    H2: HeadingLevel.HEADING_2,
    H3: HeadingLevel.HEADING_3,
  };
  return new Paragraph({
    heading: map[level],
    children: [
      new TextRun({
        text,
        color: level === 'H3' ? DARK : GREEN,
        size: level === 'H1' ? 36 : level === 'H2' ? 28 : 22,
        bold: true,
      }),
    ],
  });
}

function bodyParagraph(text: string, opts: { size?: number; color?: string; italics?: boolean; indent?: number; spaceAfter?: number } = {}): Paragraph {
  return new Paragraph({
    spacing: { after: opts.spaceAfter ?? 120 },
    indent: opts.indent != null ? { left: opts.indent } : undefined,
    children: [
      new TextRun({
        text,
        size: opts.size ?? 22,
        color: opts.color ?? DARK,
        italics: opts.italics,
      }),
    ],
  });
}

export async function generateModuleDocx(mod: ModuleData): Promise<Blob> {
  const children: Paragraph[] = [];

  // Title
  children.push(heading(mod.default_title, 'H1'));
  children.push(instruction(
    'TEMPLATE FORMAT RULES — Do not delete or reorder section headings. ' +
    'Lines starting with ">>>" are instructions and will be stripped on upload. ' +
    'Item IDs in [brackets] must be unique within the module.',
  ));

  // Introduction
  children.push(heading('Introduction', 'H2'));
  children.push(instruction('One paragraph of introductory context for the clinician.'));
  children.push(bodyParagraph(stripRefMarkers(mod.landing_intro || '')));

  // Checklist items
  children.push(heading('Checklist Items', 'H2'));
  children.push(instruction(
    'Exactly 4 items required. Each item is Heading 3 with format: [item-id] Statement.',
  ));
  for (const item of mod.checklist) {
    children.push(heading(`[${item.item_id}] ${item.statement}`, 'H3'));
  }

  // Green zone
  children.push(heading('Green Zone', 'H2'));
  children.push(instruction(
    'Three fields: Label, Narrative, SmartPhrase. Shown when all checklist items are complete.',
  ));
  children.push(field('Label', mod.green_zone.zone_label));
  children.push(field('Narrative', htmlToPlain(mod.green_zone.narrative_html)));
  children.push(field('SmartPhrase', mod.green_zone.smartphrase ?? ''));

  // Escalations
  children.push(heading('Escalation Items', 'H2'));
  children.push(instruction(
    'Up to 10 items. Each item is Heading 3 with format: [item-id] Statement.',
  ));
  for (const item of mod.escalation) {
    children.push(heading(`[${item.item_id}] ${item.statement}`, 'H3'));
  }

  // Context (optional)
  children.push(heading('Context', 'H2'));
  children.push(instruction(
    'Optional. Brief contextual note. Delete this section if not needed. Two fields: Label, Text.',
  ));
  children.push(field('Label', mod.context_strip?.label ?? ''));
  children.push(field('Text', stripRefMarkers(mod.context_strip?.text ?? '')));

  // Footer
  children.push(heading('Footer', 'H2'));
  children.push(instruction('One line of footer text.'));
  children.push(bodyParagraph(stripRefMarkers(mod.footer_note ?? '')));

  // FAQ Reference
  children.push(heading('FAQ Reference', 'H2'));
  children.push(instruction(
    'One entry per checklist or escalation item. Heading 3: [item-id] Topic. ' +
    'Then "FAQ Title:" then content. Schema 1.3.0 entries use "First Layer:" ' +
    'for the bottom-line answer and "Sub-question:" for "More detail" Q/A. ' +
    'Schema 1.2.0 entries use "Question:" for flat Q/A pairs.',
  ));
  for (const faq of mod.faqs) {
    children.push(separator());
    children.push(heading(`[${faq.faq_id}] ${faq.topic}`, 'H3'));
    children.push(field('FAQ Title', faq.title));
    emitFaqBody(children, faq);
  }

  // SmartPhrases registry (schema 1.3.0+ — optional)
  if (mod.smartphrases && mod.smartphrases.length > 0) {
    children.push(heading('SmartPhrases', 'H2'));
    children.push(instruction(
      'Module-level SmartPhrase registry. Format: ' +
      '[.ID] (confirmed|future) — text or description.',
    ));
    for (const sp of mod.smartphrases) {
      children.push(bodyParagraph(formatSmartPhrase(sp), { size: 20, color: GRAY }));
    }
  }

  // References (optional)
  // v1.1.0 modules carry `{ ref_id, citation, url }` objects; v1.0.0 modules
  // carry plain strings. We serialize objects as `[ref-id] Citation. URL` so
  // parseDocxHtml can recover the structured shape on round-trip.
  const refs = normalizeReferences(mod.references);
  if (refs.length > 0) {
    children.push(heading('References', 'H2'));
    children.push(instruction(
      'Optional. One reference per paragraph. v1.1.0 format: ' +
      '[ref-id] Citation. URL — preserved for round-trip.',
    ));
    for (const ref of refs) {
      const looksSynthetic = /^ref-\d+$/.test(ref.ref_id);
      const line = looksSynthetic
        ? ref.citation + (ref.url ? ` ${ref.url}` : '')
        : `[${ref.ref_id}] ${ref.citation}` + (ref.url ? ` ${ref.url}` : '');
      children.push(bodyParagraph(line, { size: 20, color: GRAY }));
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Segoe UI', size: 22 } },
      },
    },
    sections: [{ children }],
  });

  return await Packer.toBlob(doc);
}

// FAQ body emitter. Branches on schema 1.3.0 two-tier shape (first_layer_html
// + sub_questions) vs legacy flat items[] (1.2.0 and earlier). The parser
// reads the same markers we emit here, so the round-trip is byte-stable on
// the marker layer.
function emitFaqBody(children: Paragraph[], faq: ModuleFaqEntry): void {
  const hasTwoTier = typeof faq.first_layer_html === 'string' && faq.first_layer_html.length > 0;

  if (hasTwoTier) {
    // First-layer body — single HTML chunk; we walk it block-by-block so
    // the DOCX renders prose / bullets / tables / callouts as separate
    // paragraphs instead of one flattened blob.
    children.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
    children.push(field('First Layer', ''));
    for (const block of htmlToBlocks(faq.first_layer_html ?? '')) {
      children.push(bodyParagraph(block.text, {
        size: 20,
        color: block.kind === 'callout' ? DARK : GRAY,
        indent: 360,
        spaceAfter: 120,
        italics: block.kind === 'caption',
      }));
    }

    if (faq.smartphrase_note) {
      children.push(field('SmartPhrase note', faq.smartphrase_note));
    }

    if (faq.consult_decision_point) {
      if (faq.consult_decision_point.trigger_label) {
        children.push(field('Consult trigger', faq.consult_decision_point.trigger_label));
      }
      children.push(field('Consult prefill', faq.consult_decision_point.prefill_text));
    }

    for (const qa of faq.sub_questions ?? []) {
      children.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
      emitQA(children, qa, 'Sub-question');
    }
    return;
  }

  // Legacy 1.2.0 path — flat Question: + answer pairs.
  for (const qa of faq.items ?? []) {
    children.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
    emitQA(children, qa, 'Question');
  }
}

function emitQA(children: Paragraph[], qa: ModuleFaqQA, label: 'Question' | 'Sub-question'): void {
  children.push(field(label, qa.question));
  children.push(bodyParagraph(htmlToPlain(qa.answer_html), { size: 20, color: GRAY, indent: 360, spaceAfter: 160 }));
}

// Decompose first_layer_html into a sequence of (kind, text) blocks for DOCX
// emission. Recognized:
//   - <p class="cm-fl-caption">…</p>      → kind: 'caption' (italic)
//   - <div class="cm-callout">…</div>     → kind: 'callout'
//   - <ul>/<ol> with <li> children        → kind: 'bullet' (one per li)
//   - <table> with rows                   → kind: 'tableRow' (one per row, pipe-joined)
//   - <p>…</p> and any other prose        → kind: 'prose'
function htmlToBlocks(html: string): Array<{ kind: 'prose' | 'caption' | 'callout' | 'bullet' | 'tableRow'; text: string }> {
  if (typeof document === 'undefined') return [{ kind: 'prose', text: htmlToPlain(html) }];
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const blocks: Array<{ kind: 'prose' | 'caption' | 'callout' | 'bullet' | 'tableRow'; text: string }> = [];
  for (const el of Array.from(tmp.children) as HTMLElement[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'p' && el.classList.contains('cm-fl-caption')) {
      blocks.push({ kind: 'caption', text: htmlToPlain(el.innerHTML) });
    } else if (tag === 'div' && el.classList.contains('cm-callout')) {
      blocks.push({ kind: 'callout', text: htmlToPlain(el.innerHTML) });
    } else if (tag === 'ul' || tag === 'ol') {
      for (const li of Array.from(el.querySelectorAll('li')) as HTMLElement[]) {
        blocks.push({ kind: 'bullet', text: '• ' + htmlToPlain(li.innerHTML) });
      }
    } else if (tag === 'table') {
      for (const row of Array.from(el.querySelectorAll('tr')) as HTMLElement[]) {
        const cells = (Array.from(row.querySelectorAll('th, td')) as HTMLElement[]).map((c) => htmlToPlain(c.innerHTML));
        blocks.push({ kind: 'tableRow', text: cells.join(' | ') });
      }
    } else {
      blocks.push({ kind: 'prose', text: htmlToPlain(el.innerHTML) });
    }
  }
  return blocks;
}

function formatSmartPhrase(sp: ModuleSmartPhrase): string {
  const body = sp.status === 'confirmed' ? (sp.text ?? '') : (sp.description ?? '');
  return `[${sp.id}] (${sp.status}) — ${body}`;
}

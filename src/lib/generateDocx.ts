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
import type { ModuleData } from '../types';

const GREEN = '1A5C3A';
const DARK = '1C1A16';
const GRAY = '6B6560';
const LIGHT_GRAY = '999999';

function htmlToPlain(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
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
  children.push(bodyParagraph(mod.landing_intro || ''));

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
  children.push(field('Text', mod.context_strip?.text ?? ''));

  // Footer
  children.push(heading('Footer', 'H2'));
  children.push(instruction('One line of footer text.'));
  children.push(bodyParagraph(mod.footer_note ?? ''));

  // FAQ Reference
  children.push(heading('FAQ Reference', 'H2'));
  children.push(instruction(
    'One entry per checklist or escalation item. Heading 3: [item-id] Topic. ' +
    'Then "FAQ Title:" then pairs of "Question:" and answer paragraphs.',
  ));
  for (const faq of mod.faqs) {
    children.push(separator());
    children.push(heading(`[${faq.faq_id}] ${faq.topic}`, 'H3'));
    children.push(field('FAQ Title', faq.title));
    for (const qa of faq.items) {
      children.push(new Paragraph({ children: [new TextRun({ text: '' })] })); // spacer
      children.push(field('Question', qa.question));
      children.push(bodyParagraph(htmlToPlain(qa.answer_html), { size: 20, color: GRAY, indent: 360, spaceAfter: 160 }));
    }
  }

  // References (optional)
  if (mod.references && mod.references.length > 0) {
    children.push(heading('References', 'H2'));
    children.push(instruction('Optional. One reference per paragraph.'));
    for (const ref of mod.references) {
      children.push(bodyParagraph(ref, { size: 20, color: GRAY }));
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

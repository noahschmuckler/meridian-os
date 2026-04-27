// Module → PPTX. Adapted from ~/meridian/generate_pptx.py.
//
// Produces a deck with: title slide, checklist slide, escalation slide, one
// slide per FAQ topic, and a footer/references slide. Uses the Mondrian
// palette (green for the success/checklist content, red for escalations).

import pptxgen from 'pptxgenjs';
import type { ModuleData } from '../types';

const COLOR_DARK = '1C1A16';
const COLOR_GREEN = '0F6B42';
const COLOR_RED = 'D92E2E';
const COLOR_BLUE = '1F4CAE';
const COLOR_GRAY = '6B6560';
const COLOR_LIGHT_BG = 'F7F7F4';

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

export async function generateModulePptx(mod: ModuleData): Promise<Blob> {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = mod.default_title;

  // ── Title slide ──────────────────────────────────────────────
  const title = pres.addSlide();
  title.background = { color: COLOR_LIGHT_BG };
  title.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.4, fill: { color: COLOR_GREEN }, line: { color: COLOR_GREEN } });
  title.addText(mod.default_title, {
    x: 0.6, y: 1.6, w: 12.13, h: 1.6,
    fontFace: 'Calibri', fontSize: 38, bold: true, color: COLOR_DARK,
    align: 'left', valign: 'top',
  });
  title.addText(mod.landing_intro, {
    x: 0.6, y: 3.3, w: 12.13, h: 3.0,
    fontFace: 'Calibri', fontSize: 16, color: COLOR_GRAY, italic: true,
    align: 'left', valign: 'top',
  });
  if (mod.footer_note) {
    title.addText(mod.footer_note, {
      x: 0.6, y: 6.6, w: 12.13, h: 0.6,
      fontFace: 'Calibri', fontSize: 9, color: COLOR_GRAY, italic: true,
    });
  }

  // ── Checklist slide ──────────────────────────────────────────
  const cl = pres.addSlide();
  cl.background = { color: COLOR_LIGHT_BG };
  cl.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.4, fill: { color: COLOR_GREEN }, line: { color: COLOR_GREEN } });
  cl.addText(mod.checklist_section_label, {
    x: 0.6, y: 0.7, w: 12.13, h: 0.7,
    fontFace: 'Calibri', fontSize: 26, bold: true, color: COLOR_GREEN,
  });
  let y = 1.6;
  for (const item of mod.checklist) {
    cl.addShape('rect', { x: 0.6, y, w: 0.4, h: 0.4, fill: { color: 'FFFFFF' }, line: { color: COLOR_DARK, width: 1.5 } });
    cl.addText(`${item.position}`, {
      x: 0.6, y, w: 0.4, h: 0.4,
      fontFace: 'Calibri', fontSize: 14, bold: true, color: COLOR_GREEN,
      align: 'center', valign: 'middle',
    });
    cl.addText(item.statement, {
      x: 1.2, y, w: 11.5, h: 0.5,
      fontFace: 'Calibri', fontSize: 16, color: COLOR_DARK,
      valign: 'top',
    });
    y += 0.85;
  }
  // Green zone footer
  if (mod.green_zone.zone_label) {
    cl.addShape('rect', {
      x: 0.6, y: 6.3, w: 12.13, h: 0.85,
      fill: { color: 'EBF6EE' }, line: { color: COLOR_GREEN, width: 1 },
    });
    cl.addText(`✓  ${mod.green_zone.zone_label}` + (mod.green_zone.smartphrase ? `   ${mod.green_zone.smartphrase}` : ''), {
      x: 0.8, y: 6.45, w: 11.8, h: 0.55,
      fontFace: 'Calibri', fontSize: 13, color: COLOR_GREEN, bold: true,
    });
  }

  // ── Escalation slide ─────────────────────────────────────────
  const esc = pres.addSlide();
  esc.background = { color: COLOR_LIGHT_BG };
  esc.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.4, fill: { color: COLOR_RED }, line: { color: COLOR_RED } });
  esc.addText(mod.escalation_section_label, {
    x: 0.6, y: 0.7, w: 12.13, h: 0.7,
    fontFace: 'Calibri', fontSize: 26, bold: true, color: COLOR_RED,
  });
  y = 1.6;
  for (const item of mod.escalation) {
    esc.addShape('ellipse', { x: 0.6, y, w: 0.4, h: 0.4, fill: { color: 'FFFFFF' }, line: { color: COLOR_RED, width: 1.5 } });
    esc.addText('!', {
      x: 0.6, y, w: 0.4, h: 0.4,
      fontFace: 'Calibri', fontSize: 14, bold: true, color: COLOR_RED,
      align: 'center', valign: 'middle',
    });
    esc.addText(item.statement, {
      x: 1.2, y, w: 11.5, h: 0.5,
      fontFace: 'Calibri', fontSize: 15, color: COLOR_DARK,
      valign: 'top',
    });
    y += 0.7;
    if (y > 6.7) break; // overflow safety
  }
  if (mod.context_strip) {
    esc.addText(`${mod.context_strip.label}: ${mod.context_strip.text}`, {
      x: 0.6, y: 6.7, w: 12.13, h: 0.6,
      fontFace: 'Calibri', fontSize: 9, color: COLOR_GRAY, italic: true,
    });
  }

  // ── FAQ slides (one per FAQ entry) ───────────────────────────
  for (const faq of mod.faqs) {
    const s = pres.addSlide();
    s.background = { color: COLOR_LIGHT_BG };
    s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.4, fill: { color: COLOR_BLUE }, line: { color: COLOR_BLUE } });
    s.addText(faq.topic, {
      x: 0.6, y: 0.6, w: 12.13, h: 0.5,
      fontFace: 'Calibri', fontSize: 14, color: COLOR_BLUE, bold: true,
    });
    s.addText(faq.title, {
      x: 0.6, y: 1.05, w: 12.13, h: 0.7,
      fontFace: 'Calibri', fontSize: 22, color: COLOR_DARK, bold: true,
    });
    let qy = 1.95;
    for (const qa of faq.items) {
      if (qy > 7.0) break;
      s.addText(qa.question, {
        x: 0.6, y: qy, w: 12.13, h: 0.4,
        fontFace: 'Calibri', fontSize: 13, color: COLOR_BLUE, bold: true,
      });
      qy += 0.4;
      const answer = htmlToPlain(qa.answer_html);
      const lines = Math.max(1, Math.ceil(answer.length / 110));
      const h = Math.min(2.4, lines * 0.32);
      s.addText(answer, {
        x: 0.6, y: qy, w: 12.13, h,
        fontFace: 'Calibri', fontSize: 11, color: COLOR_DARK,
      });
      qy += h + 0.12;
    }
  }

  // ── Footer / references slide ────────────────────────────────
  if (mod.references && mod.references.length > 0) {
    const ref = pres.addSlide();
    ref.background = { color: COLOR_LIGHT_BG };
    ref.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.4, fill: { color: COLOR_GRAY }, line: { color: COLOR_GRAY } });
    ref.addText('References', {
      x: 0.6, y: 0.7, w: 12.13, h: 0.7,
      fontFace: 'Calibri', fontSize: 26, bold: true, color: COLOR_DARK,
    });
    let ry = 1.6;
    for (const r of mod.references) {
      if (ry > 7.0) break;
      ref.addText('• ' + r, {
        x: 0.6, y: ry, w: 12.13, h: 0.45,
        fontFace: 'Calibri', fontSize: 11, color: COLOR_GRAY,
      });
      ry += 0.45;
    }
  }

  const out = (await pres.write({ outputType: 'blob' })) as Blob;
  return out;
}

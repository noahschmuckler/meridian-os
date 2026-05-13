// Module → PPTX. Adapted from ~/meridian/generate_pptx.py.
//
// Produces a deck with: title slide, checklist slide, escalation slide, one
// slide per FAQ topic, and a footer/references slide. Uses the Mondrian
// palette (green for the success/checklist content, red for escalations).

import pptxgen from 'pptxgenjs';
import type { ModuleData } from '../types';
import { normalizeReferences, stripRefMarkers } from './refMarkers';

const COLOR_DARK = '1C1A16';
const COLOR_GREEN = '0F6B42';
const COLOR_RED = 'D92E2E';
const COLOR_BLUE = '1F4CAE';
const COLOR_GRAY = '6B6560';
const COLOR_LIGHT_BG = 'F7F7F4';

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
  title.addText(stripRefMarkers(mod.landing_intro), {
    x: 0.6, y: 3.3, w: 12.13, h: 3.0,
    fontFace: 'Calibri', fontSize: 16, color: COLOR_GRAY, italic: true,
    align: 'left', valign: 'top',
  });
  if (mod.footer_note) {
    title.addText(stripRefMarkers(mod.footer_note), {
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
    esc.addText(`${mod.context_strip.label}: ${stripRefMarkers(mod.context_strip.text)}`, {
      x: 0.6, y: 6.7, w: 12.13, h: 0.6,
      fontFace: 'Calibri', fontSize: 9, color: COLOR_GRAY, italic: true,
    });
  }

  // ── FAQ slides (one+ per FAQ entry, paginated) ───────────────
  // Earlier version capped each answer box at 2.4" and silently dropped any
  // QA past qy > 7.0 — for the rewritten ADHD module that meant overlapping
  // text on every long FAQ. Now we paginate: split each answer into chunks
  // sized to fill the remaining slide space, push leftover content onto a
  // continuation slide titled `<title> (cont.)`. Question headers stay with
  // at least one chunk of their answer (no orphaned headers at slide bottom).
  const SLIDE_BOTTOM = 7.1;     // last y where a text box may end
  const QY_FIRST = 1.95;         // start y on a fresh FAQ slide (after topic+title)
  const QY_CONT = 1.5;           // start y on a continuation slide (smaller header)
  const Q_HEIGHT = 0.4;          // question header height
  const LINE_HEIGHT = 0.32;      // approx height of one body line at fontSize 11
  const CHARS_PER_LINE = 110;    // chars per line at our text box width

  function newFaqSlide(faq: typeof mod.faqs[number], isCont: boolean): { slide: ReturnType<typeof pres.addSlide>; qy: number } {
    const s = pres.addSlide();
    s.background = { color: COLOR_LIGHT_BG };
    s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.4, fill: { color: COLOR_BLUE }, line: { color: COLOR_BLUE } });
    s.addText(faq.topic + (isCont ? ' (cont.)' : ''), {
      x: 0.6, y: 0.6, w: 12.13, h: 0.5,
      fontFace: 'Calibri', fontSize: 14, color: COLOR_BLUE, bold: true,
    });
    if (!isCont) {
      s.addText(faq.title, {
        x: 0.6, y: 1.05, w: 12.13, h: 0.7,
        fontFace: 'Calibri', fontSize: 22, color: COLOR_DARK, bold: true,
      });
    }
    return { slide: s, qy: isCont ? QY_CONT : QY_FIRST };
  }

  // Take as much of `text` as fits in `maxChars`, splitting at the last
  // sentence boundary that fits; falls back to last whitespace, then a hard
  // cut. Returns [chunk, remainder]. `text` is assumed already trimmed.
  function takeChunk(text: string, maxChars: number): [string, string] {
    if (text.length <= maxChars) return [text, ''];
    const window = text.slice(0, maxChars);
    let cut = -1;
    for (const m of window.matchAll(/[.!?]\s+(?=[A-Z(0-9])/g)) {
      cut = (m.index ?? 0) + m[0].length;
    }
    if (cut === -1) {
      const lastSpace = window.lastIndexOf(' ');
      cut = lastSpace === -1 ? maxChars : lastSpace + 1;
    }
    return [text.slice(0, cut).trim(), text.slice(cut).trim()];
  }

  for (const faq of mod.faqs) {
    let { slide, qy } = newFaqSlide(faq, false);

    // Schema 1.3.0: first_layer_html + sub_questions[] is the canonical shape.
    // Fall back to legacy items[] for 1.2.0 and earlier. PPTX is a one-way
    // export so we render the first layer as a synthetic "Overview" pseudo-Q/A
    // and the sub-questions inline below.
    const qaList: Array<{ question: string; answer_html: string }> = faq.first_layer_html
      ? [
          { question: 'Overview', answer_html: faq.first_layer_html },
          ...(faq.sub_questions ?? []),
        ]
      : (faq.items ?? []);

    for (const qa of qaList) {
      let questionWritten = false;
      let remaining = htmlToPlain(qa.answer_html);

      while (!questionWritten || remaining.length > 0) {
        const minBlock = (questionWritten ? 0 : Q_HEIGHT) + LINE_HEIGHT * 2; // 2 lines minimum
        if (SLIDE_BOTTOM - qy < minBlock) {
          ({ slide, qy } = newFaqSlide(faq, true));
        }

        if (!questionWritten) {
          slide.addText(qa.question, {
            x: 0.6, y: qy, w: 12.13, h: Q_HEIGHT,
            fontFace: 'Calibri', fontSize: 13, color: COLOR_BLUE, bold: true,
          });
          qy += Q_HEIGHT;
          questionWritten = true;
        }

        if (remaining.length === 0) break;

        const availLines = Math.max(2, Math.floor((SLIDE_BOTTOM - qy) / LINE_HEIGHT));
        const maxChars = availLines * CHARS_PER_LINE;
        const [chunk, rest] = takeChunk(remaining, maxChars);
        const lines = Math.max(1, Math.ceil(chunk.length / CHARS_PER_LINE));
        const h = lines * LINE_HEIGHT;
        slide.addText(chunk, {
          x: 0.6, y: qy, w: 12.13, h,
          fontFace: 'Calibri', fontSize: 11, color: COLOR_DARK,
        });
        qy += h + 0.12;
        remaining = rest;

        // If more remains, the next loop iteration will detect insufficient
        // space and start a continuation slide. Question is already written
        // so it won't repeat.
      }
    }
  }

  // ── Footer / references slide ────────────────────────────────
  // Normalize first so v1.0.0 strings and v1.1.0 objects render the same.
  const refs = normalizeReferences(mod.references);
  if (refs.length > 0) {
    const ref = pres.addSlide();
    ref.background = { color: COLOR_LIGHT_BG };
    ref.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.4, fill: { color: COLOR_GRAY }, line: { color: COLOR_GRAY } });
    ref.addText('References', {
      x: 0.6, y: 0.7, w: 12.13, h: 0.7,
      fontFace: 'Calibri', fontSize: 26, bold: true, color: COLOR_DARK,
    });
    let ry = 1.6;
    for (const r of refs) {
      if (ry > 7.0) break;
      const line = r.citation + (r.url ? ` ${r.url}` : '');
      ref.addText('• ' + line, {
        x: 0.6, y: ry, w: 12.13, h: 0.45,
        fontFace: 'Calibri', fontSize: 11, color: COLOR_GRAY,
      });
      ry += 0.45;
    }
  }

  const out = (await pres.write({ outputType: 'blob' })) as Blob;
  return out;
}

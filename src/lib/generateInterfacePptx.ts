// Interface-simulacrum PPTX export — spec: docs/interface-pptx-export-spec.md
//
// Generates a deck whose slides reproduce the module-mode Meridian interface
// as native PPTX text/shapes, with internal slide-jump hyperlinks wired so
// that clicking an affordance lands on the slide showing the interface's
// reaction. PowerPoint "Save as PDF" retains the jumps, yielding an offline
// single-file interactive PDF for enterprise distribution.
//
// State model (spec §3–§5): one slide per resting state under the imposed
// accordion rule (one expander open at a time — the deliberate divergence
// from the live UI's independent toggles that collapses 2^N state explosion
// into a linear enumeration):
//   home | faq:<id> | sub:<id>:<j> | pill:<id> | dp:<id> | sp:home | sp:<id>
//
// Two-pass generation: Pass 1 enumerates states and paginates content into
// slides (assigning every slide number up front); Pass 2 emits slides, so
// every hyperlink target resolves — no forward-reference problem.
//
// Overflow (spec §7): estimate content height → step font scale down to a
// ~9pt floor → if still overflowing, spill onto "(cont.)" continuation
// slides linked ▼ more / ▲ back. Continuations are internal to one state
// and excluded from the primary state count.

import pptxgen from 'pptxgenjs';
import type { ModuleData, ModuleFaqEntry, ModuleSmartPhrase } from '../types';
import { stripRefMarkers } from './refMarkers';
import { htmlToBlocks, type HtmlBlock } from './htmlBlocks';

type Slide = ReturnType<InstanceType<typeof pptxgen>['addSlide']>;

// ─── Palette (glass.css type-colors + Mondrian neutrals) ────────────────
const DARK = '1C1A16';
const GRAY = '6B6560';
const FAINT = 'A8A49C';
const GREEN = '0F6B42';
const RED = 'D92E2E';
const BLUE = '1F4CAE';
const PURPLE = '5B21B6';
const BG = 'EFEEE9';
const CARD = 'FDFDFB';
const BORDER = 'DCD9D2';
const GREEN_TINT = 'E9F2EC';
const RED_TINT = 'FBECEC';
const BLUE_TINT = 'EDF2FB';
const CALLOUT_BG = 'EEF3FB';
const CALLOUT_BORDER = 'C7D4EE';
const CHIP_DARK = '3A3835';
const PURPLE_TINT = 'F1EBFB';
const YELLOW_TINT = 'FBF4DC';

const FONT = 'Calibri';

// ─── Frame geometry (spec §6; inches on a 13.33 × 7.5 LAYOUT_WIDE) ──────
const RAIL_X = 0.2;
const RAIL_W = 3.1;
const CHECK_Y = 0.62;
const CHECK_H = 3.58;
const ESC_Y = 4.3;
const ESC_H = 2.68;
const DET_X = 3.5;
const DET_W = 9.6;
const DET_Y = 0.62;
const DET_H = 6.36;
const CONTENT_X = 3.72;
const CONTENT_W = 9.16;
const CONTENT_Y = 1.06;
const CONTENT_BOTTOM = 6.86;
const CONTENT_H = CONTENT_BOTTOM - CONTENT_Y;
const CONT_LINK_H = 0.3; // reserved at panel bottom on paginated states

// ─── Text-height estimation ─────────────────────────────────────────────
// Conservative Calibri metrics: avg glyph ≈ 0.5 × fontPt wide, line ≈ 1.42 ×
// fontPt tall. Estimates only drive layout/pagination; every text box also
// carries fit:'shrink' so a mis-estimate degrades to slightly smaller type,
// never to clipped content.

function charsPerLine(widthIn: number, fontPt: number): number {
  return Math.max(8, Math.floor((widthIn * 72) / (fontPt * 0.5)));
}

function lineH(fontPt: number): number {
  return (fontPt * 1.42) / 72;
}

function estTextH(text: string, widthIn: number, fontPt: number): number {
  const cpl = charsPerLine(widthIn, fontPt);
  let lines = 0;
  for (const seg of text.split('\n')) lines += Math.max(1, Math.ceil(seg.length / cpl));
  return lines * lineH(fontPt) + 0.05;
}

// ─── State enumeration (spec §5.1) ──────────────────────────────────────

interface DeckState {
  kind: 'home' | 'faq' | 'sub' | 'pill' | 'dp' | 'sp-home' | 'sp';
  key: string;
  faq?: ModuleFaqEntry;
  subIndex?: number;
  phrase?: ModuleSmartPhrase;
}

// Mirrors the live pill guard (clinical-module-faq SmartPhraseNotePill): the
// note's `.TRIGGER` must resolve to a registry phrase that carries text.
function resolvePillPhrase(faq: ModuleFaqEntry, mod: ModuleData): ModuleSmartPhrase | undefined {
  if (!faq.smartphrase_note) return undefined;
  const trigger = faq.smartphrase_note.match(/(\.[A-Z0-9-]+)/)?.[1];
  const phrase = trigger ? mod.smartphrases?.find((s) => s.id === trigger) : undefined;
  return phrase?.text ? phrase : undefined;
}

// Mirrors the live focus resolver: checklist/escalation rows write faq_ref
// into focusedItemId; the FAQ bubble matches it against faq_id.
function resolveFaq(mod: ModuleData, faqRef: string): ModuleFaqEntry | undefined {
  return mod.faqs.find((f) => f.faq_id === faqRef);
}

function enumerateStates(mod: ModuleData): DeckState[] {
  const states: DeckState[] = [{ kind: 'home', key: 'home' }];
  for (const faq of mod.faqs) {
    states.push({ kind: 'faq', key: `faq:${faq.faq_id}`, faq });
    (faq.sub_questions ?? []).forEach((_, j) => {
      states.push({ kind: 'sub', key: `sub:${faq.faq_id}:${j}`, faq, subIndex: j });
    });
    const pill = resolvePillPhrase(faq, mod);
    if (pill) states.push({ kind: 'pill', key: `pill:${faq.faq_id}`, faq, phrase: pill });
    if (faq.consult_decision_point) states.push({ kind: 'dp', key: `dp:${faq.faq_id}`, faq });
  }
  states.push({ kind: 'sp-home', key: 'sp:home' });
  for (const sp of mod.smartphrases ?? []) {
    states.push({ kind: 'sp', key: `sp:${sp.id}`, phrase: sp });
  }
  return states;
}

// ─── Build context ──────────────────────────────────────────────────────

interface Ctx {
  mod: ModuleData;
  slideNo: Map<string, number>; // state key → 1-based slide number of its first page
  warnings: string[];
}

// Resolve a state key to a slide number for hyperlinks. Unknown targets fall
// back to home (visible-fallback policy) and log a warning.
function linkTo(ctx: Ctx, key: string): number {
  const n = ctx.slideNo.get(key);
  if (n != null) return n;
  ctx.warnings.push(`unresolved link target "${key}" — routed to home`);
  return ctx.slideNo.get('home') ?? 1;
}

// ─── Render items ───────────────────────────────────────────────────────
// A state's detail-panel content is a vertical flow of items, each with an
// estimated height and a draw closure. Pagination happens on item bounds.

interface Item {
  h: number;
  keepWithNext?: boolean;
  draw: (s: Slide, y: number) => void;
}

// pptxgenjs quirk: a box-level `hyperlink` on addText with array-of-runs text
// is emitted into the XML but its relationship is never registered (r:id comes
// out "rIdundefined" — createHyperlinkRels only walks run options). So linked
// multi-run boxes must carry the hyperlink on every run. One shared object per
// box: the first run registers the rel, siblings reuse its _rId. Never share
// a hyperlink object across boxes/slides (its cached _rId would collide).
interface TextRunLite {
  text: string;
  options?: Record<string, unknown>;
}

function linkRuns(runs: TextRunLite[], slide: number, tooltip?: string): TextRunLite[] {
  const hyperlink = { slide, tooltip };
  return runs.map((r) => ({ text: r.text, options: { ...r.options, hyperlink } }));
}

interface StatePages {
  state: DeckState;
  pages: Item[][];
}

// ─── First-layer / answer HTML block rendering ──────────────────────────

function blockItems(_ctx: Ctx, html: string, scale: number, indent = 0): Item[] {
  const blocks = htmlToBlocks(html);
  const items: Item[] = [];
  const w = CONTENT_W - indent;
  const x = CONTENT_X + indent;
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.kind === 'tableRow') {
      const rows: HtmlBlock[] = [];
      while (i < blocks.length && blocks[i].kind === 'tableRow') rows.push(blocks[i++]);
      items.push(tableItem(rows, x, w, scale));
      continue;
    }
    if (b.kind === 'bullet') {
      const bullets: string[] = [];
      while (i < blocks.length && blocks[i].kind === 'bullet') bullets.push(blocks[i++].text);
      const pt = 10.6 * scale;
      const h = bullets.reduce((acc, t) => acc + estTextH(t, w - 0.3, pt), 0.04);
      items.push({
        h,
        draw: (s, y) => s.addText(
          bullets.map((t) => ({ text: t, options: { bullet: { code: '2022', indent: 10 }, breakLine: true } })),
          { x, y, w, h, fontFace: FONT, fontSize: pt, color: DARK, valign: 'top', fit: 'shrink', lineSpacingMultiple: 1.12 },
        ),
      });
      continue;
    }
    i++;
    if (b.kind === 'callout') {
      const pt = 9.8 * scale;
      const h = estTextH(b.text, w - 0.3, pt) + 0.14;
      items.push({
        h,
        draw: (s, y) => s.addText(b.text, {
          x, y, w, h, shape: 'roundRect', rectRadius: 0.05,
          fill: { color: CALLOUT_BG }, line: { color: CALLOUT_BORDER, width: 1 },
          fontFace: FONT, fontSize: pt, color: DARK, valign: 'middle', fit: 'shrink',
          margin: 6, lineSpacingMultiple: 1.12,
        }),
      });
    } else if (b.kind === 'caption') {
      const pt = 8.8 * scale;
      const h = estTextH(b.text, w, pt);
      items.push({
        h,
        draw: (s, y) => s.addText(b.text, {
          x, y, w, h, fontFace: FONT, fontSize: pt, color: GRAY, italic: true, valign: 'top', fit: 'shrink',
        }),
      });
    } else {
      const pt = 10.8 * scale;
      const h = estTextH(b.text, w, pt);
      items.push({
        h,
        draw: (s, y) => s.addText(b.text, {
          x, y, w, h, fontFace: FONT, fontSize: pt, color: DARK, valign: 'top', fit: 'shrink', lineSpacingMultiple: 1.14,
        }),
      });
    }
  }
  return items;
}

function tableItem(rows: HtmlBlock[], x: number, w: number, scale: number): Item {
  const pt = 9 * scale;
  const nCols = Math.max(1, ...rows.map((r) => r.cells?.length ?? 1));
  // Column widths weighted by longest cell per column, clamped to sane bounds.
  const weights: number[] = [];
  for (let c = 0; c < nCols; c++) {
    weights.push(Math.max(6, ...rows.map((r) => (r.cells?.[c] ?? '').length)));
  }
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const colW = weights.map((wt) => Math.max(0.8, (wt / totalWeight) * w));
  const colScale = w / colW.reduce((a, b) => a + b, 0);
  const colWFinal = colW.map((cw) => cw * colScale);

  let h = 0;
  for (const r of rows) {
    const cellLines = (r.cells ?? [r.text]).map((cell, c) =>
      Math.max(1, Math.ceil(cell.length / charsPerLine(colWFinal[c] - 0.12, pt))));
    h += Math.max(...cellLines) * lineH(pt) + 0.08;
  }

  return {
    h: h + 0.04,
    draw: (s, y) => {
      const tableRows = rows.map((r, ri) => (r.cells ?? [r.text]).map((cell) => ({
        text: cell,
        options: ri === 0
          ? { bold: true, color: 'FFFFFF', fill: { color: BLUE } }
          : { color: DARK, fill: { color: ri % 2 === 0 ? 'F5F4F0' : 'FFFFFF' } },
      })));
      s.addTable(tableRows, {
        x, y, w, colW: colWFinal,
        fontFace: FONT, fontSize: pt,
        border: { type: 'solid', pt: 0.5, color: BORDER },
        valign: 'top', margin: 3,
      });
    },
  };
}

// ─── Collapsed / expanded affordances ───────────────────────────────────

const CHEVRON_DOWN = ' ▾';
const CHEVRON_UP = ' ▴';

function subQuestionRowItem(ctx: Ctx, faq: ModuleFaqEntry, j: number, expanded: boolean, scale: number): Item {
  const qa = (faq.sub_questions ?? [])[j];
  const pt = 10 * scale;
  const q = stripRefMarkers(qa.question);
  const h = estTextH(q, CONTENT_W - 0.5, pt) + 0.12;
  const target = expanded ? `faq:${faq.faq_id}` : `sub:${faq.faq_id}:${j}`;
  const tooltip = expanded ? 'Collapse' : 'Expand answer';
  return {
    h,
    keepWithNext: expanded,
    draw: (s, y) => s.addText(
      linkRuns([
        { text: q, options: { bold: true } },
        { text: expanded ? CHEVRON_UP : CHEVRON_DOWN, options: { color: FAINT } },
      ], linkTo(ctx, target), tooltip),
      {
        x: CONTENT_X, y, w: CONTENT_W, h,
        shape: 'roundRect', rectRadius: 0.04,
        fill: { color: expanded ? BLUE_TINT : 'FFFFFF' },
        line: { color: expanded ? BLUE : BORDER, width: expanded ? 1.25 : 0.75 },
        fontFace: FONT, fontSize: pt, color: DARK, valign: 'middle', margin: 6,
        fit: 'shrink',
      },
    ),
  };
}

function pillRowItem(ctx: Ctx, faq: ModuleFaqEntry, phrase: ModuleSmartPhrase, expanded: boolean, scale: number): Item {
  const pt = 9.5 * scale;
  const h = 0.32;
  const target = expanded ? `faq:${faq.faq_id}` : `pill:${faq.faq_id}`;
  return {
    h,
    keepWithNext: expanded,
    draw: (s, y) => s.addText(
      linkRuns([
        { text: 'SmartPhrase', options: { bold: true, color: '8A6D1A' } },
        { text: `  ${phrase.id}`, options: { bold: true, color: DARK } },
        ...(phrase.status === 'future' ? [{ text: '  future', options: { fontSize: 8 * scale, color: GRAY } }] : []),
        { text: expanded ? CHEVRON_UP : CHEVRON_DOWN, options: { color: FAINT } },
      ], linkTo(ctx, target), expanded ? 'Collapse' : 'Show full SmartPhrase'),
      {
        x: CONTENT_X, y, w: 4.4, h,
        shape: 'roundRect', rectRadius: 0.12,
        fill: { color: expanded ? YELLOW_TINT : 'FFFFFF' },
        line: { color: expanded ? '8A6D1A' : BORDER, width: expanded ? 1.25 : 0.75 },
        fontFace: FONT, fontSize: pt, valign: 'middle', margin: 6, fit: 'shrink',
      },
    ),
  };
}

function dpRowItem(ctx: Ctx, faq: ModuleFaqEntry, expanded: boolean, scale: number): Item {
  const dp = faq.consult_decision_point;
  const pt = 9.5 * scale;
  const h = 0.32;
  const target = expanded ? `faq:${faq.faq_id}` : `dp:${faq.faq_id}`;
  return {
    h,
    keepWithNext: expanded,
    draw: (s, y) => s.addText(
      linkRuns([
        { text: 'Consult decision point', options: { bold: true, color: PURPLE } },
        ...(dp?.trigger_label ? [{ text: ` · ${dp.trigger_label}`, options: { fontSize: 8.5 * scale, color: GRAY } }] : []),
        { text: expanded ? CHEVRON_UP : CHEVRON_DOWN, options: { color: FAINT } },
      ], linkTo(ctx, target), expanded ? 'Collapse' : 'Show consult prefill'),
      {
        x: CONTENT_X, y, w: 4.8, h,
        shape: 'roundRect', rectRadius: 0.12,
        fill: { color: expanded ? PURPLE_TINT : 'FFFFFF' },
        line: { color: expanded ? PURPLE : BORDER, width: expanded ? 1.25 : 0.75 },
        fontFace: FONT, fontSize: pt, valign: 'middle', margin: 6, fit: 'shrink',
      },
    ),
  };
}

function phraseTextItem(text: string, scale: number, indent = 0): Item {
  const pt = 9.3 * scale;
  const w = CONTENT_W - indent;
  const h = estTextH(text, w - 0.2, pt) + 0.14;
  return {
    h,
    draw: (s, y) => s.addText(text, {
      x: CONTENT_X + indent, y, w, h,
      shape: 'roundRect', rectRadius: 0.03,
      fill: { color: 'FFFFFF' }, line: { color: BORDER, width: 1 },
      fontFace: FONT, fontSize: pt, color: DARK, valign: 'top', margin: 6,
      fit: 'shrink', lineSpacingMultiple: 1.15,
    }),
  };
}

// ─── Per-state item builders ────────────────────────────────────────────

function homeItems(ctx: Ctx, scale: number): Item[] {
  const { mod } = ctx;
  const items: Item[] = [];
  items.push({
    h: 0.3,
    draw: (s, y) => s.addText('Click a checklist or escalation row on the left — or pick a topic below.', {
      x: CONTENT_X, y, w: CONTENT_W, h: 0.3,
      fontFace: FONT, fontSize: 10 * scale, color: GRAY, italic: true, valign: 'middle',
    }),
  });
  // FAQ index as a two-column grid drawn as one fixed-height item.
  const faqs = mod.faqs;
  const perCol = Math.ceil(faqs.length / 2);
  const rowH = Math.min(0.66, (CONTENT_H - 0.5) / perCol);
  const colW = (CONTENT_W - 0.2) / 2;
  items.push({
    h: perCol * rowH,
    draw: (s, y) => {
      faqs.forEach((f, i) => {
        const col = Math.floor(i / perCol);
        const row = i % perCol;
        s.addText(
          linkRuns([
            { text: f.topic, options: { bold: true, fontSize: 10 * scale, color: BLUE } },
            { text: '  ►', options: { fontSize: 8 * scale, color: FAINT } },
            { text: '\n' + f.title, options: { fontSize: 8.6 * scale, color: GRAY } },
          ], linkTo(ctx, `faq:${f.faq_id}`), f.title),
          {
            x: CONTENT_X + col * (colW + 0.2), y: y + row * rowH, w: colW, h: rowH - 0.06,
            shape: 'roundRect', rectRadius: 0.03,
            fill: { color: 'FFFFFF' }, line: { color: BORDER, width: 0.75 },
            fontFace: FONT, valign: 'middle', margin: 5, fit: 'shrink',
          },
        );
      });
    },
  });
  return items;
}

interface FaqView {
  expandedSub?: number;
  expandPill?: boolean;
  expandDp?: boolean;
}

function faqItems(ctx: Ctx, faq: ModuleFaqEntry, view: FaqView, scale: number): Item[] {
  const { mod } = ctx;
  const items: Item[] = [];

  // Badge chips — same derivation as the live bubble: referenced_by[]
  // intersected against checklist/escalation item_ids.
  const checklistIds = new Set(mod.checklist.map((c) => c.item_id));
  const escalationIds = new Set(mod.escalation.map((e) => e.item_id));
  const refs = faq.referenced_by ?? [];
  const badges: Array<{ label: string; color: string; tint: string }> = [];
  if (refs.some((r) => checklistIds.has(r))) badges.push({ label: 'CHECKLIST', color: GREEN, tint: GREEN_TINT });
  if (refs.some((r) => escalationIds.has(r))) badges.push({ label: 'ESCALATION', color: RED, tint: RED_TINT });
  if (badges.length === 0) badges.push({ label: 'REFERENCE', color: GRAY, tint: 'F0EFEA' });

  items.push({
    h: 0.24,
    keepWithNext: true,
    draw: (s, y) => {
      let bx = CONTENT_X;
      for (const b of badges) {
        const bw = 0.28 + b.label.length * 0.062;
        s.addText(b.label, {
          x: bx, y, w: bw, h: 0.2,
          shape: 'roundRect', rectRadius: 0.09,
          fill: { color: b.tint }, line: { color: b.color, width: 0.75 },
          fontFace: FONT, fontSize: 7, bold: true, color: b.color, align: 'center', valign: 'middle', margin: 0,
        });
        bx += bw + 0.12;
      }
    },
  });

  const titlePt = 14 * scale;
  const titleH = estTextH(faq.title, CONTENT_W, titlePt);
  items.push({
    h: titleH + 0.04,
    keepWithNext: true,
    draw: (s, y) => s.addText(faq.title, {
      x: CONTENT_X, y, w: CONTENT_W, h: titleH,
      fontFace: FONT, fontSize: titlePt, bold: true, color: DARK, valign: 'top', fit: 'shrink',
    }),
  });

  items.push(...blockItems(ctx, faq.first_layer_html ?? '', scale));

  const pill = resolvePillPhrase(faq, mod);
  if (pill) {
    items.push(pillRowItem(ctx, faq, pill, view.expandPill === true, scale));
    if (view.expandPill) items.push(phraseTextItem(pill.text ?? '', scale, 0.25));
  } else if (faq.smartphrase_note) {
    // Unresolvable note renders as flat text (live-UI parity), no slide.
    const noteText = 'SmartPhrase — ' + faq.smartphrase_note;
    const h = estTextH(noteText, CONTENT_W, 9 * scale);
    items.push({
      h,
      draw: (s, y) => s.addText(noteText, {
        x: CONTENT_X, y, w: CONTENT_W, h,
        fontFace: FONT, fontSize: 9 * scale, color: GRAY, valign: 'top', fit: 'shrink',
      }),
    });
  }

  if (faq.consult_decision_point) {
    items.push(dpRowItem(ctx, faq, view.expandDp === true, scale));
    if (view.expandDp) {
      const pt = 9.5 * scale;
      const text = faq.consult_decision_point.prefill_text;
      const h = estTextH(text, CONTENT_W - 0.45, pt) + 0.14;
      items.push({
        h,
        draw: (s, y) => s.addText(text, {
          x: CONTENT_X + 0.25, y, w: CONTENT_W - 0.25, h,
          shape: 'roundRect', rectRadius: 0.03,
          fill: { color: PURPLE_TINT }, line: { color: PURPLE, width: 0.75 },
          fontFace: FONT, fontSize: pt, color: DARK, italic: true, valign: 'top', margin: 6, fit: 'shrink',
        }),
      });
    }
  }

  const subs = faq.sub_questions ?? [];
  if (subs.length > 0) {
    items.push({
      h: 0.22,
      keepWithNext: true,
      draw: (s, y) => s.addText('MORE DETAIL', {
        x: CONTENT_X, y: y + 0.04, w: 2, h: 0.16,
        fontFace: FONT, fontSize: 7.5, bold: true, color: GRAY, charSpacing: 2, valign: 'middle',
      }),
    });
    subs.forEach((_, j) => {
      const expanded = view.expandedSub === j;
      items.push(subQuestionRowItem(ctx, faq, j, expanded, scale));
      if (expanded) items.push(...blockItems(ctx, subs[j].answer_html, scale, 0.25));
    });
  }

  return items;
}

function spItems(ctx: Ctx, expandedId: string | undefined, scale: number): Item[] {
  const { mod } = ctx;
  const items: Item[] = [];
  const short = mod.default_title.split(' — ')[0];
  items.push({
    h: 0.34,
    keepWithNext: true,
    draw: (s, y) => s.addText(`SmartPhrases — ${short}`, {
      x: CONTENT_X, y, w: CONTENT_W, h: 0.3,
      fontFace: FONT, fontSize: 14 * scale, bold: true, color: DARK, valign: 'top',
    }),
  });
  items.push({
    h: 0.26,
    keepWithNext: true,
    draw: (s, y) => s.addText('Click a phrase to expand it. [Bracketed] tokens are Epic fill-ins — leave them verbatim.', {
      x: CONTENT_X, y, w: CONTENT_W, h: 0.22,
      fontFace: FONT, fontSize: 9 * scale, color: GRAY, italic: true, valign: 'top',
    }),
  });
  for (const sp of mod.smartphrases ?? []) {
    const expanded = sp.id === expandedId;
    const pt = 10 * scale;
    const h = 0.34;
    const target = expanded ? 'sp:home' : `sp:${sp.id}`;
    items.push({
      h,
      keepWithNext: expanded,
      draw: (s, y) => s.addText(
        linkRuns([
          { text: sp.id, options: { bold: true, color: expanded ? BLUE : DARK } },
          { text: `   ${sp.status}`, options: { fontSize: 8 * scale, color: sp.status === 'confirmed' ? GREEN : GRAY } },
          { text: expanded ? CHEVRON_UP : CHEVRON_DOWN, options: { color: FAINT } },
        ], linkTo(ctx, target), expanded ? 'Collapse' : 'Expand phrase'),
        {
          x: CONTENT_X, y, w: CONTENT_W, h: h - 0.05,
          shape: 'roundRect', rectRadius: 0.03,
          fill: { color: expanded ? BLUE_TINT : 'FFFFFF' },
          line: { color: expanded ? BLUE : BORDER, width: expanded ? 1.25 : 0.75 },
          fontFace: FONT, fontSize: pt, valign: 'middle', margin: 6,
        },
      ),
    });
    if (expanded && sp.text) items.push(phraseTextItem(sp.text, scale, 0.25));
    if (expanded && !sp.text && sp.description) {
      const dh = estTextH(sp.description, CONTENT_W - 0.25, 9.3 * scale) + 0.08;
      items.push({
        h: dh,
        draw: (s, y) => s.addText(sp.description ?? '', {
          x: CONTENT_X + 0.25, y, w: CONTENT_W - 0.25, h: dh,
          fontFace: FONT, fontSize: 9.3 * scale, color: GRAY, italic: true, valign: 'top', fit: 'shrink',
        }),
      });
    }
  }
  return items;
}

function buildItems(ctx: Ctx, st: DeckState, scale: number): Item[] {
  switch (st.kind) {
    case 'home': return homeItems(ctx, scale);
    case 'faq': return faqItems(ctx, st.faq!, {}, scale);
    case 'sub': return faqItems(ctx, st.faq!, { expandedSub: st.subIndex }, scale);
    case 'pill': return faqItems(ctx, st.faq!, { expandPill: true }, scale);
    case 'dp': return faqItems(ctx, st.faq!, { expandDp: true }, scale);
    case 'sp-home': return spItems(ctx, undefined, scale);
    case 'sp': return spItems(ctx, st.phrase!.id, scale);
  }
}

// ─── Pagination (spec §7) ───────────────────────────────────────────────

const GAP = 0.1;
const SCALES = [1, 0.92, 0.85]; // 0.85 puts 10.8pt body at ~9.2pt — the legibility floor

function totalH(items: Item[]): number {
  return items.reduce((acc, it) => acc + it.h + GAP, 0) - GAP;
}

function paginate(ctx: Ctx, st: DeckState): { pages: Item[][]; scale: number } {
  for (const scale of SCALES) {
    const items = buildItems(ctx, st, scale);
    if (totalH(items) <= CONTENT_H) return { pages: [items], scale };
  }
  // Still overflowing at the floor — spill onto continuation slides.
  const scale = SCALES[SCALES.length - 1];
  const items = buildItems(ctx, st, scale);
  const avail = CONTENT_H - CONT_LINK_H;
  const pages: Item[][] = [];
  let page: Item[] = [];
  let y = 0;
  let i = 0;
  while (i < items.length) {
    const it = items[i];
    if (y + it.h > avail && page.length > 0) {
      // keep-with-next: pull trailing items that must not end a page back to
      // the next page (but always keep ≥1 item so the loop advances).
      let backtrack = 0;
      while (page.length > 1 && page[page.length - 1].keepWithNext) {
        page.pop();
        backtrack++;
      }
      pages.push(page);
      page = [];
      y = 0;
      i -= backtrack;
      continue;
    }
    page.push(it);
    y += it.h + GAP;
    i++;
  }
  if (page.length > 0) pages.push(page);
  ctx.warnings.push(`state "${st.key}" paginated into ${pages.length} slides at floor scale`);
  return { pages, scale };
}

// ─── Frame chrome (spec §6) ─────────────────────────────────────────────

function railRow(
  ctx: Ctx, s: Slide, x: number, y: number, w: number, h: number,
  marker: string, markerColor: string, markerShape: 'square' | 'circle',
  statement: string, targetKey: string, focused: boolean, tint: string,
): void {
  if (focused) {
    s.addShape('rect', { x, y, w, h, fill: { color: tint }, line: { color: tint } });
    s.addShape('rect', { x, y, w: 0.04, h, fill: { color: markerColor }, line: { color: markerColor } });
  }
  const mSize = 0.22;
  s.addShape(markerShape === 'square' ? 'rect' : 'ellipse', {
    x: x + 0.06, y: y + (h - mSize) / 2, w: mSize, h: mSize,
    fill: { color: 'FFFFFF' }, line: { color: markerColor, width: 1.25 },
  });
  s.addText(marker, {
    x: x + 0.06, y: y + (h - mSize) / 2, w: mSize, h: mSize,
    fontFace: FONT, fontSize: 8, bold: true, color: markerColor, align: 'center', valign: 'middle', margin: 0,
  });
  s.addText(
    linkRuns([
      { text: stripRefMarkers(statement), options: { bold: focused } },
      { text: ' ►', options: { color: FAINT, fontSize: 6.5 } },
    ], linkTo(ctx, targetKey), 'Open detail'),
    {
      x: x + 0.34, y, w: w - 0.36, h,
      fontFace: FONT, fontSize: 7.4, color: DARK, valign: 'middle', margin: 1,
      fit: 'shrink', lineSpacingMultiple: 1.05,
    },
  );
}

function drawFrame(ctx: Ctx, s: Slide, st: DeckState): void {
  const { mod } = ctx;
  s.background = { color: BG };
  const focusedFaqId = st.faq?.faq_id ?? null;

  // Header
  s.addText(mod.default_title, {
    x: 0.25, y: 0.08, w: 10.5, h: 0.4,
    fontFace: FONT, fontSize: 15, bold: true, color: DARK, valign: 'middle',
  });
  s.addText('‹ Modules', {
    x: 11.75, y: 0.12, w: 1.35, h: 0.3,
    shape: 'roundRect', rectRadius: 0.12,
    fill: { color: CHIP_DARK }, line: { color: CHIP_DARK },
    fontFace: FONT, fontSize: 9, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0,
    hyperlink: { slide: linkTo(ctx, 'home'), tooltip: 'Back to module landing' },
  });

  // ── Checklist card (green) ──
  s.addShape('rect', { x: RAIL_X, y: CHECK_Y, w: RAIL_W, h: CHECK_H, fill: { color: CARD }, line: { color: BORDER, width: 1 } });
  s.addShape('rect', { x: RAIL_X, y: CHECK_Y, w: RAIL_W, h: 0.07, fill: { color: GREEN }, line: { color: GREEN } });
  s.addText(mod.checklist_section_label.toUpperCase(), {
    x: RAIL_X + 0.1, y: CHECK_Y + 0.12, w: RAIL_W - 0.2, h: 0.2,
    fontFace: FONT, fontSize: 7.5, bold: true, color: GREEN, charSpacing: 1.5, valign: 'middle', fit: 'shrink',
  });
  let ry = CHECK_Y + 0.38;
  for (const item of mod.checklist) {
    const target = resolveFaq(mod, item.faq_ref) ? `faq:${item.faq_ref}` : 'home';
    if (target === 'home') ctx.warnings.push(`checklist ${item.item_id}: faq_ref "${item.faq_ref}" unresolved`);
    railRow(ctx, s, RAIL_X + 0.04, ry, RAIL_W - 0.08, 0.5, String(item.position), GREEN, 'square',
      item.statement, target, focusedFaqId === item.faq_ref, GREEN_TINT);
    ry += 0.54;
  }
  // Green-zone footer
  const gzY = ry + 0.04;
  s.addShape('line', { x: RAIL_X + 0.1, y: gzY, w: RAIL_W - 0.2, h: 0, line: { color: BORDER, width: 0.75 } });
  s.addText(`✓ ${mod.green_zone.zone_label}`, {
    x: RAIL_X + 0.1, y: gzY + 0.04, w: RAIL_W - 0.2, h: 0.34,
    fontFace: FONT, fontSize: 7.5, bold: true, color: GREEN, valign: 'middle', fit: 'shrink',
  });
  const gzTrigger = mod.green_zone.smartphrase;
  const chipY = gzY + 0.42;
  if (gzTrigger) {
    const gzTarget = mod.smartphrases?.some((p) => p.id === gzTrigger) ? `sp:${gzTrigger}` : 'sp:home';
    s.addText(gzTrigger, {
      x: RAIL_X + 0.1, y: chipY, w: 1.15, h: 0.24,
      shape: 'roundRect', rectRadius: 0.04,
      fill: { color: 'F0EFEA' }, line: { color: BORDER, width: 0.75 },
      fontFace: 'Consolas', fontSize: 6.8, color: DARK, align: 'center', valign: 'middle', margin: 0,
      hyperlink: { slide: linkTo(ctx, gzTarget), tooltip: 'Open this SmartPhrase' },
    });
  }
  s.addText('All SmartPhrases →', {
    x: RAIL_X + (gzTrigger ? 1.35 : 0.1), y: chipY, w: 1.6, h: 0.24,
    fontFace: FONT, fontSize: 7.2, bold: true, color: GREEN, valign: 'middle',
    hyperlink: { slide: linkTo(ctx, 'sp:home'), tooltip: 'Open the SmartPhrase selector' },
  });

  // ── Escalation card (red) ──
  s.addShape('rect', { x: RAIL_X, y: ESC_Y, w: RAIL_W, h: ESC_H, fill: { color: CARD }, line: { color: BORDER, width: 1 } });
  s.addShape('rect', { x: RAIL_X, y: ESC_Y, w: RAIL_W, h: 0.07, fill: { color: RED }, line: { color: RED } });
  s.addText(mod.escalation_section_label.toUpperCase(), {
    x: RAIL_X + 0.1, y: ESC_Y + 0.12, w: RAIL_W - 0.2, h: 0.2,
    fontFace: FONT, fontSize: 7.5, bold: true, color: RED, charSpacing: 1.5, valign: 'middle', fit: 'shrink',
  });
  let ey = ESC_Y + 0.36;
  for (const item of mod.escalation) {
    const target = resolveFaq(mod, item.faq_ref) ? `faq:${item.faq_ref}` : 'home';
    if (target === 'home') ctx.warnings.push(`escalation ${item.item_id}: faq_ref "${item.faq_ref}" unresolved`);
    railRow(ctx, s, RAIL_X + 0.04, ey, RAIL_W - 0.08, 0.34, '!', RED, 'circle',
      item.statement, target, focusedFaqId === item.faq_ref, RED_TINT);
    ey += 0.37;
  }
  if (mod.context_strip) {
    const csY = ey + 0.03;
    s.addText(
      [
        { text: mod.context_strip.label + ': ', options: { bold: true } },
        { text: stripRefMarkers(mod.context_strip.text), options: { italic: true } },
      ],
      {
        x: RAIL_X + 0.1, y: csY, w: RAIL_W - 0.2, h: ESC_Y + ESC_H - csY - 0.06,
        fontFace: FONT, fontSize: 6.2, color: GRAY, valign: 'top', fit: 'shrink', lineSpacingMultiple: 1.05,
      },
    );
  }

  // ── Detail panel (blue) ──
  s.addShape('rect', { x: DET_X, y: DET_Y, w: DET_W, h: DET_H, fill: { color: CARD }, line: { color: BORDER, width: 1 } });
  s.addShape('rect', { x: DET_X, y: DET_Y, w: DET_W, h: 0.07, fill: { color: BLUE }, line: { color: BLUE } });

  // Footer
  if (mod.footer_note) {
    s.addText(stripRefMarkers(mod.footer_note), {
      x: 0.25, y: 7.02, w: 12.85, h: 0.44,
      fontFace: FONT, fontSize: 7.5, color: GRAY, italic: true, valign: 'middle', fit: 'shrink',
    });
  }
}

function drawBackChip(ctx: Ctx, s: Slide, st: DeckState, contLabel: string | null): void {
  if (st.kind !== 'home') {
    const spFamily = st.kind === 'sp-home' || st.kind === 'sp';
    s.addText(spFamily ? '‹ module' : '‹ topics', {
      x: CONTENT_X, y: DET_Y + 0.13, w: 0.95, h: 0.24,
      shape: 'roundRect', rectRadius: 0.1,
      fill: { color: 'F0EFEA' }, line: { color: BORDER, width: 0.75 },
      fontFace: FONT, fontSize: 8.5, bold: true, color: GRAY, align: 'center', valign: 'middle', margin: 0,
      hyperlink: { slide: linkTo(ctx, 'home'), tooltip: 'Back to topic index' },
    });
  } else {
    s.addText('MODULE OVERVIEW', {
      x: CONTENT_X, y: DET_Y + 0.13, w: 3, h: 0.24,
      fontFace: FONT, fontSize: 8, bold: true, color: BLUE, charSpacing: 2, valign: 'middle',
    });
  }
  if (contLabel) {
    s.addText(contLabel, {
      x: DET_X + DET_W - 1.3, y: DET_Y + 0.13, w: 1.1, h: 0.24,
      fontFace: FONT, fontSize: 8, color: GRAY, italic: true, align: 'right', valign: 'middle',
    });
  }
}

// ─── Deck assembly ──────────────────────────────────────────────────────

export interface InterfaceDeckResult {
  pres: InstanceType<typeof pptxgen>;
  primaryStates: number;
  totalSlides: number;
  warnings: string[];
}

export function buildInterfacePptx(mod: ModuleData): InterfaceDeckResult {
  const ctx: Ctx = { mod, slideNo: new Map(), warnings: [] };
  const states = enumerateStates(mod);

  // Pass 1 — build pages per state (content only; no hyperlink resolution
  // happens yet because Item.draw closures run in Pass 2), then assign every
  // slide a number so all link targets are known before emission.
  const statePages: StatePages[] = states.map((state) => ({ state, pages: paginate(ctx, state).pages }));

  let n = 0;
  const pageNumbers = new Map<string, number[]>(); // state key → slide number per page
  for (const sp of statePages) {
    const nums: number[] = [];
    for (let p = 0; p < sp.pages.length; p++) nums.push(++n);
    pageNumbers.set(sp.state.key, nums);
    ctx.slideNo.set(sp.state.key, nums[0]);
  }

  // Pass 2 — emit.
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = `${mod.default_title} — interactive`;

  for (const sp of statePages) {
    const nums = pageNumbers.get(sp.state.key)!;
    sp.pages.forEach((items, p) => {
      const s = pres.addSlide();
      drawFrame(ctx, s, sp.state);
      drawBackChip(ctx, s, sp.state, sp.pages.length > 1 ? `(${p + 1}/${sp.pages.length})` : null);
      let y = CONTENT_Y;
      for (const it of items) {
        it.draw(s, y);
        y += it.h + GAP;
      }
      if (p < sp.pages.length - 1) {
        s.addText('▼ more', {
          x: DET_X + DET_W - 1.15, y: CONTENT_BOTTOM - 0.02, w: 0.95, h: 0.26,
          shape: 'roundRect', rectRadius: 0.1,
          fill: { color: BLUE }, line: { color: BLUE },
          fontFace: FONT, fontSize: 8.5, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0,
          hyperlink: { slide: nums[p + 1], tooltip: 'Continued' },
        });
      }
      if (p > 0) {
        s.addText('▲ back', {
          x: DET_X + DET_W - 2.2, y: CONTENT_BOTTOM - 0.02, w: 0.95, h: 0.26,
          shape: 'roundRect', rectRadius: 0.1,
          fill: { color: 'F0EFEA' }, line: { color: BORDER, width: 0.75 },
          fontFace: FONT, fontSize: 8.5, bold: true, color: GRAY, align: 'center', valign: 'middle', margin: 0,
          hyperlink: { slide: nums[p - 1], tooltip: 'Back' },
        });
      }
    });
  }

  return { pres, primaryStates: states.length, totalSlides: n, warnings: ctx.warnings };
}

export async function generateInterfacePptx(mod: ModuleData): Promise<Blob> {
  const { pres, warnings } = buildInterfacePptx(mod);
  for (const w of warnings) console.warn('[interface-pptx]', w);
  return (await pres.write({ outputType: 'blob' })) as Blob;
}

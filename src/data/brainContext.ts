// Build the brain-context payload sent to /api/chat.
//
// For each mini-bubble in a chat's brain, look up the actual source bubble
// in the registry and extract content per its relationship type:
//   - deep   → full content embedded
//   - edit   → full content + write authority
//   - summary→ label + a synthetic 1-line summary (we don't run a real
//              summarizer yet; v1 uses extractSummaryLine over the source)
//   - held   → label only (the executive-assistant "I'm holding this" mode)
//
// Per-primitive content extractors live here. Markdown returns body verbatim;
// blueprint, dossier, follow-ups, dropzone, generated-sessions get bespoke
// shapes; everything else falls back to a JSON-stringified slice of props.

import type { AttachRelationship, BubbleInstance, MiniBubble } from '../types';
import type { BubbleBundle } from '../shell/workspaceState';

export interface BrainContextItem {
  label: string;
  body: string;
}
export interface BrainContextHeldItem {
  label: string;
}

export interface BrainContext {
  deep?: BrainContextItem[];
  edit?: BrainContextItem[];
  summary?: BrainContextItem[];
  held?: BrainContextHeldItem[];
}

export function buildBrainContext(
  miniBubbles: MiniBubble[],
  registry: Record<string, BubbleBundle>,
): BrainContext {
  const ctx: BrainContext = {};

  for (const m of miniBubbles) {
    const rel: AttachRelationship = normalizeRel(m.relationship);
    const srcInst = registry[m.source]?.instance;

    if (rel === 'held') {
      (ctx.held ??= []).push({ label: m.label });
      continue;
    }

    const body = srcInst ? extractContent(srcInst) : `(source ${m.source} no longer in workspace)`;
    const item: BrainContextItem = { label: m.label, body };

    if (rel === 'deep') {
      (ctx.deep ??= []).push(item);
    } else if (rel === 'edit') {
      (ctx.edit ??= []).push(item);
    } else if (rel === 'summary') {
      (ctx.summary ??= []).push({
        label: m.label,
        body: extractSummaryLine(srcInst ?? undefined, m.label),
      });
    }
  }

  return ctx;
}

function normalizeRel(rel: MiniBubble['relationship']): AttachRelationship {
  if (rel === 'deep' || rel === 'summary' || rel === 'edit' || rel === 'held') return rel;
  return 'held';
}

// Per-primitive content extractor. Returns a string the LLM can read.
function extractContent(inst: BubbleInstance): string {
  const p = inst.props as Record<string, unknown>;
  switch (inst.type) {
    case 'markdown':
      return typeof p.body === 'string' && p.body.trim() ? p.body : `(empty markdown: ${inst.title})`;
    case 'blueprint-tree':
      return extractBlueprint(p);
    case 'provider-dossier':
      return extractDossier(p);
    case 'follow-ups-rail':
      return extractList(p, 'items', 'follow-up');
    case 'generated-sessions-rail':
      return extractList(p, 'sessions', 'session');
    case 'dropzone':
      return extractDropzone(p);
    case 'questionnaire':
      return extractList(p, 'items', 'question');
    case 'faq-block':
      return extractList(p, 'items', 'q&a');
    case 'spreadsheet':
    case 'email-thread':
    case 'patient-info':
    case 'modules-stack':
    case 'openevidence-builder':
    case 'smartphrase-directory':
    case 'glidepath-chart':
    case 'email-threads-tracker':
    case 'meeting-tracker':
    case 'care-gap-accumulator':
    case 'status-pill-grid':
    case 'exports-panel':
    case 'dashboard-numbers':
      return `${inst.title} — content stub:\n${stringifyProps(p)}`;
    default:
      return `${inst.title} (${inst.type})\n${stringifyProps(p)}`;
  }
}

function extractBlueprint(p: Record<string, unknown>): string {
  const items = (p.items as Array<Record<string, unknown>>) ?? [];
  const hub = p.hubState as Record<string, unknown> | undefined;
  const lines: string[] = [];
  if (hub) lines.push(`Hub state: ${JSON.stringify(hub).slice(0, 800)}`);
  if (items.length) {
    lines.push('Blueprint items:');
    for (const it of items.slice(0, 60)) {
      const phase = it.phase ? `[${it.phase}] ` : '';
      const stmt = it.statement ?? it.text ?? it.label ?? '(unnamed)';
      lines.push(`  - ${phase}${stmt}`);
    }
    if (items.length > 60) lines.push(`  …and ${items.length - 60} more`);
  }
  return lines.join('\n') || '(empty blueprint)';
}

function extractDossier(p: Record<string, unknown>): string {
  return `Dossier:\n${stringifyProps(p, 1500)}`;
}

function extractList(p: Record<string, unknown>, key: string, kind: string): string {
  const items = (p[key] as unknown[]) ?? [];
  if (!Array.isArray(items) || items.length === 0) return `(empty ${kind}s)`;
  return items
    .slice(0, 40)
    .map((it, i) => {
      if (typeof it === 'string') return `${i + 1}. ${it}`;
      const o = it as Record<string, unknown>;
      const t = o.title ?? o.text ?? o.statement ?? o.label ?? JSON.stringify(o).slice(0, 200);
      return `${i + 1}. ${String(t)}`;
    })
    .join('\n');
}

function extractDropzone(p: Record<string, unknown>): string {
  const files = (p.files as Array<Record<string, unknown>>) ?? [];
  if (!Array.isArray(files) || files.length === 0) return '(dropzone empty)';
  return 'Dropzone files:\n' + files.map((f) => `- ${f.name ?? '(unnamed)'} · ${f.kind ?? 'file'}`).join('\n');
}

function stringifyProps(p: Record<string, unknown>, max = 800): string {
  try {
    const s = JSON.stringify(p, null, 2);
    return s.length > max ? s.slice(0, max) + '…' : s;
  } catch {
    return '(unserializable)';
  }
}

// Cheap synthetic summary — first sentence of any string content we can find,
// or the title. The point of summary-mode is the LLM gets a hint that
// something exists without paying the deep-read cost.
function extractSummaryLine(inst: BubbleInstance | undefined, fallbackLabel: string): string {
  if (!inst) return fallbackLabel;
  const p = inst.props as Record<string, unknown>;
  if (typeof p.body === 'string' && p.body.trim()) {
    const first = p.body.split(/[.\n]/)[0];
    return first.trim().slice(0, 200);
  }
  return `${fallbackLabel} (${inst.type})`;
}

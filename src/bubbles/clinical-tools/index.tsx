// Clinical tools bubble — DOCX importer + spawn cards.
//
// Top: "Import .docx" affordance — picks a Word file, runs mammoth +
// parseDocxHtml, adds the resulting module to userModulesSignal, and
// immediately lands the workspace in module mode for the imported module.
// Mid: "Calculators" section sourced from src/bubbles/_calculators/registry.
// Cards a focused module declares in `recommended_calculators` float to
// the top of the list with a small "Recommended" badge.
// Mid-low: "Tools" section — Clinical chat (real Sonnet) + OpenEvidence
// builder. Each click spawns a fresh primitive instance to the right of
// this bubble via the existing onSpawnBubble extraProp pattern.
// Bottom: list of recently imported modules, clickable to re-enter.

import { useRef, useState } from 'preact/hooks';
import type { ComponentChildren, JSX } from 'preact';
import type { BubbleInstance, BubblePrimitiveType, ModuleData } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { parseDocxHtml } from '../../lib/parseDocxHtml';
import { addUserModule, removeUserModule, userModulesSignal } from '../../data/userModules';
import { moduleFocusSignal } from '../../data/moduleFocus';
import { CALCULATORS } from '../_calculators/registry';
import clinicalModulesSeed from '../../data/seed/clinical-modules.json';
import csContractsSeed from '../../data/seed/controlled-substances-contracts.json';
import type { CsSubstanceClass } from '../../types';

const SEED_MODULES: ModuleData[] = (
  ((clinicalModulesSeed as { clinical?: { modules?: ModuleData[] } }).clinical?.modules) ?? []
);

// Maps a controlled-substance module_id to the contract-builder substance
// class so the Contracts card can pre-select it (adhd→stimulant, opiates→
// opioid, benzos→benzo). Modules not in the map don't surface the card.
const CONTRACT_CLASS_MAP: Record<string, CsSubstanceClass> = (
  (csContractsSeed as { module_class_map?: Record<string, CsSubstanceClass> }).module_class_map ?? {}
);

// Peek at the DOCX-derived HTML to find the Heading-1 title without doing
// full parsing. Used to look up an existing module so parseDocxHtml can
// merge references on re-import (schema 1.3.0+ references-merge policy).
function sniffModuleId(html: string): string | null {
  const m = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (!m) return null;
  const title = m[1].trim();
  const titlePart = title.split(' — ')[0].split(' - ')[0];
  return titlePart.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || null;
}

interface SpawnSpec {
  type: BubblePrimitiveType;
  title: string;
  props?: Record<string, unknown>;
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  onSpawnBubble?: (spec: SpawnSpec) => void;
}

interface ToolCard {
  id: string;
  title: string;
  blurb: string;
  glyph: string;
  recommended?: boolean;
  spawn: SpawnSpec;
}

const NON_CALC_TOOLS: ToolCard[] = [
  {
    id: 'clinical-chat',
    title: 'Clinical chat',
    blurb: 'Sonnet · attach modules, dossier, notes',
    glyph: '💬',
    spawn: {
      type: 'llm-chat',
      title: 'Clinical chat',
      props: {
        greeting:
          'Ask about any module — I can pull up checklists, escalations, or FAQs. (LLM module-routing wiring is the next iteration.)',
        defaultPersona: 'clinical',
        brain: {
          miniBubbles: [],
          hydrationRules: { onAttach: 'auto-add', onDrop: 'auto-add' },
        },
      },
    },
  },
  {
    id: 'openevidence-builder',
    title: 'OpenEvidence',
    blurb: 'Build a question · pick context · run query',
    glyph: '🔬',
    spawn: { type: 'openevidence-builder', title: 'OpenEvidence' },
  },
];

function buildCalculatorCards(activeModule: ModuleData | null): ToolCard[] {
  const recommendedIds = new Set(activeModule?.recommended_calculators ?? []);
  const cards: ToolCard[] = CALCULATORS.map((c) => ({
    id: c.id,
    title: c.title,
    blurb: c.blurb,
    glyph: c.glyph,
    recommended: recommendedIds.has(c.id),
    spawn: { type: c.type, title: c.title },
  }));
  // Recommended first (in declaration order within registry); then the rest.
  cards.sort((a, b) => {
    if (a.recommended && !b.recommended) return -1;
    if (!a.recommended && b.recommended) return 1;
    return 0;
  });
  return cards;
}

export function ClinicalTools({ instance, onSpawnBubble }: Props): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ kind: 'idle' | 'parsing' | 'error' | 'ok'; msg?: string }>({ kind: 'idle' });
  const userModules = userModulesSignal.value;

  // Resolve the active module from the clinical-modules workspace's focus
  // signal so we can sort calculator cards by `recommended_calculators`.
  const focus = moduleFocusSignal('clinical-modules').value;
  const allModules: ModuleData[] = [...SEED_MODULES, ...userModules];
  const activeModule = focus.mode === 'module'
    ? allModules.find((m) => m.module_id === focus.moduleId) ?? null
    : null;

  const calcCards = buildCalculatorCards(activeModule);

  // Consult builder card is shown only when the active module has at
  // least one consult path declared. Sits in its own "Consults" section
  // above Calculators so the catalog pattern reads as: module-scoped
  // catalogs (consults / smartphrases / contracts) up top, generic tools
  // (calculators / chat / OE) underneath.
  const consultCount = activeModule?.consults?.length ?? 0;
  const consultCards: ToolCard[] = consultCount > 0
    ? [{
        id: 'consult-builder',
        title: 'Consult builder',
        blurb: `${consultCount} path${consultCount === 1 ? '' : 's'} · yes/no triage → pre-filled message`,
        glyph: '📨',
        spawn: { type: 'consult-builder', title: 'Consult builder' },
      }]
    : [];

  // Contract builder card — shown for controlled-substance modules; spawns
  // the builder pre-selected to the module's substance class.
  const contractClass = activeModule ? CONTRACT_CLASS_MAP[activeModule.module_id] : undefined;
  const contractCards: ToolCard[] = contractClass
    ? [{
        id: 'contract-builder',
        title: 'CS agreement builder',
        blurb: 'NY/NJ · flags → risk tier → assembled agreement + SmartPhrase',
        glyph: '📋',
        spawn: { type: 'contract-builder', title: 'CS contract builder', props: { initialClass: contractClass } },
      }]
    : [];

  function pickFile(): void {
    setStatus({ kind: 'idle' });
    fileInputRef.current?.click();
  }

  async function handleFile(e: Event): Promise<void> {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    setStatus({ kind: 'parsing', msg: file.name });
    try {
      const arrayBuffer = await file.arrayBuffer();
      const mammoth = await import('mammoth');
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          styleMap: [
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
          ],
        },
      );
      // Look up an existing module with the same module_id so the parser
      // can merge references (95-superset preservation policy) and carry
      // forward DOCX-orthogonal fields (consults walker, calculators,
      // glossary).
      const previewModuleId = sniffModuleId(result.value);
      const existing: ModuleData | undefined = previewModuleId
        ? [...SEED_MODULES, ...userModulesSignal.value].find((m) => m.module_id === previewModuleId)
        : undefined;
      const mod = parseDocxHtml(result.value, existing);
      const { mod: stored, renamed } = addUserModule(mod);
      setStatus({
        kind: 'ok',
        msg: renamed ? `Imported as "${stored.module_id}" (id collision auto-renamed).` : `Imported "${stored.default_title}".`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus({ kind: 'error', msg });
    }
  }

  function reopen(moduleId: string): void {
    moduleFocusSignal('clinical-modules').value = {
      mode: 'module',
      moduleId,
      focusedItemId: null,
    };
  }

  function dismiss(moduleId: string): void {
    removeUserModule(moduleId);
  }

  return (
    <div class="cm-tools" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>{instance.title}</span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '8px 12px 12px' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          style={{ display: 'none' }}
          onChange={handleFile}
        />
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); pickFile(); }}
          style={{
            display: 'block',
            width: '100%',
            font: 'inherit',
            fontSize: 12.5,
            fontWeight: 600,
            padding: '10px 12px',
            border: '1.5px dashed var(--type-color)',
            borderRadius: 6,
            background: 'rgba(244, 192, 32, 0.08)',
            cursor: 'pointer',
            color: 'inherit',
            marginBottom: 8,
          }}
        >
          📄 Import .docx module
        </button>
        <p style={{ fontSize: 10, lineHeight: 1.4, opacity: 0.55, margin: '0 0 10px', fontStyle: 'italic' }}>
          DOCX must follow the Meridian format guide (H1 title, H2 sections, H3 [item-id] rows). Templates and the format guide are in <code>~/meridian/</code>.
        </p>
        {status.kind !== 'idle' && (
          <div
            style={{
              fontSize: 11,
              padding: '6px 10px',
              borderRadius: 4,
              marginBottom: 10,
              background: status.kind === 'error'
                ? 'rgba(217, 46, 46, 0.12)'
                : status.kind === 'ok'
                  ? 'rgba(15, 107, 66, 0.12)'
                  : 'rgba(0,0,0,0.06)',
              color: status.kind === 'error' ? '#8b0000' : status.kind === 'ok' ? '#0F6B42' : 'inherit',
              border: status.kind === 'error'
                ? '1px solid rgba(217, 46, 46, 0.4)'
                : status.kind === 'ok'
                  ? '1px solid rgba(15, 107, 66, 0.4)'
                  : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {status.kind === 'parsing' && <>Parsing <em>{status.msg}</em>…</>}
            {status.kind === 'error' && <><strong>Couldn't parse:</strong> {status.msg}</>}
            {status.kind === 'ok' && status.msg}
          </div>
        )}

        {consultCards.length > 0 && (
          <>
            <SectionLabel>Consults</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {consultCards.map((t) => (
                <SpawnCard
                  key={t.id}
                  tool={t}
                  onSpawn={() => onSpawnBubble?.(t.spawn)}
                  spawnEnabled={!!onSpawnBubble}
                />
              ))}
            </div>
          </>
        )}

        {contractCards.length > 0 && (
          <>
            <SectionLabel style={{ marginTop: consultCards.length > 0 ? 14 : 6 }}>Contracts</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {contractCards.map((t) => (
                <SpawnCard
                  key={t.id}
                  tool={t}
                  onSpawn={() => onSpawnBubble?.(t.spawn)}
                  spawnEnabled={!!onSpawnBubble}
                />
              ))}
            </div>
          </>
        )}

        <SectionLabel style={{ marginTop: consultCards.length > 0 ? 14 : 6 }}>Calculators</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {calcCards.map((t) => (
            <SpawnCard
              key={t.id}
              tool={t}
              onSpawn={() => onSpawnBubble?.(t.spawn)}
              spawnEnabled={!!onSpawnBubble}
            />
          ))}
        </div>

        <SectionLabel style={{ marginTop: 14 }}>Tools</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {NON_CALC_TOOLS.map((t) => (
            <SpawnCard
              key={t.id}
              tool={t}
              onSpawn={() => onSpawnBubble?.(t.spawn)}
              spawnEnabled={!!onSpawnBubble}
            />
          ))}
        </div>

        {userModules.length > 0 && (
          <>
            <SectionLabel style={{ marginTop: 14 }}>Imports</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {userModules.map((m) => (
                <div
                  key={m.module_id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 6,
                    alignItems: 'start',
                    padding: '6px 10px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderLeft: '3px solid var(--type-color)',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.55)',
                  }}
                >
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); reopen(m.module_id); }}
                    style={{
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      font: 'inherit',
                      padding: 0,
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 12, lineHeight: 1.3 }}>{m.default_title}</div>
                    <div style={{ fontSize: 10, opacity: 0.6, marginTop: 1 }}>
                      {m.checklist.length} chk · {m.escalation.length} esc · {m.faqs.length} FAQ
                    </div>
                  </button>
                  <button
                    type="button"
                    title="Remove import"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); dismiss(m.module_id); }}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', fontSize: 14, opacity: 0.4 }}
                  >×</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SectionLabel({
  children,
  style,
}: {
  children: ComponentChildren;
  style?: JSX.CSSProperties;
}): JSX.Element {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        opacity: 0.5,
        margin: '6px 0 6px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface SpawnCardProps {
  tool: ToolCard;
  onSpawn: () => void;
  spawnEnabled: boolean;
}

function SpawnCard({ tool, onSpawn, spawnEnabled }: SpawnCardProps): JSX.Element {
  return (
    <button
      type="button"
      title={`Open ${tool.title} in a new bubble`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onSpawn(); }}
      style={{
        display: 'grid',
        gridTemplateColumns: '24px 1fr auto',
        gap: 8,
        alignItems: 'center',
        padding: '8px 10px',
        border: '1px solid rgba(0,0,0,0.1)',
        borderLeft: '3px solid var(--type-color)',
        borderRadius: 4,
        background: 'rgba(255,255,255,0.55)',
        cursor: spawnEnabled ? 'pointer' : 'default',
        font: 'inherit',
        color: 'inherit',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1.1 }}>{tool.glyph}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 12.5, lineHeight: 1.3 }}>{tool.title}</div>
        <div style={{ fontSize: 10.5, opacity: 0.65, marginTop: 2 }}>{tool.blurb}</div>
      </div>
      {tool.recommended && (
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'var(--type-color)',
            background: 'rgba(244, 192, 32, 0.15)',
            border: '1px solid rgba(244, 192, 32, 0.55)',
            borderRadius: 3,
            padding: '2px 6px',
            whiteSpace: 'nowrap',
          }}
        >
          Recommended
        </span>
      )}
    </button>
  );
}

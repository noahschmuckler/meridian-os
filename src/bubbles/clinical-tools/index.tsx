// Clinical tools bubble — calculators + DOCX importer.
//
// Top: "Import .docx" affordance — picks a Word file, runs mammoth +
// parseDocxHtml, adds the resulting module to userModulesSignal, and
// immediately lands the workspace in module mode for the imported module.
// Mid: list of available calculators (PREVENT for now).
// Bottom: list of recently imported modules — clickable to re-enter.

import { useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance, BubblePrimitiveType } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { parseDocxHtml } from '../../lib/parseDocxHtml';
import { addUserModule, removeUserModule, userModulesSignal } from '../../data/userModules';
import { moduleFocusSignal } from '../../data/moduleFocus';

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

interface Tool {
  id: string;
  title: string;
  blurb: string;
  glyph: string;
  spawn: SpawnSpec;
}

const TOOLS: Tool[] = [
  {
    id: 'prevent-calculator',
    title: 'PREVENT calculator',
    blurb: '10-year ASCVD risk · AHA/ACC 2023',
    glyph: '🫀',
    spawn: { type: 'prevent-calculator', title: 'PREVENT calculator' },
  },
  {
    id: 'clinical-chat',
    title: 'Clinical chat',
    blurb: 'Sonnet · attach modules, dossier, notes',
    glyph: '💬',
    spawn: {
      type: 'llm-chat',
      title: 'Clinical chat',
      props: {
        greeting: 'Ask about any module — I can pull up checklists, escalations, or FAQs. (LLM module-routing wiring is the next iteration.)',
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

export function ClinicalTools({ instance, onSpawnBubble }: Props): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ kind: 'idle' | 'parsing' | 'error' | 'ok'; msg?: string }>({ kind: 'idle' });
  const userModules = userModulesSignal.value;

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
      const mod = parseDocxHtml(result.value);
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

        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, opacity: 0.5, margin: '12px 0 6px' }}>
          Calculators
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              title={`Open ${t.title} in a new bubble`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onSpawnBubble?.(t.spawn); }}
              style={{
                display: 'grid',
                gridTemplateColumns: '24px 1fr',
                gap: 8,
                alignItems: 'start',
                padding: '8px 10px',
                border: '1px solid rgba(0,0,0,0.1)',
                borderLeft: '3px solid var(--type-color)',
                borderRadius: 4,
                background: 'rgba(255,255,255,0.55)',
                cursor: onSpawnBubble ? 'pointer' : 'default',
                font: 'inherit',
                color: 'inherit',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1.1 }}>{t.glyph}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12.5, lineHeight: 1.3 }}>{t.title}</div>
                <div style={{ fontSize: 10.5, opacity: 0.65, marginTop: 2 }}>{t.blurb}</div>
              </div>
            </button>
          ))}
        </div>

        {userModules.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, opacity: 0.5, margin: '12px 0 6px' }}>
              Imports
            </div>
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

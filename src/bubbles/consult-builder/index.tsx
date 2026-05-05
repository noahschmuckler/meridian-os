// Consult builder (Track 4b). Reads the active module's `consults[]`,
// lists each path as a card, and walks the chosen path's decision tree as
// a stack of yes/no question cards. The walker terminates on the first
// 'recommend' or 'block' edge; ordered 'continue' edges fall through to
// the next array entry until the list ends.
//
// Spawn paths:
//   - Auto-spawn on first module entry (BspWorkspace tracks
//     `meridian-os.consultBuilderShown.{moduleId}` so it only fires once).
//   - Re-spawn anytime from clinical-tools' Consults card.
//   - Spawn focused on a specific path via `props.initialConsultId` from
//     the consult-mention decorator's anchor click handler.
//
// On the recommend leaf the bubble surfaces the consult's
// `output_template` with `${field}` tokens replaced by editable inputs.
// "Copy" → clipboard with the rendered prose. "Send via OpenEvidence"
// dispatches a meridian:spawn-bubble event for an openevidence-builder
// pre-filled with the consult question + module/FAQ context.

import { useEffect, useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance, ConsultEdge, ConsultNode, ConsultPath, ModuleData } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { moduleFocusSignal } from '../../data/moduleFocus';
import { userModulesSignal } from '../../data/userModules';
import clinicalModulesSeed from '../../data/seed/clinical-modules.json';

const SEED_MODULES: ModuleData[] = (
  ((clinicalModulesSeed as { clinical?: { modules?: ModuleData[] } }).clinical?.modules) ?? []
);

interface ConsultBuilderProps {
  initialConsultId?: string;
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
  selfBubbleId?: string;
}

interface WalkStep {
  nodeIndex: number;
  answer: 'yes' | 'no';
}

type WalkOutcome =
  | { kind: 'asking'; node: ConsultNode; nodeIndex: number }
  | { kind: 'recommend' }
  | { kind: 'block'; reason: string };

function resolveNextIndex(
  edge: ConsultEdge,
  nodes: ConsultNode[],
  fromIndex: number,
): { kind: 'recommend' } | { kind: 'block'; reason: string } | { kind: 'jump'; to: number } {
  if (edge === 'recommend') return { kind: 'recommend' };
  if (edge === 'block') {
    return { kind: 'block', reason: nodes[fromIndex]?.block_text ?? 'Consult not indicated by this path.' };
  }
  if (edge === 'continue') {
    const next = fromIndex + 1;
    if (next >= nodes.length) return { kind: 'recommend' };
    return { kind: 'jump', to: next };
  }
  // String node id — random-access edge
  const idx = nodes.findIndex((n) => n.node_id === edge);
  if (idx < 0) return { kind: 'recommend' }; // unknown id — fall through optimistically
  return { kind: 'jump', to: idx };
}

function walk(path: ConsultPath, history: WalkStep[]): WalkOutcome {
  const nodes = path.decision_tree;
  if (nodes.length === 0) return { kind: 'recommend' };
  let i = 0;
  for (const step of history) {
    const node = nodes[i];
    if (!node) return { kind: 'recommend' };
    const edge = step.answer === 'yes' ? node.if_yes : node.if_no;
    const next = resolveNextIndex(edge, nodes, i);
    if (next.kind === 'recommend') return { kind: 'recommend' };
    if (next.kind === 'block') return { kind: 'block', reason: next.reason };
    i = next.to;
  }
  const node = nodes[i];
  if (!node) return { kind: 'recommend' };
  return { kind: 'asking', node, nodeIndex: i };
}

function expandTemplate(template: string, fields: Record<string, string>): string {
  return template.replace(/\$\{(\w+)\}/g, (_m, key: string) => fields[key] ?? `{${key}}`);
}

export function ConsultBuilder({ instance, workspaceId, selfBubbleId }: Props): JSX.Element {
  const props = (instance.props as unknown as ConsultBuilderProps) ?? {};
  const initialConsultId = props.initialConsultId;

  const focus = moduleFocusSignal(workspaceId).value;
  const allModules: ModuleData[] = [...SEED_MODULES, ...userModulesSignal.value];
  const activeModule = focus.mode === 'module'
    ? allModules.find((m) => m.module_id === focus.moduleId) ?? null
    : null;

  const consults = activeModule?.consults ?? [];

  const [selectedId, setSelectedId] = useState<string | null>(initialConsultId ?? null);
  const [history, setHistory] = useState<WalkStep[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // If the selected consult disappears (module switch), reset.
  useEffect(() => {
    if (selectedId && !consults.find((c) => c.consult_id === selectedId)) {
      setSelectedId(null);
      setHistory([]);
      setFieldValues({});
    }
  }, [activeModule?.module_id, consults.length]);

  // When the module changes, prefer initialConsultId if it now matches.
  useEffect(() => {
    if (!initialConsultId) return;
    const exists = consults.find((c) => c.consult_id === initialConsultId);
    if (exists && selectedId !== initialConsultId) {
      setSelectedId(initialConsultId);
      setHistory([]);
      setFieldValues({});
    }
  }, [initialConsultId, activeModule?.module_id]);

  const selected = consults.find((c) => c.consult_id === selectedId) ?? null;
  const outcome: WalkOutcome | null = selected ? walk(selected, history) : null;

  const initialFieldValues = useMemo(() => {
    if (!selected) return {};
    const obj: Record<string, string> = {};
    for (const f of selected.fields ?? []) {
      obj[f.key] = f.default ?? '';
    }
    return obj;
  }, [selected?.consult_id]);

  // Reset field values when picking a new consult.
  useEffect(() => {
    setFieldValues(initialFieldValues);
  }, [selected?.consult_id]);

  function answer(v: 'yes' | 'no'): void {
    if (outcome?.kind !== 'asking') return;
    setHistory((prev) => [...prev, { nodeIndex: outcome.nodeIndex, answer: v }]);
  }

  function back(): void {
    setHistory((prev) => prev.slice(0, -1));
  }

  function pickConsult(id: string): void {
    setSelectedId(id);
    setHistory([]);
  }

  function backToCatalog(): void {
    setSelectedId(null);
    setHistory([]);
    setFieldValues({});
  }

  async function copyOutput(): Promise<void> {
    if (!selected) return;
    const text = expandTemplate(selected.output_template, fieldValues);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1100);
    } catch {
      // ignore clipboard denial
    }
  }

  function sendViaOe(): void {
    if (!selected || !activeModule) return;
    const expanded = expandTemplate(selected.output_template, fieldValues);
    const focusedFaqId = focus.focusedItemId;
    const faqTopic = focusedFaqId
      ? activeModule.faqs.find((f) => f.faq_id === focusedFaqId)?.topic
      : undefined;
    window.dispatchEvent(new CustomEvent('meridian:spawn-bubble', {
      detail: {
        workspaceId,
        spec: {
          type: 'openevidence-builder',
          title: 'OpenEvidence',
          props: {
            prefilledTopic: `${activeModule.default_title.split(' — ')[0]} · ${selected.label}${faqTopic ? ` · ${faqTopic}` : ''}`,
            prefilledContext: expanded,
            prefilledQuestionType: 'guidance',
          },
          nearBubbleId: selfBubbleId,
        },
      },
    }));
  }

  return (
    <div class="consult-builder" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        {selected && (
          <button
            type="button"
            title="Back to catalog"
            aria-label="Back to catalog"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); backToCatalog(); }}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 13,
              padding: '0 8px 0 0',
              opacity: 0.75,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>‹</span>
            <span style={{ fontSize: 11 }}>consults</span>
          </button>
        )}
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>
          {selected ? selected.label : 'Consult builder'}
        </span>
        {!selected && activeModule && (
          <span style={{ marginLeft: 8, fontSize: 10.5, opacity: 0.6 }}>
            {consults.length} path{consults.length === 1 ? '' : 's'}
          </span>
        )}
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '10px 14px 12px' }}>
        {!activeModule && (
          <EmptyState message="Pick a module from a topic bubble to see its consult paths." />
        )}
        {activeModule && consults.length === 0 && (
          <EmptyState message={`No consult paths defined for ${activeModule.default_title.split(' — ')[0]} yet.`} />
        )}
        {activeModule && consults.length > 0 && !selected && (
          <Catalog consults={consults} onPick={pickConsult} />
        )}
        {selected && outcome?.kind === 'asking' && (
          <Walker
            path={selected}
            outcome={outcome}
            history={history}
            onAnswer={answer}
            onBack={back}
          />
        )}
        {selected && outcome?.kind === 'block' && (
          <BlockOutcome
            reason={outcome.reason}
            onBack={back}
            onRestart={() => setHistory([])}
          />
        )}
        {selected && outcome?.kind === 'recommend' && (
          <RecommendOutcome
            path={selected}
            fieldValues={fieldValues}
            onField={(k, v) => setFieldValues((p) => ({ ...p, [k]: v }))}
            onCopy={copyOutput}
            onSendOe={sendViaOe}
            onBack={back}
            onRestart={() => setHistory([])}
            copied={copied}
            module={activeModule!}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }): JSX.Element {
  return (
    <div style={{ fontSize: 12, opacity: 0.65, lineHeight: 1.5, padding: '12px 4px' }}>
      {message}
    </div>
  );
}

function Catalog({ consults, onPick }: { consults: ConsultPath[]; onPick: (id: string) => void }): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: 11.5, opacity: 0.7, margin: '0 0 4px', lineHeight: 1.45 }}>
        Pick a consult to walk its decision tree. Each path is a short yes/no triage that lands on either an indicated consult (with a pre-filled message) or a "not yet" leaf with the rationale.
      </p>
      {consults.map((c) => (
        <button
          key={c.consult_id}
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onPick(c.consult_id); }}
          style={{
            textAlign: 'left',
            padding: '10px 12px',
            border: '1px solid rgba(0,0,0,0.1)',
            borderLeft: '3px solid var(--type-color)',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.55)',
            cursor: 'pointer',
            font: 'inherit',
            color: 'inherit',
            width: '100%',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 12.5, lineHeight: 1.3 }}>{c.label}</div>
          {c.blurb && (
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2, lineHeight: 1.4 }}>{c.blurb}</div>
          )}
          <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, display: 'flex', gap: 10 }}>
            <span>{c.decision_tree.length} step{c.decision_tree.length === 1 ? '' : 's'}</span>
            {c.modality && <span>· {c.modality}</span>}
          </div>
        </button>
      ))}
    </div>
  );
}

function Walker({
  path,
  outcome,
  history,
  onAnswer,
  onBack,
}: {
  path: ConsultPath;
  outcome: { kind: 'asking'; node: ConsultNode; nodeIndex: number };
  history: WalkStep[];
  onAnswer: (v: 'yes' | 'no') => void;
  onBack: () => void;
}): JSX.Element {
  const stepNum = history.length + 1;
  const total = path.decision_tree.length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, opacity: 0.55 }}>
        Step {stepNum} of ~{total}
      </div>
      <div
        style={{
          padding: '14px 16px',
          border: '1px solid rgba(0,0,0,0.12)',
          borderLeft: '4px solid var(--type-color)',
          borderRadius: 6,
          background: 'rgba(255,255,255,0.6)',
        }}
      >
        <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.4 }}>
          {outcome.node.question}
        </div>
        {outcome.node.hint && (
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6, lineHeight: 1.45 }}>
            {outcome.node.hint}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <AnswerButton label="Yes" onClick={() => onAnswer('yes')} />
        <AnswerButton label="No" onClick={() => onAnswer('no')} />
        {history.length > 0 && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onBack(); }}
            style={{
              marginLeft: 'auto',
              border: '1px solid rgba(0,0,0,0.15)',
              background: 'transparent',
              padding: '6px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 11,
              opacity: 0.7,
            }}
          >
            ‹ back
          </button>
        )}
      </div>
      {history.length > 0 && (
        <div style={{ fontSize: 10.5, opacity: 0.55, lineHeight: 1.5 }}>
          <span style={{ fontWeight: 600 }}>Trail:</span>{' '}
          {history.map((h, idx) => {
            const node = path.decision_tree[h.nodeIndex];
            const q = node?.question ?? '';
            const short = q.length > 60 ? `${q.slice(0, 57)}…` : q;
            return (
              <span key={idx}>
                {short} → <strong>{h.answer}</strong>
                {idx < history.length - 1 ? ' · ' : ''}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AnswerButton({ label, onClick }: { label: string; onClick: () => void }): JSX.Element {
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        flex: 1,
        padding: '10px 14px',
        border: '1.5px solid var(--type-color)',
        borderRadius: 6,
        background: 'transparent',
        color: 'inherit',
        cursor: 'pointer',
        font: 'inherit',
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}

function BlockOutcome({
  reason,
  onBack,
  onRestart,
}: {
  reason: string;
  onBack: () => void;
  onRestart: () => void;
}): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          padding: '14px 16px',
          background: 'rgba(217, 46, 46, 0.06)',
          border: '1px solid rgba(217, 46, 46, 0.3)',
          borderLeft: '4px solid #d92e2e',
          borderRadius: 6,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: '#8b0000', marginBottom: 6 }}>
          Consult not indicated yet
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{reason}</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          style={{
            border: '1px solid rgba(0,0,0,0.15)',
            background: 'transparent',
            padding: '6px 12px',
            borderRadius: 4,
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 11,
          }}
        >
          ‹ back
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRestart(); }}
          style={{
            border: '1px solid rgba(0,0,0,0.15)',
            background: 'transparent',
            padding: '6px 12px',
            borderRadius: 4,
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 11,
          }}
        >
          restart
        </button>
      </div>
    </div>
  );
}

function RecommendOutcome({
  path,
  fieldValues,
  onField,
  onCopy,
  onSendOe,
  onBack,
  onRestart,
  copied,
  module,
}: {
  path: ConsultPath;
  fieldValues: Record<string, string>;
  onField: (key: string, val: string) => void;
  onCopy: () => void;
  onSendOe: () => void;
  onBack: () => void;
  onRestart: () => void;
  copied: boolean;
  module: ModuleData;
}): JSX.Element {
  const expanded = expandTemplate(path.output_template, fieldValues);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          padding: '12px 14px',
          background: 'rgba(15, 107, 66, 0.06)',
          border: '1px solid rgba(15, 107, 66, 0.3)',
          borderLeft: '4px solid #0F6B42',
          borderRadius: 6,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: '#0F6B42', marginBottom: 4 }}>
          Consult indicated
        </div>
        <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.45 }}>
          {path.label} — copy the message below into the {path.modality === 'virtual' ? 'virtual ' : ''}consult.
        </div>
      </div>

      {path.fields && path.fields.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {path.fields.map((f) => (
            <label key={f.key} style={{ fontSize: 11, opacity: 0.9, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontWeight: 600, opacity: 0.75 }}>{f.label}</span>
              <input
                type="text"
                value={fieldValues[f.key] ?? ''}
                onPointerDown={(e) => e.stopPropagation()}
                onInput={(e) => onField(f.key, (e.currentTarget as HTMLInputElement).value)}
                placeholder={f.default ?? ''}
                style={{
                  font: 'inherit',
                  fontSize: 12,
                  padding: '5px 8px',
                  border: '1px solid rgba(0,0,0,0.18)',
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.8)',
                }}
              />
            </label>
          ))}
        </div>
      )}

      <div
        style={{
          padding: '12px 14px',
          fontSize: 12.5,
          lineHeight: 1.5,
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 6,
          whiteSpace: 'pre-wrap',
          maxHeight: '40vh',
          overflowY: 'auto',
          fontFamily: 'inherit',
          userSelect: 'text',
        }}
      >
        {expanded}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onCopy(); }}
          style={{
            border: '1.5px solid var(--type-color)',
            background: copied ? 'var(--type-color)' : 'transparent',
            color: copied ? '#fff' : 'inherit',
            padding: '7px 14px',
            borderRadius: 4,
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onSendOe(); }}
          style={{
            border: '1px solid rgba(0,0,0,0.18)',
            background: 'transparent',
            padding: '7px 14px',
            borderRadius: 4,
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 12,
          }}
        >
          🔬 Send via OpenEvidence
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          style={{
            marginLeft: 'auto',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 11,
            opacity: 0.65,
            padding: '7px 8px',
          }}
        >
          ‹ back
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRestart(); }}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 11,
            opacity: 0.65,
            padding: '7px 8px',
          }}
        >
          restart
        </button>
      </div>

      {path.refs && path.refs.length > 0 && module.references && (
        <div style={{ fontSize: 10.5, opacity: 0.6, lineHeight: 1.45, marginTop: 4 }}>
          <strong>References cited in template:</strong>{' '}
          {path.refs.join(', ')}
        </div>
      )}
    </div>
  );
}

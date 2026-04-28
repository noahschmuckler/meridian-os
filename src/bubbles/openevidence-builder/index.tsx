// OpenEvidence query builder.
//
// Builds a structured clinical query (question type + topic + optional
// patient context) and copies it to the clipboard so the provider can paste
// it into openevidence.com. Mirrors vanilla Meridian's "Copy for
// OpenEvidence" flow. Once the harness adoption mechanic ships, an LLM with
// this bubble in its brain will be able to populate fields and trigger
// copies from natural-language conversation.

import { useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

type QuestionType = 'risk' | 'treatment' | 'diagnostic' | 'prognosis' | 'screening';

const QUESTION_TYPES: { key: QuestionType; label: string }[] = [
  { key: 'risk', label: 'Risk' },
  { key: 'treatment', label: 'Treatment' },
  { key: 'diagnostic', label: 'Diagnostic' },
  { key: 'prognosis', label: 'Prognosis' },
  { key: 'screening', label: 'Screening' },
];

export function OpenEvidenceBuilder({ instance }: Props): JSX.Element {
  const [questionType, setQuestionType] = useState<QuestionType>('treatment');
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');

  const queryPreview = topic.trim()
    ? `[${questionType}] ${topic.trim()}${context.trim() ? ` — ${context.trim()}` : ''}`
    : '';

  const [copied, setCopied] = useState<'ok' | 'err' | null>(null);
  const copiedTimeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (copiedTimeoutRef.current != null) window.clearTimeout(copiedTimeoutRef.current);
  }, []);

  function flashCopied(state: 'ok' | 'err'): void {
    setCopied(state);
    if (copiedTimeoutRef.current != null) window.clearTimeout(copiedTimeoutRef.current);
    copiedTimeoutRef.current = window.setTimeout(() => setCopied(null), 1800);
  }

  async function send(): Promise<void> {
    if (!queryPreview) return;
    try {
      await navigator.clipboard.writeText(queryPreview);
      flashCopied('ok');
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = queryPreview;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        flashCopied(ok ? 'ok' : 'err');
      } catch {
        flashCopied('err');
      }
    }
  }

  function reset(): void {
    setQuestionType('treatment');
    setTopic('');
    setContext('');
    setCopied(null);
  }

  return (
    <div class="cm-oe" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>{instance.title}</span>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); reset(); }}
          title="Clear"
          style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', fontSize: 11, opacity: 0.65 }}
        >clear</button>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '10px 12px 12px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, opacity: 0.85, marginBottom: 10 }}>
          <span style={{ fontWeight: 600 }}>Question type</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {QUESTION_TYPES.map((qt) => {
              const active = qt.key === questionType;
              return (
                <button
                  key={qt.key}
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); setQuestionType(qt.key); }}
                  style={{
                    flex: '1 1 auto',
                    minWidth: 60,
                    font: 'inherit',
                    fontSize: 11.5,
                    padding: '5px 8px',
                    border: '1px solid rgba(0,0,0,0.15)',
                    borderRadius: 4,
                    background: active ? 'var(--type-color)' : 'rgba(255,255,255,0.6)',
                    color: active ? '#fff' : 'inherit',
                    cursor: 'pointer',
                  }}
                >{qt.label}</button>
              );
            })}
          </div>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, opacity: 0.85, marginBottom: 10 }}>
          <span style={{ fontWeight: 600 }}>Clinical topic</span>
          <input
            type="text"
            value={topic}
            placeholder="e.g. statin in CKD stage 3"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onInput={(e) => setTopic((e.currentTarget as HTMLInputElement).value)}
            style={{ font: 'inherit', fontSize: 13, padding: '5px 8px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4, background: 'rgba(255,255,255,0.6)' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, opacity: 0.85, marginBottom: 10 }}>
          <span style={{ fontWeight: 600 }}>Patient context (optional)</span>
          <textarea
            value={context}
            placeholder="Age, comorbidities, current meds…"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onInput={(e) => setContext((e.currentTarget as HTMLTextAreaElement).value)}
            rows={3}
            style={{ font: 'inherit', fontSize: 12.5, padding: '5px 8px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4, background: 'rgba(255,255,255,0.6)', resize: 'vertical' }}
          />
        </label>

        <div
          style={{
            marginTop: 10,
            padding: '8px 10px',
            background: 'rgba(0,0,0,0.04)',
            borderRadius: 4,
            fontSize: 11,
            lineHeight: 1.4,
            fontFamily: 'monospace',
            minHeight: 28,
            opacity: queryPreview ? 1 : 0.5,
          }}
        >
          {queryPreview || '— preview will appear here —'}
        </div>

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); void send(); }}
          disabled={!queryPreview}
          style={{
            marginTop: 10,
            width: '100%',
            font: 'inherit',
            fontSize: 12.5,
            fontWeight: 600,
            padding: '8px 10px',
            border: 'none',
            borderRadius: 4,
            background: copied === 'ok'
              ? '#0F6B42'
              : copied === 'err'
                ? '#d92e2e'
                : queryPreview ? 'var(--type-color)' : 'rgba(0,0,0,0.08)',
            color: copied
              ? '#fff'
              : queryPreview ? '#1a1a1a' : 'rgba(0,0,0,0.4)',
            cursor: queryPreview ? 'pointer' : 'default',
            transition: 'background 200ms, color 200ms',
          }}
        >{
          copied === 'ok'
            ? '✓ Copied — paste into OpenEvidence'
            : copied === 'err'
              ? 'Copy failed — select preview and copy manually'
              : 'Copy for OpenEvidence'
        }</button>

        <p style={{ fontSize: 10, lineHeight: 1.4, opacity: 0.55, marginTop: 10, fontStyle: 'italic' }}>
          Click to copy the query, then paste into <a
            href="https://www.openevidence.com"
            target="_blank"
            rel="noreferrer"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{ color: 'inherit' }}
          >openevidence.com</a>.
        </p>
      </div>
    </div>
  );
}

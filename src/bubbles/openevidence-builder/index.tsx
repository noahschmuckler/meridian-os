// OpenEvidence query builder — UI shell for v1.
//
// Builds a structured clinical query (question type + topic + optional
// patient context). The "send" action is a no-op for now — this iteration
// is the bubble surface only. Once the harness adoption mechanic ships, an
// LLM with this bubble in its brain will be able to populate fields and
// trigger sends from natural-language conversation.

import { useState } from 'preact/hooks';
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

  function send(): void {
    // No-op for v1 — wiring to OpenEvidence is future scope.
    console.info('OE query (not yet wired):', queryPreview);
  }

  function reset(): void {
    setQuestionType('treatment');
    setTopic('');
    setContext('');
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
          onClick={(e) => { e.stopPropagation(); send(); }}
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
            background: queryPreview ? 'var(--type-color)' : 'rgba(0,0,0,0.08)',
            color: queryPreview ? '#1a1a1a' : 'rgba(0,0,0,0.4)',
            cursor: queryPreview ? 'pointer' : 'default',
          }}
        >Send to OpenEvidence</button>

        <p style={{ fontSize: 10, lineHeight: 1.4, opacity: 0.55, marginTop: 10, fontStyle: 'italic' }}>
          Draft UI — send is a no-op. Wiring to OpenEvidence and harness adoption (drag onto chat → "adopt program") is the next iteration.
        </p>
      </div>
    </div>
  );
}

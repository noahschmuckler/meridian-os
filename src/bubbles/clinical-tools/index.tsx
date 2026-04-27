// Clinical tools bubble — calculators and other patient-agnostic tools that
// can be summoned into any module. v1: shows a list of available tools
// (currently just PREVENT). Clicking a tool is a no-op for now — wiring the
// summon mechanic is future scope. The bubble is decorative + discovery in
// this iteration so providers can see what's available.

import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

interface Tool {
  id: string;
  title: string;
  blurb: string;
  glyph: string;
}

const TOOLS: Tool[] = [
  {
    id: 'prevent-calculator',
    title: 'PREVENT calculator',
    blurb: '10-year ASCVD risk · AHA/ACC 2023',
    glyph: '🫀',
  },
];

export function ClinicalTools({ instance }: Props): JSX.Element {
  return (
    <div class="cm-tools" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>{instance.title}</span>
        <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 'auto' }}>{TOOLS.length}</span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '8px 12px 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TOOLS.map((t) => (
            <div
              key={t.id}
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
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1.1 }}>{t.glyph}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12.5, lineHeight: 1.3 }}>{t.title}</div>
                <div style={{ fontSize: 10.5, opacity: 0.65, marginTop: 2 }}>{t.blurb}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10.5, lineHeight: 1.4, opacity: 0.55, marginTop: 12, fontStyle: 'italic' }}>
          Calculators auto-attach to their modules (PREVENT shows on lipid). Manual summon coming soon.
        </p>
      </div>
    </div>
  );
}

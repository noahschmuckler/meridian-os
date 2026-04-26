// provider-dossier primitive: aggregate primitive showing provider's resume + Signal data + disciplinary record.
// v1: simple structured view from seed.

import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';

interface SignalRow {
  metric: string;
  value: string;
  trend?: 'up' | 'down' | 'flat';
}

interface DossierData {
  name: string;
  role: string;
  start_date?: string;
  prior_residency?: string;
  prior_practice?: string;
  signal?: SignalRow[];
  disciplinary?: string[];
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

export function ProviderDossier({ instance, seeds }: Props): JSX.Element {
  const data = (instance.props.dossier as DossierData | undefined)
    ?? (seeds['patel.dossier'] as DossierData | undefined)
    ?? { name: 'unknown', role: '' };

  return (
    <div class="dos" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title">{data.name}</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>{data.role}</span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto' }}>
        {data.start_date && (
          <div class="dos__line"><span class="dos__lbl">start</span><span>{data.start_date}</span></div>
        )}
        {data.prior_residency && (
          <div class="dos__line"><span class="dos__lbl">residency</span><span>{data.prior_residency}</span></div>
        )}
        {data.prior_practice && (
          <div class="dos__line"><span class="dos__lbl">prior</span><span>{data.prior_practice}</span></div>
        )}
        {data.signal && data.signal.length > 0 && (
          <>
            <div class="dos__hdr">Signal data</div>
            {data.signal.map((s) => (
              <div key={s.metric} class="dos__line">
                <span class="dos__lbl">{s.metric}</span>
                <span>{s.value}{s.trend && <span class="dos__trend">{trendGlyph(s.trend)}</span>}</span>
              </div>
            ))}
          </>
        )}
        {data.disciplinary && data.disciplinary.length > 0 && (
          <>
            <div class="dos__hdr dos__hdr--warn">Disciplinary</div>
            {data.disciplinary.map((d, i) => (
              <div key={i} class="dos__warn-item">{d}</div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function trendGlyph(t: 'up' | 'down' | 'flat'): string {
  return t === 'up' ? ' ↑' : t === 'down' ? ' ↓' : ' →';
}

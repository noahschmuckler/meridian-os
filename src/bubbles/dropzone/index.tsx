// dropzone primitive: transcript ingest drop area.
// Ported affordance from meridian-onboarding renderIngestPanel (lines 5728–5743).
// v1: visual mock only — actual ingest endpoint wiring deferred (was in handleTranscriptDrop, lines 5778–5900).

import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';

type IngestStatus = 'idle' | 'over' | 'processing' | 'done';

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
}

export function Dropzone({ instance: _instance, seeds: _seeds }: Props): JSX.Element {
  const [status, setStatus] = useState<IngestStatus>('idle');
  const [filename, setFilename] = useState<string>('');

  const onDragOver = (e: DragEvent): void => {
    e.preventDefault();
    if (status === 'idle') setStatus('over');
  };
  const onDragLeave = (): void => {
    if (status === 'over') setStatus('idle');
  };
  const onDrop = (e: DragEvent): void => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return setStatus('idle');
    setFilename(file.name);
    setStatus('processing');
    // v1 mock: simulate ingest
    setTimeout(() => setStatus('done'), 1800);
  };

  const reset = (): void => {
    setStatus('idle');
    setFilename('');
  };

  return (
    <div class="dz" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title">Drop transcript</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>.docx</span>
      </div>
      <div
        class={`dz__area dz__area--${status}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {status === 'idle' && <div class="dz__msg">drop a transcript here</div>}
        {status === 'over' && <div class="dz__msg dz__msg--bold">release to ingest</div>}
        {status === 'processing' && (
          <div class="dz__msg">
            <div class="dz__spin" />
            processing {filename}…
          </div>
        )}
        {status === 'done' && (
          <div class="dz__msg">
            <div>✓ ingested {filename}</div>
            <button class="dz__reset" onClick={reset}>drop another</button>
          </div>
        )}
      </div>
    </div>
  );
}

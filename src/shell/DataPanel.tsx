import { useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import {
  getStorageStats,
  downloadBackup,
  importBackup,
  clearAllData,
  formatBytes,
  CORE_KEYS,
  type StorageStat,
} from '../lib/dataBackup';

interface DataPanelProps {
  open: boolean;
  onClose: () => void;
}

type ImportStep = 'idle' | 'confirm' | 'success' | 'error';

export function DataPanel({ open, onClose }: DataPanelProps): JSX.Element | null {
  const [stats, setStats] = useState<StorageStat[]>([]);
  const [importStep, setImportStep] = useState<ImportStep>('idle');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importMsg, setImportMsg] = useState('');
  const [clearStep, setClearStep] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setStats(getStorageStats());
      setImportStep('idle');
      setImportFile(null);
      setImportMsg('');
      setClearStep(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const coreStats = stats.filter((s) => CORE_KEYS.includes(s.key));
  const totalBytes = stats.reduce((sum, s) => sum + s.bytes, 0);

  function handleFileChange(e: Event): void {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    setImportFile(file);
    setImportStep('confirm');
    // reset so the same file can be re-selected if needed
    (e.currentTarget as HTMLInputElement).value = '';
  }

  function doImport(): void {
    if (!importFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = importBackup(text);
      if (result.ok) {
        setImportMsg(`Restored ${result.keysRestored} data store${result.keysRestored !== 1 ? 's' : ''}.`);
        setImportStep('success');
        window.setTimeout(() => window.location.reload(), 1500);
      } else {
        setImportMsg(result.error);
        setImportStep('error');
      }
    };
    reader.readAsText(importFile);
  }

  function doClear(): void {
    clearAllData();
    window.location.reload();
  }

  return (
    <div class="data-panel-scrim" onClick={onClose}>
      <div class="data-panel" onClick={(e) => e.stopPropagation()}>

        <div class="data-panel__header">
          <span class="data-panel__title">Data &amp; Backup</span>
          <button type="button" class="data-panel__close" aria-label="Close" onClick={onClose}>×</button>
        </div>

        {/* Storage summary */}
        <div class="data-panel__section">
          <div class="data-panel__section-label">Stored data</div>
          <div class="data-panel__stats">
            {coreStats.map((s) => (
              <div key={s.key} class={`data-panel__stat-row${s.present ? '' : ' data-panel__stat-row--empty'}`}>
                <span class="data-panel__stat-name">{s.label}</span>
                <span class="data-panel__stat-size">{s.present ? formatBytes(s.bytes) : '—'}</span>
              </div>
            ))}
          </div>
          <div class="data-panel__total">Total (all keys): {formatBytes(totalBytes)}</div>
        </div>

        {/* Export */}
        <div class="data-panel__section">
          <div class="data-panel__section-label">Export</div>
          <p class="data-panel__desc">
            Download all app data as a single JSON file. Use this to back up your work,
            move to a new device, or prepare for a future cloud migration.
          </p>
          <button type="button" class="data-panel__btn data-panel__btn--primary" onClick={downloadBackup}>
            Download backup
          </button>
        </div>

        {/* Import / Restore */}
        <div class="data-panel__section">
          <div class="data-panel__section-label">Restore</div>

          {importStep === 'idle' && (
            <>
              <p class="data-panel__desc">
                Restore from a previously exported backup file. Current data will be overwritten
                and the app will reload.
              </p>
              <button type="button" class="data-panel__btn" onClick={() => fileRef.current?.click()}>
                Choose backup file…
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </>
          )}

          {importStep === 'confirm' && (
            <>
              <p class="data-panel__desc data-panel__desc--warn">
                Restore from <strong>{importFile?.name}</strong>?
                This will overwrite your current data and reload the app.
              </p>
              <div class="data-panel__row">
                <button type="button" class="data-panel__btn" onClick={() => setImportStep('idle')}>Cancel</button>
                <button type="button" class="data-panel__btn data-panel__btn--primary" onClick={doImport}>Restore</button>
              </div>
            </>
          )}

          {importStep === 'success' && (
            <p class="data-panel__desc data-panel__desc--ok">{importMsg} Reloading…</p>
          )}

          {importStep === 'error' && (
            <>
              <p class="data-panel__desc data-panel__desc--warn">{importMsg}</p>
              <button type="button" class="data-panel__btn" onClick={() => { setImportStep('idle'); setImportFile(null); }}>
                Try again
              </button>
            </>
          )}
        </div>

        {/* Clear */}
        <div class="data-panel__section data-panel__section--danger-zone">
          <div class="data-panel__section-label">Clear data</div>

          {!clearStep && (
            <>
              <p class="data-panel__desc">
                Remove all stored app data. The app reloads with factory defaults.
                Export a backup first if you want to keep your work.
              </p>
              <button type="button" class="data-panel__btn data-panel__btn--danger" onClick={() => setClearStep(true)}>
                Clear all data…
              </button>
            </>
          )}

          {clearStep && (
            <>
              <p class="data-panel__desc data-panel__desc--warn">
                This cannot be undone. Are you sure?
              </p>
              <div class="data-panel__row">
                <button type="button" class="data-panel__btn" onClick={() => setClearStep(false)}>Cancel</button>
                <button type="button" class="data-panel__btn data-panel__btn--danger" onClick={doClear}>Confirm clear</button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

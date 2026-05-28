// Data backup and restore for meridian-os.
// Knows every localStorage key the app writes. Bundles them into a single
// timestamped JSON for download, and restores from one.
//
// The export format is intentionally simple — raw localStorage strings stored
// under their original keys. When the app migrates to Cloudflare D1, the
// same JSON structure becomes the one-time migration payload.

export const BACKUP_KEYS = [
  // Core data — the records that matter
  'meridian-mt.v1',                    // Onboarding Tracker SPA
  'meridian-os.mentorshipData',        // Mentorship bubbles workspace
  'meridian-os.filesystem',            // Bubble file system (notes, markdown)
  'meridian-os.workspaceStates.v1',    // Bubble arrangements per workspace
  'meridian-os.savedLayouts.v1',       // Named workspace save slots
  'meridian-os.userModules',           // User-uploaded clinical modules
  // UI state — lower value but included for full-fidelity round-trip
  'meridian-os.launcherApp.v1',
  'meridian-os.mondrianHomeView.v1',
  'meridian-os.trainerProviderContext',
  'meridian-os.moduleFocus',
  'meridian-os.mentorshipFocus',
  'meridian-os.bubbleFontScale.v1',
  'meridian-os.consultBuilderShown',
  'meridian-os.contractBuilderShown',
] as const;

export type BackupKey = (typeof BACKUP_KEYS)[number];

export const CORE_KEYS: BackupKey[] = [
  'meridian-mt.v1',
  'meridian-os.mentorshipData',
  'meridian-os.filesystem',
  'meridian-os.workspaceStates.v1',
  'meridian-os.savedLayouts.v1',
  'meridian-os.userModules',
];

export const KEY_LABELS: Record<BackupKey, string> = {
  'meridian-mt.v1':                    'Onboarding Tracker',
  'meridian-os.mentorshipData':        'Mentorship workspace data',
  'meridian-os.filesystem':            'Bubble file system',
  'meridian-os.workspaceStates.v1':    'Workspace layouts',
  'meridian-os.savedLayouts.v1':       'Saved layout slots',
  'meridian-os.userModules':           'Uploaded clinical modules',
  'meridian-os.launcherApp.v1':        'Last active app',
  'meridian-os.mondrianHomeView.v1':   'Home grid view',
  'meridian-os.trainerProviderContext':'Trainer context',
  'meridian-os.moduleFocus':           'Module focus state',
  'meridian-os.mentorshipFocus':       'Mentorship focus state',
  'meridian-os.bubbleFontScale.v1':    'Font size preferences',
  'meridian-os.consultBuilderShown':   'Consult auto-spawn flags',
  'meridian-os.contractBuilderShown':  'Contract auto-spawn flags',
};

export interface MeridianBackup {
  version: '1';
  app: 'meridian-os';
  exportedAt: string;
  entries: Partial<Record<BackupKey, string>>;
}

export interface StorageStat {
  key: BackupKey;
  label: string;
  bytes: number;
  present: boolean;
}

export function getStorageStats(): StorageStat[] {
  return BACKUP_KEYS.map((key) => {
    const raw = localStorage.getItem(key);
    return {
      key,
      label: KEY_LABELS[key],
      bytes: raw ? new Blob([raw]).size : 0,
      present: raw !== null,
    };
  });
}

export function exportAll(): MeridianBackup {
  const entries: Partial<Record<BackupKey, string>> = {};
  for (const key of BACKUP_KEYS) {
    const val = localStorage.getItem(key);
    if (val !== null) entries[key] = val;
  }
  return { version: '1', app: 'meridian-os', exportedAt: new Date().toISOString(), entries };
}

export function downloadBackup(): void {
  const backup = exportAll();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meridian-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export type ImportResult =
  | { ok: true; keysRestored: number }
  | { ok: false; error: string };

export function importBackup(json: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'File is not valid JSON.' };
  }
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as MeridianBackup).app !== 'meridian-os' ||
    (parsed as MeridianBackup).version !== '1'
  ) {
    return { ok: false, error: 'This file does not look like a meridian-os backup.' };
  }
  const backup = parsed as MeridianBackup;
  let keysRestored = 0;
  for (const [key, value] of Object.entries(backup.entries)) {
    if ((BACKUP_KEYS as readonly string[]).includes(key) && typeof value === 'string') {
      try {
        localStorage.setItem(key, value);
        keysRestored++;
      } catch {
        // storage quota — skip and keep going
      }
    }
  }
  return { ok: true, keysRestored };
}

export function clearAllData(): void {
  for (const key of BACKUP_KEYS) {
    localStorage.removeItem(key);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

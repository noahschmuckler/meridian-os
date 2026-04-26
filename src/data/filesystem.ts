// Emulated filesystem for meridian-os.
//
// Bubbles are *views* over MeridianFiles. A file holds a serialized
// BubbleInstance plus metadata. Files persist beyond any specific bubble's
// presence in a workspace, which is what lets a dismissed bubble be summoned
// back later.
//
// Files are scoped to either a workspace or 'global'. Identity is a stable id
// (`f-...`) — the user-facing name is mutable and renames don't change identity.
//
// Persistence: localStorage key `meridian-os.filesystem`, JSON-cloned on every
// mutation. Hydrates from storage at module load; seeds demo content if empty.

import type { BubbleInstance, BubblePrimitiveType } from '../types';
import { PRIMITIVE_LABELS } from '../bubbles/labels';

export interface MeridianFile {
  id: string;
  name: string;
  type: BubblePrimitiveType;
  scope: 'workspace' | 'global';
  workspaceId?: string;
  instance: BubbleInstance;
  createdAt: number;
  modifiedAt: number;
}

const STORAGE_KEY = 'meridian-os.filesystem';

const filesById = new Map<string, MeridianFile>();
let _seq = 0;

function nextId(): string {
  return `f-${Date.now().toString(36)}-${(++_seq).toString(36)}`;
}

function persist(): void {
  try {
    const arr = Array.from(filesById.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ files: arr }));
  } catch {
    // Quota exceeded or storage disabled — silently drop. The demo continues
    // working in-memory; refresh will reset.
  }
}

function hydrate(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { files?: MeridianFile[] };
    for (const f of parsed.files ?? []) {
      filesById.set(f.id, f);
    }
  } catch {
    // Corrupt storage; ignore and let seed run.
  }
}

hydrate();

export function listFiles(filter: {
  scope?: 'workspace' | 'global';
  workspaceId?: string;
  type?: BubblePrimitiveType;
}): MeridianFile[] {
  return Array.from(filesById.values())
    .filter((f) => {
      if (filter.scope && f.scope !== filter.scope) return false;
      if (filter.workspaceId !== undefined && f.workspaceId !== filter.workspaceId) return false;
      if (filter.type && f.type !== filter.type) return false;
      return true;
    })
    .sort((a, b) => b.modifiedAt - a.modifiedAt);
}

export function getFile(id: string): MeridianFile | undefined {
  return filesById.get(id);
}

export function nextNameFor(
  type: BubblePrimitiveType,
  scope: 'workspace' | 'global',
  workspaceId?: string,
): string {
  const base = PRIMITIVE_LABELS[type] ?? type;
  const existing = listFiles({ scope, workspaceId, type });
  // Find the largest "{base} N" suffix in use.
  let max = 0;
  const re = new RegExp(`^${escapeRe(base)} (\\d+)$`);
  for (const f of existing) {
    const m = re.exec(f.name);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  }
  return `${base} ${max + 1}`;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface CreateFileInput {
  name?: string;
  type: BubblePrimitiveType;
  scope: 'workspace' | 'global';
  workspaceId?: string;
  instance: BubbleInstance;
}

export function createFile(input: CreateFileInput): MeridianFile {
  const name = input.name ?? nextNameFor(input.type, input.scope, input.workspaceId);
  const now = Date.now();
  const file: MeridianFile = {
    id: nextId(),
    name,
    type: input.type,
    scope: input.scope,
    workspaceId: input.workspaceId,
    instance: jsonClone(input.instance),
    createdAt: now,
    modifiedAt: now,
  };
  filesById.set(file.id, file);
  persist();
  return file;
}

export function updateFileName(id: string, newName: string): MeridianFile | undefined {
  const f = filesById.get(id);
  if (!f) return undefined;
  const trimmed = newName.trim();
  if (!trimmed || trimmed === f.name) return f;
  f.name = trimmed;
  f.modifiedAt = Date.now();
  persist();
  return f;
}

export function updateFileInstance(id: string, instance: BubbleInstance): MeridianFile | undefined {
  const f = filesById.get(id);
  if (!f) return undefined;
  f.instance = jsonClone(instance);
  f.modifiedAt = Date.now();
  persist();
  return f;
}

export function deleteFile(id: string): boolean {
  const ok = filesById.delete(id);
  if (ok) persist();
  return ok;
}

function jsonClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

// Seed two demo markdown files in the trainer workspace if the filesystem
// is empty. Convention: `Patel scratch pad` is editable + empty; `Prior session
// memory` is a sample paragraph the trainer might have left for next time.
export function seedIfEmpty(): void {
  if (filesById.size > 0) return;
  createFile({
    name: 'Patel scratch pad',
    type: 'markdown',
    scope: 'workspace',
    workspaceId: 'trainer',
    instance: {
      id: 'seed-md-scratch',
      type: 'markdown',
      title: 'Patel scratch pad',
      props: {
        body: '',
        editable: true,
      },
      resize: { initial: 'm', states: {} },
    },
  });
  createFile({
    name: 'Prior session memory',
    type: 'markdown',
    scope: 'workspace',
    workspaceId: 'trainer',
    instance: {
      id: 'seed-md-prior',
      type: 'markdown',
      title: 'Prior session memory',
      props: {
        body:
          "Day 1 with Dr. Patel: covered SmartPhrases and In-Basket basics. Patel asked twice about HCC capture — flagged as a focus area for Day 2. Recommend revisiting the LOS rubric before next session; she dropped it twice in our review.",
        editable: false,
      },
      resize: { initial: 'm', states: {} },
    },
  });
}

seedIfEmpty();

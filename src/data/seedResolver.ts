// Seed resolver: replaces `{ "$seed": "key.path" }` tokens in props with values from a seed dict.
// Lets workspace JSON stay small while letting one seed file feed many bubbles.

export type SeedDict = Record<string, unknown>;

export function loadSeeds(modules: Record<string, SeedDict>): SeedDict {
  // Flat-merge multiple seed files. Later sources override earlier ones if keys collide.
  const merged: SeedDict = {};
  for (const dict of Object.values(modules)) {
    Object.assign(merged, dict);
  }
  return merged;
}

export function resolveSeedTokens<T>(value: T, seeds: SeedDict): T {
  if (Array.isArray(value)) {
    return value.map((v) => resolveSeedTokens(v, seeds)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.$seed === 'string') {
      return readPath(seeds, obj.$seed) as T;
    }
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj)) {
      out[k] = resolveSeedTokens(obj[k], seeds);
    }
    return out as T;
  }
  return value;
}

function readPath(root: SeedDict, path: string): unknown {
  let cursor: unknown = root;
  for (const part of path.split('.')) {
    if (cursor && typeof cursor === 'object' && part in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return cursor;
}

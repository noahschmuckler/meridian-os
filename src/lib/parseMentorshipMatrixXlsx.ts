// Parse a previously-exported Mentorship XLSX back into MentorshipData.
//
// The file format is documented in generateMentorshipMatrixXlsx.ts. The
// importer reads the canonical state sheets (Providers / Users / Checkoffs /
// Notes / Flags) — the matrix and phase-definitions sheets are display-only
// and ignored on import.
//
// Validation: requires a recognizable _Meta sheet, then proceeds best-effort.
// Missing sheets are tolerated (treated as empty); rows missing required keys
// are skipped silently. The parser returns a fully-formed MentorshipData
// regardless, so the caller can replace mentorshipDataSignal in one shot.

import type {
  MentorshipData,
  ProviderRecord,
  UserRecord,
  CheckoffEntry,
  NoteEntry,
  FlagEntry,
  UserRole,
} from '../data/mentorshipData';

export class XlsxImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'XlsxImportError';
  }
}

export interface ParseResult {
  data: MentorshipData;
  meta: {
    format?: string;
    formatVersion?: number;
    exportedAt?: string;
    providerCount?: number;
    checkoffCount?: number;
  };
  warnings: string[];
}

const VALID_FORMAT = 'meridian-os.mentorship.full-state';
const VALID_PROVIDER_ROLES = new Set<ProviderRecord['role']>(['MD', 'DO', 'NP', 'PA']);
const VALID_USER_ROLES = new Set<UserRole>(['executive', 'director', 'mentor']);

export async function parseMentorshipMatrixXlsx(file: File | Blob): Promise<ParseResult> {
  const ExcelJSMod = await import('exceljs');
  const ExcelJS = (ExcelJSMod as unknown as { default?: typeof ExcelJSMod }).default ?? ExcelJSMod;

  const buffer = await file.arrayBuffer();
  const wbRuntime = new ExcelJS.Workbook();
  try {
    await wbRuntime.xlsx.load(buffer);
  } catch (err) {
    throw new XlsxImportError(`Could not read file as XLSX: ${err instanceof Error ? err.message : String(err)}`);
  }
  const wb = wbRuntime as unknown as WB;

  const warnings: string[] = [];

  // --- Meta validation
  const meta = readMeta(wb);
  if (!meta.format) {
    throw new XlsxImportError('This file is missing the _Meta sheet. It does not look like a Mentorship export.');
  }
  if (meta.format !== VALID_FORMAT) {
    throw new XlsxImportError(`Unrecognized format "${meta.format}". Expected "${VALID_FORMAT}".`);
  }
  if (meta.formatVersion !== undefined && meta.formatVersion > 1) {
    warnings.push(`File reports format_version=${meta.formatVersion}; importer only knows v1. Proceeding best-effort.`);
  }

  // --- Sheets
  const providers = readProviders(wb, warnings);
  const users = readUsers(wb, warnings);
  const checkoffs = readCheckoffs(wb, warnings);
  const notes = readNotes(wb, warnings);
  const flags = readFlags(wb, warnings);

  return {
    data: { users, providers, checkoffs, notes, flags },
    meta,
    warnings,
  };
}

// ---- Cell readers (ExcelJS cell.value can be string | number | Date | rich
// text | formula result; we only need a flat string for our schema).
//
// Minimal shapes — avoids importing exceljs types at module top level (the
// library is lazy-loaded). The runtime objects from exceljs satisfy these.

interface XCell { value: unknown }
interface XRow { getCell(n: number): XCell }
interface XSheet {
  columnCount: number;
  rowCount: number;
  getRow(n: number): XRow;
}
interface XBook {
  getWorksheet(name: string): XSheet | undefined;
}
type WB = XBook;
type Worksheet = XSheet;

function cellString(cell: XCell): string {
  const v = cell.value;
  if (v == null) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'object' && v !== null && 'text' in v) {
    const text = (v as { text: unknown }).text;
    return typeof text === 'string' ? text.trim() : '';
  }
  if (typeof v === 'object' && v !== null && 'richText' in v) {
    const rt = (v as { richText: Array<{ text?: string }> }).richText;
    return rt.map((seg) => seg.text ?? '').join('').trim();
  }
  if (typeof v === 'object' && v !== null && 'result' in v) {
    const r = (v as { result: unknown }).result;
    return r == null ? '' : String(r).trim();
  }
  return String(v).trim();
}

function readSheetRows(
  ws: Worksheet | undefined,
): { headers: Record<string, number>; rowCount: number; getCell: (row: number, header: string) => string } | null {
  if (!ws) return null;
  const headerRow = ws.getRow(1);
  const headers: Record<string, number> = {};
  for (let c = 1; c <= ws.columnCount; c++) {
    const h = cellString(headerRow.getCell(c)).toLowerCase();
    if (h) headers[h] = c;
  }
  return {
    headers,
    rowCount: ws.rowCount,
    getCell(row, header) {
      const col = headers[header.toLowerCase()];
      if (!col) return '';
      return cellString(ws.getRow(row).getCell(col));
    },
  };
}

// ---- Meta

function readMeta(wb: WB): ParseResult['meta'] {
  const ws = wb.getWorksheet('_Meta');
  const out: ParseResult['meta'] = {};
  if (!ws) return out;
  for (let r = 2; r <= ws.rowCount; r++) {
    const key = cellString(ws.getRow(r).getCell(1));
    const value = cellString(ws.getRow(r).getCell(2));
    if (!key) continue;
    switch (key) {
      case 'format':         out.format = value; break;
      case 'format_version': out.formatVersion = Number(value) || undefined; break;
      case 'exported_at':    out.exportedAt = value; break;
      case 'provider_count': out.providerCount = Number(value) || undefined; break;
      case 'checkoff_count': out.checkoffCount = Number(value) || undefined; break;
    }
  }
  return out;
}

// ---- Providers

function readProviders(wb: WB, warnings: string[]): ProviderRecord[] {
  const sheet = readSheetRows(wb.getWorksheet('Providers'));
  if (!sheet) {
    warnings.push('No "Providers" sheet found — starting with zero providers.');
    return [];
  }
  const out: ProviderRecord[] = [];
  for (let r = 2; r <= sheet.rowCount; r++) {
    const id = sheet.getCell(r, 'id');
    if (!id) continue;
    const role = sheet.getCell(r, 'role') as ProviderRecord['role'];
    if (!VALID_PROVIDER_ROLES.has(role)) {
      warnings.push(`Provider ${id}: unknown role "${role}", skipped.`);
      continue;
    }
    out.push({
      id,
      name: sheet.getCell(r, 'name'),
      role,
      startDate: sheet.getCell(r, 'startDate'),
      mentorId: sheet.getCell(r, 'mentorId'),
      directorId: sheet.getCell(r, 'directorId'),
      currentPhase: sheet.getCell(r, 'currentPhase') || 'w1',
    });
  }
  return out;
}

// ---- Users

function readUsers(wb: WB, warnings: string[]): UserRecord[] {
  const sheet = readSheetRows(wb.getWorksheet('Users'));
  if (!sheet) {
    warnings.push('No "Users" sheet found — starting with zero users.');
    return [];
  }
  const out: UserRecord[] = [];
  for (let r = 2; r <= sheet.rowCount; r++) {
    const id = sheet.getCell(r, 'id');
    if (!id) continue;
    const role = sheet.getCell(r, 'role') as UserRole;
    if (!VALID_USER_ROLES.has(role)) {
      warnings.push(`User ${id}: unknown role "${role}", skipped.`);
      continue;
    }
    const directorId = sheet.getCell(r, 'directorId');
    out.push({
      id,
      name: sheet.getCell(r, 'name'),
      role,
      title: sheet.getCell(r, 'title'),
      ...(directorId ? { directorId } : {}),
    });
  }
  return out;
}

// ---- Checkoffs

function readCheckoffs(wb: WB, warnings: string[]): Record<string, CheckoffEntry> {
  const sheet = readSheetRows(wb.getWorksheet('Checkoffs'));
  if (!sheet) return {};
  const out: Record<string, CheckoffEntry> = {};
  for (let r = 2; r <= sheet.rowCount; r++) {
    const providerId = sheet.getCell(r, 'providerId');
    const phaseId = sheet.getCell(r, 'phaseId');
    const itemId = sheet.getCell(r, 'itemId');
    if (!providerId || !phaseId || !itemId) continue;
    const by = sheet.getCell(r, 'by') || 'unknown';
    const at = sheet.getCell(r, 'at') || '';
    out[`${providerId}:${phaseId}:${itemId}`] = { by, at };
  }
  void warnings;
  return out;
}

// ---- Notes

function readNotes(wb: WB, warnings: string[]): Record<string, NoteEntry[]> {
  const sheet = readSheetRows(wb.getWorksheet('Notes'));
  if (!sheet) return {};
  const out: Record<string, NoteEntry[]> = {};
  for (let r = 2; r <= sheet.rowCount; r++) {
    const providerId = sheet.getCell(r, 'providerId');
    const phaseId = sheet.getCell(r, 'phaseId');
    if (!providerId || !phaseId) continue;
    const key = `${providerId}:${phaseId}`;
    const entry: NoteEntry = {
      by: sheet.getCell(r, 'by') || 'unknown',
      at: sheet.getCell(r, 'at') || '',
      text: sheet.getCell(r, 'text'),
    };
    if (!entry.text) continue;
    (out[key] ||= []).push(entry);
  }
  void warnings;
  return out;
}

// ---- Flags

function readFlags(wb: WB, warnings: string[]): FlagEntry[] {
  const sheet = readSheetRows(wb.getWorksheet('Flags'));
  if (!sheet) return [];
  const out: FlagEntry[] = [];
  for (let r = 2; r <= sheet.rowCount; r++) {
    const providerId = sheet.getCell(r, 'providerId');
    if (!providerId) continue;
    const text = sheet.getCell(r, 'text');
    if (!text) continue;
    const resolvedRaw = sheet.getCell(r, 'resolved').toLowerCase();
    const resolved = resolvedRaw === 'true' || resolvedRaw === 'yes' || resolvedRaw === '1';
    const resolvedBy = sheet.getCell(r, 'resolvedBy');
    const resolvedAt = sheet.getCell(r, 'resolvedAt');
    out.push({
      providerId,
      by: sheet.getCell(r, 'by') || 'unknown',
      byId: sheet.getCell(r, 'byId') || 'unknown',
      at: sheet.getCell(r, 'at') || '',
      text,
      resolved,
      ...(resolvedBy ? { resolvedBy } : {}),
      ...(resolvedAt ? { resolvedAt } : {}),
    });
  }
  void warnings;
  return out;
}

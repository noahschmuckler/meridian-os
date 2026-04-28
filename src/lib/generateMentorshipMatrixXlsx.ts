// Generate an XLSX export of the mentorship provider × phase matrix.
//
// Sheet 1 ("Provider Progress"): one row per provider with mentor, director,
// overall %, and per-phase completion fraction. Cells color-coded to match
// the on-screen matrix tiers (green / light-green / amber / red / gray / dim).
// Sheet 2 ("Phase Definitions"): static reference of the 14 phases with type,
// MD-attendance flag, and item count.
//
// Imports exceljs lazily — the consuming bubble's button does the dynamic
// import so the library only chunks in on first export click.

import type {
  MentorshipData,
  Phase,
  ProviderRecord,
  UserRecord,
} from '../data/mentorshipData';
import { PHASES, getPhaseProgress, getOverallProgress } from '../data/mentorshipData';

interface GenerateOptions {
  data: MentorshipData;
  /** When set, scope to this director's providers only. Otherwise all. */
  directorId?: string | null;
}

const COLORS = {
  done:       'FF22C55E', // green
  mostly:     'FF86EFAC', // light green
  started:    'FFFBBF24', // amber
  due:        'FFFCA5A5', // red (current phase, 0%)
  notStarted: 'FFE5E7EB', // light gray
  future:     'FFF0F2F5', // very light gray
  // Text colors paired with backgrounds for legibility
  textOnDone:    'FFFFFFFF',
  textOnMostly:  'FF14532D',
  textOnStarted: 'FF78350F',
  textOnDue:     'FF7F1D1D',
  textOnDim:     'FF6B7280',
};

interface CellTone {
  bg: string;
  fg: string;
}

function tierForCell(pct: number, isCurrent: boolean, isFuture: boolean): CellTone {
  if (isFuture)    return { bg: COLORS.future,     fg: COLORS.textOnDim };
  if (pct === 100) return { bg: COLORS.done,       fg: COLORS.textOnDone };
  if (pct >= 50)   return { bg: COLORS.mostly,     fg: COLORS.textOnMostly };
  if (pct > 0)     return { bg: COLORS.started,    fg: COLORS.textOnStarted };
  if (isCurrent)   return { bg: COLORS.due,        fg: COLORS.textOnDue };
  return { bg: COLORS.notStarted, fg: COLORS.textOnDim };
}

function tierForOverall(pct: number): CellTone {
  if (pct >= 70) return { bg: 'FFDCFCE7', fg: 'FF166534' };
  if (pct >= 30) return { bg: 'FFFEFCE8', fg: 'FF854D0E' };
  return { bg: 'FFFEF2F2', fg: 'FFD92E2E' };
}

export async function generateMentorshipMatrixXlsx(opts: GenerateOptions): Promise<Blob> {
  // Lazy import keeps exceljs out of the initial bundle.
  const ExcelJSMod = await import('exceljs');
  const ExcelJS = (ExcelJSMod as unknown as { default?: typeof ExcelJSMod }).default ?? ExcelJSMod;

  const { data, directorId } = opts;
  const providers: ProviderRecord[] = directorId
    ? data.providers.filter((p) => p.directorId === directorId)
    : data.providers;

  const userById = new Map<string, UserRecord>(data.users.map((u) => [u.id, u]));
  const director = directorId ? userById.get(directorId) : null;

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Meridian-OS';
  wb.created = new Date();
  wb.title = director ? `Mentorship — ${director.name}` : 'Mentorship — Region';

  // ---- Sheet 1: Provider Progress
  const ws = wb.addWorksheet('Provider Progress', {
    views: [{ state: 'frozen', xSplit: 5, ySplit: 1 }],
  });

  const baseColumns: { header: string; key: string; width: number }[] = [
    { header: 'Provider',   key: 'provider', width: 18 },
    { header: 'Role',       key: 'role',     width: 7 },
    { header: 'Mentor',     key: 'mentor',   width: 14 },
    { header: 'Director',   key: 'director', width: 14 },
    { header: 'Overall %',  key: 'overall',  width: 11 },
  ];
  const phaseColumns = PHASES.map((p) => ({
    header: p.short,
    key: `ph_${p.id}`,
    width: 8,
  }));
  ws.columns = [...baseColumns, ...phaseColumns];

  // Style header row
  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: 'FF0F1B2D' } };
  header.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF8F9FB' },
  };
  header.alignment = { vertical: 'middle' };
  header.height = 22;
  // Phase-type accent in the header row's font color
  for (let i = 0; i < PHASES.length; i++) {
    const cell = header.getCell(baseColumns.length + 1 + i);
    const phType = PHASES[i].type;
    cell.font = {
      bold: true,
      color: {
        argb:
          phType === 'weekly'    ? 'FF028090' :
          phType === 'monthly'   ? 'FFF97316' :
                                   'FF8B5CF6',
      },
    };
  }

  // Data rows
  providers.forEach((prov) => {
    const mentor = userById.get(prov.mentorId);
    const directorRec = userById.get(prov.directorId);
    const overall = getOverallProgress(data, prov.id);
    const phIdx = PHASES.findIndex((p) => p.id === prov.currentPhase);

    const row = ws.addRow({
      provider: prov.name,
      role: prov.role,
      mentor: mentor?.name ?? '—',
      director: directorRec?.name ?? '—',
      overall: overall / 100, // percentage format applied below
    });

    // Per-phase cells
    PHASES.forEach((ph, i) => {
      const ps = getPhaseProgress(data, prov.id, ph.id);
      const isCurrent = ph.id === prov.currentPhase;
      const isFuture = i > phIdx;
      const cell = row.getCell(baseColumns.length + 1 + i);
      cell.value = isFuture ? '—' : ps.pct === 100 ? '✓' : `${ps.done}/${ps.total}`;
      const tone = tierForCell(ps.pct, isCurrent, isFuture);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: tone.bg } };
      cell.font = { color: { argb: tone.fg }, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (isCurrent) {
        cell.border = {
          top:    { style: 'medium', color: { argb: 'FF0F1B2D' } },
          bottom: { style: 'medium', color: { argb: 'FF0F1B2D' } },
          left:   { style: 'medium', color: { argb: 'FF0F1B2D' } },
          right:  { style: 'medium', color: { argb: 'FF0F1B2D' } },
        };
      }
    });

    // Format overall as percentage, color-coded
    const overallCell = row.getCell(5);
    overallCell.numFmt = '0%';
    overallCell.alignment = { vertical: 'middle', horizontal: 'center' };
    const overallTone = tierForOverall(overall);
    overallCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: overallTone.bg } };
    overallCell.font = { color: { argb: overallTone.fg }, bold: true };
  });

  // ---- Sheet 2: Phase Definitions
  const refSheet = wb.addWorksheet('Phase Definitions');
  refSheet.columns = [
    { header: 'Phase ID', key: 'id',     width: 9 },
    { header: 'Label',    key: 'label',  width: 14 },
    { header: 'Short',    key: 'short',  width: 7 },
    { header: 'Type',     key: 'type',   width: 11 },
    { header: 'MD?',      key: 'md',     width: 6 },
    { header: 'Items',    key: 'items',  width: 7 },
  ];
  refSheet.getRow(1).font = { bold: true };
  PHASES.forEach((ph: Phase) => {
    refSheet.addRow({
      id: ph.id,
      label: ph.label,
      short: ph.short,
      type: ph.type,
      md: ph.md ? '✓' : '',
      items: ph.items.length,
    });
  });

  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer as ArrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

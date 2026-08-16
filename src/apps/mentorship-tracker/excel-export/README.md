# Excel workbook export — Onboarding Tracker

Generates the four regional **Onboarding Tracker** Excel workbooks that live in
OneDrive inside the Optum tenant. The workbooks are the deliverable; this
directory is the machinery that produces them from the curriculum data already
in the repo, so the curriculum has exactly one source of truth.

## Why Excel

The program has to live inside the organization's Microsoft 365 tenant on
OneDrive. Excel is the only sanctioned format that supports all three
requirements at once: live check-offs with real co-authoring, a structured
landing zone that IT can eventually wire a metrics feed into, and a designed,
navigable home page. OneNote has no structured data layer, and PDF is frozen at
export. Per-region OneDrive sharing also gives the access model real
enforcement — each Primary Care Medical Director gets their region's workbook;
the two program administrators get all four.

## Regenerating

```bash
node extract-data.mjs        # TSX/JSON curriculum  ->  curriculum-data.json
python3 build_workbooks.py   # curriculum-data.json ->  out/*.xlsx
```

Requires `openpyxl` (`pip install openpyxl`). It is deliberately not a
`package.json` dependency — the generator is standalone and must never affect
the Vite build.

`extract-data.mjs` slices the data literals (`MP_PHYS`, `MP_APC`, `OP`, `QP`,
`SEED_PROVS`, `PROD_METRICS`, and the seed score maps) straight out of
`MentorshipTrackerApp.tsx` / `ProductivityPanel.tsx`, and reads
`mentorship-master-checklist.json` directly. It throws if a constant is renamed
or stops being a literal, rather than silently emitting stale data.

## Verifying a build

openpyxl writes formulas with no cached values, so the builder sets
`fullCalcOnLoad` and Excel computes everything on first open. To check the
formulas *before* handing a workbook over, evaluate it with the pure-Python
`formulas` package (`pip install formulas`) and assert no cell yields an error
value. The xlsx skill's LibreOffice-based `recalc.py` is the normal tool for
this but could not load xlsx in the environment where these were built.

Two traps found by doing exactly that, worth remembering if you extend the
generator:

- `COUNTIF(range,"?*")` miscounts styled-but-empty cells. Use `COUNTA` over
  columns that hold typed values (it would over-count a column of formulas
  returning `""`).
- A track that does not apply to a provider must read blank, not `0%`.
  The APC sheet gates its completion row on the roster credential so
  physicians do not appear to have unfinished APC work.

**Curriculum edits belong in the source data, not in the workbook.** Hand edits
to item text in a generated `.xlsx` are lost on the next regeneration.

## What each workbook contains

| Sheet | Purpose |
|---|---|
| **Home** | Navy canvas, Mondrian-colored tiles, each a hyperlink into a sheet with a live stat underneath. |
| **Roster** | One row per provider. Days in practice, expected phase, and Due/Overdue status are computed. |
| **Dashboard** | Five KPI tiles plus a per-provider row: completion by track, review and questionnaire averages, Culture Integration Index, and metric averages. |
| **Medical Director Curriculum** | All 68 master-checklist items grouped by phase, with owner and section, one ✔ column per provider. |
| **Mentor — Physician Track** | Week 0 → Month 12 check-in items. |
| **Mentor — APC Track** | Months 15–24, for Advanced Practice Clinicians. |
| **Office Manager Reviews** | Six checkpoints, 1–10 scores with printed anchors, plus a verbatim provider check-in row. |
| **Provider Questionnaires** | Thirteen checkpoints including the Culture Integration Index items, which roll up separately and flag below 6. |
| **Provider Metrics** | The IT landing zone (see below). |
| **Data Dictionary** | The metrics column contract plus workbook conventions. |
| **Lists** | Hidden — phase labels, nominal start days, credential list backing the dropdowns. |

## The IT metrics landing zone

`Provider Metrics` is a real Excel Table named **`ProviderMetrics`** with a
fixed column contract documented on the Data Dictionary sheet: week ending,
provider ID (the join key, matching Roster column A), provider name, the five
productivity measures carried over from the app's productivity panel, and a
source-system column. Dashboard formulas already reference the table by range,
so when IT points Power Query or Power Automate at it, every dependent figure
lights up with no redesign. Until then rows can be typed manually, and the
dashboard reads `—`.

## Conventions inside the workbooks

Yellow cells are inputs; everything else is a formula or reference content.
Check-offs use a `✔` dropdown, scores are validated whole numbers 1–10, and
sheets are protected without a password purely as a guardrail (Review >
Unprotect Sheet lifts it). Status logic: one phase behind expectation is
**Due**, two or more is **Overdue**.

The Hudson Valley East workbook ships with the nine-provider demo cohort and
its seeded checks and scores so every surface renders alive; the other three
ship with a single example row to show the expected format. Clear the demo
cohort before live use, or keep that copy as the reference.

**No patient information belongs in these workbooks** — provider onboarding
data only, same rule as the app.

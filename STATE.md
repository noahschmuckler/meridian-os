# Meridian-OS — Project State

Detailed in-flight work, historical record of shipped phases/tracks, and pending roadmap. Loaded by reference from CLAUDE.md.

**Read order for a fresh Claude session:**
1. `CLAUDE.md` (auto-loaded by Claude Code) — context, conventions, locked decisions, inter-instance messages
2. THIS FILE — current state + history + pending
3. Specific plan / verification / analysis files referenced inline below

**This file pairs with CLAUDE.md and must be kept in sync.** End-of-turn updates to project state belong here; only "convention or rule" changes belong in CLAUDE.md.

---

## Current state (last updated 2026-05-30)

**Productivity metrics on the Onboarding Tracker provider profile — shipped 2026-05-30 (Scott, branch `claude/stoic-rubin-4QC5k`).** Pipes Epic provider-productivity into the same view as onboarding tracking data: patients/day, RVUs/wk, in-basket time, time per note, Rx refill time — each a weekly trend vs. a practice benchmark. New file `src/apps/mentorship-tracker/ProductivityPanel.tsx` holds seed data + analysis + UI: 5 compact status tiles (big value, benchmark, plain-language status pill, progress gauge) → click a tile to expand into a full weekly trend chart with benchmark line, plain-language verdict banner, and 3 headline stats. Status color follows the locked green=good / amber=variable / red=wrong-direction convention; inconsistent providers get distinct "Variable" framing (zigzag line + "±swing" stat) instead of a false gain rate. Wired into `MentorshipTrackerApp.tsx` via 3 edits (import; a `prod` tab gated on `hasProductivity(p.id)` in the profile tab array; the tab-content mount). **Epic-pipe-ready shape:** the Epic integration populates `PROD_SERIES[providerId][metric]` (weekly arrays) + `PROD_METRICS[].goal` (benchmark) with no UI change — today both are seeded for the 9 demo providers. `tsc -b` + `npm run build` clean; verified in-app headless (tab → tiles → expand-to-chart, both "Climbing" and "Variable" states render). PR not yet opened — same in-flight branch as the data export/import work below. **Resume recipe:** nothing pending; future Retention-Risk + IDP features (still on the backlog) can read the same `PROD_SERIES` shape. **Label convention reaffirmed this session:** spell out "Medical Director" everywhere it's the role; keep "MD" only as the degree (parallel to DO / NP / PA).

**Data export/import system — shipped 2026-05-28 (Noah, branch `claude/stoic-rubin-4QC5k`, commit `4133746`).** Adds portable data storage so all app data can be downloaded as a JSON file, restored from one, or cleared. New files: `src/lib/dataBackup.ts` (knows all 14 localStorage keys; `exportAll`/`downloadBackup`/`importBackup`/`clearAllData`/`getStorageStats`/`formatBytes`), `src/shell/DataPanel.tsx` (modal with storage stats, Export, Restore-with-confirm, Clear-with-confirm). Launcher gets a fixed bottom-right gear button that opens the panel. Export format designed to double as the D1 migration payload when the app moves to a real backend. PR not yet opened — branch live, awaiting PR + merge to main. **Resume recipe:** nothing more to do unless Noah wants to open a PR from this branch.

**CS-module track COMPLETE — shipped to main 2026-05-25 via PR #11 (squash-merge, admin override).** Opiates + benzos at schema 1.3.0 (Simplified/Stratified Pass), the NY/NJ controlled-substances contract builder (Track 4d), and all 19 SmartPhrases (Track 4c) landed together in one PR. **All three controlled-substance modules (adhd/opiates/benzos) are now at 1.3.0, and the QOL roadmap (Tracks 1–4) is complete.** Full detail + file/script pointers in the Shipped milestone below. **Remaining clinical-module work:** lipid completed its Simplification Pass 2026-05-26 (now 1.3.0 — see current-state bullet + Shipped milestone); ckd / anemia / abd-pain still at 1.0.x are the only candidates left. **Open follow-ups for Noah:** (a) contract-builder tier auto-suggest uses boolean inputs that can't express the schema's “significantly above” / “2+” magnitude wording (provider override covers it; finer inputs = schema v1.1); (b) consult + contract both auto-spawn on CS-module entry (the smartphrase selector is launch-only) — flag if the module view feels crowded and I'll switch the contract one to a launch affordance.

**Dashboard app + Briefing app — both shipped 2026-05-22 (Noah).** Full milestones for each under "Shipped milestones" below. **Latest commit on main:** Dashboard PR #9 squash-merge (this entry will be bumped to the exact hash post-merge). Dashboard sits to the right of Briefing on the launcher; Briefing was the visual-language template. Both share the `--crh-*` palette tokens (DM Sans + DM Serif Display, parchment, scoped color-tinted "brief cards"). Five total launcher apps now live: Mondrian GUI · Mentorship Tracker · Epic Quick Reference · Briefing · Dashboard.

**Mentorship Tracker — Scott's full director-view feature batch (PR #4) + UX fixes (PR #5) shipped 2026-05-18.** Latest commit on main: `8e0d67b`. PR #4 (squash `db93b82`) landed the Score Trends tab with three SVG charts (OM Touchpoints, MD Touchpoints, Culture Integration Trend), clickable-card tab nav, CII (Culture Integration Index), clickable DUE/OVERDUE comparison-grid badges, enhanced cross-provider pattern alerts, and the repo-wide "MD" → "Medical Director" rename. PR #5 (squash `8e0d67b`) landed note-row `×` removal, mentor score-trend visibility (`isDir || isMen`), and a history-stack "Go Back" pill. Both merged via admin override; full milestones below. PR #4 had a 815-line stale `CLAUDE.md` conflict (branched pre-PR#1 split) — resolved by discarding PR#4's `CLAUDE.md` per the 2026-05-13 inter-instance convention. **Update 2026-05-26:** Scott's **PR #10** (`serene-euler`) also shipped — full mentor curriculum (157 items) + APC track + localStorage persistence + department pickers + Needs-Attention banner + "Optum NY/NJ" rebrand + launcher tile renamed to "Onboarding Tracker"; admin-override squash, conflicts were docs-only. See its Shipped milestone below.

**ADHD module v2 — shipped to main 2026-05-13 (squash commit `08c77f6`, PR #1).** Schema 1.3.0 two-tier FAQ + Simplified/Stratified Pass live at https://meridian-os.pages.dev. Full entry under "Shipped milestones" below. The same PR also shipped: (a) the CLAUDE.md/STATE.md split (623-line monolith → 327-line conventions file + this state file), (b) the "Cloudflare preview-URL gotcha" workflow note, and (c) resolution of the Scott-PR-#2 CLAUDE.md conflict (Scott's OM-track bullet relocated to Shipped milestones). **Next clinical-module session likely tasks:** apply the same Simplification/Stratification Pass to **opiates** (currently v1.2.0) and **benzos** (currently v1.2.0) using ADHD as the template — editorial standards at `~/incoming_noah/meridian-module-simplification-standards.pdf` (Standards v1, 2026-05-12) and Section 8 6-step checklist stamp pattern at `verification/adhd.md`. CV monitoring topic-split + footer trimming + first-person sub-questions + module-level smartphrases registry are the highest-leverage moves to mirror. **Future Scope C reference UI** (unified filterable topic-reference primitive, prototype at `~/incoming_noah/meridian-adhd-faq-prototype.jsx`) bookmarked; deferred until v1.3.0 ships across all controlled-substance modules.


**Cloudflare Pages migration to Git-connected — COMPLETE 2026-05-12.** Direct-upload `meridian-os` Pages project deleted via wrangler; new Git-connected project created in dashboard with same name (reclaimed `meridian-os.pages.dev` URL). New `ANTHROPIC_API_KEY` issued and pasted into Production + Preview scopes. Build config: `npm run build` → `dist`, `NODE_VERSION=20.20.2`. **Deploy path is now:** push to `main` → Cloudflare auto-builds + deploys to `meridian-os.pages.dev`. Branch pushes → auto preview URLs at `<sha-prefix>.meridian-os.pages.dev`. **`deploy.sh` is now obsolete** — kept in tree as manual fallback but the canonical path is git push. After verification, can be deleted.

**Lipid module v1.3.0 — Simplification Pass shipped to main 2026-05-26 via PR #13 (squash `f8cc7e5`, admin override).** Bumped 1.1.0 → 1.3.0 from a Claude-chat readability DOCX (`~/incoming_noah/lipid-management-revised.docx`): 16 two-tier FAQ topics (`first_layer_html` + `sub_questions[]`), green-zone/context/footer rebuilt. **Citation re-injection:** the readability DOCX shipped with zero inline `[ref:slug]` markers — all 164 markers (57 unique refs) were hand-re-injected claim-by-claim from the 1.1.0 prose (Noah chose this over shipping uncited); 66-ref bibliography preserved via merge; 0 undeclared; 8 refs orphaned (claims the readability pass dropped, all retained in bibliography — most notable: `lee-nejm-2026`/Ez-PAVE basis for the <55 target, dropped from `ldl-target`; full list in `verification/lipids.md` Section 8). **SmartPhrases:** registry added from `~/incoming_noah/lipid-smartphrases.pdf` — 1 confirmed (`.lipidreview`, green-zone) + 7 future (`.LIPLIPID-*`), all 7 carrying **full text** (per Noah, for preview/testing) so they render expandable in the selector's "Future" section; FAQ `smartphrase_note` pills wired on all 7 anchor topics. Build scripts in `/tmp/{build_lipid_v13,inject_lipid_refs,add_lipid_smartphrases}.py`. `tsc -b` + `npm run build` clean. **Open follow-up for Noah:** decide whether to re-author the Ez-PAVE (`lee-nejm-2026`) evidentiary basis for the <55 target back into `ldl-target` first_layer (the readability pass dropped it — I did not re-add prose, only re-injected markers into existing text). **Three v1.0.0 modules remain to rewrite:** ckd, anemia, abd-pain.

**meridian-os v2 — Phase 1 steps 1–2 done (2026-05-05), steps 3–10 pending.** Plan at `~/.claude/plans/i-ve-met-with-it-jolly-pillow.md` (self-contained). v2 repo: https://github.com/noahschmuckler/meridian-os-v2 (private). Local clone: `~/GitHub_Repos/meridian-os-v2` at commit `b97c75c` on `main`. **Five proposed defaults pending Noah confirmation at start of next v2 session:** (a) sessions = server-side `sessions` table; (b) bootstrap admin = seed SQL with bcrypt password from `.env`; (c) server build = `tsx watch` dev / `tsc + node` prod; (d) password policy ≥8 chars, bcrypt rounds 12; (e) Vite proxy dev `/api/*` → `localhost:3001`. **CRITICAL:** do NOT modify v1 files during v2 work. v1 (this repo) keeps shipping module content independently. **Resume recipe after `/clear`:** `cd ~/GitHub_Repos/meridian-os-v2`; read the plan file end-to-end; AskUserQuestion for the 5 defaults; continue Phase 1 step 3 (server scaffold).

**Onboarding-stack v1 ON HOLD pending v2 — premise changed 2026-05-12.** Original hold (2026-05-05) was Noah/his Claude not touching mentorship tracker / Epic QR to avoid v1↔v2 drift. With Scott now actively working on those files, the hold's premise has changed. **Open question for Noah:** lift entirely / keep for Noah-side changes only / coordinate per-item with Scott. Bookmark of pending items at `analysis/onboarding-stack-pending-v2-bookmark.md` (8 items + 6 smaller open questions) — still canonical.

**Live deployment:**
- Public: https://meridian-os.pages.dev (Git-connected; auto-deploys from `main`)
- Repo: https://github.com/noahschmuckler/meridian-os (public)
- Cloudflare project: `meridian-os` (Git provider: Yes, as of 2026-05-12)

---

## Shipped milestones (chronological, newest first)

### Mentorship Tracker — full mentor curriculum + APC + persistence + dept pickers (2026-05-26, Scott, PR #10)

Squash-merged to main via PR #10 (branch `claude/serene-euler-vF8et`, admin-override — no reviewer online). 39-commit branch in Scott's territory; absorbs the five in-flight bullets from the branch's `STATE.md` into this milestone (per the 2026-05-18 convention). Headline changes, all in `src/apps/mentorship-tracker/MentorshipTrackerApp.tsx` + `src/data/seed/mentorship-master-checklist.json` (+ a one-line `Launcher.tsx` rename):

- **Full Mentor Curriculum + APC track** — replaced the 14-phase `MP` stub with the complete curriculum: 17-phase Physician track (Week 0 → Month 12, 128 items) + 4-phase APC track (Month 15–24, 29 items) = **157 items**. `MP_PHYS` + `MP_APC`; `isAPC()` role check (NP/PA); split `mentorPhysPct()` / `mentorApcPct()`; "Mentor Curriculum" tile split into "Mentor: Physician" + "Mentor: APC" (APC tile only for NP/PA); phase IDs `w4→m1, w8→m2, q3→m9, q4→m12`.
- **localStorage persistence + data management** — autosave to `meridian-mt.v1`; login detects prior sessions with "Start Fresh" (clear checks/scores/notes, or full seed reset); director top bar gains JSON export, DOCX export (one section per provider), and ↺ Reset; sidebar provider add/remove (confirm modals); click-to-edit Days; "Advance →" CTA.
- **Curriculum threads + My Panel chip** — controlled-substances thread (Mentor M1/M3 + Medical Director M6) and clinical-modules thread (Medical Director Wk1 intro + per-module review items md-63…md-68; Mentor M1/M3) → master-checklist now **68 items**; My Panel mentee cards show "✓ [phase] complete" chip.
- **Needs Attention banner + dept pickers + branding** — warm-amber director-roster banner auto-scanning `getStatus()` for LATE/DUE (phase, day count, score-trend arrow, mentor surname; click → that provider's Mentor tab); department picker as first screen with department-specific coming-soon screens for Pediatrics / Specialty / Urgent Care (named Medical Directors + feature-preview tiles); Primary Care flow unchanged; two-column login/dept layout; **"Optum NY/NJ" branding** (replaced Crystal Run); phase buttons grouped into labeled rows.
- **Launcher rename (Noah's territory):** the launcher tile is now **"Onboarding Tracker"** (was "Mentorship Tracker") — `src/shell/Launcher.tsx` label + aria-label, 4 lines, merged clean.

**Merge resolution:** `CONFLICTING` only on `CLAUDE.md` + `STATE.md` (branch forked at PR #8). Per the 2026-05-13 convention: took main's versions (preserving Dashboard #9 / CS #11 / lipid #13), kept Scott's 2026-05-22 consolidation log entry, folded the in-flight bullets into this milestone. **No code conflict** — Dashboard, CS-contracts, and lipid 1.3.0 all verified preserved in the merged tree. `npm run build` clean.

### Lipid module → schema 1.3.0 Simplification Pass + SmartPhrases (2026-05-26, Noah, PR #13, squash `f8cc7e5`)

Lipid bumped 1.1.0 → 1.3.0 — the last cardiometabolic Simplification-Pass candidate. **Two source docs** dropped into `~/incoming_noah` (both 2026-05-26): `lipid-management-revised.docx` (Claude-chat readability rewrite) + `lipid-smartphrases.pdf` (SmartPhrase schema).

**Structure (build script `/tmp/build_lipid_v13.py`, mirrors `parseDocxHtml.ts`).** All 16 FAQ topics preserved (verified no clinical content dropped) → two-tier `first_layer_html` + `sub_questions[]` (45 sub-questions). Single-cell `<em>` callout tables → `<div class="cm-callout">`; multi-column tables kept as `<table>` (DOCX-import-faithful). Context section folds Text + SUPD note + Pipeline note into `context_strip.text` (the canonical parser keeps only Label/Text — a faithful run would have dropped the two notes). Footer → advisory + jurisdiction, version stamp → v1.3.0 (2026-05-26).

**Citation re-injection (the headline work; build script `/tmp/inject_lipid_refs.py`).** The readability DOCX shipped with **zero inline `[ref:slug]` markers** (the rewrite stripped all 223). Noah chose re-injection over shipping uncited (preserves the "schema ≥1.1.0 carries inline markers" invariant). All **164 markers / 57 unique refs** hand-re-injected claim-by-claim from the 1.1.0 prose via **115 auditable anchor rules** (each `(field, anchor, refs)`; every anchor matched exactly once; **0 undeclared markers**). 66-ref bibliography preserved verbatim via the references-merge policy. **8 orphaned refs** (claims the readability pass dropped — all retained in the bibliography): most notable `lee-nejm-2026` (Ez-PAVE, the <55-vs-<70 head-to-head RCT, dropped from `ldl-target`); also the PREVENT MESA-validation set (`cho-jacc-2025`/`murphy-jacc-adv-2025`/`au-jamano-2026`), niacin/Lp(a) (`albers-jacc-2013`/`tsimikas-jacc-2017`), Friedewald specifics (`sajja-jamano-2021`), FH review pointer (`santos-ldne-2025`). Full list in `verification/lipids.md` Section 8.

**SmartPhrases (build script `/tmp/add_lipid_smartphrases.py`).** `smartphrases[]` registry from `lipid-smartphrases.pdf`: 1 confirmed (`.lipidreview`, anchor green-zone) + 7 future (`.LIPLIPID-VHR/-NOTGOAL/-LDL190/-FH-CASCADE/-CAC/-INTOL-RECHALLENGE/-LPA-NEW`). **Per Noah's instruction, all 7 future phrases carry full `text`** (not description-only) so they render expandable/copyable in the selector's "Future" section for preview/testing — new accepted variation on the SmartPhrases locked decision (now noted in CLAUDE.md). FAQ `smartphrase_note` pills wired on all 7 anchor topics (each resolves its `.TRIGGER` to the registry). Green-zone `.lipidreview` chip resolves + "All SmartPhrases →" launch works.

**Files:** `src/data/seed/clinical-modules.json` (modules[0] rewritten; +197/−235, only lipid changed — other 6 modules byte-identical), `verification/lipids.md` (status banner + Section 8 stamp), `CLAUDE.md` + `STATE.md`. No code/type changes (the 1.3.0 renderers + selector already existed from the ADHD/CS passes). `tsc -b` + `npm run build` clean. Open follow-up: whether to re-author the Ez-PAVE basis for the <55 target back into `ldl-target` (I re-injected markers only, did not add new prose).


### CS modules 1.3.0 + CS contract builder + SmartPhrases (2026-05-25, Noah, PR #11)

Squash-merged to main via PR #11 (branch `noah/opiates-benzos-v13-simplification`, admin override). Three pieces shipped together; completes the QOL roadmap (Tracks 1–4). The earlier separate PR #12 (contract builder off main) was closed and folded into this branch.

**Opiates + Benzos → schema 1.3.0 (Simplified/Stratified Pass).** Both bumped 1.2.0 → 1.3.0 from Claude-chat-authored v2 DOCX (`~/Downloads/Opiates-Inherited-v2.docx`, `~/Downloads/Benzos-Inherited-v2.docx`) via surgical-splice scripts `/tmp/build_opiates_v13.py` + `/tmp/build_benzos_v13.py`. Each: 10 FAQ topics → two-tier `first_layer_html` + `sub_questions[]`; a new 11th standalone §5-split topic (`opiates-first-visit` 11-element framework; `benzos-taper-primer`); footer → 2 sentences; `consult_decision_point`s wired to existing consults; references preserved at the evidence superset (opiates 92, benzos 93; 0 undeclared markers). Section 8 stamps in `verification/opiates.md` + `verification/benzos.md`. All three CS modules now at 1.3.0.

**Contract builder (Track 4d).** New `contract-builder` bubble (purple) + `src/data/seed/controlled-substances-contracts.json` (v1.0.0 schema, 5 sections / 36 clauses, NY/NJ variants, declarative `condition` objects; `/tmp/build_cs_contracts.py`). Inputs (class / state / flags) → auto-suggested risk tier (Section-2 logic, override logged) → assembled clauses + `.CSAGREE-[CLASS]-[STATE]-[TIER]` trigger. Class-driven. Surfaced via `ContractAutoSpawn` (auto-spawn on CS-module entry; the clinical-tools card can't appear in module mode). v1 export = copy-to-clipboard; DOCX/PDF + Section-5 per-class subsections + agreement-mention decorator deferred.

**SmartPhrases (Track 4c).** All 19 phrases from `~/Downloads/smartphrase-implementation-spec.md` populated into the 3 CS module `smartphrases[]` registries (ADHD 6 / benzos 6 / opiates 7; full text + decision_point + anchor; built by parsing the spec's fenced blocks via `/tmp/build_smartphrases.py`). Spec confirmed the future-phrase IDs (several renamed); corrected `.BENZO-NOINDICATION-BRIDGE` spelling. Three surfaces: `smartphrase-selector` bubble (expand→copy), expandable FAQ `smartphrase_note` pills, and a green-zone click-to-copy chip + "All SmartPhrases →" launch. No auto-spawn (avoids a 3rd auto-spawned bubble). `ModuleSmartPhrase` gained `decision_point` + `anchor`. Inline `decorateSmartphraseMentions` decorator + Epic Admin entry out of scope.

**Open follow-ups for Noah:** (a) contract tier auto-suggest can't express magnitude/count wording from booleans (override is the safety valve; finer inputs = schema v1.1); (b) consult + contract both auto-spawn on CS-module entry — switch contract to a launch affordance if crowded.

### Dashboard app — 6-tile provider dashboard with per-patient drill-in (2026-05-22, Noah, PR #9)

Fifth launcher app, plum→amber gradient 📊 to the right of Briefing. Three-phase scope shipped on a single branch:

**Phase 1 — base shape (commit `53bdbee`).** 6-tile grid in Briefing visual language: HEDIS Composite (74.8% · sky) · Unscheduled AWVs (62 · sage) · Above Par wRVU (+73 · gold) · Epic Goals Met (1/3 · warm) · HCC Pending (22 · coral) · Patients Tomorrow (5 · teal). Click any tile = full-bleed expansion. Source content drawn from `~/Downloads/meridian-dashboard.jsx` (Crystal Run accordion POC); patient cohort copied from `meridian-onboarding/index-rendered.html` `demoPatients` into `src/data/seed/dashboard-cohort.json` (5 patients with problems / vitals / labs / meds / hardStops / payer / opportunities).

**Phase 2 — HEDIS deep-dive (commit `4586745`).** Every measure block is now clickable, opening a per-measure detail view with description + SVG glidepath (baseline → target dashed goal line with monthly actuals) + Epic-derived outreach sub-cohort table. 12 measures × 2–4 sub-cohorts each. User-spec'd examples preserved verbatim: HTN BP "no second-check" (24), "≥2 visits on <3 BP agents" (41); mammogram-ordered-no-results (22); colonoscopy/Cologuard/Guardant Shield-ordered-no-results (31); PHQ-9 moderate no F/U + PHQ-9 severe no psych referral. Cross-measure non-compliance grid below the 12 blocks (Diabetes triple-fail 23, ASCVD + uncontrolled BP 41, Diabetes + off statin 32, 5+ measures out of range 18, Out on all 12 measures 3) with "Generate patient list →" affordances (export wiring deferred to v1.1).

**Phase 3 — patient brief (commits `4d5e1cc`, `3b16102`).** Per-patient detail page gains: (1) NP-AWV 5th card on the AWV section (32% completed, 9 of 28 IPPE-eligible); (2) explicit vertical scroll container on `.dashboard-app` because `reset.css` sets `html, body, #app { overflow: hidden }` globally; (3) hard-stop "Open module →" links jumping to the relevant clinical module (`opiates` / `benzos` / `ckd` / `adhd` / `lipid-management` / `anemia`) with a new App-level plum→amber `DashboardReturnChevron` that suppresses the existing BackToMondrian + ModuleBack chevrons during the round-trip and restores patient-detail state on return; (4) query builder at the bottom — every problem / med / vital / lab / hard-stop is a clickable toggle row with bulk SELECT ALL / CLEAR per segment; selections compose a natural-language query ("54-year-old female with...") with free-text textarea and `navigator.clipboard.writeText` copy; (5) embedded PREVENT calculator pre-populated from chart (age, sex, BP-vital systolic, total chol + HDL + eGFR labs, statin/BP-med text-match, diabetes ICD-match), fully interactive, sharing a signal (`src/data/preventState.ts`) with the lipid-module PREVENT bubble so input values carry across the round-trip in BOTH directions.

**Cross-app navigation pattern (locked).** Dashboard ↔ Mondrian clinical module round-trips use three module-level signals in `DashboardApp.tsx`: `activeSectionSignal` + `activePatientSignal` (preserve dashboard state across remounts) + `dashboardReturnSignal` (gates the "‹ Patient Brief" chevron). PREVENT inputs are a separate shared signal in `src/data/preventState.ts` (patient-bound via a sibling `preventInputsPatientSignal` so different-patient opens re-initialize, same-patient remounts preserve). The lipid-module PreventCalculator bubble was refactored to read from this signal — both calculators are now functionally interchangeable.

**Files (12):** `src/apps/dashboard/{DashboardApp.tsx,dashboard.css}` (scoped under `.dashboard-app` per the Briefing collision-avoidance pattern); `src/shell/DashboardShell.tsx`; `src/data/seed/dashboard-cohort.json`; `src/data/preventState.ts` (new); `src/data/launcherState.ts` (union + hydrate gained `'dashboard'`); `src/main.tsx` (new conditional shell mount + `DashboardReturnChevron`); `src/shell/Launcher.tsx` (5th launcher button); `src/styles/glass.css` (`.launcher__app-icon--dashboard` gradient + `.dashboard-return-chevron`); `src/bubbles/prevent-calculator/index.tsx` (refactored to share signal); plus `STATE.md` + `CLAUDE.md`. Build clean (`npm run build` + `tsc -b` clean). End-to-end verified with headless-Chrome smoke tests covering all 5 section drill-ins, AWV unscheduled drawer, both patient detail variants, hard-stop module navigation round-trip, PREVENT bidirectional sync, query builder copy-to-clipboard, and portrait toggle.

### Briefing app — Crystal Run Provider Briefing POC port (2026-05-22, Noah, PR #8)

Squash commit `4925b48` on main. Fourth launcher app — port of `~/Downloads/meridian-briefing.html` into Preact/TSX. Visual language: DM Sans + DM Serif Display fonts, parchment `#f5f3ee` background, colored "brief cards" (renamed from `.bubble` to avoid colliding with meridian-os's workspace-primitive `.bubble` in `glass.css`, which carries `container-type: size` + `display: flex` + `overflow: hidden`). Layout: orientation bar with landscape/portrait toggle, masthead, left-column advisory cards, top-row event cards, expandable Active Initiatives table that swaps to a 3-card detail view on row click ("Why this matters" / "How it affects your workflow" / "What you need to do"), footer with Print button. Files: `src/apps/briefing/{BriefingApp.tsx,briefing.css}` + `src/shell/BriefingShell.tsx` + 6 launcher-wiring touches. Icon gradient: navy `#1a2744` → teal `#00788a`. Subsequent Dashboard app (PR #9) reused the exact same visual idiom — DM Sans + DM Serif Display, `--crh-*` palette tokens, scoped `.dashboard-app` selectors, brief-card pattern.

### Mentorship Tracker — director-view feature batch (2026-05-18, Scott, PR #4)

Squash commit `db93b82` on main. 17-commit branch spanning 2026-05-13 → 2026-05-15, all inside `src/apps/mentorship-tracker/MentorshipTrackerApp.tsx`. Headline changes:

- **Score Trends tab** — three SVG line charts: OM Touchpoints (6 periods M1–M12), Medical Director Touchpoints (12 periods w1–q4), and Culture Integration Trend (3 periods M3/M6/M12). Fixed-X-axis full-year timelines so charts stay directly comparable across providers regardless of how much data each has. Per-dot color coding (green ≥7, pink 5–6, red <5). Clicking a dot opens a questionnaire-detail modal — scale questions show score badges + color bars + anchor labels; text questions show the written response or "No written response" placeholder.
- **Metric cards merged with tab nav** — the four percentage cards are now clickable tab selectors; active card gets a colored border + tinted background. The old separate tab-button row is gone. Cards renamed to full track names: Medical Director Curriculum / Mentor Curriculum / Office Manager Touchpoints / Medical Director Touchpoints.
- **Culture Integration Index (CII)** — 4 self-assessment questions (belonging, social connection, psychological safety, eNPS) added at M3/M6/M12. New 5th metric card (rose `#ec4899`) showing raw 0-10 avg, separate from clinical `avgScore`. New "Culture" column in Comparison Grid. Stress-test seed across 4 providers exercises every metric-card color branch (Johnson green / Patel red / Williams pink / Garcia gray).
- **Clickable DUE/OVERDUE badges** — comparison-grid status pills are now buttons (`↗` indicator). Single due phase → direct navigation. Multiple due phases → fixed-position popover listing each phase with done/total counts.
- **Enhanced cross-provider pattern alerts** — `detectPatterns` rebuilt: per-provider scores, question breakdown sorted low→high, phase comparison horizontal bars, OM-touchpoint cross-reference via new `QP_TO_OM` mapping, sharpest-decline detection. Alerts sorted by severity (lowest avg first), expand/collapse independently.
- **"MD" → "Medical Director" rename throughout** — every user-visible label where "MD" stood for Medical Director now reads the full term (Comparison Grid headers, sidebar progress bars, View-All modal, owner badges, checklist subtitle, footer notes, chart labels). New `OWNER_LABEL` map renders the owner badge "Medical Director" from JSON seed value `"MD"` without touching seed data. Provider degree role `"MD"/"DO"` in `PROVS` is unchanged.

**Merge complication:** PR #4 was branched from `01f6748` (Lipid commit, pre-PR#1), so it never saw the CLAUDE.md/STATE.md split — the 815-line `CLAUDE.md` diff was pure staleness (every substantive bullet already on main, either in the slimmed CLAUDE.md or in this STATE.md). Resolution per the 2026-05-13 inter-instance convention: discarded PR#4's `CLAUDE.md` verbatim, kept main's. The two `MentorshipTrackerApp.tsx` conflicts (metric-card render + CII seed) were resolved by taking PR#4's version (the post-PR#2 OM-questionnaire piece auto-merged cleanly). Admin-override squash-merge; branch auto-deleted; Cloudflare auto-deployed.

### Mentorship Tracker — note removal + mentor score-trend + history-stack back (2026-05-18, Scott, PR #5)

Squash commit `8e0d67b` on main. 5-commit branch (`claude/add-note-removal-feature-x9kR6` upstream; rebased onto post-PR#4 main and renamed to `note-removal-rebase` for the PR). +61/-11 across `MentorshipTrackerApp.tsx` + STATE.md. Three small UX fixes:

- **Note removal** — `×` button on each note row, gated on `canChk` (Director everywhere; Mentor on own mentees; OM tab auto-follows when OM gets a real login role).
- **Mentor score-trend visibility** — was `isDir`-only; widened to `isDir || isMen` so mentors see their own mentees' questionnaire score trend.
- **History-stack back button** — adds a "Go Back" pill below the meridian chevron that pops `(uid, selId, tab, phase, mainTab)` state from a new `navHistory` ref.

Rebase against post-PR#4 main was clean — the two branches touched disjoint regions of `MentorshipTrackerApp.tsx`. Admin-override squash-merge; branch auto-deleted; Cloudflare auto-deployed.

### ADHD module v2.0 — Simplified/Stratified Pass + schema 1.3.0 (2026-05-13, Noah, PR #1)

Squash commit `08c77f6` on main. First module to adopt **schema 1.3.0 two-tier FAQ shape** (`first_layer_html` + default-closed `sub_questions[]` "More detail" expanders) plus per-entry `smartphrase_note` + `consult_decision_point` + module-level `smartphrases[]` registry (1 confirmed, 5 future). Other 6 modules untouched (still 1.0.0/1.0.1/1.2.0; back-compat via FAQ-bubble fallback path on `items[]`).

**Source + standards:** Content from `~/incoming_noah/ADHD-Stimulants-Inherited-v2.docx`. Editorial conventions defined in `~/incoming_noah/meridian-module-simplification-standards.pdf` (Standards v1, 2026-05-12) — Section 8 6-step checklist stamped in `verification/adhd.md` for traceability. CV monitoring split out as its own 4th escalation + 9th FAQ topic per PDF Section 5 topic-splitting rule. Footer trimmed to 2 sentences (advisory + jurisdiction). Framework rationale moved to `context_strip`. First-person sub-questions only. Callouts (`<div class="cm-callout">`) reserved for guideline tension / important caveats.

**References preservation:** 95-entry references superset preserved via new `parseDocxHtml` references-merge policy — when re-importing into an existing module (matched by `module_id`), DOCX-extracted refs are unioned with existing JSON refs (existing wins on conflict). Protects the larger evidence-confirmation refs set from being truncated by an editor's narrower citation list.

**DOCX round-trip:** New prefix markers for 1.3.0 — `First Layer:` opens first-layer block; `Sub-question:` for More-detail Q/A; `SmartPhrase note:`, `Consult trigger:`, `Consult prefill:` for structured fields. Legacy `Question:` reserved for 1.2.0 entries. Parser stamps `schema_version: '1.3.0'` on detecting any 1.3.0 marker.

**Files changed (13):** `src/types.ts` (+4 optional FAQ fields + 2 new interfaces + module-level smartphrases registry); `src/bubbles/clinical-module-faq/index.tsx` (two-tier render path; badge derived from `referenced_by[]`; SmartPhrase + Consult pills; sub-question expanders); `src/bubbles/clinical-tools/index.tsx` (passes existing module into `parseDocxHtml` for references-merge); `src/lib/parseDocxHtml.ts` (new prefix detectors + state machine + references-merge + schema-version detection); `src/lib/generateDocx.ts` (1.3.0 emitter branch + SmartPhrases registry section); `src/lib/generatePptx.ts` / `src/lib/refMarkers.ts` / `src/shell/PrintView.tsx` (back-compat for now-optional `items[]`); `src/data/seed/clinical-modules.json` (ADHD module rewritten end-to-end at 1.3.0); `src/styles/glass.css` (`.cm-callout`, badge pills, SmartPhrase pill); `verification/adhd.md` (new — evidence-tracker + Section 8 stamp); `CLAUDE.md` + `STATE.md` (the 2-file split, 2 new locked design decisions for schema 1.3.0 + Simplification Pass pipeline stage, "Cloudflare preview-URL gotcha" workflow note, inter-instance messages).

**Also resolved in this PR:** Scott's PR #2 (OM-track questionnaire, merged 22:30 UTC) had edited the old monolithic CLAUDE.md; that conflict was resolved by keeping the new split structure and relocating Scott's added "OM track shipped" bullet to this Shipped milestones section (entry directly below).

**One non-obvious lesson captured:** Cloudflare's bot only posts a preview URL on a PR that exists *when the build completes*. Scott pushed PR #2's branch 80 minutes before opening the PR, so the build completed against a PR-less branch and no comment was ever posted. Workflow rule now in CLAUDE.md: `gh pr create --draft` before pushing, or push a follow-up commit after the PR opens.

### OM track — structured questionnaire (2026-05-13, Scott, PR #2)

`OP` constant in `src/apps/mentorship-tracker/MentorshipTrackerApp.tsx` converted from 5-item boolean checklist to a structured questionnaire — 6 assessment periods (Month 1/2/3/6/9/12), each with 6 labeled 0–10 scale questions (custom `anchor_low`/`anchor_high` per question) + 1 free-text provider check-in. Director-only view; no role logic changed. Downstream wiring rewritten throughout: `makeSeedChecks` (om* phases stripped), `makeSeedQA` (seeded OM demo responses p1/p2/p3), `countChecks` (MP only), `opsPct` (signature `(qa, pid)` iterating `ph.qs`; all three call sites updated — sidebar, comparison table, metric cards), `ScaleInput` (optional anchor props with stacked labeled 0/10 display, fallback "Not at all"/"Completely"), `MdViewAllModal` (takes `qa` prop; OP rows render score badges/text excerpts instead of checkboxes), `curChecklist`/`curOpQuest` (derived state split so OP never hits CheckItem). New `{/* OM QUESTIONNAIRE */}` render block with MS Forms integration note footer. One file changed: `MentorshipTrackerApp.tsx` (+170 / −39). Merged via admin override (PR opened 22:27 UTC, no reviews; see workflow caveat in CLAUDE.md "Cloudflare preview-URL gotcha"). Head: `a6dee8a`.

### Cloudflare Pages Git-connected (2026-05-12)
Migrated from direct-upload to Git-connected. Old project deleted; new project created with same name in dashboard; build = `npm run build`, output = `dist`, env vars (Production + Preview) = `NODE_VERSION=20.20.2` + `ANTHROPIC_API_KEY`. Branch pushes now auto-publish to preview URLs. `deploy.sh` retained as manual fallback. Branch protection on `main` set the same day: PRs required, 1 approval, squash-only, auto-delete branches, force-push + branch-deletion disabled, conversation resolution required, admins not enforced (Noah can self-merge in emergencies).

### Lipid module v1.1.0 — Phase 2 JSON rewrite (2026-05-06)

`lipid-management` entry in `src/data/seed/clinical-modules.json` rewritten end-to-end. `schema_version` 1.0.1 → 1.1.0. New top-level `references[]` with **66 entries** (Blumenthal 2026 ACC/AHA Multisociety Dyslipidemia Guideline both Circulation and JACC pubs; 2022 ACC ECDP; 2023 AHA/ACC CCD; 2025 BP Guideline; 2026 VA/DoD CPG; AHA PREVENT validation Khan 2024 + 2023 statement; key 2024–2026 RCT/meta references). **All 9 existing FAQs rewritten** + **7 net-new FAQ topics added** (`co-primary-targets`, `escalation-options`, `fh-management`, `statin-intolerance`, `statin-T2D`, `pregnancy-vs-lactation`, `whats-new-2023-2024`). Final FAQ count = **16 topics**. Total markers = **223 occurrences across 65 unique cited refs**.

**Splice was surgical, not full reformat.** `python3` script loads full clinical-modules.json, replaces only the lipid module dict, re-serializes with regex post-pass to keep existing inline reference/calculator formatting. Other 6 modules verified byte-identical to pre-rewrite. **For future v1.0.0 → v1.1.0 rewrites of ckd / anemia / abd-pain, use the same surgical splice approach** rather than letting `json.dump` reformat the whole file — saves a 2,000+ line spurious diff.

**The new module asset T2 (per-tier targets table) ships as HTML `<table>`** inside `co-primary-targets` Q2 — first time a clinical module embeds an HTML table. Class names (`.target-tiers`, `.statin-intensity` for T1) not currently styled in `glass.css`; default browser table styling acceptable for v1, follow-up CSS pass would polish print-page rendering. DOCX/PPTX exporters round-trip tables unchanged.

**Phase 3 = NO-OP confirmed.** `src/lib/refMarkers.ts:91-97` (`getModuleRefNumberer`) and `src/shell/PrintView.tsx:42-101` already cover every marker-bearing surface lipid uses. Opiates Phase 3 generalization (2026-05-03) anticipated this.

**Highest-impact factual corrections baked in (full list in `verification/lipids.md`):** PREVENT thresholds (Low <3% / Bord 3–<5% / Int 5–<10% / High ≥10%); VHR criteria with ≥2-high-risk-conditions count + CKD omitted from 2026 VHR list (still routed to <55 via CKD-specific pathway); LDL-C / non-HDL-C co-primary table (asset T2 — embedded as HTML `<table>` in `co-primary-targets` Q2); Lp(a) COR 1 once-in-lifetime + Table 4 thresholds (drop 175 nmol/L EAS-derived; use ≥125 elevated / ≥250 ≥2-fold); ApoB COR 2a treated / COR 2b untreated (no universal numeric target — <55 only in severe-hyperchol+ASCVD); ezetimibe split (18% mono / 25% incremental, IMPROVE-IT mean 6 yr, NNT ~16 in ≥3-risk subgroup); PCSK9 mAbs 45–64% LDL-C with alirocumab post-hoc mortality caveat + alirocumab HoFH approval; bempedoic acid 21–24% mono / 17–18% incremental, gout 3.1% vs 2.1%, FDA two-indication split, simvastatin >20 / pravastatin 40 DDI; inclisiran second-line to PCSK9 mAbs + FDA hypercholesterolemia-broad indication + Medicare Part B buy-and-bill; IPE COR 2b (NOT 2a) + TG ≥150 (NOT 135) + mineral-oil placebo controversy; Friedewald progressive-degradation / Martin-Hopkins-Sampson preferred (COR 1); CAC age men ≥40 / women ≥45 + COR 1 upgrade + 3–7 yr reassess + 300–999 split (COR 1 <70 + COR 2a <55) + ≥1000 <55 (COR 1); SDM applies even at COR 1 + 3 COR 1 indications (PREVENT ≥10% / LDL ≥190 / DM 40–75); intermediate = COR 1 (NOT 2a); SUPD softening (org target ~90%); routine ALT + CK monitoring = COR 3 No Benefit; lipid panel 4–12 wk + 6–12 mo, nonfasting OK; non-VHR ASCVD COR 2a tighter <55 (DD3 closure via Ez-PAVE / Lee NEJM 2026); statin-induced T2D intensity-dependent (10% mod / 36% high, top-quartile glycemia 62%) + FH-cohort caveat; SAMSON JACC NOT NEJM + 2-trial framing attributed to 2022 ECDP; pregnancy 2021 FDA contraindication-removal vs lactation still contraindicated; LDL ≥190 3-tier goals with DD4 OR-logic + CAC-not-coronary-atherosclerosis correction; FH genetic testing stratified COR 1 / 2a / 2b; cascade screening COR 2a (NOT 1); pediatric 9–11 universal + 17–21 attributed to 2011 NHLBI not 2026 ACC/AHA; VESALIUS-CV future-state footnote in whats-new.

Bundle delta gzip 236.44 → 258.02 kB JS (+21.58 kB, +9.1%).

### Lipid module verification — Phase 1 OE-pass (2026-05-04 to 2026-05-06)

Plan: `~/.claude/plans/i-d-like-to-focus-cozy-cake.md`. First v1.0.0 → v1.1.0 rewrite to diverge from prior pattern in two ways: (1) no controlled-substance regulatory layer (purely clinical), (2) carries in-bound product input — Scott Freiberg's "Compare Old vs New Lipid Guidelines" PDF at `~/Downloads/lipid-old-new.pdf`, drafted for Scott Hines' QI ask.

**Pipeline:** 6 bundles + meta-pass (slimmed from benzos' 8). Bundle map: (1) Risk stratification — PREVENT vs PCE; (2) VHR + <55 target evidence; (3) Co-primary targets — non-HDL-C / ApoB / Lp(a); (4) Statin indication + SDM + CAC + SUPD + intolerance + T2D + payer; (5) Escalation — ezetimibe / PCSK9 / bempedoic / inclisiran; (6) LDL ≥190 / FH.

**Tracker:** `verification/lipids.md` — 98 tracker rows + Bundle 1–6 findings + References staging (66 confirmed entries). Raw OE responses at `verification/lipid1-3.md` + `verification/lipid4-6.md`.

### Benzo module v1.1.0 — Phase 2 JSON rewrite (2026-05-04)

`benzos` entry rewritten end-to-end. `schema_version` 1.0.0 → 1.1.0. **93 entries in `references[]`**; 223 `[ref:X]` markers (88 unique cited; 0 undeclared, 5 unused-as-adjacency). **All 10 FAQs rewritten.** Marker distribution mirrors opiates' multi-surface pattern (landing_intro 7 + green_zone 6 + context_strip 4 + FAQs 206 + footer_note 0). Opiates Phase 3 helper extension already covered all surfaces; Phase 3 was a **no-op** for benzo.

**Critical factual correction (Row 44):** Temazepam equivalency in dose-conversion table was wrong by factor of two since v1.0.0 — was `10 mg ≈ diazepam 10 mg`, corrected to `20 mg ≈ diazepam 10 mg` per Ashton Manual / VA-DoD SUD 2021 / ASAM 2025 Appendix H. Explicit "prior versions of this module incorrectly listed…" callout in the table.

**Six other rewrite-mandatory corrections:** 40 mg/day threshold replaced by ASAM tier framework (low ≤10 / mod 10–15 / high >15); insomnia indication softened; ≥3-month dependence threshold + alprazolam 2–4 week exception; "black box" → "boxed warning" + OUD-OAT carve-out (buprenorphine/methadone NOT withheld for benzo use); "always taper benzo first" sequencing **disproved** via Wang JCM 2023; 2019 FDA gabapentinoid warning was opioid-focused (not benzo+gabapentinoid); Beers framing softened to "general rule with 5 named exceptions" (seizure / RBD / catatonia / treatment-resistant GAD / palliative); "accelerated cognitive decline" softened to domain-specific impairment.

**Most consequential reframe (Row 113, Bundle 8 DD1):** Cognitive reversibility after benzo discontinuation in older adults is **partial and domain-specific**. Module text and patient-counseling scripts now explicitly do NOT promise cognitive improvement to MCI patients/families.

**Module-level meta-acknowledgments** in new `context_strip`: ASAM 2025 inherited-patient framework anchor; "foundation visit" institutional nomenclature; NY+NJ dual-state regulatory scope. Single-prescriber convention attributed to 21 CFR §1306.04 (malpractice/standard-of-care convention, not federal statute prohibiting dual prescribers).

**Specialist-referral framing broadened.** Previously said "psychiatry e-consult"; ASAM 2025 names addiction medicine, addiction psychiatry, medical toxicology as specialists with requisite expertise (geriatric psychiatry/medicine for older adults).

Full tracker at `verification/benzos.md` (114 rows). Raw OE responses at `verification/benzo1-4.md` + `verification/benzo5-8.md`.

### Track 4b — consult builder + e-consult migration (2026-05-04)

New `consult-builder` primitive (purple `#6B4F9B`) walks per-module `ConsultPath` decision trees and lands on a recommend leaf with a pre-filled output template + copy / send-via-OE / restart actions. `decorateConsultMentionsHtml` (`src/lib/consultDecorator.ts`) wraps "{specialty} consult" / "consult to {specialty}" matches in rendered FAQ / checklist HTML; clicks on `.consult-link` spans caught by App-level capture-phase listener (`ConsultLinkHandler`) that dispatches `meridian:spawn-bubble` with target `consult_id` as `initialConsultId`. Auto-spawn (`ConsultAutoSpawn`) fires once per module on first entry, tracked via `meridian-os.consultBuilderShown` in localStorage; manual re-spawn from "Consults" section of clinical-tools.

Schema: `ModuleData.consults?: ConsultPath[]`; seeded for `adhd` (psychiatry + addiction-psychiatry), `opiates` (pain-medicine + addiction-medicine-opiate), `benzos` (addiction-medicine-benzo + geriatric-psychiatry). Schema versions: adhd / opiates / benzos 1.1.0 → 1.2.0; lipid / ckd / anemia / abd-pain 1.0.0 → 1.0.1 (terminology bump). Mechanical replace of "e-consult" → "consult" across 47 occurrences. Bundle delta gzip 207.28 → 214.48 kB JS (+7.20 kB).

### Track 4a — calculator registry + 5 calculators (2026-05-04)

Five new calculator primitives — `gad7` (Spitzer 2006), `phq9` (Kroenke 2001), `audit-c` (Bush 1998), `ciwa-ar` (Sullivan 1989), `cows` (Wesson 2003) — over shared `CalcShell` / `ScaleRow` / `ResultBanner` / `VerifyFooter` building blocks. **Three clinical-decision-rule overlays:** PHQ-9 item 9 (suicidality) separate red alert when score>0; AUDIT-C ≥6 promotion to "probable AUD"; COWS ≥13 buprenorphine-induction threshold callout; CIWA-Ar bands 9/16/20 per ASAM 2020.

Registry at `src/bubbles/_calculators/registry.ts` is single source of truth (clinical-tools reads it). `ModuleData.recommended_calculators?: string[]` floats matching cards to top with "Recommended" badge. Seeded: `adhd → ['gad7', 'phq9']`; `opiates → ['cows', 'phq9', 'audit-c']`; `benzos → ['gad7', 'phq9', 'audit-c']`. CIWA-Ar intentionally omitted from benzos (alcohol-specific). Bundle delta gzip 201.02 → 207.02 kB JS.

### Track 3 — citation generator (2026-05-04)

"Cite this decision" pop-out wired into SelectionMenu's new `Cite` button. `src/lib/citationGenerator.ts` clones selection DOM via `range.cloneContents()`, queries `[data-ref]` anchors (the markup `expandRefMarkers` produces), dedupes by `ref_id`, runs through `getModuleRefNumberer`. Two clipboard formatters: `formatCitationPlain` (Decision + "Supported by" list) + `formatCitationMarkdown` (numbered list with optional URL links). Bundle delta gzip 197.27 → 201.02 kB JS.

### Track 2 — glossary / acronym mechanic (2026-05-04)

`src/lib/glossary.ts` walks rendered HTML via `TreeWalker` over text nodes, wraps every occurrence in `<span class="glossary-term" data-term="...">`. Skips `<a>`, `<code>`, `<sup>`, `<pre>`, `<script>`, `<style>`, `<button>`, `<input>`, `<textarea>`, `<select>`, `<kbd>`, `.ref-marker`, `.glossary-term`. Case-sensitive, word-boundary anchored, longest-first regex.

Schema: `GlossaryEntry { term, definition, aliases?, expansion? }`; optional `glossary?: GlossaryEntry[]` on `ModuleData`. Module entries override global by exact term match. Seed: `src/data/seed/glossary.json` has 69 entries (regulatory bodies, specialty societies, conditions, pharmacology, instruments, statistics).

App-level `GlossaryPopover` mirrors `SelectionMenu` positioning. "Open glossary" pop-out dispatches `meridian:spawn-bubble` with `type=glossary-browser`, `props={ initialTerm }`. New `glossary-browser` bubble (slate `#5f6b7a`). Decoration sites: FAQ + checklist; PrintView/DOCX/PPTX untouched. Bundle delta gzip 191.38 → 197.27 kB JS.

### Track 1 — reading-experience QOL foundations (2026-05-04)

First track of post-launch QOL roadmap (scoping plan: `~/.claude/plans/i-love-the-work-whimsical-porcupine.md`). Twelve QOL asks grouped into four dependency-ordered tracks.

**Changes:** (a) Lift restricted to chrome handle (text selection works in bubble bodies); (b) `SelectionMenu` floating menu replaces iOS callout (Copy / Select all / OE / Feedback); (c) per-bubble font size via `--font-scale` + `zoom` + localStorage; (d) Feedback mailto + OE hop ported from `meridian-server`.

**Cross-cutting bridges introduced (reused by Tracks 2–4):** `data-bubble-id` attribute on every BSP leaf div; `meridian:spawn-bubble` CustomEvent for App-level components to summon bubbles. Bundle delta gzip 188.66 → 191.38 kB JS.

### Opiates module — Phase 1 + 2 + 3 + 4 (2026-05-03)

`opiates` entry 1.0.0 → 1.1.0; 92-entry `references[]`; 414 `[ref:X]` markers across 10 FAQs (90 unique cited; 0 undeclared, 2 unused). Phase 3 was **not** automatic — opiates places markers in `landing_intro` (3 unique, including `aafp-roth-2020` cited only there) and `green_zone.narrative_html` (4 unique), neither of which the ADHD-pass helper or render sites covered. **Phase 3 fix:** extended `getModuleRefNumberer` to walk landing_intro + green_zone.narrative_html + context_strip.text + faqs + footer_note in print-page reading order; expanded markers in PrintView's non-FAQ surfaces; stripped markers in checklist bubble (no per-bubble references section by design). ADHD numbering shifted incidentally (context_strip refs now claim 1..5 and faqs renumber from 6).

**Generalizable rule:** when extending Phase 3 to next module rewrite, check `MARKER_RE` coverage of every field the renderers display.

Full tracker: `verification/opiates.md` (108 rows).

### ADHD module — Phase 1 + 2 + 3 + 4 (2026-05-03)

`adhd` entry 1.0.0 → 1.1.0; 95-entry `references[]`; 184 `[ref:X]` markers across 8 FAQs (83 unique cited). **Six Disproved rows corrected:** R13 (CFR §1306.12(b) permits sequential post-dating with "earliest fill date"); R22 (anxiety meta RR 0.86 reduction); R25 (PTSD: stimulants associated with most-favorable outcomes); R27 + R28 (combo-stim: no US guideline restricts same-class IR booster to specialists); R34 (NY I-STOP per-prescription, NJ initial+quarterly).

Three module-level meta-acknowledgments in `context_strip` + `footer_note`: inherited-patient framework adapts CDC 2022 opioid Recommendation 5 (no ADHD-specific US framework exists); early-fill numeric thresholds reflect PBM/pharmacy convention; regulatory prose covers NY + NJ explicitly.

**Phase 3 wiring (`f13448c`):** `src/lib/refMarkers.ts` exposes `expandRefMarkers`, `getModuleRefNumberer`, `getCitedReferences`, `getReferencesUsedIn`, `stripRefMarkers`, `normalizeReferences`. FAQ bubble + PrintView call `expandRefMarkers` and render numbered `.faq-references` lists; DOCX/PPTX exports strip markers via `stripRefMarkers` and serialize structured refs as `[ref-id] Citation. URL` (round-trippable through `parseDocxHtml`).

**Print/pptx pagination fixes that emerged during Phase 3:** (a) `html, body, #app` overflow lock reset under `@media print` so multi-page modules paginate (without this, mobile Safari returned single-page PDF); (b) `page-break-inside: avoid` removed from `.print-faq` (rewritten FAQs routinely exceed a page); (c) PPTX FAQ slides paginate at sentence boundaries with `(cont.)` continuation slides; (d) DOCX round-trip preserves structured references via `^\[([a-z0-9-]+)\]\s*(.+?)(?:\s+(https?:\/\/\S+))?$` pattern in `parseDocxHtml`.

Full tracker: `~/GitHub_Repos/meridian-server/modules/adhd-verification.md`. Cross-module regulatory pass: `verification/controlled-substances-ny-nj.md`. Module scope locked to NY + NJ dual-state.

### Clinical Modules v1 module-mode plainness (2026-05-03)

Module mode is now just green / red / blue (+ PREVENT for lipid). Chat and OE dropped from `MODULE_LAYOUT_BASE` and `MODULE_LAYOUT_WITH_PREVENT`. Their slots taken by single full-width `notes` markdown bubble (same instance, animates between gallery and module placements via existing BSP transitions). **Spawned bubbles follow across modes** via new helper `buildClinicalModulesBSP(layout, registry, region)` in `BspWorkspace.tsx` — walks registry and appends every entry whose id contains `-spawned-` by `splitLeafInsert(findLargestLeaf, 'right')`. So chat opened from tools card in gallery rides through every module switch as same instance with same conversation.

### Clinical Tools refit (2026-05-03)

Cards in tools list (PREVENT 🫀, Clinical chat 💬, OpenEvidence 🔬) are buttons that split tools bubble in half and insert fresh primitive instance to right. Spawn flow: card → `onSpawnBubble` extraProp → `spawnAdjacentBubble(spec)` in BspWorkspace. Falls back to `findLargestLeaf` if `nearBubbleId` not in BSP. Gallery default screen change: live `chat` and `oe` bubbles dropped from `GALLERY_LAYOUT`; full-width `notes` markdown bubble added.

### Floating back chevrons (2026-05-03)

Two floating top-left iOS-glass pills (`src/shell/Launcher.tsx` exports `BackToMondrianChevron` + `ModuleBackChevron`; styles in `src/styles/glass.css`). Both follow dark-glass material — `backdrop-filter: blur(20px) saturate(140%)`, semi-transparent dark fill, multi-layer drop shadow, pill `border-radius: 999px`. `‹ Mondrian` renders whenever a Mondrian workspace is active; `‹ modules` renders in clinical-modules module mode. Stacked outer-scope-on-top (`top: 16px` + `top: 60px`).

**Proximity-reveal (deploy `d4a1931`):** Both pills default to `opacity: 0.10`. Shared `useProximityReveal(ref)` hook in `Launcher.tsx` listens to document pointermove/pointerdown/pointerleave and toggles `is-revealed` class when cursor within 220 px of pill's bounding-rect center.

### Launcher + Mentorship Tracker app (2026-05-03)

Top-level launcher (`src/shell/Launcher.tsx`, `src/data/launcherState.ts`) — full-viewport screen with "meridian" wordmark and two iOS-style app icons. Cold boot lands here. Last-opened app persists in `meridian-os.launcherApp.v1`. Mentorship Tracker (`src/apps/mentorship-tracker/MentorshipTrackerApp.tsx`) is Scott Freiberg's `~/Downloads/remixed-fab2f713.tsx` ported byte-identical with `// @ts-nocheck`. Self-contained React-style SPA (login → director / mentor roster → provider profile cards). React-on-Preact via `vite.config.ts` aliases. Wrapper shell (`MentorshipTrackerShell.tsx`) re-establishes scrollable web-app container; critical trick: `flex: 1 !important; min-height: 0 !important; max-height: 100% !important` on inner TSX outer.

**CSS-only TSX override gotcha:** Preact serializes inline hex colors as `rgb(…)` so `[style*="0f1b2d"]` does NOT match — use `[style*="rgb(15, 27, 45)"]` (with comma+space).

### Onboarding-stack three-leg integration (2026-05-05)

All three legs landed: (a) Epic Quick Reference ported as third launcher app — `src/apps/epic-quick-reference/EpicQuickReferenceApp.tsx` byte-identical from `~/Downloads/remixed-0de3d5eb.tsx`; (b) master checklist extracted into `src/data/seed/mentorship-master-checklist.json` (62 items, 16 phases incl `pre0` / `pre1`, 4 owner types, 31 items with `epic_ref_ids[]`); (c) MD Curriculum track added to MentorshipTrackerApp.tsx — legacy `mdReviewPct` replaced by `mdCurriculumPct`; new "MD Curriculum" tab + `MdCurriculumRow` component; `MdViewAllModal` covers all three trackable tracks (MD Curriculum + Mentor + Office Manager).

**Cross-app deep-link with state-preserving round-trip** via `src/data/epicReferenceFocus.ts`. Tracker click on 📖 ref pill → `openEpicRef(entryId)` sets signal (captures `returnTo`) + `setLauncherApp('epic-reference')`. Shell MutationObserver tags rendered entry headers with `data-eqr-id` (matched against `ENTRY_IDS[]` constant in document order — must stay in sync with source TSX `entries[]` declaration order or deep-links misfire). `main.tsx` keeps both Mentorship Tracker and Epic QR shells mounted (display-toggled) while either is active — tracker's React state survives the round-trip.

### Track 4a–4b sub-tracks remaining

- **Track 4c — SmartPhrase selector. SHIPPED 2026-05-25 (on PR #11's branch).** 19 phrases from `~/Downloads/smartphrase-implementation-spec.md` populated into the 3 CS module registries (full text + decision_point + anchor). Surfaced three ways: `smartphrase-selector` bubble (expand→copy, grouped Ship-ready/Future), expandable FAQ `smartphrase_note` pills (resolve `.TRIGGER`→registry), and a green-zone click-to-copy chip + "All SmartPhrases →" launch. Corrected `.BENZO-NOINDICATION-BRIDGE` spelling. Deferred: `decorateSmartphraseMentions` inline-anchor decorator (the pills + selector + green-zone cover surfacing); Epic-side Admin entry is out of scope.
- **Track 4d — NJ/NY Controlled Substances Contract builder. SHIPPED 2026-05-25 (on PR #11's branch).** Implemented to the v1.0.0 schema (`~/Downloads/cs-contract-builder-schema.md`): `src/data/seed/controlled-substances-contracts.json` clause library (5 sections, 36 clauses, NY/NJ variants, structured conditions); `contract-builder` bubble collects substance-class/state/flags → auto-suggests risk tier (Section 2, provider-override) → assembles clauses → agreement text + `.CSAGREE-[CLASS]-[STATE]-[TIER]` trigger. Surfaced via `ContractAutoSpawn` (auto-spawn on CS-module entry, mirrors ConsultAutoSpawn — the clinical-tools Contracts card can't show in module mode). v1 export = copy-to-clipboard; DOCX/PDF + Section-5 per-class subsections + agreement-mention decorator deferred.

### Major systems landed since 2026-04-27

**Clinical Modules workspace** — gallery → module morph. Three topic bubbles (Cardiometabolic red, Behavioral & Controlled Rx purple, General Internal Med teal), clinical-tools bubble (yellow), notes scratch pad.

**Workspace mode signal** (`src/data/moduleFocus.ts`) — `{ mode, moduleId, focusedItemId }` per workspace, persisted to localStorage.

**PREVENT calculator** (`src/bubbles/prevent-calculator/index.tsx`) — live 10-year ASCVD risk; PREVENT-shape coefficients (hand-calibrated; verify-link to acc.org/PREVENT).

**Print mode** (`src/shell/PrintView.tsx` + `@media print` rules in glass.css) — App-mounted hidden PrintView reads focused module and renders paginated letter-size 0.75in-margin layout. Triggered via Cmd+P or ⎙ button.

**DOCX import / round-trip** (`src/lib/parseDocxHtml.ts` + `src/data/userModules.ts`) — vanilla's `parseDocxHtml` ported 1:1 to TS. mammoth.js lazy-loads only when user picks file.

**DOCX export** (`src/lib/generateDocx.ts`) — round-trippable Word document. H1/H2/H3 structure, field markers, `>>>` instruction lines.

**PPTX export** (`src/lib/generatePptx.ts`) — adapted from vanilla's generate_pptx.py. One-way (presentations don't round-trip).

**Brain task-manager bar** — colored progress bar default, wrench opens sortable Name / Type / % task-manager view. Per-row contextual menu: Read deeply / Compress / Toggle editable / Dismiss.

**Filesystem v1** (`src/data/filesystem.ts`) — id-keyed Map persisted to localStorage. Bubbles can be views over `MeridianFile` records. Auto-naming on attach. Snapshot-on-trash for every non-placeholder bubble.

**Vault redesign** — type tiles + three file sections (This workspace / Other workspaces / Global). ✏️ inline rename per file.

**Markdown primitive** (`src/bubbles/markdown/index.tsx`) — view + textarea modes; persists to file when fileId is set.

**Real LLM in chat** — `functions/api/chat.ts` POSTs to Anthropic Sonnet 4.6 with brain context built per relationship in `src/data/brainContext.ts`. Non-streaming. Requires `ANTHROPIC_API_KEY` Pages secret.

**Markdown rendering** — `src/lib/md.ts` (uses `marked`); scoped `.markdown-body` styles.

---

## What's working end-to-end

**Home screen** — Mondrian-style tile grid hung "in space" with three-layer drop shadows + perspective tilt + radial-glow background. Tiles render miniature workspace previews from each workspace's persisted BSP layout (or JSON template).

**Workspace transitions (fly-up / fly-back)** — Tap a tile → painting flies up via Web Animations API (480ms cubic-bezier). Bubbles crossfade from "tile mode" (full color block) to "workspace mode" (5px top stripe + content) via bubble `::before` pseudo-element animating height 100% → 5px. FAB fades in late (240ms delay).

**BSP soap-bubble layout engine** — Binary space partition. Sub-cell precision splitAt for continuous deformation. Splitter handles between adjacent bubbles; corner handles where two splitters meet. Min-size cascade with aggressive borderization (1×1 minimum). Pointer Events with `setPointerCapture`, touch-capable.

**Bubble lifecycle** — Long-press chrome handle to lift. Drop modes:
- On any bubble's body: pointer-aware splitLeafInsert with alignment-snap (1.5-cell threshold)
- On a chat bubble: relationship menu modal — Read deeply / Scan + summarize / Held only / Editable
- On a placeholder: replaceLeaf — placeholder consumed
- On a screen-edge segment: split adjacent bubble at that edge
- On bottom-right FAB during lift: snapshot to per-workspace filesystem
- Off any bubble: snap back via originalRoot

**Double-tap a bubble → maximize.** Walks ancestor splits, pushes each splitAt to constraint-bounded extreme. Double-tap again restores.

**Chat (llm-chat primitive)** — Fully controlled (messages in `instance.props.messages`). Real Anthropic Sonnet 4.6 via `/api/chat`. Loading dots; AbortController cancels on new send. Markdown rendering on assistant/system/user messages.

**Vault** — 8 type tiles at top + three file sections below. Pick type → fresh bubble. Pick file → placeholder rehydrates.

**Filesystem** — `src/data/filesystem.ts`. Id-keyed `Map<string, MeridianFile>` persisted to localStorage. Each file holds serialized `BubbleInstance` plus metadata. Files survive bubble dismissal.

**Multi-function FAB** (bottom-right): tap = summon placeholder; long-press = expand menu (numbered save-state grid + actions); during lift = trash target with warn pulse.

**Workspace ⟲ reset** — Resets positions only. Preserves chat history, brain attachments, all instance content. Drops summoned non-template bubbles.

**Chat-internal compact / clear** — `compact` replaces messages with ⤓-prefixed summary; `clear` replaces with greeting. Brain mini-bubbles intact.

**Save-state slots** — Per-workspace numbered grid (2 cols, 3 visible rows, scroll). Tap empty → snapshot. Tap filled → restore. Right-click → delete.

**Persistence** — `localStorage` hydrates `persistentWorkspaceStates` and `savedLayouts` on module load; writes through helpers on every change.

**iOS specifics** — `visualViewport` listener writes height to `--vh`. `viewport` meta disables native zoom. `touch-action: none` on html/body with `pan-y` on scrollable children. iOS long-press text selection suppressed.

---

## Pending plan (priority order)

### QOL roadmap remaining

Active scoping plan: `~/.claude/plans/i-love-the-work-whimsical-porcupine.md`. **ALL tracks shipped (1, 2, 3, 4a, 4b, 4c, 4d).** The QOL roadmap is complete; remaining smartphrase polish (inline `decorateSmartphraseMentions` anchor decorator) is optional and noted in "Track 4a–4b sub-tracks remaining" above.

### Next candidates (no immediate-next locked)

Three remaining v1.0.0 modules await rewrite — ckd, anemia, abd-pain. Non-controlled-substance + non-cardiometabolic so their bundle map will differ from lipid's 6-bundle structure. Order TBD by Noah.

### Clinical Modules wow-factor wiring

Structural shell shipped. Next layer is functional wiring:

1. **Module-aware LLM chat** — define tools (`open_module`, `focus_item`, `fill_calculator`, `generate_smartphrase`), update `/api/chat` for Sonnet's tool use, pre-seed system prompt with module manifest. Provider types "patient on rosuvastatin 40 still has LDL 130" → chat opens lipid module, highlights "not at goal" escalation, fills PREVENT, offers to draft a SmartPhrase. Highest-impact next move for a provider demo.
2. **Mock patient context + cross-bubble harmony** — dummy patient panel; tap a patient → PREVENT auto-fills, relevant module opens, escalation/checklist rows highlight.
3. **Generate-the-note SmartPhrase output** — button on checklist footer; produces paste-ready Epic SmartPhrase block.
4. **Polish** — gallery↔module morph could fade in/out entering/leaving bubbles. Topic bubbles could grow on hover.

### Module browser scaling beyond ~10 modules

Current 3-topic-bubble approach scales to maybe 15–20 modules; beyond that we need search + filter. Options: (A) library bubble in workspace, (B) Cmd+K-style modal browser, (C) module-gallery as workspace landing. Defer until module count requires it.

### Toward storyboard completion (after Clinical Modules)

1. **Provider workspace populated.** Patient-info stack, modules-stack, openevidence-builder, smartphrase-directory, chart-closure accumulator, care-gap-accumulator. Realistic dummy patient on schedule.
2. **QI Statin workspace.** Glidepath-chart, email-threads-tracker, meeting-tracker, pending-actions list, SMART goal modal.
3. **Provider File workspace.** Drilldown: provider-dossier expanded, Epic Signal data table, 1:1 cadence schedule, disciplinary record, complaint tracker.
4. **Admin Cockpit workspace.** Region/office/provider drilldown, HEDIS metric dashboard, email-threads, meeting trackers per topic.
5. **Cross-workspace bubble drag** (original wow #2). HydrationBus is a stub already. Likely needs home page to render multiple workspaces at intermediate size for live drag-and-drop.
6. **Per-bubble mini-search.** Active-search button on every bubble.

### Bubbles-as-programs unlocks (longer horizon)

After enough workspaces exist to see the patterns, land bubble-manifest model: each primitive type carries `prompts`, `tools`, `companions`, `harness`. Adoption joins relationship menu as 5th option. Atomic tool bubbles become a real archetype. See `~/.claude/projects/-home-noahs-Documents-meridiandrafts-Onboarding/memory/project_meridian_os_bubbles_as_programs.md`.

### Streaming + write-trail + scope chip

All deferred until after manifests + adoption.

### Toward full v1 (vision items beyond v1)

- **Workspace save states as multi-mode** (sleeping / active-meeting / working).
- **Multicellular communication.** Multiple chat bubbles in different workspaces communicating.
- **Integration mode.** Convert a working workspace into a hardened FDS by spawning real Claude Code on backend.
- **Heartbeats / agentic cron.** Workspaces wake up nightly to scan literature.
- **Real connectors** — M365, Epic, OpenEvidence query API, journal feeds. All require enterprise; future on-prem deployment.

### Onboarding-stack v1 pending items (bookmarked)

8 items + 6 smaller open questions captured at `analysis/onboarding-stack-pending-v2-bookmark.md`. Hold premise has changed 2026-05-12 (Scott now active) — awaiting Noah's call on whether to lift / narrow / coordinate per-item.

---

## Related artifacts

- **Plans:** `~/.claude/plans/` — contains lipid-rewrite plan, QOL roadmap, v2 architecture plan, original implementation plan.
- **Verification:** `verification/{adhd,opiates,benzos,lipids}.md` — tracker rows + Bundle findings. `verification/controlled-substances-ny-nj.md` — cross-module regulatory pass.
- **Analyses:** `analysis/master-checklist-vs-mentorship-tracker.md`, `analysis/epic-quick-reference-vs-onboarding-stack.md`, `analysis/onboarding-stack-pending-v2-bookmark.md`.
- **Frozen sibling:** `~/GitHub_Repos/meridian-server/modules/*.json` — historical seed. Don't propagate rewrites back.
- **v2 working tree:** `~/GitHub_Repos/meridian-os-v2` — SQL-backed fork in progress.

# Interface-Simulacrum PPTX → PDF Export — Spec + Design Rationale

**Status:** v1 (lipid pilot) IMPLEMENTED 2026-08-12 — see §14 Implementation notes. Remaining validation: Noah's PowerPoint → PDF smoke test (§10).
**Author of spec:** Noah's Claude instance (2026-08-12), from an interactive design session with Dr. Noah Schmuckler.
**Owner territory:** Noah (tooling — `src/lib/`, export path). Non-shared; no coordination with Scott required.
**Relationship to the project:** This is a *new export format* for the clinical modules described in `CLAUDE.md` → Architecture / Locked design decisions and in `STATE.md`. It sits alongside the existing DOCX (round-trip) and one-way PPTX exports (`src/lib/generateDocx.ts`, `src/lib/generatePptx.ts`) and the browser-print PDF path (`src/shell/PrintView.tsx`). It does **not** replace any of them.

---

## 1. Why this format exists

Meridian-OS cannot be hosted on Dr. Schmuckler's enterprise hardware. The clinical modules do not survive a flat PDF/PPTX/DOCX export (their value is the *reactive* two-tier interface, which those formats flatten), and even a standalone HTML build (as shipped in the `continuum` port) is not an acceptable enterprise artifact.

The workaround — **validated by Noah as a hand-built proof-of-concept** — is:

> Build a PowerPoint deck whose slides reproduce the *profile* of the Meridian module interface, with **internal slide-to-slide hyperlinks** wired so that clicking a region of the "interface" jumps to the slide showing the interface's reaction. Export that PPTX to PDF (PowerPoint / LibreOffice "Save as PDF" **retains internal links**), and the resulting PDF behaves like a lightweight, offline, single-file web app — an acceptable enterprise deliverable.

Noah's POC was a drastically simplified version (clickable left-panel headings → responsive right panel). Hand-wiring the **full** lipid module defeated both him and enterprise Copilot Premium. **The reason it defeats hand-wiring is combinatorial (see §3), and the fix is to generate the deck deterministically from the module JSON that meridian-os already holds.** That is this spec.

---

## 2. Feasibility — confirmed

| Question | Finding |
|---|---|
| Can we emit internal slide-jump hyperlinks? | **Yes.** `pptxgenjs` v4.0.1 (already in `package.json:14`) exposes `hyperlink: { slide: number }` on **text, shapes/text-boxes, and images** (`node_modules/pptxgenjs/types/index.d.ts:945-959`, accepted at `:1324, :1482, :1665, :1835`). This is the load-bearing capability and it already ships. No new dependency. |
| Does the current PPTX generator use links? | **No.** `generatePptx.ts` flattens HTML to plain text, one topic per slide, zero hyperlinks. This new format is a **separate generator**, not an edit to that file. |
| PPTX → PDF retaining links? | **Manual, proven.** Noah's POC confirmed PowerPoint "Save as PDF" preserves the internal jumps. No PDF library exists in-repo (no jspdf/pdf-lib/pdfkit), and none is being added (per decision §4). |
| Where does generation run? | **Client-side (browser)**, like the existing exports. Triggered from a bubble; `pres.write({ outputType: 'blob' })` → `downloadBlob`. |
| Is there an existing "interface state" model to reuse? | **No.** No state machine or state enumeration exists anywhere in `src/`. Defining the state→slide graph (§5) is the core intellectual work of this format. |

---

## 3. The core problem, and the reduction that solves it

### The trap
In the **live** interface, the FAQ detail panel's expanders are *independent toggles*, not an accordion. Verified in `src/bubbles/clinical-module-faq/index.tsx`:
- Each `SubQuestionRow` holds its **own** `useState(false)` (`:253`) — N sub-questions ⇒ **2^N** open/closed combinations, all independently reachable.
- The SmartPhrase-note pill (`:334`) and the Consult-decision-point pill (`:292`) each hold their **own** separate `useState`.
- The first-layer answer is always shown once an entry is focused; nothing collapses anything else.

So "every possible viewable configuration" of a single focused FAQ entry is a **power set**, and across a module it multiplies. That is the swamp — thousands of hand-wired slides. This is exactly where hand-wiring (and Copilot) drowned.

### The reduction
Two facts already bound the explosion, and one imposed rule collapses the rest:

1. **Exactly one item is focused at a time.** `moduleFocus.focusedItemId` is a single scalar (`src/data/moduleFocus.ts:16-22`). You can never have FAQ entry A *and* entry B open simultaneously.
2. **Switching entries resets all expander state.** `FocusedFaq` is `key={focusedFaq.faq_id}` (`clinical-module-faq/index.tsx:120`) — Preact remounts the subtree, so open sub-questions do **not** persist across entries. The open-set is strictly per-entry.
3. **IMPOSED RULE — accordion within an entry.** For the export we treat the per-entry expanders as **one-open-at-a-time** (opening a sub-question/pill closes its siblings). This diverges from the live UI's multi-open behavior. It is the one deliberate fidelity sacrifice, and it is what converts a per-entry power set (2^N) into a per-entry *linear* set (N+1). **Noah accepted this trade-off** ("Full fidelity" chosen with accordion semantics stated).

Result: the interface collapses to a **shallow tree of resting states**, each a single slide, with a slide count that is the *sum* of the pieces, not their product. For lipid: **≈ 62 slides** (§5.3), fully generatable from JSON.

---

## 4. Locked decisions (this session)

| Decision | Choice | Consequence |
|---|---|---|
| **Slide fidelity** | **Native PPTX text** | Each slide is real PowerPoint text boxes + shapes styled to *resemble* Meridian (not a screenshot). Text stays selectable/searchable; file stays small and editable. Cost: HTML content (`first_layer_html`, `answer_html`, incl. tables/callouts) must be decomposed into PPTX primitives (§7). |
| **State coverage** | **Full fidelity** (accordion) | Every FAQ first-layer, every sub-question, every resolvable SmartPhrase/consult pill, and the full SmartPhrase selector are each reachable as their own slide. ~62 slides for lipid. |
| **PDF conversion** | **Manual "Save as PDF"** | meridian-os emits `.pptx` only. Noah converts in PowerPoint/LibreOffice (proven to retain links). No PDF library added. |
| **Calculators** | **Omit** | No PREVENT slides, no simulated computation. For lipid, drop the PREVENT column from the frame and use the `MODULE_LAYOUT_BASE` proportions (§6). |

### Sub-decisions folded in (not surfaced as questions; flip if Noah disagrees)
- **Notes bubble is omitted** from the export frame — it is user scratch space, not module content. Its width is reclaimed by the detail panel.
- **Glossary decoration & consult/glossary popovers are deferred** to a later version. In native-text rendering the decorators simply aren't applied, so there are no dangling links.
- **Interactive tool bubbles are out of scope for v1**: the consult-builder *walker*, contract-builder *inputs*, and calculators are separate input/decision-tree state spaces and get their own future spec. Note the lipid pilot has **no** consults and **no** contract (non-controlled, `consults: []`), so v1 is unaffected. The FAQ-level `consult_decision_point` *pill* (a one-tap text reveal) **is** in scope — it is just another accordion leaf.
- **Reference markers**: for v1, strip `[ref:X]` markers from displayed text via `stripRefMarkers` (already imported by `generatePptx.ts`). A linked references slide + superscripts is a v1.1 enhancement (§11).

---

## 5. The state → slide graph (the heart of the spec)

### 5.1 State keys
Every slide corresponds to exactly one state key. Enumerate these **in order** and assign slide numbers 1..N in a first pass, so hyperlinks can resolve to numbers in a second pass.

```
home                        # module landing: left rail + FAQ index in the detail panel
faq:<faq_id>                # FAQ entry focused, first-layer shown, all expanders closed
sub:<faq_id>:<j>            # FAQ entry focused, sub-question j expanded (siblings closed)
pill:<faq_id>               # FAQ entry focused, SmartPhrase-note pill expanded
dp:<faq_id>                 # FAQ entry focused, consult-decision-point pill expanded
sp:home                     # SmartPhrase selector, list view, nothing expanded
sp:<phrase_id>              # SmartPhrase selector, phrase card expanded (single-open accordion)
```

Emit `pill:` only when `entry.smartphrase_note` resolves to a phrase present in `module.smartphrases` (mirror the live guard at `clinical-module-faq/index.tsx:336-349`; an unresolvable note renders as flat text with no slide). Emit `dp:` only when `entry.consult_decision_point` exists. Emit `sub:` per element of `entry.sub_questions`.

### 5.2 The transition (hyperlink) table
Persistent links appear on **every** slide (they are part of the always-present chrome); detail-panel links depend on the current state.

**Persistent chrome (every slide):**
| Affordance (rendered on the frame) | Target state |
|---|---|
| Header "‹ Modules" chip | `home` |
| Each checklist row (left rail, green) | `faq:<resolve(item.faq_ref)>` |
| Each escalation row (left rail, red) | `faq:<resolve(item.faq_ref)>` |
| Green-zone SmartPhrase chip (checklist footer) | `sp:<resolve(green_zone.smartphrase)>` (fallback `sp:home`) |
| "All SmartPhrases →" (checklist footer) | `sp:home` |

**Detail-panel links by state:**
| State | Affordance | Target |
|---|---|---|
| `home` | each FAQ index row (all 16) | `faq:<faq_id>` |
| `faq:<id>` | "‹ topics" back | `home` |
| | sub-question row *j* | `sub:<id>:<j>` |
| | SmartPhrase pill (if any) | `pill:<id>` |
| | consult-DP pill (if any) | `dp:<id>` |
| `sub:<id>:<j>` | the expanded row *j* (tap to collapse) | `faq:<id>` |
| | sibling sub-question *k*≠*j* | `sub:<id>:<k>` |
| | SmartPhrase / consult-DP pill | `pill:<id>` / `dp:<id>` |
| | "‹ topics" back | `home` |
| `pill:<id>` / `dp:<id>` | the expanded pill (tap to collapse) | `faq:<id>` |
| | sub-question row *k* | `sub:<id>:<k>` |
| | "‹ topics" back | `home` |
| `sp:home` | each phrase card *k* | `sp:<phrase_id_k>` |
| | back | `home` |
| `sp:<phrase_id>` | the expanded card (tap to collapse) | `sp:home` |
| | other phrase card *k* | `sp:<phrase_id_k>` |
| | back | `home` |

**Resolver note (critical):** `resolve(faq_ref)` must mirror how the live FAQ bubble maps `focusedItemId` → a FAQ entry. Read the resolver at the top of `src/bubbles/clinical-module-faq/index.tsx` (just above line 105) and reuse it verbatim — do not assume `faq_id === faq_ref`, because checklist/escalation `faq_ref` values may match via a different field (e.g. `referenced_by`). If a `faq_ref` resolves to nothing, log it and link the row to `home` (visible-fallback policy, matching the module's other unknown-target behaviors).

### 5.3 Lipid worked count (the pilot)
From `src/data/seed/clinical-modules.json` → `lipid-management`:
- 1 × `home`
- 16 × `faq:` (16 FAQ entries)
- 29 × `sub:` (sum of `sub_questions` across the 16 entries)
- 7 × `pill:` (7 entries carry a resolvable `smartphrase_note`)
- 0 × `dp:` (lipid has no `consult_decision_point`)
- 1 × `sp:home`
- 8 × `sp:<phrase_id>` (8 SmartPhrases: `.lipidreview` + 7 `.LIPLIPID-*`, all carry `text`)

**Total = 1 + 16 + 29 + 7 + 0 + 1 + 8 = 62 slides.**

The 4 checklist rows and 5 escalation rows create **no new slides** — they are links *into* the 16 `faq:` slides via their `faq_ref`. Slide count formula for any module:
`N = 1 + F + ΣsubQ + P + D + 1 + S` where F = #faqs, P = #faqs-with-resolvable-pill, D = #faqs-with-consult-DP, S = #smartphrases.

---

## 6. The export frame (Native PPTX approximating Meridian)

Reproduce the module-mode identity so the deck reads as "the Meridian interface." Layout is `pres.layout = 'LAYOUT_WIDE'` (13.33" × 7.5", 16:9). Type-colors from `src/styles/glass.css`: checklist green `#0F6B42`, escalation red `#d92e2e`, FAQ blue `#1f4cae`, SmartPhrase/tools yellow `#f4c020`. Each Meridian bubble has a 5px top identity stripe — reproduce as a thin colored `rect` at the top of each card. Approximate glass with a near-white fill + subtle 1px border.

**Constant chrome on every slide (identical geometry so it reads as a fixed app frame):**

```
┌──────────────────────────────────────────────────────────────────────┐  y 0.00
│  <Module title>                                    ‹ Modules  [chip]   │  header  (~0.5")
├───────────────────────┬──────────────────────────────────────────────┤  y 0.60
│ ▎GREEN — Checklist     │ ▎BLUE — Detail panel (THE reacting region)    │
│  1  <statement>  ────► │   (contents vary by state; §5, §7)            │
│  2  <statement>  ────► │                                              │
│  3  ...                │                                              │
│  4  ...                │                                              │
│  [green-zone narrative]│                                              │
│  [.smartphrase chip]──►│                                              │
├───────────────────────┤                                              │
│ ▎RED — Escalations      │                                              │
│  !  <statement>  ────► │                                              │
│  !  ...  (5 rows)      │                                              │
│  [context strip]       │                                              │
├───────────────────────┴──────────────────────────────────────────────┤  y 7.00
│  <footer_note>  (small gray, full width)                              │  footer
└──────────────────────────────────────────────────────────────────────┘  y 7.50
    x0.0        x3.4     x3.5                                     x13.0
```

- **Left rail** `x 0.0–3.4"`: checklist card (green) `y 0.6–4.2"` over escalations card (red) `y 4.3–7.0"`. Checklist footer carries the green-zone narrative + the click-to-copy `.smartphrase` chip + "All SmartPhrases →"; escalations footer carries the `context_strip`. Every checklist/escalation row is a hyperlinked text box (§5.2 persistent chrome).
- **Detail panel** `x 3.5–13.0"`, `y 0.6–7.0"`, blue top stripe. The **only** region that changes between slides.
- **Header** `y 0.0–0.5"`: module `default_title` left; "‹ Modules" chip (→ `home`) right.
- **Footer** `y 7.0–7.5"`: `footer_note`, small gray.
- Calculators omitted ⇒ **no PREVENT column**; use these base proportions for all modules (ignore `MODULE_LAYOUT_WITH_PREVENT`).

Rows render as filled/bordered text boxes; the "linkable" affordance carries a subtle chevron/`►` glyph so a reader knows it is clickable in the PDF. On a `faq:`/`sub:`/`pill:` slide, the corresponding left-rail row that points at the current entry should render in its **focused** style (bg tint + 3px left stripe) to mirror the live highlight (`clinical-module-checklist` row focus, `clinical-module-faq/index.tsx:157-170` badge logic).

---

## 7. Content fidelity: HTML → PPTX primitives

`first_layer_html` and each sub-question `answer_html` are mixed HTML (prose, `<ul>`/`<ol>`, `<table>`, `<div class="cm-callout">`, `<p class="cm-fl-caption">`). **Reuse the decomposer that already exists** — `htmlToBlocks()` in `src/lib/generateDocx.ts:281-306` returns `{ kind: 'prose'|'caption'|'callout'|'bullet'|'tableRow', text }[]`. Port it (or import a shared copy) and map blocks to pptxgenjs:

| Block kind | pptxgenjs rendering |
|---|---|
| `prose` | `addText` paragraph (11–12.5pt, line-spacing ~1.4) |
| `bullet` | `addText` with `bullet: { indent }` |
| consecutive `tableRow` run | collect into one `addTable` (first row = header row, bold, blue fill) — pptxgenjs `addTable` handles this; the lipid T2 tier-target table is the first embedded `<table>` in any module and is the canary |
| `callout` | a light-fill rounded `rect` (subtle blue/yellow tint) + `addText` inside, to echo the `.cm-callout` treatment |
| `caption` | small italic `addText` |

Strip `[ref:X]` markers via `stripRefMarkers` (from `src/lib/refMarkers.ts`) before rendering text. Use `normalizeReferences` if a references slide is added later (v1.1).

**Overflow is the #1 content risk.** A focused entry's content can exceed the detail panel height, which breaks "one state = one slide." Strategy, in order:
1. Set text `fit: 'shrink'` (pptxgenjs auto-shrink-to-fit) on the detail panel body box, down to a legibility floor (~9pt).
2. If still overflowing (long tables), spill into a linked continuation slide `faq:<id>#2` with a "▼ more" link from the primary and a "▲ back" link on the continuation — mirroring the `(cont.)` pagination the existing `generatePptx.ts` already does for FAQ slides. Keep continuations out of the *primary* navigation counts; they are internal to one state.

Validate overflow behavior on lipid's **Co-Primary Targets** (4 sub-questions) and the **tier-target table** before scaling to all entries.

---

## 8. Generation algorithm (deterministic, two-pass)

New file: `src/lib/generateInterfacePptx.ts`, exporting `generateInterfacePptx(mod: ModuleData): Promise<Blob>` (same signature shape as `generateModulePptx`). Client-side.

```
function generateInterfacePptx(mod):
  # PASS 1 — enumerate states, assign slide numbers
  states = []
  states.push({ key: 'home' })
  for faq in mod.faqs:
    states.push({ key: `faq:${faq.faq_id}`, faq })
    for (j, sq) in faq.sub_questions: states.push({ key:`sub:${faq.faq_id}:${j}`, faq, j })
    if resolvablePill(faq, mod):       states.push({ key:`pill:${faq.faq_id}`, faq })
    if faq.consult_decision_point:     states.push({ key:`dp:${faq.faq_id}`, faq })
  states.push({ key: 'sp:home' })
  for sp in mod.smartphrases:          states.push({ key:`sp:${sp.id}`, sp })
  slideNo = Map(state.key -> index+1)          # 1-based

  # PASS 2 — emit one slide per state
  pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE'
  for st in states:
    s = pres.addSlide()
    drawHeader(s, mod, slideNo)                # + '‹ Modules' -> slideNo['home']
    drawLeftRail(s, mod, slideNo, activeItem=st)   # checklist+escalation rows -> faq: targets; focused-style if row targets st
    drawDetailPanel(s, mod, st, slideNo)       # per §5.2 + §7
    drawFooter(s, mod)                          # footer_note
  return pres.write({ outputType: 'blob' })
```

`resolvablePill(faq, mod)` mirrors `clinical-module-faq/index.tsx:336-349`. `drawDetailPanel` switches on `st.key`'s prefix and renders per §5.2/§7, resolving every hyperlink target through `slideNo`. Because Pass 1 fixes all slide numbers before Pass 2 emits anything, every `hyperlink: { slide: slideNo[targetKey] }` resolves cleanly — no forward-reference problem, no hand-wiring.

---

## 9. Integration into meridian-OS

- **New button** in the checklist bubble chrome, alongside the existing `.docx` / `.pptx` buttons: `src/bubbles/clinical-module-checklist/index.tsx` (buttons at `:111-128`, handlers `exportDocx`/`exportPptx` at `:76-102`). Add `exportInterfacePptx()` mirroring `exportPptx()`: dynamic `import('../../lib/generateInterfacePptx')`, call with `selected`, `downloadBlob(`${module_id}-interactive.pptx`, blob)`. Extend the `busy` union with `'interface'`. Label the button e.g. **"⧉ .pptx"** or **"interactive .pptx"** (Noah's call on wording).
- **No shared-file changes.** All in Noah's territory. No `types.ts` change needed (the format reads existing `ModuleData` fields). No new dependency.
- Keep it entirely client-side (matches all existing exports; no Pages Function).

---

## 10. PPTX → PDF workflow (manual, unchanged from POC)

1. Click the new export button in meridian-os → download `<module_id>-interactive.pptx`.
2. Open in PowerPoint (or LibreOffice Impress) on the enterprise machine.
3. **File → Save As / Export → PDF.** Internal slide links convert to PDF GoTo actions and remain clickable in the PDF viewer.
4. Distribute the single `.pdf`.

> **Smoke-test the link survival FIRST.** Before building the full 62-slide generator, emit a **3-slide** test deck (home → faq → back) with `hyperlink: { slide: N }` on a shape, run it through the actual PowerPoint→PDF path, and confirm the jumps work in the PDF. pptxgenjs encodes slide jumps as `ppaction://hlinksldjump`, which PowerPoint maps to a GoTo on PDF export — Noah's POC already proves the round-trip, but confirm pptxgenjs's specific encoding survives *his* converter before investing in the full build.

---

## 11. Scope, phasing, deferrals

**v1 — lipid pilot.** Implements §5–§9 for `lipid-management`. Lipid is the ideal pilot: it exercises FAQ first-layers, 29 sub-questions, 7 SmartPhrase pills, an 8-phrase selector, and the first embedded table — but has **no** consults, **no** contract, and calculators are omitted, so none of the deferred interactive machinery is needed.

**v1.1 — generalize to the other 1.3.0 modules** (adhd, opiates, benzos). These add `consult_decision_point` pills (already specced as `dp:` states — trivial) and are controlled substances (contract-builder exists, but the contract *builder* is deferred; the module's static content still exports fine). Confirm each module's `faq_ref` resolution and re-run the overflow check.

**Deferred (each a separate future spec):**
- References slide + linked `[N]` superscripts (currently stripped).
- Glossary-term decoration + glossary popover slides.
- Consult-builder *walker* (decision-tree) as a slide chain — one slide per node, Yes/No → node targets. This is a clean future extension of the same graph technique.
- Contract-builder *inputs* and calculator *inputs* — input-driven, not enumerable without a worked-example convention (Noah chose "omit" for calculators).
- Screenshot-hotspot fidelity mode (the rejected alternative — pixel-perfect but non-searchable) remains available as a future high-fidelity variant if Native-text proves visually insufficient.

---

## 12. Acceptance criteria (v1, lipid)

1. `generateInterfacePptx(lipid)` produces a `.pptx` of **62 slides** (§5.3).
2. Every slide shows the constant frame: green checklist rail (top-left), red escalations rail (bottom-left), blue detail panel (right), header with "‹ Modules", footer note.
3. From `home`: clicking checklist row **1 (risk-tier)** lands on the risk-stratification `faq:` slide; clicking escalation row **1 (LDL ≥190)** lands on that `faq:` slide.
4. On a `faq:` slide with sub-questions: clicking sub-question *j* lands on `sub:…:j` (its answer shown); clicking it again returns to `faq:`; clicking a **sibling** sub-question switches to that sibling's slide (accordion).
5. A SmartPhrase-note pill expands to its full phrase text on its own slide and collapses back.
6. "All SmartPhrases →" reaches `sp:home`; a phrase card expands to `sp:<id>` and collapses back; opening another card switches (single-open).
7. Exporting the deck to PDF via PowerPoint preserves **all** of the above jumps in the PDF viewer.
8. The lipid **tier-target table** and **Co-Primary Targets** entry render legibly without silent truncation (overflow handled per §7).

---

## 13. Open questions for Fable (raise with Noah if blocking)
1. **Button label / glyph** for the new export (wording is Noah's call).
2. **Overflow policy** confirmation: is `fit:'shrink'` down to ~9pt acceptable, or prefer continuation slides earlier? (Recommend shrink-first; validate on lipid.)
3. **Green-zone `.smartphrase` chip target**: confirm `green_zone.smartphrase` (`.lipidreview`) resolves to a `smartphrases[]` entry so the chip can deep-link to that selector card (it does for lipid; guard the general case).
4. **`faq_ref` resolver**: confirm the exact matching used at the top of `clinical-module-faq/index.tsx` and reuse it — do not hard-code `faq_id === faq_ref`.

---

## 14. Implementation notes (v1, built 2026-08-12)

- **Files:** `src/lib/generateInterfacePptx.ts` (generator: state enumeration → pagination → two-pass emit), `src/lib/htmlBlocks.ts` (shared `htmlToBlocks` extracted from `generateDocx.ts`, now with per-cell table data + a DOM-free scanner fallback for Node-side generation/testing), button in `src/bubbles/clinical-module-checklist/index.tsx` (labeled **"⧉ .pptx"**, downloads `<module_id>-interactive.pptx`).
- **Lipid deck:** 62 primary states exactly as §5.3 predicted; 73 physical slides (11 content-heavy states — the four risk-tier subs, tier-table entries, and two long pills — each spill onto one linked "(cont.)" continuation at the §7 floor scale). All 2,536 slide-jump links verified against the OOXML rels (zero dangling).
- **pptxgenjs hyperlink trap (load-bearing):** a box-level `hyperlink` option on `addText` with **array-of-runs** text is written into the slide XML but its relationship is never registered — links come out as dead `r:id="rIdundefined"`. `createHyperlinkRels` only walks per-run options. Fix: attach one shared hyperlink object to every run of the box (`linkRuns` helper); string-text boxes are unaffected. Never reuse a hyperlink object across boxes/slides — pptxgenjs caches `_rId` on the object.
- **§13 answers:** (1) button label "⧉ .pptx" (Noah, 2026-08-12); (2) shrink-then-continuation confirmed — floor scale 0.85 (~9.2 pt body); (3) `green_zone.smartphrase` resolves for lipid, guarded with `sp:home` fallback; (4) live resolver confirmed trivial (`faq_id === focusedItemId`), mirrored with visible-fallback-to-home on misses.
- **Frame deviation from §6 sketch:** the checklist footer carries the green-zone `zone_label` (+ chip + "All SmartPhrases →"), not `narrative_html` — matching the live checklist bubble, which never renders the narrative in its footer.
- **Validation run:** Node (scanner parser) and headless-Chrome (DOM parser) builds produce identical state/slide/pagination results; tier-target table parses as 6 × 4-cell rows with header row.

## References (repo)
- Existing exporters: `src/lib/generatePptx.ts` (text-only, no links — the sibling to replace/augment), `src/lib/generateDocx.ts` (reuse `htmlToBlocks` `:281-306`), `src/lib/refMarkers.ts` (`stripRefMarkers`, `normalizeReferences`).
- Interface truth: `src/bubbles/clinical-module-faq/index.tsx` (two-tier body, expander state, resolver), `src/bubbles/clinical-module-checklist/index.tsx` (export buttons, green-zone footer), `src/data/moduleFocus.ts` (focus scalar), `src/shell/BspWorkspace.tsx` (module-mode layout tables `:99-118`), `src/styles/glass.css` (type-colors).
- Data: `src/data/seed/clinical-modules.json` (`lipid-management`), schema in `src/types.ts:331-363`.
- Project context: `CLAUDE.md` (Architecture, Locked design decisions), `STATE.md` (current state).

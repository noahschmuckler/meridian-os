# Meridian-OS — Claude Code Context

This is **meridian-os**, a workspace-based front-end for clinical / training / admin work. It's a sibling to (but architecturally distinct from) `~/GitHub_Repos/meridian-onboarding`. That repo is **frozen** as a working demo of the onboarding loop and must remain untouched. Meridian-os seeded from its content but rebuilt the architecture around a bubble/cell/workspace metaphor.

The user is **Dr. Noah Schmuckler**, MD, primary-care medical director at Optum. He is the product owner *and* author of this build. Treat him as an experienced product owner who reads code and reasons clearly about architecture — skip clinical primers, name Epic specifics precisely, frame tradeoffs.

---

## Status snapshot (last updated 2026-04-27)

- **Live:** https://meridian-os.pages.dev
- **Repo:** https://github.com/noahschmuckler/meridian-os (private)
- **Cloudflare Pages project:** `meridian-os`
- **Latest commit:** `b8968a3` (per-bubble .docx and .pptx export wired to ported vanilla generators).

The OS shell is **production-quality**. The **Trainer** workspace and the **Clinical Modules** workspace are both fully populated. Clinical Modules is the workspace currently being demoed and pushed forward. The other three workspaces (Provider, QI Statin, Provider File, Admin Cockpit) are empty tiles awaiting content.

### Major systems landed since 2026-04-27 (Clinical Modules milestone)

- **Clinical Modules workspace** — full gallery → module morph. Gallery has three topic bubbles (Cardiometabolic red, Behavioral & Controlled Rx purple, General Internal Med teal) sized roughly by module count, plus a clinical-tools bubble (yellow) that hosts the DOCX importer + calculator list, a real LLM chat (yellow), and an OpenEvidence query builder (yellow, UI shell). Tapping a module in a topic bubble morphs the workspace to module mode (checklist green + escalations red + FAQ blue, with the PREVENT calculator yellow auto-attached for the lipid module). The chat and OE bubbles persist across the morph, animating to their new placements via the existing BSP CSS transitions; their internal state survives because they keep the same bubbleId in both layouts.
- **Workspace mode signal** (`src/data/moduleFocus.ts`) — `{ mode, moduleId, focusedItemId }` tracked per workspace, persisted to localStorage so refreshes restore mode + selection together with the BSP root.
- **Mode-aware BSP layout** — `BspWorkspace.tsx` watches `moduleFocusSignal` and rebuilds the BSP from one of three layout tables (`GALLERY_LAYOUT`, `MODULE_LAYOUT_BASE`, `MODULE_LAYOUT_WITH_PREVENT`) on every mode/module change. Bubbles in both layouts (chat, oe) animate; bubbles unique to one mode mount/unmount. Replaces the earlier ad-hoc PREVENT companion auto-show logic.
- **Click-to-resize FAQ** — clicking a checklist or escalation row in module mode sets workspace focus to that item and asks the host to grow the FAQ bubble to ~60% of its parent split (idempotent — won't fight the user if FAQ is already ≥60%). Implemented via a small `findParentSplit` walker + `setSplitAt`.
- **PREVENT calculator** (`src/bubbles/prevent-calculator/index.tsx`) — live 10-year ASCVD risk computation with PREVENT-shape coefficients (constants hand-calibrated; verify-link to acc.org/PREVENT in the bubble footer; explicitly draft).
- **Print mode** (`src/shell/PrintView.tsx` + `@media print` rules in glass.css) — App-mounted hidden PrintView reads the focused module from `moduleFocusSignal('clinical-modules')` and renders a paginated, letter-size, 0.75in-margin layout. The bubble UI is hidden via `display: none !important;` on `.home`, `.workspace-shell`, `.bsp-workspace`, FAB, vault, attach-menu, and the home tile classes (`.home__perspective`, `.home__grid`, `.home__tile`). Triggered via Cmd+P or the new ⎙ button in the workspace FAB menu. Browser print-to-PDF gives provider-shareable handouts for free.
- **DOCX import / round-trip** (`src/lib/parseDocxHtml.ts` + `src/data/userModules.ts` + clinical-tools bubble) — vanilla's `parseDocxHtml` (originally at `~/meridian/index-rendered.html` lines 7282–7491) ported 1:1 to TypeScript. mammoth.js lazy-loads (~500 KB chunk) only when the user picks a file. Imported modules persist to `localStorage` as `meridian-os.userModules`, merge with seed modules in the lookup paths of clinical-module-checklist / escalations / FAQ / PrintView, and the workspace lands in module mode on the freshly-imported module immediately. Same DOCX format guide applies (`~/meridian/meridian-docx-format-guide.txt`).
- **DOCX export** (`src/lib/generateDocx.ts`) — round-trippable Word document mirroring `~/meridian/generate_docx.py` exactly. H1/H2/H3 structure, field markers (Label / Narrative / SmartPhrase / FAQ Title / Question), `>>>` instruction lines. A user can export → edit in Word → re-import via the clinical-tools "Import .docx" button to land back in the bubbles. Full round-trip ships now.
- **PPTX export** (`src/lib/generatePptx.ts`) — adapted from `~/meridian/generate_pptx.py`. Title slide, checklist slide (green stripe), escalation slide (red), one slide per FAQ topic (blue), references slide. One-way (presentations don't round-trip; preserves vanilla's design).
- **Both export buttons** live in the green checklist bubble's chrome (`[ .docx ]` and `[ .pptx ]`) and trigger Blob downloads via a synthesized `<a download>`. The libraries (docx, pptxgenjs, jszip, mammoth) all code-split into separate chunks; the initial bundle stays around 315 KB gzipped.
- **Brain task-manager bar** (BrainBubble redesign): default is a colored progress bar, hover shows a floating row, the wrench icon opens a sortable Name / Type / % task-manager view. Per-row contextual menu: Read deeply / Compress / Toggle editable / Dismiss. Compacted chat history is its own segment color.
- **`held` relationship replaces `reference`** — title + a sentence ("executive-assistant hold" semantics). Persisted `'reference'` is normalized at read time.
- **Filesystem v1** (`src/data/filesystem.ts`) — id-keyed Map persisted to localStorage. Bubbles can be views over `MeridianFile` records. Auto-naming on attach (`{TypeLabel} N`). Snapshot-on-trash for every non-placeholder bubble. Two markdowns seeded into trainer (`Patel scratch pad`, `Prior session memory`).
- **Vault redesign** — type tiles + three file sections (This workspace / Other workspaces / Global). ✏️ inline rename per file; tap → placeholder rehydrates from the file's instance.
- **Markdown primitive** (`src/bubbles/markdown/index.tsx`) — view + textarea modes; chrome edit/view toggle; persists to file when fileId is set.
- **Real LLM in chat** — `functions/api/chat.ts` POSTs to Anthropic Sonnet 4.6 with brain context built per relationship in `src/data/brainContext.ts`. Per-primitive content extractors (markdown body, blueprint tree, dossier, dropzone, etc.). Cache-controlled system blocks. Non-streaming. Requires `ANTHROPIC_API_KEY` Pages secret.
- **Markdown rendering** — `src/lib/md.ts` (uses `marked`); chat replies + md-bubble view mode render via `dangerouslySetInnerHTML` inside scoped `.markdown-body` styles.
- **Scrollbar fix** — pointerdown on a native scrollbar gutter no longer triggers the long-press lift.

### What's working end-to-end

**Home screen** — Mondrian-style tile grid hung "in space" with three-layer drop shadows + perspective tilt + radial-glow background. Tiles render miniature workspace previews from each workspace's persisted BSP layout (or JSON template if not yet entered), keyed by primitive type colors. Title beneath each painting; tile aspect 3:2 matches the workspace grid 12×8.

**Workspace transitions (fly-up / fly-back)** — Tap a tile → painting flies up from its rect to fullscreen via Web Animations API (480ms cubic-bezier). Bubbles crossfade from "tile mode" (full color block, content hidden) to "workspace mode" (5px top stripe + content) via the bubble `::before` pseudo-element animating height 100% → 5px. Workspace canvas color crossfades `--bg → #0f0f0f`. FAB fades in late (240ms delay). Reverse on dismiss. HomeScreen stays mounted behind WorkspaceShell so there's no jolt at unmount.

**BSP soap-bubble layout engine** — Workspace is a binary space partition. Sub-cell precision splitAt for continuous deformation. Splitter handles between adjacent bubbles; corner handles where two splitters meet. Min-size cascade with aggressive borderization (1×1 minimum; container queries hide content at small sizes). Drag handles use Pointer Events with `setPointerCapture`, touch-capable.

**Bubble lifecycle** — Long-press to lift (slot collapses, ghost follows finger). Drop modes:
- On any bubble's body: pointer-aware splitLeafInsert with alignment-snap to nearby splitter lines (1.5-cell threshold).
- On a chat bubble: relationship menu modal — Read deeply / Scan + summarize / Held only / Editable. Source bubble is auto-named (`{TypeLabel} N`) and filed if unnamed; the mini-bubble in the brain reflects the new name.
- On a placeholder bubble: replaceLeaf — placeholder is consumed, dropped bubble takes the slot exactly.
- On a screen-edge segment: split the adjacent bubble at that edge (segments are per-bubble that touches the edge in the pointer's perpendicular position).
- On the bottom-right FAB during lift: snapshot the bubble to the per-workspace filesystem, then remove from registry. Summon back from the vault later.
- Off any bubble: snap back via originalRoot.

**Double-tap a bubble → maximize.** Walks ancestor splits, pushes each splitAt to its constraint-bounded extreme. Other bubbles compress to mins. Double-tap again restores. Different bubble while one is maximized: restore first, then maximize new from original layout.

**Chat (llm-chat primitive)** — Fully controlled (messages live in `instance.props.messages`, no local state). Real Anthropic Sonnet 4.6 replies via `/api/chat`. Loading dots while in flight; AbortController cancels on a new send. Brain bubble shows context as a status bar (no chips); hover for floating row, wrench opens task-manager rows with sortable columns. Markdown rendering on assistant/system/user messages.

**Vault** — Tap a placeholder → modal with 8 type tiles at top *and* three file sections below (This workspace / Other workspaces / Global). Pick a type → placeholder becomes a fresh bubble of that type. Pick a file → placeholder rehydrates from the file's saved instance. ✏️ inline rename next to any file row.

**Filesystem** — `src/data/filesystem.ts`. Id-keyed `Map<string, MeridianFile>` persisted to localStorage. Each file holds a serialized `BubbleInstance` plus metadata (name, type, scope, workspaceId, timestamps). Files survive bubble dismissal — that's the dismiss-and-summon-back demo flow. Two trainer markdowns are seeded on first boot.

**Multi-function FAB** (bottom-right): tap = summon placeholder; long-press = expand menu (numbered save-state grid in 2-col rows with smooth vertical scroll, plus + / ← / ⟲ actions); during lift = trash target with warn pulse on hover; while expanded the FAB shows × and tap closes.

**Workspace ⟲ reset** — Resets *positions only* of JSON-template bubbles. Preserves chat history, brain attachments, all instance content. Drops summoned non-template bubbles (placeholders, vault picks).

**Chat-internal compact / clear** — `compact` replaces messages with a single ⤓-prefixed summary system message; `clear` replaces with greeting (or empty). Both leave brain mini-bubbles intact.

**Save-state slots** — Per-workspace numbered grid (2 cols, 3 visible rows, scroll for more). Tap empty slot → snapshot registry+root via JSON clone. Tap filled → restore. Right-click filled → delete.

**Persistence** — `localStorage` hydrates `persistentWorkspaceStates` and `savedLayouts` on module load; writes through helper functions (`setWorkspaceState`, `deleteWorkspaceState`, `setSavedLayouts`) on every change. Hard refresh restores everything.

**iOS specifics** — `visualViewport` listener writes height to `--vh` so containers shrink with the keyboard. `viewport` meta `user-scalable=no, maximum-scale=1.0, viewport-fit=cover` disables native zoom. `touch-action: none` on html/body with `pan-y` re-enabled on scrollable children. iOS long-press text selection suppressed via `-webkit-touch-callout: none` + `user-select: none`.

---

## Pending plan (priority order)

### Done (since 2026-04-26)
- ~~Real LLM in chat~~ — Sonnet 4.6 via `/api/chat`.
- ~~Filesystem v1~~ — auto-naming, snapshot-on-trash, vault file picker, file rename.
- ~~Markdown primitive~~ — view + edit modes, file persistence, marked rendering.
- ~~Brain task-manager redesign~~ — bar + wrench + sortable rows + per-row contextual menu.
- ~~Clinical Modules workspace v1 (gallery + module modes)~~ — topic bubbles, click-to-resize FAQ, PREVENT calculator, mode morph with persistent chat + OE.
- ~~Clinical Modules export/import triad~~ — print mode (PDF), DOCX upload (mammoth + parseDocxHtml port), DOCX/PPTX export wired to ported generators. Round-trip confirmed working by user.

### Next: Clinical Modules wow-factor wiring

The structural shell is shipped. The next layer is **functional wiring** to give the demo more pull:

1. **Module-aware LLM chat** — define tools (`open_module`, `focus_item`, `fill_calculator`, `generate_smartphrase`), update `/api/chat` to handle Sonnet's tool use, pre-seed the system prompt with the module manifest. Provider types "patient on rosuvastatin 40 still has LDL 130" → chat opens the lipid module, highlights the "not at goal" escalation, fills PREVENT, offers to draft a SmartPhrase. This is the highest-impact next move for a provider demo. Also unlocks the bubbles-as-programs harness adoption pattern.
2. **Mock patient context + cross-bubble harmony** — dummy patient panel; tap a patient → PREVENT auto-fills, relevant module opens, escalation/checklist rows highlight from their data; PREVENT result drives FAQ focus (borderline tier → CAC FAQ).
3. **Generate-the-note SmartPhrase output** — button on the checklist footer; produces a paste-ready Epic SmartPhrase block reflecting checks verified, calculator output, and escalation flags.
4. **Polish** — gallery↔module morph could fade in/out the entering/leaving bubbles instead of mounting/unmounting abruptly. Topic bubbles could grow on hover.

### Module browser scaling beyond ~10 modules

User raised this with dozens of modules in mind. Current 3-topic-bubble approach scales to maybe 15-20 modules; beyond that we need search + filter. Options on file: (A) library bubble in workspace, (B) Cmd+K-style modal browser, (C) module-gallery as workspace landing. User leaning toward something Mondrian-tile-grid-shaped. Defer until module count requires it.

### Toward storyboard completion (after Clinical Modules)
1. **Provider workspace populated.** Patient-info stack (cyclable, toggleable), modules-stack (clinical reference modules), openevidence-builder (toggleable inputs from patient + modules + chat → submit query), smartphrase-directory, chart-closure accumulator (care-gap accept/deny → list), care-gap-accumulator. Realistic dummy patient on schedule.
2. **QI Statin workspace.** Glidepath-chart with target line, email-threads-tracker, meeting-tracker, pending-actions list, SMART goal modal.
3. **Provider File workspace.** Drilldown view: provider-dossier expanded, Epic Signal data table (pajama time, throughput, chart-closure time), 1:1 cadence schedule, disciplinary record, complaint tracker.
4. **Admin Cockpit workspace.** Region/office/provider drilldown, HEDIS metric dashboard, email-threads (duplicatable per topic), meeting trackers per topic.
5. **Cross-workspace bubble drag** (the original wow #2). HydrationBus is a stub already. Lift a bubble, drag toward home strip, swipe to another workspace, drop into a chat. User noted this likely needs the home page to render multiple workspaces at intermediate size for live drag-and-drop — saved as future scope.
6. **Per-bubble mini-search.** Active-search button on every bubble. Type a primitive name → suggestion → attaches to the cell.

### Bubbles-as-programs unlocks (longer horizon)

After enough workspaces exist that we can see the patterns, land the bubble-manifest model: each primitive type can carry `prompts`, `tools`, `companions`, `harness`. Adoption joins the relationship menu as a 5th option when the source has harness. Atomic tool bubbles become a real archetype. See `~/.claude/projects/-home-noahs-Documents-meridiandrafts-Onboarding/memory/project_meridian_os_bubbles_as_programs.md`.

### Streaming + write-trail + scope chip
All deferred until after manifests + adoption. Write-trail in particular may not be needed once the brain shows adopted entries.

### Toward full v1 (after storyboard works)

These are vision items beyond v1 that the user has flagged as the long-term direction. Not for this milestone, but worth keeping in mind so v1 architecture doesn't foreclose them.

- **Workspace save states as multi-mode** (sleeping / active-meeting / working). User suggested per-project save states could mean different agentic configurations — sleeping monitors literature overnight, active-meeting tracks agenda live, working iterates documents.
- **Multicellular communication.** Multiple chat bubbles in different workspaces communicating, sharing context, jumping to find connections.
- **Integration mode.** Convert a working workspace into a hardened FDS by spawning real Claude Code on the backend to wire programmatic connectors. User-visible seam: workspace plastic → FDS solid; loses flexibility, gains reliability.
- **Heartbeats / agentic cron.** Workspaces wake up nightly to scan literature, update markdowns, surface drift.
- **Real connectors** — M365 (email, Teams, calendar via Power Automate), Epic (Signal data, in-basket, smart-sets), OpenEvidence query API, journal feeds. **All of these require enterprise.** Not for the public meridian-os demo; future on-prem deployment.

---

## Architecture

### 5-level hierarchy

1. **Home screen** — iPhone-style grid of workspace tiles (paintings) on a perspective-tilted plane.
2. **Workspace** — full-screen arrangement of bubbles. State persists across switches and refresh.
3. **Cell** — *deprecated for trainer; legacy code retained for future workspaces.* Originally LLM-chat as nucleus + organelles attached. Trainer dropped this in favor of peer bubbles after the user's feedback that chat should be its own bubble.
4. **Bubble (primitive)** — typed atomic UI unit. Resize/snap/cluster/attach via BSP. ~13 primitive types implemented.
5. **Mini-bubble** — content inside the brain bubble inside the chat, representing what the LLM has in context.

### Tangible bubbles invariant

Bubbles have **persistent identity** — the chat in Trainer is *that exact* chat (same history, same brain) when you return. Workspaces don't morph bubbles into other bubbles; transitions go *through home* (workspace shrinks to its tile, a different tile expands).

### Mondrian aesthetic

- Home tiles: black canvas, primary-color blocks (red / blue / yellow / off-white) with 1px black borders combining into 2px gridlines.
- Workspace bubbles: glass surface + 5px top stripe in the same `--type-color`.
- Single source of truth: `t-<type>` CSS classes set `--type-color`. Adding a primitive = one line in glass.css.

### Tech stack

- **Vite + Preact + TypeScript + `@preact/signals`** (decision in commit `8aa5b8e`; chosen over vanilla single-file because the resize/snap/morph mechanics + 20+ primitives needed types and HMR).
- **Cloudflare Pages** (static SPA). Pages Functions for any future backend (real LLM, integrations).
- **No backend yet** — chat is fully scripted; everything in localStorage.

### Key files

```
src/
  shell/
    HomeScreen.tsx          iPhone-style grid + tile previews
    WorkspaceShell.tsx      Animated wrapper; manages entering/idle/exiting phase
    BspWorkspace.tsx        Workspace renderer; 800+ lines; the orchestrator. Owns mode-aware layout for clinical-modules (GALLERY_LAYOUT, MODULE_LAYOUT_BASE, MODULE_LAYOUT_WITH_PREVENT) and the focus-signal subscription that rebuilds BSP on mode change.
    workspaceState.ts       Module-level persistence Maps + localStorage hydration
    PrintView.tsx           App-mounted hidden component; renders the focused module as paginated HTML for browser print.
  cell/                     Legacy; retained but unused by trainer
  bubbles/
    _base/StubBubble.tsx    Fallback for primitive types without real impl
    blueprint-tree/         Real
    follow-ups-rail/        Real
    generated-sessions-rail/ Real
    dropzone/               Real (visual mock; ingest unwired)
    provider-dossier/       Real
    placeholder/            Real
    llm-chat/               Real (fully controlled, brain integration, /api/chat)
    markdown/               Real (view + edit modes, file-backed persistence)
    clinical-module-checklist/   Real (green) — picker removed; "‹ modules" + .docx/.pptx export buttons in chrome
    clinical-module-escalations/ Real (red)
    clinical-module-faq/         Real (blue) — back-to-topics chevron; renders topic shortcuts in idle state
    clinical-module-shared/row.tsx  Shared row component (numbered/exclamation marker)
    clinical-topic-bubble/       Real — used by three primitive types (cv red, controlled purple, general teal). Lists modules in its topic; tap a module → focus.mode='module'.
    clinical-tools/              Real — DOCX import button (lazy-loads mammoth) + calculator list + recently-imported list
    openevidence-builder/        Real (UI shell; question type / topic / context / preview; send is a no-op pending real OE wiring + harness adoption)
    prevent-calculator/          Real — live 10-yr ASCVD risk; PREVENT-shape coefficients (draft, calibrated)
    index.ts                PRIMITIVE_REGISTRY — type → component
    labels.ts               PRIMITIVE_LABELS — defaultLabel per type
  cell/
    BrainBubble.tsx         Status-bar + sortable task-manager view; wrench toggle
  mechanics/
    bsp.ts                  BSP types + buildBSP / setSplitAt / removeLeaf /
                            splitLeafInsert / replaceLeaf / maximizeLeaf /
                            findCorners / splitRootInsert / findLargestLeaf
    DraggableBubble.tsx     Legacy wrapper; unused by BSP workspaces
    flip.ts, resize.ts,     Phase-0 helpers; partly subsumed by BSP
    snap.ts, attach.ts,
    drag.ts, search.ts
  data/
    home.json               Workspace grid config (6 tiles incl clinical-modules at [2,1])
    workspaces/trainer.json Trainer workspace config (Patel context)
    workspaces/clinical-modules.json  Clinical Modules workspace config (all bubbles defined; gallery placements in layoutHints; module-mode placements computed in BspWorkspace from constants)
    seed/patel-cohort.json  Dr. Patel's mid-onboarding state
    seed/clinical-modules.json  All 7 bundled modules (lipids, ckd, adhd, anemia, abd-pain, opiates, benzos), byte-identical to vanilla's modules/*.json
    demo-script.json        Stub
    seedResolver.ts         { "$seed": "key.path" } token expansion
    filesystem.ts           Emulated FS: id-keyed Map<MeridianFile> + localStorage
    brainContext.ts         Per-relationship + per-primitive content extractors
                            for the LLM system prompt
    moduleFocus.ts          Workspace-scoped { mode, moduleId, focusedItemId } signal; persists to localStorage
    userModules.ts          User-uploaded ModuleData[] signal; persists to localStorage; addUserModule auto-lands the workspace in module mode for the new module
  lib/
    md.ts                   marked-based markdown renderer; HTML out
    parseDocxHtml.ts        DOCX → ModuleData parser (1:1 port of vanilla parseDocxHtml)
    generateDocx.ts         ModuleData → DOCX (round-trippable Word document; mirrors vanilla's generate_docx.py)
    generatePptx.ts         ModuleData → PPTX (one-way; adapted from vanilla's generate_pptx.py)
  styles/
    tokens.css              CSS variables, palette, typography
    glass.css               All component styles (large file; well-commented)
    reset.css               Reset + body rules
  types.ts                  All shared TS interfaces
  main.tsx                  Boot, useVisualViewport hook, App

functions/
  api/
    chat.ts                 POST /api/chat — proxies to Anthropic Sonnet 4.6
                            with per-relationship brain blocks + cache control
public/
  _redirects                /* /index.html 200 (SPA fallback)
deploy.sh                   npm run build + wrangler pages deploy dist
```

### Data model (TS interfaces, in `src/types.ts`)

`WorkspaceConfig` declares cells + standalones + layoutHints (12×8 grid + per-id placements) + scripted hooks + seed sources. `BubbleInstance` carries id, type, title, props (free shape), resize states, optional attach to a cell, and an optional `fileId` linking to the filesystem. `CellConfig` has nucleus + brain + organelles (inline). `BSPRoot` wraps a recursive `BSPNode` (leaf or split). `MiniBubble` has optional `relationship: 'deep' | 'summary' | 'held' | 'edit'` (`reference` was renamed to `held`; old persisted state normalizes at read). `MeridianFile` (in `data/filesystem.ts`) holds a serialized `BubbleInstance` plus name / type / scope / workspaceId / timestamps.

### Persistence model

Two module-level Maps in `shell/workspaceState.ts`:
- `persistentWorkspaceStates: Map<workspaceId, { registry, root }>` — live state per workspace
- `savedLayouts: Map<workspaceId, SavedLayout[]>` — named save slots

Both hydrate from localStorage on module load; helpers (`setWorkspaceState`, `deleteWorkspaceState`, `setSavedLayouts`) write through to localStorage on every mutation. JSON-clone for snapshot isolation.

---

## Demo flow (what works today)

### Trainer workspace
1. Open https://meridian-os.pages.dev → Mondrian home grid, 6 paintings hung at depth.
2. Tap **Trainer** → flies up, color blocks crossfade to content. 7 populated bubbles arranged 12×8.
3. **Type in the chat** → real Sonnet 4.6 reply (loading dots while in flight). Brain bar grows with conversation length. Drop the **dossier** onto the chat → relationship menu → Scan + summarize → dossier disappears, summary mini-bubble in brain. Markdown in replies renders as headings/lists/code.
4. **Tap the wrench** in the brain → task-manager rows (Name / Type / %), sortable by column. Tap a row → contextual menu (Read deeply / Compress / Toggle editable / Dismiss).
5. **Long-press a bubble** to lift; drag onto another → that bubble splits at the pointer's edge with alignment-snap. Drag to FAB → snapshot saved to filesystem, bubble removed. Resummon from the vault's file section.
6. **Tap +** → placeholder. **Tap the placeholder** → vault modal: 8 type tiles + three file sections (This workspace / Other workspaces / Global). Pick a type → fresh bubble. Pick a file → placeholder rehydrates from the file. ✏️ to rename a file inline.
7. **Open the seeded `Patel scratch pad`** (markdown bubble) → defaults to edit mode, type, blur to save; reload restores. Toggle to view mode renders markdown. **Open `Prior session memory`** → opens in view mode with prose rendered.
8. **Inside chat header**: `compact` replaces messages with a real recap line; `clear` replaces with greeting.
9. **Refresh the page** → everything restores. Tile previews reflect the live layout.
10. **Dismiss** → painting flies back to its tile, FAB fades out early, no jolt on landing.

### Clinical Modules workspace
1. From home, tap **Clinical Modules** (🩹) → flies up to gallery mode. Three topic bubbles at top (Cardiometabolic red / Behavioral & Controlled Rx purple / General Internal Med teal), tools + chat + OE bubbles at bottom.
2. **Tap a module** in any topic bubble (e.g., "Lipid Management" inside Cardiometabolic) → workspace morphs to module mode. Topic + tools fade out; checklist + escalations + FAQ fade in. PREVENT calculator appears for the lipid module specifically (companion auto-show via the mode-aware layout). Chat and OE animate from their gallery positions to the module-mode positions.
3. **Tap a checklist row** → that row highlights, FAQ bubble switches to the matching FAQ, FAQ bubble auto-grows to ~60% of its parent split if it was smaller. Click the chevron in the FAQ chrome → returns to the topic-list idle view of FAQs.
4. **Tap an escalation row** → same behavior, red accent.
5. **Edit PREVENT inputs** → live recompute; risk tier color updates (Low green / Borderline-Intermediate amber / High red); footer banner links out to acc.org/PREVENT for verification.
6. **`.docx` button in checklist chrome** → downloads a Word doc structured to match the parser's expected format. Edit in Word, then…
7. **Back to gallery** via the "‹ modules" button → topic bubbles return; tools bubble shows.
8. **"Import .docx"** in tools bubble → file picker → select the edited DOCX (or any compliant DOCX from `~/meridian/templates/`). mammoth parses, parseDocxHtml builds a ModuleData, the workspace lands directly in module mode for the imported module. Imports also persist to localStorage and appear in the tools bubble's "Imports" list.
9. **`.pptx` button** → downloads a PowerPoint deck (title + checklist + escalation + per-FAQ + references slides).
10. **Cmd+P or FAB ⎙ button** → browser print dialog with a paginated PDF view of the focused module (letter size, 0.75in margins, color-coded green-zone / red escalation / blue FAQ headers). Save as PDF for sharing.

---

## Locked design decisions

- **Tangible bubbles, no morphing.** Workspace transitions go through home. Bubble identity persists.
- **Mondrian for tiles, glass-with-stripe for workspace bubbles.** One `--type-color` per primitive type drives both.
- **BSP layout, not free-floating.** Workspaces are tiled; "moving" a bubble means restructuring the tile.
- **Workspace ⟲ is layout-only.** Chat has its own compact/clear; workspace ⟲ does not touch chat content.
- **Single visual treatment for v1**, themable later. No theme switcher in v1.
- **No enterprise integrations in this build.** Real LLM is fair game (no PHI), but real Epic / M365 / OpenEvidence stays in the on-prem future.
- **Mode-aware workspace layouts (clinical-modules).** The clinical-modules workspace toggles between gallery and module modes via a focus signal; layouts are tables in `BspWorkspace.tsx`. Chat + OE persist across mode by keeping the same bubble id in both layouts. Other workspaces use the legacy single-layout-per-workspace path.
- **Module data is the source of truth, bubbles are pure renderers.** All module content lives in JSON (`src/data/seed/clinical-modules.json` for seeded; `userModulesSignal` for imports). Bubbles read the JSON via seed resolver and `userModulesSignal.value`; they never own state that isn't in JSON. Edit JSON, refresh, bubbles re-render. This invariant is what makes round-trip via DOCX (and any future format) cleanly possible.
- **DOCX is the round-trip format.** Word is the most familiar editor for clinical leadership. The DOCX export is structured to match the upload parser exactly so a user can export → edit in Word → upload → see in bubbles. PPTX is one-way (presentations don't round-trip). Markdown round-trip and in-app authoring are both possible future paths but deferred.

---

## Plan

The original implementation plan lives at `~/.claude/plans/hello-thank-you-for-federated-petal.md`. That document has the deeper architectural background and the original storyboard. This `CLAUDE.md` supersedes the plan where they differ — much of the post-Phase-1 work (Mondrian, soap-bubble physics, tangible bubbles, multi-function FAB, save states, double-tap maximize, fly-in/out crossfade) wasn't in the original plan but emerged from interactive design with the user.

When picking up work in a fresh conversation, read this `CLAUDE.md` first. The rest of the codebase is well-commented; named selectors and file paths above should orient quickly.

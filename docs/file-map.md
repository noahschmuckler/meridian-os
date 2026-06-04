# Meridian-OS — File map

Full `src/` + `functions/` + `public/` tree with per-file notes. Reference detail relocated out of `CLAUDE.md` to keep it lean; read this when navigating the codebase. Ownership tags ([Noah owns] / [Scott owns] / [Shared]) match the ownership table in `CLAUDE.md` → Two-user collaboration.

### Key files

```
src/
  apps/
    mentorship-tracker/
      MentorshipTrackerApp.tsx       Byte-identical port of ~/Downloads/remixed-fab2f713.tsx with // @ts-nocheck. React-style SPA (login → roster → provider profile). Re-copy on Scott iteration; do NOT edit body. [Scott owns]
    epic-quick-reference/
      EpicQuickReferenceApp.tsx      Byte-identical port of ~/Downloads/remixed-0de3d5eb.tsx with // @ts-nocheck. Self-serve Epic reference (34 entries / 7 categories). Re-copy on Scott iteration; do NOT edit body. [Scott owns]
    lab-quickreply/
      LabQuickReplyApp.tsx           Lab-result portal-message wording aid (Dr. Freiberg's workflow): looks → scheduled? → interval → composed message + sign-off + copy to MyChart. Serious results trigger a phone-call guardrail. Port of ~/incoming_noah/labmessenger.js (source had smart quotes / markdown fences / window.storage / Tailwind / lucide — ported clean to inline SVG + plain CSS + localStorage). Provider settings persist via meridian-os.labQuickReply.provider.v1.
      lab-quickreply.css             All styles scoped under .lab-quickreply (parchment + Georgia serif; emerald/amber/rose tone-coded "looks" cards; sticky bottom-pinned preview).
  shell/
    Launcher.tsx                     Top-level "meridian" screen + four floating top-left pills: BackToLauncherChevron (home grid → launcher), HomeViewTogglePill (focused/archive home view), BackToMondrianChevron (any workspace → home grid), ModuleBackChevron (clinical-modules module mode → gallery). Also exports useProximityReveal hook.
    MentorshipTrackerShell.tsx       Wraps MentorshipTrackerApp + the chevron. [Scott owns]
    EpicQuickReferenceShell.tsx      Wraps EpicQuickReferenceApp + chevron + back-to-tracker pill when returnTo is set. Owns ENTRY_IDS[] constant that MUST stay in sync with source TSX entries[] order. [Scott owns]
    LabQuickReplyShell.tsx           Wraps LabQuickReplyApp + the chevron (variant on-light against parchment).
    HomeScreen.tsx                   iPhone-style grid + tile previews
    WorkspaceShell.tsx               Animated wrapper; manages entering/idle/exiting phase
    BspWorkspace.tsx                 Workspace renderer; ~2000 lines; the orchestrator. Mode-aware layout for clinical-modules (GALLERY_LAYOUT, MODULE_LAYOUT_BASE, MODULE_LAYOUT_WITH_PREVENT) + focus-signal subscription that rebuilds BSP on mode change. Exposes spawnAdjacentBubble({ type, title, props?, nearBubbleId? }) for tool bubbles. Lift gating in onBubblePointerDown only fires inside .bubble__chrome or .placeholder. Subscribes to meridian:spawn-bubble CustomEvent. Each leaf carries data-bubble-id + --font-scale CSS variable.
    workspaceState.ts                Module-level persistence Maps + localStorage hydration
    PrintView.tsx                    App-mounted hidden component; renders the focused module as paginated HTML for browser print.
    SelectionMenu.tsx                App-mounted floating menu above any text selection inside a .bubble__body. Items: Copy / Select all / Cite / OE / Feedback. Cite + OE gated on having an active clinical module focused.
    GlossaryPopover.tsx              App-mounted popover above any clicked .glossary-term span. "Open glossary" spawns a glossary-browser bubble.
    CiteBlockPopover.tsx             App-mounted popover for "Cite this decision". Renders selected text as Decision and a numbered "Supported by" list.
    ConsultLinkHandler.tsx           App-mounted capture-phase document click listener. Catches clicks on .consult-link spans, dispatches meridian:spawn-bubble for a consult-builder.
    ConsultAutoSpawn.tsx             App-mounted. Auto-spawns consult-builder on first module entry. Idempotent per module id via meridian-os.consultBuilderShown localStorage.
    ContractAutoSpawn.tsx            App-mounted. Auto-spawns contract-builder on first entry to a controlled-substance module (module_class_map). Idempotent per module id via meridian-os.contractBuilderShown localStorage. The only way the builder surfaces in module mode (clinical-tools is gallery-only).
    FeedbackModal.tsx                App-mounted modal. Mailto-only feedback.
    FontSizeControls.tsx             Shared chrome control (A− / ↺ / A+).
  cell/                              Legacy; retained but unused by trainer
    BrainBubble.tsx                  Status-bar + sortable task-manager view; wrench toggle
  bubbles/
    _base/StubBubble.tsx             Fallback for primitive types without real impl
    blueprint-tree/                  Real
    follow-ups-rail/                 Real
    generated-sessions-rail/         Real
    dropzone/                        Real (visual mock; ingest unwired)
    provider-dossier/                Real
    placeholder/                     Real
    llm-chat/                        Real (fully controlled, brain integration, /api/chat)
    markdown/                        Real (view + edit modes, file-backed persistence)
    clinical-module-checklist/       Real (green) — .docx/.pptx export buttons in chrome
    clinical-module-escalations/     Real (red)
    clinical-module-faq/             Real (blue) — back-to-topics chevron
    clinical-module-shared/row.tsx   Shared row component
    clinical-topic-bubble/           Real — used by three primitive types (cv red, controlled purple, general teal)
    clinical-tools/                  Real — DOCX import + spawn-card list (Calculators / Tools / Imports / Consults sections)
    openevidence-builder/            Real (UI shell; send is a no-op pending OE wiring)
    prevent-calculator/              Real — live 10-yr ASCVD risk
    _calculators/                    Track 4a calculator family — shared.tsx + registry.ts + 5 calculator dirs (gad7, phq9, audit-c, ciwa-ar, cows)
    glossary-browser/                Real (slate) — runtime-spawn-only via meridian:spawn-bubble
    consult-builder/                 Real (purple) — Track 4b. Reads active module's consults[]. Catalog → walker → leaf (recommend with output template OR block).
    contract-builder/                Real (purple) — Track 4d. Class-driven CS prescribing-agreement assembler. Reads controlled-substances-contracts.json; inputs → auto-suggested risk tier (override) → assembled clauses + .CSAGREE-* SmartPhrase trigger. Surfaced via ContractAutoSpawn (auto-spawn on CS-module entry).
    smartphrase-selector/            Real (purple) — Track 4c. Lists active module's smartphrases[] grouped Ship-ready / Future; each expands to full phrase text with copy. Spawned from the green-zone "All SmartPhrases →" affordance / FAQ pill / clinical-tools card. No auto-spawn (avoids a 3rd auto-spawned bubble alongside consult + contract).
    index.ts                         PRIMITIVE_REGISTRY — type → component
    labels.ts                        PRIMITIVE_LABELS — defaultLabel per type
  mechanics/
    bsp.ts                           BSP types + buildBSP / setSplitAt / removeLeaf / splitLeafInsert / replaceLeaf / maximizeLeaf / findCorners / splitRootInsert / findLargestLeaf
    DraggableBubble.tsx              Legacy wrapper
    flip.ts, resize.ts, snap.ts, attach.ts, drag.ts, search.ts   Phase-0 helpers
  data/
    launcherState.ts                 launcherAppSignal + setLauncherApp; hydrates from meridian-os.launcherApp.v1
    home.json                        Workspace grid config
    workspaces/trainer.json          Trainer workspace config
    workspaces/clinical-modules.json Clinical Modules workspace config
    seed/patel-cohort.json           Dr. Patel's mid-onboarding state
    seed/clinical-modules.json       All 7 bundled modules. adhd + opiates + benzos at schema_version 1.3.0 (Simplified/Stratified Pass — two-tier first_layer_html + sub_questions[] + module-level smartphrases[] registry; opiates + benzos landed 2026-05-25, each 11 FAQ topics incl. a standalone §5-split topic: opiates-first-visit / benzos-taper-primer). Lipid at 1.3.0 (Simplification/Stratified Pass landed 2026-05-26 from a Claude-chat readability DOCX; 16 two-tier FAQ topics, 164 hand-re-injected inline [ref:slug] markers / 66-ref superset preserved, 8 smartphrases incl. 7 future-with-text — non-controlled-substance, no contract builder). ckd + anemia + abd-pain still at 1.0.0/1.0.1 (byte-identical to vanilla). [Noah owns]
    seed/glossary.json               Global glossary — 69 entries. [Noah owns]
    seed/controlled-substances-contracts.json   Track 4d clause library — v1.0.0, 5 sections / 36 clauses, NY/NJ text variants, declarative conditions, module_class_map. Source of truth for clause text (Section 6 versioning). [Noah owns]
    seed/mentorship-master-checklist.json   62-item curriculum JSON with epic_ref_ids deep-links. [Scott owns]
    demo-script.json                 Stub
    seedResolver.ts                  { "$seed": "key.path" } token expansion
    filesystem.ts                    Emulated FS: id-keyed Map<MeridianFile> + localStorage
    brainContext.ts                  Per-relationship + per-primitive content extractors
    moduleFocus.ts                   Workspace-scoped focus signal
    userModules.ts                   User-uploaded ModuleData[] signal
    feedbackSignal.ts                feedbackModalSignal + openFeedback / closeFeedback
    glossarySignal.ts                glossaryPopoverSignal + openGlossaryPopover / closeGlossaryPopover
    citeSignal.ts                    citePopoverSignal + openCitePopover / closeCitePopover
    bubbleFontScale.ts               Per-bubble font-scale persistence
    epicReferenceFocus.ts            epicReferenceFocusSignal { entryId, source, returnTo } for cross-app deep-links. [Scott owns]
  lib/
    md.ts                            marked-based markdown renderer
    parseDocxHtml.ts                 DOCX → ModuleData parser
    generateDocx.ts                  ModuleData → DOCX (round-trippable)
    generatePptx.ts                  ModuleData → PPTX (one-way)
    feedbackMailto.ts                Pure URL builder for mailto:
    oeQuery.ts                       buildOEPrefill for OE bubble pre-fill
    glossary.ts                      Glossary decorator (TreeWalker, every-occurrence, case-sensitive)
    citationGenerator.ts             extractCitations from selection range; formatPlain / formatMarkdown
    consultDecorator.ts              Track 4b — decorateConsultMentionsHtml wraps "{specialty} consult" / "consult to {specialty}" matches
    refMarkers.ts                    expandRefMarkers / getModuleRefNumberer / getCitedReferences / stripRefMarkers / normalizeReferences
  styles/
    tokens.css                       CSS variables, palette, typography
    glass.css                        All component styles (large file; well-commented)
    reset.css                        Reset + body rules
  types.ts                           All shared TS interfaces [Shared — coordinate]
  main.tsx                           Boot, useVisualViewport hook, App. App-level shell mounts for both Mentorship Tracker + Epic QR (display-toggled). [Shared — coordinate]

functions/
  api/
    chat.ts                          POST /api/chat — proxies to Anthropic Sonnet 4.6 [Shared]
public/
  _redirects                         /* /index.html 200 (SPA fallback)
deploy.sh                            Legacy manual deploy (obsolete since 2026-05-12 Cloudflare Git integration)
STATE.md                             Current state + history + pending — see workflow rule
```

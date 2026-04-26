# Meridian-OS — Claude Code Context

This is **meridian-os**, a workspace-based front-end for clinical / training / admin work. It's a sibling to (but architecturally distinct from) `~/GitHub_Repos/meridian-onboarding`. That repo is **frozen** as a working demo of the onboarding loop and must remain untouched. Meridian-os seeded from its content but rebuilt the architecture around a bubble/cell/workspace metaphor.

The user is **Dr. Noah Schmuckler**, MD, primary-care medical director at Optum. He is the product owner *and* author of this build. Treat him as an experienced product owner who reads code and reasons clearly about architecture — skip clinical primers, name Epic specifics precisely, frame tradeoffs.

---

## Status snapshot (last updated 2026-04-26)

- **Live:** https://meridian-os.pages.dev
- **Repo:** https://github.com/noahschmuckler/meridian-os (private)
- **Cloudflare Pages project:** `meridian-os`
- **Latest commit:** `aa33ba6` (split workspace ⟲ from chat reset; iOS native zoom suppressed)

The OS shell is **production-quality**. The Trainer workspace is fully populated. The other four workspaces are empty tiles awaiting content.

### What's working end-to-end

**Home screen** — Mondrian-style tile grid hung "in space" with three-layer drop shadows + perspective tilt + radial-glow background. Tiles render miniature workspace previews from each workspace's persisted BSP layout (or JSON template if not yet entered), keyed by primitive type colors. Title beneath each painting; tile aspect 3:2 matches the workspace grid 12×8.

**Workspace transitions (fly-up / fly-back)** — Tap a tile → painting flies up from its rect to fullscreen via Web Animations API (480ms cubic-bezier). Bubbles crossfade from "tile mode" (full color block, content hidden) to "workspace mode" (5px top stripe + content) via the bubble `::before` pseudo-element animating height 100% → 5px. Workspace canvas color crossfades `--bg → #0f0f0f`. FAB fades in late (240ms delay). Reverse on dismiss. HomeScreen stays mounted behind WorkspaceShell so there's no jolt at unmount.

**BSP soap-bubble layout engine** — Workspace is a binary space partition. Sub-cell precision splitAt for continuous deformation. Splitter handles between adjacent bubbles; corner handles where two splitters meet. Min-size cascade with aggressive borderization (1×1 minimum; container queries hide content at small sizes). Drag handles use Pointer Events with `setPointerCapture`, touch-capable.

**Bubble lifecycle** — Long-press to lift (slot collapses, ghost follows finger). Drop modes:
- On any bubble's body: pointer-aware splitLeafInsert with alignment-snap to nearby splitter lines (1.5-cell threshold).
- On a chat bubble: relationship menu modal — Read deeply / Scan + summarize / Reference only / Editable. Mini-bubble lands in the chat's brain.
- On a placeholder bubble: replaceLeaf — placeholder is consumed, dropped bubble takes the slot exactly.
- On a screen-edge segment: split the adjacent bubble at that edge (segments are per-bubble that touches the edge in the pointer's perpendicular position).
- On the bottom-right FAB during lift: trash (delete from registry).
- Off any bubble: snap back via originalRoot.

**Double-tap a bubble → maximize.** Walks ancestor splits, pushes each splitAt to its constraint-bounded extreme. Other bubbles compress to mins. Double-tap again restores. Different bubble while one is maximized: restore first, then maximize new from original layout.

**Chat (llm-chat primitive)** — Fully controlled (messages live in `instance.props.messages`, no local state). Type-anything → user bubble + 350-700ms-delayed Lorem ipsum assistant reply. Brain bubble shows context with horizontal-gradient fullness bar — chat history segment grows with conversation length; attached items add color-tinted segments per relationship type (📖 deep 25%, ✏️ edit 18%, 📝 summary 4%, 🔗 reference 1.5%). Overfilled bar gets warn-orange border. Click any mini-bubble to dismiss.

**Vault** — Tap a placeholder → modal of 8 bubble types (markdown, spreadsheet, email-thread, faq-block, blueprint-tree, dashboard-numbers, meeting-tracker, glidepath-chart). Pick → placeholder transforms in place to that type.

**Multi-function FAB** (bottom-right): tap = summon placeholder; long-press = expand menu (numbered save-state grid in 2-col rows with smooth vertical scroll, plus + / ← / ⟲ actions); during lift = trash target with warn pulse on hover; while expanded the FAB shows × and tap closes.

**Workspace ⟲ reset** — Resets *positions only* of JSON-template bubbles. Preserves chat history, brain attachments, all instance content. Drops summoned non-template bubbles (placeholders, vault picks).

**Chat-internal compact / clear** — `compact` replaces messages with a single ⤓-prefixed summary system message; `clear` replaces with greeting (or empty). Both leave brain mini-bubbles intact.

**Save-state slots** — Per-workspace numbered grid (2 cols, 3 visible rows, scroll for more). Tap empty slot → snapshot registry+root via JSON clone. Tap filled → restore. Right-click filled → delete.

**Persistence** — `localStorage` hydrates `persistentWorkspaceStates` and `savedLayouts` on module load; writes through helper functions (`setWorkspaceState`, `deleteWorkspaceState`, `setSavedLayouts`) on every change. Hard refresh restores everything.

**iOS specifics** — `visualViewport` listener writes height to `--vh` so containers shrink with the keyboard. `viewport` meta `user-scalable=no, maximum-scale=1.0, viewport-fit=cover` disables native zoom. `touch-action: none` on html/body with `pan-y` re-enabled on scrollable children. iOS long-press text selection suppressed via `-webkit-touch-callout: none` + `user-select: none`.

---

## Pending plan (priority order)

### Toward storyboard completion (the original wow flow)

The user wants this as the **near-term target** — get the full storyboard from the plan file working, then circle back for production polish.

1. **Real LLM behavior in chat** (highest leverage). Cloudflare Pages Function at `/api/chat` proxies to Anthropic with attached brain items as system-prompt context. Replaces `loremReply()`. Chat becomes a project-scoped assistant — drop the blueprint, ask "what did Patel miss?", get a real reply citing LOS and HCC. The hard gesture (drop-on-chat → relationship menu → brain mini-bubble) is already built; this makes it valuable, not just visual.
   - **No enterprise restrictions** — meridian-os is hosted outside the enterprise environment. Real Anthropic API is fine **as long as data is dummy** (the seeded Patel cohort, the QI Statin fake metrics, etc.). No real PHI.
   - Pattern is established in meridian-onboarding (`functions/api/onboarding/ingest.js`). Same structure here.
2. **Provider workspace populated.** Patient-info stack (cyclable, toggleable), modules-stack (clinical reference modules), openevidence-builder (toggleable inputs from patient + modules + chat → submit query), smartphrase-directory, chart-closure accumulator (care-gap accept/deny → list), care-gap-accumulator. Realistic dummy patient on schedule. Once two workspaces are populated the OS reads as a *system*.
3. **QI Statin workspace.** Glidepath-chart with target line, email-threads-tracker, meeting-tracker, pending-actions list, SMART goal modal. Dummy QI initiative metrics + email thread + meeting summaries.
4. **Provider File workspace.** Drilldown view: provider-dossier expanded, Epic Signal data table (pajama time, throughput, chart-closure time), 1:1 cadence schedule, disciplinary record, complaint tracker. Dummy struggling-provider data.
5. **Admin Cockpit workspace.** Region/office/provider drilldown, HEDIS metric dashboard, email-threads (duplicatable per topic), meeting trackers per topic.
6. **Cross-workspace bubble drag** (the original wow #2). HydrationBus is a stub already. Lift a bubble, drag toward home strip, swipe to another workspace, drop into a chat — that workspace's brain hydrates with the bubble's content, scripted (or real LLM) response references it.
7. **Per-bubble mini-search.** Active-search button on every bubble (currently only FAB summons). Type a primitive name → suggestion → attaches to the cell.

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
    BspWorkspace.tsx        Workspace renderer; 600+ lines; the orchestrator
    workspaceState.ts       Module-level persistence Maps + localStorage hydration
  cell/                     Legacy; retained but unused by trainer
  bubbles/
    _base/StubBubble.tsx    Fallback for primitive types without real impl
    blueprint-tree/         Real
    follow-ups-rail/        Real
    generated-sessions-rail/ Real
    dropzone/               Real (visual mock; ingest unwired)
    provider-dossier/       Real
    placeholder/            Real
    llm-chat/               Real (fully controlled, brain integration)
    index.ts                PRIMITIVE_REGISTRY — type → component
  mechanics/
    bsp.ts                  BSP types + buildBSP / setSplitAt / removeLeaf /
                            splitLeafInsert / replaceLeaf / maximizeLeaf /
                            findCorners / splitRootInsert / findLargestLeaf
    DraggableBubble.tsx     Legacy wrapper; unused by BSP workspaces
    flip.ts, resize.ts,     Phase-0 helpers; partly subsumed by BSP
    snap.ts, attach.ts,
    drag.ts, search.ts
  data/
    home.json               Workspace grid config
    workspaces/trainer.json The only populated workspace
    seed/patel-cohort.json  Dr. Patel's mid-onboarding state
    demo-script.json        Stub
    seedResolver.ts         { "$seed": "key.path" } token expansion
  styles/
    tokens.css              CSS variables, palette, typography
    glass.css               All component styles (large file; well-commented)
    reset.css               Reset + body rules
  types.ts                  All shared TS interfaces
  main.tsx                  Boot, useVisualViewport hook, App

functions/                  (none yet — Cloudflare Pages Functions live here when added)
public/
  _redirects                /* /index.html 200 (SPA fallback)
deploy.sh                   npm run build + wrangler pages deploy dist
```

### Data model (TS interfaces, in `src/types.ts`)

`WorkspaceConfig` declares cells + standalones + layoutHints (12×8 grid + per-id placements) + scripted hooks + seed sources. `BubbleInstance` carries id, type, title, props (free shape), resize states, optional attach to a cell. `CellConfig` has nucleus + brain + organelles (inline). `BSPRoot` wraps a recursive `BSPNode` (leaf or split). `MiniBubble` has optional `relationship: 'deep' | 'summary' | 'reference' | 'edit'`.

### Persistence model

Two module-level Maps in `shell/workspaceState.ts`:
- `persistentWorkspaceStates: Map<workspaceId, { registry, root }>` — live state per workspace
- `savedLayouts: Map<workspaceId, SavedLayout[]>` — named save slots

Both hydrate from localStorage on module load; helpers (`setWorkspaceState`, `deleteWorkspaceState`, `setSavedLayouts`) write through to localStorage on every mutation. JSON-clone for snapshot isolation.

---

## Demo flow (what works today)

1. Open https://meridian-os.pages.dev → Mondrian home grid, 5 paintings hung at depth.
2. Tap **Trainer** → flies up, color blocks crossfade to content. 7 populated bubbles arranged 12×8.
3. **Type in the chat** — Lorem ipsum reply, brain history bar grows. Drop the **dossier** onto the chat → relationship menu → 📝 Summary → dossier disappears, summary mini-bubble in brain.
4. **Resize** by dragging splitter walls or corner handles. **Double-tap** any bubble to maximize, double-tap again to restore.
5. **Long-press a bubble** to lift; drag onto another → that bubble splits at the pointer's edge with alignment-snap. Drag near a screen edge → split the adjacent bubble at that segment. Drag to the bottom-right FAB → trash.
6. **Tap +** to summon a placeholder. **Tap the placeholder** → vault modal → pick markdown / spreadsheet / etc. → placeholder transforms.
7. **Long-press FAB** → menu: ⟲ resets layout (preserves chat); ← flies back home; + summons; numbered save slots in vertical pairs (tap empty to save, tap filled to load).
8. **Inside chat header**: `compact` replaces messages with a summary; `clear` replaces with greeting. Brain weight responds.
9. **Refresh the page** → everything restores. Tile previews reflect the live layout.
10. **Dismiss** → painting flies back to its tile, FAB fades out early, no jolt on landing.

---

## Locked design decisions

- **Tangible bubbles, no morphing.** Workspace transitions go through home. Bubble identity persists.
- **Mondrian for tiles, glass-with-stripe for workspace bubbles.** One `--type-color` per primitive type drives both.
- **BSP layout, not free-floating.** Workspaces are tiled; "moving" a bubble means restructuring the tile.
- **Workspace ⟲ is layout-only.** Chat has its own compact/clear; workspace ⟲ does not touch chat content.
- **Single visual treatment for v1**, themable later. No theme switcher in v1.
- **No enterprise integrations in this build.** Real LLM is fair game (no PHI), but real Epic / M365 / OpenEvidence stays in the on-prem future.

---

## Plan

The original implementation plan lives at `~/.claude/plans/hello-thank-you-for-federated-petal.md`. That document has the deeper architectural background and the original storyboard. This `CLAUDE.md` supersedes the plan where they differ — much of the post-Phase-1 work (Mondrian, soap-bubble physics, tangible bubbles, multi-function FAB, save states, double-tap maximize, fly-in/out crossfade) wasn't in the original plan but emerged from interactive design with the user.

When picking up work in a fresh conversation, read this `CLAUDE.md` first. The rest of the codebase is well-commented; named selectors and file paths above should orient quickly.

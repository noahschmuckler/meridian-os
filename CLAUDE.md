# Meridian-OS — Claude Code Context

This is **meridian-os**, a workspace-based front-end for clinical / training / admin work. It's a sibling to (but architecturally distinct from) `~/GitHub_Repos/meridian-onboarding`. That repo is **frozen** as a working demo of the onboarding loop and must remain untouched. Meridian-os seeded from its content but rebuilt the architecture around a bubble/cell/workspace metaphor.

**Two contributors work on this repo, each via their own Claude Code install:**
- **Dr. Noah Schmuckler**, MD — primary-care medical director at Optum, product owner + author. Treat him as an experienced product owner who reads code and reasons clearly about architecture — skip clinical primers, name Epic specifics precisely, frame tradeoffs. Owns **clinical modules / shell / bubble primitives / OS architecture**.
- **Scott Freiberg** — collaborator. Owns **mentorship-tracker SPA / Epic Quick Reference SPA / master-checklist JSON / onboarding-stack deep-link plumbing**.

See "Two-user collaboration" section below for coordination conventions.

---

## Workflow rule (top priority — supersedes all other project guidance)

**At the end of every processing session — before yielding to the user with a final message that would start the 5-minute prompt-cache idle timer — update CLAUDE.md and/or STATE.md to reflect the current state.**

**Why:** Users' working pattern is to `/clear` if they don't reply within 5 minutes, because by then the conversation has fallen out of the prompt cache and rehydrating prior turns would be expensive. When that happens, the next turn rebuilds context from CLAUDE.md + STATE.md + memory + plan/verification/analysis files alone — so those files must contain everything a fresh session needs to pick up the work without re-reading the conversation transcript.

**Where to put updates:**
- **STATE.md** — current in-flight work, status snapshot bumps, resume recipes, new shipped milestones, pending-plan changes. The vast majority of end-of-turn updates land here.
- **CLAUDE.md** (this file) — only when a *convention*, *rule*, *locked design decision*, or *new section in the file map* changes. Add to "Inter-instance messages" if leaving a note for the other contributor's Claude instance.

**What "current state" means in practice:**
- **STATE.md status snapshot** — bump the latest-commit pointer; reflect any new Phase / Bundle / Track that just landed; add or update the bullet that names the current in-flight effort with its resume recipe.
- **Resume recipes** — if a Bundle/Phase/Track is mid-flight, the relevant STATE.md subsection should contain a self-contained "after `/clear`, do these steps" recipe pointing at canonical files (plan, verification doc, analysis doc) by absolute path.
- **CLAUDE.md locked design decisions** — if a decision was made this turn that should outlive the conversation, add it.
- **CLAUDE.md inter-instance messages** — if leaving a note for the other contributor's Claude, prepend to that section.

**What it does NOT mean:** narrating every tool call, dumping conversation transcripts, duplicating content already in plan/verification/analysis files (cite those by path instead), or rewriting unchanged subsections. Keep both files dense + informational, not chatty. Paths over paragraphs.

**Exception:** if the turn is purely Q&A with no state change (no commits, no file edits, no new decisions, nothing in flight that wasn't already documented), no update is needed — but err on the side of updating when in doubt.

**This rule supersedes everything below it in this file.** If any other CLAUDE.md instruction conflicts with the workflow rule, the workflow rule wins.

---

## Two-user collaboration

Both Noah and Scott have their own Claude Code installs pointed at this repo. They work in parallel on the same `main` branch, each via feature branches with PR-to-main + 1 approval + squash-merge + auto-deploy. Conventions:

**Ownership (verbal, not enforced by CODEOWNERS):**
- **Scott owns:** `src/apps/mentorship-tracker/`, `src/apps/epic-quick-reference/`, `src/shell/MentorshipTrackerShell.tsx`, `src/shell/EpicQuickReferenceShell.tsx`, `src/data/seed/mentorship-master-checklist.json`, `src/data/epicReferenceFocus.ts`, and the onboarding-stack deep-link plumbing in `main.tsx`.
- **Noah owns:** everything else — clinical modules (`src/data/seed/clinical-modules.json` + `verification/`), shell (`BspWorkspace.tsx`, `Launcher.tsx`, `HomeScreen.tsx`), bubble primitives (`src/bubbles/`), bubble mechanics (`src/mechanics/`), tooling (`src/lib/`), styling (`src/styles/`).
- **Shared (coordinate before touching):** `CLAUDE.md`, `STATE.md`, `package.json`, `vite.config.ts`, `tsconfig.*`, `functions/api/`, `_redirects`, `deploy.sh`, `src/types.ts`, `src/main.tsx`, `src/data/launcherState.ts`.

**Cross-boundary changes require coordination before commit.** If your Claude instance needs to change something outside its owner's territory, either: (a) prompt the user to verbally coordinate with the other contributor first; or (b) leave a note in "Inter-instance messages" describing what you want to do and why, then wait for acknowledgment before proceeding.

**Conflict-prone files to watch:**
- `src/data/seed/clinical-modules.json` — Noah edits frequently for module rewrites. If Scott ever needs to touch (e.g., for a new field referenced by a master-checklist entry), coordinate.
- `CLAUDE.md` + `STATE.md` — both Claude instances update at end-of-turn. Append-only sections (like Inter-instance messages) reduce conflicts; major rewrites should be coordinated.
- `src/main.tsx` — App-level mount points for both shells live here; either side adding a new App-mounted component should announce.
- `src/types.ts` — schema interfaces shared across modules + apps; either side bumping a type should announce.

**Conflict resolution.** If you (a Claude instance) hit a merge conflict on a PR, resolve only your own territory's lines. For shared files, surface the conflict to your user and ask them to coordinate with the other contributor before resolving.

---

## Inter-instance messages

Append-only log for Claude instances to leave each other notes — e.g., "I'm planning to touch X next week, hold off on Y", "I'm done with Z, you can pick it up", "I noticed an issue in your territory, FYI". Newest at top. Each entry: date + from + to + message. Trim entries after they're acted on or older than ~1 month.

**Format:**
```
- YYYY-MM-DD [from-instance → to-instance]: message
```

**Log:**

- 2026-05-22 [Noah's instance → Scott's instance]: **PR #9 (Dashboard) merged to main today via admin override.** This is the same plum→amber 📊 Dashboard app the previous note described, plus three follow-up commits that added: per-HEDIS-measure drill-in with glidepath + sub-cohort tables, cross-measure non-compliance cards, NP-AWV 5th stat card, hard-stop→clinical-module navigation with a return chevron, query builder with select-all per segment + clipboard copy, and an embedded PREVENT calculator that shares a signal with the lipid-module bubble (bidirectional carryover). Full milestone entry under "Dashboard app — 6-tile provider dashboard with per-patient drill-in" in `STATE.md`. **Heads-up — your open PR #10 (mentor curriculum) will have a `STATE.md` merge conflict against this merge.** Per the 2026-05-13 inter-instance convention, when you rebase / resolve: take main's `STATE.md` verbatim and re-add only your PR-#10-specific content alongside the existing entries — do NOT discard the Dashboard / Briefing entries. **Your PR #7 (MD touchpoint questionnaire) is unaffected** — it only touches `MentorshipTrackerApp.tsx`, no overlap with my changes. Also note: `src/bubbles/prevent-calculator/index.tsx` was refactored to read from the new shared `preventInputsSignal` in `src/data/preventState.ts` — the bubble's external behavior is identical (same math, same UI), but if you ever read or modify the file, it now imports its state from that signal instead of `useState`. The signal pattern is the locked precedent for any future cross-app calculator sharing.

- 2026-05-22 [Noah's instance → Scott's instance]: New launcher app open in PR — **Dashboard** (📊, plum→amber gradient) sits to the right of Briefing on the home screen. Provider-facing 6-tile dashboard: 5 colorful blocks for HEDIS / AWV / wRVU / Epic Performance Goals / VBC+HCC (sourced from `~/Downloads/meridian-dashboard.jsx`) plus a 6th teal "Patients Tomorrow" tile. Clicking any tile expands it to fill the content area; clicking the patients tile reveals a 5-row roster (the meridian-onboarding `demoPatients` set) with major-opportunity chips; clicking a patient opens a full-bleed detail view in Briefing visual language (Hard Stops banner, Problem List / Vitals / Labs / Medications grid, Opportunities cards with smartphrase/code styling). Heads-up for your territory: shared files touched are `src/data/launcherState.ts` (`LauncherApp` union + hydrate gained `'dashboard'`), `src/main.tsx` (new conditional shell mount after the briefing branch), and `src/styles/glass.css` (added `.launcher__app-icon--dashboard` gradient). All additive — no rename or restructure. The new files (`src/apps/dashboard/{DashboardApp.tsx,dashboard.css}`, `src/shell/DashboardShell.tsx`, `src/data/seed/dashboard-cohort.json`) are entirely in my territory. Visual language reuses Briefing's `--crh-*` palette verbatim — extending or remixing those tokens would touch both apps, ping me first if you need to.

- 2026-05-22 [Noah's instance → Scott's instance]: New launcher app shipped — **Briefing** (📅, navy→teal gradient) sits to the right of Epic Quick Reference. It's a from-scratch Preact/TSX port of a self-contained HTML POC (`~/Downloads/meridian-briefing.html`, not committed) that Noah handed in: Crystal Run "Provider Briefing" page with masthead, left advisory-bubble column, top event-bubble row, expandable Active Initiatives table, landscape/portrait toggle, print button. Heads-up for your territory: this introduces a new ambient `.bubble` CSS rule, but it's strictly scoped under `.briefing-app` (e.g., `.briefing-app .bubble { ... }`) so no collision with meridian-os's first-class "bubble" primitives in `src/bubbles/`. New files: `src/apps/briefing/{BriefingApp.tsx,briefing.css}` and `src/shell/BriefingShell.tsx`. Routing wired in `src/main.tsx`; type extended in `src/data/launcherState.ts`; launcher button + icon variant in `src/shell/Launcher.tsx` + `src/styles/glass.css`. Pattern mirrors Mentorship Tracker / Epic QR shell wiring exactly — if you ever want to add another launcher app, those three files are the touchpoint template.

- 2026-05-21 [Noah's instance → Scott's instance]: Your session today flagged two deploy issues (preview URL stale, production missing a recent upload). Both have causes worth recording here so the next session has the facts. **Branch state on the remote** (verified via `git fetch`): `claude/add-note-removal-feature-x9kR6` is forked from `b06be73` (pre-PR #4) and 9 commits ahead of main. Five of those commits (`976aef6` note-removal, `19fca14` mentor score-trend, `0c1d595` history-stack back, `0b3705a` Go Back pill, `4d89398` STATE.md bump) are conceptually already on main — Noah grabbed your branch on 2026-05-18, rebased onto post-PR#4 main as `note-removal-rebase`, and squash-merged via PR #5 (8e0d67b). Two more (`1172563` SVG score chart + `cdf1034` revert) cancel out. The real new work is `3d7c640` "MD Questionnaire 12-phase replacement" (+89/−16 in `MentorshipTrackerApp.tsx`); `0356660` updates STATE.md but will conflict with PR #6's cleanup. **Second branch on the remote** you may not have noticed: `claude/session-declined-aCFoi` (HEAD `7fa3adc`) — single commit "replace Medical Director Touchpoint questions" off *current* main, +107/−15. Same topic as `3d7c640` but **not identical** (commit message says 13 phases vs 12, different CII handling, different anchor labels). Looks like a second, fresher take on the same work. **Diagnosis of your two complaints:** (1) Preview URL "stale" → the branch is pre-PR#4; the preview is faithfully building the branch tree, which genuinely lacks PR #4 (director-view metric cards + tab nav) and PR #6 (STATE/CLAUDE cleanup). Rebase/merge main into the branch and the preview will catch up. (2) Production URL missing upload → production (`meridian-os.pages.dev`) only redeploys on push to `main`. Branch pushes go to the per-branch preview URL only. The MD Questionnaire change is on your branch, not on main, so production correctly doesn't show it — it'll appear on production when the PR merges. **Recommended next steps (you and Scott decide which path):** diff the two branches' MD Questionnaire deltas and pick the cleaner basis (or merge them). If `session-declined-aCFoi` is the canonical version, open the PR straight from it — single commit off current main = the cleanest possible diff and no rebase needed. If the older branch is canonical, rebase it onto main (which drops the already-merged 5 commits and the SVG no-op pair automatically since they're empty-tree-after-rebase or revert-pair), resolve STATE.md / CLAUDE.md conflicts in favor of main per the 2026-05-18 convention, and open the PR. Either way, delete the abandoned branch when done. Don't bring back the STATE.md "pending Mentorship Tracker UX branch" bullet — that's already absorbed into Shipped milestones via PR #6.

- 2026-05-18 [Noah's instance → Scott's instance]: PRs #4 and #5 both merged today via admin override. **PR #4** ("Merge metric cards + tab nav…") had an 815-line stale `CLAUDE.md` diff because the branch was based on pre-PR#1 main (before the CLAUDE.md/STATE.md split). Resolution per the 2026-05-13 convention below: discarded PR#4's `CLAUDE.md` verbatim, kept main's. The two real conflicts in `MentorshipTrackerApp.tsx` (metric-card render block + CII stress-test seed) were taken from PR#4 — the OM-questionnaire surface from PR #2 auto-merged cleanly because PR#4's first two commits were the same content. **PR #5** = the `claude/add-note-removal-feature-x9kR6` branch you'd opened, rebased onto post-PR#4 main as `note-removal-rebase` and merged via a fresh PR; rebase was clean. Both feature surfaces now live; details under "Shipped milestones" in STATE.md. **Going forward (reinforcing the 2026-05-13 note):** when shipping features in your territory, please don't touch the CLAUDE.md "Status snapshot" / session-log areas — that lives in STATE.md now. CLAUDE.md edits should be limited to: (a) new locked decisions/conventions worth outliving the conversation, or (b) inter-instance messages here. Your `STATE.md` "pending Mentorship Tracker UX branch" bullet in the note-removal branch was the right pattern — it lived briefly in `Current state`, then got absorbed into `Shipped milestones` on this cleanup pass.

- 2026-05-13 [Noah's instance → Scott's instance]: PR #2 (OM track questionnaire) merged via admin override at 22:30 UTC — no review, because no Cloudflare preview URL ever posted to the PR and the fastest path to a viewable build was main. **Root cause:** branch was pushed 21:08 UTC, PR opened 22:27 UTC — 80 minutes later. The Cloudflare bot only comments a preview URL on a PR that exists when the build completes; by the time PR #2 opened the build was long done and stale, so no comment fired (the deploy itself succeeded — check the Cloudflare Pages status check on the PR for the dashboard link, but a `<sha-prefix>.meridian-os.pages.dev` URL would have worked). **Workflow recipe added to "Cloudflare Pages Git integration" section above:** `gh pr create --draft` BEFORE pushing real commits, or push a follow-up commit AFTER the PR opens. Also: Scott's CLAUDE.md edit in that PR (added an "OM track shipped" bullet + renamed "Latest commit" → "Latest commit on main") landed on the pre-split CLAUDE.md; PR #1 merged the new split so that bullet has been relocated to STATE.md's "Shipped milestones" as the new top entry ("OM track — structured questionnaire (2026-05-13, Scott, PR #2)"). Going forward, recent-work history belongs in STATE.md; CLAUDE.md only changes when a convention or locked design decision shifts. No action needed from you — flagging so the next session knows where this content went.

- 2026-05-12 [Noah's instance → Scott's instance]: Welcome to the repo. Read CLAUDE.md (this file) + STATE.md end-to-end before first work. Ownership convention is in "Two-user collaboration" above — your territory is mentorship tracker / Epic QR / master-checklist; my territory is clinical modules / shell / primitives. Git workflow is GitHub Flow with branch protection (PRs to main, 1 approval, squash-merge, auto-delete branch, auto-deploy via Cloudflare Pages Git integration). One open question for you to ask Noah: the "Onboarding-stack v1 ON HOLD pending v2" note in STATE.md was created when neither of us was touching that area; now that you're active there, that hold's premise has changed. Noah needs to decide whether to lift / narrow / coordinate per-item — flag at the start of your first session if it isn't already resolved.

---

## Git workflow + deployment

**Branch protection on `main`** (set 2026-05-12): PRs required, 1 approval, squash-only merges, auto-delete branch on merge, force-push + branch-deletion disabled, conversation resolution required before merge. Admins NOT enforced — Noah can self-merge in emergencies via the GitHub web UI's "merge without review" override, but that's a lever, not the default path.

**Day-to-day flow:**
```bash
git checkout -b <yourname>/<short-description>
# work...
git push -u origin <yourname>/<short-description>
gh pr create --title "..." --body "..."
# other contributor reviews + approves + squash-merges
# branch auto-deletes; Cloudflare auto-deploys main to meridian-os.pages.dev
```

**Cloudflare Pages Git integration** (set 2026-05-12): every push to `main` triggers a build + deploy to `meridian-os.pages.dev`. Every push to any non-`main` branch triggers a preview build at `<sha-prefix>.meridian-os.pages.dev`. Build config: `npm run build` → `dist`, `NODE_VERSION=20.20.2`. Env vars in both Production and Preview scopes: `NODE_VERSION`, `ANTHROPIC_API_KEY`.

**Cloudflare preview-URL gotcha — open the PR before / during the push.** The Cloudflare bot only comments a preview URL on a PR if the PR exists *when the build completes*. If you push a branch and then wait minutes-to-hours before opening the PR, the build finishes against a branch with no open PR and the bot has nothing to attach to — the PR opens with no preview link even though the preview deploy succeeded. (Happened on PR #2 / 2026-05-13: branch pushed 21:08 UTC, PR opened 22:27 UTC, no bot comment.) **Recipe:** create the branch → `gh pr create --draft` (or regular) **before** pushing real commits, OR push an empty/no-op follow-up commit after the PR opens to re-trigger the build with the PR in scope. The preview URL pattern is `<sha-prefix>.meridian-os.pages.dev` — if the bot doesn't comment, you can construct it from `git rev-parse --short HEAD` (8-char prefix) and hit it directly while the build is fresh.

**`deploy.sh` is now a manual fallback** — kept in tree but obsolete for normal use. Prefer `git push` + Cloudflare auto-deploy. If you must use `deploy.sh`, the project is now Git-connected; manual deploys land alongside Git-driven deploys without breaking anything, but the next push to main will overwrite.

**Local development:**
```bash
npm install
npm run dev    # Vite dev server on localhost:5173 — HMR for frontend
```
For local Pages Functions testing (`/api/chat`): `npx wrangler pages dev dist` after `npm run build`, with `.dev.vars` containing `ANTHROPIC_API_KEY=...` for the chat endpoint.

---

## Project state

Current state, in-flight work, shipped milestones, and pending roadmap live in **[STATE.md](STATE.md)** at the repo root. **Read STATE.md before starting any work that isn't a one-line change** — it has the resume recipes, the recent-work history, and the pending-plan ordering.

Quick links to canonical artifacts:
- **Plans:** `~/.claude/plans/` — implementation plans + scoping docs
- **Verification:** `verification/{adhd,opiates,benzos,lipids}.md` — module rewrite tracker rows
- **Analyses:** `analysis/` — cross-artifact coverage analyses (master-checklist vs tracker, Epic QR vs onboarding stack, etc.)
- **Frozen sibling:** `~/GitHub_Repos/meridian-server/` — historical seed (don't propagate rewrites back)
- **v2 working tree:** `~/GitHub_Repos/meridian-os-v2` — SQL-backed fork in progress (separate plan, separate scope)

---

## Architecture

### 6-level hierarchy

0. **Launcher** — top-level "meridian" screen with iOS-style app icons. Cold boot lands here. Four apps today: **Mondrian GUI**, **Mentorship Tracker**, **Epic Quick Reference**, **Briefing**. Selection persists across refresh. Future Scott-artifact apps that don't fit the bubble metaphor land here as additional icons.
1. **Home screen** — iPhone-style grid of workspace tiles (paintings) on a perspective-tilted plane. Reachable from the launcher's Mondrian GUI icon.
2. **Workspace** — full-screen arrangement of bubbles. State persists across switches and refresh.
3. **Cell** — *deprecated for trainer; legacy code retained for future workspaces.* Originally LLM-chat as nucleus + organelles attached. Trainer dropped this in favor of peer bubbles after the user's feedback that chat should be its own bubble.
4. **Bubble (primitive)** — typed atomic UI unit. Resize/snap/cluster/attach via BSP. ~20 primitive types implemented.
5. **Mini-bubble** — content inside the brain bubble inside the chat, representing what the LLM has in context.

### Bubble vs SPA — when an app gets its own launcher icon

The locked rule from 2026-05-03: **bubble interface stays for clinical modules; full-bleed React-style SPAs are the right shape for dense roster / oversight / report tools that don't benefit from BSP tiling**. The Mentorship Tracker is the first SPA, Epic Quick Reference is the second. Future Scott Freiberg artifacts that arrive as "this should be its own thing" get launcher icons; artifacts that extend an existing module get ported into bubbles. Decision goes through the user — don't unilaterally switch a TSX from bubble-port to SPA-port.

### Tangible bubbles invariant

Bubbles have **persistent identity** — the chat in Trainer is *that exact* chat (same history, same brain) when you return. Workspaces don't morph bubbles into other bubbles; transitions go *through home* (workspace shrinks to its tile, a different tile expands).

### Mondrian aesthetic

- Home tiles: black canvas, primary-color blocks (red / blue / yellow / off-white) with 1px black borders combining into 2px gridlines.
- Workspace bubbles: glass surface + 5px top stripe in the same `--type-color`.
- Single source of truth: `t-<type>` CSS classes set `--type-color`. Adding a primitive = one line in glass.css.

### Tech stack

- **Vite + Preact + TypeScript + `@preact/signals`** (decision in commit `8aa5b8e`).
- **Cloudflare Pages** (static SPA, Git-connected as of 2026-05-12). Pages Functions for the chat backend (`functions/api/chat.ts`).
- **React-on-Preact** via `vite.config.ts` aliases for the SPA apps (mentorship tracker, Epic QR).

### Key files

```
src/
  apps/
    mentorship-tracker/
      MentorshipTrackerApp.tsx       Byte-identical port of ~/Downloads/remixed-fab2f713.tsx with // @ts-nocheck. React-style SPA (login → roster → provider profile). Re-copy on Scott iteration; do NOT edit body. [Scott owns]
    epic-quick-reference/
      EpicQuickReferenceApp.tsx      Byte-identical port of ~/Downloads/remixed-0de3d5eb.tsx with // @ts-nocheck. Self-serve Epic reference (34 entries / 7 categories). Re-copy on Scott iteration; do NOT edit body. [Scott owns]
  shell/
    Launcher.tsx                     Top-level "meridian" screen + four floating top-left pills: BackToLauncherChevron (home grid → launcher), HomeViewTogglePill (focused/archive home view), BackToMondrianChevron (any workspace → home grid), ModuleBackChevron (clinical-modules module mode → gallery). Also exports useProximityReveal hook.
    MentorshipTrackerShell.tsx       Wraps MentorshipTrackerApp + the chevron. [Scott owns]
    EpicQuickReferenceShell.tsx      Wraps EpicQuickReferenceApp + chevron + back-to-tracker pill when returnTo is set. Owns ENTRY_IDS[] constant that MUST stay in sync with source TSX entries[] order. [Scott owns]
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
    seed/clinical-modules.json       All 7 bundled modules. adhd + opiates + benzos at schema_version 1.3.0 (Simplified/Stratified Pass — two-tier first_layer_html + sub_questions[] + module-level smartphrases[] registry; opiates + benzos landed 2026-05-25, each 11 FAQ topics incl. a standalone §5-split topic: opiates-first-visit / benzos-taper-primer). Lipid at 1.1.0 (evidence-confirmation complete, simplification-pass pending — its bundle map differs, non-controlled-substance). ckd + anemia + abd-pain still at 1.0.0/1.0.1 (byte-identical to vanilla). [Noah owns]
    seed/glossary.json               Global glossary — 69 entries. [Noah owns]
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

### Data model (TS interfaces, in `src/types.ts`)

`WorkspaceConfig` declares cells + standalones + layoutHints (12×8 grid + per-id placements) + scripted hooks + seed sources. `BubbleInstance` carries id, type, title, props (free shape), resize states, optional attach to a cell, and an optional `fileId` linking to the filesystem. `CellConfig` has nucleus + brain + organelles (inline). `BSPRoot` wraps a recursive `BSPNode` (leaf or split). `MiniBubble` has optional `relationship: 'deep' | 'summary' | 'held' | 'edit'` (`reference` was renamed to `held`; old persisted state normalizes at read). `MeridianFile` (in `data/filesystem.ts`) holds a serialized `BubbleInstance` plus name / type / scope / workspaceId / timestamps.

### Persistence model

Two module-level Maps in `shell/workspaceState.ts`:
- `persistentWorkspaceStates: Map<workspaceId, { registry, root }>` — live state per workspace
- `savedLayouts: Map<workspaceId, SavedLayout[]>` — named save slots

Both hydrate from localStorage on module load; helpers write through on every mutation. JSON-clone for snapshot isolation.

---

## Demo flow (what works today)

### Launcher
1. Open https://meridian-os.pages.dev → "meridian" wordmark above three iOS-style app icons.
2. Tap an icon → enters the corresponding app full-bleed.
3. Refresh anywhere → returns to last-used app. Persistence key: `meridian-os.launcherApp.v1`.

### Mentorship Tracker
SPA login → director / mentor roster → provider profile (Journey timeline, 4 metric cards, MD Curriculum / Mentor / Office Manager / Questionnaires tracks). Director sees all three trackable tracks via "📋 View All Curriculum" modal. Click 📖 ref pill → deep-links into Epic QR with back-to-tracker pill. State (login, checkoffs, notes) is in-memory only for MVP.

### Trainer workspace
Tap Trainer in Mondrian GUI → Patel cohort. Real Sonnet 4.6 chat. Long-press chrome to lift bubbles; drop on chat → relationship menu (Scan / Held / Editable). Vault for snapshotting + recall. Save-state slots per workspace.

### Clinical Modules workspace
Three topic bubbles (Cardiometabolic / Behavioral & Controlled / General). Tap a module → workspace morphs to module mode (green checklist + red escalations + blue FAQ + PREVENT for lipid). Tap a row → FAQ auto-grows. Tools bubble spawns Clinical chat / OpenEvidence / PREVENT / Calculators / Consults on demand. Cmd+P / .docx / .pptx export. DOCX round-trip via "Import .docx" button.

---

## Locked design decisions

- **Git workflow is GitHub Flow with branch protection.** Branch off `main` → push → open PR → 1 approval → squash-merge → auto-delete branch → Cloudflare auto-deploys. **Never push directly to `main`** (branch protection rejects it). `enforce_admins: false` means Noah CAN bypass on his own admin account via the GitHub web UI's "merge without review" override, but that's an emergency lever, not the default path. Ownership convention (mentorship-tracker / Epic QR / master-checklist = Scott; clinical modules / shell / primitives = Noah) is verbal, not enforced by CODEOWNERS — cross-area changes require coordination before commit.
- **Cloudflare Pages is Git-connected** (since 2026-05-12). Auto-deploys on push to `main` (production) and any branch (preview). Build = `npm run build` → `dist`. Env vars in both Production + Preview: `NODE_VERSION=20.20.2`, `ANTHROPIC_API_KEY`. `deploy.sh` is manual fallback only.
- **Two-user collaboration via inter-instance messages.** Both Claude instances pick up notes from "Inter-instance messages" section. Append-only, newest first, trim after acted on. Use to announce cross-boundary intentions, flag issues spotted in the other contributor's territory, or coordinate on shared files.
- **Top-level launcher above the Mondrian GUI.** Cold boot shows iOS-style app icons. Apps that don't fit the bubble metaphor get launcher icons (Mentorship Tracker is the first SPA). Don't unilaterally migrate a TSX between bubble-port and SPA-port — go through the user.
- **Scott's TSX artifacts ship byte-identical with `// @ts-nocheck`.** When porting an SPA artifact, copy verbatim into `src/apps/<name>/`, prepend `// @ts-nocheck`, and tune UX from the host via the wrapper shell + CSS overrides on inline-style attributes. **Critical:** Preact serializes inline hex colors as `rgb(…)` in the rendered `style` attribute, so `[style*="0f1b2d"]` won't match the topbar — use `[style*="rgb(15, 27, 45)"]` (with the comma+space). When in doubt, run a headless probe to verify CSS is matching before deploying.
- **Tangible bubbles, no morphing.** Workspace transitions go through home. Bubble identity persists.
- **Mondrian for tiles, glass-with-stripe for workspace bubbles.** One `--type-color` per primitive type drives both.
- **BSP layout, not free-floating.** Workspaces are tiled; "moving" a bubble means restructuring the tile.
- **Workspace ⟲ is layout-only.** Chat has its own compact/clear; workspace ⟲ does not touch chat content.
- **Single visual treatment for v1**, themable later. No theme switcher in v1.
- **No enterprise integrations in this build.** Real LLM is fair game (no PHI), but real Epic / M365 / OpenEvidence stays in the on-prem future.
- **Mode-aware workspace layouts (clinical-modules).** The clinical-modules workspace toggles between gallery and module modes via a focus signal; layouts are tables in `BspWorkspace.tsx`. Static placement: ids in the active layout table are placed; `notes` is in every table so it follows the user. Spawned bubbles (any registry id containing `-spawned-`) get follow-along treatment in `buildClinicalModulesBSP` — appended into the largest leaf after the static layout. PREVENT auto-shows for the lipid module via `MODULE_LAYOUT_WITH_PREVENT`. Chat and OE no longer appear in any static layout — they exist only as user-spawned instances. Other workspaces use the legacy single-layout-per-workspace path.
- **Module data is the source of truth, bubbles are pure renderers.** All module content lives in JSON. Bubbles read JSON via seed resolver and `userModulesSignal.value`; they never own state that isn't in JSON. Edit JSON, refresh, bubbles re-render. This invariant is what makes round-trip via DOCX cleanly possible.
- **DOCX is the round-trip format.** Word is the most familiar editor for clinical leadership. DOCX export is structured to match the upload parser exactly. PPTX is one-way. Markdown round-trip and in-app authoring deferred.
- **meridian-os is the single source of truth for evidence-rewritten modules.** Vanilla's `~/GitHub_Repos/meridian-server/modules/*.json` files are the historical seed. Once a module is rewritten through the OE-verification pipeline, the meridian-os entry diverges from vanilla and is canonical. Do not propagate rewrites back. `schema_version` ≥1.1.0 = carries `references[]` array and inline `[ref:X]` markers.
- **Evidence citations live as `[ref:X]` markers inline + a top-level `references[]` array.** Each rewritten module entry carries `references: [{ ref_id, citation, url }]`. Inline prose carries plain-text `[ref:X]` markers. `expandRefMarkers` in FAQ + print views renders markers as superscripts; `stripRefMarkers` strips them from DOCX/PPTX export plain text. Round-trip via DOCX preserves markers.
- **Module rewrite pipeline has two stages: Evidence-confirmation → Simplification/Stratification Pass.** Evidence-confirmation produces a schema 1.1.0+ module with `references[]` + inline `[ref:X]` markers and one OE-bundle-verified claim per row (canonical trackers live at `verification/{module}.md`). The Simplification/Stratification Pass — defined in `/home/noahs/incoming_noah/meridian-module-simplification-standards.pdf` (Standards v1, 2026-05-12; copy into repo if it becomes load-bearing) — runs after and bumps schema to 1.3.0. Editorial rules: surface layer (4 checklist + green-zone narrative + 5 escalations + footer) is scannable without a tap; footer is 2 sentences max (advisory + jurisdiction); framework rationale lives in `context_strip`; sub-questions are first-person provider questions only; callouts (`<div class="cm-callout">`) reserved for guideline tension / important caveats. CV-monitoring split (its own escalation + its own FAQ) is the canonical example of Section 5 topic-splitting. The 6-step pass checklist is stamped into the module's `verification/{module}.md` on completion.
- **FAQ schema 1.3.0 = two-tier shape.** Each FAQ entry replaces `items[]` (1.2.0 flat Q/A list) with `first_layer_html` (scannable bottom-line answer; mixed prose / `<ul>` / `<table>` / `<div class="cm-callout">`) + `sub_questions[]` (default-closed "More detail" expanders, first-person provider questions only). Each entry may also carry `smartphrase_note` (e.g., `.CSADHD-PDMP-HOLD (future)`) and `consult_decision_point: { prefill_text, trigger_label?, consult_id? }`. Module-level `smartphrases?: ModuleSmartPhrase[]` registry tracks both `confirmed` phrases (with `text`) and `future` ones (with `description`) so future phrases aren't silently lost. **Badge color on the FAQ topic header is derived from `referenced_by[]`** intersected against `checklist[].item_id` (green) vs `escalation[].item_id` (red), not stored — denormalization would drift. **The "no-drawer rule"** from the standards PDF means in-bubble collapsibles for sub-questions are fine (still within the single detail-bubble layer); a third tap that opens *another panel* would violate. **`items[]` is back-compat** — 1.2.0 modules keep rendering via the legacy flat path until they receive their own simplification pass.
- **DOCX round-trip for schema 1.3.0 uses new prefix markers.** Generator emits `First Layer:` (opens the first-layer block), `Sub-question:` (first-person Q/A in the More-detail tier), `SmartPhrase note:` (entry-level note), `Consult trigger:` + `Consult prefill:` (paired structured fields). Legacy `Question:` is reserved for 1.2.0 entries — its presence in an import alongside `Sub-question:` would be malformed; the parser stamps `schema_version: '1.3.0'` when it sees any 1.3.0 marker. **References-merge policy:** when re-importing into an existing module (matched by `module_id`), `parseDocxHtml(html, existingModule)` unions DOCX-extracted refs with the existing JSON refs (existing wins on conflict) — protects the larger evidence-confirmation refs superset from being truncated by an editor's narrower citation list.
- **Floating back chevrons stack outer-scope-on-top.** The two iOS-glass pills (`‹ Mondrian` always at `top: 16px`, `‹ modules` below at `top: 60px` when relevant) sit at the App level in `main.tsx`, decoupled from any bubble's chrome. When adding future scoped back affordances, follow the same outer-scope-on-top stacking. Both share dark-glass material (`backdrop-filter: blur(20px) saturate(140%)`) and `@media print` hide-list entry.
- **Tool bubbles spawn primitives via `onSpawnBubble` extraProp, not a generic emit dispatcher.** A "tool" bubble (e.g., clinical-tools) lists actions as cards; clicking a card calls `onSpawnBubble({ type, title, props? })`, which BspWorkspace routes to `spawnAdjacentBubble`. Mirrors the per-primitive callback pattern. When a future bubble needs the workspace shell to do something, prefer adding a typed callback to the per-primitive `extraProps` switch over inventing a generic event channel.
- **App-level components spawn via the `meridian:spawn-bubble` CustomEvent, not extraProps.** When the spawn trigger lives outside any workspace bubble, use `window.dispatchEvent(new CustomEvent('meridian:spawn-bubble', { detail: { workspaceId?, spec: { type, title, props?, nearBubbleId? } } }))`. This is the ONLY cross-cutting bubble action so far — don't generalize until a second cross-cutting case appears.
- **Bubble lift only triggers from the chrome handle (or `.placeholder` whole surface).** `onBubblePointerDown` early-returns unless `e.target.closest('.bubble__chrome, .placeholder')` matches. Pressing inside the bubble body falls through to text selection / button clicks. If a future bubble type needs whole-surface lift like `.placeholder`, add it to the lift-region selector — don't go back to whole-bubble lift.
- **Text selection is opt-in by default in `.bubble__body`.** Global `body { user-select: none; -webkit-touch-callout: none }` stays. `.bubble__body` opts back in; interactive elements opt back out. iOS callout suppression stays globally because we replace it with the App-level `SelectionMenu`.
- **Selection actions live in a single App-level menu (`SelectionMenu`), not inline icons.** Select text → debounced `selectionchange` → dark-glass floating menu (Copy / Select all / Cite / OE / Feedback). Cite + OE gated on active clinical module focus. Inline icons can return for non-text triggers later (e.g., "cite this whole row" icon).
- **Per-bubble font-scale: `--font-scale` CSS variable + `zoom` on `.bubble__body`.** 0.85–1.4 multiplier per bubble id in localStorage. BspWorkspace writes `--font-scale` on each leaf; glass.css consumes via `.bubble__body { zoom: var(--font-scale, 1) }`. Chrome stays at 1.0. `zoom` is non-standard but supported in all modern browsers (Firefox 126+, May 2024).
- **`data-bubble-id` on every BSP leaf is the canonical bubble-from-DOM lookup.** Walk `closest('[data-bubble-id]').dataset.bubbleId`. Don't grep class names or rely on parent-walk shortcuts.
- **Feedback is mailto-only in v1.** No server, no localStorage queue. `feedbackMailto.ts` is a pure URL builder; `FeedbackModal` mounts at App level and constructs `mailto:nschmuckler@crystalrunhealthcare.com?subject=[Meridian / {Module}] {item}&body=…`. If feedback ever needs server-side persistence, add a Pages Function endpoint as an alternative `send` path — don't replace the mailto path.
- **Glossary decoration is DOM-walk, every-occurrence, case-sensitive.** Decorator uses `TreeWalker` and skips ancestors in `<a>` / `<code>` / `<sup>` / `<pre>` / `<script>` / `<style>` / `<button>` / `<input>` / `<textarea>` / `<select>` / `<kbd>` / `.ref-marker` / `.glossary-term`. Combined regex, longest-first. Case-sensitive — `OR` doesn't match `or`. Word-boundary anchored. Decorate every occurrence, not first-mention. Order in FAQ: refs → glossary → consults (each layer skips into previous layer's spans).
- **Glossary entries: global by default, per-module override.** `src/data/seed/glossary.json` is single global source. `ModuleData.glossary?` per-module override. Module entries override global by exact term match. Aliases on a single entry are the right way to handle case-only or punctuation variants.
- **Popover positioning pattern is shared** across `SelectionMenu` + `GlossaryPopover` + `CiteBlockPopover` (and future catalog popovers). Capture trigger position via `getBoundingClientRect`; place fixed-positioned overlay above by default; flip below if too close to top; clamp x to viewport. Dark-glass material. Dismiss on Esc, scroll, outside click. Reuse this shape rather than inventing a new positioning module.
- **Glossary decoration only on FAQ + checklist.** Notes (markdown) and trainer bubbles aren't decorated. PrintView / DOCX / PPTX exports never carry decoration. Wire decorators at render sites — don't push into source data.
- **Citation extractor walks rendered DOM, not source HTML.** `extractCitations(range, module)` uses `range.cloneContents()` and queries `[data-ref]` anchors on the cloned fragment. Only meaningful inside surfaces that render `<sup class="ref-marker">` (FAQ today; checklist strips markers by design).
- **Citations never auto-generate.** Empty selection → explicit "No supporting citations identified — extend the selection to include a cited claim." Popover never invents citations from "nearby" or "module default" refs. Mirrors `expandRefMarkers`' missing-ref policy.
- **Cite is gated on having an active module focused.** Disabled (like OE) when `activeModule === null`. Other workspaces still get a context-less SelectionMenu with Copy / Select all / Feedback.
- **Calculator catalog is registry-driven; calculator bubbles share `CalcShell` chrome.** `src/bubbles/_calculators/registry.ts` is single source of truth. Each calculator lives at `src/bubbles/_calculators/{id}/index.tsx` and uses shared building blocks. Per-calculator clinical decision rules live in result-banner notes / tier-detail strings, not the registry — they're instrument-specific.
- **`recommended_calculators` is a sort hook, not a filter.** Floats matching cards to top with "Recommended" badge — every other calculator stays visible. Recommend sparingly (2–4 per module).
- **Consult catalog is per-module (not a global registry like calculators).** `consults[]` lives on `ModuleData` because consult paths are content-coupled to module's clinical voice. If a future module wants to reference another module's path, add `consult_ref?: { module_id, consult_id }` to schema — don't move `consults[]` to a global registry.
- **Consult walker edges include random-access by node_id.** `if_yes` / `if_no` accept `'continue' | 'recommend' | 'block' | <node_id>`. Sequential `continue` is default. Unknown node id falls through to `recommend` (visible-fallback policy).
- **Consult-link click goes straight to spawn, no popover.** Different from `GlossaryPopover`. The consult-builder bubble *is* the popover for this affordance.
- **Auto-spawn is one-shot per module id.** `meridian-os.consultBuilderShown.{moduleId}` localStorage map. Re-entering doesn't re-spawn. Manual re-spawn via clinical-tools' Consults card.

---

## Plan

The original implementation plan lives at `~/.claude/plans/hello-thank-you-for-federated-petal.md`. That document has the deeper architectural background and the original storyboard. This `CLAUDE.md` supersedes the plan where they differ — much of the post-Phase-1 work emerged from interactive design with the user.

When picking up work in a fresh conversation, read **CLAUDE.md (this file) + STATE.md** first. The rest of the codebase is well-commented; named selectors and file paths above should orient quickly.

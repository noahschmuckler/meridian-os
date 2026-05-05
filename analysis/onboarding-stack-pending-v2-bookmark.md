# Onboarding-Stack v1 — Pending Items (Bookmark)

**Created:** 2026-05-05
**Status:** ON HOLD pending meridian-os v2
**Why on hold:** A separate agent is building a parallel version of the
onboarding stack (Mentorship Tracker + master checklist + Epic Quick
Reference) wired to a remote Microsoft SQL Server backend with read/write
persistence. To avoid drift between v1 and the eventual deployed v2,
further changes to v1 are deferred until v2's framework is stable.

This file is the **bookmark of outstanding work** that came out of the
2026-05-05 onboarding-stack integration session. Re-open after v2 is in a
stable state and decide which items still apply (some may be naturally
absorbed by v2's persistence layer; others remain frontend-only and can be
ported between versions).

---

## 1. Items flagged in the analyses but not built

### 1.1 30 / 60 / 90 / 180 / 270 named milestones on the Journey timeline
- **Source:** `analysis/master-checklist-vs-mentorship-tracker.md` §5.4 + §3 row 62.
- **Master checklist item #62:** "Establish protected, recurring mentor↔new-hire time on calendar at 30 / 60 / 90 / 180 / 270 days post-start."
- **Today:** the Journey timeline iterates the MP phases (`w1`..`q4`). Day 30 / 60 / 90 / 180 / 270 are not surfaced as named anchors — they're roughly aligned with `w4` / `w8` / `m3` / `m6` / `q3` but the cadence Noah committed to in writing is invisible.
- **Proposed:** add "Day 30 ✓ / Day 60 ✓ / Day 90 ✓ / Day 180 ✓ / Day 270 ✓" anchor pills above the timeline bar (or as overlay markers on the bar itself), tied to the provider's `days` field.
- **File:** `src/apps/mentorship-tracker/MentorshipTrackerApp.tsx` (`Timeline` component, currently lines ~261–283).
- **Priority for v1 demo:** high — written commitment that's currently invisible.

### 1.2 Pre-start phases on the Journey timeline
- **Source:** `analysis/master-checklist-vs-mentorship-tracker.md` §5.3.
- **Today:** `pre0` / `pre1` exist in `MD_PHASES` and appear in the MD-track phase selector + the View All modal, but the Journey timeline still uses `MP` only. Visual zero point is `w1`, not `pre0`.
- **Proposed:** either extend the timeline to render `pre0` / `pre1` ahead of `w1` (consistent), or render pre-start as a separate "before Day 0" stub strip (avoids shifting the existing visual zero).
- **File:** same Timeline component as 1.1.
- **Priority:** cosmetic but inconsistent.

### 1.3 OM / CS as login users
- **Source:** `analysis/master-checklist-vs-mentorship-tracker.md` §5.2.
- **Today:** OM and CS are surfaced as item-level badges only (`item.owner` field on master checklist JSON). The login screen shows MD + Mentor only.
- **Open question:** do OMs actually want to self-check items where they're owner/partner (#4 first-week email response, #5 site tour, #55 referral-list alert, #33 AWV walkthrough for CS), or is MD-on-their-behalf check-off sufficient?
- **Proposed if yes:** extend `USERS` with `om1+` and `cs1+` actors; add narrowed-roster view (only items where they're owner). Update `canChk` semantics to include OM/CS for their own items.
- **Priority:** depends on operational signal from the Crystal Run pilot.

### 1.4 Workflow for items #21 (CAHPS/HOS) and #61 (RLdatix) handoffs
- **Source:** `analysis/master-checklist-vs-mentorship-tracker.md` §5.6 + the two items' `depends_on` field in `mentorship-master-checklist.json`.
- **Today:** items #21 and #61 render with a `🔁 PENDING` badge + tooltip showing the dependency text ("CAHPS/HOS one-pager from Chris Langerhans" / "RLdatix how-to from operations"). Not actionable.
- **Proposed:** wire the badge to a `mailto:` link (matches the existing feedback-mailto pattern in `src/lib/feedbackMailto.ts`) so the MD can ping the dependency owner directly. Pre-fill subject + recipient based on `depends_on` text.
- **Priority:** low — useful but not blocking.

### 1.5 Provider as a login role
- **Source:** implicit in master analysis §5.2.
- **Today:** questionnaires (QP) are filled by the MD/mentor on the provider's behalf. No self-fill flow.
- **Proposed:** add `role: "provider"` to `USERS`; on login, render a narrow view showing only the questionnaires the provider needs to fill for their own onboarding.
- **Priority:** depends on whether providers are expected to self-respond. v2's persistence layer probably wants this.

### 1.6 localStorage persistence for tracker state
- **Source:** observation during 2026-05-05 session.
- **Today:** refresh resets `uid` / `selId` / `checks` / `qa` / `notes` / `noteIn` to seed values. Pre-existing behavior — Scott's TSX uses local React state only.
- **Note:** this is the SPECIFIC concern that v2 (remote MS SQL backend) will solve. **Skip in v1.** Persistence belongs to v2.
- **Priority:** ABSORBED BY V2 — no v1 work needed.

### 1.7 Scott-owned Epic QR content enhancements
- **Source:** `analysis/epic-quick-reference-vs-onboarding-stack.md` §6.
- **Today:** Epic QR is byte-identical from Scott's `~/Downloads/remixed-0de3d5eb.tsx`. Eight content additions identified in the analysis as drawing from master-checklist concrete-misstep-risk items + workflow-completeness gaps.
- **Eight identified additions:**
  - 100-day vs 90-day Medicare refill detail (master #43)
  - Medicare hard-stop bypass — dx list vs patient-signed waiver pull-down (master #48)
  - Specific-vs-generic referral failure mode (master #56)
  - Move HCC column left in schedule view (master #19)
  - AWV-specific SmartSet (master #32–37)
  - Behavioral health screening — PHQ-9 / GAD-7 / AUDIT triggering + LSW workflow (master #38; ties to Track 4a calculator family)
  - Vitals multi-visit SmartLink (master #29)
  - Ambulatory vs telephone encounter — including "Hide Additional Visits" toggle gotcha (master #50/51)
- **Process:** Scott edits the source TSX; meridian-os re-imports byte-identical. **Do NOT edit the body of `EpicQuickReferenceApp.tsx`** — the `// @ts-nocheck` byte-identical convention is preserved across iterations.
- **Critical:** if Scott reorders entries when iterating, update `ENTRY_IDS[]` in `src/shell/EpicQuickReferenceShell.tsx` to match the new declaration order — otherwise deep-links from the tracker will misfire.
- **Priority:** content-driven, awaits Scott's iteration.

### 1.8 Phase 3 peer-mentor handoff
- **Source:** `analysis/epic-quick-reference-vs-onboarding-stack.md` §5 Phase 3.
- **Today:** unblocked by the integration but not exercised.
- **Operational rollout, no code:** when a new-provider-turned-mentor is named, they switch `role` in `USERS` (from "MD"/"DO" provider to "mentor"), get assigned a mentee in `PROVS`, and have access to the same three-tool kit (tracker / master checklist JSON / Epic QR).
- **Priority:** no code work needed — this is process documentation for Crystal Run leadership.

---

## 2. Smaller open questions (never confirmed with Noah)

### 2.1 Launcher icon glyph + title
- Today: ⚡ glyph, navy/slate gradient, "Epic Quick Reference" caption.
- Open: was that the right icon? Alternatives: 📖 / 🩺 / a custom SVG. Title alternatives: "Epic Reference" / "Epic Cheatsheet" / just "Reference".

### 2.2 Launcher grid layout
- Today: `flex-wrap` row, 3 icons in a row at desktop width, wraps to 2+1 on narrow viewports.
- Open: should it lock to a 2×2 grid (with one empty slot for a future Scott artifact) or stay row-based? Worth deciding before a fourth icon arrives.
- Source: `analysis/epic-quick-reference-vs-onboarding-stack.md` §8.3.

### 2.3 In-tabs-row "View All" button — keep or remove?
- Today: two "View All Curriculum" buttons exist when isDir is true: one in the MD topbar (always visible) and one in the per-provider track-tabs row (only visible when MD tab is active).
- Now somewhat duplicative since the topbar one is always reachable.
- Decide: remove the in-tabs-row button to declutter, or keep both for contextual convenience.

### 2.4 QR keyword synonym tuning
- Today: each Epic QR entry has a `keywords[]` array authored by Scott. Search filters by substring against title / keywords / steps / tip text.
- Open: are there primary-care-specific synonyms Noah wants surfaced (e.g., "F2" should also match "wildcard navigation" / "asterisk navigation" — already partially done in `keyboard-shortcuts`)?
- Process: Scott-owned via QR TSX iteration (same as §1.7).

### 2.5 Bidirectional deep-links (QR → tracker)
- Today: unidirectional (tracker → QR only).
- Open: should clicking inside a QR entry surface "what curriculum item teaches this?" — useful for a future-mentor reviewing a QR entry.
- Source: `analysis/epic-quick-reference-vs-onboarding-stack.md` §8.5.
- Defer until requested.

### 2.6 Future Scott artifacts on the launcher
- Open: are there other in-flight TSX artifacts Noah expects to ship as launcher apps in the next quarter? Knowing the inventory shapes whether the launcher needs to scale to 4 / 6 / 10 icons.

---

## 3. Context: meridian-os v2

A separate agent is building a parallel version, planned in detail at
`~/.claude/plans/i-ve-met-with-it-jolly-pillow.md`. Key decisions already
locked there (do NOT re-litigate):

- **Repo:** new `noahschmuckler/meridian-os-v2` (fork of v1 at the v2
  cut-point). v1 stays alive for module-content shipping on Cloudflare;
  v2 grows the SQL backend + auth + per-user telemetry on a Crystal Run
  internal "orange workstation" with direct SQL Server access.
- **Backend:** Node + Express + `mssql` driver on the workstation;
  Microsoft SQL Server replaces v1's localStorage.
- **Auth:** local username + password + bcrypt + session cookies (~150
  LOC; director-mediated account creation; doesn't lock out future
  AD/SSO migration since `user_id` stays stable).
- **Scope MVP — two endpoints:** (1) Mentorship Tracker / provider
  onboarding with three roles (medical_director, mentor,
  onboarding_provider) and all tracker state in SQL; (2) Mondrian GUI /
  clinical modules served from SQL with per-user usage telemetry for QI
  mining. Epic Quick Reference is NOT explicitly named in the v2 MVP —
  worth confirming whether it ports as-is, gets SQL-backed entry storage,
  or stays static when this bookmark is re-opened.
- **Module sync:** v1 → v2 via `scripts/sync-modules-to-v2.ts` (hashes
  each module, inserts new `module_versions` row on hash change).
- **Implication for v1:** items absorbed by v2 (1.6 persistence
  explicitly; likely 1.3 / 1.5 since v2 has three roles + identity-aware
  telemetry) should NOT be ported back to v1. v1 stays in-memory; v2 owns
  persistence + auth + telemetry.

When v2 stabilizes:
1. Audit this file. Items 1.6 / 1.3 / 1.5 likely become "delivered by v2"
   and can be struck.
2. Decide which v1 frontend changes (timeline anchors §1.1, pre-start
   phase §1.2, depends-on workflow §1.4, smaller-questions §2) should be
   ported forward to v2 vs left as v1-only polish.
3. Decide whether v1 deprecates entirely once v2 ships (workstation-only
   replaces public Cloudflare demo) or v1 stays as the public-demo /
   fallback artifact while v2 is the production-pilot tool. The v2 plan
   leaves this open.

---

## 4. When to revisit

- **Trigger:** v2 framework reaches a stable, demo-able state. The
  v2 plan's Phase 3 verification list is the canonical bar: real users
  logged in, mentorship checkoffs persisting across refresh, modules
  served from `/api/modules`, telemetry events landing in the `events`
  table.
- **Owner of trigger:** Noah (he'll know when v2 is "stable enough" and
  whether the onboarding-stack scope of v2 covered each of §1's items).
- **Re-open process:** read this file end-to-end, audit each item against
  v2's actual capabilities (especially v2's three-role auth model and
  `provider_assignments` schema in `~/.claude/plans/i-ve-met-with-it-jolly-pillow.md`),
  decide what still applies. If v2 deprecates v1, this file gets archived
  rather than executed.

---

## 5. CLAUDE.md cross-reference

This file is referenced in `CLAUDE.md` under the onboarding-stack
"Resume here after `/clear`" pointer. If a future session asks "what's
left to do on the onboarding stack?", direct them here.

The file is intentionally NOT a TODO list — it's a bookmark of decisions
deferred during the 2026-05-05 session. Items get implemented when the
v2 audit (§4) determines they still apply.

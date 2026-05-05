# Epic Quick Reference (TSX) vs Master Checklist + Mentorship Tracker — Coverage Analysis

**Created:** 2026-05-05
**Source documents:**
- Epic Quick Reference (new): `~/Downloads/remixed-0de3d5eb.tsx` (Scott Freiberg's TSX, 828 lines, 34 entries / 7 categories)
- Master checklist: `~/Downloads/Master checklist.docx` (62 items / 17 sections — already analyzed in `analysis/master-checklist-vs-mentorship-tracker.md`)
- Tracker code: `src/apps/mentorship-tracker/MentorshipTrackerApp.tsx` (746 lines)

**Goal:** assess where the Epic Quick Reference's 34 task entries map to the 62-item master checklist, identify what each artifact uniquely covers, and propose how to incorporate the Epic Quick Reference into the existing onboarding stack so a new provider — once mentored to expertise — has the toolkit to themselves become a mentor (peer-mentorship pipeline).

---

## 1. Top-line findings

1. **Three artifacts, three layers of the same lifecycle.**
   - **Master Checklist** = directed teaching curriculum. 62 specific MD-led tasks. "Move HCC column left", "Set up ≥5 Quick Actions", "100-day Medicare refills". *What the mentor teaches.*
   - **Epic Quick Reference** = self-serve reference / refresh / look-up. 34 step-by-step task entries with tips and related-entry links. *What the provider consults during/after teaching, and what a future mentor pulls up before re-teaching.*
   - **Mentorship Tracker** = relationship + progress accountability. Phases, check-offs, questionnaires. *What the director sees to confirm the curriculum was delivered.*

   These are complementary, not redundant. The Epic Quick Reference is the **expert layer** — it's the document a new-provider-turned-mentor refers to when teaching their own mentee.

2. **Direct 1:1 / strong matches: 15 of 62 master items map to a specific Epic QR entry.** (24%) These are the cases where, when the MD checks off the master-checklist teaching task, the Epic QR entry is the natural follow-along reference for the trainee.

3. **Partial / thematic matches: 14 of 62 master items.** (23%) The Epic QR covers an adjacent or supporting workflow but doesn't drill into the master-checklist specifics (e.g., master #29 wants "vitals from last 3 visits", Epic QR shows `pull-results-note` with the `RESUFAST` SmartLink pattern but doesn't show vitals specifically).

4. **No coverage in Epic QR: 33 of 62 master items.** (53%) The Epic QR is silent on most pre-start administration, communication-channel setup, billing-level nuance (E&M Pro, level 3/4/5), HCC-specific workflow, AWV mechanics, behavioral-health screening, telehealth, EKG, multi-pharmacy, 100-day Medicare refills, Medicare hard-stop bypass, CAHPS/HOS, RLdatix, and the 30/60/90/180/270 cadence policy. Most of these are not Epic-discrete tasks per se — they're admin / clinical-program nuance / state-and-payer-specific knowledge.

5. **10 of 34 Epic QR entries have no master-checklist analog.** (29%) These are pure-reference entries that support a provider in their *independent-practice phase*, after the curriculum is delivered: `find-smartphrase` (discover what colleagues built), `create-smartlist` (advanced template authoring), `chart-review-filter`, `use-synopsis`, `use-snapshot`, `care-everywhere`, `customize-sidebar`, `customize-schedule`, plus the two starred ★ entries (`caregap-not-firing`, `update-problem-list`) — both of which are root-cause / "why isn't Epic flagging this" content that's hard to teach upfront and lands better as something the provider rediscovers in their own practice. The two ★ entries in particular are the closest the Epic QR has to a manifesto: **the Problem List is the engine, Epic is the tool, USPSTF/ACS/ACOG/AAP guidelines are the primary driver.** That's the kind of philosophy that solidifies during independent practice, not on day 1.

6. **The Epic QR is the missing third leg.** Pre-this-document, the meridian-os onboarding stack had: tracker (accountability) and emerging master-checklist curriculum (teaching). The Epic QR provides the **provider-facing self-serve reference** that closes the loop. Once a provider has been taught (via curriculum) and tracked (via tracker), the Epic QR is what they consult during their growth into expertise — and what they hand-deliver to their own future mentees as the canonical task playbook.

7. **Form factor: launcher app, not a bubble.** The Epic QR is a search-driven, expand-and-read-step-by-step reference. Its UX shape is closer to the Mentorship Tracker (full-bleed SPA, no BSP) than to a clinical-modules bubble (tiled, multi-pane). Provider use case is "I'm in encounter, what's the SmartPhrase syntax again?" → 5-second lookup → dismiss. That's a launcher app. (A small companion bubble is plausible later if the QR earns its keep on a clinical-modules workspace, but launcher app is the right primary form.)

---

## 2. Master Checklist ↔ Epic Quick Reference 1:1 / strong-match table (15 items)

For each match, the canonical mapping is: when the MD checks off the master-checklist item in the tracker, the Epic QR entry is the natural deep-link the provider opens for follow-up self-study.

| Master # | Master summary | Epic QR id | Why it matches |
|---|---|---|---|
| 11 | Walk through message-pool management including lab results | `inbasket-organize` + `result-notification` + `staff-message` | QR's three inbox entries collectively cover folder layout, results processing, and pool routing. |
| 12 | **Set up ≥5 Quick Action buttons** (concrete, often-missed) | `inbasket-quickaction` | Literal 1:1. QR is the step-by-step the provider follows to actually build their first 5. |
| 13 | Additional Quick Actions / SmartPhrases for routine guidance (BG, BP, etc.) | `inbasket-quickaction` + `create-smartphrase` | Two QR entries form the recipe for routine response patterns. |
| 14 | Response patterns for every In Basket category | `inbasket-organize` + `staff-message` + `mychart-respond` | QR covers the four major message types (results, MyChart, staff, renewals) explicitly. |
| 26 | Walk through cleaning/reconciling med list + dx list thoroughly | `med-reconciliation` + `update-problem-list` ★ | QR's `update-problem-list` is one of two starred entries — its tip "the Problem List drives EVERYTHING downstream" is exactly the framing master #26 wants reinforced. |
| 27 | Walk through writing/closing progress notes via SmartPhrases | `create-smartphrase` + `note-from-template` | Two QR entries combine to cover composition + Speed Buttons. |
| 28 | Discuss creating new SmartPhrases from already-written text | `create-smartphrase` | Direct match. |
| 36 | Labs ordered must attach to dx (not screening code) so Medicare covers | `link-dx-order` + `link-dx-billing` | QR's two diagnosis-linking entries explicitly cover this; QR `link-dx-billing` tip is "Every order without a linked diagnosis is a potential claim denial." |
| 39 | Show how to place medication orders | `eprescribe` + `star-order` | QR walks through full ordering, including EPCS two-factor for controlled substances. |
| 44 | Save medication orders with appropriate refill counts + dx attachments | `star-order` + `link-dx-order` | QR's `star-order` step 4 is "modify dose, quantity, refills, sig, pharmacy" before starring — direct match. |
| 53 | Critical/abnormal results management; closed-loop expectations | `result-notification` | Direct match. QR covers normal/abnormal/critical + Notify Patient + Follow Up flow. |
| 54 | Use electronic referrals only | `place-referral` | Direct match. |
| 58 | **Tailored order sets** by disease/age/visit type | `create-smartset` | Literal 1:1. QR is the recipe for building the tailored sets master #58 mandates. |
| 59 | Note closure timeliness (24–72 hr); consequences of open encounters | `close-encounter` | Direct match. QR tip: "Open encounters = lost revenue and compliance risk." |
| 60 | F2 navigation between SmartPhrase fields | `keyboard-shortcuts` | Direct match — QR's first listed shortcut is F2. |

**Net:** 15 of 62 master items have a clean QR follow-along reference today. These 15 are the highest-confidence cases for Phase 2 of the integration plan (§5 below).

---

## 3. Partial / thematic matches (14 items)

These are cases where the Epic QR covers an adjacent surface but the master-checklist item drills into a more specific point or workflow nuance. The master-curriculum check-off would link to the QR entry, but the QR may need an **enhancement** (added step or tip) to fully cover the master nuance.

| Master # | Master summary | Closest Epic QR | Gap |
|---|---|---|---|
| 7 | Epic OOO + in-basket coverage for PTO | `inbasket-organize` | QR covers folder organization, not OOO/coverage assignment. |
| 10 | Walk through care-gap ID **on the daily schedule** | `find-care-gaps` | QR is chart-side care-gap discovery; doesn't explicitly cover schedule-view gap indicator. |
| 15 | Rearrange **LOS and E&M buttons** for new provider | `customize-tabs` | QR is generic tab/layout customization; doesn't call out E&M button surface. |
| 24 | Show allergy entry | `customize-sidebar` (mentions allergies as recommended sidebar item) | QR doesn't cover the allergy-entry workflow itself, just allergy visibility in sidebar. |
| 25 | PMH/PSH/SH/FH entry; reinforce SH alongside the rest | `update-social-hx` | QR has SH discretely but not PMH/PSH/FH entry workflows. |
| 29 | Standard progress note pulling **vitals from last 3 visits** | `pull-results-note` | QR covers `RESUFAST` SmartLink for labs; doesn't give the vitals-multi-visit pattern. |
| 32 | AWV SmartSet location, selection, AWV progress note | `create-smartset` | QR covers SmartSet *creation*, not AWV-specific SmartSet usage. |
| 37 | SDOH within AWV SmartSet/questionnaire | `update-social-hx` | QR adjacent (SH discrete fields), not AWV-flow specific. |
| 40 | Check pharmacy on Visit tab before signing | `eprescribe` | QR step 7 implies (drug-interaction/allergy alerts) but doesn't explicitly call out pharmacy verification step. |
| 47 | Spot/resolve red errors before signing | `close-encounter` | QR mentions "ensure all orders are signed" but not red-error resolution specifically. |
| 50 | Two pathways: ambulatory order vs telephone encounter | `telephone-encounter` | QR covers TE; ambulatory-order-outside-visit pathway is implicit, not explicit. |
| 55 | Confirm referral list built into orders; alert OM if missing | `place-referral` | QR covers placing referrals; doesn't address the "is the list built? if not, alert OM" check. |
| 56 | **Specific** referral (individual provider/office) — never generic | `place-referral` | QR step 5 "verify routing" is adjacent; doesn't surface the "generic referral falls into unattached basket" failure mode. |
| 57 | Default Internal; Outgoing only for non-group | `place-referral` | QR step 2 mentions internal vs external; doesn't make Internal-the-default explicit. |

**Net:** 14 of 62 master items get partial QR support today. Several are obvious enhancement candidates for the QR itself — covered in §6 below.

---

## 4. Master items NOT in Epic QR (33 items)

These represent legitimately out-of-scope territory for an Epic-task playbook. They're admin / clinical-program / payer-specific / cadence-policy:

**Pre-start admin (4):** 1 (schedule template), 2 (DAX setup), 3 (Epic ID capture), 4 (first-week site-info email).

**Site / org-level (5):** 5 (site tour), 6 (communication channels MD/OM/Marc), 8 (call schedule + after-hours), 9 (daily huddle), 33 (CS-led AWV walkthrough).

**Billing / coding nuance (4):** 16 (level 3/4/5), 17 (E&M Pro), 18 (HCC location), 21 (CAHPS/HOS).

**HCC-specific (2):** 19 (move HCC column left), 20 (This Visit tab HCC mgmt).

**Visit charting basics (3):** 22 (vitals), 23 (CC for telemed), 30 (telehealth visit), 31 (EKG order/perf/interp).

**AWV-specific (3):** 34 (AWV not required), 35 (specialists list under AWV note), 38 (BH screening + LSW workflow).

**Med-order nuance (4):** 41 (multi-pharmacy), 42 (confirm transmission), 43 (**100-day Medicare refills** — concrete misstep risk), 51 (Hide Additional Visits toggle).

**Lab / diagnostic nuance (4):** 45 (Now vs Future), 46 (LabCorp vs Quest, NJ-relevant), 48 (**Medicare hard-stop bypass** — concrete misstep risk), 49 (CAC teaching example).

**Quality / safety (2):** 52 (TE recommendation when documentation matters — partial), 61 (RLdatix).

**Cadence policy (1):** 62 (30/60/90/180/270).

**Note:** items 43 and 48 are the master checklist's "concrete misstep risk" entries flagged in `analysis/master-checklist-vs-mentorship-tracker.md`. The fact that they're absent from the Epic QR is an enhancement opportunity (§6).

---

## 5. Path forward — three-phase incorporation

The user's stated long-term goal: *once a provider has completed their mentorship pathway, they will be an expert, and after a period of independent practice they, too, will be able to mentor a new provider.* This is a peer-pipeline design. The three-phase plan below walks the provider through that arc.

### Phase 1 — Port Epic Quick Reference as a third launcher app (immediate, low-risk)

**Form:** Mirror the MentorshipTrackerApp pattern exactly. Byte-identical port with `// @ts-nocheck`, full-bleed SPA, no BSP, accessible from the launcher.

**Files:**
- `src/apps/epic-quick-reference/EpicQuickReferenceApp.tsx` — copy verbatim from `~/Downloads/remixed-0de3d5eb.tsx`, prepend `// @ts-nocheck`. (Same protocol as MentorshipTrackerApp port: do **not** edit body; tune UX from the wrapper / CSS overrides.)
- `src/shell/EpicQuickReferenceShell.tsx` — wrapper analogous to `MentorshipTrackerShell.tsx`. Adds `BackToLauncherChevron` (`‹ meridian`); re-establishes scrollable web-app container so the inner `min-height: 100vh` doesn't clip past viewport (same trick used in MentorshipTrackerShell — `flex: 1 !important; min-height: 0 !important; max-height: 100% !important`).
- `src/data/launcherState.ts` — extend `LauncherApp` type from `'launcher' | 'mondrian' | 'mentorship'` to `'launcher' | 'mondrian' | 'mentorship' | 'epic-reference'`.
- `src/shell/Launcher.tsx` — add a third icon to the launcher grid. Suggested visual: ⚡ glyph on a slate / navy gradient (matches the QR's own header). Title: "Epic Quick Reference" or just "Epic Reference".
- `src/main.tsx` — add the routing case for `epic-reference` next to the `mentorship` case.

**Persistence:** the existing `meridian-os.launcherApp.v1` localStorage key already persists last-opened app — no new persistence needed. Provider opens QR last, refreshes, lands back in QR. (User behavior model: if you were just in the QR mid-encounter, refreshing should *stay* in the QR.)

**CSS gotchas (identical to the MentorshipTracker port):** the QR uses inline `style={{ background: "linear-gradient(...)" }}` with hex colors — Preact serializes hex as `rgb(...)` in the rendered DOM, so any style-attribute selectors should target the rgb form. The QR's outer container has `minHeight: "100vh"`; the wrapper shell needs to override via `!important` to keep the SPA scrollable inside the hidden-overflow host.

**Effort:** ~30–45 min. Same pattern as the existing MentorshipTracker port.

**Why launcher app and not a bubble:**
- The QR is read-only reference content with search/filter/expand UX — mirrors the SPA shape, doesn't benefit from BSP tiling.
- Provider use case is "open it for 5 seconds, dismiss it" — that's a launcher app, not a workspace.
- A bubble version stays plausible later (e.g., spawnable from clinical-tools' Tools section) if the QR earns its keep on a clinical-modules workspace, but it shouldn't be the primary form.

### Phase 2 — Wire MD Curriculum items to Epic QR entries (after the master-checklist Option A track lands)

**Prerequisite:** Option A from `analysis/master-checklist-vs-mentorship-tracker.md` has shipped (MD Curriculum track added to the tracker; 62-item curriculum extracted into `src/data/seed/mentorship-master-checklist.json`).

**Form:** each MD curriculum item in the JSON declares an optional `epic_ref_ids?: string[]` field listing the Epic QR entry ids that are the canonical follow-along references. The tracker UI shows a small "📖 Open Reference" link next to any item with `epic_ref_ids[]`. Clicking the link opens the launcher's Epic Quick Reference app, pre-filtered (or pre-expanded) to the linked entry.

**Cross-app deep-link mechanism:**
- A new signal `epicReferenceFocusSignal` (analog of `moduleFocusSignal`) carries `{ entryId: string | null }`.
- Tracker click → set `epicReferenceFocusSignal.value = { entryId: 'inbasket-quickaction' }` → call `setLauncherApp('epic-reference')`.
- The Epic QR's wrapper reads `epicReferenceFocusSignal` on mount and scrolls/expands the matching entry. (Inside the SPA, that means programmatically setting `expandedId` and clearing `search`/`selectedCat`. Since the SPA is byte-identical via `// @ts-nocheck`, the wrapper can post a CustomEvent into the SPA's scope or — cleaner — a small post-mount effect mounted as a sibling reads the signal and dispatches synthetic clicks. Both work; pick the cleanest at implementation time.)

**Seed data:** the 15 strong-match rows (§2) populate the JSON `epic_ref_ids[]` on day 1. The 14 partial-match rows (§3) get the closest QR entry plus a "// partial" marker comment so the eventual QR enhancements (§6) tighten the link.

**Bidirectional? No, not in v1.** The Epic QR doesn't link back to the tracker. Reasoning: a provider opening QR mid-encounter is not asking "where am I in onboarding?" — they're asking "how do I do this Epic task?" The tracker → QR direction is the value-bearing one. If a future need surfaces (e.g., "I'm a future-mentor pulling up a QR entry; show me which curriculum item it teaches"), add the reverse link then.

**Effort:** depends on Option A landing first. Once master-checklist JSON exists, Phase 2 wiring is ~1–2 hr (signal + handler + 15 rows of seed data + UI affordance in the tracker).

### Phase 3 — Peer-mentor handoff (after independent practice — long horizon)

**Vision:** when a new provider has completed their mentorship + accumulated independent-practice time + been blessed as a mentor, they take over teaching a fresh new-hire. The handoff toolkit:

1. **Tracker** — they switch from `role: "MD"` (mentee) to `role: "mentor"` in `USERS`. They get assigned a mentee in `PROVS`. (Today's tracker already supports this role.)
2. **Master Checklist (MD Curriculum)** — they have access to the same 62-item teaching curriculum the original MD used. The JSON is the canonical script.
3. **Epic Quick Reference** — they have the same self-serve reference they used during their own training. Now it serves a second purpose: **a peer mentor who hasn't taught a topic in months refreshes themselves on the QR entry before sitting down with their mentee.** Master item 12 ("Set up ≥5 Quick Actions") → mentor opens `inbasket-quickaction` for 30 seconds → walks the mentee through with confidence.

**This is why the QR is the missing third leg.** The original MD has the 62-item teaching task in their head from years of repetition. A peer mentor — by definition — does NOT have years of repetition; they have their own onboarding experience plus their own independent practice. They need a hardcopy reference to prevent drift, and the QR is exactly that.

**No code change for Phase 3 in the near term.** It's an organizational rollout step. Once Phases 1 and 2 are in place, Phase 3 is operational policy: when a new mentor is named, they're handed the same set of three tools.

**One implementation hook worth noting now:** when extracting the master-checklist into JSON (Option A from the prior analysis), keep the format clean enough that **the curriculum can iterate without breaking peer-mentor reliance on it**. JSON-as-source-of-truth (recommendation §5.5b in the prior analysis) is the right call partially because peer-mentor teaching depends on the curriculum being a stable, versioned artifact — not buried in a TSX that drifts each commit.

---

## 6. Epic QR enhancement opportunities (independent of incorporation plan)

Drawing from the master checklist's "concrete misstep risk" items and the partial-coverage gaps in §3, several edits to the Epic QR itself would strengthen the 1:1 mapping. None are blockers for Phase 1; treat as Phase 1.5 — additions to make once Scott is ready to iterate.

**High-value additions (concrete misstep risk):**
- **`eprescribe` or new `medicare-refill-cadence` entry** — cover master #43 (100-day Medicare refills to prevent care gaps; vs 90-day default). Single new step ("For Medicare patients with chronic medications, set quantity to 100 days, not 90, to prevent refill-related care gaps") OR a dedicated entry.
- **`link-dx-order` enhancement** — add the master #48 Medicare hard-stop bypass detail (Medicare-approved dx list OR patient-signed waiver via specific pull-down — checking "patient will sign" alone does **not** work). This is documented misstep that costs claim denials.
- **`place-referral` enhancement** — elevate master #56 from a tip to an explicit step ("Choose the **specific** provider or office location — never generic. Generic referrals fall into an unattached basket and never get worked.").

**Medium-value additions (workflow completeness):**
- **`customize-schedule` enhancement** — master #19 (move HCC column to far left of schedule view). Either a step ("Move the HCC column to the leftmost position so HCC opportunities are visible at a glance") or a dedicated `hcc-column-arrangement` entry.
- **New `ambulatory-vs-telephone-encounter` entry** — covers master #50/#51 (two pathways; the "Hide Additional Visits" toggle so ambulatory orders show in the standard progress notes view). The toggle is a documented gotcha.
- **New `awv-smartset` entry** — covers master #32–#37 (AWV SmartSet location, AWV progress note, specialists list, SDOH, dx-attached labs). Currently `create-smartset` is generic; an AWV-specific one would close five master rows.
- **New `vitals-multi-visit-smartlink` entry** — covers master #29 (standard progress note pulling vitals from last 3 visits). Worth one entry given how often it surfaces.
- **New `behavioral-health-screening` entry** — covers master #38 (PHQ-9, GAD-7, AUDIT triggering and positive-screen workflow + email-LSW). This is also exactly the calculator-bubble family in Meridian-OS Track 4a (`gad7`, `phq9`, `audit-c`); the QR entry could even cite the calculator bubble as the lookup.

**Low-value (philosophy / state-specific / soft):**
- The master checklist's pre-start phase (items 1–6, 8–9) is intentionally NOT a fit for the QR. These are admin events, not Epic tasks. Leave them in master only.
- LabCorp vs Quest (master #46) is NJ-org-specific and changes per site. Skip.
- CAHPS/HOS basics (master #21), RLdatix (master #61) are organizational rather than Epic-task. Skip.

**Open question for Scott:** is the Epic QR meant to expand over time (with new entries added as new master items / training feedback emerge), or does Scott want it kept tight at the current 34 entries? The above 8 additions assume "expandable"; if "tight", treat them as the master checklist's job to fill in.

---

## 7. Coverage summary

| Bucket | Count |
|---|---:|
| Master checklist items | 62 |
| Master items with strong (1:1) Epic QR match (§2) | **15** (24%) |
| Master items with partial / thematic Epic QR match (§3) | **14** (23%) |
| Master items with no Epic QR coverage (§4) | **33** (53%) |
| Epic QR entries | 34 |
| Epic QR entries that map to a master item | **24** (71%) |
| Epic QR entries with no master analog (independent-practice ref) | **10** (29%) |

**Reading the numbers:** Epic QR is largely a subset of the same domain the master checklist teaches (71% overlap), with a 29% tail of pure-reference content for independent-practice growth. The master checklist's "out of QR" portion (53%) is admin / payer / state / org policy that the QR shouldn't try to swallow.

---

## 8. Open questions for Noah

1. **Phase 1 go-ahead.** Port `~/Downloads/remixed-0de3d5eb.tsx` as a third launcher app now, before the master-checklist Option A track lands? (Recommendation: yes — the QR is independently valuable and the port pattern is well-trodden.)
2. **Launcher icon.** ⚡ on a navy/slate gradient (matches the QR's own header color)? Or something different? Title: "Epic Quick Reference", "Epic Reference", or "Epic Cheatsheet"?
3. **Placement on the launcher grid.** Today the launcher has Mondrian GUI + Mentorship Tracker on a row. With three apps, consider rendering as a 3-column row (cleaner than 2+1) or a 2×2 grid (leaves room for a fourth Scott artifact). User has said future Scott artifacts that don't fit the bubble metaphor get launcher icons — design for that.
4. **Phase 2 deep-link UX.** When a tracker MD-curriculum item links to a QR entry, should the QR open with the entry pre-expanded (current proposal), pre-filtered to the entry's category, or pre-searched on the entry's title? Pre-expanded is most direct.
5. **Bidirectional links?** v1 proposal is unidirectional (tracker → QR only). Worth adding QR → tracker later? (Use case: future-mentor wants to see "what curriculum item teaches this" when reviewing a QR entry.) Defer until requested.
6. **Epic QR enhancements (§6).** Scott's call. Default proposal: add the three "high-value / concrete misstep risk" enhancements to align with the master checklist's known pain points; defer medium / low until pattern emerges from real provider use. **Important:** TSX comes from Scott — meridian-os should NOT edit the body; enhancements happen in Scott's source artifact and re-imported byte-identical (same protocol as MentorshipTracker iteration).
7. **Search ranking / synonyms.** The QR's `keywords` array is good. Are there primary-care-specific synonyms Noah wants surfaced (e.g., "F2" → "wildcard" / "asterisk navigation" — already partially done)?
8. **Future Scott artifacts on the launcher.** Are there other in-flight TSX artifacts Noah expects to ship as launcher apps in the next quarter? Knowing the inventory shapes whether the launcher needs to scale to 4 / 6 / 10 icons.

---

## 9. What this analysis explicitly is NOT

- A code change. The TSX file is untouched. Phase 1 implementation is a separate task.
- A merge of QR content into the master checklist or vice versa. The two have different purposes (reference vs curriculum) and should coexist.
- A redesign of the Mentorship Tracker. The tracker remains the accountability layer; this analysis adds a *third* leg, it doesn't reshape the existing two.
- A claim about which app the provider should "default to". Provider behavior across the three apps will inform that — too early to dictate.

---

## 10. Immediate next step (if Noah greenlights Phase 1)

1. Confirm questions §8.1, §8.2, §8.3 (greenlight, icon glyph, grid layout).
2. Port `~/Downloads/remixed-0de3d5eb.tsx` → `src/apps/epic-quick-reference/EpicQuickReferenceApp.tsx` byte-identical with `// @ts-nocheck`.
3. Build `src/shell/EpicQuickReferenceShell.tsx` mirroring `MentorshipTrackerShell.tsx` (chevron + scrollable container override).
4. Extend `LauncherApp` type and add the third icon to `Launcher.tsx`.
5. Wire the routing case in `main.tsx`.
6. Smoke-test in browser: launcher → Epic QR → search "smartphrase" → expand a result → click a related-guide pill → click `‹ meridian` chevron back to launcher → re-enter Epic QR persists last-opened app.
7. Document the change in `CLAUDE.md` once shipped (new "Epic Quick Reference app" subsection alongside the existing Mentorship Tracker app description).
8. Defer Phase 2 (curriculum-to-QR deep links) until master-checklist Option A ships.
9. Defer Phase 3 (peer-mentor handoff) — operational rollout, not code.

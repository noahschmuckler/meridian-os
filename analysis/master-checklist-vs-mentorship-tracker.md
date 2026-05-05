# Master Checklist vs Mentorship Tracker — Coverage Analysis

**Created:** 2026-05-05
**Source documents:**
- Master checklist: `~/Downloads/Master checklist.docx` (62 items, 17 sections, MD-edited omnibus)
- Tracker code: `src/apps/mentorship-tracker/MentorshipTrackerApp.tsx` (746 lines, Scott Freiberg's TSX byte-identical port)

**Goal:** confirm every master-checklist item is represented in the deployed Mentorship Tracker, in the right spot in the timeline, and assigned to the right owner. **No code changes** — this file is the source of truth for the gap inventory; implementation is a follow-up.

---

## 1. Top-line findings

1. **The two artifacts are different in kind.** The master checklist is a **check-OFF curriculum** of 62 specific Medical-Director-led teaching tasks ("Set up at least 5 Quick Action buttons", "Move the HCC column all the way to the left"). The tracker's Mentor track today is a **check-IN list** of generic supportive prompts ("Reviewed SmartPhrase or order set progress", "Addressed emerging concerns"). They're complementary, not overlapping.

2. **Coverage is sparse at the line-item level.** Of 62 master-checklist items, **0 map 1:1** to existing tracker items. ~6–8 are alluded to generically (e.g., "Discussed In Basket management setup" loosely covers items 11–14 about Quick Actions / message-pool / SmartPhrases). The remaining ~54 items are absent from the tracker.

3. **Three structural gaps:**
   - **No pre-start phase.** Items 1 (3-month-out template lock) and 2 (~2-week-out DAX setup) happen before the tracker's first phase (`w1`).
   - **No Medical-Director-curriculum track.** The tracker has Mentor / Ops / Questionnaires. "MD Reviews" is a derived percentage across mentor phases `[w4,w8,m3,m6,q3,q4]`, not its own checklist track. The master checklist items are mostly MD-led teaching, not mentor check-ins.
   - **No Office-Manager-onboarding track distinct from Ops.** Today's `OP` track is operational status assessment ("Volume ramping as expected?", "Billing cycle and denials?"). It does not host onboarding tasks the OM owns or partners on (item 4 first-week joint email, item 5 site tour, item 55 referral-list alert).

4. **Cadence mismatch with item 62.** The master checklist locks mentor cadence at 30 / 60 / 90 / 180 / 270 days. Tracker uses w1–w8 (weekly) → m3 / m4 / m5 / m6 / q3 (Month 9) / q4 (Month 12). The two converge for the long-tail (m3≈90, m6≈180, q3≈270, q4≈365) but the weekly cadence is finer-grained than item 62 specifies. Recommendation: keep weekly granularity for the first two months (it's useful) and add named "30/60/90/180/270" anchor markers on the Journey timeline so the cadence Noah committed to in writing is visible.

5. **Ownership is implicit and limited in current tracker.** `canChk = isOps ? isDir : (isDir || isMen)` — Ops items are MD-only, Mentor items are MD-or-mentor. No provider-self check-off (questionnaires are responses, not tasks). No Office-Manager actor exists in `USERS` at all. Master checklist has at least 4 ownership lanes (MD, Mentor, OM, Clinical Staff).

---

## 2. Recommended track structure (proposal — NOT implemented here)

Three options for surfacing the master checklist in the tracker. Choosing one is a design call for Noah.

**Option A — Add a fourth "MD Curriculum" track (recommended).** Non-destructive: Mentor / Ops / Questionnaires stay. New `MD` track lives alongside, hosts items 1–61. Item 62 stays mentor-cadence policy. Ownership: MD-only check-off (with two partner exceptions noted in item-by-item table). Adds a `Pre-Start` phase before `w1` for items 1–2.

**Option B — Replace generic Mentor-track items with the 62 master items.** Destructive: loses the supportive "how's it going" character that the current tracker is built around. Not recommended.

**Option C — Embed master items as sub-items inside existing phases.** Each w1 phase grows from 5 items to ~15 items by adding the master-checklist items keyed to that week. Fast to implement but conflates curriculum-vs-check-in semantics inside a single track.

**Recommended: Option A.** Rest of this document is written assuming Option A so the gap inventory is concrete. Re-mapping to B or C is mechanical if Noah picks a different option.

Under Option A, proposed phase additions:
- `pre0` — **Pre-Start (3 months out)**: item 1.
- `pre1` — **Pre-Start (~2 weeks out)**: item 2.
- Existing `w1`–`w8`, `m3`–`m12`, `q3`, `q4` retained.

Proposed actors in `USERS`:
- Director (`md1` Dr. Rivera) — exists
- Mentor (`mt1`, `mt2`) — exists
- Office Manager — **add** (one per site, owns Ops track + items 4/5/55 partner)
- Clinical Staff (e.g., MA/RN) — **add** (only for item 33 AWV walkthrough)

---

## 3. Item-by-item gap inventory

For each of the 62 master-checklist items: the canonical owner, the recommended tracker phase, whether the item is currently represented in the tracker (Y / Partial / N), and the action needed.

Legend:
- **Owner:** MD = Medical Director; Mentor = assigned mentor; OM = Office Manager; CS = Clinical Staff (MA/RN); Provider = new hire passive recipient.
- **Phase:** target tracker phase under proposed Option A structure.
- **Repr:** representation in current tracker. **N** = not present; **Partial** = thematically alluded to but not itemized; **Y** = explicitly itemized.
- **Action:** what needs to happen for full coverage.

### Pre-Start (3 Months Out)

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 1 | Confirm provider's schedule template (visit lengths, slot types, double-book rules, admin/charting blocks) at 3-mo pre-start conversation. Cement-of-expectations risk if delayed. | MD (with OM) | `pre0` | N | Add `pre0` phase; add as MD item; OM listed as partner-acknowledger. |
| 2 | Plan DAX Copilot setup ~2 wk before start; Day-1 instruction by MD. | MD (with OM scheduling) | `pre1` | N | Add `pre1` phase; add as MD item. |

### Provider Identity and Access

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 3 | Capture provider's Epic ID (5-digit; Epic menu > Session Information Report); give to provider for keyboard fallback if swipe/print fails. | MD | `w1` | Partial — `w1` "Confirmed Epic login and EHR access" covers access in general but not the ID-number capture and handoff. | Add MD item: "Captured Epic ID number and gave to provider." |

### First Week Email to New Hire and Office Manager

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 4 | First-week email to new hire + OM requesting/discussing: emergency protocols (codes, AED, evac, who calls 911); POC testing workflows (strep/flu/COVID/UA/glucose/Hgb); procedure inventory (joint inj / skin biopsy / I&D / cryo — supplies, billing, consent). | MD (sent to provider + OM); OM responds | `w1` | N | Single composite MD item: "Sent first-week site-info email to new hire + OM (emergency / POC / procedures)." Optionally three sub-items, one per topic, but a single composite reads cleaner. |

### Side-by-Side Time with Medical Director (Includes Site Orientation)

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 5 | Physical site tour (exam rooms, lab, supply, sample closet, vaccine fridge, AED) by office staff or OM. | OM (or office staff); MD confirms | `w1` | Partial — `w1` "Reviewed clinic layout and team intros" covers this generically. | Add explicit OM-owned item; MD-owned confirmation item. |
| 6 | Establish communication channels: OM, MD, and Marc (Senior Regional MD). | MD | `w1` | N | Add MD item. |
| 7 | Set up Epic Out-of-Office and in-basket coverage assignments for PTO. | MD | `w1` | N | Add MD item. |
| 8 | Review call schedule, after-hours triage line, urgent-issue patient instructions. | MD | `w1` | N | Add MD item. |

### Daily Workflow Foundations (Day 1 or 2 with Medical Director)

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 9 | Walk through daily huddle (timing, attendees, content); tie to closing care gaps as the reason it matters. | MD | `w1` | Partial — `w3` "Discussed care gap identification" covers care gaps but not the huddle structure or the "why" framing. | Add MD item to `w1`; consider keeping `w3` care-gap item as the follow-up check-in. |
| 10 | Walk through care gap identification on the daily schedule and how to close them in the visit. | MD | `w1` | Partial — see #9. | Add explicit MD item to `w1`. |

### In-Basket and Message Pool

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 11 | Walk through message-pool management including lab results. | MD | `w1` | Partial — `w2` "Discussed In Basket management setup" is generic. | Add explicit MD item to `w1`. |
| 12 | Set up ≥5 Quick Action buttons covering most incoming results. Reinforce these aren't typed individually — that's what makes them fast. | MD | `w1` | N | Add MD item. The "≥5 Quick Actions" target is a concrete check-off. |
| 13 | Create additional Quick Actions / SmartPhrases for routine guidance: BG control, BP control, cholesterol, exercise, repeat-lab timing. | MD | `w2` | Partial — `w2` "Reviewed SmartPhrase or order set progress" generic. | Add MD item to `w2`. |
| 14 | Teach response patterns for every in-basket category: staff messages, cosign orders, patient requests, MyChart, HCC dept, internal pharmacist, billing. | MD | `w1` | N | Add MD item to `w1`. |

### E/M, Billing, and HCC

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 15 | Rearrange LOS and E/M buttons for the new provider (very beginning). | MD | `w1` | N | Add MD item to `w1`. Note "very beginning" — first session. |
| 16 | Walk through level 3/4/5 billing; stress accurate level selection. | MD | `w1` | N | Add MD item. |
| 17 | Review E/M Pro use. | MD | `w1` | N | Add MD item. |
| 18 | Show where HCC codes appear in Epic and on the daily schedule. | MD | `w1` | N | Add MD item. |
| 19 | Move the HCC column all the way to the left of the schedule view. | MD | `w1` | N | Add MD item. |
| 20 | Review This Visit tab HCC management: agree / stable / disagree / managed-by-other-provider. Note majority should be "agree" — curated by team research. | MD | `w2` | N | Add MD item to `w2` (after the Day-1 setup of #19). |
| 21 | Cover CAHPS and HOS basics; tie to performance.<br>**Reminder to Scott:** reach out to Chris Langerhans for one-pager. | MD | `w2` | N | Add MD item; flag the Chris-Langerhans dependency in the item description. |

### Visit Charting Workflow

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 22 | Show vitals entry; confirm repeated when clinically indicated. | MD | `w1` | N | Add MD item. |
| 23 | Show CC entry; stress CC required for telemed billable. | MD | `w1` | N | Add MD item. |
| 24 | Show allergy entry. | MD | `w1` | N | Add MD item. |
| 25 | Show PMH/PSH/SH/FH entry; reinforce SH alongside the rest. | MD | `w1` | N | Add MD item. |
| 26 | Walk through cleaning/reconciling med list + dx list thoroughly; doing it makes future visits easier. | MD | `w1` | Partial — `w3` "Reviewed Problem List management" + `w6` "Discussed medication reconciliation" cover thematically. | Add MD item to `w1` for the initial walkthrough; keep `w3`/`w6` as follow-up check-ins. |
| 27 | Walk through writing/closing progress notes using SmartPhrases built into top-of-note buttons. | MD | `w1` | Partial — `w2` "Reviewed SmartPhrase or order set progress" generic. | Add MD item to `w1`. |
| 28 | Discuss creating new SmartPhrases from already-written/transcribed statements. | MD | `w2` | Partial — see #27. | Add MD item to `w2`. |
| 29 | Establish + provide a standard progress note that pulls vitals from last 3 visits (not just most recent). | MD | `w2` | N | Add MD item. |
| 30 | Show how to run a telehealth visit end-to-end. | MD | `w2` | N | Add MD item. |
| 31 | EKG ordering, performance, interpretation workflow. | MD | `w2` | N | Add MD item. |

### Annual Wellness Visit

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 32 | Show AWV SmartSet location, selection, AWV progress note. | MD | `w2` | N | Add MD item. |
| 33 | Have a clinical staff member walk new provider through AWV questionnaire so provider can complete one solo if needed. | CS (with MD scheduling) | `w3` | N | Add CS-owned item; MD-confirmed. **Only item with CS as primary owner — represents the new actor type.** |
| 34 | Reinforce running AWV themselves is not required, just useful. | MD | `w3` | N | Add MD item. |
| 35 | Below AWV note heading, all current specialists must be listed. | MD | `w3` | N | Add MD item. |
| 36 | Labs ordered in AWV (or otherwise) must attach to a diagnosis, not a screening code, so Medicare covers and patient isn't billed. | MD | `w2` | N | Add MD item to `w2` (general lab-ordering pattern, not AWV-specific). |
| 37 | Cover SDOH screening within reason as it ties into AWV SmartSet/questionnaire. | MD | `w3` | N | Add MD item. |

### Behavioral Health

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 38 | BH screening: PHQ-9, GAD-7, AUDIT — how they trigger, how to act on positive screens. Email LSW workflow. | MD | `w2` | N | Add MD item. **Note:** these three instruments are also the calculator-bubble family in Meridian-OS (Track 4a). Not relevant to the tracker but worth noting if a future cross-link surfaces. |

### Orders: Medications

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 39 | Show how to place medication orders. | MD | `w1` | N | Add MD item. |
| 40 | Show how to check pharmacy on Visit tab before signing. | MD | `w1` | N | Add MD item. |
| 41 | Show how to send meds to multiple pharmacies simultaneously. | MD | `w1` | N | Add MD item. |
| 42 | Show how to confirm med was actually transmitted. | MD | `w1` | N | Add MD item. |
| 43 | Cover 100-day vs 90-day refill protocol. Medicare meds at 100 days to prevent care gaps. | MD | `w1` | N | Add MD item. **Concrete, often-missed detail.** |
| 44 | Save medication orders with appropriate refill counts and dx attachments. | MD | `w1` | N | Add MD item. |

### Orders: Labs and Diagnostics

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 45 | Place lab orders as Now vs Future. | MD | `w1` | N | Add MD item. |
| 46 | LabCorp vs Quest selection (NJ-relevant). | MD | `w1` | N | Add MD item. |
| 47 | Spot/resolve red errors before signing. | MD | `w1` | N | Add MD item. |
| 48 | Medicare hard-stop bypass: Medicare-approved dx list (secure window) OR patient signed waiver (specific pull-down — checking "patient will sign" alone does not work). | MD | `w2` | N | Add MD item. **Concrete misstep risk — keep verbatim.** |
| 49 | Use CAC (calcium-score CT heart) as teaching example since never covered + bypass must be done correctly. | MD | `w2` | N | Add MD item. |

### Orders Outside of a Visit

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 50 | Cover the two pathways: ambulatory order vs telephone encounter. | MD | `w2` | N | Add MD item. |
| 51 | Ambulatory orders don't show in standard progress-notes view by default. Uncheck "Hide Additional Visits" to make them visible. | MD | `w2` | N | Add MD item. |
| 52 | Recommend telephone encounters when documentation matters; brief note explaining patient/staff request. | MD | `w2` | N | Add MD item. |

### Critical and Abnormal Results

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 53 | Critical/abnormal result management: abnormal pap, abnormal mammogram, critical labs. Closed-loop expectations. Reference the patient contract re: results-turnaround time. | MD | `w2` | N | Add MD item. **Patient-contract reference is concrete and durable.** |

### Referrals

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 54 | Use electronic referrals only. Front office addresses to schedule + track completion. | MD (with OM scheduling) | `w1` | Partial — `w5` "Reviewed referral and order routing" generic. | Add MD item to `w1`. Keep `w5` as follow-up. |
| 55 | Confirm an established referral list is built into provider's Epic orders. If not, alert OM. | MD | `w1` | N | Add MD item with OM-alert sub-action. |
| 56 | Choose the correct **specific** referral (individual provider or office location) — never generic. Generic referrals fall into an unattached basket and never get worked. | MD | `w1` | N | Add MD item. **Concrete misstep risk — keep verbatim.** |
| 57 | Default to Internal referral. Outgoing referral occasionally, only for non-group specialists. | MD | `w1` | N | Add MD item. |

### Order Sets and Templates

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 58 | Set up tailored order sets by disease type, age group, visit type (e.g., physical), and other categories. Time investment up front, big payoff. | MD | `w4` | Partial — `w3` "Reviewed order sets and preference lists" covers thematically. | Add MD item to `w4` (the build-out, distinct from `w3` review check-in). |

### Documentation and Performance Expectations

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 59 | Note closure timeliness expectations (24–72 hr); consequences of open encounters. | MD | `w1` | N | Add MD item. |

### Epic Power-User Items

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 60 | F2 navigation between SmartPhrase fields and asterisk placeholders. | MD | `w4` | N | Add MD item. **Single power-user item — likely room for more in future master-checklist iterations.** |

### Quality and Safety

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 61 | Incident reporting via RLdatix.<br>**Reminder to Scott:** get how-to from operations. | MD | `w2` | N | Add MD item; flag operations-handoff dependency in description. |

### Mentorship and Ongoing Check-Ins

| # | Item summary | Owner | Phase | Repr | Action |
|---|---|---|---|---|---|
| 62 | Establish protected, recurring mentor↔new-hire time on calendar at 30 / 60 / 90 / 180 / 270 days post-start. Email mentor + new hire + pertinent OMs to establish. | Mentor (with MD coordinating) | `w1` (initial setup) + ongoing | Partial — tracker phases m3≈90, m6≈180, q3≈270 align in spirit; w4≈30 and w8≈60 are the closest weekly anchors. The 30/60/90/180/270 specific commitments are not surfaced as named milestones. | Add Mentor-owned item to `w1`: "Calendared 30/60/90/180/270-day mentor check-ins; emailed mentor + new hire + OM(s)." Optionally add named anchors on the Journey timeline (`Day 30 ✓`, `Day 60 ✓`) so the cadence is legible without inferring from week counters. |

---

## 4. Coverage summary

| Bucket | Count |
|---|---:|
| Total master-checklist items | 62 |
| Currently represented (Y, 1:1) | **0** |
| Partially / thematically represented | **~10** (3, 5, 9, 10, 11, 13, 26, 27, 28, 54, 58, 62) |
| Not represented | **~52** |

**Items needing a new pre-start phase** (`pre0`/`pre1`): 1, 2.
**Items with non-MD or shared ownership:** 4 (MD + OM), 5 (OM + MD confirm), 33 (CS + MD), 54 (MD + OM scheduling), 55 (MD + OM alert), 62 (Mentor + MD coord).
**Items flagged as "concrete misstep risk" — keep verbatim when implementing:** 12 (≥5 Quick Actions), 19 (HCC column left), 43 (100-day Medicare refills), 48 (Medicare hard-stop bypass), 56 (specific referrals — generic basket).
**Items with Reminder-to-Scott dependencies (need external one-pagers / instructions):** 21 (CAHPS/HOS — Chris Langerhans), 61 (RLdatix — operations).

---

## 5. Open questions for Noah

1. **Track structure: Option A, B, or C** (see §2). Default recommendation is A: add a fourth "MD Curriculum" track non-destructively. Confirm before any code changes.
2. **`USERS` actors.** Today: `md1` (director), `mt1` / `mt2` (mentors). Add `om1+` (per-site Office Managers) and `cs1+` (Clinical Staff)? Or treat OM/CS as roles attached to existing actors without separate logins?
3. **Pre-Start phase rendering.** The Journey timeline today renders MP phases edge-to-edge from `w1`. Adding `pre0` / `pre1` shifts the visual zero point. Acceptable, or render pre-start as a separate "before Day 0" stub strip?
4. **30/60/90/180/270 named milestones (item 62).** Want them as additional pills on the Journey timeline alongside week labels, or as a separate "Item 62 commitments" badge row, or just as items inside the existing `w4`/`w8`/`m3`/`m6`/`q3` phases?
5. **Source-of-truth for the 62-item curriculum.** This document is the analysis artifact. When implementing, do you want the curriculum data to live in:
    - (a) Inline in `MentorshipTrackerApp.tsx` (matches today's pattern)?
    - (b) Extracted into `src/data/seed/mentorship-master-checklist.json` (matches the `src/data/seed/clinical-modules.json` pattern; supports future master-checklist re-edits without touching the TSX)?
    - **Recommendation:** (b). The master checklist is content that will iterate independently of the TSX; the JSON pattern is already established for clinical modules.
6. **Reminder-to-Scott dependencies on items 21 (CAHPS/HOS) and 61 (RLdatix).** Should those items be inserted with a pending-handoff flag (e.g., a 🔁 badge), or held until the underlying one-pagers are sourced?
7. **Item 4 first-week email.** One composite check-off ("Sent first-week site-info email"), or three sub-items (emergency / POC / procedures)? §3 default is composite for cleanliness; sub-items if you want each topic's discussion-with-OM tracked separately.

---

## 6. What this analysis explicitly is NOT

- A code change. The TSX file is untouched. A subsequent task can implement Option A by extending `MP` / adding a new constant array (e.g., `MD`) and a new track tab.
- A merge of master + tracker into a single rewritten checklist. The two have different purposes (curriculum vs check-in) and should coexist.
- A reweighting of the existing tracker items. The current Mentor-track items remain valid as supportive check-ins.

---

## 7. Immediate next step (if Noah greenlights Option A)

1. Decide questions §5.1, §5.2, §5.5 (track structure, actors, data location).
2. Extract this document's §3 table into structured JSON (`src/data/seed/mentorship-master-checklist.json` per recommendation §5.5b) keyed by phase.
3. Extend `MentorshipTrackerApp.tsx`: add `MD` track loaded from JSON; add `Pre-Start` phases; add OM/CS actors to `USERS` if needed; thread `mdPct` into the sidebar / comparison-grid / 4-metric-card surfaces.
4. Smoke-test in browser: log in as MD → confirm new track tab → check off a few items → confirm % rolls up.
5. Document the change in `CLAUDE.md` once shipped.

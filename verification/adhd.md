# ADHD Module — Verification Tracker

Working document for the `adhd` module in `src/data/seed/clinical-modules.json`. Not read by the app.

**Status: SIMPLIFIED-PASS COMPLETE — 2026-05-13.** Module bumped from schema 1.2.0 → 1.3.0 in this commit. Evidence-confirmation pass was completed prior to this work (referenced in `~/.claude/projects/-home-noahs-GitHub-Repos-meridian-os/memory/project_module_rewrites.md`); the 95-entry `references[]` superset from that earlier pass is preserved verbatim. This commit applies the **Simplification/Stratification Pass** defined in `/home/noahs/incoming_noah/meridian-module-simplification-standards.pdf` (Standards v1, 2026-05-12) using the v2 DOCX `/home/noahs/incoming_noah/ADHD-Stimulants-Inherited-v2.docx` as the canonical content source.

**Pipeline location:** Evidence-confirmation → **Simplified/Stratified Pass** (this commit) → Provider-ready.

**Major structural changes this pass:**
- Two-tier FAQ shape: each topic now has a `first_layer_html` scannable answer plus default-closed `sub_questions[]` "More detail" expanders (PDF Section 1, "Two-Tier Architecture").
- CV monitoring split out as its own escalation item + its own FAQ topic (was buried in `[functional]` per PDF Section 5 "Topic Splitting").
- Footer trimmed from a paragraph to **2 sentences** (advisory + jurisdiction-scope only); framework rationale moved to `context_strip` (PDF Section 2).
- Per-FAQ-entry `smartphrase_note` + `consult_decision_point` fields added (PDF Sections 6 + 7).
- Module-level `smartphrases[]` registry added — 1 confirmed (`.CSADHD-CONT`) + 5 flagged for future (`.CSADHD-SUD-AWARE`, `.CSADHD-PDMP-HOLD`, `.CSADHD-EARLYFILL-DISCUSS`, `.CSADHD-CEILING-CONT`, `.CSADHD-CONSULT`).
- Revision-artifact language purged ("the older module language…", "this is consistent with the updated evidence…", "an consult", CDC opioid framework analogy in FAQ body — see PDF Section 4).

---

## Evidence-sensitive claims — verification rows

Each row names a clinical claim that load-bears in the new prose, the strongest cited source in the 95-entry references list, and the verdict from the earlier evidence-confirmation pass. Rows are not re-verified in this commit; they are restated for traceability after the simplification rewrite.

| ID | Claim (as it appears in v2 prose) | Citation | Verdict |
|---|---|---|---|
| pdmp-ny | NY I-STOP requires PMP check before every prescribing event for Schedule II | ny-pbh-3343a | confirmed (pre-pass) |
| pdmp-nj | NJ requires PMP check at first prescription + quarterly during therapy | nj-njsa-45-1-46-1 | confirmed (pre-pass) |
| sud-asam-supports | ASAM/AAAP 2024 supports stimulant therapy in co-occurring ADHD/SUD with monitoring | asam-aaap-2024 | confirmed (pre-pass) |
| sud-aafp-contraindicates | AAFP 2024 lists active drug addiction among stimulant contraindications | aafp-2024 | confirmed (pre-pass) — guideline tension flagged inline |
| sud-mortality | Stimulant tx in adult ADHD+SUD assoc. with fewer hospitalizations + reduced mortality | baweja-jaacap-2025 | confirmed (pre-pass) |
| sud-cud-response | CUD substantially reduces ADHD pharmacotherapy response (OR 0.20–0.24) | carbone-jcm-2026 | confirmed (pre-pass) |
| sud-bup-overdose | Stimulant + buprenorphine assoc. with REDUCED overdose risk (aHR 0.47) in Canadian cohort | young-bc-addiction-2025 | confirmed (pre-pass) |
| dx-cepeda-20pct | ~20% of prescription-stimulant misusers exaggerate symptoms at intake | cepeda-ajdaa-2015 | confirmed (pre-pass) |
| dx-discontinuation | Significant ADHD worsening on stopping methylphenidate after 2+ years | matthijssen-ajp-2019 | confirmed (pre-pass) |
| dose-amph-plateau | Amphetamine symptom-reduction plateau at ~30–35 mg/day; doses above FDA label offer no additional benefit | jama-psych-farhat2024 | confirmed (pre-pass) |
| dose-ceiling-adderall-ir | Adderall IR adult max 40 mg/day per FDA label | fda-adderall-ir | confirmed (pre-pass) |
| dose-ceiling-adderall-xr | Adderall XR 20 mg/day recommended; up to 60 mg studied with no added benefit | fda-adderall-xr | confirmed (pre-pass) |
| dose-ceiling-mph | Methylphenidate IR/ER (non-Concerta) adult max 60 mg/day | fda-methylphenidate | confirmed (pre-pass) |
| dose-ceiling-concerta | Concerta adult max 72 mg/day (distinct from other MPH) | fda-concerta | confirmed (pre-pass) |
| dose-ceiling-vyvanse | Vyvanse adult max 70 mg/day; renal adjustment 50 mg severe / 30 mg ESRD | fda-vyvanse | confirmed (pre-pass) |
| cv-zhang-swedish | Swedish 14-yr cohort: ~4%/yr incremental CVD risk first 3 yrs, then plateau; HTN + arterial-driven | jama-psych-zhang2024 | confirmed (pre-pass) |
| cv-farhat-nonstim | Atomoxetine + viloxazine produce BP/HR effects of comparable magnitude to stimulants | lancet-psych-farhat2025 | confirmed (pre-pass) |
| anx-coughlin-rcts | Meta-analysis of 23 RCTs: stimulants reduce treatment-emergent anxiety (RR 0.86) | coughlin-jcap-2015 | confirmed (pre-pass) |
| bipolar-viktorin | MPH monotherapy in bipolar: HR 6.7 for mania; MPH + mood stabilizer: HR 0.6 | viktorin-ajp-2017 | confirmed (pre-pass) |
| comorbidity-hartman | Adult ADHD comorbidity ORs 4.5–8.7 for anxiety, mood, SUD | hartman-nbr-2023 | confirmed (pre-pass) |
| ptsd-baweja-jad | Stimulant tx in ADHD+PTSD assoc. with favorable outcomes (HRs 0.52–0.74) | baweja-jad-2026 | confirmed (pre-pass) |
| dsm-tr-criteria | DSM-5-TR distinguishes ADHD by developmental onset + persistence | dsm-5-tr-2022 | confirmed (pre-pass) |
| cfr-1306-12 | 21 CFR §1306.12 permits multiple sequential Schedule II Rx totaling 90 days supply | cfr-1306-12 | confirmed (pre-pass) |
| cfr-1306-04 | 21 CFR §1306.04 governs Schedule II Rx validity by "legitimate medical purpose" | cfr-1306-04 | confirmed (pre-pass) |
| no-early-fill-cutoff | No CDC/SAMHSA/ASAM/AAFP/FDA/DEA numeric early-fill cutoff for stimulants | (negative-evidence claim) | confirmed (pre-pass) — restated in callout |
| cannabis-use-vs-cud | Adult ADHD cannabis use is common and non-actionable; CUD is the actionable axis | ryan-jad-2025 | confirmed (pre-pass) |
| neuropsych-not-required | Neuropsych testing not required for adult ADHD dx; clinical dx | aafp-2024 | confirmed (pre-pass) |

**Follow-up tasks (deferred from this commit):**
- Spot-audit `[ref:X]` markers in the new prose against the rendered output to confirm no orphaned IDs (run `getReferencesUsedIn` on each FAQ and confirm coverage).
- Consider porting the remaining `.CSADHD-*` future SmartPhrases to confirmed status once each clinical decision point is reified (PDMP-HOLD, EARLYFILL-DISCUSS, CEILING-CONT, CONSULT).
- When the Consult Builder gains an external-prefill API, wire each FAQ's `consult_decision_point.consult_id` to spawn the builder pre-loaded.

---

## Section 8 simplification-pass checklist (this commit's stamp)

Process checklist from the standards PDF — one-time stamp for this commit, not an ongoing tracker.

- [x] **Step 1 — Read and inventory.** Full DOCX text extracted; revision-artifact language flagged; CV-monitoring topic-split identified.
- [x] **Step 2 — Surface layer.** Checklist items revised per Section 2 rules (past tense for actions taken, present for confirmed states, no hedge words, PDMP-as-source for fill-pattern data). Green zone narrative trimmed to 3 sentences ending with the institutional support statement. SmartPhrase trigger confirmed. Escalation items each a single trigger statement. Footer rewritten to 2 sentences. Context section absorbed regulatory + framework rationale.
- [x] **Step 3 — Detail layer, first-layer FAQ.** Each topic's `first_layer_html` chooses table / bullets / prose / callout per Section 3 decision rule. Answer-first rule applied — caveats follow the bottom line. Callouts reserved for guideline tension (SUD AAFP-vs-ASAM/AAAP) and "no numeric cutoff" framing (early-fills).
- [x] **Step 4 — Detail layer, sub-questions.** Each sub-question is a first-person provider question. Distinct clinical scenarios (lost medication ≠ vacation early-fill); first-layer content not duplicated.
- [x] **Step 5 — SmartPhrase + Consult decision points.** Module-level `smartphrases[]` registry populated (1 confirmed + 5 future). 7 of 9 FAQ entries carry a `consult_decision_point` per Section 7's trigger table.
- [x] **Step 6 — Final review.** No revision-artifact language remains. Footer is 2 sentences. All 9 topic entries have first-layer + ≥1 sub-question. References preserved at 95-entry superset. `.docx` is the v2 file at `/home/noahs/incoming_noah/ADHD-Stimulants-Inherited-v2.docx`.

---

## Cross-references

- Standards PDF: `/home/noahs/incoming_noah/meridian-module-simplification-standards.pdf`
- Content DOCX: `/home/noahs/incoming_noah/ADHD-Stimulants-Inherited-v2.docx`
- Future UI reference (Scope C, deferred): `/home/noahs/incoming_noah/meridian-adhd-faq-prototype.jsx`
- Implementation plan: `/home/noahs/.claude/plans/mutable-stirring-conway.md`

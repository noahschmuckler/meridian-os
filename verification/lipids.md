# Lipid Module — OpenEvidence Verification Tracker

Working document for evidence-reviewing the `lipid-management` module in `src/data/seed/clinical-modules.json` (lines 4–252) before finalization. Not read by the app. See plan at `~/.claude/plans/i-d-like-to-focus-cozy-cake.md` for context and the `verification/benzos.md` precedent for tracker format.

**Status: SIMPLIFICATION-PASS COMPLETE — 2026-05-26.** Module bumped schema 1.1.0 → 1.3.0. Evidence-confirmation pass (66-entry `references[]` superset) was completed earlier and is **preserved verbatim** via the references-merge policy. This pass applied the **Simplification/Stratification Pass** (Standards v1, `/home/noahs/incoming_noah/meridian-module-simplification-standards.pdf`) from the Claude-chat-authored readability DOCX `/home/noahs/incoming_noah/lipid-management-revised.docx` (16 topics → two-tier `first_layer_html` + `sub_questions[]`). The readability DOCX shipped **with zero inline `[ref:slug]` markers**; all 164 inline markers (57 unique refs) were **hand-re-injected claim-by-claim** from the 1.1.0 prose (build scripts `/tmp/build_lipid_v13.py` + `/tmp/inject_lipid_refs.py` + `/tmp/add_lipid_smartphrases.py`; 115 rules, all anchors matched once, 0 undeclared). 8 refs orphaned (claims dropped by the readability pass — see Section 8); all retained in the bibliography. SmartPhrases registry added from `/home/noahs/incoming_noah/lipid-smartphrases.pdf` (1 confirmed + 7 future, **all carrying full text** for preview/testing per Noah's instruction). Historical evidence-confirmation log follows.

**Prior status (evidence-confirmation, historical): started 2026-05-04.** Meta-pass + Bundles 1 + 2 + 3 processed (52 tracker rows, 36 confirmed citations, 1 anticipated anchor confirmed). Bundle 4 prompt drafted (statin indication, SDM, CAC, statin-hesitant counseling, intolerance/nocebo, T2D, SUPD HEDIS, payer realities) and **includes DD3 as a single trailing claim** (non-VHR ASCVD COR 2a tighter LDL goal — truncated mid-quote in Bundle 3 Claim 1). Awaiting Bundle 4 OE paste-back. 6 bundles + meta-pass scoped (no controlled-substance regulatory pass needed since lipid is purely clinical). The PDF at `~/Downloads/lipid-old-new.pdf` (Scott Freiberg's "Compare Old vs New Lipid Guidelines", drafted to address Scott Hines' QI ask) is **input** to Bundles 2/3/5 — its substance lands in the v1.1.0 module body; its "old vs new" pedagogical framing seeds a new in-module FAQ topic (`whats-new-2023-2024`).

**Workflow:** Run the meta-pass prompt first (uses current module content verbatim). Then run Bundle 1 (Risk stratification — PREVENT vs PCE) as the pilot to calibrate prompt wording. Iterate if needed. Then run Bundles 2–6. Log each claim's verdict in the tracker table at the bottom. Once verdicts are captured, a follow-up coding session will rewrite the lipid module JSON with `references[]` and `[ref:X]` markers in the prose, plus add the new `whats-new-2023-2024` FAQ topic.

**Framing note:** All prompts ask for genuine pushback, not confirmation. If OE comes back "everything is correct," re-run with tighter wording — blanket confirmation usually means the prompt was too leading.

**Module under review:** Primary-care-facing lipid management for cardiovascular risk reduction. Audience: PCP at the visit where lipid review is on the agenda — initiating statin, adjusting therapy in a patient not at goal, escalating to ezetimibe / PCSK9 inhibitor / bempedoic acid / inclisiran, or counseling a statin-hesitant patient on CAC-directed shared decision-making. Module covers PREVENT-based risk stratification, statin indication, LDL targets, advanced lipid markers (ApoB, Lp(a)), and SUPD HEDIS reporting.

**Scope difference vs benzos:** No regulatory layer — lipid claims are purely clinical / payer-coverage. The `controlled-substances-ny-nj.md` cross-module pass does not apply.

---

## Meta-pass prompt (run first)

```
I'm finalizing a primary care decision-support module on lipid
management and cardiovascular risk reduction. The content below was
drafted in mid-2026 against the AHA/ACC PREVENT calculator (2023) and
the 2018 AHA/ACC Cholesterol Guidelines and has not been formally
evidence-reviewed against the most recent (2022–2024) updates.

Please read it end-to-end and flag any statement that is: factually
inaccurate, outdated relative to the 2022 ACC Expert Consensus Decision
Pathway, the 2023 AHA PREVENT validation paper, or the 2023–2024
ACC/AHA cholesterol guideline updates; lacking evidence support;
controversial among specialists; or oversimplified in a way that could
mislead a primary care provider. In particular, please pressure-test:

  1. Whether the four PREVENT risk-tier thresholds (Low <5%,
     Borderline 5–7.5%, Intermediate 7.5–20%, High >20%) match current
     guideline language;
  2. Whether the Very High Risk definition I've used (established ASCVD
     plus a second major event OR one prior ASCVD event combined with
     diabetes / CKD / poorly controlled HTN / current smoking / LDL ≥100
     on max statin) matches the 2022 ACC Expert Consensus criteria;
  3. Whether the LDL targets per tier (<55 VHR, <70 High, <70–100
     Intermediate) reflect current guideline language;
  4. Whether the escalation sequence (max statin → ezetimibe → PCSK9)
     is now considered a formal sequence, and whether bempedoic acid
     and inclisiran should be referenced;
  5. Whether the module should treat non-HDL-C and apolipoprotein B as
     co-primary treatment targets alongside LDL-C (as several recent
     statements suggest), and what thresholds and indications apply;
  6. Whether risk-enhancing factors for borderline-risk patients have
     changed under PREVENT;
  7. Whether the SUPD HEDIS framing (statin in persons with diabetes,
     ~90% benchmark) is current;
  8. Whether ApoB and Lp(a) ordering indications and Lp(a)
     once-per-lifetime guidance are current.

For each flag, cite the specific source (guideline name, year, section,
page) and give the corrected framing in operational language a PCP
would document. Include any payer-coverage realities (commercial vs
Medicare prior authorization for ApoB, Lp(a), CAC, PCSK9 inhibitors,
inclisiran, bempedoic acid) that should be reflected in the module.

Content:

LANDING:
Clinical decision support for lipid management and cardiovascular
risk reduction in primary care. Use this module when evaluating a new
patient on lipid therapy, initiating statins, or reviewing a patient
not at LDL goal. Content is based on the AHA/ACC PREVENT Calculator
(2023) and the 2018 AHA/ACC Cholesterol Guidelines.

CHECKLIST (verify all four before deciding):
1. ASCVD risk tier calculated using PREVENT Calculator
2. Statin indication addressed and documented
3. LDL target identified and compared to current value
4. Medication plan documented with next follow-up

GREEN ZONE (all four checked → continue with documented plan):
Risk tier calculated, statin indication addressed, LDL goal
identified, and medication plan documented. Patient is either at goal
or has an active intensification plan in place. Follow-up interval
appropriate to risk tier. SmartPhrase .lipidreview.

ESCALATIONS (escalate if any apply):
1. LDL ≥190 mg/dL regardless of calculated risk score.
2. Not at LDL goal on maximally tolerated statin.
3. Borderline/intermediate risk patient is statin-hesitant.
4. Patient meets criteria for Very High Risk reclassification.
5. Advanced lipid markers indicated (ApoB, Lp(a)).

CONTEXT (organizational standard):
AHA/ACC PREVENT Calculator is the required organizational risk
stratification tool, replacing Pooled Cohort Equations. Epic BPA
integration targeting October/November 2026. Until live, calculate
manually at acc.org/PREVENT. SUPD (Statin Use in Persons with
Diabetes) is a tracked VBC metric — HEDIS benchmark ~90%. All
diabetic patients must have statin therapy addressed and documented
at each visit.

FAQS:

[Risk Stratification]

Q1: Why is PREVENT replacing the Pooled Cohort Equations?
A1: PREVENT incorporates kidney function (eGFR) and metabolic factors,
and removes race as a variable — reducing known overestimation in
certain populations. It is the 2023 AHA/ACC standard and Crystal Run's
required organizational tool.

Q2: What are the four risk tiers and their thresholds?
A2: Low: <5% — no statin indicated. Borderline: 5–7.5% — shared
decision-making; statin reasonable if LDL ≥70 plus risk enhancers.
Intermediate: 7.5–20% — initiate statin. High: >20% — high-intensity
statin, no shared decision-making required.

Q3: What are risk-enhancing factors for borderline-risk patients?
A3: Family history of premature ASCVD, hs-CRP ≥2 mg/L, ABI <0.9,
elevated Lp(a) or ApoB. Presence of any of these at borderline risk
(5–7.5%) with LDL ≥70 mg/dL supports statin initiation.

[Statin Indication]

Q1: When is high-intensity statin indicated without shared
decision-making?
A1: Two automatic indications: (1) 10-year risk >20%, or (2) LDL ≥190
mg/dL regardless of risk score. Both are standard of care — document
and initiate without requiring patient agreement process beyond
standard informed consent.

Q2: When is shared decision-making required?
A2: All borderline-risk patients (5–7.5%). Document the conversation,
the patient's preference, and the clinical factors considered. CAC
score may support or defer initiation — CAC of 0 supports deferral;
CAC >100 or ≥75th percentile supports initiation.

Q3: What is the SUPD requirement for diabetic patients?
A3: Statin Use in Persons with Diabetes is a HEDIS-tracked VBC metric
with an organizational benchmark of ~90%. Every diabetic patient must
have statin therapy addressed and documented at each visit, even if
the patient declines or is intolerant.

[LDL Targets]

Q1: What are the LDL targets by tier?
A1: Very High Risk: <55 mg/dL. High Risk: <70 mg/dL. Intermediate
Risk: <70–100 mg/dL depending on risk-enhancing factors. Borderline
Risk: shared decision-making — statin reasonable when LDL ≥70 plus
risk enhancers.

Q2: What defines Very High Risk?
A2: Established ASCVD plus a second major cardiovascular event, OR
one prior ASCVD event plus any of the following: diabetes, CKD,
poorly controlled hypertension, current smoking, or LDL ≥100 mg/dL
on maximally tolerated statin. Note: prior MI alone is High Risk;
any comorbidity escalates to Very High Risk.

[Medication Plan]

Q1: What must be included in the medication plan documentation?
A1: Current statin name and intensity (low / moderate / high),
whether patient is at LDL goal, next step if not at goal (intensify
statin, add ezetimibe, or refer), and planned follow-up interval.
Fasting lipid panel at 4–12 weeks after any change is standard.

Q2: What statin intensity classifications are used?
A2: High-intensity: Rosuvastatin 20–40 mg, Atorvastatin 40–80 mg.
Moderate-intensity: Rosuvastatin 5–10 mg, Atorvastatin 10–20 mg,
Simvastatin 20–40 mg. Low-intensity: Simvastatin 10 mg, Pravastatin
10–20 mg — generally insufficient for high or very high risk
patients.

[LDL ≥190]

Q1: What action is required for LDL ≥190 mg/dL?
A1: Initiate high-intensity statin immediately — no shared
decision-making required, no risk score threshold applies. Consider
evaluation for familial hypercholesterolemia (FH). If LDL remains
≥100 mg/dL on maximally tolerated statin, add ezetimibe and consider
PCSK9 inhibitor referral to cardiology.

[Not at LDL Goal]

Q1: What is the escalation sequence when a patient is not at LDL
goal?
A1: Step 1: confirm adherence and maximize statin dose. Step 2: add
ezetimibe 10 mg daily — proven LDL reduction of 15–20%. Step 3: if
still not at goal, refer to cardiology for PCSK9 inhibitor
consideration (alirocumab, evolocumab). PCSK9 inhibitors require
prior authorization and documented statin intolerance or failure.

[Statin-Hesitant]

Q1: When is CAC scoring appropriate?
A1: Ages 40–75 with borderline to intermediate risk (5–20%) who are
hesitant about statin initiation. CAC of 0 supports deferral with
reassessment in 5–7 years. CAC >100 or ≥75th percentile for age/sex
supports initiation. Document the CAC result and the patient's
decision in the chart.

Q2: Is CAC covered by insurance?
A2: Coverage confirmation is pending with the payer team. Verify
before ordering. Cost is typically $75–150 out of pocket when not
covered.

[Very High Risk Reclassification]

Q1: What triggers Very High Risk reclassification?
A1: Established ASCVD plus a second major event, OR any prior ASCVD
event combined with: diabetes, CKD, poorly controlled hypertension,
current smoking, or LDL ≥100 mg/dL on maximally tolerated statin.
Reclassification changes LDL target from <70 to <55 mg/dL and makes
PCSK9 inhibitor referral appropriate if goal is not met.

Q2: Is cardiology referral required for Very High Risk patients?
A2: Not automatically required, but strongly consider referral when
LDL goal (<55 mg/dL) is not being met on maximally tolerated statin
plus ezetimibe.

[Advanced Lipid Markers]

Q1: When are ApoB and Lp(a) indicated?
A1: ApoB: indicated for High and Very High Risk patients to assess
residual risk beyond LDL, particularly when LDL appears controlled
but cardiovascular risk remains unclear. Lp(a): indicated once per
lifetime for all patients with premature ASCVD, strong family
history, or LDL ≥190 not fully explained by diet/secondary causes.

Q2: Is ordering ApoB or Lp(a) currently approved?
A2: Coverage and indications are pending confirmation with the payer
team. Do not embed in order sets or SmartSets until confirmed.
Manual ordering with documented clinical indication is acceptable in
the interim.
```

**Meta-pass findings:**

OE response received 2026-05-04. Below is the flag-by-flag evidence review extracted from OE, with each flag mapped to the affected tracker row(s). 8 primary flags + 7 secondary findings; all generate substantive tracker rows. None are deferred (no regulatory layer in lipid module → no parallel-file workstream).

**Dominant new reference:** the **2026 ACC/AHA Dyslipidemia Guideline** (published March 2026; *Circulation* + simultaneous *JACC* publication) is referenced in 8 of 8 primary flags + 6 of 7 secondary flags. **It supersedes both the 2018 Cholesterol Guideline and (for several decisions, including the rigid ezetimibe → PCSK9 sequence) the 2022 ACC ECDP.** It is the central new citation across the rewrite.

**Highest-priority corrections (per OE summary):**
- Flag 1 — PREVENT 4 risk tiers wrong; the current values are old PCE thresholds. New PREVENT thresholds: Low <3% / Borderline 3% to <5% / Intermediate 5% to <10% / High ≥10%
- Flag 4 — escalation sequence is no longer rigid (2026 guideline explicitly removes the ezetimibe-must-precede-PCSK9 mAb requirement); bempedoic acid + inclisiran missing entirely
- Flag 5 — non-HDL-C now formally co-primary target alongside LDL-C (departure from 2018 percentage-reduction-only framing); ApoB COR 2a as secondary/confirmatory target after primary goals met
- Flag 8 — Lp(a) is **COR 1 once-in-all-adults** per 2026 guideline (not selected populations as currently scoped)

---

**Flag 1 — Risk-Tier Thresholds (PREVENT)**

Affects faqs.risk-tier.q2 + faqs.statin-indication.q1 (and, by cascade, every >20% high-risk trigger throughout the module).

**Verdict: Needs revision.** The module's four PREVENT risk tiers (Low <5% / Borderline 5–7.5% / Intermediate 7.5–20% / High >20%) are the **old PCE thresholds from the 2018 guideline**, not the PREVENT thresholds. The 2026 ACC/AHA Dyslipidemia Guideline provides an explicit crosswalk and new PREVENT-based categories: **Low <3% / Borderline 3% to <5% / Intermediate 5% to <10% / High ≥10%**.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] These lower thresholds reflect the ~40–50% lower risk estimates produced by PREVENT compared to PCE for the same risk-factor profile.

**Corrected framing for the live module:** "Using the PREVENT-ASCVD equations, categorize 10-year ASCVD risk as Low (<3%), Borderline (3% to <5%), Intermediate (5% to <10%), or High (≥10%). These lower thresholds reflect the ~40–50% lower risk estimates produced by PREVENT compared to the PCE for the same risk-factor profile."[ref:acc-aha-dys-2026]

**Action:** Rewrite per OE — replace the 4-tier table in `faqs.risk-tier.q2`, the >20% trigger in `faqs.statin-indication.q1`, and any module-wide tier callouts. **This is the cascade trigger** for Rows 12 and 17.

---

**Flag 2 — Very High Risk Definition Incomplete**

Affects escalation.very-high-risk + faqs.very-high-risk.q1 + faqs.ldl-target.q2.

**Verdict: Needs revision.** The module's VHR definition (established ASCVD + 2nd major event OR 1 ASCVD event + DM/CKD/poorly-controlled HTN/current smoking/LDL ≥100 on max statin) is partially correct but materially incomplete. Per the 2022 ACC ECDP Table 1 and the 2026 guideline, VHR criteria the module **omits**: (a) age ≥65; (b) heterozygous familial hypercholesterolemia (HeFH); (c) prior CABG or PCI outside the index event; (d) history of congestive heart failure. The LDL threshold should read **≥100 mg/dL despite maximally tolerated statin AND ezetimibe** (module omits "+ ezetimibe"). The module says "poorly controlled hypertension" — actual criterion is "hypertension."[ref:acc-2022-decisionpathway][ref:acc-aha-dys-2026]

**Corrected framing for the live module:** "Very High Risk = history of ≥2 major ASCVD events (recent ACS within 12 months, prior MI, ischemic stroke, symptomatic PAD with ABI <0.85 or prior revascularization/amputation), OR 1 major ASCVD event + ≥1 high-risk condition: age ≥65, HeFH, prior CABG/PCI beyond the index event, diabetes, hypertension, CKD (eGFR 15–59), current smoking, LDL-C ≥100 mg/dL on maximally tolerated statin + ezetimibe, or history of HF."[ref:acc-2022-decisionpathway][ref:acc-aha-dys-2026]

**Action:** Rewrite per OE — expand the VHR list across all three render sites; tie LDL threshold to "max statin + ezetimibe" specifically.

---

**Flag 3 — LDL Targets Per Tier Outdated and Incomplete**

Affects faqs.ldl-target.q1 + escalation.not-at-goal.

**Verdict: Verified with nuance / Needs revision.** The current targets (<55 VHR, <70 High secondary prevention, <70–100 Intermediate) are directionally correct for secondary prevention but miss the 2026 guideline's major change: **non-HDL-C goals are now co-primary targets alongside LDL-C**, and **primary prevention now has explicit LDL-C goals** (departure from the 2018 guideline's percentage-reduction-only framing).[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] The "Intermediate <70–100" framing is also vague — the 2026 guideline gives a single target of **<100 mg/dL** for borderline/intermediate primary prevention.

**Corrected framing for the live module:** Add non-HDL-C goals to every tier row. Replace "<70–100 Intermediate" with single value "<100 mg/dL" for borderline/intermediate primary prevention. Maintain LDL-C <55 VHR (unchanged) but add corresponding non-HDL-C target. (Awaiting Bundle 3 specifics for the full per-tier non-HDL-C numerics.)

**Action:** Rewrite per OE + Bundle 3 — restructure the targets-by-tier table around LDL-C + non-HDL-C as co-primary; resolve "<70–100" to a single value; add primary-prevention LDL-C goals. Likely promotes to a proper HTML `<table>` (asset T2 in the asset inventory).

---

**Flag 4 — Escalation Sequence No Longer Rigid; Bempedoic Acid + Inclisiran Missing**

Affects faqs.not-at-goal.q1 + escalation.not-at-goal.

**Verdict: Disproved as a strict sequence.** The module presents a rigid Step 1 → Step 2 (ezetimibe) → Step 3 (PCSK9) sequence. **The 2026 guideline explicitly removes the requirement that ezetimibe must precede a PCSK9 mAb.**[ref:acc-aha-dys-2026] Direct quote: *"The revised recommendations no longer require that ezetimibe be added to statin therapy prior to initiating a PCSK9 mAb, and consideration of therapy may be based on degree of LDL-C lowering required and patient preference."*

The module entirely omits two now-guideline-supported agents:
- **Bempedoic acid (Nexletol)** — FDA-approved CV-risk reduction in statin-intolerant pts with established CVD or high CV risk; CLEAR Outcomes 2023 trial showed MACE reduction; 2026 COR 2a for addition to statin ± ezetimibe ± PCSK9 mAb in VHR.[ref:clear-outcomes-2023][ref:acc-aha-dys-2026]
- **Inclisiran (Leqvio)** — FDA-approved for LDL-C lowering in ASCVD/HeFH; 2026 COR 2a as reasonable for those unable to tolerate or obtain PCSK9 mAbs or who prefer twice-yearly dosing; CV outcomes trials (ORION-4, VICTORION-2P) pending.[ref:fda-orange-book][ref:acc-aha-dys-2026]

**Corrected framing for the live module:** "After maximally tolerated statin, select add-on therapy based on degree of LDL-C lowering needed and patient preference: ezetimibe (~18–24% additional LDL-C reduction), PCSK9 mAb (~50–60% additional reduction), or bempedoic acid (~17–20% reduction). These may be used in combination. Inclisiran is reasonable for patients who cannot tolerate or access PCSK9 mAbs or prefer twice-yearly dosing. Ezetimibe no longer must precede PCSK9 mAb initiation."[ref:acc-aha-dys-2026][ref:clear-outcomes-2023]

**Payer-coverage operational note:** PCSK9 mAbs (evolocumab, alirocumab) and inclisiran universally require PA on commercial + Medicare; typical PA requires documented failure/intolerance of maximally tolerated statin ± ezetimibe + LDL-C above threshold. Bempedoic acid generally requires PA on commercial; Medicare Part D coverage varies by formulary. **Inclisiran is administered in-office and billed under Medicare Part B (buy-and-bill)** — may simplify access vs PCSK9 mAbs.

**Action:** Rewrite per OE — remove the rigid sequence framing; add bempedoic acid and inclisiran as named agents (Rows 15, 16); capture the buy-and-bill differentiator for inclisiran.

---

**Flag 5 — Non-HDL-C and ApoB as Treatment Targets**

Affects new FAQ topic `co-primary-targets` (currently doesn't exist) + faqs.advanced-markers.q1.

**Verdict: Add new content.** The module does not mention non-HDL-C or ApoB as treatment targets. The 2026 guideline **formally reinstates LDL-C and non-HDL-C as co-primary treatment goals** (a major departure from 2018 percentage-reduction framing).[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] ApoB is positioned as a secondary/confirmatory target:
- ApoB measurement is **COR 2a** *"in adults on LLT, particularly those with ASCVD, CKM syndrome, type 2 diabetes, and/or elevated TG, to guide decisions regarding further therapeutic intensification once LDL-C and/or non-HDL-C goals are achieved."*[ref:acc-aha-dys-2026]
- For severe hypercholesterolemia with ASCVD and FH, **ApoB goal of <55 mg/dL** mentioned once LDL-C and non-HDL-C goals are met.
- ApoB most useful when there is **discordance** between LDL-C and particle number (elevated TG, diabetes, metabolic syndrome).

**Corrected framing for the live module:** Add a new FAQ topic `co-primary-targets` covering LDL-C + non-HDL-C as co-primary, ApoB as secondary/confirmatory once primary goals met, and discordance scenarios. Add non-HDL-C goals to every tier row. Add ApoB <55 endpoint for severe hypercholesterolemia + ASCVD/FH.

**Payer-coverage operational note:** ApoB is a standard lab test covered by most commercial + Medicare plans without PA. Lp(a) similarly covered as a standard lab test (some plans may require diagnosis code).

**Action:** Add new content — new FAQ topic + augmentation of existing target tables (Rows 5, 19, 20).

---

**Flag 6 — Risk-Enhancing Factors List Outdated**

Affects faqs.risk-tier.q3.

**Verdict: Needs revision.** The module's list (family hx of premature ASCVD, hs-CRP ≥2, ABI <0.9, elevated Lp(a)/ApoB) is incomplete relative to the 2026 guideline's Table 13:[ref:acc-aha-dys-2026]

- Family history of premature ASCVD (kept)
- **Higher-risk ancestry (e.g., South Asian, Filipino) — new**
- **High polygenic risk — new**
- Chronic inflammatory diseases (SLE, RA, advanced psoriasis, inflammatory arthritis)
- Lp(a) ≥125 nmol/L or ≥50 mg/dL
- hsCRP ≥2 mg/L on >1 occasion
- TG persistently ≥175 nonfasting or ≥150 fasting
- **CKM syndrome — new framing**
- LDL-C persistently 160–189 mg/dL, non-HDL-C 190–219 mg/dL, or ApoB ≥120 mg/dL
- Reproductive risk markers (premature menopause, preeclampsia, gestational diabetes, gestational HTN, preterm delivery) — **expanded**

**ABI <0.9 is no longer in the 2026 standalone risk-enhancer table** (was in the 2018 list — symptomatic PAD with ABI <0.85 is captured under VHR major events instead). Risk enhancers are now formally recommended for **borderline-risk patients (3% to <5%) specifically** with COR 2a. The 2018 guideline applied them to both borderline and intermediate; 2026 focuses formal recommendation on borderline.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] The module's "LDL ≥70 plus risk enhancers" prerequisite at borderline is **not in the 2026 guideline**.

**Corrected framing for the live module:** Replace the risk-enhancers list with the 2026 Table 13 set. Drop ABI <0.9 as a standalone. Restrict the formal "supports statin initiation" recommendation to the **borderline tier** (COR 2a). Remove the LDL ≥70 prerequisite at borderline.

**Action:** Rewrite per OE — full list update; tier scoping change; remove the LDL prerequisite at borderline.

---

**Flag 7 — SUPD HEDIS Framing**

Affects faqs.statin-indication.q3 + context_strip.

**Verdict: Needs revision.** SUPD remains a HEDIS-tracked measure, **but the ~90% benchmark is an organizational target, not a HEDIS national benchmark.** The HEDIS 90th-percentile benchmark for SUPD has historically been ~80–85% for commercial plans (and lower for Medicaid). The module should clarify this is an **internal organizational benchmark, not the HEDIS national standard**. SUPD applies to ages 40–75 with diabetes — aligns with the 2026 guideline's COR 1 recommendation for moderate-intensity statin in this population.[ref:acc-aha-dys-2026][ref:ada-2026-cv] The framing of "every diabetic patient must have statin therapy addressed and documented at each visit" is reasonable as an organizational standard but is **not a HEDIS specification requirement** — HEDIS measures statin **dispensing** (pharmacy claims), not documentation of discussion.

**Corrected framing for the live module:** "SUPD (Statin Use in Persons with Diabetes) is a HEDIS measure tracked via pharmacy claims for ages 40–75 with diabetes. Crystal Run's organizational target of ~90% exceeds the HEDIS national 90th percentile (~80–85% commercial). The HEDIS measure itself rewards statin dispensing, not chart documentation of discussion — but local practice expectation is documentation at every diabetic visit, which is captured here as the operational standard."

**Action:** Soften — distinguish HEDIS national benchmark (pharmacy claims, ~80–85% 90th %ile) from organizational target (~90%, documentation-based). Don't conflate documentation requirement with HEDIS spec.

---

**Flag 8 — Lp(a) and ApoB Ordering Indications**

Affects faqs.advanced-markers.q1 + faqs.advanced-markers.q2.

**Verdict: Needs revision.** The module restricts Lp(a) testing to "premature ASCVD, strong family history, or LDL ≥190 not fully explained." **The 2026 guideline gives a COR 1 recommendation for Lp(a) measurement at least once in ALL adults** — not just selected populations.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] Direct quote: *"In all adults, measurement of Lp(a) concentration is recommended at least once for ASCVD risk assessment."* (COR 1)

This is a major upgrade from 2018, which listed elevated Lp(a) only as a risk-enhancing factor without a universal screening recommendation. Threshold for elevated: **≥125 nmol/L (≥50 mg/dL)**, with **≥250 nmol/L (≥100 mg/dL) conferring ≥2-fold risk**. A single measurement is generally sufficient — Lp(a) is predominantly genetically determined.

For ApoB, the 2026 guideline gives **COR 2a** for measurement in adults on LLT, particularly those with ASCVD, CKM syndrome, type 2 diabetes, and/or elevated TG, to guide further intensification once LDL-C/non-HDL-C goals met.[ref:acc-aha-dys-2026] The module's framing of ApoB as indicated for "High and Very High Risk patients to assess residual risk" is directionally correct but should be updated to reflect the specific 2026 indications.

**Corrected framing for the live module:** "Lp(a) is recommended once in every adult for ASCVD risk assessment (2026 COR 1) — not restricted to premature ASCVD or strong family history. Threshold for elevated: ≥125 nmol/L (or ≥50 mg/dL); ≥250 nmol/L (or ≥100 mg/dL) confers ≥2-fold risk. A single measurement is sufficient (genetically determined). ApoB is recommended (2026 COR 2a) in adults on LLT, particularly with ASCVD, CKM syndrome, type 2 diabetes, or elevated TG, after LDL-C and non-HDL-C goals are met — to guide further intensification."[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc]

**Action:** Rewrite per OE — broaden Lp(a) ordering to all adults once-in-lifetime per 2026 COR 1; update ApoB indications to the 2026 specific list; resolve the "coverage and indications pending" placeholder in q2 with the payer-coverage notes (both Lp(a) and ApoB are standard lab tests covered without PA on most plans).

---

**Additional flags (secondary findings)**

OE flagged 7 secondary items beyond the 8 primary flags. Each generates a tracker row.

- **Landing date stamp** — Module references "2018 AHA/ACC Cholesterol Guidelines"; should be updated to **2026 ACC/AHA Dyslipidemia Guideline** as primary, with 2022 ACC ECDP retained for nonstatin-therapy escalation specifics.[ref:acc-aha-dys-2026][ref:acc-2022-decisionpathway] **Action:** Rewrite landing intro (Row 9).
- **PREVENT age range** — 2026 guideline extends PREVENT-ASCVD risk assessment to **ages 30–79** (expanded from PCE's 40–75).[ref:acc-aha-dys-2026] **Action:** Add to landing intro + risk-tier FAQ (Row 10).
- **CAC age range** — Module says "ages 40–75"; 2026 guideline specifies **men ≥40, women ≥45**.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] CAC is now **COR 1** (upgraded from COR 2a) for risk reclassification in intermediate-risk and select borderline-risk adults. **Action:** Rewrite CAC age + COR upgrade in faqs.statin-hesitant.q1 (Row 11).
- **CAC = 0 reassessment** — Module says "5–7 years"; 2026 guideline says **3–7 years**.[ref:acc-aha-dys-2026] **Action:** Update interval (Row 11).
- **High-intensity statin trigger** — Module says ">20% 10-year risk" triggers high-intensity statin without SDM; under PREVENT, this threshold is **≥10%** (COR 1, to achieve ≥50% LDL-C reduction).[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] **Action:** Cascade with Flag 1 — replace >20% trigger with ≥10% PREVENT (Rows 12, 17).
- **Ezetimibe LDL reduction** — Module says "15–20%"; published data + 2026 guideline supportive text cite **~18–24%** reduction.[ref:acc-aha-dys-2026] **Action:** Update magnitude in faqs.not-at-goal.q1 (Row 13).
- **PCSK9 PA wording** — Module says PCSK9 inhibitors require "documented statin intolerance or failure"; more precisely, most payers require **documentation of maximally tolerated statin therapy** (not necessarily intolerance) with LDL-C remaining above a threshold (typically ≥70 for ASCVD, ≥100 for FH), often with trial of ezetimibe — though the 2026 guideline no longer **clinically** mandates the ezetimibe-first sequence.[ref:acc-2022-decisionpathway][ref:acc-aha-dys-2026] **Action:** Soften — replace "intolerance or failure" with "maximally tolerated statin therapy + LDL above threshold" (Row 14).

**Open question OE offered:** *"Would you like to explore how the 2026 guideline's new CAC-based treatment goals (e.g., CAC ≥1000 triggering LDL-C <55 mg/dL even in primary prevention) should be incorporated into the module's decision logic?"* → **Captured as deep-dive DD1**, deferred to post-Bundle 4 (CAC bundle). Tracker Row 22.

---

## Shared bundle prompt template

Use this wrapper for Bundles 1–6. Paste the bundle's claim list into the `[claims]` slot.

```
I'm reviewing a primary care decision-support tool for lipid
management and cardiovascular risk reduction in adult patients. I need
to verify a set of related clinical claims against current evidence
and guidelines (2022 ACC Expert Consensus Decision Pathway, 2023 AHA
PREVENT validation, 2023–2024 ACC/AHA cholesterol guideline updates,
ESC/EAS 2019 dyslipidaemia, NCQA HEDIS specs, FDA labels, and
specialist society guidance from ACC, AHA, ASCVD-related primary
literature).

For each claim below, please tell me:
  1. Is this supported by current evidence, guidelines (ACC/AHA, ESC/
     EAS, NLA, AAFP, USPSTF, NCQA HEDIS), or standard of care?
  2. The specific source/citation (guideline name, year, relevant
     section / recommendation number, page).
  3. Any nuance, exception, or recent update (2022+) that should
     modify it.
  4. If the claim is incorrect or oversimplified, what is the accurate
     version?

Do not assume the claims are correct. I want genuine pushback on
anything that's outdated, unsupported, or controversial. The audience
is a primary care physician making decisions at a routine visit, so
corrections should be operational (what should the PCP actually do,
order, document, or counsel).

Claims:
[paste bundle claims here]
```

---

## Bundle 1 — Risk stratification: PREVENT vs PCE  **(PILOT FIRST)**

Highest-leverage bundle. Sets the foundation for tier-based decisions in every other bundle. Run this first to calibrate prompt wording.

```
- The AHA PREVENT (Predicting Risk of CVD EVENTs) equations, published
  in Khan et al. Circulation 2023/2024, formally replace the Pooled
  Cohort Equations (PCE) as the primary ASCVD risk estimator in
  primary care for ages 30–79.
- PREVENT incorporates kidney function (eGFR) and metabolic risk
  factors (BMI, HbA1c when available, urine albumin-creatinine ratio
  when available) directly into the risk score.
- PREVENT removes race as an input variable; the PCE was known to
  systematically overestimate risk in Black patients and
  underestimate in some Asian populations.
- PREVENT estimates 10-year and 30-year risk for combined ASCVD and
  heart failure outcomes (a broader composite than PCE's
  ASCVD-only 10-year output).
- The four risk tiers used to drive statin decisions in primary care
  are: Low <5%, Borderline 5–7.5%, Intermediate 7.5–20%, High >20%
  (10-year ASCVD risk).
- For the same patient, PREVENT often produces a numerically lower
  10-year risk than PCE; this should not change the proportion of
  patients ultimately treated, because tier thresholds were designed
  to be roughly equivalent in clinical action.
- For intermediate-risk patients (7.5–19.9% 10-year risk) with LDL-C
  ≥70 mg/dL, a moderate-to-high intensity statin is recommended after
  a clinician–patient risk discussion.
- Risk-enhancing factors for borderline-risk patients include: family
  history of premature ASCVD, persistently elevated LDL ≥160 mg/dL,
  CKD, metabolic syndrome, chronic inflammatory conditions, history
  of preeclampsia / premature menopause, South Asian ancestry, hs-CRP
  ≥2 mg/L, ABI <0.9, elevated Lp(a), and elevated ApoB.
- The 30-year PREVENT risk estimate is intended for younger
  intermediate-risk patients where 10-year risk is low but lifetime
  risk is meaningful — useful for long-horizon shared decision-making
  but not a primary statin-initiation trigger.
- PREVENT is calibrated for ages 30–79; for adults <30 or >79, use
  clinical judgment plus risk-enhancing factors rather than a
  numerical risk estimate.
- Race-removal in PREVENT is endorsed by the 2023 AHA scientific
  statement on race-based clinical algorithms; some commentary has
  raised concerns about loss of risk discrimination in
  populations historically over-represented in the PCE-derivation
  cohorts — this is an open methodological discussion, not a reason
  to revert to PCE.
- An intermediate-risk patient who reclassifies to lower-risk on
  PREVENT (vs PCE) should not be automatically de-escalated off
  statin therapy; reclassification is a basis for shared
  decision-making, not unilateral medication discontinuation.
```

**Bundle 1 findings:**

OE response received 2026-05-04. Raw response in `verification/lipid1-3.md`. Per-claim verdict + tracker mapping below. **Result: 7 of 12 claims verified outright or with nuance; 4 outdated relative to 2026 guideline; 1 partially incorrect (BMI not in PREVENT-ASCVD).** Major outputs: 8 new citations into the references-staging table; 7 net-new tracker rows (23–29) on top of meta-pass rows 1–22; 0 deep-dives generated (the open offer about CAC ≥1000 + <100 primary-prevention goal was already captured by MP DD1 / Row 26 cascade).

Prompt-iteration note: Bundle 1 prompt was drafted **pre-meta-pass** with PCE-vs-PREVENT framing intact. The meta-pass already disposed of the most consequential threshold corrections (Rows 1, 12, 17), so Bundle 1 functioned as a confirmatory + detail-fleshing pass rather than a primary discovery vehicle. The outputs are still substantive — Bundle 1 added the **BMI-not-in-ASCVD correction (Claim 2)**, **PREVENT-ASCVD vs total-CVD distinction (Claim 4)**, **30-year ≥10% as a Class 2a initiation trigger (Claim 9)**, **<100 primary-prevention LDL goal (Claim 7)**, and **MESA + Asian/NHPI validation citations (Claim 11)**. None of those landed in the meta-pass.

**Per-claim verdicts (Bundle 1):**

- **Claim 1** (PREVENT replaces PCE for ages 30–79). **Verified with nuance.** The "formal replacement" language is now correct under the 2026 guideline but should NOT cite Khan 2023/2024 as the authoritative source — those were the validation papers, not the formal recommendation. The 2026 ACC/AHA Dyslipidemia Guideline + 2025 BP Guideline + 2026 VA/DoD Lipid CPG are the formal recommendation sources.[ref:acc-aha-dys-2026][ref:acc-aha-bp-2025][ref:va-dod-lipid-2026] Already covered by meta-pass Row 9 + Row 10 — no new tracker row needed. **Action:** When rewriting landing intro (Row 9), cite `acc-aha-dys-2026` as the authority for the formal-replacement language; cite `khan-circ-2024` only as the validation reference.

- **Claim 2** (PREVENT incorporates eGFR + BMI + HbA1c + UACR). **Partially incorrect — BMI is NOT in PREVENT-ASCVD.** Base PREVENT-ASCVD predictors are: age, sex, total cholesterol, HDL-C, SBP, eGFR, diabetes status, smoking, statin use, antihypertensive use.[ref:khan-circ-2024][ref:acc-aha-dys-2026] HbA1c + UACR are **optional add-on variables** when clinically indicated (CKD or DM). BMI is in the PREVENT-HF equation only.[ref:acc-aha-dys-2026][ref:krishnan-jacc-2025] The current module's risk-tier Q1 says "kidney function (eGFR) and metabolic factors" without naming BMI explicitly, so the surface text is salvageable — but the intended Phase-2 rewrite must NOT introduce BMI into ASCVD prose. **Action:** New tracker Row 23 — clarify base predictors are eGFR + the standard inputs; HbA1c/UACR are optional add-ons; BMI is not a PREVENT-ASCVD predictor.

- **Claim 3** (PREVENT removes race; PCE overestimated in Black, underestimated in some Asian). **Verified with nuance.** PCE miscalibration was broad — largest absolute risk-estimate difference between PCE and PREVENT in Black adults (10.9% PCE vs 5.1% PREVENT).[ref:anderson-jamaim-2024] PCE limited applicability to Asian/Hispanic populations due to derivation-cohort underrepresentation. The "(erythromycin)" parenthetical OE flagged is not in the v1.0.0 module text — appears to have been a bundle-prompt typo on my end. No tracker change. **Action:** When rewriting risk-tier Q1 prose, attribute PCE overestimation to "general miscalibration in contemporary populations" rather than "race-specific bias" per Anderson 2024; cite `anderson-jamaim-2024` for the magnitude of the Black-adult difference.

- **Claim 4** (PREVENT estimates 10/30-yr ASCVD + HF combined). **Verified with operational nuance.** PREVENT does provide separate ASCVD, HF, and total CVD (ASCVD+HF) equations at 10-yr and 30-yr horizons.[ref:khan-circ-2024][ref:khan-circ-2023-aha-statement] **For statin decisions, use PREVENT-ASCVD specifically — NOT the total-CVD composite.** The total-CVD composite is the BP-treatment threshold per the 2025 BP guideline.[ref:acc-aha-dys-2026][ref:acc-aha-bp-2025][ref:abbasi-jama-2026] The current module says "PREVENT estimates 10-year and 30-year risk for combined ASCVD and heart failure outcomes" — wording could mislead a PCP. **Action:** New tracker Row 24 — restrict module's PREVENT prose to PREVENT-ASCVD; note the total-CVD variant exists but is for BP decisions; cite the 2025 BP guideline for that.

- **Claim 5** (Tier thresholds Low<5 / Bord 5–7.5 / Int 7.5–20 / High>20). **Disproved (now incorrect).** Already captured by meta-pass Row 1; Bundle 1 confirms with the explicit rationale that PREVENT-ASCVD estimates are ~40–50% lower than PCE so thresholds were lowered to identify similar populations.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] No new tracker row.

- **Claim 6** (PREVENT lower than PCE; tiers calibrated to be roughly equivalent in clinical action). **Now supported by 2026 guideline.** OE confirms the 2026 guideline performed an explicit crosswalk: PCE ≥5% and PREVENT-ASCVD ≥3% identify approximately the same number of adults (~25–26 million).[ref:acc-aha-dys-2026][ref:diao-jama-2024][ref:anderson-jamaim-2024] Pre-2026 application of PREVENT to old PCE thresholds would have reduced statin-eligible by ~14–17 million. The "calibrated to be roughly equivalent in clinical action" framing is correct **only under the 2026 thresholds** — captured by Row 1 cascade. No new tracker row but the module's Phase-2 rewrite should explicitly state that the 2026 thresholds were designed for clinical-action equivalence with the prior PCE thresholds.

- **Claim 7** (Intermediate 7.5–19.9% with LDL ≥70 → mod-to-high statin after risk discussion). **Outdated thresholds; substance partially correct.** Two updates: (a) intermediate is now 5% to <10% (cascade with Row 1 / Row 12); (b) **2026 guideline introduces an LDL-C goal of <100 mg/dL for borderline and intermediate-risk patients initiated on statins** — this is net-new content not currently in the module (resolves the vague "<70–100" range in Row 3).[ref:acc-aha-dys-2026][ref:abbasi-jama-2026] OE also clarifies: "consideration of high-intensity statin to lower LDL-C by ≥50%" applies in intermediate risk — the module's "moderate-to-high intensity" framing is consistent. **Action:** New tracker Row 26 — add explicit <100 mg/dL LDL-C goal for borderline/intermediate primary prevention initiated on statins.

- **Claim 8** (Risk-enhancing factors list). Already captured by meta-pass Row 6. Bundle 1 reinforces with specific 2026 Table 13 changes: CKD subsumed under CKM syndrome; Filipino added alongside South Asian; metabolic syndrome → CKM syndrome; ABI <0.9 dropped from standalone list (subclinical atherosclerosis addressed via CAC instead); polygenic risk score added; reproductive markers expanded (gestational diabetes, gestational HTN, preterm delivery, early menarche); ApoB threshold ≥120 mg/dL (vs 2018's ≥130).[ref:acc-aha-dys-2026][ref:abbasi-jama-2026][ref:acc-aha-dys-2026-jacc] No new tracker row — Row 6 already directs the rewrite, but the **ApoB ≥120 threshold** is operationally important and should be carried into Row 6's rewrite scope.

- **Claim 9** (30-year risk for younger int-risk; useful for SDM but not primary trigger). **Partially outdated.** **2026 guideline upgrades 30-year PREVENT ≥10% in adults 30–59 with low 10-yr risk (<3%) to a Class 2a moderate-intensity statin initiation trigger** — not just a counseling tool.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc][ref:krishnan-jacc-2025] This is operationally net-new — the current module doesn't describe 30-yr risk at all. **Action:** New tracker Row 25 — add 30-year ≥10% as Class 2a statin-initiation trigger in adults 30–59 with low 10-yr risk; cite Krishnan 2025 for the percentile-distribution data.

- **Claim 10** (PREVENT 30–79 calibration; <30 or >79 use clinical judgment). **Verified.** Already captured by meta-pass Row 10. OE adds operational detail: 2026 guideline says 18–29 LLT use is "a matter of clinical judgment and patient preference in the absence of available evidence"; >79 addressed separately with comorbidity/life-expectancy considerations rather than numerical risk.[ref:acc-aha-dys-2026][ref:khan-circ-2024] Carry these specifics into Row 10's rewrite scope.

- **Claim 11** (Race-removal endorsed by 2023 AHA scientific statement; concerns are open methodological discussion). **Verified.** Recent validation studies in MESA + diverse health-care cohorts confirm PREVENT-ASCVD provides more accurate calibration than PCE across racial/ethnic groups.[ref:cho-jacc-2025][ref:murphy-jacc-adv-2025] **Caveats remaining: PREVENT was validated with <3% Asian/NHPI representation** — Au 2026 specifically pressure-tests Asian/NHPI subgroups[ref:au-jamano-2026]; **disproportionate impact on Black adults** (who would lose treatment eligibility at higher rates if old thresholds applied) was an active equity concern that the 2026 ≥3% threshold was designed to mitigate.[ref:diao-jama-2024][ref:anderson-jamaim-2024] **Action:** New tracker Row 27 — add MESA + Cho 2025 + Au 2026 + Murphy 2025 as validation citations; landing-intro / risk-tier-Q1 should briefly acknowledge the equity rationale for the 2026 threshold recalibration.

- **Claim 12** (Reclassified-to-lower not auto-deescalated). **Verified.** VA/DoD 2026 explicit: "the decision to discontinue such therapy based on a new or different risk assessment would ultimately fall to the provider, with consideration from the patient".[ref:va-dod-lipid-2026] 2026 ACC/AHA threshold recalibration was specifically designed to avoid wholesale de-escalation.[ref:acc-aha-dys-2026] Anderson 2024: ~4M adults currently on statins would no longer meet criteria under PREVENT with old thresholds.[ref:anderson-jamaim-2024] **Action:** New tracker Row 28 — add as a net-new FAQ item under risk-tier (or as an addendum to risk-tier Q1) — "if PREVENT reclassifies you to a lower tier, this is not a reason to stop statin therapy unilaterally; engage SDM, consider risk enhancers and CAC, document rationale."

**Summary of new tracker rows seeded by Bundle 1:** 23 (BMI/PREVENT-ASCVD scope), 24 (PREVENT-ASCVD vs total-CVD for statin decisions), 25 (30-yr ≥10% Class 2a), 26 (<100 LDL goal borderline/intermediate primary prevention), 27 (MESA + diverse validation), 28 (deimplementation guidance on reclassification), 29 (no immediate row drafted — PCE-vs-PREVENT crosswalk wording for landing intro folds into Row 9 + Row 1).

**Citations confirmed or added:** `acc-aha-dys-2026`, `acc-aha-dys-2026-jacc`, `khan-circ-2024`, `khan-circ-2023-aha-statement` (new), `acc-aha-bp-2025` (new), `va-dod-lipid-2026` (new), `abbasi-jama-2026` (new), `diao-jama-2024` (new), `anderson-jamaim-2024` (new), `michos-nejm-2019` (new), `grundy-2018-cholesterol`, `cho-jacc-2025` (new), `murphy-jacc-adv-2025` (new), `au-jamano-2026` (new), `krishnan-jacc-2025` (new). 11 of 15 staged refs are new from Bundle 1.

---

## Bundle 2 — Very High Risk: definition and <55 mg/dL target

Reconciles the meta-pass + Bundle 1 corrections to the VHR definition (Row 2: must add age ≥65, HeFH, prior CABG/PCI, HF; "+ ezetimibe" to LDL threshold; HTN not "poorly controlled" HTN) and pressure-tests the <55 mg/dL LDL target evidence base — IMPROVE-IT (ezetimibe post-ACS), FOURIER (evolocumab), ODYSSEY OUTCOMES (alirocumab) — plus net-new co-primary non-HDL-C and ApoB targets for VHR + PCSK9 indication thresholds + age ≥75 considerations. Bundle 3 will own the broader co-primary-targets framework across all tiers; Bundle 2 stays VHR-focused.

```
- The Very High Risk (VHR) category in primary care lipid management
  is defined per the 2022 ACC Expert Consensus Decision Pathway and
  the 2026 ACC/AHA Dyslipidemia Guideline as: a history of ≥2 major
  ASCVD events (recent ACS within 12 months, prior MI, ischemic
  stroke, or symptomatic PAD with ABI <0.85 or prior revascularization
  / amputation), OR 1 major ASCVD event PLUS ≥1 high-risk condition.
- High-risk conditions that escalate single-event ASCVD to VHR
  include: age ≥65, heterozygous familial hypercholesterolemia
  (HeFH), prior CABG or PCI outside the index event, diabetes
  mellitus, hypertension, CKD with eGFR 15–59 mL/min/1.73m²,
  current smoking, persistent LDL-C ≥100 mg/dL despite maximally
  tolerated statin AND ezetimibe, and history of congestive heart
  failure.
- The 2026 guideline criterion is "hypertension" without a
  control-status modifier — the older "poorly controlled
  hypertension" framing has been dropped.
- The LDL-C goal for VHR patients in secondary prevention is
  <55 mg/dL per the 2026 ACC/AHA Dyslipidemia Guideline (Class 1
  recommendation).
- The non-HDL-C goal for VHR patients is <85 mg/dL — a co-primary
  treatment target alongside LDL-C <55.
- The ApoB goal for VHR patients on lipid-lowering therapy is
  <65 mg/dL once primary LDL-C and non-HDL-C goals are achieved
  (a confirmatory / residual-risk target, not a primary trigger).
- The <55 mg/dL LDL target is supported by: IMPROVE-IT (Cannon NEJM
  2015) — ezetimibe added to simvastatin in post-ACS patients
  significantly reduced major CV events; FOURIER (Sabatine NEJM
  2017) — evolocumab added to high-intensity statin reduced CV
  events; and ODYSSEY OUTCOMES (Schwartz NEJM 2018) — alirocumab in
  post-ACS patients reduced CV events including total mortality.
- Achieved LDL-C levels in FOURIER and ODYSSEY OUTCOMES PCSK9-
  inhibitor arms reached median values around 30 mg/dL and 53 mg/dL
  respectively, with no signal of harm at very low LDL-C values
  (no excess incident cognitive dysfunction, hemorrhagic stroke,
  cancer, cataract, or new-onset diabetes attributable to PCSK9
  inhibition).
- The PCSK9 monoclonal antibody (evolocumab, alirocumab) clinical
  indication for VHR is LDL-C ≥70 mg/dL despite maximally tolerated
  statin (with the 2026 guideline removing the prior requirement
  that ezetimibe must be tried before PCSK9 mAb initiation —
  initiation may now be based on degree of LDL-C lowering needed
  and patient preference).
- Inclisiran (siRNA, twice-yearly) and bempedoic acid are reasonable
  alternatives or additions for VHR patients per the 2026 guideline
  (Class 2a) — bempedoic acid particularly when statin-intolerant,
  inclisiran particularly when twice-yearly dosing is preferred or
  PCSK9 mAbs are inaccessible.
- The <55 LDL-C goal applies primarily to secondary prevention; for
  primary prevention, the VHR concept does not apply — primary-
  prevention patients are tiered as Low (<3%), Borderline (3% to
  <5%), Intermediate (5% to <10%), or High (≥10%) by PREVENT-ASCVD,
  with LDL-C goal <100 mg/dL when initiated on statin therapy in
  borderline/intermediate.
- An exception to the "VHR is secondary prevention only" rule may
  apply in selected primary-prevention patients with very high CAC
  burden (e.g., CAC ≥1000) — the 2026 guideline introduces a
  treatment goal of LDL-C <55 mg/dL even in these primary-prevention
  patients despite no prior ASCVD event.
- Severe primary hypercholesterolemia (LDL ≥190 mg/dL or HeFH
  without ASCVD) is a separate pathway: high-intensity statin is
  warranted regardless of risk score, but the LDL-C goal for these
  primary-prevention patients is <100 mg/dL — not <55 — unless an
  ASCVD event occurs or CAC ≥1000.
- For VHR patients ages ≥75 in primary prevention (e.g., qualifying
  via age ≥65 + 1 ASCVD event), the <55 goal is generally pursued
  with shared decision-making weighing competing comorbidities and
  life expectancy; aggressive de-escalation in stable, function-
  preserving older adults is not recommended.
- A patient newly meeting VHR criteria after a qualifying ASCVD
  event should have their documented LDL-C goal updated from <70
  to <55 mg/dL, with PCSK9 mAb / bempedoic acid / inclisiran
  consideration reasonable if LDL-C remains ≥70 on maximally
  tolerated statin (with or without ezetimibe).
- Statin therapy at VHR + LDL <55 should be reassessed annually
  with a fasting lipid panel; adherence + dose-tolerance + add-on
  therapy intensification cadence should be documented at each
  visit at minimum until LDL-C goal is achieved.
- For VHR patients who have achieved LDL-C <55 on therapy,
  ApoB measurement is reasonable as a secondary / residual-risk
  marker (2026 COR 2a) particularly in those with persistent
  elevated triglycerides, type 2 diabetes, CKM syndrome, or
  established ASCVD — to guide further intensification.
```

Use the shared bundle prompt template (lines 391–419 above) — paste these claims into the `[paste bundle claims here]` slot.

**Bundle 2 findings:**

OE response received 2026-05-04. Raw response in `verification/lipid1-3.md`. Per-claim verdict + tracker mapping below. **Result: 9 of 17 claims verified outright or with nuance; 6 require correction; 2 net-new content (Ez-PAVE direct evidence; CAC 300–999 secondary threshold). DD1 / Row 22 closes here (Claim 12 returned both COR 1 and COR 2a CAC pathways).** Major outputs: 6 new citations into references staging (`aha-acc-ccd-2023`, `lee-nejm-2026`, `goldstein-atvb-2023`, `giugliano-lancet-2017`, `rosenson-jacc-2018`, `blumenthal-circ-2026-progress`); 12 net-new tracker rows (29–40); Row 22 status updated to **Resolved**.

**Most consequential corrections from Bundle 2:**
1. **VHR threshold for "1 major event + comorbidities" requires ≥2 high-risk conditions, not ≥1** — corrects Bundle 2 prompt's claim 1 directly and tightens the existing Row 2 cascade.
2. **2026 ACC/AHA explicitly OMITS CKD from the VHR high-risk features list** (Section 2.1) — material change from 2022 ECDP and 2023 CCD that the meta-pass / Bundle 1 didn't surface. CKD is addressed separately in Section 4.2.8 with its own treatment recommendations.
3. **ApoB <65 mg/dL is NOT a 2026 ACC/AHA target.** Only specific ACC/AHA-named ApoB numeric is **<55 mg/dL** for severe hypercholesterolemia + ASCVD (Section 4.2.4.3). The <65 figure is from ESC/EAS 2019 — frequently confused source. Module rewrite must be careful here.
4. **ODYSSEY OUTCOMES achieved median LDL ~40 mg/dL** (NOT 53). FOURIER median ~30 mg/dL. 53 mg/dL was IMPROVE-IT ezetimibe arm.
5. **Trigger for nonstatin add-on in VHR is failure to achieve <55**, NOT "LDL ≥70 on max statin." The ≥70 threshold applies to non-VHR ASCVD only. Operationally critical — VHR patients at LDL 60 are already candidates for escalation.
6. **CAC 300–999 → reasonable (COR 2a) to intensify to LDL <55** — net-new threshold below the meta-pass-flagged CAC ≥1000 (COR 1). Closes DD1.
7. **Lipid monitoring: 4–12 weeks after change AND every 6–12 months thereafter; nonfasting acceptable** unless known hypertriglyceridemia. Module currently silent on long-term cadence; "fasting" framing in med-plan FAQ should be softened.
8. **Future-state signal:** 2026 writing committee notes VESALIUS-CV may collapse VHR vs non-VHR into single <55 pathway in next revision. Worth landing/whats-new footnote; do not pre-emptively change module structure.

**New evidence cited by OE in Bundle 2:**
- **Ez-PAVE trial (Lee et al. NEJM 2026, doi:10.1056/NEJMoa2600283)** — first head-to-head RCT directly demonstrating <55 vs <70 reduces 3-yr major CV events HR 0.67 (95% CI 0.52–0.86). Cite anywhere module justifies the <55 threshold.
- **AHA 2023 cognitive scientific statement (Goldstein et al. ATVB 2023)** — concludes no association between aggressive LDL lowering and dementia / cognitive impairment / hemorrhagic stroke. Reassurance citation for statin-hesitant or family-of-MCI counseling.
- **FOURIER prespecified secondary analysis (Giugliano Lancet 2017)** — no excess adverse events at LDL <0.5 mmol/L (~19 mg/dL).
- **Rosenson JACC 2018** — covers EBBINGHAUS no-neurocognitive-impairment data.
- **2023 CCD Guideline (Virani et al. JACC 2023)** — specifies ≥2 high-risk conditions for VHR (resolves the 2022 ECDP "multiple" ambiguity).
- **2026 "Continuous Work in Progress" companion (Blumenthal et al. Circulation 2026)** — companion to the dyslipidemia guideline carrying the explicit VESALIUS-CV signal.

**Per-claim verdicts (Bundle 2):**

- **Claim 1** (VHR = ≥2 major events OR 1 major + ≥1 high-risk condition). **Verified with correction.** OE pushed back — threshold is **≥2 high-risk conditions** for the "1 major event + comorbidities" pathway across all three documents (2022 ECDP says "multiple", 2023 CCD specifies ≥2, 2026 reaffirms ≥2).[ref:acc-2022-decisionpathway][ref:aha-acc-ccd-2023][ref:acc-aha-dys-2026] My Bundle 2 prompt's "≥1" framing was too permissive. **Action:** New Row 29 — cascade with Row 2 to correct the count threshold.

- **Claim 2** (High-risk conditions: age ≥65 / HeFH / prior CABG-PCI / DM / HTN / CKD eGFR 15–59 / smoking / LDL ≥100 on max statin+ezetimibe / CHF). **Mostly supported with critical 2026-specific change.** 2022 ECDP and 2023 CCD list all 9 conditions.[ref:acc-2022-decisionpathway][ref:aha-acc-ccd-2023] **2026 ACC/AHA Dyslipidemia Guideline (Section 2.1) explicitly OMITS CKD** from the VHR high-risk features list — a notable change. CKD remains addressed separately in Section 4.2.8 with its own treatment recommendations.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] CKD + ASCVD patients still receive aggressive LDL-C goals (<55 mg/dL) via the CKD-specific pathway. **Action:** New Row 30 — module currently has CKD in VHR list (per 2022 ECDP / Row 2). Reconcile in rewrite to flag the 2022/2026 discrepancy and route CKD + ASCVD to <55 regardless.

- **Claim 3** (HTN without "poorly controlled" modifier). **Verified.** Both 2022 ECDP and 2026 ACC/AHA list "hypertension" without control-status modifier.[ref:acc-2022-decisionpathway][ref:acc-aha-dys-2026] 2018 cholesterol guideline (the original list source) also used unqualified "hypertension." Already cascades with Row 2.

- **Claim 4** (LDL <55 VHR Class 1). **Verified.** 2026 Recommendation #4 (COR 1, LOE A): high-intensity statin to ≥50% LDL reduction + LDL <55 + non-HDL <85.[ref:acc-aha-dys-2026] **Net-new evidence: Ez-PAVE trial (Lee NEJM 2026)** — first head-to-head RCT of <55 vs <70 — HR 0.67 (95% CI 0.52–0.86) for 3-yr major CV events.[ref:lee-nejm-2026] **Action:** No new tracker row (reinforces Row 3); cite `lee-nejm-2026` whenever module text justifies the <55 threshold.

- **Claim 5** (Non-HDL <85 co-primary VHR). **Verified.** 2026 consistently pairs LDL <55 with non-HDL <85 for VHR across all secondary prevention recs.[ref:acc-aha-dys-2026] Reinforces Row 5. Bundle 3 will pressure-test non-HDL targets across all tiers.

- **Claim 6** (ApoB <65 confirmatory VHR target). **Disproved.** OE pushed back hard — **2026 ACC/AHA does NOT specify <65 mg/dL as an ApoB target.** ApoB recommendation is COR 2a for measurement to guide further intensification once LDL-C / non-HDL-C goals achieved, **without a universal numeric target**.[ref:acc-aha-dys-2026] The only specific ApoB numeric in 2026 is **<55 mg/dL** for severe hypercholesterolemia + ASCVD (Section 4.2.4.3).[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] The <65 figure is from **ESC/EAS 2019** (their "very high risk" category). Frequently confused source. **Action:** New Row 31 — corrects Row 5 / Row 20 scope. Module rewrite must be careful: ApoB in 2026 ACC/AHA = COR 2a residual-risk tool; <55 only in severe-FH+ASCVD context. Do NOT state <65 as ACC/AHA target.

- **Claim 7** (IMPROVE-IT, FOURIER, ODYSSEY OUTCOMES support <55). **Verified.** OE confirms the 2026 guideline cites all three trials as the evidence base.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] Specifics: IMPROVE-IT 2% ARR over 6 yrs (greater in ≥3 risk indicators); FOURIER 1.5% ARR (median 2.2 yrs); ODYSSEY OUTCOMES 1.6% ARR (median 2.8 yrs); ODYSSEY all-cause mortality HR 0.85 (nominal p=0.026, secondary endpoint).[ref:aha-acc-ccd-2023][ref:acc-aha-dys-2026] Trial NEJM citations remain "anticipated anchors" — OE cited the GUIDELINE for trial summaries, not the original NEJM papers. Pull NEJM citations directly when needed for module rewrite (Bundle 5).

- **Claim 8** (FOURIER ~30 / ODYSSEY ~53 achieved median LDL; safety at very low LDL). **Verified with correction.** **ODYSSEY OUTCOMES median was ~40 mg/dL, NOT 53** — 53 mg/dL was IMPROVE-IT ezetimibe arm.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] FOURIER ~30 mg/dL confirmed. Safety: FOURIER prespecified secondary analysis no excess adverse events at LDL <0.5 mmol/L (~19 mg/dL)[ref:giugliano-lancet-2017]; EBBINGHAUS no neurocognitive impairment[ref:rosenson-jacc-2018]; FOURIER-OLE 8-yr no excess muscle / new-onset DM / neurocognitive[ref:acc-aha-dys-2026]; AHA 2023 ATVB scientific statement no association between aggressive LDL lowering and dementia / cognitive impairment / hemorrhagic stroke[ref:goldstein-atvb-2023]. **Action:** New Row 32 — correct the achieved-LDL data; carry the cognitive-safety reassurance citations for statin-hesitant counseling and MCI-family conversations.

- **Claim 9** (PCSK9 mAb without prior ezetimibe; ≥70 trigger). **Verified for ezetimibe-not-required; INCORRECT on ≥70 threshold for VHR.** 2026 explicitly removes ezetimibe-must-precede-PCSK9 requirement.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] **Critical correction: VHR trigger for nonstatin add-on is failure to achieve <55 mg/dL on max statin, NOT a fixed ≥70 threshold.** The ≥70 threshold applies to **non-VHR ASCVD secondary prevention** only. Operationally: a VHR patient at LDL 60 on max statin is already a candidate for escalation. **Action:** New Row 33 — cascade with Row 14 (PCSK9 PA wording). VHR vs non-VHR ASCVD trigger thresholds must be differentiated; the non-VHR ≥70 framing under-treats VHR patients.

- **Claim 10** (Inclisiran + bempedoic acid Class 2a VHR). **Verified with two nuances.** (a) **Bempedoic acid (COR 2a, LOE B-R):** 2026 positions as general add-on "with or without ezetimibe and/or PCSK9 mAb" — broader than FDA label CVOT indication, which restricts to "unable to take recommended statin therapy" (statin-intolerant).[ref:acc-aha-dys-2026][ref:clear-outcomes-2023][ref:fda-orange-book] (b) **Inclisiran (COR 2a, LOE B-R):** 2026 specifies "in those unable to tolerate or obtain evolocumab or alirocumab OR have a strong preference for less frequent dosing" — more restrictive than initially framed; positioned as **second-line to PCSK9 mAbs**, pending ORION-4 / VICTORION-2P CVOT results.[ref:acc-aha-dys-2026][ref:fda-orange-book] **Action:** New Row 34 (inclisiran second-line framing) + New Row 35 (bempedoic acid two-scope distinction: ACC/AHA broader than FDA label CVOT indication).

- **Claim 11** (Primary prevention tiers + <100 mg/dL goal). **Verified.** 2026 PREVENT-ASCVD tiers Low <3 / Borderline 3 to <5 / Intermediate 5 to <10 / High ≥10.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] **Operational addition:** for **High risk (≥10%) primary prevention, LDL goal is <70 mg/dL (COR 2a)** — tighter than borderline/intermediate <100. Already covered by Row 1 + Row 26 cascade. No new tracker row but the module's per-tier LDL-goal table (Row 3 / asset T2) needs the <70 entry for High primary prevention.

- **Claim 12** (CAC ≥1000 → <55 primary prevention). **Verified with broader threshold.** 2026: **CAC ≥1000 → LDL <55 (COR 1, LOE B-NR)** AND **CAC 300–999 → reasonable (COR 2a) to intensify to LDL <55**.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] Net-new CAC 300 threshold below the meta-pass-flagged CAC ≥1000. **Action:** New Row 36 — closes DD1 / Row 22 (no separate query needed). Row 22 status updates to **Resolved**.

- **Claim 13** (LDL ≥190 primary prevention <100 unless ASCVD or CAC ≥1000). **Verified with 3-tier nuance.** 2026 stratifies severe hypercholesterolemia without ASCVD: (a) without HeFH/subclinical/risk factors → <100 (COR 1); (b) with HeFH / additional risk factors / documented coronary calcification → <70 (COR 1); (c) with clinical ASCVD → <55 (COR 1).[ref:acc-aha-dys-2026] **Action:** New Row 37 — module currently treats LDL ≥190 as a single high-intensity-statin trigger with no tier-specific LDL goal. Add the 3-tier goal table. Bundle 6 will fully verify FH-specific framing.

- **Claim 14** (VHR ≥75 SDM). **Partially supported but oversimplified.** 2026 does NOT provide age-specific ≥75 secondary prevention recommendations with explicit SDM language.[ref:acc-aha-dys-2026] 2026 **removes the prior age ≤75 restriction** on high-intensity statin initiation for secondary prevention. "No signal to suggest de-escalation indicated for very low achieved LDL." For primary prevention >79, "can be considered in conjunction with lifestyle interventions." **Action:** New Row 39 — module should NOT attribute SDM-specific ≥75 framing to 2026 guideline. Reframe: high-intensity statin appropriate at any age in secondary prevention; SDM is reasonable practice but not a guideline-attributed recommendation specific to ≥75 VHR; don't de-escalate based on very low achieved LDL alone.

- **Claim 15** (Update LDL goal <70 → <55 after qualifying VHR event; ≥70 trigger). **Supported on update; ≥70 trigger framing wrong.** Cascades with Claim 9 / Row 33 — actual trigger is failure to achieve <55, not "remains ≥70." No new row beyond Row 33.

- **Claim 16** (Annual fasting lipid panel monitoring). **Requires correction on both fronts.** 2026: **lipid profile 4–12 weeks after initiation/dose adjustment AND every 6–12 months thereafter (COR 1, LOE A)**; **nonfasting acceptable** in most cases (fasting only when known hypertriglyceridemia).[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] My claim's "annually with fasting" is wrong on cadence (too infrequent during titration) and on fasting (overly restrictive). **Action:** New Row 38 — module currently mentions "fasting lipid panel at 4–12 weeks after any change" only for med-plan; add the every-6-12-month recurring monitoring + drop "fasting" requirement except for known hypertriglyceridemia. Operational: Epic order set for routine repeat lipid panels can default to nonfasting.

- **Claim 17** (ApoB after <55 achieved, COR 2a). **Verified.** 2026: ApoB measurement reasonable to guide further intensification once LDL-C / non-HDL-C goals achieved, particularly with ASCVD / CKM / T2D / elevated TG.[ref:acc-aha-dys-2026] Reinforces Row 20. No new row.

**OE end-of-bundle additional flag:** *"The 2026 guideline writing committee has already signaled that future revisions will likely collapse the VHR vs. non-VHR distinction into a single <55 mg/dL pathway for all ASCVD patients, based on VESALIUS-CV results."*[ref:blumenthal-circ-2026-progress] **Action:** New Row 40 — add as a brief landing/whats-new footnote; do NOT pre-emptively change module structure. Module stays VHR-vs-non-VHR for now.

**OE end-of-bundle offer:** *"Would you like to explore how the 2026 VA/DoD Lipid CPG or ESC/EAS 2019 guidelines differ from the 2026 ACC/AHA framework on any of these specific points, particularly around ApoB targets and the stepwise nonstatin therapy sequencing?"* → Captured as **DD2** candidate. Bundle 3 will own the full ApoB / non-HDL / Lp(a) framework including ESC/EAS comparator on ApoB targets; defer DD2 unless Bundle 3 leaves a gap.

**Summary of new tracker rows seeded by Bundle 2:** 29 (VHR ≥2 high-risk count), 30 (CKD omitted from 2026 VHR list), 31 (ApoB <65 disproved as ACC/AHA target), 32 (achieved-LDL trial values + cognitive-safety citations), 33 (VHR add-on trigger is <55 not ≥70), 34 (inclisiran second-line to PCSK9), 35 (bempedoic acid ACC/AHA broader than FDA label), 36 (CAC 300–999 COR 2a + closes DD1 / Row 22), 37 (LDL ≥190 3-tier goals), 38 (monitoring 4–12 wk + 6–12 mo + nonfasting), 39 (VHR ≥75 SDM softened), 40 (VESALIUS-CV future-state footnote).

**Citations confirmed or added:** `acc-2022-decisionpathway` (reinforced), `acc-aha-dys-2026` (heavy), `acc-aha-dys-2026-jacc` (multiple), `aha-acc-ccd-2023` (new), `lee-nejm-2026` (new — Ez-PAVE), `goldstein-atvb-2023` (new — AHA cognitive statement), `giugliano-lancet-2017` (new — FOURIER prespecified secondary), `rosenson-jacc-2018` (new — EBBINGHAUS coverage), `clear-outcomes-2023` (reinforced), `fda-orange-book` (reinforced), `blumenthal-circ-2026-progress` (new — companion progress paper). 6 net-new refs from Bundle 2.

---

## Bundle 3 — Co-primary targets: non-HDL-C, ApoB, Lp(a)

The largest substantive gap in the current v1.0.0 module. Bundle 2 established VHR-specific targets (LDL <55 + non-HDL <85 + ApoB <55 only in severe FH + ASCVD) and ruled out ApoB <65 mg/dL as an ACC/AHA target (it's ESC/EAS 2019). Bundle 3 broadens the framework: per-tier non-HDL-C goals across the full risk spectrum, ApoB COR 2a residual-risk indications + ESC/EAS comparator, Lp(a) COR 1 once-in-all-adults universal screening + thresholds + treatment implications, discordance scenarios, and ApoB-vs-non-HDL choice in routine practice. Drafted post-Bundle 2 to incorporate the corrections that landed there.

```
- Non-HDL-C is a co-primary treatment target alongside LDL-C across
  every risk tier under the 2026 ACC/AHA Dyslipidemia Guideline — not
  only in very-high-risk secondary prevention. Per-tier non-HDL-C
  goals are: VHR <85 mg/dL, non-VHR ASCVD <100 mg/dL, high-risk
  primary prevention (PREVENT-ASCVD ≥10%) <100 mg/dL, borderline /
  intermediate primary prevention (PREVENT-ASCVD 3% to <10%) initiated
  on statins <130 mg/dL, severe primary hypercholesterolemia (LDL ≥190
  without ASCVD/HeFH/risk factors) <130 mg/dL.
- Non-HDL-C is calculated as total cholesterol minus HDL-C — available
  on every standard lipid panel without additional cost or fasting
  requirement. It captures all atherogenic apoB-containing
  lipoproteins (LDL + VLDL + IDL + Lp(a) + chylomicron remnants),
  whereas LDL-C alone misses TG-rich remnants.
- Non-HDL-C is more reliable than calculated LDL-C when triglycerides
  are elevated. Friedewald-calculated LDL-C becomes inaccurate at
  TG ≥150 mg/dL and is uninterpretable at TG ≥400 mg/dL — non-HDL-C
  remains valid across the full TG range.
- ApoB measurement carries a 2026 ACC/AHA COR 2a recommendation in
  adults on lipid-lowering therapy, particularly with ASCVD, CKM
  syndrome, type 2 diabetes, and/or elevated triglycerides, to guide
  decisions regarding further therapeutic intensification once LDL-C
  and/or non-HDL-C goals are achieved. ApoB is positioned as a
  residual-risk assessment tool, NOT a primary treatment trigger.
- The 2026 ACC/AHA Dyslipidemia Guideline does NOT specify a universal
  numeric ApoB target for VHR or general secondary prevention. The
  only ACC/AHA-specified ApoB numeric target is <55 mg/dL for severe
  hypercholesterolemia (LDL ≥190) with established ASCVD (Section
  4.2.4.3).
- The 2019 ESC/EAS Dyslipidaemia Guideline specifies different ApoB
  numeric targets that are sometimes referenced in US practice: ApoB
  <65 mg/dL for ESC/EAS "very high risk" and <80 mg/dL for "high
  risk." US PCPs operating under the 2026 ACC/AHA framework should
  not adopt the ESC/EAS numeric thresholds as ACC/AHA targets — they
  are guideline-specific and the two frameworks define VHR
  differently.
- ApoB ≥120 mg/dL (the threshold updated in 2026 from 2018's ≥130
  mg/dL) qualifies as a risk-enhancing factor for borderline-risk
  primary prevention patients. Outside the risk-enhancing-factor
  context, "elevated ApoB" without a primary numeric target means
  intensifying therapy until LDL-C and non-HDL-C goals are achieved
  rather than chasing a specific ApoB number.
- Lp(a) measurement carries a 2026 ACC/AHA COR 1 recommendation: at
  least once in ALL adults for ASCVD risk assessment — universal
  screening, not restricted to selected populations (premature ASCVD,
  family history, LDL ≥190). This is a major upgrade from the 2018
  cholesterol guideline's classification of elevated Lp(a) as a
  risk-enhancing factor only.
- Lp(a) thresholds: elevated ≥125 nmol/L (or ≥50 mg/dL); confers
  ≥2-fold ASCVD risk at ≥250 nmol/L (or ≥100 mg/dL); some sources
  also cite a "very high" threshold of ≥175 nmol/L (or ≥80 mg/dL).
  The unit conversion between nmol/L (particle number) and mg/dL
  (mass) is imprecise because Lp(a) particles vary in apo(a) isoform
  size — the conversion factor of approximately 2.5 is an
  approximation, not a fixed equivalence.
- Most US labs report Lp(a) in mg/dL; specialty labs and ESC/EAS
  guidelines prefer nmol/L because particle number is more
  biologically meaningful than mass. Lab reports should specify
  units and not interconvert without explicit caveats.
- A single Lp(a) measurement is generally sufficient — Lp(a) is
  predominantly genetically determined and stable across the lifespan
  in the absence of nephrotic syndrome or estrogen therapy. Repeat
  testing is not routinely indicated unless the patient is on an
  Lp(a)-lowering investigational therapy.
- Elevated Lp(a) ≥125 nmol/L (or ≥50 mg/dL) is a risk-enhancing
  factor that supports earlier statin initiation in borderline-risk
  primary prevention patients. Very high Lp(a) ≥250 nmol/L (or ≥100
  mg/dL) may justify intensifying to a tighter LDL-C target (e.g.,
  <70 in non-VHR ASCVD instead of standard) or initiating
  PCSK9-inhibitor therapy earlier in the escalation sequence.
- Statins do NOT lower Lp(a) and may slightly raise it
  (approximately 10–15%). PCSK9 monoclonal antibodies (evolocumab,
  alirocumab) reduce Lp(a) approximately 25–30%. Inclisiran reduces
  Lp(a) by a similar magnitude. Niacin (deprecated for ASCVD
  prevention) reduces Lp(a) more substantially but is no longer
  recommended given AIM-HIGH and HPS2-THRIVE outcomes.
- No FDA-approved Lp(a)-specific therapy is currently available.
  Investigational antisense oligonucleotides and siRNA agents
  (pelacarsen, olpasiran, lepodisiran) reduce Lp(a) by 80–90% in
  Phase 2 trials; Phase 3 cardiovascular outcomes trials (HORIZON,
  OCEAN(a), ALPACA) are pending. Until a specific therapy is
  approved, ASCVD prevention in elevated Lp(a) is via standard
  LDL-C lowering — primarily PCSK9 mAb or inclisiran for those with
  elevated Lp(a) at LDL goal who remain at residual risk.
- ApoB and Lp(a) are standard lab tests covered by most commercial
  insurance plans and Medicare without prior authorization, though
  some plans require a diagnosis code (e.g., E78.5 mixed
  hyperlipidemia, Z83.42 family history of disorder of lipoprotein
  metabolism) for Lp(a). They are not auto-included in routine
  cholesterol panels — both must be ordered specifically. Out-of-
  pocket cost is typically $20–60 for ApoB and $30–80 for Lp(a) when
  not covered.
- Discordance scenarios where ApoB or non-HDL-C diverges meaningfully
  from LDL-C include: triglycerides ≥175 mg/dL nonfasting (or ≥150
  fasting); insulin resistance / metabolic syndrome / type 2 diabetes;
  CKM syndrome; familial combined hyperlipidemia; familial
  hypercholesterolemia (when combined with other features). In these
  scenarios, LDL-C alone underestimates atherogenic burden, and
  non-HDL-C plus optionally ApoB give a fuller picture.
- For a patient with LDL-C at goal but residual cardiovascular risk
  concern, the next step is to check whether non-HDL-C is also at
  goal. If non-HDL-C is above goal despite LDL-C being at goal, the
  patient has TG-rich-remnant burden that warrants further
  intensification (typically intensifying statin or adding ezetimibe;
  fibrate or icosapent ethyl considered separately for very elevated
  TG ≥500). ApoB is reasonable to measure at this point as a
  confirmatory residual-risk marker.
- When both ApoB and non-HDL-C are available, non-HDL-C is the
  preferred routine treatment target (free with the standard panel,
  no additional ordering decision required). ApoB adds incremental
  value when there is a discordance suspicion (high TG, T2D,
  metabolic syndrome) or when residual risk persists despite LDL-C
  and non-HDL-C goals being met.
- A patient with elevated Lp(a) who also requires PCSK9-inhibitor
  therapy for LDL-C lowering benefits from a dual mechanism: PCSK9
  mAb lowers both LDL-C and Lp(a). For an elevated-Lp(a) patient
  already at LDL-C goal on maximally tolerated statin, PCSK9 mAb
  initiation may still be considered to reduce residual Lp(a)-
  attributable risk, though this is an off-label rationale rather
  than a specific FDA indication.
- Operationally, for the typical PCP visit: order Lp(a) once for any
  adult who has not had it measured (alongside the patient's first
  lipid panel as an adult, or at next routine lipid draw for an
  established patient). Document the result in the lifetime problem
  list / family history section because the value is genetically
  determined and stable. Do not repeat. Add ApoB to the order set
  for patients on lipid-lowering therapy with ASCVD, CKM, T2D, or
  TG ≥175 once LDL-C and non-HDL-C goals are achieved or close —
  ApoB is most useful to guide further intensification, not to make
  initial treatment decisions.
- Familial hypercholesterolemia (HeFH) evaluation: ApoB is not
  required for HeFH diagnosis — clinical (Dutch Lipid Clinic Network
  / Simon Broome / MEDPED criteria) and genetic testing pathways are
  the diagnostic standard. ApoB elevation supports the picture but
  is not a diagnostic criterion. Lp(a) measurement is recommended in
  patients with suspected FH because elevated Lp(a) compounds risk
  and may be inherited in the same families.
```

Use the shared bundle prompt template (lines 391–419 above) — paste these claims into the `[paste bundle claims here]` slot.

**Bundle 3 findings:**

OE response received 2026-05-05. Raw response in `verification/lipid1-3.md`. Per-claim verdict + tracker mapping below. **Result: 13 of 21 claims verified outright; 6 require correction; 2 net-new investigational-therapy content items (muvalaplin + zerlasiran omitted from prompt; Phase 2/3 reduction magnitudes corrected upward); plus the OE-acknowledged non-VHR ASCVD COR 2a tighter-goal sub-recommendation that the response truncated mid-quote.** Major outputs: 12 net-new tracker rows (41–52); 13 net-new citations into references staging; one anticipated anchor confirmed (`grundy-2018-cholesterol`). DD2 (ESC/EAS comparator) — partially closed by Claim 5 + Claim 6 reframing; full ESC/EAS comparator passage already exists in Fegers-Wustrow JACC 2022 cite, no separate query needed.

**Most consequential corrections from Bundle 3:**
1. **175 nmol/L "very high" Lp(a) threshold is NOT in 2026 ACC/AHA Table 4** — derives from EAS consensus, not the current US guideline. Module must use the actual Table 4 schema (75–124 → 1.2x; 125 → 1.4x; 250 → 2x; 350 → 3x; 430 → 4x) or the simpler ≥125 elevated / ≥250 ≥2-fold framing. Drop the 175 figure entirely.
2. **Friedewald is not categorically "inaccurate at TG ≥150"** — accuracy degrades progressively. Martin/Hopkins or Sampson/NIH preferred (COR 1, LOE B-NR) for all patients. Module language should reflect a gradient, not a hard threshold.
3. **Statin effect on Lp(a) is "generally small" (mean +1.1 mg/dL), NOT 10–15%.** Xie 2025 meta-analysis: no significant statin effect on Lp(a). Drop the 10–15% figure.
4. **PCSK9 mAb Lp(a) reduction is ~15–30%** per 2026 guideline (~26% pooled in meta-analysis). Inclisiran ~22% — modestly lower than PCSK9 mAbs at ~29%, NOT "similar magnitude." Niacin 37% but deprecated.
5. **Investigational Lp(a)-specific therapies achieve up to 80–98% reduction** (NOT "80–90%"). Olpasiran, zerlasiran, lepodisiran reach ~98% Phase 2; pelacarsen ~80%; muvalaplin (oral, ~65%) and zerlasiran were both omitted from the original claim.
6. **Discordance trigger TG threshold differs by context.** 2026 guideline ApoB section: TG ≥150 mg/dL is the discordance threshold. Risk enhancer table: TG ≥175 nonfasting / ≥150 fasting. Don't conflate.
7. **REDUCE-IT (icosapent ethyl) covers TG 135–499 with ASCVD or DM, NOT only ≥500.** Module must not gate IPE behind ≥500.
8. **Lp(a) Phase 2 secondary causes are broader than nephrotic syndrome / estrogen.** Add: kidney/liver/thyroid disease, pregnancy, menopause, some medications, inflammation (which may increase OR decrease Lp(a)).
9. **"Very high Lp(a) → tighter LDL target" is NOT a guideline-specified recommendation.** 2026 guideline only states "elevated Lp(a) favors initiating or intensifying LLT" — frame the tighter-target move as clinical judgment, not guideline.
10. **2026 guideline non-VHR ASCVD has a COR 2a sub-recommendation to treat to a tighter LDL goal** (specific number truncated by OE in Claim 1; carry into Bundle 4 / Bundle 5 as a follow-up clarification — likely <55 mg/dL based on the Ez-PAVE result captured in Row 32 + the future-state VESALIUS-CV signal in Row 40). Tracked as DD3.

**New evidence cited by OE in Bundle 3:**
- **Xie 2025 meta-analysis (Atherosclerosis 408:120420)** — 147-RCT, 145,314-subject pooled analysis of LDL-lowering therapies' effect on Lp(a). Authoritative reference for therapy effects.
- **Nordestgaard & Langsted Lancet 2024** — comprehensive Lp(a)-and-CVD review covering investigational therapies including muvalaplin and zerlasiran.
- **Qiao Drugs 2026 umbrella review** + **Mulligan JCL 2026 systematic review** — corroborate the PCSK9-mAb / inclisiran / lerodalcibep / enlicitide Lp(a)-lowering magnitudes.
- **Tsimikas JACC 2017 "A Test in Context"** — Lp(a) diagnosis / prognosis / niacin AIM-HIGH context.
- **Albers JACC 2013** — AIM-HIGH outcomes-by-apolipoprotein analysis (anchor for niacin's deprecation).
- **Malick JACC 2023** — JACC Focus Seminar on Lp(a)-lowering trial design (pelacarsen/olpasiran/lepodisiran trial structure).
- **Raja Atherosclerosis 2023** — non-HDL-C state-of-the-art review (atherogenic-lipoprotein-particle inventory).
- **Sajja JAMA Network Open 2021** — LDL-C estimation method accuracy at <70 mg/dL (Friedewald vs Martin/Hopkins vs Sampson).
- **Sampson JAMA Cardiology 2020** — original publication of the Sampson/NIH equation.
- **Sajja JACC 2022** — equation-discordance in ASCVD (paired with Sajja 2021 for Friedewald-replacement framing).
- **Newman JCEM 2020 (Endocrine Society)** — endocrine-disorders lipid CPG (cited by OE for context on alternative ApoB targets in specific endocrine populations).
- **Fegers-Wustrow JACC 2022** — JACC comparison of ACC/AHA vs ESC/EAS frameworks (the canonical comparator paper for ESC/EAS-vs-2026-ACC/AHA differences; partially closes DD2).
- **Ellis JACC 2019** + **Trinder JACC 2020** — Lp(a)-cascade-testing-in-FH supporting evidence (figures only in OE response; full citations captured for Bundle 6 / FH coverage).

**Per-claim verdicts (Bundle 3):**

- **Claim 1** (Non-HDL-C as co-primary; per-tier goals: VHR <85, non-VHR ASCVD <100, high-risk PP <100, borderline/intermediate <130, severe primary hyperchol <130). **Largely supported with non-VHR ASCVD nuance.** OE confirms per-tier numerics; Top Take-Home Message #4 supports co-primary framing. **Notable OE pushback:** *"the non-VHR ASCVD tier has a notable nuance: the guideline provides a COR 2a recommendation to treat non-VHR ASCVD patients to the tighter [truncated]"* — OE's response was clipped mid-quote at the actual numeric. Almost certainly <55 mg/dL based on Ez-PAVE (Row 32) + the VESALIUS-CV future-state signal (Row 40), but worth direct verification. **Action:** New Row 41 (per-tier non-HDL-C goals locked) + tracked as DD3 (non-VHR ASCVD COR 2a tighter LDL target — defer to Bundle 4 or capture as a quick follow-up query).[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc][ref:raja-atherosclerosis-2023]

- **Claim 2** (Non-HDL-C = TC − HDL-C; captures LDL+VLDL+IDL+Lp(a)+chylomicron remnants; no fasting). **Verified.** Section 3.2 confirms calculation, free with standard panel, "correlates well with apoB" / "less discordance with apoB compared with LDL-C." Fasting and nonfasting non-HDL-C have similar prognostic value; fasting preferred for TG ≥400 or suspected genetic dyslipidemia.[ref:acc-aha-dys-2026][ref:raja-atherosclerosis-2023] No new tracker row — reinforces Row 5 / Row 41.

- **Claim 3** (Friedewald inaccurate at TG ≥150, uninterpretable at ≥400; non-HDL-C valid full TG range). **Partially supported — TG framing wrong.** OE pushback: Friedewald accuracy **degrades progressively** with rising TG (especially at low LDL-C); not categorically inaccurate at 150. ≥400 LDL-C "is no longer reported" confirmed. **Critical operational addition:** **Martin/Hopkins and Sampson/NIH equations are preferred (COR 1, LOE B-NR) over Friedewald for all patients** — outperform Friedewald even at TG ≥150 mg/dL.[ref:acc-aha-dys-2026][ref:sajja-jacc-2022][ref:sajja-jamano-2021][ref:sampson-jamacardio-2020] **Action:** New Row 42 — replace "Friedewald inaccurate at ≥150" framing with "accuracy degrades progressively + Martin/Hopkins or Sampson/NIH preferred." Operational impact: Epic LDL-C result reporting should default to Martin/Hopkins or Sampson, not Friedewald — module should note the lab-platform dependency.

- **Claim 4** (ApoB COR 2a, residual-risk tool). **Verified with addition.** OE adds: 2026 guideline also includes **COR 2b for ApoB in untreated adults** to enhance risk assessment + characterize inherited lipid disorders.[ref:acc-aha-dys-2026] **Action:** New Row 43 — ApoB has both COR 2a (treated, residual-risk) AND COR 2b (untreated, risk-assessment / inherited-disorder characterization) recommendations. Module should not narrow ApoB to "treated only."

- **Claim 5** (No universal ApoB numeric target; only ACC/AHA-specified ApoB number is <55 mg/dL severe hyperchol+ASCVD). **Verified — caution against ESC/EAS cross-application sound.** ESC uses SCORE for fatal CV events; ACC/AHA uses PREVENT for total ASCVD events — frameworks define risk categories differently. Cross-applying numeric ApoB thresholds across frameworks is a methodological error.[ref:acc-aha-dys-2026][ref:fegers-wustrow-jacc-2022][ref:endocrine-society-2020] No new tracker row — reinforces Row 31. **Cite `fegers-wustrow-jacc-2022`** as the canonical ESC/EAS-vs-ACC/AHA comparator.

- **Claim 6** (was Claim 6 in prompt, ESC/EAS ApoB targets <65 VHR / <80 high). **Verified.** OE confirms 2019 ESC/EAS uses these numerics. PCPs operating under 2026 ACC/AHA should NOT adopt them as ACC/AHA targets — guideline-specific. The two frameworks define VHR differently (Mach 2019 EHJ; Fegers-Wustrow 2022 comparator).[ref:fegers-wustrow-jacc-2022] No new tracker row — captured in Row 31 already.

- **Claim 7** (ApoB ≥120 risk enhancer, updated from 2018 ≥130). **Verified.** Confirmed: 2026 risk enhancer table lists "apoB ≥120 mg/dL" alongside LDL-C 160–189 and non-HDL-C 190–219; 2018 list used ≥130.[ref:acc-aha-dys-2026][ref:grundy-2018-cholesterol] Reinforces Row 6 cascade. No new tracker row but **`grundy-2018-cholesterol` confirmed** in references staging (was anticipated).

- **Claim 8** (Lp(a) universal screening COR 1). **Verified.** Section 3.4 COR 1, LOE B-NR: *"In all adults, measurement of Lp(a) concentration is recommended at least once for ASCVD risk assessment."* Major upgrade from 2018 (Lp(a) was risk enhancer only).[ref:acc-aha-dys-2026][ref:abbasi-jama-2026] Reinforces Row 8 + Row 18. No new tracker row.

- **Claim 9** (Lp(a) thresholds: ≥125=50 elevated, ≥250=100 ≥2-fold, very high ≥175=80; conversion ~2.5). **Mostly supported with corrections.** Confirmed: ≥125 nmol/L → 1.4-fold; ≥250 → 2-fold; ≥430 → 4-fold. **Critical correction: 175 nmol/L "very high" threshold is NOT in 2026 ACC/AHA Table 4** — derives from EAS consensus statement. Table 4 schema: 75–124 (1.2x), 125 (1.4x), 250 (2x), 350 (3x), 430 (4x). Conversion factor ~2.5 — equivalence is approximate due to apo(a) isoform variation.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] **Action:** New Row 44 — drop 175 nmol/L threshold entirely. Module rewrite must use either the actual Table 4 schema OR simpler ≥125 elevated / ≥250 ≥2-fold framing. Cascades with Row 18.

- **Claim 10** (Lab reporting: most US in mg/dL; specialty labs prefer nmol/L). **Verified.** OE confirms: "preferable to measure Lp(a) using assays calibrated in molar units (nmol/L) and apo(a) isoform-insensitive"; "laboratories should report the assay name and the units"; "difficult to compare results measured by different assays and laboratories."[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] No new tracker row — flesh into Row 18 / Row 44 rewrite scope.

- **Claim 11** (Single Lp(a) measurement sufficient; exceptions nephrotic syndrome / estrogen). **Verified with broader secondary causes.** OE expands: "kidney, liver, or thyroid disease; pregnancy; menopause; and some medications. Inflammation may increase or decrease Lp(a)."[ref:acc-aha-dys-2026] **Action:** New Row 45 — module rewrite must list the broader secondary-cause set, not just nephrotic syndrome / estrogen. Operationally: this changes the "what could explain a discrepant repeat Lp(a)" differential.

- **Claim 12** (Elevated Lp(a) ≥125 supports earlier statin in borderline; very high ≥250 may justify <70 in non-VHR ASCVD or earlier PCSK9). **Partially supported — overstates guideline.** First half (≥125 supports LLT initiation/intensification, COR 2a in borderline) confirmed. Second half (very high → tighter LDL target like <70 in non-VHR ASCVD) **NOT explicit in 2026 guideline**. Guideline says only "elevated Lp(a) favors initiating or intensifying LLT."[ref:acc-aha-dys-2026] **Action:** New Row 46 — frame the "very high Lp(a) → tighter LDL target" move as clinical judgment, not guideline-specified. Module text should distinguish guideline-attributed framing from clinician-judgment framing here. Important pedagogical signal — the Cardiometabolic team has been counseling tighter targets for high Lp(a), but it's an interpretation.

- **Claim 13** (Statins +10–15% Lp(a); PCSK9 mAbs ~25–30%; inclisiran similar; niacin deprecated). **Mostly supported with corrections.** **Statin effect: NOT 10–15%; mean +1.1 mg/dL absolute, "generally small"** — Xie 2025 meta-analysis (147 RCTs, 145,314 subjects) found NO significant statin effect on Lp(a). Literature reports 8–24% but guideline characterizes as small. **PCSK9 mAbs: ~26% pooled** (evolocumab 30–47%, alirocumab 19–26%) — 2026 guideline cites "~15% to 30%" range. **Inclisiran: ~22%, modestly LOWER than PCSK9 mAbs** (NOT "similar magnitude"). **Niacin: 37% reduction confirmed but deprecated** per AIM-HIGH + HPS2-THRIVE.[ref:acc-aha-dys-2026][ref:xie-atherosclerosis-2025][ref:qiao-drugs-2026][ref:mulligan-jcl-2026][ref:albers-jacc-2013][ref:tsimikas-jacc-2017] **Action:** New Row 47 — drop "10–15% statins raise Lp(a)"; specify ~26% PCSK9 mAb / ~22% inclisiran / ~37% niacin (deprecated). Operationally important: the differential between PCSK9 mAb (~26%) vs inclisiran (~22%) reduction informs which agent to pick for elevated-Lp(a) patient already at LDL goal.

- **Claim 14** (No FDA-approved Lp(a)-specific therapy; pelacarsen/olpasiran/lepodisiran ~80–90% Phase 2). **Supported with two omissions + reduction-magnitude correction.** OE adds: **muvalaplin** (oral small-molecule inhibitor, ~65% reduction) and **zerlasiran** (siRNA, up to 98%) — both omitted from prompt. **Reduction range up to 80–98%** (NOT 80–90%): pelacarsen ~80%; olpasiran/zerlasiran/lepodisiran up to 98%; muvalaplin ~65%.[ref:acc-aha-dys-2026][ref:nordestgaard-lancet-2024][ref:malick-jacc-2023] Trials accurately named: pelacarsen → Lp(a)HORIZON (NCT04023552); olpasiran → OCEAN(a); lepodisiran → ALPACA. **Action:** New Row 48 — add muvalaplin + zerlasiran to module's investigational-therapies coverage; correct reduction range to "up to 80–98%" with per-agent breakdown. Pedagogical importance: muvalaplin's ORAL administration is a future-state differentiator vs all other modalities.

- **Claim 15** (ApoB+Lp(a) coverage details, $20–60 / $30–80, E78.5 / Z83.42). **Reasonable but not guideline-sourced.** OE notes: coverage and OOP cost variable by payer/region; can't verify from clinical guidelines. Diagnosis codes reasonable but verify with payer. No tracker change but Row 19 (coverage placeholder resolution) should NOT cite guideline as source for cost figures — frame as "varies by payer; check before ordering." Diagnosis codes can be retained as common operational examples.[ref:acc-aha-dys-2026]

- **Claim 16** (Discordance: TG ≥175 nonfasting, IR/MetS/T2D, CKM, FCH, FH). **Verified with TG-context disambiguation.** OE: 2026 ApoB section uses **TG ≥150 mg/dL** as discordance threshold; risk enhancer table uses TG ≥175 nonfasting / ≥150 fasting. Module text should distinguish the two contexts.[ref:acc-aha-dys-2026] **Action:** New Row 49 — module rewrite should disambiguate: discordance trigger = TG ≥150 (ApoB section); risk enhancer trigger = ≥175 nonfasting (risk enhancer table). Don't conflate. Operationally: the ApoB section threshold is the operational one for "should I order ApoB to disambiguate this patient's burden."

- **Claim 17** (Stepwise: LDL → non-HDL → ApoB; intensify statin or add ezetimibe; fibrate/IPE for TG ≥500). **Supported with TG-scope correction.** **Critical TG correction: REDUCE-IT (icosapent ethyl) covers TG 135–499 with ASCVD or DM, NOT only ≥500.**[ref:acc-aha-dys-2026] Module text should NOT gate IPE behind ≥500 — REDUCE-IT enrolled patients with TG 135–499 + statin therapy + ASCVD or DM. **Action:** New Row 50 — correct IPE indication scope. Operational impact: a non-VHR ASCVD patient on statin with TG 200 + diabetes is an IPE candidate per REDUCE-IT, not a fibrate candidate. Important — the v1.0.0 module doesn't currently mention IPE at all; this could be a co-primary-targets FAQ addendum.

- **Claim 18** (Non-HDL-C preferred over ApoB for routine monitoring). **Verified.** Top Take-Home Message #5: ApoB useful "once LDL-C and non-HDL-C goals are met." Section 3.2: "strong support for routine reporting of non-HDL-C as part of standard lipid profile."[ref:acc-aha-dys-2026] No new tracker row — reinforces Row 5 / Row 41.

- **Claim 19** (PCSK9 mAb dual benefit elevated Lp(a)). **Supported with caveats.** PCSK9i lower Lp(a) ~15–30% per 2026 guideline. **Critical operational addition:** for ASCVD patients with elevated Lp(a) NOT at LDL-C/ApoB goal, **2026 guideline says "PCSK9i with proven cardiovascular benefit should be preferentially considered"** — i.e., evolocumab (FOURIER) or alirocumab (ODYSSEY OUTCOMES), NOT inclisiran (CVOT pending) for this specific indication. Off-label use solely for Lp(a) lowering in patient already at LDL goal noted as off-label rationale.[ref:acc-aha-dys-2026] **Action:** New Row 51 — PCSK9 mAbs with proven CV benefit (evolocumab/alirocumab) should be preferentially considered over inclisiran for ASCVD+elevated-Lp(a)-not-at-LDL-goal; cascades with Row 34 (inclisiran second-line). The off-label-for-Lp(a)-only-when-at-LDL-goal framing is also worth carrying.

- **Claim 20** (Operational PCP workflow). **Reasonable synthesis with TG-trigger correction.** OE: ApoB recommendation uses "elevated TG" without specifying 175; ApoB section references TG ≥150; risk enhancer table uses ≥175 nonfasting.[ref:acc-aha-dys-2026] Cascades with Row 49 — use guideline language ("elevated TG") or specify ≥150 from ApoB section. No new tracker row beyond Row 49.

- **Claim 21** (FH diagnosis: ApoB not required; Lp(a) cascade COR 1 in FH families). **Verified.** OE: 2026 recommends genetic testing for FH (COR 2a) and clinical criteria; **does NOT list ApoB as a diagnostic criterion**. Adults with severe hypercholesterolemia "may have LDL-C ≥190 mg/dL and/or apoB ≥140 mg/dL" — population descriptor, not diagnostic criterion. **Lp(a) cascade testing in FH families: COR 1.**[ref:acc-aha-dys-2026][ref:ellis-jacc-2019][ref:trinder-jacc-2020] Direct quote: "elevated Lp(a) is common in patients with FH; however, FH does not cause elevated Lp(a)." **Action:** New Row 52 — Lp(a) cascade testing in FH families is COR 1 (not "recommended" generically). Bundle 6 will fully cover FH; tee up `ellis-jacc-2019` and `trinder-jacc-2020` for the cascade-testing evidence base.

**OE end-of-bundle additional flag (truncated):** OE response began a "Summary of key corrections" section that began *"1. Non-VHR ASCVD has a two-tier goal structure (Figure 2…"* but was truncated by OE's copy-paste. Per-claim findings above already capture the substantive points; figures referenced (Sajja JAMA Network Open 2021, Sampson JAMA Cardiology 2020, Ellis JACC 2019, Trinder JACC 2020) are image-only and not surfaced in the live module per user policy — citations captured in references staging.

**OE end-of-bundle offer:** None explicit in this response (the truncated summary likely contained one). DD2 (ESC/EAS comparator) is sufficiently closed by Claims 5 + 6 with `fegers-wustrow-jacc-2022` as the canonical comparator citation. **DD3 added:** non-VHR ASCVD COR 2a tighter LDL goal (truncated in Claim 1) — defer to Bundle 4 / Bundle 5 or a fast follow-up query if needed.

**Summary of new tracker rows seeded by Bundle 3:** 41 (per-tier non-HDL-C goals locked), 42 (Friedewald progressive degradation + Martin/Hopkins/Sampson preferred), 43 (ApoB COR 2b for untreated adults), 44 (Lp(a) 175 nmol/L threshold dropped + Table 4 schema), 45 (Lp(a) secondary causes broader than nephrotic+estrogen), 46 (very-high-Lp(a) → tighter LDL framed as judgment not guideline), 47 (statin/PCSK9/inclisiran/niacin Lp(a)-effect magnitudes corrected), 48 (muvalaplin + zerlasiran added; reduction range to 80–98%), 49 (TG context disambiguation: ≥150 ApoB section vs ≥175 risk enhancer), 50 (REDUCE-IT/IPE scope TG 135–499 with ASCVD/DM, not only ≥500), 51 (PCSK9 mAb with proven CV benefit preferentially in ASCVD+elevated-Lp(a)+not-at-LDL-goal), 52 (Lp(a) cascade testing in FH families is COR 1).

**Citations confirmed or added:** `acc-aha-dys-2026` (heavy), `acc-aha-dys-2026-jacc` (multiple), `abbasi-jama-2026` (reinforced), `grundy-2018-cholesterol` (**confirmed from anticipated**), `raja-atherosclerosis-2023` (**new** — non-HDL-C state-of-the-art), `sajja-jacc-2022` (**new** — equation discordance in ASCVD), `sajja-jamano-2021` (**new** — LDL-C estimation method accuracy), `sampson-jamacardio-2020` (**new** — Sampson/NIH equation original), `endocrine-society-2020` (**new** — Endocrine Society lipid CPG), `fegers-wustrow-jacc-2022` (**new** — ESC/EAS-vs-ACC/AHA canonical comparator), `xie-atherosclerosis-2025` (**new** — Lp(a)-effects-of-LLT meta-analysis), `qiao-drugs-2026` (**new** — PCSK9i Lp(a) umbrella review), `mulligan-jcl-2026` (**new** — Lp(a) reduction systematic review), `albers-jacc-2013` (**new** — AIM-HIGH apolipoproteins outcome), `tsimikas-jacc-2017` (**new** — Lp(a) "A Test in Context"), `malick-jacc-2023` (**new** — Lp(a)-lowering trial design seminar), `nordestgaard-lancet-2024` (**new** — comprehensive Lp(a)+CVD review covering muvalaplin/zerlasiran), `ellis-jacc-2019` (**new** — Lp(a) in FH cascade testing), `trinder-jacc-2020` (**new** — ascertainment bias Lp(a)-FH). 13 net-new refs from Bundle 3 + 1 anticipated anchor confirmed.

---

## Bundle 4 — Statin indication, SDM, CAC, statin-hesitant counseling

After Bundles 1–3 lock the risk-stratification (PREVENT thresholds), VHR criteria + LDL/non-HDL goals, and the co-primary-targets / advanced-markers framework, Bundle 4 turns to **the actual decision and conversation at the visit**: statin indication thresholds, the borderline-tier shared-decision-making + risk-enhancer + CAC framework, statin-hesitant counseling, intolerance / nocebo, statin-induced diabetes, SUPD HEDIS specifics, and payer realities for CAC.

**Includes DD3 (non-VHR ASCVD COR 2a tighter LDL goal — Row 41 + Bundle 3 Claim 1 truncated quote) as a single claim at the bottom — answer this with a focused yes/no/numeric so we can lock Row 41 before Phase 2 JSON rewrite.**

```
- The two automatic statin-initiation indications under the 2026
  ACC/AHA Dyslipidemia Guideline are: (a) PREVENT-ASCVD ≥10% 10-year
  risk → high-intensity statin (COR 1, ≥50% LDL-C reduction); and
  (b) LDL-C ≥190 mg/dL → high-intensity statin regardless of risk
  score (COR 1). Both proceed without a formal shared-decision-making
  conversation beyond standard informed consent.
- For borderline-risk patients (PREVENT-ASCVD 3% to <5%), shared
  decision-making applies (COR 2a). Statin therapy is reasonable
  when: any 2026-table-13 risk-enhancing factor is present (incl.
  ApoB ≥120 mg/dL, Lp(a) ≥125 nmol/L / ≥50 mg/dL, family hx of
  premature ASCVD, hs-CRP ≥2 on >1 occasion, TG persistently ≥175
  nonfasting / ≥150 fasting, higher-risk ancestry [South Asian,
  Filipino], chronic inflammatory disease, persistent LDL-C 160–189
  / non-HDL-C 190–219, expanded reproductive risk markers); OR CAC
  result drives initiation.
- For intermediate-risk patients (PREVENT-ASCVD 5% to <10%),
  moderate-intensity statin therapy is reasonable (COR 2a), with
  high-intensity statin considered to achieve ≥50% LDL-C reduction.
  LDL-C goal when initiated on statins is <100 mg/dL. Risk
  enhancers may support escalation but do not gate initiation.
- Coronary artery calcium (CAC) scoring is now COR 1 (upgraded from
  2a in 2018) for risk reclassification in intermediate-risk and
  select borderline-risk adults (men ≥40, women ≥45) where the
  decision to initiate statin therapy is uncertain.
- CAC = 0 supports deferral with reassessment in 3–7 years (NOT 5–7
  as the v1.0.0 module says). CAC ≥100 OR ≥75th percentile for
  age/sex supports statin initiation.
- For primary-prevention patients with CAC ≥1000, the 2026 guideline
  introduces an LDL-C goal of <55 mg/dL (COR 1, LOE B-NR). For
  CAC 300–999, it is reasonable (COR 2a) to intensify therapy to
  achieve LDL-C <55 mg/dL.
- The 30-year PREVENT-ASCVD ≥10% risk in adults aged 30–59 with low
  10-year risk (<3%) is a Class 2a moderate-intensity-statin
  initiation trigger — NOT just a counseling tool. This is net-new
  in the 2026 guideline and operationally extends statin
  consideration into younger patients with cumulative-exposure
  burden.
- CAC scoring in primary care: typical out-of-pocket cost is ~$75
  to $150 when not covered. CMS / Medicare coverage for CAC scoring
  in primary prevention has expanded — as of CY 2024, CMS provides
  payment for CAC scoring under specific HCPCS codes when ordered
  for SDM in primary-prevention patients with intermediate-risk
  uncertainty. Commercial coverage varies but has improved
  alongside the 2026 guideline COR 1 upgrade. Module text should
  not categorically state "not covered" — verify locally and check
  with the payer team.
- For statin-hesitant patients, evidence-based counseling beats
  intuition: (a) statin benefits are dose-dependent and modest in
  absolute terms but consistent in relative-risk reduction across
  trials (CTT Collaboration meta-analysis: ~22% per mmol/L LDL-C
  reduction); (b) safety profile in modern PCSK9 / very-low-LDL
  trials shows NO signal for cancer, dementia, hemorrhagic stroke
  — confirmed by AHA 2023 ATVB scientific statement (Goldstein
  et al.); (c) NNT for primary prevention varies by baseline risk
  but is in the range of ~50–100 for ~5-year MACE prevention at
  the recommended statin doses for intermediate-to-high-risk
  patients.
- Statin-induced diabetes risk: meta-analyses show ~9–12% relative
  risk increase in incident T2D vs placebo; absolute increase is
  ~1 case per 255 patient-years. The benefit-risk balance is
  strongly favorable — ASCVD events prevented far exceed incident
  T2D cases in moderate-to-high-intensity statin therapy. Patients
  with prediabetes / metabolic syndrome / Asian ancestry may have
  slightly higher T2D risk but should not be excluded from statin
  therapy on this basis. Continue statin if T2D develops on
  therapy.
- Statin intolerance vs nocebo: blinded placebo-controlled
  rechallenge data (notably the SAMSON trial, Howard et al. NEJM
  2021) suggests up to 90% of statin-attributed adverse symptoms
  are nocebo effects (symptoms occurred at similar rates on
  placebo as on statin, and on no-tablet days). Practical
  approach: (a) confirm with a structured symptom diary; (b)
  discontinue and rechallenge with the same or different statin
  at a lower dose; (c) consider non-daily dosing (atorvastatin or
  rosuvastatin 1–3× weekly) before declaring intolerance; (d)
  document genuine intolerance only after at least 2 statin
  failures with rechallenge. True statin myopathy is rare
  (~1–10 cases per 10,000 person-years); rhabdomyolysis is much
  rarer (~1–3 per 100,000).
- Pregnancy: the 2021 FDA labeling change removed the categorical
  contraindication of statin therapy during pregnancy. Statins may
  now be continued in patients with established ASCVD or HeFH on a
  case-by-case basis if benefit outweighs theoretical risk; for
  most patients without established ASCVD, statins are still
  discontinued during pregnancy and lactation. The 2026 guideline
  addresses pregnancy-related lipid management separately.
- SUPD (Statin Use in Persons with Diabetes) is a HEDIS measure
  tracked via pharmacy claims for ages 40–75 with diabetes. Crystal
  Run's organizational target of ~90% exceeds the HEDIS national
  90th percentile commercial benchmark (~80–85%); Medicaid
  benchmarks are typically lower. The HEDIS measure rewards statin
  dispensing (pharmacy claims), NOT chart documentation of
  discussion. Local "every diabetic patient at every visit"
  documentation expectation is operational standard, not a HEDIS
  specification requirement.
- The HEDIS SUPD measure aligns with the 2026 ACC/AHA COR 1
  recommendation for moderate-intensity statin in adults 40–75 with
  diabetes; the populations and intent overlap closely. Patients
  with diabetes and ASCVD or 10-year ASCVD risk ≥10% qualify for
  high-intensity statin per 2026 guideline; HEDIS measure does not
  distinguish moderate vs high intensity.
- The 2018 cholesterol guideline's "Coronary Artery Calcium
  Scoring" Recommendation 16 was a COR 2a recommendation for risk
  stratification in adults aged 40–75 with intermediate risk where
  the decision to initiate statin was uncertain. The 2026 guideline
  upgrades this to COR 1 for risk reclassification in intermediate
  + select borderline-risk patients, with the Budoff position
  statement and contemporary outcomes data as the evidence base.

- DD3 (clarifying single claim from Bundle 3 Claim 1 truncated
  quote): The 2026 ACC/AHA Dyslipidemia Guideline includes a
  COR 2a sub-recommendation to treat non-very-high-risk ASCVD
  secondary prevention patients to a tighter LDL-C goal than the
  standard <70 mg/dL. What is the specific numeric (likely <55,
  but please confirm), and what is the rationale (e.g., Ez-PAVE
  trial, VESALIUS-CV future-state signal, or other)? Where does
  this sub-recommendation appear in the guideline (section
  reference)?
```

Use the shared bundle prompt template (lines 391–419 above) — paste these claims into the `[paste bundle claims here]` slot.

**Bundle 4 findings:**

OE response received 2026-05-05. Raw response in `verification/lipid4-6.md`. Per-claim verdict + tracker mapping below. **Result: 7 of 16 claims verified outright; 7 require correction (Claims 1, 3, 6, 9, 10, 11; Claim 2 needs additions); 1 verified with cost-range correction (Claim 8); DD3 closed with confirmed numeric (LDL <55).** Major outputs: 12 net-new tracker rows (53–64); 10 net-new citations into references staging (4 anticipated anchors confirmed, 6 fully new); DD3 closes Row 41 / Bundle 3 Claim 1 truncation.

**Most consequential corrections from Bundle 4:**
1. **"Without SDM" framing for COR 1 indications is wrong.** 2026 guideline Section 4.2.3.1 makes the individualized benefit-risk discussion a core element of patient-centered care **at every risk level, including COR 1 indications.** COR 1 means treatment "should" be provided — it does NOT exempt the clinician from SDM. Document the discussion even for PREVENT ≥10% and LDL ≥190 patients.
2. **There are THREE COR 1 statin-initiation indications, not two.** Module's "two automatic indications" frame omits **diabetes ages 40–75 (moderate-intensity, COR 1, Section 4.2.5)**.
3. **Intermediate-risk statin initiation is COR 1, not COR 2a.** Module currently frames as "reasonable to consider" — should be "should receive." Cascades with Row 12 / Row 1 PREVENT thresholds.
4. **CAC 300–999 has TWO recommendations, not one.** Primary: COR 1 LOE B-R, LDL <70 mg/dL. Separate sub-recommendation: COR 2a, intensification to LDL <55 mg/dL. Module currently conflates these as a single "<55 reasonable" tier. Operationally: a CAC 500 patient gets a COR 1 LDL <70 target with a COR 2a *option* to push tighter, not a COR 2a <55 target.
5. **CAC ≥1000 → LDL <55 (COR 1, LOE B-NR) is correct as written**; the CAC 300–999 conflation in Row 36 needs splitting.
6. **30-year ≥10% trigger LOE is C-LD (limited data), not B-NR or higher.** No RCTs in the <3% 10-year / ≥10% 30-year population. Guideline emphasizes a "trial of health behavior optimization" before pharmacotherapy. Module text should communicate the evidence-level caveat.
7. **CAC OOP cost is $50–$250 per guideline, not $75–$150.** The CY 2024 CMS HCPCS expansion claim cannot be confirmed from the current evidence — recommend verifying with the local Medicare Administrative Contractor. Module should NOT state "CMS expanded coverage in 2024" as fact; safer framing is "coverage is variable; verify locally."
8. **CTT magnitude is 20–21% per mmol/L (24% after first year), not "22%".** Silverman 2016 ~23% per mmol/L for LDL-receptor-upregulating therapies. The "~22%" approximation is acceptable; precise number prefers 20–21%.
9. **"Goldstein et al. 2023 AHA ATVB" CITATION DOES NOT EXIST.** Correct citation for the cancer/dementia/hemorrhagic-stroke safety statement is **Newman et al. 2019 AHA ATVB** (`newman-atvb-2019`). This is also a **cascade fix for Row 32** which currently cites `goldstein-atvb-2023` — the wrong citation needs to be replaced wherever it appears.
10. **Statin-induced T2D differs sharply by intensity per 2024 CTT IPD meta:** moderate-intensity 10% (RR 1.10), **HIGH-intensity 36% (RR 1.36)**. Module's flat "9–12%" applies only to moderate. **62% of new diagnoses occur in patients already in top quartile baseline glycemia.** Module text should acknowledge intensity-dependence and baseline-glycemia-dependence.
11. **SAMSON published in JACC 2021, NOT NEJM 2021.** Howard et al. *J Am Coll Cardiol*. 2021;78(12):1210-1222. Mean symptom scores 16.3 statin / 15.4 placebo / 8.0 no tablet. 50% of participants successfully restarted statins. NLA Warden 2023 cautions cannot generalize to all patients (small, self-selected populations).
12. **"Min 2 statin failures" is operational standard, NOT guideline-specified.** 2026 guideline does not specify a numeric minimum. Module text should attribute to organizational practice, not 2026 guideline.
13. **Statins remain contraindicated during lactation per FDA labeling.** 2021 FDA change applied to pregnancy only. Module text should split pregnancy (case-by-case for VHR ASCVD or FH+additional risk factors) from lactation (contraindicated).
14. **Two new risk enhancers** added to Table 13 in 2026 vs prior list: **CKM syndrome** and **high polygenic risk score (if measured)**. Module's risk-enhancer enumeration must include these.
15. **hsCRP ≥2 mg/L on 2 successive occasions in borderline-risk patients supports HIGH-INTENSITY statin (COR 2a, LOE B-R)**, not just moderate-intensity. Specific upgrade beyond the general risk-enhancer recommendation.
16. **DD3 CLOSED — non-VHR ASCVD COR 2a sub-recommendation: LDL <55 mg/dL.** Section 4.2.4.3. Ez-PAVE provides direct RCT support (HR 0.67, 95% CI 0.52–0.86 vs <70). Standard goal remains <70 mg/dL (COR 1); <55 is the COR 2a intensification.
17. **For LDL ≥190**, the module also needs to **exclude secondary causes** (hypothyroidism, nephrotic syndrome, ketogenic diet) and **evaluate for FH** before initiating. Currently treated as a single high-intensity-statin trigger; pre-treatment workup is missing.

**New evidence cited by OE in Bundle 4:**
- **Newman et al. AHA ATVB 2019** (Statin Safety Scientific Statement) — replaces the wrong "Goldstein 2023" citation. Authoritative for cancer / dementia / hemorrhagic stroke safety + statin myopathy + T2D absolute risk (~0.2%/year).
- **Cholesterol Treatment Trialists' Collaboration 2024 IPD meta** (Lancet Diabetes Endocrinol) — granular intensity-dependent T2D risk (10% moderate / 36% high).
- **CTT Collaborators 2012 Lancet** — "11 fewer MACE per 1000 over 5 years per 1 mmol/L" data point; underpins NNT 50–100 framing.
- **Collins et al. Lancet 2016** — CTT interpretation paper (statin efficacy and safety synthesis).
- **Silverman et al. JAMA 2016** — meta-analysis across LDL-receptor-upregulating therapies (~23% per mmol/L).
- **Howard et al. JACC 2021 (SAMSON)** — definitive nocebo crossover trial.
- **Warden et al. JCL 2023 (NLA Clinical Perspective)** — SAMS assessment + management; cautions about generalizing SAMSON / StatinWISE.
- **Agarwala et al. JCL 2024 (NLA Women of Reproductive Potential Consensus)** — anchor for pregnancy-statin individualization.
- **Kovacic et al. Circ 2026 (AHA Acute Coronary Syndromes in Premenopausal Women)** — anchor for lactation contraindication via FDA labeling.
- **Ez-PAVE / Lee NEJM 2026** — already in references staging from Bundle 2; reinforced for DD3 closure.

**Per-claim verdicts (Bundle 4):**

- **Claim 1** (two automatic indications: PREVENT ≥10% high-intensity + LDL ≥190 high-intensity, both without SDM). **Partially supported with significant errors.** Both COR 1 indications confirmed (Section 4.2.3.7 + Section 4.2.4.3). **CRITICAL CORRECTION:** "without SDM" is incorrect — Section 4.2.3.1 makes individualized benefit-risk discussion a core element at every risk level including COR 1; guideline provides a benefit-risk discussion checklist. **OMISSION:** Diabetes ages 40–75 is a third COR 1 indication (moderate-intensity, Section 4.2.5). For LDL ≥190, module also needs to exclude secondary causes (hypothyroidism, nephrotic syndrome, ketogenic diet) and evaluate for FH.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] **Action:** New Row 53 — frame COR 1 as "should be provided after SDM" not "without SDM"; add diabetes ages 40–75 as third COR 1 indication; add LDL ≥190 pre-treatment workup (secondary causes + FH evaluation).

- **Claim 2** (borderline-risk SDM + Table 13 risk enhancers including ApoB ≥120, Lp(a) ≥125, family hx, hsCRP ≥2, TG persistently ≥175 nonfasting, ancestry, chronic inflammatory disease, LDL 160–189, non-HDL 190–219, expanded reproductive risk markers; CAC drives initiation). **Supported with key additions.** Module list aligns with Table 13. **Two omissions:** **CKM syndrome** and **high polygenic risk score (if measured)** are net-new 2026 risk enhancers absent from the module. **Borderline-specific upgrade:** hsCRP ≥2 mg/L on **2 successive occasions** supports **high-intensity** statin therapy (COR 2a, LOE B-R) — stronger than the general moderate-intensity framing.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] **Action:** New Row 54 — add CKM syndrome + high polygenic risk score to module's risk-enhancer enumeration; add the hsCRP-on-2-occasions COR 2a high-intensity sub-recommendation to the borderline-tier prose.

- **Claim 3** (intermediate-risk PREVENT 5% to <10% — moderate-intensity statin reasonable, COR 2a, LDL <100 goal). **Correction needed.** Intermediate-risk statin initiation is **COR 1, not COR 2a** in the 2026 guideline — clinically meaningful: should "receive" not "consider."[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] **Action:** New Row 55 — change to COR 1; cascades with Row 12 (≥10% PREVENT high-intensity) and Row 1 (PREVENT thresholds).

- **Claim 4** (CAC upgraded to COR 1 for intermediate + select borderline; men ≥40 / women ≥45). **Supported.** Section 4.2.3.6 Recommendation 1: COR 1, LOE B-R. Age thresholds match guideline framing.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] Reinforces Row 11. No new tracker row.

- **Claim 5** (CAC = 0 → defer 3–7 yr; CAC ≥100 or ≥75th percentile supports statin). **Supported with two nuances.** 3–7 years confirmed (COR 2a, LOE B-NR, Section 4.2.3.6 Rec 2) — module's "5–7" was too narrow. **Caveat:** CAC = 0 deferral is appropriate **only** if no higher-risk conditions present (FH, LDL ≥190, diabetes age >40, current smoking, strong family history premature ASCVD). **Slight oversimplification:** **ANY CAC > 0 now triggers a COR 1 recommendation to initiate LLT** (not just ≥100 / ≥75th percentile); CAC ≥100 / ≥75th percentile is the **strongest indication within that COR 1 tier**, not a separate threshold above which the COR 1 first applies.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] **Action:** New Row 56 — module text needs both: (a) CAC = 0 deferral requires no higher-risk conditions; (b) ANY CAC > 0 is a COR 1 LLT indication, with ≥100 / ≥75th percentile being the strongest evidence within that tier.

- **Claim 6** (CAC ≥1000 → LDL <55 COR 1; CAC 300–999 → COR 2a LDL <55). **Major correction — module conflates two recommendations.** CAC ≥1000 → LDL <55 (COR 1, LOE B-NR) is correct. **CAC 300–999 has TWO recommendations:** (a) primary COR 1, LOE B-R, LDL **<70 mg/dL**; (b) separate COR 2a sub-recommendation to intensify to LDL <55 mg/dL.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] **Action:** New Row 57 — module rewrite must split the two CAC 300–999 recommendations. Operationally: a CAC 500 patient gets a COR 1 LDL <70 target with COR 2a *option* to push tighter, not a single "<55 reasonable" tier. **Cascades with Row 36** — Row 36's "CAC 300–999 → reasonable (COR 2a) to intensify to LDL <55" is partially right but missing the COR 1 LDL <70 primary goal.

- **Claim 7** (30-year PREVENT ≥10% in adults 30–59 with low 10-yr risk → moderate-intensity statin Class 2a). **Supported with critical evidence-level caveat.** **LOE is C-LD (limited data)**, not B-NR — guideline acknowledges no RCTs in <3% 10-yr / ≥10% 30-yr population. Guideline emphasizes a **"trial of health behavior optimization"** before pharmacotherapy.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] **Action:** New Row 58 — module text should communicate LOE C-LD evidence level + "lifestyle first" caveat. Cascades with Row 25 (which currently doesn't specify LOE).

- **Claim 8** (CAC OOP $75–$150; CMS expanded CY 2024). **Partially supported — cost range narrower than guideline; CMS claim unverified.** Guideline states $50–$250 OOP, broader than module's $75–$150. **The CY 2024 CMS HCPCS expansion claim cannot be verified from current evidence.** Module's "verify locally" guidance is sound; the specific assertion about CMS HCPCS payment for primary-prevention SDM should be removed or reframed.[ref:acc-aha-dys-2026] **Action:** New Row 59 — broaden cost range to guideline's $50–$250; remove or reframe the "CMS expanded CY 2024" claim ("coverage is variable; verify with local Medicare Administrative Contractor"). Don't fabricate specific CY 2024 expansion language.

- **Claim 9** (CTT ~22% per mmol/L; no signal cancer/dementia/hemorrhagic stroke; NNT 50–100; cites "Goldstein 2023 AHA ATVB"). **Largely supported with precision corrections + critical citation fix.** CTT magnitude: **20–21% proportional reduction per 1 mmol/L** (24% after first year) per CTT 2012; Silverman 2016 ~23% per mmol/L. ~22% is acceptable approximation. NNT 50–100 over 5 yr reasonable for intermediate-to-high-risk; CTT 2012: 11 fewer MACE per 1000 over 5 yr per mmol/L in low-risk populations. **CRITICAL CITATION FIX:** **"Goldstein et al. 2023 AHA ATVB" does not exist.** Correct citation is **Newman et al. 2019 AHA ATVB** (*Arteriosclerosis, Thrombosis, and Vascular Biology*. 2019;39(2):e38-e81). This is a **cascade fix for Row 32 and any module text referencing the cognitive-safety / hemorrhagic-stroke / cancer-safety claim**.[ref:newman-atvb-2019][ref:ctt-collaboration-2012][ref:collins-lancet-2016][ref:silverman-jama-2016] **Action:** New Row 60 — replace `goldstein-atvb-2023` with `newman-atvb-2019` everywhere it appears in references staging + tracker rows + Phase 2 module rewrite; tighten CTT magnitude to "20–21% per mmol/L (24% after first year)" or keep "~22%" with attribution.

- **Claim 10** (Statin-induced T2D ~9–12% RRI, 1 per 255 py; continue if T2D develops). **Supported with intensity-dependent precision update.** **2024 CTT IPD meta:** moderate-intensity 10% (RR 1.10, 95% CI 1.04–1.16); **HIGH-intensity 36% (RR 1.36, 95% CI 1.25–1.48)**. ADA 2026 cites Sattar OR 1.09, 1 case per 255 patients × 4 yr preventing 5.4 vascular events. AHA Newman 2019 absolute risk ~0.2%/year. **62% of new diagnoses occur in those already in top quartile baseline glycemia.** Continue-statin-if-T2D guidance well-supported.[ref:ctt-collaboration-2024][ref:newman-atvb-2019][ref:ada-2026-cv] **Action:** New Row 61 — module text should split moderate-intensity (10%) from high-intensity (36%) RRI; quote the "62% in top-quartile baseline glycemia" insight; module should not blanket the "9–12%" figure across all intensities.

- **Claim 11** (SAMSON ~90% nocebo; cites NEJM 2021; rechallenge approach including "min 2 statin failures"). **Largely supported with multiple citation + framing corrections.** **SAMSON published in JACC 2021, NOT NEJM 2021** — Howard JP, Wood FA, Finegold JA, et al. *J Am Coll Cardiol*. 2021;78(12):1210-1222. Mean symptom scores 16.3 statin / 15.4 placebo / 8.0 no tablet (statin vs placebo P=0.388); 50% successfully restarted post-trial. **NLA Warden 2023 caveat:** SAMSON / StatinWISE results "cannot be generalized to all patients" given small, self-selected populations. **"Min 2 statin failures" is operational standard, NOT 2026-guideline-specified.** True statin myopathy 1–10/10,000 person-years; rhabdomyolysis 1–3/100,000 (consistent with Newman 2019).[ref:samson-jacc-2021][ref:warden-jcl-2023][ref:newman-atvb-2019] **Action:** New Row 62 — fix citation to JACC 2021 wherever it appears; add NLA Warden 2023 generalizability caveat to statin-hesitant counseling; reframe "min 2 statin failures" as organizational practice, not guideline.

- **Claim 12** (2021 FDA labeling change removed categorical contraindication; case-by-case for ASCVD/HeFH). **Supported with lactation correction.** July 2021 FDA contraindication removal confirmed. 2026 guideline + 2022 ACC ECDP + 2024 NLA Consensus all confirm individualized benefit-risk discussion. 2026 guideline language: statins "may be considered in pregnant persons at very high risk for ASCVD (history of ASCVD or FH with additional risk factors)"; "it seems prudent to avoid statin therapy during pregnancy and while lactating" for most patients. **CRITICAL ADDITION: Statins remain contraindicated during lactation per FDA labeling.** 2021 change applied to pregnancy only.[ref:acc-aha-dys-2026][ref:acc-2022-decisionpathway][ref:agarwala-jcl-2024][ref:kovacic-circ-2026] **Action:** New Row 63 — module rewrite must split pregnancy (case-by-case for VHR ASCVD or FH + additional risk factors) from lactation (still contraindicated per FDA labeling). Frame both with the "prudent to avoid for most" qualifier.

- **Claim 13** (HEDIS SUPD ages 40–75 with diabetes; pharmacy claims; ~90% organizational target exceeds national 90th percentile). **Partially verifiable.** Population alignment with 2026 ACC/AHA COR 1 confirmed. HEDIS measures dispensing not chart documentation — confirmed. Specific benchmark figures (~80–85% commercial 90th percentile, ~90% organizational target) NOT independently verifiable from medical literature but plausible based on publicly available NCQA benchmark data.[ref:acc-aha-dys-2026][ref:ada-2026-cv] No new tracker row beyond Row 7 / Row 21 — reinforces both. Module should soften specific percentages to "consistent with publicly available NCQA benchmark data" or pull current-measure-year specs from NCQA directly.

- **Claim 14** (HEDIS SUPD aligns with 2026 COR 1 moderate-intensity diabetes 40–75; HEDIS doesn't distinguish intensity). **Supported.** Confirmed: 2026 guideline COR 1 LOE A moderate-intensity for diabetes 40–75; high-intensity COR 2a for those with multiple ASCVD risk factors. HEDIS measures any-statin dispensing.[ref:acc-aha-dys-2026][ref:ada-2026-cv] No new tracker row — reinforces Rows 7 / 21.

- **Claim 15** (2018 CAC was COR 2a; 2026 upgrades to COR 1). **Supported.** 2018 language: "COR 2a: In intermediate-risk or selected borderline-risk adults, if the decision about statin use remains uncertain, it is reasonable to use a CAC score." 2026 language: "COR 1: In adults at intermediate risk and select adults at borderline risk with no prior ASCVD, if the decision regarding LLT remains uncertain, a CAC score should be used for further risk stratification."[ref:acc-aha-dys-2026][ref:grundy-2018-cholesterol] No new tracker row — reinforces Rows 11 / 36.

- **Claim DD3** (non-VHR ASCVD COR 2a tighter LDL goal — confirm numeric + section). **CLOSED — LDL <55 mg/dL.** Section 4.2.4.3 (cited inline as both "Section 4.2.4.3" and "Section 4.2.4 series"). Standard goal remains LDL <70 mg/dL (COR 1) for non-VHR ASCVD secondary prevention; the COR 2a sub-recommendation is to **intensify to LDL <55 mg/dL**. **Direct RCT support: Ez-PAVE (Lee NEJM 2026)** — targeting LDL <55 vs <70 in ASCVD reduced 3-yr major CV events HR 0.67 (95% CI 0.52–0.86). Same trial that supports VHR <55 now applied as a 2a intensification option for non-VHR ASCVD.[ref:acc-aha-dys-2026][ref:lee-nejm-2026] **Action:** New Row 64 — DD3 closure. Module rewrite for `ldl-target` and `not-at-goal` FAQs must add the COR 2a <55 intensification option for non-VHR ASCVD (alongside the COR 1 <70 standard). Cascades with **Row 41** (per-tier non-HDL-C goals — non-VHR ASCVD tier now has clarified LDL split: <70 standard / <55 intensification) and **Row 33** (PCSK9 PA wording differentiation by VHR vs non-VHR — non-VHR ASCVD patients with LDL 55–70 are candidates for intensification under the COR 2a, not just LDL >70).

**OE end-of-bundle additional flag:** OE offered a follow-up: *"Would you like to explore the specific operational workflow for implementing the new CAC-stratified LDL-C goals (the tiered system from CAC 1–99 through ≥1000) in a primary care EHR decision-support tool?"* — DEFERRED. The tiered CAC framework is now fully captured across Rows 11 / 36 / 56 / 57; no need for a separate query unless Phase 2 module rewrite surfaces a CAC threshold ambiguity. If we run the deferred query, file as DD4.

**Summary of new tracker rows seeded by Bundle 4:** 53 (three COR 1 indications + SDM applies even at COR 1 + LDL ≥190 pre-treatment workup), 54 (CKM syndrome + polygenic risk score added to risk enhancers; hsCRP ≥2 on 2 occasions → COR 2a high-intensity for borderline), 55 (intermediate-risk statin = COR 1 not 2a), 56 (CAC = 0 deferral conditional on no higher-risk; ANY CAC > 0 = COR 1 with ≥100/≥75th percentile being strongest within COR 1), 57 (CAC 300–999 has TWO recommendations: COR 1 <70 primary + COR 2a <55 intensification — module currently conflates), 58 (30-year ≥10% LOE is C-LD, lifestyle-first emphasis), 59 (CAC OOP $50–$250 per guideline; CMS CY 2024 expansion claim cannot be verified — soften), 60 (CTT 20–21% per mmol/L precision; **Goldstein 2023 ATVB citation does not exist — replace with Newman 2019 AHA ATVB everywhere**), 61 (T2D RRI intensity-dependent: moderate 10% / HIGH 36%; 62% in top-quartile baseline glycemia), 62 (SAMSON published in JACC 2021 not NEJM; Warden 2023 generalizability caveat; "min 2 failures" is operational not guideline), 63 (lactation contraindication via FDA labeling separate from pregnancy), 64 (DD3 closure — non-VHR ASCVD COR 2a intensification to LDL <55 via Ez-PAVE).

**Citations confirmed or added:** `acc-aha-dys-2026` (heavy), `acc-aha-dys-2026-jacc` (multiple), `acc-2022-decisionpathway` (reinforced), `ada-2026-cv` (reinforced), `lee-nejm-2026` (reinforced — DD3 closure), `grundy-2018-cholesterol` (reinforced for 2018 CAC COR 2a), `newman-atvb-2019` (**new — REPLACES `goldstein-atvb-2023`**), `ctt-collaboration-2024` (**new** — intensity-dependent T2D IPD meta), `ctt-collaboration-2012` (**new** — 11/1000 over 5yr in low risk), `collins-lancet-2016` (**new** — CTT efficacy/safety synthesis), `silverman-jama-2016` (**new** — LDL-receptor-upregulating therapies meta), `samson-jacc-2021` (**new** — Howard et al. SAMSON; **JACC not NEJM**), `warden-jcl-2023` (**new** — NLA SAMS clinical perspective), `agarwala-jcl-2024` (**new** — NLA Women of Reproductive Potential), `kovacic-circ-2026` (**new** — AHA ACS in premenopausal women, lactation anchor). 9 net-new refs from Bundle 4 + 6 anchors reinforced.

**Cascade: `goldstein-atvb-2023` REPLACEMENT.** This citation was used in Row 32 (cognitive-safety reassurance) and the staging table. **Both must be updated to `newman-atvb-2019`** before Phase 2 module rewrite.

---

## Bundle 5 — Escalation sequence: ezetimibe, PCSK9, bempedoic acid, inclisiran, IPE

After Bundles 1–4 lock risk stratification, VHR + LDL/non-HDL goals, co-primary targets + advanced markers, and statin indication + SDM + CAC + counseling, Bundle 5 turns to **what to do when statin alone isn't enough**: the escalation sequence (now flexible per 2026), per-agent LDL-reduction magnitudes, CV outcome trials (IMPROVE-IT / FOURIER / ODYSSEY OUTCOMES / CLEAR Outcomes / REDUCE-IT), monitoring cadence, statin intensity dose-equivalence table, PCSK9 PA realities, and inclisiran's Medicare Part B (buy-and-bill) operational distinction.

**Substantially de-risked by prior bundles:**
- Sequencing flexibility (Row 4 / Row 14): 2026 explicitly removes ezetimibe-must-precede-PCSK9 requirement
- Bempedoic acid 2026 ACC/AHA COR 2a positioning broader than FDA label (Row 35)
- Inclisiran "second-line to PCSK9 mAbs" pending CVOT (Row 34, 51)
- ODYSSEY OUTCOMES median ~40 mg/dL (NOT 53), FOURIER ~30 mg/dL, IMPROVE-IT ezetimibe arm ~53 mg/dL (Row 32)
- Ez-PAVE direct RCT evidence for <55 in VHR + COR 2a intensification for non-VHR ASCVD (Row 32, Row 64)
- 4–12 week monitoring + 6–12 month thereafter (Row 38)
- REDUCE-IT (icosapent ethyl) covers TG 135–499 with ASCVD or DM, NOT only ≥500 (Row 50)
- Newman 2019 ATVB anchors very-low-LDL safety (Row 60 cascade fix; replaces Goldstein 2023)

```
- The 2026 ACC/AHA Dyslipidemia Guideline does NOT mandate a strict
  maximize-statin → ezetimibe → PCSK9 sequence. The 2018 stepwise
  framework is replaced with flexibility: choice of nonstatin add-on
  (ezetimibe vs bempedoic acid vs PCSK9 mAb vs inclisiran) is based
  on degree of additional LDL-C reduction needed, patient preference,
  cost / access, and route of administration. Operationally, however,
  most commercial PCSK9 mAb prior authorizations still require
  documentation of maximally tolerated statin therapy + ezetimibe
  trial OR documented ezetimibe intolerance. Module text should
  distinguish guideline-attributed flexibility from payer-driven
  practical sequencing.

- Ezetimibe (Zetia, generic): LDL-C reduction ~18–24% as monotherapy
  or add-on; CV outcomes evidence from IMPROVE-IT (Cannon NEJM 2015,
  ezetimibe + simvastatin vs simvastatin alone in post-ACS, 7-year
  follow-up, ~2% absolute MACE reduction, NNT ~50). 2026 guideline
  positions ezetimibe as a COR 1 add-on to statin in VHR ASCVD when
  not at LDL-C goal (the most common first-line nonstatin add-on
  given cost and access). Generic and inexpensive (~$10–$30/month
  cash). No PA typically required.

- PCSK9 monoclonal antibodies — evolocumab (Repatha) and alirocumab
  (Praluent): LDL-C reduction ~50–60% added to maximally tolerated
  statin ± ezetimibe. CV outcomes: FOURIER (Sabatine NEJM 2017,
  evolocumab, ASCVD on statin, 15% RRR MACE) and ODYSSEY OUTCOMES
  (Schwartz NEJM 2018, alirocumab, post-ACS 1–12 mo on high-intensity
  statin, 15% RRR MACE + mortality benefit in high-baseline-LDL
  subgroup). FDA approved for: ASCVD adults requiring additional LDL
  lowering, HeFH, HoFH (evolocumab). Subcutaneous Q2W or monthly.
  Patient-administered. Medicare Part D coverage (high copay tier
  even after step therapy). Commercial PA almost always required —
  documentation of maximally tolerated statin + ezetimibe trial OR
  documented ezetimibe intolerance is the typical pathway.

- Bempedoic acid (Nexletol; Nexlizet = bempedoic acid + ezetimibe
  fixed-dose combo): LDL-C reduction ~17–20% as monotherapy; CLEAR
  Outcomes (Nissen NEJM 2023) demonstrated 13% RRR MACE in
  statin-intolerant patients with established CVD or high CV risk
  (vs placebo, hsCRP-elevated cohort). FDA approved for adjunctive
  LDL-lowering in HeFH or established ASCVD requiring additional
  LDL reduction; CVOT outcome indication restricted to patients
  "unable to take recommended statin therapy" (statin-intolerant).
  2026 ACC/AHA COR 2a positioning is broader than FDA CVOT scope —
  guideline allows general add-on "with or without ezetimibe and/or
  PCSK9 mAb" for residual risk, but commercial PA may still require
  statin-intolerance documentation per FDA label. Notable safety:
  hyperuricemia (~5% incident gout vs ~2% placebo), tendon rupture
  warning (~0.5% cases), elevated transaminases. Oral once-daily.
  Generic not yet available (~$400–$500/month cash; PA on commercial
  with statin-intolerance documentation; Part D variable).

- Inclisiran (Leqvio): siRNA targeting hepatic PCSK9 mRNA; LDL-C
  reduction ~50% added to maximally tolerated statin (similar
  magnitude to PCSK9 mAbs but ~22% Lp(a) reduction is modestly LOWER
  than PCSK9 mAbs at ~26–29%). Twice-yearly subcutaneous dosing
  after initial day-1 + day-90 doses (Q6M maintenance). FDA approved
  for ASCVD or HeFH adjunctive LDL-lowering. CV outcomes evidence
  pending (ORION-4 + VICTORION-2P CVOTs). 2026 ACC/AHA positions
  inclisiran as second-line to PCSK9 mAbs ("in those unable to
  tolerate or obtain evolocumab or alirocumab OR have a strong
  preference for less frequent dosing"). For ASCVD + elevated Lp(a)
  + not at LDL-C/ApoB goal, 2026 guideline says PCSK9 mAbs with
  proven CV benefit (evolocumab / alirocumab) should be preferentially
  considered over inclisiran. Operational distinction: inclisiran is
  Medicare Part B buy-and-bill (administered in office), whereas
  PCSK9 mAbs are Part D (patient-administered, retail pharmacy) —
  for Medicare patients, inclisiran's Part B billing can be
  operationally simpler than navigating Part D step therapy + high
  copay tiers.

- Icosapent ethyl (Vascepa): EPA-only purified omega-3; CV outcomes
  via REDUCE-IT (Bhatt NEJM 2019) demonstrated 25% RRR MACE in
  patients with TG 135–499 mg/dL on statin therapy with established
  ASCVD or diabetes + ≥1 CV risk factor. FDA approved for adjunctive
  CV-risk reduction in TG ≥150 with ASCVD or DM + ≥2 CV risk factors.
  2026 ACC/AHA COR 2a for IPE 4 g daily in non-VHR ASCVD patients on
  statin with TG 135–499. Module rewrite must NOT gate IPE behind
  TG ≥500 — that's the older fibrate-territory threshold; IPE applies
  much more broadly. Notable: prescription-grade IPE (Vascepa) is
  the only EPA preparation with CVOT support; over-the-counter fish
  oil mixed EPA/DHA preparations do NOT show CV benefit (STRENGTH
  trial Nicholls JAMA 2020).

- 2026 ACC/AHA statin intensity dose-equivalence (Table 4 or similar):
  HIGH-INTENSITY statin (≥50% LDL-C reduction) — atorvastatin 40–80,
  rosuvastatin 20–40. MODERATE-INTENSITY statin (30–49% LDL-C
  reduction) — atorvastatin 10–20, rosuvastatin 5–10, simvastatin
  20–40, pravastatin 40–80, lovastatin 40, fluvastatin 80,
  pitavastatin 1–4. LOW-INTENSITY statin (<30% LDL-C reduction) —
  simvastatin 10, pravastatin 10–20, lovastatin 20, fluvastatin 20–40.
  Rosuvastatin and atorvastatin are the preferred high-intensity
  agents (CVOT-validated, broad evidence base). Simvastatin 80 mg
  is contraindicated for new initiation (FDA 2011 myopathy advisory).

- Lab monitoring after any LLT change: lipid panel + ALT at 4–12 weeks
  (COR 1, LOE A); thereafter every 6–12 months for goal achievement
  + adherence assessment. Nonfasting acceptable except in known
  hypertriglyceridemia (TG ≥400). Routine CK monitoring is NOT
  required absent symptoms. ALT monitoring at baseline; routine
  surveillance ALT only if symptomatic. Discontinue and investigate
  for ALT >3x ULN with symptoms, or CK >10x ULN with symptoms.

- Combination therapy at initiation: for VHR ASCVD patients with very
  high baseline LDL (e.g., LDL ≥190 + ASCVD + HeFH; or post-ACS at
  high recurrent-event risk), 2026 guideline allows combination
  initiation (statin + ezetimibe; statin + PCSK9 mAb in select cases)
  rather than serial single-agent escalation. The "trial-statin-first"
  default applies to most patients but is NOT mandatory when reaching
  goal in 4–12 weeks is operationally important. ACS in-hospital
  PCSK9 initiation has emerging evidence (EVOPACS, EPIC-STEMI) but
  is not yet a standard COR 1/2a recommendation in the 2026 guideline.

- Operational PCP workflow at LDL goal failure: (a) confirm adherence
  with pharmacy fill data + pill count; (b) confirm maximally
  tolerated statin dose (rosuvastatin 40 or atorvastatin 80, OR
  documented intolerance with lower-dose substitution per SAMSON-aware
  rechallenge); (c) add ezetimibe (low cost, no PA, ~18–24%
  additional reduction); (d) recheck lipid panel at 4–12 weeks; (e)
  if still above goal, escalate to PCSK9 mAb (commercial PA pathway)
  or bempedoic acid (statin-intolerant patients) or inclisiran
  (Medicare Part B-preferring patients); (f) for VHR ASCVD, target
  <55 mg/dL; non-VHR ASCVD, target <70 with COR 2a option to push
  to <55 (Section 4.2.4.3 Ez-PAVE-supported intensification); CAC
  ≥1000 primary prevention, target <55; CAC 300–999, target <70
  primary with COR 2a option to push to <55.

- Statin-intolerant pathway for nonstatin therapy access: prior to
  PCSK9 mAb or bempedoic acid PA, payers typically require
  documentation of (a) ≥2 statin trials at recommended intensities
  with structured rechallenge (per SAMSON-aware framework), (b)
  symptom diary correlating SAMS to statin exposure, (c) consideration
  of low-dose / non-daily / alternative-statin rechallenge before
  declaring intolerance. 2026 guideline does not specify a numeric
  trial count — this is payer practice. Bempedoic acid CVOT
  indication is limited to statin-intolerant patients per FDA label;
  PCSK9 mAb CVOT indications cover both ASCVD-on-statin and
  statin-intolerant ASCVD populations (FOURIER + ODYSSEY OUTCOMES
  enrolled both).

- Patient adherence considerations: PCSK9 mAbs are subcutaneous
  injection Q2W or Q1M (patient-administered) — adherence ~75%
  long-term in post-marketing data. Inclisiran Q6M (clinic-administered)
  has higher persistence (~95%) but requires office visit logistics.
  Bempedoic acid is oral once-daily — adherence comparable to statins.
  Ezetimibe is oral once-daily (often co-formulated with statins or
  bempedoic acid). For patients with adherence concerns, twice-yearly
  inclisiran or fixed-dose combo (Nexlizet = bempedoic acid +
  ezetimibe) may be preferable to multi-pill regimens.
```

Use the shared bundle prompt template (lines 391–419 above) — paste these claims into the `[paste bundle claims here]` slot.

**Bundle 5 findings:**

OE returned a high-density 12-claim verdict on 2026-05-05. Raw response in `verification/lipid4-6.md` under the Bundle 5 section header. Substantively the bundle delivered **eight high-impact corrections** (IPE COR 2b not 2a, bempedoic acid LDL magnitude split, bempedoic acid CLEAR-cohort framing, bempedoic acid gout 3.1% vs 2.1%, bempedoic acid statin DDI new operational, inclisiran FDA indication = hypercholesterolemia broadly NOT ASCVD-specific, lab-monitoring routine ALT/CK = COR 3 No Benefit, "Section 4.2.4.3 Ez-PAVE" reference flagged as potentially fabricated/misattributed) plus a constellation of smaller-magnitude clarifications. Anticipated NEJM trial citations (`improve-it-2015` / `fourier-2017` / `odyssey-outcomes-2018` / `reduce-it-2019`) all confirmed via OE references; STRENGTH trial mentioned but not specifically cited (still anticipated). 11 net-new tracker rows seeded (65–75 + cascades reflected on existing rows 13/14/15/16/34/35/38/47/50/51).

**Per-claim verdicts:**

- **Claim 1** (Sequencing flexibility — 2026 removes ezetimibe-must-precede-PCSK9; ezetimibe/PCSK9 mAb/bempedoic acid as parallel options). **Verified with correction.** Inclisiran is **NOT** a co-equal first-line nonstatin option — explicit second-line per 2026 ("inclisiran remains a second-line PCSK9 mAb"; COR 2a only "in those unable to tolerate or obtain evolocumab or alirocumab OR have a strong preference for less frequent dosing").[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc] Reinforces Row 4 (sequencing) + Row 16/34 (inclisiran second-line). Payer-sequencing distinction operationally accurate.[ref:acc-2022-decisionpathway]
- **Claim 2** (Ezetimibe — 18–24% LDL reduction, IMPROVE-IT NNT ~50). **Verified with correction.** LDL-C reduction is 18% as monotherapy / 25% incremental added to statin — claim's "18–24%" conflated the two. IMPROVE-IT follow-up is **mean 6 years**, not "7-year." NNT ~50 reasonable for overall population; substantially **lower (~16) in the ≥3 risk indicators subgroup** (6.3% ARR vs ~2% overall). For non-VHR ASCVD, ezetimibe is **COR 2a, NOT COR 1** (the COR 1 framing applies only to VHR ASCVD per Recommendation 5 / Section 4.2.6).[ref:acc-aha-dys-2026][ref:cannon-nejm-2015]
- **Claim 3** (PCSK9 mAbs — 50–60% LDL reduction, FOURIER/ODYSSEY OUTCOMES 15% RRR MACE). **Verified with broadening.** Guideline range is **45–64%** (broader than 50–60%). Alirocumab "mortality benefit in high-baseline-LDL subgroup" from ODYSSEY OUTCOMES is a **post-hoc subgroup finding** — overall trial did not show statistically significant mortality benefit in primary analysis. **Alirocumab also has HoFH FDA approval** (claim omitted; module rewrite must include).[ref:acc-aha-dys-2026][ref:fourier-2017][ref:odyssey-outcomes-2018][ref:fda-orange-book]
- **Claim 4** (Bempedoic acid — 17–20% LDL mono, 13% RRR MACE in CLEAR Outcomes hsCRP-elevated cohort, 5% gout). **Multiple errors flagged.** (a) LDL-C reduction is **21–24% as monotherapy** in statin-intolerant patients (claim's "17–20% mono" wrong); 17–18% is the add-on-to-statin figure. (b) **CLEAR Outcomes was NOT restricted to an hsCRP-elevated cohort** — hsCRP was not an enrollment criterion; the hsCRP reduction was a secondary finding. (c) FDA CVOT indication includes "(including those not taking a statin)" — broader than claim's strict "statin-intolerant." (d) **Gout rates: 3.1% vs 2.1%** (claim's "5% vs 2%" overstates by ~60%). (e) **NEW operational safety: bempedoic acid + simvastatin >20 mg/day or pravastatin 40 mg/day** → ~2-fold ↑ statin levels — avoid. 13% RRR MACE confirmed (HR 0.87, 95% CI 0.79–0.96). 2026 COR 2a positioning broader than FDA CVOT scope confirmed.[ref:acc-aha-dys-2026][ref:clear-outcomes-2023][ref:fda-nexletol-2026][ref:aha-acc-ccd-2023]
- **Claim 5** (Inclisiran — ~50% LDL reduction, ~22% Lp(a) lower than PCSK9 mAbs at ~26–29%, second-line, FDA-approved for ASCVD or HeFH). **Verified with correction.** LDL ~50% confirmed. Lp(a) reduction PCSK9 ~29% / inclisiran ~22% directionally correct via Xie 2025, but **Mulligan JCL 2026 found NO statistically significant difference** between agents (inclisiran vs evolocumab +4.9%, P=0.18) — the difference may not be clinically meaningful. Second-line positioning confirmed. **FDA approval is for hypercholesterolemia broadly (including HeFH); inclisiran does NOT have an ASCVD-specific indication** — claim overstates specificity. Medicare Part B confirmed; ORION-4 + VICTORION-2P pending.[ref:acc-aha-dys-2026][ref:xie-atherosclerosis-2025][ref:mulligan-jcl-2026][ref:fda-orange-book]
- **Claim 6** (Icosapent ethyl — 25% RRR MACE, COR 2a, TG 135–499). **Major correction on COR.** (a) **COR is 2b NOT 2a** ("may be reasonable") in 2026 — for adults ≥50 yr with ASCVD or DM + ≥1 risk factor, TG **≥150–499** mg/dL, LDL-C goal-managed. (b) **TG threshold is ≥150 mg/dL per guideline** (NOT 135 — that was REDUCE-IT enrollment cutoff). (c) **Mineral oil placebo controversy is THE reason COR is 2b not higher**: 2026 explicitly notes biomarker subanalysis showed IPE arm had no significant improvement in atherogenic lipids/lipoproteins/inflammatory markers, while mineral oil placebo arm experienced *deleterious* changes in these biomarkers — likely exaggerating the observed treatment effect. (d) STRENGTH (mixed EPA/DHA, no CV benefit) confirmed.[ref:acc-aha-dys-2026][ref:reduce-it-2019][ref:bhatt-jacc-2019]
- **Claim 7** (Statin intensity dose-equivalence table T1). **Verified with wording precision.** High-intensity (≥50% reduction): atorvastatin 40–80, rosuvastatin 20–40 ✓. Moderate (30–49%): atorvastatin 10–20, rosuvastatin 5–10, simvastatin 20–40, pravastatin 40–80, **lovastatin 40 (80 mg in parentheses)**, **fluvastatin XL 80 or 40 BID**, pitavastatin 1–4 ✓. Wording: **simvastatin 80 mg = "not recommended" by FDA, NOT "contraindicated"** (practical effect identical, but module should mirror FDA language). 2026 distinguishes **"Preferred Statins" (atorvastatin, rosuvastatin) vs "Other Statins"** within each intensity tier — net-new operational nuance for module rewrite (statin-intolerance rechallenge protocols + statin-naïve initiation should default to atorvastatin or rosuvastatin).[ref:acc-aha-dys-2026][ref:grundy-2018-cholesterol]
- **Claim 8** (Lab monitoring — lipid panel + ALT at 4–12 wk, every 6–12 mo thereafter, nonfasting OK except known hyperTG, no routine CK or surveillance ALT). **Verified with major correction.** (a) Lipid panel at 4–12 weeks COR 1 LOE A confirmed; every 6–12 mo confirmed. (b) Nonfasting OK except known hypertriglyceridemia (TG ≥400) confirmed. (c) **Routine CK monitoring = COR 3 No Benefit (LOE A)** — NOT routinely useful. (d) **Routine ALT/hepatic function monitoring = COR 3 No Benefit (LOE B-NR)** — module's "lipid panel + ALT at 4–12 wk" is **not supported** by 2026; the COR 1 specifies **lipid profile only**, not ALT. (e) Discontinuation thresholds (ALT >3× ULN with symptoms; CK >10× ULN with symptoms) are clinical-practice standards from prior guidelines/FDA labeling — not formally restated as 2026 recommendations. Module rewrite must drop the routine ALT cadence.[ref:acc-aha-dys-2026]
- **Claim 9** (Combination therapy at initiation — VHR-LDL≥190+ASCVD+HeFH or post-ACS at high recurrent-event risk allows statin+ezetimibe or statin+PCSK9 combo init). **Partially supported.** Severe hypercholesterolemia + ASCVD "almost always require aggressive combination therapy" supported per guideline; "and/or" language for nonstatin add-ons supported. **2026 guideline does NOT explicitly state combination initiation at first visit is COR 1 for typical (non-severe-hyperchol) ASCVD patients** — secondary prevention recs still reference "maximally tolerated statin therapy" as prerequisite before adding nonstatins. ACS in-hospital PCSK9 initiation (EVOPACS, EPIC-STEMI) — **emerging evidence; NO specific COR recommendation in 2026**.[ref:acc-aha-dys-2026][ref:bergmark-lancet-2022]
- **Claim 10** (Operational PCP workflow at LDL goal failure). **Mostly reasonable; major reference-fabrication flag.** (a) Steps (a)–(d) operationally sound. (b) LDL targets per Row 33+57+64 confirmed: VHR <55, non-VHR ASCVD <70 (COR 2a option to push to <55), CAC ≥1000 <55, CAC 300–999 <70 primary (COR 2a option to <55). (c) **CRITICAL: "Section 4.2.4.3 Ez-PAVE-supported intensification" reference cannot be verified in retrieved guideline text.** Section 4.2.4.3 corresponds to "Severe Hypercholesterolemia With LDL-C ≥190 mg/dL", NOT a general ASCVD intensification pathway. "Ez-PAVE" does NOT appear in the guideline text retrieved. **MAY BE FABRICATED OR MISATTRIBUTED.** This contradicts Bundle 4 DD3 closure (Row 64) which placed non-VHR ASCVD COR 2a <55 intensification at Section 4.2.4.3. **Substantive finding (non-VHR ASCVD COR 2a <55 per Ez-PAVE) is robust per Lee NEJM 2026 RCT, but the section number must be verified in the primary 2026 doc before Phase 2 module rewrite.**[ref:acc-aha-dys-2026][ref:lee-nejm-2026]
- **Claim 11** (Statin-intolerant pathway — ≥2 trials, SAMSON-aware rechallenge, bempedoic CVOT statin-intolerant only, PCSK9 mAb CVOT covers both). **Verified with corrections.** (a) **2026 guideline does NOT specify a numeric trial count** — payer requirements for ≥2 trials are payer-driven, not guideline-mandated. **2022 ACC ECDP recommended ≥2 (preferably 3) statins, including a low-dose / non-daily / alternative-statin trial** before declaring intolerance. Module rewrite must attribute to ECDP, not 2026 guideline. (b) Bempedoic acid CVOT limited to statin-intolerant per FDA confirmed. (c) **PCSK9 mAb CVOT NOT specifically restricted to statin-intolerant**: FOURIER enrolled ASCVD on statin; ODYSSEY enrolled post-ACS on high-intensity statin. **Neither trial enrolled statin-intolerant patients as primary population**, but FDA indications are NOT restricted to statin-intolerant. Module rewrite must clarify.[ref:acc-2022-decisionpathway][ref:acc-aha-dys-2026][ref:fourier-2017][ref:odyssey-outcomes-2018][ref:fda-orange-book]
- **Claim 12** (Adherence — PCSK9 mAb ~75% long-term, inclisiran ~95% persistence). **Directionally correct; specific numbers UNVERIFIABLE.** Both 75% and 95% **could not be verified from retrieved literature**. 2022 ACC ECDP notes inclisiran's twice-yearly dosing is "potentially attractive" for adherence concerns; 2026 guideline positions inclisiran for patients with "demonstrated poor adherence to PCSK9 mAbs." **General principle (Q6M improves persistence vs Q2W/Q4W self-injection) well-supported conceptually**, but specific percentages should be sourced (or removed) before Phase 2 module rewrite.[ref:acc-2022-decisionpathway][ref:acc-aha-dys-2026]

**Operational data points / corrections to bake into Phase 2:**

1. **IPE is COR 2b (NOT COR 2a) in 2026.** Module's "COR 2a" framing must be downgraded; the mineral oil placebo controversy must be acknowledged as the rationale for the lower COR.
2. **IPE TG threshold = ≥150 mg/dL per 2026 guideline** (not 135; 135 was REDUCE-IT enrollment).
3. **Bempedoic acid LDL split: 21–24% mono / 17–18% incremental add-on**, not blanket 17–20%.
4. **CLEAR Outcomes was NOT hsCRP-cohort-restricted.** Module rewrite must drop that framing.
5. **Bempedoic acid gout = 3.1% vs 2.1%** (not 5% vs 2%) — module rewrite uses the actual rate.
6. **NEW: Bempedoic acid + simvastatin >20 mg or pravastatin 40 mg → avoid (~2-fold statin level ↑).** Module rewrite must add this DDI to escalation FAQ + clinical-tools quick-reference.
7. **Inclisiran FDA indication = hypercholesterolemia broadly (incl HeFH); NO ASCVD-specific indication.** Module rewrite must not state "ASCVD or HeFH"; correct framing is "hypercholesterolemia adjunctive LDL-lowering, including HeFH."
8. **Routine ALT/CK = COR 3 No Benefit.** Module's routine-ALT cadence drops from 4–12 wk + 6–12 mo. Lipid profile only at 4–12 wk + 6–12 mo. Discontinuation thresholds (ALT >3× ULN, CK >10× ULN with symptoms) are FDA-labeling-driven clinical practice, not 2026 recommendations.
9. **Section 4.2.4.3 numbering ambiguity (Bundle 4 vs Bundle 5).** Bundle 4 placed non-VHR ASCVD COR 2a <55 intensification at Section 4.2.4.3; Bundle 5 OE says 4.2.4.3 = "Severe Hypercholesterolemia With LDL-C ≥190 mg/dL". Substantive finding (non-VHR ASCVD COR 2a <55 per Ez-PAVE/Lee NEJM 2026) is robust; **section number must be verified in primary 2026 doc** before Phase 2 module rewrite. Recommend Phase 2 simply omits the section number citation in favor of "per the 2026 ACC/AHA Dyslipidemia Guideline" — no operational loss.
10. **2026 distinguishes "Preferred Statins" (atorvastatin, rosuvastatin) vs "Other Statins" within each intensity tier.** Module rewrite should default to atorvastatin or rosuvastatin in initiation/rechallenge prose.
11. **Simvastatin 80 mg = FDA "not recommended" (not "contraindicated").** Module wording should mirror FDA language.
12. **Alirocumab also has HoFH FDA approval.** Module rewrite must include alongside evolocumab HoFH approval.
13. **Alirocumab ODYSSEY OUTCOMES mortality benefit = post-hoc subgroup**, not primary endpoint. Module text must mark as exploratory, not promote as headline finding.
14. **Ezetimibe non-VHR ASCVD COR = 2a (not 1).** Module rewrite must distinguish VHR (COR 1, LOE A) from non-VHR ASCVD (COR 2a) framing.
15. **Ezetimibe IMPROVE-IT NNT in ≥3 risk indicators ~16** (vs overall NNT ~50). Module rewrite should highlight the high-risk subgroup benefit for VHR + post-ACS counseling.
16. **PCSK9 mAb LDL-C reduction range = 45–64%** per 2026 (broader than module's "50–60%").
17. **Lp(a) PCSK9 vs inclisiran differential is NOT statistically significant per Mulligan 2026 meta** (despite Xie 2025 directional 29% vs 22%) — Row 47 / Row 51 framing softens.
18. **PCP workflow rewrite: combination initiation ≠ COR 1 for typical ASCVD.** "And/or" guideline language allows it for severe hyperchol+ASCVD, but typical ASCVD secondary prevention still defaults to maximally tolerated statin → reassess → add nonstatin.
19. **Statin-intolerance trial count (≥2 preferably 3) attributes to 2022 ACC ECDP**, NOT 2026 guideline. Module rewrite must attribute correctly.
20. **PCSK9 mAb CVOT NOT restricted to statin-intolerant.** FOURIER/ODYSSEY enrolled ASCVD-on-statin not specifically intolerant. Module rewrite must clarify (Row 14 / 33 cascade).
21. **Adherence percentages (PCSK9 ~75%, inclisiran ~95%) NOT in retrieved literature.** Module rewrite must source-or-remove specific numbers; default to general principle "Q6M dosing typically improves persistence vs self-administered Q2W/Q4W."

**Prompt-iteration notes:**

- Bundle 5 prompt structure mirrored Bundles 1–4 (claim list + pressure-test bullets + "verify against 2026 ACC/AHA + supporting evidence + FDA labeling"). OE returned a 12-claim verdict-by-claim response with summary table at bottom — same density as Bundles 2 + 4. No prompt-iteration needed for Bundle 6.
- **Pattern observed: OE flags fabricated/misattributed citations promptly when asked.** Both Bundle 4 (Goldstein 2023 ATVB → Newman 2019 cascade fix) and Bundle 5 (Section 4.2.4.3 + "Ez-PAVE" reference flagged) caught reference-attribution errors. Phase 2 module rewrite must double-check all section-numbered citations in the primary 2026 doc before final commit.
- **Pattern observed: COR-level precision matters operationally.** Bundle 4 caught intermediate-risk COR 1 (not 2a) and CAC 300–999 split (COR 1 <70 + COR 2a <55). Bundle 5 caught IPE COR 2b (not 2a) and ezetimibe non-VHR ASCVD COR 2a (not 1). When a module says "COR X for Y," the precise level + sub-recommendation structure must be verified against guideline text.
- **OE end-of-bundle offer:** *"Would you like to explore the specific 2026 guideline recommendations for ACS-to-outpatient lipid management transitions, including the emerging evidence for early in-hospital PCSK9 inhibitor initiation and its implications for PCP follow-up workflows?"* — DEFERRED. The ACS in-hospital PCSK9 framing is now tracked in Row 73 (Bundle 5) with Bergmark Lancet 2022 as the operational anchor; no specific COR recommendation exists in 2026 yet. Phase 2 module rewrite should briefly mention as forward-looking footnote (similar to Row 40 VESALIUS-CV future-state); Bundle 6 (LDL ≥190 / FH) takes priority.

**Summary of new tracker rows seeded by Bundle 5:** 65 (IPE three corrections — COR 2b not 2a + TG ≥150 not 135 + mineral oil placebo controversy explains COR 2b), 66 (Bempedoic acid four corrections — LDL 21–24% mono/17–18% add-on + gout 3.1%/2.1% + NOT hsCRP-restricted CVOT + FDA indication "(including those not taking a statin)" broader than statin-intolerant only), 67 (Bempedoic acid simvastatin/pravastatin DDI — NEW operational), 68 (Inclisiran FDA = hypercholesterolemia broadly NOT ASCVD-specific), 69 (Lab monitoring — routine ALT/CK = COR 3 No Benefit; lipid only at 4–12 wk; discontinuation thresholds via FDA labeling), 70 (Ezetimibe LDL split 18%/25%; IMPROVE-IT mean 6 yr; ≥3 risk indicators NNT ~16), 71 (Ezetimibe non-VHR ASCVD COR = 2a NOT 1), 72 (PCSK9 mAb LDL 45–64%; alirocumab HoFH FDA approval; alirocumab mortality post-hoc subgroup), 73 (Combination initiation NOT COR 1 for typical ASCVD; ACS in-hospital PCSK9 EVOPACS/EPIC-STEMI emerging — no COR rec yet), 74 (Statin-intolerance trial count = 2022 ACC ECDP attribution NOT 2026), 75 (PCSK9 mAb CVOT NOT restricted to statin-intolerant; Adherence percentages unverifiable; "Preferred Statins" tier framing; simvastatin 80 mg "not recommended" wording precision), 76 (Lp(a) PCSK9 vs inclisiran differential NOT statistically significant per Mulligan 2026 meta — softens Rows 47, 51), 77 (Section 4.2.4.3 numbering ambiguity — Bundle 4 vs Bundle 5 discrepancy; substantive finding robust; section number must be verified in primary 2026 doc — Row 64 cascade flag), 78 (anticipated NEJM citations confirmed via guideline references — `improve-it-2015` Cannon NEJM 2015, `fourier-2017` Sabatine NEJM 2017, `odyssey-outcomes-2018` Schwartz NEJM 2018, `reduce-it-2019` Bhatt NEJM 2019 all officially confirmed; STRENGTH still anticipated), 79 (Bundle 5 confirms cascade rewrites needed on Rows 4, 13, 14, 15, 16, 33, 34, 35, 38, 47, 50, 51 — module rewrite must touch all these rows during Phase 2).

**Citations confirmed or added:** `acc-aha-dys-2026` (heavy), `acc-aha-dys-2026-jacc` (multiple), `acc-2022-decisionpathway` (reinforced — statin-intolerance trial count + PCSK9 PA framework + inclisiran adherence framing), `aha-acc-ccd-2023` (reinforced — IMPROVE-IT/FOURIER/ODYSSEY synthesis), `clear-outcomes-2023` (reinforced — bempedoic acid CVOT + gout 3.1% vs 2.1% + LDL 21–24% mono / 17–18% add-on), `xie-atherosclerosis-2025` (reinforced — Lp(a) reductions PCSK9 ~29% / inclisiran ~22%), `mulligan-jcl-2026` (reinforced — NO statistically significant Lp(a) reduction differential between PCSK9 mAbs and inclisiran per 2026 meta), `lee-nejm-2026` (reinforced — Ez-PAVE direct RCT for <55 vs <70 in ASCVD), `grundy-2018-cholesterol` (reinforced — 2018 statin-intensity table baseline), `fda-orange-book` (reinforced — inclisiran/PCSK9 mAb/bempedoic acid label scope), **NEW citations**: `cannon-nejm-2015` (IMPROVE-IT NEJM original), `fourier-2017` (Sabatine NEJM 2017 — was anticipated, now confirmed via OE references), `odyssey-outcomes-2018` (Schwartz NEJM 2018 — confirmed), `reduce-it-2019` (Bhatt NEJM 2019 — confirmed), `nicholls-jamacardio-2024` (CLEAR Outcomes total events analysis — Nicholls JAMA Cardiology 2024), `bhatt-jacc-2019` (REDUCE-IT first and total ischemic events by baseline TG tertiles — Bhatt JACC 2019), `bergmark-lancet-2022` (ACS Lancet 2022 review — operational anchor for ACS in-hospital PCSK9 framing), `power-rosenson-2022` (Secondary Prevention chapter — book figure source), `fda-nexletol-2026` (Nexletol FDA prescribing label updated 2026-01-15 — bempedoic acid scope), `dixon-amjmed-2020` (IPE for reducing CV risk review), `goldberg-dca-2020` (2018 AHA/ACC + diabetes — IPE FDA indication framing). 7 net-new refs from Bundle 5 + 4 anticipated anchors confirmed (`improve-it-2015` Cannon, `fourier-2017` Sabatine, `odyssey-outcomes-2018` Schwartz, `reduce-it-2019` Bhatt) + 9 anchors reinforced.

**Cascade: `samson-2021-nejm` superseded.** Already deprecated in Bundle 4; Bundle 5 reinforces the JACC 2021 attribution.

**Cascade: Section 4.2.4.3 verification.** Row 64 (Bundle 4 DD3 closure) cited Section 4.2.4.3 for non-VHR ASCVD COR 2a <55. Bundle 5 OE says 4.2.4.3 = severe hyperchol LDL ≥190. Phase 2 module rewrite must verify section number in primary 2026 doc OR drop the section number citation in favor of "per the 2026 ACC/AHA Dyslipidemia Guideline" framing. Row 77 (Bundle 5) is the bookmark for this verification.

---

## Bundle 6 — LDL ≥190 / FH

_Pressure-tests:_
- _Immediate high-intensity statin at LDL ≥190 (cascade with Row 53 — SDM applies even at COR 1; secondary causes (hypothyroidism, nephrotic syndrome, ketogenic diet) must be excluded; FH evaluation must accompany)_
- _FH evaluation triggers (LDL ≥190 not explained by diet, premature family history, tendinous xanthomata)_
- _Dutch Lipid Clinic Network / Simon Broome / MEDPED diagnostic frameworks (cascade with Row 52 — ApoB ≥140 mg/dL is population descriptor for severe-hyperchol+ASCVD per 2026, NOT FH diagnostic criterion)_
- _When to refer for genetic testing vs treat clinically_
- _Family screening cascade (when to suggest, what to communicate; Lp(a) cascade testing in FH families is COR 1 per 2026 — `ellis-jacc-2019` + `trinder-jacc-2020` already in staging)_
- _Lifelong management framing_
- _3-tier LDL goal stratification for severe primary hypercholesterolemia (Row 37): (a) without HeFH/subclinical/risk factors → <100 (COR 1); (b) with HeFH / additional risk factors / documented coronary calcification → <70 (COR 1); (c) with clinical ASCVD → <55 (COR 1) — confirm middle-tier framing (any of the three triggers, OR HeFH + additional)_
- _Very-low LDL safety (cognition, hemorrhagic stroke, cancer — substantively closed by `newman-atvb-2019` + Bundle 4 cascade fix on Goldstein deprecation; FOURIER prespecified secondary at LDL <0.5 mmol/L via `giugliano-lancet-2017`; EBBINGHAUS via `rosenson-jacc-2018`; FOURIER-OLE 8-yr — keep verifying directly)_
- _Combination initiation for severe-hyperchol+ASCVD (cascade with Row 73 — supported per "almost always require aggressive combination therapy" framing; module rewrite must distinguish severe from typical)_
- _Statin-induced T2D in FH cohort context (cascade with Row 61 — does the high-intensity 36% RRI generalize? FH cohort baseline glycemia + lifelong duration may shift expected absolute incidence)_

**Substantially de-risked by prior bundles:**
- LDL ≥190 = COR 1 high-intensity statin + SDM applies + secondary-causes exclusion + FH evaluation (Row 53)
- 3-tier LDL goal (Row 37 — primary verification still pending for middle-tier definition)
- Lp(a) cascade testing in FH families COR 1 (Row 52)
- Severe-hyperchol+ASCVD combination initiation supported (Row 73)
- ApoB ≥140 NOT FH diagnostic (Row 52)
- FH does not cause elevated Lp(a) — independent risk factors that can co-occur (Row 52)
- Cognitive-safety reassurance via Newman 2019 ATVB (Row 32 cascade fix; Bundle 4 closure of Goldstein 2023 deprecation)
- Pregnancy + lactation framing (Row 63)

After Bundles 1–5 lock risk stratification, VHR + LDL/non-HDL goals, co-primary targets + advanced markers, statin indication + SDM + CAC + counseling, and the escalation sequence (ezetimibe / PCSK9 / bempedoic / inclisiran / IPE), Bundle 6 closes the module on **the LDL ≥190 / familial hypercholesterolemia population**: pre-treatment workup, FH diagnostic frameworks (Dutch Lipid Clinic Network / Simon Broome / MEDPED), 3-tier severe-hypercholesterolemia LDL-C goals (with middle-tier trigger-logic verification), genetic testing thresholds, family cascade screening (lipid + Lp(a)), pediatric FH initiation, lifelong-management framing, very-low-LDL safety reaffirmation, combination initiation in severe-hyperchol+ASCVD, and statin-induced T2D in the FH cohort context.

```
- LDL-C ≥190 mg/dL is a COR 1 indication for high-intensity statin
  therapy in adults aged 20+ regardless of calculated 10-year ASCVD
  risk, with intent to achieve ≥50% LDL-C reduction. Per Section
  4.2.3.1 of the 2026 ACC/AHA Dyslipidemia Guideline, an
  individualized benefit-risk discussion still applies — COR 1 means
  the therapy "should" be provided after SDM, not without discussion.
- Pre-treatment workup at first encounter with LDL-C ≥190 mg/dL
  includes: (a) excluding secondary causes — hypothyroidism (TSH),
  nephrotic syndrome (urine protein), cholestatic liver disease
  (hepatic panel), ketogenic / very-low-carb diet (dietary history),
  medication-induced hypercholesterolemia (oral estrogen, retinoids,
  immunosuppressants, atypical antipsychotics, corticosteroids);
  (b) clinical evaluation for familial hypercholesterolemia;
  (c) repeat fasting lipid panel to confirm before committing to
  long-term FH-pathway management.
- Familial hypercholesterolemia is diagnosed clinically using one of
  three established scoring frameworks: Dutch Lipid Clinic Network
  (DLCN), Simon Broome Register, or MEDPED. Genetic testing is
  confirmatory but not required for clinical diagnosis. The 2026
  ACC/AHA Dyslipidemia Guideline endorses DLCN as the primary
  framework for adult clinical diagnosis; the AHA 2020 FH Scientific
  Statement and 2024 ESC/EAS FH Consensus also center DLCN. DLCN
  score ≥6 ("probable" or "definite" FH) is the typical threshold
  for genetic testing referral.
- Diagnostic features in DLCN / Simon Broome / MEDPED include:
  family history of premature ASCVD, family history of LDL-C
  >190 mg/dL, personal LDL-C levels (untreated and treated),
  tendinous xanthomata (Achilles, finger extensor, patellar,
  triceps), and corneal arcus before age 45. Tendinous xanthomata
  and corneal arcus before 45 are the most specific physical
  findings; their absence does NOT rule out FH. Module text should
  not require physical findings to pursue an FH workup at LDL ≥190.
- ApoB ≥140 mg/dL appears in the 2026 guideline as a population
  descriptor for severe primary hypercholesterolemia + ASCVD
  (alongside LDL-C ≥190), NOT as a diagnostic criterion for FH.
  ApoB is not part of DLCN, Simon Broome, or MEDPED. ApoB does not
  differentiate monogenic FH from polygenic severe
  hypercholesterolemia.
- Severe primary hypercholesterolemia (LDL-C ≥190 mg/dL without
  established clinical ASCVD) carries a 3-tier LDL-C goal
  stratification under the 2026 ACC/AHA Dyslipidemia Guideline:
    Tier 1: without HeFH, subclinical atherosclerosis, or additional
    major risk factors → LDL-C goal <100 mg/dL (COR 1).
    Tier 2: with HeFH OR additional major risk factors OR documented
    coronary atherosclerosis (subclinical or clinical) →
    LDL-C goal <70 mg/dL (COR 1).
    Tier 3: with concurrent clinical ASCVD → LDL-C goal <55 mg/dL
    (COR 1; matches VHR target).
  Please confirm the middle-tier (Tier 2) trigger logic — does any
  one of HeFH / additional major risk factors / coronary
  atherosclerosis trigger Tier 2 (OR logic), or does the guideline
  specify HeFH AND at least one of the other two (AND logic)? See
  also DD4 below.
- For severe primary hypercholesterolemia + ASCVD, ApoB <55 mg/dL
  appears as a secondary / confirmatory goal once LDL-C and
  non-HDL-C goals are met (per Bundle 3 framing — verify against
  primary 2026 doc).
- Genetic testing for FH is a COR 2a recommendation in the 2026
  ACC/AHA Dyslipidemia Guideline (also supported by AHA 2020 FH
  Scientific Statement and 2024 ESC/EAS FH Consensus). Reasonable
  to pursue when DLCN ≥6 ("probable" or "definite"), or with
  intermediate DLCN + strong clinical suspicion (premature ASCVD
  family history, tendinous xanthomata, pediatric LDL ≥160).
  Pathogenic variants in LDLR, APOB, or PCSK9 confirm monogenic
  HeFH or HoFH; biallelic LDLRAP1 variants confirm autosomal
  recessive hypercholesterolemia (ARH). Negative genetic testing
  does NOT rule out clinical FH — ~20–40% of clinically definite
  DLCN cases lack identifiable pathogenic variants (polygenic
  contribution). Commercial coverage for FH genetic testing has
  expanded but typically requires pre-authorization with documented
  DLCN score; out-of-pocket cost varies $250–$1500.
- Cascade screening for FH families is COR 1 in the 2026 guideline.
  Operationally: index case identified → first-degree relatives
  (parents, siblings, children) screened with fasting lipid panel
  ± targeted genetic testing if a pathogenic variant is identified
  in the index case. Cascade extends to second-degree relatives if
  a first-degree relative tests positive. PCP is responsible for
  initiating cascade conversations even when treatment of relatives
  is referred to lipid specialists. Lp(a) cascade testing in FH
  families is also COR 1 — Lp(a) is independently inherited and
  FH does NOT cause elevated Lp(a), so Lp(a) and FH must be
  screened separately. Universal Lp(a) once-in-a-lifetime testing
  applies independent of FH status (per Bundle 3 conclusions).
- Pediatric FH screening: AAP, NLA, and 2020 AHA FH Scientific
  Statement recommend universal pediatric lipid screening once
  between ages 9–11 and again between 17–21. For confirmed
  pediatric HeFH, statin therapy is recommended starting at age
  8–10 (aligning with AAP and ESC/EAS pediatric guidelines), with
  goal LDL-C <130 mg/dL or ≥50% reduction. Statins are not
  initiated in children before age 8 except in HoFH or severe
  HeFH with major risk factors.
- Familial hypercholesterolemia is a lifelong condition. Adherence
  + cumulative duration on therapy correlate with outcomes more
  than peak LDL-C achieved at any single visit. Discontinuing
  statin therapy in adults with HeFH is rarely appropriate — risk
  reduction depends on cumulative-LDL-exposure reduction over
  decades. The "trial-and-discontinue" frame applied to lower-risk
  primary prevention does not apply to confirmed HeFH.
- Severe primary hypercholesterolemia + ASCVD (LDL-C ≥190 +
  clinical ASCVD) "almost always require aggressive combination
  therapy" per 2026 guideline language. Combination initiation
  (statin + ezetimibe at first visit, with PCSK9 mAb add-on as
  second step if not at goal in 4–12 weeks) is supported in this
  scenario, distinct from typical ASCVD secondary prevention which
  still defaults to maximally tolerated statin → reassess → add
  nonstatin. The choice between PCSK9 mAb, bempedoic acid, and
  inclisiran in HeFH+ASCVD is driven by LDL gap to goal, payer
  coverage, and patient preference — none of these agents has a
  preferred-position recommendation specifically in HeFH per 2026.
- PCSK9 monoclonal antibodies have FDA-approved indications for
  HeFH (both evolocumab and alirocumab) and HoFH (both evolocumab
  and alirocumab — the alirocumab HoFH approval was reaffirmed in
  Bundle 5 Claim 3). Inclisiran is FDA-approved for adjunctive
  LDL-lowering in patients with hypercholesterolemia, including
  HeFH (per Bundle 5 Claim 5 — there is NO ASCVD-specific
  inclisiran indication; HeFH is captured under the broader
  hypercholesterolemia indication). Bempedoic acid (Nexletol) is
  FDA-approved for HeFH adjunctive LDL-lowering (per Bundle 5
  Claim 4 — Nexletol prescribing information updated 2026).
- Lomitapide (Juxtapid) and evinacumab (Evkeeza) are FDA-approved
  specifically for HoFH; both require specialty management and
  are out of PCP scope. Module text should mention HoFH referral
  pathway exists but should not detail dosing or PA logistics.
- Statin-induced new-onset diabetes in the FH cohort: the 2024 CTT
  IPD meta-analysis intensity-dependence (10% RRI moderate / 36%
  RRI high-intensity; 62% of new diagnoses in top-quartile
  baseline glycemia) was derived from broad CTT populations.
  Please verify whether the 2026 guideline or recent FH-cohort
  data (EAS-FHSC registry, SAFEHEART cohort, CASCADE FH registry)
  modify the magnitude or benefit-risk framing for statin-induced
  T2D specifically in HeFH (where lifelong therapy duration may
  amplify cumulative incidence but where ASCVD prevention benefit
  is also amplified by genetic risk).
- Cumulative very-low LDL-C exposure safety: at LDL-C levels
  <40 mg/dL (approximately <1.0 mmol/L) and even <0.5 mmol/L,
  large RCT and long-term-extension data show no signal for
  cancer, dementia, hemorrhagic stroke, neurocognitive impairment,
  new-onset diabetes beyond the known intensity-dependent statin
  effect, or muscle / hepatic injury. Anchor citations: Newman
  et al. 2019 AHA ATVB Scientific Statement on Statin Safety;
  FOURIER prespecified secondary analysis at LDL-C <0.5 mmol/L
  (Giugliano Lancet 2017); EBBINGHAUS substudy (neurocognitive
  endpoints, Rosenson JACC 2018); FOURIER-OLE 8-year extension
  (no excess muscle / new-onset DM / neurocognitive — please
  confirm primary publication and citation). Per 2026 guideline,
  "there is no LDL-C below which additional benefit ceases"
  within the range studied. Module text should reassure that
  pursuing <55 mg/dL goals in FH+ASCVD does not introduce safety
  concerns.
- Counseling FH patients and families: emphasize (a) inherited
  condition, not a lifestyle failure (reduces blame / shame);
  (b) cumulative LDL-exposure model — "the sooner LDL is lowered,
  the more lifetime cardiovascular events are prevented";
  (c) cascade screening is an act of family advocacy; (d) lifelong
  therapy is the standard of care, not a short-term intervention;
  (e) for definite-FH pediatric patients, statin therapy from
  age 8–10 is the evidence-supported path, despite intuitive
  parental concern. Document the SDM + cascade-recommendation
  conversation in the chart — both are operationally important.

- DD4 (clarifying single claim — middle-tier severe-hyperchol
  trigger logic): In the 2026 ACC/AHA Dyslipidemia Guideline 3-tier
  LDL-C goal for severe primary hypercholesterolemia (LDL-C ≥190
  without concurrent clinical ASCVD), the middle tier specifies
  LDL-C goal <70 mg/dL "with HeFH, additional major risk factors,
  or documented coronary atherosclerosis." Is the trigger logic OR
  (any one of the three conditions triggers Tier 2) or does the
  guideline specify HeFH AND at least one of the other two? Where
  does this tier recommendation appear in the guideline (section
  reference)?
```

Use the shared bundle prompt template (lines 391–419 above) — paste these claims into the `[paste bundle claims here]` slot.

**Anticipated new citations (to seed references staging when Bundle 6 returns):** AHA 2020 FH Scientific Statement (Gidding et al. Circulation 2020 — pediatric + adult FH cascade + genetic testing recommendations); 2024 ESC/EAS FH Consensus (likely Eur J Prev Cardiol or similar — adult FH framework); Dutch Lipid Clinic Network original publication anchor (WHO 1998 — historical); Simon Broome Register publication anchor; MEDPED original publication (Williams 1993 Am J Cardiol); EAS-FHSC registry (Vallejo-Vaz et al. — global FH outcomes); SAFEHEART cohort (Spanish HeFH long-term outcomes); CASCADE FH registry (US HeFH outcomes); FOURIER-OLE 8-year extension primary publication (likely O'Donoghue et al. Circulation 2022 or 2023 — confirm citation); pediatric statin trials in FH (Rodenburg, Wiegman, Kusters — anchors for age 8–10 initiation safety/efficacy); AAP pediatric lipid screening recommendation. Anticipated tracker rows: ~10–15 (FH diagnostic framework, DLCN ≥6 genetic-testing threshold, Tier 2 trigger-logic resolution, ApoB ≥140 not FH-diagnostic reaffirmation, cascade screening operations, pediatric FH initiation, lifelong management framing, HoFH referral pathway, statin-T2D in FH cohort, very-low-LDL safety reaffirmation, FH-specific PCSK9/inclisiran/bempedoic acid FDA scope cross-references).

**Bundle 6 findings:**

OE returned a 17-claim verdict on 2026-05-06. Raw response in `verification/lipid4-6.md` under the Bundle 6 section header. Bundle 6 closed Phase 1 (OE-pass) of the lipid module verification. **DD4 RESOLVED: middle-tier severe-hyperchol trigger logic = OR (any one of HeFH / documented coronary calcification (CAC) / additional major risk factors triggers Tier 2)** — with critical wording correction that Tier 2 trigger is **"documented coronary calcification" (CAC), NOT broader "coronary atherosclerosis"** (clinical ASCVD = Tier 3). **Section 4.2.4.3 = "Severe Hypercholesterolemia With LDL-C ≥190 mg/dL"** confirmed by Bundle 6 (resolves Row 77 ambiguity from Bundle 4/5; module's "Section 4.2.3.1" reference is wrong). Bundle 6 delivered **eight high-impact substantive corrections** (genetic testing COR 1 for clinical FH not 2a; cascade screening COR 2a not COR 1; Tier 2 = CAC not coronary atherosclerosis; secondary-causes medication list correction per Table 15; DLCN not endorsed as "primary framework"; "2024 ESC/EAS FH Consensus" unverifiable; FOURIER-OLE 8-year unverifiable; inclisiran second-line in HeFH+ASCVD) plus several nuance/scope clarifications. **9 net-new citations** seeded into references staging. **19 net-new tracker rows** seeded (80–98). **AHA 2020 FH Scientific Statement → actually Gidding 2015 Circulation** (year correction; promote from anticipated → confirmed).

**Per-claim verdicts:**

- **Claim 1** (LDL-C ≥190 — COR 1 high-intensity statin, no risk calc, ≥50% reduction goal). **Supported with three corrections.** (a) Section is **4.2.4.3** NOT 4.2.3.1. (b) Guideline says "adults" without lower age bound of 20+ (claim's "adults aged 20+" overstates). (c) "COR 1 means therapy 'should' be provided after SDM" overstates SDM gating — 2026 supportive text does NOT explicitly mandate SDM for statin initiation at LDL ≥190 (SDM more prominent in primary prevention sections). PCP action: start max-tolerated statin at the visit LDL ≥190 confirmed; document rationale; SDM is good practice but not a gating requirement.[ref:acc-aha-dys-2026][ref:acc-aha-dys-2026-jacc]
- **Claim 2** (Pre-treatment workup — exclude secondary causes per Table 15 + FH evaluation + repeat lipid panel). **Supported with multi-point correction.** Section 4.2.4.3 Recommendation 1 = COR 1 LOE B-NR for excluding secondary causes confirmed. Table 15 lists: hypothyroidism, nephrotic syndrome, obstructive liver disease/cholestatic disease, CKD, ketogenic/very-low-carb diets, glucocorticoids, **estrogens** (unspecified route, NOT "oral estrogen"), **cyclosporine** (NOT broader "immunosuppressants"), atypical antipsychotics, high-dose thiazides, androgens. **Module's "retinoids" NOT in Table 15** (cause hyperTG not isolated LDL elevation; isotretinoin specifically). NLA 2026 FH consensus also lists these + adds menopause as contributor. **2026 ACC/AHA does NOT explicitly require confirmatory repeat lipid panel before starting statin** — guideline recommends start max-tolerated statin + simultaneously evaluate. PCP action: order TSH, urine protein/creatinine ratio, hepatic panel, dietary + medication history; do NOT delay statin while awaiting results.[ref:acc-aha-dys-2026][ref:nla-fh-2026]
- **Claim 3** (FH clinical diagnosis — DLCN/Simon Broome/MEDPED frameworks with DLCN as primary). **Partially supported with critical corrections.** (a) **2026 ACC/AHA does NOT endorse DLCN as "primary framework"** — guideline focuses on **genetic testing** as primary diagnostic approach; doesn't mandate any specific clinical scoring system. VA/DoD 2026 references both DLCN + AHA classification. ESC/EAS 2019 + EAS consensus do center DLCN. (b) **"2024 ESC/EAS FH Consensus" cannot be verified** — most recent ESC/EAS dyslipidemia guideline = 2019; FH-focused review = Santos *Lancet Diabetes Endocrinol* 2025. Module rewrite must drop "2024 ESC/EAS FH Consensus" + cite Santos 2025 review instead. (c) DLCN ≥6 ("probable" 6–8 / "definite" >8) threshold confirmed. (d) **Genetic testing is NOT merely confirmatory** — 2026 gives **COR 1 LOE B-NR for clinical FH** (possible/probable/definite) + COR 2a for LDL ≥190 without secondary cause + COR 2b for LDL 160–189 without secondary cause. PCP action: DLCN reasonable; consider genetic testing for LDL ≥190 without secondary cause regardless of DLCN.[ref:acc-aha-dys-2026][ref:va-dod-lipid-2026][ref:santos-ldne-2025][ref:sturm-jacc-2018]
- **Claim 4** (DLCN/Simon Broome/MEDPED diagnostic features — family history, LDL levels, tendinous xanthomata, corneal arcus before 45). **Supported with MEDPED nuance.** Tendinous xanthomata + corneal arcus before 45 most specific physical findings; absence does not rule out FH. **MEDPED uses ONLY age-specific total cholesterol thresholds — does NOT incorporate family history or physical exam.** Module rewrite shouldn't lump all three frameworks as if they share diagnostic features.[ref:gidding-circ-2015][ref:qureshi-cochrane-2021][ref:sturm-jacc-2018]
- **Claim 5** (ApoB ≥140 as population descriptor, NOT FH diagnostic). **Verified.** Used as population descriptor "LDL-C ≥190 and/or apoB ≥140" for severe hyperchol. Not part of DLCN/Simon Broome/MEDPED. ApoB doesn't differentiate monogenic from polygenic.[ref:acc-aha-dys-2026]
- **Claim 6** (3-tier LDL-C goal stratification + DD4 trigger logic). **Supported in detail; DD4 RESOLVED with critical wording correction.** Section 4.2.4.3 provides exactly the 3-tier structure — **OR logic** (any one of HeFH / documented coronary calcification / additional major risk factors triggers Tier 2). **CRITICAL: Tier 2 is "documented coronary calcification" (CAC), NOT broader "coronary atherosclerosis."** Module's "subclinical or clinical coronary atherosclerosis" wording wrong. **Clinical ASCVD = Tier 3 (NOT Tier 2).** Tier 1: no HeFH/subclinical/risk factors → <100. Tier 2: HeFH OR CAC OR additional risk factors → <70. Tier 3: clinical ASCVD → <55. **Cascade with Row 37.**[ref:acc-aha-dys-2026]
- **Claim 7** (ApoB <55 as secondary check for severe hyperchol+ASCVD). **Supported as secondary/confirmatory once LDL/non-HDL met.** Bundle 3 framing confirmed.[ref:acc-aha-dys-2026]
- **Claim 8** (Genetic testing COR 2a). **Partially correct; module rewrite must stratify.** **For clinically suspected FH (possible/probable/definite) genetic testing is COR 1, NOT COR 2a** — significant upgrade in 2026. COR 2a applies only to broader LDL ≥190 population without clinical FH suspicion. COR 2b for LDL 160–189 without secondary cause. ~20–40% of clinically definite DLCN cases lack identifiable pathogenic variants — supported. Genes (LDLR, APOB, PCSK9, LDLRAP1) correct. **Cascade with Row 53.**[ref:acc-aha-dys-2026][ref:sturm-jacc-2018]
- **Claim 9** (Cascade screening COR 1 + Lp(a) cascade COR 1). **Major correction on COR + softening on Lp(a).** **Cascade lipid screening is COR 2a (NOT COR 1) per 2026** — for first/second-degree relatives of premature ASCVD / severe hyperchol / FH; ≥2 yo. Module's "COR 1" overstates. Operational description (index → first-degree → extend to second-degree if positive) reasonable. **Lp(a) cascade testing in FH families specifically COR 1 cannot be confirmed from retrieved evidence** — guideline recommends once-in-lifetime Lp(a) for adults generally. Module rewrite: drop "Lp(a) cascade in FH families is COR 1 per 2026"; use universal once-in-lifetime Lp(a) framing. "FH does NOT cause elevated Lp(a)" + independent inheritance biologically correct. **Softens Row 52 framing.**[ref:acc-aha-dys-2026][ref:ellis-jacc-2019][ref:trinder-jacc-2020]
- **Claim 10** (Pediatric FH screening — 9–11 universal + 17–21 second window + age 8–10 statin initiation). **Supported with citation correction.** Universal pediatric lipid screening at 9–11 = COR 1 LOE B-NR confirmed. Cascade can begin at age 2. Statin from age 8–10 in confirmed pediatric HeFH consistent with AAP + ESC/EAS pediatric guidelines. LDL goal <130 / ≥50% reduction supported. **2026 ACC/AHA does NOT include 17–21 second universal screening window in formal recommendations** — that comes from 2011 NHLBI Expert Panel (endorsed by AAP). Module rewrite must cite source accurately.[ref:acc-aha-dys-2026][ref:gidding-circ-2015]
- **Claim 11** (FH lifelong + cumulative LDL exposure). **Verified.** "Duration of exposure to high LDL-C is an important driver of ASCVD risk" — central theme of 2026. Discontinuing statin in HeFH rarely appropriate; "trial-and-discontinue" frame doesn't apply.[ref:acc-aha-dys-2026][ref:nla-fh-2026][ref:santos-ldne-2025]
- **Claim 12** (Severe hyperchol + ASCVD combination therapy). **Supported with sequencing + inclisiran corrections.** Recommendation 5 supportive text "almost always require aggressive combination therapy" confirmed. Lists ezetimibe, PCSK9 mAbs, and/or bempedoic acid as add-on options. (a) **Module's "statin+ezetimibe first visit, PCSK9 mAb add-on as second step in 4–12 weeks" reflects 2022 ACC ECDP shape NOT 2026** — 2026 lists agents as options without mandating order; "and/or" language permits upfront combination. Module rewrite: keep stepwise as one option but allow upfront combination per 2026 language. (b) **"None of these agents has preferred-position recommendation specifically in HeFH" PARTIALLY INCORRECT** — 2026 explicitly positions inclisiran as **second-line to PCSK9 mAbs** (COR 2a vs COR 1 for PCSK9 mAbs); "pending CVOT results, inclisiran remains a second-line PCSK9 mAb." **Cascade with Rows 16, 34, 73, 75, 76.**[ref:acc-aha-dys-2026][ref:acc-2022-decisionpathway][ref:nla-fh-2026]
- **Claim 13** (FDA indications — evolocumab/alirocumab/inclisiran/bempedoic acid). **Supported with bempedoic completeness.** Evolocumab: HeFH (adults + ped ≥10), HoFH (adults + ped ≥10), ASCVD risk reduction, primary hyperlipidemia ✓. Alirocumab: HeFH (adults + ped ≥8), HoFH (adults), ASCVD risk reduction ✓. Inclisiran: hypercholesterolemia incl HeFH; no ASCVD-specific indication ✓ (Row 68). Bempedoic acid: LDL reduction primary hyperlipidemia incl HeFH AND CV risk reduction in adults unable to take recommended statin therapy. **Module's "FDA-approved for HeFH adjunctive LDL-lowering" correct but incomplete — CV-risk-reduction indication (CLEAR Outcomes) limited to statin-intolerant.** **Cascade with Rows 66, 75.**[ref:fda-orange-book][ref:fda-nexletol-2026]
- **Claim 14** (Lomitapide + evinacumab for HoFH). **Verified.** 2026 recommends lipid specialist consultation for HoFH for lomitapide / evinacumab / lipoprotein apheresis. Both FDA-approved for HoFH. Out of PCP scope. Module text mentions referral pathway without dosing detail = appropriate.[ref:acc-aha-dys-2026][ref:raal-atherosclerosis-2018]
- **Claim 15** (Statin-T2D in FH cohort — 2024 CTT IPD intensity-dependence; lifelong amplification). **Partially supported — limited FH-specific data.** 2024 CTT IPD findings (10% RRI mod / 36% RRI high; 62% of new dx in top-quartile baseline glycemia) from broad populations. **Retrieved evidence does NOT include FH-specific data from EAS-FHSC, SAFEHEART, CASCADE FH that would modify framing.** 2026 doesn't appear to provide FH-specific guidance on statin-T2D. General principle (ASCVD prevention benefit far outweighs T2D risk per COR 1) consistent with COR 1 + lifelong-condition framing. PCP action: monitor HbA1c/fasting glucose per standard; do NOT withhold/reduce intensity in FH due to T2D risk. **Cascade with Row 61.**[ref:ctt-collaboration-2024][ref:acc-aha-dys-2026]
- **Claim 16** (Very-low LDL safety — Newman 2019 + Giugliano 2017 + EBBINGHAUS Rosenson 2018 + FOURIER-OLE 8-year). **Supported with citation correction.** Newman 2019 ATVB + Giugliano 2017 Lancet + Rosenson 2018 JACC EBBINGHAUS confirmed. **FOURIER-OLE 8-year extension CANNOT be confirmed from retrieved literature** — FOURIER OLE planned ~5 years (NCT03080935, NCT02867813). **Module rewrite: drop "8-year extension" framing; cite Sabatine 2018 JAMA Cardiology meta of IMPROVE-IT/FOURIER/REVEAL** (NEW citation `sabatine-jamacardio-2018`) for the very-low-LDL safety synthesis instead. Pair with Newman 2019 ATVB + EBBINGHAUS via Rosenson 2018.[ref:newman-atvb-2019][ref:giugliano-lancet-2017][ref:rosenson-jacc-2018][ref:sabatine-jamacardio-2018]
- **Claim 17** (FH counseling themes — inherited not lifestyle, cumulative LDL, cascade as family advocacy, lifelong therapy, age 8–10 pediatric). **Verified.** All consistent with 2026 + NLA 2026 FH consensus + Santos 2025 Lancet Diabetes Endocrinol review. SDM + cascade-recommendation chart documentation = standard practice.[ref:acc-aha-dys-2026][ref:nla-fh-2026][ref:santos-ldne-2025]

**Operational data points / corrections to bake into Phase 2:**

1. **Section 4.2.4.3** is "Severe Hypercholesterolemia With LDL-C ≥190 mg/dL" — confirmed by Bundle 6, resolves Row 77 ambiguity. Module's "Section 4.2.3.1" reference must change to 4.2.4.3.
2. **Drop "adults aged 20+" qualifier** — 2026 says simply "adults."
3. **Drop SDM-as-gating-requirement framing at LDL ≥190** — guideline language is more directive; SDM is good practice but not gating.
4. **Secondary-causes medication list:** drop "retinoids"; replace "immunosuppressants" with **cyclosporine**; drop "oral" qualifier on estrogen ("estrogens" without route per Table 15); add NLA 2026 acknowledgment of menopause as contributor.
5. **Drop confirmatory-repeat-lipid-panel-before-statin-initiation framing** — 2026 recommends start max-tolerated statin + simultaneously evaluate.
6. **Drop "DLCN as primary framework per 2026"** — 2026 emphasizes genetic testing; reframe as "DLCN is reasonable clinical tool."
7. **Drop "2024 ESC/EAS FH Consensus" citation** — replace with Santos *Lancet Diabetes Endocrinol* 2025 (`santos-ldne-2025`) + ESC/EAS 2019 dyslipidemia guideline.
8. **Genetic testing COR stratification:** COR 1 for possible/probable/definite FH; COR 2a for LDL ≥190 without secondary cause; COR 2b for LDL 160–189 without secondary cause. Module rewrite must stratify by clinical FH suspicion.
9. **MEDPED distinction:** uses ONLY age-specific total cholesterol thresholds (no family history or physical exam) — module shouldn't lump all three frameworks as sharing features.
10. **Tier 2 trigger logic = OR (DD4 RESOLVED).** Any one of HeFH / **documented coronary calcification (CAC)** / additional major risk factors triggers Tier 2. **CRITICAL: "documented coronary calcification" NOT broader "coronary atherosclerosis."** Clinical ASCVD = Tier 3.
11. **Cascade screening = COR 2a, NOT COR 1.** Module text must downgrade.
12. **Drop "Lp(a) cascade in FH families is COR 1 per 2026"** — could not be verified. Use universal once-in-lifetime Lp(a) testing framing instead. Softens Row 52.
13. **17–21 second pediatric screening window attributes to 2011 NHLBI Expert Panel + AAP, NOT 2026 ACC/AHA.**
14. **FH+ASCVD combination initiation:** 2026 permits upfront combination per "and/or" language; stepwise (statin → ezetimibe → PCSK9) is 2022 ACC ECDP shape, kept as one option. Module rewrite: distinguish.
15. **Inclisiran second-line in HeFH+ASCVD per 2026** — explicit "second-line PCSK9 mAb" positioning. Module rewrite: prefer evolocumab/alirocumab first; inclisiran for adherence concerns or PCSK9 mAb intolerance.
16. **Bempedoic acid two FDA indications:** LDL reduction primary hyperlipidemia incl HeFH (broad); CV risk reduction in adults unable to take recommended statin therapy (statin-intolerant only). Module rewrite must split.
17. **Statin-T2D in FH cohort:** extend the 2024 CTT IPD intensity-dependence (10% RRI mod / 36% RRI high) with caveat that retrieved evidence lacks FH-specific data; ASCVD prevention benefit far outweighs T2D risk per COR 1 + lifelong condition; do not withhold/reduce intensity in FH.
18. **Drop "FOURIER-OLE 8-year extension" citation** — could not be confirmed. Cite Sabatine 2018 JAMA Cardiology meta (`sabatine-jamacardio-2018`) for very-low-LDL safety synthesis instead.
19. **AHA 2020 FH Scientific Statement → actually Gidding 2015 Circulation** (`gidding-circ-2015`) — year correction; promote from anticipated → confirmed.

**Prompt-iteration notes:**

- Bundle 6 prompt structure mirrored Bundles 1–5 (claim list + DD4 trailing + pressure-test bullets + "verify against 2026 ACC/AHA + supporting evidence + FDA labeling"). OE returned 17-claim verdict-by-claim response with summary table. No prompt-iteration needed.
- **Pattern observed: OE corrects guideline section-number references aggressively when citations are speculative.** Bundle 4 caught Goldstein 2023 ATVB → Newman 2019 cascade fix. Bundle 5 flagged Section 4.2.4.3 / "Ez-PAVE" reference as misattributed. Bundle 6 corrected "Section 4.2.3.1" → 4.2.4.3 + flagged "2024 ESC/EAS FH Consensus" + "FOURIER-OLE 8-year extension" as unverifiable. **Phase 2 module rewrite must double-check all section-numbered citations + speculative references in primary 2026 doc before final commit.**
- **Pattern observed: COR-level precision matters operationally.** Bundle 6 caught two COR errors: (a) cascade screening COR 2a not COR 1 (downgrade); (b) genetic testing COR 1 for clinical FH not COR 2a overall (upgrade with stratification). When module says "COR X for Y," precise level + sub-recommendation structure must be verified.
- **Pattern observed: anticipated citations are often year-wrong.** Bundle 6 confirmed AHA 2020 FH Scientific Statement is actually Gidding 2015 Circulation. Phase 2 rewrite must verify each anticipated-anchor publication year before pulling citation into module.
- **OE end-of-bundle offer:** *"Would you like to explore the specific operational workflow for initiating combination lipid-lowering therapy at the first visit in patients with severe hypercholesterolemia plus ASCVD, including prior authorization strategies for PCSK9 inhibitors?"* — DEFERRED. Phase 1 (OE-pass) is now complete with Bundle 6; transition to Phase 2 (JSON rewrite) takes priority. PA-strategy detail can be a Phase 2 in-rewrite enrichment if Noah wants.

**Summary of new tracker rows seeded by Bundle 6:** 80 (Section 4.2.4.3 confirmed; module's Section 4.2.3.1 wrong; resolves Row 77 flag), 81 (drop "adults aged 20+" qualifier), 82 (drop SDM-as-gating-requirement at LDL ≥190), 83 (secondary-causes medication list — drop retinoids + replace immunosuppressants with cyclosporine + drop "oral" estrogen + add NLA menopause), 84 (drop confirmatory-repeat-lipid-panel-before-statin framing), 85 (drop "DLCN as primary framework per 2026" — guideline emphasizes genetic testing), 86 (drop "2024 ESC/EAS FH Consensus" — replace with Santos 2025 + ESC/EAS 2019), 87 (genetic testing COR stratification — COR 1 clinical FH / COR 2a LDL ≥190 / COR 2b LDL 160–189), 88 (MEDPED uses only age-specific total cholesterol — module shouldn't lump frameworks), 89 (DD4 RESOLVED — Tier 2 OR logic + CAC-not-coronary-atherosclerosis correction), 90 (cascade screening COR 2a NOT COR 1 — downgrade), 91 (drop "Lp(a) cascade in FH families is COR 1 per 2026" — use universal Lp(a) framing; softens Row 52), 92 (17–21 pediatric window attributes to 2011 NHLBI Expert Panel NOT 2026), 93 (FH+ASCVD combination initiation — 2026 permits upfront per "and/or"; stepwise = 2022 ACC ECDP option; cascade Row 73), 94 (inclisiran second-line in HeFH+ASCVD per 2026 explicit "second-line PCSK9 mAb"; cascade Rows 16, 34, 75, 76), 95 (bempedoic acid two FDA indications — LDL reduction broad / CV risk reduction statin-intolerant only; cascade Rows 66, 75), 96 (statin-T2D in FH cohort — limited FH-specific data; extend CTT framing; ASCVD benefit outweighs; cascade Row 61), 97 (FOURIER-OLE 8-year unverifiable — drop; cite Sabatine 2018 JAMA Cardiology meta instead), 98 (AHA 2020 FH Scientific Statement → actually Gidding 2015 Circulation — year correction).

**Citations confirmed or added:** `acc-aha-dys-2026` (heavy), `acc-aha-dys-2026-jacc` (multiple), `acc-2022-decisionpathway` (reinforced — stepwise FH+ASCVD escalation framing), `grundy-2018-cholesterol` (reinforced — 2018 baseline for "what changed since"), `va-dod-lipid-2026` (reinforced — DLCN + AHA classification cross-reference), `fda-orange-book` (reinforced — PCSK9 mAb / inclisiran / bempedoic acid HeFH/HoFH FDA-scope), `fda-nexletol-2026` (reinforced — bempedoic acid two-indication scope), `newman-atvb-2019` (reinforced — very-low-LDL safety + cognitive + hemorrhagic stroke), `giugliano-lancet-2017` (reinforced — FOURIER prespecified secondary at LDL <0.5 mmol/L), `rosenson-jacc-2018` (reinforced — EBBINGHAUS), `ellis-jacc-2019` (reinforced — Lp(a) FH cascade context), `trinder-jacc-2020` (reinforced — Lp(a)-FH co-occurrence not causation), `ctt-collaboration-2024` (reinforced — statin-T2D intensity-dependence baseline), **NEW citations**: `nla-fh-2026` (Ahmad et al. NLA FH Consensus 2026 — lifelong + counseling + secondary-causes + menopause-contributor anchor), `gidding-circ-2015` (Gidding et al. AHA FH Scientific Statement 2015 — replaces anticipated AHA-2020 anchor; year correction), `qureshi-cochrane-2021` (FH screening strategies Cochrane review — DLCN/Simon Broome/MEDPED comparator), `santos-ldne-2025` (Santos et al. Lancet Diabetes Endocrinol 2025 FH advances review — replaces unverifiable "2024 ESC/EAS FH Consensus"), `singh-jacc-2019` (Singh et al. FH Among Young Adults With MI — clinical-suspicion threshold anchor), `sturm-jacc-2018` (Sturm et al. Clinical Genetic Testing for FH JACC Expert Panel — DLCN ≥6 + ~20–40% no pathogenic variant + LDLR/APOB/PCSK9/LDLRAP1 gene-list anchor), `schunkert-nejm-2026` (Schunkert et al. Inherited Basis of CAD NEJM — cumulative-LDL-exposure conceptual anchor), `raal-atherosclerosis-2018` (Raal et al. FH Treatments Guidelines — lomitapide/evinacumab specialty-management anchor), `sabatine-jamacardio-2018` (Sabatine et al. very-low-LDL safety meta-analysis IMPROVE-IT/FOURIER/REVEAL — replaces unverifiable FOURIER-OLE 8-year extension). 9 net-new refs from Bundle 6 + 1 anticipated anchor confirmed (`gidding-circ-2015` was anticipated as `gidding-circ-2020` — year correction).

**Cascade: AHA 2020 FH Scientific Statement → Gidding 2015 Circulation.** Anticipated anchor must be updated. Use `gidding-circ-2015` as canonical ref_id.

**Cascade: "2024 ESC/EAS FH Consensus" deprecated.** Citation cannot be verified. Phase 2 rewrite uses `santos-ldne-2025` for FH-focused comprehensive review + ESC/EAS 2019 dyslipidemia guideline (not currently in staging — pull if needed).

**Cascade: FOURIER-OLE 8-year extension deprecated.** Citation cannot be verified (planned ~5 years per NCT03080935, NCT02867813). Phase 2 rewrite uses `sabatine-jamacardio-2018` as canonical very-low-LDL safety synthesis.

**Phase 1 (OE-pass) of lipid module verification COMPLETE.** All 6 bundles processed across 99 tracker rows + 65+ confirmed citations. Transition to Phase 2 (JSON rewrite of `src/data/seed/clinical-modules.json` — `lipid-management` entry from 1.0.0 → 1.1.0) is now unblocked.

---

## Claim-level tracker

Populated as bundles return. Mirrors the benzos.md tracker format.

| Row | Affects (FAQ id / section) | Claim | Verdict | Source(s) | Action |
|-----|---------------------------|-------|---------|-----------|--------|
| 1  | faqs.risk-tier.q2 + faqs.statin-indication.q1 (cascade) | PREVENT 4 risk tiers thresholds Low <5% / Borderline 5–7.5% / Intermediate 7.5–20% / High >20% | **Needs revision** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Rewrite per OE — these are the **old PCE thresholds**, not PREVENT. Replace with PREVENT thresholds Low <3% / Borderline 3% to <5% / Intermediate 5% to <10% / High ≥10%. **Cascade trigger** for Rows 12, 17 (MP Flag 1) |
| 2  | escalation.very-high-risk + faqs.very-high-risk.q1 + faqs.ldl-target.q2 | VHR = established ASCVD + 2nd major event OR 1 prior + DM/CKD/poorly-controlled HTN/smoking/LDL ≥100 max statin | **Needs revision** | acc-2022-decisionpathway, acc-aha-dys-2026 | Rewrite per OE — add age ≥65, HeFH, prior CABG/PCI outside index, history of HF; change to "+ ezetimibe" not just statin; HTN (not "poorly controlled" HTN) (MP Flag 2) |
| 3  | faqs.ldl-target.q1 | LDL targets: <55 VHR / <70 High / <70–100 Intermediate | **Verified with nuance / Needs revision** | acc-aha-dys-2026 | Rewrite per OE — add non-HDL-C as co-primary target across every tier; resolve "<70–100" range to single value (<100 borderline/intermediate primary prevention); add primary-prevention LDL goals (MP Flag 3). Likely promotes table to HTML `<table>` (asset T2) |
| 4  | faqs.not-at-goal.q1 | Stepwise escalation: max statin → ezetimibe → PCSK9 (rigid sequence) | **Disproved as a strict sequence** | acc-aha-dys-2026, clear-outcomes-2023 | Rewrite per OE — 2026 guideline explicitly removes ezetimibe-must-precede-PCSK9 requirement; choice based on degree of LDL lowering needed + patient preference. Add bempedoic acid + inclisiran (Rows 15, 16) (MP Flag 4) |
| 5  | New FAQ topic `co-primary-targets` (does not exist) + faqs.advanced-markers.q1 | Non-HDL-C and ApoB as treatment targets — currently NOT mentioned in module | **Add new content** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Add new content — new FAQ topic; non-HDL-C as co-primary in every tier; ApoB COR 2a after primary goals met particularly ASCVD/CKM/T2D/elevated TG; ApoB <55 endpoint for severe FH+ASCVD (MP Flag 5) |
| 6  | faqs.risk-tier.q3 | Risk enhancers: family hx, hs-CRP ≥2, ABI <0.9, elevated Lp(a)/ApoB | **Needs revision** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Rewrite per OE — drop ABI <0.9 standalone (PAD with ABI <0.85 captured under VHR major events); add higher-risk ancestry, polygenic risk, chronic inflammatory diseases, CKM syndrome, persistent LDL/non-HDL/ApoB elevations, expanded reproductive risk markers; restrict formal "supports statin initiation" recommendation to borderline tier (COR 2a); remove LDL ≥70 prerequisite (MP Flag 6) |
| 7  | faqs.statin-indication.q3 + context_strip | SUPD HEDIS ~90% benchmark every diabetic visit | **Needs revision** | acc-aha-dys-2026, ada-2026-cv | Soften — clarify ~90% is **organizational target**, NOT HEDIS national benchmark (HEDIS 90th %ile ~80–85% commercial); HEDIS measures pharmacy claims (dispensing), not chart documentation. Don't conflate documentation requirement with HEDIS spec (MP Flag 7) |
| 8  | faqs.advanced-markers.q1 | Lp(a) for premature ASCVD/strong fhx/LDL ≥190; ApoB for High and VHR | **Needs revision** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Rewrite per OE — Lp(a) is **COR 1 once in all adults** (not selected populations); ApoB COR 2a after LDL-C and non-HDL-C goals met, particularly ASCVD/CKM/T2D/elevated TG (MP Flag 8) |
| 9  | landing_intro | Module references "2018 AHA/ACC Cholesterol Guidelines" as primary source | **Needs revision** | acc-aha-dys-2026, acc-2022-decisionpathway | Rewrite per OE — update to **2026 ACC/AHA Dyslipidemia Guideline** as primary; retain 2022 ACC ECDP for nonstatin-therapy escalation specifics (MP additional) |
| 10 | landing_intro + faqs.risk-tier.q1 | PREVENT calibrated for ages 40–75 (legacy PCE range) | **Needs revision** | acc-aha-dys-2026 | Update — PREVENT-ASCVD is calibrated for **ages 30–79** (expanded from PCE's 40–75) (MP additional) |
| 11 | faqs.statin-hesitant.q1 | CAC ages 40–75; CAC = 0 reassess in 5–7 years | **Needs revision** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Rewrite per OE — CAC **men ≥40, women ≥45**; CAC = 0 reassess **3–7 years**; CAC now **COR 1** (upgraded from 2a) for risk reclassification in intermediate-risk + select borderline-risk adults (MP additional) |
| 12 | faqs.statin-indication.q1 | High-intensity statin without SDM at ">20% 10-year risk" | **Needs revision** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Cascade with Row 1 — under PREVENT the trigger is **≥10%** (COR 1) to achieve ≥50% LDL-C reduction (MP additional) |
| 13 | faqs.not-at-goal.q1 | Ezetimibe LDL reduction "15–20%" | **Verified with nuance** | acc-aha-dys-2026 | Soften — update magnitude to **~18–24%** per 2026 guideline supportive text (MP additional) |
| 14 | faqs.not-at-goal.q1 + faqs.advanced-markers.q2 | PCSK9 PA "documented statin intolerance or failure" | **Verified with nuance** | acc-2022-decisionpathway, acc-aha-dys-2026 | Soften — replace with **"documented maximally tolerated statin therapy + LDL above threshold"** (PA does not require intolerance specifically). Note clinical sequence no longer mandates ezetimibe-first per 2026 (MP additional) |
| 15 | faqs.not-at-goal.q1 (or new escalation-FAQ item) | Bempedoic acid (Nexletol) — **NOT MENTIONED in module** | **Add new content** | clear-outcomes-2023, acc-aha-dys-2026, fda-orange-book | Add new content — FDA-approved CV-risk reduction in statin-intolerant pts with established CVD or high CV risk; CLEAR Outcomes 2023 MACE reduction; 2026 COR 2a; ~17–20% LDL reduction. Include payer-coverage note (PA on commercial; Medicare Part D varies) (MP Flag 4 sub) |
| 16 | faqs.not-at-goal.q1 (or new escalation-FAQ item) | Inclisiran (Leqvio) — **NOT MENTIONED in module** | **Add new content** | acc-aha-dys-2026, fda-orange-book | Add new content — FDA-approved LDL-C lowering in ASCVD/HeFH; 2026 COR 2a as alternative when PCSK9 mAbs untolerated/inaccessible or twice-yearly dosing preferred; **Medicare Part B buy-and-bill** (vs Part D for PCSK9 mAbs — operationally simpler); ORION-4/VICTORION-2P pending (MP Flag 4 sub) |
| 17 | faqs.statin-indication.q1 | Two automatic indications: >20% risk OR LDL ≥190 → high-intensity statin | **Needs revision (partial)** | acc-aha-dys-2026 | Cascade — see Row 12 (≥10% PREVENT). LDL ≥190 trigger is **unchanged** as automatic high-intensity statin (Bundle 6 will fully verify) (MP Flag 1 sub) |
| 18 | faqs.advanced-markers.q1 (and module-wide) | Lp(a) thresholds — module gives no thresholds | **Add new content** | acc-aha-dys-2026 | Add new content — **≥125 nmol/L (or ≥50 mg/dL)** elevated; **≥250 nmol/L (or ≥100 mg/dL)** confers ≥2-fold risk; single measurement sufficient (genetically determined) (MP Flag 8 sub) |
| 19 | faqs.advanced-markers.q2 | "Coverage pending" placeholder for ApoB / Lp(a) | **Resolved** | acc-aha-dys-2026 | Replace placeholder — **Lp(a) and ApoB are standard lab tests covered by most commercial + Medicare without PA** (some plans require diagnosis code for Lp(a)). Both can be embedded in order sets / SmartSets (MP Flag 5 + 8 sub) |
| 20 | new co-primary-targets FAQ | ApoB <55 mg/dL goal for severe hypercholesterolemia + ASCVD/FH (after LDL-C and non-HDL-C goals met) | **Add new content** | acc-aha-dys-2026 | Add new content — secondary/confirmatory ApoB target for severe hypercholesterolemia with ASCVD or FH (MP Flag 5 sub) |
| 21 | faqs.statin-indication.q3 | "Every diabetic patient must have statin therapy addressed and documented at each visit" — implied as HEDIS spec | **Verified with nuance** | acc-aha-dys-2026, ada-2026-cv | Soften — sound organizational standard; not a HEDIS specification requirement (HEDIS measures pharmacy-claim dispensing). Pair with Row 7 reframing (MP Flag 7 sub) |
| 22 | faqs.statin-hesitant.q1 + new co-primary-targets / primary-prevention FAQ (was DD1, now closed) | CAC ≥1000 triggers LDL-C <55 mg/dL even in primary prevention | **Resolved by Bundle 2 Claim 12 / Row 36** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | DD1 closes without separate query — Bundle 2 returned **CAC ≥1000 → COR 1 LDL <55 + CAC 300–999 → COR 2a LDL <55** in primary prevention. See Row 36 for the net-new CAC 300–999 threshold (MP open question + B2 Claim 12) |
| 23 | landing_intro + faqs.risk-tier.q1 | PREVENT-ASCVD predictors — module text says "kidney function (eGFR) and metabolic factors" (vague enough to salvage) | **Verified with nuance** | khan-circ-2024, acc-aha-dys-2026, krishnan-jacc-2025 | Clarify in rewrite — PREVENT-ASCVD base predictors are: age, sex, total cholesterol, HDL-C, SBP, eGFR, diabetes status, smoking, statin use, antihypertensive use. HbA1c + UACR are **optional add-on variables** for clinically indicated cases (CKD or DM). **BMI is NOT a PREVENT-ASCVD predictor** — only PREVENT-HF. Don't introduce BMI into ASCVD prose during Phase 2 rewrite (B1 Claim 2) |
| 24 | landing_intro + faqs.risk-tier.q1 | "PREVENT estimates 10-year and 30-year risk for combined ASCVD and heart failure outcomes" — wording could mislead a PCP into using total-CVD composite for statin decisions | **Needs revision** | acc-aha-dys-2026, acc-aha-bp-2025, khan-circ-2024, abbasi-jama-2026 | Rewrite per OE — restrict module's PREVENT prose to **PREVENT-ASCVD** for statin decisions; note the total-CVD variant exists but is for BP-treatment thresholds (2025 BP guideline). The 30-yr horizon also exists in PREVENT-ASCVD (Row 25) — note it as the same equation, longer horizon, not the composite (B1 Claim 4) |
| 25 | new FAQ item under risk-tier (or as addendum to risk-tier Q1) | 30-year PREVENT-ASCVD ≥10% in adults 30–59 with low 10-yr risk (<3%) → moderate-intensity statin (Class 2a) | **Add new content** | acc-aha-dys-2026, acc-aha-dys-2026-jacc, krishnan-jacc-2025 | Add new content — net-new from 2026 guideline. Module currently doesn't describe 30-yr risk at all. Operationally: a 32yo with low 10-yr PREVENT (<3%) but ≥10% 30-yr risk now warrants moderate-intensity statin as Class 2a. Cite Krishnan 2025 for the percentile-distribution data (B1 Claim 9) |
| 26 | faqs.ldl-target.q1 + new co-primary-targets FAQ | LDL-C goal <100 mg/dL for borderline + intermediate-risk patients initiated on statins (primary prevention) | **Add new content** | acc-aha-dys-2026, abbasi-jama-2026 | Add new content — resolves Row 3's vague "<70–100 Intermediate" range to a single value (<100). Net-new explicit goal in 2026 guideline (departure from 2018 percentage-reduction-only framing for primary prevention). Should also drive Row 3's per-tier table with this single value (B1 Claim 7) |
| 27 | landing_intro + faqs.risk-tier.q1 | PREVENT race-removal validation — modern evidence base (MESA, diverse health-care cohorts, Asian/NHPI subgroups) | **Add new content** | cho-jacc-2025, murphy-jacc-adv-2025, au-jamano-2026, anderson-jamaim-2024, diao-jama-2024 | Add new content — landing-intro / risk-tier-Q1 should briefly acknowledge the equity rationale for the 2026 ≥3% threshold recalibration (designed to mitigate disproportionate impact on Black adults, who would lose treatment eligibility at higher rates if old PCE thresholds were applied to PREVENT). PREVENT validated with <3% Asian/NHPI representation; Au 2026 specifically pressure-tests Asian/NHPI subgroups. MESA + Cho 2025 + Murphy 2025 confirm better cross-race calibration than PCE (B1 Claim 11) |
| 28 | new addendum to faqs.risk-tier.q1 (or new FAQ item) | Reclassification on PREVENT (vs PCE) is not unilateral grounds for statin de-escalation | **Add new content** | va-dod-lipid-2026, acc-aha-dys-2026, anderson-jamaim-2024 | Add new content — operationally important for the PCP encountering a long-term statin patient who newly reclassifies to a lower tier under PREVENT. Anderson 2024: ~4M adults currently on statins would no longer meet criteria under PREVENT with old thresholds. VA/DoD 2026 explicit: discontinuation decision falls to provider with patient consideration. 2026 ≥3% threshold designed to narrow the gap. Engage SDM, consider risk enhancers + CAC, document rationale (B1 Claim 12) |
| 29 | escalation.very-high-risk + faqs.very-high-risk.q1 (cascade with Row 2) | VHR threshold for "1 major ASCVD event + high-risk conditions" requires **≥2 high-risk conditions**, not ≥1 | **Verified with correction** | acc-2022-decisionpathway, aha-acc-ccd-2023, acc-aha-dys-2026 | Cascade with Row 2 — correct the count threshold. 2022 ECDP says "multiple"; 2023 CCD specifies ≥2; 2026 reaffirms ≥2 high-risk features. Module's 1+1 framing is too permissive — a patient with 1 prior MI and only diabetes (no other high-risk feature) is NOT VHR by current guidelines (B2 Claim 1) |
| 30 | escalation.very-high-risk + faqs.very-high-risk.q1 (cascade with Row 2) | 2026 ACC/AHA Dyslipidemia Guideline (Section 2.1) **omits CKD** from the VHR high-risk features list (notable change from 2022 ECDP and 2023 CCD); CKD addressed separately in Section 4.2.8 with its own treatment recommendations | **Needs revision** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Reconcile in rewrite — module currently has CKD in VHR list (per 2022 ECDP / Row 2). Under 2026 framework, CKD + ASCVD patients still receive aggressive LDL goal (<55) via the CKD-specific pathway, but CKD is no longer a VHR-escalator alongside the other 6 conditions. Document the 2022/2026 discrepancy in the FAQ and route CKD + ASCVD to <55 regardless (B2 Claim 2) |
| 31 | new co-primary-targets FAQ + faqs.advanced-markers.q1 (corrects Row 5 / Row 20 scope) | ApoB <65 mg/dL is **NOT** a 2026 ACC/AHA target. The only ACC/AHA-specified numeric ApoB target is **<55 mg/dL** for severe hypercholesterolemia + ASCVD (Section 4.2.4.3). The <65 mg/dL figure is from **ESC/EAS 2019** ("very high risk") — frequently confused source | **Disproved** | acc-aha-dys-2026, acc-aha-dys-2026-jacc, esc-eas-2019 (anticipated) | Rewrite per OE — do NOT state <65 mg/dL as an ACC/AHA target. ApoB in 2026 ACC/AHA is positioned as residual-risk assessment (COR 2a) once LDL-C / non-HDL-C goals achieved, **without a universal numeric target**. Mention <55 only in the severe-hypercholesterolemia + ASCVD context (cascade with Row 20). Bundle 3 will pressure-test ESC/EAS comparator for full picture (B2 Claim 6) |
| 32 | new evidence-anchor for <55 target rationale + faqs.statin-hesitant (cognitive reassurance) | **Ez-PAVE trial (Lee NEJM 2026)** — first head-to-head RCT directly demonstrating <55 vs <70 reduces 3-yr major CV events HR 0.67 (95% CI 0.52–0.86). Achieved-LDL data: ODYSSEY OUTCOMES median ~40 mg/dL (NOT 53 as I claimed); FOURIER median ~30 mg/dL; 53 mg/dL was IMPROVE-IT ezetimibe arm. Cognitive-safety reassurance: **Newman 2019 AHA ATVB Scientific Statement on Statin Safety** (no association between aggressive LDL lowering and dementia / cognitive impairment / hemorrhagic stroke / cancer; statin myopathy 1–10/10,000 person-years; rhabdomyolysis 1–3/100,000); FOURIER prespecified secondary analysis (no excess events at LDL <0.5 mmol/L); EBBINGHAUS (no neurocognitive impairment); FOURIER-OLE 8-yr (no excess muscle / new-onset DM / neurocognitive) | **Verified with correction (citation fixed Bundle 4)** | lee-nejm-2026, acc-aha-dys-2026, ~~goldstein-atvb-2023~~ → **newman-atvb-2019**, giugliano-lancet-2017, rosenson-jacc-2018, fourier-2017 (anticipated), odyssey-outcomes-2018 (anticipated) | Cite achieved-LDL data correctly when describing trial evidence base for <55 target — ODYSSEY ~40 (not 53). Cite `lee-nejm-2026` whenever module text justifies the <55 threshold (first head-to-head RCT for the target itself). Carry the cognitive-safety reassurance citations into faqs.statin-hesitant (statin-hesitant counseling, MCI-family conversations) — pair with **Newman 2019 AHA ATVB** (`newman-atvb-2019`) as the AHA-authority anchor. **Bundle 4 Claim 9 confirmed via OE search that "Goldstein 2023 ATVB" does not exist; replaced by Newman 2019.** (B2 Claim 7, 8 + B4 Claim 9 cascade fix) |
| 33 | faqs.not-at-goal.q1 + faqs.advanced-markers.q2 (cascade with Row 14) | Trigger for nonstatin add-on in **VHR** is failure to achieve **<55 mg/dL** on max-tolerated statin, NOT "LDL ≥70 mg/dL". The ≥70 threshold applies to non-VHR ASCVD secondary prevention only | **Needs revision** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Rewrite per OE — Row 14 (PCSK9 PA wording) needs to differentiate VHR vs non-VHR ASCVD trigger thresholds. VHR uses <55 goal as the trigger; non-VHR ASCVD uses <70. Operationally critical: a VHR patient at LDL 60 on max statin is already a candidate for PCSK9/ezetimibe/bempedoic acid; the non-VHR ≥70 framing under-treats VHR patients (B2 Claim 9, 15) |
| 34 | faqs.not-at-goal.q1 (cascade with Row 16) | Inclisiran positioning is **more restrictive** than initially framed — 2026 specifies "in those unable to tolerate or obtain evolocumab or alirocumab OR have a strong preference for less frequent dosing." Positioned as **second-line to PCSK9 mAbs**, pending ORION-4 / VICTORION-2P CVOT results | **Verified with nuance** | acc-aha-dys-2026, fda-orange-book | Cascade with Row 16 — frame inclisiran as second-line to PCSK9 mAbs, not an equal alternative. Carry the "buy-and-bill via Medicare Part B" payer-coverage operational note from Row 16 (Bundle 2 reaffirms; this is the practical access-simplification rationale that still favors inclisiran in some cases) (B2 Claim 10) |
| 35 | faqs.not-at-goal.q1 (cascade with Row 15) | Bempedoic acid 2026 ACC/AHA COR 2a positioning is **broader than FDA label CVOT indication**. ACC/AHA: general add-on "with or without ezetimibe and/or PCSK9 mAb"; FDA label restricts CVOT outcome indication to patients "unable to take recommended statin therapy" (statin-intolerant) | **Verified with nuance** | acc-aha-dys-2026, clear-outcomes-2023, fda-orange-book | Cascade with Row 15 — distinguish ACC/AHA recommendation scope (broad add-on) from FDA label CVOT indication scope (statin-intolerant). PA on commercial may still require statin-intolerance documentation per FDA label, even though the 2026 guideline doesn't restrict use to that population. Module should note the two scopes (B2 Claim 10) |
| 36 | faqs.statin-hesitant.q1 + new co-primary-targets / primary-prevention FAQ (closes Row 22 / DD1) | **CAC ≥1000 → LDL <55 (COR 1, LOE B-NR) AND CAC 300–999 → reasonable (COR 2a) to intensify to LDL <55** in primary prevention | **Add new content** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Add new content — Row 22 / DD1 closes here. **Net-new CAC 300–999 threshold below the meta-pass-flagged CAC ≥1000.** Module's primary-prevention LDL goal logic should branch: borderline/intermediate (no high CAC) → <100; **CAC 300–999 → reasonable (COR 2a) to target <55**; CAC ≥1000 → <55 (COR 1). Combine with Row 11 (CAC age + COR 1 upgrade for risk reclassification) for the full CAC framework (B2 Claim 12) |
| 37 | faqs.ldl-190.q1 / new severe-hypercholesterolemia FAQ + faqs.ldl-target.q1 | Severe primary hypercholesterolemia (LDL ≥190 without ASCVD) has **3-tier LDL goal stratification** in 2026 (not single goal): (a) without HeFH/subclinical/risk factors → <100 mg/dL (COR 1); (b) with HeFH / additional risk factors / documented coronary calcification → <70 mg/dL (COR 1); (c) with clinical ASCVD → <55 mg/dL (COR 1) | **Verified with nuance** | acc-aha-dys-2026 | Rewrite per OE — module currently treats LDL ≥190 as a single high-intensity-statin trigger with no tier-specific LDL goal. Add the 3-tier goal table. Bundle 6 will fully verify FH-specific framing — confirm whether the middle tier ("with HeFH / additional risk factors / documented coronary calcification") encompasses any patient with documented HeFH or only those with HeFH + at least one of the other two (B2 Claim 13) |
| 38 | faqs.med-plan.q1 (module currently silent on long-term cadence outside med-plan) | Lipid panel monitoring: **4–12 weeks** after initiation/dose adjustment AND **every 6–12 months thereafter** (COR 1, LOE A); **nonfasting acceptable** in most cases (fasting only when known hypertriglyceridemia) | **Add new content** | acc-aha-dys-2026 | Add new content — module currently mentions "fasting lipid panel at 4–12 weeks after any change" only for med-plan. Add the every-6-12-month recurring monitoring + drop the "fasting" requirement except for known hypertriglyceridemia. Operational impact: Epic order set for routine repeat lipid panels can default to nonfasting (B2 Claim 16) |
| 39 | faqs.very-high-risk.q1 / new addendum on age (corrects Bundle 2 prompt's claim 14) | VHR ≥75 + SDM framing — 2026 guideline does **NOT** provide age-specific VHR secondary prevention recommendations with explicit shared decision-making for ≥75. 2026 **removes the prior age ≤75 restriction** on high-intensity statin initiation for secondary prevention. "No signal to suggest de-escalation indicated for very low achieved LDL." For primary prevention >79, "can be considered in conjunction with lifestyle interventions." | **Verified with nuance** | acc-aha-dys-2026 | Soften — module should NOT attribute SDM-specific ≥75 framing to the 2026 guideline. Reframe: (a) high-intensity statin in secondary prevention is appropriate at any age (no upper-age cap); (b) for primary prevention >79, use clinical judgment + comorbidity/life-expectancy considerations; (c) don't de-escalate based on very low achieved LDL alone. SDM is reasonable practice but not a guideline-attributed recommendation specific to ≥75 VHR (B2 Claim 14) |
| 40 | landing_intro / new whats-new-2023-2024 FAQ (forward-looking footnote) | 2026 writing committee signals future revisions may collapse VHR vs non-VHR ASCVD into a **single <55 mg/dL pathway for all ASCVD patients** based on VESALIUS-CV trial results (continuous-work-in-progress framing) | **Forward-looking / informational** | blumenthal-circ-2026-progress, acc-aha-dys-2026 | Add as a brief landing/whats-new footnote — do NOT pre-emptively change module structure. Module stays VHR-vs-non-VHR for now. Note in landing intro or whats-new FAQ that "future revisions may collapse VHR/non-VHR distinction." Useful pedagogically; structural change deferred until next ACC/AHA dyslipidemia guideline revision (B2 OE end-of-bundle additional flag) |
| 41 | new co-primary-targets FAQ + faqs.ldl-target.q1 (cascade with Rows 3, 5, 26) | Per-tier non-HDL-C goals locked: **VHR <85, non-VHR ASCVD <100 (with possible COR 2a tighter sub-recommendation; see DD3), high-risk PP (PREVENT-ASCVD ≥10%) <100, borderline/intermediate (PREVENT-ASCVD 3% to <10%) initiated on statins <130, severe primary hypercholesterolemia (LDL ≥190 without ASCVD/HeFH/risk factors) <130** | **Verified with non-VHR sub-nuance** | acc-aha-dys-2026, acc-aha-dys-2026-jacc, raja-atherosclerosis-2023 | Add as the canonical per-tier non-HDL-C target table for the new co-primary-targets FAQ (asset T2). Resolves Row 5 / Row 41 + closes Row 3 cascade for non-HDL co-primary. **DD3 follow-up needed** for the truncated COR 2a non-VHR ASCVD tighter goal (likely <55 / <85 in line with VHR per Ez-PAVE; verify before module rewrite Phase 2). Top Take-Home Message #4 supports co-primary framing — guideline still emphasizes percentage LDL-C reduction as priority, with non-HDL-C as parallel goal not replacement (B3 Claim 1) |
| 42 | faqs.advanced-markers.q1 / new co-primary-targets FAQ | Friedewald LDL-C is **NOT categorically inaccurate at TG ≥150** — accuracy degrades **progressively** as TG rises (especially at low LDL-C); Martin/Hopkins or Sampson/NIH equations are **preferred (COR 1, LOE B-NR) for ALL patients** (outperform Friedewald even at TG ≥150) | **Verified with correction** | acc-aha-dys-2026, sajja-jacc-2022, sajja-jamano-2021, sampson-jamacardio-2020 | Replace "Friedewald inaccurate at ≥150" framing with progressive-degradation language. Module rewrite must note: Martin/Hopkins or Sampson/NIH preferred over Friedewald for all patients (COR 1). Operationally: Epic LDL-C result reporting depends on lab platform — module text should note the lab dependency and recommend asking the lab which equation is used. ≥400 → LDL-C "no longer reported" confirmed. Non-HDL-C remains valid across full TG range (B3 Claim 3) |
| 43 | new co-primary-targets FAQ + faqs.advanced-markers.q1 (cascade with Row 5) | ApoB has **TWO** 2026 ACC/AHA recommendations: **COR 2a in adults ON LLT** (residual-risk, particularly ASCVD/CKM/T2D/elevated TG) AND **COR 2b in UNTREATED adults** (enhance risk assessment + characterize inherited lipid disorders) | **Verified with addition** | acc-aha-dys-2026 | Cascade with Row 5 — module rewrite should not narrow ApoB to "treated only." Untreated-adult COR 2b applies particularly when family history of premature ASCVD, severe hypercholesterolemia, or suspected FH. Flesh both COR levels into the new co-primary-targets FAQ (B3 Claim 4) |
| 44 | faqs.advanced-markers.q1 (cascade with Row 18) | **Lp(a) "very high" threshold of ≥175 nmol/L (≥80 mg/dL) is NOT in 2026 ACC/AHA Table 4** — it derives from EAS consensus statement. Actual 2026 Table 4 schema: **75–124 nmol/L (1.2-fold), 125 (1.4-fold), 250 (2-fold), 350 (3-fold), 430 (4-fold)** | **Disproved** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Drop the 175 nmol/L threshold entirely. Module rewrite must use either the actual Table 4 schema OR the simpler "≥125 elevated / ≥250 ≥2-fold" framing (consistent with most US lab reporting). Cascades with Row 18 — module rewrite scope expands to include Table 4 numerics. Lab reporting note: nmol/L preferred (apo(a)-isoform-insensitive); conversion factor ~2.5 is approximate (B3 Claim 9) |
| 45 | faqs.advanced-markers.q1 / new co-primary-targets FAQ | Lp(a) secondary causes are **broader than nephrotic syndrome / estrogen**: kidney/liver/thyroid disease, pregnancy, menopause, some medications, inflammation (which may **increase OR decrease** Lp(a)) | **Needs revision** | acc-aha-dys-2026 | Module rewrite must list the broader secondary-cause set when describing the "single measurement is generally sufficient" guidance. Operational impact: changes the differential for "what could explain a discrepant repeat Lp(a)" — inflammation-driven shifts in particular are bidirectional, complicating interpretation (B3 Claim 11) |
| 46 | faqs.advanced-markers.q1 / new co-primary-targets FAQ | "Very high Lp(a) → tighter LDL target" framing is **NOT a guideline-specified recommendation** — 2026 only states "elevated Lp(a) favors initiating or intensifying LLT" | **Verified with nuance** | acc-aha-dys-2026 | Frame the "very high Lp(a) → tighter LDL target" move as **clinical judgment**, not guideline-attributed. Module text should distinguish guideline-attributed framing from clinician-judgment framing. Important pedagogical signal — Cardiometabolic / Crystal Run convention may favor tighter targets for high Lp(a); module should not falsely attribute this to ACC/AHA (B3 Claim 12) |
| 47 | new co-primary-targets FAQ + faqs.not-at-goal.q1 | Lp(a)-effect magnitudes corrected: **statins +1.1 mg/dL absolute (NOT 10–15%)**; **PCSK9 mAbs ~26% pooled (15–30% range)**; **inclisiran ~22% (modestly LOWER than PCSK9 mAbs, NOT similar)**; **niacin 37% but deprecated** per AIM-HIGH + HPS2-THRIVE | **Verified with correction** | acc-aha-dys-2026, xie-atherosclerosis-2025, qiao-drugs-2026, mulligan-jcl-2026, albers-jacc-2013, tsimikas-jacc-2017 | Drop "10–15% statins raise Lp(a)." Specify pooled magnitudes (PCSK9 ~26% / inclisiran ~22% / niacin 37%-deprecated). **Operationally important:** the differential between PCSK9 mAb (~26%) vs inclisiran (~22%) reduction informs which agent to pick for elevated-Lp(a) patient already at LDL goal — slight Lp(a) advantage of PCSK9 mAbs over inclisiran, opposite of cost/access advantage of inclisiran (B3 Claim 13) |
| 48 | new co-primary-targets FAQ / new whats-new-2023-2024 FAQ | Investigational Lp(a)-specific therapies: original prompt covered pelacarsen + olpasiran + lepodisiran "80–90%"; **add muvalaplin (oral, ~65%) and zerlasiran (siRNA, up to 98%)**; correct reduction range to **up to 80–98%** (pelacarsen ~80%, olpasiran/zerlasiran/lepodisiran up to 98%, muvalaplin ~65%) | **Add new content** | acc-aha-dys-2026, nordestgaard-lancet-2024, malick-jacc-2023 | Add new content — module rewrite should mention all five investigational agents. Trial associations: pelacarsen → Lp(a)HORIZON (NCT04023552); olpasiran → OCEAN(a); lepodisiran → ALPACA. **Pedagogical importance: muvalaplin's ORAL administration** is a future-state differentiator vs all other modalities (siRNA/ASO are subcutaneous). Frame as forward-looking footnote in whats-new-2023-2024 — none FDA-approved yet (B3 Claim 14) |
| 49 | new co-primary-targets FAQ / faqs.advanced-markers.q1 | TG-context disambiguation: 2026 guideline ApoB section uses **TG ≥150 mg/dL** as the discordance threshold; risk enhancer table uses **TG ≥175 nonfasting / ≥150 fasting** | **Verified with correction** | acc-aha-dys-2026 | Module rewrite should disambiguate the two contexts: discordance (when ApoB is ordered to disambiguate atherogenic burden) = TG ≥150; risk enhancer (qualifies as enhancing factor for borderline-tier statin initiation) = ≥175 nonfasting / ≥150 fasting. **Operationally: the ApoB-section threshold is the operational one** for "should I order ApoB to disambiguate this patient's burden." Don't conflate (B3 Claim 16, 20) |
| 50 | new co-primary-targets FAQ + faqs.not-at-goal.q1 | **REDUCE-IT (icosapent ethyl) covers TG 135–499 with ASCVD or diabetes — NOT only TG ≥500** | **Verified with correction** | acc-aha-dys-2026 | Module rewrite must NOT gate icosapent ethyl behind ≥500. REDUCE-IT enrolled patients with TG 135–499 + statin therapy + ASCVD or DM. **Operational impact:** a non-VHR ASCVD patient on statin with TG 200 + diabetes is an IPE candidate per REDUCE-IT, not a fibrate candidate. v1.0.0 module doesn't mention IPE at all — Phase 2 rewrite should add IPE as a co-primary-targets FAQ addendum or as a new escalation-options FAQ item (B3 Claim 17) |
| 51 | faqs.not-at-goal.q1 + faqs.advanced-markers.q1 (cascade with Row 34) | For ASCVD patients with elevated Lp(a) NOT at LDL-C/ApoB goal, **2026 guideline says "PCSK9i with proven cardiovascular benefit should be preferentially considered"** — i.e., evolocumab (FOURIER) or alirocumab (ODYSSEY OUTCOMES), NOT inclisiran (CVOT pending) | **Verified with correction** | acc-aha-dys-2026 | Cascade with Row 34 — frames the inclisiran-second-line guidance more sharply for the elevated-Lp(a) sub-case. Module rewrite must specify: when ASCVD + elevated Lp(a) + not at LDL goal, **prefer evolocumab or alirocumab over inclisiran**; off-label use solely for Lp(a) lowering in patient already at LDL goal is an off-label rationale (legal but pre-PA-difficult). This refines Row 34's "second-line for inclisiran" into a specific clinical scenario where it's NOT the right move (B3 Claim 19) |
| 52 | new advanced-markers / FH FAQ (Bundle 6 territory) | **Lp(a) cascade testing in FH families is COR 1** in 2026 guideline; **ApoB is NOT a diagnostic criterion for FH** (Dutch Lipid Clinic Network / Simon Broome / MEDPED + genetic testing are the diagnostic standard) | **Verified** | acc-aha-dys-2026, ellis-jacc-2019, trinder-jacc-2020 | Reserve for Bundle 6 / FH coverage. Note: 2026 guideline says "elevated Lp(a) is common in patients with FH; however, FH does not cause elevated Lp(a)" — Lp(a) and FH are independent risk factors that can co-occur. ApoB ≥140 mg/dL appears in 2026 as a population descriptor for severe hypercholesterolemia + ASCVD (alongside LDL ≥190), NOT as a diagnostic criterion (B3 Claim 21) |
| 53 | faqs.statin-indication.q1 + landing_intro (cascade with Rows 12, 17) | "Two automatic indications without SDM" framing for PREVENT ≥10% high-intensity + LDL ≥190 high-intensity | **Needs revision** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Rewrite per OE — three corrections: (a) **SDM applies at every risk level including COR 1** (Section 4.2.3.1 — "benefit-risk discussion is indicated to determine a decision regarding initiation of LLT"; checklist provided). COR 1 means "should" be done, NOT "without discussion." (b) **There are THREE COR 1 statin-initiation indications, not two** — diabetes ages 40–75 (moderate-intensity, Section 4.2.5) is the third. (c) For LDL ≥190, also exclude secondary causes (hypothyroidism, nephrotic syndrome, ketogenic diet) and evaluate for FH before initiating (B4 Claim 1) |
| 54 | faqs.statin-indication.q2 + faqs.risk-tier.q3 (cascade with Row 6) | Risk enhancers — module enumeration is missing CKM syndrome + high polygenic risk score; hsCRP-on-2-occasions special case for borderline | **Add new content + verify with nuance** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Add new content per OE — (a) Add **CKM syndrome** + **high polygenic risk score (if measured)** to Table 13 risk-enhancer enumeration. (b) Add the borderline-tier-specific upgrade: **hsCRP ≥2 mg/L on 2 successive occasions supports HIGH-INTENSITY statin (COR 2a, LOE B-R)**, stronger than the general moderate-intensity framing for borderline. Cascades with Row 6 (B4 Claim 2) |
| 55 | faqs.statin-indication.q1 + faqs.risk-tier.q2 (cascade with Rows 1, 12) | Intermediate-risk PREVENT 5% to <10% — module currently uses "moderate-intensity statin reasonable (COR 2a)" | **Needs revision** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Rewrite per OE — intermediate-risk statin initiation is **COR 1, not COR 2a**. Clinically meaningful — "should receive" not "reasonable to consider." LDL goal <100 confirmed. Cascades with Row 12 (≥10% PREVENT high-intensity) and Row 1 (PREVENT thresholds) (B4 Claim 3) |
| 56 | faqs.statin-hesitant.q1 (cascade with Row 11) | CAC = 0 deferral 3–7 yr conditional on no higher-risk; ANY CAC > 0 triggers COR 1 LLT (≥100/≥75th percentile is strongest within COR 1, not the threshold above which COR 1 first applies) | **Verified with nuance** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Soften / clarify per OE — module rewrite must include: (a) CAC = 0 deferral 3–7 yr is appropriate **only** when no higher-risk conditions present (FH, LDL ≥190, diabetes age >40, current smoking, strong family history premature ASCVD); (b) **ANY CAC > 0** is a COR 1 LLT initiation trigger (LOE B-NR), with ≥100 / ≥75th percentile being the **strongest indication within that COR 1**, not a separate threshold. Reinforces Row 11 (B4 Claim 5) |
| 57 | faqs.statin-hesitant.q1 + new co-primary-targets/primary-prevention FAQ (cascade with Row 36) | CAC 300–999 module text conflates two distinct recommendations | **Needs revision** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Rewrite per OE — CAC 300–999 has **two recommendations**: (a) primary **COR 1, LOE B-R, LDL <70 mg/dL**; (b) separate **COR 2a sub-recommendation to intensify to LDL <55 mg/dL**. Module's single "CAC 300–999 → reasonable to intensify to <55" tier needs splitting. Operationally: a CAC 500 patient gets a COR 1 LDL <70 target with COR 2a *option* to push to <55, not a COR 2a <55 target. CAC ≥1000 → LDL <55 (COR 1, LOE B-NR) is correct as written. **Cascades with Row 36** — Row 36 needs this split too (B4 Claim 6) |
| 58 | new addendum to risk-tier (cascade with Row 25) | 30-year ≥10% Class 2a — module currently does not specify LOE | **Verified with addition** | acc-aha-dys-2026, acc-aha-dys-2026-jacc, krishnan-jacc-2025 | Add per OE — **LOE is C-LD (limited data)**, not B-NR or higher; no RCTs in <3% 10-yr / ≥10% 30-yr population. Guideline emphasizes a **"trial of health behavior optimization"** before pharmacotherapy. Module text should communicate the evidence-level caveat + lifestyle-first emphasis. Cascades with Row 25 (B4 Claim 7) |
| 59 | faqs.statin-hesitant.q1 (cascade with Row 11) | CAC OOP cost ~$75–$150; CMS expanded coverage CY 2024 via specific HCPCS codes for primary prevention | **Verified with correction** | acc-aha-dys-2026 | Rewrite per OE — broaden cost range to guideline's **$50–$250 OOP**. **Remove or reframe the "CMS expanded CY 2024" + HCPCS-codes claim** — cannot be confirmed from current evidence; safer framing is "coverage is variable; verify with local Medicare Administrative Contractor." Don't fabricate specific CY 2024 expansion language. Module's "verify locally" guidance is sound (B4 Claim 8) |
| 60 | faqs.statin-hesitant.q1 + (CASCADE FIX) Row 32 | Statin counseling — CTT ~22% per mmol/L; safety statement attributed to "Goldstein et al. 2023 AHA ATVB" | **Needs revision (citation fix critical)** | newman-atvb-2019, ctt-collaboration-2012, collins-lancet-2016, silverman-jama-2016, acc-aha-dys-2026 | Rewrite per OE — (a) CTT magnitude **20–21% proportional reduction per 1 mmol/L** (24% after first year) per CTT 2012; Silverman 2016 ~23% per mmol/L for LDL-receptor-upregulating therapies. "~22%" approximation acceptable; precise number prefers 20–21%. (b) **CRITICAL CITATION FIX:** "Goldstein et al. 2023 AHA ATVB" does not exist — correct citation is **Newman et al. 2019 AHA ATVB Scientific Statement on Statin Safety**. **Cascades to Row 32 — replace `goldstein-atvb-2023` with `newman-atvb-2019` everywhere it appears in tracker, references staging, and Phase 2 module rewrite.** (c) NNT 50–100 over 5 yr reasonable for intermediate-to-high-risk; CTT 2012 anchors the 11/1000 over 5 yr in low-risk populations (B4 Claim 9) |
| 61 | faqs.statin-hesitant.q1 / new statin-T2D FAQ item | Statin-induced T2D ~9–12% RRI, 1 per 255 py — module text is intensity-flat | **Verified with intensity-dependent precision update** | ctt-collaboration-2024, newman-atvb-2019, ada-2026-cv | Rewrite per OE — split intensity: **moderate-intensity 10% RRI (RR 1.10, 95% CI 1.04–1.16)**; **high-intensity 36% RRI (RR 1.36, 95% CI 1.25–1.48)** per 2024 CTT IPD meta. ADA 2026 cites Sattar OR 1.09, 1 case per 255 patients × 4 yr preventing 5.4 vascular events. AHA Newman 2019 absolute risk ~0.2%/year. **62% of new diagnoses occur in those already in top quartile baseline glycemia.** Continue-statin-if-T2D guidance well-supported. Module should not blanket "9–12%" across all intensities — sharp difference at high-intensity (B4 Claim 10) |
| 62 | faqs.statin-hesitant.q1 / new statin-intolerance FAQ item | SAMSON nocebo 90%; cited as "NEJM 2021"; "min 2 statin failures" framing | **Needs revision (citation fix + caveat)** | samson-jacc-2021, warden-jcl-2023, newman-atvb-2019 | Rewrite per OE — (a) **SAMSON published in JACC 2021, NOT NEJM 2021** — Howard JP, Wood FA, Finegold JA, et al. *J Am Coll Cardiol*. 2021;78(12):1210-1222. Mean symptom scores 16.3 statin / 15.4 placebo / 8.0 no tablet (P=0.388 statin vs placebo); 50% successfully restarted post-trial. (b) Add **NLA Warden 2023 generalizability caveat** — SAMSON / StatinWISE results "cannot be generalized to all patients" given small, self-selected populations. (c) **"Min 2 statin failures" is operational standard, NOT 2026-guideline-specified** — module should attribute to organizational practice. (d) True statin myopathy 1–10/10,000 person-years; rhabdomyolysis 1–3/100,000 (consistent with Newman 2019). Practical rechallenge approach (low-dose / non-daily atorvastatin or rosuvastatin) is consistent with NLA + ACC guidance (B4 Claim 11) |
| 63 | faqs.special-pop.q1 (or new pregnancy FAQ item) | 2021 FDA labeling change — pregnancy contraindication removed; "discontinued during pregnancy and lactation" for most patients | **Verified with lactation correction** | acc-aha-dys-2026, acc-2022-decisionpathway, agarwala-jcl-2024, kovacic-circ-2026 | Rewrite per OE — split pregnancy from lactation: (a) **Pregnancy:** July 2021 FDA contraindication removed; case-by-case for VHR ASCVD or FH + additional risk factors (2026 guideline language: "may be considered in pregnant persons at very high risk for ASCVD"); "it seems prudent to avoid statin therapy during pregnancy" for most patients. 2022 ACC ECDP + 2024 NLA Consensus confirm individualized benefit-risk discussion. (b) **Lactation: STILL CONTRAINDICATED per FDA labeling.** 2021 change applied to pregnancy only. Module must not conflate the two (B4 Claim 12) |
| 64 | faqs.ldl-target.q1 + faqs.not-at-goal.q1 + new co-primary-targets FAQ (CLOSES DD3 + Row 41 non-VHR cell + Row 33 cascade) | Non-VHR ASCVD COR 2a tighter LDL goal — exact numeric + section + rationale | **Resolved (section number FLAG — see Row 77)** | acc-aha-dys-2026, lee-nejm-2026 | DD3 closure — **non-VHR ASCVD COR 2a sub-recommendation: LDL <55 mg/dL** (intensification). ~~Section 4.2.4.3~~ (**section number disputed — Bundle 5 says 4.2.4.3 = severe hyperchol LDL ≥190; verify in primary 2026 doc**). Standard goal remains LDL <70 mg/dL (COR 1) for non-VHR ASCVD secondary prevention; <55 is the COR 2a intensification option. **Direct RCT support: Ez-PAVE (Lee NEJM 2026)** — targeting LDL <55 vs <70 in ASCVD reduced 3-yr major CV events HR 0.67 (95% CI 0.52–0.86). Same trial that supports VHR <55 now applied as a 2a intensification option for non-VHR ASCVD. Cascades: Row 41 non-VHR ASCVD non-HDL-C cell now has clarified LDL split (<70 standard / <55 intensification); Row 33 PCSK9 PA wording — non-VHR ASCVD patients with LDL 55–70 are candidates for intensification under COR 2a, not just LDL >70. **Phase 2 rewrite recommendation:** drop the section number; cite "per the 2026 ACC/AHA Dyslipidemia Guideline" — no operational loss (B4 DD3 + B5 cascade flag) |
| 65 | new escalation-options FAQ (cascade with Row 50) | Icosapent ethyl COR 2a in non-VHR ASCVD, TG 135–499 | **Needs revision (major COR + threshold corrections)** | acc-aha-dys-2026, reduce-it-2019, bhatt-jacc-2019 | Rewrite per OE — three corrections: (a) **COR is 2b NOT 2a** ("may be reasonable") for adults ≥50 yr with ASCVD or DM + ≥1 risk factor, TG 150–499, LDL-C goal-managed; (b) **TG threshold per guideline = ≥150 mg/dL** (NOT 135 — 135 was REDUCE-IT enrollment cutoff); (c) **Mineral oil placebo controversy explains the lower COR** — 2026 guideline notes biomarker subanalysis showed IPE arm had no significant improvement in atherogenic lipids/lipoproteins/inflammatory markers, while mineral oil placebo arm experienced *deleterious* changes in these biomarkers, "likely exaggerating the observed beneficial treatment effect." Module rewrite must acknowledge this controversy. STRENGTH (Nicholls JAMA 2020 — mixed EPA/DHA OTC) negative-CVOT remains correct as written. Cascades with Row 50 (B5 Claim 6) |
| 66 | new escalation-options FAQ (cascade with Rows 15, 35) | Bempedoic acid — LDL ~17–20% mono; CLEAR Outcomes hsCRP-elevated cohort; gout ~5% vs ~2% placebo; FDA CVOT indication "unable to take recommended statin therapy" | **Needs revision (multiple corrections)** | acc-aha-dys-2026, clear-outcomes-2023, fda-nexletol-2026 | Rewrite per OE — four corrections: (a) **LDL-C reduction split: 21–24% as MONOTHERAPY in statin-intolerant patients; 17–18% INCREMENTAL when added to maximally tolerated statin** — module's "17–20% mono" wrong. (b) **CLEAR Outcomes was NOT restricted to hsCRP-elevated cohort** — hsCRP not enrollment criterion; module rewrite must drop that framing entirely. (c) **Gout rates: 3.1% vs 2.1%** (CLEAR Outcomes data; module's "~5% vs ~2%" overstates by ~60%). (d) **FDA CVOT indication is broader than module text** — current label includes "(including those not taking a statin)"; not strict statin-intolerant only. (e) Tendon rupture ~0.5% confirmed. (f) 13% RRR MACE (HR 0.87, 95% CI 0.79–0.96) confirmed. Cascades with Rows 15, 35 (B5 Claim 4) |
| 67 | new escalation-options FAQ + clinical-tools quick-reference | Bempedoic acid + simvastatin >20 mg/day or pravastatin 40 mg/day → ~2-fold ↑ statin levels — drug-drug interaction NOT in v1.0.0 module | **Add new content (operational safety)** | aha-acc-ccd-2023, fda-nexletol-2026 | Add new content — **operational safety addition.** Phase 2 module rewrite must add to escalation FAQ + clinical-tools quick-reference: bempedoic acid + simvastatin >20 mg/day or pravastatin 40 mg/day → avoid combo (~2-fold increase in statin plasma levels). 2022 ACC ECDP / 2023 AHA CCD anchor; FDA Nexletol label confirms. Operational impact: a patient on simvastatin 40 mg with residual LDL elevation should be switched to atorvastatin/rosuvastatin before adding bempedoic acid, OR use ezetimibe instead. (B5 Claim 4 net-new) |
| 68 | new escalation-options FAQ (cascade with Rows 16, 34, 51) | Inclisiran FDA-approved for "ASCVD or HeFH adjunctive LDL-lowering" | **Needs revision** | acc-aha-dys-2026, fda-orange-book | Rewrite per OE — **inclisiran FDA indication is for hypercholesterolemia broadly (including HeFH), NOT ASCVD-specific**. Per FDA Leqvio label: "adjunct to diet and exercise to reduce LDL-C in adults with hypercholesterolemia, including HeFH." Module rewrite must NOT state "ASCVD or HeFH" — correct framing is "hypercholesterolemia adjunctive LDL-lowering (including HeFH); CV outcomes evidence pending ORION-4 + VICTORION-2P." Cascades with Rows 16, 34, 51. Important for PA framing: inclisiran does NOT have an ASCVD-risk-reduction indication — payer PAs that gate on ASCVD-specific FDA indication would deny inclisiran solely on indication; the off-label-for-CV-event-reduction reality means module text must distinguish FDA indication scope from clinical use case (B5 Claim 5) |
| 69 | faqs.med-plan.q1 / new monitoring-cadence FAQ (cascade with Row 38) | Lipid panel + ALT at 4–12 weeks after any LLT change | **Needs revision (ALT routine cadence WRONG)** | acc-aha-dys-2026 | Rewrite per OE — three corrections: (a) **Routine ALT (hepatic function) monitoring = COR 3 No Benefit (LOE B-NR)** in adults on statin therapy without severe symptoms suggestive of hepatotoxicity. **Module's "lipid panel + ALT at 4–12 wk" framing is NOT supported by 2026** — the COR 1 LOE A recommendation specifies a **lipid profile only**, not ALT. Drop the routine ALT cadence. (b) **Routine CK monitoring = COR 3 No Benefit (LOE A)** — already in module text; reinforced. (c) **Discontinuation thresholds** (ALT >3× ULN with symptoms; CK >10× ULN with symptoms) are FDA-labeling-driven clinical practice from prior guidelines, NOT formally restated as 2026 recommendations. Module rewrite should attribute discontinuation thresholds to FDA labeling + clinical practice. Cascades with Row 38 (B5 Claim 8) |
| 70 | faqs.not-at-goal.q1 (cascade with Row 13) | Ezetimibe LDL reduction "15–20%" / "~18–24%" — claim conflates monotherapy vs add-on | **Verified with split** | acc-aha-dys-2026, cannon-nejm-2015 | Rewrite per OE — **LDL-C reduction split: 18% as MONOTHERAPY; 25% INCREMENTAL when added to statin** — these are two different contexts, do not blend into a single range. Also: **IMPROVE-IT follow-up = mean 6 years**, not 7. **Overall NNT ~50 over 6 years; substantially lower (~16) in the ≥3-risk-indicators subgroup** (6.3% ARR vs ~2% overall — Cannon NEJM 2015 + 2026 guideline). Module rewrite should highlight the high-risk subgroup ARR for VHR + post-ACS counseling — supports "ezetimibe is highest-yield in the highest-risk patients" framing. Cascades with Row 13 (B5 Claim 2) |
| 71 | faqs.not-at-goal.q1 (cascade with Row 13) | Ezetimibe COR 1 add-on for ASCVD | **Needs revision** | acc-aha-dys-2026 | Rewrite per OE — **ezetimibe COR is 1 (LOE A) only for VHR ASCVD** (Recommendation 5 / Section 4.2.6: "ezetimibe and/or PCSK9 mAb"). For **non-VHR ASCVD, ezetimibe is COR 2a, NOT COR 1**. Module rewrite must distinguish VHR from non-VHR ASCVD framing for ezetimibe (and parallel: bempedoic acid COR 2a for VHR ASCVD; for non-VHR ASCVD, listed as COR 2a alongside ezetimibe + PCSK9 mAb). Cascades with Row 13 (B5 Claim 2) |
| 72 | faqs.not-at-goal.q1 / faqs.advanced-markers.q2 (cascade with Row 14) | PCSK9 mAb LDL reduction "~50–60%"; alirocumab "mortality benefit"; HoFH approval = evolocumab only | **Verified with corrections** | acc-aha-dys-2026, fourier-2017, odyssey-outcomes-2018, fda-orange-book | Rewrite per OE — three corrections: (a) **LDL-C reduction range = 45–64%** per 2026 guideline (broader than module's 50–60%). (b) **Alirocumab mortality benefit in ODYSSEY OUTCOMES is a POST-HOC SUBGROUP finding** in patients with high-baseline LDL — overall trial primary analysis did NOT show statistically significant mortality benefit. Module rewrite should mark exploratory, NOT promote as headline. (c) **Alirocumab also has HoFH FDA approval** (claim originally listed HoFH as evolocumab-only — module rewrite must include alirocumab HoFH approval alongside evolocumab). FOURIER + ODYSSEY OUTCOMES NEJM citations confirmed via OE references. Cascades with Row 14 (B5 Claim 3) |
| 73 | new escalation-options FAQ / new whats-new-2023-2024 FAQ | Combination therapy at initiation — VHR ASCVD allows statin+ezetimibe or statin+PCSK9 combo init; ACS in-hospital PCSK9 (EVOPACS, EPIC-STEMI) emerging evidence | **Verified with nuance** | acc-aha-dys-2026, bergmark-lancet-2022 | Rewrite per OE — three points: (a) **Severe hypercholesterolemia + ASCVD "almost always require aggressive combination therapy"** confirmed; "and/or" guideline language for nonstatin add-ons supports combo initiation in this scenario. (b) **2026 guideline does NOT explicitly state combination initiation at first visit is COR 1 for typical (non-severe-hyperchol) ASCVD patients** — secondary prevention recs still reference "maximally tolerated statin therapy" as prerequisite before adding nonstatins. Module rewrite must distinguish severe-hyperchol+ASCVD scenario (combo init supported) from typical ASCVD (default to statin → reassess → add nonstatin). (c) **ACS in-hospital PCSK9 initiation (EVOPACS, EPIC-STEMI) — emerging evidence; NO specific COR recommendation in 2026.** Phase 2 module rewrite should briefly mention as forward-looking footnote (similar to Row 40 VESALIUS-CV future-state) rather than current-practice recommendation. Bergmark Lancet 2022 ACS review is the operational anchor (B5 Claim 9) |
| 74 | new statin-intolerance FAQ (cascade with Row 62) | Statin-intolerance pathway — ≥2 trials, SAMSON-aware rechallenge | **Verified with attribution correction** | acc-2022-decisionpathway, acc-aha-dys-2026 | Rewrite per OE — two attribution corrections: (a) **2026 ACC/AHA Dyslipidemia Guideline does NOT specify a numeric trial count.** Payer requirements for ≥2 statin trials are payer-driven, not guideline-mandated. (b) **2022 ACC ECDP recommended "at least 2 (and preferably 3) statins, including a trial of 1 attempt at the lowest approved daily dose or using alternative statin dosing"** before declaring intolerance. Module rewrite must attribute the "≥2 (preferably 3) trials" framing to 2022 ACC ECDP — NOT 2026 guideline. Pair with Row 62 framing on SAMSON nocebo (90%; published in JACC 2021 not NEJM). Cascades with Row 62 (B5 Claim 11) |
| 75 | faqs.not-at-goal.q1 + new statin-intolerance FAQ (cascade with Rows 14, 33) | PCSK9 mAb CVOT covers both ASCVD-on-statin + statin-intolerant populations; FDA indications cover both | **Verified with clarification** | acc-aha-dys-2026, fourier-2017, odyssey-outcomes-2018, fda-orange-book | Rewrite per OE — **FOURIER enrolled ASCVD patients on statin; ODYSSEY OUTCOMES enrolled post-ACS patients on high-intensity statin. NEITHER trial specifically enrolled statin-intolerant patients as the primary population**, but FDA indications are NOT restricted to statin-intolerant. Module rewrite must clarify: PCSK9 mAb FDA indication scope ≠ trial enrollment scope. Operationally, this means PCSK9 mAb PAs do NOT require statin-intolerance documentation (they require maximally tolerated statin + LDL above threshold per Row 14); bempedoic acid CVOT outcome indication IS restricted to statin-intolerant per FDA Nexletol label (Row 66 cascade). Cascades with Rows 14, 33 (B5 Claim 11) |
| 76 | new escalation-options FAQ (cascade with Rows 47, 51) | Adherence: PCSK9 mAb ~75% long-term; inclisiran ~95% persistence | **Verified with caveat (specific numbers UNVERIFIABLE)** | acc-2022-decisionpathway, acc-aha-dys-2026 | Rewrite per OE — **specific adherence percentages (PCSK9 mAb ~75%, inclisiran ~95%) could NOT be verified from retrieved literature.** 2022 ACC ECDP notes inclisiran's twice-yearly dosing is "potentially attractive" for adherence concerns; 2026 guideline positions inclisiran for patients with "demonstrated poor adherence to PCSK9 mAbs." **General principle (Q6M dosing typically improves persistence vs self-administered Q2W/Q4W) well-supported conceptually**, but specific percentages should be sourced (or removed) before Phase 2 module rewrite. Module rewrite recommendation: state the general principle without specific percentages, OR find verifiable post-marketing studies before committing to numbers (B5 Claim 12) |
| 77 | new escalation-options FAQ + faqs.advanced-markers.q1 (softens Rows 47, 51) | Lp(a) reduction differential — PCSK9 mAbs ~26–29% vs inclisiran ~22% — directional difference matters operationally for elevated-Lp(a) patient | **Verified with softening** | xie-atherosclerosis-2025, mulligan-jcl-2026 | Soften per OE — Xie 2025 meta found PCSK9 mAbs ~29% / inclisiran ~22% (directional difference). **Mulligan JCL 2026 meta found NO statistically significant difference between agents in Lp(a) reduction (inclisiran vs evolocumab +4.9%, P=0.18) — the differential may NOT be clinically meaningful.** Module rewrite should soften the "slight Lp(a) advantage of PCSK9 mAbs over inclisiran" framing in Rows 47, 51. The 2026 guideline preferential-PCSK9-mAb-for-elevated-Lp(a) recommendation (Row 51) still stands — but rationale shifts from Lp(a)-magnitude differential to **CV-outcomes evidence differential** (FOURIER + ODYSSEY OUTCOMES vs ORION-4/VICTORION-2P pending). Module text: prefer evolocumab/alirocumab over inclisiran in elevated-Lp(a) ASCVD patients NOT at LDL goal because of CV-benefit evidence base, NOT because of larger Lp(a) reduction. Cascades with Rows 47, 51 (B5 Claim 5) |
| 78 | faqs.med-plan.q2 (T1 statin intensity table) | Simvastatin 80 mg "contraindicated for new initiation"; preferred-statin tier framing | **Verified with wording correction** | acc-aha-dys-2026, grundy-2018-cholesterol | Rewrite per OE — two corrections: (a) **Simvastatin 80 mg = FDA "not recommended" (NOT "contraindicated").** Practical effect identical, but module wording should mirror FDA language ("initiation of simvastatin 80 mg or titration to 80 mg is not recommended by the FDA because of the increased risk of myopathy, including rhabdomyolysis"). (b) **2026 distinguishes "Preferred Statins" (atorvastatin, rosuvastatin) vs "Other Statins" within each intensity tier** — module rewrite should default to atorvastatin or rosuvastatin in initiation/rechallenge prose. Statin-naïve initiation + post-SAMSON rechallenge protocols should default to the preferred agents. Anchors T1 (statin intensity table). 2026 Table 6 confirmed via OE: high-intensity ≥50% = atorva 40–80 + rosuva 20–40; moderate 30–49% = atorva 10–20 + rosuva 5–10 + simva 20–40 + prava 40–80 + lova 40 (80 in parens) + fluva XL 80 or 40 BID + pita 1–4; low <30% includes simva 10 + prava 10–20 + lova 20 + fluva 20–40. T1 numerics now LOCKED for Phase 2 rewrite (B5 Claim 7) |
| 79 | references staging + tracker meta | Anticipated NEJM trial citations + STRENGTH | **Confirmed (4 of 5 from anticipated)** | cannon-nejm-2015, fourier-2017, odyssey-outcomes-2018, reduce-it-2019 | Confirm per OE — `improve-it-2015` (Cannon NEJM 2015), `fourier-2017` (Sabatine NEJM 2017), `odyssey-outcomes-2018` (Schwartz NEJM 2018), `reduce-it-2019` (Bhatt NEJM 2019) all officially confirmed via OE references. **Move all four from "anticipated anchors" → confirmed citations in references staging.** STRENGTH (Nicholls JAMA 2020) referenced in Bundle 5 OE response narrative but NOT directly cited in references list — keep `strength-jama-2020` as anticipated; confirm in Phase 2 rewrite by pulling JAMA 2020 directly. Net-new citations from Bundle 5 OE references: `nicholls-jamacardio-2024` (CLEAR Outcomes total events analysis), `bhatt-jacc-2019` (REDUCE-IT first/total ischemic events by TG tertiles), `bergmark-lancet-2022` (ACS review — operational anchor for ACS in-hospital PCSK9 / EVOPACS / EPIC-STEMI), `goldberg-dca-2020` (2018 AHA/ACC + diabetes — IPE FDA indication framing), `dixon-amjmed-2020` (IPE for reducing CV risk review), `power-rosenson-2022` (Secondary Prevention chapter — book figure source), `fda-nexletol-2026` (Nexletol FDA prescribing label updated 2026-01-15 — bempedoic acid scope) (B5 references section) |
| 80 | landing_intro + escalation.severe-hyperchol + new whats-new-2023-2024 FAQ (resolves Row 77 flag) | Section reference — Module's "Section 4.2.3.1" for LDL ≥190 framework | **Verified with correction** | acc-aha-dys-2026, acc-aha-dys-2026-jacc | Rewrite per OE — module's "Section 4.2.3.1" wrong; correct section is **4.2.4.3** ("Severe Hypercholesterolemia With LDL-C ≥190 mg/dL"). Bundle 6 confirms what Bundle 5 flagged. **Resolves Row 77 ambiguity** — Section 4.2.4.3 is the canonical severe-hyperchol section in 2026; non-VHR ASCVD COR 2a <55 substantive finding (Row 64) is robust per Lee NEJM 2026 but section number must be verified separately or omitted in favor of "per the 2026 ACC/AHA Dyslipidemia Guideline" framing (B6 Claim 1) |
| 81 | landing_intro + escalation.severe-hyperchol | Module's "adults aged 20+" qualifier on LDL ≥190 COR 1 | **Disproved** | acc-aha-dys-2026 | Remove per OE — 2026 guideline says simply "adults" without lower age bound of 20+. The 2018 guideline referenced ages 20–75 for the COR 2a ezetimibe add-on, but the statin recommendation itself was not age-bounded. Module rewrite must drop "aged 20+" qualifier (B6 Claim 1) |
| 82 | new escalation-options FAQ + escalation.severe-hyperchol (cascade with Row 53) | Module's "COR 1 means therapy 'should' be provided after SDM" for LDL ≥190 | **Verified with softening** | acc-aha-dys-2026 | Soften per OE — 2026 supportive text for LDL ≥190 statin initiation does NOT explicitly mandate SDM as gating requirement (unlike the primary prevention pathway for LDL 70–189). SDM framing more prominent in primary prevention sections. For LDL ≥190 the language is more directive. Module rewrite: SDM is good practice but not gating; PCP should start max-tolerated statin at the visit LDL ≥190 confirmed + document rationale. Cascade with Row 53 (B6 Claim 1) |
| 83 | new escalation-options FAQ — secondary-causes pre-treatment workup | Secondary-causes medication list — module includes retinoids + immunosuppressants + oral estrogen | **Needs revision** | acc-aha-dys-2026, nla-fh-2026 | Rewrite per OE — Table 15 of 2026 lists: hypothyroidism, nephrotic syndrome, obstructive liver disease/cholestatic disease, CKD, ketogenic/very-low-carb diets, glucocorticoids, **estrogens** (no route specified), **cyclosporine** (specific agent), atypical antipsychotics, high-dose thiazides, androgens. **Drop "retinoids"** — NOT in Table 15 (cause hyperTG not isolated LDL elevation). **Replace "immunosuppressants" with "cyclosporine"** (specific Table 15 agent). **Drop "oral" qualifier on estrogen** — guideline says "estrogens" without route. NLA 2026 FH consensus also lists these + adds **menopause as contributor** (add to module text). Module rewrite must mirror Table 15 verbatim (B6 Claim 2) |
| 84 | new escalation-options FAQ — pre-treatment workup | Module's "repeat fasting lipid panel to confirm before committing to long-term FH-pathway management" | **Verified with softening** | acc-aha-dys-2026, nla-fh-2026 | Soften per OE — 2026 ACC/AHA does NOT explicitly require confirmatory repeat lipid panel before starting statin therapy at LDL ≥190; recommends start max-tolerated statin + simultaneously evaluate for secondary causes and FH. NLA 2026 FH consensus supports repeat as reasonable practice but not gating. Module rewrite: do NOT delay statin initiation while awaiting confirmation; order TSH + UPCR + hepatic panel + dietary/medication history concurrent with statin start (B6 Claim 2) |
| 85 | new fh-diagnosis FAQ (does not exist) | DLCN as "primary framework" for adult clinical FH diagnosis per 2026 ACC/AHA | **Disproved** | acc-aha-dys-2026, va-dod-lipid-2026, sturm-jacc-2018 | Rewrite per OE — 2026 ACC/AHA Dyslipidemia Guideline does NOT explicitly endorse DLCN as the "primary framework" for adult clinical diagnosis. Guideline focuses on **genetic testing as primary diagnostic approach**; doesn't mandate any specific clinical scoring system. VA/DoD 2026 references both DLCN + AHA clinical classification. ESC/EAS 2019 + EAS consensus do center DLCN. Module rewrite must reframe: "DLCN is a reasonable clinical tool used internationally; the 2026 ACC/AHA guideline emphasizes genetic testing more than prior guidelines." DLCN ≥6 (probable 6–8 / definite >8) threshold confirmed (B6 Claim 3) |
| 86 | new fh-diagnosis FAQ + landing_intro | "2024 ESC/EAS FH Consensus" citation referenced in module | **Disproved** | santos-ldne-2025 | Remove per OE — "2024 ESC/EAS FH Consensus" citation cannot be verified. Most recent ESC/EAS dyslipidemia guideline = 2019; FH-focused comprehensive review = Santos et al. *Lancet Diabetes Endocrinol* 2025;13(12):1054–1071. Module rewrite must drop "2024 ESC/EAS FH Consensus" + cite `santos-ldne-2025` for FH-focused review + ESC/EAS 2019 dyslipidemia guideline (not currently in staging — pull if needed) (B6 Claim 3) |
| 87 | new fh-diagnosis FAQ + new genetic-testing-fh FAQ (cascade with Row 53) | Genetic testing for FH = "COR 2a" overall in 2026 | **Verified with stratification correction** | acc-aha-dys-2026, sturm-jacc-2018 | Rewrite per OE — module's "COR 2a overall" partially correct but understates. Actual 2026 stratification: **COR 1 LOE B-NR** for adults with possible/probable/definite clinical FH (significant upgrade from prior); **COR 2a LOE B-NR** for adults with LDL-C ≥190 without secondary cause (no clinical FH suspicion yet); **COR 2b LOE B-NR** for adults with LDL-C 160–189 without secondary cause. Module rewrite must stratify by clinical FH suspicion. Genes (LDLR, APOB, PCSK9, LDLRAP1) correct. ~20–40% of clinically definite DLCN cases lack identifiable pathogenic variants — supported per Sturm 2018 expert panel. Cascade with Row 53 (B6 Claim 8) |
| 88 | new fh-diagnosis FAQ | DLCN/Simon Broome/MEDPED share same diagnostic features (family history, LDL levels, tendinous xanthomata, corneal arcus) | **Verified with MEDPED nuance** | gidding-circ-2015, qureshi-cochrane-2021, sturm-jacc-2018 | Rewrite per OE — DLCN and Simon Broome incorporate family history, LDL levels, tendinous xanthomata, corneal arcus before 45. **MEDPED uses ONLY age-specific total cholesterol thresholds — does NOT incorporate family history or physical examination findings.** Module rewrite shouldn't lump all three frameworks as if they share diagnostic features. Tendinous xanthomata + corneal arcus before 45 most specific physical findings; absence does NOT rule out FH. Module text should not require physical findings to pursue an FH workup at LDL ≥190 (B6 Claim 4) |
| 89 | escalation.severe-hyperchol + new whats-new-2023-2024 FAQ (cascade with Row 37) | DD4: 3-tier severe-hyperchol middle-tier trigger logic — OR vs AND | **Resolved (DD4 closed) with critical wording correction** | acc-aha-dys-2026 | **DD4 RESOLVED: OR logic.** Any one of: HeFH **OR** documented coronary calcification (CAC) **OR** additional major risk factors triggers Tier 2 (LDL <70 mg/dL, COR 1). **CRITICAL CORRECTION:** Tier 2 trigger is **"documented coronary calcification" (CAC), NOT broader "coronary atherosclerosis."** Module's "subclinical or clinical coronary atherosclerosis" wording wrong. **Clinical ASCVD = Tier 3 (NOT Tier 2)** → LDL <55 mg/dL. Tier 1 (no HeFH/CAC/risk factors) = <100. Tier 2 = <70. Tier 3 (ASCVD) = <55. Module rewrite must use OR logic + CAC-specific wording. Section 4.2.4.3 Recommendation 4 is the operational anchor. Cascade with Row 37 (B6 Claim 6) |
| 90 | new fh-diagnosis FAQ + new cascade-screening FAQ | Cascade screening for FH families = "COR 1" in 2026 | **Disproved on COR strength** | acc-aha-dys-2026 | Rewrite per OE — 2026 cascade lipid screening is **COR 2a (NOT COR 1)** for first/second-degree relatives of premature ASCVD / severe hyperchol / FH; ≥2 yo. Module's "COR 1" overstates the strength. Operational description (index → first-degree → extend to second-degree if positive) reasonable. PCP-initiated cascade conversations remain reasonable clinical practice. Module rewrite must downgrade COR (B6 Claim 9) |
| 91 | new cascade-screening FAQ + faqs.advanced-markers.q1 (softens Row 52) | "Lp(a) cascade testing in FH families is also COR 1 per 2026" | **Disproved (cannot be verified)** | acc-aha-dys-2026 | Remove per OE — specific COR 1 recommendation for Lp(a) cascade testing in FH families could NOT be verified from retrieved 2026 evidence. 2026 does recommend once-in-lifetime Lp(a) testing for adults generally, but specific Lp(a)-cascade-in-FH COR could not be confirmed. Module rewrite: drop "Lp(a) cascade in FH families is COR 1 per 2026" claim; use universal once-in-lifetime Lp(a) testing framing instead. "FH does NOT cause elevated Lp(a)" + independent inheritance biologically correct (per Trinder 2020). Softens Row 52 framing (B6 Claim 9) |
| 92 | new pediatric-screening FAQ + new whats-new-2023-2024 FAQ | Module's "AAP/NLA/2020 AHA FH Statement recommend universal pediatric lipid screening at 9–11 AND 17–21" | **Verified with attribution correction** | acc-aha-dys-2026, gidding-circ-2015 | Rewrite per OE — universal pediatric lipid screening at 9–11 = COR 1 LOE B-NR confirmed in 2026. **2026 ACC/AHA does NOT include 17–21 second universal screening window in formal recommendations** — that comes from 2011 NHLBI Expert Panel (endorsed by AAP). Module rewrite must attribute the 17–21 second window to **2011 NHLBI Expert Panel + AAP**, NOT 2026 ACC/AHA. Cascade screening from age 2 supported. Pediatric HeFH statin from age 8–10 + LDL goal <130 / ≥50% reduction supported (B6 Claim 10) |
| 93 | new escalation-options FAQ + escalation.severe-hyperchol (cascade with Row 73) | Module's "statin+ezetimibe at first visit, PCSK9 mAb add-on as second step in 4–12 weeks if not at goal" for severe hyperchol+ASCVD | **Verified with sequencing correction** | acc-aha-dys-2026, acc-2022-decisionpathway, nla-fh-2026 | Rewrite per OE — module's prescribed sequencing reflects 2022 ACC ECDP shape, NOT 2026 guideline. **2026 lists ezetimibe / PCSK9 mAbs / bempedoic acid as add-on options without explicit sequencing for FH+ASCVD population.** "And/or" guideline language permits upfront combination at first visit. Module rewrite: keep stepwise (statin → ezetimibe → PCSK9 mAb in 4–12 weeks) as one option but allow upfront combination per 2026 language; distinguish from typical ASCVD secondary prevention (still defaults to maximally tolerated statin → reassess → add nonstatin). Cascade with Row 73 (B6 Claim 12) |
| 94 | new escalation-options FAQ + faqs.not-at-goal.q1 (cascade with Rows 16, 34, 75, 76) | Module's "none of these agents has a preferred-position recommendation specifically in HeFH per 2026" | **Disproved** | acc-aha-dys-2026 | Rewrite per OE — partially incorrect. **2026 explicitly positions inclisiran as second-line to PCSK9 mAbs** (COR 2a vs COR 1 for PCSK9 mAbs); supportive text states "pending [cardiovascular outcomes trial] results, inclisiran remains a second-line PCSK9 mAb." Module rewrite: prefer evolocumab or alirocumab first in HeFH+ASCVD; inclisiran for adherence concerns or PCSK9 mAb intolerance. The choice between PCSK9 mAb and bempedoic acid is driven by LDL gap to goal + payer + patient preference (no within-second-line preferential ordering). Cascades with Rows 16, 34, 75, 76 (B6 Claim 12) |
| 95 | new escalation-options FAQ (cascade with Rows 66, 75) | Bempedoic acid FDA-approved for "HeFH adjunctive LDL-lowering" per module | **Verified with completeness correction** | fda-nexletol-2026, fda-orange-book | Rewrite per OE — module's framing correct but incomplete. Bempedoic acid (Nexletol) has **two distinct FDA indications**: (a) **LDL-C reduction in primary hyperlipidemia, including HeFH** — broad adjunctive scope; (b) **CV risk reduction in adults unable to take recommended statin therapy** (from CLEAR Outcomes) — limited to statin-intolerant. Module rewrite must split the two indications + clarify that HeFH adjunctive LDL-lowering is the broad indication; CV-risk-reduction outcome indication is statin-intolerant only. Cascades with Rows 66, 75 (B6 Claim 13) |
| 96 | new statin-T2D FAQ (cascade with Row 61) | Statin-induced T2D in FH cohort — does the 2024 CTT IPD intensity-dependence (10% RRI mod / 36% RRI high) generalize to FH cohort with lifelong duration? | **Verified with FH-specific data caveat** | ctt-collaboration-2024, acc-aha-dys-2026, nla-fh-2026 | Rewrite per OE — 2024 CTT IPD intensity-dependence (10% RRI mod / 36% RRI high; 62% of new diagnoses in top-quartile baseline glycemia) derived from broad CTT populations. **Retrieved evidence does NOT include FH-specific data from EAS-FHSC, SAFEHEART, CASCADE FH registries that would modify magnitude or benefit-risk framing for HeFH.** 2026 does not appear to provide FH-specific guidance on statin-induced T2D. General principle (ASCVD prevention benefit far outweighs T2D risk per COR 1 + lifelong condition) consistent with COR 1. Module rewrite: extend the existing intensity-dependent framing with caveat that FH-specific cohort data not retrieved; do not withhold/reduce intensity in FH due to T2D risk; monitor HbA1c/fasting glucose per standard. Cascade with Row 61 (B6 Claim 15) |
| 97 | new escalation-options FAQ + escalation.severe-hyperchol | Module's "FOURIER-OLE 8-year extension" citation for very-low-LDL safety | **Disproved (cannot be verified)** | giugliano-lancet-2017, rosenson-jacc-2018, newman-atvb-2019, sabatine-jamacardio-2018 | Rewrite per OE — "FOURIER-OLE 8-year extension" cannot be confirmed from retrieved literature. FOURIER OLE studies (NCT03080935, NCT02867813) **planned for ~5 years** of follow-up, NOT 8. Module rewrite: drop "FOURIER-OLE 8-year extension" framing; cite **Sabatine et al. 2018 JAMA Cardiology meta-analysis of IMPROVE-IT/FOURIER/REVEAL** (`sabatine-jamacardio-2018` — net-new) for very-low-LDL safety synthesis instead. Pair with `newman-atvb-2019` (Statin Safety) + `giugliano-lancet-2017` (FOURIER prespecified secondary at LDL <0.5 mmol/L) + `rosenson-jacc-2018` (EBBINGHAUS no neurocognitive impairment) (B6 Claim 16) |
| 98 | references staging | Anticipated AHA 2020 FH Scientific Statement (Gidding et al. Circulation 2020) | **Year correction** | gidding-circ-2015 | Confirm per OE — anticipated `gidding-circ-2020` citation is **actually Gidding et al. 2015 Circulation** ("The Agenda for Familial Hypercholesterolemia: AHA Scientific Statement"; *Circulation*. 2015;132(22):2167-92; doi:10.1161/CIR.0000000000000297). **Year correction from anticipated 2020 → confirmed 2015.** Use `gidding-circ-2015` as canonical ref_id. Required citation for FH cascade screening + pediatric initiation framing. Move from "anticipated" → confirmed in references staging (B6 references section) |

**Verdict scale (consistent with benzos):** Verified · Verified with nuance · Needs revision · Disproved · Net-new content (no prior claim) · Resolved · Forward-looking / informational.

**Action scale:** Add `[ref:X]` marker · Soften language · Rewrite per OE · Add new content · Remove · Promote to checklist/escalation.

---

## References staging

As OE returns citations, capture them here with the `ref_id` that matches the tracker table. This becomes the `references[]` array in the lipid module once verification is complete.

| ref_id | citation | url | accessed / notes |
|--------|----------|-----|------------------|
| acc-aha-dys-2026 | Blumenthal RS, Morris PB, et al. 2026 ACC/AHA/AACVPR/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Dyslipidemia: A Report of the American College of Cardiology/American Heart Association Joint Committee on Clinical Practice Guidelines. *Circulation*. 2026. | https://doi.org/10.1161/CIR.0000000000001423 | 2026-05-04 — **Dominant meta-pass ref**; cited in 8 of 8 primary flags + 6 of 7 additional flags. Authoritative for PREVENT thresholds, VHR criteria, LDL/non-HDL co-primary targets, escalation sequencing (no longer ezetimibe-first), risk-enhancer table, CAC age + COR 1 upgrade + 3–7yr reassessment, Lp(a) COR 1 universal screening, ApoB COR 2a indications. |
| acc-aha-dys-2026-jacc | Blumenthal RS, Morris PB, Gaudino M, et al. 2026 ACC/AHA Multisociety Guideline on the Management of Dyslipidemia (JACC version). *J Am Coll Cardiol*. 2026;:S0735-1097(25)10254-4. | https://doi.org/10.1016/j.jacc.2025.11.016 | 2026-05-04 — JACC publication of the same 2026 guideline; OE cited it for the LDL-C/non-HDL-C co-primary framing, PREVENT crosswalk table, and CAC COR 1 specifics. Treat as alias of `acc-aha-dys-2026`; pair both ref_ids when the precise tabulated detail came from JACC text. |
| acc-2022-decisionpathway | Lloyd-Jones DM, Morris PB, Ballantyne CM, et al. 2022 ACC Expert Consensus Decision Pathway on the Role of Nonstatin Therapies for LDL-Cholesterol Lowering in the Management of Atherosclerotic Cardiovascular Disease Risk. *J Am Coll Cardiol*. 2022;80(14):1366-1418. | https://doi.org/10.1016/j.jacc.2022.07.006 | 2026-05-04 — Pre-staged from plan; **confirmed by MP** as authoritative for VHR Table 1 criteria + PCSK9 PA framework (PA documentation requirements + ezetimibe-trial expectation). Anchor for nonstatin-therapy escalation specifics not yet superseded by 2026 guideline. |
| clear-outcomes-2023 | Nissen SE, Lincoff AM, Brennan D, et al. Bempedoic Acid and Cardiovascular Outcomes in Statin-Intolerant Patients (CLEAR Outcomes). *N Engl J Med*. 2023;388(15):1353-1364. | https://doi.org/10.1056/NEJMoa2215024 | 2026-05-04 — Pre-staged; **confirmed by MP Flag 4** as the trial supporting bempedoic acid's MACE reduction + 2026 COR 2a recommendation. Required citation anywhere bempedoic acid appears. |
| ada-2026-cv | American Diabetes Association Professional Practice Committee. 10. Cardiovascular Disease and Risk Management: Standards of Care in Diabetes—2026. *Diabetes Care*. 2026;49(Supplement_1):S216-S245. | https://doi.org/10.2337/dc26-S010 | 2026-05-04 — MP Flag 7 anchor for SUPD framing — confirms ages 40–75 + diabetes alignment with 2026 ACC/AHA COR 1 moderate-intensity statin. Useful crosswalk for cardiometabolic risk context. |
| fda-orange-book | FDA Orange Book — Approved Drug Products with Therapeutic Equivalence Evaluations. | https://www.accessdata.fda.gov/scripts/cder/ob/ | 2026-05-04 — MP Flag 4 reference for confirming inclisiran + bempedoic acid + PCSK9 mAb FDA-approval status. Operational use only; not a clinical citation in module prose unless a specific label section is cited. |
| khan-circ-2024 | Khan SS, Matsushita K, Sang Y, et al. Development and Validation of the American Heart Association's PREVENT Equations. *Circulation*. 2024;149(6):430–449. doi:10.1161/CIRCULATIONAHA.123.067626. | https://doi.org/10.1161/CIRCULATIONAHA.123.067626 | 2026-05-04 — Pre-staged; **confirmed by B1 Claims 1, 2, 10** as the canonical PREVENT validation paper (separate from Khan 2023 AHA scientific statement). Required citation for PREVENT methodology + age 30–79 calibration + base-predictor list. |
| khan-circ-2023-aha-statement | Khan SS, Coresh J, Pencina MJ, et al. Novel Prediction Equations for Absolute Risk Assessment of Total Cardiovascular Disease Incorporating Cardiovascular-Kidney-Metabolic Health: A Scientific Statement From the American Heart Association. *Circulation*. 2023;148(24):1982–2004. doi:10.1161/CIR.0000000000001191. | https://doi.org/10.1161/CIR.0000000000001191 | 2026-05-04 — **B1 Claim 1, 4, 11** anchor — AHA scientific statement endorsing PREVENT (race-free framework) + total-CVD composite definition. Distinct from the Khan 2024 validation paper. |
| acc-aha-bp-2025 | Jones DW, Ferdinand KC, Taler SJ, et al. 2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults. *J Am Coll Cardiol*. 2025;86(18):1567–1678. doi:10.1016/j.jacc.2025.05.007. | https://doi.org/10.1016/j.jacc.2025.05.007 | 2026-05-04 — **B1 Claim 1, 4** anchor for the BP-management use of PREVENT total-CVD composite. Important operational pairing — distinguishes PREVENT-ASCVD (statin decisions) from PREVENT total-CVD (BP-treatment thresholds). |
| va-dod-lipid-2026 | Heidenreich P, Spacek L, Gregor N, et al. Clinical Practice Guideline on Lipid Management for Cardiovascular Disease Risk Reduction. Department of Veterans Affairs. 2026. | (VA/DoD CPG portal) | 2026-05-04 — **B1 Claim 1, 12** — endorses PREVENT first-line; explicit on deimplementation guidance ("decision to discontinue would ultimately fall to the provider, with consideration from the patient"). Useful regulatory-friendly secondary citation for PCPs. |
| abbasi-jama-2026 | Abbasi J. What to Know About the New Lipid Guidelines. *JAMA*. 2026. doi:10.1001/jama.2026.3968. | https://doi.org/10.1001/jama.2026.3968 | 2026-05-04 — **B1 Claim 1, 4, 7, 8** — JAMA explainer summarizing the 2026 ACC/AHA Dyslipidemia Guideline highlights (PREVENT-ASCVD vs total-CVD distinction, expanded reproductive risk markers, <100 primary-prevention LDL-C goal, ApoB threshold). Treat as authoritative for plain-English framings; pair with primary 2026 guideline cite. |
| diao-jama-2024 | Diao JA, Shi I, Murthy VL, et al. Projected Changes in Statin and Antihypertensive Therapy Eligibility With the AHA PREVENT Cardiovascular Risk Equations. *JAMA*. 2024;332(12):989–1000. doi:10.1001/jama.2024.12537. | https://doi.org/10.1001/jama.2024.12537 | 2026-05-04 — **B1 Claim 6, 11** anchor — PREVENT applied to old PCE thresholds would have reduced statin-eligible adults by ~14–17M; equity concern for disproportionate impact on Black adults that informed the 2026 ≥3% recalibration. Operational rationale for tier-threshold change. |
| anderson-jamaim-2024 | Anderson TS, Wilson LM, Sussman JB. Atherosclerotic Cardiovascular Disease Risk Estimates Using the Predicting Risk of Cardiovascular Disease Events Equations. *JAMA Internal Medicine*. 2024;184(8):963–970. doi:10.1001/jamainternmed.2024.1302. | https://doi.org/10.1001/jamainternmed.2024.1302 | 2026-05-04 — **B1 Claim 3, 6, 11, 12** anchor — magnitude of PCE-vs-PREVENT difference (largest absolute difference in Black adults: PCE 10.9% vs PREVENT 5.1%); ~4M currently-treated adults would lose statin-eligibility under PREVENT with old thresholds. Required citation for race-removal nuance + deimplementation framing. |
| michos-nejm-2019 | Michos ED, McEvoy JW, Blumenthal RS. Lipid Management for the Prevention of Atherosclerotic Cardiovascular Disease. *NEJM*. 2019;381(16):1557–1567. doi:10.1056/NEJMra1806939. | https://doi.org/10.1056/NEJMra1806939 | 2026-05-04 — **B1 Claim 5, 7** historical reference for the **2018/2019 PCE-calibrated tier thresholds** (Low <5% / Bord 5–7.5% / Int 7.5–20% / High >20%). Useful for "what was vs what is now" pedagogy in the `whats-new-2023-2024` FAQ topic. |
| cho-jacc-2025 | Cho SMJ, Levin M, Chen R, et al. AHA PREVENT Equations and Cardiovascular Disease Risk in Diverse Health Care Populations. *J Am Coll Cardiol*. 2025;86(3):181–192. doi:10.1016/j.jacc.2025.04.066. | https://doi.org/10.1016/j.jacc.2025.04.066 | 2026-05-04 — **B1 Claim 3, 11** anchor — PREVENT validation in diverse health-care populations confirms better cross-race calibration than PCE. Pair with Murphy 2025 + Au 2026 for the validation evidence base. |
| murphy-jacc-adv-2025 | Murphy BS, Hershey MS, Huang S, et al. PREVENT Risk Score vs the Pooled Cohort Equations in MESA. *JACC Advances*. 2025;4(6 Pt 1):101825. doi:10.1016/j.jacadv.2025.101825. | https://doi.org/10.1016/j.jacadv.2025.101825 | 2026-05-04 — **B1 Claim 11** anchor — MESA-cohort head-to-head PREVENT vs PCE; better calibration. Required for any module text comparing PREVENT vs PCE accuracy across racial/ethnic groups. |
| au-jamano-2026 | Au M, Zhang Y, Zhou MM, et al. PREVENT Equation Performance in Asian and Native Hawaiian and Other Pacific Islander Groups. *JAMA Network Open*. 2026;9(2):e2556915. doi:10.1001/jamanetworkopen.2025.56915. | https://doi.org/10.1001/jamanetworkopen.2025.56915 | 2026-05-04 — **B1 Claim 11** specific Asian/NHPI validation citation. Use when noting that PREVENT was validated with <3% Asian/NHPI representation in derivation but Au 2026 confirms acceptable subgroup performance. |
| krishnan-jacc-2025 | Krishnan V, Huang X, Zhang S, et al. Age and Sex-Specific Percentiles of 30-Year Cardiovascular Disease Risk Based on the PREVENT Equations. *J Am Coll Cardiol*. 2025;86(21):2017–2027. doi:10.1016/j.jacc.2025.09.1509. | https://doi.org/10.1016/j.jacc.2025.09.1509 | 2026-05-04 — **B1 Claim 9** anchor for 30-year PREVENT risk percentile distributions; useful supporting citation for the new Class 2a 30-yr ≥10% statin-initiation trigger in adults 30–59 with low 10-yr risk. |
| aha-acc-ccd-2023 | Virani SS, Newby LK, Arnold SV, et al. 2023 AHA/ACC/ACCP/ASPC/NLA/PCNA Guideline for the Management of Patients With Chronic Coronary Disease. *J Am Coll Cardiol*. 2023;82(9):833–955. doi:10.1016/j.jacc.2023.04.003. | https://doi.org/10.1016/j.jacc.2023.04.003 | 2026-05-04 — **B2 Claim 1, 7** anchor — specifies the **≥2 high-risk conditions** count threshold for VHR (resolves the 2022 ECDP "multiple" ambiguity). Also reinforces IMPROVE-IT/FOURIER/ODYSSEY framework for secondary prevention. Pair with `acc-2022-decisionpathway` for VHR criteria; pair with `acc-aha-dys-2026` for current LDL targets. |
| lee-nejm-2026 | Lee YJ, Lee SJ, Kim JW, et al. Intensive LDL Cholesterol Targeting in Atherosclerotic Cardiovascular Disease (Ez-PAVE). *N Engl J Med*. 2026. doi:10.1056/NEJMoa2600283. | https://doi.org/10.1056/NEJMoa2600283 | 2026-05-04 — **B2 Claim 4** — **first head-to-head RCT of <55 vs <70 mg/dL LDL targets** in ASCVD patients. HR 0.67 (95% CI 0.52–0.86) for 3-yr major CV events. Required citation anywhere the module justifies the <55 mg/dL VHR threshold — Ez-PAVE is the direct evidence for the target itself, not just an inference from PCSK9 trials. |
| ~~goldstein-atvb-2023~~ | **DEPRECATED — citation does not exist.** Bundle 4 (Claim 9) confirmed via OE search that no "Goldstein et al. 2023 AHA ATVB" Scientific Statement on aggressive LDL-C lowering and the brain exists. The actual AHA statement on statin safety / cognitive impairment / hemorrhagic stroke is **`newman-atvb-2019`** (Newman et al. 2019 AHA ATVB). Use `newman-atvb-2019` everywhere the cognitive-safety / hemorrhagic-stroke / cancer-safety claim appears. **Row 32 cited this — must update to `newman-atvb-2019` before Phase 2 module rewrite.** | n/a | 2026-05-05 — Bundle 4 cascade fix |
| giugliano-lancet-2017 | Giugliano RP, Pedersen TR, Park JG, et al. Clinical Efficacy and Safety of Achieving Very Low LDL-cholesterol Concentrations With the PCSK9 Inhibitor Evolocumab: A Prespecified Secondary Analysis of the FOURIER Trial. *Lancet*. 2017;390(10106):1962–1971. doi:10.1016/S0140-6736(17)32290-0. | https://doi.org/10.1016/S0140-6736(17)32290-0 | 2026-05-04 — **B2 Claim 8** — FOURIER prespecified secondary analysis: no excess adverse events at LDL-C <0.5 mmol/L (~19 mg/dL). Specific anchor for "very low LDL is safe" claim distinct from the AHA-statement summary. |
| rosenson-jacc-2018 | Rosenson RS, Hegele RA, Fazio S, Cannon CP. The Evolving Future of PCSK9 Inhibitors. *J Am Coll Cardiol*. 2018;72(3):314–329. doi:10.1016/j.jacc.2018.04.054. | https://doi.org/10.1016/j.jacc.2018.04.054 | 2026-05-04 — **B2 Claim 8** — review covering the EBBINGHAUS substudy (no neurocognitive impairment with PCSK9 mAb at very low LDL). Use as the EBBINGHAUS-specific citation when module text addresses cognitive concerns. |
| blumenthal-circ-2026-progress | Blumenthal RS, Morris PB, 2026 ACC/AHA Multisociety Guideline on the Management of Dyslipidemia Writing Committee. Clinical Guidelines as a Continuous Work in Progress: Moving at the Speed of Science. *Circulation*. 2026. doi:10.1161/CIR.0000000000001429. | https://doi.org/10.1161/CIR.0000000000001429 | 2026-05-04 — **B2 OE end-of-bundle flag** — companion editorial to the 2026 dyslipidemia guideline carrying the explicit signal that future revisions may collapse the VHR vs non-VHR distinction into a single <55 pathway based on **VESALIUS-CV** trial results. Cite if landing/whats-new FAQ adds the forward-looking footnote (Row 40). |
| grundy-2018-cholesterol | Grundy SM, Stone NJ, Bailey AL, et al. 2018 AHA/ACC/AACVPR/AAPA/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Blood Cholesterol: Executive Summary. *J Am Coll Cardiol*. 2019;73(24):3168-3209. doi:10.1016/j.jacc.2018.11.002. | https://doi.org/10.1016/j.jacc.2018.11.002 | 2026-05-05 — **Confirmed from anticipated anchors** in B3 Claim 7 — original 2018 list of risk-enhancing factors including "apoB ≥130 mg/dL" (lowered to ≥120 in 2026). Required citation for whats-new-2023-2024 FAQ when narrating "what changed since 2018." Pair with `acc-aha-dys-2026` for the 2018 vs 2026 contrast. |
| raja-atherosclerosis-2023 | Raja V, Aguiar C, Alsayed N, et al. Non-HDL-Cholesterol in Dyslipidemia: Review of the State-of-the-Art Literature and Outlook. *Atherosclerosis*. 2023;383:117312. doi:10.1016/j.atherosclerosis.2023.117312. | https://doi.org/10.1016/j.atherosclerosis.2023.117312 | 2026-05-05 — **B3 Claim 1, 2** anchor — non-HDL-C state-of-the-art review covering atherogenic-lipoprotein-particle inventory (LDL+VLDL+IDL+Lp(a)+chylomicron remnants), correlation with apoB, prognostic equivalence to LDL-C across TG range. Required citation for the new co-primary-targets FAQ. |
| sajja-jacc-2022 | Sajja A, Li HF, Spinelli KJ, et al. Discordance Between Standard Equations for Determination of LDL Cholesterol in Patients With Atherosclerosis. *J Am Coll Cardiol*. 2022;79(6):530-541. doi:10.1016/j.jacc.2021.11.042. | https://doi.org/10.1016/j.jacc.2021.11.042 | 2026-05-05 — **B3 Claim 3** anchor — equation discordance in ASCVD population: Friedewald vs Martin/Hopkins vs Sampson/NIH at low LDL-C levels. Pair with `sajja-jamano-2021` and `sampson-jamacardio-2020` for the Friedewald-replacement framing. |
| sajja-jamano-2021 | Sajja A, Park J, Sathiyakumar V, et al. Comparison of Methods to Estimate Low-Density Lipoprotein Cholesterol in Patients With High Triglyceride Levels. *JAMA Network Open*. 2021;4(10):e2128817. doi:10.1001/jamanetworkopen.2021.28817. | https://doi.org/10.1001/jamanetworkopen.2021.28817 | 2026-05-05 — **B3 Claim 3** anchor — head-to-head comparison of LDL-C estimation methods at high TGs. Demonstrates Martin/Hopkins and Sampson/NIH outperform Friedewald at TG ≥150. Required citation for the Friedewald-replacement framing in module rewrite. |
| sampson-jamacardio-2020 | Sampson M, Ling C, Sun Q, et al. A New Equation for Calculation of Low-Density Lipoprotein Cholesterol in Patients With Normolipidemia and/or Hypertriglyceridemia. *JAMA Cardiology*. 2020;5(5):540-548. doi:10.1001/jamacardio.2020.0013. | https://doi.org/10.1001/jamacardio.2020.0013 | 2026-05-05 — **B3 Claim 3** anchor — original publication of the Sampson/NIH equation. Required citation when module mentions Sampson/NIH as a Friedewald alternative. |
| endocrine-society-2020 | Newman CB, Blaha MJ, Boord JB, et al. Lipid Management in Patients With Endocrine Disorders: An Endocrine Society Clinical Practice Guideline. *J Clin Endocrinol Metab*. 2020;105(12):dgaa674. doi:10.1210/clinem/dgaa674. | https://doi.org/10.1210/clinem/dgaa674 | 2026-05-05 — **B3 Claim 5** anchor — Endocrine Society lipid CPG, useful for the "no universal ApoB target" framing context (specific endocrine populations: hypothyroidism, Cushing's, etc.). Likely pulled in deeper for Bundle 6 / metabolic-syndrome territory. |
| fegers-wustrow-jacc-2022 | Fegers-Wustrow I, Gianos E, Halle M, Yang E. Comparison of American and European Guidelines for Primary Prevention of Cardiovascular Disease: JACC Guideline Comparison. *J Am Coll Cardiol*. 2022;79(13):1304-1313. doi:10.1016/j.jacc.2022.02.001. | https://doi.org/10.1016/j.jacc.2022.02.001 | 2026-05-05 — **B3 Claim 5, 6** anchor — canonical ESC/EAS-vs-ACC/AHA comparator paper (SCORE vs PCE/PREVENT framework difference; ApoB threshold differences). **Partially closes DD2** — captures the comparator framing without requiring a separate ESC/EAS-comparator query. Required citation when module needs to disambiguate ESC/EAS numerics from ACC/AHA. |
| xie-atherosclerosis-2025 | Xie S, Galimberti F, Olmastroni E, et al. Effect of Lipid-Lowering Therapies on Lipoprotein(a) Levels: A Comprehensive Meta-Analysis of Randomized Controlled Trials. *Atherosclerosis*. 2025;408:120420. doi:10.1016/j.atherosclerosis.2025.120420. | https://doi.org/10.1016/j.atherosclerosis.2025.120420 | 2026-05-05 — **B3 Claim 13** anchor — 147-RCT, 145,314-subject pooled meta-analysis of LDL-lowering therapies' effect on Lp(a). Authoritative reference for therapy-effect magnitudes: statins no significant effect, PCSK9 mAbs 29%, inclisiran 22%, niacin 37%. Required citation for any Lp(a)-effect-of-therapy claim in module rewrite. |
| qiao-drugs-2026 | Qiao W, Feng Y, Wen Z, Dou L, Li Y. Effect of Proprotein Convertase Subtilisin/Kexin Type 9 (PCSK9) Inhibitors on Lipoprotein(a) Levels: An Umbrella Review of Meta-Analyses of Randomized Controlled Trials. *Drugs*. 2026;:10.1007/s40265-025-02274-x. doi:10.1007/s40265-025-02274-x. | https://doi.org/10.1007/s40265-025-02274-x | 2026-05-05 — **B3 Claim 13** corroborating anchor for PCSK9-mAb-specific Lp(a) reductions (evolocumab 30–47%, alirocumab 19–26%). Pair with `xie-atherosclerosis-2025` for the broader meta-analytic frame. |
| mulligan-jcl-2026 | Mulligan MD, Gandhi RS, Vishwakarma R, Bhattacharya R. Lipoprotein(a) Reduction With Inclisiran, Alirocumab, Evolocumab, Enlicitide, and Lerodalcibep: A Systematic Review and Meta-Analysis of Randomized Controlled Trials. *J Clin Lipidol*. 2026;:S1933-2874(26)00091-7. doi:10.1016/j.jacl.2026.03.019. | https://doi.org/10.1016/j.jacl.2026.03.019 | 2026-05-05 — **B3 Claim 13** anchor — covers the inclisiran-vs-PCSK9-mAb differential (~22% vs ~29%) plus emerging agents (enlicitide, lerodalcibep). Useful for the operational "which agent to pick for elevated-Lp(a) patient" rationale. |
| albers-jacc-2013 | Albers JJ, Slee A, O'Brien KD, et al. Relationship of Apolipoproteins a-1 and B, and Lipoprotein(a) to Cardiovascular Outcomes: The AIM-HIGH Trial. *J Am Coll Cardiol*. 2013;62(17):1575-9. doi:10.1016/j.jacc.2013.06.051. | https://doi.org/10.1016/j.jacc.2013.06.051 | 2026-05-05 — **B3 Claim 13** anchor — AIM-HIGH outcomes-by-apolipoprotein analysis; one of the foundational citations supporting niacin's deprecation despite favorable lipoprotein changes. Pair with `tsimikas-jacc-2017` for the niacin context. |
| tsimikas-jacc-2017 | Tsimikas S. A Test in Context: Lipoprotein(a): Diagnosis, Prognosis, Controversies, and Emerging Therapies. *J Am Coll Cardiol*. 2017;69(6):692-711. doi:10.1016/j.jacc.2016.11.042. | https://doi.org/10.1016/j.jacc.2016.11.042 | 2026-05-05 — **B3 Claim 13** anchor — JACC "A Test in Context" review covering Lp(a) diagnosis, prognosis, niacin AIM-HIGH/HPS2-THRIVE deprecation framing. Useful for module text synthesizing the Lp(a)-as-residual-risk-marker case. |
| malick-jacc-2023 | Malick WA, Goonewardena SN, Koenig W, Rosenson RS. Clinical Trial Design for Lipoprotein(a)-Lowering Therapies: JACC Focus Seminar 2/3. *J Am Coll Cardiol*. 2023;81(16):1633-1645. doi:10.1016/j.jacc.2023.02.033. | https://doi.org/10.1016/j.jacc.2023.02.033 | 2026-05-05 — **B3 Claim 14** anchor — JACC Focus Seminar on Lp(a)-lowering trial design (pelacarsen / olpasiran / lepodisiran trial structure, primary endpoints). Required citation for investigational-therapy framing in whats-new-2023-2024 FAQ. |
| nordestgaard-lancet-2024 | Nordestgaard BG, Langsted A. Lipoprotein(a) and Cardiovascular Disease. *Lancet*. 2024;404(10459):1255-1264. doi:10.1016/S0140-6736(24)01308-4. | https://doi.org/10.1016/S0140-6736(24)01308-4 | 2026-05-05 — **B3 Claim 14** anchor — comprehensive Lp(a)+CVD review covering investigational therapies including muvalaplin (oral, ~65%) and zerlasiran (siRNA, up to 98%) — both omitted from Bundle 3 prompt. Required citation when module enumerates investigational agents. |
| ellis-jacc-2019 | Ellis KL, Pérez de Isla L, Alonso R, et al. Value of Measuring Lipoprotein(a) During Cascade Testing for Familial Hypercholesterolemia. *J Am Coll Cardiol*. 2019;73(9):1029-1039. doi:10.1016/j.jacc.2018.12.037. | https://doi.org/10.1016/j.jacc.2018.12.037 | 2026-05-05 — **B3 Claim 21** anchor — Kaplan-Meier survival analysis in FH cascade testing comparing FH+elevated-Lp(a) vs FH-alone vs Lp(a)-alone vs neither. Required citation when module covers Lp(a) cascade testing in FH families (COR 1). Bundle 6 / FH territory. |
| trinder-jacc-2020 | Trinder M, DeCastro ML, Azizi H, et al. Ascertainment Bias in the Association Between Elevated Lipoprotein(a) and Familial Hypercholesterolemia. *J Am Coll Cardiol*. 2020;75(21):2682-2693. doi:10.1016/j.jacc.2020.03.065. | https://doi.org/10.1016/j.jacc.2020.03.065 | 2026-05-05 — **B3 Claim 21** anchor — cohort analysis distinguishing Lp(a)-FH co-occurrence from Lp(a) being caused by FH. Supports the "FH does not cause elevated Lp(a)" framing. Bundle 6 / FH territory. |
| newman-atvb-2019 | Newman CB, Preiss D, Tobert JA, et al. Statin Safety and Associated Adverse Events: A Scientific Statement From the American Heart Association. *Arteriosclerosis, Thrombosis, and Vascular Biology*. 2019;39(2):e38-e81. doi:10.1161/ATV.0000000000000073. | https://doi.org/10.1161/ATV.0000000000000073 | 2026-05-05 — **B4 Claim 9, 10, 11** — **REPLACES the non-existent `goldstein-atvb-2023` citation**. Authoritative AHA Scientific Statement on Statin Safety: cancer, cognitive impairment / dementia, hemorrhagic stroke (no causal association); statin myopathy rates (1–10/10,000 person-years); rhabdomyolysis (1–3/100,000); statin-induced T2D absolute risk ~0.2%/year. Required citation everywhere module text addresses statin safety, statin-hesitant counseling, MCI-family conversations. **Cascade: also replaces `goldstein-atvb-2023` in Row 32.** |
| ctt-collaboration-2024 | Cholesterol Treatment Trialists' (CTT) Collaboration. Effects of Statin Therapy on Diagnoses of New-Onset Diabetes and Worsening Glycaemia in Large-Scale Randomised Blinded Statin Trials: An Individual Participant Data Meta-Analysis. *Lancet Diabetes & Endocrinology*. 2024;12(5):306-319. doi:10.1016/S2213-8587(24)00040-8. | https://doi.org/10.1016/S2213-8587(24)00040-8 | 2026-05-05 — **B4 Claim 10** anchor — granular intensity-dependent statin-induced T2D risk (10% RRI moderate, 36% RRI high-intensity); 62% of new diagnoses in top-quartile baseline glycemia. Required citation when module text quotes statin-T2D RRI numbers. |
| ctt-collaboration-2012 | Cholesterol Treatment Trialists' (CTT) Collaborators, Mihaylova B, Emberson J, et al. The Effects of Lowering LDL Cholesterol With Statin Therapy in People at Low Risk of Vascular Disease: Meta-Analysis of Individual Data From 27 Randomised Trials. *Lancet*. 2012;380(9841):581-90. doi:10.1016/S0140-6736(12)60367-5. | https://doi.org/10.1016/S0140-6736(12)60367-5 | 2026-05-05 — **B4 Claim 9** anchor — CTT 2012 IPD meta-analysis: 11 fewer major vascular events per 1000 treated over 5 years per 1 mmol/L LDL-C reduction in low-risk populations. Underpins NNT 50–100 framing for primary-prevention statin counseling. |
| collins-lancet-2016 | Collins R, Reith C, Emberson J, et al. Interpretation of the Evidence for the Efficacy and Safety of Statin Therapy. *Lancet*. 2016;388(10059):2532-2561. doi:10.1016/S0140-6736(16)31357-5. | https://doi.org/10.1016/S0140-6736(16)31357-5 | 2026-05-05 — **B4 Claim 9** anchor — CTT efficacy/safety synthesis paper. Pair with `ctt-collaboration-2012` for the proportional-reduction-per-mmol/L framing. |
| silverman-jama-2016 | Silverman MG, Ference BA, Im K, et al. Association Between Lowering LDL-C and Cardiovascular Risk Reduction Among Different Therapeutic Interventions: A Systematic Review and Meta-analysis. *JAMA*. 2016;316(12):1289-97. doi:10.1001/jama.2016.13985. | https://doi.org/10.1001/jama.2016.13985 | 2026-05-05 — **B4 Claim 9** anchor — meta-analysis across LDL-receptor-upregulating therapies (~23% per mmol/L); useful for module text framing the per-mmol/L benefit as class-of-mechanism, not just statin-specific. |
| samson-jacc-2021 | Howard JP, Wood FA, Finegold JA, et al. Side Effect Patterns in a Crossover Trial of Statin, Placebo, and No Treatment (SAMSON). *J Am Coll Cardiol*. 2021;78(12):1210-1222. doi:10.1016/j.jacc.2021.07.022. | https://doi.org/10.1016/j.jacc.2021.07.022 | 2026-05-05 — **B4 Claim 11** anchor — SAMSON nocebo crossover trial. **CRITICAL: published in JACC 2021, NOT NEJM 2021.** Mean symptom scores 16.3 statin / 15.4 placebo / 8.0 no tablet; 50% successfully restarted post-trial. Required citation everywhere module text addresses statin-hesitant counseling or nocebo. **Replaces `samson-2021-nejm` in anticipated anchors list.** |
| warden-jcl-2023 | Warden BA, Guyton JR, Kovacs AC, et al. Assessment and Management of Statin-Associated Muscle Symptoms (SAMS): A Clinical Perspective From the National Lipid Association. *J Clin Lipidol*. 2023 Jan-Feb;17(1):19-39. doi:10.1016/j.jacl.2022.09.001. | https://doi.org/10.1016/j.jacl.2022.09.001 | 2026-05-05 — **B4 Claim 11** anchor — NLA Clinical Perspective on SAMS. Carries the generalizability caveat (SAMSON / StatinWISE results "cannot be generalized to all patients" given small, self-selected populations). Pair with `samson-jacc-2021` whenever module text invokes the 90% nocebo figure. |
| agarwala-jcl-2024 | Agarwala A, Dixon DL, Gianos E, et al. Dyslipidemia Management in Women of Reproductive Potential: An Expert Clinical Consensus From the National Lipid Association. *J Clin Lipidol*. 2024 Sep-Oct;18(5):e664-e684. doi:10.1016/j.jacl.2024.05.005. | https://doi.org/10.1016/j.jacl.2024.05.005 | 2026-05-05 — **B4 Claim 12** anchor — NLA consensus on lipid management in women of reproductive potential. Confirms 2021 FDA pregnancy contraindication removal + case-by-case framing. Required citation for module pregnancy/lactation FAQ. |
| kovacic-circ-2026 | Kovacic JC, Reynolds HR, Alasnag M, et al. Acute Coronary Syndromes in Premenopausal Women: A Scientific Statement From the American Heart Association. *Circulation*. 2026. doi:10.1161/CIR.0000000000001416. | https://doi.org/10.1161/CIR.0000000000001416 | 2026-05-05 — **B4 Claim 12** anchor — AHA Scientific Statement carrying the explicit lactation-contraindication-via-FDA-labeling note. Required citation when module text splits pregnancy from lactation. |
| cannon-nejm-2015 | Cannon CP, Blazing MA, Giugliano RP, et al. Ezetimibe Added to Statin Therapy after Acute Coronary Syndromes (IMPROVE-IT). *N Engl J Med*. 2015;372(25):2387–2397. doi:10.1056/NEJMoa1410489. | https://doi.org/10.1056/NEJMoa1410489 | 2026-05-05 — **B5 Claim 2** anchor — IMPROVE-IT NEJM original. Mean 6-yr follow-up, simvastatin+ezetimibe vs simvastatin alone post-ACS, ~2% ARR overall, NNT ~50. **NNT ~16 in ≥3-risk-indicators subgroup (6.3% ARR).** Required citation everywhere module text invokes ezetimibe CV-benefit evidence. **Promoted from anticipated anchor → confirmed.** |
| fourier-2017 | Sabatine MS, Giugliano RP, Keech AC, et al. Evolocumab and Clinical Outcomes in Patients with Cardiovascular Disease (FOURIER). *N Engl J Med*. 2017;376(18):1713–1722. doi:10.1056/NEJMoa1615664. | https://doi.org/10.1056/NEJMoa1615664 | 2026-05-05 — **B5 Claim 3** + **B2 Claim 8** anchor — FOURIER NEJM original. ASCVD on statin, ~15% RRR MACE, evolocumab Q2W or Q1M. **PCSK9 mAb CVOT NOT specifically restricted to statin-intolerant** — important for Row 75 framing. Pair with Giugliano 2017 Lancet (`giugliano-lancet-2017`) for very-low-LDL safety prespecified secondary analysis. **Promoted from anticipated anchor → confirmed.** |
| odyssey-outcomes-2018 | Schwartz GG, Steg PG, Szarek M, et al. Alirocumab and Cardiovascular Outcomes after Acute Coronary Syndrome (ODYSSEY OUTCOMES). *N Engl J Med*. 2018;379(22):2097–2107. doi:10.1056/NEJMoa1801174. | https://doi.org/10.1056/NEJMoa1801174 | 2026-05-05 — **B5 Claim 3** + **B2 Claim 8** anchor — ODYSSEY OUTCOMES NEJM original. Post-ACS 1–12 mo on high-intensity statin, ~15% RRR MACE. **Mortality benefit in high-baseline-LDL subgroup is POST-HOC subgroup finding** — overall trial primary analysis did NOT show statistically significant mortality benefit. Module rewrite must mark exploratory, NOT promote as headline. **Promoted from anticipated anchor → confirmed.** |
| reduce-it-2019 | Bhatt DL, Steg PG, Miller M, et al. Cardiovascular Risk Reduction with Icosapent Ethyl for Hypertriglyceridemia (REDUCE-IT). *N Engl J Med*. 2019;380(1):11–22. doi:10.1056/NEJMoa1812792. | https://doi.org/10.1056/NEJMoa1812792 | 2026-05-05 — **B5 Claim 6** anchor — REDUCE-IT NEJM original. 25% RRR MACE, TG 135–499 enrollment with statin therapy + ASCVD or DM + ≥1 CV risk factor. **CRITICAL: 2026 ACC/AHA recommendation uses TG ≥150 (not 135 — that was REDUCE-IT enrollment cutoff).** Module rewrite must distinguish trial enrollment from guideline recommendation threshold. **Promoted from anticipated anchor → confirmed.** |
| bhatt-jacc-2019 | Bhatt DL, Steg PG, Miller M, et al. Reduction in First and Total Ischemic Events With Icosapent Ethyl Across Baseline Triglyceride Tertiles. *J Am Coll Cardiol*. 2019;74(8):1159–1161. doi:10.1016/j.jacc.2019.06.043. | https://doi.org/10.1016/j.jacc.2019.06.043 | 2026-05-05 — **B5 Claim 6** anchor — REDUCE-IT secondary analysis showing first + total ischemic events reduction by baseline TG tertiles. Useful for module text addressing IPE benefit across the TG ≥150 range (vs only at ≥500). |
| nicholls-jamacardio-2024 | Nicholls SJ, Nelson AJ, Lincoff AM, et al. Impact of Bempedoic Acid on Total Cardiovascular Events: A Prespecified Analysis of the CLEAR Outcomes Randomized Clinical Trial. *JAMA Cardiology*. 2024;9(3):245–253. doi:10.1001/jamacardio.2023.5155. | https://doi.org/10.1001/jamacardio.2023.5155 | 2026-05-05 — **B5 Claim 4** anchor — CLEAR Outcomes prespecified total events analysis (vs first-event focus of primary publication). Required citation when module text discusses bempedoic acid's repeat-event benefit. Pair with `clear-outcomes-2023` (Nissen NEJM 2023 primary publication). |
| bergmark-lancet-2022 | Bergmark BA, Mathenge N, Merlini PA, Lawrence-Wright MB, Giugliano RP. Acute Coronary Syndromes. *Lancet*. 2022;399(10332):1347–1358. doi:10.1016/S0140-6736(21)02391-6. | https://doi.org/10.1016/S0140-6736(21)02391-6 | 2026-05-05 — **B5 Claim 9** anchor — ACS Lancet 2022 review covering EVOPACS / EPIC-STEMI emerging-evidence framing for in-hospital PCSK9 initiation. **No specific COR recommendation in 2026 guideline yet** — module text should treat as forward-looking footnote (analog of Row 40 VESALIUS-CV future-state signal). |
| power-rosenson-2022 | Power DA, Rosenson RS. Secondary Prevention of Atherosclerotic Cardiovascular Disease. In: Interventional Cardiology. 2022. Chapter 44. ISBN: 9781119697343. | (book chapter) | 2026-05-05 — **B5 figure source** — book chapter cited as Figure 1 source in Bundle 5 OE response (Secondary Prevention in Patients with Clinical ASCVD). Optional anchor for module text framing of secondary-prevention LDL goals; primary anchor remains `acc-aha-dys-2026` for current targets. |
| fda-nexletol-2026 | Nexletol (bempedoic acid) prescribing information. Food and Drug Administration. Updated 2026-01-15. | https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/ | 2026-05-05 — **B5 Claims 4, 11** anchor — current FDA Nexletol label. Carries: (a) MACE-reduction indication scope: "adults at increased risk for these events who are unable to take recommended statin therapy (including those not taking a statin)" — broader than statin-intolerant only. (b) Bempedoic acid + simvastatin >20 mg or pravastatin 40 mg DDI (~2-fold ↑ statin levels — avoid). Required citation when module text discusses bempedoic acid scope or DDI. |
| dixon-amjmed-2020 | Dixon DL. Catch of the Day: Icosapent Ethyl for Reducing Cardiovascular Risk. *Am J Med*. 2020;133(7):802–804. doi:10.1016/j.amjmed.2020.03.006. | https://doi.org/10.1016/j.amjmed.2020.03.006 | 2026-05-05 — **B5 Claim 6** soft anchor — IPE-for-CV-risk-reduction review. Useful for module text framing IPE FDA indication; primary anchor remains `acc-aha-dys-2026` for COR 2b + TG ≥150 threshold + mineral oil placebo controversy. Optional citation. |
| goldberg-dca-2020 | Goldberg RB, Stone NJ, Grundy SM. The 2018 AHA/ACC/AACVPR/AAPA/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guidelines on the Management of Blood Cholesterol in Diabetes. *Diabetes Care*. 2020;43(8):1673–1678. doi:10.2337/dci19-0036. | https://doi.org/10.2337/dci19-0036 | 2026-05-05 — **B5 Claim 6** anchor — 2018 AHA/ACC + diabetes synthesis (IPE FDA indication framing). Useful as a secondary anchor for module text describing IPE indication scope; primary anchor remains `acc-aha-dys-2026` + `reduce-it-2019` + `bhatt-jacc-2019`. |
| nla-fh-2026 | Ahmad Z, Agarwala A, Cuchel M, et al. Update on Familial Hypercholesterolemia: An Expert Clinical Consensus From the National Lipid Association. *J Clin Lipidol*. 2026;:S1933-2874(26)00010-3. doi:10.1016/j.jacl.2026.01.011. | https://doi.org/10.1016/j.jacl.2026.01.011 | 2026-05-06 — **B6 Claims 2, 11, 12, 17** anchor — NLA 2026 FH Expert Clinical Consensus. Canonical contemporary FH framework: secondary-causes Table (incl. menopause as contributor — superset of 2026 ACC/AHA Table 15); pre-treatment workup; lifelong condition framing; counseling themes. Required citation for module FAQ on FH workup, FH counseling, FH lifelong management. |
| gidding-circ-2015 | Gidding SS, Champagne MA, de Ferranti SD, et al. The Agenda for Familial Hypercholesterolemia: A Scientific Statement From the American Heart Association. *Circulation*. 2015;132(22):2167-92. doi:10.1161/CIR.0000000000000297. | https://doi.org/10.1161/CIR.0000000000000297 | 2026-05-06 — **B6 Claims 4, 10, 17** anchor — AHA Scientific Statement on FH agenda (cascade screening, pediatric initiation, diagnostic frameworks). **Year correction from anticipated `gidding-circ-2020` → 2015.** Required citation for FH cascade screening + pediatric statin initiation at age 8–10 + diagnostic-framework framing. **Replaces anticipated AHA-2020-FH-Scientific-Statement anchor.** |
| qureshi-cochrane-2021 | Qureshi N, Da Silva MLR, Abdul-Hamid H, et al. Strategies for Screening for Familial Hypercholesterolaemia in Primary Care and Other Community Settings. *Cochrane Database Syst Rev*. 2021;10:CD012985. doi:10.1002/14651858.CD012985.pub2. | https://doi.org/10.1002/14651858.CD012985.pub2 | 2026-05-06 — **B6 Claims 4, 8** anchor — Cochrane systematic review of FH screening strategies. Provides DLCN/Simon Broome/MEDPED comparator framework + cascade-screening operational evidence. Required citation when module text describes FH framework comparison or screening strategies. |
| santos-ldne-2025 | Santos RD, Gidding SS, Bourbon M, et al. Recent Advances in Research and Care of Familial Hypercholesterolaemia. *Lancet Diabetes Endocrinol*. 2025;13(12):1054-1071. doi:10.1016/S2213-8587(25)00286-4. | https://doi.org/10.1016/S2213-8587(25)00286-4 | 2026-05-06 — **B6 Claims 3, 11, 17** anchor — comprehensive FH review covering recent advances in research and care. **REPLACES the unverifiable "2024 ESC/EAS FH Consensus" citation** referenced in the original Bundle 6 prompt. Required citation when module text discusses FH-focused contemporary review, lifelong management framing, or counseling themes. Pair with `nla-fh-2026` for the contemporary FH expert-consensus + literature-review framework. |
| singh-jacc-2019 | Singh A, Gupta A, Collins BL, et al. Familial Hypercholesterolemia Among Young Adults With Myocardial Infarction. *J Am Coll Cardiol*. 2019;73(19):2439-2450. doi:10.1016/j.jacc.2019.02.059. | https://doi.org/10.1016/j.jacc.2019.02.059 | 2026-05-06 — **B6 Claim 4** anchor — observational study of FH prevalence among young adults presenting with MI; provides operational support for clinical-suspicion threshold framing (xanthomas were present in a small minority of MI patients with FH; absence does not rule out). Useful when module addresses physical-exam-features specificity. |
| sturm-jacc-2018 | Sturm AC, Knowles JW, Gidding SS, et al. Clinical Genetic Testing for Familial Hypercholesterolemia: JACC Scientific Expert Panel. *J Am Coll Cardiol*. 2018;72(6):662-680. doi:10.1016/j.jacc.2018.05.044. | https://doi.org/10.1016/j.jacc.2018.05.044 | 2026-05-06 — **B6 Claims 3, 4, 8** anchor — JACC Scientific Expert Panel on Clinical Genetic Testing for FH. Authoritative source for: DLCN ≥6 ("probable") threshold for genetic testing referral; ~20–40% of clinically definite DLCN cases lack identifiable pathogenic variants (polygenic contribution); LDLR / APOB / PCSK9 / LDLRAP1 gene list; 4-gene FH panel scope. Required citation for genetic-testing FAQ in module rewrite. |
| schunkert-nejm-2026 | Schunkert H, Natarajan P, Samani NJ. The Inherited Basis of Coronary Artery Disease. *N Engl J Med*. 2026;394(6):576-587. doi:10.1056/NEJMra2405153. | https://doi.org/10.1056/NEJMra2405153 | 2026-05-06 — **B6 Claim 11** anchor — NEJM review on inherited basis of CAD. Useful for module text framing the cumulative-LDL-exposure model + monogenic-vs-polygenic distinction. Pair with `acc-aha-dys-2026` for the guideline-level cumulative-exposure framing. |
| raal-atherosclerosis-2018 | Raal FJ, Hovingh GK, Catapano AL. Familial Hypercholesterolemia Treatments: Guidelines and New Therapies. *Atherosclerosis*. 2018;277:483-492. doi:10.1016/j.atherosclerosis.2018.06.859. | https://doi.org/10.1016/j.atherosclerosis.2018.06.859 | 2026-05-06 — **B6 Claim 14** anchor — comprehensive FH treatments review covering lomitapide / evinacumab / lipoprotein apheresis specialty management. Required citation when module text describes HoFH referral pathway. |
| sabatine-jamacardio-2018 | Sabatine MS, Wiviott SD, Im K, Murphy SA, Giugliano RP. Efficacy and Safety of Further Lowering of Low-Density Lipoprotein Cholesterol in Patients Starting With Very Low Levels: A Meta-analysis. *JAMA Cardiology*. 2018;3(9):823-828. doi:10.1001/jamacardio.2018.2258. | https://doi.org/10.1001/jamacardio.2018.2258 | 2026-05-06 — **B6 Claim 16** anchor — JAMA Cardiology meta-analysis of IMPROVE-IT, FOURIER, and REVEAL confirming no safety signal across six prespecified safety outcomes at very low achieved LDL-C levels. **REPLACES the unverifiable "FOURIER-OLE 8-year extension" citation.** Required citation for very-low-LDL safety reassurance framing. Pair with `newman-atvb-2019` (Statin Safety AHA) + `giugliano-lancet-2017` (FOURIER prespecified secondary) + `rosenson-jacc-2018` (EBBINGHAUS) for the very-low-LDL safety synthesis. |

**Anticipated anchors (still pending — confirm or replace as remaining bundles return specific citations):**

- ~~`improve-it-2015` — Cannon CP, Blazing MA, Giugliano RP, et al. Ezetimibe Added to Statin Therapy after ACS (IMPROVE-IT). *N Engl J Med*. 2015;372:2387–2397.~~ — **promoted to confirmed citation `cannon-nejm-2015` 2026-05-05 (B5).** Use `cannon-nejm-2015` as the canonical ref_id.
- ~~`fourier-2017` — Sabatine MS, Giugliano RP, Keech AC, et al. Evolocumab and Clinical Outcomes in Patients with CV Disease (FOURIER). *N Engl J Med*. 2017;376:1713–1722.~~ — **promoted to confirmed citation 2026-05-05 (B5).** Full entry now in staging table.
- ~~`odyssey-outcomes-2018` — Schwartz GG, Steg PG, Szarek M, et al. Alirocumab and CV Outcomes after Acute Coronary Syndrome (ODYSSEY OUTCOMES). *N Engl J Med*. 2018;379:2097–2107.~~ — **promoted to confirmed citation 2026-05-05 (B5).** Full entry now in staging table.
- `esc-eas-2019` — Mach F, Baigent C, Catapano AL, et al. 2019 ESC/EAS Guidelines for the Management of Dyslipidaemias. *Eur Heart J*. 2020;41(1):111–188. (Bundle 3 — partially substituted by `fegers-wustrow-jacc-2022` as the canonical comparator; keep available if module needs the primary ESC/EAS source)
- `eas-lpa-2022` — European Atherosclerosis Society Lp(a) Consensus Statement. 2022. (Bundle 3 — Lp(a) thresholds + once-in-lifetime guidance; **partially superseded** by the 2026 ACC/AHA Table 4 schema confirmed in Row 44; retain only if module needs the explicit EAS source for the 175 nmol/L threshold OE flagged as EAS-derived)
- ~~`acc-aha-cac-2018` — Budoff MJ, et al. Coronary Artery Calcium: ACC/AHA Position Statement. *JACC*. 2018. (Bundle 4)~~ — **deferred** — Bundle 4 OE response confirmed CAC COR 2a → COR 1 upgrade citing only `acc-aha-dys-2026` directly; the 2018 Budoff position statement is referenced by the 2026 guideline but did not surface as a required standalone citation. Pull only if Phase 2 module rewrite needs the original 2018 document.
- ~~`ncqa-hedis-supd` — NCQA HEDIS Measure SUPD: Statin Use in Persons with Diabetes. (technical specs, current measure year — Bundle 4)~~ — **deferred** — Bundle 4 OE response could not independently verify specific HEDIS benchmark numbers from the medical literature; recommend pulling current-measure-year specs directly from NCQA before Phase 2 module rewrite if specific percentages are quoted.
- ~~`samson-2021-nejm`~~ — **superseded by `samson-jacc-2021`** — Bundle 4 confirmed SAMSON published in JACC 2021, NOT NEJM 2021.
- ~~Sattar Lancet 2010 statin-induced T2D meta-analysis~~ — **superseded by `ctt-collaboration-2024` IPD meta** as the operationally-current citation, with the original Sattar OR 1.09 / 1-per-255-py framing carried via `ada-2026-cv` (which cites the original Sattar). Don't pull Sattar 2010 directly.
- ~~`reduce-it-2019` — Bhatt DL, Steg PG, Miller M, et al. Cardiovascular Risk Reduction with Icosapent Ethyl for Hypertriglyceridemia (REDUCE-IT). *N Engl J Med*. 2019;380(1):11-22.~~ — **promoted to confirmed citation 2026-05-05 (B5).** Full entry now in staging table. Pair with `bhatt-jacc-2019` for first/total ischemic events by TG tertiles.
- `strength-jama-2020` — Nicholls SJ, Lincoff AM, Garcia M, et al. Effect of High-Dose Omega-3 Fatty Acids vs Corn Oil on Major Adverse Cardiovascular Events in Patients at High CV Risk (STRENGTH). *JAMA*. 2020;324(22):2268–2280. (Bundle 5 OE response narrative referenced STRENGTH but did NOT directly cite — pull JAMA 2020 directly when Phase 2 module rewrite adds the OTC-fish-oil-negative caveat)
- ~~`gidding-circ-2020` — AHA 2020 FH Scientific Statement (anticipated for Bundle 6)~~ — **promoted to confirmed citation `gidding-circ-2015` 2026-05-06 (B6).** Year correction from anticipated 2020 → confirmed 2015. Use `gidding-circ-2015` as canonical ref_id.
- ~~`esc-eas-fh-2024` — 2024 ESC/EAS FH Consensus (anticipated for Bundle 6)~~ — **DEPRECATED 2026-05-06 (B6).** Citation could not be verified from retrieved literature. Most recent ESC/EAS dyslipidemia guideline = 2019; FH-focused comprehensive review = `santos-ldne-2025` (Santos *Lancet Diabetes Endocrinol* 2025). Phase 2 rewrite uses `santos-ldne-2025` for FH-focused review + ESC/EAS 2019 dyslipidemia guideline (not currently in staging — pull if needed).
- ~~`fourier-ole-8yr` — FOURIER-OLE 8-year extension primary publication (anticipated for Bundle 6)~~ — **DEPRECATED 2026-05-06 (B6).** Citation could not be verified. FOURIER OLE studies (NCT03080935, NCT02867813) planned for ~5 years, not 8. Phase 2 rewrite uses `sabatine-jamacardio-2018` (Sabatine et al. JAMA Cardiology meta of IMPROVE-IT/FOURIER/REVEAL) as canonical very-low-LDL safety synthesis instead.
- `dlcn-who-1998` / `simon-broome-1991` / `medped-williams-1993` — DLCN, Simon Broome, MEDPED original publications (Bundle 6 prompt anchors). **Not specifically cited in Bundle 6 OE references** — Sturm 2018 JACC Expert Panel (`sturm-jacc-2018`) + Qureshi 2021 Cochrane (`qureshi-cochrane-2021`) cover the DLCN/Simon Broome/MEDPED comparator framework. Pull primary publications only if Phase 2 module text needs the explicit framework citation; otherwise use `sturm-jacc-2018` + `qureshi-cochrane-2021`.
- `eas-fhsc-vallejo-vaz` / `safeheart-spanish-cohort` / `cascade-fh-us-cohort` — EAS-FHSC, SAFEHEART, CASCADE FH registries (Bundle 6 prompt anchors for FH-specific T2D data). **No FH-specific data on statin-T2D retrieved** — Bundle 6 OE confirmed retrieved evidence does not include FH-specific data that would modify the 2024 CTT IPD framing. Phase 2 rewrite extends CTT framing with caveat that FH-specific cohort data not retrieved; ASCVD prevention benefit far outweighs T2D risk per COR 1 + lifelong condition.
- `rodenburg-pediatric-fh` / `wiegman-pediatric-fh` / `kusters-pediatric-fh` — pediatric FH statin trials (Bundle 6 prompt anchors for age 8–10 initiation safety). **Not specifically cited in Bundle 6 OE references** — `gidding-circ-2015` + `acc-aha-dys-2026` cover pediatric initiation framing. Pull primary RCTs only if Phase 2 module text needs explicit safety/efficacy data citation.
- `nhlbi-pediatric-2011` — 2011 NHLBI Expert Panel on pediatric lipid screening (Bundle 6 anchor for the 17–21 second screening window). **Not currently in staging — pull from NHLBI Pediatric Cardiovascular Risk Reduction Expert Panel report 2011 if Phase 2 module text needs the explicit 17–21 second-window citation.** AAP endorsement may be cited via AAP Bright Futures or Pediatrics 2011/2012 implementation paper.
- `fda-rosuvastatin` / `fda-atorvastatin` / `fda-ezetimibe` / `fda-evolocumab` / `fda-alirocumab` / `fda-bempedoic-acid` / `fda-inclisiran` / `fda-icosapent-ethyl` — FDA prescribing information labels (verify URL on accessdata.fda.gov; pull as needed)

---

## Asset inventory (for live module rewrite)

Non-prose content that needs to survive into the live module is cataloged here. **Policy (user-set, 2026-04-22): no images or graphs in the live module — cite + link only, route deep evidence through Meridian's existing OpenEvidence pathway.**

### Tables (anticipated)

| # | Likely location | Content | Target in live module | Status |
|---|----------------|---------|----------------------|--------|
| T1 | Bundle 5 response | Statin × intensity × dose-equivalents + LDL-reduction range — rosuvastatin, atorvastatin, simvastatin, pravastatin, lovastatin, fluvastatin, pitavastatin | `faqs.med-plan.q2` answer_html — convert to HTML `<table>` with `[ref:X]` markers | **LOCKED 2026-05-05 (B5 Claim 7).** High-intensity (≥50% LDL-C reduction): atorvastatin 40–80, rosuvastatin 20–40 (Preferred). Moderate (30–49%): atorvastatin 10–20, rosuvastatin 5–10 (Preferred); simvastatin 20–40, pravastatin 40–80, lovastatin 40 (80 in parens), fluvastatin XL 80 or 40 BID, pitavastatin 1–4 (Other). Low (<30%): simvastatin 10, pravastatin 10–20, lovastatin 20, fluvastatin 20–40. Footnote: simvastatin 80 mg = FDA "not recommended" for new initiation/titration (myopathy/rhabdomyolysis risk) — use FDA wording, NOT "contraindicated." 2026 distinguishes Preferred Statins (atorvastatin, rosuvastatin) vs Other Statins within each tier. |
| T2 | Bundle 3 response | LDL-C / non-HDL-C / ApoB target × risk tier table | New FAQ topic `co-primary-targets` answer_html | **Per-tier numerics locked by Row 41** except non-VHR ASCVD COR 2a tighter LDL goal (DD3). Build the table as: VHR (LDL <55, non-HDL <85, ApoB <55 only severe-FH+ASCVD), non-VHR ASCVD (LDL <70, non-HDL <100; tighter sub-tier per DD3), high-risk PP (LDL <70, non-HDL <100), borderline/intermediate PP (LDL <100, non-HDL <130), severe primary hyperchol no ASCVD (LDL <100/<70/<55 by sub-tier per Row 37, non-HDL <130). |

**Schema note:** Tables are new territory for `clinical-modules.json` — current FAQ `answer_html` uses only `<p>`, `<span class="pill">`, and `<em>/<strong>`. Adding HTML `<table>` requires verifying CSS in `glass.css` renders tables cleanly and that DOCX/PDF/PPTX export paths handle tables without breaking. Same concern flagged in benzos verification (see asset inventory there); resolution from that work applies here.

### Images (reference-only — DO NOT embed in live module)

Per user policy: POC decision-making doesn't need deep evidence figures. Citation + OE pathway is sufficient.

_(none anticipated yet; populate if Bundles surface critical figures)_

---

## Prompt iteration log

If Bundle 1 results come back weak or generic, refine the prompt template and record what changed. Future bundles should use the refined version.

- **v1** (initial): _see "Shared bundle prompt template" above_
- **v2** (if needed): _record changes here_

---

## Follow-up prompts (deep-dives from OE's end-of-bundle suggestions)

OE typically offers 1–2 concrete deep-dives at the end of each bundle. Capture them here as they arrive; run as separate OE queries (focused queries return sharper citations than combined ones).

- **DD1 — CAC ≥1000 / primary-prevention <55 mg/dL (resolved by Bundle 2 Claim 12 / Row 36).** Bundle 2 returned both COR 1 (CAC ≥1000) and COR 2a (CAC 300–999) thresholds without a separate query.
- **DD2 — ESC/EAS comparator (resolved by Bundle 3 Claims 5 + 6 + `fegers-wustrow-jacc-2022`).** OE cited the canonical JACC comparator paper directly; no separate query needed. The 2019 ESC/EAS primary citation (`esc-eas-2019`) remains pre-staged but optional unless module text needs the primary ESC/EAS source.
- **DD3 — Non-VHR ASCVD COR 2a tighter LDL goal (open).** OE's Bundle 3 Claim 1 response truncated mid-quote at "*the guideline provides a COR 2a recommendation to treat non-VHR ASCVD patients to the tighter [truncated]*". Likely <55 mg/dL based on Ez-PAVE (Row 32) + the VESALIUS-CV future-state signal (Row 40), but the numeric must be confirmed before Phase 2 JSON rewrite. **Recommended approach:** include a focused single-claim query in the Bundle 4 OE submission OR run as a separate fast follow-up query before Phase 2. Suggested phrasing: *"In the 2026 ACC/AHA Dyslipidemia Guideline, what is the COR 2a sub-recommendation for non-very-high-risk ASCVD secondary prevention LDL-C goal? My current understanding is that the standard goal is <70 mg/dL, but I've seen reference to a COR 2a recommendation to treat to a tighter goal — what is the specific numeric, and what is the rationale (e.g., Ez-PAVE-driven, VESALIUS-CV future-state, etc.)?"*

---

## Scott Hines QI ask — "what's new" surface

Scope decision (locked in plan `~/.claude/plans/i-d-like-to-focus-cozy-cake.md`): merge the 2023–2024 substance into the standard module; add a new in-module FAQ topic `whats-new-2023-2024` with 4–5 items mirroring Scott Freiberg's PDF structure. Each item is short (1–2 sentences on what changed + 1 sentence pointing to the deep clinical FAQ that covers full detail). Reuses the module's `references[]` and `[ref:X]` markers — no duplicate clinical content.

**Anticipated FAQ items (refine after bundles confirm framing):**

1. **PREVENT replaces PCE as primary risk estimator.** Deep-link → `risk-tier`.
2. **<55 mg/dL LDL target for very high-risk secondary prevention.** Deep-link → `ldl-target` and `very-high-risk`.
3. **Non-HDL-C and apolipoprotein B are co-primary treatment targets alongside LDL-C.** Deep-link → new `co-primary-targets` topic.
4. **Sequencing flexibility for nonstatin add-ons (ezetimibe vs bempedoic acid vs PCSK9 mAb — 2026 removes ezetimibe-must-precede-PCSK9 requirement). Bempedoic acid CV-outcome reduction in CLEAR Outcomes (statin-intolerant population). Inclisiran is second-line to PCSK9 mAbs.** Deep-link → `not-at-goal`.
5. **Locked post-Bundle 5: Icosapent ethyl COR 2b for non-VHR ASCVD or DM + ≥1 risk factor with TG 150–499 (REDUCE-IT 25% RRR MACE; mineral oil placebo controversy = rationale for lower COR).** Deep-link → new escalation-options FAQ. _Bundle 5 finding (Row 65) makes this the highest-yield 5th item — IPE adds a new pharmacologic class (high-purity EPA) that isn't in v1.0.0 and significantly broadens the prescriber's toolkit._

PPTX export of this single FAQ topic is the artifact for Scott Hines' QI ask — generated via the existing `generatePptx.ts` exporter, no new code needed.

---

## Section 8 simplification-pass checklist (2026-05-26 stamp)

Process checklist from the standards PDF — one-time stamp for this commit, not an ongoing tracker.

- [x] **Step 1 — Read and inventory.** Readability DOCX (`lipid-management-revised.docx`) extracted via mammoth; confirmed all 16 topics present (no clinical content dropped); identified that the DOCX carried **zero inline `[ref:slug]` markers** (readability rewrite stripped all 223) and a narrower 34-ref bibliography (verified subset of the 66-ref superset).
- [x] **Step 2 — Surface layer.** 4 checklist items + 5 escalations taken from the DOCX (reworded, IDs stable). Green-zone narrative + label from DOCX; `.lipidreview` SmartPhrase trigger preserved. Context section folds Text + SUPD note + Pipeline note (the canonical parser only keeps Label/Text, so the two notes were folded into `context_strip.text` to avoid loss). Footer rewritten to advisory + jurisdiction; version stamp bumped to **v1.3.0 (2026-05-26)**.
- [x] **Step 3 — Detail layer, first-layer FAQ.** Each topic's `first_layer_html` uses table / bullets / prose / callout per Section 3. Single-cell `<em>` callout tables converted to `<div class="cm-callout">`. Multi-column tables preserved as `<table>` (production DOCX-import-faithful).
- [x] **Step 4 — Detail layer, sub-questions.** 45 sub-questions across 16 topics, each a first-person provider question (pregnancy-vs-lactation is first-layer-only by design).
- [x] **Step 5 — Citation re-injection (lipid-specific).** 164 inline `[ref:slug]` markers (57 unique refs) hand-re-injected claim-by-claim from the 1.1.0 prose via 115 auditable anchor rules; every anchor matched exactly once; **0 undeclared markers**. References preserved at the 66-entry superset via merge.
- [x] **Step 6 — SmartPhrases.** Module-level `smartphrases[]` populated from `lipid-smartphrases.pdf` (1 confirmed `.lipidreview` + 7 future `.LIPLIPID-*`). Per Noah's instruction the 7 future phrases carry **full text** (not description-only) so they render expandable/copyable in the selector's "Future" section. FAQ `smartphrase_note` pills added to the 7 anchor topics; all resolve to the registry.
- [x] **Final review.** `tsc -b` + `npm run build` clean. No template artifacts (`>>>`, box-drawing separators). All 16 topics have first-layer + (where applicable) sub-questions.

**8 orphaned refs** (cited inline in 1.1.0, no home in the readability-trimmed prose; all remain in the bibliography):
`lee-nejm-2026` (Ez-PAVE — the head-to-head <55-vs-<70 RCT; **most notable loss** — the readability pass dropped the Ez-PAVE evidentiary basis for the <55 target from `ldl-target`), `cho-jacc-2025` / `murphy-jacc-adv-2025` / `au-jamano-2026` (PREVENT MESA/diverse-cohort validation set — dropped from `risk-tier`), `albers-jacc-2013` / `tsimikas-jacc-2017` (niacin/Lp(a) — dropped from `co-primary-targets`), `sajja-jamano-2021` (Friedewald-accuracy-as-TG-rises specifics — dropped from `co-primary-targets`), `santos-ldne-2025` (FH review pointer — dropped from `fh-management`).

## Cross-references (simplification pass)

- Standards PDF: `/home/noahs/incoming_noah/meridian-module-simplification-standards.pdf`
- Readability DOCX: `/home/noahs/incoming_noah/lipid-management-revised.docx`
- SmartPhrase spec PDF: `/home/noahs/incoming_noah/lipid-smartphrases.pdf`
- Build scripts: `/tmp/build_lipid_v13.py`, `/tmp/inject_lipid_refs.py`, `/tmp/add_lipid_smartphrases.py`

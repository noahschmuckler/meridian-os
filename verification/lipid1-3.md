# Lipid Verification — Raw OE Responses (Bundles 1–3)

Verbatim OpenEvidence responses for Bundle 1 (Risk stratification — PREVENT vs PCE), Bundle 2 (Very High Risk + <55 target), and Bundle 3 (Co-primary targets — non-HDL / ApoB / Lp(a)). Tracker rows + reference staging are extracted from this content into `verification/lipids.md`.

---

## Bundle 1 — Risk stratification: PREVENT vs PCE

OE response received 2026-05-04. Pasted verbatim below (mojibake from OE's copy-paste preserved as-received).

> This is a comprehensive review. Critically, the 2026 ACC/AHA Dyslipidemia Guideline (published March 2026) has substantially changed the risk thresholds and framework since the claims were written, making several of them outdated. Below is a claim-by-claim analysis.

**Claim 1: PREVENT formally replaces the PCE as the primary ASCVD risk estimator for ages 30–79.**

Partially supported but requires updating. At the time the claim was written (referencing Khan et al., Circulation 2024), PREVENT had not yet been formally recommended to replace the PCE — the AHA scientific statement stated only that "the risk assessed by PREVENT may be implemented in the existing ACC/AHA prevention guideline framework".[1][2] However, the 2026 ACC/AHA Dyslipidemia Guideline (March 2026) now formally recommends the PREVENT-ASCVD equations as the primary risk estimator, replacing the PCE.[3][4] The 2025 ACC/AHA Blood Pressure Guideline also recommends PREVENT.[5] The 2026 VA/DoD Lipid CPG similarly endorses PREVENT as first-line.[6] So the claim is now correct in substance but should cite the 2026 guideline, not the 2023/2024 PREVENT publication, as the authoritative source of the "formal replacement."

PCP action: Use the PREVENT-ASCVD calculator (not the total CVD or HF versions) for statin decision-making. EHR integration is forthcoming; the AHA online calculator is available now.[7]

**Claim 2: PREVENT incorporates eGFR and metabolic risk factors (BMI, HbA1c, UACR) directly into the risk score.**

Partially incorrect. The base PREVENT-ASCVD model includes eGFR as a core predictor. HbA1c and UACR are optional add-on variables, not part of the base model — they are used when clinically indicated (e.g., in patients with CKD or diabetes).[8][2][3] BMI is not included in the PREVENT-ASCVD equation at all — it is only included in the PREVENT-HF (heart failure) equation.[3][9] The base PREVENT-ASCVD predictors are: age, sex, total cholesterol, HDL-C, SBP, eGFR, diabetes status, smoking, statin use, and antihypertensive use.[3]

Correction: The claim should state that PREVENT-ASCVD incorporates eGFR as a core variable and offers optional add-on models for HbA1c and UACR. BMI should be removed from the claim as it pertains only to the HF-specific equation.

**Claim 3: PREVENT removes race; PCE was known to overestimate risk in Black patients and underestimate in some Asian populations.**

Supported with nuance. PREVENT is race-free.[8][10] The PCE did systematically overestimate risk broadly, including in Black patients — the largest absolute difference in risk estimates between PCE and PREVENT was observed in Black adults (10.9% vs 5.1%).[11] The PCE also had limited applicability to Asian and Hispanic populations due to underrepresentation in derivation cohorts.[11] However, the parenthetical "(erythromycin)" in the claim appears to be a typographical error and should be removed. The characterization of PCE as "overestimating in Black patients" is supported, though the mechanism is general PCE miscalibration in contemporary populations rather than race-specific bias per se.[11]

**Claim 4: PREVENT estimates 10-year and 30-year risk for combined ASCVD and heart failure outcomes.**

Supported but requires clarification for clinical use. PREVENT does provide separate equations for ASCVD, HF, and total CVD (ASCVD + HF), as well as 10-year and 30-year horizons.[8][2] However, the 2026 ACC/AHA Dyslipidemia Guideline explicitly directs clinicians to use the PREVENT-ASCVD equation (not the total CVD composite) for statin decisions.[3][7] The total CVD equation is relevant for blood pressure management decisions per the 2025 BP guideline.[5] The claim as written could mislead a PCP into using the broader composite for lipid management.

PCP action: For statin decisions, use PREVENT-ASCVD specifically. The total CVD composite is for BP treatment thresholds.

**Claim 5: The four risk tiers are Low <5%, Borderline 5–7.5%, Intermediate 7.5–20%, High >20%.**

Outdated — this is now incorrect. These were the 2018/2019 ACC/AHA thresholds calibrated to the PCE.[12][13] The 2026 ACC/AHA Dyslipidemia Guideline has recalibrated the tiers for use with PREVENT-ASCVD:[3][4]

- Low: <3%
- Borderline: 3% to <5%
- Intermediate: 5% to <10%
- High: ≥10%

The rationale: PREVENT-ASCVD estimates are approximately 40–50% lower than PCE for the same risk factor profile, so thresholds were lowered to identify similar patient populations.[3] Using the old PCE thresholds with PREVENT would substantially under-treat.

PCP action: Update the decision-support tool immediately to the new thresholds. This is the single most operationally critical correction.

**Claim 6: PREVENT produces lower numbers than PCE, but tier thresholds were designed to be roughly equivalent in clinical action.**

Now supported by the 2026 guideline, but was NOT true before March 2026. Prior to the 2026 guideline, PREVENT was being applied to the old PCE thresholds, which would have reduced statin-eligible patients by ~14–17 million.[1][11] The 2026 guideline explicitly performed a "crosswalk" analysis and lowered thresholds so that PCE ≥5% and PREVENT-ASCVD ≥3% identify approximately the same number of adults (~25–26 million).[3] The claim's spirit is now correct under the 2026 framework, but the tool must use the new thresholds for this equivalence to hold.

**Claim 7: For intermediate-risk patients (7.5–19.9%) with LDL-C ≥70, moderate-to-high intensity statin is recommended after risk discussion.**

Outdated thresholds; substance partially correct. Under the 2026 guideline, intermediate risk is now 5% to <10% (not 7.5–19.9%).[3] For intermediate-risk patients, at least moderate-intensity statin therapy is reasonable, with consideration of high-intensity statin to lower LDL-C by ≥50%.[3] The LDL-C ≥70 mg/dL threshold for considering statin therapy in the primary prevention risk-based pathway remains consistent.[13][3] The 2026 guideline also introduces an LDL-C treatment goal of <100 mg/dL for borderline and intermediate-risk patients initiated on statins.[3]

Correction: Update the intermediate-risk range to 5% to <10% per PREVENT-ASCVD thresholds.

**Claim 8: Risk-enhancing factors for borderline-risk patients include the listed items.**

Mostly supported but requires updating. The 2018 guideline list and the 2026 guideline list overlap substantially.[13][3] The 2026 guideline retains: family history of premature ASCVD, persistently elevated LDL-C ≥160 mg/dL, chronic inflammatory conditions, reproductive risk markers (preeclampsia, premature menopause), South Asian ancestry, hs-CRP ≥2 mg/L, elevated Lp(a), and elevated triglycerides.[3] Key updates in the 2026 guideline:[3][7]

- CKD is now subsumed under the broader term "CKM syndrome" (cardiovascular-kidney-metabolic syndrome)
- Filipino ancestry is added alongside South Asian ancestry as higher-risk
- Metabolic syndrome as a standalone term is replaced by CKM syndrome
- ABI <0.9 is no longer explicitly listed as a risk enhancer in the 2026 table (though subclinical atherosclerosis is addressed separately via CAC)
- Polygenic risk score is added as a new risk enhancer (if measured)
- Reproductive risk markers are expanded to include gestational diabetes, gestational hypertension, preterm delivery, and early menarche[7][4]
- ApoB threshold is listed as ≥120 mg/dL (the claim listed "elevated ApoB" without a threshold; the 2018 guideline used ≥130 mg/dL)[3]

PCP action: Update the risk-enhancer checklist to the 2026 version. Add Filipino ancestry, CKM syndrome, and expanded reproductive markers.

**Claim 9: The 30-year PREVENT risk estimate is for younger intermediate-risk patients where 10-year risk is low — useful for shared decision-making but not a primary statin-initiation trigger.**

Partially outdated. The 2026 guideline goes further than the claim suggests. For adults aged 30–59 with low 10-year risk (<3%) but 30-year ASCVD risk ≥10%, the guideline states it is reasonable to initiate a moderate-intensity statin (Class 2a) to reduce cumulative atherogenic lipoprotein exposure.[3][4] This makes the 30-year risk estimate a legitimate statin-initiation trigger in younger adults, not merely a counseling tool.

Correction: The 30-year risk ≥10% threshold is now a Class 2a recommendation for statin initiation in adults with low 10-year risk, not just a shared decision-making aid.[4]

**Claim 10: PREVENT is calibrated for ages 30–79; for <30 or >79, use clinical judgment plus risk-enhancing factors.**

Supported. PREVENT was derived and validated in adults 30–79 years.[8][3] The 2026 guideline states that for young adults ages 18–29, LLT use is "a matter of clinical judgment and patient preference in the absence of available evidence".[3] For adults >79, the guideline addresses older adults separately with considerations for competing comorbidities and life expectancy rather than numerical risk estimation.

**Claim 11: Race-removal in PREVENT is endorsed by the 2023 AHA scientific statement; concerns about loss of discrimination are an open methodological discussion, not a reason to revert to PCE.**

Supported. The AHA scientific statement accompanying PREVENT endorsed the race-free approach.[2] Recent validation studies in diverse populations (including MESA) confirm that PREVENT-ASCVD provides more accurate calibration than PCE across racial/ethnic groups.[14][15] However, concerns persist: PREVENT was validated with <3% Asian/NHPI representation, and the disproportionate impact of reclassification on Black adults (who would lose treatment eligibility at higher rates) remains an active equity concern.[15][1] The 2026 guideline's threshold recalibration (≥3%) was designed in part to mitigate this disparity.[3]

**Claim 12: An intermediate-risk patient reclassified to lower risk on PREVENT should not be automatically de-escalated off statin therapy; reclassification is a basis for shared decision-making.**

Supported. The VA/DoD 2026 CPG explicitly states that "the decision to discontinue such therapy based on a new or different risk assessment would ultimately fall to the provider, with consideration from the patient".[6] The 2026 ACC/AHA guideline's threshold recalibration was specifically designed to avoid wholesale de-escalation.[3] Anderson et al. noted that ~4 million adults currently taking statins would no longer meet criteria under PREVENT with old thresholds, highlighting the clinical challenge of deimplementation.[11] With the new ≥3% threshold, this gap narrows substantially.

PCP action: Do not stop statins based solely on a lower PREVENT score. Engage in shared decision-making, consider risk enhancers and CAC if available, and document the rationale.

**OE end-of-bundle offer:** *"Would you like to explore how the 2026 guideline's new LDL-C treatment goals (<100 mg/dL for primary prevention) and the upgraded role of CAC scoring (now Class 1 for intermediate-risk patients) should be integrated into the decision-support tool?"* → Tracker row 22 already captures the CAC-treatment-goals deep-dive (DD1) post-Bundle 4. The <100 primary-prevention goal is captured directly in tracker row 26 (does not need DD2 — clear from text).

**OE references (Bundle 1):**

1. Diao JA, Shi I, Murthy VL, et al. Projected Changes in Statin and Antihypertensive Therapy Eligibility With the AHA PREVENT Cardiovascular Risk Equations. *JAMA*. 2024;332(12):989-1000. doi:10.1001/jama.2024.12537.
2. Khan SS, Coresh J, Pencina MJ, et al. Novel Prediction Equations for Absolute Risk Assessment of Total Cardiovascular Disease Incorporating Cardiovascular-Kidney-Metabolic Health: A Scientific Statement From the American Heart Association. *Circulation*. 2023;148(24):1982-2004. doi:10.1161/CIR.0000000000001191.
3. Blumenthal RS, Morris PB, Gaudino M, et al. 2026 ACC/AHA/AACVPR/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Dyslipidemia. *J Am Coll Cardiol*. 2026;:S0735-1097(25)10254-4. doi:10.1016/j.jacc.2025.11.016.
4. Writing Committee Members, Blumenthal RS, Morris PB, et al. 2026 ACC/AHA Multisociety Guideline on the Management of Dyslipidemia. *Circulation*. 2026. doi:10.1161/CIR.0000000000001423.
5. Jones DW, Ferdinand KC, Taler SJ, et al. 2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults. *J Am Coll Cardiol*. 2025;86(18):1567-1678. doi:10.1016/j.jacc.2025.05.007.
6. Heidenreich P, Spacek L, Gregor N, et al. Clinical Practice Guideline on Lipid Management for Cardiovascular Disease Risk Reduction. Department of Veterans Affairs. 2026.
7. Abbasi J. What to Know About the New Lipid Guidelines. *JAMA*. 2026. doi:10.1001/jama.2026.3968.
8. Khan SS, Matsushita K, Sang Y, et al. Development and Validation of the American Heart Association's PREVENT Equations. *Circulation*. 2024;149(6):430-449. doi:10.1161/CIRCULATIONAHA.123.067626.
9. Krishnan V, Huang X, Zhang S, et al. Age and Sex-Specific Percentiles of 30-Year Cardiovascular Disease Risk Based on the PREVENT Equations. *J Am Coll Cardiol*. 2025;86(21):2017-2027. doi:10.1016/j.jacc.2025.09.1509.
10. Cho SMJ, Levin M, Chen R, et al. AHA PREVENT Equations and Cardiovascular Disease Risk in Diverse Health Care Populations. *J Am Coll Cardiol*. 2025;86(3):181-192. doi:10.1016/j.jacc.2025.04.066.
11. Anderson TS, Wilson LM, Sussman JB. Atherosclerotic Cardiovascular Disease Risk Estimates Using the Predicting Risk of Cardiovascular Disease Events Equations. *JAMA Internal Medicine*. 2024;184(8):963-970. doi:10.1001/jamainternmed.2024.1302.
12. Michos ED, McEvoy JW, Blumenthal RS. Lipid Management for the Prevention of Atherosclerotic Cardiovascular Disease. *NEJM*. 2019;381(16):1557-1567. doi:10.1056/NEJMra1806939.
13. Grundy SM, Stone NJ, Bailey AL, et al. 2018 AHA/ACC/AACVPR/AAPA/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Blood Cholesterol: Executive Summary. *J Am Coll Cardiol*. 2019;73(24):3168-3209. doi:10.1016/j.jacc.2018.11.002.
14. Murphy BS, Hershey MS, Huang S, et al. PREVENT Risk Score vs the Pooled Cohort Equations in MESA. *JACC Advances*. 2025;4(6 Pt 1):101825. doi:10.1016/j.jacadv.2025.101825.
15. Au M, Zhang Y, Zhou MM, et al. PREVENT Equation Performance in Asian and Native Hawaiian and Other Pacific Islander Groups. *JAMA Network Open*. 2026;9(2):e2556915. doi:10.1001/jamanetworkopen.2025.56915.

---

## Bundle 2 — Very High Risk: definition and <55 mg/dL target

OE response received 2026-05-04. Pasted verbatim below (mojibake from OE's copy-paste preserved as-received).

> I'll systematically verify these claims against current evidence and guidelines. Let me search across multiple domains.
>
> Now let me search for the remaining claims about CAC thresholds, ApoB goals, FOURIER/ODYSSEY median LDL-C values, the hypertension modifier, PREVENT risk categories, and monitoring recommendations.
>
> Now let me search for the specific ApoB numeric goals and the 2026 guideline's VHR definition details regarding CKD and "hypertension" vs "poorly controlled hypertension."
>
> I now have comprehensive evidence to verify all claims. Here is the detailed analysis:

**Claim 1: VHR Definition (≥2 major ASCVD events OR 1 major event + high-risk conditions)**

Supported with one correction. The 2022 ACC ECDP defines VHR as ≥2 major ASCVD events OR 1 major ASCVD event and "multiple" high-risk conditions.[1] The 2023 CCD Guideline specifies this as ≥2 high-risk conditions.[2] The 2026 ACC/AHA Dyslipidemia Guideline similarly defines VHR as ≥2 major ASCVD events or 1 major event and ≥2 high-risk features.[3][4] The claim states "≥1 high-risk condition," which is incorrect — the threshold is ≥2 high-risk conditions in all three documents. The major ASCVD events listed (recent ACS within 12 months, prior MI, ischemic stroke, symptomatic PAD with ABI <0.85 or prior revascularization/amputation) are accurately stated.[1][3]

PCP action: Update the decision-support tool to require ≥2 (not ≥1) high-risk conditions when combined with a single major ASCVD event.

**Claim 2: High-Risk Conditions List**

Mostly supported with important nuances. The 2022 ACC ECDP and 2023 CCD Guideline list all nine conditions as stated: age ≥65, HeFH, prior CABG/PCI outside the index event, diabetes, hypertension, CKD (eGFR 15–59), current smoking, persistent LDL-C ≥100 despite maximally tolerated statin + ezetimibe, and history of CHF.[1][2]

Critical difference in the 2026 guideline: The 2026 ACC/AHA Dyslipidemia Guideline's VHR definition in Section 2.1 omits CKD from the high-risk features list. The 2026 definition lists: age ≥65, coronary bypass or PCI, current smoker, diabetes, history of HF, hypertension, and LDL-C ≥100 despite maximally tolerated statin + ezetimibe.[3][4] This is a notable change from the 2022 ECDP and 2018/2023 framework. CKD remains addressed separately in Section 4.2.8 with its own treatment recommendations, but it is no longer explicitly listed as a VHR high-risk feature in the 2026 definitions section.[4]

PCP action: If building the tool against the 2026 guideline specifically, note that CKD is no longer in the VHR high-risk features list. However, CKD patients with ASCVD still receive aggressive LDL-C goals (<55 mg/dL) via the CKD-specific pathway.[4] The tool should flag this discrepancy and route CKD + ASCVD patients to the appropriate treatment goal regardless.

**Claim 3: "Hypertension" Without a Control-Status Modifier**

Supported. Both the 2022 ACC ECDP and the 2026 ACC/AHA Guideline list "hypertension" without specifying "poorly controlled" or any control-status qualifier.[1][3][4] The 2018 AHA/ACC Cholesterol Guideline (from which this list originates) also used "hypertension" without a modifier. The claim that the older "poorly controlled hypertension" framing has been dropped is accurate — that language appeared in some earlier expert consensus documents but was not carried forward into the 2018 or subsequent guideline iterations.

**Claim 4: LDL-C Goal <55 mg/dL for VHR (Class 1)**

Supported. The 2026 ACC/AHA Guideline Recommendation #4 for secondary prevention states: "In adults with clinical ASCVD who are at very high risk, high-intensity statin therapy should be initiated to achieve a ≥50% reduction in LDL-C and a goal LDL-C <55 mg/dL (1.4 mmol/L) and non–HDL-C <85 mg/dL" — COR 1, LOE A.[4] This is now further supported by the Ez-PAVE trial (NEJM 2026), which directly demonstrated that targeting <55 mg/dL vs. <70 mg/dL reduced 3-year major CV events (HR 0.67, 95% CI 0.52–0.86).[5]

**Claim 5: Non-HDL-C Goal <85 mg/dL as Co-Primary Target**

Supported. The 2026 guideline consistently pairs LDL-C <55 mg/dL with non-HDL-C <85 mg/dL for VHR patients across all secondary prevention recommendations.[4] Non-HDL-C is presented as a co-primary target alongside LDL-C, not a secondary marker.[4]

**Claim 6: ApoB Goal <65 mg/dL as Confirmatory/Residual-Risk Target**

Requires correction. The 2026 ACC/AHA Guideline does not specify a universal ApoB numeric goal of <65 mg/dL for VHR patients. The guideline's ApoB recommendation (COR 2a, LOE B-NR) states that ApoB measurement is reasonable "to guide decisions regarding further therapeutic intensification once LDL-C and/or non-HDL-C goals are achieved," particularly in those with ASCVD, CKM syndrome, type 2 diabetes, and/or elevated TG.[4] The only specific ApoB numeric target mentioned in the 2026 guideline is <55 mg/dL — and this appears only in the context of severe hypercholesterolemia with ASCVD (Section 4.2.4.3), not as a general VHR secondary prevention target.[4][3] The claim's stated goal of <65 mg/dL does not appear in the 2026 guideline text. The ESC/EAS 2019 guidelines use apoB <65 mg/dL for very high risk and <80 mg/dL for high risk, which may be the source of confusion.

PCP action: The 2026 ACC/AHA guideline does not provide a specific ApoB numeric threshold for general VHR secondary prevention. ApoB is positioned as a residual-risk assessment tool once LDL-C and non-HDL-C goals are met (COR 2a), not as a primary treatment trigger. If a numeric target is needed for the tool, note that the only ACC/AHA-specified target is <55 mg/dL in the severe hypercholesterolemia + ASCVD context, while the ESC/EAS target of <65 mg/dL applies to their "very high risk" category.[3]

**Claim 7: Trial Evidence Supporting <55 mg/dL (IMPROVE-IT, FOURIER, ODYSSEY OUTCOMES)**

Supported. The 2026 guideline explicitly cites these three trials as the evidence base for the <55 mg/dL target.[3][4] IMPROVE-IT demonstrated benefit of ezetimibe + simvastatin in post-ACS patients (2% ARR over 6 years, greater in those with ≥3 risk indicators).[4] FOURIER demonstrated evolocumab benefit in stable ASCVD (1.5% ARR, median 2.2 years).[4][2] ODYSSEY OUTCOMES demonstrated alirocumab benefit in post-ACS (1.6% ARR, median 2.8 years).[4][2] The claim that ODYSSEY OUTCOMES showed reduced total mortality is accurate — alirocumab was associated with a reduction in all-cause mortality (HR 0.85, nominal p=0.026), though this was a secondary endpoint.[2]

**Claim 8: Achieved LDL-C Levels and Safety at Very Low LDL-C**

Partially supported — needs correction on the ODYSSEY median. The 2026 guideline states on-treatment LDL-C was 30 mg/dL with evolocumab and 40 mg/dL with alirocumab.[3][4] The claim states "~53 mg/dL" for ODYSSEY OUTCOMES, which is incorrect — 53 mg/dL was the on-treatment LDL-C in IMPROVE-IT (ezetimibe arm), not ODYSSEY OUTCOMES.[3] The median achieved LDL-C in ODYSSEY OUTCOMES was approximately 40 mg/dL (with a mean of ~48 mg/dL at various time points).[6]

Regarding safety: No signal of harm at very low LDL-C is well-supported. The FOURIER secondary analysis found no increase in adverse events even in patients achieving LDL-C <0.5 mmol/L (~19 mg/dL).[7] The EBBINGHAUS substudy showed no neurocognitive impairment.[8][6] FOURIER-OLE (8-year follow-up, median LDL-C 30 mg/dL) showed no increase in muscle-related events, new-onset diabetes, or neurocognitive events.[3] No excess hemorrhagic stroke was observed with PCSK9 inhibitors.[6] A 2023 AHA Scientific Statement concluded no association between aggressive LDL-C lowering and dementia or cognitive impairment.[6]

PCP action: Correct the ODYSSEY OUTCOMES median LDL-C from ~53 to ~40 mg/dL.

**Claim 9: PCSK9 mAb Initiation Without Prior Ezetimibe Requirement**

Supported. The 2026 guideline explicitly states: "the revised recommendations no longer require that ezetimibe be added to statin therapy prior to initiating a PCSK9 mAb, and consideration of therapy may be based on degree of LDL-C required and patient preference".[3][4] For VHR, Recommendation #5 (COR 1, LOE A) states "ezetimibe and/or a PCSK9 mAb should be added".[4] However, the claim's stated threshold of "LDL-C ≥70 mg/dL" as the trigger for PCSK9 mAb consideration is not explicitly stated in the 2026 guideline for VHR patients. The 2026 guideline frames the trigger as failure to achieve the LDL-C goal of <55 mg/dL on maximally tolerated statin, with selection based on degree of lowering needed.[4]

PCP action: The trigger for nonstatin therapy in VHR is LDL-C ≥55 mg/dL (i.e., not at goal) on maximally tolerated statin, not a fixed ≥70 threshold. The ≥70 threshold applies to ASCVD patients not at very high risk.[4]

**Claim 10: Inclisiran and Bempedoic Acid (Class 2a)**

Supported with nuance. Both are COR 2a in the 2026 guideline for VHR.[4] However, the guideline positions them differently:

- Bempedoic acid (COR 2a, LOE B-R): Reasonable to add "with or without ezetimibe and/or PCSK9 mAb" — positioned as a general add-on, not limited to statin-intolerant patients in this context. The FDA label, however, carries the CVOT indication specifically for patients "unable to take recommended statin therapy".[4][9]
- Inclisiran (COR 2a, LOE B-R): Reasonable to add "in those unable to tolerate or obtain evolocumab or alirocumab or have a strong preference for less frequent dosing". This is more restrictive than the claim suggests — inclisiran is positioned as second-line to PCSK9 mAbs, pending CVOT results (ORION-4, VICTORION-2P).[4][3]

PCP action: Inclisiran is not a free alternative to PCSK9 mAbs per the 2026 guideline; it is specifically for those who cannot tolerate/obtain PCSK9 mAbs or strongly prefer twice-yearly dosing.

**Claim 11: Primary Prevention Risk Tiers and <100 mg/dL Goal**

Supported with correction on risk thresholds. The 2026 guideline uses PREVENT-ASCVD equations and tiers primary prevention as: Low (<3%), Borderline (3% to <5%), Intermediate (5% to <10%), and High (≥10%).[4][3] The LDL-C goal for borderline/intermediate risk when statin is initiated is <100 mg/dL (COR 2a).[4][3] For high risk (≥10%), the goal is <70 mg/dL (COR 2a).[4][3] The VHR concept indeed does not apply to standard primary prevention.

Note: The claim's risk thresholds are correct for the 2026 guideline. These differ from the 2018 PCE-based thresholds (which used 5–<7.5% borderline, 7.5–<20% intermediate, ≥20% high).

**Claim 12: CAC ≥1000 and LDL-C <55 mg/dL in Primary Prevention**

Supported, but the threshold is lower than claimed. The 2026 guideline introduces LDL-C <55 mg/dL for primary prevention patients with CAC ≥1000 (COR 1, LOE B-NR).[4][3] Additionally, for CAC ≥300–999, it is reasonable (COR 2a) to intensify therapy to achieve LDL-C <55 mg/dL.[4] The claim states "e.g., CAC ≥1000" which is accurate for the Class 1 recommendation, but the tool should also capture the COR 2a pathway for CAC ≥300.[4]

**Claim 13: Severe Hypercholesterolemia (LDL ≥190) Primary Prevention Goals**

Supported. The 2026 guideline stratifies severe hypercholesterolemia without ASCVD into tiers:[4]

- Without HeFH, subclinical atherosclerosis, or additional risk factors: LDL-C <100 mg/dL (COR 1)
- With HeFH, additional risk factors, or documented coronary calcification: LDL-C <70 mg/dL (COR 1)
- With clinical ASCVD: LDL-C <55 mg/dL (COR 1)

The claim that the goal is <100 mg/dL "unless an ASCVD event occurs or CAC ≥1000" is essentially correct, though the intermediate tier (<70 for those with HeFH/risk factors/CAC) should also be captured.[4]

**Claim 14: VHR Patients ≥75 and Shared Decision-Making**

Partially supported but oversimplified. The 2026 guideline does not provide age-specific VHR secondary prevention recommendations with explicit shared decision-making language for ≥75. The guideline removes the prior age ≤75 restriction on high-intensity statin initiation for secondary prevention.[3] For primary prevention after age 75, the guideline states LDL-C–lowering pharmacotherapy "can be considered in conjunction with lifestyle interventions".[4] The claim that "aggressive de-escalation in stable, function-preserving older adults is not recommended" aligns with the guideline's statement that "there is no signal to suggest that de-escalation of therapy is indicated for very low levels of achieved LDL-C".[3] However, the specific framing of shared decision-making for ≥75 VHR patients is not explicitly stated in the 2026 guideline's secondary prevention section — this is reasonable clinical practice but should not be attributed as a specific guideline recommendation.

**Claim 15: Updating LDL-C Goal From <70 to <55 After Qualifying VHR Event**

Supported. This follows logically from the guideline framework: patients who newly meet VHR criteria should have their target updated to <55 mg/dL.[4] The 2026 guideline's Recommendation #5 (COR 1) supports adding ezetimibe and/or PCSK9 mAb to achieve this goal.[4] The claim's threshold of "LDL-C remains ≥70" as a trigger for add-on therapy consideration is reasonable but, as noted above, the actual trigger is failure to achieve <55 mg/dL.

**Claim 16: Monitoring Frequency**

Partially supported — needs correction. The 2026 guideline recommends lipid profile 4–12 weeks after initiation or dose adjustment and every 6–12 months thereafter (COR 1, LOE A).[4] The claim states "annually with a fasting lipid panel," which is acceptable for stable patients at goal but understates the recommended frequency during titration. Additionally, the 2026 guideline notes that nonfasting lipid profiles suffice in most cases (fasting only needed for known hypertriglyceridemia).[4][3] The claim's requirement for "fasting" is overly restrictive per the 2026 guideline.

PCP action: Update to "lipid profile every 6–12 months (nonfasting acceptable unless hypertriglyceridemia present); 4–12 weeks after any therapy change."

**Claim 17: ApoB Measurement After Achieving LDL-C <55 (COR 2a)**

Supported. The 2026 guideline's ApoB recommendation (COR 2a, LOE B-NR) states measurement is reasonable "to guide decisions regarding further therapeutic intensification once LDL-C and/or non-HDL-C goals are achieved," particularly in those with ASCVD, CKM syndrome, type 2 diabetes, and/or elevated TG.[4] The claim's characterization of ApoB as a "secondary/residual-risk marker" is consistent with the guideline's positioning.[4]

**Additional Update to Flag:** The 2026 guideline writing committee has already signaled that future revisions will likely collapse the VHR vs. non-VHR distinction into a single <55 mg/dL pathway for all ASCVD patients, based on VESALIUS-CV results.[10] This may affect the tool's architecture in the near term.

**OE end-of-bundle offer:** *"Would you like to explore how the 2026 VA/DoD Lipid CPG or ESC/EAS 2019 guidelines differ from the 2026 ACC/AHA framework on any of these specific points, particularly around ApoB targets and the stepwise nonstatin therapy sequencing?"* → Captured as **DD2** candidate. Bundle 3 will own the ApoB / non-HDL / Lp(a) framework including ESC/EAS comparator; defer DD2 unless Bundle 3 leaves a gap.

**OE references (Bundle 2):**

1. Lloyd-Jones DM, Morris PB, Ballantyne CM, et al. 2022 ACC Expert Consensus Decision Pathway on the Role of Nonstatin Therapies for LDL-Cholesterol Lowering in the Management of Atherosclerotic Cardiovascular Disease Risk. *J Am Coll Cardiol*. 2022;80(14):1366-1418. doi:10.1016/j.jacc.2022.07.006.
2. Virani SS, Newby LK, Arnold SV, et al. 2023 AHA/ACC/ACCP/ASPC/NLA/PCNA Guideline for the Management of Patients With Chronic Coronary Disease. *J Am Coll Cardiol*. 2023;82(9):833-955. doi:10.1016/j.jacc.2023.04.003.
3. Writing Committee Members, Blumenthal RS, Morris PB, et al. 2026 ACC/AHA/AACVPR/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Dyslipidemia. *Circulation*. 2026. doi:10.1161/CIR.0000000000001423.
4. Blumenthal RS, Morris PB, Gaudino M, et al. 2026 ACC/AHA/AACVPR/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Dyslipidemia (JACC version). *J Am Coll Cardiol*. 2026;:S0735-1097(25)10254-4. doi:10.1016/j.jacc.2025.11.016.
5. Lee YJ, Lee SJ, Kim JW, et al. Intensive LDL Cholesterol Targeting in Atherosclerotic Cardiovascular Disease (Ez-PAVE). *N Engl J Med*. 2026. doi:10.1056/NEJMoa2600283.
6. Goldstein LB, Toth PP, Dearborn-Tomazos JL, et al. Aggressive LDL-C Lowering and the Brain: Impact on Risk for Dementia and Hemorrhagic Stroke: A Scientific Statement From the American Heart Association. *Arteriosclerosis, Thrombosis, and Vascular Biology*. 2023;43(10):e404-e442. doi:10.1161/ATV.0000000000000164.
7. Giugliano RP, Pedersen TR, Park JG, et al. Clinical Efficacy and Safety of Achieving Very Low LDL-cholesterol Concentrations With the PCSK9 Inhibitor Evolocumab: A Prespecified Secondary Analysis of the FOURIER Trial. *Lancet*. 2017;390(10106):1962-1971. doi:10.1016/S0140-6736(17)32290-0.
8. Rosenson RS, Hegele RA, Fazio S, Cannon CP. The Evolving Future of PCSK9 Inhibitors. *J Am Coll Cardiol*. 2018;72(3):314-329. doi:10.1016/j.jacc.2018.04.054.
9. FDA Orange Book — Approved Drug Products with Therapeutic Equivalence Evaluations.
10. Blumenthal RS, Morris PB, 2026 ACC/AHA Multisociety Guideline on the Management of Dyslipidemia Writing Committee. Clinical Guidelines as a Continuous Work in Progress: Moving at the Speed of Science. *Circulation*. 2026. doi:10.1161/CIR.0000000000001429.

---

## Bundle 3 — Co-primary targets: non-HDL-C, ApoB, Lp(a)

OE response received 2026-05-05. Pasted verbatim below (mojibake from OE's copy-paste preserved as-received; some bracketed reference numbers landed mid-sentence due to OE's truncation pattern, also preserved as-is).

> I'll systematically verify these claims against current evidence and guidelines. Let me search across multiple domains.
>
> This is a comprehensive verification. Below is a claim-by-claim analysis against the 2026 ACC/AHA Dyslipidemia Guideline and other referenced sources.

**Claim 1: Non-HDL-C as co-primary treatment target with per-tier goals**

**Verdict: Largely supported, with important nuances.** The 2026 ACC/AHA guideline does establish non-HDL-C goals alongside LDL-C across risk tiers (Section 4.2.3.7, 4.2.4.3, 4.2.6).[1] The per-tier goals stated in the claim are confirmed:

- **VHR ASCVD**: LDL-C [1]
- **Non-VHR ASCVD**: LDL-C [1]
- **High-risk primary prevention (PREVENT ≥10%)**: LDL-C [1]
- **Borderline/intermediate (PREVENT 3% to [1]
- **Severe primary hypercholesterolemia (LDL ≥190 without ASCVD/HeFH/risk factors)**: LDL-C [1]

**Pushback**: The claim says "co-primary" — the guideline's Top Take-Home Message #4 states "LDL-C and non-HDL-C treatment goals are back to guide LLT", which supports co-primary framing.[1] However, the guideline still emphasizes percentage LDL-C reduction as a priority for all individuals, with non-HDL-C as a parallel goal rather than a replacement. Additionally, the non-VHR ASCVD tier has a notable nuance: the guideline provides a COR 2a recommendation to treat non-VHR ASCVD patients to the tighter [1]

**Claim 2: Non-HDL-C calculation and what it captures**

**Verdict: Supported.** The 2026 guideline confirms non-HDL-C = TC − HDL-C, calculated at no additional cost from a standard lipid panel, and that it is a composite measure of cholesterol content of all atherogenic lipoproteins (Section 3.2, Recommendation-Specific Text #5).[1] The guideline explicitly states it "correlates well with levels of apoB" and "has less discordance with apoB compared with LDL-C".[1] The claim's enumeration of captured particles (LDL + VLDL + IDL + Lp(a) + chylomicron remnants) is consistent with the literature.[2]

**Minor nuance**: The claim states non-HDL-C requires no fasting. The guideline confirms fasting and nonfasting non-HDL-C have similar prognostic value, though fasting may be preferred in specific scenarios (TG ≥400, suspected genetic dyslipidemia).[1]

**Claim 3: Non-HDL-C reliability vs. Friedewald LDL-C at elevated TG**

**Verdict: Partially supported — the TG threshold for Friedewald inaccuracy needs correction.** The 2026 guideline states the Friedewald equation "is prone to inaccuracies as TG levels increase" and that it is not until TG ≥400 mg/dL that LDL-C is "no longer reported".[1] The guideline also notes that the Martin/Hopkins and Sampson/NIH equations outperform Friedewald "across widely varying TG levels (as low as ≥150 mg/dL)".[1]

**Correction needed**: The claim states Friedewald "becomes inaccurate at TG ≥150 mg/dL." This is an oversimplification. The guideline describes a gradient of inaccuracy — Friedewald accuracy degrades progressively as TG rises, with clinically meaningful inaccuracy beginning around TG ≥150 mg/dL (particularly at low LDL-C levels), but it does not become categorically "inaccurate" at that threshold.[1][3] The claim that it is "uninterpretable at TG ≥400" is supported — the guideline confirms LDL-C is no longer reported at TG ≥400.[1] The claim that non-HDL-C "remains valid across the full TG range" is supported.[1]

**Operational correction**: Rather than saying Friedewald is "inaccurate at TG ≥150," the tool should state that Friedewald accuracy degrades progressively with rising TG (especially at low LDL-C), and that the Martin/Hopkins or Sampson/NIH equations are now preferred (COR 1, LOE B-NR) over Friedewald for all patients.[4][1]

**Claim 4: ApoB measurement — COR 2a, residual-risk tool**

**Verdict: Supported.** The 2026 guideline gives ApoB measurement a **COR 2a, LOE B-NR** recommendation: "In adults on LLT, particularly those with ASCVD, CKM syndrome, type 2 diabetes, and/or elevated TG, measurement of apoB is reasonable to guide decisions regarding further therapeutic intensification once LDL-C and/or non-HDL-C goals are achieved" (Section 3.3).[1] The characterization as a residual-risk assessment tool rather than a primary treatment trigger is accurate.[1][5]

**Nuance**: The guideline also includes a COR 2b recommendation for ApoB in untreated adults to enhance risk assessment and characterize inherited lipid disorders, which the claim does not mention but is relevant for completeness.[1]

**Claim 5: No universal ApoB numeric target; only [1][4]** The guideline's ApoB section (Section 3.3) discusses ApoB as a tool for identifying residual risk and guiding intensification but does not specify universal numeric ApoB targets.[1]

**Correction**: The claim that the "only ACC/AHA-specified ApoB numeric target is [6]** The caution against cross-applying ESC/EAS numeric thresholds to the ACC/AHA framework is clinically sound — the two frameworks define risk categories differently (ESC uses SCORE for fatal CV events; ACC/AHA uses PREVENT for total ASCVD events).[7]

**Claim 7: ApoB ≥120 mg/dL as risk-enhancing factor (updated from 2018's ≥130)**

**Verdict: Supported.** The 2026 guideline's risk enhancer table lists "apoB ≥120 mg/dL" (alongside LDL-C persistently ≥160–189 and non-HDL-C ≥190–219).[1] The 2018 guideline listed apoB ≥130 mg/dL.[8] This confirms the threshold was lowered from ≥130 to ≥120 mg/dL. The claim's characterization that outside the risk-enhancer context, "elevated ApoB" means intensifying until LDL-C/non-HDL-C goals are met is consistent with the guideline's positioning of ApoB.[1]

**Claim 8: Lp(a) universal screening — COR 1**

**Verdict: Supported.** The 2026 guideline gives a **COR 1, LOE B-NR** recommendation: "In all adults, measurement of Lp(a) concentration is recommended at least once for ASCVD risk assessment" (Section 3.4).[1] This is indeed a major upgrade from the 2018 guideline, which classified elevated Lp(a) only as a risk-enhancing factor without a universal screening recommendation.[4][5]

**Claim 9: Lp(a) thresholds and unit conversion**

**Verdict: Mostly supported with corrections needed.** The 2026 guideline confirms:[4]

- ≥125 nmol/L (50 mg/dL): ~1.4-fold ASCVD risk (~80th percentile)
- ≥250 nmol/L (100 mg/dL): ~2-fold risk (~95th percentile)
- ≥430 nmol/L (180 mg/dL): ~4-fold risk (~99th percentile)

**Corrections**: (1) The claim cites a "very high" threshold of ≥175 nmol/L (≥80 mg/dL). The guideline's Table 4 does not use this specific threshold — it lists 75–124 nmol/L (1.2-fold), 125 nmol/L (1.4-fold), 250 nmol/L (2-fold), 350 nmol/L (3-fold), and 430 nmol/L (4-fold).[4] The guideline text does mention "80 to 100 mg/dL (~200–250 nmol/L) doubles the risk", which does not correspond to 175 nmol/L.[1] The 175 nmol/L threshold may derive from the EAS consensus statement but is not in the 2026 ACC/AHA guideline. (2) The claim states the conversion factor is "approximately 2.5." The guideline explicitly states "equivalence of levels between nmol/L and mg/dL is approximate" and that apo(a) isoform size variation affects mass-based assays, supporting the claim that conversion is imprecise.[4][1]

**Claim 10: Lab reporting — nmol/L vs. mg/dL**

**Verdict: Supported.** The 2026 guideline states it is "preferable to measure Lp(a) using assays that are calibrated in molar units (ie, nmol/L) and that are apo(a) isoform-insensitive" and that "laboratories should report the assay name and the units by which the assay is calibrated".[4][1] The guideline also notes that "it is difficult to compare results measured by different assays and laboratories".[4]

**Claim 11: Single Lp(a) measurement generally sufficient**

**Verdict: Supported with broader secondary causes than stated.** The 2026 guideline confirms "a single measurement is generally sufficient" because Lp(a) is "predominantly genetically determined and remain stable".[1] However, the claim lists only "nephrotic syndrome or estrogen therapy" as exceptions. The guideline lists broader secondary causes: "kidney, liver, or thyroid disease; pregnancy; menopause; and some medications. Inflammation may increase or decrease Lp(a)".[1] The claim should be expanded to include these additional secondary causes.

**Claim 12: Elevated Lp(a) supports earlier statin initiation; very high Lp(a) may justify tighter targets**

**Verdict: Partially supported — the claim overstates guideline specificity.** The 2026 guideline confirms Lp(a) ≥125 nmol/L is a risk enhancer that supports LLT initiation in borderline-risk patients (COR 2a).[1] The guideline states "an elevated Lp(a) favors initiating or intensifying LLT".[1]

**Pushback**: The claim that very high Lp(a) ≥250 nmol/L "may justify intensifying to a tighter LDL-C target (e.g., [1] The tool should frame this as clinical judgment rather than a guideline-specified recommendation.

**Claim 13: Effects of therapies on Lp(a)**

**Verdict: Mostly supported with corrections.** The 2026 guideline confirms statins "do not lower Lp(a) and may modestly increase Lp(a) in some individuals, although the average Lp(a) increase is generally small (mean absolute difference, 1.1 mg/dL higher compared with placebo)".[1] The claim's "approximately 10–15%" increase is an overstatement — the literature reports 8–24% increases, but the 2026 guideline characterizes the increase as "generally small."[9]

A comprehensive 2025 meta-analysis of 147 RCTs (145,314 subjects) found:[10]

- **Statins**: no significant effect on Lp(a)
- **PCSK9 mAbs**: 29% reduction
- **Inclisiran**: 22% reduction
- **Niacin**: 37% reduction

**Corrections**: (1) The claim states PCSK9 mAbs reduce Lp(a) "approximately 25–30%." The meta-analytic data shows evolocumab ~30–47% and alirocumab ~19–26%, with a pooled estimate of ~26% across agents.[10][11][12] The 25–30% range is reasonable but slightly imprecise. (2) The claim states inclisiran reduces Lp(a) "by a similar magnitude" to PCSK9 mAbs. The meta-analysis shows inclisiran at ~22%, which is modestly lower than PCSK9 mAbs at ~29%. (3) The characterization of niacin as "deprecated" is supported — AIM-HIGH and HPS2-THRIVE showed no cardiovascular benefit despite favorable lipoprotein changes.[10][13][14]

**Claim 14: No FDA-approved Lp(a)-specific therapy; investigational agents**

**Verdict: Supported.** No FDA-approved Lp(a)-specific therapy exists as of May 2026. The investigational agents and their Phase 3 trials are accurately described:[15][9]

- **Pelacarsen** (ASO): Lp(a)HORIZON trial (NCT04023552)
- **Olpasiran** (siRNA): OCEAN(a) trial
- **Lepodisiran** (siRNA): ALPACA trial

**Nuance**: The claim states these agents reduce Lp(a) "by 80–90% in Phase 2 trials." The literature reports maximum reductions of 80% for pelacarsen and up to 98% for olpasiran, zerlasiran, and lepodisiran.[15] The "80–90%" range understates the upper end for some agents. Additionally, the claim omits **muvalaplin** (oral small-molecule inhibitor, ~65% reduction) and **zerlasiran** (siRNA, up to 98%), which are also in development.[15]

**Claim 15: ApoB and Lp(a) insurance coverage and ordering**

**Verdict: Reasonable but not guideline-sourced.** This claim addresses practical billing/coverage matters that are not addressed in the 2026 ACC/AHA guideline. The assertion that both tests must be ordered specifically (not auto-included in standard panels) is accurate. Coverage details and out-of-pocket costs are variable by payer and region and cannot be verified from clinical guidelines. The diagnosis code examples (E78.5, Z83.42) are reasonable but should be verified against current payer policies.

**Claim 16: Discordance scenarios**

**Verdict: Supported.** The 2026 guideline confirms that clinically significant discordance between LDL-C and ApoB is "most common in individuals with cardiometabolic disease, including ASCVD, CKM syndrome, diabetes, and/or TG ≥150 mg/dL, although it may occur at lower TG levels".[1] The claim's list of discordance scenarios is consistent with the guideline.

**Minor correction**: The claim uses TG ≥175 mg/dL nonfasting as a discordance trigger. The guideline uses TG ≥150 mg/dL as the threshold for discordance concern, while the risk enhancer table uses TG ≥175 nonfasting / ≥150 fasting.[1] The claim conflates these two contexts.

**Claim 17: Residual risk algorithm (LDL-C → non-HDL-C → ApoB)**

**Verdict: Supported.** The stepwise approach — check non-HDL-C when LDL-C is at goal, then consider ApoB — is consistent with the guideline's positioning of non-HDL-C as a co-primary target and ApoB as a residual-risk tool.[1]

**Nuance on TG management**: The claim mentions fibrate or icosapent ethyl "for very elevated TG ≥500." The 2026 guideline addresses hypertriglyceridemia management separately, and icosapent ethyl (REDUCE-IT) is relevant for TG 135–499 with ASCVD or diabetes, not only ≥500.[1]

**Claim 18: Non-HDL-C preferred over ApoB for routine monitoring**

**Verdict: Supported.** The guideline's Top Take-Home Message #5 positions ApoB as useful "once LDL-C and non-HDL-C goals are met", and Section 3.2 emphasizes "strong support exists for routine reporting of non-HDL-C as part of a standard lipid profile".[1] Non-HDL-C is free with the standard panel; ApoB requires a separate order.

**Claim 19: PCSK9 mAb dual benefit for elevated Lp(a) patients**

**Verdict: Supported with important caveats.** The 2026 guideline confirms "PCSK9i (mAbs and small-interfering RNA) substantially lower LDL-C and apoB and lower Lp(a) by ~15% to 30%".[1] The claim correctly notes that using PCSK9 mAb solely for Lp(a) lowering in a patient already at LDL-C goal is an off-label rationale. The guideline states that in ASCVD patients with elevated Lp(a) who have not achieved LDL-C or apoB goals, "PCSK9i with proven cardiovascular benefit should be preferentially considered".[1]

**Claim 20: Operational PCP workflow**

**Verdict: Reasonable synthesis, not a direct guideline recommendation.** The workflow described (order Lp(a) once for all adults, document in problem list, add ApoB for patients on LLT with ASCVD/CKM/T2D/TG ≥175 once near goal) is a reasonable operationalization of the guideline recommendations.[1] The guideline supports measuring Lp(a) "with the first (or any) lipid profile" and ApoB "once LDL-C and/or non-HDL-C goals are achieved".[1]

**Correction**: The claim uses TG ≥175 as the ApoB trigger. The guideline's ApoB recommendation uses "elevated TG" without specifying 175 as the threshold; the ApoB section references TG ≥150 mg/dL.[1] The risk enhancer table uses ≥175 nonfasting.[1] The tool should use the guideline's language ("elevated TG") or specify the ApoB section's ≥150 threshold.

**Claim 21: FH diagnosis — ApoB not required; Lp(a) recommended**

**Verdict: Supported.** The 2026 guideline recommends genetic testing for FH (COR 2a) and clinical diagnostic criteria but does not list ApoB as a diagnostic criterion for FH.[1] The guideline does note that adults with severe hypercholesterolemia may have "LDL-C ≥190 mg/dL and/or apoB ≥140 mg/dL", but this is a population descriptor, not a diagnostic criterion.[1] Lp(a) cascade testing in FH families is supported by a COR 1 recommendation.[1] The guideline explicitly states "elevated Lp(a) is common in patients with FH; however, FH does not cause elevated Lp(a)".[1][4]

**OE end-of-bundle summary of corrections:** *"1. Non-VHR ASCVD has a two-tier goal structure (Figure 2…)"* — paragraph truncated by OE's copy-paste; full content preserved above per-claim. The Figures referenced at the bottom of the response (Sajja JAMA Network Open 2021 Fig 2; Sampson JAMA Cardiology 2020 Fig 4; Ellis JACC 2019 Fig 3; Trinder JACC 2020 Fig 3) are images we don't surface in the live module per user policy — the underlying citations are captured in references staging.

**OE references (Bundle 3):**

1. Blumenthal RS, Morris PB, Gaudino M, et al. 2026 ACC/AHA/AACVPR/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Dyslipidemia. *J Am Coll Cardiol*. 2026;:S0735-1097(25)10254-4. doi:10.1016/j.jacc.2025.11.016.
2. Raja V, Aguiar C, Alsayed N, et al. Non-HDL-Cholesterol in Dyslipidemia: Review of the State-of-the-Art Literature and Outlook. *Atherosclerosis*. 2023;383:117312. doi:10.1016/j.atherosclerosis.2023.117312.
3. Sajja A, Li HF, Spinelli KJ, et al. Discordance Between Standard Equations for Determination of LDL Cholesterol in Patients With Atherosclerosis. *J Am Coll Cardiol*. 2022;79(6):530-541. doi:10.1016/j.jacc.2021.11.042.
4. Writing Committee Members, Blumenthal RS, Morris PB, et al. 2026 ACC/AHA/AACVPR/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Dyslipidemia. *Circulation*. 2026. doi:10.1161/CIR.0000000000001423.
5. Abbasi J. What to Know About the New Lipid Guidelines. *JAMA*. 2026. doi:10.1001/jama.2026.3968.
6. Newman CB, Blaha MJ, Boord JB, et al. Lipid Management in Patients With Endocrine Disorders: An Endocrine Society Clinical Practice Guideline. *J Clin Endocrinol Metab*. 2020;105(12):dgaa674. doi:10.1210/clinem/dgaa674.
7. Fegers-Wustrow I, Gianos E, Halle M, Yang E. Comparison of American and European Guidelines for Primary Prevention of Cardiovascular Disease: JACC Guideline Comparison. *J Am Coll Cardiol*. 2022;79(13):1304-1313. doi:10.1016/j.jacc.2022.02.001.
8. Grundy SM, Stone NJ, Bailey AL, et al. 2018 AHA/ACC/AACVPR/AAPA/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Blood Cholesterol: Executive Summary. *J Am Coll Cardiol*. 2019;73(24):3168-3209. doi:10.1016/j.jacc.2018.11.002.
9. Malick WA, Goonewardena SN, Koenig W, Rosenson RS. Clinical Trial Design for Lipoprotein(a)-Lowering Therapies: JACC Focus Seminar 2/3. *J Am Coll Cardiol*. 2023;81(16):1633-1645. doi:10.1016/j.jacc.2023.02.033.
10. Xie S, Galimberti F, Olmastroni E, et al. Effect of Lipid-Lowering Therapies on Lipoprotein(a) Levels: A Comprehensive Meta-Analysis of Randomized Controlled Trials. *Atherosclerosis*. 2025;408:120420. doi:10.1016/j.atherosclerosis.2025.120420.
11. Qiao W, Feng Y, Wen Z, Dou L, Li Y. Effect of PCSK9 Inhibitors on Lipoprotein(a) Levels: An Umbrella Review of Meta-Analyses of Randomized Controlled Trials. *Drugs*. 2026;:10.1007/s40265-025-02274-x. doi:10.1007/s40265-025-02274-x.
12. Mulligan MD, Gandhi RS, Vishwakarma R, Bhattacharya R. Lipoprotein(a) Reduction With Inclisiran, Alirocumab, Evolocumab, Enlicitide, and Lerodalcibep: A Systematic Review and Meta-Analysis of Randomized Controlled Trials. *J Clin Lipidol*. 2026;:S1933-2874(26)00091-7. doi:10.1016/j.jacl.2026.03.019.
13. Albers JJ, Slee A, O'Brien KD, et al. Relationship of Apolipoproteins a-1 and B, and Lipoprotein(a) to Cardiovascular Outcomes: The AIM-HIGH Trial. *J Am Coll Cardiol*. 2013;62(17):1575-9. doi:10.1016/j.jacc.2013.06.051.
14. Tsimikas S. A Test in Context: Lipoprotein(a): Diagnosis, Prognosis, Controversies, and Emerging Therapies. *J Am Coll Cardiol*. 2017;69(6):692-711. doi:10.1016/j.jacc.2016.11.042.
15. Nordestgaard BG, Langsted A. Lipoprotein(a) and Cardiovascular Disease. *Lancet*. 2024;404(10459):1255-1264. doi:10.1016/S0140-6736(24)01308-4.

**Figures referenced at end of OE response (image-only — not surfaced in module per user policy):**
- Sajja A, et al. *JAMA Network Open*. 2021;4(10):e2128817 — LDL-C estimation method accuracy at <70 mg/dL.
- Sampson M, et al. *JAMA Cardiology*. 2020;5(5):540-548 — LDL-C calculation in normo/hypertriglyceridemia.
- Ellis KL, et al. *J Am Coll Cardiol*. 2019;73(9):1029-1039 — Kaplan-Meier survival in FH cascade testing with Lp(a).
- Trinder M, et al. *J Am Coll Cardiol*. 2020;75(21):2682-2693 — Ascertainment bias from elevated Lp(a) in FH.

These two new full-text citations (Sajja JAMA Network Open 2021, Sampson JAMA Cardiology 2020) are added to references staging in `lipids.md` for the Friedewald-vs-Martin/Hopkins-vs-Sampson framing (Bundle 3 Claim 3).

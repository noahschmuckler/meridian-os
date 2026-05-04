# Opiates Module — OpenEvidence Verification Tracker

Working document for evidence-reviewing the `opiates` module in `src/data/seed/clinical-modules.json` (lines 1308–1603) before finalization. Not read by the app. See plan at `~/.claude/plans/i-want-to-verify-jiggly-sky.md` for context. Modeled on `verification/benzos.md` (sibling module, same author) and `~/GitHub_Repos/meridian-server/modules/adhd-verification.md` (original ADHD pass that established the workflow).

**Workflow:** Run the meta-pass prompt first. Then run Bundle 1 (regulatory & MME pharmacology — the black-and-white facts) to calibrate prompt wording. Iterate if needed. Then run Bundles 2–8. Log each claim's verdict in the tracker table at the bottom. Once verdicts are captured, a follow-up coding session will rewrite the opiate module JSON with `references[]` and `[ref:X]` markers in the prose.

**Framing note:** All prompts ask for genuine pushback, not confirmation. If OE comes back "everything is correct," re-run with tighter wording — blanket confirmation usually means the prompt was too leading.

**Module under review:** Inherited adult patient on chronic opiate therapy. Goal: support the PCP at the first handoff visit so they can (a) safely continue, modify, or escalate without abrupt discontinuation, (b) document defensibly under the FDA black-box and CDC-2022 framework, and (c) recognize OUD and pivot to MOUD rather than termination when indicated.

---

## Meta-pass prompt (run first)

```
I'm finalizing a primary care decision-support module on managing adult
patients inherited on chronic opiate therapy. The content below was
drafted from general knowledge and has not been evidence-reviewed.

Please read it end-to-end and flag any statement that is: factually
inaccurate, outdated (pre-2022 guidance that has since changed), lacking
evidence support, controversial among specialists, or oversimplified in a
way that could mislead a primary care provider. For each flag, cite the
source and give the corrected framing.

Content:

LANDING:
A patient is transferring to your panel on a chronic opiate regimen.
This is one of the highest-anxiety handoffs in primary care — and one of
the most common. Your job at the first visit is not to solve the problem.
It is to establish the relationship, complete a structured assessment,
and determine whether you can continue, need to modify, or need to
escalate. Do not discontinue at the first visit without a safety plan in
place.

CHECKLIST (verify all four before deciding):
1. PDMP reviewed — single prescriber, single pharmacy, consistent
   quantities, no concurrent controlled substances of concern.
2. Controlled substance agreement on file or completed at this visit —
   patient understands monitoring expectations.
3. Urine drug screen obtained at intake — results reviewed and documented.
4. Current MME calculated — dose is documented and clinical rationale
   is present for doses above 50 MME/day.

GREEN ZONE (all four checked → continue with monitoring):
Reasonable basis to continue current regimen at this visit. Document
using SmartPhrase below (.OPIATES-CONT). Schedule follow-up at 90 days
or sooner if any concerns emerge. Monitoring is ongoing — this is not a
one-time clearance. You are institutionally supported.

ESCALATIONS (escalate if any apply):
1. Current dose ≥ 90 MME/day without documented pain management
   specialist involvement.
2. Concurrent benzodiazepine prescription — any dose, any indication.
3. UDS positive for non-prescribed controlled substance, or negative for
   prescribed opiate.
4. PDMP shows multiple prescribers, multiple pharmacies, or overlapping
   fills.
5. Repeated early refill requests, lost medications, or escalating
   contact between visits.
6. Any clinical concern for opioid use disorder — consider MOUD rather
   than taper or discontinuation.

FAQS:

[PDMP Review]

Q1: How is the opiate PDMP review different from stimulants?
A1: The stakes are higher and the patterns are more specific. For opiates
you are looking for: overlapping fills from any prescriber (suggests
double-doctoring), concurrent benzodiazepine prescriptions (this is your
most important safety flag — the combination dramatically increases
overdose mortality), fill frequency relative to days supply (filling a
30-day supply every 20 days is a pattern), and cash-pay fills which
bypass insurance tracking and may not appear on PDMP in all states.
New York requires PDMP review prior to every opiate prescription — not
just at intake.

Q2: I see a second prescriber in the PDMP. Is that automatically a
problem?
A2: Not automatically — but it requires an explanation you can document.
A patient seeing both a PCP and a pain management specialist may have
legitimate dual prescribing if it is coordinated. An ER prescription for
an acute injury is different from a pattern of monthly fills from two
separate primary care offices. Ask the patient directly, document what
they tell you, and contact the other prescriber if the answer is unclear.

Q3: What do I do if I find a concurrent benzo prescription?
A3: Do not prescribe the opiate at this visit without a safety plan. The
opiate-benzodiazepine combination is the leading driver of prescription
overdose mortality. This is not a reason to cut the patient off — it is
a reason to have a direct conversation, understand who is managing the
benzo, and develop a coordinated plan.

[Controlled Substance Agreement]

Q1: Do I need a new agreement if the prior provider had one on file?
A1: Yes. When you become the prescriber of record, a new agreement
should be completed. This is both a documentation standard and a clinical
moment — reviewing the agreement with the patient at the first visit
establishes expectations, gives you an opportunity to assess their
understanding, and signals that this is a managed relationship, not an
automatic continuation.

Q2: What should the agreement cover?
A2: At minimum: single prescriber and single pharmacy requirements,
agreement to UDS monitoring, no early refills policy, no replacement for
lost or stolen medications, expectations around dose changes (patient
does not self-adjust), and acknowledgment that the goal of therapy is
functional improvement, not pain elimination. SmartPhrase .CSAGREE
populates the standard institutional template.

Q3: The patient refuses to sign. What do I do?
A3: A patient who refuses to sign a CS agreement is communicating
something worth understanding before you respond. Ask why — occasionally
there is a literacy or language barrier, or a prior negative experience
with how the agreement was presented. If refusal is categorical and the
patient cannot articulate a reason, document the refusal and the
conversation. You are not obligated to prescribe without a signed
agreement, and the institutional framework supports that position.

[Urine Drug Screen]

Q1: What is the difference between a screening UDS and a confirmatory
test?
A1: The point-of-care immunoassay (the cup test) is a screen — it is
fast and useful but has meaningful false positive and false negative
rates. A positive screen for an unexpected substance, or a negative
screen for the prescribed opiate, should be confirmed with GC-MS or
LC-MS/MS before you act on it clinically or document it as a confirmed
finding. Do not discharge a patient based on a screen alone.

Q2: The UDS is negative for the prescribed opiate. What does that mean?
A2: Several possibilities: the patient did not take the medication as
prescribed (most concerning — suggests diversion or stockpiling), the
patient took it but timing of the dose relative to collection caused a
false negative (less common with chronic dosing), or there is a
metabolic variant affecting detection. Confirm with send-out testing.
Have a non-accusatory conversation: "I want to make sure we understand
this result together before drawing any conclusions." Document the
conversation and the plan for follow-up testing.

Q3: How often should UDS be repeated after intake?
A3: Risk-stratified. A stable patient with a clean PDMP, signed
agreement, and no behavioral concerns: every 6–12 months is a defensible
standard. A patient with any yellow flags: every 3 months. A patient
with active concerns or recent escalation: at every visit until stable.
Document your reasoning for the interval chosen.

[MME Calculation]

Q1: How do I calculate MME?
A1: Multiply the daily dose by the conversion factor for that opioid:
- Morphine — 1:1 (30 mg morphine = 30 MME)
- Oxycodone — × 1.5 (30 mg oxycodone = 45 MME)
- Hydrocodone — × 1 (30 mg hydrocodone = 30 MME)
- Hydromorphone — × 5 (8 mg hydromorphone = 40 MME)
- Fentanyl patch — mcg/hr × 2.4 (25 mcg/hr patch = 60 MME/day)
- Tramadol — × 0.1 (200 mg tramadol = 20 MME)
For patients on multiple opiates, sum the MME of all agents.

Q2: What are the thresholds I should know?
A2: CDC guidance identifies key inflection points:
- 50 MME/day — increased overdose risk begins; reassess benefit/risk,
  ensure naloxone is prescribed and patient and household are trained.
- 90 MME/day — avoid prescribing above this threshold without documented
  specialist involvement and clear clinical rationale. This is not a hard
  ceiling but a high-scrutiny zone. Above 90 MME without pain management
  co-management is an escalation indicator in this framework.

Q3: The patient is on 120 MME/day and has been stable for years. Do I
taper them?
A3: Stability is meaningful clinical information. Abrupt taper of a
long-stable high-dose patient causes harm — undertreated pain,
withdrawal, loss of function, and in some cases drives patients to
illicit opioids. Do not taper at the first visit. Complete the intake
assessment, establish the relationship, prescribe with full documentation
of your awareness of the dose and your clinical rationale for
continuation, and use the e-consult to get pain management eyes on the
chart. The question for the consult is: "Patient stable on X MME/day for
Y years. Please review and advise on whether current plan is appropriate
or whether structured taper is indicated."

Q4: Should I prescribe naloxone?
A4: Yes — for any patient on ≥ 50 MME/day, any patient on opiates plus
any CNS depressant, any patient with a history of SUD or overdose, and
any patient whose household includes children or others at risk of
accidental exposure. Document that you prescribed it, that you counseled
on administration, and that the household has access to it. This is now
a standard of care expectation, not an optional add-on.

[High Dose Threshold]

Q1: Can I continue prescribing at this dose while I arrange the
e-consult?
A1: Yes — do not abruptly discontinue or reduce at the first visit while
awaiting specialist input. Continuity of an established regimen while
arranging appropriate oversight is clinically and ethically defensible.
Document your dose calculation, your awareness of the threshold, your
safety measures (naloxone prescribed, UDS obtained, PDMP reviewed), and
that e-consult to pain management is pending.

Q2: What is the e-consult ask at high dose?
A2: Be specific: "Patient inherited on [X] MME/day of [agent] for
[indication]. No prior pain management documentation in chart. PDMP
clean, UDS confirms prescribed medication, patient reports functional
stability. Please review current regimen and advise: (1) whether dose is
appropriate for indication, (2) whether structured taper is recommended,
and (3) whether ongoing co-management is indicated."

Q3: The patient tells me their prior doctor "always" prescribed this and
they'll go elsewhere if I change anything.
A3: Acknowledge the anxiety without making promises you can't keep: "I
understand this medication has been important to your quality of life
and I'm not here to take anything away from you today. I do need to
complete my own assessment as your new provider, and I want to make
sure we're doing this in a way that protects you." Do not let the threat
of patient departure drive clinical decisions. Document the conversation.

[Opiate-Benzo Combination]

Q1: How dangerous is this combination?
A1: It is the most dangerous combination in outpatient prescribing.
Concurrent opioid and benzodiazepine use increases overdose mortality
risk by a factor of 3–4 compared to opioids alone. Both drug classes
cause respiratory depression through different mechanisms — the
combination is synergistic, not additive. The FDA issued a black box
warning on this combination in 2016. You cannot inherit this combination
and continue it unchanged without a documented safety plan and
specialist input.

Q2: The patient has legitimate indications for both. What do I do?
A2: This is precisely the e-consult scenario. The question is not
whether either medication is individually justified — it is whether the
combination is the safest available approach given the full clinical
picture. Psychiatry or pain management input, depending on which
medication is driving the combination, is required before you own both
prescriptions. At this visit: prescribe whichever is the more
immediately necessary (typically the opiate if chronic pain is the
primary indication), document the combination as a known risk, prescribe
naloxone, and initiate the e-consult urgently.

Q3: Can I just taper the benzo?
A3: Benzo taper in the context of chronic use requires its own careful
management and is not something to initiate unilaterally at a first
visit. A patient on chronic benzodiazepines is physically dependent —
abrupt reduction risks withdrawal seizure. The taper plan should be
coordinated, ideally with psychiatry input, and should be separate from
the opiate management conversation so the patient is not facing two
simultaneous tapers.

[Unexpected UDS Results]

Q1: The UDS is positive for cocaine. Do I stop the opiate today?
A1: Confirm with send-out testing before taking action. If confirmed: do
not prescribe at this visit. Have a direct, non-punitive conversation
focused on safety: "I'm concerned about your safety if we combine these
substances." Document the conversation. This is an OUD evaluation
trigger — consider whether what you're seeing is active substance use
disorder that warrants MOUD rather than simply discontinuing the opiate.
A patient with OUD who is cut off from prescribed opioids without
treatment is at significantly elevated overdose risk from illicit opioid
use.

Q2: The UDS is positive for fentanyl but the patient is not prescribed
it.
A2: This is a high-acuity finding. Illicit fentanyl exposure indicates
the patient is using street opioids — either supplementing their
prescription or substituting for it. This is an OUD evaluation and MOUD
conversation, not a straightforward prescription continuation decision.
Do not prescribe additional controlled substances at this visit. Engage
with empathy: the patient is at serious overdose risk and needs
treatment, not termination from the practice.

[PDMP Red Flags]

Q1: I see fills from three different pharmacies. Is that diversion?
A1: It is a red flag that requires explanation — it is not a confirmed
finding. Ask directly and document the answer. Geographic reasons
(pharmacy closures, travel, insurance network restrictions) are
plausible. A pattern of cash-pay fills at multiple locations without a
coherent explanation is more concerning. Confirm with send-out UDS to
establish whether the patient is actually taking the medication. If the
pattern is unexplained and confirmed, this is a case for e-consult
before continuing.

Q2: What do I document when I find a PDMP concern?
A2: Document exactly what you found (dates, prescribers, pharmacies,
quantities), what you asked the patient, what they told you, and what
your clinical assessment is. This documentation protects you regardless
of what you decide. If you choose to continue prescribing despite a
flag, document your reasoning. If you choose not to prescribe, document
your safety plan for the patient.

[Behavioral Concerns]

Q1: How many early refill requests trigger a formal response?
A1: Threshold ladder:
- 1 request — warrants a conversation and documentation.
- 2+ in 12 months — warrants a formal written warning within the CS
  agreement framework, a UDS, and a PDMP review.
- 3+ in 12 months — a pattern that requires e-consult before
  continuation.
Document each instance at the time it occurs — patterns are only
visible in retrospect if the individual events are in the chart.

Q2: The patient calls repeatedly between visits asking for early
refills, dose increases, or exceptions. How do I manage this?
A2: Establish a clear protocol and communicate it once, in writing:
controlled substance questions are addressed at scheduled visits only,
not by phone or portal message. Exceptions are not made between visits.
Document that this was communicated. Frequent between-visit contact
around controlled substances is itself a behavioral flag — note it in
the chart as part of the monitoring picture.

Q3: The patient says their medication was stolen. What are my
obligations?
A3: Schedule II opiates are not replaced for loss or theft as a matter
of institutional policy. Communicate this clearly and without apology.
You may offer to file a police report with the patient if they wish to
document the theft — this creates a record and is occasionally relevant.
Document the report in the chart. A single loss event is not
disqualifying for future prescribing, but it should be noted and
factored into the monitoring picture going forward.

[Opioid Use Disorder]

Q1: How do I distinguish chronic pain requiring opiates from OUD?
A1: They coexist more often than they are mutually exclusive — a patient
can have both legitimate chronic pain and opioid use disorder
simultaneously. Signs that OUD may be present alongside or instead of
pure pain management need: continued use despite clear harm, inability
to adhere to the agreed prescribing structure despite genuine effort,
loss of control over use, withdrawal symptoms driving use more than pain
relief, and social or functional deterioration attributable to opioid
use.

Q2: If I think this is OUD, what is the pathway?
A2: MOUD — medication for opioid use disorder — is the evidence-based
treatment and significantly outperforms taper or discontinuation for
patient outcomes including overdose survival. Buprenorphine (Suboxone)
can be initiated in primary care and is within your scope. Methadone for
OUD requires an OTP clinic. The e-consult framing shifts: instead of
"please review pain management plan," it becomes "patient with chronic
pain and possible OUD — please advise on MOUD candidacy and transition
plan." Do not frame OUD as a moral failure to the patient or in
documentation.

Q3: Can I continue the opiate while initiating an OUD evaluation?
A3: Yes — do not abruptly discontinue while the evaluation is pending.
A patient who is cut off from prescribed opioids without a treatment
plan is at acute overdose risk from illicit opioid use. Continuity with
close monitoring and an active referral in process is safer than
discontinuation without a plan.
```

**Meta-pass findings:**

_OE meta-pass run 2026-05-03. Section-by-section review pasted verbatim below. Tracker rows touched by this pass have verdict/ref_id/action populated; rows the meta-pass did not address remain `_Bundle N pending_`._

This is a well-constructed module. Below is a section-by-section review flagging statements that are factually inaccurate, outdated, unsupported, controversial, or oversimplified.

---

**CHECKLIST — Item 4: "clinical rationale is present for doses above 50 MME/day"**

This is accurate and well-aligned with current guidance. The 2022 CDC Guideline emphasizes that before increasing dosage to ≥50 MME/day, clinicians should "pause and carefully reassess evidence of individual benefits and risks".[ref:cdc-2022] No correction needed, but worth noting that the 2022 guideline deliberately avoids framing 50 MME as a hard threshold — it is a "guidepost," not a ceiling.[ref:cdc-2022]

---

**MME CALCULATION — Tramadol conversion factor: "× 0.1"**

**Factually inaccurate.** The CDC 2022 conversion table lists the tramadol conversion factor as **0.2**, not 0.1.[ref:cdc-2022] Using 0.1 would underestimate MME by half (e.g., 200 mg tramadol = 40 MME, not 20 MME as stated). This is a clinically significant error that could lead to underrecognition of risk.

Additionally, the CDC notes that tramadol is a µ-receptor agonist and norepinephrine/serotonin reuptake inhibitor, and it is unknown whether tramadol is associated with overdose in the same dose-dependent manner as pure µ-receptor agonists.[ref:cdc-2022] This caveat is worth including in a decision-support tool.

---

**MME CALCULATION — Hydromorphone: "× 5 (8 mg hydromorphone = 40 MME)"**

The 2022 CDC table lists hydromorphone at **5.0**, which matches the module.[ref:cdc-2022] However, the 2016 CDC table listed it at **4.0**, and there is significant institutional variation in hydromorphone conversion factors.[ref:cdc-2016][ref:wen-jpm-2022] The module should note that conversion factors are estimates and vary across sources, consistent with the CDC's own caveat that "there is no single standard formula for calculating MMEs".[ref:cdc-2022]

---

**MME THRESHOLDS — "90 MME/day — avoid prescribing above this threshold without documented specialist involvement"**

**Outdated framing.** The 2022 CDC Guideline intentionally removed the 90 MME threshold from the main recommendation statement. The 2016 guideline stated clinicians should "avoid increasing dosage to ≥90 MME/day or carefully justify" doing so, but the 2022 update explicitly moved away from specific numeric thresholds in the recommendation text, noting that "multiple experts from OWG expressed concern that including specific dosage thresholds in a main recommendation statement would emphasize them as authoritative absolutes and would lead to noncollaborative tapers".[ref:cdc-2016][ref:cdc-2022] The 2022 guideline does not require specialist involvement at 90 MME — it emphasizes individualized assessment at any dosage increase, with the primary inflection point at **50 MME/day**.[ref:cdc-2022] Some states (e.g., Washington) have their own thresholds (e.g., 120 MME requiring specialist consultation), but this is state-specific, not CDC guidance.[ref:cdc-2022]

**Corrected framing:** The module should present 50 MME/day as the primary reassessment threshold per CDC 2022, note that risk increases continuously with dosage without a single safe threshold, and frame specialist involvement as a best practice for complex cases rather than a CDC-mandated requirement at 90 MME.

---

**ESCALATION #2 — "Concurrent benzodiazepine prescription — any dose, any indication"**

**Oversimplified.** The 2022 CDC Guideline recommends "particular caution" with concurrent opioid-benzodiazepine prescribing but explicitly does not recommend absolute avoidance. The Opioid Workgroup noted that "in specific situations benzodiazepines can be beneficial, and that stopping benzodiazepines can be destabilizing" and that "long-term, stable use might be safer than erratic, unpredictable use".[ref:cdc-2022] The recommendation was deliberately classified as Category B (individual decision-making required) rather than Category A.[ref:cdc-2022] Treating any concurrent benzodiazepine as an automatic escalation could lead to destabilizing tapers or inappropriate care refusal.

**Corrected framing:** Concurrent benzodiazepine use warrants heightened monitoring, naloxone coprescription, and a documented safety plan — but long-term stable use at low doses may not require escalation if the combination is clinically justified and monitored.

---

**OPIATE-BENZO FAQ Q1 — "the most dangerous combination in outpatient prescribing" and "synergistic, not additive"**

**Controversial/oversimplified on mechanism.** The characterization as "synergistic, not additive" is mechanistically debated. A 2025 randomized trial in healthy volunteers found that midazolam co-administered with oxycodone did not significantly decrease hypercapnic ventilation compared with oxycodone alone, though it did increase sedation and upper airway effects.[ref:gershuny-bja-2025] The CDC describes the mechanism as benzodiazepines "potentiating" opioid-induced respiratory depression, and the FDA labeling uses "profound sedation, respiratory depression, coma, and death" without specifying synergy.[ref:cdc-2022][ref:fda-oxycodone] The epidemiologic risk (near-quadrupling of overdose death) is well-supported, but the pharmacologic mechanism is more nuanced than "synergistic, not additive."[ref:cdc-2022]

**Corrected framing:** State that the combination is associated with approximately a 4-fold increase in overdose death risk compared to opioids alone, and that both classes cause CNS depression through different mechanisms that can potentiate respiratory depression, without asserting a specific pharmacodynamic model.[ref:cdc-2022]

---

**OPIATE-BENZO FAQ Q3 — Benzo taper and "withdrawal seizure"**

Accurate in principle. The 2025 ASAM/ACMT Joint Clinical Practice Guideline on Benzodiazepine Tapering confirms that abrupt benzodiazepine discontinuation in physically dependent patients risks serious withdrawal including seizures, and that tapering should be carefully managed.[ref:asam-acmt-2025-benzo] No correction needed, but the module could reference this guideline.

---

**UDS FAQ Q3 — "every 6–12 months is a defensible standard" for low-risk patients**

**Reasonable but should acknowledge guideline nuance.** The CDC 2022 guideline recommends toxicology testing "at least annually" during opioid therapy without risk-stratifying the frequency.[ref:cdc-2022] The American Academy of Pain Medicine consensus recommendations do support risk-stratified intervals (every 6 months to 2 years for low-risk, 1–3 times/year for moderate-risk, 2–4 times/year for high-risk).[ref:aapm-argoff-2018] The module's intervals are defensible but should note that the CDC does not endorse risk-stratified testing frequency — it recommends at least annual testing for all patients.[ref:cdc-2022]

---

**UNEXPECTED UDS FAQ Q1 — "If confirmed: do not prescribe at this visit" (cocaine-positive UDS)**

**Oversimplified and potentially harmful.** The CDC 2022 guideline explicitly states that "toxicology testing should not be used in a punitive manner" and that "clinicians should not dismiss patients from care on the basis of a toxicology test result".[ref:cdc-2022] A retrospective cohort study found that a stimulant-positive UDT was not significantly associated with subsequent opioid-related ED visits or overdose deaths within 90 days, but was associated with LTOT discontinuation — suggesting that reflex withholding may be more reflexive than evidence-based.[ref:appa-dad-2024] The module's instruction to "not prescribe at this visit" upon confirmed cocaine is a clinical judgment call, not a guideline recommendation, and could lead to abrupt discontinuation with its attendant harms.

**Corrected framing:** A confirmed cocaine-positive UDS should trigger a safety-focused conversation, assessment for substance use disorder, and individualized risk-benefit analysis. Automatic withholding of the opioid prescription is not supported by CDC guidance and may increase harm. If the decision is made to continue prescribing, enhanced monitoring and naloxone should be documented.

---

**OUD FAQ Q2 — "Buprenorphine (Suboxone) can be initiated in primary care and is within your scope"**

**Accurate but should be updated.** The X-waiver requirement was eliminated in December 2022 via the Consolidated Appropriations Act (MAT Act), meaning any practitioner with a standard DEA registration and Schedule III prescribing authority can now prescribe buprenorphine for OUD without a special waiver.[ref:lefevre-jabfm-2023][ref:acog-mate-2025] However, the MATE Act requires 8 hours of training on substance use disorders for new or renewed DEA registrations.[ref:acog-mate-2025] The module should explicitly note this regulatory change, as many PCPs may still believe the X-waiver is required.

---

**NALOXONE FAQ Q4 — "for any patient on ≥ 50 MME/day"**

Accurate. The CDC 2022 guideline recommends offering naloxone to patients at increased risk for overdose, including those taking ≥50 MME/day, those with concurrent benzodiazepine use, those with a history of SUD or overdose, and those at risk of returning to a high dose to which they have lost tolerance.[ref:cdc-2022] The module's indications align well with this guidance.

---

**LANDING — "Do not discontinue at the first visit without a safety plan in place"**

Well-supported. The CDC 2022 guideline and its authors have emphasized that abrupt discontinuation of long-term opioid therapy causes harm, including undertreated pain, withdrawal, and transition to illicit opioids.[ref:aafp-roth-2020][ref:cdc-2022] No correction needed.

---

**PDMP FAQ Q1 — "cash-pay fills which bypass insurance tracking and may not appear on PDMP in all states"**

**Potentially outdated.** Most state PDMPs now capture cash-pay prescriptions, as this has been a focus of PDMP modernization. However, coverage is not universal, and the statement is directionally correct. The module should note that PDMP coverage of cash-pay fills varies by state and has improved significantly in recent years.

---

**Summary of required corrections (OE-provided):**

| Section | Issue | Severity | Correction | References |
|---------|-------|----------|------------|------------|
| MME Calculation — Tramadol | Conversion factor listed as 0.1; correct value is **0.2** | **High — clinical safety** | Change to × 0.2 (200 mg tramadol = 40 MME) | cdc-2022 |
| MME Thresholds — 90 MME | Framed as CDC threshold requiring specialist involvement | **Moderate** | 2022 CDC removed 90 MME from main recommendation; reframe around 50 MME as primary inflection and individualized assessment | cdc-2022 |
| Escalation #2 — Any benzo | "Any dose, any indication" as automatic escalation | **Moderate** | CDC 2022 recommends caution, not avoidance; stable low-dose use may not require escalation | cdc-2022 |
| Opioid-benzo mechanism | "Synergistic, not additive" | **Low-moderate** | Mechanism is debated; use "potentiates" per CDC language | cdc-2022, cdc-2016 |
| Cocaine-positive UDS | "Do not prescribe at this visit" as blanket rule | **Moderate** | CDC opposes punitive use of UDS; individualized risk-benefit analysis is appropriate | cdc-2022, appa-dad-2024 |
| OUD — Buprenorphine | Does not mention X-waiver elimination | **Low** | Note that X-waiver was eliminated Dec 2022; only MATE Act training requirement remains | lefevre-jabfm-2023, acog-mate-2025 |
| UDS frequency | Risk-stratified intervals presented without noting CDC recommends at least annual for all | **Low** | Add that CDC 2022 recommends at least annual testing regardless of risk | cdc-2022 |

The module's overall clinical philosophy — prioritize relationship, avoid abrupt discontinuation, assess for OUD, prescribe naloxone — is well-aligned with current evidence and the 2022 CDC guideline. The tramadol conversion error is the most urgent fix given its direct patient safety implications.

OE-offered deep-dive: _"Would you like to explore how the 2022 CDC guideline's approach to tapering established high-dose patients differs from the 2016 version, particularly regarding involuntary dose reduction?"_ — captured in the Follow-up Prompts section below.

---

## Shared bundle prompt template

Use this wrapper for Bundles 1–8. Paste the bundle's claim list into the `[claims]` slot.

```
I'm reviewing a primary care decision-support tool for managing adult
patients inherited on chronic opiate therapy. I need to verify a set of
related clinical claims against current evidence and guidelines.

For each claim below, please tell me:
  1. Is this supported by current evidence, guidelines (CDC 2022 opioid
     guideline, FDA labeling, ASAM, AAFP, state regulatory bodies, NY
     I-STOP), or standard of care?
  2. The specific source/citation (guideline name, year, relevant section).
  3. Any nuance, exception, or recent update (2022+) that should modify it.
  4. If the claim is incorrect or oversimplified, what is the accurate
     version?

Do not assume the claims are correct. I want genuine pushback on anything
that's outdated, unsupported, or controversial. The audience is a primary
care physician at the inherited-patient first visit, so corrections should
be operational (what should the PCP actually do or document).

Claims:
[paste bundle claims here]
```

---

## Bundle 1 — Regulatory & MME pharmacology  **(PILOT FIRST)**

Highest-stakes, most black-and-white facts. Run this first to calibrate the prompt wording.

```
- MME conversion factors used in the module: morphine 1:1; oxycodone
  × 1.5; hydrocodone × 1; hydromorphone × 5; fentanyl patch
  (mcg/hr × 2.4); tramadol × 0.1.
- For a patient on multiple opiates, total MME is the sum across all
  agents.
- The CDC identifies 50 MME/day as the inflection point at which
  overdose risk begins to increase; reassessment of benefit/risk and
  naloxone prescribing become standard of care at or above this dose.
- The CDC identifies 90 MME/day as a high-scrutiny threshold above which
  prescribing should be avoided without documented specialist
  involvement and clear clinical rationale; this is not a hard
  regulatory ceiling.
- Naloxone co-prescribing is standard of care for any patient on
  ≥ 50 MME/day, on opiates plus any CNS depressant, with a history of
  SUD or overdose, or with household members at risk of accidental
  exposure.
- The FDA black box warning on concurrent opioid + benzodiazepine
  prescribing was issued in 2016 and applies to all opioids and all
  benzodiazepines.
- New York State requires PDMP review prior to every opiate prescription,
  not only at intake (legal obligation under I-STOP, not preference).
- Schedule II opiates are not eligible for refills under federal law;
  early-fill restrictions are primarily pharmacy/insurance policy rather
  than DEA regulation.
- "Schedule II opiates are not replaced for loss or theft" is widely
  written into institutional policy; the ADHD verification flagged this
  is institutional policy, not federal regulation, and the same framing
  applies here.
```

**Bundle 1 findings:**

_OE Bundle 1 run 2026-05-03. Verbatim response below; tracker rows 20, 34–47, 54, 71 touched. Several meta-pass flags now have a second confirming citation; new content gaps surfaced (methadone, tapentadol, buprenorphine-from-summation exclusion, sleep-disordered breathing, post-incarceration tolerance loss)._

Below is a claim-by-claim verification against current evidence and guidelines. Several claims contain errors or oversimplifications that warrant correction.

---

**Claim 1: MME Conversion Factors**

The module lists: morphine 1:1, oxycodone ×1.5, hydrocodone ×1, hydromorphone ×5, fentanyl patch mcg/hr ×2.4, tramadol ×0.1.

**Verdict: Mostly correct, but tramadol is wrong.** The CDC 2022 Clinical Practice Guideline MME conversion table lists: morphine 1.0, oxycodone 1.5, hydrocodone 1.0, hydromorphone 5.0, fentanyl transdermal (mcg/hr) 2.4 — all matching the module. However, the CDC 2022 conversion factor for **tramadol is 0.2, not 0.1**.[ref:cdc-2022] This is a clinically meaningful error: a patient taking tramadol 400 mg/day would be calculated at 40 MME (correct) versus 80 MME (module's factor), meaning the module *underestimates* tramadol's contribution by half. The CDC also notes that tramadol is a dual-mechanism agent (µ-receptor agonist + serotonin/norepinephrine reuptake inhibitor), and it is unknown whether tramadol is associated with overdose in the same dose-dependent manner as pure µ-agonists.[ref:cdc-2022]

Operational correction: Update tramadol to ×0.2. Consider adding a footnote that methadone (×4.7 per CDC, but with a highly variable and dose-dependent conversion) and tapentadol (×0.4) are also commonly encountered and have their own conversion factors.[ref:cdc-2022] Methadone in particular requires special caution due to its long, variable half-life.[ref:cdc-2022]

---

**Claim 2: Total MME Is the Sum Across All Agents**

**Verdict: Correct.** The CDC 2022 guideline explicitly instructs clinicians to calculate total MME/day for concurrent opioid prescriptions by summing across all sources.[ref:cdc-2022] One important nuance: **buprenorphine should not be counted** in total MME calculations because of its partial agonist properties and ceiling effect on respiratory depression.[ref:cdc-2022] Similarly, MME conversion factors should not be applied to methadone or buprenorphine when used for opioid use disorder treatment.[ref:asam-2021-moud]

Operational note: The module should flag that buprenorphine is excluded from MME summation per CDC guidance.[ref:cdc-2022]

---

**Claim 3: 50 MME/day as the Inflection Point**

The claim states the CDC identifies 50 MME/day as the inflection point at which overdose risk begins to increase, and that reassessment and naloxone prescribing become standard of care at or above this dose.

**Verdict: Partially correct but oversimplified.** The CDC 2022 guideline states that overdose risk increases **continuously** with dosage — there is no single inflection point, and "no single dosage threshold below which risks are eliminated".[ref:cdc-2022] The 50 MME/day threshold is described as a point at which clinicians should "pause" and carefully reassess benefits versus risks, implement additional precautions (increased follow-up frequency), and offer naloxone.[ref:cdc-2022] The word "inflection point" overstates the epidemiology; the CDC frames 50 MME as a **guidepost for heightened vigilance**, not a pharmacologic inflection.

Regarding naloxone: the 2022 guideline broadened the recommendation to state that clinicians should "offer naloxone when prescribing opioids, **particularly** to patients at increased risk for overdose," listing ≥50 MME/day as one of several risk factors.[ref:cdc-2022] The language "particularly" suggests naloxone should be considered for all opioid patients, with stronger emphasis at ≥50 MME.

Operational correction: Reframe as "risk increases continuously with dose; 50 MME/day is a guidepost for reassessment, increased monitoring frequency, and naloxone offering — not a pharmacologic threshold." Note that the 2022 guideline softened the language to "offer" naloxone rather than mandating co-prescribing.[ref:cdc-2022]

---

**Claim 4: 90 MME/day as a High-Scrutiny Threshold Requiring Specialist Involvement**

**Verdict: Significantly oversimplified and partially incorrect for the 2022 guideline.** The **2016** CDC guideline stated clinicians should "avoid increasing dosage to ≥90 MME/day or carefully justify a decision to titrate dosage to ≥90 MME/day".[ref:cdc-2016] The **2022** CDC guideline deliberately **removed the specific 90 MME threshold** from its recommendation language, instead emphasizing that risks increase continuously and that clinicians should "avoid increasing dosage above levels likely to yield diminishing returns in benefits relative to risks" without specifying a single numeric cutoff.[ref:cdc-2022] The 2022 guideline explicitly states these recommendations "are not intended to be used as an inflexible, rigid standard of care".[ref:cdc-2022]

The claim that prescribing above 90 MME "should be avoided without documented specialist involvement" is **not in the CDC 2022 guideline**. Specialist consultation requirements at specific thresholds are **state-level mandates** (e.g., Washington State requires pain specialist consultation before exceeding 120 MME/day).[ref:cdc-2022] The module should not attribute a specialist-consultation requirement to the CDC.

Operational correction: For the 2022 guideline, replace the 90 MME language with: "Risk increases continuously with dose; the CDC 2022 guideline does not specify a single upper threshold but emphasizes avoiding dosage increases unlikely to improve pain/function relative to increasing risk. Check state-specific thresholds — some states mandate specialist consultation at defined MME levels." Document clinical rationale for any dose above 50 MME.[ref:cdc-2022]

---

**Claim 5: Naloxone Co-Prescribing Indications**

The claim lists: ≥50 MME/day, opioids + any CNS depressant, history of SUD or overdose, or household members at risk of accidental exposure.

**Verdict: Largely correct, with nuances.** The CDC 2022 guideline recommends offering naloxone particularly to patients with: history of overdose, history of SUD, concurrent benzodiazepine use, ≥50 MME/day, sleep-disordered breathing, and patients at risk of returning to a high dose to which they have lost tolerance (e.g., post-incarceration, during tapering).[ref:cdc-2022] The module's list is reasonable but:

- The CDC specifies **benzodiazepines** specifically, not "any CNS depressant," though the broader principle of CNS depressant risk is clinically sound.[ref:cdc-2022]
- **Sleep-disordered breathing** is listed as a separate risk factor in the 2022 guideline and is missing from the module.[ref:cdc-2022]
- "Household members at risk of accidental exposure" is addressed in the guideline's recommendation to provide overdose prevention education to household members, but the primary naloxone indication list focuses on patient-level risk factors.[ref:cdc-2022]
- The 2022 guideline uses the language "**offer** naloxone" rather than mandating co-prescribing, partly due to cost concerns.[ref:cdc-2022]

Operational correction: Add sleep-disordered breathing and post-incarceration/taper as explicit indications. Clarify that the CDC says "offer" naloxone, which can mean prescribing or directly providing it.[ref:cdc-2022]

---

**Claim 6: FDA Boxed Warning on Opioid + Benzodiazepine (2016), Applies to All Opioids and All Benzodiazepines**

**Verdict: Correct.** The FDA issued a class-wide boxed warning in August 2016 requiring updated labeling for **all** prescription opioid analgesics, opioid cough products, **and all** benzodiazepines regarding the risks of concomitant use.[ref:hadland-peds-2024] This is confirmed in current FDA labeling for both opioids (e.g., oxycodone) and benzodiazepines (e.g., triazolam, lorazepam).[ref:fda-oxycodone][ref:fda-triazolam][ref:fda-lorazepam] The warning states that concomitant use "may result in profound sedation, respiratory depression, coma, and death" and instructs clinicians to reserve concomitant prescribing for patients for whom alternative treatment options are inadequate.

One nuance: the FDA subsequently clarified (in 2017) that patients with OUD who need buprenorphine or methadone should still receive these medications even if already taking benzodiazepines, as withholding MOUD carries greater risk.[ref:hadland-peds-2024] The 2022 CDC guideline also softened its language from "avoid" (2016, Category A) to "use particular caution" (2022, Category B) for concurrent opioid-benzodiazepine prescribing.[ref:cdc-2022]

---

**Claim 7: NY I-STOP Requires PDMP Review Before Every Opiate Prescription**

**Verdict: Correct — this is a legal mandate, not merely a guideline recommendation.** New York's I-STOP law (Internet System for Tracking Over-Prescribing, effective August 2013) mandates that prescribers consult the state PDMP (PMP) prior to prescribing Schedule II–V controlled substances in most clinical situations.[ref:brown-dad-2017][ref:blum-jsat-2016] This is distinct from the CDC 2022 guideline, which recommends PDMP review "ideally before every opioid prescription" but sets a minimum of before initial prescription and then every 3 months.[ref:cdc-2022] Under I-STOP, the obligation is **statutory**, not discretionary.

Nuances: There are limited exemptions under I-STOP (e.g., certain veterinary, hospice, and emergency situations; prescriptions administered directly in facilities). A survey found only 83% of physicians at one academic center were aware the mandate applied to "almost all situations," and compliance was imperfect.[ref:blum-jsat-2016] The module should specify that I-STOP applies to **all controlled substances** (Schedules II–V), not only opioids.

---

**Claim 8: Schedule II Opiates Cannot Be Refilled; Early-Fill Restrictions Are Pharmacy/Insurance Policy**

**Verdict: Correct on both counts.** Under the Controlled Substances Act (21 CFR §1306.12), Schedule II controlled substances **may not be refilled** — each dispensing requires a new prescription.[ref:neuman-anesth-2020][ref:osborne-jmwh-2017] The 2014 DEA rescheduling of hydrocodone from Schedule III to Schedule II specifically eliminated refill eligibility for hydrocodone combination products.[ref:neuman-anesth-2020]

Regarding early-fill restrictions: these are **not DEA regulations**. The DEA does not regulate the timing of fills relative to previous prescriptions. Early-fill restrictions (e.g., cannot fill until 75–80% of the previous supply is consumed) are imposed by **state pharmacy boards, insurance/PBM policies, and individual pharmacy chains**.[ref:neuman-anesth-2020] Some states do have laws limiting the maximum period between writing and dispensing of Schedule II prescriptions (ranging from 30 days to 1 year depending on the state).[ref:chua-jamaopen-2022]

Operational note: Clinicians should be aware that while a prescriber can legally write a new Schedule II prescription at any time, the pharmacy may decline to fill it early based on state law or internal policy. For patients on stable chronic therapy, prescribers can write up to three sequential 30-day prescriptions for Schedule II substances (with earliest fill dates noted), per DEA policy, to reduce visit burden.

---

**Claim 9: "Schedule II Opiates Are Not Replaced for Loss or Theft" Is Institutional Policy, Not Federal Regulation**

**Verdict: Correct.** There is **no federal statute or DEA regulation** that prohibits a prescriber from writing a new prescription for a Schedule II controlled substance to replace medication reported as lost or stolen.[ref:acoem-2017-otc] The "no replacement" policy is an **institutional/practice-level risk management policy**, widely adopted and often written into opioid treatment agreements.[ref:acoem-2017-otc] A prescriber retains clinical discretion to issue a new prescription if they judge it medically necessary, though doing so may trigger scrutiny and should be documented carefully.

Operational note: While the prescriber has legal authority to replace, institutional policies and opioid agreements typically prohibit it, and repeated replacement requests are a recognized aberrant behavior warranting further assessment. The module's framing — that this is institutional policy rather than federal law — is accurate and important for clinicians to understand, as it preserves clinical judgment in genuinely exceptional circumstances while maintaining appropriate safeguards.

---

**Summary of Required Corrections (Bundle 1, OE-provided):**

| Claim | Status | Key Correction | References |
|-------|--------|----------------|------------|
| MME conversion factors | **Error in tramadol** | Tramadol should be ×0.2, not ×0.1 | cdc-2022 |
| Total MME = sum across agents | Correct | Add note: exclude buprenorphine from summation | cdc-2022 |
| 50 MME inflection point | Oversimplified | Risk is continuous; 50 MME is a guidepost, not a pharmacologic inflection | cdc-2022 |
| 90 MME specialist threshold | Partially incorrect for 2022 | CDC 2022 removed the 90 MME threshold; specialist requirements are state-level | cdc-2022 |
| Naloxone co-prescribing | Mostly correct | Add sleep-disordered breathing; note CDC says "offer," not mandate | cdc-2022 |
| FDA boxed warning opioid + benzo | Correct | Note FDA exception for MOUD patients on benzodiazepines | hadland-peds-2024, fda-oxycodone, fda-triazolam, fda-lorazepam |
| NY I-STOP PDMP mandate | Correct | Applies to all controlled substances (Schedules II–V), not only opioids | brown-dad-2017, blum-jsat-2016 |
| Schedule II no refills / early-fill | Correct | Early-fill restrictions are state/pharmacy/insurance policy, not DEA | neuman-anesth-2020, osborne-jmwh-2017 |
| No replacement for loss/theft | Correct framing | Institutional policy, not federal law; prescriber retains discretion | acoem-2017-otc |

OE-offered deep-dive: _"Would you like to explore how the CDC 2022 guideline's approach to inherited patients on high-dose opioid therapy differs from its recommendations for opioid-naïve patients — particularly regarding tapering versus continuation decisions at the first visit?"_ — captured in Follow-up Prompts section (FU-2).

---

## Bundle 2 — PDMP red flags (opiate-specific)

```
- Concurrent benzodiazepine prescription on PDMP review is the most
  important opiate-specific safety flag at the inherited-patient visit.
- Overlapping fills from any prescriber suggest double-doctoring and
  warrant clarification before continuing prescribing.
- Filling a 30-day supply every 20 days (fill frequency exceeding days
  supply) is a recognized concerning pattern.
- Cash-pay fills can bypass insurance tracking and may not appear on
  PDMP in all states; their presence among controlled-substance fills
  is a recognized red flag.
- Multiple prescribers, multiple pharmacies, or overlapping fills
  (escalation #4 in the module) constitute a concerning pattern that
  warrants explanation and documentation rather than automatic
  diversion conclusions.
- Three different pharmacies without geographic, insurance, or other
  coherent explanation is a concerning pattern; geographic reasons
  (closures, travel, network restrictions) are plausible alternative
  explanations.
- Ad-hoc ER opiate prescription for an acute injury is qualitatively
  different from a pattern of monthly fills from two separate primary
  care offices; the latter is the pattern requiring documentation +
  clarification with the other prescriber.
- A second prescriber visible in the PDMP is not automatically a
  problem if dual prescribing (e.g., PCP + pain management) is
  coordinated and documented.
```

**Bundle 2 findings:**

_OE Bundle 2 run 2026-05-03. Verbatim response below; tracker rows 13, 16–19, 21–22, 64, 66 touched. **Notable correction:** Row 19 (cash-pay PDMP claim) is factually wrong as written — PDMPs are pharmacy-based, not insurance-based; cash-pay fills DO appear on PDMP. Downgraded from Verified-with-nuance to Needs-revision. New content gaps surfaced (PDMP risk scores not validated, non-dismissal principle, Perry 2022 finding that traditional binary thresholds have decreasing predictive utility)._

### Practice Guideline

The CDC recommends that clinicians review PDMP data before initial opioid prescriptions and at least every 3 months during long-term therapy, specifically looking for prescription opioids and other controlled medications from additional prescribers to determine whether total opioid dosages or combinations (e.g., opioids combined with benzodiazepines) put the patient at risk for overdose.[ref:cdc-2022] The 2022 guideline (Recommendation 9) emphasizes that PDMP information should be used in the context of other clinical information — including history, physical findings, and relevant testing — rather than as a standalone determinant.[ref:cdc-2022]

Key CDC positions relevant to the claims under review:

- **Concurrent benzodiazepines** are identified as a major safety concern, but the CDC does not rank it as "the most important" flag. The guideline lists high total opioid dosages, dangerous combinations, and multiple controlled substance prescriptions from different clinicians as co-equal triggers for safety action. Concurrent opioid-benzodiazepine use from multiple prescribers carries further increased overdose risk compared to a single prescriber.[ref:cdc-2022]
- **Multiple prescribers** are flagged as a concern warranting discussion and care coordination, but the CDC explicitly notes that "prescriptions might appropriately be written by more than one clinician coordinating the patient's care" and that PDMP information can occasionally be incorrect. The recommended response is to discuss findings with the patient, confirm awareness of additional prescriptions, and communicate with other prescribers — not to assume diversion.[ref:cdc-2022]
- **PDMP-generated risk scores** and algorithmic interpretations have not been validated against clinical outcomes and should not replace clinical judgment. The CDC warns that such scores can lead to stigmatization and may disparately affect women, persons of color, and persons living in poverty.[ref:cdc-2022]
- **Patient dismissal** based on PDMP information is explicitly discouraged: "Clinicians should not dismiss patients from their practice on the basis of PDMP information. Doing so can adversely affect patient safety and could result in missed opportunities to provide potentially lifesaving information and interventions".[ref:cdc-2022]
- **PDMP limitations**: PDMPs collect information on controlled prescription drugs dispensed by pharmacies and, in selected jurisdictions, by dispensing clinicians, but do not report nonprescribed opioid use. The guideline acknowledges variation in PDMP availability and circumstances across jurisdictions.[ref:cdc-2022]

Below is a claim-by-claim analysis integrating the CDC 2022 guideline, FDA labeling, and additional evidence.

---

**Claim 1: "Concurrent benzodiazepine prescription on PDMP review is the most important opiate-specific safety flag at the inherited-patient visit."**

**Partially supported but oversimplified.** Concurrent benzodiazepine use is unquestionably a critical safety flag. The CDC 2022 guideline (Recommendation 11) cites a near-quadrupling of overdose death risk with concurrent benzodiazepine-opioid prescriptions, and FDA boxed warnings on all opioid labels warn of profound sedation, respiratory depression, coma, and death from concomitant use.[ref:cdc-2022][ref:fda-oxycodone] However, the CDC does not rank it as "the most important" flag — it lists it alongside **high total MME/day** and **multiple uncoordinated prescribers** as co-equal triggers for safety action.[ref:cdc-2022][ref:cdc-2016] The 2024 ACMT benzodiazepine tapering guideline further notes that long-term stable concurrent use may be safer than erratic use, and that stopping benzodiazepines can be destabilizing.[ref:asam-acmt-2025-benzo]

**Operational correction:** At the inherited-patient visit, concurrent benzodiazepines should be flagged as **one of the top safety concerns**, alongside total MME/day and uncoordinated multi-prescriber patterns. Document the risk-benefit assessment rather than treating it as an automatic contraindication. The 2022 CDC guideline explicitly softened the 2016 language from "avoid" to "use particular caution" (Category B, not A).[ref:cdc-2022]

---

**Claim 2: "Overlapping fills from any prescriber suggest double-doctoring and warrant clarification before continuing prescribing."**

**Partially supported; the framing is too presumptive.** The CDC 2022 guideline recommends discussing overlapping prescriptions with the patient and confirming awareness, and communicating with other prescribers.[ref:cdc-2022] However, the guideline explicitly cautions that prescriptions may appropriately be written by more than one clinician coordinating care, and that PDMP information can be incorrect (wrong name, nickname, identity theft).[ref:cdc-2022] The 2016 CDC guideline similarly states clinicians should "not dismiss patients from their practice on the basis of PDMP information".[ref:cdc-2016]

**Operational correction:** Overlapping fills warrant **clarification and documentation**, not a presumption of double-doctoring. The PCP should discuss findings with the patient, verify whether the overlap reflects coordinated care (e.g., PCP + pain specialist), a transition between providers, or a data error, and document the explanation. The term "double-doctoring" implies intent and should be avoided in clinical documentation until the pattern is confirmed as uncoordinated.

---

**Claim 3: "Filling a 30-day supply every 20 days (fill frequency exceeding days supply) is a recognized concerning pattern."**

**Supported.** Early refills are a recognized marker of potential opioid misuse in the literature. A large retrospective study found that approximately 10% of patients with multiple opioid fills had an early refill (defined as ≥15% early relative to days' supply), with higher rates among extended-release/long-acting opioid users (18.5%).[ref:kern-pm-2020] Early refills are used as a proxy for potential misuse in clinical research, and the NEJM characterizes "frequent loss of medication or early refills" as hallmarks of problematic opioid use.[ref:lange-pain-2015][ref:liebschutz-jamaim-2017][ref:babu-nejm-2019]

**Nuance:** A single early refill is common and often benign (75% of patients with an early refill had only one).[ref:kern-pm-2020] Legitimate explanations include vacation preparation, dose adjustments, or shortened monitoring intervals (e.g., 14-day refills written as 30-day supply).[ref:liebschutz-jamaim-2017] A **pattern** of consistently early refills is more concerning than an isolated occurrence. The PCP should document the pattern and ask the patient about it before drawing conclusions.

---

**Claim 4: "Cash-pay fills can bypass insurance tracking and may not appear on PDMP in all states; their presence among controlled-substance fills is a recognized red flag."**

**The first part is largely incorrect; the second part is reasonable.** PDMPs are **pharmacy-based reporting systems**, not insurance-based. Pharmacies are required to report all dispensed controlled substances to the PDMP regardless of payment method (cash, insurance, or otherwise) in virtually all states.[ref:cdc-2022][ref:manasco-pds-2016] Cash-pay fills therefore **do appear on the PDMP**. The claim that cash-pay fills "may not appear on PDMP" conflates PDMP reporting with insurance claims data — cash-pay fills will not appear in insurance/PBM records, but that is a different system.

That said, cash payment for controlled substances when a patient has insurance coverage is recognized in clinical practice as a potential indicator of attempts to avoid insurance-level utilization review or quantity limits, and is worth noting.

**Operational correction:** The tool should state that cash-pay fills **do appear on the PDMP** (since pharmacies report all controlled substance dispensing regardless of payment method). However, cash payment for a controlled substance when the patient has active insurance is a pattern worth exploring, as it may indicate an attempt to circumvent insurance quantity limits or prior authorization. Document the finding and ask the patient about it. Note that PDMP reporting lag times vary by state (historically up to a week in some states, though most have moved toward next-business-day or real-time reporting).[ref:manasco-pds-2016]

---

**Claim 5: "Multiple prescribers, multiple pharmacies, or overlapping fills constitute a concerning pattern that warrants explanation and documentation rather than automatic diversion conclusions."**

**Strongly supported.** This is well-aligned with the CDC 2022 guideline, which recommends discussing PDMP findings with the patient, confirming awareness, communicating with other prescribers, and explicitly warns against dismissing patients based on PDMP information.[ref:cdc-2022] The guideline notes that PDMP risk scores have not been validated against clinical outcomes and can lead to stigmatization.[ref:cdc-2022] Notably, a longitudinal study of 21.5 million opioid-prescribed patients found that traditional binary thresholds (N+ unique doctors and N+ unique pharmacies in 90 days) performed no better than chance at predicting OUD or overdose after 2015, suggesting these indicators have decreasing discriminative utility as standalone markers.[ref:perry-add-2022]

**Operational note:** This claim correctly captures the guideline-concordant approach. Document the pattern, explore explanations, and coordinate care. Do not equate the pattern with diversion.

---

**Claim 6: "Three different pharmacies without geographic, insurance, or other coherent explanation is a concerning pattern; geographic reasons (closures, travel, network restrictions) are plausible alternative explanations."**

**Supported in principle, though no guideline specifies "three" as a threshold.** The CDC guidelines flag multiple pharmacies as part of concerning patterns but do not define a specific numeric threshold.[ref:cdc-2016][ref:cdc-2022] Research has used ≥4 pharmacies in 90 days as a risk behavior threshold.[ref:greene-ajadd-2017] The claim's acknowledgment that geographic, insurance, or logistical reasons are plausible alternatives is appropriate and consistent with the CDC's emphasis on contextual interpretation.[ref:cdc-2022]

**Operational correction:** The number "three" is reasonable as a clinical heuristic but should not be presented as a validated threshold. The PCP should ask about pharmacy use patterns and document the explanation. Common legitimate reasons include pharmacy closures, mail-order vs. retail splits, travel, formulary/network changes, and specialty pharmacy requirements.

---

**Claim 7: "Ad-hoc ER opiate prescription for an acute injury is qualitatively different from a pattern of monthly fills from two separate primary care offices; the latter is the pattern requiring documentation + clarification with the other prescriber."**

**Supported.** This distinction is clinically sound and consistent with CDC guidance. The 2022 guideline acknowledges that acute pain prescriptions (including in the ED) are a distinct clinical context, and the guideline's emphasis on care coordination applies specifically to ongoing prescribing relationships, not isolated acute-care encounters.[ref:cdc-2022] A one-time ED prescription for an acute injury does not constitute a "multiple prescriber" pattern in the same way that parallel monthly fills from two primary care offices does.

**Operational note:** The PCP should still note the ED prescription in the chart and verify the clinical context (was there an acute injury?), but the level of concern and required follow-up is appropriately different. Monthly fills from two separate primary care offices is a pattern that requires direct communication with the other prescriber and documentation of whether prescribing is coordinated.[ref:cdc-2022]

---

**Claim 8: "A second prescriber visible in the PDMP is not automatically a problem if dual prescribing (e.g., PCP + pain management) is coordinated and documented."**

**Strongly supported.** The CDC 2022 guideline explicitly states that "prescriptions might appropriately be written by more than one clinician coordinating the patient's care".[ref:cdc-2022] The recommended action is to communicate with the other prescriber, discuss the patient's needs, prioritize goals, and coordinate care.[ref:cdc-2022] Coordinated dual prescribing (e.g., PCP managing baseline opioids while a pain specialist manages interventional procedures or dose adjustments) is standard practice and is not inherently concerning.

**Operational note:** The key documentation requirement is evidence of coordination — a note or communication confirming that both prescribers are aware of each other's prescribing and have agreed on a care plan. The PCP should contact the other prescriber at the inherited-patient visit to verify coordination and document the conversation.

---

**Summary of corrections (Bundle 2, OE-provided):**

| Claim | Verdict | Key Correction | References |
|-------|---------|----------------|------------|
| 1. Concurrent BZD is "most important" flag | Oversimplified | One of several co-equal top flags (alongside high MME, uncoordinated multi-prescriber); use "particular caution," not automatic contraindication | cdc-2022, fda-oxycodone |
| 2. Overlapping fills = double-doctoring | Too presumptive | Warrants clarification, not presumption; may reflect coordinated care or data error | cdc-2022 |
| 3. Fill frequency exceeding days supply | Supported | Pattern is more concerning than isolated occurrence; document and ask | cdc-2016, kern-pm-2020, lange-pain-2015 |
| 4. Cash-pay fills may not appear on PDMP | **Incorrect** | PDMPs capture all dispensed controlled substances regardless of payment; cash-pay among insured patients is a separate flag | cdc-2022, manasco-pds-2016 |
| 5. Multiple prescribers/pharmacies warrant explanation, not automatic diversion | Strongly supported | Consistent with CDC 2022; traditional thresholds have decreasing predictive utility | cdc-2022, perry-add-2022 |
| 6. Three pharmacies as threshold | Reasonable heuristic | No validated numeric threshold exists; literature uses ≥4; acknowledge legitimate alternatives | cdc-2022, greene-ajadd-2017 |
| 7. Ad-hoc ER Rx vs. parallel monthly fills | Supported | Clinically appropriate distinction; different levels of concern and follow-up | cdc-2022 |
| 8. Coordinated dual prescribing is acceptable | Strongly supported | CDC explicitly endorses; document coordination | cdc-2022 |

OE-offered deep-dive: _"Would you like to explore the specific documentation elements and risk-mitigation steps (e.g., naloxone prescribing, urine drug testing, treatment agreements) that the CDC 2022 guideline recommends at the inherited-patient first visit?"_ — captured in Follow-up Prompts section (FU-3).

---

## Bundle 3 — Controlled substance agreement

```
- A new controlled substance agreement should be completed when the PCP
  becomes the prescriber of record on transfer, even if the prior
  provider had one on file.
- Required elements of a CS agreement for chronic opiate therapy
  include: single prescriber, single pharmacy, UDS monitoring, no early
  refills, no replacement for lost or stolen medications, no patient
  self-adjustment of dose, and acknowledgment that the goal of therapy
  is functional improvement (not pain elimination).
- The PCP is not obligated to prescribe a Schedule II opiate without a
  signed CS agreement; refusing to prescribe in the face of categorical
  unexplained refusal is institutionally supported and chart-defensible.
- Reviewing the agreement with the patient at the first visit is a
  documentation standard AND a clinical opportunity to assess
  understanding and signal that this is a managed relationship.
- "Functional improvement, not pain elimination" is the recognized
  goal-of-therapy framing for chronic non-cancer opiate prescribing in
  primary care.
- Is there a recognized source (CDC 2022, ASAM, AAFP, state medical
  board guidance) that establishes a standard set of required elements
  for a primary care chronic-opiate CS agreement?
```

**Bundle 3 findings:**

_OE Bundle 3 run 2026-05-03. Verbatim response below; tracker rows 25–28 touched. **Headline correction:** Row 26's "required elements" framing is overstated — CDC 2022 explicitly avoided specifying OTA content; APS/AAPM 2009 says "insufficient evidence to guide specific recommendations on which provisions to include"; no nationally standardized required-element list exists. Two new content gaps surfaced: patient-abandonment warning when refusing to prescribe without CSA, and PEG-scale-based 30% improvement threshold._

Below is a claim-by-claim analysis with genuine pushback where warranted.

---

**Claim 1: A new controlled substance agreement should be completed when the PCP becomes the prescriber of record on transfer, even if the prior provider had one on file.**

**Verdict: Supported as best practice, but not a universal legal mandate.** No national guideline explicitly states that a new agreement must be executed upon provider transfer. However, the CDC 2022 guideline specifically addresses inherited patients: "Clinicians seeing new patients already using opioid medication should establish treatment goals, including functional goals, for continued opioid therapy" and recommends that clinicians "clearly document a treatment plan including specific functional goals in advance of prescribing".[ref:cdc-2022] The American Academy of Neurology recommends a signed treatment agreement "at the initiation of COAT and annually".[ref:aan-franklin-2014] The American Pain Society (APS/AAPM) guideline similarly recommends written management plans to "clarify the plan with the patient, the patient's family, and other clinicians".[ref:aps-aapm-chou-2009]

Operationally, this claim is reasonable and defensible because: (a) the prior agreement was between the patient and a different clinician — it does not bind the new prescriber; (b) a 2024 legal landscape review found that **27 states now mandate OTAs**, and in many of those jurisdictions the requirement is triggered by long-term prescribing, meaning a new prescriber inheriting the patient would need to satisfy the mandate independently; and (c) documentation of a new agreement protects the incoming clinician in both civil and criminal litigation contexts.[ref:svirsky-milbank-2024] However, the claim should be framed as "strongly recommended best practice and often legally required" rather than a blanket universal requirement, since 23 states plus DC do not mandate OTAs by statute.

**Nuance for NY:** NY I-STOP mandates PDMP checks before prescribing controlled substances but does **not** independently mandate a written OTA by statute.[ref:brown-dad-2017][ref:blum-jsat-2016][ref:virani-psychs-2018] The OTA requirement in NY typically derives from institutional policy or health system standards, not from I-STOP itself. The PCP should verify their institution's specific policy.

---

**Claim 2: Required elements of a CS agreement include single prescriber, single pharmacy, UDS monitoring, no early refills, no replacement for lost/stolen medications, no patient self-adjustment of dose, and acknowledgment that the goal of therapy is functional improvement (not pain elimination).**

**Verdict: Partially supported — these are commonly included elements, but there is no nationally standardized "required" element list.** The CDC 2022 guideline explicitly acknowledged that "clinical evidence reviews did not find studies evaluating the effectiveness of written agreements or treatment plans" and deliberately avoided prescribing specific OTA content.[ref:cdc-2022] The APS/AAPM guideline lists provisions that "may include: obtaining opioids from one prescriber, filling opioid prescriptions at one designated pharmacy, random urine drug screens, office visits at a specified minimum interval, use of pill counts, limited prescriptions" but explicitly states "there is insufficient evidence to guide specific recommendations on which provisions to include".[ref:aps-aapm-chou-2009]

The HIVMA/IDSA guideline describes a model agreement with two components — informed consent (goals, risks, adverse effects) and a plan of care (therapies, monitoring procedures including UDT, pill counts, PDMP use, and circumstances for modification/discontinuation).[ref:bruce-cid-2017] The ACOEM Opioid Treatment Agreement template includes functional goals, acknowledgment that pain will not disappear entirely, and driving/safety restrictions.[ref:acoem-2017-otc]

Pushback on specific elements:

- **Single prescriber/single pharmacy:** Commonly included but the CDC 2022 guideline intentionally moved away from rigid rules. These are reasonable risk-mitigation provisions but should not be presented as federally mandated.
- **No replacement for lost/stolen medications:** This is a common institutional policy element but is not specified in any major national guideline. It is a practice-level decision.
- **No patient self-adjustment of dose:** Reasonable and widely included, but not guideline-specified.
- **UDS monitoring:** The CDC 2022 guideline softened the 2016 language, recommending toxicology screening "as appropriate" rather than mandating it universally. The AAFP summary of the 2022 CDC guideline notes the guidelines "are careful to avoid strict requirements and limit the role of dosing thresholds, urine toxicology, and the prescription drug monitoring program".[ref:arnold-aafp-2023]
- **Functional improvement goal:** This is the one element with the strongest guideline backing (see Claim 5 below).

**Accurate version for the decision-support tool:** Frame these as "commonly included elements consistent with best practice" rather than "required elements." The tool should note that specific mandated content varies by state law and institutional policy, and that no single national source establishes a universal checklist.

---

**Claim 3: The PCP is not obligated to prescribe a Schedule II opioid without a signed CS agreement; refusing to prescribe in the face of categorical unexplained refusal is institutionally supported and chart-defensible.**

**Verdict: Largely supported, with important caveats.** No federal or state law compels a physician to prescribe a controlled substance. The CDC 2022 guideline explicitly states that clinicians should "discuss expectations for clinician and patient responsibilities to mitigate risks of opioid therapy" before prescribing.[ref:cdc-2022] The APS/AAPM guideline supports written management plans particularly "for patients at higher risk for misuse".[ref:aps-aapm-chou-2009] In states where OTAs are legally mandated, prescribing without one could expose the clinician to regulatory liability.[ref:svirsky-milbank-2024]

**Critical caveat — the CDC 2022 guideline also warns against patient abandonment:** "Clinicians should avoid dismissing patients from care and should ensure (provide or arrange) appropriate care for patients with pain".[ref:cdc-2022] Refusing to prescribe is defensible; refusing to provide any care pathway is not. The chart documentation should reflect:

1. The agreement was offered and explained
2. The patient declined to sign (with the patient's stated reason, if any)
3. The clinician offered alternatives (non-opioid pain management, referral to pain specialist, bridge prescription with short interval follow-up)
4. The rationale for not prescribing without the agreement

The phrase "categorical unexplained refusal" in the claim is operationally useful but should be documented carefully — the note should reflect that the clinician explored the patient's concerns and offered accommodations (e.g., literacy assistance, language interpretation, time to review) before concluding the refusal was categorical.

---

**Claim 4: Reviewing the agreement with the patient at the first visit is a documentation standard AND a clinical opportunity to assess understanding and signal that this is a managed relationship.**

**Verdict: Supported.** The CDC 2016 guideline (Recommendation 3) states: "Before starting and periodically during opioid therapy, clinicians should discuss with patients known risks and realistic benefits of opioid therapy and patient and clinician responsibilities for managing therapy".[ref:cdc-2016] The CDC 2022 guideline reinforces that "patient education and discussion before starting opioid therapy are critical" and lists specific elements that are "essential for communication and discussion".[ref:cdc-2022] A national survey found that reviewing agreements with patients was primarily done by prescribers (80%) and took an average of 13 minutes.[ref:laks-jgim-2021]

The framing as a "clinical opportunity" is well-supported. The HIVMA/IDSA guideline emphasizes that the term "agreement" (rather than "contract") "reinforces the shared decision making valued in a therapeutic patient-provider relationship".[ref:bruce-cid-2017] A 2021 ethics analysis raised concerns that OTAs can stigmatize patients and exacerbate racial disparities when implemented with excessive physician discretion, which argues for the review being genuinely collaborative rather than purely compliance-oriented.[ref:beck-jme-2021]

**Operational note:** Document that the agreement was reviewed verbally, that the patient demonstrated understanding, and that questions were addressed. This converts the agreement from a mere signature-collection exercise into defensible evidence of informed consent and shared decision-making.

---

**Claim 5: "Functional improvement, not pain elimination" is the recognized goal-of-therapy framing for chronic non-cancer opioid prescribing in primary care.**

**Verdict: Strongly supported.** This is one of the most clearly and consistently endorsed principles across guidelines. The CDC 2022 guideline states: **"Emphasize improvement in function as a primary goal and that function can improve even when pain is not eliminated"** and instructs clinicians to "be explicit and realistic about expected benefits of opioids, explaining that there is not robust evidence that opioids improve pain or function with long-term use and that complete elimination of pain is unlikely".[ref:cdc-2022] The CDC 2016 guideline similarly states: "Emphasize improvement in function as a primary goal and that function can improve even when pain is still present".[ref:cdc-2016] Both guidelines define clinically meaningful improvement as a **30% improvement in scores for both pain and function** using tools such as the PEG scale.[ref:cdc-2022][ref:cdc-2016]

The ACOEM Opioid Treatment Agreement template explicitly includes: "Opioids may also be prescribed to make my pain more tolerable, but these medications will not cause the pain to disappear entirely".[ref:acoem-2017-otc] The APS/AAPM guideline counsels that "total pain relief with COT is rare" and that "improvement averages less than 2-3 points on a 0 to 10 scale".[ref:aps-aapm-chou-2009]

**Minor nuance:** The CDC 2022 guideline acknowledges exceptions — "for some patients with diseases typically associated with progressive functional impairment or catastrophic injuries such as spinal cord trauma, reductions in pain without improvement in physical function might be more realistic".[ref:cdc-2022] The decision-support tool should include this carve-out so that clinicians do not rigidly apply the functional-improvement frame to patients for whom it is inappropriate.

---

**Claim 6: Is there a recognized source that establishes a standard set of required elements for a primary care chronic-opioid CS agreement?**

**Verdict: No single authoritative source establishes a nationally standardized, universally required element list.** This is a significant gap. The evidence shows:

- The **CDC 2022 guideline** deliberately avoids specifying OTA content and notes the absence of evidence for written agreements' effectiveness.[ref:cdc-2022]
- The **APS/AAPM 2009 guideline** provides a sample management plan (Appendix 7) and lists possible provisions but explicitly states "there is insufficient evidence to guide specific recommendations on which provisions to include".[ref:aps-aapm-chou-2009]
- The **AAN 2014 position paper** recommends a signed treatment agreement "that adequately addresses the risks of COAT and the responsibilities of the patient" but does not enumerate specific required elements.[ref:aan-franklin-2014]
- The **ACOEM** published a combined Opioid Consent Form and Treatment Agreement template that is the closest thing to a standardized document, including functional goals, risk acknowledgment, and driving restrictions.[ref:hegmann-joem-2014][ref:acoem-2017-otc]
- The **HIVMA/IDSA 2017 guideline** describes a two-component model (informed consent + plan of care) with the most structured framework.[ref:bruce-cid-2017]
- A **2024 legal landscape review** found that among the 27 states mandating OTAs, there is "substantial variation and flexibility within OTA requirements" regarding mandated terms.[ref:svirsky-milbank-2024]
- A **2014 systematic review of 13 opioid prescribing guidelines** found that "most guidelines agree that opioid risk assessment tools, written treatment agreements, and urine drug testing can mitigate risks" but noted variable development methods and limited evidence.[ref:nuckols-aim-2014]

**Operational recommendation for the decision-support tool:** Rather than citing a single authoritative checklist, the tool should state that OTA content should be guided by (1) applicable state law, (2) institutional policy, and (3) best-practice consensus elements drawn from multiple guidelines. The tool could present a composite checklist clearly labeled as "consensus-derived, not from a single mandate," incorporating the elements most consistently recommended across sources: informed consent regarding risks/benefits, functional goals, monitoring plan (PDMP, UDS frequency), single-prescriber/single-pharmacy provisions, conditions for modification or discontinuation, and naloxone offering.

---

**Summary of corrections (Bundle 3, OE-provided):**

| Claim | Status | Key Correction | References |
|-------|--------|----------------|------------|
| New agreement on transfer | Best practice, not universal mandate | Frame as "strongly recommended and often legally required" — verify state law and institutional policy | cdc-2022, aan-franklin-2014, svirsky-milbank-2024 |
| "Required elements" list | **Overstated** | No national standard checklist exists; label as "consensus-derived common elements" | cdc-2022, aps-aapm-chou-2009 |
| Right to refuse prescribing without agreement | Supported | **Must document alternatives offered and avoid patient abandonment** | cdc-2022, aps-aapm-chou-2009 |
| Review at first visit as documentation standard | Supported | Document verbal review, patient understanding, and collaborative discussion | cdc-2022, cdc-2016, laks-jgim-2021, bruce-cid-2017 |
| Functional improvement framing | Strongly supported | **Add 30% improvement on PEG scale; add carve-out for progressive/catastrophic conditions** | cdc-2022, cdc-2016 |
| Single authoritative source for OTA elements | **Does not exist** | Use composite from CDC 2022, APS/AAPM, ACOEM, HIVMA/IDSA, and state law; label accordingly | cdc-2022, aps-aapm-chou-2009, hegmann-joem-2014, bruce-cid-2017 |

OE-offered deep-dive: _"Would you like to explore how specific state OTA mandates (e.g., New York vs. other states where this tool might be deployed) differ in their legally required elements and how to operationalize a state-adaptive checklist?"_ — captured in Follow-up Prompts section (FU-4).

---

## Bundle 4 — UDS interpretation & cadence

```
- Point-of-care immunoassay UDS ("the cup test") has meaningful false-
  positive and false-negative rates and should not be the basis for
  clinical action against a patient.
- Confirmation with GC-MS or LC-MS/MS is required before discharge,
  termination, or other adverse clinical action based on a screening
  UDS.
- A UDS negative for the prescribed opiate suggests one of: (a)
  diversion or stockpiling (most concerning), (b) dose-timing artifact
  (less common with chronic dosing), (c) metabolic variant affecting
  detection.
- Risk-stratified UDS cadence is appropriate for chronic opiate
  patients: stable (clean PDMP, signed agreement, no behavioral
  concerns) every 6–12 months; yellow-flag every 3 months; active
  concerns or recent escalation at every visit until stable.
- The PCP should document the reasoning behind the chosen UDS interval.
- A non-accusatory framing ("I want to make sure we understand this
  result together before drawing any conclusions") is the appropriate
  response to an unexpected UDS result, including before send-out
  confirmation.
- A UDS positive for cocaine in a chronic opiate patient is an OUD
  evaluation trigger — consider MOUD rather than simply discontinuing
  the opiate, which elevates overdose risk from illicit opioid use.
- A UDS positive for non-prescribed fentanyl is a high-acuity finding
  indicating illicit street-opioid use (supplementing or substituting),
  and is an OUD/MOUD conversation rather than a prescription
  continuation decision.
- Is there an established guideline (ASAM, CDC, AAFP) that specifies
  the 6–12 month / 3 month / every-visit risk-stratified UDS cadence
  used in this module, or is this primarily institutional convention?
```

**Bundle 4 findings:**

_OE Bundle 4 run 2026-05-03. Verbatim response below; tracker rows 29–33 first-touch; rows 60–63 refined. **Headline corrections:** (a) the differential for absent prescribed opiate (row 32) is significantly incomplete — module's 3-item list omits wrong-assay-ordered, running-out-early-from-undertreated-pain, specimen manipulation, lab error; (b) CDC 2022 explicitly DECLINED to recommend risk-stratified UDS cadence (row 33), citing poor predictive accuracy of risk assessment tools — module's tiers should be labeled "institutional convention informed by AAPM/APS consensus," not CDC; (c) cocaine-positive UDS (row 60) requires comprehensive SUD evaluation, not just OUD screening — cocaine doesn't itself diagnose OUD; (d) fentanyl-positive UDS (row 62) requires technical caveats about supply cross-contamination + fentanyl-test-strip education. New gap rows added._

Below is a claim-by-claim verification against current evidence and guidelines.

---

**Claim 1: POC immunoassay UDS has meaningful false-positive and false-negative rates and should not be the basis for clinical action against a patient.**

**Supported.** The CDC 2022 Guideline (Recommendation 10) explicitly states that "false positive and false negative presumptive results are not uncommon" and that this problem is "compounded because clinicians commonly misinterpret results, leading to inappropriate consequences for patients".[ref:cdc-2022] Analytically, POC immunoassays demonstrate suboptimal positive predictive values — as low as 57% for oxycodone on some platforms — and poor negative predictive values for several drug classes (e.g., 25–29% for THC-COOH) when compared to LC-MS/MS.[ref:abou-cb-2021] A 2026 review of false-positive interferences across 61 studies confirmed that immunoassay screens remain presumptive and require confirmation by GC-MS or LC-MS/MS.[ref:saitman-jat-2026] The AAFP similarly states that "all results are considered presumptive until confirmatory testing is performed".[ref:kale-aafp-2019]

One nuance: the claim as stated ("should not be the basis for clinical action against a patient") is correct for adverse/punitive actions (discharge, termination, dose reduction). However, POC results can appropriately inform preliminary safety decisions such as withholding a same-day prescription pending confirmation, increasing monitoring frequency, or initiating a conversation — these are not "actions against" the patient.[ref:mahajan-aa-2017][ref:cdc-2022] The operational distinction for the PCP is: a screening result can trigger a clinical conversation and a confirmatory send-out, but should not trigger discharge, termination, or documentation of a "violation."

---

**Claim 2: Confirmation with GC-MS or LC-MS/MS is required before discharge, termination, or other adverse clinical action based on a screening UDS.**

**Supported with important qualification.** The CDC 2022 Guideline states confirmatory testing "should be used when toxicology results will inform decisions with major clinical or nonclinical implications for the patient".[ref:cdc-2022] The ASAM guideline similarly reserves confirmatory testing for resolving unexpected screening results.[ref:asam-baxter-2017] The ACMT position statement reinforces that specific confirmatory assays are needed to differentiate individual opioids and metabolites.[ref:stolbach-jmt-2022]

The qualification: the CDC 2022 Guideline goes further than just requiring confirmation — it states that **clinicians should not dismiss patients from care on the basis of a toxicology test result at all**, even a confirmed one.[ref:cdc-2022] Dismissal "could have adverse consequences for patient safety, potentially including the patient obtaining opioids from alternative sources and the clinician missing opportunities to facilitate treatment for substance use disorder".[ref:cdc-2022] So the claim is correct but understates the guideline position: confirmation is necessary but not sufficient for adverse action. Even confirmed unexpected results should prompt a clinical response (MOUD evaluation, increased monitoring, naloxone, referral) rather than termination.

---

**Claim 3: A UDS negative for the prescribed opiate suggests (a) diversion/stockpiling, (b) dose-timing artifact, or (c) metabolic variant.**

**Partially supported — the list is incomplete.** Published differential diagnoses for an absent prescribed opioid are broader. A JAMA review lists the following categories:[ref:alford-jama-2013]

- Drug is absent (not taken in past 72 hours): **diversion**, **hoarding/stockpiling**, or **pharmacologic induction causing rapid metabolism**
- Specimen manipulation: **dilution or adulteration** (including substitution of synthetic urine)
- Drug is present but below assay cutoff (dose-timing artifact, low-dose/PRN use)
- Wrong assay ordered (e.g., standard opiate immunoassay does not detect oxycodone, fentanyl, methadone, buprenorphine)
- Laboratory error (mislabeling, cross-reaction causing interference)

The HIVMA/IDSA guideline adds **urine dilution from uncontrolled diabetes mellitus** and **running out early due to undertreated pain** (the patient used more than prescribed and has none left) as distinct from simple diversion.[ref:bruce-cid-2017] The AAPM consensus adds **pharmacogenetic anomalies** and **drug-drug interactions** affecting metabolism.[ref:aapm-argoff-2018]

Operationally, the PCP should document consideration of all of these possibilities. "Metabolic variant" is real but rare; **wrong assay ordered** and **running out early** are far more common explanations that the module should include. Notably, the NCCN table highlights that patients taking opioids PRN may have negative results based on infrequent use patterns outside the detection window.[ref:nccn-cancer-pain-2026]

---

**Claim 4: Risk-stratified UDS cadence — stable every 6–12 months, yellow-flag every 3 months, active concerns at every visit.**

**Partially supported — this is a reasonable institutional convention, not a specific guideline recommendation.** The CDC 2016 Guideline recommended UDS "at least annually" for all patients on chronic opioid therapy but did not risk-stratify the UDS interval.[ref:cdc-2016] The CDC 2022 Guideline softened this to "periodically (at least annually)" and explicitly noted that "predicting risk is challenging, and available tools do not allow clinicians to reliably identify patients who are at low risk" — the CDC deliberately declined to recommend risk-stratified UDS cadence.[ref:cdc-2022]

The AAPM consensus (Argoff et al. 2018) does endorse risk-stratified monitoring and summarizes existing guidelines as recommending every 6 months to 2 years for low-risk, 1–3 times per year for moderate-risk, and 2–4 times per year for high-risk patients.[ref:aapm-argoff-2018] The American Pain Society (2009) suggested that low-risk stable patients might be monitored every 3–6 months.[ref:aps-aapm-chou-2009] These ranges are broadly consistent with the module's cadence but are not identical to the specific "6–12 / 3 / every visit" tiers.

The PCP should document the rationale for the chosen interval. The module's cadence is defensible but should be framed as institutional policy informed by expert consensus, not as a specific CDC or ASAM recommendation.

---

**Claim 5: The PCP should document the reasoning behind the chosen UDS interval.**

**Supported.** The AAPM consensus recommends that "a summary of communications and discussions about results with the laboratory and other experts can be included in the medical record to document the medical necessity of testing and related clinical decision-making".[ref:aapm-argoff-2018] The CDC 2022 Guideline emphasizes that clinicians should "have a plan for responding to unexpected results" before ordering testing.[ref:cdc-2022] CMS and payer policies require documentation of medical necessity for definitive testing.[ref:aapm-argoff-2018] Documentation of the risk assessment and monitoring rationale is standard of care for medicolegal protection and is consistent with all major guidelines.

---

**Claim 6: Non-accusatory framing is the appropriate response to an unexpected UDS result.**

**Strongly supported.** The CDC 2022 Guideline states clinicians should "explain to patients that toxicology testing will not be used punitively (e.g., will not be used to dismiss patients from care) and is intended to improve their safety" and should "ask patients about use of prescribed medications and other substances and ask whether there might be unexpected results".[ref:cdc-2022] The AAPM consensus recommends that "communications with patients about the purpose and results of UDM should be nonjudgmental and nonpunitive and should focus on safety" and suggests asking "If we test you today, what will we find in your urine? Will there be any surprises?".[ref:aapm-argoff-2018] The AAFP summary of the CDC 2022 Guideline similarly states that "results should not be used in a punitive manner".[ref:arnold-aafp-2023]

The specific phrasing in the module ("I want to make sure we understand this result together before drawing any conclusions") is consistent with this guidance. The CDC 2022 Guideline also notes that "discussion with patients before specific confirmatory testing can sometimes yield a candid explanation of why a particular substance is present or absent and obviate the need for confirmatory testing on that visit".[ref:cdc-2022]

---

**Claim 7: Cocaine-positive UDS in a chronic opioid patient is an OUD evaluation trigger — consider MOUD rather than simply discontinuing the opioid.**

**Supported in principle, though the reasoning requires refinement.** The CDC 2022 Guideline (Recommendation 12) directs clinicians to "offer or arrange evidence-based treatment (usually medication-assisted treatment with buprenorphine or methadone in combination with behavioral therapies) for patients with opioid use disorder".[ref:cdc-2016] The guideline explicitly warns against dismissal from care and states that unexpected results should prompt the clinician to "offer or refer patients for substance use disorder treatment".[ref:cdc-2022] An NEJM review states that "opioid use disorder in patients with chronic pain is an indication for more care rather than less" and that "a punitive approach, such as dismissal from care, is counterproductive and places patients at greater risk for overdose if they transition from pharmaceutical opioids to illicit ones".[ref:babu-nejm-2019]

Important nuance: **cocaine use does not by itself diagnose OUD** — it may indicate a stimulant use disorder, polysubstance use, or co-occurring substance use disorders. The appropriate response is a comprehensive SUD evaluation (not just OUD screening), which may lead to MOUD if OUD criteria are met, but should also address the stimulant use disorder itself. Abrupt opioid discontinuation in this context is associated with increased overdose risk, particularly among patients with concurrent OUD.[ref:kennedy-plos-2022][ref:cdc-2022] The operational step is: confirm the result → conduct a structured SUD assessment → prescribe naloxone → consider MOUD if OUD criteria are met → do not reflexively discontinue the opioid prescription.

---

**Claim 8: Non-prescribed fentanyl positive is a high-acuity finding indicating illicit street-opioid use and is an OUD/MOUD conversation.**

**Supported, with critical technical caveats.** The CDC 2022 Guideline notes that "testing for fentanyl is not available in widely used toxicology assays, potentially leading to false assurance".[ref:cdc-2022] This means that if fentanyl is detected, it was likely tested for specifically (via a fentanyl-specific immunoassay or definitive testing), which increases the reliability of the result. In the current drug supply, non-prescribed fentanyl is overwhelmingly illicit, and its presence in a patient not prescribed fentanyl is a high-acuity finding consistent with illicit opioid exposure.

Caveats for the PCP:

- **Cross-contamination of the drug supply**: Fentanyl may be present in counterfeit pills or mixed into non-opioid drugs (cocaine, methamphetamine, benzodiazepines). The patient may not know they were exposed to fentanyl. This does not reduce the acuity of the finding but changes the counseling approach.
- **Confirm the result**: Standard immunoassay panels often do not include fentanyl; if detected on a POC cup, confirm with LC-MS/MS.[ref:cdc-2022]
- The clinical response should include naloxone prescribing, fentanyl test strip education, structured OUD assessment, and MOUD discussion — framed as a safety intervention, not a punitive one.[ref:babu-nejm-2019][ref:cdc-2022]

The claim's characterization as "an OUD/MOUD conversation rather than a prescription continuation decision" is well-aligned with CDC guidance. Abrupt discontinuation in this scenario carries the highest overdose risk.[ref:kennedy-plos-2022][ref:cdc-2022][ref:fda-oxycodone]

---

**Claim 9: Is there an established guideline specifying the 6–12 month / 3 month / every-visit risk-stratified UDS cadence?**

**No single guideline specifies this exact cadence.** The module's tiers are a reasonable synthesis of multiple sources but are not drawn verbatim from any one guideline:

| Source | Low Risk | Moderate Risk | High Risk |
|--------|----------|---------------|-----------|
| CDC 2016 | At least annually | At least annually (no risk stratification) | At least annually |
| CDC 2022 | "Periodically (at least annually)" — explicitly declines risk stratification | Same | Same |
| AAPM Consensus (Argoff 2018) | Every 6 months–2 years | 1–3 times/year | ≥2–4 times/year |
| APS/AAPM (Chou 2009) | Every 3–6 months (stable) | More frequent | Weekly if very high risk |
| **Module** | Every 6–12 months | Every 3 months | Every visit |

The module's cadence is closest to the AAPM consensus recommendations but compresses the high-risk tier to "every visit," which is more aggressive than published guidelines (which suggest 2–4 times/year or individualized).[ref:aapm-argoff-2018] The "every visit" frequency is more consistent with the APS recommendation for "very high risk" patients.[ref:aps-aapm-chou-2009] The PCP should document this as institutional policy and note that the CDC 2022 Guideline intentionally avoids specifying risk-stratified intervals due to the poor predictive accuracy of risk assessment tools.[ref:cdc-2022]

---

**Summary of operational corrections (Bundle 4, OE-provided):**

1. The differential for absent prescribed opioid should be expanded to include **wrong assay ordered**, **running out early/undertreated pain**, **specimen dilution/adulteration**, and **laboratory error** — not just diversion, timing, and metabolism.
2. The cocaine-positive scenario should trigger a **comprehensive SUD evaluation** (not just OUD screening), since cocaine use indicates stimulant use disorder that also requires attention.
3. The fentanyl-positive scenario should include counseling about **cross-contamination of the drug supply** — the patient may not have intentionally used an opioid.
4. The risk-stratified UDS cadence should be labeled as **institutional convention informed by expert consensus**, not attributed to a specific guideline. The CDC 2022 Guideline deliberately avoids risk-stratified UDS intervals.
5. The tool should emphasize that even **confirmed** unexpected results should not trigger dismissal from care — the CDC 2022 position is stronger than "confirm before acting."

OE-offered deep-dive: _"Would you like to explore how to operationalize the structured SUD assessment workflow (e.g., DSM-5 OUD criteria, TAPS tool, or NIDA screening) that should follow an unexpected UDS result in this inherited-patient context?"_ — captured in Follow-up Prompts (FU-5).

---

## Bundle 5 — Opiate-benzo combination

```
- Concurrent opioid and benzodiazepine use increases overdose mortality
  risk by a factor of 3–4 compared to opioids alone.
- Both drug classes cause respiratory depression through different
  mechanisms; the combination is synergistic, not merely additive.
- The FDA issued its black box warning on the opioid + benzodiazepine
  combination in 2016 (year-of-issuance accuracy check).
- An inherited patient on both opiates and a benzodiazepine cannot be
  continued on the unchanged combination at first visit without a
  documented safety plan and specialist input.
- When inherited combination has legitimate dual indication, the
  appropriate first-visit move is: prescribe whichever is more
  immediately necessary (typically the opiate if chronic pain is the
  primary indication), document the combination as a known risk,
  prescribe naloxone, and initiate the e-consult urgently.
- Specialist input — psychiatry for the benzo or pain management for
  the opiate, depending on which medication is driving the
  combination — is required before the PCP owns both prescriptions on
  an ongoing basis.
- Benzo taper in a chronically dependent patient should not be
  initiated unilaterally at first visit because abrupt reduction risks
  withdrawal seizure.
- The benzo taper plan should be coordinated with psychiatry and kept
  separate from the opiate management conversation so the patient is
  not facing two simultaneous tapers.
```

**Bundle 5 findings:**

_OE Bundle 5 run 2026-05-03. Verbatim response below; tracker rows 52–59 refined. **Headline corrections:** (a) "3–4× overdose mortality" (row 52) is partially supported but oversimplified — range is 2–5× depending on population/outcome/duration, with risk highest in first 90 days and dropping after 180 days of stable concurrent use; (b) "synergistic" mechanism (row 53) refined — benzos primarily contribute via sedation + airway obstruction + loss of protective reflexes, not classic central-drive synergy; (c) **"cannot continue without safety plan + specialist input" (row 55) is overstated** — CDC 2022 Cat B = "particular caution," not "avoid"; PCP can continue stable regimen with documentation, naloxone, PDMP check + specialist referral initiated; (d) **"prescribe whichever more immediately necessary" (row 56) is problematic** — should continue BOTH at current doses, not choose one; withholding either risks withdrawal/destabilization; (e) "specialist input required" (row 57) not supported as hard requirement; strongly recommended but not mandated. New gap rows for time-dependent risk, ASAM 2025 every-3-month reassessment, and MOUD-before-benzo-taper sequencing._

Below is a claim-by-claim analysis with genuine pushback where warranted.

---

**Claim 1: Concurrent opioid + benzodiazepine use increases overdose mortality risk by a factor of 3–4 compared to opioids alone.**

**Partially supported but oversimplified.** The CDC 2022 guideline (Recommendation 11) cites a case-cohort study showing "a near-quadrupling of risk for overdose death" with concurrent benzodiazepine prescription compared to opioid prescription alone.[ref:cdc-2022] However, the broader literature shows a wide range of effect sizes depending on the outcome measured and the population studied. A large retrospective analysis of privately insured patients found an adjusted OR of **2.14** for opioid overdose-related ED visit or hospitalization.[ref:sun-bmj-2017] A Kaiser Permanente study found only a **20% increase** in overdose risk for opioid + benzodiazepine users vs. opioid-only users.[ref:cho-jgim-2020] A Medicare study found the risk is highly time-dependent: the hazard ratio was **5.05** in the first 90 days of concurrent use but dropped to non-significant levels after 180 days of stable concurrent use.[ref:hernandez-jamaopen-2018]

**Operational correction:** The "3–4×" figure is defensible only when citing the specific case-cohort study referenced by the CDC for overdose *death*. For a decision-support tool, it would be more accurate to state that the risk increase ranges from roughly 2× to 5× depending on the population, outcome, dose, and duration, and that the risk is highest in the early period of concurrent use and at higher doses. Long-term, stable, low-dose concurrent use carries lower (though still elevated) risk.[ref:hernandez-jamaopen-2018][ref:cdc-2022]

---

**Claim 2: Both drug classes cause respiratory depression through different mechanisms; the combination is synergistic, not merely additive.**

**Partially supported but the "synergistic" characterization is more nuanced than stated.** Opioids depress the ventilatory response to hypercapnia via mu-opioid receptors in brainstem respiratory centers. Benzodiazepines act on GABA-A receptors and, at standard doses, have **minimal effects on ventilation on their own** but can potentiate opioid-induced respiratory depression.[ref:florian-jama-2022] A 2025 FDA-sponsored RCT in healthy volunteers found that midazolam + oxycodone did *not* significantly decrease hypercapnic ventilatory response compared to oxycodone alone, but did increase resting end-tidal CO₂ and caused 60% of participants to fall asleep or snore (vs. 0% on oxycodone alone), suggesting the mechanism involves **upper airway obstruction and loss of protective reflexes** rather than purely additive central respiratory drive suppression.[ref:gershuny-bja-2025] Pharmacologically, the interaction through colocalized mu-opioid and GABA receptors has been described as synergistic in dopaminergic and respiratory pathways.[ref:horsfall-bcpt-2017]

**Operational correction:** The claim that the combination is "synergistic, not merely additive" is a reasonable clinical shorthand, but the precise mechanism is still being elucidated. The most current evidence suggests benzodiazepines primarily contribute to overdose risk by causing sedation, loss of airway protective reflexes, and upper airway obstruction rather than through a classic pharmacodynamic synergy on central respiratory drive.[ref:gershuny-bja-2025] For a decision-support tool, stating that "benzodiazepines potentiate opioid-induced respiratory depression through complementary mechanisms" is more accurate than claiming strict pharmacologic synergy.

---

**Claim 3: The FDA issued its black box warning on the opioid + benzodiazepine combination in 2016.**

**Correct.** In **2016**, the FDA required that drug labeling for both benzodiazepines and opioids include boxed warnings about the increased potential for respiratory depression with simultaneous use.[ref:florian-jama-2022] This is confirmed in current FDA labeling for both opioids (e.g., oxycodone) and benzodiazepines (e.g., lorazepam/Ativan).[ref:fda-oxycodone][ref:fda-lorazepam] No correction needed.

---

**Claim 4: An inherited patient on both opioids and a benzodiazepine cannot be continued on the unchanged combination at first visit without a documented safety plan and specialist input.**

**Overstated relative to guidelines.** No major guideline (CDC 2022, VA/DoD 2022, ASAM 2025) mandates that the combination *cannot* be continued at the first visit without specialist input. The CDC 2022 guideline (Recommendation 11) is a **Category B recommendation** — meaning "use particular caution" rather than "avoid" — and explicitly acknowledges that "in specific situations, benzodiazepines can be beneficial, and stopping benzodiazepines can be destabilizing" and that "long-term, stable use might be safer than erratic, unpredictable use".[ref:cdc-2022] The guideline recommends consultation with specialists "if needed" and "as appropriate," not as a prerequisite for continuing prescriptions.[ref:cdc-2022]

The ASAM 2025 Joint Guideline on Benzodiazepine Tapering recommends risk-benefit assessment at least every 3 months and prescribing naloxone, but does not require specialist input before continuing the combination.[ref:asam-acmt-2025-benzo]

**Operational correction:** At the first visit, the PCP *can* continue both medications at current doses if the patient is on a long-term, stable regimen, provided the following are documented:

1. PDMP check performed
2. Risk-benefit assessment documented (including dose, duration, other risk factors)
3. Naloxone prescribed or offered[ref:asam-acmt-2025-benzo]
4. Plan for follow-up within a shorter interval (e.g., 2–4 weeks rather than 3 months) given the high-risk regimen[ref:cdc-2022]
5. Specialist consultation *initiated* (not necessarily completed) if there is concern about the indication for either medication or if tapering is being considered[ref:cdc-2022]

Refusing to prescribe both at the first visit risks destabilizing the patient and is explicitly cautioned against by the CDC 2022 guideline's expert working group.[ref:cdc-2022]

---

**Claim 5: When the inherited combination has a legitimate dual indication, the appropriate first-visit move is to prescribe whichever is more immediately necessary (typically the opioid), document the combination as a known risk, prescribe naloxone, and initiate the e-consult urgently.**

**Partially supported but the "prescribe only one" framing is problematic.** No guideline recommends withholding one of two chronically prescribed medications at the first visit when the patient has legitimate indications for both and is on a stable regimen. The CDC 2022 guideline explicitly warns against abrupt changes that could destabilize patients.[ref:cdc-2022] The VA/DoD 2022 guideline similarly states that abrupt discontinuation of benzodiazepines should be avoided due to risk of seizures and death.[ref:vadod-2022]

The naloxone prescription and documentation of risk are well-supported: the ASAM 2025 guideline makes prescribing naloxone a **strong recommendation** for all patients co-prescribed opioids and benzodiazepines.[ref:asam-acmt-2025-benzo] Initiating specialist consultation is reasonable and supported.

**Operational correction:** At the first visit, the PCP should **continue both medications at current doses** (not choose one), document the combination as a known risk, prescribe naloxone, check the PDMP, and initiate the specialist referral. Withholding the benzodiazepine risks withdrawal seizure; withholding the opioid risks withdrawal and uncontrolled pain. The decision-support tool should frame this as "bridge both, document, and refer" rather than "choose one."

---

**Claim 6: Specialist input — psychiatry for the benzo or pain management for the opioid — is required before the PCP owns both prescriptions on an ongoing basis.**

**Not supported as a hard requirement by any major guideline.** The CDC 2022 guideline recommends that clinicians "communicate with mental health professionals managing the patient" and consider "consultation with other specialists (e.g., an addiction specialist) if needed".[ref:cdc-2022] The VA/DoD 2022 guideline similarly recommends providers "consider obtaining a specialty consultation, as appropriate".[ref:vadod-2022] The ASAM 2025 guideline recommends coordinating care with other prescribers but does not mandate specialist sign-off.[ref:brunner-jgim-2025]

**Operational correction:** Specialist consultation is **strongly recommended** but not a prerequisite for ongoing PCP management. Many PCPs manage both prescriptions, particularly in settings with limited specialist access. The decision-support tool should frame this as: "Specialist input is strongly recommended and should be actively pursued, but the PCP may continue managing both prescriptions with appropriate documentation of risk-benefit assessment, naloxone provision, PDMP monitoring, and regular reassessment at least every 3 months".[ref:asam-acmt-2025-benzo][ref:cdc-2022] State-level regulations (e.g., NY I-STOP) may impose additional requirements — these should be verified separately as they vary by jurisdiction.

---

**Claim 7: Benzodiazepine taper in a chronically dependent patient should not be initiated unilaterally at first visit because abrupt reduction risks withdrawal seizure.**

**Strongly supported.** The CDC 2022 guideline states that "clinicians should taper benzodiazepines gradually before discontinuation because abrupt withdrawal can be associated with rebound anxiety, hallucinations, seizures, delirium tremens, and, rarely, death".[ref:cdc-2022] The ASAM 2025 Joint Guideline emphasizes that "clinicians should not discontinue BZDs abruptly in patients who are likely to be physically dependent and at risk of withdrawal" and that tapering should be individualized based on patient response.[ref:brunner-jgim-2025] The NEJM review on benzodiazepine dependence recommends gradual discontinuation over 4–8 weeks minimum, with hospitalization considered for very high doses (≥100 mg diazepam equivalent daily).[ref:soyka-nejm-2017]

> "In patients receiving opioid maintenance therapy, the dose of the opioid (e.g., methadone) should be kept stable throughout the benzodiazepine-reduction period and high enough to prevent symptoms of opioid withdrawal… Concurrent opioid detoxification is not recommended."
> — Michael Soyka, M.D., Ludwig Maximilian University

**Minor nuance:** The claim says "should not be initiated unilaterally at first visit," which is correct as a practical matter, but the reason is not just seizure risk — it is also that the first visit lacks the therapeutic relationship, baseline assessment, and coordination needed for safe tapering. The AAFP guidance emphasizes that successful deprescribing requires patient education, shared decision-making, and frequent dialogue.[ref:robertson-aafp-2023]

---

**Claim 8: The benzodiazepine taper plan should be coordinated with psychiatry and kept separate from the opioid management conversation so the patient is not facing two simultaneous tapers.**

**Partially supported with important nuance.** The principle of avoiding simultaneous tapers is well-supported. The NEJM review explicitly states that "concurrent opioid detoxification is not recommended" during benzodiazepine tapering, and that the opioid dose should be kept stable throughout the benzodiazepine reduction period.[ref:soyka-nejm-2017] The CDC 2022 guideline states that decisions about which medication to taper first "should be individualized" and lists options including tapering opioids first, tapering benzodiazepines first, or transitioning to buprenorphine before tapering benzodiazepines.[ref:cdc-2022] A 2023 scoping review found that among 26 guidelines addressing concurrent use, **zero** provided specific guidance on deprescribing sequence, and the 4 that addressed it gave **conflicting recommendations**.[ref:wang-jcm-2023]

**Operational corrections:**

- Coordinating with psychiatry is recommended but not mandated — the CDC says to "communicate with mental health professionals managing the patient." If no psychiatrist is involved, the PCP or an addiction specialist can manage the taper.[ref:cdc-2022]
- The claim that the taper should be "kept separate from the opioid management conversation" is reasonable as a clinical strategy to avoid overwhelming the patient, but it is not a guideline recommendation per se. The CDC 2022 guideline notably shifted from the 2016 version (which suggested it "might be safer and more practical to taper opioids first") to a more individualized approach in 2022.[ref:cdc-2016][ref:cdc-2022]
- The ASAM 2025 guideline recommends that patients with OUD should be stabilized on MOUD *before* initiating a benzodiazepine taper, which is an important sequencing consideration not captured in the claim.[ref:asam-acmt-2025-benzo][ref:brunner-jgim-2025]

---

**Summary (Bundle 5, OE-provided):**

| Claim | Verdict | Key Correction | References |
|-------|---------|----------------|------------|
| 1. Overdose mortality risk 3–4× | Partially supported | Range is ~2–5× depending on population/outcome/duration; highest early in concurrent use | cdc-2022, sun-bmj-2017, cho-jgim-2020, hernandez-jamaopen-2018 |
| 2. Synergistic respiratory depression | Partially supported | Benzodiazepines primarily contribute via sedation/airway obstruction, not classic synergy on central drive | gershuny-bja-2025, florian-jama-2022, horsfall-bcpt-2017 |
| 3. FDA black box warning in 2016 | Correct | No correction needed | florian-jama-2022, fda-oxycodone, fda-lorazepam |
| 4. Cannot continue combination without safety plan + specialist | **Overstated** | PCP can continue stable regimen with documentation, naloxone, PDMP check; specialist input recommended but not required | cdc-2022, vadod-2022 |
| 5. Prescribe only the more necessary medication at first visit | **Problematic** | Continue both at current doses; withholding either risks withdrawal/destabilization | asam-acmt-2025-benzo, cdc-2022, vadod-2022 |
| 6. Specialist required before PCP owns both prescriptions | Not supported as hard requirement | Strongly recommended, not mandated; PCP can manage with appropriate safeguards | cdc-2022, asam-acmt-2025-benzo |
| 7. Do not initiate benzo taper at first visit | Strongly supported | Correct; abrupt reduction risks seizure, and first visit lacks baseline for safe tapering | cdc-2022, brunner-jgim-2025, soyka-nejm-2017 |
| 8. Keep benzo taper separate from opioid taper | Partially supported | Avoid simultaneous tapers is well-supported; sequencing should be individualized; coordinate with but not necessarily defer to psychiatry | cdc-2022, soyka-nejm-2017, wang-jcm-2023 |

**Key 2024–2025 Update:** The ASAM Joint Clinical Practice Guideline on Benzodiazepine Tapering (published 2025, developed with 9 partner societies) is the most comprehensive new resource and should be incorporated into any decision-support tool.[ref:asam-acmt-2025-benzo][ref:brunner-jgim-2025] It provides specific recommendations for the co-prescribed population, including mandatory naloxone provision, risk-benefit reassessment at least every 3 months, and guidance on sequencing tapers in patients with co-occurring opioid use disorder.

OE-offered deep-dive: _"Would you like to explore the specific operational workflow for the inherited-patient first visit — including what to document, which PDMP elements to check, and how to structure the naloxone conversation — based on these guidelines?"_ — captured in Follow-up Prompts (FU-6).

---

## Bundle 6 — High-dose inherited patient (≥ 90 MME/day)

```
- Continuity of an established opiate regimen at an inherited high-dose
  visit while arranging specialist oversight is clinically and ethically
  defensible; abrupt discontinuation or reduction at first visit is not.
- Abrupt taper of a long-stable high-dose patient causes harm —
  undertreated pain, withdrawal, loss of function — and in some cases
  drives patients to illicit opioids.
- "Patient stable on X MME/day for Y years" is a meaningful clinical
  data point that does not by itself justify taper at first visit.
- The appropriate first-visit action at ≥ 90 MME/day is: document MME
  calculation, document threshold awareness, document safety measures
  (naloxone, UDS, PDMP), and document that pain-management e-consult is
  pending.
- The recommended e-consult ask at high dose is structured: dose / agent
  / indication / prior pain-management documentation / PDMP / UDS /
  functional status, then a 3-part question (appropriateness, taper
  recommendation, co-management indication).
- Patient threats to leave the practice if the inherited regimen is
  changed should not drive clinical decisions; the appropriate response
  is acknowledging the anxiety, completing the assessment, and
  documenting the conversation.
- Is there a recognized standard-of-care framework (CDC 2022, AAFP,
  ASAM) for the PCP inheriting an established adult patient at
  ≥ 90 MME/day with limited prior pain-management documentation?
```

**Bundle 6 findings:**

_OE Bundle 6 run 2026-05-03. Verbatim response below; tracker rows 7, 44, 48–51 refined. **Headline corrections:** (a) row 44 (abrupt-taper-harm) **strongly supported** with Agnoli JAMA 2021 (n=113,618; IRR 1.68 overdose, 2.28 mental-health crisis, 3.30 suicide attempt; dose-dependent); (b) **row 49 (first-visit documentation list) is incomplete** — module's checklist is missing OUD screening (TAPS/DAST), mental-health screening, functional status (PEG), concurrent-benzo check, and treatment-goals establishment; (c) **row 50 (e-consult template) is not guideline-attributable** — reasonable workflow design but should be relabeled as institutional best practice; (d) row 7 / green-zone framing benefits from explicit citation of CDC 2022 Recs 2/5/7/8/9. New gap rows for continuity-as-bridge, gradual-taper-may-improve-outcomes, comprehensive first-visit checklist, and patient-distress-as-clinical-signal._

Below is a claim-by-claim verification against current evidence and guidelines. The overall direction of the decision-support tool is well-aligned with the CDC 2022 guideline, FDA safety communications, and emerging evidence, but several claims require sharpening or qualification.

---

**Claim 1: Continuity of an established opioid regimen at an inherited high-dose visit while arranging specialist oversight is clinically and ethically defensible; abrupt discontinuation or reduction at first visit is not.**

**Supported.** The CDC 2022 guideline (Recommendation 5) explicitly states that "opioid therapy should not be discontinued abruptly, and clinicians should not rapidly reduce opioid dosages from higher dosages" unless there are life-threatening signs such as impending overdose.[ref:cdc-2022] The guideline further warns that payers and health systems "should ensure that policies based on cautionary dosage thresholds do not result in rapid tapers or abrupt discontinuation of opioids" and should not "penalize clinicians for accepting new patients who are receiving opioids for chronic pain".[ref:cdc-2022] The FDA has separately advised that risks of rapid tapering or sudden discontinuation in physically dependent patients include acute withdrawal, pain exacerbation, serious psychological distress, and suicidal ideation.[ref:cdc-2022]

Nuance: Continuity is defensible only in the absence of **life-threatening safety signals** at the first visit (e.g., sedation, respiratory depression, slurred speech, evidence of active diversion). If such signals are present, dose reduction or discontinuation may be warranted even at the first encounter.[ref:cdc-2022] Additionally, "continuity" does not mean indefinite passive prescribing — the CDC 2022 guideline expects the new clinician to establish treatment goals, including functional goals, and to reassess within 3 months or sooner.[ref:cdc-2022] The claim should specify that continuity is a bridge strategy, not an endpoint.

---

**Claim 2: Abrupt taper of a long-stable high-dose patient causes harm — undertreated pain, withdrawal, loss of function — and in some cases drives patients to illicit opioids.**

**Supported, with strong evidence.** A large JAMA cohort study (Agnoli et al., 2021; n = 113,618) found that opioid dose tapering in patients on stable, long-term, higher-dose therapy was associated with significantly increased rates of **overdose** (adjusted IRR 1.68) and **mental health crisis** (adjusted IRR 2.28), including suicide attempts (adjusted IRR 3.30).[ref:agnoli-jama-2021] Critically, the risk was dose-dependent: patients tapering from ≥300 MME/day had the highest absolute risk increases.[ref:agnoli-jama-2021] The CDC 2022 guideline cites evidence that discontinuation of long-term, high-dose therapy has been associated with mental health crisis, overdose events, overdose death, and heroin use.[ref:cdc-2022] The HHS 2019 tapering guidance and the FDA safety communication both specifically warn about transition to illicit opioids.[ref:agnoli-jama-2021][ref:cdc-2022]

> "In a large cohort of patients in the US prescribed stable, long-term, higher-dose opioids, undergoing opioid dose tapering was associated with statistically significant risk of subsequent overdose and mental health crisis, including suicidality."
> — Alicia Agnoli, MD, MPH, MHS et al., UC Davis Department of Family and Community Medicine

Nuance: The evidence is strongest for **rapid** taper and **discontinuation**; the CDC 2022 guideline notes that when patients agree to taper and it is done gradually (≤10% per month) with behavioral support, outcomes including pain, function, and quality of life can actually improve.[ref:cdc-2022] The claim as written is accurate for abrupt taper but should not be read as evidence that all tapering is harmful. The AAFP summary notes that for patients on opioids ≥1 year, tapers can take months to years.[ref:arnold-aafp-2023]

---

**Claim 3: "Patient stable on X MME/day for Y years" is a meaningful clinical data point that does not by itself justify taper at first visit.**

**Supported.** The CDC 2022 guideline (Recommendation 5) frames the decision to taper as a weighing of benefits versus risks for the individual patient, not as an automatic response to a dose threshold.[ref:cdc-2022] The 2022 guideline explicitly moved away from the rigid dose thresholds of the 2016 version, and the AAFP editorial commentary on the 2022 guideline notes that "these guidelines are careful to avoid strict requirements and limit the role of dosing thresholds".[ref:arnold-aafp-2023] Stability on a regimen is clinically relevant because dose variability itself is a risk factor for overdose, whereas sustained stable therapy carries a different risk profile.[ref:cdc-2022]

Nuance and pushback: **Stability alone is also not sufficient to justify indefinite continuation without reassessment.** The CDC 2022 guideline requires that the new clinician establish whether benefits (sustained improvement in pain and function) outweigh risks, even for stable patients.[ref:cdc-2022] A patient "stable on X MME for Y years" with no documented functional benefit, no prior pain evaluation, and no risk mitigation measures in place is not the same as a patient with well-documented functional improvement. The claim is correct that stability does not justify taper at first visit, but the tool should also note that stability does not exempt the patient from a structured benefit-risk reassessment, which should be initiated at the first visit and completed within 1–3 months.[ref:cdc-2022]

---

**Claim 4: The appropriate first-visit action at ≥90 MME/day is: document MME calculation, document threshold awareness, document safety measures (naloxone, UDS, PDMP), and document that pain-management e-consult is pending.**

**Largely supported, with important qualifications.** The CDC 2022 guideline recommends that clinicians seeing new patients on long-term opioid therapy should: establish treatment goals including functional goals; review PDMP data; offer naloxone (particularly at ≥50 MME/day); screen for OUD and mental health comorbidities; and use urine drug testing to assess risk (though not punitively).[ref:cdc-2022][ref:arnold-aafp-2023] Documenting the MME calculation and threshold awareness is consistent with the 2016 guideline's recommendation to "carefully justify" dosages ≥90 MME/day and with the general opioid stewardship documentation framework.[ref:cdc-2016][ref:coffin-am-2022]

Nuance and pushback on several points:

- **Pain management e-consult is not universally required by guidelines.** The CDC 2016 guideline recommended "considering consulting a pain specialist" at ≥90 MME/day if there is no improvement in pain/function or if dosages are escalating. The CDC 2022 guideline softened this, stating clinicians should "carefully weigh benefits and risks" and work with patients, but does not mandate specialist consultation at any specific threshold. Seeking specialist input is reasonable and defensible practice, but framing it as "the appropriate first-visit action" overstates the guideline requirement. The tool should present it as **strongly recommended** rather than mandatory.[ref:cdc-2016][ref:cdc-2022]
- **Missing from the checklist:** The CDC 2022 guideline also expects the clinician to screen for OUD, assess mental health comorbidities (depression, anxiety), assess functional status (e.g., PEG scale), and check for concurrent benzodiazepine use at the first visit. These are at least as important as documenting threshold awareness and should be added.[ref:cdc-2022]
- **NY I-STOP:** New York's I-STOP law mandates PDMP consultation before prescribing any controlled substance. This is a legal requirement, not merely a guideline recommendation, and should be documented as such in the tool for NY-based clinicians.[ref:brown-dad-2017][ref:blum-jsat-2016]

---

**Claim 5: The recommended e-consult ask at high dose is structured: dose/agent/indication/prior pain-management documentation/PDMP/UDS/functional status, then a 3-part question (appropriateness, taper recommendation, co-management indication).**

**Not derived from any specific published guideline.** No CDC, AAFP, ASAM, or VA/DoD guideline prescribes a specific e-consult template or structured question format for pain management referrals. The elements listed (dose, agent, indication, PDMP, UDS, functional status) are individually supported by the CDC 2022 guideline's recommended assessment domains, and the 2016 guideline recommended consultation with pain specialists at ≥90 MME/day when function is not improving.[ref:cdc-2022][ref:cdc-2016] However, the specific 3-part question structure is a **reasonable clinical workflow design**, not an evidence-based standard.

Operational recommendation: This claim should be reframed as "a structured e-consult template consistent with CDC-recommended assessment domains" rather than "the recommended e-consult ask." The data elements are sound. The 3-part question is a practical framework that could be cited as institutional best practice or quality improvement, but attributing it to a specific guideline would be inaccurate.

---

**Claim 6: Patient threats to leave the practice if the inherited regimen is changed should not drive clinical decisions; the appropriate response is acknowledging the anxiety, completing the assessment, and documenting the conversation.**

**Supported by guideline principles.** The AAFP summary of the CDC 2022 guideline states that "when a consensus cannot be reached, physicians should acknowledge the discordance, express empathy, and implement patient-centered treatment changes **without abandoning the patient**".[ref:arnold-aafp-2023] The CDC 2022 guideline explicitly warns against dismissing patients from practice based on PDMP findings or opioid-related concerns.[ref:cdc-2022] The VA/DoD 2022 guideline emphasizes a "collaborative, patient-centered approach" and notes that providers "should encourage patients to discuss previous experiences, including successes or difficulties".[ref:sandbrink-aim-2023]

Nuance: The claim is correct that threats should not drive decisions, but the tool should also note that **patient distress at the prospect of dose changes is a clinically meaningful signal** — it may reflect undertreated pain, anxiety, or features of opioid use disorder, all of which warrant assessment rather than dismissal.[ref:sandbrink-aim-2023][ref:blanco-lancet-2019] The documentation should capture not just the threat but the clinical assessment of what is driving it. Additionally, the CDC 2022 guideline emphasizes that clinicians have "a responsibility to provide or arrange for coordinated management" and should not abandon patients.[ref:cdc-2022]

---

**Claim 7: Is there a recognized standard-of-care framework (CDC 2022, AAFP, ASAM) for the PCP inheriting an established adult patient at ≥90 MME/day with limited prior pain-management documentation?**

**Yes, but it is distributed across multiple guideline recommendations rather than presented as a single unified protocol.** The closest to a consolidated framework comes from synthesizing CDC 2022 Recommendations 2, 5, 7, 8, and 9, the AAFP summary, and the primary care management review by Coffin et al. (2022).[ref:cdc-2022][ref:arnold-aafp-2023][ref:coffin-am-2022] The VA/DoD 2022 guideline provides complementary recommendations.[ref:sandbrink-aim-2023] A recent AAFP review (Sonoda & Wakabayashi, 2025) provides an opioid-tapering decision algorithm that begins with OUD screening before any taper decision.[ref:sonoda-aafp-2025] A 2025 NEJM review on opioid deprescribing provides an international comparison of tapering frameworks.[ref:lin-nejm-2025]

An operationalized first-visit framework synthesized from these sources would include:

1. **Continue the current regimen** (absent life-threatening safety signals)[ref:cdc-2022]
2. **Calculate and document total MME/day**[ref:cdc-2016]
3. **Review PDMP** (mandatory under NY I-STOP)[ref:cdc-2022][ref:brown-dad-2017]
4. **Order UDS** (baseline, non-punitive)[ref:arnold-aafp-2023]
5. **Offer/prescribe naloxone**[ref:cdc-2022]
6. **Screen for OUD** (e.g., TAPS, DAST) and mental health comorbidities[ref:cdc-2022]
7. **Assess functional status** (e.g., PEG scale) and establish treatment goals[ref:cdc-2022]
8. **Check for concurrent benzodiazepines** or other CNS depressants[ref:cdc-2022]
9. **Document rationale** for continuing opioid therapy and the plan for reassessment[ref:coffin-am-2022]
10. **Arrange pain management consultation** if function is not improving, documentation is limited, or dosage is ≥90 MME/day without clear justification[ref:cdc-2016]
11. **Schedule follow-up** within 1–3 months (more frequently if high-risk features)[ref:cdc-2022]

No single guideline packages all of these into a "first visit for inherited patients" checklist, but each element is individually supported. The tool would be strengthened by citing the specific CDC 2022 recommendation numbers rather than presenting the framework as a monolithic standard.

---

**Summary (Bundle 6, OE-provided):**

- Claims 1–3 and 6 are well-supported but need sharpening (continuity is a bridge, not an endpoint; stability requires reassessment; patient distress warrants clinical assessment)
- Claim 4 is mostly correct but incomplete (add OUD screening, mental health screening, benzodiazepine check, functional assessment) and should distinguish legal mandates (I-STOP) from guideline recommendations
- Claim 5 is a reasonable workflow but should not be attributed to any specific guideline
- Claim 7 is answered affirmatively, but the framework is a synthesis, not a single published protocol

OE-offered deep-dive: _"Would you like to explore how to operationalize the OUD screening component at the inherited-patient first visit, including which validated tools are most practical in primary care and when to initiate buprenorphine?"_ — captured in Follow-up Prompts (FU-7).

---

## Bundle 7 — Behavioral flags & lost medications

```
- Early-refill threshold ladder for chronic opiate patients in primary
  care: 1 request → conversation + documentation; 2+ in 12 months →
  formal written warning within the CS agreement framework + UDS +
  PDMP review; 3+ in 12 months → e-consult before continuation.
- The PCP should document each early-refill instance at the time it
  occurs, because patterns are only visible in retrospect if individual
  events are in the chart.
- Frequent between-visit patient contact around controlled substances
  (calls or portal messages requesting early refills, dose increases,
  or exceptions) is itself a behavioral red flag worth noting in the
  chart.
- Establishing and communicating in writing a protocol that controlled-
  substance questions are handled only at scheduled visits is an
  appropriate primary care practice pattern.
- Schedule II opiates are not replaced for loss or theft as a matter of
  institutional policy. (The ADHD verification flagged the analogous
  ADHD claim as institutional policy rather than federal DEA
  regulation; verify the same characterization holds for opiates.)
- Offering to help the patient file a police report when medication is
  reported stolen is reasonable practice — it creates a record without
  altering the no-replacement decision.
- A single loss event is not disqualifying for future prescribing but
  should be noted and factored into the monitoring picture.
- Is there a published threshold (CDC 2022, state board, institutional
  consensus) that establishes 2+ early fills in 12 months as a
  documented warning trigger for chronic opiate patients, or is this
  primarily institutional convention?
```

**Bundle 7 findings:**

_OE Bundle 7 run 2026-05-03. Verbatim response below; tracker rows 67–73 refined. **Headline corrections:** (a) row 67's "1/2+/3+ early-refill ladder" is **NOT supported by any published guideline** — institutional convention only; closest published data point is APS/AAPM "4+ aberrant behaviors of any type" predicting SUD; (b) row 70's "CS questions only at scheduled visits" needs an **exception pathway for urgent clinical concerns** — blanket policy could create safety risks; (c) UDS should be **baseline monitoring for all chronic-opiate patients**, not triggered only by early refills (current row 67 wording implies threshold-triggered UDS); (d) aberrant behaviors require a **differential diagnosis** (undertreated pain, psychiatric comorbidity, social stressors, OUD), not automatic assumption of misuse — pairs with row 60 (cocaine UDS) + row 84 (non-dismissal). New gap rows for UDS-as-baseline + exception-pathway._

This is a comprehensive set of claims. Below is a claim-by-claim analysis against current evidence, guidelines, and regulatory frameworks.

---

**Claim 1: Early-refill threshold ladder (1 request → conversation; 2+ → formal warning + UDS + PDMP; 3+ → e-consult)**

**Verdict: Not supported by any published guideline as a specific threshold ladder. This is institutional convention, not evidence-based standard.**

No published guideline — including the CDC 2022 Opioid Prescribing Guideline, the VA/DoD 2022 guideline, the APS/AAPM 2009 guideline, or ASAM — specifies numeric thresholds for early-refill requests that trigger escalating interventions.[ref:cdc-2022][ref:aps-aapm-chou-2009][ref:vadod-2022] The general framework of graduated response to aberrant behaviors is well-supported, but the specific numbers (1, 2, 3) are fabricated thresholds.

What the evidence actually supports:

- The APS/AAPM 2009 guideline notes that "one or two episodes of unauthorized opioid escalations" in low-risk patients can often be managed with education and enhanced monitoring, while "repeatedly nonadherent" patients or those with "four or more previous aberrant drug-related behaviors" may require consultation, restructuring, or discontinuation. This is the closest published threshold, but it counts all aberrant behaviors (not just early refills) and uses 4+ as the inflection point for concern about substance use disorder.[ref:aps-aapm-chou-2009]
- The VA/DoD 2022 guideline lists "using more than prescribed and/or running out early" as a factor indicating need for more frequent follow-up, without specifying a count.[ref:vadod-2022]
- The CDC 2022 guideline deliberately avoids rigid thresholds and emphasizes individualized clinical judgment.[ref:arnold-aafp-2023]

**Operational correction:** The ladder is reasonable as an institutional protocol, but should be labeled as such. The tool should state: "This escalation framework is a practice-level convention; no published guideline specifies numeric early-refill thresholds." The PDMP review component is actually understated — under NY I-STOP, PDMP review is **mandatory before every controlled substance prescription**, not just at the 2+ threshold.[ref:brown-dad-2017][ref:blum-jsat-2016] UDS should also be part of baseline monitoring for all patients on chronic opioid therapy, not triggered only by early refills.[ref:cdc-2016][ref:jannetto-jalm-2018]

---

**Claim 2: Document each early-refill instance at the time it occurs because patterns are only visible in retrospect**

**Verdict: Supported as sound clinical practice, though not stated in exactly this form in any guideline.**

The APS/AAPM 2009 guideline recommends that monitoring "should include documentation of pain intensity and level of functioning, assessments of progress towards achieving therapeutic goals, presence of adverse events, and adherence to prescribed therapies".[ref:aps-aapm-chou-2009] The CDC 2016 and 2022 guidelines both emphasize ongoing documentation of benefits, harms, and adherence at each encounter.[ref:cdc-2022][ref:cdc-2016] The principle that real-time documentation of individual events enables retrospective pattern recognition is a documentation best practice rather than a guideline-specific recommendation, but it is fully consistent with the standard of care for controlled substance prescribing and with medicolegal documentation standards.[ref:webster-pmr-2015]

**Operational note:** This claim is accurate and defensible. The ACOEM Opioid Treatment Contract template explicitly includes language about medication adherence monitoring.[ref:acoem-2017-otc] Documentation should include the date of the request, the reason given, the clinical response, and any monitoring actions taken.

---

**Claim 3: Frequent between-visit contact around controlled substances (calls, portal messages requesting early refills, dose increases, exceptions) is itself a behavioral red flag**

**Verdict: Supported, with important nuance.**

Early refill requests and unsanctioned dose escalation requests are well-established as **aberrant drug-related behaviors** in the pain management literature.[ref:paice-jco-2016][ref:kaye-painphys-2017a][ref:kaye-painphys-2017b] The ASCO guideline explicitly categorizes "a pattern of early refills" as an aberrant behavior, though one on the less serious end of the spectrum.[ref:paice-jco-2016] The Delphi study by Merlin et al. (2018) identified "asking for an increase in opioid dose" and "using more opioid medication than prescribed" among the most common concerning behaviors encountered in long-term opioid therapy.[ref:merlin-jgim-2018]

**Critical nuance:** The CDC 2022 guideline and the APS/AAPM guideline both emphasize that aberrant behaviors have a **differential diagnosis** — they may reflect undertreated pain, psychiatric comorbidity, social stressors, or opioid use disorder, not exclusively misuse.[ref:cdc-2022][ref:aps-aapm-chou-2009] The 2022 CDC guideline specifically warns against using monitoring findings in a punitive manner.[ref:arnold-aafp-2023] Documenting the pattern is appropriate; interpreting it requires clinical assessment.

**Operational correction:** The tool should frame this as: "Frequent between-visit controlled substance contact is a behavioral signal warranting documentation and clinical assessment — not an automatic indicator of misuse." The differential should include inadequate pain control, anxiety, functional decline, and psychosocial crisis alongside misuse/diversion.

---

**Claim 4: Establishing a written protocol that controlled-substance questions are handled only at scheduled visits is appropriate**

**Verdict: Partially supported as a practice management strategy, but requires qualification.**

Controlled substance agreements (also called patient-provider agreements or opioid treatment agreements) are recommended by multiple professional societies and the Federation of State Medical Boards.[ref:alford-jama-2013][ref:acoem-2017-otc][ref:jannetto-jalm-2018][ref:bruce-cid-2017] These agreements commonly include provisions about how and when prescriptions will be managed. The HIVMA/IDSA guideline describes the PPA as including a "plan of care" that specifies how treatment will be evaluated and modified.[ref:bruce-cid-2017]

However, **no guideline specifically endorses restricting all controlled-substance communication to scheduled visits.** The CDC 2022 guideline emphasizes that follow-up should occur at least every 3 months and more frequently for higher-risk patients, and that telehealth may be appropriate in some settings.[ref:cdc-2022] A blanket policy refusing to address urgent controlled-substance concerns between visits could create safety risks (e.g., a patient in acute pain crisis, a patient experiencing withdrawal due to a pharmacy issue, or a patient reporting concerning symptoms).

**Operational correction:** The policy should be framed as: "Routine controlled-substance management decisions (refill timing, dose adjustments) are addressed at scheduled visits. Urgent clinical concerns will be triaged appropriately." This preserves the structure while avoiding a rigid policy that could delay necessary clinical responses.

---

**Claim 5: Schedule II opiates are not replaced for loss or theft as a matter of institutional policy (not DEA regulation)**

**Verdict: Correct characterization — this is institutional/practice policy, not a federal prohibition.**

There is **no federal DEA regulation that prohibits a prescriber from writing a new prescription for a Schedule II controlled substance to replace one that was lost or stolen.** Under 21 CFR Part 1306, a prescriber with a valid DEA registration may issue a new Schedule II prescription at their clinical discretion. The prohibition on "refills" for Schedule II substances (21 CFR 1306.12) means a pharmacy cannot dispense additional quantities on the same prescription, but a prescriber can write an entirely new prescription.[ref:osborne-jmwh-2017][ref:webster-pmr-2015]

The ACOEM Opioid Treatment Contract template includes the language: "I understand that lost, damaged, or stolen medication will NOT be replaced" — framed as a condition of the treatment agreement, not as a legal requirement.[ref:acoem-2017-otc] This is a widely adopted institutional risk-management practice, not a regulatory mandate.

**Operational note:** The tool correctly identifies this as institutional policy. The PCP should understand that while replacement is legally permissible, most practice policies and controlled substance agreements prohibit it as a risk-mitigation measure. If a practice chooses to make an exception, it should be documented with clinical reasoning.

---

**Claim 6: Offering to help the patient file a police report when medication is reported stolen is reasonable practice**

**Verdict: Supported as reasonable practice, consistent with published treatment agreement templates.**

The ACOEM Opioid Treatment Contract explicitly states: "I agree to immediately report stolen opioid medication(s) to the police. My provider will also produce a police report if requested to do so".[ref:acoem-2017-otc] This establishes a precedent for clinician involvement in the reporting process. Offering to assist with filing a police report serves multiple purposes: it creates an external record, it communicates the seriousness of the situation, and it may deter fabricated theft claims.

**Operational note:** This is a reasonable and defensible practice. The key point is that the police report is a documentation step, not a replacement trigger. The clinician should document the offer and the patient's response regardless of whether a report is filed.

---

**Claim 7: A single loss event is not disqualifying for future prescribing but should be noted and factored into the monitoring picture**

**Verdict: Supported by the general framework of graduated response to aberrant behaviors.**

The APS/AAPM 2009 guideline explicitly states that less serious aberrant behaviors (including isolated episodes) can be managed with education and enhanced monitoring rather than discontinuation.[ref:aps-aapm-chou-2009] The CDC 2022 guideline warns against dismissing patients or abruptly discontinuing opioids based on single concerning findings, emphasizing that doing so "can adversely affect patient safety".[ref:cdc-2022] The Delphi consensus study similarly found that experts agreed "stopping opioids is not important initially" when concerning behaviors arise, but that tapering or discontinuation may become appropriate if initial approaches fail.[ref:merlin-jgim-2018]

**Operational note:** This claim is well-aligned with current guidance. A single loss event should trigger: documentation of the event, review of the PDMP, possible UDS, a conversation about secure medication storage, and notation in the controlled substance agreement file. It should not automatically trigger discontinuation.

---

**Claim 8: Is there a published threshold establishing 2+ early fills in 12 months as a documented warning trigger?**

**Verdict: No. No published guideline, CDC recommendation, state board standard, or institutional consensus document establishes "2+ early fills in 12 months" as a specific threshold.**

As detailed in Claim 1, the closest published data point is the APS/AAPM finding that **4+ aberrant drug-related behaviors** (of any type, not limited to early refills) predicted current substance use disorder.[ref:aps-aapm-chou-2009] The VA/DoD 2022 guideline identifies running out early as a factor for more frequent follow-up without specifying a count.[ref:vadod-2022] The CDC 2022 guideline deliberately moved away from rigid thresholds, and the AAFP summary of the 2022 guideline notes that the new guidance "walks back the legacy of their own 2016 guidance" and is "careful to avoid strict requirements".[ref:arnold-aafp-2023]

**Operational recommendation:** The "2+ in 12 months" threshold is a reasonable institutional convention but should be transparently labeled as such in the decision-support tool. The tool should note: "This threshold is a practice-level standard, not derived from published guidelines. Clinical judgment should guide the response to any early-refill request, considering the patient's overall risk profile, the reason for the request, and the pattern of behavior."

---

**Summary of corrections (Bundle 7, OE-provided):**

- The escalation ladder is institutional convention — label it as such and do not imply guideline endorsement of specific numeric thresholds
- PDMP review in New York (I-STOP) is mandatory before every controlled substance prescription, not just at escalation thresholds[ref:brown-dad-2017][ref:blum-jsat-2016]
- UDS should be part of baseline monitoring, not triggered only by early refills[ref:cdc-2016][ref:jannetto-jalm-2018]
- Aberrant behaviors require a differential diagnosis (undertreated pain, psychiatric comorbidity, etc.), not automatic assumption of misuse[ref:cdc-2022][ref:aps-aapm-chou-2009]
- The "scheduled visits only" policy needs an exception pathway for urgent clinical concerns
- The no-replacement policy is correctly characterized as institutional, not federal DEA regulation
- The CDC 2022 guideline explicitly warns against punitive application of monitoring findings and against patient dismissal based on monitoring data[ref:cdc-2022][ref:arnold-aafp-2023]

OE-offered deep-dive: _"Would you like to explore how the CDC 2022 guideline's emphasis on avoiding punitive monitoring practices can be operationalized within a structured controlled-substance agreement framework?"_ — captured in Follow-up Prompts (FU-8).

---

## Bundle 8 — OUD recognition & MOUD pathway

```
- Chronic non-cancer pain and opioid use disorder coexist more often
  than they are mutually exclusive; a patient can have both
  simultaneously.
- Signs of OUD alongside chronic pain include: continued use despite
  clear harm, inability to adhere to the agreed prescribing structure
  despite genuine effort, loss of control over use, withdrawal symptoms
  driving use more than pain relief, and social or functional
  deterioration attributable to opioid use.
- MOUD (medication for opioid use disorder — buprenorphine, methadone,
  naltrexone) significantly outperforms taper or discontinuation for
  patient outcomes including overdose survival.
- Buprenorphine (Suboxone) for OUD can be initiated in primary care and
  is within the scope of a PCP without DEA X-waiver requirements
  (post-Mainstreaming Addiction Treatment Act, 2023).
- Methadone for OUD requires an OTP (Opioid Treatment Program) clinic;
  it cannot be prescribed for OUD from a primary care office.
- A patient with suspected or confirmed OUD who is cut off from
  prescribed opioids without a treatment plan is at acute, elevated
  overdose risk from illicit opioid use (including fentanyl-
  contaminated supply).
- Continuity of the existing opiate prescription with close monitoring
  while an OUD evaluation and MOUD referral are pending is safer than
  discontinuation without a plan.
- The appropriate e-consult framing in this scenario shifts from
  "please review pain management plan" to "patient with chronic pain
  and possible OUD — please advise on MOUD candidacy and transition
  plan."
- OUD should not be framed as a moral failure in patient communication
  or in documentation.
```

**Bundle 8 findings:**

_OE Bundle 8 run 2026-05-03. Verbatim response below; tracker rows 74–80 refined. **Headline corrections:** (a) row 74 (chronic pain + OUD coexistence) verified-with-nuance — "more often than mutually exclusive" is directionally correct but could mislead; majority of chronic-pain LTOT patients do NOT meet OUD criteria (any-OUD prevalence 21–27%, mod-severe 4–9%); DSM-5 specifies tolerance/withdrawal don't count if solely from prescribed use; (b) **row 75 (informal sign list) needs replacement with formal DSM-5 11-criterion checklist**; (c) row 76 (MOUD outperforms taper) **must differentiate** buprenorphine + methadone (strong evidence; mortality reductions ~60% / 50%) from naltrexone (oral ≈ placebo; XR-NTX has 7–10 day opioid-free induction barrier); (d) row 78 (methadone OTP requirement) Verified but **needs important exceptions** added: 72-hour bridge rule, hospital exception, methadone-for-pain ≠ methadone-for-OUD; (e) row 77 buprenorphine-PCP-scope confirmed but **state-level constraints** may still apply post-MAT-Act; (f) row 80 (continuity safer than discontinuation without plan) **strongly supported** by Kennedy 2022 AHR 3.18 for OUD patients without OAT. New gap rows for DSM-5 checklist, MOUD differentiation, 72-hour rule, state-level constraints, person-first language._

Below is a claim-by-claim verification against current evidence and guidelines.

---

**Claim 1: Chronic non-cancer pain and OUD coexist more often than they are mutually exclusive; a patient can have both simultaneously.**

**Supported, with nuance.** The CDC 2022 Guideline explicitly states that "patients with co-occurring pain and substance use disorder require ongoing pain management that maximizes benefits relative to risks".[ref:cdc-2022] Studies using DSM-5 criteria in patients on long-term opioid therapy for pain find prevalence of **any OUD at 21–27%** and moderate-to-severe OUD at 4–9%.[ref:cdc-2022] A scoping review confirms that OUD "often co-occurs with chronic pain" and that assessment and treatment of these co-occurring disorders is complex.[ref:archambault-jcn-2024]

The phrase "more often than they are mutually exclusive" is directionally correct but could be misleading — the majority of chronic pain patients on opioids do not meet OUD criteria. The accurate framing is: co-occurrence is common enough that it should always be assessed, and the two conditions are not mutually exclusive. A key diagnostic nuance is that DSM-5 specifies tolerance and withdrawal should not count toward an OUD diagnosis if they occur solely in the context of opioids taken as prescribed.[ref:hasin-ajp-2022][ref:vadod-2022] Clinicians should use pain-adjusted diagnostic approaches to avoid over-diagnosing OUD in patients whose behaviors are driven purely by therapeutic intent.[ref:hasin-ajp-2022]

**Operational takeaway:** At the inherited-patient first visit, screen for OUD using DSM-5 criteria but apply the DSM-5 exclusion for tolerance/withdrawal occurring only in the context of prescribed use. Document the assessment explicitly.

---

**Claim 2: Signs of OUD alongside chronic pain include continued use despite clear harm, inability to adhere to prescribing structure despite genuine effort, loss of control over use, withdrawal symptoms driving use more than pain relief, and social/functional deterioration attributable to opioid use.**

**Partially supported — needs refinement.** The listed signs broadly map to DSM-5 criteria, but the claim conflates and oversimplifies them. The 11 DSM-5 criteria for OUD include: taking opioids in larger amounts or longer than intended, persistent desire or unsuccessful efforts to cut down, excessive time spent obtaining/using/recovering, craving, failure to fulfill role obligations, continued use despite social/interpersonal problems, giving up activities, use in physically hazardous situations, continued use despite physical/psychological problems caused or exacerbated by opioids, tolerance, and withdrawal.[ref:cdc-2022][ref:vadod-2022]

Key corrections:

- **"Inability to adhere to the agreed prescribing structure despite genuine effort"** is not a DSM-5 criterion per se. It may reflect "taking in larger amounts than intended" or "unsuccessful efforts to cut down," but the qualifier "despite genuine effort" is clinically important — it distinguishes compulsive use from intentional diversion or nonadherence for other reasons.
- **"Withdrawal symptoms driving use more than pain relief"** captures an important clinical observation but is not a standalone DSM-5 criterion. The DSM-5 withdrawal criterion counts only if withdrawal occurs outside the context of appropriate medical use. The concept of withdrawal-driven use overlapping with pain-driven use is precisely the diagnostic challenge that pain-adjusted instruments attempt to address.[ref:vadod-2022][ref:dsm5-2022][ref:hasin-ajp-2022]
- Hallmarks specifically highlighted in the clinical literature for chronic pain patients include emotional volatility, taking more medication than prescribed, using opioids for reasons other than pain, frequent loss of medication, and early refills.[ref:babu-nejm-2019]

**Operational takeaway:** Use the formal DSM-5 11-criterion checklist rather than an informal sign list. Document which criteria are met and whether behaviors are driven by therapeutic intent versus nontherapeutic motives. The AAFP summary of the CDC 2022 guideline and the VA/DoD guideline both provide structured approaches.[ref:arnold-aafp-2023][ref:vadod-2022]

---

**Claim 3: MOUD (buprenorphine, methadone, naltrexone) significantly outperforms taper or discontinuation for patient outcomes including overdose survival.**

**Supported for buprenorphine and methadone; substantially weaker for naltrexone.** This claim should not treat all three MOUDs as equivalent.

Buprenorphine reduces all-cause mortality by approximately **60% (RR 0.34, 95% CI 0.26–0.45)**, and methadone by approximately **50% (RR 0.47, 95% CI 0.41–0.54)**.[ref:harris-jama-2026] A large comparative effectiveness study found that only buprenorphine/methadone was associated with reduced overdose and opioid-related acute care use compared with no treatment; naltrexone, inpatient detoxification, and behavioral health interventions showed no significant benefit over no treatment during the 3-month follow-up.[ref:wakeman-jamaopen-2020] Withdrawal management and medication tapers are associated with high relapse rates and increased mortality.[ref:wakeman-nejmevid-2022][ref:buresh-bmj-2021]

Oral naltrexone is no more effective than placebo. Extended-release injectable naltrexone shows some benefit over no medication, but in intention-to-treat analyses it is inferior to buprenorphine due to induction barriers (patients must be opioid-free for 7–10 days).[ref:harris-jama-2026][ref:wakeman-nejmevid-2022][ref:blanco-lancet-2019] A network meta-analysis confirmed that all pharmacotherapies had higher retention than control, with methadone ranked highest, followed by buprenorphine, then naltrexone.[ref:lim-plosone-2022]

**Operational takeaway:** The claim is accurate for buprenorphine and methadone. When discussing MOUD with patients or in documentation, naltrexone should be presented as a second-line option with important caveats about induction difficulty and weaker mortality evidence. The decision-support tool should distinguish between the three agents.

---

**Claim 4: Buprenorphine for OUD can be initiated in primary care without DEA X-waiver requirements (post-MAT Act, 2023).**

**Supported.** The Mainstreaming Addiction Treatment (MAT) Act, enacted as part of the Consolidated Appropriations Act signed December 29, 2022 (effective January 2023), eliminated the DATA-2000 X-waiver requirement.[ref:lefevre-jabfm-2023][ref:acog-mate-2025][ref:ostrach-japha-2023] Any practitioner with a standard DEA registration and Schedule III prescribing authority can now prescribe buprenorphine for OUD with **no patient caps**.[ref:acog-mate-2025][ref:varisco-japha-2023] The only new requirement is that practitioners applying for a new or renewed DEA registration must complete **8 hours of training** on substance use disorders (self-attestation).[ref:acog-mate-2025]

One nuance: while the federal barrier is removed, **state-level regulations may still impose additional requirements** that are not aligned with the federal change.[ref:arnold-aafp-2023] The AAFP has noted that "many of us work under strict state requirements that are not aligned with this guidance".[ref:arnold-aafp-2023] Additionally, removing the X-waiver has increased the prescriber pool but has not yet translated into meaningful increases in patients receiving buprenorphine, suggesting that interest, comfort, and systems-level barriers remain the primary obstacles.[ref:lefevre-jabfm-2023][ref:christine-jamaopen-2024][ref:chua-nejm-2024]

**Operational takeaway:** The claim is federally accurate. The decision-support tool should prompt the PCP to verify their state's specific requirements and should note the 8-hour training attestation requirement for new/renewed DEA registrations. The tool should also provide practical initiation guidance, as the elimination of the X-waiver also eliminated the only structured OUD education many clinicians received.[ref:lefevre-jabfm-2023]

---

**Claim 5: Methadone for OUD requires an OTP; it cannot be prescribed for OUD from a primary care office.**

**Supported, with important exceptions.** Under current federal law, a DEA-registered prescriber **cannot prescribe methadone for OUD** to be filled at an outpatient pharmacy. Outpatient methadone for OUD can only be dispensed through SAMHSA-certified Opioid Treatment Programs (OTPs).[ref:calcaterra-jamaopen-2025][ref:harris-jama-2026][ref:cdc-2022] A 2025 JAMA Network Open table explicitly states that for primary care clinics (non-OTP): "No, not for methadone maintenance therapy for OUD".[ref:calcaterra-jamaopen-2025]

Key exceptions the decision-support tool should include:

- **72-hour rule:** Any clinician may administer (not prescribe) methadone for up to 72 hours to treat acute opioid withdrawal while arranging OTP referral. Under updated regulations, a 3-day supply may be dispensed at one time.[ref:calcaterra-jamaopen-2025][ref:harris-jama-2026][ref:cdc-2022]
- **Hospital exception:** Hospitalized patients can be initiated on or continued on methadone during inpatient stays.[ref:harris-jama-2026][ref:cdc-2022]
- **Methadone for pain:** Methadone can be prescribed by any DEA-registered clinician for a pain indication and filled at a retail pharmacy — but not for OUD.[ref:calcaterra-jamaopen-2025]
- **Evolving landscape:** There is active advocacy and policy discussion around allowing pharmacy-based methadone dispensing for OUD, though this is not yet law.[ref:tschampl-jamaopen-2026]

**Operational takeaway:** The claim is correct for routine outpatient OUD treatment. The PCP should know about the 72-hour exception for bridging patients to an OTP and should not confuse methadone-for-pain prescribing authority with methadone-for-OUD authority.

---

**Claim 6: A patient with suspected/confirmed OUD cut off from prescribed opioids without a treatment plan is at acute, elevated overdose risk from illicit opioid use.**

**Strongly supported.** This is one of the best-evidenced claims in the set. A large retrospective cohort study found that discontinuing prescribed opioids was associated with increased overdose risk across all groups, with the highest risk among patients with OUD not receiving opioid agonist therapy (**AHR 3.18**, 95% CI 1.87–5.40).[ref:kennedy-plos-2022] A JAMA study of >113,000 patients found that opioid dose tapering was associated with significantly increased rates of overdose (aIRR 1.68) and mental health crisis (aIRR 2.28), with risk increasing at higher baseline doses and faster taper rates.[ref:agnoli-jama-2021]

The CDC 2022 Guideline states explicitly: "opioid therapy should not be discontinued abruptly" and warns that "patients prescribed opioids but unable to access ongoing care might be at risk for abrupt opioid discontinuation".[ref:cdc-2022] The FDA has issued a prescriber warning about hazards of rapid dose reduction including withdrawal, psychological distress, and suicidality.[ref:cdc-2022] The fentanyl-contaminated illicit supply adds a layer of lethality not present in earlier eras.[ref:acog-mate-2025]

**Operational takeaway:** This claim should be treated as a safety-critical principle. Document the overdose risk explicitly when inheriting a patient on chronic opioids, and ensure naloxone is prescribed. The CDC 2022 guideline also states: "Clinicians should not dismiss patients from their practice because of opioid use disorder because this can adversely affect patient safety".[ref:cdc-2022]

---

**Claim 7: Continuity of the existing opiate prescription with close monitoring while OUD evaluation and MOUD referral are pending is safer than discontinuation without a plan.**

**Supported by guideline consensus, though direct comparative trial evidence is limited.** The CDC 2022 Guideline (Recommendation 5) advises against abrupt discontinuation and recommends that clinicians "work closely with patients to optimize nonopioid therapies while continuing opioid therapy" when benefits outweigh risks.[ref:cdc-2022] The guideline further states that clinicians should "closely monitor patients who are unable to taper" and "work with patients to mitigate overdose risk".[ref:cdc-2022] The observational evidence on harms of discontinuation (discussed under Claim 6) provides the evidentiary basis for this approach.[ref:kennedy-plos-2022][ref:agnoli-jama-2021][ref:cdc-2022]

The nuance is that this is a **harm-reduction bridging strategy**, not an endorsement of indefinite continuation. The CDC guideline frames it as: continue while optimizing alternatives and arranging appropriate treatment.[ref:cdc-2022] Close monitoring should include PDMP checks, urine drug screening as clinically appropriate, shorter prescription intervals, and naloxone co-prescribing.[ref:cdc-2022]

**Operational takeaway:** Document the clinical rationale for continuing the prescription (e.g., "Continuing current opioid regimen at [dose] with [interval] monitoring to prevent abrupt discontinuation harms while OUD evaluation is completed and MOUD transition is arranged, per CDC 2022 Guideline Recommendation 5"). This protects both the patient and the clinician.

---

**Claim 8: The appropriate e-consult framing shifts from "please review pain management plan" to "patient with chronic pain and possible OUD — please advise on MOUD candidacy and transition plan."**

**Not directly addressed by any guideline**, but this is a reasonable operational recommendation consistent with the spirit of the CDC 2022 Guideline and ASAM guidance. The CDC guideline emphasizes that identification of OUD "represents an opportunity for a clinician to initiate potentially life-saving interventions" and that clinicians unable to provide treatment themselves "should arrange for patients with opioid use disorder to receive care from a substance use disorder treatment specialist".[ref:cdc-2022] The guideline also notes that for patients with active OUD not in treatment, clinicians "should consider buprenorphine or methadone treatment for opioid use disorder".[ref:cdc-2022]

The reframing is clinically sound because a pain management consult and an addiction medicine consult may go to different specialists, require different expertise, and generate different recommendations. Framing the consult around OUD and MOUD candidacy ensures the consultant addresses the most safety-critical question.

**Operational takeaway:** This is a best-practice recommendation rather than a guideline-mandated action. The decision-support tool should prompt the PCP to specify whether the consult question is pain management, OUD/MOUD evaluation, or both, and to route accordingly.

---

**Claim 9: OUD should not be framed as a moral failure in patient communication or documentation.**

**Strongly supported across all major guidelines and professional societies.** The CDC 2022 Guideline states that "opioid use disorder is a chronic, treatable disease from which persons can recover" and instructs clinicians to "discuss their concern with their patient in a nonjudgmental manner".[ref:cdc-2022] ASAM guidance emphasizes communicating "with compassion and respect and without judgment," noting that stigmatizing interactions "can drive people away from the care they need".[ref:gibson-asam-2024][ref:kowalchuk-aafp-2024] The Lancet review on OUD management states that "adopting a welcoming attitude that avoids risk of embarrassment or stigmatisation is crucial" and that "respecting the patient's decisions regarding their care without moral or paternalistic attitudes is paramount".[ref:blanco-lancet-2019] The AAFP notes that use of nonstigmatizing, person-first language has been shown to positively affect care, and that clinician stigma leads to under-treatment.[ref:volkow-jamapsych-2019]

An NEJM review frames OUD as involving neurobiological changes to striatocortical circuits, the extended amygdala, and prefrontal cortex — reinforcing the disease model over a moral framework.[ref:volkow-jamapsych-2019]

**Operational takeaway:** Use person-first language in documentation (e.g., "patient with opioid use disorder" rather than "opioid abuser" or "addict"). Avoid language implying volitional failure (e.g., "patient refuses to comply"). The NIDA provides a terminology guide that can be referenced for documentation standards.[ref:volkow-jamapsych-2019]

---

**Summary (Bundle 8, OE-provided):**

| Claim | Verdict | Critical Nuance |
|-------|---------|-----------------|
| 1. Pain + OUD coexist | Supported | Majority of chronic-pain patients do NOT have OUD; use pain-adjusted diagnostic approach |
| 2. Signs of OUD in chronic pain | Partially supported | Use formal 11-criterion DSM-5 checklist, not informal sign list; distinguish therapeutic vs. nontherapeutic intent |
| 3. MOUD outperforms taper | Supported for bup/methadone | Naltrexone evidence substantially weaker; oral naltrexone ≈ placebo |
| 4. Buprenorphine in PCP, no X-waiver | Supported | Check state-specific rules; 8-hr training attestation for new/renewed DEA |
| 5. Methadone requires OTP | Supported | 72-hour exception exists for bridging; methadone-for-pain ≠ methadone-for-OUD |
| 6. Cutoff → overdose risk | Strongly supported | AHR 3.18 for OUD patients without OAT; fentanyl supply amplifies risk |
| 7. Continue Rx while evaluating | Supported (guideline consensus) | Bridging strategy, not indefinite; requires close monitoring + documentation |
| 8. Reframe e-consult | Not guideline-specified | Clinically sound best practice; route to addiction medicine, not just pain |
| 9. OUD ≠ moral failure | Strongly supported | Use person-first language; clinician stigma → under-treatment |

OE-offered deep-dive: _"Would you like to explore specific operational workflows for the inherited-patient first visit — such as a structured documentation template, PDMP/UDS protocols, or a buprenorphine micro-induction protocol for transitioning from full-agonist opioids?"_ — captured in Follow-up Prompts (FU-9).

---

## Claim-level tracker

One row per verifiable claim. `Source location` uses `faqs.<faq_id>.q<n>` where `<n>` is the 1-indexed position of the question within `items[]` in the opiate module under `clinical-modules.json`; `checklist.<item_id>` for checklist items; `escalation.<item_id>` for escalation items; `landing_intro` and `green_zone.narrative_html` for those fields. `ref_id` is the short id used in the `references[]` array and `[ref:X]` markers in the prose. Verdicts are populated as bundle responses come in.

**Verdict values:** `Verified` / `Verified with nuance` / `Needs revision` / `Disproved` / `No evidence found` / `—` (pending)
**Action values:** `No change` / `Soften language` / `Add [ref:X] marker` / `Rewrite per OE` / `Add new content` / `Remove claim`

| #  | Claim                                                                                                                                            | Source location               | OE verdict | ref_id | Action / Source     |
|----|--------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|------------|--------|---------------------|
| 1  | First-visit goal is establish relationship + structured assessment + decide continue/modify/escalate, not solve the problem                       | landing_intro                 | —          | —      | _Bundle 6 pending_  |
| 2  | "Do not discontinue at the first visit without a safety plan in place" — abrupt-discontinuation prohibition at handoff                            | landing_intro                 | Verified   | cdc-2022, aafp-roth-2020 | Add [ref:X] markers |
| 3  | PDMP review at chronic opiate handoff verifies single prescriber, single pharmacy, consistent quantities, no concurrent CS of concern             | checklist.opiates-pdmp        | —          | —      | _Bundle 1 pending_  |
| 4  | A controlled substance agreement on file (or completed at this visit) with documented patient understanding is a chronic-opiate intake standard  | checklist.opiates-agreement   | —          | —      | _Bundle 3 pending_  |
| 5  | UDS at intake (results reviewed and documented) is the chronic-opiate intake standard                                                             | checklist.opiates-uds         | —          | —      | _Bundle 4 pending_  |
| 6  | Current MME calculated and documented, with clinical rationale present for doses above 50 MME/day, is the chronic-opiate intake standard         | checklist.opiates-mme         | Verified with nuance | cdc-2022 | Add [ref:X] marker; note 50 MME is "guidepost," not ceiling per CDC 2022 |
| 7  | Reasonable basis exists to continue current regimen at first visit when all four checklist items are satisfied                                    | green_zone.narrative_html     | Verified with nuance | cdc-2022, arnold-aafp-2023, coffin-am-2022, sandbrink-aim-2023 | Add [ref:X] markers — supported but module's 4-item checklist is a meaningful subset of CDC 2022's expected first-visit assessment. **Module checklist is incomplete relative to CDC 2022 + Coffin 2022 + VA/DoD 2022 standard.** See gap row 100 (11-element first-visit framework). Strengthen by citing specific CDC 2022 recommendation numbers (Recs 2, 5, 7, 8, 9) rather than presenting framework as monolithic standard. |
| 8  | 90-day follow-up cadence (or sooner with concerns) is the appropriate ongoing follow-up interval for stable chronic opiate patients               | green_zone.narrative_html     | —          | —      | _Bundle 6 pending_  |
| 9  | Monitoring chronic opiate prescribing is ongoing and not a one-time clearance                                                                     | green_zone.narrative_html     | —          | —      | _Bundle 6 pending_  |
| 10 | ≥ 90 MME/day without documented pain management specialist involvement → escalate                                                                  | escalation.opiates-highdose   | Needs revision | cdc-2022, cdc-2016 | Rewrite per OE — 2022 CDC removed 90 MME from main rec; reframe around 50 MME + individualized assessment; specialist involvement = best practice not CDC mandate at 90 |
| 11 | Concurrent benzodiazepine prescription, any dose, any indication → escalate                                                                       | escalation.opiates-combo      | Needs revision | cdc-2022 | Soften language — CDC 2022 = "particular caution" (Cat B), not absolute avoidance; stable low-dose use may not require escalation; "long-term stable use might be safer than erratic" |
| 12 | UDS positive for non-prescribed CS, or negative for prescribed opiate → escalate                                                                  | escalation.opiates-uds-fail   | —          | —      | _Bundle 4 pending_  |
| 13 | PDMP showing multiple prescribers, multiple pharmacies, or overlapping fills → escalate                                                           | escalation.opiates-pdmp-concern | Verified with nuance | cdc-2022, perry-add-2022 | Soften — pattern warrants discussion + clarification, not assumption of diversion. CDC 2022: discuss with patient, communicate with other prescribers, do not dismiss; PDMP risk scores not validated against clinical outcomes. Perry 2022 (n=21.5M): traditional binary thresholds (N+ doctors / N+ pharmacies in 90d) performed no better than chance after 2015 — escalation language should reflect "concerning pattern requiring investigation," not "automatic escalation." |
| 14 | Repeated early refill requests, lost medications, or escalating between-visit contact → escalate                                                  | escalation.opiates-behavior   | —          | —      | _Bundle 7 pending_  |
| 15 | Any clinical concern for OUD → escalate; consider MOUD rather than taper or discontinuation                                                       | escalation.opiates-oud        | —          | —      | _Bundle 8 pending_  |
| 16 | Concurrent benzodiazepine prescription is the most important opiate-PDMP safety flag                                                              | faqs.opiates-pdmp.q1          | Needs revision | cdc-2022, fda-oxycodone, asam-acmt-2025-benzo | Soften — CDC 2022 does NOT rank it as "the most important"; lists it as ONE OF several co-equal top flags alongside high total MME/day and multiple uncoordinated prescribers. Reframe as "one of the top safety concerns" rather than "most important"; document risk-benefit assessment rather than treating as automatic contraindication |
| 17 | Overlapping fills from any prescriber suggest double-doctoring                                                                                    | faqs.opiates-pdmp.q1          | Needs revision | cdc-2022, cdc-2016 | Rewrite — framing is too presumptive. CDC 2022: prescriptions may appropriately be written by more than one clinician coordinating care; PDMP information can be incorrect (wrong name, identity theft). Replace "suggest double-doctoring" with "warrant clarification and documentation" — verify whether overlap reflects coordinated care, transition between providers, or data error. Avoid "double-doctoring" in clinical documentation until pattern is confirmed as uncoordinated. |
| 18 | Fill-frequency vs days-supply mismatch (e.g., 30-day supply every 20 days) is a recognized concerning pattern                                     | faqs.opiates-pdmp.q1          | Verified with nuance | kern-pm-2020, lange-pain-2015, liebschutz-jamaim-2017, babu-nejm-2019 | Add [ref:X] markers + nuance — supported as pattern indicator. Kern 2020: ~10% of opioid patients have an early refill (≥15% early relative to days' supply); 18.5% among ER/LA opioid users; 75% of patients with an early refill had only ONE — a single early refill is common and often benign. Module should distinguish PATTERN (concerning) from isolated occurrence (often benign). Legitimate explanations: vacation prep, dose adjustments, 14-day refills written as 30-day supply. |
| 19 | Cash-pay fills can bypass insurance tracking and may not appear on PDMP in all states                                                             | faqs.opiates-pdmp.q1          | **Needs revision (claim is incorrect as written)** | cdc-2022, manasco-pds-2016 | **Rewrite — first half is factually wrong. PDMPs are pharmacy-based reporting systems, not insurance-based; pharmacies are required to report ALL dispensed controlled substances regardless of payment method in virtually all states. Cash-pay fills DO appear on the PDMP. The claim conflates PDMP reporting with insurance/PBM claims data.** Replace with the actual concern: cash payment for a controlled substance when the patient HAS active insurance is a pattern worth exploring (may indicate attempt to circumvent insurance quantity limits / PA). Note: PDMP reporting lag varies by state (historically up to a week; most now next-business-day or real-time). |
| 20 | NY requires PDMP review prior to every opiate prescription — not just at intake                                                                    | faqs.opiates-pdmp.q1          | **Verified — needs dual-state rewrite** | ny-pbh-3343a, nj-njsa-45-1-46-1, brown-dad-2017, blum-jsat-2016, cdc-2022 | **Resolved via `verification/controlled-substances-ny-nj.md` (R4 + R5).** Module current text is NY-only — must expand to dual-state per row-87 scope decision. JSON-edit-pass plan: replace existing single-paragraph claim with Snippet A (NY: per-prescription consultation for Schedule II/III/IV, with statutory exceptions for vet, on-premises institutional, ED ≤5-day supply, hospice per §4002, technical waivers) followed by Snippet B (NJ: initial-prescription + quarterly during ongoing therapy under NJSA 45:1-46.1; pharmacist parallel duty; PMP-monitored drugs include Schedule V even though consult duty doesn't). Each paragraph closes with the disclaimer pattern. |
| 21 | A second prescriber in the PDMP is not automatically problematic; coordinated PCP + pain-mgmt dual prescribing can be legitimate                  | faqs.opiates-pdmp.q2          | Verified   | cdc-2022 | Add [ref:X] marker — CDC 2022 explicitly states "prescriptions might appropriately be written by more than one clinician coordinating the patient's care." Documentation requirement: evidence of coordination (note or communication confirming both prescribers are aware + agreed on care plan). PCP should contact other prescriber at inherited-patient visit and document conversation. |
| 22 | An ER opiate prescription for an acute injury is qualitatively different from monthly fills from two separate PCPs                                | faqs.opiates-pdmp.q2          | Verified   | cdc-2022 | Add [ref:X] marker — clinically appropriate distinction. CDC 2022 acknowledges acute pain Rx (incl. ED) are a distinct clinical context; care-coordination emphasis applies to ongoing prescribing relationships, not isolated acute-care encounters. Still note ED Rx in chart + verify clinical context (was there an acute injury?), but level of concern + follow-up is appropriately lower. |
| 23 | Concurrent benzo on PDMP → do not prescribe opiate at this visit without a safety plan                                                            | faqs.opiates-pdmp.q3          | —          | —      | _Bundle 5 pending_  |
| 24 | Opiate-benzo combination is "the leading driver of prescription overdose mortality"                                                                | faqs.opiates-pdmp.q3          | Verified   | cdc-2022 | Add [ref:X] marker |
| 25 | A new CS agreement should be completed when the PCP becomes prescriber of record on transfer                                                      | faqs.opiates-agreement.q1     | Verified with nuance | cdc-2022, aan-franklin-2014, aps-aapm-chou-2009, svirsky-milbank-2024 | Soften language — "strongly recommended best practice and often legally required" rather than "should be completed." Per Svirsky 2024: 27 states mandate OTAs (varies by trigger); 23 + DC do NOT mandate by statute. NY-specific: I-STOP mandates PDMP checks but does NOT mandate written OTA — derives from institutional policy. Module should advise verifying state law + institutional policy. Rationale for new agreement on transfer (prior agreement was between patient + different clinician; doesn't bind new prescriber; protects clinician in litigation) is sound. |
| 26 | Required CS agreement elements (per module): single prescriber, single pharmacy, UDS monitoring, no early refills, no lost-or-stolen replacement, no self-adjustment, functional-improvement goal | faqs.opiates-agreement.q2 | **Needs revision** | cdc-2022, aps-aapm-chou-2009, bruce-cid-2017, hegmann-joem-2014, arnold-aafp-2023, acoem-2017-otc | **Rewrite — no nationally standardized required-element list exists.** CDC 2022 explicitly avoided specifying OTA content; APS/AAPM 2009 says "insufficient evidence to guide specific recommendations on which provisions to include." Reframe as "commonly included elements consistent with best practice" rather than "required elements." Element-specific notes: (a) single prescriber/pharmacy = reasonable risk-mitigation, not federally mandated; (b) no lost/stolen replacement = institutional policy, not guideline; (c) no self-adjustment = reasonable, not guideline-specified; (d) UDS monitoring = CDC 2022 softened to "as appropriate" not universal mandate; (e) functional improvement = strongest guideline backing (see row 27). Recommended composite labeling: "consensus-derived common elements drawn from CDC 2022 + APS/AAPM + ACOEM + HIVMA/IDSA + applicable state law." |
| 27 | "Functional improvement, not pain elimination" is the recognized therapy-goal framing for chronic primary-care opiate prescribing                | faqs.opiates-agreement.q2     | Verified   | cdc-2022, cdc-2016, acoem-2017-otc, aps-aapm-chou-2009 | Add [ref:X] markers — strongly supported across guidelines. CDC 2022: "Emphasize improvement in function as a primary goal and that function can improve even when pain is not eliminated." Add carve-out per CDC 2022: "for some patients with diseases typically associated with progressive functional impairment or catastrophic injuries such as spinal cord trauma, reductions in pain without improvement in physical function might be more realistic" — module should not rigidly apply functional-improvement frame to all patients. APS/AAPM context: "total pain relief with COT is rare; improvement averages <2-3 points on 0-10 scale." |
| 28 | The PCP is not obligated to prescribe without a signed CS agreement; refusal-to-prescribe in the face of unexplained categorical refusal is institutionally supported | faqs.opiates-agreement.q3 | Verified with nuance | cdc-2022, aps-aapm-chou-2009, svirsky-milbank-2024 | Add [ref:X] markers + critical caveat. **CDC 2022 also warns against patient abandonment**: "Clinicians should avoid dismissing patients from care and should ensure (provide or arrange) appropriate care for patients with pain." Refusing to prescribe is defensible; refusing to provide ANY care pathway is not. Module FAQ should add 4-element documentation pattern: (1) agreement was offered + explained; (2) patient declined to sign with stated reason if any; (3) clinician offered alternatives (non-opioid pain mgmt, pain-specialist referral, bridge Rx with short-interval f/u); (4) rationale for not prescribing without agreement. Document accommodations explored before concluding refusal was "categorical" (literacy assistance, language interpretation, time to review). See new gap row 85. |
| 29 | Point-of-care immunoassay UDS has meaningful false-positive AND false-negative rates                                                              | faqs.opiates-uds.q1           | Verified   | cdc-2022, abou-cb-2021, saitman-jat-2026, kale-aafp-2019 | Add [ref:X] markers — supported with concrete numbers (POC PPV as low as 57% for oxycodone, NPV 25–29% for THC-COOH per Abou-2021). Module language correct as written. Operational nuance: POC results CAN appropriately inform preliminary safety decisions (withhold same-day Rx pending confirmation, increase monitoring, initiate conversation) — these are not "actions against" the patient. |
| 30 | Confirmatory testing (GC-MS or LC-MS/MS) is required before clinical action on a positive screen for an unexpected substance OR a negative screen for the prescribed opiate | faqs.opiates-uds.q1 | Verified with nuance | cdc-2022, asam-baxter-2017, stolbach-jmt-2022 | Add [ref:X] markers + critical extension. CDC 2022 goes FURTHER than "confirm before adverse action": even **confirmed** unexpected results should NOT trigger dismissal from care. Confirmation is necessary but not sufficient for adverse action. Module should explicitly state that confirmed unexpected results should prompt clinical response (MOUD eval, increased monitoring, naloxone, referral) rather than termination. |
| 31 | Patient should not be discharged based on a screening UDS alone                                                                                  | faqs.opiates-uds.q1           | Verified with nuance | cdc-2022 | Strengthen — CDC 2022 position is broader: "clinicians should not dismiss patients from care on the basis of a toxicology test result," **screening or confirmed**. Module currently scopes prohibition narrowly to "screen alone"; CDC actually goes further. Pair with row 84 (non-dismissal principle) + row 60 (cocaine-UDS rewrite) under broader "non-punitive use of monitoring" theme. |
| 32 | UDS negative for the prescribed opiate has 3 plausible explanations: not taken (most concerning — diversion/stockpiling), dose-timing artifact, metabolic variant | faqs.opiates-uds.q2 | **Needs revision (incomplete differential)** | alford-jama-2013, cdc-2022, bruce-cid-2017, aapm-argoff-2018, nccn-cancer-pain-2026 | **Rewrite per OE — module's 3-item list omits more common explanations.** Expand to: (1) **Wrong assay ordered** (standard opiate immunoassay does NOT detect oxycodone, fentanyl, methadone, or buprenorphine — common cause of false-negative for prescribed opioid); (2) Drug absent: diversion, hoarding/stockpiling, OR pharmacologic induction causing rapid metabolism; (3) Specimen manipulation: dilution / adulteration / synthetic urine substitution; (4) Drug present but below assay cutoff: dose-timing OR low-dose/PRN use; (5) **Running out early due to undertreated pain** (patient used more than prescribed and has none left — distinct from diversion); (6) Urine dilution from uncontrolled diabetes; (7) Pharmacogenetic anomalies + drug-drug interactions affecting metabolism; (8) Laboratory error (mislabeling, cross-reaction). "Metabolic variant" is real but rare — wrong-assay-ordered + running-out-early are far more common. See new gap rows 88, 89. |
| 33 | Risk-stratified UDS cadence: stable every 6–12 months; yellow-flag every 3 months; active concerns at every visit until stable                    | faqs.opiates-uds.q3           | Verified with nuance | cdc-2022, cdc-2016, aapm-argoff-2018, aps-aapm-chou-2009 | Add [ref:X] markers + label as institutional convention informed by AAPM consensus, NOT a specific CDC recommendation. CDC 2022 deliberately DECLINES risk stratification: "predicting risk is challenging, and available tools do not allow clinicians to reliably identify patients who are at low risk." AAPM 2018: low-risk every 6 mo–2 yr; moderate 1–3×/yr; high 2–4×/yr. APS 2009: stable every 3–6 mo. **Module's "every visit" for active-concern tier is more aggressive than published guidelines** (most max at 2–4×/yr or "weekly for very high risk" per APS) — keep as institutional choice but document rationale. PCP should document the chosen-interval reasoning. |
| 34 | MME conversion factor: morphine 1:1                                                                                                              | faqs.opiates-mme.q1           | Verified   | cdc-2022 | Add [ref:X] marker |
| 35 | MME conversion factor: oxycodone × 1.5                                                                                                            | faqs.opiates-mme.q1           | Verified   | cdc-2022 | Add [ref:X] marker |
| 36 | MME conversion factor: hydrocodone × 1                                                                                                            | faqs.opiates-mme.q1           | Verified   | cdc-2022 | Add [ref:X] marker |
| 37 | MME conversion factor: hydromorphone × 5                                                                                                          | faqs.opiates-mme.q1           | Verified with nuance | cdc-2022, cdc-2016, wen-jpm-2022 | Add [ref:X] marker; note 2016 CDC was 4.0; institutional variation exists; CDC 2022 caveat: "no single standard formula for calculating MMEs" |
| 38 | MME conversion factor: fentanyl patch (mcg/hr × 2.4)                                                                                              | faqs.opiates-mme.q1           | Verified   | cdc-2022 | Add [ref:X] marker |
| 39 | MME conversion factor: tramadol × 0.1                                                                                                            | faqs.opiates-mme.q1           | **Needs revision (HIGH — clinical safety)** | cdc-2022 | **Rewrite per OE — CDC 2022 lists tramadol at × 0.2 (not 0.1). Underestimates MME by half (200 mg = 40 MME, not 20). Add CDC caveat that tramadol's µ-agonist + SNRI mechanism makes its dose-overdose relationship unlike pure µ-agonists.** _Bundle 1 confirmed; both meta-pass + Bundle 1 cite CDC 2022._ |
| 40 | For multi-agent regimens, total MME = sum of per-agent MMEs                                                                                       | faqs.opiates-mme.q1           | Verified with nuance | cdc-2022, asam-2021-moud | Add new content — buprenorphine must be EXCLUDED from MME summation (partial agonist + ceiling effect on respiratory depression); MME conversion factors should not be applied to methadone or buprenorphine when used for OUD treatment per ASAM 2021 |
| 41 | CDC 50 MME/day inflection: increased overdose risk begins; reassess B/R + ensure naloxone Rx + household training                                 | faqs.opiates-mme.q2           | Verified with nuance | cdc-2022 | Reframe per Bundle 1 — "inflection point" overstates the epidemiology; CDC 2022 says risk increases CONTINUOUSLY with dose, "no single dosage threshold below which risks are eliminated"; 50 MME is a "guidepost for heightened vigilance," not a pharmacologic inflection. Naloxone language should be "offer," not "ensure/mandate." |
| 42 | CDC 90 MME/day high-scrutiny threshold: avoid above without specialist involvement + clear rationale; not a hard ceiling                          | faqs.opiates-mme.q2           | Needs revision | cdc-2022, cdc-2016 | Rewrite per OE — CDC 2022 deliberately removed numeric thresholds (incl. 90 MME) from main recommendation; "specific dosage thresholds" risk being read as "authoritative absolutes" leading to "noncollaborative tapers." Reframe: 50 MME is primary inflection; risk increases continuously without single safe threshold; specialist involvement = best practice not CDC mandate. State-level rules (e.g., WA 120 MME) are state-specific. |
| 43 | Above 90 MME/day without pain-management co-management is an escalation indicator                                                                 | faqs.opiates-mme.q2           | Needs revision | cdc-2022 | Soften — same CDC 2022 framing-change as row 42; this is institutional convention rather than CDC-required escalation criterion |
| 44 | Stability on a long-standing high MME dose is meaningful clinical data; abrupt taper at first visit causes harm and can drive illicit-opioid use  | faqs.opiates-mme.q3           | Verified   | cdc-2022, agnoli-jama-2021, arnold-aafp-2023 | Add [ref:X] markers — **strongly supported with concrete numbers**. Agnoli JAMA 2021 (n=113,618 cohort): tapering associated with adjusted IRR 1.68 overdose, 2.28 mental-health crisis, **3.30 suicide attempt**; risk dose-dependent (highest absolute risk increases at ≥300 MME/day). CDC 2022 Recommendation 5 explicitly states "opioid therapy should not be discontinued abruptly… clinicians should not rapidly reduce opioid dosages from higher dosages." **Important counterpoint nuance:** evidence is strongest for RAPID taper + discontinuation; gradual taper (≤10%/mo) with behavioral support can actually IMPROVE pain/function/QoL. See gap row 99. Taper of patients on opioids ≥1 year may take months to years (AAFP). |
| 45 | Recommended e-consult ask at high stable dose: "Patient stable on X MME/day for Y years. Please review and advise..."                              | faqs.opiates-mme.q3           | —          | —      | _Bundle 6 pending_  |
| 46 | Naloxone co-prescribing standard of care: ≥ 50 MME/day, opiates + any CNS depressant, hx SUD or overdose, household with children/at-risk        | faqs.opiates-mme.q4           | Verified with nuance | cdc-2022 | Add [ref:X] marker + refinements per Bundle 1: (a) CDC specifies "benzodiazepines" not "any CNS depressant"; (b) add **sleep-disordered breathing** as separate CDC indication (missing from module); (c) add **post-incarceration / taper-related tolerance loss** as separate CDC indication; (d) 2022 CDC uses "offer naloxone" language (not "mandate"); (e) "household members at risk" maps better to CDC's recommendation to provide overdose-prevention education to household members, distinct from patient-level naloxone indication |
| 47 | Naloxone Rx + counseling + household access documentation is "standard of care, not optional"                                                     | faqs.opiates-mme.q4           | Verified with nuance | cdc-2022 | Soften — CDC 2022 says "offer naloxone" rather than mandating co-prescribing; "offer" can mean prescribing OR directly providing it. Module's "not optional" framing slightly overstates CDC language but is defensible as institutional standard. |
| 48 | Continuing prescribing at the existing high dose for one cycle while pain-mgmt e-consult is pending is clinically and ethically defensible        | faqs.opiates-highdose.q1      | Verified with nuance | cdc-2022, agnoli-jama-2021 | Add [ref:X] markers + add critical conditional. CDC 2022 Recommendation 5 explicitly endorses continuity at inherited-patient first visit; CDC also warns payers/health systems should not penalize clinicians for accepting new patients on opioids. **Conditional language to add per Bundle 6:** continuity is defensible only in the **absence of life-threatening safety signals** (sedation, respiratory depression, slurred speech, evidence of active diversion); if such signals are present, dose reduction or discontinuation may be warranted even at first encounter. Pair with new gap row 98 (continuity-as-bridge-not-endpoint framing). |
| 49 | Required documentation at high dose: MME calculation, threshold awareness, safety measures (naloxone, UDS, PDMP), e-consult pending status        | faqs.opiates-highdose.q1      | **Needs revision (incomplete)** | cdc-2022, cdc-2016, coffin-am-2022, arnold-aafp-2023 | **Rewrite per Bundle 6 — module's documentation list is incomplete relative to CDC 2022 expectations.** Add: (a) **OUD screening** (TAPS, DAST), (b) **mental-health comorbidity screening** (depression, anxiety), (c) **functional-status assessment** (PEG scale), (d) **concurrent-benzodiazepine check** (also row 11/16 territory), (e) **establish treatment goals including functional goals**. Two important framing changes: (1) pain-management e-consult is **strongly recommended, not mandated** by CDC 2022 (CDC 2016 recommended "considering" specialist consultation at ≥90 MME/day; CDC 2022 softened this); (2) NY I-STOP is a **legal mandate**, not just guideline recommendation — should be flagged as such. See gap row 100 (11-element first-visit framework). |
| 50 | Structured high-dose e-consult template covers: dose / agent / indication / prior pain-mgmt doc / PDMP / UDS / function + 3-part question         | faqs.opiates-highdose.q2      | Verified with nuance | cdc-2022, cdc-2016 | Soften per Bundle 6 — **NOT derived from any specific published guideline.** The 7 data elements (dose/agent/indication/prior pain-mgmt doc/PDMP/UDS/function) are individually supported by CDC 2022 assessment domains. The 3-part question is reasonable institutional workflow design but no CDC, AAFP, ASAM, or VA/DoD guideline prescribes a specific e-consult template or structured question format. **Reframe as "a structured e-consult template consistent with CDC-recommended assessment domains" or as institutional best practice / quality improvement, not "the recommended e-consult ask."** Avoid attributing to a specific guideline — would be inaccurate. |
| 51 | Patient threats to leave the practice if regimen is changed should not drive clinical decisions; document the conversation                        | faqs.opiates-highdose.q3      | Verified with nuance | cdc-2022, arnold-aafp-2023, sandbrink-aim-2023, blanco-lancet-2019 | Add [ref:X] markers + add clinical-signal nuance. AAFP summary: "physicians should acknowledge the discordance, express empathy, and implement patient-centered treatment changes **without abandoning the patient**." CDC 2022 explicitly warns against dismissing patients based on PDMP/opioid-related concerns. VA/DoD 2022: collaborative, patient-centered approach. **Add nuance:** patient distress at prospect of dose changes is a **clinically meaningful signal** — may reflect undertreated pain, anxiety, or features of OUD, all warranting assessment rather than dismissal. Documentation should capture not just the threat but the clinical assessment of what is driving it. CDC 2022: clinicians have "a responsibility to provide or arrange for coordinated management." See new gap row 101. |
| 52 | Concurrent opioid + benzodiazepine increases overdose mortality risk by a factor of 3–4 vs opioid alone                                           | faqs.opiates-combo.q1         | Verified with nuance | cdc-2022, sun-bmj-2017, cho-jgim-2020, hernandez-jamaopen-2018 | Soften per Bundle 5 — "3–4×" is defensible only when citing the specific case-cohort study CDC 2022 referenced for overdose **death**. Broader literature shows range 2–5× depending on population/outcome/duration: Sun BMJ 2017 OR=2.14 for opioid-overdose ED visit/hospitalization (privately insured); Cho JGIM 2020 only 20% increase (Kaiser); Hernandez JAMA Open 2018 HR=5.05 in first 90 days, dropping to non-significant after 180 days of stable concurrent use. **Time-dependence** is the most operationally important nuance — risk highest in early period; long-term stable low-dose use carries lower (still elevated) risk. See gap row 94. |
| 53 | Both classes cause respiratory depression via different mechanisms; combination is synergistic, not merely additive                                | faqs.opiates-combo.q1         | Needs revision | cdc-2022, gershuny-bja-2025, florian-jama-2022, horsfall-bcpt-2017, fda-oxycodone | Rewrite — pharmacologic mechanism is debated and Bundle 5 sharpens the picture. Benzos at standard doses have minimal effects on ventilation alone; they primarily contribute via **sedation, loss of airway protective reflexes, and upper airway obstruction** rather than classic synergy on central respiratory drive. Gershuny 2025 RCT: midazolam + oxycodone did NOT decrease hypercapnic ventilation but did increase end-tidal CO₂ and caused 60% to fall asleep/snore. Florian JAMA 2022 same FDA program for paroxetine/quetiapine + oxycodone. Horsfall 2017 frames "Holy Trinity" synergy. Use language: "benzodiazepines potentiate opioid-induced respiratory depression through complementary mechanisms (sedation + airway compromise, not classic central-drive synergy)." |
| 54 | FDA black box warning on opioid + benzodiazepine combination was issued in 2016                                                                   | faqs.opiates-combo.q1         | Verified   | hadland-peds-2024, fda-oxycodone, fda-triazolam, fda-lorazepam, florian-jama-2022, cdc-2022 | Add [ref:X] markers; Bundle 5 confirms 2016 issuance verbatim. **Important nuance** for OUD pathway (rows 76–80): FDA 2017 clarification — patients with OUD on buprenorphine/methadone should still receive MOUD even if on benzos; withholding MOUD carries greater risk. |
| 55 | Inherited opioid+benzo combination cannot be continued unchanged without documented safety plan + specialist input                                | faqs.opiates-combo.q1         | **Needs revision (overstated)** | cdc-2022, vadod-2022, asam-acmt-2025-benzo | **Rewrite per Bundle 5 — overstated relative to guidelines.** No major guideline (CDC 2022, VA/DoD 2022, ASAM 2025) mandates that the combination CANNOT be continued at first visit without specialist input. CDC 2022 Cat B = "use particular caution," not "avoid"; explicitly says "stopping benzodiazepines can be destabilizing" and "long-term stable use might be safer than erratic, unpredictable use." Specialist consultation recommended "if needed" and "as appropriate," not as prerequisite. **Operational rewrite at first visit:** PCP CAN continue both medications at current doses if patient is on long-term stable regimen, provided documentation includes (1) PDMP check, (2) risk-benefit assessment, (3) naloxone offer, (4) shorter-interval follow-up plan (2–4 weeks vs 3 months), (5) specialist consultation **initiated** (not completed) if indication concern or taper consideration. Refusing both at first visit risks destabilization and is explicitly cautioned against by CDC OWG. |
| 56 | When dual indication is legitimate: prescribe more immediately necessary agent (typically opiate if chronic pain primary), document combo as known risk, prescribe naloxone, urgent e-consult | faqs.opiates-combo.q2 | **Needs revision (problematic — clinical safety)** | cdc-2022, vadod-2022, asam-acmt-2025-benzo | **Rewrite per Bundle 5 — "prescribe only one" framing is wrong.** No guideline recommends withholding one of two chronically prescribed medications at first visit when patient has legitimate indications and is on stable regimen. CDC 2022 explicitly warns against abrupt changes that destabilize patients; VA/DoD 2022 says abrupt benzo discontinuation should be avoided due to seizure/death risk. **Withholding the benzo risks withdrawal seizure; withholding the opiate risks withdrawal + uncontrolled pain.** Correct first-visit pattern: **continue BOTH at current doses**, document combination as known risk, prescribe naloxone (ASAM 2025 strong recommendation), check PDMP, initiate specialist referral. Reframe as "bridge both, document, and refer" rather than "choose one." See gap row 95. |
| 57 | Specialist input (psychiatry for benzo or pain mgmt for opiate, depending on driver) is required before PCP owns both prescriptions               | faqs.opiates-combo.q2         | Needs revision | cdc-2022, vadod-2022, brunner-jgim-2025, asam-acmt-2025-benzo | Soften per Bundle 5 — not supported as hard requirement by any major guideline. CDC 2022: communicate with mental-health professionals + consider specialist consultation "if needed"; VA/DoD 2022: "consider obtaining a specialty consultation, as appropriate"; ASAM 2025: coordinate care with other prescribers but does not mandate specialist sign-off. Reframe as: "specialist input is **strongly recommended** and should be actively pursued, but the PCP **may continue managing both prescriptions** with appropriate documentation of risk-benefit assessment, naloxone provision, PDMP monitoring, and **regular reassessment at least every 3 months** (ASAM 2025)." State-level regulations may impose additional requirements — verify separately. See gap row 96. |
| 58 | Benzo taper in chronic-use patient is not safe to initiate unilaterally at first visit (abrupt reduction → withdrawal seizure risk)               | faqs.opiates-combo.q3         | Verified   | cdc-2022, asam-acmt-2025-benzo, brunner-jgim-2025, soyka-nejm-2017, robertson-aafp-2023 | Add [ref:X] markers — strongly supported. CDC 2022: abrupt withdrawal can cause "rebound anxiety, hallucinations, seizures, delirium tremens, and rarely death." ASAM 2025: do not discontinue BZDs abruptly in physically dependent patients; tapering individualized. Soyka NEJM 2017: gradual discontinuation over 4–8 weeks minimum; **hospitalization for ≥100 mg diazepam-equivalent daily**. Add nuance per AAFP 2023: reason is not just seizure risk — first visit also lacks therapeutic relationship, baseline assessment, and coordination needed for safe tapering; successful deprescribing requires patient education, shared decision-making, frequent dialogue. |
| 59 | Benzo taper plan should be coordinated (ideally with psychiatry) and kept separate from the opiate management conversation                        | faqs.opiates-combo.q3         | Verified with nuance | cdc-2022, cdc-2016, soyka-nejm-2017, wang-jcm-2023, asam-acmt-2025-benzo | Add [ref:X] markers + significant nuance per Bundle 5. (1) Avoiding simultaneous tapers is well-supported — Soyka NEJM 2017: "concurrent opioid detoxification is not recommended" during benzo tapering; opioid dose should be kept stable. (2) Coordinating with psychiatry is recommended but **not mandated** — CDC says "communicate with mental health professionals managing the patient"; if no psychiatrist involved, PCP or addiction specialist can manage taper. (3) **CDC 2022 shifted from 2016** which suggested "might be safer to taper opioids first" to a more **individualized 2022 approach**; 2023 scoping review (Wang) found 0 of 26 guidelines provided specific deprescribing-sequence guidance; the 4 that addressed it gave **conflicting** recommendations. (4) **Critical missing sequencing nuance:** ASAM 2025 says patients with OUD should be **stabilized on MOUD before** initiating benzo taper. See gap row 97. |
| 60 | UDS positive for cocaine in chronic opiate patient → confirm send-out, do not prescribe at visit, treat as OUD evaluation trigger                 | faqs.opiates-uds-fail.q1      | **Needs revision (MOD — potentially harmful)** | cdc-2022, appa-dad-2024, kennedy-plos-2022, babu-nejm-2019 | **Rewrite per meta-pass + Bundle 4 — multiple needed corrections.** (1) CDC 2022: toxicology should NOT be used punitively; "clinicians should not dismiss patients from care on the basis of a toxicology test result." (2) Cocaine alone does NOT diagnose OUD — module conflates cocaine-positive with OUD-eval; correct framing is **comprehensive SUD evaluation** (stimulant use disorder, polysubstance use, co-occurring SUDs may all be present) → MOUD only if OUD criteria met. (3) Operational sequence: confirm send-out → structured SUD assessment → prescribe naloxone → consider MOUD if OUD criteria met → do NOT reflexively discontinue. (4) Kennedy 2022 + appa-2024 + babu-NEJM-2019: abrupt opioid discontinuation in this context elevates overdose risk, particularly among concurrent-OUD patients. (5) NEJM Babu 2019: "OUD in patients with chronic pain is an indication for more care rather than less." See gap row 84 (non-dismissal principle) + gap row 90 (comprehensive SUD eval workflow). |
| 61 | Cutting an OUD patient off prescribed opioids without treatment significantly elevates overdose risk from illicit opioid use                      | faqs.opiates-uds-fail.q1      | Verified   | cdc-2022, appa-dad-2024, kennedy-plos-2022, babu-nejm-2019 | Add [ref:X] markers — Bundle 4 confirms with additional citations. Kennedy 2022 PLoS Med BC retrospective cohort directly supports increased overdose risk on opioid discontinuation, particularly among concurrent-OUD patients. |
| 62 | UDS positive for non-prescribed fentanyl is a high-acuity finding indicating illicit street-opioid use (supplementing or substituting)            | faqs.opiates-uds-fail.q2      | Verified with nuance | cdc-2022, babu-nejm-2019 | Add [ref:X] markers + technical caveats. CDC 2022: "testing for fentanyl is not available in widely used toxicology assays, potentially leading to false assurance" — if fentanyl is detected, it was likely tested for specifically (increases reliability). **Critical missing nuance: drug-supply cross-contamination** — fentanyl appears in counterfeit pills, mixed into cocaine/methamphetamine/benzodiazepines; patient may not know they were exposed. Doesn't reduce acuity, changes counseling approach. Confirm with LC-MS/MS if detected on POC. See new gap row 91. |
| 63 | Non-prescribed fentanyl on UDS → OUD/MOUD conversation, not prescription continuation; engage with empathy, not termination                       | faqs.opiates-uds-fail.q2      | Verified with nuance | cdc-2022, babu-nejm-2019, kennedy-plos-2022, fda-oxycodone | Add [ref:X] markers + expand. Clinical response should include: naloxone prescribing, **fentanyl test strip education** (gap — module doesn't currently mention this), structured OUD assessment, MOUD discussion — framed as safety intervention, not punitive. Abrupt discontinuation in this scenario carries the highest overdose risk per Kennedy 2022. See new gap row 92. |
| 64 | Three-pharmacy fill pattern is a red flag requiring explanation, not a confirmed diversion finding                                                | faqs.opiates-pdmp-concern.q1  | Verified with nuance | cdc-2022, greene-ajadd-2017 | Add [ref:X] markers — supported in principle. CDC guidelines flag multi-pharmacy as concerning but do NOT define a numeric threshold; literature has used ≥4 pharmacies in 90 days. "Three" is a reasonable clinical heuristic but should not be presented as a validated threshold. Module already acknowledges legitimate alternatives — keep that framing. Common legitimate reasons: pharmacy closures, mail-order vs retail splits, travel, formulary/network changes, specialty pharmacy requirements. |
| 65 | Send-out UDS confirms whether the patient is actually taking the medication when PDMP pattern is unexplained                                      | faqs.opiates-pdmp-concern.q1  | —          | —      | _Bundle 2 / Bundle 4 pending_ |
| 66 | Required PDMP-concern documentation: dates, prescribers, pharmacies, quantities, what was asked, what was answered, clinical assessment           | faqs.opiates-pdmp-concern.q2  | Verified with nuance | cdc-2022 | Add [ref:X] marker — module's documentation framing is consistent with CDC 2022 (discuss + document + verify). Strengthen with explicit guideline language: PDMP info should be used in context of other clinical info (history, physical, testing); risk scores not validated against outcomes; do not dismiss patients based on PDMP info. |
| 67 | Early-refill threshold ladder: 1 → conversation + doc; 2+/12 mo → formal warning + UDS + PDMP; 3+/12 mo → e-consult before continuation           | faqs.opiates-behavior.q1      | **Needs revision (institutional, not guideline)** | aps-aapm-chou-2009, cdc-2022, vadod-2022, arnold-aafp-2023, brown-dad-2017, blum-jsat-2016 | **Rewrite per Bundle 7 — the specific 1/2+/3+ thresholds are not supported by ANY published guideline.** Closest published data point: APS/AAPM 2009 — "one or two episodes of unauthorized opioid escalations" can often be managed with education + enhanced monitoring; "4+ previous aberrant drug-related behaviors" (any type, not just early refills) is the inflection point for SUD concern. CDC 2022 deliberately avoids rigid thresholds; VA/DoD 2022 lists "using more than prescribed and/or running out early" as a factor for more frequent f/u without specifying a count. **Two structural corrections to module language:** (1) PDMP review under NY I-STOP is mandatory before EVERY CS Rx, not at the 2+ threshold (and NJ has its own structure per row 87); (2) UDS should be **baseline monitoring** for all chronic-opiate patients, not only triggered by early-refill thresholds — see new gap row 102. Reframe entire ladder as: "Practice-level escalation framework — no published guideline specifies numeric early-refill thresholds." |
| 68 | Document each early-refill instance at time of occurrence (patterns only visible if individual events are charted)                                | faqs.opiates-behavior.q1      | Verified   | aps-aapm-chou-2009, cdc-2022, cdc-2016, webster-pmr-2015, acoem-2017-otc | Add [ref:X] markers — accurate and defensible documentation principle. APS/AAPM 2009: monitoring should include documentation of pain intensity, function, progress toward goals, AEs, adherence. CDC 2016+2022 emphasize ongoing documentation at each encounter. Real-time pattern documentation enables retrospective recognition + medicolegal protection. Document fields per Bundle 7: date of request, reason given, clinical response, monitoring actions taken. |
| 69 | Frequent between-visit patient contact around CS (early refills, dose increases, exceptions) is itself a behavioral red flag                      | faqs.opiates-behavior.q2      | Verified with nuance | paice-jco-2016, kaye-painphys-2017a, kaye-painphys-2017b, merlin-jgim-2018, cdc-2022, aps-aapm-chou-2009, arnold-aafp-2023 | Add [ref:X] markers + critical differential-diagnosis nuance. Aberrant behaviors are well-established in pain literature (ASCO 2016 categorizes "pattern of early refills" as aberrant; Merlin 2018 Delphi: "asking for dose increase" + "using more than prescribed" most common concerning behaviors in LTOT). **Critical missing nuance:** CDC 2022 + APS/AAPM emphasize aberrant behaviors have a **differential diagnosis** — may reflect undertreated pain, psychiatric comorbidity, social stressors, OR opioid use disorder, not exclusively misuse. Reframe module language: "behavioral signal warranting documentation and clinical assessment — not an automatic indicator of misuse." Document the pattern; interpret only after clinical assessment. |
| 70 | Establishing in writing that CS questions are addressed only at scheduled visits (not phone/portal) is appropriate practice pattern              | faqs.opiates-behavior.q2      | Needs revision | cdc-2022, alford-jama-2013, acoem-2017-otc, jannetto-jalm-2018, bruce-cid-2017 | Soften — partially supported as practice-management strategy. Multiple professional societies endorse CSAs/PPAs that govern Rx management timing, but **NO guideline specifically endorses restricting all CS communication to scheduled visits**. Blanket policy could create safety risks (acute pain crisis, withdrawal due to pharmacy issue, concerning symptoms). CDC 2022: f/u at least q3mo with telehealth permissible. **Reframe:** "Routine CS management decisions (refill timing, dose adjustments) are addressed at scheduled visits. Urgent clinical concerns will be triaged appropriately." Preserves the structure but adds an exception pathway. See new gap row 103. |
| 71 | "Schedule II opiates are not replaced for loss or theft as a matter of institutional policy" — verify framing (institutional, not federal DEA regulatory) | faqs.opiates-behavior.q3 | **Verified** | cfr-1306-04, cfr-1306-11, usc-21-829, asam-risk2024, osborne-jmwh-2017, webster-pmr-2015, acoem-2017-otc | **Resolved via `verification/controlled-substances-ny-nj.md` (R9), confirmed by Bundle 7.** Federal law (21 CFR §1306.04, §1306.11–12, 21 USC §829) does NOT categorically prohibit replacement; validity governed by §1306.04 (legitimate medical purpose, usual course of professional practice). Module framing is correct — institutional/risk-management policy, not federal regulation; prescriber retains clinical discretion. Drop in canonical Snippet F from the regulatory file. ACOEM template language: "I understand that lost, damaged, or stolen medication will NOT be replaced" — framed as condition of treatment agreement, not legal requirement. |
| 72 | Offering to file a police report at patient request creates a record without altering the no-replacement decision                                 | faqs.opiates-behavior.q3      | Verified   | acoem-2017-otc | Add [ref:X] marker — supported by ACOEM Opioid Treatment Contract template language: "I agree to immediately report stolen opioid medication(s) to the police. My provider will also produce a police report if requested to do so." Police report is a documentation step, not a replacement trigger. Clinician should document the offer + patient's response regardless of whether report is filed. |
| 73 | A single loss event is not disqualifying for future prescribing but should be noted and factored into monitoring                                  | faqs.opiates-behavior.q3      | Verified   | aps-aapm-chou-2009, cdc-2022, merlin-jgim-2018 | Add [ref:X] markers — well-aligned with current guidance. APS/AAPM 2009: less serious aberrant behaviors (incl. isolated episodes) can be managed with education + enhanced monitoring rather than discontinuation. CDC 2022: warns against dismissing patients or abruptly discontinuing based on single concerning findings ("can adversely affect patient safety"). Merlin Delphi 2018: experts agreed "stopping opioids is not important initially" when concerning behaviors arise. Single-loss-event response: document event + PDMP review + consider UDS + secure-storage conversation + CSA notation — not discontinuation. |
| 74 | Chronic non-cancer pain and OUD coexist more often than they are mutually exclusive                                                              | faqs.opiates-oud.q1           | Verified with nuance | cdc-2022, archambault-jcn-2024, hasin-ajp-2022 | Soften — directionally correct but could mislead. **Majority of chronic-pain LTOT patients do NOT meet OUD criteria** (any-OUD prevalence 21–27%; mod-severe 4–9%). Reframe as: "co-occurrence is common enough that it should always be assessed, and the two conditions are not mutually exclusive." Important DSM-5 nuance: tolerance + withdrawal don't count toward OUD diagnosis if they occur solely in the context of opioids taken as prescribed. Use **pain-adjusted diagnostic approaches** to avoid over-diagnosing OUD in patients whose behaviors are driven purely by therapeutic intent. |
| 75 | OUD signs alongside chronic pain: continued use despite harm, inability to adhere despite genuine effort, loss of control, withdrawal driving use, social/functional deterioration | faqs.opiates-oud.q1 | **Needs revision** | cdc-2022, vadod-2022, hasin-ajp-2022, dsm5-2022, babu-nejm-2019, arnold-aafp-2023 | **Rewrite per Bundle 8 — replace informal 5-element list with formal DSM-5 11-criterion checklist.** Module's current list partially maps to DSM-5 but conflates and oversimplifies. Key corrections: (a) "inability to adhere despite genuine effort" is not a DSM-5 criterion per se — may reflect "taking in larger amounts than intended" or "unsuccessful efforts to cut down"; the qualifier distinguishes compulsive use from intentional diversion or other-cause nonadherence; (b) "withdrawal symptoms driving use more than pain relief" captures an important clinical observation but is not a standalone DSM-5 criterion; DSM-5 withdrawal criterion counts only if outside context of appropriate medical use — exactly the diagnostic challenge pain-adjusted instruments address. **Document which DSM-5 criteria are met + whether behaviors are driven by therapeutic intent vs nontherapeutic motives.** See gap row 104. |
| 76 | MOUD significantly outperforms taper or discontinuation for outcomes including overdose survival                                                  | faqs.opiates-oud.q2           | Verified with nuance | harris-jama-2026, wakeman-jamaopen-2020, wakeman-nejmevid-2022, buresh-bmj-2021, lim-plosone-2022, blanco-lancet-2019 | Add [ref:X] markers + **must differentiate the three MOUDs**. Module currently lumps "buprenorphine, methadone, naltrexone" as equivalent — this is wrong. **Buprenorphine** all-cause mortality reduction RR 0.34 (95% CI 0.26–0.45, ~60% reduction); **methadone** RR 0.47 (95% CI 0.41–0.54, ~50% reduction). Wakeman 2020 comparative effectiveness: only buprenorphine/methadone was associated with reduced overdose + opioid-related acute care vs no treatment; naltrexone, inpatient detox, and behavioral interventions showed NO significant benefit over no treatment at 3-month f/u. **Oral naltrexone is no more effective than placebo**; XR-NTX inferior to buprenorphine in ITT analysis due to 7–10-day opioid-free induction barrier. Network meta-analysis ranking: methadone > buprenorphine > naltrexone for retention. See gap row 105. |
| 77 | Buprenorphine (Suboxone) for OUD can be initiated in primary care and is within PCP scope                                                        | faqs.opiates-oud.q2           | Verified with nuance | lefevre-jabfm-2023, acog-mate-2025, ostrach-japha-2023, varisco-japha-2023, christine-jamaopen-2024, chua-nejm-2024, arnold-aafp-2023 | Add [ref:X] markers + state-level constraints note. X-waiver eliminated Dec 2022 via MAT Act / Consolidated Appropriations Act (effective Jan 2023). Any practitioner with standard DEA + Schedule III authority can prescribe with **no patient caps**. 8-hr SUD training required for new/renewed DEA registrations. **Important nuance:** state-level regulations may still impose additional requirements not aligned with federal change — AAFP: "many of us work under strict state requirements that are not aligned with this guidance." X-waiver elimination has increased prescriber pool but has NOT yet translated to meaningful increases in patients receiving buprenorphine — interest, comfort, and systems-level barriers remain primary obstacles. Module should explicitly flag the state-verification requirement (esp. for NY+NJ scope per row 87). See gap row 106. |
| 78 | Methadone for OUD requires an OTP clinic; cannot be prescribed for OUD from a primary care office                                                 | faqs.opiates-oud.q2           | Verified with nuance | calcaterra-jamaopen-2025, harris-jama-2026, cdc-2022, tschampl-jamaopen-2026 | Add [ref:X] markers + **important exceptions module currently doesn't capture**. Federal: outpatient methadone for OUD only via SAMHSA-certified OTPs. Exceptions: (a) **72-hour rule** — any clinician may **administer** (not prescribe) methadone for up to 72 hrs to treat acute opioid withdrawal while arranging OTP referral; updated regs allow 3-day supply dispensed at one time; (b) **hospital exception** — hospitalized patients can be initiated/continued during inpatient stays; (c) **methadone for pain ≠ methadone for OUD** — methadone CAN be prescribed by any DEA-registered clinician for a pain indication and filled at retail pharmacy; (d) **evolving landscape** — active advocacy for pharmacy-based methadone dispensing for OUD per Tschampl JAMA Open 2026, not yet law. See gap row 107. |
| 79 | OUD should not be framed as a moral failure to the patient or in documentation                                                                   | faqs.opiates-oud.q2           | Verified   | cdc-2022, gibson-asam-2024, kowalchuk-aafp-2024, blanco-lancet-2019, volkow-jamapsych-2019 | Add [ref:X] markers — strongly supported across all major guidelines + professional societies. CDC 2022: "opioid use disorder is a chronic, treatable disease from which persons can recover"; "discuss their concern with their patient in a nonjudgmental manner." ASAM 2024: communicate "with compassion and respect and without judgment"; stigmatizing interactions "can drive people away from the care they need." Volkow JAMA Psych 2019: NIDA terminology guide for documentation standards (person-first: "patient with OUD" rather than "opioid abuser" or "addict"; avoid volitional-failure language e.g. "refuses to comply"). NEJM frames OUD as neurobiological — striatocortical circuits + extended amygdala + prefrontal cortex — reinforcing disease model. See gap row 108 for explicit person-first-language guidance addition. |
| 80 | Continuity of opiate Rx with close monitoring while OUD evaluation + MOUD referral are pending is safer than discontinuation without a plan      | faqs.opiates-oud.q3           | **Verified (strongly supported)** | cdc-2022, kennedy-plos-2022, agnoli-jama-2021 | Add [ref:X] markers — one of the best-evidenced claims in the module. Kennedy PLoS Med 2022 BC retrospective cohort: discontinuation associated with increased overdose risk across all groups; **highest risk among patients with OUD not receiving OAT, AHR 3.18 (95% CI 1.87–5.40)**. Agnoli JAMA 2021: tapering associated with aIRR 1.68 overdose, 2.28 mental-health crisis. CDC 2022 Rec 5 explicitly: "opioid therapy should not be discontinued abruptly" + "patients prescribed opioids but unable to access ongoing care might be at risk for abrupt opioid discontinuation." FDA prescriber warning re withdrawal/distress/suicidality on rapid reduction. **Critical context:** fentanyl-contaminated illicit supply adds layer of lethality not present in earlier eras. Documentation pattern: "Continuing current opioid regimen at [dose] with [interval] monitoring to prevent abrupt discontinuation harms while OUD evaluation is completed and MOUD transition is arranged, per CDC 2022 Guideline Recommendation 5." Bridging strategy, not indefinite. |
| 81 | _(GAP — surfaced by Bundle 1)_ Methadone conversion factor (× 4.7 per CDC, highly variable + dose-dependent) is MISSING from the module's MME table | faqs.opiates-mme.q1 _(gap)_ | Needs revision | cdc-2022 | Add new content — methadone × 4.7 with caveat that conversion is highly variable and dose-dependent; methadone requires special caution due to long, variable half-life |
| 82 | _(GAP — surfaced by Bundle 1)_ Tapentadol conversion factor (× 0.4 per CDC) is MISSING from the module's MME table                                  | faqs.opiates-mme.q1 _(gap)_ | Needs revision | cdc-2022 | Add new content — tapentadol × 0.4 |
| 83 | _(GAP — surfaced by meta-pass + Bundle 1)_ Tramadol's dual-mechanism (µ-agonist + SNRI) caveat — CDC notes overdose relationship may not be dose-dependent like pure µ-agonists | faqs.opiates-mme.q1 _(gap)_ | Needs revision | cdc-2022 | Add new content alongside tramadol × 0.2 fix (row 39); brief note that dose-overdose relationship is unlike pure µ-agonists |
| 84 | _(GAP — surfaced by Bundle 2)_ PDMP-generated risk scores have NOT been validated against clinical outcomes; module should warn against relying on algorithmic scores; CDC notes scores can lead to stigmatization and may disparately affect women, persons of color, and persons living in poverty; non-dismissal principle ("clinicians should not dismiss patients from practice on the basis of PDMP information") applies broadly | faqs.opiates-pdmp.q1 _(gap)_ AND faqs.opiates-pdmp-concern.q2 _(gap)_ | Needs revision | cdc-2022, perry-add-2022 | Add new content — small explicit note in PDMP FAQs about risk-score limitation + non-dismissal principle. Pairs with cocaine-positive UDS rewrite (row 60) under broader "non-punitive use of monitoring" theme. |
| 85 | _(GAP — surfaced by Bundle 3)_ Patient-abandonment warning when refusing to prescribe without signed CSA — CDC 2022 explicitly warns clinicians "should avoid dismissing patients from care and should ensure (provide or arrange) appropriate care for patients with pain"; module's current refusal-to-prescribe framing must include alternative-care-pathway documentation (non-opioid pain mgmt, pain-specialist referral, bridge Rx with short-interval f/u) | faqs.opiates-agreement.q3 _(gap)_ | Needs revision | cdc-2022 | Add new content — small extension to the refusal FAQ. Pairs with row 28 update + row 60 (cocaine UDS) + row 84 (non-dismissal principle) under broader "documented alternatives, not termination" theme. |
| 86 | _(GAP — surfaced by Bundle 3)_ PEG scale + 30% improvement in pain AND function is the CDC-defined threshold for "clinically meaningful improvement" with chronic opioid therapy; module currently has no validated assessment instrument or numeric improvement threshold | faqs.opiates-agreement.q2 _(gap)_ AND green_zone.narrative_html _(gap)_ | Needs revision | cdc-2022, cdc-2016 | Add new content — explicit reference to PEG scale (Pain, Enjoyment, General activity) + 30% improvement threshold for clinically meaningful improvement on both pain AND function. Useful operational anchor for follow-up visits beyond the first. APS/AAPM context: total pain relief is rare; improvement averages <2-3 points on 0-10 scale. |
| 87 | _(SCOPE DECISION — resolved by user 2026-05-03)_ Module is intended to support NY **and** NJ. PDMP language must be dual-state: NY per-prescription duty under §3343-a (Schedule II/III/IV) + NJ initial + quarterly duty under NJSA 45:1-46.1. | faqs.opiates-pdmp.q1 _(scope)_ | **Resolved — dual-state** | ny-pbh-3343a, nj-njsa-45-1-46-1 | **Decision: NY + NJ.** Drop in Snippets A + B side-by-side from `verification/controlled-substances-ny-nj.md` when rewriting `faqs.opiates-pdmp.q1` answer_html. Federal claims (Schedule II no-refill, sequential post-dating, lost/stolen institutional-policy framing) apply equally in both states and don't need conditional framing. EPCS mandates also covered in both states (NY 2016-03-27, NJ 2018-05-01) per Snippet E if module ever touches e-prescribing. |
| 88 | _(GAP — surfaced by Bundle 4)_ Wrong assay ordered as differential for negative-for-prescribed-opiate UDS — the standard "opiate" immunoassay does NOT detect oxycodone, fentanyl, methadone, or buprenorphine; a chronic oxycodone patient can show "no opiates detected" on a routine cup test. Module currently doesn't mention this even though it's one of the most common explanations. | faqs.opiates-uds.q2 _(gap)_ | Needs revision | alford-jama-2013, cdc-2022, stolbach-jmt-2022 | Add new content — single most operationally important addition to the UDS-negative differential. PCP should verify the assay panel detects the prescribed agent before drawing conclusions. |
| 89 | _(GAP — surfaced by Bundle 4)_ "Running out early due to undertreated pain" as differential for absent prescribed opiate — patient used more than prescribed and has none left at testing. Distinct from diversion + clinically actionable (suggests dose may be inadequate or PRN guidance unclear). Module's current "diversion or stockpiling" framing reads punitively. | faqs.opiates-uds.q2 _(gap)_ | Needs revision | bruce-cid-2017, alford-jama-2013 | Add new content — pairs with row 32 expanded differential. Reframe so undertreated-pain is named explicitly alongside diversion, not collapsed into it. |
| 90 | _(GAP — surfaced by Bundle 4)_ Comprehensive SUD evaluation (vs OUD-only screening) for unexpected non-opioid substance findings on UDS — cocaine-positive doesn't itself diagnose OUD; it may indicate stimulant use disorder, polysubstance use, or co-occurring SUDs. Module's current "OUD evaluation trigger" framing collapses these distinct entities. | faqs.opiates-uds-fail.q1 _(gap)_ | Needs revision | cdc-2022, kennedy-plos-2022, babu-nejm-2019 | Add new content — pairs with row 60 rewrite. Operational: structured SUD assessment (DSM-5 criteria across substance classes, not just opioid) → MOUD if OUD present, plus separate stimulant use disorder management. FU-5 covers operational workflow detail (TAPS / NIDA / DSM-5 OUD). |
| 91 | _(GAP — surfaced by Bundle 4)_ Drug-supply cross-contamination — fentanyl is increasingly present in counterfeit pills + mixed into non-opioid drugs (cocaine, methamphetamine, benzodiazepines); patient with non-prescribed fentanyl on UDS may not have knowingly used an opioid. Module currently frames non-prescribed fentanyl as conscious illicit-opioid use, which oversimplifies. | faqs.opiates-uds-fail.q2 _(gap)_ | Needs revision | cdc-2022 | Add new content — doesn't reduce acuity but changes counseling approach (the safety conversation is "the supply is contaminated and you may have been exposed without knowing" rather than "you used street opioids"). Pairs with row 62 update + row 92 (fentanyl test strips). |
| 92 | _(GAP — surfaced by Bundle 4)_ Fentanyl test strip education for patients exposed to non-prescribed fentanyl or otherwise at high overdose risk — harm-reduction intervention recommended in CDC framing of unexpected fentanyl findings. Module's current OUD-pathway framing in `faqs.opiates-uds-fail.q2` doesn't include this concrete patient-education step. | faqs.opiates-uds-fail.q2 _(gap)_ | Needs revision | cdc-2022, babu-nejm-2019 | Add new content — explicit naloxone + fentanyl test strip + structured OUD assessment + MOUD discussion as the four-element response, framed as safety intervention not punitive. |
| 93 | _(GAP — surfaced by Bundle 4)_ Pre-test conversation framing — "If we test you today, what will we find in your urine? Will there be any surprises?" Per AAPM consensus + CDC 2022, this proactive question can sometimes yield candid explanation that obviates need for confirmatory testing. Module currently has no pre-test conversation framing. | faqs.opiates-uds.q1 _(gap)_ AND faqs.opiates-uds-fail _(gap)_ | Needs revision | cdc-2022, aapm-argoff-2018 | Add new content — short patient-conversation pattern; small but high-leverage operational addition. Pairs with row 31 (non-dismissal) + row 32 expanded differential. |
| 94 | _(GAP — surfaced by Bundle 5)_ Time-dependent overdose risk in opiate-benzo concurrent use — risk highest in first 90 days, drops to non-significant levels after 180 days of stable concurrent use (Hernandez JAMA Open 2018, HR 5.05 → NS). Module's "3–4×" framing in `faqs.opiates-combo.q1` is static and doesn't capture this clinically important nuance. | faqs.opiates-combo.q1 _(gap)_ | Needs revision | hernandez-jamaopen-2018, cdc-2022 | Add new content — time-dependence is the most operationally important nuance for inherited-patient context. Long-stable patients carry meaningfully lower (still elevated) risk than newly-started concurrent regimens. Frames why "destabilize-via-abrupt-change" is the wrong move for stable inherited patients. |
| 95 | _(GAP — surfaced by Bundle 5)_ "Bridge both, document, and refer" first-visit pattern for inherited opiate+benzo combination — replace module's current "prescribe whichever more immediately necessary" framing with: continue both at current doses, document combination as known risk, prescribe naloxone, check PDMP, initiate specialist referral (initiated, not completed), shorter follow-up interval (2–4 weeks vs 3 months). | faqs.opiates-combo.q2 _(gap)_ | Needs revision | cdc-2022, vadod-2022, asam-acmt-2025-benzo | Add new content — replaces the "choose one" framing with the clinically safer "continue both with documented monitoring + active referral" pattern. Pairs with row 56 rewrite. |
| 96 | _(GAP — surfaced by Bundle 5)_ ASAM 2025 standing recommendation: risk-benefit reassessment **at least every 3 months** for any patient on chronic concurrent opiate + benzo regimen, regardless of stability. Module currently has no specific reassessment cadence in `faqs.opiates-combo.q2`. | faqs.opiates-combo.q2 _(gap)_ | Needs revision | asam-acmt-2025-benzo, brunner-jgim-2025 | Add new content — concrete reassessment cadence (≥ q3mo) becomes the operational anchor that ties the "PCP can manage both with safeguards" pattern (row 57) to a defensible documentation rhythm. |
| 97 | _(GAP — surfaced by Bundle 5)_ MOUD-before-benzo-taper sequencing for OUD-co-occurring patients — ASAM 2025 explicitly recommends stabilizing on MOUD (buprenorphine/methadone) BEFORE initiating benzodiazepine taper. Module's current opiate+benzo framing in `faqs.opiates-combo.q3` doesn't capture this sequencing. | faqs.opiates-combo.q3 _(gap)_ AND faqs.opiates-oud.q2 _(gap)_ | Needs revision | asam-acmt-2025-benzo, brunner-jgim-2025, cdc-2022 | Add new content — important sequencing consideration for OUD subset. Pairs with row 59 nuance + Bundle 8 OUD pathway. |
| 98 | _(GAP — surfaced by Bundle 6)_ Continuity-as-bridge framing for inherited high-dose patients — module's current FAQ language reads continuity as if it could be indefinite passive prescribing. CDC 2022 expects new clinician to establish treatment goals (incl. functional) and reassess within 3 months. Continuity is a bridge strategy, not an endpoint. Also: continuity is defensible only in absence of life-threatening safety signals (sedation, respiratory depression, slurred speech, evidence of active diversion). | faqs.opiates-highdose.q1 _(gap)_ | Needs revision | cdc-2022 | Add new content — explicit "bridge not endpoint" framing + life-threatening-safety-signal carve-out. Pairs with row 48 update. |
| 99 | _(GAP — surfaced by Bundle 6)_ Gradual-taper-may-improve-outcomes counterpoint — module's current "abrupt taper causes harm" framing is correct but reads as "taper is bad." CDC 2022 + Agnoli JAMA 2021 both note that **gradual taper (≤10% per month) with behavioral support** can actually improve pain, function, and quality of life. For patients on opioids ≥1 year, tapers can take months to years (AAFP). | faqs.opiates-mme.q3 _(gap)_ | Needs revision | cdc-2022, agnoli-jama-2021, arnold-aafp-2023, lin-nejm-2025 | Add new content — short note that distinguishes "rapid taper / discontinuation = harm" from "gradual taper with behavioral support = potentially beneficial." Important to avoid the equal-and-opposite error of locking in indefinite continuation. |
| 100 | _(GAP — surfaced by Bundle 6)_ 11-element first-visit framework for inherited LTOT (vs module's current 4-item checklist of PDMP/CSA/UDS/MME). CDC 2022 + Coffin 2022 + VA/DoD 2022 + Sonoda 2025 + Lin 2025 collectively expect: (1) continue current regimen absent life-threatening signals, (2) calculate + document MME, (3) review PDMP, (4) order UDS baseline, (5) offer/Rx naloxone, (6) screen for OUD (TAPS/DAST), (7) assess functional status (PEG) + establish treatment goals, (8) check for concurrent benzos / CNS depressants, (9) document rationale for continuation + plan for reassessment, (10) arrange pain-mgmt consult if function not improving / documentation limited / ≥90 MME without clear justification, (11) schedule follow-up within 1–3 months. Module's current 4-item checklist captures #2/3/4 but is missing #1, 5, 6, 7, 8, 9, 10, 11. | checklist (all 4 items) _(gap)_ AND green_zone.narrative_html _(gap)_ AND faqs.opiates-highdose.q1 _(gap)_ | **Needs revision (significant scope expansion)** | cdc-2022, coffin-am-2022, sandbrink-aim-2023, sonoda-aafp-2025, lin-nejm-2025 | **Major addition.** No single guideline packages this as a checklist; the framework is a synthesis of CDC 2022 Recs 2/5/7/8/9 + Coffin Annals 2022 + VA/DoD 2022 + AAFP 2025 algorithm. Decision needed: expand the module's checklist itself (significant restructure) OR add the 11-element framework to the green-zone narrative + high-dose FAQ as supplementary guidance. Recommend the latter — module's 4-item checklist is intentionally compact for at-the-moment decisioning; the full 11-element framework belongs in the FAQ surface. |
| 101 | _(GAP — surfaced by Bundle 6)_ Patient-distress-as-clinical-signal framing — module's current "threats should not drive clinical decisions" is correct but treats the threat as noise. Patient distress at prospect of dose changes is a **clinically meaningful signal** (may reflect undertreated pain, anxiety, OUD features); documentation should capture not just the threat but the clinical assessment of what is driving it. CDC 2022: clinicians have "a responsibility to provide or arrange for coordinated management." | faqs.opiates-highdose.q3 _(gap)_ | Needs revision | cdc-2022, arnold-aafp-2023, sandbrink-aim-2023, blanco-lancet-2019 | Add new content — small but high-leverage reframe. Threat is data, not noise. Pairs with row 51 update + the broader non-abandonment principle (rows 28, 60, 84, 85). |
| 102 | _(GAP — surfaced by Bundle 7)_ UDS-as-baseline framing for chronic-opiate patients — module's current `faqs.opiates-behavior.q1` (early-refill ladder) implies UDS is **triggered** by the 2+ early-refill threshold, but CDC 2016/2022 + AACC 2018 (Jannetto) treat baseline UDS as **standard of care for all chronic-opiate patients regardless of behavioral flags**. Pairs with row 33 (UDS cadence — institutional convention informed by AAPM). | faqs.opiates-behavior.q1 _(gap)_ AND faqs.opiates-uds.q3 _(gap)_ | Needs revision | cdc-2016, cdc-2022, jannetto-jalm-2018 | Add new content — small but important framing fix. UDS is baseline monitoring, not a punitive trigger. Pairs with row 67 rewrite + row 33 institutional-convention labeling + the broader non-punitive-monitoring theme (rows 31, 60, 84, 90, 91). |
| 103 | _(GAP — surfaced by Bundle 7)_ Exception pathway for urgent CS clinical concerns within "scheduled-visits-only" policy — module's current `faqs.opiates-behavior.q2` framing is too rigid; blanket policy refusing all between-visit CS communication could create safety risks (acute pain crisis, withdrawal due to pharmacy issue, concerning symptoms). | faqs.opiates-behavior.q2 _(gap)_ | Needs revision | cdc-2022, alford-jama-2013, acoem-2017-otc | Add new content — preserve "routine CS management decisions at scheduled visits only" structure but add explicit "urgent clinical concerns will be triaged appropriately" exception pathway. |
| 104 | _(GAP — surfaced by Bundle 8)_ Formal DSM-5 11-criterion OUD checklist with pain-adjusted application — module's current 5-element informal sign list in `faqs.opiates-oud.q1` is insufficient. Should replace with DSM-5 11 criteria + DSM-5 exclusion (tolerance/withdrawal don't count if solely from prescribed use) + therapeutic-vs-nontherapeutic-intent distinction. | faqs.opiates-oud.q1 _(gap)_ | **Needs revision (significant content addition)** | cdc-2022, dsm5-2022, hasin-ajp-2022, vadod-2022 | Add new content — replaces row 75's informal sign list. Pairs with FU-5 + FU-7 (structured OUD assessment workflow). The 11 criteria are a checklist; the diagnostic approach is "apply each criterion + document whether the behavior is therapeutic-intent or nontherapeutic-intent." Use Hasin AJP 2022 pain-adjusted approach to avoid over-diagnosis. |
| 105 | _(GAP — surfaced by Bundle 8)_ MOUD differentiation — module's current `faqs.opiates-oud.q2` lumps buprenorphine + methadone + naltrexone as equivalent. They are NOT equivalent. Buprenorphine all-cause mortality reduction RR 0.34 (~60%); methadone RR 0.47 (~50%); oral naltrexone ≈ placebo; XR-NTX has 7–10-day opioid-free induction barrier and is inferior to buprenorphine in ITT analysis. | faqs.opiates-oud.q2 _(gap)_ | Needs revision | harris-jama-2026, wakeman-jamaopen-2020, wakeman-nejmevid-2022, lim-plosone-2022 | Add new content — table or short paragraph differentiating the three MOUDs with mortality numbers, induction-barrier, and recommended-line-of-therapy ordering (buprenorphine/methadone first-line; naltrexone second-line with caveats). Pairs with row 76 update. |
| 106 | _(GAP — surfaced by Bundle 8)_ State-level constraints on buprenorphine-for-OUD prescribing despite federal MAT Act elimination of X-waiver — particularly relevant given module's NY+NJ scope (row 87). Module's current `faqs.opiates-oud.q2` assertion that "buprenorphine can be initiated in primary care" is federally accurate but doesn't flag state-verification requirement. | faqs.opiates-oud.q2 _(gap)_ | Needs revision | arnold-aafp-2023, lefevre-jabfm-2023 | Add new content — flag that PCP should verify NY-specific + NJ-specific buprenorphine-prescribing requirements (registration, training, supervision rules) at time of use. AAFP: "many of us work under strict state requirements that are not aligned with this guidance." Pairs with row 77 update + row 87 dual-state scope decision. |
| 107 | _(GAP — surfaced by Bundle 8)_ Methadone-for-OUD exceptions module currently doesn't capture: (a) 72-hour rule (any clinician may **administer** for up to 72 hrs while arranging OTP referral; updated regs allow 3-day supply at one time); (b) hospital-initiation/continuation exception; (c) methadone-for-pain ≠ methadone-for-OUD prescribing-authority distinction (pain indication can go to retail pharmacy); (d) evolving landscape on pharmacy-based methadone dispensing for OUD. | faqs.opiates-oud.q2 _(gap)_ | Needs revision | calcaterra-jamaopen-2025, harris-jama-2026, tschampl-jamaopen-2026 | Add new content — small but operationally important. The 72-hour rule is the most likely PCP-relevant exception (bridging to OTP). The methadone-for-pain-vs-OUD distinction is a frequent point of confusion. Pairs with row 78 update. |
| 108 | _(GAP — surfaced by Bundle 8)_ Person-first language + NIDA terminology guidance for OUD documentation — module's current `faqs.opiates-oud.q2` ends with "Do not frame OUD as a moral failure to the patient or in documentation" but doesn't provide concrete language guidance. Should add: person-first ("patient with opioid use disorder" not "opioid abuser" or "addict"); avoid volitional-failure language ("refuses to comply"); reference NIDA terminology guide. | faqs.opiates-oud.q2 _(gap)_ AND faqs.opiates-uds-fail _(gap)_ | Needs revision | cdc-2022, gibson-asam-2024, volkow-jamapsych-2019, blanco-lancet-2019 | Add new content — small but high-leverage operational addition. Pairs with row 79 update + the broader non-stigmatizing-monitoring theme (rows 31, 60, 84, 90, 101). |

**Status summary:** **108 of 108 rows resolved** across meta-pass + Bundles 1–8 + regulatory hand-off + scope decision (2026-05-03). All verification work complete; tracker is now ready for the JSON-edit pass that lands `references[]` + `[ref:X]` markers in `clinical-modules.json`. Verdict distribution: 29 Verified, 30 Verified-with-nuance, 48 Needs-revision (incl. 1 HIGH/clinical-safety on tramadol × 0.1 → 0.2, 2 MOD/potentially-harmful on cocaine-positive UDS + opiate-benzo "prescribe-only-one" framing, 1 factually-wrong on cash-pay PDMP claim, 1 overstated-mandate on "required" CSA elements, 2 significant-content-additions on first-visit checklist + DSM-5 OUD criteria, 1 fabricated-thresholds on early-refill ladder, 28 GAP rows for missing content + 1 Resolved scope-decision row).

**Scope decision (2026-05-03 — user-resolved):** Module supports **NY + NJ**. All state-specific regulatory framing (currently row 20 / row 87) must be dual-state in the JSON-edit pass. Snippets A (NY) + B (NJ) from `verification/controlled-substances-ny-nj.md` are the canonical paste-in language. Federal claims (rows 71, and any future federal-CFR claim) apply equally in both states and don't need conditional framing. Bundles 4–8 should watch for additional state-specific touchpoints (e.g., state UDS/specialist-consultation thresholds, naloxone-coprescription state laws) and call them out for dual-state treatment as they surface.

**Bundles run:**
- **meta-pass** (2026-05-03) — broad section-by-section flag review
- **Bundle 1 — Regulatory & MME pharmacology** (2026-05-03) — tramadol error confirmed, 90 MME framing change confirmed, NY I-STOP + Sched II refill rules verified, lost/stolen institutional-policy framing verified, content gaps surfaced
- **Bundle 2 — PDMP red flags** (2026-05-03) — concurrent-benzo "most important" softened; "double-doctoring" too presumptive; **cash-pay PDMP claim factually wrong**; new gap on PDMP risk scores + non-dismissal principle
- **Bundle 3 — Controlled substance agreement** (2026-05-03) — "required elements" overstated (no national standard); functional-improvement framing strongly supported (add PEG-30% threshold + carve-out for progressive/catastrophic conditions); refusal-to-prescribe must include patient-abandonment guardrail (CDC 2022 alternatives-offered documentation pattern); new gaps on patient-abandonment + PEG scale
- **Regulatory hand-off** (2026-05-03) — primary-statute verification of NY/NJ PDMP duties + federal CFR Schedule II/III/IV mechanics + lost/stolen institutional-policy framing landed in `verification/controlled-substances-ny-nj.md`. Rows 20 (NY PDMP, now Verified with primary statute) and 71 (lost/stolen, now Verified with primary statute) lifted their "_Bundle 1 pending_" / OE-only-citation status. New gap row 87 surfaces the NY-vs-NY+NJ scope decision.
- **Bundle 4 — UDS interpretation + cadence** (2026-05-03) — POC FP/FN rates verified (PPV as low as 57% for oxycodone per Abou 2021); confirmation-required claim correct but **CDC 2022 goes further**: even confirmed unexpected results should not trigger dismissal; **module's negative-for-prescribed differential is significantly incomplete** (missing wrong-assay-ordered, running-out-early, specimen manipulation, lab error); CDC 2022 explicitly **declines** risk-stratified UDS cadence (module's tiers should label as institutional convention informed by AAPM/APS); cocaine-positive scenario needs **comprehensive SUD eval**, not just OUD screening; fentanyl-positive scenario needs **drug-supply cross-contamination** caveat + fentanyl-test-strip education. 6 new gap rows added (88–93).
- **Bundle 5 — Opiate-benzo combination** (2026-05-03) — "3–4×" mortality figure softened to range 2–5× with **time-dependence** (HR 5.05 first 90 days → NS after 180 days stable concurrent use); "synergistic" mechanism refined (sedation + airway compromise, not central-drive synergy); **two HIGH-MOD safety corrections**: (a) row 55 "cannot continue without specialist input" overstated — CDC 2022 Cat B is "particular caution," not "avoid"; (b) row 56 "prescribe whichever more immediately necessary" framing is wrong — should continue BOTH at current doses, not choose one. ASAM 2025 anchors mandatory naloxone + ≥ q3mo reassessment + MOUD-before-benzo-taper sequencing. 4 new gap rows added (94–97).
- **Bundle 6 — High-dose inherited patient (≥ 90 MME/day)** (2026-05-03) — abrupt-taper-harm (row 44) **strongly supported** by Agnoli JAMA 2021 (n=113,618; IRR 1.68 overdose, 2.28 MH crisis, 3.30 suicide attempt; dose-dependent); continuity at first visit endorsed by CDC 2022 Rec 5 with conditional ("absent life-threatening safety signals"); **row 49 documentation list incomplete** — missing OUD screening, mental-health screening, PEG functional assessment, concurrent-benzo check, treatment goals; **row 50 e-consult template not guideline-attributable** — relabel as institutional best practice; gradual-taper-with-behavioral-support is the important counterpoint to abrupt-taper-harm; 11-element first-visit framework (gap row 100) is the synthesis from CDC 2022 Recs 2/5/7/8/9 + Coffin 2022 + VA/DoD 2022 + Sonoda 2025 + Lin 2025. 4 new gap rows added (98–101).
- **Bundle 7 — Behavioral flags + lost medications** (2026-05-03) — **row 67 early-refill "1/2+/3+ ladder" not supported by ANY published guideline** — institutional convention; closest published data point is APS/AAPM 2009 "4+ aberrant behaviors of any type" (not just early refills) predicting SUD; reframe as practice-level convention. Row 70 "scheduled-visits-only" CS communication policy overstated — needs exception pathway for urgent clinical concerns. UDS-as-baseline-not-trigger framing surfaced as gap (row 102). Aberrant behaviors require **differential diagnosis** (undertreated pain, psychiatric comorbidity, social stressors, OUD), not automatic misuse assumption. Lost/stolen institutional-policy framing (row 71) confirmed by Bundle 7 + regulatory file. 2 new gap rows added (102–103).
- **Bundle 8 — OUD recognition + MOUD pathway** (2026-05-03) — chronic-pain + OUD coexistence verified-with-nuance (majority of LTOT patients DON'T meet OUD criteria; pain-adjusted DSM-5 approach required); **row 75 informal sign list must be replaced with formal DSM-5 11-criterion checklist**; **row 76 MOUD claim must differentiate** buprenorphine + methadone (strong: ~60% / 50% mortality reduction) from naltrexone (weak: oral ≈ placebo, XR-NTX inferior in ITT due to induction barrier); methadone-OUD-OTP-requirement (row 78) Verified but missing **72-hour rule + hospital exception + methadone-for-pain ≠ methadone-for-OUD** distinctions; buprenorphine PCP-scope (row 77) confirmed federal MAT Act / Dec 2022 elimination of X-waiver but state-level constraints may still apply (relevant for NY+NJ scope per row 87); row 80 (continuity safer than discontinuation) **strongly supported** — Kennedy 2022 AHR 3.18 for OUD patients without OAT; person-first language + NIDA terminology added as concrete documentation guidance (row 79 + gap 108). 5 new gap rows added (104–108).

---

## Cross-bundle synthesis: themes for the JSON-edit pass

This block is for the next session to use as scaffolding. Resolution effort is best organized around 5 cross-cutting themes rather than module-section-by-section, because the same cited material flows into multiple FAQs.

### Theme A — MME table fix (CDC-2022 alignment)
**Rows: 39, 81, 82, 83, 40 (+34, 35, 36, 37, 38, 41, 42, 43)**
- **HIGH PRIORITY:** tramadol × 0.1 → × 0.2 (clinical safety; row 39).
- Add methadone × 4.7 with variable-half-life caveat (row 81); tapentadol × 0.4 (row 82); tramadol dual-mechanism caveat (row 83).
- Add buprenorphine excluded from MME summation (row 40).
- Reframe 50 MME / 90 MME thresholds: 50 is "guidepost, not pharmacologic inflection" with continuous risk; CDC 2022 deliberately removed 90 MME from main rec — relabel from "specialist required at 90 MME" to "individualized assessment + state-specific specialist rules (e.g., WA 120 MME)" (rows 41, 42, 43, 10).
- Naloxone indications expansion: add sleep-disordered breathing + post-incarceration tolerance-loss; soften "ensure" to "offer"; CDC says "benzodiazepines specifically" not "any CNS depressant" (row 46); soften row-47 "standard of care, not optional" to "offer as standard of care."

### Theme B — Non-punitive monitoring + non-dismissal coherent rewrite
**Rows: 17, 19, 31, 60, 67, 69, 70, 84, 85, 90, 92, 93, 101, 102, 103, 108**
- Single coherent module-wide reframe per FU-8 prompt.
- "Double-doctoring" (row 17) → "warrants clarification."
- Cash-pay PDMP claim (row 19) → wholly rewritten (PDMPs are pharmacy-based; concern is cash-pay-by-insured-patient, not "doesn't appear on PDMP").
- Cocaine UDS "do not prescribe at this visit" (row 60) → safety conversation + comprehensive SUD eval (not just OUD) + individualized risk-benefit; if continuing, document enhanced monitoring + naloxone.
- Early-refill ladder (row 67) → label as institutional convention; UDS as baseline-not-trigger (row 102); exception pathway for urgent CS concerns within scheduled-visits-only policy (row 103).
- "Scheduled-visits-only" policy (row 70) → preserve structure + add urgent-clinical-concerns triage pathway.
- Aberrant behavior differential-dx framing (row 69) → "behavioral signal warranting documentation + clinical assessment, not automatic indicator of misuse."
- Patient-abandonment guardrail (rows 28, 85) → CDC 2022 alternatives-offered documentation pattern when refusing to prescribe.
- Pre-test conversation framing (row 93) → "If we test you today, what will we find in your urine?"
- Person-first language + NIDA terminology (row 108) → documentation standards.
- Patient-distress-as-clinical-signal (row 101) → threats are data, not noise.

### Theme C — Inherited-LTOT first-visit framework (11-element checklist)
**Rows: 7, 9, 8, 49, 50, 86, 100**
- Module's current 4-item checklist (PDMP / CSA / UDS / MME) is intentionally compact for at-the-moment decisioning. The 11-element CDC-2022-aligned framework belongs in the FAQ surface as supplementary guidance rather than expanding the checklist itself.
- Add: continue regimen absent life-threatening signals; review PDMP (NY+NJ per Snippets A+B); UDS baseline non-punitive; offer/Rx naloxone; OUD screen (TAPS/DAST); functional-status assessment (PEG scale); concurrent-benzo check; treatment-goal establishment + functional goals; document rationale + reassessment plan; pain-mgmt consultation if function not improving / docs limited / ≥90 MME without justification; f/u within 1–3 months.
- E-consult template (row 50) → relabel as institutional best practice, not guideline-derived.
- 90-day green-zone follow-up cadence (row 8) → strengthen with CDC 2022 Rec 7/8 citations + ≥ q3mo reassessment per ASAM 2025 if opiate+benzo concurrent.
- PEG scale + 30% improvement threshold for clinically meaningful improvement (row 86).

### Theme D — Opiate-benzo combination rewrite
**Rows: 11, 16, 23, 24, 52, 53, 54, 55, 56, 57, 58, 59, 94, 95, 96, 97, 107**
- Row 11 escalation softening: "any dose any indication" → CDC 2022 Cat B "particular caution."
- Row 16 "most important PDMP flag" → "one of co-equal top flags" (alongside high MME, uncoordinated multi-prescriber).
- Row 52 mortality figure → range 2–5× with time-dependence (HR 5.05 first 90 days → NS after 180 days stable concurrent use).
- Row 53 mechanism → "potentiation through complementary mechanisms (sedation + airway compromise)," not "synergistic on central drive."
- **Row 55 + 56 critical safety rewrite:** CDC 2022 + VA/DoD 2022 + ASAM 2025 do NOT mandate refusing to prescribe combination at first visit; do NOT "prescribe whichever more immediately necessary" (which means withholding one). Correct pattern: continue both at current doses + document combo as risk + naloxone + PDMP + initiate (not complete) referral + shorter f/u. Captured as gap row 95 ("bridge both, document, refer").
- ASAM 2025 anchors: ≥ q3mo reassessment cadence (row 96) + MOUD-before-benzo-taper sequencing for OUD-co-occurring patients (row 97).
- 72-hour methadone rule (row 107) — important for opiate+OUD subset.

### Theme E — UDS interpretation rewrite (`faqs.opiates-uds` + `faqs.opiates-uds-fail`)
**Rows: 29, 30, 31, 32, 33, 60, 61, 62, 63, 88, 89, 91, 92, 93, 102**
- Pairs naturally with Theme B (non-punitive monitoring) but is a self-contained UDS-FAQ rewrite.
- Row 32 expanded differential: wrong-assay-ordered + running-out-early-from-undertreated-pain + specimen manipulation + lab error + pharmacogenetic anomalies + dilution from uncontrolled diabetes.
- **Row 88 critical operational point:** standard "opiate" immunoassay does NOT detect oxycodone, fentanyl, methadone, buprenorphine — most common cause of false-negative for prescribed opioid.
- Row 91 fentanyl supply cross-contamination + row 92 fentanyl test strip education for non-prescribed fentanyl scenarios.
- Row 33 cadence label as institutional convention informed by AAPM 2018 (CDC 2022 declines risk stratification).

### Theme F — OUD recognition + MOUD pathway rewrite (`faqs.opiates-oud`)
**Rows: 15, 74, 75, 76, 77, 78, 79, 80, 104, 105, 106, 107, 108**
- Row 74 framing softening: majority of LTOT patients DON'T meet OUD; co-occurrence common but not exclusive.
- **Row 75 → DSM-5 11-criterion checklist with pain-adjusted application** (row 104).
- **Row 76 → differentiate three MOUDs:** buprenorphine + methadone first-line; naltrexone second-line with caveats (row 105).
- Row 77 buprenorphine + state-level verification flag (row 106).
- Row 78 methadone-OUD + 72-hour rule + hospital exception + methadone-for-pain distinction (row 107).
- Row 79 person-first language + NIDA terminology (row 108).
- Row 80 strongly supported continuity-during-OUD-eval — Kennedy AHR 3.18.

### Theme G — Regulatory framing (NY + NJ dual-state)
**Rows: 20, 71, 87, plus implicit framing in 9, 26, 49, 67**
- Row 87 scope decision resolved: NY + NJ. Drop in Snippets A + B from `verification/controlled-substances-ny-nj.md` for PDMP language; Snippets C + D for Schedule II/III/IV mechanics; Snippet F for lost/stolen; Snippet E for EPCS if module ever touches e-prescribing; Snippet G for dual-prescriber liability (relevant to row 16/17 framing).
- Module's regulatory ref_ids (`ny-pbh-3343a`, `nj-njsa-45-1-46-1`, `cfr-1306-04`, `cfr-1306-11`, `cfr-1306-12`, `cfr-1306-22`, `usc-21-829`, `usc-21-812`, `ny-pbh-3338`, `nj-njsa-45-1-46-4`, `asam-risk2024`) live in the regulatory file — when building `references[]`, copy canonical entries from there to avoid drift across the three CS modules.

**Highest-priority next moves (after Bundles 4–8):**
1. **Tramadol × 0.1 → 0.2** (row 39) — clinical-safety bug; verified by meta-pass + Bundle 1.
2. **Cash-pay PDMP rewrite** (row 19) — first half of claim is incorrect; PDMPs ARE pharmacy-based.
3. **CSA "required elements" reframe** (row 26) — relabel as "consensus-derived common elements" drawn from CDC 2022 + APS/AAPM + ACOEM + HIVMA/IDSA + state law.
4. **Patient-abandonment guardrail** (rows 28, 60, 84, 85) — coherent rewrite across CSA refusal + cocaine-UDS + PDMP-concern FAQs anchored on CDC's "should not dismiss patients" + "alternative care pathway must be offered."
5. **90 MME framing rewrite** (rows 10, 42, 43) — affects escalation #1 + FAQ thresholds + high-dose FAQ.
6. **Concurrent-benzo softening** (rows 11, 16) — "any dose any indication" + "most important flag" → CDC 2022 Cat B "particular caution," one of co-equal top flags.
7. **"Double-doctoring" → "warrants clarification"** (row 17).
8. **X-waiver elimination note** (row 77).
9. **MME-table gaps** (rows 81–83) — methadone × 4.7, tapentadol × 0.4, tramadol dual-mechanism caveat.
10. **Naloxone-indications expansion** (row 46) — add sleep-disordered breathing + post-incarceration tolerance loss; soften "ensure" to "offer"; "benzodiazepines specifically" not "any CNS depressant."
11. **Buprenorphine excluded from MME sum** (row 40).
12. **Distinguish single vs pattern early refills** (row 18) — Kern 2020: 75% of patients with an early refill have only one.
13. **Add PEG-30% threshold + functional-improvement carve-out** (rows 27, 86) — content gap; pair with green-zone follow-up cadence rewrite.

---

## References staging

As OE returns citations, capture them here with the `ref_id` that matches the tracker table. This becomes the `references[]` array in the opiate module once verification is complete. URLs that end in `doi.org/...` are deterministic from DOI; FDA label, CDC guideline, ASAM/AAFP, and NY DOH URLs are marked TBD (need manual lookup).

**Cross-module regulatory references:** Primary-statute ref entries (`usc-21-812`, `usc-21-829`, `cfr-1306-04`, `cfr-1306-11`, `cfr-1306-12`, `cfr-1306-22`, `ny-pbh-3343a`, `ny-pbh-3338`, `nj-njsa-45-1-46-1`, `nj-njsa-45-1-46-4`, `asam-risk2024`) live in `verification/controlled-substances-ny-nj.md` and are shared across all three controlled-substance modules (benzos / adhd / opiates). Do not duplicate them here — when the JSON-edit pass builds `references[]`, copy the canonical entries from that file. Tracker rows that cite these ref_ids point at the regulatory file's R-row + canonical Snippet for the operational language.

| ref_id | citation | url | accessed |
|--------|----------|-----|----------|
| cdc-2022 | Dowell D, Ragan KR, Jones CM, Baldwin GT, Chou R. CDC Clinical Practice Guideline for Prescribing Opioids for Pain — United States, 2022. MMWR Recomm Rep. 2022;71(3):1-95. doi:10.15585/mmwr.rr7103a1. | https://doi.org/10.15585/mmwr.rr7103a1 | 2026-05-03 |
| cdc-2016 | Dowell D, Haegerich TM, Chou R. CDC Guideline for Prescribing Opioids for Chronic Pain — United States, 2016. JAMA. 2016;315(15):1624-45. doi:10.1001/jama.2016.1464. | https://doi.org/10.1001/jama.2016.1464 | 2026-05-03 |
| wen-jpm-2022 | Wen RY, Atayee RS, Edmonds KP. A Comparison of Institutional Opioid Equianalgesia Tools: A National Study. J Palliat Med. 2022;25(11):1686-1691. doi:10.1089/jpm.2021.0678. | https://doi.org/10.1089/jpm.2021.0678 | 2026-05-03 |
| gershuny-bja-2025 | Gershuny V, Florian J, van der Schrier R, et al. Effect of Midazolam Co-Administered With Oxycodone on Ventilation: A Randomised Clinical Trial in Healthy Volunteers. Br J Anaesth. 2025;134(4):1170-1180. doi:10.1016/j.bja.2024.11.047. | https://doi.org/10.1016/j.bja.2024.11.047 | 2026-05-03 |
| fda-oxycodone | FDA Prescribing Information — Oxycodone Hydrochloride. Label updated 2026-01-14. | TBD (accessdata.fda.gov) | 2026-05-03 |
| asam-acmt-2025-benzo | Brunner E, Chen CYA, Klein T, et al. The Joint Clinical Practice Guideline on Benzodiazepine Tapering: Considerations When Benzodiazepine Risks Outweigh Benefits. American Society of Addiction Medicine / American College of Medical Toxicology, 2025 (ACMT 2024 listing same guideline). | TBD (asam.org) | 2026-05-03 |
| aapm-argoff-2018 | Argoff CE, Alford DP, Fudin J, et al. Rational Urine Drug Monitoring in Patients Receiving Opioids for Chronic Pain: Consensus Recommendations. Pain Med. 2018;19(1):97-117. doi:10.1093/pm/pnx285. | https://doi.org/10.1093/pm/pnx285 | 2026-05-03 |
| appa-dad-2024 | Appa A, McMahan VM, Long K, Shade SB, Coffin PO. Stimulant Use and Opioid-Related Harm in Patients on Long-Term Opioids for Chronic Pain. Drug Alcohol Depend. 2024;256:111065. doi:10.1016/j.drugalcdep.2023.111065. | https://doi.org/10.1016/j.drugalcdep.2023.111065 | 2026-05-03 |
| lefevre-jabfm-2023 | LeFevre N, St Louis J, Worringer E, et al. The End of the X-Waiver: Excitement, Apprehension, and Opportunity. J Am Board Fam Med. 2023;36(5):867-872. doi:10.3122/jabfm.2023.230048R1. | https://doi.org/10.3122/jabfm.2023.230048R1 | 2026-05-03 |
| acog-mate-2025 | ACOG Clinical Practice Update: Elimination of the DATA-Waiver Program. Obstet Gynecol. 2025;146(5):e105-e108. doi:10.1097/AOG.0000000000006066. | https://doi.org/10.1097/AOG.0000000000006066 | 2026-05-03 |
| aafp-roth-2020 | Roth AR, Lazris A, Haskell H, James J. Appropriate Use of Opioids for Chronic Pain. Am Fam Physician. 2020;102(6):335-337. | TBD (aafp.org) | 2026-05-03 |
| nccn-cancer-pain-2026 | NCCN Clinical Practice Guidelines in Oncology: Adult Cancer Pain (v1.2026), Table 2: Oral and Parenteral Opioid Equivalences (Table PAIN-G-11, p. 37). _Cited by OE for MME conversion comparisons; not yet referenced in module prose._ | TBD (nccn.org) | 2026-05-03 |
| chua-nejm-2024 | Chua KP, Bicket MC, Bohnert ASB, et al. Buprenorphine Dispensing After Elimination of the Waiver Requirement. N Engl J Med. 2024;390(16):1530-1532. doi:10.1056/NEJMc2312906. _OE figure source for X-waiver impact; supplementary to lefevre-jabfm-2023._ | https://doi.org/10.1056/NEJMc2312906 | 2026-05-03 |
| christine-jamaopen-2024 | Christine PJ, Chahine RA, Kimmel SD, et al. Buprenorphine Prescribing Characteristics Following Relaxation of X-Waiver Training Requirements. JAMA Netw Open. 2024;7(8):e2425999. doi:10.1001/jamanetworkopen.2024.25999. _OE figure source; supplementary._ | https://doi.org/10.1001/jamanetworkopen.2024.25999 | 2026-05-03 |
| asam-2021-moud | Morphine Milligram Equivalents for Medications for Opioid Use Disorder (MOUD). American Society of Addiction Medicine, 2021. _Source for "MME conversion factors should not be applied to methadone or buprenorphine when used for OUD treatment."_ | TBD (asam.org) | 2026-05-03 |
| hadland-peds-2024 | Hadland SE, Agarwal R, Raman SR, et al. Opioid Prescribing for Acute Pain Management in Children and Adolescents in Outpatient Settings: Clinical Practice Guideline. Pediatrics. 2024;:e2024068752. doi:10.1542/peds.2024-068752. _OE-cited for FDA 2016 class-wide boxed warning + 2017 MOUD-on-benzo clarification context._ | https://doi.org/10.1542/peds.2024-068752 | 2026-05-03 |
| fda-triazolam | FDA Prescribing Information — Triazolam. Label updated 2026-01-29. _Confirms class-wide 2016 boxed warning on opioid+benzo concomitant use._ | TBD (accessdata.fda.gov) | 2026-05-03 |
| fda-lorazepam | FDA Prescribing Information — Ativan (lorazepam). Label updated 2025-07-09. _Confirms class-wide 2016 boxed warning on opioid+benzo concomitant use._ | TBD (accessdata.fda.gov) | 2026-05-03 |
| brown-dad-2017 | Brown R, Riley MR, Ulrich L, et al. Impact of New York Prescription Drug Monitoring Program, I-Stop, on Statewide Overdose Morbidity. Drug Alcohol Depend. 2017;178:348-354. doi:10.1016/j.drugalcdep.2017.05.023. | https://doi.org/10.1016/j.drugalcdep.2017.05.023 | 2026-05-03 |
| blum-jsat-2016 | Blum CJ, Nelson LS, Hoffman RS. A Survey of Physicians' Perspectives on the New York State Mandatory Prescription Monitoring Program (ISTOP). J Subst Abuse Treat. 2016;70:35-43. doi:10.1016/j.jsat.2016.07.013. | https://doi.org/10.1016/j.jsat.2016.07.013 | 2026-05-03 |
| neuman-anesth-2020 | Neuman MD, Hennessy S, Small DS, et al. Drug Enforcement Agency 2014 Hydrocodone Rescheduling Rule and Opioid Dispensing After Surgery. Anesthesiology. 2020;132(5):1151-1164. doi:10.1097/ALN.0000000000003188. _Source for 21 CFR §1306.12 + Sched II no-refill rule + DEA non-regulation of early-fill timing._ | https://doi.org/10.1097/ALN.0000000000003188 | 2026-05-03 |
| osborne-jmwh-2017 | Osborne K. Regulation of Controlled Substance Prescribing: An Overview for Certified Nurse-Midwives and Certified Midwives. J Midwifery Womens Health. 2017;62(3):341-347. doi:10.1111/jmwh.12615. | https://doi.org/10.1111/jmwh.12615 | 2026-05-03 |
| chua-jamaopen-2022 | Chua KP, Waljee JF, Smith MA, et al. Estimation of the Prevalence of Delayed Dispensing Among Opioid Prescriptions From US Surgeons and Dentists. JAMA Netw Open. 2022;5(5):e2214311. doi:10.1001/jamanetworkopen.2022.14311. | https://doi.org/10.1001/jamanetworkopen.2022.14311 | 2026-05-03 |
| acoem-2017-otc | Opioid Treatment Contract. American College of Occupational and Environmental Medicine, 2017. _Source for "no-replacement-for-loss/theft is institutional/treatment-agreement policy, not federal law."_ | TBD (acoem.org) | 2026-05-03 |
| kern-pm-2020 | Kern DM, Cepeda MS, Salas M, et al. Frequency of Early Refills for Opioids in the United States. Pain Med. 2020;21(9):1818-1824. doi:10.1093/pm/pnaa161. _~10% baseline early-refill rate; 75% of those have only one — distinguishes pattern from isolated occurrence._ | https://doi.org/10.1093/pm/pnaa161 | 2026-05-03 |
| lange-pain-2015 | Lange A, Lasser KE, Xuan Z, et al. Variability in Opioid Prescription Monitoring and Evidence of Aberrant Medication Taking Behaviors in Urban Safety-Net Clinics. Pain. 2015;156(2):335-340. doi:10.1097/01.j.pain.0000460314.73358.ff. | https://doi.org/10.1097/01.j.pain.0000460314.73358.ff | 2026-05-03 |
| liebschutz-jamaim-2017 | Liebschutz JM, Xuan Z, Shanahan CW, et al. Improving Adherence to Long-term Opioid Therapy Guidelines to Reduce Opioid Misuse in Primary Care: A Cluster-Randomized Clinical Trial. JAMA Intern Med. 2017;177(9):1265-1272. doi:10.1001/jamainternmed.2017.2468. | https://doi.org/10.1001/jamainternmed.2017.2468 | 2026-05-03 |
| babu-nejm-2019 | Babu KM, Brent J, Juurlink DN. Prevention of Opioid Overdose. N Engl J Med. 2019;380(23):2246-2255. doi:10.1056/NEJMra1807054. _NEJM review characterizing "frequent loss of medication or early refills" as hallmarks of problematic opioid use._ | https://doi.org/10.1056/NEJMra1807054 | 2026-05-03 |
| manasco-pds-2016 | Manasco AT, Griggs C, Leeds R, et al. Characteristics of State Prescription Drug Monitoring Programs: A State-by-State Survey. Pharmacoepidemiol Drug Saf. 2016;25(7):847-51. doi:10.1002/pds.4003. _Source for PDMP-as-pharmacy-based-system structure + state reporting-lag variation._ | https://doi.org/10.1002/pds.4003 | 2026-05-03 |
| perry-add-2022 | Perry BL, Odabaş M, Yang KC, et al. New Means, New Measures: Assessing Prescription Drug-Seeking Indicators Over 10 Years of the Opioid Epidemic. Addiction. 2022;117(1):195-204. doi:10.1111/add.15635. _Longitudinal n=21.5M study showing traditional binary PDMP thresholds (N+ doctors / N+ pharmacies) performed no better than chance after 2015 — decreasing discriminative utility._ | https://doi.org/10.1111/add.15635 | 2026-05-03 |
| greene-ajadd-2017 | Greene MS, Chambers RA, Yiannoutsos CT, et al. Assessment of Risk Behaviors in Patients With Opioid Prescriptions: A Study of Indiana's Inspect Data. Am J Addict. 2017;26(8):822-829. doi:10.1111/ajad.12639. _Indiana INSPECT data: ≥4 pharmacies in 90 days as risk-behavior threshold._ | https://doi.org/10.1111/ajad.12639 | 2026-05-03 |
| aan-franklin-2014 | Franklin GM (American Academy of Neurology). Opioids for Chronic Noncancer Pain: A Position Paper of the American Academy of Neurology. Neurology. 2014;83(14):1277-84. doi:10.1212/WNL.0000000000000839. _Source for "signed treatment agreement at COAT initiation and annually."_ | https://doi.org/10.1212/WNL.0000000000000839 | 2026-05-03 |
| aps-aapm-chou-2009 | Chou R, Fanciullo GJ, Fine PG, et al. Clinical Guidelines for the Use of Chronic Opioid Therapy in Chronic Noncancer Pain. J Pain. 2009;10(2):113-30. doi:10.1016/j.jpain.2008.10.008. _APS/AAPM joint guideline; sample management plan in Appendix 7; "insufficient evidence to guide specific recommendations on which provisions to include."_ | https://doi.org/10.1016/j.jpain.2008.10.008 | 2026-05-03 |
| svirsky-milbank-2024 | Svirsky L, Howard D, Fried M, et al. The Legal Landscape for Opioid Treatment Agreements. Milbank Q. 2024;102(3):632-668. doi:10.1111/1468-0009.12699. _2024 legal landscape review: 27 states mandate OTAs; 23 + DC do not; substantial variation within mandated terms._ | https://doi.org/10.1111/1468-0009.12699 | 2026-05-03 |
| virani-psychs-2018 | Virani S, Aoun EG, Torres F, et al. Decoding New York State's Prescription Monitoring Program. Psychiatr Serv. 2018;69(9):956-958. doi:10.1176/appi.ps.201800143. _NY I-STOP scope/exemptions reference; supports "I-STOP mandates PDMP checks but does NOT mandate written OTA by statute."_ | https://doi.org/10.1176/appi.ps.201800143 | 2026-05-03 |
| bruce-cid-2017 | Bruce RD, Merlin J, Lum PJ, et al. 2017 HIVMA of IDSA Clinical Practice Guideline for the Management of Chronic Pain in Patients Living With HIV. Clin Infect Dis. 2017;65(10):e1-e37. doi:10.1093/cid/cix636. _Source for two-component OTA model (informed consent + plan of care); "agreement" vs "contract" framing._ | https://doi.org/10.1093/cid/cix636 | 2026-05-03 |
| arnold-aafp-2023 | Arnold MJ. Prescribing Opioids for Pain: Guidelines From the Centers for Disease Control and Prevention. Am Fam Physician. 2023;108(5):523-526. _AAFP summary of CDC 2022; notes guidelines are "careful to avoid strict requirements and limit the role of dosing thresholds, urine toxicology, and the prescription drug monitoring program."_ | TBD (aafp.org) | 2026-05-03 |
| laks-jgim-2021 | Laks J, Alford DP, Patel K, et al. A National Survey on Patient Provider Agreements When Prescribing Opioids for Chronic Pain. J Gen Intern Med. 2021;36(3):600-605. doi:10.1007/s11606-020-06364-2. _National survey: 80% of OTA reviews done by prescribers; average 13 minutes._ | https://doi.org/10.1007/s11606-020-06364-2 | 2026-05-03 |
| beck-jme-2021 | Beck AS, Svirsky L, Howard D. 'First Do No Harm': Physician Discretion, Racial Disparities and Opioid Treatment Agreements. J Med Ethics. 2021;medethics-2020-107030. doi:10.1136/medethics-2020-107030. _Ethics analysis of OTA-related stigma + racial disparities under excessive physician discretion._ | https://doi.org/10.1136/medethics-2020-107030 | 2026-05-03 |
| hegmann-joem-2014 | Hegmann KT, Weiss MS, Bowden K, et al. ACOEM Practice Guidelines: Opioids for Treatment of Acute, Subacute, Chronic, and Postoperative Pain. J Occup Environ Med. 2014;56(12):e143-59. doi:10.1097/JOM.0000000000000352. _ACOEM combined Opioid Consent Form + Treatment Agreement template (functional goals, risk acknowledgment, driving restrictions)._ | https://doi.org/10.1097/JOM.0000000000000352 | 2026-05-03 |
| nuckols-aim-2014 | Nuckols TK, Anderson L, Popescu I, et al. Opioid Prescribing: A Systematic Review and Critical Appraisal of Guidelines for Chronic Pain. Ann Intern Med. 2014;160(1):38-47. doi:10.7326/0003-4819-160-1-201401070-00732. _Systematic review of 13 opioid prescribing guidelines; consensus on opioid risk assessment tools, treatment agreements, UDT as risk-mitigation; variable development methods + limited evidence._ | https://doi.org/10.7326/0003-4819-160-1-201401070-00732 | 2026-05-03 |
| abou-cb-2021 | Abou El Hassan M, Colantonio D, Likhodii S, Nassar BA. The Analytical Performance of Six Urine Drug Screens on Cobas 6000 and ARCHITECT I2000 Compared to LC-MS/MS Gold Standard. Clin Biochem. 2021;93:99-103. doi:10.1016/j.clinbiochem.2021.04.003. _Source for POC PPV as low as 57% for oxycodone; NPV 25–29% for THC-COOH._ | https://doi.org/10.1016/j.clinbiochem.2021.04.003 | 2026-05-03 |
| saitman-jat-2026 | Saitman A, Fitzgerald RL, Lund K, Suhandynata RT, Menlyadiev M. Review: False Positive Urine Drug Screens. J Anal Toxicol. 2026;:bkag007. doi:10.1093/jat/bkag007. _2026 review of FP interferences across 61 studies; immunoassay screens require GC-MS or LC-MS/MS confirmation._ | https://doi.org/10.1093/jat/bkag007 | 2026-05-03 |
| kale-aafp-2019 | Kale N. Urine Drug Tests: Ordering and Interpreting Results. Am Fam Physician. 2019;99(1):33-39. _AAFP standard reference: "all results are considered presumptive until confirmatory testing is performed."_ | TBD (aafp.org) | 2026-05-03 |
| mahajan-aa-2017 | Mahajan G. Role of Urine Drug Testing in the Current Opioid Epidemic. Anesth Analg. 2017;125(6):2094-2104. doi:10.1213/ANE.0000000000002565. _Operational distinction: POC results can inform safety decisions (withhold same-day Rx, increase monitoring, initiate conversation) without being "actions against" the patient._ | https://doi.org/10.1213/ANE.0000000000002565 | 2026-05-03 |
| asam-baxter-2017 | Baxter L, Brown L, Hurford M, et al. Appropriate Use of Drug Testing in Clinical Addiction Medicine. American Society of Addiction Medicine, 2017. _ASAM consensus on confirmatory testing reserved for resolving unexpected screening results._ | TBD (asam.org) | 2026-05-03 |
| stolbach-jmt-2022 | Stolbach A, Connors N, Nelson L, Kulig K. ACMT Position Statement: Interpretation of Urine Opiate and Opioid Tests. J Med Toxicol. 2022;18(2):176-179. doi:10.1007/s13181-021-00864-1. _Specific confirmatory assays needed to differentiate individual opioids and metabolites — directly supports "wrong assay ordered" gap on row 88._ | https://doi.org/10.1007/s13181-021-00864-1 | 2026-05-03 |
| alford-jama-2013 | Alford DP. Chronic Back Pain With Possible Prescription Opioid Misuse. JAMA. 2013;309(9):919-25. doi:10.1001/jama.2013.522. _JAMA review listing the comprehensive differential for absent prescribed opioid: drug absent (diversion / hoarding / rapid metabolism), specimen manipulation, below-cutoff, wrong-assay-ordered, lab error._ | https://doi.org/10.1001/jama.2013.522 | 2026-05-03 |
| kennedy-plos-2022 | Kennedy MC, Crabtree A, Nolan S, et al. Discontinuation and Tapering of Prescribed Opioids and Risk of Overdose Among People on Long-Term Opioid Therapy for Pain With and Without Opioid Use Disorder in British Columbia, Canada: A Retrospective Cohort Study. PLoS Med. 2022;19(12):e1004123. doi:10.1371/journal.pmed.1004123. _Direct support for elevated overdose risk on opioid discontinuation, particularly among concurrent-OUD patients._ | https://doi.org/10.1371/journal.pmed.1004123 | 2026-05-03 |
| sun-bmj-2017 | Sun EC, Dixit A, Humphreys K, et al. Association Between Concurrent Use of Prescription Opioids and Benzodiazepines and Overdose: Retrospective Analysis. BMJ. 2017;356:j760. doi:10.1136/bmj.j760. _Privately insured cohort: adjusted OR=2.14 for opioid overdose-related ED visit / hospitalization with concurrent benzo use._ | https://doi.org/10.1136/bmj.j760 | 2026-05-03 |
| cho-jgim-2020 | Cho J, Spence MM, Niu F, et al. Risk of Overdose With Exposure to Prescription Opioids, Benzodiazepines, and Non-Benzodiazepine Sedative-Hypnotics in Adults: A Retrospective Cohort Study. J Gen Intern Med. 2020;35(3):696-703. doi:10.1007/s11606-019-05545-y. _Kaiser Permanente cohort: only ~20% increase in overdose risk for opioid+benzo vs opioid-only — counterpoint to higher effect-size estimates._ | https://doi.org/10.1007/s11606-019-05545-y | 2026-05-03 |
| hernandez-jamaopen-2018 | Hernandez I, He M, Brooks MM, Zhang Y. Exposure-Response Association Between Concurrent Opioid and Benzodiazepine Use and Risk of Opioid-Related Overdose in Medicare Part D Beneficiaries. JAMA Netw Open. 2018;1(2):e180919. doi:10.1001/jamanetworkopen.2018.0919. _**Time-dependence finding** — HR=5.05 in first 90 days of concurrent use, dropping to non-significant after 180 days of stable concurrent use; key Medicare Part D analysis._ | https://doi.org/10.1001/jamanetworkopen.2018.0919 | 2026-05-03 |
| florian-jama-2022 | Florian J, van der Schrier R, Gershuny V, et al. Effect of Paroxetine or Quetiapine Combined With Oxycodone vs Oxycodone Alone on Ventilation During Hypercapnia: A Randomized Clinical Trial. JAMA. 2022;328(14):1405-1414. doi:10.1001/jama.2022.17735. _FDA-sponsored RCT in healthy volunteers; minimal effects of paroxetine/quetiapine alone on ventilation; potentiation through complementary mechanisms; predecessor to Gershuny BJA 2025 midazolam study._ | https://doi.org/10.1001/jama.2022.17735 | 2026-05-03 |
| horsfall-bcpt-2017 | Horsfall JT, Sprague JE. The Pharmacology and Toxicology of the 'Holy Trinity'. Basic Clin Pharmacol Toxicol. 2017;120(2):115-119. doi:10.1111/bcpt.12655. _Mechanistic review of opioid + benzodiazepine + soma "Holy Trinity" interactions; colocalized mu-opioid + GABA receptor synergy in dopaminergic + respiratory pathways._ | https://doi.org/10.1111/bcpt.12655 | 2026-05-03 |
| vadod-2022 | Brown N, Clinton-Lont J, Edens E, et al. (Department of Veterans Affairs / Department of Defense). Use of Opioids in the Management of Chronic Pain. 2022. _VA/DoD 2022 opioid guideline; explicit caution against abrupt benzodiazepine discontinuation due to seizure/death risk; "consider obtaining a specialty consultation, as appropriate" framing for concurrent opioid+benzo._ | TBD (va.gov) | 2026-05-03 |
| robertson-aafp-2023 | Robertson S, Peacock EE, Scott R. Benzodiazepine Use Disorder: Common Questions and Answers. Am Fam Physician. 2023;108(3):260-266. _AAFP guidance on deprescribing requirements: patient education, shared decision-making, frequent dialogue; supports the "first visit lacks therapeutic relationship for safe taper" nuance._ | TBD (aafp.org) | 2026-05-03 |
| soyka-nejm-2017 | Soyka M. Treatment of Benzodiazepine Dependence. N Engl J Med. 2017;376(12):1147-1157. doi:10.1056/NEJMra1611832. _NEJM review: gradual discontinuation over 4–8 weeks minimum; hospitalization for ≥100 mg diazepam-equivalent daily; "concurrent opioid detoxification is not recommended" during benzo tapering; opioid dose should be kept stable through benzo reduction period._ | https://doi.org/10.1056/NEJMra1611832 | 2026-05-03 |
| wang-jcm-2023 | Wang Y, Wilson DL, Fernandes D, et al. Deprescribing Strategies for Opioids and Benzodiazepines With Emphasis on Concurrent Use: A Scoping Review. J Clin Med. 2023;12(5):1788. doi:10.3390/jcm12051788. _Scoping review of 26 guidelines: zero provided specific deprescribing-sequence guidance; the 4 that addressed sequencing gave conflicting recommendations — anchors the "individualized sequencing" position._ | https://doi.org/10.3390/jcm12051788 | 2026-05-03 |
| brunner-jgim-2025 | Brunner E, Chen CA, Klein T, et al. Joint Clinical Practice Guideline on Benzodiazepine Tapering: Considerations When Risks Outweigh Benefits. J Gen Intern Med. 2025;40(12):2814-2859. doi:10.1007/s11606-025-09499-2. _Journal-published version of the ASAM Joint Guideline (different journal manifestation from `asam-acmt-2025-benzo`); MOUD-before-benzo-taper sequencing recommendation; ≥ q3mo risk-benefit reassessment._ | https://doi.org/10.1007/s11606-025-09499-2 | 2026-05-03 |
| agnoli-jama-2021 | Agnoli A, Xing G, Tancredi DJ, et al. Association of Dose Tapering With Overdose or Mental Health Crisis Among Patients Prescribed Long-term Opioids. JAMA. 2021;326(5):411-419. doi:10.1001/jama.2021.11013. _Large cohort (n=113,618) showing tapering of stable LTOT associated with adjusted IRR 1.68 overdose, 2.28 mental-health crisis, 3.30 suicide attempt; dose-dependent (highest absolute risk at ≥300 MME/day)._ | https://doi.org/10.1001/jama.2021.11013 | 2026-05-03 |
| coffin-am-2022 | Coffin PO, Martinez RS, Wylie B, Ryder B. Primary Care Management of Long-Term Opioid Therapy. Ann Med. 2022;54(1):2451-2469. doi:10.1080/07853890.2022.2121417. _Comprehensive primary-care-focused review of LTOT management; element-by-element synthesis of CDC 2022 expectations applied to inherited-patient context._ | https://doi.org/10.1080/07853890.2022.2121417 | 2026-05-03 |
| sandbrink-aim-2023 | Sandbrink F, Murphy JL, Johansson M, et al. The Use of Opioids in the Management of Chronic Pain: Synopsis of the 2022 Updated U.S. Department of Veterans Affairs and U.S. Department of Defense Clinical Practice Guideline. Ann Intern Med. 2023;176(3):388-397. doi:10.7326/M22-2917. _Annals synopsis of the VA/DoD 2022 guideline; collaborative patient-centered approach; emphasis on encouraging patients to discuss prior experiences._ | https://doi.org/10.7326/M22-2917 | 2026-05-03 |
| blanco-lancet-2019 | Blanco C, Volkow ND. Management of Opioid Use Disorder in the USA: Present Status and Future Directions. Lancet. 2019;393(10182):1760-1772. doi:10.1016/S0140-6736(18)33078-2. _Lancet review supporting "patient distress at dose changes is a clinically meaningful signal" framing — may reflect undertreated pain, anxiety, or OUD features; broader OUD-management context._ | https://doi.org/10.1016/S0140-6736(18)33078-2 | 2026-05-03 |
| sonoda-aafp-2025 | Sonoda K, Wakabayashi M. Long-Term Opioid Therapy for Nonterminal Pain. Am Fam Physician. 2025;111(6):508-514. _2025 AAFP review providing opioid-tapering decision algorithm that begins with OUD screening before any taper decision._ | TBD (aafp.org) | 2026-05-03 |
| lin-nejm-2025 | Lin CC, Langford AV. Opioid Deprescribing in Patients with Noncancer Pain. N Engl J Med. 2025;393(18):1833-1842. doi:10.1056/NEJMcp2414789. _2025 NEJM review on opioid deprescribing; international comparison of tapering frameworks; supports gradual-taper-with-behavioral-support framing._ | https://doi.org/10.1056/NEJMcp2414789 | 2026-05-03 |
| jannetto-jalm-2018 | Jannetto PJ, Bratanow NC, Clark WA, et al. Executive Summary: American Association of Clinical Chemistry Laboratory Medicine Practice Guideline — Using Clinical Laboratory Tests to Monitor Drug Therapy in Pain Management Patients. J Appl Lab Med. 2018;2(4):489-526. doi:10.1373/jalm.2017.023341. _AACC guideline anchoring UDS as baseline monitoring for chronic-opiate patients; supports row 102 framing._ | https://doi.org/10.1373/jalm.2017.023341 | 2026-05-03 |
| webster-pmr-2015 | Webster LR, Grabois M. Current Regulations Related to Opioid Prescribing. PM R. 2015;7(11 Suppl):S236-S247. doi:10.1016/j.pmrj.2015.08.011. _Regulatory + medicolegal framework for opioid prescribing; documentation standards for controlled substance Rx._ | https://doi.org/10.1016/j.pmrj.2015.08.011 | 2026-05-03 |
| paice-jco-2016 | Paice JA, Portenoy R, Lacchetti C, et al. Management of Chronic Pain in Survivors of Adult Cancers: American Society of Clinical Oncology Clinical Practice Guideline. J Clin Oncol. 2016;34(27):3325-45. doi:10.1200/JCO.2016.68.5206. _ASCO categorization of "pattern of early refills" as aberrant drug-related behavior on the less-serious end of the spectrum; cancer-survivor-specific but principles transferable._ | https://doi.org/10.1200/JCO.2016.68.5206 | 2026-05-03 |
| kaye-painphys-2017a | Kaye AD, Jones MR, Kaye AM, et al. Prescription Opioid Abuse in Chronic Pain: An Updated Review of Opioid Abuse Predictors and Strategies to Curb Opioid Abuse: Part 1. Pain Physician. 2017;20(2S):S93-S109. _Comprehensive review of aberrant drug-related behaviors in chronic-pain LTOT — early-refill requests + dose-escalation requests as established markers._ | TBD (painphysicianjournal.com) | 2026-05-03 |
| kaye-painphys-2017b | Kaye AD, Jones MR, Kaye AM, et al. Prescription Opioid Abuse in Chronic Pain: An Updated Review of Opioid Abuse Predictors and Strategies to Curb Opioid Abuse: Part 2. Pain Physician. 2017;20(2S):S111-S133. _Continuation of Part 1; strategies to curb abuse + monitoring approaches._ | TBD (painphysicianjournal.com) | 2026-05-03 |
| merlin-jgim-2018 | Merlin JS, Young SR, Starrels JL, et al. Managing Concerning Behaviors in Patients Prescribed Opioids for Chronic Pain: A Delphi Study. J Gen Intern Med. 2018;33(2):166-176. doi:10.1007/s11606-017-4211-y. _Delphi consensus identifying "asking for opioid dose increase" + "using more opioid medication than prescribed" as most common concerning LTOT behaviors; experts agreed "stopping opioids is not important initially" — supports graduated-response framing._ | https://doi.org/10.1007/s11606-017-4211-y | 2026-05-03 |
| archambault-jcn-2024 | Archambault L, Bertrand K, Martel MO, et al. The Current State of Knowledge on Care for Co-Occurring Chronic Pain and Opioid Use Disorder: A Scoping Review. J Clin Nurs. 2024;33(8):3056-3076. doi:10.1111/jocn.17139. _Scoping review confirming OUD often co-occurs with chronic pain; complexity of co-occurring assessment + treatment._ | https://doi.org/10.1111/jocn.17139 | 2026-05-03 |
| hasin-ajp-2022 | Hasin DS, Shmulewitz D, Stohl M, et al. Diagnosing Prescription Opioid Use Disorder in Patients Using Prescribed Opioids for Chronic Pain. Am J Psychiatry. 2022;179(10):715-725. doi:10.1176/appi.ajp.21070721. _Pain-adjusted DSM-5 OUD diagnostic approach; tolerance + withdrawal don't count if solely from prescribed use; therapeutic-intent vs nontherapeutic-intent distinction._ | https://doi.org/10.1176/appi.ajp.21070721 | 2026-05-03 |
| dsm5-2022 | American Psychiatric Association. Diagnostic and Statistical Manual of Mental Disorders, 5th ed text revision (DSM-5-TR). 2022. _Source for the 11-criterion OUD checklist + the prescribed-use-context exclusion._ | TBD (psychiatry.org) | 2026-05-03 |
| harris-jama-2026 | Harris MTH, Weinstein ZM, Walley AY. Medications for Opioid Use Disorder, Opioid Withdrawal, and Opioid Overdose. JAMA. 2026;:2845037. doi:10.1001/jama.2025.26348. _2026 JAMA review with the canonical mortality numbers: buprenorphine RR 0.34 (60% reduction), methadone RR 0.47 (50% reduction); naltrexone evidence substantially weaker._ | https://doi.org/10.1001/jama.2025.26348 | 2026-05-03 |
| wakeman-jamaopen-2020 | Wakeman SE, Larochelle MR, Ameli O, et al. Comparative Effectiveness of Different Treatment Pathways for Opioid Use Disorder. JAMA Netw Open. 2020;3(2):e1920622. doi:10.1001/jamanetworkopen.2019.20622. _Large comparative-effectiveness study: only buprenorphine/methadone associated with reduced overdose + opioid-related acute care vs no treatment; naltrexone, inpatient detox, behavioral interventions showed no significant benefit at 3-month f/u._ | https://doi.org/10.1001/jamanetworkopen.2019.20622 | 2026-05-03 |
| wakeman-nejmevid-2022 | Wakeman SE. Opioid Use Disorder Diagnosis and Management. NEJM Evidence. 2022;1(4):EVIDra2200038. doi:10.1056/EVIDra2200038. _NEJM Evidence review of OUD diagnosis + management; supports oral-naltrexone-≈-placebo finding + XR-NTX induction-barrier framing._ | https://doi.org/10.1056/EVIDra2200038 | 2026-05-03 |
| buresh-bmj-2021 | Buresh M, Stern R, Rastegar D. Treatment of Opioid Use Disorder in Primary Care. BMJ. 2021;373:n784. doi:10.1136/bmj.n784. _BMJ primary-care-focused review of OUD treatment options + workflow._ | https://doi.org/10.1136/bmj.n784 | 2026-05-03 |
| lim-plosone-2022 | Lim J, Farhat I, Douros A, Panagiotoglou D. Relative Effectiveness of Medications for Opioid-Related Disorders: A Systematic Review and Network Meta-Analysis of Randomized Controlled Trials. PLoS One. 2022;17(3):e0266142. doi:10.1371/journal.pone.0266142. _Network meta-analysis: methadone > buprenorphine > naltrexone for retention; all pharmacotherapies higher retention than control._ | https://doi.org/10.1371/journal.pone.0266142 | 2026-05-03 |
| ostrach-japha-2023 | Ostrach B, Hill L, Carpenter D, Pollini R. Addressing Buprenorphine Bottlenecks in the Context of MAT Act Implementation: A Shared Responsibility. J Am Pharm Assoc (JAPhA). 2023 Jul-Aug;63(4):1044-1048. doi:10.1016/j.japh.2023.04.029. _MAT Act implementation context; bottlenecks beyond the X-waiver removal — interest, comfort, systems-level._ | https://doi.org/10.1016/j.japh.2023.04.029 | 2026-05-03 |
| varisco-japha-2023 | Varisco TJ, Wanat M, Hill LG, Thornton D. The Impact of the Mainstreaming Addiction Treatment Act and Associated Legislative Action on Pharmacy Practice. J Am Pharm Assoc (JAPhA). 2023 Jul-Aug;63(4):1039-1043. doi:10.1016/j.japh.2023.04.016. _MAT Act + pharmacy practice; supports "no patient caps" + 8-hr training framing._ | https://doi.org/10.1016/j.japh.2023.04.016 | 2026-05-03 |
| calcaterra-jamaopen-2025 | Calcaterra SL, Weimer MB, Grimm E, et al. Leveraging the 72-Hour Rule Change to Support Transition From Hospital to Opioid Treatment Program. JAMA Netw Open. 2025;8(11):e2544996. doi:10.1001/jamanetworkopen.2025.44996. _Direct primary source on the 72-hour methadone administration rule + 3-day-supply update; bridging to OTP._ | https://doi.org/10.1001/jamanetworkopen.2025.44996 | 2026-05-03 |
| tschampl-jamaopen-2026 | Tschampl CA, Feltus SR, Soranno E, et al. Treating Opioid Use Disorder With Methadone in Pharmacies. JAMA Netw Open. 2026. doi:10.1001/jamanetworkopen.2026.0703. _2026 JAMA Open piece on the evolving landscape of pharmacy-based methadone-for-OUD dispensing — advocacy/policy direction; not yet law._ | https://doi.org/10.1001/jamanetworkopen.2026.0703 | 2026-05-03 |
| gibson-asam-2024 | Gibson E, Lien J, Manages S, et al. Engagement and Retention of Nonabstinent Patients in Substance Use Treatment: Clinical Consideration for Addiction Treatment Providers. American Society of Addiction Medicine, 2024. _ASAM 2024 guidance on non-judgmental, compassionate, person-first communication; stigmatizing interactions drive patients away from care._ | TBD (asam.org) | 2026-05-03 |
| kowalchuk-aafp-2024 | Kowalchuk A, Gonzalez SJ, Zoorob RJ. Substance Misuse in Adults: A Primary Care Approach. Am Fam Physician. 2024;109(5):430-440. _AAFP 2024 PCP-focused approach to substance misuse; non-judgmental + person-first framing._ | TBD (aafp.org) | 2026-05-03 |
| volkow-jamapsych-2019 | Volkow ND, Jones EB, Einstein EB, Wargo EM. Prevention and Treatment of Opioid Misuse and Addiction: A Review. JAMA Psychiatry. 2019;76(2):208-216. doi:10.1001/jamapsychiatry.2018.3126. _Volkow JAMA Psych review supporting disease model (striatocortical circuits, extended amygdala, prefrontal cortex) over moral framework; NIDA terminology / person-first language guidance for documentation._ | https://doi.org/10.1001/jamapsychiatry.2018.3126 | 2026-05-03 |

---

## Asset inventory (for live module rewrite)

Non-prose content that needs to survive into the live module is cataloged here. **Policy (user-set, 2026-04-22): no images or graphs in the live module — cite + link only, route deep evidence through Meridian's existing OpenEvidence pathway.**

### Tables (anticipated)

| # | Likely location | Content | Target in live module | Status |
|---|----------------|---------|-----------------------|--------|
| T1 | Bundle 1 response | MME conversion table — opioid × conversion factor × example dose × notes (morphine, oxycodone, hydrocodone, hydromorphone, fentanyl patch, tramadol, ± methadone if OE flags it as missing) | `faqs.opiates-mme.q1` answer_html — convert plain-text equivalence list to HTML `<table>` with `[ref:X]` markers | _Bundle 1 pending_ |
| T2 | Bundle 1 / Bundle 6 response | MME-threshold ladder — 50 / 90 MME inflection points × required actions × references | New or expanded content for `faqs.opiates-mme.q2` and possibly cross-FAQ asset | _Bundle 1 / Bundle 6 pending_ |
| T3 | Bundle 4 response | Risk-stratified UDS cadence — risk tier × interval × triggers × references | `faqs.opiates-uds.q3` answer_html — possibly convert to HTML `<table>` | _Bundle 4 pending_ |
| T4 | Bundle 7 response | Early-refill threshold ladder — count × institutional response × references | `faqs.opiates-behavior.q1` answer_html — pill-styled list could become `<table>` | _Bundle 7 pending_ |

**Schema note:** Tables are new territory for `clinical-modules.json` — current FAQ `answer_html` uses only `<p>`, `<span class="pill">`, and `<em>/<strong>`. Adding HTML `<table>` requires verifying CSS in `glass.css` renders tables cleanly and that DOCX/PDF/PPTX export paths handle tables without breaking. The benzos verification flagged this same concern (line ~809 of `verification/benzos.md`); resolution from that work applies here.

### Images (reference-only — DO NOT embed in live module)

Per user policy: POC decision-making doesn't need deep evidence figures. Citation + OE pathway is sufficient.

_(none anticipated yet; populate if Bundles surface critical figures — e.g., CDC dose–mortality curve, FDA black-box facsimile)_

---

## Prompt iteration log

If Bundle 1 results come back weak or generic, refine the prompt template and record what changed. Future bundles should use the refined version.

- **v1** (initial): _see "Shared bundle prompt template" above_
- **v2** (if needed): _record changes here_

---

## Follow-up prompts (deep-dives from OE's end-of-bundle suggestions)

OE typically offers 1–2 concrete deep-dives at the end of each bundle. Capture them here as they arrive; run as separate OE queries (focused queries return sharper citations than combined ones).

### From meta-pass (2026-05-03)

**FU-1: 2022-vs-2016 CDC tapering of established high-dose patients, especially involuntary dose reduction.** OE-offered at end of meta-pass: _"Would you like to explore how the 2022 CDC guideline's approach to tapering established high-dose patients differs from the 2016 version, particularly regarding involuntary dose reduction?"_ Run this before drafting the rewrite of `faqs.opiates-mme.q3` ("patient on 120 MME stable for years — do I taper?") and the high-dose FAQ — the answer should anchor the rewrite around CDC's explicit anti-forced-taper guidance, the HHS Guide for Clinicians on the Appropriate Dosage Reduction or Discontinuation, and the 2019 NEJM commentary on involuntary tapers.

Suggested prompt:
```
The 2022 CDC Guideline for Prescribing Opioids for Pain explicitly
softened the 2016 guidance on dose reduction in established
high-dose patients. For a primary care provider inheriting a stable
patient on >90 MME/day, what does the 2022 guideline say about:
(1) when, if ever, taper is indicated;
(2) what evidence exists on harms of involuntary or rapid taper
    (overdose, suicide, withdrawal, transition to illicit opioids);
(3) what shared-decision-making structure the guideline recommends;
(4) what the CDC says about taper rate when taper is appropriate.

Cite specific recommendation numbers / pages in MMWR 71(3) and any
2022+ supporting literature.
```

### From Bundle 8 (2026-05-03)

**FU-9: Operational workflow templates for the inherited-patient first visit + buprenorphine micro-induction protocol.** OE-offered at end of Bundle 8: _"Would you like to explore specific operational workflows for the inherited-patient first visit — such as a structured documentation template, PDMP/UDS protocols, or a buprenorphine micro-induction protocol for transitioning from full-agonist opioids?"_ Significant overlap with FU-3, FU-5, FU-6, FU-7, FU-8. **Recommendation:** rather than running each as a separate OE query, combine FU-3 + FU-5 + FU-6 + FU-7 + FU-8 + FU-9 into a single "operational workflow synthesis" query before starting the JSON-edit pass. The themes are interconnected (first-visit documentation + UDS protocol + naloxone conversation + OUD screening + non-punitive CSA + micro-induction) and a single query produces a more coherent module-wide rewrite than seven separate ones. Buprenorphine micro-induction (transitioning from full-agonist opioid without traditional withdrawal) is the one substantive new clinical content area not covered by Bundles 1–8.

Suggested combined prompt (use only once):
```
Synthesize a structured operational workflow for the primary-care
inherited-patient first visit when the patient is on long-term
opioid therapy (LTOT) for chronic pain. Combine the following
threads into a single coherent workflow:
(A) FU-3 — CDC 2022 documentation elements + risk-mitigation steps.
(B) FU-5 + FU-7 — structured SUD/OUD assessment workflow (TAPS,
    NIDA Quick Screen, AUDIT-C+DAST, DSM-5 11-criterion application
    with pain-adjusted approach per Hasin AJP 2022).
(C) FU-6 — opiate-benzo concurrent first-visit documentation +
    PDMP elements + naloxone conversation structure.
(D) FU-8 — non-punitive monitoring + structured CSA framework
    (CDC 2022 Rec 10).
(E) FU-9 — buprenorphine initiation pathway:
    - Standard induction (opioid-free 12–24 h before first dose)
    - Micro-induction (no withdrawal required; for patients on
      full-agonist opioids who cannot tolerate withdrawal —
      Bernese / Brouillet protocol; specific dose ladder)
    - When each is indicated; required diagnostic workup
      (LFTs, pregnancy test, ECG); naltrexone considerations;
      sequencing relative to benzo taper if co-prescribed.
(F) Documentation template covering: dose / agent / indication /
    PDMP / UDS / functional status / OUD screen / treatment goals /
    rationale for continuation / reassessment plan.

Cite specific CDC 2022 recommendation numbers; ASAM 2020 (or 2022
update) National Practice Guideline; SAMHSA TIP 63; ACOG MAT Act
update; Bernese / Brouillet / micro-induction primary literature;
NIDA terminology guide; and any 2022+ supporting literature.
```

### From Bundle 7 (2026-05-03)

**FU-8: Operationalizing CDC 2022's non-punitive monitoring stance within a structured CSA framework.** OE-offered at end of Bundle 7: _"Would you like to explore how the CDC 2022 guideline's emphasis on avoiding punitive monitoring practices can be operationalized within a structured controlled-substance agreement framework?"_ Useful before drafting the rewrite of `faqs.opiates-behavior.q1` (rows 67, 102 — UDS as baseline + reframed early-refill ladder), `faqs.opiates-behavior.q2` (rows 69, 70, 103 — exception pathway), and the broader non-dismissal coherent rewrite (rows 28, 31, 60, 84, 85, 90, 101). High overlap with FU-3 (CDC documentation elements at first visit), FU-4 (state OTA mandates), and the differential-diagnosis-of-aberrant-behaviors theme. Could be the unifying query that produces a coherent module-wide non-punitive-monitoring + CSA framework.

Suggested prompt:
```
The CDC 2022 Opioid Prescribing Guideline (Recommendation 10) and
its overall framework explicitly emphasize that monitoring tools
(PDMP, UDS, CSAs) should NOT be used in a punitive manner and that
clinicians should NOT dismiss patients on the basis of monitoring
findings. At the same time, the guideline endorses structured CSAs
as a tool for clarifying expectations and supporting safe prescribing.

For a primary care decision-support module that needs to integrate
both principles coherently, please specify:
(1) The core elements of a CDC-2022-aligned CSA that preserve
    structure (single prescriber, monitoring expectations, response
    to unexpected findings) WITHOUT crossing into punitive language.
(2) How to frame UDS in the CSA: as **baseline monitoring** rather
    than as a punitive trigger; what to do with unexpected results
    (confirm + clinical conversation + SUD assessment) per Bundle 4.
(3) How to frame early-refill-pattern responses in the CSA:
    documentation + clinical assessment + differential-dx framework
    (undertreated pain, psych comorbidity, OUD) rather than fixed
    numeric thresholds (per Bundle 7 finding that "1/2+/3+" thresholds
    are not guideline-supported).
(4) Exception-pathway language for urgent between-visit clinical
    concerns (acute pain crisis, withdrawal due to pharmacy issue,
    concerning symptoms) that preserves the "scheduled visits"
    structure for routine management decisions.
(5) Patient-abandonment guardrail language: when refusing to
    prescribe, document alternative care pathways offered (non-opioid
    pain mgmt, pain-specialist referral, bridge Rx).
(6) How to frame all of the above as supporting "improving patient
    safety" (CDC 2022 framing) rather than "verifying compliance."

Cite CDC 2022 Recommendation 10, AAFP summary, ASAM 2025, and any
2022+ literature on non-punitive monitoring frameworks.
```

### From Bundle 6 (2026-05-03)

**FU-7: Operationalizing the OUD screening component at the inherited-patient first visit — validated tools + buprenorphine-initiation triggers.** OE-offered at end of Bundle 6: _"Would you like to explore how to operationalize the OUD screening component at the inherited-patient first visit, including which validated tools are most practical in primary care and when to initiate buprenorphine?"_ Significant overlap with FU-5 (structured SUD assessment workflow following unexpected UDS) — could be merged into one focused query before drafting OUD FAQ rewrite (rows 74–80, Bundle 8 territory) and the comprehensive-first-visit-checklist gap row 100.

Suggested prompt (combine with FU-5):
```
For a primary care provider at the first visit with an adult patient
inherited on chronic long-term opioid therapy (LTOT), what is the
operational OUD screening workflow that should be embedded in the
visit? Please specify:
(1) Which validated tools are most practical in primary care for
    OUD screening at the inherited-patient first visit (TAPS,
    DAST-10, ORT, NIDA Quick Screen, AUDIT-C+DAST), and which
    is fastest / has the best accuracy / fits a 15-min visit.
(2) The DSM-5 OUD criteria checklist (mild / moderate / severe)
    and how a PCP applies them in a 15–20 min visit, including
    the patient-language formulation of each criterion.
(3) Triggers for OUD evaluation beyond positive screen: aberrant
    PDMP pattern, unexpected UDS, behavioral flags from row 67,
    high MME with no functional benefit.
(4) When OUD criteria are met → buprenorphine initiation pathway:
    home induction vs office induction with what diagnostic
    workup is required first (ECG, LFTs, pregnancy test, etc.);
    methadone OTP referral pathway; naltrexone considerations;
    sequencing relative to benzo taper if co-prescribed (per
    ASAM 2025 — gap row 97).
(5) Documentation pattern: what should the PCP record about the
    screening, the diagnostic conclusion, and the treatment plan.

Cite CDC 2022 Recs 2/8/12, ASAM National Practice Guideline 2020
(or 2022 update), SAMHSA TIP 63, and any 2022+ supporting literature.
```

### From Bundle 5 (2026-05-03)

**FU-6: Operational workflow for the inherited opiate+benzo first visit — documentation, PDMP elements, naloxone conversation structure.** OE-offered at end of Bundle 5: _"Would you like to explore the specific operational workflow for the inherited-patient first visit — including what to document, which PDMP elements to check, and how to structure the naloxone conversation — based on these guidelines?"_ Useful before drafting the rewrite of `faqs.opiates-combo.q2` (gap rows 95, 96) and `faqs.opiates-combo.q3` (gap row 97). Has overlap with FU-3 (CDC documentation elements at first visit) and FU-2/FU-1 (high-dose taper context); could be combined.

Suggested prompt:
```
For a primary care provider at the first visit with an adult patient
inherited on chronic concurrent opiate + benzodiazepine therapy with
legitimate dual indications, walk through the specific operational
workflow recommended by CDC 2022, ASAM 2025, and VA/DoD 2022:
(1) PDMP elements to check beyond the standard screen (look-back
    period, prescribers, pharmacies, dose pattern, opioid + benzo
    overlap window, concurrent CNS depressants).
(2) Naloxone conversation structure: language to use; whether to
    prescribe vs offer (CDC 2022 says "offer"); household-member
    education content; documentation of conversation.
(3) Risk-benefit assessment documentation elements: dose, duration,
    indication, prior taper attempts, functional status, prior
    overdose, household risk, pain control, anxiety control.
(4) Specific reassessment cadence + content: ASAM 2025 ≥ q3mo —
    what is reviewed at each reassessment.
(5) Specialist referral framing: "initiated, not completed";
    documentation of warm handoff vs e-consult.
(6) When to pivot to MOUD evaluation (OUD subset): trigger criteria
    and pre-MOUD-stabilization sequencing per ASAM 2025.

Cite specific CDC 2022 recommendation numbers, ASAM 2025 guideline
sections, and any 2022+ supporting literature.
```

### From Bundle 4 (2026-05-03)

**FU-5: Operationalizing the structured SUD assessment workflow following an unexpected UDS result.** OE-offered at end of Bundle 4: _"Would you like to explore how to operationalize the structured SUD assessment workflow (e.g., DSM-5 OUD criteria, TAPS tool, or NIDA screening) that should follow an unexpected UDS result in this inherited-patient context?"_ Useful before drafting the rewrite of `faqs.opiates-uds-fail.q1` (cocaine-positive — comprehensive SUD eval, gap row 90), `faqs.opiates-uds-fail.q2` (fentanyl-positive — structured OUD assessment, gap row 92), and the OUD FAQ (rows 74–80 in Bundle 8 territory). Pairs naturally with Bundle 8's OUD recognition + MOUD pathway content; could be combined.

Suggested prompt:
```
For a primary care provider at a chronic-opioid-therapy follow-up
visit who finds an unexpected UDS result (positive for cocaine or
fentanyl, or negative for the prescribed opioid) and needs to do a
structured SUD assessment, what is the operational workflow? Please
specify:
(1) The validated screening tool to use first (TAPS, NIDA Quick
    Screen, AUDIT-C + DAST-10) — when each is appropriate.
(2) The DSM-5 OUD criteria checklist (mild / moderate / severe) and
    how a PCP applies them in a 15–20 minute visit.
(3) When OUD criteria are met → MOUD initiation pathway: buprenorphine
    (home induction vs office induction) with what diagnostic
    workup is required first; methadone OTP referral pathway;
    naltrexone considerations.
(4) When non-opioid SUD is identified (stimulant, alcohol, benzo
    AUD, etc.) — what is the parallel referral pathway and how does
    it interact with continuing opioid therapy for chronic pain.
(5) Documentation pattern: what should the PCP record about the
    assessment, the diagnostic conclusion, and the treatment plan.

Cite CDC 2022, ASAM National Practice Guideline 2020 (or 2022 update),
SAMHSA TIP 63, NIDA materials, and any 2022+ supporting literature.
```

### From Bundle 3 (2026-05-03)

**FU-4: State OTA mandates and a state-adaptive checklist.** OE-offered at end of Bundle 3: _"Would you like to explore how specific state OTA mandates (e.g., New York vs. other states where this tool might be deployed) differ in their legally required elements and how to operationalize a state-adaptive checklist?"_ Useful only if the module is intended to be deployed beyond NY (or if NY-specific institutional policy needs to be surfaced separately from CDC/national consensus). Lower priority than FU-1/FU-2/FU-3 unless deployment scope expands.

Suggested prompt:
```
The 2024 Milbank Quarterly review by Svirsky et al. found that 27 US
states mandate Opioid Treatment Agreements (OTAs), with substantial
variation in mandated terms. For a primary-care decision-support tool:
(1) Summarize the categories of variation across mandating states
    (triggers — long-term Rx duration, dose threshold, patient risk
    factor; mandated elements — informed consent, single prescriber,
    UDS, etc.; format — written vs verbal vs counseling-and-document;
    renewal cadence).
(2) Describe NY State's specific OTA-related obligations (statutory,
    regulatory, board-of-medicine guidance, institutional health-system
    norms) and how I-STOP fits into this picture.
(3) Recommend a structure for a state-adaptive checklist: a small core
    of universally-recommended elements (per CDC/APS/ACOEM consensus)
    + a state-specific overlay layer.
```

### From Bundle 2 (2026-05-03)

**FU-3: Documentation elements + risk-mitigation steps that CDC 2022 recommends at the inherited-patient first visit.** OE-offered at end of Bundle 2: _"Would you like to explore the specific documentation elements and risk-mitigation steps (e.g., naloxone prescribing, urine drug testing, treatment agreements) that the CDC 2022 guideline recommends at the inherited-patient first visit?"_ Useful before drafting the rewrite of `green_zone.narrative_html` (rows 7–9), the CS-agreement FAQ (rows 25–28, 26 specifically on required elements), and the high-dose first-visit documentation list (row 49). Could deduplicate against Bundle 3 (CS agreement) and Bundle 6 (high-dose) results — run only if those bundles don't surface a tight checklist.

Suggested prompt:
```
For a primary care provider at the first visit with an adult patient
inherited on chronic long-term opioid therapy (any dose), the CDC 2022
Guideline for Prescribing Opioids for Pain implies a structured set of
documentation and risk-mitigation steps. Please consolidate:
(1) The specific documentation elements the CDC recommends at this
    visit (PDMP review specifics, MME calculation, risk-factor
    screening, functional/pain assessment, opioid-treatment-agreement
    elements).
(2) The risk-mitigation interventions that should be in place before
    or at the time of continued prescribing (naloxone offer/prescribe,
    UDS at intake + follow-up cadence, household overdose education,
    co-prescribing red-flag screening).
(3) For each, the specific CDC 2022 recommendation number that
    supports it.

Also note any items the CDC declines to mandate (e.g., "offer" vs
"require" naloxone) and any contested or guideline-permissive points
(e.g., risk-stratified UDS frequency vs. annual minimum).
```

### From Bundle 1 (2026-05-03)

**FU-2: Inherited high-dose vs opioid-naïve at first visit — CDC 2022 framework for taper-vs-continuation decisions.** OE-offered at end of Bundle 1: _"Would you like to explore how the CDC 2022 guideline's approach to inherited patients on high-dose opioid therapy differs from its recommendations for opioid-naïve patients — particularly regarding tapering versus continuation decisions at the first visit?"_ Overlaps significantly with FU-1 but with a different framing (inherited vs naïve patient comparison). Could be combined with FU-1 into a single follow-up query before drafting the high-dose FAQ rewrite, or run separately if Bundle 6 (high-dose inherited patient) results don't already cover it.

Suggested prompt:
```
The CDC 2022 Guideline for Prescribing Opioids for Pain distinguishes
recommendations for opioid-naïve patients (Recommendations 1-6) from
those for patients already on long-term opioid therapy (Recommendations
7-12). For a primary care provider at the first visit with a patient
inherited on high-dose long-term opioid therapy:
(1) Which CDC 2022 recommendations specifically apply, and how do they
    differ from recommendations for opioid-naïve patients?
(2) What does the guideline say about the threshold or evidence required
    to justify dose reduction in an inherited stable patient vs. an
    early-discovered patient?
(3) What is the CDC's stance on the inherited patient as a distinct
    clinical scenario warranting a structured first-visit assessment
    rather than immediate decisional action?
```

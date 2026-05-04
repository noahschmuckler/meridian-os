# Benzodiazepine Module — OpenEvidence Verification Tracker

Working document for evidence-reviewing the `benzos` module in `src/data/seed/clinical-modules.json` (lines 1606–1900) before finalization. Not read by the app. See plan at `~/.claude/plans/breezy-bubbling-lerdorf.md` for context.

**Workflow:** Run the meta-pass prompt first. Then run Bundle 1 (regulatory/PDMP — the black-and-white facts) to calibrate prompt wording. Iterate if needed. Then run Bundles 2–8. Log each claim's verdict in the tracker table at the bottom. Once verdicts are captured, a follow-up coding session will rewrite the benzo module JSON with `references[]` and `[ref:X]` markers in the prose.

**Framing note:** All prompts ask for genuine pushback, not confirmation. If OE comes back "everything is correct," re-run with tighter wording — blanket confirmation usually means the prompt was too leading.

**Module under review:** Inherited adult patient on chronic benzodiazepine therapy. Goal: support the PCP at the first handoff visit so they can (a) safely proceed without precipitating withdrawal, (b) document defensibly, and (c) plan ahead for subsequent visits without overcommitting at intake.

---

## Meta-pass prompt (run first)

```
I'm finalizing a primary care decision-support module on managing adult
patients inherited on chronic benzodiazepine therapy. The content below
was drafted from general knowledge and has not been evidence-reviewed.

Please read it end-to-end and flag any statement that is: factually
inaccurate, outdated (pre-2022 guidance that has since changed), lacking
evidence support, controversial among specialists, or oversimplified in a
way that could mislead a primary care provider. For each flag, cite the
source and give the corrected framing.

Content:

LANDING:
A patient is transferring to your panel on a chronic benzodiazepine
regimen. This is among the most clinically and emotionally charged
handoffs in primary care. Benzodiazepine-dependent patients have often
been on these medications for years, frequently have no memory of why
they were started, and are acutely sensitive to any suggestion of change.
Your job at the first visit is not to taper. It is to assess, document,
establish trust, and determine the appropriate pathway forward. Abrupt
discontinuation of chronic benzodiazepines causes withdrawal seizure
and death — this is never the first move.

CHECKLIST (verify all four before deciding):
1. PDMP reviewed — single prescriber, single pharmacy, consistent
   quantities, no concurrent opiates or other CNS depressants of concern.
2. Documented indication on file or established at this visit — anxiety
   disorder, panic disorder, seizure disorder, alcohol withdrawal, or
   other documented rationale.
3. Duration of use and original prescribing context understood —
   short-term initiation vs. long-term chronic use.
4. Current functional status assessed — patient able to describe daily
   activities, employment, relationships, and driving without significant
   impairment attributable to medication.

GREEN ZONE (all four checked → continue with documented plan):
Reasonable basis to continue current regimen at this visit. Document
indication, duration, dose, and monitoring plan using SmartPhrase.
Establish that the long-term goal is the lowest effective dose. This is
not a taper conversation today — it is a foundation visit. You are
institutionally supported.

ESCALATIONS (escalate if any apply):
1. Concurrent opiate prescription — any dose, any indication — highest-
   priority safety flag.
2. Dose above equivalent of diazepam 40 mg/day without documented
   psychiatric specialist involvement.
3. Concurrent prescription of another CNS depressant — sedating
   antihistamines, muscle relaxants, gabapentin, or Z-drugs.
4. No documentable psychiatric or neurological indication — medication
   appears continued without clinical rationale.
5. Cognitive concerns, fall history, or age ≥ 65 — benzodiazepines are
   Beers Criteria medications in older adults.
6. Patient requesting dose increases, early refills, or reporting the
   medication "stopped working."

FAQS:

[PDMP Review]

Q1: What am I specifically looking for beyond the standard PDMP review?
A1: For benzodiazepine patients the critical flags are: concurrent opiate
prescriptions (this is the most dangerous combination in outpatient
prescribing), Z-drug co-prescriptions (zolpidem plus a benzodiazepine
doubles CNS depression risk), fills from multiple prescribers without
documented coordination, and quantities that exceed what a single
prescriber's regimen would generate. Also look for recent ER visits —
patients in benzo withdrawal or toxicity frequently present to emergency
departments and this may appear in shared records but not the PDMP itself.

Q2: The patient is getting benzos from a psychiatrist and wants me to
continue prescribing as well. Is that appropriate?
A2: No — benzodiazepines should have a single prescriber. If a
psychiatrist is managing the underlying indication, the psychiatrist
should own the prescription. If the patient is transitioning care and
the psychiatrist is no longer involved, document the gap and initiate a
warm handoff or e-consult before you assume the prescription. Two
providers co-prescribing the same controlled substance class without
explicit coordination is a liability for both and a safety risk for the
patient.

Q3: How often is PDMP review required for benzo patients in New York?
A3: New York State requires PDMP review prior to every Schedule IV
controlled substance prescription. Benzodiazepines are Schedule IV. This
is a legal requirement at every prescribing encounter, not just at
intake.

[Documented Indication]

Q1: The chart has no documented indication. The patient just says they've
been on it "forever." What do I do?
A1: This is extremely common and does not by itself require you to stop
prescribing. Your task is to establish an indication going forward —
even if the original rationale is lost to history. Conduct a brief
structured assessment at this visit: What symptoms does the medication
treat? What happens when doses are missed? Is there an underlying
anxiety disorder, panic disorder, or other condition that a proper
diagnosis would capture? Document your clinical impression as the
current indication. If no legitimate indication can be established, this
is an e-consult trigger — not a reason to stop today.

Q2: The original indication was insomnia. Is that a supportable long-
term indication?
A2: No — benzodiazepines are not indicated for chronic insomnia
management and are not approved for this use long-term. If insomnia is
the only documented indication, the patient likely has physical
dependence without an ongoing therapeutic justification. This does not
mean immediate taper — it means the e-consult framing is "patient on
chronic benzodiazepine for insomnia indication, no psychiatric diagnosis
on file, please advise on taper planning and alternative management."
CBT-I (cognitive behavioral therapy for insomnia) is the evidence-based
first-line treatment and can be initiated in parallel.

Q3: What about anxiety that has never been formally diagnosed?
A3: Anxiety disorders are among the most underdiagnosed conditions in
primary care. A patient who has been on a benzodiazepine for years for
"nerves" or "stress" may have an untreated anxiety disorder that was
managed symptomatically rather than definitively. Administering a GAD-7
at this visit takes four minutes and gives you a documented baseline.
If the score is significant, you now have a diagnosis, a severity
measure, and a rationale for the medication — as well as a basis for
discussing whether an SSRI or SNRI plus therapy would be a more
appropriate long-term approach.

[Duration of Use]

Q1: At what point does benzodiazepine use become "long-term"?
A1: Physical dependence can develop within 4–6 weeks of daily use. Any
patient using a benzodiazepine daily for more than 4 weeks should be
considered potentially physically dependent and managed accordingly —
meaning no abrupt discontinuation under any circumstances. Duration
beyond 6 months with daily use represents established dependence in
most patients regardless of dose.

Q2: The patient has been on this for 10 years. Is taper even realistic?
A2: Yes, but the timeline is long and the process requires patient
partnership. A decade of daily benzodiazepine use is not resolved over
weeks or months — a successful taper may take one to two years using a
structured protocol (typically a diazepam conversion with gradual
reduction). The first visit is not the moment to introduce this. The
first visit is the moment to establish trust, complete the assessment,
and plant a seed: "My goal over time is to make sure you're on the
lowest dose that keeps you functional and safe. We're not changing
anything today, but I want that to be our shared direction." Document
this framing.

Q3: Should I convert the patient to diazepam for easier taper management?
A3: Diazepam conversion is a taper strategy, not a first-visit
intervention. Its advantage is a long half-life that allows for smoother
reduction with less interdose withdrawal. This conversion is appropriate
to plan in coordination with psychiatry e-consult, not to initiate
unilaterally at a handoff visit. Document it as a future goal if relevant.

[Functional Assessment]

Q1: What am I actually assessing when I ask about function?
A1: You are looking for evidence that the medication is providing net
benefit versus harm at the current dose. Preserved function = employed
or engaged in meaningful daily activity, able to drive safely,
maintaining relationships, no falls in the past 12 months, no memory
complaints beyond baseline. Functional impairment = daytime sedation
affecting work or safety, falls or near-falls, cognitive complaints,
social withdrawal, inability to function without the medication at all
(beyond expected physical dependence).

Q2: The patient drives and is on a high-dose benzodiazepine. What are
my obligations?
A2: Benzodiazepines impair driving — this is well-established and
dose-dependent. You have a clinical obligation to counsel the patient
about impaired driving risk and document that you did so. In New York,
physicians do not have a mandatory reporting obligation for medication-
impaired drivers equivalent to seizure disorders, but the documentation
of your counseling is your protection. If the patient is in a safety-
sensitive occupation (commercial driver, healthcare worker, heavy
machinery operator), this requires explicit conversation and
documentation.

Q3: The patient says they can't function without it. How do I respond
to that?
A3: Take it seriously — they are likely correct that they cannot
function without it in the short term, because physical dependence is
real. Validate this: "I believe you, and I'm not suggesting you stop
taking it. What I want to understand is whether the medication is
helping you live the life you want, or whether it has become something
you need just to feel normal." This distinction — therapeutic benefit
versus dependence maintenance — is the clinical and ethical core of the
long-term benzo management question.

[Opiate-Benzo Combination]

Q1: I've inherited a patient on both. What is my first move?
A1: Do not prescribe both at this visit without a safety plan in place.
This is the single highest-risk combination in outpatient prescribing —
the FDA black box warning is unambiguous. At this visit: assess which
medication is primary, prescribe whichever is more immediately necessary
with a one-time bridge supply if needed, prescribe naloxone and counsel
the patient and household on administration, and initiate urgent
e-consults to the appropriate specialists — psychiatry for the benzo
indication, pain management for the opiate, or a combined consult if
available.

Q2: The patient has been on both for years with no adverse events.
Doesn't that suggest it's safe for them specifically?
A2: No adverse event to date is not the same as safe. The combination
increases overdose mortality risk regardless of individual tolerance.
The absence of prior harm reflects probability, not immunity — and the
probability of harm increases with duration of combined exposure.
"They've been fine so far" is not a documentable clinical rationale for
continuing a black-box combination without specialist input.

Q3: Who owns the taper — me, psychiatry, or pain management?
A3: The taper of a patient on both opiates and benzodiazepines requires
coordination between providers. As the PCP you own the care coordination
— you do not necessarily own the execution of both tapers. The general
principle is to taper one at a time, slowly, with the higher-risk agent
(usually the benzodiazepine in terms of seizure risk) addressed with
specialist guidance. The e-consult is not a hand-off — you remain the
primary care provider. It is a request for a specific plan.

[High Dose Threshold]

Q1: How do I convert my patient's medication to diazepam equivalents?
A1: Common benzodiazepine to diazepam equivalents (approximate):
- Diazepam 5 mg = reference standard
- Alprazolam (Xanax) 0.5 mg ≈ diazepam 5 mg (alprazolam 2 mg/day =
  diazepam 20 mg equivalent)
- Lorazepam (Ativan) 1 mg ≈ diazepam 10 mg (lorazepam 4 mg/day =
  diazepam 40 mg equivalent)
- Clonazepam (Klonopin) 0.5 mg ≈ diazepam 10 mg (clonazepam 2 mg/day =
  diazepam 40 mg equivalent)
- Temazepam 10 mg ≈ diazepam 10 mg
Calculate total daily diazepam equivalent before assessing dose category.

Q2: My patient is on alprazolam 2 mg TID. Is that high dose?
A2: Yes. Alprazolam 2 mg TID = 6 mg/day alprazolam = approximately
diazepam 60 mg equivalent — well above the 40 mg threshold. Alprazolam
is additionally concerning because of its short half-life, which
produces significant interdose withdrawal and makes it one of the most
difficult benzodiazepines to taper. This patient needs psychiatry
e-consult before you continue prescribing at this dose. Document the
equivalent calculation in the chart.

Q3: Can I continue at high dose while awaiting the e-consult?
A3: Yes — do not reduce or discontinue while the consult is pending.
Prescribe one month at the current dose, document your awareness of the
dose threshold, document that specialist input is pending, and schedule
a follow-up for shortly after the expected consult response. Institutional
support applies when you are actively working the framework.

[CNS Depressant Combinations]

Q1: Why is gabapentin specifically flagged?
A1: Gabapentin and pregabalin have sedating and respiratory depressant
properties that are potentiated by benzodiazepines. The combination has
been increasingly associated with overdose deaths, particularly in
patients with underlying respiratory disease or concurrent opiate use.
The FDA added a warning on this combination in 2019. A patient on a
benzodiazepine plus gabapentin plus an opiate is in the highest risk
tier regardless of individual doses.

Q2: My patient takes zolpidem for sleep and a benzodiazepine for
anxiety. Is that a problem?
A2: Yes — Z-drugs (zolpidem, eszopiclone, zaleplon) act on the same
GABA-A receptors as benzodiazepines and produce additive CNS depression.
This combination is explicitly flagged in Beers Criteria and FDA
guidance. At this visit: document the combination, counsel the patient
on the risk, and identify which agent is primary. CBT-I is the
appropriate long-term intervention for the insomnia component.
Eliminating the Z-drug is generally lower risk than addressing the
benzodiazepine first.

Q3: The patient is also on a muscle relaxant prescribed by orthopedics.
What do I do?
A3: Contact the prescribing provider. Concurrent benzodiazepine and
muscle relaxant prescribing (cyclobenzaprine, methocarbamol,
carisoprodol) represents a polypharmacy CNS depressant burden that
requires coordination. Carisoprodol (Soma) is particularly high-risk —
it is metabolized to meprobamate, a barbiturate-like compound with
significant abuse potential. Document your communication with the
orthopedic provider and the agreed plan.

[No Documentable Indication]

Q1: The medication has been prescribed for years but I cannot find any
psychiatric or neurological indication. What are my options?
A1: Three pathways: (1) Establish an indication at this visit through
clinical assessment — administer GAD-7, PHQ-9, ask about panic attacks,
take a sleep history. If a condition is present, diagnose and document
it. (2) If no indication can be established and the patient is
physically dependent, e-consult to psychiatry with the explicit
question: "Patient on chronic benzodiazepine without documentable
indication. Please advise on taper planning and whether any psychiatric
diagnosis is present." (3) If the patient declines evaluation and
insists on continuation without any clinical basis, document the
conversation, document your clinical assessment, and make a reasoned
decision about whether you can continue prescribing — knowing that "no
indication" is a significant documentation liability.

Q2: Can I just write "anxiety" as the indication to have something in
the chart?
A2: No — documenting a diagnosis you have not clinically assessed is
not a solution and creates its own liability. If anxiety is present,
assess it properly and document your assessment. If it is not present,
do not fabricate it. The four-minute GAD-7 exists precisely so that
this question has a documented answer.

[Age and Cognitive Risk]

Q1: Why are benzodiazepines specifically problematic in patients ≥ 65?
A1: Multiple converging risks: falls and hip fractures (benzodiazepines
impair balance, reaction time, and depth perception), cognitive
impairment (both acute confusion and potential long-term dementia risk
with chronic use), paradoxical agitation in some older patients, and
prolonged half-life of many agents in older adults due to reduced
hepatic metabolism. The American Geriatrics Society Beers Criteria
explicitly lists all benzodiazepines as potentially inappropriate in
adults ≥ 65 regardless of indication.

Q2: My 72-year-old patient has been on lorazepam for 15 years and says
it's the only thing that helps her sleep. Do I taper her?
A2: This is one of the most delicate scenarios in primary care. A
15-year history of daily use in a 72-year-old represents profound
physical dependence, and taper carries real risks including withdrawal
seizure and severe anxiety. The answer is not to continue unchanged and
not to taper abruptly — it is to have an honest, unhurried conversation,
document the risks of both continuation and taper, involve the patient
in the decision, and obtain psychiatry e-consult for a guided taper plan
if the patient is willing. For patients who are clearly not candidates
for taper given age, functional status, and risk-benefit calculation,
documenting that reasoning explicitly is a defensible position.

Q3: A patient with mild cognitive impairment is on a benzodiazepine.
Should I be worried about causality?
A3: Yes — chronic benzodiazepine use is associated with accelerated
cognitive decline and may be contributing to or causing the impairment.
This does not mean the medication caused the dementia, but it is a
modifiable risk factor that should be addressed. Involve neurology or
geriatrics if the cognitive picture is complex. Document that the
association has been considered.

[Dose Escalation Requests]

Q1: The patient says their current dose no longer controls their
anxiety. They're asking for more. What do I do?
A1: Tolerance to the anxiolytic effect of benzodiazepines is expected
with chronic use — this is pharmacology, not failure. The appropriate
response is not to increase the dose. The appropriate response is:
"What you're describing is something that happens with long-term use of
this medication — it becomes less effective over time. The answer isn't
more of the same medication; it's finding an approach that works better
long-term." This is the moment to introduce SSRIs, SNRIs, buspirone, or
therapy as alternatives — not as replacements to be implemented today,
but as a direction of travel. Document the conversation and initiate
e-consult to psychiatry for transition planning.

Q2: Is dose escalation ever appropriate?
A2: In primary care, for chronic anxiety management, dose escalation of
an established benzodiazepine regimen is almost never the right answer
and should not occur without psychiatry input. There are narrow
exceptions — acute situational escalation for a defined procedure or
crisis — but these are time-limited and do not represent chronic dose
increases. If a patient's anxiety is inadequately controlled on their
current regimen, the clinical question is whether the underlying
condition is being managed appropriately, not whether the
benzodiazepine dose should be higher.

Q3: The patient threatens to go elsewhere if I won't increase the dose.
How do I handle this?
A3: With clarity and without apology: "I understand you're frustrated,
and I want to help you feel better. I'm not able to increase this
medication — that's a clinical decision, not a personal one. What I can
do is work with you on finding something that addresses the underlying
anxiety more effectively." Document the request, your response, and the
patient's reaction. A patient who leaves the practice over a refusal to
escalate a benzodiazepine dose has self-selected out of a framework
that was designed to protect them.
```

**Meta-pass findings:**

OE response received 2026-05-03. Below is the flag-by-flag evidence review extracted from OE, with each flag mapped to the affected tracker row(s). 12 of 13 flags concern clinical claims and are processed inline; **Flag 13** (NY PDMP frequency requirement) is a regulatory claim outside OE's clinical-evidence scope and is deferred to a parallel `verification/controlled-substances-ny-nj.md` workstream.

**Dominant new reference:** the 2025 ASAM/ACMT Joint Clinical Practice Guideline on Benzodiazepine Tapering is referenced in 8 of 13 flags as the authoritative source for taper sequencing, dose thresholds, dependence onset, and tolerance framing. It supersedes pre-2022 framing on most clinical decision points and is the central new citation across the rewrite.

**Highest-priority corrections (per OE summary table):**
- Flag 3 — high-dose threshold should drop from 40 mg → ~15 mg diazepam equivalents per 2025 ASAM/ACMT
- Flag 8 — taper sequencing (CDC suggests opioids first, not benzos)
- Flag 1 — abrupt-discontinuation outcome certainty (death is rare and polysubstance-related)
- Flag 7 — "unambiguous black box warning" mischaracterizes FDA boxed warning + CDC nuance

---

**Flag 1 — Landing intro: "Abrupt discontinuation causes withdrawal seizure and death"**

Affects tracker row 1.

**Verdict: Verified with nuance.** Seizures from abrupt discontinuation are recognized but uncommon; death is rare and typically polysubstance-related (lorazepam FDA label).[ref:fda-ativan-2025] AAFP 2023 describes these outcomes as occurring "in rare cases".[ref:aafp-robertson-2023] The 2025 ASAM/ACMT guideline notes severe withdrawal risk depends on dose, duration, and agent half-life, and that some short-term/low-dose patients can discontinue without taper.[ref:asam-acmt-2025]

**Corrected framing for the live module:** "Abrupt discontinuation of chronic benzodiazepines can precipitate withdrawal seizures and, rarely, death — particularly in patients on higher doses, longer durations, or concurrent CNS depressants. This risk mandates gradual tapering rather than abrupt cessation."

**Action:** Soften language on landing intro and footer. Replace blanket "causes withdrawal seizure and death" with risk-conditional framing.

---

**Flag 2 — Checklist item 1: "no concurrent opiates or other CNS depressants of concern"**

Affects tracker row 3 (and indirectly row 5, the escalation item).

**Verdict: Verified with nuance.** The 2022 CDC Opioid Prescribing Guideline explicitly softened from the 2016 version, noting that "in certain circumstances it might be appropriate to prescribe opioids to a patient receiving benzodiazepines"; the recommendation was downgraded to Category B (discretionary) rather than Category A.[ref:cdc-opioid-2022] Concurrent opioid use should not function as automatic disqualification in the checklist; it should signal heightened caution and documented risk mitigation.

**Corrected framing for the live module:** "No concurrent opioids or other CNS depressants without documented risk mitigation (e.g., naloxone co-prescription, specialist coordination, documented risk-benefit assessment)."

**Action:** Soften language — checklist item 1's "no concurrent opiates" clause needs the "without documented risk mitigation" qualifier.

---

**Flag 3 — Escalations item 2: "Dose above equivalent of diazepam 40 mg/day"**

Affects tracker row 6 (escalation item) and row 45 (alprazolam 2 mg TID example). Also forces a re-think of row 44 (equivalence table) — see Flag 4.

**Verdict: Needs revision.** The 2025 ASAM/ACMT Joint Guideline defines high daily dose as **>15 mg diazepam equivalents** (e.g., >2 mg alprazolam, >3 mg lorazepam, >1.5 mg clonazepam).[ref:asam-acmt-2025] The 40 mg threshold is substantially more permissive than current expert consensus and could leave high-risk patients without specialist involvement. DSM-5-TR notes that withdrawal has been reported with as little as 15 mg diazepam daily for several months.[ref:dsm5tr]

**Corrected framing for the live module:** Change escalation threshold from ">40 mg diazepam equivalent" to ">15 mg diazepam equivalent" per the 2025 ASAM/ACMT guideline. Optional secondary tier at ≥40 mg as "associated with higher risk of clinically significant withdrawal seizures and delirium per DSM-5-TR".

**Action:** Rewrite per OE — change escalation item 2 threshold; update FAQ benzos-highdose.q1/q2 narrative; update the alprazolam 2 mg TID example reasoning (which already says 60 mg eq is "well above the 40 mg threshold" — under the new framing it is well above the 15 mg threshold and at the second tier).

---

**Flag 4 — Equivalency table precision and internal consistency**

Affects tracker row 44 (equivalency table) and the math-references in rows 45 and 6.

**Verdict: Verified with nuance.** The 2025 ASAM/ACMT guideline references approximate equivalents to 10 mg oral diazepam, sourced from the VA/DoD SUD guideline and the Ashton Manual. While the table values themselves (lorazepam 1 mg ≈ diazepam 10 mg; clonazepam 0.5 mg ≈ diazepam 10 mg) are conventional, the guideline emphasizes that "unlike with opioid medications, no precise strategies for conversion exist" and that equivalencies are based on patient perception, not pharmacokinetic data.[ref:asam-acmt-2025] The module presents these as precise values without that caveat.

The module's internal math is also inconsistent: lorazepam 4 mg/day = diazepam 40 mg eq is "at threshold" under old framing, but under the 2025 guideline a 15 mg eq threshold means lorazepam 4 mg/day is **2.7× the threshold**. Once Flag 3 is applied, the table's example calculations need to be re-aligned.

**Corrected framing for the live module:** Add a prominent caveat at the top of the equivalence table: "These equivalencies are approximate and based on clinical consensus, not pharmacokinetic precision. Individual patient responses vary significantly. Clinical decisions should be individualized based on patient response."[ref:asam-acmt-2025]

**Action:** Add new content (caveat at the top of the table). Re-anchor the worked examples to the 15 mg threshold from Flag 3. Consider promoting the table to a proper HTML `<table>` (asset T1 in the asset inventory) so the caveat sits visually distinct from the rows.

---

**Flag 5 — Duration Q1: "Physical dependence can develop within 4–6 weeks of daily use"**

Affects tracker row 27 (and indirectly row 28).

**Verdict: Needs revision.** The 2025 ASAM/ACMT guideline frames clinically significant withdrawal risk as **≥3 months of use at ≥4 days/week** at any dose, with **alprazolam as a 2–4-week exception** for daily use.[ref:asam-acmt-2025] The lorazepam FDA label notes "physical dependence can occur when benzodiazepines are taken steadily for several days to weeks".[ref:fda-ativan-2025] DSM-5-TR notes withdrawal has been reported with as little as 15 mg diazepam daily "for several months".[ref:dsm5tr] The guideline explicitly states that "defining strict thresholds for the risk of physical dependence and withdrawal is difficult because many factors beyond the dose and duration of BZD use impact risk".[ref:asam-acmt-2025]

**Corrected framing for the live module:** "Physical dependence risk increases with dose, duration, and frequency. The 2025 ASAM/ACMT guideline identifies clinically significant withdrawal risk with ≥3 months of use at ≥4 days/week, though alprazolam may produce dependence in as little as 2–4 weeks of daily use. Strict time thresholds should not replace individualized clinical assessment."

**Action:** Rewrite per OE — replace the blanket "4–6 weeks" framing with the ASAM/ACMT framework. Note alprazolam-specific 2–4-week exception.

---

**Flag 6 — Insomnia Q2: "benzodiazepines are not indicated for chronic insomnia management and are not approved for this use long-term"**

Affects tracker row 22 (and net-new content for row 23 / CBT-I).

**Verdict: Partially inaccurate / needs revision.** Five benzodiazepines (**temazepam, triazolam, quazepam, flurazepam, estazolam**) are FDA-approved for insomnia treatment; their labeling does not uniformly specify a maximum duration.[ref:aafp-matheson-2024][ref:acp-qaseem-2016] What is accurate is that guidelines uniformly recommend against long-term benzodiazepine use for insomnia: VA/DoD 2019 guideline advises against benzodiazepines for chronic insomnia disorder; ASAM/ACMT notes short-term use should typically not exceed 4 weeks.[ref:vadod-insomnia-2019][ref:asam-acmt-2025] A Lancet network meta-analysis found no long-term trial data for benzodiazepines in insomnia.[ref:lancet-decrescenzo-2022]

**Corrected framing for the live module:** "While several benzodiazepines (temazepam, triazolam, quazepam, flurazepam, estazolam) carry FDA approval for insomnia, clinical practice guidelines uniformly recommend against their long-term use for this indication due to tolerance, dependence risk, and lack of long-term efficacy data. The VA/DoD guideline specifically advises against benzodiazepines for chronic insomnia disorder."

**Action:** Rewrite per OE — distinguish FDA approval (which exists) from guideline recommendations (which oppose long-term use). Cite VA/DoD 2019 specifically.

---

**Flag 7 — Combo opiate Q1: "the FDA black box warning is unambiguous"**

Affects tracker row 38.

**Verdict: Needs revision (terminology + scope).** Two corrections: (a) FDA terminology is **"boxed warning"** — "black box" is colloquial and was retired by FDA. The FDA added the boxed warning to opioid + benzodiazepine labeling in 2016.[ref:fda-ativan-2025] (b) The warning is not "unambiguous" in the sense the module implies — it does not mandate that the combination never be prescribed. FDA explicitly clarified that benzodiazepine use should not be a reason to withhold buprenorphine or methadone for OUD treatment.[ref:asam-acmt-2025] The 2022 CDC guideline downgraded its recommendation on this combination from Category A to Category B.[ref:cdc-opioid-2022]

**Corrected framing for the live module:** "The FDA boxed warning (2016) highlights the risk of respiratory depression, coma, and death with concurrent opioid–benzodiazepine use. The warning does not prohibit all co-prescribing — it calls for the lowest effective doses and minimum durations when concurrent use is warranted. The 2022 CDC guideline recommends 'particular caution' rather than absolute avoidance. FDA has clarified that benzodiazepine use should not be a reason to withhold buprenorphine or methadone for OUD."

**Action:** Rewrite per OE — replace "black box" → "boxed"; replace "unambiguous" framing with the warning's actual operational content; add the buprenorphine/methadone-OUD carve-out (this is net-new content the module currently lacks; see net-new tracker row 70).

---

**Flag 8 — Combo opiate Q3: taper sequence — "higher-risk agent (usually the benzodiazepine in terms of seizure risk)"**

Affects tracker row 43.

**Verdict: Needs revision (contradicts CDC).** The 2016 CDC Opioid Prescribing Guideline explicitly states: "When patients require tapering of benzodiazepines or opioids to reduce risk of fatal respiratory depression, **it might be safer and more practical to taper opioids first**".[ref:cdc-opioid-2016] The 2022 CDC guideline does not reverse this position.[ref:cdc-opioid-2022] The 2025 ASAM/ACMT guideline recommends shared decision-making about which medication to taper and does not specify a universal sequence.[ref:asam-acmt-2025] The module's "usually the benzodiazepine" sequencing could destabilize pain management while leaving respiratory depression risk in place.

**Corrected framing for the live module:** "There is no consensus on which agent to taper first. The CDC has suggested it may be safer to taper opioids first, while benzodiazepine withdrawal carries seizure risk with abrupt discontinuation. The 2025 ASAM/ACMT guideline recommends shared decision-making with the patient and coordination among prescribers to determine the sequence."

**Action:** Rewrite per OE — remove the "usually the benzodiazepine" framing; replace with shared-decision-making + CDC suggestion that opioids-first may be safer in many cases. This is the **highest-impact correction** in the meta-pass and a candidate to feature prominently in the rewrite.

---

**Flag 9 — Gabapentin Q1: "The FDA added a warning on this combination in 2019"**

Affects tracker row 49.

**Verdict: Needs revision.** The FDA's December 2019 safety communication warned about respiratory depression with **gabapentinoids**, but the warning specifically highlighted risk when combined with **opioids** and in patients with underlying respiratory conditions — it was not a warning specifically about the benzodiazepine–gabapentinoid combination.[ref:shrestha-f1000-2020][ref:williams-drugs-2023] The 2019 AGS Beers Criteria update separately flagged the opioid–gabapentinoid interaction.[ref:beers-2019] The benzodiazepine–gabapentinoid interaction risk is supported by the pregabalin FDA label, which warns of additive CNS effects.[ref:fda-pregabalin-2025]

**Corrected framing for the live module:** "The FDA issued a 2019 safety communication warning about respiratory depression with gabapentinoids, primarily highlighting risk with concurrent opioid use. The 2019 Beers Criteria separately flagged opioid–gabapentinoid interactions. The pregabalin FDA label warns of additive CNS depression with benzodiazepines. The triple combination (opioid + benzodiazepine + gabapentinoid) represents the highest risk tier."

**Action:** Rewrite per OE — disentangle the 2019 FDA gabapentinoid warning (opioid-focused) from the benzodiazepine–gabapentinoid pharmacology (pregabalin label + Beers).

---

**Flag 10 — Carisoprodol description: "metabolized to meprobamate, a barbiturate-like compound"**

Affects tracker row 54.

**Verdict: Verified with nuance.** Meprobamate is a **carbamate**, not a barbiturate — but it does exhibit barbiturate-like activity at GABA-A receptors, and its discriminative-stimulus effects are antagonized by the barbiturate antagonist bemegride but not by flumazenil.[ref:kumar-ejp-2016][ref:gonzalez-jpet-2009] The module's "barbiturate-like compound" could be misread as "actual barbiturate".

**Corrected framing for the live module:** "Carisoprodol is metabolized to meprobamate, a carbamate with barbiturate-like GABAergic activity and significant abuse potential."

**Action:** Soften language — small wording change from "barbiturate-like compound" to "carbamate with barbiturate-like GABAergic activity".

---

**Flag 11 — Cognitive Q3: "chronic benzodiazepine use is associated with accelerated cognitive decline and may be contributing to or causing the impairment"**

Affects tracker rows 63 and 64.

**Verdict: Verified with nuance / Controversial.** The benzodiazepine–dementia association is actively debated. A 2022 meta-analysis found the association did not persist after controlling for protopathic bias (reverse causation, where prodromal dementia symptoms prompt benzodiazepine prescribing).[ref:aldawsari-bjcp-2022] A large VA retrospective cohort (n=528,006) found only a minimal association (HR ~1.05–1.06) without dose-response.[ref:gerlach-jgerontol-2022] A 2025 case-control study found the association of chronic use with dementia was restricted to the 4-year prodromal period, suggesting confounding by indication.[ref:legrand-jns-2025] However, a 2018 meta-analysis controlling for protopathic bias with ≥5-year lag still found a modest association (OR 1.30).[ref:penninkilampi-cnsdrugs-2018]

**Corrected framing for the live module:** "Chronic benzodiazepine use has been associated with increased dementia risk in observational studies, but this association is controversial. Recent evidence suggests it may be substantially explained by reverse causation (prodromal dementia symptoms prompting benzodiazepine prescribing) and confounding by indication. Benzodiazepines do cause acute cognitive impairment, which is a modifiable and reversible contributor to cognitive complaints in current users. Whether they independently cause irreversible neurodegeneration remains unresolved."

**Action:** Rewrite per OE — soften the causal framing; preserve the acute-impairment claim (which is well-established and clinically actionable); explicitly flag the protopathic-bias / reverse-causation issue. The "modifiable risk factor" framing in the original Q3 answer can stand for *acute* impairment but must be carefully scoped.

---

**Flag 12 — Dose escalation Q1: "Tolerance to the anxiolytic effect... is expected with chronic use — pharmacology, not failure"**

Affects tracker row 65.

**Verdict: Verified with nuance / Controversial.** Tolerance to **sedative and hypnotic** effects of benzodiazepines is well-established. Tolerance to the **anxiolytic** effect is debated — some evidence suggests anxiolytic efficacy may be partially maintained with chronic use even as sedative tolerance develops. The 2025 ASAM/ACMT guideline notes therapeutic effects "diminished within days to weeks" for insomnia but does not make the same blanket statement about anxiolysis.[ref:asam-acmt-2025] Presenting anxiolytic tolerance as pharmacologic certainty oversimplifies a nuanced area and could mask the differential when a patient reports loss of efficacy.

**Corrected framing for the live module:** "Tolerance to the sedative and hypnotic effects of benzodiazepines is well-established. Tolerance to anxiolytic effects is less clearly defined and may be incomplete. When a patient reports loss of efficacy, the differential includes pharmacological tolerance, worsening of the underlying condition, and development of benzodiazepine use disorder — each requiring a different clinical response."

**Action:** Rewrite per OE — preserve the "don't simply escalate" clinical action but frame the underlying physiology as more nuanced; add the differential-diagnosis framing (tolerance vs worsening vs BUD).

---

**Flag 13 — PDMP Q3: "New York State requires PDMP review prior to every Schedule IV controlled substance prescription"**

Affects tracker row 18.

**Verdict: Out of scope for OE / pending regulatory verification.** OE notes: "Cannot be independently verified from the medical literature and may be inaccurate in detail. New York's I-STOP law and subsequent amendments have specific requirements that have evolved over time. The module should cite the specific statute or regulation and note that state PDMP requirements change frequently. Presenting this as settled fact without a regulatory citation in a decision-support tool creates risk if the requirement has been modified."

This flag is **deferred to `verification/controlled-substances-ny-nj.md`** — a parallel verification document that does for legal/regulatory claims what this file does for clinical claims. That work uses primary statute (NY Public Health Law / Education Law, NJ NJSA Title 24 / 45, federal 21 CFR §1306) via WebFetch rather than OE. References staged from that work (e.g., `istop-ny-3343a`, `nj-pmp-45-1-44`) will apply across all three controlled-substance modules (benzos, opiates, adhd).

**Live-module disclaimer pattern (per OE Flag 13):** every regulatory claim closes with "verify current state requirements with your compliance office at the time of use; regulations are subject to legislative updates."

**Action:** Hold tracker row 18 verdict as **pending regulatory verification**. Pair this with the same hold on tracker rows 3 (PDMP review pattern), 17 (single-prescriber co-prescribing liability), and 19 (Schedule IV scheduling) once the regulatory work begins. Once that work returns with statute citations, those rows resolve together.

---

## Shared bundle prompt template

Use this wrapper for Bundles 1–8. Paste the bundle's claim list into the `[claims]` slot.

```
I'm reviewing a primary care decision-support tool for managing adult
patients inherited on chronic benzodiazepine therapy. I need to verify
a set of related clinical claims against current evidence and guidelines.

For each claim below, please tell me:
  1. Is this supported by current evidence, guidelines (FDA, ASAM, AAFP,
     APA, AGS Beers, NICE, state regulatory bodies), or standard of care?
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

## Bundle 1 — Regulatory & PDMP framework  **(PILOT FIRST)**

Highest-stakes, most black-and-white facts. Run this first to calibrate the prompt wording.

```
- Benzodiazepines are Schedule IV controlled substances under the federal
  Controlled Substances Act.
- New York State requires PDMP review prior to every Schedule IV
  controlled substance prescription, including benzodiazepines (legal
  obligation under I-STOP, not preference).
- "Single prescriber, single pharmacy, consistent quantities" is the
  default expectation for a chronic benzodiazepine patient on PDMP review.
- Two providers co-prescribing the same controlled substance class
  (e.g., PCP + psychiatry both prescribing benzodiazepines) without
  explicit documented coordination is a liability for both providers and
  a safety risk for the patient.
- Recent ER visits for benzodiazepine withdrawal or toxicity may appear
  in shared records (Care Everywhere, regional HIE) but not necessarily
  in the PDMP itself, and warrant separate review.
- Concurrent opiate prescriptions on PDMP review are the most dangerous
  co-prescribing pattern in outpatient practice and the highest-priority
  safety flag at the inherited benzodiazepine visit.
- Z-drug co-prescription with a benzodiazepine doubles CNS depression
  risk and is a defined PDMP red flag.
- Multiple prescribers within 12 months without documented coordination,
  and quantities exceeding what a single prescriber's regimen would
  generate, are concerning patterns warranting clarification before
  continuing benzodiazepine prescribing.
```

**Bundle 1 findings:**

OE response received 2026-05-03 (raw at `verification/benzo1-4.md` lines 1–119). Bundle 1 was the regulatory + PDMP pilot — most claims overlap with content already resolved via the meta-pass (Flag 7) and the regulatory verification file (R1, R4, R10–R12). Bundle 1 produces **2 substantive corrections** (Claims 3 and 7) and **4 new operational data points** worth adding to the module.

**Substantive corrections:**

**Claim 3 — "Single prescriber, single pharmacy, consistent quantities" reframed.** Verdict: Reasonable clinical heuristic, but not a formally codified standard. No guideline uses this exact "default expectation" formulation. The supporting concept is well-supported (ASAM/ACMT 2025 recommends pharmacy lock-in / controlled-substance agreements; Medicaid lock-in programs formalize this; NYS PDMP research tracks ≥5 prescriber and ≥5 pharmacy episodes as adverse indicators[ref:bachhuber-pds-2019]). **Operational reframe:** "deviations from a single-prescriber / single-pharmacy pattern are flags warranting clarification, not automatic evidence of misuse. PDMP data should be interpreted in clinical context, not used as a standalone judgment tool."[ref:haines-ijdp-2022][ref:asam-acmt-2025] Affects tracker row 3 (already softened post-meta-pass; Bundle 1 confirms direction and supplies the reframing language).

**Claim 7 — Z-drug + benzo "doubles CNS depression risk" / "defined PDMP red flag" — OVERSTATED.** Verdict: Partially supported but two specific numeric/framing claims are not citable as written. (a) The "doubles risk" figure refers to AGS data on **falls and hip fractures** with either Z-drug OR benzodiazepine alone vs. no use — **not** the additive CNS depression risk of combining them; the module conflates two metrics.[ref:ags-choosingwisely-2013] (b) "Defined PDMP red flag" overstates the formality of existing standards — Z-drugs are Schedule IV and visible on PDMP, but no universal PDMP-system-defined red flag category exists for this combination; some state PDMPs generate automated alerts for multiple CNS depressants.[ref:greenwood-ericksen-aem-2016][ref:elder-wjem-2018] **Corrected framing:** "Concurrent Z-drug and benzodiazepine prescriptions produce additive CNS depression via the same GABA-A receptor mechanism and should generally be avoided. The combination is visible on PDMP review and warrants clinical attention. AGS 2023 Beers Criteria additionally flag the use of **≥3 CNS-active medications** concurrently as potentially inappropriate in older adults, including benzodiazepines, opioids, gabapentinoids, and Z-drugs."[ref:arnold-aafp-2024][ref:matheson-aafp-2024] Affects tracker row 14.

**Confirmations (already-resolved rows; Bundle 1 supplies additional citations):**

- Claim 1 — Benzos are Schedule IV: **Verified** (already R1; Bundle 1 confirms via FDA labels for alprazolam, ativan, diazepam, triazolam).
- Claim 2 — NY I-STOP requires PDMP review prior to every Schedule II/III/IV prescription: **Verified** (already R4 / Row 18). Bundle 1 adds compliance context: a NYS physician survey found 83% awareness, 48.4% perfect compliance.[ref:istop-blum2016] I-STOP also mandates electronic prescribing (R10 confirmed).[ref:pylypchuk-mcrr-2022]
- Claim 4 — Dual-prescriber liability: **Verified** (already R12 / Row 17). Bundle 1 adds the ASAM/ACMT-specific operational language ("seek to coordinate care… may entail obtaining releases or other agreements") and the DEA-registration / licensure-jeopardy framing.[ref:asam-acmt-2025][ref:cdc-opioid-2022]
- Claim 5 — ER visits not in PDMP: **Verified** (Row 15). PDMPs track prescribing/dispensing only; HIE/Care Everywhere is the right complementary review.[ref:haines-ijdp-2022][ref:greenwood-ericksen-aem-2016][ref:elder-wjem-2018]
- Claim 6 — Concurrent opiates as highest-priority safety flag: **Substantially correct** (already MP Flag 7 / Row 38, with the boxed-warning + Category-B nuance). Bundle 1 adds quantitative anchors: case-cohort study found near-quadrupling of overdose-death risk vs opioid alone[ref:cdc-opioid-2022]; in NYS, **70.7% of 2012 opioid-analgesic-related deaths also involved a benzodiazepine**[ref:sharp-mmwr-2015]; VA/DoD 2022 chronic pain guideline goes further than CDC, stating **"harms outweigh the benefits"** for concurrent use[ref:vadod-pain-2022]. These are useful module-level data points.
- Claim 8 — Multiple prescribers / quantity excess as concerning: **Verified.** Bundle 1 documents that the I-STOP mandate was associated with a **58% reduction** in problematic ≥5-prescriber episodes statewide.[ref:bachhuber-pds-2019] CDC 2022 says "clinicians should take actions to improve patient safety" when multiple-prescriber patterns are found, but explicitly warns against dismissal-from-care based on PDMP findings alone.[ref:cdc-opioid-2022]

**Net-new operational content surfaced by Bundle 1 (added to tracker as Rows 77–80):**

1. I-STOP permits prescribers to contact other prescribers identified in the PMP **without explicit patient permission** (NY-specific operational fact, missing from current module text).[ref:virani-psychserv-2018]
2. NY 2012 mortality data: 70.7% of opioid-analgesic-related deaths involved a benzodiazepine — concrete anchor for the "highest-priority safety flag" framing.[ref:sharp-mmwr-2015]
3. VA/DoD 2022 chronic pain guideline says "harms outweigh the benefits" for concurrent benzo + opioid — stronger than CDC and worth surfacing for providers managing co-prescribed patients.[ref:vadod-pain-2022]
4. AGS 2023 Beers Criteria: **≥3 CNS-active medications** (benzos, opioids, gabapentinoids, antipsychotics, Z-drugs) is potentially inappropriate in older adults — replaces the imprecise "doubles risk" framing in the Z-drug FAQ.[ref:arnold-aafp-2024]

**Prompt iteration:** Bundle 1 returned sharp, specifically-cited pushback. **Prompt v1 stays.** No iteration needed.

OE follow-up offered (deferred): "the specific evidence and guideline recommendations for structuring the first-visit risk-benefit assessment and documentation when inheriting a patient on chronic benzodiazepine therapy" — relevant to Bundle 7 (inherited-patient first-visit standard of care). Hold for Bundle 7 processing.

---

## Bundle 2 — Pharmacology & dose equivalents

```
- The "diazepam 40 mg/day equivalent" threshold is a recognized high-
  dose marker for chronic benzodiazepine therapy in primary care.
- Approximate diazepam equivalents: alprazolam 0.5 mg ≈ diazepam 5 mg;
  lorazepam 1 mg ≈ diazepam 10 mg; clonazepam 0.5 mg ≈ diazepam 10 mg;
  temazepam 10 mg ≈ diazepam 10 mg.
- Therefore: alprazolam 2 mg/day ≈ diazepam 20 mg eq; lorazepam 4 mg/day
  ≈ diazepam 40 mg eq; clonazepam 2 mg/day ≈ diazepam 40 mg eq;
  alprazolam 6 mg/day (e.g., 2 mg TID) ≈ diazepam 60 mg eq.
- Alprazolam's short half-life produces significant interdose withdrawal
  and makes it one of the most difficult benzodiazepines to taper.
- Diazepam's long half-life is the basis for diazepam conversion as a
  taper strategy: the smoother pharmacokinetic profile reduces interdose
  withdrawal and supports gradual reduction.
- FDA-approved indications for benzodiazepines do NOT include chronic
  insomnia management beyond short-term use.
- What is the source / origin of the diazepam 40 mg/day equivalent
  high-dose threshold? Is it from ASAM, NICE, the BNF, the Ashton Manual,
  state regulatory guidance, or institutional convention?
```

**Bundle 2 findings:**

OE response received 2026-05-03 (raw at `verification/benzo1-4.md` lines 120–242). Bundle 2 produces **one outright module-text correction (temazepam equivalency)**, **one tier-framework refinement** (ASAM low/moderate/high vs single threshold), and **several taper-strategy nuances** that soften meta-pass-resolved rows.

**Outright corrections:**

- **Claim 2 — Temazepam equivalency is WRONG in the module.** Per Ashton Manual / VA-DoD SUD guideline (2021) / ASAM 2025 Appendix H: **temazepam 20 mg ≈ diazepam 10 mg** (NOT temazepam 10 mg). The module currently says "Temazepam 10 mg ≈ diazepam 10 mg" which is incorrect by a factor of two. **This is the only outright factual error caught in Bundle 2 and the most consequential single-cell change in the module.**[ref:asam-acmt-2025][ref:vadod-sud-2021][ref:ashton-drugs-1994] Affects tracker Row 44; new Row 81.

- **Claim 1/3/7 — 40 mg/day threshold not citable.** Already covered by MP Flag 3 / Row 6 / Row 71. Bundle 2 supplies the **full ASAM tier framework** (low ≤10 / moderate 10–15 / high >15 mg diazepam equivalents) plus Soyka NEJM 2017 thresholds (≥30 mg → taper >4–6 weeks; ≥100 mg → consider inpatient).[ref:asam-acmt-2025][ref:soyka-nejm-2017] Net-new Row 82 captures the tier framework; Row 84 captures the Soyka thresholds. The 40 mg figure is not findable in ASAM, Ashton, VA/DoD, AAFP, NICE, BNF, or AGS Beers — it appears to be institutional/clinical convention only.

**Confirmations + nuances on existing rows:**

- **Claim 4 — Alprazolam short half-life: Strongly supported.** ASAM explicitly: alprazolam "tends to be associated with a more rapid onset of physical dependence" and "tends to be difficult to taper given that it is short-acting and has no active metabolites." **Crucially: ASAM says taper may be appropriate for alprazolam after as little as 2–4 weeks daily use** — much shorter than the 4–6 week / 3-month thresholds for other benzos.[ref:asam-acmt-2025][ref:alprazolam-fda] FDA alprazolam label recommends taper by no more than 0.5 mg every 3 days. Affects Row 46; new Row 83. Note: "interdose withdrawal" (in module text) is widely-used clinical terminology but not the precise ASAM phrasing — clinical concept is valid.

- **Claim 5 — Diazepam conversion advantage: Recognized but evidence-limited.** Major nuance the meta-pass missed: VA/DoD 2021 says "switching from a short-acting benzodiazepine to a longer-acting benzodiazepine may not improve outcomes"; Soyka NEJM 2017 says "not associated with a better outcome"; JAMA IM 2026 says "evidence of benefit is limited"; Canadian guidelines recommend continuing the same benzo. **Diazepam conversion is one acceptable approach, not the default.** Diazepam itself contraindicated in hepatic impairment / older adults / polypharmacy due to active metabolites + reduced clearance.[ref:asam-acmt-2025][ref:vadod-sud-2021][ref:soyka-nejm-2017][ref:shuey-jamaim-2026] Affects Row 31.

- **Claim 6 — Diazepam conversion + psychiatry coordination: Reasonable not mandatory.** Affects Row 32. ASAM recommends specialist consult for complex cases (treatment-resistant anxiety, seizure disorders, concurrent SUD), but no blanket rule. Stronger operational point: **don't make medication changes at the handoff visit** regardless of agent.

- **Claim 6 module pivot:** FDA-approved-for-insomnia content — already covered by MP Flag 6 / Row 22 / Row 70. Bundle 2 adds: **alprazolam, clonazepam, lorazepam are NOT FDA-approved for insomnia at all** — patients on these "for sleep" represent off-label use of an unapproved indication, strengthening the deprescribing case.[ref:alprazolam-fda] ASAM notes limited exceptions for REM sleep behavior disorder and restless leg syndrome (sleep movement disorders ≠ chronic insomnia).

OE follow-up offered (queued): "the specific ASAM-recommended taper protocols (initial reduction rates, flexible vs. fixed schedules, adjunctive psychosocial interventions) for operationalizing this at the inherited-patient first visit." Hold for Bundle 4 supplement / module-rewrite phase.

---

## Bundle 3 — Indication & diagnostic standards

```
- Benzodiazepines are not appropriate as long-term monotherapy for
  chronic insomnia; FDA labeling and guideline-recommended duration is
  short-term.
- Cognitive Behavioral Therapy for Insomnia (CBT-I) is the evidence-
  based first-line treatment for chronic insomnia in primary care and
  can be initiated in parallel with any taper planning.
- The GAD-7 is a validated brief screening / severity measure for
  generalized anxiety disorder appropriate for use in primary care to
  document anxiety severity at the inherited-patient first visit.
- Anxiety disorders are among the most underdiagnosed conditions in
  adult primary care, and a "for nerves / for stress" benzodiazepine
  history often masks an undiagnosed anxiety disorder.
- For patients with documentable anxiety, an SSRI or SNRI plus therapy
  is a more appropriate long-term first-line approach than chronic
  benzodiazepine therapy.
- Documenting a diagnosis (e.g., "anxiety") for a patient you have not
  clinically assessed solely to justify a benzodiazepine prescription
  creates documentation liability rather than reducing it.
- "No documentable indication" for a chronic benzodiazepine prescription
  is a significant chart-defensibility liability and warrants either
  establishing an indication, e-consult, or a documented plan to taper.
```

**Bundle 3 findings:**

OE response received 2026-05-03 (raw at `verification/benzo1-4.md` lines 243–384). Bundle 3 is mostly confirmation (most insomnia/anxiety/indication claims are well-supported). Two operational additions worth surfacing: **USPSTF 2023's ≥65 carve-out** for anxiety screening (operationally important since most inherited benzo patients are older), and the **23-year median delay** from anxiety-disorder onset to treatment initiation in primary care.

**Confirmations + nuances on existing rows:**

- **Claim 1 — Insomnia long-term not appropriate: Supported.** Already MP Flag 6 / Row 22 / Row 70. Bundle 3 strengthens: VA/DoD 2019 "advises against" benzodiazepines for chronic insomnia regardless of monotherapy status. Eszopiclone and dual orexin receptor antagonists (DORAs) have longer-term efficacy data and are not subject to the same 4–5 week limitation — distinct from benzodiazepines. Net-new Row 90.[ref:vadod-insomnia-2019][ref:matheson-aafp-2024]

- **Claim 2 — CBT-I first-line: Supported.** Affects Row 23. Bundle 3 adds: **digital CBT-I** (VA Insomnia Coach, SleepEZ) as the access workaround when in-person therapy is unavailable. ACP 2016 strong recommendation; Morin & Buysse NEJM 2024 reaffirms; AGS 2025 Beers companion identifies CBT-I first-line in older adults.[ref:acp-qaseem-2016][ref:morin-nejm-2024][ref:steinman-jgs-2025] "Parallel with taper" framing is sound clinical practice but not a specific guideline mandate — present as "recommended concurrent approach." Net-new Row 91 (digital CBT-I).

- **Claim 3 — GAD-7 validated for primary care: Supported with caveats.** Affects Row 25. Three operationally important caveats Bundle 3 surfaces:
  - GAD-7 designed for **GAD specifically**; sensitivity for panic / social anxiety is lower and less characterized. If the patient's benzo was for panic, GAD-7 alone may be insufficient.
  - A positive screen is **not a diagnosis** — follow-up assessment for symptom persistence, distress, functional impairment is required.
  - **USPSTF 2023 recommends screening adults ≤64 only**; for adults ≥65, evidence was deemed insufficient (I statement) due to higher false-positive rates.[ref:uspstf-anxiety-2023][ref:oconnor-jama-2023][ref:akturk-cochrane-2025][ref:szuhany-jama-2022] Net-new Row 86 (USPSTF ≥65 carve-out).

- **Claim 4 — Anxiety underdiagnosed; "for nerves" masks formal diagnosis: First half strongly supported.** Affects Row 24. Bundle 3 supplies key statistics:
  - 44.5% sensitivity for anxiety detection in primary care meta-analysis (n=34,902).
  - Only 13.3% of primary care GAD patients present with anxiety as chief complaint; somatic (47.8%), pain (34.7%), sleep (32.5%) more common.
  - **Median time from anxiety-disorder onset to treatment: 23 years.**[ref:szuhany-jama-2022][ref:uspstf-anxiety-2023] Net-new Row 87. **Operational reframe:** PCP's job is to *determine* whether a diagnosable condition exists, not to assume one does. The "for nerves masks formal diagnosis" framing is clinically reasonable but inferential, not directly studied.

- **Claim 5 — SSRI/SNRI + therapy preferred over chronic benzo: Strongly supported.** Affects Row 26. Bundle 3 adds **three operational nuances:**
  - **Treatment-resistant exception:** ASAM/ACMT acknowledges long-term BZD may be indicated in severe treatment-resistant GAD; some guidelines allow indefinite continuation when first-line treatments have failed. Don't imply every patient can/should be transitioned. Net-new Row 92.[ref:asam-acmt-2025][ref:szuhany-jama-2022]
  - **SSRIs also fall risk in older adults** per AGS Beers 2025 companion. Doesn't negate first-line status but enters the risk-benefit assessment.[ref:steinman-jgs-2025]
  - **Benzo bridge during initial 2–4 weeks of SSRI/SNRI initiation** to manage jitteriness is a recognized adjunctive role.[ref:szuhany-jama-2022]

- **Claim 6 — Unassessed diagnosis as liability: Supported (medicolegal logic).** Affects Row 56. Bundle 3 adds the **operational alternative:** instead of either fabricating a diagnosis or no documentation, document (1) the inherited medication and history, (2) that a clinical assessment is planned, (3) the short-term continuation rationale ("continuing current regimen to avoid withdrawal pending full assessment"). This is the chart-defensibility middle path the module currently lacks.[ref:asam-acmt-2025][ref:szuhany-jama-2022][ref:steinman-jgs-2025]

- **Claim 7 — No-indication = chart liability: Supported, present as sequence not equal alternatives.** Affects Row 55 (the module's three-pathway algorithm). Bundle 3 reframes from parallel options to a **decision tree**: (1) clinical assessment first, (2) if indication identified → document + reassess risk-benefit, (3) if no indication → document plan to taper (with specialist consult for high-dose / long-duration / older adults / complex comorbidities).[ref:asam-acmt-2025][ref:robertson-aafp-2023][ref:asam-risk2024]

OE follow-up offered (queued): "the specific evidence and protocols for benzodiazepine tapering schedules in primary care, including the ACMT/ASAM 2024–2025 guideline recommendations for dose reduction rates and withdrawal monitoring." Already implicitly covered by Bundle 4; explicit operational protocols can be a Bundle 7 supplement.

---

## Bundle 4 — Tapering principles & physical dependence

```
- Physical dependence on benzodiazepines can develop within 4–6 weeks
  of daily use.
- Daily benzodiazepine use beyond 6 months represents established
  physical dependence in most patients, regardless of dose.
- Abrupt discontinuation of chronic benzodiazepines causes withdrawal
  seizure and death. This is a hard rule — abrupt discontinuation is
  never appropriate in physically dependent patients.
- A successful taper of a 10-year daily-benzodiazepine regimen
  realistically takes 1–2 years using a structured protocol, typically
  diazepam conversion with gradual reduction.
- Diazepam conversion (switching to a long-half-life benzodiazepine
  before reducing) is a recognized taper strategy supported by NICE
  guidance and the Ashton Manual / Heather Ashton's diazepam-equivalent
  framework.
- Diazepam conversion should be planned in coordination with psychiatry,
  not initiated unilaterally at a primary care handoff visit.
- For chronic benzodiazepine patients aged ≥65 with high-risk profile,
  tapering itself can carry real risk (withdrawal seizure, severe
  rebound anxiety) — and a documented decision NOT to taper, with
  reasoning, can be a defensible position.
- "Plant the seed" framing at the first visit ("My goal over time is
  the lowest dose that keeps you functional and safe — we're not changing
  anything today") is a reasonable documentation and trust-building
  pattern for chronic benzodiazepine handoffs.
```

**Bundle 4 findings:**

OE response received 2026-05-03 (raw at `verification/benzo1-4.md` lines 385–484). Bundle 4 **mostly confirms** the meta-pass + Bundle 2 framework around dependence and tapering, with **one major new finding** worth surfacing: the **Maust JAMA Open 2023 mortality study** (N>350,000) showing a small absolute mortality increase associated with benzodiazepine discontinuation — directly supports the "defensible decision NOT to taper in high-risk older adults" framing already in the module.

**Outright corrections / soften:**

- **Claim 4 — 10-year regimen → 1-2 year taper as the default:** Affects Row 29. Bundle 4 pushback: "1-2 years" sets an unnecessarily prolonged expectation. NEJM 2017 (Soyka): "if possible, prolonged reductions over a period of many months should be avoided in order to prevent the withdrawal treatment from becoming the patient's 'morbid focus'"; 4–8 weeks suitable for "most patients." Cochrane 2018 (Baandrup): "very slow tapering rates do not seem superior to faster tapering regimens." JAMA IM 2026 (Shuey): "some patients may tolerate shorter 8- to 10-week tapers, others may require slower tapers (months to years)." ASAM 2025 says "may take a year or more" for long-duration use.[ref:soyka-nejm-2017][ref:baandrup-cochrane-2018][ref:shuey-jamaim-2026][ref:asam-acmt-2025] **Reframe:** "tapers for long-duration use commonly take **months and may extend to a year or more**, individualized to patient tolerance. There is no evidence that very slow tapers produce better outcomes than moderately paced ones." Net-new Row 88.

- **Claim 5/6 — Diazepam conversion via NICE / Ashton:** Affects Rows 31, 32. Bundle 4 confirms Bundle 2: **BNF (not NICE)** recommends conversion; Ashton Manual is widely cited expert resource but not a guideline; evidence does not demonstrate superiority over tapering the original agent. Either approach acceptable; choice should be individualized. Bundle 4 sharpens the operational principle: **distinguish (a) initiating taper in a stable inherited patient (within PC scope, do not rush at first visit) from (b) diazepam conversion specifically (coordination prudent given dosing complexity)**. Strongest framing: **don't make medication changes at the handoff visit** regardless of agent.

- **Claim 8 — "Plant the seed" framing:** Affects Row 30. Strongly supported. Bundle 4 refinement: prefer **"lowest effective dose"** over "lowest dose" (avoids implying goal is always zero — for some patients a reduced but continued dose is the appropriate endpoint). Add to documentation: brief assessment of patient's current understanding of their benzo use, prior taper attempts, and openness to dose optimization. Creates baseline for future conversations.[ref:asam-acmt-2025][ref:robertson-aafp-2023][ref:shuey-jamaim-2026]

**Confirmations on already-resolved rows:**

- **Claim 1 — Dependence in 4-6 weeks: Oversimplified.** Already MP Flag 5 / Row 27 / Row 72. Bundle 4 confirms ASAM ≥3 months at ≥4 days/week threshold + alprazolam 2-4 week exception (already Row 83). Animal data (Rosenberg 1985) show receptor-level dependence within days — supplementary.[ref:rosenberg-nbr-1985]

- **Claim 2 — 6 months daily = dependence regardless of dose: Largely supported.** Affects Row 28. Bundle 4 nuance: **severity is dose-dependent.** DSM-5-TR notes ~40 mg diazepam equivalents daily are "more likely to produce clinically relevant withdrawal symptoms" — this is the apparent origin of the legacy 40 mg figure (severity threshold, not high-dose threshold). At 6 months daily, **assume dependence for clinical decision-making**, but tailor taper aggression to dose. Patient on 0.25 mg alprazolam daily is not equivalent to 2 mg TID.[ref:asam-acmt-2025][ref:dsm5tr][ref:soyka-nejm-2017] Update Row 28.

- **Claim 3 — Abrupt discontinuation causes seizure/death (hard rule): First sentence overstates; rule is correct.** Already MP Flag 1 / Row 1. Bundle 4 confirms with extra detail: **2 small RCTs comparing abrupt cessation to short tapers (7-8 days) found no difference in delirium or completion**, though taper group had less severe symptoms.[ref:asam-acmt-2025] **Inpatient narrow exception:** supervised settings with anticonvulsant coverage may use rapid discontinuation. **Outpatient framing remains:** "abrupt discontinuation in physically dependent patients risks life-threatening withdrawal including seizures and should not be done in the outpatient setting." Drop "causes" → "can cause" — Bundle 4 confirms what meta-pass Flag 1 already established.

- **Claim 7 — Documented decision NOT to taper in ≥65: Supported with KEY new evidence.** Affects Row 62. Bundle 4 surfaces the **Maust JAMA Open 2023** VA target-trial-emulation study (N>350,000): benzodiazepine discontinuation associated with **small absolute mortality increase (2.1–2.4 percentage points over 1 year)** plus increases in nonfatal overdose, suicidal ideation, and ED use — though confounded by inclusion of nonvoluntary tapering.[ref:maust-jamaopen-2023] This is **genuinely new evidence** supporting the "defensible decision not to taper" framing for high-risk older adults the module already espouses. **Documentation requirements:** (1) acknowledge Beers Criteria recommendation, (2) specific patient-level taper risks, (3) specific continuation risks, (4) shared decision-making discussion, (5) plan for periodic reassessment (annually). Not a permanent exemption. Net-new Row 85.

OE follow-up offered (queued): "specific documentation templates or taper protocols (e.g., ASAM-recommended flexible taper schedules with dose reduction percentages) that could be operationalized within this decision-support tool." Substantive operational addition; queue for module-rewrite phase as candidate new content (taper-protocol bubble or expanded faqs.benzos-duration FAQs).

---

## Bundle 5 — High-risk co-prescribing combinations

```
- The FDA black box warning on the benzodiazepine + opioid combination
  is unambiguous and applies to all benzodiazepines and all opioids.
- The benzodiazepine + opioid combination is the highest-risk combination
  in routine outpatient prescribing — overdose mortality risk is increased
  vs. either drug alone, regardless of individual tolerance or duration
  of stable co-prescription.
- Naloxone should be prescribed and household-administered, with
  counseling, for any patient on concurrent benzodiazepine + opioid
  prescriptions.
- The Z-drugs (zolpidem, eszopiclone, zaleplon) act on the same GABA-A
  receptor complex as benzodiazepines and produce additive CNS depression;
  the combination is explicitly flagged in AGS Beers Criteria and FDA
  labeling.
- Eliminating a Z-drug is generally lower-risk than addressing the
  benzodiazepine first when both are present in an inherited patient.
- Gabapentin and pregabalin have sedating and respiratory-depressant
  properties that are potentiated by benzodiazepines; the FDA added a
  warning on this combination in 2019, particularly for patients with
  underlying respiratory disease or concurrent opioid use.
- The combination of benzodiazepine + gabapentin + opioid represents the
  highest co-prescribing risk tier regardless of individual doses.
- Concurrent benzodiazepine and muscle relaxant prescribing
  (cyclobenzaprine, methocarbamol, carisoprodol) represents a CNS
  depressant polypharmacy burden requiring coordination.
- Carisoprodol (Soma) is metabolized to meprobamate, a barbiturate-like
  compound with significant abuse potential, making it the highest-risk
  member of the muscle-relaxant class for benzodiazepine co-prescription.
```

**Bundle 5 findings:**

OE response received 2026-05-03 (raw at `verification/benzo5-8.md` lines 1–102). Bundle 5 produces **two language softens** on superlative claims (Claims 2 and 7), **one timing-precision correction** on the gabapentinoid label history (Claim 6), **one pharmacology nuance** on meprobamate / carisoprodol (Claim 9), and **five net-new operational data points** (Rows 92–96). Most of the high-stakes claims in this bundle were already resolved through MP / Bundle 1 work — Bundle 5 reinforces the existing reframings and supplies quantitative anchors and additional citations rather than reversing direction.

**Substantive corrections / softens:**

**Claim 2 — "Highest-risk combination… regardless of individual tolerance or duration of stable co-prescription" — OVERSTATED.** Verdict: Two superlatives unsupported. (a) "Regardless of individual tolerance or duration" contradicts the CDC 2022 Opioid Workgroup expert opinion that **"long-term, stable use might be safer than erratic, unpredictable use"** and that benzodiazepines may serve partly as a marker of risk rather than direct cause. Alobaidi 2021 nested case-control: overlap in the prior 0–30 days OR 13.2 vs OR 3.2 for 61–90 days prior — **risk is recency-dependent**, not constant.[ref:alobaidi-pharmacotherapy-2021] (b) "Highest-risk combination" is unsupported as a comparative ranking. Cho JGIM 2020 found the **triple combination opioid + benzo + Z-drug carries a 60% higher overdose risk than opioid + benzo alone**[ref:cho-jgim-2020]; Sharma BMJ Open 2020 confirms the case-crossover association.[ref:sharma-bmjopen-2020] No guideline assigns a formal "highest" tier across all outpatient drug combinations. **Operational reframe:** "Concurrent benzodiazepine + opioid is among the highest-risk prescription drug combinations, with up to a 4-fold increase in overdose death. Risk is modulated by duration and stability of co-prescription; the 2022 CDC guideline acknowledges that long-term stable use may carry lower risk than new or erratic co-prescription."[ref:cdc-opioid-2022][ref:alobaidi-pharmacotherapy-2021][ref:cho-jgim-2020] Affects tracker rows 5 + 41 (B5 is the resolution bundle for both); reinforces Row 13 / Row 38 framing already established by MP and Bundle 1.

**Claim 7 — "Benzo + gabapentin + opioid is highest risk tier regardless of individual doses" — OVERSTATED.** Verdict: Triple CNS depressant therapy is high-risk, but **"regardless of individual doses" is not supported.** Risk is dose-dependent for each component — higher gabapentinoid doses are associated with greater overdose risk when combined with opioids; opioid dose is a well-established independent risk modifier (CDC 2022 dose framework).[ref:cdc-opioid-2022][ref:sharma-bmjopen-2020] No guideline assigns a formal "highest tier" to this specific triple combination independent of dosing. **Operational reframe:** "The combination of benzodiazepine + gabapentinoid + opioid represents very high co-prescribing risk, but risk is dose-dependent for each component. Use lowest effective doses and consider whether benefits outweigh risks for any concurrent CNS depressant use." Affects tracker row 50 (B5 is the resolution bundle).

**Claim 6 — Gabapentinoid + benzo timing — minor factual correction.** Verdict: Substantively correct but timing imprecise. **The FDA strengthened gabapentin and pregabalin labels in 2018** regarding CNS side effects and respiratory-depression risk when combined with other centrally acting drugs; the broader **December 2019 safety communication** specifically highlighted CNS-depressant co-use including opioids.[ref:shrestha-f1000-2020][ref:williams-drugs-2023][ref:fda-pregabalin-2025] Module text should reference both: 2018 label strengthening + 2019 safety communication. The benzo + gabapentinoid pair is captured by the pregabalin label's general CNS-depressant warning (already Row 75) rather than a benzo-specific FDA action. Affects Row 49 (already resolved via MP Flag 9; Bundle 5 supplies the dating precision).

**Claim 9 — Carisoprodol → meprobamate → "barbiturate" — pharmacology nuance.** Verdict: Substantively correct on abuse-potential conclusion; precise pharmacology should read **"propanediol dicarbamate with barbiturate-like activity at GABA-A receptors,"** not "carbamate" alone or "barbiturate."[ref:kumar-ejp-2016][ref:rho-jpet-1997] Additionally, **carisoprodol itself has direct barbiturate-like GABAergic activity independent of metabolism to meprobamate**[ref:gonzalez-jpet-2009][ref:carbonaro-neuropharm-2020] — the parent drug + active metabolite combination is the basis for the abuse-potential claim. Carisoprodol's Schedule IV status, dual GABAergic mechanism, and abuse history make it the highest-risk muscle relaxant for benzo co-prescription — features not shared by cyclobenzaprine or methocarbamol.[ref:reeves-smj-2012][ref:fda-carisoprodol-2025] Affects Row 54 (already resolved via MP Flag 10; Bundle 5 supplies the propanediol-dicarbamate specificity and parent-drug-pharmacology nuance).

**Confirmations (already-resolved or net-new-supportive rows):**

- Claim 1 — FDA boxed warning is class-wide on benzos + opioids: **Verified with the OUD-OAT carve-out** (already Row 38 / Row 73 from MP Flag 7). Bundle 5 supplies the precise framing — FDA explicitly clarified buprenorphine and methadone for OUD should not be withheld; CDC 2022 downgraded to Category B.[ref:cdc-opioid-2022][ref:asam-acmt-2025] No new row needed; Row 73 already captures the carve-out.
- Claim 3 — Naloxone for any benzo+opioid combo: **Verified** with strong consensus support. ASAM/ACMT 2024/2025 makes a **strong consensus recommendation** to "offer to provide or prescribe opioid overdose reversal medication (e.g., naloxone) for all patients co-prescribed BZDs and opioids."[ref:asam-acmt-2025] CDC 2016 similar; NEJM Babu 2019 review documents **63% reduction in ED visits** with naloxone co-prescribing + household education in long-term opioid users.[ref:cdc-opioid-2016][ref:babu-nejm-2019] Resolves Row 39 (was pending Bundle 7; B5 closes it). Net-new Row 94 captures the 63%-ED-reduction stat.
- Claim 4 — Z-drugs and benzos share GABA-A target / produce additive CNS depression: **Verified with the AGS-Beers nuance.** Z-drugs are allosteric modulators of the same GABA-A binding site; some (zolpidem) have α1-subtype selectivity.[ref:morin-nejm-2024] AGS Beers Criteria recommends avoiding **each class independently** in older adults, but does **not** flag the benzo + Z-drug pair as a specific drug-drug interaction the way it flags opioid + benzo or opioid + gabapentinoid.[ref:ags-beers-2023-jgs][ref:beers-2019] FDA Z-drug labeling warns against concurrent CNS depressants generally; no specific boxed warning for the benzo + Z-drug pair. Resolves Row 51. Updates Row 52 framing (still pending Bundle 6 confirmation, but B5 supplies the direction).
- Claim 5 — Eliminating Z-drug before tapering benzo is generally lower-risk: **Verified as reasonable clinical logic without direct evidence.** No guideline or head-to-head study compares risk of discontinuing Z-drug vs benzo when both are present. Pharmacologic plausibility: Z-drugs typically have shorter half-lives and milder withdrawal profiles than long-term benzos; benzo discontinuation carries seizure risk after prolonged use.[ref:morin-nejm-2024][ref:silberman-drugs-2025][ref:vadod-pain-2022] **However**, Z-drugs can still produce tolerance, rebound insomnia, and withdrawal in **20–50% of patients with repeated nightly use**, and parasomnias may be more prominent with Z-drugs.[ref:morin-nejm-2024][ref:toyoshima-ijms-2021] **Operational reframe:** "Discontinuing a Z-drug before tapering a benzodiazepine is a reasonable clinical approach based on the generally milder withdrawal profile of Z-drugs, but this sequencing has not been directly studied. Both classes can produce dependence and withdrawal — decision should be individualized." Resolves Row 53; net-new Row 95 captures the 20–50% Z-drug withdrawal stat.
- Claim 8 — Benzo + muscle relaxant CNS-depressant burden: **Verified.** CDC 2022 explicitly identifies muscle relaxants as CNS depressants potentiating respiratory depression with opioids and other CNS depressants.[ref:cdc-opioid-2022] NEJM Babu 2019: overdose risk increases dramatically with muscle-relaxant + opioid + sedating-medication combinations.[ref:babu-nejm-2019] Carisoprodol FDA label warns of additive sedation with benzodiazepines.[ref:fda-carisoprodol-2025] Resolves Row 7 (was pending Bundle 5).

**Net-new operational content surfaced by Bundle 5 (added to tracker as Rows 92–96):**

1. **Alobaidi 2021 nested case-control — recency-dependent overdose risk.** Concurrent benzo+opioid overlap in the prior 0–30 days OR 13.2 vs OR 3.2 for 61–90 days. Operationally: "an inherited patient on stable, long-duration benzo+opioid is in a different risk stratum than a patient newly co-prescribed both."[ref:alobaidi-pharmacotherapy-2021] (Row 92)
2. **Cho JGIM 2020 — triple combination magnitude.** Opioid + benzo + Z-drug carries **60% higher overdose risk** than opioid + benzo alone.[ref:cho-jgim-2020] Concrete anchor for de-escalating the Z-drug first when triple-prescribed (pairs with Row 53 / Row 95). (Row 93)
3. **Babu NEJM 2019 — naloxone + household education reduced ED visits 63%** in long-term opioid users.[ref:babu-nejm-2019] Strongest single-stat justification for naloxone co-prescribing in benzo+opioid patients (pairs with Row 39). (Row 94)
4. **Z-drug tolerance / withdrawal in 20–50%** of patients with repeated nightly use; parasomnias may be more prominent.[ref:morin-nejm-2024][ref:toyoshima-ijms-2021] Counterweight to the implicit assumption that Z-drug discontinuation is risk-free. (Row 95)
5. **Carisoprodol parent drug has direct GABAergic activity independent of meprobamate metabolism.**[ref:gonzalez-jpet-2009][ref:carbonaro-neuropharm-2020] Reinforces the dual-mechanism abuse-potential framing already partially captured by Row 54. (Row 96)

**Prompt iteration:** Bundle 5 returned sharp, well-cited pushback consistent with Bundles 1–4. **Prompt v1 stays.** No iteration needed.

OE follow-up offered (deferred): "specific taper protocols and sequencing strategies for deprescribing in patients on multi-class CNS depressant polypharmacy" — relevant to Bundle 7 (inherited-patient first-visit standard of care) and Bundle 8 (functional / dose-escalation). Hold for Bundle 7 processing.

---

## Bundle 6 — Older adults & cognitive impact

```
- The American Geriatrics Society Beers Criteria explicitly lists all
  benzodiazepines as potentially inappropriate medications (PIM) in
  adults aged ≥65 regardless of indication.
- Benzodiazepine use in older adults increases risk of falls and hip
  fractures via impaired balance, reaction time, and depth perception.
- Many benzodiazepines have prolonged half-lives in older adults due to
  reduced hepatic metabolism, which compounds risk over time.
- Paradoxical agitation is a recognized adverse effect of benzodiazepines
  in some older patients.
- Chronic benzodiazepine use is associated with accelerated cognitive
  decline and a possible increased risk of incident dementia, though the
  causality question remains contested in the literature.
- For a patient with mild cognitive impairment on chronic benzodiazepine
  therapy, the benzodiazepine should be considered a modifiable risk
  factor and addressed in the cognitive workup and management plan.
- For an older patient on a long-standing benzodiazepine regimen who is
  clearly not a taper candidate (advanced age, functional dependence,
  taper-failure history), explicit documentation of the risk-benefit
  reasoning supporting continuation is a defensible primary care
  position.
```

**Bundle 6 findings:**

_(paste OE response here)_

---

## Bundle 7 — Inherited-patient first-visit standard of care

```
- The standard of care at a primary care handoff visit for a patient on
  chronic benzodiazepine therapy is NOT to taper at this visit. The
  first visit is for assessment, documentation, trust-building, and
  pathway determination.
- "Foundation visit" framing — explicitly distinct from a "taper visit"
  — is a defensible primary care documentation pattern for the
  inherited benzodiazepine handoff.
- E-consult to psychiatry is the appropriate escalation pathway for:
  (a) dose above diazepam 40 mg/day equivalent, (b) no documentable
  indication, (c) co-prescription with opioids or other CNS depressants
  requiring coordinated taper planning, (d) patient requesting dose
  escalation.
- Continuing to prescribe at the existing dose for one month while
  awaiting an e-consult response is appropriate and not a regulatory or
  liability concern when the framework is being actively worked.
- Naloxone prescribing with patient + household counseling is standard
  of care for any inherited benzodiazepine patient with concurrent
  opioid prescription, regardless of stability or duration of the prior
  regimen.
- For an inherited benzodiazepine + opioid patient, the PCP owns
  coordination of care but does not necessarily own execution of both
  tapers; the higher-risk agent (typically the benzodiazepine, given
  withdrawal seizure risk) should be addressed with specialist
  guidance.
- Is there a recognized standard-of-care framework (from APA, AAFP,
  ASAM, or state licensing boards) for primary care providers inheriting
  established adult patients on chronic benzodiazepine therapy?
```

**Bundle 7 findings:**

_(paste OE response here)_

---

## Bundle 8 — Functional assessment, driving, and dose-escalation requests

```
- Benzodiazepines impair driving in a well-established, dose-dependent
  fashion; chronic users have measurable impairment beyond what tolerance
  alone resolves.
- Primary care physicians have a clinical obligation to counsel patients
  on chronic benzodiazepine therapy about impaired driving risk and to
  document the counseling.
- New York State does NOT have a mandatory physician reporting
  obligation for medication-impaired drivers comparable to seizure-
  disorder reporting.
- Patients in safety-sensitive occupations (commercial drivers, pilots,
  healthcare workers, heavy machinery operators) on chronic benzodiazepine
  therapy require explicit conversation about disclosure and occupational
  fitness, and explicit documentation of that conversation.
- Tolerance to the anxiolytic effect of benzodiazepines develops with
  chronic use; this is expected pharmacology, not treatment failure.
- The appropriate clinical response to "the medication stopped working"
  in a chronic benzodiazepine patient is NOT to increase the dose; it is
  to introduce SSRIs, SNRIs, buspirone, or therapy as the long-term
  direction and to escalate to psychiatry for transition planning.
- In primary care, dose escalation of an established benzodiazepine
  regimen for chronic anxiety is almost never the appropriate
  intervention and should not occur without psychiatry input. Narrow
  exceptions (acute situational, time-limited) exist.
- A patient who leaves the practice over a refusal to escalate a
  benzodiazepine dose is exiting a framework designed to protect them;
  refusing to escalate is a clinical decision that does not warrant
  apology in patient communication.
```

**Bundle 8 findings:**

_(paste OE response here)_

---

## Claim-level tracker

One row per verifiable claim. `FAQ location` uses `faqs.<faq_id>.q<n>` where `<n>` is the 1-indexed position of the question within `items[]` in the benzo module under `clinical-modules.json`. `ref_id` is the short id used in the `references[]` array and `[ref:X]` markers in the prose. Verdicts are populated as bundle responses come in.

**Verdict values:** `Verified` / `Verified with nuance` / `Needs revision` / `Disproved` / `No evidence found` / `—` (pending)
**Action values:** `No change` / `Soften language` / `Add [ref:X] marker` / `Rewrite per OE` / `Add new content` / `Remove claim`

| #  | Claim                                                                                                                                          | FAQ location              | OE verdict | ref_id | Action / Source                  |
|----|-----------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|------------|--------|----------------------------------|
| 1  | Abrupt discontinuation of chronic benzodiazepines causes withdrawal seizure and death; abrupt discontinuation is never the first move          | landing_intro             | Verified with nuance | fda-ativan-2025, aafp-robertson-2023, asam-acmt-2025 | Soften language — death is rare and usually polysubstance-related; risk depends on dose/duration/agent; some short-term/low-dose patients can DC without taper (MP Flag 1) |
| 2  | First-visit goal is assess + document + establish trust + determine pathway, not taper                                                         | landing_intro             | —          | —      | _Bundle 7 pending_               |
| 3  | PDMP review verifies single prescriber, single pharmacy, consistent quantities for chronic benzo patient (and "no concurrent opiates" auto-DQ) | checklist.benzos-pdmp     | Verified with nuance | cdc-opioid-2022, ny-pbh-3343a, nj-njsa-45-1-46-1 | Soften language — concurrent opioid is not auto-DQ per CDC 2022 (downgraded to Category B); requires documented risk mitigation, not absolute exclusion (MP Flag 2). PDMP frequency anchored by NY I-STOP (per-prescription for II/III/IV) and NJ PMP (initial + quarterly for benzo III/IV) — see `verification/controlled-substances-ny-nj.md` Snippets A and B |
| 4  | Documented indication (anxiety, panic, seizure, alcohol withdrawal) is required at chart level                                                 | checklist.benzos-indication | —        | —      | _Bundle 3 pending_               |
| 5  | Concurrent opiate prescription is highest-priority safety flag at the inherited benzo visit                                                    | escalation.benzos-combo-opiate | Verified with nuance | cdc-opioid-2022, asam-acmt-2025, vadod-pain-2022, sharp-mmwr-2015, alobaidi-pharmacotherapy-2021 | Add `[ref:X]` markers + soften "highest-priority" superlative — substantively correct as the highest-priority outpatient co-prescribing flag, but should reflect (a) Category B downgrade in CDC 2022, (b) OUD-OAT carve-out (Row 73), (c) recency-dependent risk per Alobaidi 2021 (Row 92), (d) NY 70.7%-mortality and VA/DoD "harms outweigh benefits" anchors already in Rows 78–79 (B5 Claim 2) |
| 6  | Dose above diazepam 40 mg/day equivalent without psychiatric specialist involvement → escalate                                                  | escalation.benzos-highdose | **Needs revision** | asam-acmt-2025, dsm5tr | Rewrite per OE — 2025 ASAM/ACMT defines high dose as **>15 mg diazepam equivalents** (>2 mg alprazolam, >3 mg lorazepam, >1.5 mg clonazepam). 40 mg threshold is substantially more permissive than current consensus. Optional secondary tier at ≥40 mg per DSM-5-TR (clinically significant withdrawal seizure / delirium risk). See also Row 71 (MP Flag 3) |
| 7  | Concurrent CNS depressants (sedating antihistamines, muscle relaxants, gabapentin, Z-drugs) → escalate                                         | escalation.benzos-combo-other | Verified | cdc-opioid-2022, babu-nejm-2019, fda-pregabalin-2025, fda-carisoprodol-2025, ags-beers-2023-jgs | Add `[ref:X]` markers — claim well-supported. CDC 2022 explicitly identifies muscle relaxants, gabapentinoids as CNS depressants; AGS Beers 2023 ≥3-CNS-active rule (Row 80) anchors the polypharmacy framing; carisoprodol FDA label warns of additive sedation with benzos (B5 Claim 8) |
| 8  | No documentable indication → escalate                                                                                                          | escalation.benzos-no-indication | —    | —      | _Bundle 3 pending_               |
| 9  | Age ≥ 65 (Beers Criteria) → escalate                                                                                                            | escalation.benzos-cognitive | —        | —      | _Bundle 6 pending_               |
| 10 | Patient requesting dose increase / early refill / "stopped working" → escalate                                                                  | escalation.benzos-escalation | —       | —      | _Bundle 8 pending_               |
| 11 | Long-term goal is the lowest effective dose                                                                                                    | green_zone.narrative_html | —          | —      | _Bundle 7 pending_               |
| 12 | Foundation-visit framing — first visit is not a taper conversation                                                                              | green_zone.narrative_html | —          | —      | _Bundle 7 pending_               |
| 13 | Concurrent opiates are the most dangerous combination in outpatient prescribing                                                                | faqs.benzos-pdmp.q1       | Verified with nuance | cdc-opioid-2022, sharp-mmwr-2015, vadod-pain-2022, fda-ativan-2025 | Add new content — substantively correct; pair with MP Flag 7 corrections (boxed-warning + Category-B nuance + buprenorphine/methadone-OUD carve-out). Bundle 1 adds quantitative anchors: case-cohort near-quadrupling of overdose-death risk; NYS 2012 data 70.7% of opioid deaths involved benzo; VA/DoD 2022 says "harms outweigh the benefits" — stronger than CDC. Cross-reference Row 38 (B1 Claim 6) |
| 14 | Z-drug co-prescription with benzodiazepine doubles CNS depression risk                                                                         | faqs.benzos-pdmp.q1       | **Needs revision** | ags-choosingwisely-2013, arnold-aafp-2024, matheson-aafp-2024 | Rewrite per OE — the "doubles" figure refers to AGS data on **falls and hip fractures** with either drug class alone vs no use, NOT additive CNS depression risk of combining them. Module conflates two metrics. Also "defined PDMP red flag" overstates — Z-drugs are Schedule IV and visible on PDMP but no universal red-flag category exists. **Replacement framing:** additive CNS depression via shared GABA-A receptor mechanism; visible on PDMP; AGS 2023 Beers Criteria flag ≥3 CNS-active concurrent medications as PIM in older adults (B1 Claim 7). Pairs with new Row 80 |
| 15 | Recent ER visits for benzo withdrawal/toxicity may appear in shared records but not the PDMP itself                                            | faqs.benzos-pdmp.q1       | Verified | haines-ijdp-2022, greenwood-ericksen-aem-2016, elder-wjem-2018, asam-acmt-2025 | No change to module text — claim is correct. PDMPs track prescribing/dispensing only; HIE/Care Everywhere is the right complementary review. Add `[ref:X]` markers in prose (B1 Claim 5) |
| 16 | Benzodiazepines should have a single prescriber                                                                                                | faqs.benzos-pdmp.q2       | —          | —      | _Bundle 1 pending_               |
| 17 | Two providers co-prescribing same controlled substance class without coordination is liability for both                                        | faqs.benzos-pdmp.q2       | Verified with nuance | cfr-1306-04 | Soften language — there is no specific federal statute prohibiting dual prescribers; "liability for both" is malpractice / standard-of-care convention informed by 21 CFR §1306.04 ("legitimate medical purpose…in the usual course of his professional practice" + knowingly-filling-invalid-prescription liability for the dispenser). Clinical action (single prescriber) is sound; regulatory framing should reflect convention, not statute. See `verification/controlled-substances-ny-nj.md` Snippet G |
| 18 | NY State requires PDMP review prior to every Schedule IV controlled substance prescription                                                     | faqs.benzos-pdmp.q3       | **Verified** | ny-pbh-3343a | Resolved via `verification/controlled-substances-ny-nj.md` (R4). NY PBH §3343-a duty applies to Schedule II/III/IV (NOT V) prior to every prescribing event. Add exceptions parenthetical (vet, on-premises institutional, ED ≤5-day supply, hospice, technical waivers) per OE Flag 13. Module text should also distinguish NJ pattern (initial + quarterly, not per-prescription — see `controlled-substances-ny-nj.md` Snippet B) if NJ providers are in scope |
| 19 | Benzodiazepines are Schedule IV controlled substances                                                                                          | faqs.benzos-pdmp.q3       | Verified | usc-21-812 | Federal CSA §812(c) Schedule IV; adopted under NJ NJSA 24:21 and reflected in NY PBH Article 33 §3306. Resolved via `verification/controlled-substances-ny-nj.md` (R1) |
| 20 | No documented indication does not by itself require stopping; PCP can establish indication going forward                                        | faqs.benzos-indication.q1 | —          | —      | _Bundle 3 pending_               |
| 21 | If no indication can be established, e-consult psychiatry — not stop today                                                                      | faqs.benzos-indication.q1 | —          | —      | _Bundle 7 pending_               |
| 22 | Benzodiazepines are not indicated for chronic insomnia management long-term                                                                    | faqs.benzos-indication.q2 | **Needs revision** | aafp-matheson-2024, acp-qaseem-2016, vadod-insomnia-2019, asam-acmt-2025, lancet-decrescenzo-2022 | Rewrite per OE — 5 benzos ARE FDA-approved for insomnia (temazepam, triazolam, quazepam, flurazepam, estazolam; see Row 70). Distinguish "FDA approval exists" from "guidelines uniformly recommend against long-term use." Cite VA/DoD 2019 specifically (MP Flag 6) |
| 23 | CBT-I is evidence-based first-line for chronic insomnia                                                                                        | faqs.benzos-indication.q2 | Verified | acp-qaseem-2016, morin-nejm-2024, steinman-jgs-2025 | Add `[ref:X]` markers — claim is well-supported. Net-new Row 91 adds digital CBT-I (VA Insomnia Coach, SleepEZ) as access workaround. "Parallel with taper" framing is sound clinical practice but not a specific guideline mandate — present as "recommended concurrent approach" (B3 Claim 2) |
| 24 | Anxiety disorders are among the most underdiagnosed conditions in primary care                                                                 | faqs.benzos-indication.q3 | Verified with nuance | szuhany-jama-2022, uspstf-anxiety-2023 | Add `[ref:X]` markers + reframe second half — first half strongly supported (44.5% sensitivity, 13.3% chief-complaint rate, 23-yr median delay). Second half ("for nerves" masks formal dx) is reasonable but inferential. **Operational reframe:** PCP's job is to determine whether a diagnosable condition exists, not to assume one does (B3 Claim 4). Net-new Row 87 captures the 23-year delay stat |
| 25 | GAD-7 takes 4 minutes and provides documented baseline                                                                                         | faqs.benzos-indication.q3 | Verified with nuance | uspstf-anxiety-2023, oconnor-jama-2023, akturk-cochrane-2025, szuhany-jama-2022 | Add new caveats — (a) designed for **GAD specifically**; sensitivity for panic / social anxiety lower; (b) positive screen ≠ diagnosis; follow-up assessment required; (c) **USPSTF 2023 recommends screening adults ≤64 only**; insufficient evidence for ≥65 due to higher false-positive rates — operationally important since most inherited benzo patients are older. See Row 86 (B3 Claim 3) |
| 26 | SSRI/SNRI + therapy is more appropriate long-term than chronic benzo for documented anxiety                                                     | faqs.benzos-indication.q3 | Verified | szuhany-jama-2022, degeorge-aafp-2022, steinman-jgs-2025, asam-acmt-2025 | Add nuances — (a) **treatment-resistant exception:** ASAM/ACMT acknowledges long-term BZD may be indicated in severe treatment-resistant GAD; don't imply every patient can/should be transitioned (Row 92); (b) SSRIs also carry fall risk in older adults per AGS Beers companion; (c) benzo bridge during initial 2-4 weeks of SSRI/SNRI initiation is recognized adjunctive role (B3 Claim 5) |
| 27 | Physical dependence develops within 4–6 weeks of daily benzodiazepine use                                                                      | faqs.benzos-duration.q1   | **Needs revision** | asam-acmt-2025, fda-ativan-2025, dsm5tr | Rewrite per OE — 2025 ASAM/ACMT framework: clinically significant withdrawal risk at ≥3 months use ≥4 days/week, with alprazolam as 2–4-week daily exception. See also Row 72 (DSM-5-TR threshold). Avoid blanket 4–6 week cutoff (MP Flag 5) |
| 28 | Daily use > 6 months represents established dependence regardless of dose                                                                      | faqs.benzos-duration.q1   | Verified with nuance | asam-acmt-2025, dsm5tr, soyka-nejm-2017 | Soften "regardless of dose" — at 6 months daily, **assume dependence** for clinical decision-making, but tailor taper aggression to dose. **Severity is dose-dependent.** DSM-5-TR notes ~40 mg diazepam equivalents daily are "more likely to produce clinically relevant withdrawal" — this appears to be the origin of the legacy 40 mg figure (severity threshold, not high-dose threshold). Patient on 0.25 mg alprazolam daily ≠ 2 mg TID (B4 Claim 2) |
| 29 | 10-year daily benzo regimen → successful taper realistically 1–2 years via diazepam-conversion protocol                                        | faqs.benzos-duration.q2   | **Needs revision** | asam-acmt-2025, soyka-nejm-2017, baandrup-cochrane-2018, shuey-jamaim-2026 | Rewrite per OE — "1-2 years" sets unnecessarily prolonged expectations. **Soyka NEJM:** "if possible, prolonged reductions over a period of many months should be avoided in order to prevent withdrawal treatment from becoming the patient's morbid focus"; 4–8 weeks suitable for "most patients." **Cochrane 2018:** very slow tapers not superior to moderately paced. **JAMA IM 2026:** "8-10 week tapers" tolerated by some, "months to years" for others. **Reframe:** "tapers for long-duration use commonly take **months and may extend to a year or more**, individualized to patient tolerance. No evidence that very slow tapers produce better outcomes." Also: diazepam conversion is not the default — see Row 31 (B4 Claim 4). Net-new Row 88 |
| 30 | Plant-the-seed framing ("lowest dose that keeps you functional and safe") is appropriate first-visit documentation pattern                     | faqs.benzos-duration.q2   | Verified | asam-acmt-2025, robertson-aafp-2023, shuey-jamaim-2026 | Soften wording — change **"lowest dose" → "lowest effective dose"** (avoids implying goal is always zero — for some patients a reduced but continued dose is the appropriate endpoint). Add to documentation: brief assessment of patient's current understanding of their benzo use, prior taper attempts, openness to dose optimization. Creates baseline for future conversations (B4 Claim 8) |
| 31 | Diazepam conversion's advantage is long half-life enabling smoother reduction with less interdose withdrawal                                   | faqs.benzos-duration.q3   | Verified with nuance | asam-acmt-2025, vadod-sud-2021, soyka-nejm-2017, shuey-jamaim-2026, robertson-aafp-2023 | Soften — recognized strategy but **evidence base is limited**. VA/DoD 2021: switching "may not improve outcomes." Soyka NEJM: "not associated with a better outcome." JAMA IM 2026: "evidence of benefit is limited." Canadian guidelines recommend continuing same benzo. Diazepam itself contraindicated in hepatic impairment / older adults (active metabolites + reduced clearance). **Either approach acceptable — choice should be individualized** (B2 Claim 5 + B4 Claim 5). Note: BNF (not NICE directly) recommends conversion |
| 32 | Diazepam conversion should be planned with psychiatry e-consult, not initiated unilaterally at handoff                                          | faqs.benzos-duration.q3   | Verified with nuance | asam-acmt-2025 | Soften — reasonable clinical advice, **not a guideline mandate**. ASAM recommends specialist consult for complex cases (treatment-resistant anxiety, seizure disorders, concurrent SUD), but no blanket rule. **Stronger operational point:** don't make medication changes at the handoff visit regardless of agent. Distinguish (a) initiating taper in stable patient (within PC scope) from (b) diazepam conversion specifically (coordination prudent given dosing complexity) (B2 Claim 6 + B4 Claim 6) |
| 33 | Functional benefit vs harm is the assessment lens (employment, driving, relationships, falls, memory)                                          | faqs.benzos-function.q1   | —          | —      | _Bundle 8 pending_               |
| 34 | Benzodiazepines impair driving in a well-established, dose-dependent fashion                                                                   | faqs.benzos-function.q2   | —          | —      | _Bundle 8 pending_               |
| 35 | NY does NOT have mandatory medication-impaired driver reporting comparable to seizure reporting                                                | faqs.benzos-function.q2   | —          | —      | _Bundle 8 pending_               |
| 36 | Safety-sensitive occupations require explicit conversation + documentation                                                                     | faqs.benzos-function.q2   | —          | —      | _Bundle 8 pending_               |
| 37 | Therapeutic benefit vs dependence maintenance is the clinical/ethical core question                                                            | faqs.benzos-function.q3   | —          | —      | _Bundle 7 pending_               |
| 38 | FDA black box warning on benzo+opioid combination is unambiguous                                                                               | faqs.benzos-combo-opiate.q1 | **Needs revision** | fda-ativan-2025, asam-acmt-2025, cdc-opioid-2022 | Rewrite per OE — (a) FDA terminology: "boxed warning" not "black box"; (b) warning does not prohibit all co-prescribing — calls for lowest doses + minimum durations; (c) CDC 2022 downgraded recommendation to Category B; (d) FDA explicitly clarified buprenorphine/methadone for OUD should NOT be withheld for benzo use (see Row 73) (MP Flag 7) |
| 39 | Naloxone should be prescribed and household-counseled for any benzo+opioid combo                                                                | faqs.benzos-combo-opiate.q1 | **Verified** | asam-acmt-2025, cdc-opioid-2016, babu-nejm-2019 | Add `[ref:X]` markers — strong consensus support. ASAM/ACMT 2024/2025 makes a **strong consensus recommendation** to offer/prescribe naloxone for all patients co-prescribed BZDs and opioids. NEJM Babu 2019: naloxone + household education reduced ED visits **63%** in long-term opioid users (B5 Claim 3). Pairs with new Row 94 |
| 40 | Initiate urgent e-consults: psychiatry for benzo, pain mgmt for opiate, or combined consult                                                    | faqs.benzos-combo-opiate.q1 | —        | —      | _Bundle 7 pending_               |
| 41 | Years without adverse events on benzo+opioid does not establish individual safety; risk increases with duration                                | faqs.benzos-combo-opiate.q2 | **Needs revision** | cdc-opioid-2022, alobaidi-pharmacotherapy-2021, asam-acmt-2025 | Rewrite per OE — module's "risk increases with duration" framing is **contradicted** by CDC 2022 Opioid Workgroup expert opinion ("long-term, stable use might be safer than erratic, unpredictable use") and Alobaidi 2021 (overlap in prior 0–30 days OR 13.2 vs OR 3.2 for 61–90 days prior). **Risk is recency-dependent, not duration-monotonic.** Reframe: stable long-duration co-prescription is in a different risk stratum than new/erratic concurrent use; the absence of past adverse events does not eliminate risk but does inform the risk stratification. Pair with Row 92 (B5 Claim 2) |
| 42 | Taper of patient on both opioid+benzo requires coordination; PCP owns care coordination not necessarily execution                              | faqs.benzos-combo-opiate.q3 | —        | —      | _Bundle 7 pending_               |
| 43 | Higher-risk agent (usually benzo for seizure risk) addressed with specialist guidance                                                          | faqs.benzos-combo-opiate.q3 | **Disproved** | cdc-opioid-2016, cdc-opioid-2022, asam-acmt-2025 | Rewrite per OE — CDC 2016 explicitly suggests **opioids may be safer to taper FIRST** ("safer and more practical to taper opioids first"); CDC 2022 does not reverse. ASAM/ACMT 2025 recommends shared decision-making, no universal sequence. **Highest-impact correction in meta-pass.** Module's "usually the benzo" framing destabilizes pain mgmt while leaving respiratory risk in place (MP Flag 8) |
| 44 | Diazepam-equivalent conversion table: alprazolam 0.5 mg ≈ diazepam 5 mg; lorazepam 1 mg ≈ diazepam 10 mg; clonazepam 0.5 mg ≈ diazepam 10 mg; temazepam 10 mg ≈ diazepam 10 mg | faqs.benzos-highdose.q1 | **Needs revision (factual error)** | asam-acmt-2025, vadod-sud-2021, ashton-drugs-1994 | Rewrite per OE — **TEMAZEPAM EQUIVALENCY IS WRONG.** Per Ashton Manual / VA-DoD SUD 2021 / ASAM 2025 Appendix H: **temazepam 20 mg ≈ diazepam 10 mg** (NOT temazepam 10 mg). Module is off by a factor of two on this row. Other equivalencies (alprazolam 0.5 mg ≈ 5 mg, lorazepam 1 mg ≈ 10 mg, clonazepam 0.5 mg ≈ 10 mg) verified correct. Add new content: **caveat at top** ("These equivalencies are approximate and based on clinical consensus, not pharmacokinetic precision. Individual patient responses vary."). Re-anchor worked examples to 15 mg threshold per Row 6 / Row 71. **Candidate for promotion to HTML `<table>` (asset T1).** Net-new Row 81 (B2 Claim 2 + MP Flag 4) |
| 45 | Alprazolam 2 mg TID = 6 mg/day = approx diazepam 60 mg equivalent (above 40 mg threshold)                                                       | faqs.benzos-highdose.q2   | Verified with nuance | asam-acmt-2025 | Soften language — math itself is correct, but the "above 40 mg" framing must update to "well above the 15 mg threshold (and at the secondary ≥40 mg DSM-5-TR severe-withdrawal-risk tier)" once Row 6 / Row 71 land (MP Flag 3 + 4) |
| 46 | Alprazolam's short half-life produces interdose withdrawal and makes it one of the most difficult benzos to taper                              | faqs.benzos-highdose.q2   | Verified | asam-acmt-2025, alprazolam-fda | Add `[ref:X]` markers — strongly supported. ASAM: alprazolam "tends to be associated with a more rapid onset of physical dependence" and "tends to be difficult to taper given that it is short-acting and has no active metabolites." FDA label recommends taper by no more than 0.5 mg every 3 days. Note: "interdose withdrawal" is widely-used clinical terminology but not the precise ASAM phrasing — clinical concept is valid. Pairs with Row 83 (alprazolam 2-4 week dependence onset) (B2 Claim 4) |
| 47 | Continuing high-dose prescribing for one month while awaiting e-consult is appropriate                                                          | faqs.benzos-highdose.q3   | —          | —      | _Bundle 7 pending_               |
| 48 | Gabapentin/pregabalin are sedating + respiratory depressant, potentiated by benzodiazepines                                                    | faqs.benzos-combo-other.q1 | Verified | shrestha-f1000-2020, williams-drugs-2023, fda-pregabalin-2025 | Add `[ref:X]` markers — claim well-supported. Pregabalin label specifically references additive respiratory depression and somnolence with benzos as CNS depressants. Pairs with Row 75 (already resolved via MP Flag 9) (B5 Claim 6) |
| 49 | FDA added warning on benzodiazepine + gabapentinoid combination in 2019                                                                         | faqs.benzos-combo-other.q1 | **Needs revision** | shrestha-f1000-2020, williams-drugs-2023, beers-2019, fda-pregabalin-2025 | Rewrite per OE — 2019 FDA gabapentinoid warning was specifically about respiratory depression with **opioid co-use**, NOT specifically about benzo+gabapentinoid. Actual benzo+gabapentinoid evidence: pregabalin label warns of additive CNS effects (Row 75); 2019 Beers Criteria flagged opioid+gabapentinoid (Row 76). Disentangle (MP Flag 9) |
| 50 | Benzo + gabapentin + opioid is the highest risk tier regardless of individual doses                                                            | faqs.benzos-combo-other.q1 | **Needs revision** | cdc-opioid-2022, sharma-bmjopen-2020, beers-2019 | Rewrite per OE — drop "regardless of individual doses." Risk is dose-dependent for each component (CDC 2022 dose framework). No guideline assigns a formal "highest risk tier" to this triple combination independent of dosing. **Reframe:** "represents very high co-prescribing risk, but risk is dose-dependent for each component; use lowest effective doses and consider whether benefits outweigh risks for any concurrent CNS depressant use" (B5 Claim 7) |
| 51 | Z-drugs act on same GABA-A receptors as benzodiazepines and produce additive CNS depression                                                    | faqs.benzos-combo-other.q2 | Verified with nuance | morin-nejm-2024, silberman-drugs-2025, ags-beers-2023-jgs | Add `[ref:X]` markers + small clarification — Z-drugs are allosteric modulators of the same GABA-A binding site; some (zolpidem) have α1-subtype selectivity, so "same GABA-A receptor complex" is correct but "identical receptor" is not. **Important Beers nuance:** AGS Beers 2023 recommends avoiding **each class independently**, not the pair as a flagged drug-drug interaction. Module text overstates the formality of that flag. FDA Z-drug labels warn against concurrent CNS depressants generally, no boxed warning for the pair. Pair with Row 52 (B5 Claim 4) |
| 52 | Beers Criteria explicitly flags Z-drug + benzodiazepine combination                                                                             | faqs.benzos-combo-other.q2 | —         | —      | _Bundle 6 pending_               |
| 53 | Eliminating the Z-drug is generally lower-risk than addressing the benzodiazepine first                                                        | faqs.benzos-combo-other.q2 | Verified with nuance | morin-nejm-2024, silberman-drugs-2025, vadod-pain-2022, toyoshima-ijms-2021 | Soften — pharmacologically plausible (Z-drugs typically shorter half-lives and milder withdrawal than long-term benzos), but **no head-to-head study** compares risk of discontinuing Z-drug vs benzo when both are present. Z-drugs still produce tolerance, rebound insomnia, withdrawal in **20–50% of repeated nightly users**; parasomnias may be more prominent. Reframe: "reasonable clinical approach based on milder withdrawal profile, but sequencing has not been directly studied; both classes can produce dependence and withdrawal — decision should be individualized." Pair with Row 95 (B5 Claim 5) |
| 54 | Carisoprodol (Soma) is metabolized to meprobamate, a barbiturate-like compound with significant abuse potential                                | faqs.benzos-combo-other.q3 | Verified with nuance | kumar-ejp-2016, gonzalez-jpet-2009 | Soften language — meprobamate is a **carbamate** with barbiturate-like GABAergic activity, not itself a barbiturate. Discriminative-stimulus effects antagonized by bemegride (barbiturate antagonist) but not flumazenil. Small wording change: "carbamate with barbiturate-like GABAergic activity" (MP Flag 10) |
| 55 | Three-pathway algorithm for no-indication: (1) establish via assessment, (2) e-consult psych, (3) document conversation if patient declines     | faqs.benzos-no-indication.q1 | Verified | asam-acmt-2025, robertson-aafp-2023, asam-risk2024 | Reframe per OE — **present as decision tree (sequence) rather than equal alternatives**: (1) clinical assessment first, (2) if indication identified → document + reassess risk-benefit, (3) if no indication → document plan to taper (with specialist consult for high-dose / long-duration / older adults / complex comorbidities) (B3 Claim 7) |
| 56 | Documenting an unassessed diagnosis ("anxiety") to justify a prescription is a documentation liability                                          | faqs.benzos-no-indication.q2 | Verified | asam-acmt-2025, szuhany-jama-2022, asam-risk2024 | Add operational alternative — instead of either fabricating a diagnosis OR no documentation, document (1) the inherited medication and history, (2) that a clinical assessment is planned, (3) the short-term continuation rationale ("continuing current regimen to avoid withdrawal pending full assessment"). This is the **chart-defensibility middle path** the module currently lacks (B3 Claim 6) |
| 57 | AGS Beers Criteria lists ALL benzodiazepines as potentially inappropriate medications in adults ≥ 65 regardless of indication                   | faqs.benzos-cognitive.q1  | —          | —      | _Bundle 6 pending_               |
| 58 | Falls and hip fractures (impaired balance, reaction time, depth perception) are dose-dependent benzo risks in older adults                     | faqs.benzos-cognitive.q1  | —          | —      | _Bundle 6 pending_               |
| 59 | Paradoxical agitation is a recognized adverse effect in some older patients                                                                    | faqs.benzos-cognitive.q1  | —          | —      | _Bundle 6 pending_               |
| 60 | Many benzodiazepines have prolonged half-life in older adults due to reduced hepatic metabolism                                                 | faqs.benzos-cognitive.q1  | —          | —      | _Bundle 6 pending_               |
| 61 | Tapering elderly chronic benzo patients carries real risks (withdrawal seizure, severe rebound anxiety)                                         | faqs.benzos-cognitive.q2  | —          | —      | _Bundle 4 pending_               |
| 62 | For non-taper-candidate elderly, documenting risk-benefit reasoning to continue is a defensible position                                        | faqs.benzos-cognitive.q2  | Verified with nuance | asam-acmt-2025, ags-beers-2023-jgs, maust-jamaopen-2023, shuey-jamaim-2026 | **Strong new evidence:** Maust JAMA Open 2023 VA study (N>350,000) using target trial emulation found benzo discontinuation associated with **small absolute mortality increase 2.1–2.4 percentage points over 1 year**, plus increases in nonfatal overdose, suicidal ideation, ED use — though confounded by inclusion of nonvoluntary tapering. Required documentation: (1) Beers Criteria acknowledgment, (2) specific patient-level taper risks, (3) specific continuation risks, (4) shared decision-making, (5) annual reassessment plan. Not a permanent exemption (B4 Claim 7). Net-new Row 85 |
| 63 | Chronic benzodiazepine use is associated with accelerated cognitive decline                                                                    | faqs.benzos-cognitive.q3  | Verified with nuance / Controversial | aldawsari-bjcp-2022, gerlach-jgerontol-2022, legrand-jns-2025, penninkilampi-cnsdrugs-2018 | Rewrite per OE — association is debated; 2022 meta-analysis with protopathic-bias control found null; 2022 VA cohort (n=528,006) HR ~1.05–1.06 without dose-response; 2025 case-control restricted to 4-yr prodromal period (confounding by indication); 2018 meta-analysis with ≥5-yr lag still found OR 1.30. Acute cognitive impairment is well-established and reversible — preserve that. Long-term causal claim must soften (MP Flag 11) |
| 64 | Benzo as modifiable risk factor in the cognitive workup of an MCI patient                                                                       | faqs.benzos-cognitive.q3  | —          | —      | _Bundle 6 pending_               |
| 65 | Tolerance to anxiolytic effect of benzodiazepines is expected with chronic use (pharmacology, not failure)                                     | faqs.benzos-escalation.q1 | Verified with nuance / Controversial | asam-acmt-2025 | Rewrite per OE — sedative/hypnotic tolerance is well-established; **anxiolytic tolerance is debated**, may be incomplete. Loss-of-efficacy differential includes pharmacological tolerance, worsening underlying condition, and benzodiazepine use disorder — each requires different response. Preserve "don't simply escalate" clinical action; soften pharmacology framing (MP Flag 12) |
| 66 | Appropriate response to "stopped working" is to introduce SSRIs/SNRIs/buspirone/therapy as direction of travel and e-consult psych              | faqs.benzos-escalation.q1 | —          | —      | _Bundle 8 pending_               |
| 67 | In primary care, chronic-anxiety dose escalation of benzodiazepines almost never appropriate without psych input                                | faqs.benzos-escalation.q2 | —          | —      | _Bundle 8 pending_               |
| 68 | Narrow exceptions for situational/procedural acute escalation exist but are time-limited                                                        | faqs.benzos-escalation.q2 | —          | —      | _Bundle 8 pending_               |
| 69 | Documenting refusal-to-escalate + patient reaction is the chart-defensibility pattern when patient threatens to seek prescriber elsewhere      | faqs.benzos-escalation.q3 | —          | —      | _Bundle 8 pending_               |
| 70 | **NEW (MP Flag 6):** Five benzodiazepines are FDA-approved for insomnia: temazepam, triazolam, quazepam, flurazepam, estazolam                  | addition → faqs.benzos-indication.q2 | Verified | aafp-matheson-2024, acp-qaseem-2016 | Add new content — establishes accurate scope of FDA approval before contrasting with guideline opposition to long-term use. Anchors Row 22 rewrite |
| 71 | **NEW (MP Flag 3):** 2025 ASAM/ACMT guideline defines high daily benzodiazepine dose as **>15 mg diazepam equivalents** (>2 mg alprazolam, >3 mg lorazepam, >1.5 mg clonazepam) | addition → escalation.benzos-highdose + faqs.benzos-highdose.q1 | Verified | asam-acmt-2025 | Add new content — replaces 40 mg framing as primary threshold; pair with optional secondary tier at ≥40 mg per DSM-5-TR. Anchors Row 6 rewrite |
| 72 | **NEW (MP Flag 5):** DSM-5-TR notes withdrawal has been reported with as little as 15 mg diazepam daily for several months                      | addition → faqs.benzos-duration.q1 | Verified | dsm5tr | Add new content — supports the conservative dependence framing without committing to a 4–6-week blanket cutoff |
| 73 | **NEW (MP Flag 7):** FDA explicitly clarified buprenorphine and methadone for OUD treatment should NOT be withheld due to benzodiazepine use   | addition → faqs.benzos-combo-opiate.q1 | Verified | asam-acmt-2025 | Add new content — clinically important carve-out the module currently lacks; counters reflexive "benzo + opioid = stop everything" interpretation |
| 74 | **NEW (MP Flag 12):** Loss-of-efficacy differential on chronic benzo includes pharmacological tolerance, worsening of underlying disorder, and benzodiazepine use disorder | addition → faqs.benzos-escalation.q1 | Verified | asam-acmt-2025 | Add new content — replaces blanket "tolerance, not failure" framing with operational differential the PCP can actually act on |
| 75 | **NEW (MP Flag 9):** Pregabalin FDA label warns of additive CNS depressant effects when combined with benzodiazepines                          | addition → faqs.benzos-combo-other.q1 | Verified | fda-pregabalin-2025 | Add new content — actual evidence basis for the benzo+gabapentinoid combination concern (the 2019 FDA warning was opioid-focused; this is the correct citation) |
| 76 | **NEW (MP Flag 9):** 2019 AGS Beers Criteria specifically flag the **opioid + gabapentinoid** interaction (separate from benzo + gabapentinoid)  | addition → faqs.benzos-combo-other.q1 | Verified | beers-2019 | Add new content — keeps the gabapentinoid concern in the module while properly attributing the regulatory action; supports triple-combination (opioid + benzo + gabapentinoid) as highest risk tier framing |
| 77 | **NEW (B1 Claim 4):** I-STOP permits NY prescribers to contact other prescribers identified in the PMP **without explicit patient permission** | addition → faqs.benzos-pdmp.q2 | Verified | virani-psychserv-2018 | Add new content — operationally important and missing from current module text; supports the "warm handoff or e-consult" framing for dual-prescriber scenarios |
| 78 | **NEW (B1 Claim 6):** NY 2012: 70.7% of opioid-analgesic-related deaths also involved a benzodiazepine | addition → faqs.benzos-combo-opiate.q1 or q2 | Verified | sharp-mmwr-2015 | Add new content — concrete state-specific mortality anchor for the "highest-priority safety flag" framing; counters "they've been fine for years" with population-level data |
| 79 | **NEW (B1 Claim 6):** VA/DoD 2022 chronic pain guideline goes further than CDC, stating "harms outweigh the benefits" for concurrent benzodiazepine + opioid use | addition → faqs.benzos-combo-opiate.q2 | Verified | vadod-pain-2022 | Add new content — supplies a stronger guideline framing than CDC 2022's "particular caution"; useful for providers managing co-prescribed inherited patients |
| 80 | **NEW (B1 Claim 7):** AGS 2023 Beers Criteria flag concurrent use of **≥3 CNS-active medications** (benzodiazepines, opioids, gabapentinoids, antipsychotics, Z-drugs) as potentially inappropriate in older adults | addition → faqs.benzos-combo-other.q1 / q2 + escalation.benzos-cognitive | Verified | arnold-aafp-2024 | Add new content — replaces the imprecise "doubles CNS depression risk" framing in Row 14 with a citable Beers-anchored rule; cross-cuts the cognitive/older-adult section |
| 81 | **NEW (B2 Claim 2 — FACTUAL ERROR):** Temazepam 20 mg ≈ diazepam 10 mg (NOT 10 mg ≈ 10 mg as the module currently says) | correction → faqs.benzos-highdose.q1 | Verified | asam-acmt-2025, vadod-sud-2021, ashton-drugs-1994 | Add new content — explicit correction row paired with Row 44 rewrite. Single-cell factual error caught by Bundle 2; module is currently off by factor of two on this entry |
| 82 | **NEW (B2 Claim 1):** ASAM 2025 dose-tier framework — low ≤10 mg, moderate 10–15 mg, high >15 mg diazepam equivalents/day | addition → escalation.benzos-highdose + faqs.benzos-highdose.q1 | Verified | asam-acmt-2025 | Add new content — supersedes single-threshold framing (40 mg → 15 mg per Row 71). Provides graded escalation rather than binary high/not-high. Anchors module-text rewrite of escalation item 2 |
| 83 | **NEW (B2 Claim 4):** Alprazolam-specific dependence onset — taper may be appropriate after as little as 2–4 weeks of daily use (vs ≥3 months at ≥4 days/week for other benzos per ASAM/ACMT) | addition → faqs.benzos-duration.q1 | Verified | asam-acmt-2025, alprazolam-fda | Add new content — short-half-life agent exception to the general dependence framework. Pairs with Row 27 (4-6 weeks generic) and Row 72 (DSM-5-TR threshold). Operationally important for module's chronic-alprazolam patient framing |
| 84 | **NEW (B2 Claim 7 + B4 Claim 2):** Soyka NEJM 2017 thresholds: ≥30 mg diazepam equivalents/day → taper duration should extend beyond 4–6 weeks; ≥100 mg/day → consider inpatient withdrawal management | addition → faqs.benzos-highdose.q3 + faqs.benzos-duration.q2 | Verified | soyka-nejm-2017 | Add new content — additional dose anchors beyond the ASAM tier framework. Useful for the high-dose escalation FAQ and the long-duration taper planning FAQ |
| 85 | **NEW (B4 Claim 7):** Maust JAMA Open 2023 VA target-trial-emulation study (N>350,000) — benzo discontinuation associated with small absolute mortality increase 2.1–2.4 pp over 1 year, plus increases in nonfatal overdose, suicidal ideation, ED use (confounded by nonvoluntary tapering inclusion) | addition → faqs.benzos-cognitive.q2 | Verified | maust-jamaopen-2023 | Add new content — **strongest new evidence in Bundle 4.** Directly supports the module's "defensible decision NOT to taper in high-risk older adults" framing with population-level mortality data |
| 86 | **NEW (B3 Claim 3):** USPSTF 2023 anxiety screening recommendation applies to adults ≤64 only; **insufficient evidence (I statement) for adults ≥65** due to higher false-positive rates | addition → faqs.benzos-indication.q3 | Verified | uspstf-anxiety-2023, oconnor-jama-2023 | Add new content — operationally critical because most inherited benzo patients are older and the module currently recommends GAD-7 universally. Pair with Row 25 GAD-7 caveats |
| 87 | **NEW (B3 Claim 4):** Anxiety in primary care — 44.5% sensitivity for detection (n=34,902 meta-analysis), only 13.3% present with anxiety as chief complaint, **median 23 years from anxiety-disorder onset to treatment initiation** | addition → faqs.benzos-indication.q3 | Verified | szuhany-jama-2022, uspstf-anxiety-2023 | Add new content — concrete data anchors for the "underdiagnosed" framing. The 23-year delay stat is a strong narrative anchor for "thin-chart inherited patient may have undiagnosed anxiety disorder" |
| 88 | **NEW (B4 Claim 4):** Cochrane 2018 meta-analysis: very slow tapering rates not superior to moderately paced; NEJM Soyka warns prolonged reductions may make withdrawal treatment "the patient's morbid focus"; 4–8 weeks suitable for "most patients" | addition → faqs.benzos-duration.q2 | Verified | baandrup-cochrane-2018, soyka-nejm-2017 | Add new content — counterweight to the "1-2 year taper" framing in Row 29. Module needs to express that very slow tapers are not evidence-superior |
| 89 | **NEW (B3 Claim 1):** Eszopiclone and dual orexin receptor antagonists (DORAs, e.g., suvorexant, lemborexant, daridorexant) have longer-term insomnia efficacy data — distinct from benzodiazepines and not subject to the same 4–5 week limitation | addition → faqs.benzos-indication.q2 | Verified | matheson-aafp-2024, morin-nejm-2024 | Add new content — clarifies what alternatives exist after withdrawing benzo for insomnia. Module currently mentions CBT-I but not pharmacologic alternatives that are guideline-supported for chronic use |
| 90 | **NEW (B3 Claim 2):** Digital CBT-I (VA Insomnia Coach app, SleepEZ, etc.) is an evidence-supported alternative when in-person CBT-I is unavailable | addition → faqs.benzos-indication.q2 | Verified | morin-nejm-2024, steinman-jgs-2025 | Add new content — operational access workaround. Many PCPs can't refer to in-person CBT-I; digital options keep the recommendation actionable |
| 91 | **NEW (B3 Claim 5):** ASAM/ACMT acknowledges long-term benzodiazepine use may be indicated for **severe treatment-resistant GAD** when first-line therapies (SSRIs/SNRIs/CBT) have failed; some guidelines allow indefinite continuation | addition → faqs.benzos-indication.q3 | Verified | asam-acmt-2025, szuhany-jama-2022 | Add new content — counterweight to "all chronic benzos are inappropriate" implication. Some inherited patients have already failed multiple first-line trials and benzo continuation may be the appropriate clinical decision |
| 92 | **NEW (B5 Claim 2):** Alobaidi 2021 nested case-control — concurrent benzo+opioid overlap in the prior 0–30 days carried OR 13.2 vs OR 3.2 for 61–90 days prior. **Risk is recency-dependent, not duration-monotonic.** | addition → faqs.benzos-combo-opiate.q2 | Verified | alobaidi-pharmacotherapy-2021, cdc-opioid-2022 | Add new content — directly contradicts the module's "risk increases with duration" framing in Row 41. Operationally important: an inherited patient on stable, long-duration benzo+opioid is in a different risk stratum than a patient newly co-prescribed both |
| 93 | **NEW (B5 Claim 2):** Triple combination opioid + benzodiazepine + Z-drug carries **60% higher overdose risk** than opioid + benzodiazepine alone (Cho JGIM 2020) | addition → faqs.benzos-combo-other.q2 | Verified | cho-jgim-2020, sharma-bmjopen-2020 | Add new content — concrete magnitude anchor for de-escalating the Z-drug first when triple-prescribed. Pairs with Row 53 (Z-drug-first sequencing) and Row 95 (Z-drug withdrawal nuance) |
| 94 | **NEW (B5 Claim 3):** Naloxone co-prescribing + household education reduced ED visits by **63%** in long-term opioid users (Babu NEJM 2019) | addition → faqs.benzos-combo-opiate.q1 | Verified | babu-nejm-2019, asam-acmt-2025 | Add new content — strongest single-stat justification for naloxone co-prescribing in benzo+opioid patients. Pairs with Row 39 (naloxone strong recommendation now resolved by B5) |
| 95 | **NEW (B5 Claim 5):** Z-drugs produce tolerance, rebound insomnia, and withdrawal in **20–50% of patients with repeated nightly use**; parasomnias may be more prominent than with benzos | addition → faqs.benzos-combo-other.q2 | Verified | morin-nejm-2024, toyoshima-ijms-2021, silberman-drugs-2025 | Add new content — counterweight to the implicit assumption that Z-drug discontinuation is risk-free. Module's "Z-drug elimination is generally lower-risk" framing (Row 53) is still defensible but needs this caveat |
| 96 | **NEW (B5 Claim 9):** Carisoprodol parent drug has direct barbiturate-like GABAergic activity **independent of metabolism to meprobamate**. Meprobamate is a **propanediol dicarbamate** (not "carbamate" or "barbiturate") with barbiturate-like GABA-A activity. | refinement → faqs.benzos-combo-other.q3 | Verified | gonzalez-jpet-2009, carbonaro-neuropharm-2020, rho-jpet-1997, kumar-ejp-2016 | Add new content — pharmacologic precision refinement to Row 54. Operational point: dual-mechanism (parent drug + active metabolite) is the basis for carisoprodol's outsized abuse potential vs cyclobenzaprine/methocarbamol |

**Status summary (after Bundles 1–5):** ~64 of 96 rows resolved.
- Meta-pass: 13 row updates + 7 net-new (70–76)
- Regulatory verification: 3 row updates (17, 18, 19)
- Bundle 1: 3 row updates (13, 14, 15) + 4 net-new (77–80)
- Bundle 2: row updates 31, 32, 44, 46 + net-new 81, 82, 83, 84 (also indirectly 6, 71 already resolved)
- Bundle 3: row updates 23, 24, 25, 26, 55, 56 + net-new 86, 87, 89, 90, 91
- Bundle 4: row updates 28, 29, 30, 62 + net-new 85, 88
- Bundle 5: row updates 5, 7, 39, 41, 48, 50, 51, 53 + net-new 92–96 (Rows 38, 49, 54 reinforced; Row 73 carve-out reinforced)
- Net unique resolved ≈ 64. ~32 rows still pending Bundles 6–8.

**Regulatory cluster resolved:** Rows 3, 17, 18, 19. Module needs state-conditional PDMP framing (NY per-prescription vs NJ initial+quarterly) plus disclaimer pattern.

**Bundle 1 cluster resolved:** Mostly confirmation; Row 14 Z-drug "doubles" framing needs rewrite; 4 net-new operational data points (Rows 77–80).

**Bundle 2 cluster resolved:** **Most consequential single correction in the verification so far** — Row 44 temazepam equivalency is wrong (10 mg → 20 mg). ASAM dose-tier framework (Row 82) supersedes single-threshold framing. Diazepam-conversion-as-default softens (Row 31, 32). Alprazolam 2-4 week dependence onset (Row 83).

**Bundle 3 cluster resolved:** Mostly confirmation. USPSTF ≥65 carve-out for GAD-7 is operationally critical (Row 86). Three-pathway no-indication algorithm reframes as decision tree (Row 55). Treatment-resistant GAD as benzo-continuation exception (Row 91). Eszopiclone/DORAs as longer-term insomnia alternatives (Row 89). Digital CBT-I as access workaround (Row 90).

**Bundle 4 cluster resolved:** Maust JAMA Open 2023 mortality study (Row 85) is **strongest new evidence in the verification** — supports module's defensible-not-to-taper framing for high-risk older adults with population-level data. Cochrane 2018 + Soyka NEJM counter the "1-2 year taper" expectation (Row 88, Row 29 reframe). "Lowest dose" → "lowest effective dose" wording change (Row 30).

**Bundle 5 cluster resolved:** Most claims were already addressed by MP / B1 (boxed-warning Row 38, OUD-OAT carve-out Row 73, gabapentinoid Row 49, carisoprodol Row 54); B5 reinforces with additional citations and supplies five concrete data anchors. **Two superlatives softened** — "highest-risk regardless of duration" (Row 41) and "highest tier regardless of doses" (Row 50); both must drop "regardless of." **Recency-dependent risk via Alobaidi 2021** (Row 92) is the operationally most important addition — directly contradicts the "risk increases with duration" framing in the module's combo-opiate FAQ. **Naloxone strong recommendation closed** (Row 39) with the 63%-ED-reduction stat (Row 94). **Triple-combo magnitude** (Row 93) and **Z-drug withdrawal frequency** (Row 95) round out the Z-drug sequencing nuances. Carisoprodol pharmacology refinement (Row 96) is precision, not direction-change.

**Rewrite-impact ranking:** the meta-pass forces six **prose rewrites** (Rows 6, 22, 27, 38, 43, 49, 63, 65 — the eight `Needs revision` / `Disproved` verdicts), four **language softens** (Rows 1, 3, 45, 54), one **table caveat** (Row 44), and seven **content additions** (Rows 70–76). Bundle 5 adds **two more rewrites** (Rows 41, 50) and **two more softens** (Rows 5, 51, 53). Flag 8 (taper sequence) and Flag 3 (15 mg threshold) remain the two highest-impact changes; B5 Claim 2 (recency-dependent risk) and B5 Claim 7 (dose-dependent triple-combo) are the highest-impact B5 additions.

---

## References staging

As OE returns citations, capture them here with the `ref_id` that matches the tracker table. This becomes the `references[]` array in the benzo module once verification is complete. URLs that end in `doi.org/...` are deterministic from DOI; FDA label and guideline URLs are marked TBD (need manual lookup on accessdata.fda.gov, ASAM site, AGS site, NICE site, NY DOH site).

| ref_id | citation | url | accessed |
|--------|----------|-----|----------|
| asam-acmt-2025 | Brunner E, Chen CYA, Klein T, et al. The Joint Clinical Practice Guideline on Benzodiazepine Tapering: Considerations When Benzodiazepine Risks Outweigh Benefits. American Society of Addiction Medicine / American College of Medical Toxicology. 2025. | TBD (asam.org) | 2026-05-03 — **Dominant meta-pass ref**; cited in 8 of 13 flags. Authoritative for taper sequencing, dose thresholds, dependence onset, anxiolytic-tolerance framing. |
| fda-ativan-2025 | FDA Prescribing Information — Ativan (lorazepam). Label updated 2025-07-09. | TBD (accessdata.fda.gov) | 2026-05-03 — Used as exemplar benzo FDA label; covers physical dependence onset language and polysubstance-mortality framing. |
| aafp-robertson-2023 | Robertson S, Peacock EE, Scott R. Benzodiazepine Use Disorder: Common Questions and Answers. Am Fam Physician. 2023;108(3):260-266. | TBD (aafp.org) | 2026-05-03 — Primary-care-facing review; supports "rare cases" framing for withdrawal mortality. |
| cdc-opioid-2022 | Dowell D, Ragan KR, Jones CM, Baldwin GT, Chou R. CDC Clinical Practice Guideline for Prescribing Opioids for Pain — United States, 2022. MMWR Recomm Rep. 2022;71(3):1-95. | https://doi.org/10.15585/mmwr.rr7103a1 | 2026-05-03 — Category B (discretionary) downgrade of benzo+opioid concurrent prescribing language; "particular caution" framing. |
| cdc-opioid-2016 | Dowell D, Haegerich TM, Chou R. CDC Guideline for Prescribing Opioids for Chronic Pain — United States, 2016. JAMA. 2016;315(15):1624-1645. | https://doi.org/10.1001/jama.2016.1464 | 2026-05-03 — Source of "may be safer to taper opioids first" framing referenced in Flag 8. |
| dsm5tr | American Psychiatric Association. Diagnostic and Statistical Manual of Mental Disorders, 5th ed., Text Revision (DSM-5-TR). 2022. | TBD (psychiatry.org) | 2026-05-03 — Cited for withdrawal-onset language: "as little as 15 mg diazepam daily for several months." |
| aafp-matheson-2024 | Matheson EM, Brown BD, DeCastro AO. Treatment of Chronic Insomnia in Adults. Am Fam Physician. 2024;109(2):154-160. | TBD (aafp.org) | 2026-05-03 — Confirms FDA approval of specific benzodiazepines for insomnia (Flag 6). |
| acp-qaseem-2016 | Qaseem A, Kansagara D, Forciea MA, Cooke M, Denberg TD. Management of Chronic Insomnia Disorder in Adults: A Clinical Practice Guideline From the American College of Physicians. Ann Intern Med. 2016;165(2):125-133. | https://doi.org/10.7326/M15-2175 | 2026-05-03 — ACP CPG; supports CBT-I as first-line for chronic insomnia and recommends against long-term benzo. |
| vadod-insomnia-2019 | Mysliwiec V, Martin JL, Ulmer CS, et al. The Management of Chronic Insomnia Disorder and Obstructive Sleep Apnea: Synopsis of the 2019 VA / DoD Clinical Practice Guidelines. Ann Intern Med. 2020;172(5):325-336. | https://doi.org/10.7326/M19-3575 | 2026-05-03 — VA/DoD specifically advises against benzodiazepines for chronic insomnia disorder (Flag 6). |
| lancet-decrescenzo-2022 | De Crescenzo F, D'Alò GL, Ostinelli EG, et al. Comparative Effects of Pharmacological Interventions for the Acute and Long-Term Management of Insomnia Disorder in Adults: A Systematic Review and Network Meta-Analysis. Lancet. 2022;400(10347):170-184. | https://doi.org/10.1016/S0140-6736(22)00878-9 | 2026-05-03 — Found no long-term trial data for benzodiazepines in insomnia. |
| shrestha-f1000-2020 | Shrestha S, Palaian S. Respiratory Concerns of Gabapentin and Pregabalin: What Does It Mean to the Pharmacovigilance Systems in Developing Countries? F1000Research. 2020;9:32. | https://doi.org/10.12688/f1000research.21962.1 | 2026-05-03 — Context for FDA 2019 gabapentinoid respiratory-depression warning (Flag 9). |
| williams-drugs-2023 | Williams CD, Al-Jammali Z, Herink MC. Gabapentinoids for Pain: A Review of Published Comparative Effectiveness Trials and Data Submitted to the FDA for Approval. Drugs. 2023;83(1):37-53. | https://doi.org/10.1007/s40265-022-01810-3 | 2026-05-03 — Disentangles 2019 FDA warning scope (opioid co-use focus). |
| beers-2019 | American Geriatrics Society. AGS Beers Criteria 2019 Update. Summary: Croke L. Beers Criteria for Inappropriate Medication Use in Older Patients: An Update From the AGS. Am Fam Physician. 2020;101(1):56-57. | TBD (americangeriatrics.org / aafp.org) | 2026-05-03 — Beers Criteria flag opioid–gabapentinoid interactions and Z-drug + benzo combinations. |
| fda-pregabalin-2025 | FDA Prescribing Information — Pregabalin (Lyrica). Label updated 2025-12-09. | TBD (accessdata.fda.gov) | 2026-05-03 — Pregabalin label warns of additive CNS effects with benzodiazepines (Flag 9). |
| kumar-ejp-2016 | Kumar M, Dillon GH. Assessment of Direct Gating and Allosteric Modulatory Effects of Meprobamate in Recombinant GABA(A) Receptors. Eur J Pharmacol. 2016;775:149-158. | https://doi.org/10.1016/j.ejphar.2016.02.031 | 2026-05-03 — Pharmacology basis for meprobamate's barbiturate-like GABAergic activity. |
| gonzalez-jpet-2009 | Gonzalez LA, Gatch MB, Taylor CM, et al. Carisoprodol-Mediated Modulation of GABA-A Receptors: In Vitro and In Vivo Studies. J Pharmacol Exp Ther. 2009;329(2):827-837. | https://doi.org/10.1124/jpet.109.151142 | 2026-05-03 — Bemegride-antagonized but not flumazenil-antagonized; carbamate, not barbiturate (Flag 10). |
| aldawsari-bjcp-2022 | AlDawsari A, Bushell TJ, Abutheraa N, et al. Use of Sedative-Hypnotic Medications and Risk of Dementia: A Systematic Review and Meta-Analysis. Br J Clin Pharmacol. 2022;88(4):1567-1589. | https://doi.org/10.1111/bcp.15113 | 2026-05-03 — **Key Flag 11 ref** — association did not persist after controlling for protopathic bias. |
| gerlach-jgerontol-2022 | Gerlach LB, Myra Kim H, Ignacio RV, Strominger J, Maust DT. Use of Benzodiazepines and Risk of Incident Dementia: A Retrospective Cohort Study. J Gerontol A Biol Sci Med Sci. 2022;77(5):1035-1041. | https://doi.org/10.1093/gerona/glab241 | 2026-05-03 — Large VA cohort (n=528,006); minimal association (HR ~1.05–1.06) without dose-response. |
| legrand-jns-2025 | Legrand D, Roberge P, Vanasse A, Carrier N, Bocti C. Association Between Benzodiazepines and Dementia: A Case-Control Study From Canadian Health Surveys and Medico-Administrative Databases. J Neurol Sci. 2025;479:123746. | https://doi.org/10.1016/j.jns.2025.123746 | 2026-05-03 — Association restricted to 4-year prodromal period → confounding by indication. |
| penninkilampi-cnsdrugs-2018 | Penninkilampi R, Eslick GD. A Systematic Review and Meta-Analysis of the Risk of Dementia Associated With Benzodiazepine Use, After Controlling for Protopathic Bias. CNS Drugs. 2018;32(6):485-497. | https://doi.org/10.1007/s40263-018-0535-3 | 2026-05-03 — With ≥5-year lag, modest but significant OR 1.30 — preserves the "controversial, not resolved" framing. |
| bachhuber-pds-2019 | Bachhuber MA, Tuazon E, Nolan ML, Kunins HV, Paone D. Impact of a Prescription Drug Monitoring Program Use Mandate on Potentially Problematic Patterns of Opioid Analgesic Prescriptions in New York City. Pharmacoepidemiol Drug Saf. 2019;28(5):734-739. | https://doi.org/10.1002/pds.4766 | 2026-05-03 — Added from Bundle 1; documents 58% reduction in problematic ≥5-prescriber episodes after I-STOP mandate; anchors the operational efficacy framing of NYS PDMP. |
| sharp-mmwr-2015 | Sharp MJ, Melnik TA. Poisoning Deaths Involving Opioid Analgesics — New York State, 2003–2012. MMWR Morb Mortal Wkly Rep. 2015;64(14):377-380. | TBD (cdc.gov/mmwr) | 2026-05-03 — **Key Bundle 1 ref** — NY 2012: 70.7% of opioid-analgesic-related deaths also involved a benzodiazepine. State-specific mortality anchor for the dual-class-prescribing framing. |
| istop-blum2016 | Blum CJ, Nelson LS, Hoffman RS. A Survey of Physicians' Perspectives on the New York State Mandatory Prescription Monitoring Program (ISTOP). J Subst Abuse Treat. 2016;70:35-43. | https://doi.org/10.1016/j.jsat.2016.07.013 | 2026-05-03 — Added from Bundle 1; documents 83% awareness, 48.4% perfect compliance among NYS physicians; supports the "verify with compliance office" disclaimer framing. |
| virani-psychserv-2018 | Virani S, Aoun EG, Torres F, et al. Decoding New York State's Prescription Monitoring Program. Psychiatr Serv. 2018;69(9):956-958. | https://doi.org/10.1176/appi.ps.201800143 | 2026-05-03 — **Key Bundle 1 ref** — establishes that I-STOP permits NY prescribers to contact other prescribers identified in the PMP without explicit patient permission. Operationally important for dual-prescriber coordination. |
| pylypchuk-mcrr-2022 | Pylypchuk Y, Parasrampuria S, Smiley C, Searcy T. Impact of Electronic Prescribing of Controlled Substances on Opioid Prescribing: Evidence From I-STOP Program in New York. Med Care Res Rev. 2022;79(1):114-124. | https://doi.org/10.1177/1077558721994994 | 2026-05-03 — Added from Bundle 1; supports R10 (NY EPCS mandate) effectiveness data. |
| vadod-pain-2022 | Brown N, Clinton-Lont J, Edens E, et al. Use of Opioids in the Management of Chronic Pain (2022). Department of Veterans Affairs / Department of Defense. | TBD (va.gov / health.mil) | 2026-05-03 — **Key Bundle 1 ref** — VA/DoD 2022 chronic pain guideline; states "harms outweigh the benefits" for concurrent benzodiazepine + opioid use, stronger than CDC 2022's "particular caution." |
| arnold-aafp-2024 | Arnold MJ. Beers Criteria for Inappropriate Medication Use in Older Adults: Update From the American Geriatrics Society. Am Fam Physician. 2024;109(4):374-375. | TBD (aafp.org) | 2026-05-03 — Added from Bundle 1; AAFP summary of 2023 AGS Beers Criteria. Source for the "≥3 CNS-active medications is PIM" rule that replaces the imprecise "doubles risk" framing in Row 14. |
| ags-choosingwisely-2013 | American Geriatrics Society. Five Things Healthcare Providers and Patients Should Question (Choosing Wisely campaign). J Am Geriatr Soc. 2013;61(4):622-631. | https://doi.org/10.1111/jgs.12226 | 2026-05-03 — Added from Bundle 1; source of the "doubles risk of falls and hip fractures" data — for either Z-drug OR benzodiazepine alone vs no use, NOT additive. Used in Row 14 correction. |
| haines-ijdp-2022 | Haines S, Savic M, Nielsen S, Carter A. Key Considerations for the Implementation of Clinically Focused Prescription Drug Monitoring Programs to Avoid Unintended Consequences. Int J Drug Policy. 2022;101:103549. | https://doi.org/10.1016/j.drugpo.2021.103549 | 2026-05-03 — Added from Bundle 1; supports "PDMP data interpreted in clinical context, not standalone judgment" framing for Row 3 reframing. |
| greenwood-ericksen-aem-2016 | Greenwood-Ericksen MB, Poon SJ, Nelson LS, Weiner SG, Schuur JD. Best Practices for Prescription Drug Monitoring Programs in the Emergency Department Setting: Results of an Expert Panel. Ann Emerg Med. 2016;67(6):755-764.e4. | https://doi.org/10.1016/j.annemergmed.2015.10.019 | 2026-05-03 — Added from Bundle 1; supports Row 15 framing on PDMP scope (prescribing/dispensing only). |
| elder-wjem-2018 | Elder JW, DePalma G, Pines JM. Optimal Implementation of Prescription Drug Monitoring Programs in the Emergency Department. West J Emerg Med. 2018;19(2):387-391. | https://doi.org/10.5811/westjem.2017.12.35957 | 2026-05-03 — Added from Bundle 1; companion to greenwood-ericksen-aem-2016 on PDMP ED workflow. |
| soyka-nejm-2017 | Soyka M. Treatment of Benzodiazepine Dependence. N Engl J Med. 2017;376(12):1147-1157. | https://doi.org/10.1056/NEJMra1611832 | 2026-05-03 — **Key Bundle 2/4 ref** — provides ≥30 mg / ≥100 mg diazepam-equivalent thresholds; cautions against over-prolonged tapers ("morbid focus"); supports 4-8 week tapers for most patients. |
| vadod-sud-2021 | Atkinson T, Baldridge C, Burden J, et al. Management of Substance Use Disorder (SUD) (2021). Department of Veterans Affairs / Department of Defense. | TBD (va.gov / health.mil) | 2026-05-03 — Added from Bundle 2; supports diazepam equivalence framework (Ashton-derived) and "switching may not improve outcomes" framing. |
| shuey-jamaim-2026 | Shuey B, Anderson TS, Park TW. Implementing Benzodiazepine Deprescribing in the Primary Care Clinic. JAMA Intern Med. 2026;186(1):120-121. | https://doi.org/10.1001/jamainternmed.2025.6084 | 2026-05-03 — Added from Bundle 2/4; PC-focused implementation guidance; references Maust 2023 mortality finding; "8-10 week tapers" tolerated by some / "months to years" by others. |
| baandrup-cochrane-2018 | Baandrup L, Ebdrup BH, Rasmussen JØ, et al. Pharmacological Interventions for Benzodiazepine Discontinuation in Chronic Benzodiazepine Users. Cochrane Database Syst Rev. 2018;3:CD011481. | https://doi.org/10.1002/14651858.CD011481.pub2 | 2026-05-03 — Added from Bundle 4; key finding: very slow tapering rates not superior to moderately paced. |
| ashton-drugs-1994 | Ashton H. Guidelines for the Rational Use of Benzodiazepines. When and What to Use. Drugs. 1994;48(1):25-40. | https://doi.org/10.2165/00003495-199448010-00004 | 2026-05-03 — Added from Bundle 2; original Ashton paper; canonical equivalence-table source (Ashton Manual). |
| temazepam-fda | FDA Prescribing Information — Temazepam. Label updated 2024-05-14. Insomnia indication: "short-term treatment of insomnia (generally 7 to 10 days)." | TBD (accessdata.fda.gov) | 2026-05-03 — Added from Bundle 2/3; supports the FDA-approved-for-insomnia agent list and short-term-only labeling. |
| alprazolam-fda | FDA Prescribing Information — Alprazolam. Label updated 2025-01-15. Recommends taper by no more than 0.5 mg every 3 days; warns higher/more frequent doses increase withdrawal risk. | TBD (accessdata.fda.gov) | 2026-05-03 — Added from Bundle 2/4; canonical FDA citation for alprazolam-specific cautions. |
| akturk-cochrane-2025 | Aktürk Z, Hapfelmeier A, Fomenko A, et al. Generalized Anxiety Disorder 7-Item (GAD-7) and 2-Item (GAD-2) Scales for Detecting Anxiety Disorders in Adults. Cochrane Database Syst Rev. 2025;3:CD015455. | https://doi.org/10.1002/14651858.CD015455 | 2026-05-03 — Added from Bundle 3; current Cochrane evidence on GAD-7 / GAD-2 screening performance. |
| uspstf-anxiety-2023 | US Preventive Services Task Force, Barry MJ, Nicholson WK, et al. Screening for Anxiety Disorders in Adults: US Preventive Services Task Force Recommendation Statement. JAMA. 2023;329(24):2163-2170. | https://doi.org/10.1001/jama.2023.9301 | 2026-05-03 — **Key Bundle 3 ref** — recommends screening adults ≤64; insufficient evidence (I statement) for ≥65. Operationally critical for inherited-benzo population. |
| oconnor-jama-2023 | O'Connor EA, Henninger ML, Perdue LA, et al. Anxiety Screening: Evidence Report and Systematic Review for the US Preventive Services Task Force. JAMA. 2023;329(24):2171-2184. | https://doi.org/10.1001/jama.2023.6369 | 2026-05-03 — Added from Bundle 3; USPSTF 2023 evidence report; pooled GAD-7 sensitivity 0.79, specificity 0.89 at cutoff ≥10. |
| szuhany-jama-2022 | Szuhany KL, Simon NM. Anxiety Disorders: A Review. JAMA. 2022;328(24):2431-2445. | https://doi.org/10.1001/jama.2022.22744 | 2026-05-03 — **Key Bundle 3 ref** — primary-care-relevant anxiety review; 44.5% sensitivity / 13.3% chief complaint / 23-year median delay stats; benzo-bridge framing for SSRI initiation. |
| degeorge-aafp-2022 | DeGeorge KC, Grover M, Streeter GS. Generalized Anxiety Disorder and Panic Disorder in Adults. Am Fam Physician. 2022;106(2):157-164. | TBD (aafp.org) | 2026-05-03 — Added from Bundle 3; AAFP review; supports SSRI/SNRI as first-line over benzos for anxiety disorders. |
| morin-nejm-2024 | Morin CM, Buysse DJ. Management of Insomnia. N Engl J Med. 2024;391(3):247-258. | https://doi.org/10.1056/NEJMcp2305655 | 2026-05-03 — Added from Bundle 3; current NEJM review; reaffirms CBT-I first-line; useful for digital-CBT-I framing. |
| steinman-jgs-2025 | Steinman MA. Alternative Treatments to Selected Medications in the 2023 American Geriatrics Society Beers Criteria®. J Am Geriatr Soc. 2025;73(9):2657-2677. | https://doi.org/10.1111/jgs.19500 | 2026-05-03 — Added from Bundle 3; AGS Beers companion document on alternative treatments; SSRI options for GAD/panic; CBT-I in older adults; SSRI fall risk caveat. |
| ags-beers-2023-jgs | American Geriatrics Society 2023 Updated AGS Beers Criteria for Potentially Inappropriate Medication Use in Older Adults. J Am Geriatr Soc. 2023;71(7):2052-2081. | https://doi.org/10.1111/jgs.18372 | 2026-05-03 — Added from Bundle 2/3/4; full Beers Criteria 2023 update (companion to Arnold AAFP summary already staged). |
| dsm5tr | American Psychiatric Association. Diagnostic and Statistical Manual of Mental Disorders, 5th ed., Text Revision (DSM-5-TR). 2022. | TBD (psychiatry.org) | 2026-05-03 — Already staged for MP Flag 5; Bundle 4 confirms ~40 mg diazepam equivalents/day as severity threshold for clinically relevant withdrawal. |
| robertson-aafp-2023 | Robertson S, Peacock EE, Scott R. Benzodiazepine Use Disorder: Common Questions and Answers. Am Fam Physician. 2023;108(3):260-266. | TBD (aafp.org) | 2026-05-03 — Already partly staged as `aafp-robertson-2023`; alias for clarity. AAFP PC-focused; supports plant-the-seed and shared-decision-making framings. |
| asam-risk2024 | American Society of Addiction Medicine. Reducing Risk of Federal Investigation or Prosecution for Prescribing Controlled Addiction Medications for Legitimate Medical Purposes. 2024. | TBD (asam.org) | 2026-05-03 — Inherited from regulatory verification; reused in B3 Claim 6 (chart-defensibility) and B3 Claim 7 (no-indication scenario). |
| maust-jamaopen-2023 | Maust DT, Petzold K, Strominger J, Kim HM, Bohnert ASB. Benzodiazepine Discontinuation and Mortality Among Patients Receiving Long-Term Benzodiazepine Therapy. JAMA Netw Open. 2023;6(12):e2348557. | https://doi.org/10.1001/jamanetworkopen.2023.48557 | 2026-05-03 — **Key Bundle 4 ref** — VA target-trial-emulation N>350,000; small absolute mortality increase 2.1-2.4 pp over 1 year associated with discontinuation; confounded by nonvoluntary tapering inclusion. Anchors "defensible not-to-taper in high-risk older adults" framing. |
| rosenberg-nbr-1985 | Rosenberg HC, Chiu TH. Time Course for Development of Benzodiazepine Tolerance and Physical Dependence. Neurosci Biobehav Rev. 1985;9(1):123-131. | https://doi.org/10.1016/0149-7634(85)90038-7 | 2026-05-03 — Added from Bundle 4; animal data on receptor-level dependence within days; supplementary support for early-onset dependence framing. |
| alobaidi-pharmacotherapy-2021 | Alobaidi A, Pickard AS, Jarrett JB, Lee TA. Hospitalizations for Opioid-Related Overdose and Timing of Concurrent Opioid and Benzodiazepine Use: A Nested Case-Control Study. Pharmacotherapy. 2021;41(9):722-732. | https://doi.org/10.1002/phar.2608 | 2026-05-03 — **Key Bundle 5 ref** — overdose risk OR 13.2 for benzo+opioid overlap in prior 0–30 days vs OR 3.2 for 61–90 days prior. Establishes recency-dependent (not duration-monotonic) risk. Anchors Rows 41 + 92. |
| cho-jgim-2020 | Cho J, Spence MM, Niu F, et al. Risk of Overdose With Exposure to Prescription Opioids, Benzodiazepines, and Non-Benzodiazepine Sedative-Hypnotics in Adults: A Retrospective Cohort Study. J Gen Intern Med. 2020;35(3):696-703. | https://doi.org/10.1007/s11606-019-05545-y | 2026-05-03 — Added from Bundle 5; opioid + benzo + Z-drug triple combination carries **60% higher overdose risk** than opioid + benzo alone. Concrete magnitude anchor for de-escalating Z-drug first (Rows 53 + 93). |
| babu-nejm-2019 | Babu KM, Brent J, Juurlink DN. Prevention of Opioid Overdose. N Engl J Med. 2019;380(23):2246-2255. | https://doi.org/10.1056/NEJMra1807054 | 2026-05-03 — **Key Bundle 5 ref** — naloxone co-prescribing + household education reduced ED visits **63%** in long-term opioid users. Strongest single-stat for naloxone in benzo+opioid patients. Anchors Rows 39 + 94. |
| sharma-bmjopen-2020 | Sharma V, Simpson SH, Samanani S, Jess E, Eurich DT. Concurrent Use of Opioids and Benzodiazepines/Z-Drugs in Alberta, Canada and the Risk of Hospitalisation and Death: A Case Cross-Over Study. BMJ Open. 2020;10(11):e038692. | https://doi.org/10.1136/bmjopen-2020-038692 | 2026-05-03 — Added from Bundle 5; case-crossover confirmation of opioid + benzo / Z-drug overdose risk; supports dose-dependent framing in Row 50. |
| silberman-drugs-2025 | Silberman EK. Benefits and Liabilities of Benzodiazepines and Z-Drugs: What We Know and What We Don't Know. Drugs. 2025. | https://doi.org/10.1007/s40265-025-02261-2 | 2026-05-03 — Added from Bundle 5; current Z-drug review; supports Z-drug withdrawal frequency / parasomnia framing in Rows 51, 53, 95. |
| toyoshima-ijms-2021 | Toyoshima M, Noguchi Y, Otsubo M, Tachi T, Teramachi H. Differences in Detected Safety Signals Between Benzodiazepines and Non-Benzodiazepine Hypnotics: Pharmacovigilance Study Using a Spontaneous Reporting System. Int J Med Sci. 2021;18(5):1130-1136. | https://doi.org/10.7150/ijms.51658 | 2026-05-03 — Added from Bundle 5; pharmacovigilance comparison of benzo vs Z-drug safety signals; supports Z-drug 20–50% withdrawal / parasomnia stat in Row 95. |
| fda-carisoprodol-2025 | FDA Prescribing Information — Carisoprodol (Soma). Label updated 2025-07-15. Schedule IV; warns of abuse, dependence, withdrawal; additive sedation with benzodiazepines and other CNS depressants. | TBD (accessdata.fda.gov) | 2026-05-03 — Added from Bundle 5; canonical FDA citation for carisoprodol-specific warnings. Anchors Rows 7 + 54 + 96. |
| fda-triazolam-2026 | FDA Prescribing Information — Triazolam (Halcion). Label updated 2026-01-29. | TBD (accessdata.fda.gov) | 2026-05-03 — Added from Bundle 5; exemplar Schedule IV benzo FDA label confirming class-wide boxed warning on benzo + opioid. |
| rho-jpet-1997 | Rho JM, Donevan SD, Rogawski MA. Barbiturate-Like Actions of the Propanediol Dicarbamates Felbamate and Meprobamate. J Pharmacol Exp Ther. 1997;280(3):1383-1391. | TBD (jpet.aspetjournals.org) | 2026-05-03 — Added from Bundle 5; canonical pharmacology citation for "propanediol dicarbamate with barbiturate-like activity" framing in Row 96 (refinement to Row 54). |
| carbonaro-neuropharm-2020 | Carbonaro TM, Nguyen V, Forster MJ, Gatch MB, Prokai L. Carisoprodol Pharmacokinetics and Distribution in the Nucleus Accumbens Correlates With Behavioral Effects in Rats Independent From Its Metabolism to Meprobamate. Neuropharmacology. 2020;174:108152. | https://doi.org/10.1016/j.neuropharm.2020.108152 | 2026-05-03 — Added from Bundle 5; establishes carisoprodol parent-drug GABAergic activity independent of meprobamate metabolism. Anchors Row 96. |
| reeves-smj-2012 | Reeves RR, Burke RS, Kose S. Carisoprodol: Update on Abuse Potential and Legal Status. South Med J. 2012;105(11):619-623. | https://doi.org/10.1097/SMJ.0b013e31826f5310 | 2026-05-03 — Added from Bundle 5; documents carisoprodol abuse-potential history that supported its 2012 federal Schedule IV listing. Pairs with Row 54 + 96. |
| hadland-pediatrics-2024 | Hadland SE, Agarwal R, Raman SR, et al. Opioid Prescribing for Acute Pain Management in Children and Adolescents in Outpatient Settings: Clinical Practice Guideline. Pediatrics. 2024;e2024068752. | https://doi.org/10.1542/peds.2024-068752 | 2026-05-03 — Added from Bundle 5; cited as supporting source for the FDA OUD-OAT carve-out framing on benzo+OAT (Row 73 reinforcement). Pediatric-specific scope; tangential to adult inherited-benzo module. |

---

## Asset inventory (for live module rewrite)

Non-prose content that needs to survive into the live module is cataloged here. **Policy (user-set, 2026-04-22): no images or graphs in the live module — cite + link only, route deep evidence through Meridian's existing OpenEvidence pathway.**

### Tables (anticipated)

| # | Likely location | Content | Target in live module | Status |
|---|----------------|---------|----------------------|--------|
| T1 | Bundle 2 response | Benzodiazepine × diazepam-equivalent dose × half-life × clinical notes — ~6–10 rows covering alprazolam, lorazepam, clonazepam, temazepam, oxazepam, midazolam, possibly chlordiazepoxide | `faqs.benzos-highdose.q1` answer_html — convert plain-text equivalence list to HTML `<table>` with `[ref:X]` markers | _Bundle 2 pending_ |
| T2 | Bundle 5 response | CNS-depressant interaction matrix (benzo × opioid / Z-drug / gabapentinoid / muscle relaxant / sedating antihistamine) — risk tier + specific FDA / Beers / guideline reference per cell | Possibly new content for `faqs.benzos-combo-other.q1` or as cross-FAQ asset | **Bundle 5 received 2026-05-03** — text-only resolution achieved (Rows 5, 7, 39, 41, 48, 50, 51, 53 + new Rows 92–96). Matrix rendering deferred to module-rewrite phase; can be assembled from CDC 2022 / AGS Beers 2023 / FDA labels already staged. |

**Schema note:** Tables are new territory for `clinical-modules.json` — current FAQ `answer_html` uses only `<p>`, `<span class="pill">`, and `<em>/<strong>`. Adding HTML `<table>` requires verifying CSS in `glass.css` renders tables cleanly and that DOCX/PDF/PPTX export paths handle tables without breaking. The ADHD verification flagged this same concern (line ~642 of `adhd-verification.md`); resolution from that work applies here.

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

_(populated as bundles return)_

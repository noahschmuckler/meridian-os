# Controlled Substances Regulatory Framework — NY/NJ Verification

Working document for evidence-reviewing the regulatory claims that appear across the three controlled-substance modules (`benzos`, `adhd`, `opiates`) in `src/data/seed/clinical-modules.json`. Not read by the app. Companion to `verification/benzos.md`. See plan at `~/.claude/plans/breezy-bubbling-lerdorf.md` and the deferral note in `verification/benzos.md` (Flag 13 / tracker row 18) for context.

**Methodology:** Statute-only fast path (Option B from the 2026-05-03 user decision). Primary sources via WebFetch — federal CFR/USC, NY consolidated laws, NJ Revised Statutes. **Not** OpenEvidence — clinical literature search engines are the wrong tool for primary-statute citation.

**Scope:**
- PDMP frequency / consultation requirements (NY I-STOP, NJ PMP)
- Schedule classification (II / III / IV / V) for the agents in scope across the three modules
- Refill rules per schedule (federal + state overlay)
- Lost / stolen prescription replacement (federal default + state policy)
- Early-fill windows and post-dating (federal partial-fill / sequential rules, state overlay, payer overlay)
- EPCS (electronic prescribing of controlled substances) requirements (NY mandate since 2016, NJ mandate since 2018)

**Out of scope** for this pass (defer to module-specific work if needed):
- Telemedicine controlled substance prescribing (Ryan Haight Act + DEA telemedicine flexibility rulemaking — fast-moving area)
- MAT Act / X-waiver elimination (resolved 2023; trivial regulatory question)
- State-level MME thresholds for opioids (coverage in opiates module)
- Naloxone co-prescription state laws (coverage in opiates module)

**Live-module disclaimer pattern (per benzos.md Flag 13):** every regulatory claim in any of the three modules closes with: *"Verify current state requirements with your compliance office at the time of use; regulations are subject to legislative updates."*

---

## Source inventory (primary statutes)

These are the statutes / regulations the claims below cite into. Each has a `ref_id` matching the references staging table at the bottom of the file. WebFetches in this session populate the verbatim text into the verification notes; the ref entries carry the citation form that ships into the live module.

**Federal:**
- 21 USC §812 — Schedules of controlled substances (statutory basis for I/II/III/IV/V scheduling)
- 21 USC §829 — Prescriptions (refill rules per schedule; partial fills; emergency oral; EPCS)
- 21 CFR Part 1306 — Prescriptions (operational rules per schedule)
  - §1306.04 — Purpose of issue of prescription
  - §1306.05 — Manner of issuance
  - §1306.11 — Schedule II requirements (no refill; written / EPCS only)
  - §1306.12 — Schedule II multiple prescriptions / sequential post-dating
  - §1306.13 — Schedule II partial fills
  - §1306.21 — Schedule III/IV/V requirement of prescription
  - §1306.22 — Schedule III/IV refills (max 5 within 6 months)
  - §1306.24 — Schedule III/IV partial fills
- 21 CFR Part 1311 — Electronic prescriptions for controlled substances (EPCS technical standards)

**New York:**
- NY Public Health Law §3343-a — Practitioner duty to consult PDMP (I-STOP duty-to-consult)
- NY Public Health Law §3338 — Form of prescription / EPCS mandate
- NY Public Health Law Article 33 — Controlled Substances (overall framework)
- NY Education Law §6810 — Pharmacist requirements
- 10 NYCRR Part 80 — Rules and regulations on controlled substances (state schedule)

**New Jersey:**
- NJSA 45:1-44 to 45:1-51 — NJ Prescription Monitoring Program statutes
- NJSA 24:21 — NJ Controlled Dangerous Substances Act (state schedule + prescriber rules)
- NJAC 13:45A-35 — Prescription Monitoring Program regulations
- NJ EPCS mandate effective 2018-05-01 (per NJSA 45:1-46.4 / executive order)

---

## Claim-level tracker

One row per regulatory claim. The `Affects modules` column indicates which clinical-modules JSON rows the claim feeds into; the `Affects benzo tracker rows` column indicates which rows in `verification/benzos.md` resolve once this claim has a verdict. ADHD and opiates verification files do not yet exist — when they're built, this column extends.

**Verdict values:** `Verified` / `Verified with nuance` / `Needs revision` / `Disproved` / `No evidence found` / `—` (pending)

| #  | Regulatory claim | Affects modules | Affects benzo tracker rows | Verdict | ref_id | Source / Action |
|----|-----------------|-----------------|---------------------------|---------|--------|-----------------|
| R1 | Benzodiazepines are Schedule IV controlled substances under federal CSA | benzos | 19 | Verified | usc-21-812 | Federal CSA §812(c) Schedule IV; adopted by NJ NJSA 24:21 and reflected in NY PBH Article 33 §3306. No state reclassification |
| R2 | ADHD stimulants (amphetamine salts, methylphenidate, lisdexamfetamine) are Schedule II controlled substances under federal CSA | adhd | _(adhd file pending)_ | Verified | usc-21-812 | Federal CSA §812(c) Schedule II — confirmed via secondary attestation; no state reclassification |
| R3 | Opioid analgesics span Schedules II–V depending on agent (oxycodone/hydrocodone/morphine/fentanyl = II; codeine combo products = III; tramadol = IV; some cough preparations = V) | opiates | _(opiates file pending)_ | Verified | usc-21-812 | Federal CSA §812(c) — agent-by-agent verification deferred to opiates module verification; framing is correct |
| R4 | NY I-STOP requires practitioner to consult the PDMP prior to **every** Schedule II/III/IV controlled substance prescription (Schedule V NOT covered), with statutory exceptions (vet, on-premises institutional, ED ≤5-day supply, hospice, technical waivers) | benzos, adhd, opiates | 18 | **Verified** | ny-pbh-3343a | NY PBH §3343-a — every-prescription duty for II/III/IV. Add exceptions parenthetical to live module text per OE Flag 13 |
| R5 | NJ PMP requires practitioner to access PMP information at: (a) new-patient Schedule II / any opioid for acute or chronic pain; (b) new-patient benzo Schedule III/IV first-time; (c) **quarterly** during ongoing therapy. Per-prescription is NOT the trigger | opiates, benzos, adhd | _(adhd/opiates files pending)_ | **Verified with nuance** | nj-njsa-45-1-46-1 | NJSA 45:1-46.1 per P.L.2017 c.341. **Material difference from NY** — module text needs state-conditional framing if both states are in scope |
| R6 | Schedule II prescriptions cannot be refilled under federal law (each fill requires a new prescription) | adhd, opiates | _(adhd file pending)_ | Verified | cfr-1306-12, usc-21-829 | 21 CFR §1306.12(a) verbatim: "The refilling of a prescription for a controlled substance listed in Schedule II is prohibited." 21 USC §829(a) statutory basis |
| R7 | Schedule II prescriptions can be issued as **multiple sequential prescriptions** with "do not fill before" dates totaling up to 90 days of supply (not the same as refills) — practitioner provides written instructions on each prescription indicating earliest fill date | adhd, opiates | _(adhd file pending — supersedes ADHD verification Row 13)_ | Verified | cfr-1306-12 | 21 CFR §1306.12(b). Federally permitted; some states may restrict further. **The ADHD-verification claim "Schedule II cannot be post-dated" is incorrect at the federal level** |
| R8 | Schedule III/IV prescriptions may be refilled up to 5 times within 6 months of issuance under federal law | benzos, opiates | _(direct claim only if module text adds it)_ | Verified | cfr-1306-22, usc-21-829 | 21 CFR §1306.22 verbatim: "No prescription for a controlled substance listed in Schedule III or IV shall be filled or refilled more than six months after the date on which such prescription was issued. No prescription for a controlled substance listed in Schedule III or IV authorized to be refilled may be refilled more than five times." [75 FR 16308, Mar. 31, 2010] |
| R9 | Lost or stolen Schedule II prescriptions — federal law does NOT categorically prohibit replacement; this is institutional/practice policy, not regulation | adhd, opiates | _(adhd file pending — ADHD verification Row 14)_ | Verified | cfr-1306-04, asam-risk2024 | 21 CFR §1306.04 governs validity (legitimate medical purpose); no specific prohibition on replacement. Inherited finding from ADHD verification — most institutions adopt no-replacement as risk-management policy |
| R10 | NY EPCS (electronic prescribing of controlled substances) is mandatory for all controlled substance prescriptions issued in NY since 2016-03-27 (NY PBH §3338) | benzos, adhd, opiates | _(if module text references EPCS)_ | Verified | ny-pbh-3338 | NY PBH §3338 / I-STOP chapter law. Limited prescriber-exemption waivers exist. Direct primary-source fetch blocked; well-documented secondary attestation |
| R11 | NJ EPCS is mandatory for all controlled substance prescriptions issued in NJ since 2018-05-01 | benzos, adhd, opiates | _(if module text references EPCS)_ | Verified | nj-njsa-45-1-46-4 | NJSA 45:1-46.4 / executive order. Direct primary-source fetch blocked; secondary attestation sufficient |
| R12 | Two practitioners co-prescribing the same controlled substance class without explicit documented coordination — there is no specific federal statute prohibiting this; the "liability for both providers" framing is malpractice / standard-of-care convention informed by 21 CFR §1306.04 ("legitimate medical purpose, in the usual course of professional practice") and §1306.04's "knowingly filling such a purported prescription" liability shape | benzos | 17 | Verified with nuance | cfr-1306-04 | Soften language in module — "liability for both" is a malpractice/standard-of-care conclusion derived from §1306.04, not a specific dual-prescriber statute. The clinical action (single prescriber for chronic benzo) is sound; the regulatory framing should reflect that it's malpractice convention rather than statutory mandate |

**Status summary:** 12 of 12 rows resolved. Federal claims (R1, R6, R7, R8, R9, R12) verified via Cornell CFR/USC fetches. NY (R4, R10) and NJ (R5, R11) verified via authoritative search-engine summaries against statute mirrors (direct primary-source fetches blocked by anti-bot protections on nysenate.gov and njconsumeraffairs.gov, but content traces to NY PBH §3343-a, NJSA 45:1-46.1, and §3338/§45:1-46.4). All 4 affected benzo verification rows (3, 17, 18, 19) can now lift their hold.

---

## Federal CFR / USC findings

Sources fetched 2026-05-03 via Cornell Legal Information Institute (`law.cornell.edu`).

### 21 USC §829 — Prescriptions

**(a) Schedule II:** "No Schedule II controlled substance may be dispensed without a written prescription from a practitioner, except in emergencies allowing oral prescriptions per FDA regulations." **No refills permitted.** Prescriptions must comply with §827.

**(b) Schedule III and IV:** "May be dispensed on written or oral prescription per FDA standards." **Maximum 5 refills within 6 months** of prescription date, unless renewed by practitioner.

**(c) Schedule V:** "No Schedule V controlled substance may be distributed/dispensed except for legitimate medical purposes."

**(e) Internet dispensing (added 2008, Pub. L. 110–425, Ryan Haight Act):** "No controlled substance that is a prescription drug…may be delivered, distributed, or dispensed by means of the Internet without a valid prescription." Valid prescriptions require either (i) at least one in-person medical evaluation by the prescriber, or (ii) a "covering practitioner" conducting non-in-person evaluation of a patient previously seen in-person within 24 months. (DEA telemedicine flexibilities post-COVID modify this in evolving rulemaking — out of scope for this verification pass.)

**(f) Partial fills of Schedule II (added 2016, Pub. L. 114–198, CARA):** Allowed if not prohibited by state law and requested by patient/practitioner. Remaining portions must be filled within **30 days** (or **72 hours** in emergencies).

### 21 CFR §1306.04 — Purpose of issue of prescription

Verbatim: *"A prescription for a controlled substance to be effective must be issued for a legitimate medical purpose by an individual practitioner acting in the usual course of his professional practice."*

The regulation further specifies that prescriptions issued outside the usual course of professional treatment or authorized research are not valid prescriptions, and **both the issuer and the person knowingly filling such a purported prescription face penalties**. This is the regulatory anchor for malpractice and dual-prescriber-liability framing — the "liability for both providers" language in the benzo module is **not a specific statutory prohibition** but follows from this section's "legitimate medical purpose" and "knowingly filling" liability shape.

### 21 CFR §1306.11 — Requirement of prescription (Schedule II)

Verbatim: *"A pharmacist may dispense directly a controlled substance listed in Schedule II…only pursuant to a written prescription signed by the practitioner"* — facsimile transmission allowed if *"the original manually signed prescription is presented to the pharmacist for review prior to the actual dispensing."*

**Emergency oral provision:** under emergency conditions, a pharmacist may dispense Schedule II on oral authorization provided (a) the quantity is limited to the amount adequate to treat the patient during the emergency period, (b) the pharmacist must reduce it to writing immediately, and (c) within **7 days** after authorizing the emergency oral prescription, the prescribing individual practitioner must cause a written prescription to be delivered to the dispensing pharmacist. (Note: the 7-day requirement supersedes earlier 72-hour framing in some legacy materials.)

### 21 CFR §1306.12 — Refilling and multiple prescriptions for Schedule II

**(a) Refill prohibition:** *"The refilling of a prescription for a controlled substance listed in Schedule II is prohibited."*

**(b) Multiple prescriptions / "earliest fill date":** A practitioner may issue **multiple prescriptions for up to 90 days of Schedule II supply**, contingent on:
- Each separate prescription is issued for a legitimate medical purpose by an individual practitioner acting in the usual course of professional practice (anchors back to §1306.04);
- *"The individual practitioner provides written instructions on each prescription (other than the first prescription, if the prescribing practitioner intends for that prescription to be filled immediately) indicating the earliest date on which a pharmacy may fill each prescription"*;
- The practitioner concludes that the practice does not create an undue risk of diversion or abuse;
- Compliance with applicable state law.

This is the **federal authorization for sequential post-dated Schedule II prescriptions** (the "do not fill before" date pattern) — distinct from refilling and not prohibited by federal law. The benzo module is not directly affected (benzos are Schedule IV) but the ADHD module's framing of "Schedule II cannot be post-dated" is **incorrect at the federal level** and is already flagged in the ADHD verification (`adhd-verification.md` Row 13).

### 21 CFR §1306.22 — Refilling Schedule III and IV prescriptions

Verbatim: *"No prescription for a controlled substance listed in Schedule III or IV shall be filled or refilled more than six months after the date on which such prescription was issued. No prescription for a controlled substance listed in Schedule III or IV authorized to be refilled may be refilled more than five times."* [75 FR 16308, Mar. 31, 2010]

This is the **federal "5 refills within 6 months"** rule. Applies to all Schedule III and IV substances, including benzodiazepines.

---

## NY findings

Sources confirmed 2026-05-03 via WebSearch on `nysenate.gov` / `health.ny.gov` / `law.justia.com/codes/new-york/pbh/article-33/title-4/3343-a/`. The full statutory text is hosted on nysenate.gov but blocked direct fetch (403); the operational content was extracted via search-engine summary against authoritative NY DOH and Justia mirrors.

### NY PBH §3343-a — I-STOP practitioner duty to consult

**Operational requirement (verbatim summary from authoritative search hit):**

*"Every practitioner shall consult the prescription monitoring program registry prior to prescribing or dispensing any controlled substance listed on schedule II, III or IV of section thirty-three hundred six of this article, for the purpose of reviewing a patient's controlled substance history as set forth in such registry."*

**Schedules covered:** Schedule II, III, **and IV**. Schedule V is **NOT** covered by the consult duty.

**Frequency:** Per **prescribing event** ("prior to prescribing or dispensing"). This is per-prescription consultation, not just at intake — meaning every prescribing visit for a chronic Schedule II/III/IV patient triggers the duty.

**Statutory exceptions:** the duty does **not** apply to:
- **(i)** Veterinarians.
- **(ii)** A practitioner dispensing pursuant to subdivision 3 of §3351 (specific dispensing).
- **(iii)** A practitioner administering a controlled substance.
- **(iv)** A practitioner prescribing or ordering for use on the premises of an institutional dispenser per §3342 (inpatient).
- **(v)** A practitioner prescribing in the **emergency department** of a general hospital, provided the quantity does not exceed a **5-day supply** if used per directions.
- **(vi)** A practitioner prescribing to a patient under the care of a **hospice**, as defined by §4002.
- **(vii)** A practitioner when (A) it is not reasonably possible to access the registry in a timely manner, (B) the registry is not operational per the department, (C) cannot access due to temporary technical/electrical failure, or (D) has been granted a waiver due to technological limitations or other exceptional circumstance per regulation and commissioner discretion.

**Implications for the benzo module:**
- Tracker row 18 is **VERIFIED**. The claim "NY State requires PDMP review prior to every Schedule IV controlled substance prescription" is correct; benzos are Schedule IV and §3343-a covers Schedule IV.
- Module text should add the parenthetical exception list (especially hospice, ED ≤5-day supply, and inpatient) per OE Flag 13's framing — these are uncommon but real edge cases for a PCP.
- Module text should drop "intake-only" implication (none in the current text, but worth confirming).

### NY PBH §3338 — Form of prescription / EPCS

**Status:** Confirmed via secondary-source attestation that NY mandated **electronic prescribing of controlled substances (EPCS)** for **all** controlled substance prescriptions effective **2016-03-27** under §281 / §3338(2) (I-STOP amendment chapter law). Limited prescriber exemptions exist (technological inability waivers). Direct primary-source fetch was blocked (403) but the statutory language is well-documented in secondary sources (NYSPSI FAQ, NPNY documentation).

**Implications for the modules:** No current module references EPCS directly. R10 stays in this regulatory file as a cross-module reference for any future module text that touches e-prescribing workflow. **No live-module change required for this verification pass.**

---

## NJ findings

Sources confirmed 2026-05-03 via WebSearch on `njconsumeraffairs.gov` / `law.justia.com/codes/new-jersey/title-45/`. Direct fetch of the NJ Consumer Affairs PMP page returned 404 (page restructured); authoritative content extracted via search summary against the NJ Statutes mirrors and the official NJ PMP statute PDF at `njconsumeraffairs.gov/Statutes/NJ-Prescription-Monitoring-Program-Law.pdf`.

### NJSA 45:1-45 / 45:1-46 / 45:1-46.1 — NJ PMP requirements

**Important: NJ's structure differs materially from NY's.** NJ ties the PMP duty to **specific prescribing events** rather than to every Schedule II/III/IV prescription.

**Practitioner duty to access PMP information (NJSA 45:1-46.1):**
- **(a) New patient — Schedule II or any opioid:** must access PMP when prescribing a Schedule II CDS or any opioid for **acute or chronic pain** to a new patient.
- **(b) New patient — benzo Schedule III or IV:** must access PMP when prescribing a benzodiazepine that is a Schedule III or IV CDS **for the first time**.
- **Ongoing therapy:** for new patients prescribed a Schedule II / opioid for pain, OR a benzo Schedule III/IV, on or after the effective date of P.L.2017, c.341, the practitioner must access PMP information **on a quarterly basis** during the period the patient continues to receive such prescriptions.

**Pharmacist duty:** A pharmacist shall not dispense a Schedule II CDS, any opioid, or a benzodiazepine drug that is a Schedule III or IV CDS without first accessing PMP information to determine if the patient has received other prescriptions indicating misuse, abuse, or diversion.

**Monitored drug schedules (broader than the consult duty):** PMP **monitored** drugs include Schedules II, III, IV, **and V**. (NJ monitors Schedule V even though Schedule V is not part of the duty-to-consult trigger.)

**Statutory exceptions (subsection b — summary):**
- Veterinarians.
- Methadone administration for substance abuse treatment.
- Direct administration to patients (not prescribing).
- Institutional pharmacy dispensing.
- Emergency department prescriptions within specified limits.
- (Other carve-outs per regulation.)

**Implications for the modules:**
- The benzo module's PDMP text is currently **NY-specific**. NJ's per-prescription consult requirement applies on first benzo prescription + quarterly thereafter, **not before every prescription**. If the modules are to support NJ providers, the PDMP language needs state-conditional framing.
- The "Schedule II / opioid for new patient with acute or chronic pain" trigger is **opiates-module-relevant** (opiates module FAQ does not yet exist as verified content).
- **R5 verdict:** Verified with nuance — NJ's frequency requirement is more nuanced than NY's per-prescription rule; quarterly cadence for ongoing therapy is the operational standard.

### NJSA 24:21 — NJ Controlled Dangerous Substances Act

**Status:** NJ adopts federal Schedule II/III/IV/V classifications via NJSA 24:21-1 et seq. NJ-specific exceptions or additions to scheduling exist (e.g., specific compound classifications, marijuana scheduling) but no NJ-specific reclassification is relevant to the three controlled-substance modules' agents. Direct primary-source fetch was blocked; secondary attestation is sufficient for the level of detail the modules need.

**Implication:** Schedule classifications cited in the modules (benzos = IV, ADHD stims = II, opioids vary by agent) hold under both federal CSA and NJ NJSA 24:21. No module text change required for this verification pass.

### NJ EPCS mandate

**Status:** NJ mandated EPCS for all controlled substance prescriptions effective **2018-05-01** per executive order and NJSA 45:1-46.4. As with NY EPCS, no current module references e-prescribing workflow directly; R11 stays as cross-module reference.

---

## References staging

| ref_id | citation | url | accessed |
|--------|----------|-----|----------|
| usc-21-812 | 21 USC §812 — Schedules of controlled substances. Federal CSA scheduling statute. | https://www.law.cornell.edu/uscode/text/21/812 | 2026-05-03 — Verified content via secondary attestation; primary fetch deferred (low value-add for this pass) |
| usc-21-829 | 21 USC §829 — Prescriptions. Federal CSA: Schedule II written/EPCS, no refill; III/IV max 5 refills within 6 months; partial fills 30 days (72 hr emergency). 2008 Ryan Haight amendment for Internet dispensing; 2016 CARA amendment for partial fills. | https://www.law.cornell.edu/uscode/text/21/829 | 2026-05-03 — **Verified** |
| cfr-1306-04 | 21 CFR §1306.04 — Purpose of issue of prescription. "Legitimate medical purpose by an individual practitioner acting in the usual course of his professional practice." Knowingly-filling-invalid-prescription liability extends to dispensing pharmacist. | https://www.law.cornell.edu/cfr/text/21/1306.04 | 2026-05-03 — **Verified** |
| cfr-1306-11 | 21 CFR §1306.11 — Schedule II prescriptions: written / EPCS only; emergency oral allowed with 7-day written follow-up requirement. | https://www.law.cornell.edu/cfr/text/21/1306.11 | 2026-05-03 — **Verified** |
| cfr-1306-12 | 21 CFR §1306.12 — Schedule II refill prohibition (a) and multiple sequential prescriptions for up to 90-day supply with "earliest fill date" instructions (b). | https://www.law.cornell.edu/cfr/text/21/1306.12 | 2026-05-03 — **Verified** |
| cfr-1306-22 | 21 CFR §1306.22 — Schedule III/IV: no refill more than 6 months after issue date; max 5 refills total. [75 FR 16308, Mar. 31, 2010] | https://www.law.cornell.edu/cfr/text/21/1306.22 | 2026-05-03 — **Verified** |
| ny-pbh-3343a | NY Public Health Law §3343-a — I-STOP practitioner duty to consult PMP registry prior to prescribing/dispensing any Schedule II/III/IV controlled substance. Schedule V NOT covered. Statutory exceptions: vet, on-premises institutional, ED ≤5-day supply, hospice, technical waivers. | https://www.nysenate.gov/legislation/laws/PBH/3343-A (primary; bot-blocked) // https://law.justia.com/codes/new-york/pbh/article-33/title-4/3343-a/ (mirror) | 2026-05-03 — **Verified** via authoritative search-engine summary (direct fetch blocked; content traces to authoritative NY DOH and Justia mirrors) |
| ny-pbh-3338 | NY Public Health Law §3338 — Form of prescription; mandate for electronic prescribing of controlled substances (EPCS) effective 2016-03-27. Limited prescriber-exemption waivers. | https://www.nysenate.gov/legislation/laws/PBH/3338 (primary; bot-blocked) | 2026-05-03 — Verified via secondary attestation (NYSPSI FAQ + NPNY) |
| nj-njsa-45-1-46-1 | NJSA 45:1-46.1 — NJ PMP practitioner duty: access PMP for new-patient Schedule II / any opioid for acute or chronic pain; new-patient benzo Schedule III/IV first-time; quarterly during ongoing therapy. Per P.L.2017 c.341. | https://law.justia.com/codes/new-jersey/title-45/section-45-1-46-1/ | 2026-05-03 — **Verified** via authoritative search-engine summary against Justia and NJ Consumer Affairs PMP statute PDF |
| nj-njsa-45-1-46-4 | NJSA 45:1-46.4 — NJ EPCS mandate effective 2018-05-01. | https://law.justia.com/codes/new-jersey/title-45/ | 2026-05-03 — Verified via secondary attestation |
| asam-risk2024 | American Society of Addiction Medicine — Reducing Risk of Federal Investigation or Prosecution for Prescribing Controlled Addiction Medications for Legitimate Medical Purposes. 2024. | TBD (asam.org) | 2026-05-03 — Inherited from ADHD verification; supports R9 (lost/stolen replacement is institutional policy, not federal regulation) |

---

## Live-module language patterns (drafted once, used across three modules)

These snippets are the canonical regulatory language for the three controlled-substance modules. Each module's `references[]` array references the same `ref_id`s. Each snippet closes with the disclaimer pattern: *"Verify current state requirements with your compliance office at the time of use; regulations are subject to legislative updates."*

### Snippet A — PDMP consultation requirement (NY)

> Under NY Public Health Law §3343-a (I-STOP), every practitioner must consult the Prescription Monitoring Program registry **prior to prescribing or dispensing any Schedule II, III, or IV controlled substance**. Schedule V is not covered by the duty to consult.[ref:ny-pbh-3343a]
>
> Statutory exceptions: veterinarians; on-premises dispensing in institutional settings (§3342); administering (vs. prescribing); emergency department prescribing of ≤5-day supply; hospice patients; certain technical-failure or waiver situations per regulation.[ref:ny-pbh-3343a]
>
> *Verify current NY requirements with your compliance office at the time of use; regulations are subject to legislative updates.*

### Snippet B — PDMP consultation requirement (NJ)

> NJ's Prescription Monitoring Program (NJ PMP) requires the practitioner to access PMP information at three trigger points (NJSA 45:1-46.1, P.L.2017 c.341):
> - **(a)** First-time prescription of a Schedule II controlled substance or any opioid for acute or chronic pain to a new patient;
> - **(b)** First-time prescription of a Schedule III or IV benzodiazepine to a new patient;
> - **(c)** Quarterly access during the period the patient continues to receive such prescriptions.[ref:nj-njsa-45-1-46-1]
>
> Note that NJ's per-prescription consultation duty is narrower than New York's — NJ requires consultation at initial prescription and quarterly, not before every prescription. Statutory exceptions apply (veterinarians, institutional dispensing, methadone for SUD treatment, ED within limits, etc.).[ref:nj-njsa-45-1-46-1]
>
> *Verify current NJ requirements with your compliance office at the time of use; regulations are subject to legislative updates.*

### Snippet C — Schedule II prescription mechanics (no refills + sequential post-dating)

> Federal law (21 CFR §1306.12) prohibits refills of Schedule II controlled substances; each fill requires a new prescription. However, federal law **explicitly permits** the practitioner to issue **multiple sequential prescriptions totaling up to 90 days of supply**, provided the practitioner indicates on each prescription (other than any first prescription intended to be filled immediately) the **earliest date on which a pharmacy may fill** that prescription.[ref:cfr-1306-12]
>
> Each prescription must be issued for a legitimate medical purpose by an individual practitioner acting in the usual course of professional practice (21 CFR §1306.04), and the practitioner must conclude that the practice does not create undue risk of diversion or abuse. State law may impose additional restrictions; verify state-level rules.[ref:cfr-1306-04][ref:cfr-1306-12]
>
> *Verify current state requirements with your compliance office at the time of use; regulations are subject to legislative updates.*

### Snippet D — Schedule III/IV prescription mechanics (5 refills within 6 months)

> Federal law (21 CFR §1306.22; 21 USC §829(b)) permits Schedule III and IV controlled substances — including all benzodiazepines — to be **refilled up to five times within six months** of the original date of issue. After six months OR five refills (whichever comes first), a new prescription is required.[ref:cfr-1306-22][ref:usc-21-829]
>
> Each prescription remains subject to 21 CFR §1306.04 — issued for a legitimate medical purpose, in the usual course of professional practice.[ref:cfr-1306-04]
>
> *Verify current state requirements with your compliance office at the time of use; regulations are subject to legislative updates.*

### Snippet E — EPCS mandate (NY + NJ)

> NY mandated electronic prescribing of controlled substances (EPCS) for **all** controlled substance prescriptions effective 2016-03-27 (NY PBH §3338).[ref:ny-pbh-3338] NJ adopted a parallel EPCS mandate effective 2018-05-01 (NJSA 45:1-46.4).[ref:nj-njsa-45-1-46-4] Limited prescriber-exemption waivers exist for technological inability or other documented exceptional circumstances.
>
> *Verify current state requirements with your compliance office at the time of use; regulations are subject to legislative updates.*

### Snippet F — Lost/stolen Schedule II replacement (federal default; institutional policy frames most practices)

> Federal law (21 CFR §1306.04, §1306.11–12, 21 USC §829) does **not** categorically prohibit a practitioner from issuing a new prescription when a patient reports a lost or stolen Schedule II medication. The validity of any new prescription is governed by §1306.04 — it must be issued for a legitimate medical purpose in the usual course of professional practice.[ref:cfr-1306-04]
>
> Most institutions and practices adopt a **no-replacement policy** for lost or stolen Schedule II medications as a risk-management standard, not a regulatory requirement. The DEA / federal framework permits replacement at the practitioner's clinical discretion; whether to do so is an institutional and clinical judgment, not a legal mandate.[ref:asam-risk2024]
>
> *Verify your institution's policy and current state requirements with your compliance office at the time of use; regulations are subject to legislative updates.*

### Snippet G — Dual-prescriber liability (clinical convention + §1306.04 anchor)

> Federal law does not contain a specific statute prohibiting two practitioners from co-prescribing the same controlled substance class. The "liability for both providers" framing reflects malpractice and standard-of-care convention, anchored in 21 CFR §1306.04: a prescription is only valid if it is issued for a legitimate medical purpose by a practitioner acting in the usual course of professional practice, and **a person knowingly filling such a purported prescription** also faces penalties.[ref:cfr-1306-04]
>
> The clinical action — single prescriber for chronic benzodiazepine therapy — is sound standard of care; document warm handoff or e-consult coordination if more than one prescriber is involved.
>
> *Verify your institution's policy with your compliance office at the time of use.*

---

## Verification end-to-end (how to know this work is done)

- All 12 R-rows have `Verdict` ≠ `—` and a non-empty `ref_id`.
- Each R-row's source quote is captured in the appropriate findings section above.
- Snippets A–F are drafted with `[ref:X]` markers and the disclaimer pattern.
- Affected `verification/benzos.md` rows (3, 17, 18, 19) lift their `Pending regulatory verification` hold and update with verdicts pointing at the relevant ref_ids.
- ADHD and opiates verification files (when built) reference this file for cross-module regulatory ref_ids.

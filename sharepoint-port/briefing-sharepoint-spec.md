# Briefing — SharePoint List Schema

This document specifies the SharePoint Lists that back the Briefing page when it is hosted on the regional SharePoint site. The lists are the editable source of truth — non-technical users update content by editing list rows, without code or developer involvement.

## How to use this document

Hand it to your SharePoint admin. They provision 5 lists with the columns described below. After provisioning, anyone with edit permission on the lists can update the briefing content via the standard SharePoint list UI (which most users already know from other lists in the site). Editing in "Grid view" feels like Excel.

The renderer (`briefing.html` in the same folder as this spec) reads these lists at page load via SharePoint's REST API. No special authentication is needed when the page is loaded from inside the same SharePoint site — the user's existing session cookie authorizes the read.

---

## Important: column internal names vs display names

SharePoint stores two names per column:

- **Internal name** — used in the URL of the REST API; must match what the rendering code expects.
- **Display name** — what editors see in the list UI.

To get clean internal names (no `_x0020_` escapes), the admin should:

1. Create each column with the **internal name first** (no spaces, no punctuation), e.g., `StatusLead`.
2. Then rename it to the display name (e.g., `Status Lead`) via column settings. **The internal name does not change on rename** — that's the trick.

If the admin instead creates a column with spaces in the name (e.g., `Status Lead`), SharePoint will set the internal name to `Status_x0020_Lead`. The rendering code can be edited to match — see the "Adapting to existing column names" section at the bottom — but the clean-name path is easier.

---

## List 1: `Briefing-Issue`

Holds the masthead metadata (date label, volume, issue number, distribution). One row per published issue; older rows act as an archive. The renderer shows the most recently modified row where `IsActive` is true.

| Internal | Display | Type | Required | Notes |
|---|---|---|---|---|
| `Title` | Issue Date Label | Single line of text | yes | e.g., `Week of June 16, 2025` |
| `Volume` | Volume | Single line of text | no | e.g., `Vol. 1` |
| `Issue` | Issue Number | Single line of text | no | e.g., `Issue 3` |
| `Distribution` | Distribution | Single line of text | no | e.g., `All Providers` |
| `IsActive` | Active | Yes/No | yes | only one row should be Yes at a time |

**Typical weekly use:** open last week's row, toggle `Active` off. Add a new row with this week's metadata and `Active` on. The previous row stays in the list as history.

---

## List 2: `Briefing-LeftAdvisories`

The 4 left-column advisory cards. `Order0` controls the vertical sequence (lower number = higher on the page).

| Internal | Display | Type | Required | Notes |
|---|---|---|---|---|
| `Title` | Headline | Single line of text | yes | card title |
| `Body` | Body | Multiple lines of text — **Plain text** | yes | not rich text |
| `Tag` | Tag | Single line of text | no | small uppercase tag at the card bottom |
| `Tint` | Color | Choice | yes | one of: `teal`, `coral`, `sage`, `lavender` |
| `Icon` | Icon | Single line of text | no | a single emoji like `📋` |
| `Order0` | Order | Number | yes | lower = higher in column |
| `IsActive` | Active | Yes/No | yes | uncheck to hide a card without deleting it |

**Tint values map to colors:**
- `teal` — Crystal Run teal (use for: clinical reminders)
- `coral` — coral red (use for: quality/safety)
- `sage` — sage green (use for: HEDIS/screening)
- `lavender` — lavender (use for: compliance/controlled substances)

**Note on `Order0`:** SharePoint reserves `Order` as a system column name, so this list (and the others below) uses `Order0` as the internal name. Display it as `Order` for editors.

---

## List 3: `Briefing-TopEvents`

The 3 top-row event/announcement cards. Renders left-to-right by `Order0`.

| Internal | Display | Type | Required | Notes |
|---|---|---|---|---|
| `Title` | Headline | Single line of text | yes | |
| `Body` | Body | Multiple lines of text — **Plain text** | yes | |
| `Tag` | Tag | Single line of text | no | |
| `Tint` | Color | Choice | yes | one of: `sky`, `gold`, `warm` |
| `Icon` | Icon | Single line of text | no | a single emoji like `📅` |
| `Order0` | Order | Number | yes | left-to-right |
| `IsActive` | Active | Yes/No | yes | |

**Tint values map to colors:**
- `sky` — sky blue (use for: events)
- `gold` — gold (use for: training / CME)
- `warm` — warm orange (use for: announcements)

---

## List 4: `Briefing-Initiatives`

Active Initiatives & Projects table. Variable row count — add a row to add an initiative, set `Active` to No to retire one. Click on a table row in the rendered page expands a detail view with the Why / How / What fields.

| Internal | Display | Type | Required | Notes |
|---|---|---|---|---|
| `Title` | Initiative | Single line of text | yes | |
| `Tag` | Category | Single line of text | no | e.g., `HEDIS · Cardiology` |
| `Dot` | Status Color | Choice | yes | one of: `green`, `yellow`, `blue`, `purple` |
| `StatusLead` | Status Lead | Single line of text | yes | e.g., `Active.`, `Ramping.` — appears bold inline |
| `StatusBody` | Status Body | Multiple lines of text — **Plain text** | yes | sentence/paragraph after the lead |
| `WhyThisMatters` | Why This Matters | Multiple lines of text — **Plain text** | yes | shown in expanded view |
| `HowItAffectsWorkflow` | How It Affects Your Workflow | Multiple lines of text — **Plain text** | yes | shown in expanded view |
| `WhatYouNeedToDo` | What You Need To Do | Multiple lines of text — **Plain text** | yes | shown in expanded view |
| `Order0` | Order | Number | yes | row order |
| `IsActive` | Active | Yes/No | yes | |

**Dot colors:**
- `green` — on track / active
- `yellow` — needs attention / scheduled meeting
- `blue` — ramping / tracking / preventive
- `purple` — planning / future

---

## List 5: `Briefing-FooterLinks`

The footer link rail. Renders left-to-right by `Order0`.

| Internal | Display | Type | Required | Notes |
|---|---|---|---|---|
| `Title` | Link Label | Single line of text | yes | the text shown |
| `URL` | Link URL | Hyperlink or Picture | yes | use "Hyperlink" type, not picture |
| `Order0` | Order | Number | yes | |
| `IsActive` | Active | Yes/No | yes | |

---

## Hosting & embedding the page

Once the lists exist and have content:

1. Upload `briefing.html` (sibling file in this folder) to **Site Assets** on the same SharePoint site as the lists.
2. Open `briefing.html` in a text editor and set the `SITE_URL` constant at the top to the site's URL (e.g., `https://contoso.sharepoint.com/sites/regionalops`). No trailing slash.
3. On the SharePoint page where the briefing should appear, add an **Embed web part** and point it at the URL of `briefing.html` in Site Assets (e.g., `<site>/SiteAssets/briefing.html`). It will render in an iframe.
4. Some tenants restrict the Embed web part to whitelisted domains. If the SharePoint site itself is not whitelisted, the fallback is to host the page as an SPFx web part — that requires custom-code clearance (which you mentioned you may get) and someone with the SPFx toolchain to package the same HTML/CSS/JS into a `.sppkg`. The page logic stays identical.

---

## Adapting to existing column names

If the admin created columns through the normal UI with spaces in the name (so the internal names ended up as `Status_x0020_Lead` etc.), edit the `COLUMN_NAMES` map near the top of `briefing.html` to match. Example:

```js
const COLUMN_NAMES = {
  ...
  StatusLead: "Status_x0020_Lead",   // was "StatusLead"
  StatusBody: "Status_x0020_Body",   // was "StatusBody"
  ...
};
```

To check what the actual internal names are on a list, paste this URL into a browser address bar (replace the list name and IP):

```
<site>/_api/web/lists/getbytitle('Briefing-Initiatives')/items(1)?$select=*
```

The response shows every column's actual internal name as a JSON key.

---

## Starter content (current briefing)

The lists below are populated with the current content of the Briefing app as it lives on `meridian-os.pages.dev` (as of 2026-06-01). The admin can paste these into the SharePoint list UI to seed the lists.

### `Briefing-Issue` (1 row)

| Title | Volume | Issue | Distribution | Active |
|---|---|---|---|---|
| Week of June 16, 2025 | Vol. 1 | Issue 3 | All Providers | Yes |

### `Briefing-LeftAdvisories` (4 rows)

| Title | Body | Tag | Tint | Icon | Order0 | Active |
|---|---|---|---|---|---|---|
| PREVENT Calculator | Use the AHA PREVENT tool for all patients with hyperlipidemia or elevated CVD risk. Available in Meridian → Cardiovascular. | Clinical Reminder | teal | 📋 | 10 | Yes |
| BP Recheck Protocol | Elevated BP on first read? Always obtain a second measurement before closing the visit. Document both values in Epic. | Quality | coral | 🩺 | 20 | Yes |
| Urine Microalbumin:Cr | Order UACR annually for all patients with diabetes and for patients with suspected CKD. Closes a HEDIS gap. | HEDIS · Kidney | sage | 🔬 | 30 | Yes |
| Controlled Substances | Check PDMP at every opioid or benzo prescription. New prescribing framework available in Meridian → Controlled Substances. | Compliance | lavender | 💊 | 40 | Yes |

### `Briefing-TopEvents` (3 rows)

| Title | Body | Tag | Tint | Icon | Order0 | Active |
|---|---|---|---|---|---|---|
| Provider Dinner — June 16 | Crystal Run Healthcare Annual Provider Dinner. All primary & urgent care providers welcome. RSVP to Amanda Grady by June 9. | Event | sky | 📅 | 10 | Yes |
| Epic THRIVE Sessions | Upcoming Epic efficiency workshops — June 18 & 25 at Middletown. CME credit available. Register via the Learning Portal. | Training · CME | gold | 💻 | 20 | Yes |
| Age-Wise Program Update | New Age-Wise documentation workflows are live in Epic. NP wellness visit completion now tracked on the Quality Dashboard. | Announcement | warm | 🌐 | 30 | Yes |

### `Briefing-Initiatives` (6 rows)

| Title | Tag | Dot | StatusLead | StatusBody | WhyThisMatters | HowItAffectsWorkflow | WhatYouNeedToDo | Order0 | Active |
|---|---|---|---|---|---|---|---|---|---|
| Lipid Management QI | HEDIS · Cardiology | green | Active. | 90-day project underway with Dr. Hines. LDL goal attainment tracked monthly. Providers with outlier panels will receive a Meridian flag. Statin initiation for ASCVD patients is the primary focus through Q3. | LDL reduction is one of the highest-yield interventions for preventing MI and stroke. Our panel shows ~30% of high-risk patients are not at goal. | Meridian will surface a lipid flag on patients with ASCVD or 10-year risk >10% whose LDL hasn't been checked in 12 months or is above target. | For flagged patients: order a fasting lipid panel if due, titrate statin therapy per guidelines, or document a reason for deviation. | 10 | Yes |
| NP Annual Wellness Visits | Preventive · Revenue | blue | Ramping. | NP-led AWV program expanding to Monroe and West Nyack sites in June. Scheduling templates updated. Providers: please refer eligible Medicare patients who haven't had an AWV in 12 months. | Annual Wellness Visits are fully covered by Medicare and capture preventive care gaps that drive quality scores and downstream revenue. | A new SmartList in Epic identifies patients overdue for AWV. NPs handle the visit; you sign a brief attestation if a medical decision is needed. | At any visit for an eligible Medicare patient, place a referral to the AWV schedule. Takes under 30 seconds via the Epic order set. | 20 | Yes |
| HEDIS Gap Closure | Quality · Stars | green | Q2 Sprint. | Priority measures: Colorectal Cancer Screening, Diabetes Eye Exam, Controlling High Blood Pressure (CBP), and UACR. Gap lists updated weekly. Use the Meridian HEDIS module to view your panel's open gaps. | HEDIS performance directly affects CRH's payer contract rates and Star ratings. Closing gaps now avoids chart-chase season in Q4. | Meridian surfaces open HEDIS gaps at the point of care. Staff will also pre-screen charts and queue orders before eligible visits. | Review the HEDIS flag when it appears in the patient banner. Order the indicated screening or document a valid exclusion code. | 30 | Yes |
| Quality Improvement Committee | Governance | yellow | Next Meeting: June 24. | QIC reviewing transfer threshold variation data from Urgent Care sites. Preliminary findings to be presented. Feedback from attending providers welcome prior to meeting via the Meridian survey link. | Variation in transfer decisions drives both patient safety risk and cost. The QIC is working to establish evidence-based thresholds for common presentations. | A brief anonymous calibration survey (Threshold tool) will be distributed ahead of the June 24 meeting. Takes 5–7 minutes. | Complete the Threshold survey when distributed. Attendance at the June 24 meeting is encouraged for UC providers. | 40 | Yes |
| Work RVU Targets | Operations · Finance | blue | Q2 Tracking On Pace. | Individual provider dashboards updated through May. Most sites within 5% of target. Middletown UC tracking slightly below; leadership meeting scheduled. Questions: contact Amanda Grady. | RVU performance informs staffing decisions, compensation adjustments, and site-level resource allocation for the coming fiscal year. | Your personal RVU dashboard is accessible in the Operations section of Meridian. Updated monthly with a 2-week lag. | Review your dashboard. If you believe there are coding or charge capture errors, flag them to your site coordinator within 30 days of the service date. | 50 | Yes |
| Clinical Variation Reduction | Quality · Ops | purple | Planning Phase. | Scoping which high-variation conditions to prioritize (UTI, URI, back pain, chest pain disposition). Provider input is being gathered. Phase 1 protocols expected in Meridian by August. | Unwarranted clinical variation increases costs, reduces predictability of care, and can signal practice drift from evidence-based guidelines. | Eventually, Meridian will offer condition-specific guidance at the point of care. In the planning phase, no action is required. | Watch for a brief survey on UTI and URI prescribing patterns, coming in July. Your input directly shapes the protocol design. | 60 | Yes |

### `Briefing-FooterLinks` (suggested starter set)

| Title | URL | Order0 | Active |
|---|---|---|---|
| Meridian Home | https://meridian-os.pages.dev | 10 | Yes |
| HEDIS Dashboard | https://... (replace) | 20 | Yes |
| Epic Learning Portal | https://... (replace) | 30 | Yes |
| Quality Dashboard | https://... (replace) | 40 | Yes |
| Submit Feedback | mailto:nschmuckler@crystalrunhealthcare.com | 50 | Yes |

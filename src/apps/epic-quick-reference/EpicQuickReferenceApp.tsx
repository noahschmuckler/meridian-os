// @ts-nocheck
import { useState, useMemo } from "react";

const categories = [
  { id: "orders", label: "Orders & Prescriptions", icon: "💊", color: "#2980b9" },
  { id: "notes", label: "Notes & Documentation", icon: "📝", color: "#8e44ad" },
  { id: "inbox", label: "In Basket & Messages", icon: "📬", color: "#e67e22" },
  { id: "caregaps", label: "Care Gaps & Health Maint.", icon: "🩺", color: "#e74c3c" },
  { id: "chart", label: "Chart Review & Navigation", icon: "📊", color: "#27ae60" },
  { id: "workflow", label: "Visit Workflow & Billing", icon: "🔄", color: "#16a085" },
  { id: "personalize", label: "Personalization & Setup", icon: "⚙️", color: "#7f8c8d" },
];

const entries = [
  // ORDERS & PRESCRIPTIONS
  {
    id: "create-smartset",
    cat: "orders",
    title: "Create a personal order set (SmartSet)",
    keywords: ["order set", "smartset", "create orders", "custom orders", "visit type"],
    steps: [
      "Go to the Epic menu (top-left button) → Preference List Composer",
      "Click 'New' to create a new preference list",
      "Name it descriptively (e.g., 'Adult Annual Physical', 'Pediatric Well Child 4yr', 'Acute Cough Visit')",
      "Search for and add orders: labs, imaging, referrals, medications, vaccines",
      "Organize orders into sections by dragging them into logical groups",
      "Click Save when finished",
      "Your SmartSet will now appear in the Orders activity under the SmartSet tab"
    ],
    tips: "Build sets around your top 5–10 visit types first. You can copy a colleague's SmartSet and modify it rather than starting from scratch.",
    relatedIds: ["star-order", "link-dx-order"],
  },
  {
    id: "star-order",
    cat: "orders",
    title: "Star (save) a preferred order with specific details",
    keywords: ["star", "favorite", "preference", "save order", "default dose", "quantity", "benzonatate", "medication preference"],
    steps: [
      "Open the Orders activity in any patient encounter",
      "Search for the medication, lab, or imaging order",
      "Before accepting, modify the details: dose, quantity, refills, sig, pharmacy",
      "Example: Benzonatate → change to 200mg, qty 42, 1 refill",
      "Click the ★ star icon next to the order to save it as a preference",
      "The starred version with YOUR specific details will now appear at the top of future searches"
    ],
    tips: "Star your top 20–30 medications early. Include quantity and refill defaults. This saves 30–60 seconds per prescription — multiplied across a full clinic day, that's significant.",
    relatedIds: ["create-smartset", "link-dx-order"],
  },
  {
    id: "link-dx-order",
    cat: "orders",
    title: "Link a saved order to a specific diagnosis",
    keywords: ["diagnosis", "link", "associate", "attach order", "preference list", "contextual"],
    steps: [
      "Go to Epic menu → Preference List Composer",
      "Find the order you want to link in your preference list",
      "Right-click the order (or use the properties/edit option)",
      "In the diagnosis association field, search for and select the relevant diagnosis",
      "Example: Link Benzonatate → 'Cough'; Link HbA1c → 'Type 2 Diabetes'",
      "Save your preference list",
      "Now when that diagnosis is active on a patient, your linked orders will surface contextually"
    ],
    tips: "This is one of the most powerful efficiency features in Epic. Link screening labs to their diagnoses (lipid panel → hyperlipidemia, TSH → hypothyroidism) so they appear automatically during relevant visits.",
    relatedIds: ["star-order", "create-smartset"],
  },
  {
    id: "eprescribe",
    cat: "orders",
    title: "E-prescribe a medication (including controlled substances)",
    keywords: ["prescribe", "e-prescribe", "EPCS", "controlled substance", "pharmacy", "send prescription", "DEA"],
    steps: [
      "Open Orders activity in the patient encounter",
      "Search for the medication and select it",
      "Verify: dose, route, frequency, quantity, refills, pharmacy",
      "For controlled substances (EPCS): you will be prompted for two-factor authentication",
      "Complete the identity verification (token, biometric, or app-based depending on your site)",
      "Sign the order — it transmits electronically to the selected pharmacy",
      "Check for any drug interaction or allergy alerts and address them"
    ],
    tips: "Set up your EPCS token/authentication during onboarding week 1 — don't wait until you need it for a patient. Controlled substance prescribing without EPCS setup causes delays.",
    relatedIds: ["star-order", "med-renewal"],
  },
  {
    id: "med-renewal",
    cat: "orders",
    title: "Process a medication renewal request",
    keywords: ["renewal", "refill", "renew", "reorder", "prescription request", "pharmacy request", "rx renewal"],
    steps: [
      "Open In Basket → Rx Renewal or Refill Request folder",
      "Click on the renewal request to review it",
      "Verify: Is this medication still appropriate? When was the patient last seen?",
      "If appropriate: Click 'Renew' — review dose, quantity, refills, and pharmacy",
      "If changes needed: Click 'Reorder' to create a new prescription with modifications",
      "If not appropriate: Click 'Deny' with a reason, or contact the patient to schedule a visit",
      "Sign and send — mark the In Basket message as Done"
    ],
    tips: "Know the difference: 'Renew' keeps the same order details. 'Reorder' creates a fresh prescription. For controlled substances, most require a new order rather than a simple renewal. Batch your renewals — process them 2–3 times per day rather than one at a time.",
    relatedIds: ["eprescribe", "inbasket-organize"],
  },
  {
    id: "place-referral",
    cat: "orders",
    title: "Place a referral or consult order",
    keywords: ["referral", "consult", "refer patient", "specialist", "routing", "send to specialist"],
    steps: [
      "Open Orders activity → search for the specialty (e.g., 'Refer to Cardiology')",
      "Select the correct referral type (internal vs. external, consult vs. referral)",
      "Complete required fields: reason for referral, urgency, relevant diagnosis",
      "Attach any relevant notes or results using the 'Attach' function if available",
      "Verify the routing — check that it's going to the correct department/location",
      "Sign the order",
      "Check referral status later via Chart Review → Referrals tab"
    ],
    tips: "Referral routing is site-specific — where orders go depends entirely on how YOUR organization configured Epic. Verify your first 10–20 referrals actually reached the right place. Ask your preceptor for a referral routing cheat sheet if one exists.",
    relatedIds: ["create-smartset"],
  },
  {
    id: "med-reconciliation",
    cat: "orders",
    title: "Perform medication reconciliation",
    keywords: ["med rec", "medication reconciliation", "reconcile", "outside meds", "care everywhere", "medication list"],
    steps: [
      "Open the patient's Medications activity or the Med Rec section in the visit navigator",
      "Review medications from all sources: current list, Care Everywhere imports, pharmacy records",
      "For each medication, verify with the patient: still taking? correct dose? any changes?",
      "Mark medications as 'Taking', 'Not Taking', or 'Undecided'",
      "Add any new medications the patient reports that aren't on the list",
      "Remove or discontinue medications no longer being taken",
      "Click 'Reconcile' or 'Accept' to finalize the updated list",
      "Sign the reconciliation"
    ],
    tips: "Do this at EVERY visit, not just new patient visits. Care Everywhere imports may bring in duplicates or outdated information — always verify with the patient. A clean medication list prevents prescribing errors and improves care gap accuracy.",
    relatedIds: ["med-renewal"],
  },

  // NOTES & DOCUMENTATION
  {
    id: "create-smartphrase",
    cat: "notes",
    title: "Create a SmartPhrase (dot phrase)",
    keywords: ["smartphrase", "dot phrase", "template", "create template", ".phrase", "note template", "macro"],
    steps: [
      "Go to Epic menu (top-left) → My SmartPhrases",
      "Click 'New' to create a new SmartPhrase",
      "Name it with a dot prefix: e.g., .wellchild, .cougheval, .dmfollow",
      "Type or paste your template text in the body",
      "Add dynamic elements: @AGE@, @SEX@, @MEDS@ for auto-populated patient data",
      "Add wildcards: type *** where you want to fill in custom text (use F2 to jump between them)",
      "Add SmartLists: {dropdown:option1,option2,option3} for selectable options",
      "Click Save",
      "Use it in any note by typing the dot prefix (e.g., type .cougheval and hit Enter)"
    ],
    tips: "Naming convention matters. Consider starting personal phrases with your initials (e.g., .sjwellchild) to avoid conflicts with system phrases. Build your first 5–10 phrases in week 1 for your most common visit types.",
    relatedIds: ["find-smartphrase", "create-smartlist", "note-from-template"],
  },
  {
    id: "find-smartphrase",
    cat: "notes",
    title: "Find and use existing shared SmartPhrases",
    keywords: ["find", "search", "shared", "department", "existing phrases", "browse smartphrases", "discover"],
    steps: [
      "In any open note, type a period (.) and then start typing keywords",
      "Epic will show matching SmartPhrases — both personal and shared/department-level",
      "Alternatively: Epic menu → SmartPhrase Manager to browse all available phrases",
      "Filter by: department, specialty, author, or keyword",
      "Preview any phrase before using it by selecting it",
      "To adopt a colleague's phrase: ask them to share it with you through the sharing settings",
      "You can copy a shared phrase and modify it to create your own version"
    ],
    tips: "Before building anything from scratch, search for existing department or system-wide phrases. Someone has probably already built a template for common visits. Ask your preceptor for their top 10 phrases on day one.",
    relatedIds: ["create-smartphrase"],
  },
  {
    id: "create-smartlist",
    cat: "notes",
    title: "Create a SmartList (dropdown menu in notes)",
    keywords: ["smartlist", "dropdown", "menu", "select", "pick list", "options in note"],
    steps: [
      "Go to Epic menu → SmartList (or search 'SmartList' in global search)",
      "Click 'New' to create a new SmartList",
      "Name it descriptively (e.g., 'Pain Quality Options', 'Depression Severity')",
      "Enter each option on a separate line",
      "Check 'Allow multiple selections' if the user should be able to pick more than one",
      "Optionally set a default selection",
      "Save the SmartList",
      "Reference it in a SmartPhrase using: {SmartListName:ID} syntax",
      "In notes, the list appears as a clickable dropdown"
    ],
    tips: "SmartLists are powerful for standardizing documentation while keeping it flexible. Great for: review of systems, pain descriptors, severity scales, follow-up timeframes, and plan options.",
    relatedIds: ["create-smartphrase"],
  },
  {
    id: "note-from-template",
    cat: "notes",
    title: "Start a progress note from a template",
    keywords: ["progress note", "office visit note", "start note", "note template", "SOAP note", "encounter note"],
    steps: [
      "Open the patient encounter → go to the Notes activity",
      "Click 'New Note' or the note type appropriate for your visit",
      "If a default SmartText template loads, it will pre-populate the note structure",
      "To use YOUR template instead: clear the note and type your SmartPhrase (e.g., .annualpe)",
      "Or: set up a Speed Button — a one-click button that creates a note pre-filled with your preferred SmartPhrase",
      "Fill in the template: use F2 to jump between *** wildcard fields",
      "Add dynamic data using SmartLinks: @VITALS@, @MEDS@, @PROBLEMS@, @RESUFAST()@",
      "Sign and close the note when complete"
    ],
    tips: "Set up Speed Buttons for your top 3–5 note types so you can start the right template with one click. Don't fight the system template if it works — just supplement it with your SmartPhrases for the Assessment & Plan section.",
    relatedIds: ["create-smartphrase"],
  },
  {
    id: "pull-results-note",
    cat: "notes",
    title: "Pull lab results into a note automatically",
    keywords: ["results", "lab results in note", "smartlink", "RESUFAST", "auto populate results", "insert labs"],
    steps: [
      "In your note, place your cursor where you want results to appear",
      "Type: @RESUFAST(component1,component2,component3)@",
      "Replace component names with the lab component IDs for your site",
      "Example: @RESUFAST(HGB,HCT,WBC,PLT,GLUF,HGBA1C,CHOL,HDL,LDL,TRIG)@",
      "When the note is opened or refreshed, Epic pulls the most recent results automatically",
      "For a single most recent result: @LASTRESULT(component)@",
      "For results with dates: @RESULTDATE(component)@"
    ],
    tips: "Ask your preceptor or IT team for the correct component names/IDs at your site — they vary by organization. Build a SmartPhrase that contains your most commonly reviewed results panel so you can insert them with one dot phrase.",
    relatedIds: ["create-smartphrase"],
  },

  // IN BASKET & MESSAGES
  {
    id: "inbasket-organize",
    cat: "inbox",
    title: "Organize your In Basket folders for efficiency",
    keywords: ["in basket", "organize", "folders", "priority", "arrangement", "setup inbox"],
    steps: [
      "Open In Basket (click the In Basket icon or search 'In Basket')",
      "Review the current folder list on the left side",
      "Identify your high-priority folders: Results, Rx Renewal, Patient Messages (Pt Advice Request)",
      "Contact your Epic admin or use folder settings to reorder — move critical folders to the top",
      "Consider consolidating similar message types to reduce folder count",
      "Set up filters to exclude message types you're not responsible for",
      "Remove or hide empty/unused folders to reduce clutter",
      "Set up your In Basket to auto-advance to the next message after you mark one as Done"
    ],
    tips: "Alphabetical folder order (Epic's default) is NOT optimal. Put Results and urgent messages at the top. Process In Basket 3x per session: before patients, mid-session, and end of session. Batch similar tasks together.",
    relatedIds: ["inbasket-quickaction", "mychart-respond"],
  },
  {
    id: "inbasket-quickaction",
    cat: "inbox",
    title: "Create QuickActions for common In Basket responses",
    keywords: ["quickaction", "quick action", "batch response", "template response", "fast reply", "in basket efficiency"],
    steps: [
      "Open In Basket → select a message type you frequently respond to",
      "Click the QuickAction button (or look for 'Create QuickAction' in the toolbar)",
      "Name the QuickAction descriptively (e.g., 'Normal Labs - No Action Needed')",
      "Build the response template — include SmartPhrases if needed",
      "Define the action: send reply, forward to pool, mark as done, or combination",
      "Save the QuickAction",
      "Now when you encounter that message type, one click executes the entire response workflow"
    ],
    tips: "Build QuickActions for: normal lab results, routine medication renewal approvals, standard patient advice responses, and staff message acknowledgments. This is one of the biggest time-savers in Epic — a single QuickAction can replace 5–6 clicks.",
    relatedIds: ["inbasket-organize"],
  },
  {
    id: "mychart-respond",
    cat: "inbox",
    title: "Respond to a MyChart patient message efficiently",
    keywords: ["mychart", "patient message", "advice request", "patient portal", "reply to patient", "patient communication"],
    steps: [
      "Open In Basket → Pt Advice Request folder (or your site's equivalent)",
      "Read the patient's message and review their chart as needed",
      "Click Reply to compose your response",
      "Use SmartPhrases in your reply — they work here too (e.g., .normalresults, .reschedule)",
      "Keep responses concise and in plain language",
      "If the question is complex: consider converting to a telephone encounter or e-visit for billing",
      "To convert: look for 'Create Encounter' or 'Convert to E-Visit' options",
      "Sign and send your reply — mark the message as Done"
    ],
    tips: "Not every patient message needs a physician-level response. Work with your MA/nursing team to set up message routing so staff can handle scheduling, medication questions, and form requests before they reach you. Learn your organization's policy on when MyChart responses become billable.",
    relatedIds: ["inbasket-organize", "inbasket-quickaction"],
  },
  {
    id: "result-notification",
    cat: "inbox",
    title: "Process a lab/imaging result notification",
    keywords: ["result", "lab result", "imaging result", "result notification", "review results", "abnormal"],
    steps: [
      "Open In Basket → Results folder",
      "Click on the result notification — the result detail appears in the bottom pane",
      "Review the result: normal, abnormal, or critical",
      "For normal results with no action needed: click 'Normal' or mark as Done",
      "For abnormal results requiring follow-up: click 'Notify Patient' to send a MyChart message, or call the patient",
      "To order follow-up: click 'Follow Up' → place additional orders as needed",
      "To communicate with the care team: Forward the message to the appropriate staff pool",
      "Mark as Done once all actions are complete"
    ],
    tips: "Never let results sit unreviewed overnight. Build a QuickAction for 'Normal results — no follow-up needed' messages to patients. For critical or significantly abnormal results, document your notification attempt and plan in the patient's chart, not just in the In Basket response.",
    relatedIds: ["inbasket-organize", "inbasket-quickaction"],
  },
  {
    id: "staff-message",
    cat: "inbox",
    title: "Send a staff message or route to a pool",
    keywords: ["staff message", "send message", "pool", "route message", "communicate team", "nursing pool"],
    steps: [
      "From In Basket: click 'New Message' → Staff Message",
      "Or from within a patient chart: use 'Send Message' in the toolbar",
      "Choose recipient: search for an individual staff member by name, or select a pool (e.g., 'RN Triage Pool', 'Front Desk Pool')",
      "Attach the patient (if message is patient-specific) using the Patient field",
      "Type your message — be specific about what action is needed and by when",
      "Set priority: Routine or High",
      "Click Send",
      "To create a personal distribution list for frequent recipients: In Basket → My Lists"
    ],
    tips: "When forwarding a message to someone else, always include context — what you need them to do, by when, and any relevant background. A pool message is removed from everyone's In Basket once one person claims it, so use pools for tasks any team member can handle.",
    relatedIds: ["inbasket-organize"],
  },

  // CARE GAPS & HEALTH MAINTENANCE
  {
    id: "find-care-gaps",
    cat: "caregaps",
    title: "Find a patient's care gaps in the chart",
    keywords: ["care gap", "health maintenance", "find gaps", "storyboard", "screening", "preventive care", "overdue"],
    steps: [
      "Open the patient's chart — look at the Storyboard (left sidebar panel)",
      "A 'Care Gaps' flag or section will appear if screenings are overdue",
      "For the full list: search 'maint' in global search → Jump To → Health Maintenance",
      "Or: add Health Maintenance as a tab in your workspace for one-click access",
      "Also check: Chart Review → Plan of Care tab for care plan-level gaps",
      "BPA banners may also appear at the top of the encounter for urgent gaps",
      "Each gap shows: what's due, when it was last done, and its current status"
    ],
    tips: "Make Health Maintenance one of your default tabs. Get in the habit of glancing at Storyboard care gap flags the moment you open any chart — even for acute visits. Opportunistic gap closure (addressing a screening during an unrelated visit) is one of the highest-value things you can do.",
    relatedIds: ["close-care-gap", "caregap-orderset", "caregap-not-firing"],
  },
  {
    id: "close-care-gap",
    cat: "caregaps",
    title: "Close a care gap (order, satisfy, postpone, or discontinue)",
    keywords: ["close gap", "satisfy", "resolve", "postpone", "discontinue", "mark complete", "care gap action"],
    steps: [
      "Open Health Maintenance activity for the patient",
      "Find the care gap you want to address",
      "To ORDER what's needed: click the gap → Place Order (or use the Care Gap Order Set for batch ordering)",
      "To SATISFY (done elsewhere): click the gap → Satisfy → enter date completed and attach documentation if available",
      "To POSTPONE: click the gap → Postpone → enter new due date and reason",
      "To DISCONTINUE: click the gap → Discontinue → select reason (e.g., patient declines, not applicable, comfort care)",
      "To DEFER: acknowledge the gap but leave for a future visit or another provider"
    ],
    tips: "Use 'Satisfy' when you have evidence that a screening was done at an outside facility but the result hasn't flowed into Epic. Don't forget to attach the documentation. 'Discontinue' is permanent — only use it when the screening truly doesn't apply to this patient anymore.",
    relatedIds: ["find-care-gaps", "caregap-orderset"],
  },
  {
    id: "caregap-orderset",
    cat: "caregaps",
    title: "Use the Care Gap Order Set for batch ordering",
    keywords: ["care gap order set", "batch order", "smartset care gap", "order all gaps", "one click screening"],
    steps: [
      "Open the Orders activity within the patient encounter",
      "Search for 'Care Gap' in the SmartSet/Order Set search (exact name varies by organization)",
      "The Care Gap Order Set displays common screening orders grouped together",
      "Check off the items that are due for this patient: labs, imaging, vaccines, referrals",
      "Verify each order's details before accepting",
      "Sign all orders at once",
      "The corresponding Health Maintenance topics will update once results are received or orders are completed"
    ],
    tips: "This is far more efficient than searching for each screening order individually. If your organization doesn't have a Care Gap Order Set, ask your clinical informatics team to build one — or create your own SmartSet with your most commonly ordered screenings.",
    relatedIds: ["find-care-gaps", "close-care-gap"],
  },
  {
    id: "caregap-not-firing",
    cat: "caregaps",
    title: "★ Why a care gap ISN'T flagging (and what to do)",
    keywords: ["not firing", "missing", "no flag", "care gap missing", "health maintenance not showing", "why no alert", "problem list", "silent failure"],
    steps: [
      "CHECK THE PROBLEM LIST: Is the triggering diagnosis present and coded correctly? (e.g., 'Type 2 Diabetes Mellitus' not just 'hyperglycemia')",
      "CHECK SOCIAL HISTORY: Is smoking status documented discretely with pack-years and quit date? (lung cancer screening depends on this)",
      "CHECK FAMILY HISTORY: Is relevant family history entered in the structured Family History module? (early colon cancer screening, BRCA referrals)",
      "CHECK DEMOGRAPHICS: Are age, sex, and gender fields correct? (cervical, breast, prostate, osteoporosis screenings depend on these)",
      "CHECK OUTSIDE RECORDS: Was a screening done elsewhere but not reconciled into Health Maintenance?",
      "CHECK YOUR SITE'S BUILD: Not all Health Maintenance topics are active at every organization — ask your informatics team what's configured",
      "APPLY CLINICAL GUIDELINES: Use USPSTF, ACS, ACOG, AAP guidelines as your PRIMARY driver — don't rely on Epic flags alone"
    ],
    tips: "This is the most important concept in care gap management: Epic is a tool, not a safety net. The #1 fix is keeping the Active Problem List accurate and up-to-date at every single visit. This one habit has more downstream impact on care gap accuracy than anything else you can do in Epic.",
    relatedIds: ["update-problem-list", "update-social-hx", "find-care-gaps"],
  },
  {
    id: "update-problem-list",
    cat: "caregaps",
    title: "★ Update the Active Problem List (critical for care gaps)",
    keywords: ["problem list", "active problems", "diagnosis", "ICD-10", "add problem", "remove problem", "chronic conditions"],
    steps: [
      "Open the patient's chart → Problem List activity (or find it in the visit navigator)",
      "Review every item on the list with the patient: Is this still active? Anything new?",
      "ADD new diagnoses: search by condition name or ICD-10 code — use the most specific code available",
      "Example: Use 'Type 2 diabetes mellitus without complications (E11.9)' NOT 'Hyperglycemia (R73.9)'",
      "RESOLVE problems that are no longer active: click → Mark as Resolved with a date",
      "DELETE problems that were entered in error (use sparingly — resolving is usually better)",
      "Verify chronic conditions are present: Diabetes, HTN, COPD, CAD, HF, CKD, Asthma, Depression",
      "Check that each problem has a specific ICD-10 code, not a vague symptom code"
    ],
    tips: "The Problem List drives EVERYTHING downstream: Health Maintenance flags, BPA alerts, quality reporting, HCC coding, risk adjustment scores, and population health registries. Spending 60 seconds updating it at every visit pays dividends across the entire system. Make it a non-negotiable habit.",
    relatedIds: ["caregap-not-firing", "update-social-hx"],
  },
  {
    id: "update-social-hx",
    cat: "caregaps",
    title: "Document Social History discretely (smoking, alcohol, etc.)",
    keywords: ["social history", "smoking", "tobacco", "pack years", "alcohol", "substance use", "discrete documentation", "sexual history"],
    steps: [
      "Open the patient chart → Social History section (in visit navigator or via the Social Hx activity)",
      "TOBACCO: Document status (current, former, never) — if current/former, enter pack-years and quit date in the structured fields",
      "ALCOHOL: Document use in the discrete alcohol fields — frequency, quantity per occasion",
      "SUBSTANCE USE: Document in structured fields, not just in notes",
      "SEXUAL HISTORY: Document in discrete fields when clinically relevant (drives STI/HIV screening)",
      "EXERCISE & DIET: Document in structured fields if your site has them",
      "All of these MUST be in the structured/discrete fields, NOT only in progress note text",
      "Free-text in notes is invisible to Health Maintenance logic"
    ],
    tips: "Lung cancer screening (LDCT) requires ≥20 pack-year history AND current smoker or quit within 15 years. If these details are only in a note narrative, the screening gap will NEVER fire. This is one of the most commonly missed connections in primary care Epic workflow.",
    relatedIds: ["caregap-not-firing", "update-problem-list"],
  },

  // CHART REVIEW & NAVIGATION
  {
    id: "chart-review-filter",
    cat: "chart",
    title: "Set up Chart Review filters to find information fast",
    keywords: ["chart review", "filter", "find notes", "search chart", "note filter", "department filter", "history"],
    steps: [
      "Open the patient chart → Chart Review activity",
      "Click the Filter button (funnel icon) at the top",
      "Create filters by: Note Type (progress notes, discharge summaries, consult notes), Department (cardiology, endocrinology, ED), Provider, or Date Range",
      "Save your most-used filters for one-click access in future charts",
      "Suggested filters to create: 'ED Visits & Admissions', 'Cardiology Notes', 'Behavioral Health', 'Surgical Notes', 'My Notes Only'",
      "Apply a filter → the note list instantly narrows to matching results",
      "You can also filter Labs and Imaging results by type, date, or anatomical region"
    ],
    tips: "Stop scrolling through 200 encounters linearly. Set up 5–6 saved filters during your first week and you'll retrieve information in seconds instead of minutes. This is especially critical for complex patients with long histories.",
    relatedIds: ["use-synopsis", "use-snapshot"],
  },
  {
    id: "use-synopsis",
    cat: "chart",
    title: "Use Synopsis for a quick patient overview",
    keywords: ["synopsis", "overview", "patient summary", "quick view", "chart summary"],
    steps: [
      "Open the patient chart → search 'Synopsis' in global search or find it in your Sidebar",
      "Synopsis displays a consolidated one-page summary of the patient",
      "Typical sections: recent vitals, active problems, current medications, recent results, allergies, recent visits",
      "Click on any section to drill down for more detail",
      "Synopsis is read-only — it's for review, not documentation",
      "Consider adding Synopsis to your Sidebar for instant access during encounters"
    ],
    tips: "Synopsis is your 30-second patient overview before walking into the room. Especially valuable for patients you've never seen before or complex patients with multiple comorbidities. Pair it with Chart Review filters for deeper dives.",
    relatedIds: ["chart-review-filter", "use-snapshot"],
  },
  {
    id: "use-snapshot",
    cat: "chart",
    title: "Use Snapshot for key clinical metrics at a glance",
    keywords: ["snapshot", "metrics", "quick view", "key indicators", "dashboard", "patient data"],
    steps: [
      "Open the patient chart → search 'Snapshot' or find it in your activity tabs",
      "Snapshot shows key clinical indicators in a dashboard format",
      "Common metrics displayed: BMI, blood pressure trends, HbA1c, LDL, eGFR, recent screenings",
      "Some Snapshots are specialty-specific (e.g., diabetes Snapshot, cardiac Snapshot)",
      "Click on any metric to see its trend over time",
      "Your organization may have customized Snapshots — check what's available"
    ],
    tips: "Snapshot gives you the numbers that matter for chronic disease management at a glance. Some organizations have built custom dashboards that combine Snapshot-style data with care gap status — ask if yours has one.",
    relatedIds: ["use-synopsis", "chart-review-filter"],
  },
  {
    id: "care-everywhere",
    cat: "chart",
    title: "Pull outside records via Care Everywhere",
    keywords: ["care everywhere", "outside records", "external records", "other hospital", "interoperability", "import records"],
    steps: [
      "Open the patient chart → look for the Care Everywhere banner or button (often in the Storyboard or toolbar)",
      "Click to query connected external organizations for this patient's records",
      "Review the results: outside encounters, medications, labs, imaging, immunizations",
      "Import relevant items into the patient's chart: click 'Import' or 'Accept' on individual items",
      "For medications: imported meds will appear in the medication reconciliation workflow",
      "For results: imported results may satisfy open Health Maintenance gaps",
      "For immunizations: imported vaccines can update the immunization record"
    ],
    tips: "Always check Care Everywhere for new patients or patients who mention care at other facilities. Imported records can prevent duplicate testing and close care gaps. But verify with the patient — not all imported data may be current or accurate.",
    relatedIds: ["med-reconciliation", "close-care-gap"],
  },

  // VISIT WORKFLOW & BILLING
  {
    id: "close-encounter",
    cat: "workflow",
    title: "Properly close an encounter (sign, close, finalize)",
    keywords: ["close encounter", "sign note", "finalize", "close visit", "open encounters", "billing", "charge capture"],
    steps: [
      "Complete all documentation in the visit note",
      "Ensure all orders are signed (check for pended/unsigned orders)",
      "Link every order to at least one diagnosis for billing",
      "Select the appropriate E&M level (or let your site's auto-coding tool suggest one)",
      "Review the After Visit Summary (AVS) — it will print/send to the patient",
      "Click 'Sign & Close' (or your site's equivalent) to finalize the encounter",
      "Check your Open Encounters list regularly — Epic menu → My Open Encounters",
      "Close any encounters left open from previous days immediately"
    ],
    tips: "Open encounters = lost revenue and compliance risk. Make it a daily habit to check for open encounters before you leave for the day. The difference between 'signing' a note and 'closing' an encounter matters — signing the note alone may not complete the billing process.",
    relatedIds: ["link-dx-billing"],
  },
  {
    id: "link-dx-billing",
    cat: "workflow",
    title: "Link diagnoses to orders for proper billing",
    keywords: ["diagnosis", "billing", "link", "charge", "ICD-10", "E&M", "coding", "revenue"],
    steps: [
      "When placing orders (labs, imaging, referrals), Epic will prompt for associated diagnoses",
      "Select the most specific and appropriate diagnosis from the patient's Problem List or encounter diagnoses",
      "For the visit itself: ensure the primary encounter diagnosis reflects the main reason for the visit",
      "Check the Charge Capture or Billing section (if visible in your workflow) before closing",
      "Verify that the E&M level matches your documentation",
      "For procedures done during the visit: link the procedure code to the appropriate diagnosis",
      "If billing is handled separately by coders, ensure your note documentation supports the level billed"
    ],
    tips: "Every order without a linked diagnosis is a potential claim denial. Build this habit: as you place each order, immediately associate a diagnosis. Your organization loses real revenue when this step is skipped.",
    relatedIds: ["close-encounter"],
  },
  {
    id: "telephone-encounter",
    cat: "workflow",
    title: "Create a telephone encounter (potentially billable)",
    keywords: ["telephone", "phone call", "telephone encounter", "phone encounter", "billable call", "99441", "99442"],
    steps: [
      "If you spend meaningful clinical time on a patient phone call, it may be billable",
      "Create a Telephone encounter: from Schedule → right-click on the patient or use the encounter creation workflow",
      "Or: from In Basket, convert a MyChart message to a Telephone encounter",
      "Document: reason for call, clinical assessment, medical decision-making, plan, and time spent",
      "Select appropriate E&M code (99441–99443 based on time: 5–10 min, 11–20 min, 21–30 min)",
      "Link to diagnosis",
      "Sign and close the encounter"
    ],
    tips: "Many new providers give away billable work by spending 15 minutes on a phone call and not creating an encounter. Know your organization's policy on when a patient interaction — phone or MyChart — qualifies for billing. This directly impacts your productivity metrics.",
    relatedIds: ["close-encounter", "mychart-respond"],
  },

  // PERSONALIZATION & SETUP
  {
    id: "customize-tabs",
    cat: "personalize",
    title: "Customize your workspace tabs and layout",
    keywords: ["customize", "tabs", "layout", "workspace", "configure", "arrange", "activity tabs"],
    steps: [
      "Open a patient chart in your normal workspace",
      "Look for the wrench/gear icon at the right end of the activity tab bar",
      "Click it → you'll see options to Add, Remove, or Reorder tabs",
      "Recommended tabs for primary care: Schedule, Chart Review, Notes, Orders, Results, Health Maintenance, Synopsis",
      "Drag tabs into your preferred order — put your most-used tabs first",
      "Remove tabs you rarely use to reduce clutter",
      "Save your layout — it persists for all future encounters"
    ],
    tips: "Do this in your first week. The default tab order is generic and not optimized for primary care. Every provider's workflow is slightly different — arrange tabs to match the order you naturally move through during an encounter.",
    relatedIds: ["customize-sidebar", "customize-schedule"],
  },
  {
    id: "customize-sidebar",
    cat: "personalize",
    title: "Configure the Sidebar for quick-access activities",
    keywords: ["sidebar", "quick access", "side panel", "configure sidebar", "always visible"],
    steps: [
      "The Sidebar appears on the right side of your workspace and stays visible while you work",
      "Click the Sidebar settings (gear icon within the Sidebar panel)",
      "Add activities you reference constantly: Problems, Medications, Allergies, Vitals, Results Review",
      "Remove activities you don't need in the Sidebar",
      "The Sidebar lets you view critical information without leaving your current activity",
      "You can also add Health Maintenance to the Sidebar for constant care gap visibility"
    ],
    tips: "The Sidebar is your peripheral vision while you work. Having Problems, Meds, and Allergies always visible means you never have to navigate away from your note to verify something. Add Health Maintenance here to catch care gaps during every encounter.",
    relatedIds: ["customize-tabs"],
  },
  {
    id: "customize-schedule",
    cat: "personalize",
    title: "Customize your schedule view and columns",
    keywords: ["schedule", "schedule view", "columns", "daily schedule", "appointment list", "customize schedule"],
    steps: [
      "Open your Schedule activity",
      "Click the wrench/gear icon at the top of the schedule",
      "Add useful columns: chief complaint, appointment type, insurance, last visit date, care gaps indicator",
      "Remove columns you don't need",
      "Adjust the time display (show full day, half-day, or custom range)",
      "Set your default schedule view (daily, weekly, multi-provider)",
      "Consider adding a 'Prep' column or indicator if your site supports pre-visit planning",
      "Save your preferences"
    ],
    tips: "Adding a care gaps or health maintenance column to your schedule view lets you spot patients with open gaps before they even walk in the door. This enables proactive pre-visit planning rather than scrambling during the encounter.",
    relatedIds: ["customize-tabs"],
  },
  {
    id: "keyboard-shortcuts",
    cat: "personalize",
    title: "Essential keyboard shortcuts to learn",
    keywords: ["keyboard", "shortcut", "hotkey", "speed", "efficiency", "F2", "Ctrl", "fast"],
    steps: [
      "F2 — Jump to next *** wildcard field in a note (essential for SmartPhrase navigation)",
      "Ctrl+G — Global search (jump to any activity, patient, or function)",
      "Ctrl+D — Open patient demographics",
      "F6 — Open In Basket",
      "Ctrl+Space — Accept a selected item in search results or order entry",
      "Tab / Shift+Tab — Move between fields in forms and order entry",
      "Alt+Z — Sign orders (site-specific, verify with your IT team)",
      "Check your site's specific shortcuts: Epic menu → Keyboard Shortcuts or Quick Reference Card"
    ],
    tips: "Learn F2, Ctrl+G, and F6 on day one. These three shortcuts alone will save you hundreds of clicks per day. Each organization may have site-specific shortcuts — ask for the quick reference card during orientation.",
    relatedIds: ["customize-tabs"],
  },
];

function App() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    let items = entries;
    if (selectedCat !== "all") {
      items = items.filter((e) => e.cat === selectedCat);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.keywords.some((k) => k.includes(q)) ||
          e.steps.some((s) => s.toLowerCase().includes(q)) ||
          (e.tips && e.tips.toLowerCase().includes(q))
      );
    }
    return items;
  }, [search, selectedCat]);

  const getRelated = (ids) => {
    if (!ids) return [];
    return ids.map((id) => entries.find((e) => e.id === id)).filter(Boolean);
  };

  const catObj = (catId) => categories.find((c) => c.id === catId);

  return (
    <div style={{ background: "#f5f6f8", minHeight: "100vh", fontFamily: "'Source Sans 3', 'Segoe UI', system-ui, sans-serif", color: "#1e293b" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", color: "white", padding: "20px 16px 16px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 24 }}>⚡</span>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>Epic Quick Reference</h1>
          </div>
          <p style={{ margin: "2px 0 14px", fontSize: 12, opacity: 0.7 }}>Outpatient Primary Care — Search any task, get step-by-step instructions</p>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search: 'order set', 'care gap', 'dot phrase', 'In Basket', 'referral'..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "12px 14px 12px 38px", borderRadius: 10,
                border: "2px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.1)",
                color: "white", fontSize: 14, outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
            />
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.5 }}>🔍</span>
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 22, height: 22, color: "white", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}
              >✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "8px 16px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", gap: 6, flexWrap: "nowrap" }}>
          <button
            onClick={() => setSelectedCat("all")}
            style={{
              padding: "6px 12px", borderRadius: 20, border: "1px solid #e2e8f0", flexShrink: 0,
              background: selectedCat === "all" ? "#0f172a" : "white",
              color: selectedCat === "all" ? "white" : "#64748b",
              cursor: "pointer", fontSize: 11, fontWeight: 600, transition: "all 0.2s",
            }}
          >All ({entries.length})</button>
          {categories.map((cat) => {
            const count = entries.filter((e) => e.cat === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id === selectedCat ? "all" : cat.id)}
                style={{
                  padding: "6px 12px", borderRadius: 20, border: `1px solid ${cat.color}30`, flexShrink: 0,
                  background: selectedCat === cat.id ? cat.color : "white",
                  color: selectedCat === cat.id ? "white" : cat.color,
                  cursor: "pointer", fontSize: 11, fontWeight: 600, transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >{cat.icon} {cat.label} ({count})</button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px" }}>
        {/* Result count */}
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>
          {search ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"` : `${filtered.length} guides available`}
        </div>

        {filtered.length === 0 && (
          <div style={{ background: "white", borderRadius: 12, padding: 32, textAlign: "center", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#475569" }}>No matching guides found</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Try different keywords or clear your filters</div>
          </div>
        )}

        {filtered.map((entry) => {
          const cat = catObj(entry.cat);
          const isExpanded = expandedId === entry.id;
          const isSpecial = entry.title.startsWith("★");

          return (
            <div
              key={entry.id}
              style={{
                background: "white", borderRadius: 12, marginBottom: 10,
                border: isSpecial ? `2px solid ${cat.color}40` : `1px solid #e2e8f0`,
                overflow: "hidden", transition: "box-shadow 0.2s",
                boxShadow: isExpanded ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                style={{ padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: `${cat.color}15`, color: cat.color, fontWeight: 700 }}>
                      {cat.icon} {cat.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", lineHeight: 1.3 }}>{entry.title}</div>
                </div>
                <span style={{ fontSize: 18, color: "#94a3b8", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, marginLeft: 8 }}>▾</span>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{ padding: "0 16px 16px", borderTop: "1px solid #f1f5f9" }}>
                  {/* Steps */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.5px", marginBottom: 8 }}>Step by Step</div>
                    {entry.steps.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                          background: `${cat.color}15`, color: cat.color,
                          fontSize: 11, fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>{i + 1}</div>
                        <div style={{ fontSize: 13, lineHeight: 1.5, color: "#334155", paddingTop: 2 }}>{step}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  {entry.tips && (
                    <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: 12, marginTop: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>💡 Pro Tip</div>
                      <div style={{ fontSize: 12, lineHeight: 1.5, color: "#78350f" }}>{entry.tips}</div>
                    </div>
                  )}

                  {/* Related */}
                  {entry.relatedIds && entry.relatedIds.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.5px", marginBottom: 6 }}>Related Guides</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {getRelated(entry.relatedIds).map((rel) => (
                          <button
                            key={rel.id}
                            onClick={(e) => { e.stopPropagation(); setExpandedId(rel.id); setSearch(""); setSelectedCat("all"); }}
                            style={{
                              padding: "5px 10px", borderRadius: 6, fontSize: 11,
                              border: `1px solid ${catObj(rel.cat).color}30`,
                              background: `${catObj(rel.cat).color}08`,
                              color: catObj(rel.cat).color,
                              cursor: "pointer", fontWeight: 500,
                            }}
                          >{rel.title}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ marginTop: 20, padding: "14px 0", borderTop: "1px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Epic Quick Reference v1.0 — Outpatient Primary Care</div>
          <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 2 }}>Workflows may vary by organization. Verify site-specific details with your preceptor or IT team.</div>
        </div>
      </div>
    </div>
  );
}

export default App;

// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import masterChecklist from "../../data/seed/mentorship-master-checklist.json";
import { focusEpicReferenceEntry } from "../../data/epicReferenceFocus";
import { setLauncherApp } from "../../data/launcherState";
import ProductivityPanel, { hasProductivity, prodSummary, prodMetricDots, PROD_SERIES, PROD_METRICS } from "./ProductivityPanel";
import CulturePanel from "./CulturePanel";

/* ─── Medical Director Curriculum (62 items from master checklist, see analysis/) ─── */
const MD_PHASES = masterChecklist.phases;
const MD_ITEMS = masterChecklist.items;
const MD_ITEMS_BY_PHASE = MD_ITEMS.reduce((acc, item) => {
  (acc[item.phase] = acc[item.phase] || []).push(item);
  return acc;
}, {});
const MD_PHASE_INDEX = MD_PHASES.reduce((acc, p, i) => { acc[p.id] = i; return acc; }, {});
// Index of the first non-pre-start phase ("w1") in MD_PHASES — pre0/pre1 sit
// before this and are always expected regardless of provider's current week.
const MD_W1_INDEX = MD_PHASES.findIndex(p => p.id === "w1");

function openEpicRef(entryId) {
  focusEpicReferenceEntry(entryId, "tracker-md-curriculum");
  setLauncherApp("epic-reference");
}

/* ─── Mentor Curriculum — Physician Track (all providers, Week 0 → Month 12) ─── */
const MP_PHYS = [
  {id:"w0",label:"Week 0",items:[
    "After receiving notification from Deirdre Morgan's team, introduce yourself to the new provider via email or phone — share your name, role, how long you've been at the practice, and that you'll be their go-to person",
    "Provide your direct contact information and tell them they can reach out anytime, even before day one",
    "Ask if they have questions or concerns about starting — logistics, parking, dress code, what to bring",
    "Share one or two practical tips about the practice that nobody puts in the welcome packet",
    "Confirm you will be available in person during their first week and coordinate your schedule to overlap",
    "Let them know you are not their evaluator — you are the person who makes sure they never feel lost",
  ]},
  {id:"w1",label:"Week 1",items:[
    "Meet the provider in person on day one — walk them to their workspace and introduce them to daily contacts",
    "Confirm they know where essentials are: restrooms, break room, supply room, printer, fax, sample closet",
    "Confirm all system access is working: Epic login, email, phone, building badge, parking",
    "Introduce them individually to the MAs, front desk staff, and office manager they will work with directly",
    "Walk them through the daily rhythm: arrival time, huddle, lunch, when most providers leave",
    "Explain the unwritten rules: how the call schedule actually works, which staff handle which tasks, how to get things done quickly",
    "Check in at end of day one: How did it go? What was confusing? What do they need tomorrow?",
    "Check in at end of day three: What has gotten easier? What is still frustrating? Are they eating lunch or working through it?",
    "Ask if they have met someone on the team they feel comfortable asking questions to besides you",
    "Confirm they understand how to reach you, the office manager, and the Medical Director if something urgent comes up",
    "Ask if anything about the physical workspace needs to be fixed — chair, monitor, lighting, noise",
    "End-of-week check-in: Best and worst moments of week one? Anything they need before Monday?",
  ]},
  {id:"w2",label:"Week 2",items:[
    "Check in on patient encounters — not clinical quality, but workflow: finishing on time? Finding what they need in Epic?",
    "Ask how the In Basket is going: piling up? Understanding message types? Staying on top of results?",
    "Ask if any patient interactions left them feeling uncertain or uncomfortable — interpersonally, not clinically",
    "Observe their general demeanor: overwhelmed, anxious, frustrated, or settling in? If something seems off, ask directly",
    "Ask if they have questions they feel embarrassed to ask someone else",
    "Check whether they have been included in team conversations, lunch, or social moments — or eating alone",
    "Ask if the pace feels sustainable or rushed",
    "Confirm daily huddle attendance and they understand its purpose, especially care gap review",
    "Ask if any staff interactions have been confusing, tense, or unclear — offer context about team dynamics",
    "Flag anything concerning to the Medical Director with appropriate urgency (routine or urgent)",
  ]},
  {id:"w3",label:"Week 3",items:[
    "Ask what part of the daily workflow now feels comfortable and what still feels like a struggle",
    "Check on Epic efficiency: SmartPhrases helping? Order sets built? Documentation getting faster?",
    "Ask about In Basket management: under control by end of day, or taking work home?",
    "Check on schedule management: running on time or consistently behind? Identify whether it is volume, documentation, complexity, or rooming delays",
    "Ask if they have developed any shortcuts or workarounds — and whether those are helping or masking a problem",
    "Check on team relationships: part of the team, or still the new person?",
    "Ask if there is anything the Medical Director should know that the provider might not bring up themselves",
    "Provide one specific, actionable piece of advice based on what you have observed",
  ]},
  {id:"m1",label:"Month 1",items:[
    "Ask the provider to rate their own first month: what grade would they give themselves, and why?",
    "Ask what they wish they had known on day one that nobody told them",
    "Check on documentation speed: notes closing same day? If not, what is causing the delay?",
    "Ask about care gap identification: noticing care gaps during visits, or still focused on chief complaint only?",
    "Discuss volume: does the current patient load feel right?",
    "Ask about the team dynamic from their perspective: respected by staff? Supported?",
    "Ask if there are concerns they have not raised with the Medical Director that they would raise with you",
    "Prepare the provider for the Medical Director's Month 1 questionnaire — let them know it is coming and that it is supportive, not evaluative",
    "Ask how they have been handling inherited controlled substances patients so far — opioids, benzodiazepines, stimulants. Are they continuing existing regimens comfortably, or feeling uncertain about taking them on? Share how you personally approach these patients and normalize the discomfort if it is there.",
    "Ask if they have opened the Meridian clinical modules yet — lipids, CKD, anemia, abdominal pain, ADHD, opiates, benzos. If not, walk them through where to find them and show them one you use regularly. Make it concrete, not aspirational.",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
  {id:"w5",label:"Week 5",items:[
    "Check how the volume increase is landing: keeping up, or starting to feel rushed?",
    "Ask about referral workflows: do they know how to route correctly in Epic?",
    "Ask about encounter closure: closing by end of day, or open encounters piling up?",
    "Check on In Basket at end of day: manageable, or has increased volume created a backlog?",
    "Ask if any part of their workflow has broken down as volume increased",
    "Offer one practical tip for managing the increased pace",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
  {id:"w6",label:"Week 6",items:[
    "Ask about MyChart messaging: manageable, or becoming a second In Basket?",
    "Check on medication reconciliation habits: cleaning the med list during visits, or skipping due to time?",
    "Ask about work-life balance: leaving at a reasonable time? Charting from home? Sleeping well?",
    "Ask if there is a specific visit type or patient that consistently feels harder than it should",
    "Check whether they are personalizing their Epic workspace: custom order sets, preference lists, SmartPhrase library",
    "Ask if they have advice for you — what have they noticed with fresh eyes?",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
  {id:"w7",label:"Week 7",items:[
    "Ask how confident they feel handling a full day independently",
    "Check whether they know what to do when they encounter a scenario they are not sure about",
    "Ask about complex patient management: have they handled a multi-problem visit successfully?",
    "Ask if they feel ready to shift from weekly to monthly check-ins — and whether that feels supportive or abandoned",
    "Ask what one skill or area they still want to improve over the next three months",
    "Share your honest assessment of their progress — specific, positive, and constructive",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
  {id:"m2",label:"Month 2",items:[
    "Conduct a reflective conversation: highest and lowest moments of the first two months",
    "Ask what part of the onboarding program has been most helpful and what felt unnecessary",
    "Check all core workflows: documentation, In Basket, referrals, orders, care gaps, MyChart — any still a daily struggle?",
    "Ask about team integration: established member, or still the new person?",
    "Ask if there are unresolved concerns from the first two months",
    "Set expectations for monthly check-ins: shorter, less structured, focused on how things are going",
    "Remind them you are still available between scheduled check-ins",
    "Flag a summary to the Medical Director: overall trajectory and any specific items to address",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
  {id:"m3",label:"Month 3",items:[
    "Ask how the transition from weekly to monthly support has felt",
    "Check on volume sustainability: daily load manageable at closer to full capacity?",
    "Ask about quality metrics: aware of their scores? Understand what is being measured?",
    "Ask if they have had any difficult conversations with patients, staff, or leadership — and how they handled them",
    "Check on professional satisfaction: is this what they expected? Glad they took this position?",
    "Ask if there is anything they need from you, the Medical Director, or the organization",
    "Controlled substances check-in: how have encounters with inherited opioid, benzodiazepine, and stimulant patients gone over the past two months? Debrief any cases where they felt stuck or over-cautious. Remind them that continuing a stable patient's established regimen is the right call, and that the Meridian modules are there if they need a refresher.",
    "Clinical modules check-in: which Meridian modules have they actually opened — lipids, CKD, anemia, abdominal pain, ADHD, opiates, benzos? Which have been useful? Are there any they have not tried yet that seem relevant to what they are seeing? Share which ones you rely on most.",
    "Provider appears energized and engaged",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
  {id:"m4",label:"Month 4",items:[
    "Check on daily workflow: anything changed since Month 3? New frustrations or inefficiencies?",
    "Ask about their relationship with the team: deepened, plateaued, or developed tension?",
    "Ask if they are pursuing any professional development and whether the organization is supporting it",
    "Check on documentation habits: notes still closing same day?",
    "Has the provider developed at least one close working relationship on the team — someone they talk to, eat with, or ask questions of beyond surface-level pleasantries?",
    "Provider appears energized and engaged",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
  {id:"m5",label:"Month 5",items:[
    "Ask how they would evaluate their own performance over five months — strengths and areas for growth",
    "Check on burnout signals: energy level, enthusiasm for coming to work — without being intrusive, just genuinely asking",
    "Ask if there are goals they set at the beginning that they have not yet achieved — and what is in the way",
    "Preview the six-month milestone: Medical Director questionnaire, office manager assessment, and what those cover",
    "Has the provider maintained at least one close working relationship on the team, or has social connection faded?",
    "Provider appears energized and engaged",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
  {id:"m6",label:"Month 6",items:[
    "Acknowledge the milestone: six months is a real accomplishment. Tell them specifically what you have watched them improve at",
    "Ask for their honest six-month self-assessment: where are they strongest? Where do they still struggle?",
    "Check on panel growth: are patients building loyalty? Do patients request them?",
    "Ask about their long-term vision: do they see themselves here in two years? Five years?",
    "Ask if the mentorship relationship is still valuable and what format they prefer going forward",
    "Flag your six-month assessment to the Medical Director: on track for success? Any concerns?",
    "Provider appears energized and engaged",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
  {id:"m7",label:"Month 7",items:[
    "Brief check-in: any concerns, changes, or developments since Month 6?",
    "How is your energy and motivation level?",
    "Anything you need from me, the Medical Director, or the organization?",
    "Provider appears energized and engaged",
  ]},
  {id:"m8",label:"Month 8",items:[
    "Brief check-in: anything on your mind professionally?",
    "How are things going with the team?",
    "Any emerging issues heading into the Month 9 check-in?",
    "Provider appears energized and engaged",
  ]},
  {id:"m9",label:"Month 9",items:[
    "Ask how things are going — genuinely. Listen for what they say and what they do not say",
    "Check whether documentation and workflow efficiency have continued to improve, plateaued, or declined",
    "Ask if they feel recognized and appreciated — by patients, staff, and leadership",
    "Ask if anything about the organization, practice, or team has surprised them since last check-in",
    "Ask if they have started mentoring or helping others informally",
    "Provider appears energized and engaged",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
  {id:"m12",label:"Month 12",items:[
    "Conduct a year-in-review conversation: defining moments, breakthroughs, struggles, turning points",
    "Ask what they know now that they wish they had been told on day one",
    "Ask directly: Are you happy here? Is this where you want to be?",
    "Discuss what the relationship looks like going forward: physicians end formally, APCs continue quarterly through Year 2",
    "Ask if they would recommend this organization to a friend or colleague — and why or why not",
    "Thank them for trusting you through this process. Make it personal and genuine",
    "Provider appears energized and engaged",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
];

/* ─── Mentor Curriculum — APC Track (NP/PA only, Month 15 → Month 24) ─── */
const MP_APC = [
  {id:"m15",label:"Month 15",items:[
    "Check how the transition from monthly to quarterly check-ins has felt — still supported, or has the gap created distance?",
    "Ask about clinical confidence: are there still presentations that make them pause, or has most of it become routine?",
    "Ask about the collaborative relationship with their collaborating physician: working well? Enough access? Respectful and genuinely collaborative?",
    "Check on professional development: pursuing advanced certifications, specialty training, leadership opportunities?",
    "Ask if there is anything about their scope of practice, schedule, or role they would like to see change",
    "Do you feel you are treated as an equal member of the clinical team? (If the answer is anything less than a confident yes, flag for the Medical Director)",
    "Provider appears energized and engaged",
  ]},
  {id:"m18",label:"Month 18",items:[
    "Ask about workload sustainability at 18 months: has the pace become comfortable, or is fatigue setting in?",
    "Check on team dynamics: fully integrated, or still treated differently as an NP or PA compared to physicians?",
    "Ask whether the national education program content has continued to influence their practice",
    "Ask about compensation satisfaction — not to fix it, but to know whether it is becoming frustration",
    "Ask what they would change about the APC onboarding program based on their experience",
    "Provider appears energized and engaged",
    "Share one specific thing this provider is doing well that they may not realize",
  ]},
  {id:"m21",label:"Month 21",items:[
    "Check on burnout and emotional wellbeing: 21 months is when initial energy has fully worn off",
    "Ask if they feel their contributions are visible to leadership, or doing good work nobody notices",
    "Ask whether they are ready and willing to mentor a new provider",
    "Check on documentation efficiency: by 21 months, charting should not be a burden",
    "Ask what keeps them here — genuinely, what is the reason you stay?",
    "Ask whether the collaborative agreement still reflects their current abilities or should be updated — procedure privileges, chart review frequency, scope",
    "Provider appears energized and engaged",
  ]},
  {id:"m24",label:"Month 24",items:[
    "Conduct a two-year retrospective: where were they on day one vs now? Help them see the distance traveled",
    "Ask for their final honest assessment: was the mentorship program worth the time? What made it valuable? What was unnecessary?",
    "Ask whether they have reached full professional confidence in this role",
    "Discuss the transition: mentorship formally ends, the relationship does not",
    "Confirm with the Medical Director whether the collaborative agreement should be formally reviewed and updated based on two years of performance",
    "Ask if they would serve as a mentor for the next new APC",
    "Close with genuine recognition: tell them specifically what they have contributed to the practice that was not there before they arrived",
    "Provider appears energized and engaged",
  ]},
];

const MP = [...MP_PHYS, ...MP_APC];

const OP = [
  {id:"om1",label:"Month 1 — First Impressions",qs:[
    {qid:"a",label:"Staff dynamics",text:"Rate how well the existing staff has adjusted to working with this new provider — including willingness to be paired with them, attitude on their clinic days, and any tension or resistance you have observed.",anchor_low:"significant tension or resistance from staff",anchor_high:"staff has fully embraced the new provider",ty:"s"},
    {qid:"b",label:"Patient signals",text:"Rate the feedback you and the front desk have heard directly from patients about this provider — including comments made during check-in, checkout, or phone calls.",anchor_low:"mostly negative or concerning feedback",anchor_high:"consistently positive feedback",ty:"s"},
    {qid:"c",label:"Operational burden",text:"Rate whether this provider is creating extra work for the office — for example, orders that need to be corrected, prescriptions that were not transmitted, referrals that went to the wrong place, or encounters left open that delay billing.",anchor_low:"frequently causing rework and extra steps for staff",anchor_high:"no additional operational burden",ty:"s"},
    {qid:"d",label:"Communication",text:"Rate how clearly this provider communicates their needs and expectations to non-clinical staff — including requests for the front desk, medical assistants, and office manager.",anchor_low:"staff is constantly guessing or confused about what the provider needs",anchor_high:"provider communicates clearly every time",ty:"s"},
    {qid:"e",label:"Integration",text:"Rate how well this provider is fitting into the team socially and professionally — including whether they are building relationships with staff, participating in conversations, and making an effort to be part of the office culture.",anchor_low:"isolated, disconnected, or not making an effort",anchor_high:"naturally fitting in and building relationships",ty:"s"},
    {qid:"f",label:"Performance metrics",text:"Rate your overall assessment of this provider's early performance across the following areas: patient volume relative to what was scheduled, patient wait times in the office, productivity for the visits they are completing, and whether patients are showing up for their appointments. Consider all four areas together in your rating.",anchor_low:"significant concerns across multiple areas",anchor_high:"all areas are where they should be for a first-month provider",ty:"s"},
    {qid:"g",label:"Provider check-in",text:"Please have a brief conversation with the new provider and ask how things are going so far. Record their response word for word in the space provided below.",ty:"t"},
  ]},
  {id:"om2",label:"Month 2 — Settling In",qs:[
    {qid:"a",label:"Staff dynamics",text:"Rate the staff's overall comfort level working with this provider now that they have had a full month together — have initial concerns improved, stayed the same, or gotten worse?",anchor_low:"comfort level has decreased or concerns have grown",anchor_high:"staff is fully comfortable and working well together",ty:"s"},
    {qid:"b",label:"Patient signals",text:"Rate whether patients who have seen this provider are rebooking with the same provider, or whether the front desk is hearing requests to see someone else.",anchor_low:"patients are frequently asking for other providers",anchor_high:"patients are consistently rebooking with this provider",ty:"s"},
    {qid:"c",label:"Operational burden",text:"Rate this provider's documentation habits from an operational perspective — specifically whether patient encounters are being closed on the same day, or whether open encounters are creating billing delays or additional follow-up work.",anchor_low:"encounters are routinely left open causing billing and operational delays",anchor_high:"encounters are closed same day with no issues",ty:"s"},
    {qid:"d",label:"Communication",text:"Rate whether this provider is advising patients to schedule their next appointment at the front desk before leaving the office, rather than relying on MyChart or other methods that result in patients not following up.",anchor_low:"never advises patients to book at checkout",anchor_high:"consistently ensures patients schedule before leaving",ty:"s"},
    {qid:"e",label:"Integration",text:"Rate whether this provider appears engaged and invested in the practice — showing up prepared, participating in huddles, and demonstrating that they want to be part of this team rather than just filling a position.",anchor_low:"appears disengaged or just going through the motions",anchor_high:"clearly invested and wants to be here",ty:"s"},
    {qid:"f",label:"Performance metrics",text:"Rate this provider's progress across the following areas compared to last month: is their daily patient volume increasing as expected, are patient wait times reasonable, is their productivity per visit appropriate, and are their no-show rates similar to other providers at the site?",anchor_low:"no improvement or declining in multiple areas",anchor_high:"improving across all areas as expected",ty:"s"},
    {qid:"g",label:"Provider check-in",text:"Please have a brief conversation with the provider and ask how things are going. Record their response word for word in the space provided below.",ty:"t"},
  ]},
  {id:"om3",label:"Month 3 — Independence Check",qs:[
    {qid:"a",label:"Staff dynamics",text:"Rate the staff's overall satisfaction with this provider — if any staff members have raised concerns, complaints, or frustrations about this provider at any point in the last three months, factor that into your rating.",anchor_low:"multiple staff members have raised concerns",anchor_high:"no concerns raised and staff is fully satisfied",ty:"s"},
    {qid:"b",label:"Patient signals",text:"Rate the patient retention signal for this provider — based on what you see at the front desk, are patients returning for follow-ups with this specific provider, or are they asking to see other providers or not returning at all?",anchor_low:"poor patient retention, patients are not coming back",anchor_high:"strong patient retention, patients consistently return",ty:"s"},
    {qid:"c",label:"Operational burden",text:"Rate this provider's ability to get through their day without creating additional operational work for the office — meaning orders, referrals, prescriptions, and documentation are handled correctly without the office needing to follow up, correct, or redo anything.",anchor_low:"still creating significant extra work for the staff",anchor_high:"completely self-sufficient with no rework needed",ty:"s"},
    {qid:"d",label:"Communication",text:"Rate how effectively this provider works with the front desk and medical assistants as a team — not just giving instructions, but listening, adapting, and collaborating with the people who support them.",anchor_low:"one-directional communication, does not collaborate",anchor_high:"true team player who listens and adapts",ty:"s"},
    {qid:"e",label:"Integration",text:"Rate whether any issues or concerns raised in Month 1 or Month 2 have been resolved, and whether this provider is trending in the right direction overall.",anchor_low:"previous issues remain unresolved or have worsened",anchor_high:"all prior concerns addressed and clear positive trend",ty:"s"},
    {qid:"f",label:"Performance metrics",text:"Rate this provider's current standing across the following areas: daily patient volume compared to the office average, patient wait times compared to other providers, productivity per visit, and no-show rates. At three months, these numbers should be trending toward the office average.",anchor_low:"significantly behind the office average in multiple areas",anchor_high:"at or near the office average across all areas",ty:"s"},
    {qid:"g",label:"Provider check-in",text:"Please have a brief conversation with the provider and ask how things are going, what is working well, and whether there is anything they would change. Record their response word for word in the space provided below.",ty:"t"},
  ]},
  {id:"om6",label:"Month 6 — Full Speed Check",qs:[
    {qid:"a",label:"Staff dynamics",text:"Rate the overall working relationship between this provider and the staff — at six months, any lingering tension or friction should be resolved. If it is not, rate accordingly.",anchor_low:"unresolved friction that is affecting the team",anchor_high:"strong working relationship with no issues",ty:"s"},
    {qid:"b",label:"Patient signals",text:"Rate whether patients are specifically requesting this provider by name when they call to schedule — this is the strongest indicator that the provider has earned patient trust and loyalty.",anchor_low:"patients never request this provider",anchor_high:"patients frequently request this provider by name",ty:"s"},
    {qid:"c",label:"Operational burden",text:"Rate whether this provider's presence has made the overall office operations easier or harder compared to before they started — considering schedule flow, staff workload, patient throughput, and any additional operational demands.",anchor_low:"office operations are harder because of this provider",anchor_high:"office operations have improved with this provider",ty:"s"},
    {qid:"d",label:"Communication",text:"Rate this provider's ability to handle same-day or urgent patient needs — specifically whether they are flexible enough to accommodate walk-ins, urgent calls, or schedule disruptions without creating problems for the office.",anchor_low:"rigid and unable to accommodate urgent needs",anchor_high:"flexible and readily accommodates urgent situations",ty:"s"},
    {qid:"e",label:"Integration",text:"Rate how fully this provider has become part of the daily fabric of the site — not just doing their job, but being present, engaged, and invested in the success of the office as a whole.",anchor_low:"still feels like an outsider filling a role",anchor_high:"feels like they have been here for years",ty:"s"},
    {qid:"f",label:"Performance metrics",text:"Rate this provider's performance across the following areas at the six-month mark: daily patient volume relative to their target, patient wait times, productivity per visit compared to other providers, and no-show rates. At six months, these should be at or near the level of an established provider.",anchor_low:"still well below expectations in multiple areas",anchor_high:"performing at the level of an established provider across all areas",ty:"s"},
    {qid:"g",label:"Provider check-in",text:"Please have a brief conversation with the provider and ask how they feel things are going at this stage. Record their response word for word in the space provided below.",ty:"t"},
  ]},
  {id:"om9",label:"Month 9 — Maturity Assessment",qs:[
    {qid:"a",label:"Staff dynamics",text:"Rate this provider's impact on the overall morale and energy of the team — are they someone who lifts up the people around them, or someone who drains energy and creates stress?",anchor_low:"negatively impacts team morale",anchor_high:"consistently positive influence on the team",ty:"s"},
    {qid:"b",label:"Patient signals",text:"Rate the overall patient loyalty this provider has built — considering rebooking rates, patient requests, patient feedback to the front desk, and whether patients seem genuinely connected to this provider.",anchor_low:"minimal patient loyalty or connection",anchor_high:"strong patient loyalty with clear personal connection",ty:"s"},
    {qid:"c",label:"Operational burden",text:"Rate whether this provider is contributing to the practice beyond just seeing patients — for example, suggesting workflow improvements, helping train staff, covering for colleagues, mentoring newer team members, or participating in practice initiatives.",anchor_low:"does not contribute beyond their own patient schedule",anchor_high:"actively contributes to the practice in multiple ways",ty:"s"},
    {qid:"d",label:"Communication",text:"Rate this provider's consistency and reliability — whether you can count on them to show up, perform, communicate, and follow through without surprises or concerns.",anchor_low:"inconsistent or unpredictable",anchor_high:"completely reliable and consistent every day",ty:"s"},
    {qid:"e",label:"Integration",text:"Rate your confidence that there are no emerging issues — staffing, scheduling, interpersonal, or operational — that could negatively affect this provider's performance or satisfaction in the coming months.",anchor_low:"there are emerging issues the Medical Director needs to know about",anchor_high:"no concerns whatsoever",ty:"s"},
    {qid:"f",label:"Performance metrics",text:"Rate this provider's sustained performance across the following areas: daily patient volume, patient wait times, productivity per visit, and no-show rates. At nine months, these should be stable and consistent with no concerning trends.",anchor_low:"declining or inconsistent in multiple areas",anchor_high:"stable and consistent across all areas",ty:"s"},
    {qid:"g",label:"Provider check-in",text:"Please have a brief conversation with the provider and ask how they are feeling about their role and whether they need any additional support. Record their response word for word in the space provided below.",ty:"t"},
  ]},
  {id:"om12",label:"Month 12 — Year-End Verdict",qs:[
    {qid:"a",label:"Staff dynamics",text:"Rate this provider's overall impact on the team over the full year — considering every interaction, every day, and every situation you have observed.",anchor_low:"net negative impact on the team",anchor_high:"one of the strongest team members at the site",ty:"s"},
    {qid:"b",label:"Patient signals",text:"Rate the overall patient response to this provider over the full year — considering feedback, retention, complaints, compliments, and whether patients have come to trust and rely on this provider.",anchor_low:"patients have not connected with this provider",anchor_high:"patients are loyal and satisfied",ty:"s"},
    {qid:"c",label:"Operational burden",text:"Rate this provider's net impact on the daily operations of the site over the full year — has their presence made your job and the staff's jobs easier or harder?",anchor_low:"created more operational burden than benefit",anchor_high:"significantly improved operations",ty:"s"},
    {qid:"d",label:"Communication",text:"Rate how this provider compares to other providers at the site in terms of overall operational effectiveness — productivity, reliability, communication, teamwork, and professionalism.",anchor_low:"well below other providers",anchor_high:"among the best providers at the site",ty:"s"},
    {qid:"e",label:"Integration",text:"Rate how strongly you would want this provider to remain at your site if you had the choice — this is your honest overall assessment of whether this hire worked.",anchor_low:"would prefer a different provider",anchor_high:"absolutely want them to stay and would be upset to lose them",ty:"s"},
    {qid:"f",label:"Performance metrics",text:"Rate this provider's year-end performance across the following areas: daily patient volume, patient wait times, productivity per visit, and no-show rates. Compare these to where they started in Month 1 and to where other established providers at the site currently stand.",anchor_low:"still below expectations after a full year",anchor_high:"fully performing at or above the level of established providers",ty:"s"},
    {qid:"g",label:"Provider check-in",text:"Please have a brief conversation with the provider and ask them to reflect on their first year — what went well, what they would change, and what they need going into year two. Record their response word for word in the space provided below.",ty:"t"},
  ]},
];

const QP = [
  {id:"w0",label:"Week 0 — Post-Hire",qs:[
    {qid:"a",text:"What aspects of the hiring process stood out as particularly positive for you?",ty:"t"},
    {qid:"b",text:"Were there any points in the hiring process that felt unclear or challenging?",ty:"t"},
    {qid:"c",text:"How did the onboarding communication (e.g., emails, calls, materials) prepare you for your first day?",ty:"t"},
    {qid:"d",text:"Was the timeline between your offer acceptance and start date appropriate, or could it be improved?",ty:"t"},
    {qid:"e",text:"What suggestions do you have for improving the hiring experience for future candidates?",ty:"t"},
  ]},
  {id:"w1",label:"Week 1 — End of Orientation",qs:[
    {qid:"a",text:"Do you have email access on your phone?",ty:"t"},
    {qid:"b",text:"Can you access Epic on your laptop in the office? Can you access your email and Epic on your laptop at home?",ty:"t"},
    {qid:"c",text:"What were two positive or most helpful moments of this week? Was there anything particularly daunting that you would like to discuss?",ty:"t"},
    {qid:"d",text:"Is there anything specific you would like to learn or gain more clarity on this week?",ty:"t"},
  ]},
  {id:"w2",label:"Week 2 — First Clinical Week",qs:[
    {qid:"a",text:"Are you able to prescribe? Any issues sending controlled substances? Do you have Imprivata access?",ty:"t"},
    {qid:"b",text:"Do you feel the workflow allows you enough time to learn and adapt at a manageable pace? Why or why not?",ty:"t"},
    {qid:"c",text:"Are there any resources or tools that would help you perform better in your role?",ty:"t"},
    {qid:"d",text:"How are your interactions with colleagues, staff, and leadership so far? Which team member has been incredibly helpful? How attentive has medical leadership been during this process?",ty:"t"},
    {qid:"e",text:"Is there anything specific you would like to learn or gain more clarity on this week?",ty:"t"},
  ]},
  {id:"w3",label:"Week 3",qs:[
    {qid:"a",text:"Has the workflow been organized in a way that supports you in identifying areas where you're still learning or need additional support?",ty:"t"},
    {qid:"b",text:"Are there any resources or tools that would help you perform better in your role?",ty:"t"},
    {qid:"c",text:"How are your interactions with colleagues, staff, and leadership so far? Which team member has been incredibly helpful? How attentive has medical leadership been during this process?",ty:"t"},
    {qid:"d",text:"How are you finding the functionality of Epic? How would you rate the ease of use, or lack thereof? Are there specific areas of Epic where you feel more training is needed? For example, documentation time or managing the in-basket? Or, utilizing the AWV smart set?",ty:"t"},
    {qid:"e",text:"Is there anything specific you would like to learn or gain more clarity on this week?",ty:"t"},
  ]},
  {id:"m1",label:"Month 1",qs:[
    {qid:"a",text:"How satisfied are you with your onboarding experience so far?",ty:"s",anchor_low:"poor experience",anchor_high:"great experience"},
    {qid:"b",text:"How efficient do you feel with Epic documentation?",ty:"s",anchor_low:"not efficient at all",anchor_high:"very efficient"},
    {qid:"c",text:"To what extent do you feel prepared to perform your job after completing the initial onboarding?",ty:"s",anchor_low:"not at all prepared",anchor_high:"very prepared"},
    {qid:"d",text:"How effective was the training you received in helping you understand your role?",ty:"s",anchor_low:"not effective at all",anchor_high:"extremely effective"},
    {qid:"e",text:"How clear and consistent has communication been from your manager and team?",ty:"s",anchor_low:"very unclear",anchor_high:"very clear"},
    {qid:"f",text:"What part of the onboarding process was most helpful, and what could be improved?",ty:"t"},
  ]},
  {id:"w5",label:"Week 5",qs:[
    {qid:"a",text:"How comfortable are you with your current patient volume?",ty:"s",anchor_low:"not comfortable at all",anchor_high:"very comfortable"},
    {qid:"b",text:"How confident are you with referral workflows?",ty:"s",anchor_low:"not confident at all",anchor_high:"very confident"},
    {qid:"c",text:"How well are you managing your In Basket at end of day?",ty:"s",anchor_low:"not managing at all",anchor_high:"managing very well"},
    {qid:"d",text:"What is working well in your daily routine?",ty:"t"},
  ]},
  {id:"w6",label:"Week 6",qs:[
    {qid:"a",text:"How confident are you with patient messaging (MyChart)?",ty:"s",anchor_low:"not confident at all",anchor_high:"very confident"},
    {qid:"b",text:"How comfortable are you with medication reconciliation?",ty:"s",anchor_low:"not comfortable at all",anchor_high:"very comfortable"},
    {qid:"c",text:"How would you rate your work-life balance so far?",ty:"s",anchor_low:"very poor",anchor_high:"excellent"},
    {qid:"d",text:"Anything you'd change about your workflow?",ty:"t"},
  ]},
  {id:"w7",label:"Week 7",qs:[
    {qid:"a",text:"How ready do you feel to practice more independently?",ty:"s",anchor_low:"not ready at all",anchor_high:"completely ready"},
    {qid:"b",text:"How comfortable are you with complex patient management?",ty:"s",anchor_low:"not comfortable at all",anchor_high:"very comfortable"},
    {qid:"c",text:"How satisfied are you with the onboarding program overall?",ty:"s",anchor_low:"very dissatisfied",anchor_high:"very satisfied"},
    {qid:"d",text:"What would you tell the next new provider about this process?",ty:"t"},
  ]},
  {id:"m2",label:"Month 2",qs:[
    {qid:"a",text:"How confident do you feel in performing your job responsibilities?",ty:"s",anchor_low:"not confident at all",anchor_high:"very confident"},
    {qid:"b",text:"How supported do you feel by leadership?",ty:"s",anchor_low:"not supported at all",anchor_high:"fully supported"},
    {qid:"c",text:"How well do you feel integrated into your team?",ty:"s",anchor_low:"not at all integrated",anchor_high:"fully integrated"},
    {qid:"d",text:"How confident do you feel navigating Epic?",ty:"s",anchor_low:"not confident at all",anchor_high:"very confident"},
    {qid:"e",text:"How effective was the side-by-side Epic training in preparing you for patient care?",ty:"s",anchor_low:"not effective at all",anchor_high:"very effective"},
    {qid:"f",text:"How confident are you in your ability to complete visit-level coding accurately?",ty:"s",anchor_low:"not confident at all",anchor_high:"very confident"},
    {qid:"g",text:"What additional support or resources would help you succeed in your role moving forward?",ty:"t"},
  ]},
  {id:"m3",label:"Month 3",qs:[
    {qid:"a",text:"How satisfied are you with your role and responsibilities so far?",ty:"s",anchor_low:"not satisfied at all",anchor_high:"extremely satisfied"},
    {qid:"b",text:"How accessible is your medical director when you need guidance?",ty:"s",anchor_low:"not accessible at all",anchor_high:"very accessible"},
    {qid:"c",text:"How would you rate the communication with your clinical team?",ty:"s",anchor_low:"poor communication",anchor_high:"great communication"},
    {qid:"d",text:"How well do you understand and align with the company's culture and values?",ty:"s",anchor_low:"not at all clear",anchor_high:"very clear"},
    {qid:"e",text:"Do you have a clear understanding of growth and development opportunities?",ty:"s",anchor_low:"not clear at all",anchor_high:"very clear"},
    {qid:"f",text:"Looking back on your first 90 days, what has gone well, and what could have been better?",ty:"t"},
    {qid:"ci1",text:"Do you feel like a valued member of the team?",ty:"s",culture:true},
    {qid:"ci2",text:"Do you have at least one colleague you would consider a friend or close ally here?",ty:"s",culture:true},
    {qid:"ci3",text:"Do you feel comfortable asking for help when you need it?",ty:"s",culture:true},
    {qid:"ci4",text:"Would you recommend this organization to a colleague considering a similar role?",ty:"s",culture:true},
  ]},
  {id:"m6",label:"Month 6",qs:[
    {qid:"a",text:"How confident do you feel in your ability to manage your patient panel independently?",ty:"s",anchor_low:"not confident at all",anchor_high:"very confident"},
    {qid:"b",text:"How well do you feel your workload is sustainable for the long term?",ty:"s",anchor_low:"not sustainable at all",anchor_high:"very sustainable"},
    {qid:"c",text:"How valued do you feel as a member of this organization?",ty:"s",anchor_low:"not valued at all",anchor_high:"very valued"},
    {qid:"d",text:"How satisfied are you with the level of autonomy you have in your role?",ty:"s",anchor_low:"not satisfied at all",anchor_high:"very satisfied"},
    {qid:"e",text:"How confident are you in your ability to meet quality and performance expectations?",ty:"s",anchor_low:"not confident at all",anchor_high:"very confident"},
    {qid:"f",text:"Now that you are six months in, what is one thing you wish you had known on day one?",ty:"t"},
    {qid:"ci1",text:"Do you feel like a valued member of the team?",ty:"s",culture:true},
    {qid:"ci2",text:"Do you have at least one colleague you would consider a friend or close ally here?",ty:"s",culture:true},
    {qid:"ci3",text:"Do you feel comfortable asking for help when you need it?",ty:"s",culture:true},
    {qid:"ci4",text:"Would you recommend this organization to a colleague considering a similar role?",ty:"s",culture:true},
  ]},
  {id:"m9",label:"Month 9",qs:[
    {qid:"a",text:"How satisfied are you in your current role?",ty:"s",anchor_low:"not supported at all",anchor_high:"fully supported"},
    {qid:"b",text:"How strongly do you feel that your organization supports growth?",ty:"s",anchor_low:"not supported at all",anchor_high:"fully supported"},
    {qid:"c",text:"How efficient do you feel with documentation?",ty:"s",anchor_low:"not supported at all",anchor_high:"fully supported"},
    {qid:"d",text:"What have you found to be the biggest difference that is needed?",ty:"t"},
    {qid:"ci1",text:"Do you feel like a valued member of the team?",ty:"s",culture:true},
    {qid:"ci2",text:"Do you have at least one colleague you would consider a friend or close ally here?",ty:"s",culture:true},
    {qid:"ci3",text:"Do you feel comfortable asking for help when you need it?",ty:"s",culture:true},
    {qid:"ci4",text:"Would you recommend this organization to a colleague considering a similar role?",ty:"s",culture:true},
  ]},
  {id:"m12",label:"Month 12",qs:[
    {qid:"a",text:"How motivated do you feel in your current role?",ty:"s",anchor_low:"not at all motivated",anchor_high:"extremely motivated"},
    {qid:"b",text:"How would you rate your current work-life balance?",ty:"s",anchor_low:"very poor",anchor_high:"excellent"},
    {qid:"c",text:"How often do you feel recognized for your contributions?",ty:"s",anchor_low:"never",anchor_high:"always"},
    {qid:"d",text:"How satisfied are you with your career growth and development over the past year?",ty:"s",anchor_low:"very dissatisfied",anchor_high:"very satisfied"},
    {qid:"e",text:"How supported do you feel by your manager in achieving your goals?",ty:"s",anchor_low:"not supported at all",anchor_high:"fully supported"},
    {qid:"f",text:"What would make your experience here even better in the next 12 months?",ty:"t"},
    {qid:"ci1",text:"Do you feel like a valued member of the team?",ty:"s",culture:true},
    {qid:"ci2",text:"Do you have at least one colleague you would consider a friend or close ally here?",ty:"s",culture:true},
    {qid:"ci3",text:"Do you feel comfortable asking for help when you need it?",ty:"s",culture:true},
    {qid:"ci4",text:"Would you recommend this organization to a colleague considering a similar role?",ty:"s",culture:true},
  ]},
];

const QP_TO_OM = {w0:"om1",w1:"om1",w2:"om1",w3:"om1",m1:"om1",w5:"om2",w6:"om2",w7:"om2",m2:"om2",m3:"om3",m6:"om6",m9:"om9",m12:"om12"};
const USERS = [
  {id:"md1",name:"Dr. Rivera",role:"director"},
  {id:"mt1",name:"Dr. Smith",role:"mentor"},
  {id:"mt2",name:"Dr. Lee",role:"mentor"},
  {id:"mt3",name:"M. Torres, NP",role:"mentor"},
];
const SEED_PROVS = [
  // Dr. Smith's panel — physicians
  {id:"p1",name:"Dr. Elena Vasquez",         role:"MD", mentor:"mt1", phase:"w1",  days:9},
  {id:"p5",name:"Dr. Ananya Krishnamurthy",  role:"MD", mentor:"mt1", phase:"w3",  days:26},
  {id:"p2",name:"Dr. James Okonkwo",         role:"DO", mentor:"mt1", phase:"m3",  days:94},
  // Dr. Lee's panel — physicians
  {id:"p3",name:"Dr. Sarah Brennan",         role:"MD", mentor:"mt2", phase:"w6",  days:47},
  {id:"p4",name:"Dr. Michael Chen",          role:"DO", mentor:"mt2", phase:"m6",  days:188},
  {id:"p6",name:"Dr. Robert Hargrove",       role:"MD", mentor:"mt2", phase:"m9",  days:276},
  // M. Torres panel — APCs
  {id:"p8",name:"B. Nguyen, PA",             role:"PA", mentor:"mt3", phase:"m3",  days:91},
  {id:"p9",name:"L. Ferreira, NP",           role:"NP", mentor:"mt3", phase:"m9",  days:273},
  {id:"p7",name:"C. Obi, NP",               role:"NP", mentor:"mt3", phase:"m18", days:549},
];
let PROVS = SEED_PROVS;

/* ─── Shared UI helpers (module-level so they're in scope for modals) ─── */
const initialsOf = (name: string) => name.split(/[\s.,]+/).filter(Boolean).slice(0, 2).map((s: string) => s[0]).join("").toUpperCase();
const dotColor = (c: string) => c === "green" ? "#22c55e" : c === "amber" ? "#eab308" : c === "red" ? "#ef4444" : "#d1d5db";
const avatar = (name: string, red: boolean) => (
  <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 700, background: red ? "rgba(239,68,68,0.10)" : "rgba(2,128,144,0.10)", color: red ? "#dc2626" : "#028090" }}>{initialsOf(name)}</div>
);

/* ─── Seed Data ─── */
function makeSeedChecks() {
  const c = {};
  const fill = (pid, ids) => {
    ids.forEach(phid => {
      const ph = MP.find(x => x.id === phid);
      if (ph) ph.items.forEach((_, i) => { c[pid + "." + phid + "." + i] = true; });
    });
  };
  // p1 Vasquez  — w1,  day 9
  fill("p1", ["w0","w1"]);
  // p5 Krishnamurthy — w3, day 26
  fill("p5", ["w0","w1","w2","w3"]);
  // p2 Okonkwo — m3, day 94
  fill("p2", ["w0","w1","w2","w3","m1","w5","w6","w7","m2","m3"]);
  // p3 Brennan — w6, day 47
  fill("p3", ["w0","w1","w2","w3","m1","w5","w6"]);
  // p4 Chen — m6, day 188
  fill("p4", ["w0","w1","w2","w3","m1","w5","w6","w7","m2","m3","m4","m5","m6"]);
  // p6 Hargrove — m9, day 276  (culturally isolated MD — still completes curriculum)
  fill("p6", ["w0","w1","w2","w3","m1","w5","w6","w7","m2","m3","m4","m5","m6","m7","m8","m9"]);
  // p8 Nguyen PA — m3, day 91  (culturally struggling PA)
  fill("p8", ["w0","w1","w2","w3","m1","w5","w6","w7","m2","m3"]);
  // p9 Ferreira NP — m9, day 273
  fill("p9", ["w0","w1","w2","w3","m1","w5","w6","w7","m2","m3","m4","m5","m6","m7","m8","m9"]);
  // p7 Obi NP — m18, day 549
  fill("p7", ["w0","w1","w2","w3","m1","w5","w6","w7","m2","m3","m4","m5","m6","m7","m8","m9","m12","m15","m18"]);
  return c;
}

function makeSeedQA() {
  const qa = {};
  // Mentor questionnaire scores — all well-intentioned, solid trajectory
  const scores = {
    p1:{w0:8,w1:8},
    p5:{w0:8,w1:8,w2:8,w3:8},
    p2:{w0:8,w1:7,w2:7,w3:8,m1:8,w5:7,w6:8,w7:8,m2:8,m3:9},
    p3:{w0:8,w1:7,w2:7,w3:8,m1:8,w5:8,w6:8},
    p4:{w0:8,w1:7,w2:7,w3:8,m1:8,w5:8,w6:8,w7:8,m2:8,m3:8,m4:8,m5:8,m6:9},
    p6:{w0:7,w1:6,w2:6,w3:7,m1:7,w5:6,w6:7,w7:7,m2:7,m3:7,m4:7,m5:7,m6:7,m7:7,m8:6,m9:6},
    p8:{w0:7,w1:6,w2:6,w3:6,m1:6,w5:5,w6:6,w7:6,m2:6,m3:6},
    p9:{w0:8,w1:8,w2:8,w3:9,m1:8,w5:8,w6:9,w7:9,m2:9,m3:9,m4:8,m5:9,m6:9,m7:8,m8:8,m9:9},
    p7:{w0:9,w1:8,w2:8,w3:9,m1:8,w5:8,w6:9,w7:9,m2:9,m3:9,m4:9,m5:9,m6:9,m7:9,m8:9,m9:9,m12:9,m15:9,m18:9},
  };
  Object.entries(scores).forEach(([pid, phases]) => {
    Object.entries(phases).forEach(([phid, avg]) => {
      const qp = QP.find(x => x.id === phid);
      if (qp) qp.qs.forEach(q => { qa[pid + "." + phid + "." + q.qid] = q.ty === "s" ? String(avg) : "Demo response"; });
    });
  });
  // OM scores — generally positive; lower for the two culturally struggling providers
  const omScores = {
    p2:{om1:8,om2:8,om3:9},
    p4:{om1:8,om2:8,om3:8,om6:8},
    p6:{om1:5,om2:5,om3:5,om6:5},  // Hargrove — OM notices the friction
    p8:{om1:4,om2:4,om3:5},        // Nguyen — OM flagging concern
    p9:{om1:8,om2:9,om3:9,om6:8},
    p7:{om1:9,om2:9,om3:9,om6:9},
  };
  Object.entries(omScores).forEach(([pid, phases]) => {
    Object.entries(phases).forEach(([phid, avg]) => {
      const op = OP.find(x => x.id === phid);
      if (op) op.qs.forEach(q => {
        qa[pid + "." + phid + "." + q.qid] = q.ty === "s" ? String(avg) : (avg >= 7 ? "Settling in well, good rapport with staff." : "Seems a bit withdrawn — not connecting with the team as hoped.");
      });
    });
  });
  // CII scores — high for most; p6 Hargrove (MD) and p8 Nguyen (PA) are the two at-risk outliers
  const ciiScores = {
    // p2 Okonkwo — thriving at m3
    "p2.m3.ci1":"9","p2.m3.ci2":"8","p2.m3.ci3":"9","p2.m3.ci4":"8",
    // p4 Chen — strong at m3 and m6
    "p4.m3.ci1":"8","p4.m3.ci2":"9","p4.m3.ci3":"8","p4.m3.ci4":"8",
    "p4.m6.ci1":"9","p4.m6.ci2":"9","p4.m6.ci3":"8","p4.m6.ci4":"9",
    // p6 Hargrove — culturally isolated MD; low across all checkpoints
    "p6.m3.ci1":"4","p6.m3.ci2":"3","p6.m3.ci3":"4","p6.m3.ci4":"3",
    "p6.m6.ci1":"3","p6.m6.ci2":"3","p6.m6.ci3":"4","p6.m6.ci4":"3",
    "p6.m9.ci1":"3","p6.m9.ci2":"4","p6.m9.ci3":"3","p6.m9.ci4":"3",
    // p8 Nguyen — culturally struggling PA; low at m3
    "p8.m3.ci1":"3","p8.m3.ci2":"4","p8.m3.ci3":"3","p8.m3.ci4":"4",
    // p9 Ferreira — thriving NP across m3/m6/m9
    "p9.m3.ci1":"8","p9.m3.ci2":"9","p9.m3.ci3":"8","p9.m3.ci4":"8",
    "p9.m6.ci1":"9","p9.m6.ci2":"8","p9.m6.ci3":"9","p9.m6.ci4":"8",
    "p9.m9.ci1":"9","p9.m9.ci2":"9","p9.m9.ci3":"8","p9.m9.ci4":"9",
    // p7 Obi — exemplary NP, high scores through m18
    "p7.m3.ci1":"9","p7.m3.ci2":"9","p7.m3.ci3":"8","p7.m3.ci4":"9",
    "p7.m6.ci1":"9","p7.m6.ci2":"9","p7.m6.ci3":"9","p7.m6.ci4":"8",
    "p7.m9.ci1":"9","p7.m9.ci2":"9","p7.m9.ci3":"9","p7.m9.ci4":"9",
    "p7.m12.ci1":"9","p7.m12.ci2":"9","p7.m12.ci3":"9","p7.m12.ci4":"9",
    "p7.m15.ci1":"9","p7.m15.ci2":"9","p7.m15.ci3":"9","p7.m15.ci4":"8",
    "p7.m18.ci1":"9","p7.m18.ci2":"9","p7.m18.ci3":"9","p7.m18.ci4":"9",
  };
  Object.assign(qa, ciiScores);
  return qa;
}

/* ─── Persistence ─── */
const MT_KEY = "meridian-mt.v1";
function loadMT() {
  try { const r = localStorage.getItem(MT_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveMT(d) {
  try { localStorage.setItem(MT_KEY, JSON.stringify(d)); } catch {}
}

/* ─── JSON Export ─── */
function exportJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mentorship-tracker-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── DOCX Export (one document, all providers) ─── */
async function exportDocx(provs, checks, qa, notes, meetings) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
  const children = [];
  for (const p of provs) {
    const phLabel = (MP.find(x => x.id === p.phase) || {}).label || p.phase;
    children.push(new Paragraph({ children: [new TextRun({ text: p.name + " (" + p.role + ")", bold: true, size: 36 })], heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ children: [new TextRun("Days in practice: " + p.days + "  ·  Current phase: " + phLabel + "  ·  Mentor: " + (USERS.find(u => u.id === p.mentor) || {}).name)] }));
    children.push(new Paragraph({}));

    children.push(new Paragraph({ children: [new TextRun({ text: "Medical Director Curriculum", bold: true })], heading: HeadingLevel.HEADING_2 }));
    MD_PHASES.forEach(function(ph) {
      const items = MD_ITEMS_BY_PHASE[ph.id] || [];
      if (items.length === 0) return;
      const done = items.filter(function(it) { return checks[p.id + ".md." + it.id]; }).length;
      children.push(new Paragraph({ children: [new TextRun("  " + ph.label + ": " + done + "/" + items.length + " completed")] }));
    });
    children.push(new Paragraph({}));

    children.push(new Paragraph({ children: [new TextRun({ text: "Mentor: Physician Track", bold: true })], heading: HeadingLevel.HEADING_2 }));
    MP_PHYS.forEach(function(ph) {
      const c = countChecks(checks, p.id, ph.id);
      children.push(new Paragraph({ children: [new TextRun("  " + (c.pct === 100 ? "✓" : "○") + " " + ph.label + " — " + c.done + "/" + c.total)] }));
    });
    children.push(new Paragraph({}));

    if (isAPC(p)) {
      children.push(new Paragraph({ children: [new TextRun({ text: "Mentor: APC Track (Year 2)", bold: true })], heading: HeadingLevel.HEADING_2 }));
      MP_APC.forEach(function(ph) {
        const c = countChecks(checks, p.id, ph.id);
        children.push(new Paragraph({ children: [new TextRun("  " + (c.pct === 100 ? "✓" : "○") + " " + ph.label + " — " + c.done + "/" + c.total)] }));
      });
      children.push(new Paragraph({}));
    }

    children.push(new Paragraph({ children: [new TextRun({ text: "Questionnaire Scores", bold: true })], heading: HeadingLevel.HEADING_2 }));
    let hasScores = false;
    QP.forEach(function(qp) {
      const s = avgScore(qa, p.id, qp.id);
      if (s !== null) { hasScores = true; children.push(new Paragraph({ children: [new TextRun("  " + qp.label + ": " + s.toFixed(1) + " / 10")] })); }
    });
    if (!hasScores) children.push(new Paragraph({ children: [new TextRun("  No scores recorded")] }));
    children.push(new Paragraph({}));

    const allNotes = [];
    Object.entries(notes).forEach(function([key, arr]) {
      if (!key.startsWith(p.id + ".")) return;
      const phId = key.split(".")[1];
      const ph = MP.find(function(x) { return x.id === phId; }) || OP.find(function(x) { return x.id === phId; });
      arr.forEach(function(n) { allNotes.push({ phase: ph ? ph.label : phId, ...n }); });
    });
    if (allNotes.length > 0) {
      children.push(new Paragraph({ children: [new TextRun({ text: "Notes", bold: true })], heading: HeadingLevel.HEADING_2 }));
      allNotes.forEach(function(n) {
        children.push(new Paragraph({ children: [new TextRun("  [" + n.phase + "] " + n.by + " — " + n.at + ": " + n.text)] }));
      });
      children.push(new Paragraph({}));
    }

    const allMeetings = [];
    Object.entries(meetings || {}).forEach(function([key, arr]) {
      if (!key.startsWith(p.id + ".")) return;
      const phId = key.split(".")[1];
      const ph = MP.find(function(x) { return x.id === phId; }) || OP.find(function(x) { return x.id === phId; });
      arr.forEach(function(m) { allMeetings.push({ phase: ph ? ph.label : phId, ...m }); });
    });
    allMeetings.sort(function(a, b) { return a.date > b.date ? 1 : -1; });
    if (allMeetings.length > 0) {
      children.push(new Paragraph({ children: [new TextRun({ text: "Meeting Log", bold: true })], heading: HeadingLevel.HEADING_2 }));
      allMeetings.forEach(function(m) {
        children.push(new Paragraph({ children: [new TextRun({ text: "  [" + m.phase + "] " + m.date + " — " + m.by, bold: true })] }));
        if (m.discussion) children.push(new Paragraph({ children: [new TextRun("  " + m.discussion)] }));
        (m.actions || []).forEach(function(a) {
          children.push(new Paragraph({ children: [new TextRun("    " + (a.done ? "☑" : "☐") + " " + a.text)] }));
        });
        children.push(new Paragraph({}));
      });
    }

    children.push(new Paragraph({ children: [new TextRun({ text: "─".repeat(60), color: "AAAAAA" })] }));
    children.push(new Paragraph({}));
  }
  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mentorship-tracker-" + new Date().toISOString().slice(0, 10) + ".docx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── Helpers ─── */
function phIdx(id) { return MP.findIndex(x => x.id === id); }

function countChecks(checks, pid, phid) {
  const ph = MP.find(x => x.id === phid);
  if (!ph) return { done: 0, total: 0, pct: 0 };
  let done = 0;
  ph.items.forEach((_, i) => { if (checks[pid + "." + phid + "." + i]) done++; });
  return { done, total: ph.items.length, pct: Math.round(done / ph.items.length * 100) };
}

function isAPC(prov) {
  return prov && (prov.role === "NP" || prov.role === "PA");
}

function mentorPhysPct(checks, pid) {
  const prov = PROVS.find(x => x.id === pid);
  const max = MP_PHYS.findIndex(ph => ph.id === prov.phase);
  let t = 0, d = 0;
  MP_PHYS.forEach((ph, i) => {
    if (max >= 0 && i > max) return;
    ph.items.forEach((_, j) => { t++; if (checks[pid + "." + ph.id + "." + j]) d++; });
  });
  return t > 0 ? Math.round(d / t * 100) : 0;
}

function mentorApcPct(checks, pid) {
  const prov = PROVS.find(x => x.id === pid);
  const max = MP_APC.findIndex(ph => ph.id === prov.phase);
  if (max < 0) return 0;
  let t = 0, d = 0;
  MP_APC.forEach((ph, i) => {
    if (i > max) return;
    ph.items.forEach((_, j) => { t++; if (checks[pid + "." + ph.id + "." + j]) d++; });
  });
  return t > 0 ? Math.round(d / t * 100) : 0;
}

/* Full APC mentor curriculum — year-1 onboarding (MP_PHYS) + year-2 APC phases,
   counted up to the provider's current phase. APCs run the same year-1 curriculum
   as physicians, so their single "Mentor: APC" tile spans the whole MP track. */
function mentorFullPct(checks, pid) {
  const prov = PROVS.find(x => x.id === pid);
  const max = MP.findIndex(ph => ph.id === prov.phase);
  let t = 0, d = 0;
  MP.forEach((ph, i) => {
    if (max >= 0 && i > max) return;
    ph.items.forEach((_, j) => { t++; if (checks[pid + "." + ph.id + "." + j]) d++; });
  });
  return t > 0 ? Math.round(d / t * 100) : 0;
}

function mentorPct(checks, pid) {
  return mentorPhysPct(checks, pid);
}

function opsPct(qa, pid) {
  let t = 0, a = 0;
  OP.forEach(ph => {
    ph.qs.forEach(q => {
      t++;
      const v = qa[pid + "." + ph.id + "." + q.qid];
      if (v !== undefined && v !== "") a++;
    });
  });
  return t > 0 ? Math.round(a / t * 100) : 0;
}

// Medical Director Curriculum coverage: percentage of curriculum items completed up to and
// including the provider's current phase. Pre-start phases (pre0, pre1) are
// always counted because they happen before any provider's tracked days.
function mdCurriculumPct(checks, pid) {
  const prov = PROVS.find(x => x.id === pid);
  const provWeekIdx = phIdx(prov.phase); // index in MP (0 = w1)
  let t = 0, d = 0;
  MD_ITEMS.forEach(item => {
    const phPos = MD_PHASE_INDEX[item.phase];
    const isPreStart = phPos < MD_W1_INDEX;
    // For pre0/pre1, always counted. For w1+, count only if provider has
    // reached or passed that week. (MD_W1_INDEX is "w1" in MD_PHASES; the
    // corresponding index in MP is 0.)
    const phWeekIdx = phPos - MD_W1_INDEX;
    if (!isPreStart && phWeekIdx > provWeekIdx) return;
    t++;
    if (checks[pid + ".md." + item.id]) d++;
  });
  return t > 0 ? Math.round(d / t * 100) : 0;
}

function questPct(qa, pid) {
  const prov = PROVS.find(x => x.id === pid);
  const max = phIdx(prov.phase);
  let t = 0, a = 0;
  QP.forEach(qp => { if (phIdx(qp.id) > max) return; qp.qs.forEach(q => { t++; const v = qa[pid + "." + qp.id + "." + q.qid]; if (v !== undefined && v !== "") a++; }); });
  return t > 0 ? Math.round(a / t * 100) : 0;
}

/* NEW: Average questionnaire score for a provider at a phase (excludes culture questions) */
function avgScore(qa, pid, phid) {
  const qp = QP.find(x => x.id === phid);
  if (!qp) return null;
  let sum = 0, cnt = 0;
  qp.qs.forEach(function(q) {
    if (q.ty === "s" && !q.culture) {
      const v = qa[pid + "." + phid + "." + q.qid];
      if (v !== undefined && v !== "") { sum += Number(v); cnt++; }
    }
  });
  return cnt > 0 ? sum / cnt : null;
}

/* Culture Integration Index helpers */
const CULTURE_PHASES = ["m3", "m6", "m9", "m12"];
const CULTURE_PHASES_APC_EXT = ["m15", "m18", "m21", "m24"];
const CULTURE_QIDS = ["ci1", "ci2", "ci3", "ci4"];

/* Per-phase culture score (avg of 4 questions, null if none answered) */
function culturePhaseScore(qa, pid, phid) {
  let sum = 0, cnt = 0;
  CULTURE_QIDS.forEach(function(qid) {
    const v = qa[pid + "." + phid + "." + qid];
    if (v !== undefined && v !== "") { sum += Number(v); cnt++; }
  });
  return cnt > 0 ? sum / cnt : null;
}

/* Overall culture score across all answered culture phases */
function cultureScore(qa, pid, apcFlag) {
  const phases = apcFlag ? [...CULTURE_PHASES, ...CULTURE_PHASES_APC_EXT] : CULTURE_PHASES;
  let sum = 0, cnt = 0;
  phases.forEach(function(phid) {
    CULTURE_QIDS.forEach(function(qid) {
      const v = qa[pid + "." + phid + "." + qid];
      if (v !== undefined && v !== "") { sum += Number(v); cnt++; }
    });
  });
  if (cnt === 0) return { avg: null, pct: 0, display: "Future-Scheduled" };
  const avg = sum / cnt;
  return { avg: avg, pct: Math.round(avg * 10), display: avg.toFixed(1) };
}

/* Band label + colors for a CII average (null → Future-Scheduled). */
function cultureBand(avg) {
  if (avg === null || avg === undefined) return { key: "sched", label: "Future-Sched'd", fg: "#868e96", bg: "#f1f3f5", bar: "#cbd5e1" };
  if (avg >= 7) return { key: "thriving",   label: "Thriving",   fg: "#15803d", bg: "#dcfce7", bar: "#22c55e" };
  if (avg >= 5) return { key: "developing", label: "Developing", fg: "#854d0e", bg: "#fef9c3", bar: "#eab308" };
  return { key: "atrisk", label: "At Risk", fg: "#b91c1c", bg: "#fee2e2", bar: "#ef4444" };
}

/* Trend arrow comparing the two most recent answered culture checkpoints.
   Returns { arrow, dir } — dir is "up" | "down" | "flat" | "none". */
function cultureTrend(qa, pid, apcFlag) {
  const phases = apcFlag ? [...CULTURE_PHASES, ...CULTURE_PHASES_APC_EXT] : CULTURE_PHASES;
  const scored = phases.map(phid => culturePhaseScore(qa, pid, phid)).filter(v => v !== null);
  if (scored.length < 2) return { arrow: "", dir: "none" };
  const delta = scored[scored.length - 1] - scored[scored.length - 2];
  if (delta > 0.25) return { arrow: "↑", dir: "up" };
  if (delta < -0.25) return { arrow: "↓", dir: "down" };
  return { arrow: "→", dir: "flat" };
}

/* Overdue status based on days — indices refer to MP_PHYS (0=w0 … 16=m12) */
function getStatus(pid) {
  const prov = PROVS.find(x => x.id === pid);
  const ci = phIdx(prov.phase);
  const d = prov.days;
  let expected;
  if (d >= 365) expected = 16;
  else if (d >= 270) expected = 15;
  else if (d >= 240) expected = 14;
  else if (d >= 210) expected = 13;
  else if (d >= 180) expected = 12;
  else if (d >= 150) expected = 11;
  else if (d >= 120) expected = 10;
  else if (d >= 90) expected = 9;
  else if (d >= 60) expected = 8;
  else expected = Math.floor(d / 7);
  if (expected > ci + 2) return "overdue";
  if (expected > ci) return "due";
  return "ok";
}

/* Enhanced cross-provider pattern detection */
function detectPatterns(qa) {
  const alerts = [];
  const phaseComparison = QP.map(function(ph) {
    const vals = PROVS.map(function(prov) { return avgScore(qa, prov.id, ph.id); }).filter(function(v) { return v !== null; });
    const avg = vals.length > 0 ? vals.reduce(function(a, b) { return a + b; }, 0) / vals.length : null;
    return {label: ph.label, id: ph.id, avg: avg};
  });
  QP.forEach(function(qp, qpIdx) {
    const providerScores = [];
    PROVS.forEach(function(prov) {
      const a = avgScore(qa, prov.id, qp.id);
      if (a !== null) providerScores.push({name: prov.name, pid: prov.id, avg: a});
    });
    if (providerScores.length < 2) return;
    const below = providerScores.filter(function(s) { return s.avg < 6; });
    if (below.length < 2 || below.length / providerScores.length < 0.5) return;
    const overall = providerScores.reduce(function(s, x) { return s + x.avg; }, 0) / providerScores.length;
    const questionBreakdown = qp.qs.filter(function(q) { return q.ty === "s"; }).map(function(q) {
      const vals = providerScores.map(function(ps) {
        const v = qa[ps.pid + "." + qp.id + "." + q.qid];
        return (v !== undefined && v !== "") ? parseFloat(v) : null;
      }).filter(function(v) { return v !== null; });
      const avg = vals.length > 0 ? vals.reduce(function(a, b) { return a + b; }, 0) / vals.length : null;
      return {text: q.text, avg: avg};
    }).filter(function(x) { return x.avg !== null; }).sort(function(a, b) { return a.avg - b.avg; });
    const omPhaseId = QP_TO_OM[qp.id];
    const omPhase = OP.find(function(x) { return x.id === omPhaseId; });
    let omCategoryAvgs = null;
    if (omPhase) {
      const catAvgs = omPhase.qs.filter(function(q) { return q.ty === "s"; }).map(function(q) {
        const vals = PROVS.map(function(prov) {
          const v = qa[prov.id + "." + omPhaseId + "." + q.qid];
          return (v !== undefined && v !== "") ? parseFloat(v) : null;
        }).filter(function(v) { return v !== null; });
        const avg = vals.length > 0 ? vals.reduce(function(a, b) { return a + b; }, 0) / vals.length : null;
        return {label: q.label, avg: avg};
      }).filter(function(x) { return x.avg !== null; });
      if (catAvgs.length > 0) omCategoryAvgs = catAvgs;
    }
    const prevQP = qpIdx > 0 ? QP[qpIdx - 1] : null;
    let sharpestDecline = null;
    if (prevQP) {
      let maxDrop = -Infinity;
      providerScores.forEach(function(ps) {
        const prevAvg = avgScore(qa, ps.pid, prevQP.id);
        if (prevAvg !== null) {
          const drop = prevAvg - ps.avg;
          if (drop > maxDrop) { maxDrop = drop; sharpestDecline = {name: ps.name, prevPhase: prevQP.label, prevAvg: prevAvg, curAvg: ps.avg, drop: drop}; }
        }
      });
    }
    alerts.push({phaseId: qp.id, label: qp.label, affected: below.length, total: providerScores.length, avg: overall.toFixed(1), providerScores: providerScores, questionBreakdown: questionBreakdown, omPhaseId: omPhaseId, omCategoryAvgs: omCategoryAvgs, sharpestDecline: sharpestDecline, phaseComparison: phaseComparison});
  });
  alerts.sort(function(a, b) { return parseFloat(a.avg) - parseFloat(b.avg); });
  return alerts;
}

/* ─── Components ─── */
function Bar({ label, pct, color }) {
  const dc = pct >= 70 ? "#22c55e" : pct >= 30 ? color : pct > 0 ? "#ef4444" : "#adb5bd";
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#868e96", marginBottom: 2 }}>
        <span>{label}</span>
        <strong style={{ color: dc }}>{pct}%</strong>
      </div>
      <div style={{ height: 6, background: "#e9ecef", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function CheckItem({ text, checked, canEdit, onToggle }) {
  return (
    <div onClick={canEdit ? onToggle : undefined}
      style={{ padding: "12px 20px", cursor: canEdit ? "pointer" : "default", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid #dee2e6", background: checked ? "rgba(34,197,94,0.04)" : "transparent" }}>
      <div style={{ width: 24, height: 24, borderRadius: 5, border: "2px solid " + (checked ? "#22c55e" : "#dee2e6"), background: checked ? "#22c55e" : "white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
        {checked ? "✓" : ""}
      </div>
      <div style={{ fontSize: 14, color: checked ? "#868e96" : "#1c2b3a", textDecoration: checked ? "line-through" : "none" }}>{text}</div>
    </div>
  );
}

function ScaleInput({ value, onChange, anchorLow, anchorHigh }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 6 }}>
        {[0,1,2,3,4,5,6,7,8,9,10].map(n => {
          const sel = value === String(n);
          let bg = "#e9ecef";
          if (sel) bg = n >= 8 ? "#22c55e" : n >= 5 ? "#eab308" : "#ef4444";
          return (
            <button key={n} onClick={() => onChange(String(n))}
              style={{ width: 40, height: 40, borderRadius: 8, border: "2px solid " + (sel ? bg : "#dee2e6"), background: sel ? bg : "white", color: sel ? "white" : "#1c2b3a", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              {n}
            </button>
          );
        })}
      </div>
      {anchorLow || anchorHigh ? (
        <div style={{ marginTop: 6, fontSize: 11, color: "#868e96" }}>
          <div><strong style={{ color: "#ef4444" }}>0</strong> — {anchorLow}</div>
          <div><strong style={{ color: "#22c55e" }}>10</strong> — {anchorHigh}</div>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#868e96", marginTop: 4 }}>
          <span>Not at all</span>
          <span>Completely</span>
        </div>
      )}
    </div>
  );
}

/* NEW: Score trend bars */
function ScoreTrend({ qa, pid }) {
  const scores = [];
  MP.forEach(ph => {
    const s = avgScore(qa, pid, ph.id);
    if (s !== null) scores.push({ label: ph.label.replace("Week ", "W").replace("Month ", "M"), score: s });
  });
  if (scores.length < 2) return null;
  return (
    <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", padding: "14px 20px", marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f1b2d", marginBottom: 10 }}>Questionnaire Score Trend</div>
      {scores.map((s, i) => {
        const pctW = s.score / 10 * 100;
        const c = s.score >= 7 ? "#22c55e" : s.score >= 5 ? "#eab308" : "#ef4444";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <div style={{ width: 30, fontSize: 10, color: "#868e96", textAlign: "right" }}>{s.label}</div>
            <div style={{ flex: 1, height: 14, background: "#f1f3f5", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: pctW + "%", background: c, borderRadius: 3 }} />
            </div>
            <div style={{ width: 28, fontSize: 12, fontWeight: 700, color: c, textAlign: "right" }}>{s.score.toFixed(1)}</div>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#868e96", marginTop: 4 }}>
        <span>0</span>
        <span style={{ color: "#eab308" }}>Threshold: 6.0</span>
        <span>10</span>
      </div>
    </div>
  );
}

/* Journey timeline — phases array is passed in (MP_PHYS or full MP for APCs) */
function Timeline({ phases, currentPhaseId }) {
  return (
    <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", padding: "14px 20px", marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 10 }}>ONBOARDING JOURNEY</div>
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {phases.map((ph, i) => {
          const curI = phases.findIndex(p => p.id === currentPhaseId);
          const done = curI >= 0 && i < curI;
          const isCur = ph.id === currentPhaseId;
          const c = done ? "#22c55e" : isCur ? "#028090" : "#e9ecef";
          return (
            <div key={ph.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "100%", height: 6, background: c, borderRadius: i === 0 ? "3px 0 0 3px" : i === MP.length - 1 ? "0 3px 3px 0" : 0 }} />
              <div style={{ width: isCur ? 12 : 6, height: isCur ? 12 : 6, borderRadius: "50%", background: c, marginTop: 4, border: isCur ? "2px solid #028090" : "none", boxShadow: isCur ? "0 0 0 3px rgba(2,128,144,0.2)" : "none" }} />
              <div style={{ fontSize: 7, color: done ? "#22c55e" : isCur ? "#028090" : "#adb5bd", marginTop: 2, fontWeight: isCur ? 700 : 400 }}>
                {ph.label.replace("Week ", "W").replace("Month ", "M").replace("W0","W0")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Medical Director Curriculum row (used by per-phase view + View-All modal) ─── */
const OWNER_LABEL = { MD: "Medical Director", Mentor: "Mentor", OM: "Office Manager", CS: "Care Specialist" };
function MdCurriculumRow({ item, checked, canEdit, onToggle, showPhase }) {
  const ownerColor = {
    MD: "#8b5cf6",
    Mentor: "#028090",
    OM: "#0ea5e9",
    CS: "#16a085",
  }[item.owner] || "#868e96";
  return (
    <div onClick={canEdit ? onToggle : undefined}
      style={{ padding: "12px 20px", cursor: canEdit ? "pointer" : "default", display: "flex", alignItems: "flex-start", gap: 14, borderBottom: "1px solid #dee2e6", background: checked ? "rgba(34,197,94,0.04)" : "transparent" }}>
      <div style={{ width: 24, height: 24, borderRadius: 5, border: "2px solid " + (checked ? "#22c55e" : "#dee2e6"), background: checked ? "#22c55e" : "white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
        {checked ? "✓" : ""}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 5, alignItems: "center" }}>
          {showPhase && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: "#8b5cf615", color: "#8b5cf6", textTransform: "uppercase" }}>
              {(MD_PHASES.find(p => p.id === item.phase) || {}).label}
            </span>
          )}
          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: ownerColor + "15", color: ownerColor, textTransform: "uppercase" }}>
            #{item.n} · {OWNER_LABEL[item.owner] || item.owner}
          </span>
          {item.partner && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: "#f1f3f5", color: "#868e96" }}>
              + {item.partner}
            </span>
          )}
          {item.misstep_risk && (
            <span title="Concrete misstep risk — keep verbatim when implementing" style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: "#fef2f2", color: "#ef4444" }}>
              ⚠ MISSTEP RISK
            </span>
          )}
          {item.depends_on && (
            <span title={"Pending: " + item.depends_on} style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: "#fefce8", color: "#92400e" }}>
              🔁 PENDING
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, color: checked ? "#868e96" : "#1c2b3a", textDecoration: checked ? "line-through" : "none", lineHeight: 1.4 }}>{item.text}</div>
        <div style={{ fontSize: 10, color: "#adb5bd", marginTop: 4 }}>{item.section}</div>
        {item.epic_ref_ids && item.epic_ref_ids.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 7 }}>
            {item.epic_ref_ids.map(rid => (
              <button key={rid}
                onClick={(e) => { e.stopPropagation(); openEpicRef(rid); }}
                style={{ padding: "3px 9px", borderRadius: 5, border: "1px solid #fde68a", background: "#fffbeb", color: "#92400e", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
                📖 {rid}
              </button>
            ))}
          </div>
        )}
        {item.depends_on && (
          <div style={{ fontSize: 10, color: "#92400e", marginTop: 5, fontStyle: "italic" }}>Depends on: {item.depends_on}</div>
        )}
      </div>
    </div>
  );
}

/* ─── View-All-Curriculum modal (chronological scroll, all three tracks) ─── */
// Renders Medical Director Curriculum (62 items pre0..q4), Mentor Check-Ins (MP w1..q4),
// and Office Manager (OP om1..om12) as three stacked sections in one
// scrollable modal. Per-track sticky header + per-phase sub-header. Only
// the Medical Director Curriculum carries the structured owner / partner / misstep /
// epic_ref_ids metadata — Mentor and OM rows are simple checkbox + text.
function MdViewAllModal({ open, onClose, prov, checks, setChecks, isDir, isMen, qa }) {
  if (!open) return null;

  // Per-track totals + completion counts (only counted when a provider is
  // selected; otherwise the modal is a curriculum reference).
  const mdItems = MD_ITEMS;
  const mdDone = prov ? mdItems.filter(it => checks[prov.id + ".md." + it.id]).length : 0;
  let mpPhysTotal = 0, mpPhysDone = 0;
  MP_PHYS.forEach(ph => ph.items.forEach((_, i) => {
    mpPhysTotal++;
    if (prov && checks[prov.id + "." + ph.id + "." + i]) mpPhysDone++;
  }));
  let mpApcTotal = 0, mpApcDone = 0;
  MP_APC.forEach(ph => ph.items.forEach((_, i) => {
    mpApcTotal++;
    if (prov && checks[prov.id + "." + ph.id + "." + i]) mpApcDone++;
  }));
  let opTotal = 0, opDone = 0;
  OP.forEach(ph => ph.qs.forEach(q => {
    opTotal++;
    if (prov) {
      const v = qa[prov.id + "." + ph.id + "." + q.qid];
      if (v !== undefined && v !== "") opDone++;
    }
  }));

  // Edit perms by track. Mirrors the App-level canChk semantics:
  // Medical Director items → director only; MP items → director or mentor; OP → director.
  const canEditMd = !!prov && isDir;
  const canEditMp = !!prov && (isDir || isMen);
  const canEditOp = !!prov && isDir;

  function toggle(key) {
    setChecks(prev => { const n = { ...prev }; if (n[key]) delete n[key]; else n[key] = true; return n; });
  }

  const tracks = [
    {
      key: "md",
      title: "Medical Director Curriculum",
      subtitle: `${mdItems.length} items, pre-start → Month 12`,
      gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      accent: "#8b5cf6",
      done: mdDone,
      total: mdItems.length,
      groups: MD_PHASES.map(p => ({
        phase: p,
        items: MD_ITEMS_BY_PHASE[p.id] || [],
      })).filter(g => g.items.length > 0),
      renderRow: (item) => (
        <MdCurriculumRow
          key={item.id}
          item={item}
          showPhase={false}
          checked={prov ? !!checks[prov.id + ".md." + item.id] : false}
          canEdit={canEditMd}
          onToggle={() => { if (prov) toggle(prov.id + ".md." + item.id); }}
        />
      ),
      countDone: (group) => prov ? group.items.filter(it => checks[prov.id + ".md." + it.id]).length : 0,
    },
    {
      key: "mp-phys",
      title: "Mentor Curriculum — Physician Track",
      subtitle: `${mpPhysTotal} items · Week 0 → Month 12 · All providers`,
      gradient: "linear-gradient(135deg, #028090, #014a52)",
      accent: "#028090",
      done: mpPhysDone,
      total: mpPhysTotal,
      groups: MP_PHYS.map(ph => ({ phase: ph, items: ph.items })),
      renderRow: (text, group, i) => (
        <CheckItem
          key={group.phase.id + ":" + i}
          text={text}
          checked={prov ? !!checks[prov.id + "." + group.phase.id + "." + i] : false}
          canEdit={canEditMp}
          onToggle={() => { if (prov) toggle(prov.id + "." + group.phase.id + "." + i); }}
        />
      ),
      countDone: (group) => prov ? group.items.filter((_, i) => checks[prov.id + "." + group.phase.id + "." + i]).length : 0,
    },
    {
      key: "mp-apc",
      title: "Mentor Curriculum — APC Track",
      subtitle: `${mpApcTotal} items · Month 15 → Month 24 · NP/PA only`,
      gradient: "linear-gradient(135deg, #7c3aed, #4c1d95)",
      accent: "#7c3aed",
      done: mpApcDone,
      total: mpApcTotal,
      groups: MP_APC.map(ph => ({ phase: ph, items: ph.items })),
      renderRow: (text, group, i) => (
        <CheckItem
          key={group.phase.id + ":" + i}
          text={text}
          checked={prov ? !!checks[prov.id + "." + group.phase.id + "." + i] : false}
          canEdit={canEditMp}
          onToggle={() => { if (prov) toggle(prov.id + "." + group.phase.id + "." + i); }}
        />
      ),
      countDone: (group) => prov ? group.items.filter((_, i) => checks[prov.id + "." + group.phase.id + "." + i]).length : 0,
    },
    {
      key: "op",
      title: "Office Manager",
      subtitle: `${opTotal} questions, Month 1 → Month 12`,
      gradient: "linear-gradient(135deg, #0ea5e9, #0369a1)",
      accent: "#0ea5e9",
      done: opDone,
      total: opTotal,
      groups: OP.map(ph => ({ phase: ph, items: ph.qs })),
      renderRow: (q, g) => {
        const val = prov ? (qa[prov.id + "." + g.phase.id + "." + q.qid] || "") : "";
        const answered = val !== "";
        return (
          <div key={q.qid} style={{ padding: "12px 20px", borderBottom: "1px solid #dee2e6", display: "flex", alignItems: "flex-start", gap: 14, background: answered ? "rgba(34,197,94,0.04)" : "transparent" }}>
            <div style={{ width: 24, height: 24, borderRadius: 5, border: "2px solid " + (answered ? "#22c55e" : "#dee2e6"), background: answered ? "#22c55e" : "white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
              {answered ? "✓" : ""}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0ea5e9", marginBottom: 2, textTransform: "uppercase" }}>{q.label}</div>
              {q.ty === "s" && answered && (
                <span style={{ fontSize: 14, fontWeight: 700, color: Number(val) >= 8 ? "#22c55e" : Number(val) >= 5 ? "#eab308" : "#ef4444" }}>{val}/10</span>
              )}
              {q.ty === "t" && answered && (
                <div style={{ fontSize: 12, color: "#475569", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{val}</div>
              )}
              {!answered && <span style={{ fontSize: 11, color: "#adb5bd" }}>Not yet answered</span>}
            </div>
          </div>
        );
      },
      countDone: (group) => prov ? group.items.filter(q => {
        const v = qa[prov.id + "." + group.phase.id + "." + q.qid];
        return v !== undefined && v !== "";
      }).length : 0,
    },
  ];

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1200, display: "flex", alignItems: "stretch", justifyContent: "center", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "white", borderRadius: 12, width: "100%", maxWidth: 920, display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.32)", overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #dee2e6", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, #0f1b2d, #1e3a5f)", color: "white" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>All Onboarding Tracks — Chronological</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
              Medical Director + Mentor (Physician &amp; APC) + Office Manager.
              {prov ? ` · ${prov.name}: ${mdDone}/${mdItems.length} MD · ${mpPhysDone}/${mpPhysTotal} mentor-phys · ${mpApcDone}/${mpApcTotal} mentor-apc · ${opDone}/${opTotal} ops` : ""}
            </div>
          </div>
          <button onClick={onClose}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.12)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Close
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {!prov && (
            <div style={{ padding: "12px 22px", margin: "12px 16px 0", borderRadius: 8, background: "#f8f9fb", border: "1px solid #dee2e6", fontSize: 12, color: "#475569" }}>
              No provider selected — viewing all three tracks as reference. Select a provider from the sidebar to track per-provider check-off state.
            </div>
          )}
          {tracks.map((tr) => (
            <div key={tr.key}>
              <div style={{ position: "sticky", top: 0, padding: "12px 22px", background: tr.gradient, color: "white", zIndex: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid white" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{tr.title}</div>
                  <div style={{ fontSize: 11, opacity: 0.85, marginTop: 1 }}>{tr.subtitle}</div>
                </div>
                {prov && (
                  <div style={{ fontSize: 14, fontWeight: 700, padding: "4px 12px", borderRadius: 8, background: "rgba(255,255,255,0.18)" }}>
                    {tr.done}/{tr.total}
                  </div>
                )}
              </div>
              {tr.groups.map(g => {
                const done = tr.countDone(g);
                return (
                  <div key={g.phase.id}>
                    <div style={{ position: "sticky", top: 56, background: "#f8f9fb", borderBottom: "1px solid #dee2e6", padding: "8px 22px", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f1b2d" }}>{g.phase.label}</div>
                        <div style={{ fontSize: 10, color: "#868e96" }}>{g.items.length} item{g.items.length === 1 ? "" : "s"}</div>
                      </div>
                      {prov && <div style={{ fontSize: 12, fontWeight: 700, color: done === g.items.length ? "#22c55e" : tr.accent }}>{done}/{g.items.length}</div>}
                    </div>
                    {tr.key === "md"
                      ? g.items.map(item => tr.renderRow(item))
                      : tr.key === "op"
                      ? g.items.map(q => tr.renderRow(q, g))
                      : g.items.map((text, i) => tr.renderRow(text, g, i))}
                    {(tr.key === "mp-apc" && g.items.length === 0) && (
                      <div style={{ padding: "12px 20px", fontSize: 12, color: "#adb5bd", fontStyle: "italic" }}>No items in this phase.</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 22px", borderTop: "1px solid #dee2e6", background: "#f8f9fb", fontSize: 11, color: "#868e96", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          <span>Medical Director ⚠ misstep-risk items: 12 / 19 / 43 / 48 / 56 — keep verbatim when teaching.</span>
          <span>Medical Director source: Master Checklist · Mentor + Ops: Onboarding Tracker phases</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Meeting Card ─── */
function MeetingCard({ meeting, canEdit, onToggleAction }) {
  const [expanded, setExpanded] = useState(false);
  const doneCount = (meeting.actions || []).filter(function(a) { return a.done; }).length;
  const total = (meeting.actions || []).length;
  return (
    <div style={{ background: "white", borderRadius: 7, border: "1px solid #bae6fd", marginBottom: 6 }}>
      <div onClick={function() { setExpanded(function(v) { return !v; }); }}
        style={{ padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0f1b2d" }}>📅 {meeting.date}</div>
          {meeting.discussion && !expanded && (
            <div style={{ fontSize: 11, color: "#868e96", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 320 }}>
              {meeting.discussion}
            </div>
          )}
        </div>
        {total > 0 && (
          <div style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: doneCount === total ? "#dcfce7" : "#fef9c3", color: doneCount === total ? "#16a34a" : "#854d0e" }}>
            {doneCount}/{total} actions
          </div>
        )}
        <div style={{ fontSize: 11, color: "#adb5bd" }}>{expanded ? "▲" : "▼"}</div>
      </div>
      {expanded && (
        <div style={{ padding: "0 12px 12px", borderTop: "1px solid #e0f2fe" }}>
          {meeting.discussion && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0369a1", marginBottom: 4 }}>DISCUSSION</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{meeting.discussion}</div>
            </div>
          )}
          {total > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0369a1", marginBottom: 6 }}>ACTION ITEMS</div>
              {(meeting.actions || []).map(function(a, i) {
                return (
                  <div key={i} onClick={canEdit ? function() { onToggleAction(i); } : undefined}
                    style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "4px 0", cursor: canEdit ? "pointer" : "default" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: "2px solid " + (a.done ? "#22c55e" : "#dee2e6"), background: a.done ? "#22c55e" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      {a.done && <span style={{ color: "white", fontSize: 9, fontWeight: 700 }}>✓</span>}
                    </div>
                    <div style={{ fontSize: 13, color: a.done ? "#adb5bd" : "#1c2b3a", textDecoration: a.done ? "line-through" : "none" }}>{a.text}</div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: 9, color: "#adb5bd" }}>Logged by {meeting.by}</div>
        </div>
      )}
    </div>
  );
}

/* ─── Meeting Log Section ─── */
function MeetingLogSection({ pid, phid, canEdit, meetings, onAdd, onToggleAction }) {
  const today = new Date().toISOString().slice(0, 10);
  const [formOpen, setFormOpen] = useState(false);
  const [date, setDate] = useState(today);
  const [discussion, setDiscussion] = useState("");
  const [actions, setActions] = useState([]);
  const [actionInput, setActionInput] = useState("");

  const entries = (meetings[pid + "." + phid] || []).slice().reverse();

  function addActionLocal() {
    if (!actionInput.trim()) return;
    setActions(function(prev) { return [...prev, { text: actionInput.trim(), done: false }]; });
    setActionInput("");
  }

  function save() {
    if (!discussion.trim() && actions.length === 0) return;
    onAdd(pid, phid, { date, discussion: discussion.trim(), actions });
    setFormOpen(false);
    setDate(today);
    setDiscussion("");
    setActions([]);
    setActionInput("");
  }

  return (
    <div style={{ padding: "14px 20px", background: "#f0f9ff", borderTop: "2px solid #bae6fd" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: (entries.length > 0 || formOpen) ? 10 : 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#0369a1" }}>
          MEETING LOG{entries.length > 0 ? " · " + entries.length + " entr" + (entries.length === 1 ? "y" : "ies") : ""}
        </div>
        {canEdit && !formOpen && (
          <button onClick={function() { setFormOpen(true); }}
            style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: "1px solid #bae6fd", background: "white", color: "#0369a1", cursor: "pointer" }}>
            + Log meeting
          </button>
        )}
      </div>

      {entries.map(function(m) {
        return (
          <MeetingCard
            key={m.id}
            meeting={m}
            canEdit={canEdit}
            onToggleAction={function(ai) { onToggleAction(pid, phid, m.id, ai); }}
          />
        );
      })}

      {formOpen && (
        <div style={{ background: "white", borderRadius: 8, border: "1px solid #bae6fd", padding: 14, marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0369a1", flexShrink: 0 }}>DATE</div>
            <input type="date" value={date} onChange={function(e) { setDate(e.target.value); }}
              style={{ padding: "5px 8px", borderRadius: 5, border: "1px solid #dee2e6", fontSize: 13, fontFamily: "inherit" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0369a1", marginBottom: 5 }}>DISCUSSION NOTES</div>
            <textarea value={discussion} onChange={function(e) { setDiscussion(e.target.value); }}
              placeholder="What was covered, decisions made, observations..."
              style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #dee2e6", fontSize: 13, width: "100%", height: 80, boxSizing: "border-box", resize: "vertical", outline: "none", fontFamily: "inherit" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0369a1", marginBottom: 5 }}>ACTION ITEMS</div>
            {actions.map(function(a, i) {
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, border: "1px solid #dee2e6", background: "#f8f9fb", flexShrink: 0 }} />
                  <div style={{ fontSize: 13, flex: 1 }}>{a.text}</div>
                  <button onClick={function() { setActions(function(prev) { return prev.filter(function(_, j) { return j !== i; }); }); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#adb5bd", fontSize: 14, lineHeight: 1, padding: "0 2px" }}>×</button>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 6 }}>
              <input value={actionInput} onChange={function(e) { setActionInput(e.target.value); }}
                onKeyDown={function(e) { if (e.key === "Enter") addActionLocal(); }}
                placeholder="Add action item and press Enter..."
                style={{ flex: 1, padding: "6px 10px", borderRadius: 5, border: "1px solid #dee2e6", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
              <button onClick={addActionLocal}
                style={{ padding: "6px 10px", borderRadius: 5, border: "1px solid #dee2e6", background: "#f8f9fb", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#0369a1" }}>+</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={function() { setFormOpen(false); setDate(today); setDiscussion(""); setActions([]); setActionInput(""); }}
              style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid #dee2e6", background: "white", cursor: "pointer", fontSize: 12, color: "#868e96" }}>Cancel</button>
            <button onClick={save}
              style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: "#0f1b2d", color: "white", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Save Meeting</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [dept, setDept] = useState(null); // null = picker, "pc" | "peds" | "spec"
  const [uid, setUid] = useState(null);
  const [selId, setSelId] = useState(null);
  const [tab, setTab] = useState("mentor");
  const [phase, setPhase] = useState(null);
  const [navHistory, setNavHistory] = useState([]);
  const [mainTab, setMainTab] = useState("roster");
  const [mdViewAll, setMdViewAll] = useState(false);
  const [dueMenu, setDueMenu] = useState(null);
  const [expandedAlerts, setExpandedAlerts] = useState({});
  const [dotModal, setDotModal] = useState(null);
  const [sidebarFilter, setSidebarFilter] = useState(null);
  const [addProvModal, setAddProvModal] = useState(false);
  const [addProvForm, setAddProvForm] = useState({ name: "", role: "MD", mentor: "mt1", phase: "w0", days: 1 });
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [mdCurrOpen, setMdCurrOpen] = useState(false);
  const [freshOpts, setFreshOpts] = useState(false);
  const [editDays, setEditDays] = useState(null);
  const [editDaysVal, setEditDaysVal] = useState("");
  const [exportingDocx, setExportingDocx] = useState(false);
  const [search, setSearch] = useState("");
  const [saveFlash, setSaveFlash] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProdModal, setShowProdModal] = useState(false);
  const [showCiiModal, setShowCiiModal] = useState(false);
  const firstSaveRef = useRef(true);

  // Read localStorage once at mount to seed initial state
  const [_init] = useState(() => loadMT());
  const hasSaved = _init !== null;
  const [provs, setProvs] = useState(() => _init?.provs || SEED_PROVS);
  const [checks, setChecks] = useState(() => _init?.checks || makeSeedChecks());
  const [qa, setQa] = useState(() => _init?.qa || makeSeedQA());
  const [noteIn, setNoteIn] = useState("");
  const [notes, setNotes] = useState(() => _init?.notes || {});
  const [meetings, setMeetings] = useState(() => _init?.meetings || {});

  // Keep module-level PROVS in sync so helper functions see current state
  PROVS = provs;

  // Autosave whenever data changes; flash confirmation on user-driven saves
  useEffect(() => {
    saveMT({ provs, checks, qa, notes, meetings, savedAt: new Date().toISOString() });
    if (firstSaveRef.current) { firstSaveRef.current = false; return; }
    setSaveFlash(true);
    const t = setTimeout(() => setSaveFlash(false), 2000);
    return () => clearTimeout(t);
  }, [provs, checks, qa, notes, meetings]);

  const user = USERS.find(u => u.id === uid);
  const isDir = user && user.role === "director";
  const isMen = user && user.role === "mentor";
  const myProvs = user ? (isDir ? PROVS : PROVS.filter(p => p.mentor === uid)) : [];
  const patterns = detectPatterns(qa);

  const navigate = (changes) => {
    // Don't push the pre-login state when logging in — ‹back from the main view would be a logout
    if (uid !== null) setNavHistory(prev => [...prev, { uid, selId, tab, phase, mainTab }]);
    if ('uid' in changes) setUid(changes.uid);
    if ('selId' in changes) setSelId(changes.selId);
    if ('tab' in changes) setTab(changes.tab);
    if ('phase' in changes) setPhase(changes.phase);
    if ('mainTab' in changes) setMainTab(changes.mainTab);
  };
  // True when the current view is "deeper" than the director/mentor landing
  // (a provider profile is open, or a director sub-tab other than the roster
  // is showing). Used as a fallback so the back affordance is never missing
  // in a view that logically has a parent, even if some navigation path did
  // not record history.
  const canGoBack = navHistory.length > 0 || selId !== null || (isDir && mainTab !== "roster");
  const goBack = () => {
    // Prefer real history when we have it.
    if (navHistory.length) {
      setNavHistory(prev => {
        const next = [...prev];
        const s = next.pop();
        setUid(s.uid); setSelId(s.selId); setTab(s.tab); setPhase(s.phase); setMainTab(s.mainTab);
        return next;
      });
      return;
    }
    // No recorded history — step up one logical level instead of stranding.
    if (selId !== null) {
      setSelId(null); setTab("mentor"); setPhase(null);
    } else if (isDir && mainTab !== "roster") {
      setMainTab("roster");
    }
  };

  const toggle = (pid, phid, i) => {
    const k = pid + "." + phid + "." + i;
    setChecks(prev => { const n = { ...prev }; if (n[k]) delete n[k]; else n[k] = true; return n; });
  };
  const setAnswer = (pid, phid, qid, v) => { setQa(prev => ({ ...prev, [pid + "." + phid + "." + qid]: v })); };
  const addNote = (pid, phid) => {
    if (!noteIn.trim()) return;
    const k = pid + "." + phid;
    setNotes(prev => ({ ...prev, [k]: [...(prev[k] || []), { by: user.name, at: new Date().toLocaleDateString(), text: noteIn.trim() }] }));
    setNoteIn("");
  };
  const removeNote = (pid, phid, idx) => {
    const k = pid + "." + phid;
    setNotes(prev => ({ ...prev, [k]: (prev[k] || []).filter((_, i) => i !== idx) }));
  };
  const addMeeting = (pid, phid, { date, discussion, actions }) => {
    const k = pid + "." + phid;
    setMeetings(prev => ({ ...prev, [k]: [...(prev[k] || []), { id: Date.now().toString(), date, discussion, actions, by: user.name }] }));
  };
  const toggleMeetingAction = (pid, phid, meetingId, actionIdx) => {
    const k = pid + "." + phid;
    setMeetings(prev => ({
      ...prev,
      [k]: (prev[k] || []).map(function(m) {
        return m.id === meetingId ? { ...m, actions: m.actions.map(function(a, i) { return i === actionIdx ? { ...a, done: !a.done } : a; }) } : m;
      }),
    }));
  };

  // Gather recent notes
  const recentNotes = [];
  Object.entries(notes).forEach(([key, arr]) => {
    const parts = key.split(".");
    const prov = PROVS.find(p => p.id === parts[0]);
    const ph = MP.find(x => x.id === parts[1]) || OP.find(x => x.id === parts[1]);
    arr.forEach(n => { recentNotes.push({ ...n, provider: prov ? prov.name : "?", phase: ph ? ph.label : parts[1] }); });
  });
  recentNotes.reverse();

  /* ─── LOGIN ─── */
  const gradBg = { position: "fixed" as const, inset: 0, zIndex: 50, background: "linear-gradient(145deg, #0f1b2d 0%, #013d47 60%, #028090 100%)", overflowY: "auto" as const, fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "stretch" };

  const BrandPanel = () => (
    <div style={{ flex: "0 0 42%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px 60px 60px" }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, marginBottom: 28 }}>👥</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Optum NY/NJ</div>
      <h1 style={{ margin: "0 0 14px", fontSize: 36, fontWeight: 700, color: "white", lineHeight: 1.15, letterSpacing: "-0.5px" }}>Onboarding<br/>Tracker</h1>
      <p style={{ margin: "0 0 40px", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>Structured onboarding follow-ups for new providers — track progress, document touchpoints, and keep every hire on course.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { icon: "📋", text: "Medical Director curriculum across all onboarding phases" },
          { icon: "🤝", text: "Mentor check-ins for physicians and APCs" },
          { icon: "📊", text: "Score trends and progress at a glance" },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{text}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 48, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>For authorized Optum NY/NJ staff only</div>
    </div>
  );

  const CardPanel = ({ children }) => (
    <div style={{ flex: "0 0 58%", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 60px 60px 40px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {children}
      </div>
    </div>
  );

  // ── DEPARTMENT PICKER ──────────────────────────────────────────────────────
  if (!dept) {
    const depts = [
      { key: "pc",   label: "Primary Care", icon: "🩺", available: true  },
      { key: "peds", label: "Pediatrics",   icon: "👶", available: true  },
      { key: "spec", label: "Specialty",    icon: "🏥", available: true  },
      { key: "uc",   label: "Urgent Care",  icon: "⚡", available: true  },
    ];
    return (
      <div style={gradBg}>
        <BrandPanel />
        <CardPanel>
          <div style={{ background: "white", borderRadius: 16, boxShadow: "0 24px 48px rgba(0,0,0,0.3)", padding: "28px 24px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#adb5bd", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Select your department</div>
            {depts.map(d => (
              <div key={d.key} onClick={() => setDept(d.key)}
                style={{ padding: "14px 16px", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, marginBottom: 8, border: "1.5px solid #e9ecef", transition: "border-color 0.15s, background 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#028090"; e.currentTarget.style.background = "rgba(2,128,144,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e9ecef"; e.currentTarget.style.background = "transparent"; }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(2,128,144,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{d.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#0f1b2d" }}>{d.label}</div>
                </div>
                <span style={{ fontSize: 16, color: "#028090" }}>›</span>
              </div>
            ))}
          </div>
        </CardPanel>
      </div>
    );
  }

  // ── COMING SOON — Pediatrics / Specialty / Urgent Care ────────────────────
  if (dept !== "pc") {
    const deptMeta = {
      peds: {
        label: "Pediatrics",
        icon: "👶",
        accent: "#059669",
        accentLight: "#d1fae5",
        director: "Dr. Sarah Chen",
        directorTitle: "Pediatric Medical Director",
        tagline: "Building confident, family-centered pediatric providers from day one.",
        description: "Structured onboarding for new pediatric providers — covering the full well-child visit schedule, developmental screening, vaccine administration, behavioral health integration, and family communication.",
        features: [
          { icon: "📋", label: "Well-Child Curriculum", sub: "Birth → 18 years, visit by visit" },
          { icon: "🧠", label: "Developmental Milestones Tracker", sub: "M-CHAT, ASQ, ADHD screening workflows" },
          { icon: "💉", label: "Vaccine Schedule Reference", sub: "ACIP schedule + catch-up logic" },
          { icon: "👨‍👩‍👧", label: "Family Communication Coaching", sub: "Vaccine hesitancy, behavioral concerns" },
        ],
      },
      spec: {
        label: "Specialty",
        icon: "🏥",
        accent: "#7c3aed",
        accentLight: "#ede9fe",
        director: "Dr. Michael Torres",
        directorTitle: "Specialty Medical Director",
        tagline: "Equipping specialist providers with the systems, workflows, and referral standards that define great consultative care.",
        description: "Onboarding curriculum for specialty providers — covering consultative note standards, referral integration with primary care, Epic specialty workflows, and the communication norms that keep the care team aligned.",
        features: [
          { icon: "📋", label: "Consultative Standards Curriculum", sub: "Note structure, decision transparency, follow-up" },
          { icon: "🔄", label: "Referral Integration Workflows", sub: "Inbound triage, turnaround expectations, Epic routing" },
          { icon: "⚕️", label: "Epic Specialty Module", sub: "Order sets, preference lists, specialty SmartPhrases" },
          { icon: "🤝", label: "Primary Care Partnership", sub: "Co-management protocols, curbside etiquette" },
        ],
      },
      uc: {
        label: "Urgent Care",
        icon: "⚡",
        accent: "#dc2626",
        accentLight: "#fee2e2",
        director: "Dr. Rachel Kim",
        directorTitle: "Urgent Care Medical Director",
        tagline: "Preparing urgent care providers for high-volume, high-stakes acute visits — every shift, from day one.",
        description: "Onboarding program for urgent care providers — covering acute visit workflow efficiency, triage decision frameworks, Epic rapid-documentation tools, escalation and transfer protocols, and managing patient expectations in a walk-in environment.",
        features: [
          { icon: "📋", label: "Acute Visit Curriculum", sub: "Chief complaint protocols, decision points, disposition" },
          { icon: "🚨", label: "Escalation & Transfer Protocols", sub: "When to escalate, how to hand off, documentation" },
          { icon: "⚡", label: "Epic Efficiency Tools", sub: "Rapid-fire orders, dot phrases, encounter closure" },
          { icon: "🏃", label: "High-Volume Flow Training", sub: "Managing pace, minimizing bottlenecks, team communication" },
        ],
      },
    }[dept] || { label: dept, icon: "🏥", accent: "#028090", accentLight: "#e0f9fb", director: "Medical Director", directorTitle: "Medical Director", tagline: "", description: "", features: [] };

    return (
      <div style={{ ...gradBg, alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 400, padding: "24px 20px" }}>

          {/* Card */}
          <div style={{ background: "white", borderRadius: 16, boxShadow: "0 24px 48px rgba(0,0,0,0.35)", overflow: "hidden", marginBottom: 12 }}>

            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, #101c2e 0%, #1e3a5f 100%)`, padding: "18px 20px 16px" }}>
              {/* Top row: icon + name + badge — all on one line, badge never clips */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: deptMeta.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                  {deptMeta.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "white", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{deptMeta.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 2, whiteSpace: "nowrap" }}>Optum NY/NJ · Onboarding Tracker</div>
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: deptMeta.accent, color: "white", letterSpacing: "0.05em", textTransform: "uppercase", flexShrink: 0, whiteSpace: "nowrap" }}>
                  Coming Soon
                </div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.45 }}>{deptMeta.tagline}</div>
            </div>

            {/* Medical Director strip */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderBottom: "1px solid #f1f3f5", background: "#fafafa" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: deptMeta.accent + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: deptMeta.accent, flexShrink: 0 }}>
                {deptMeta.director.replace("Dr. ", "").split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0f1b2d" }}>{deptMeta.director}</div>
                <div style={{ fontSize: 10, color: "#868e96" }}>{deptMeta.directorTitle}</div>
              </div>
            </div>

            {/* Feature tiles — 2×2 grid */}
            <div style={{ padding: "14px 20px 16px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#adb5bd", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Program preview</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {deptMeta.features.map((f, i) => (
                  <div key={i} style={{ padding: "10px", borderRadius: 8, background: "#f8f9fa", border: "1px solid #e9ecef", opacity: 0.75 }}>
                    <div style={{ fontSize: 16, marginBottom: 4 }}>{f.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", lineHeight: 1.3 }}>{f.label}</div>
                    <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 3, lineHeight: 1.3 }}>{f.sub}</div>
                    <div style={{ marginTop: 6, fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 6, background: "#e9ecef", color: "#adb5bd", display: "inline-block" }}>Soon</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Back */}
          <div onClick={() => setDept(null)}
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.16)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}>
            <span style={{ fontSize: 18, color: "white", lineHeight: 1 }}>←</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Back to Department Selection</div>
          </div>

        </div>
      </div>
    );
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!uid) {
    // Check localStorage at render time — hasSaved from _init is stale after first autosave
    const runtimeHasSaved = loadMT() !== null;
    const doReset = (keepProvs) => {
      const freshChecks = makeSeedChecks();
      const freshQa = makeSeedQA();
      const freshProvs = keepProvs ? provs : SEED_PROVS;
      setChecks(freshChecks); setQa(freshQa); setNotes({}); setMeetings({});
      if (!keepProvs) setProvs(SEED_PROVS);
      setFreshOpts(false);
      saveMT({ provs: freshProvs, checks: freshChecks, qa: freshQa, notes: {}, meetings: {}, savedAt: new Date().toISOString() });
    };
    return (
      <div style={gradBg}>
        <BrandPanel />
        <CardPanel>
          {/* Main card */}
          <div style={{ background: "white", borderRadius: 16, boxShadow: "0 24px 48px rgba(0,0,0,0.3)", overflow: "hidden" }}>

            {/* Saved data banner */}
            {runtimeHasSaved && !freshOpts && (
              <div style={{ background: "#eff6ff", borderBottom: "1px solid #bfdbfe", padding: "13px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1e40af" }}>💾 Saved session found</div>
                  <div style={{ fontSize: 11, color: "#3b82f6", marginTop: 1 }}>Log in to continue where you left off</div>
                </div>
                <button onClick={() => setFreshOpts(true)}
                  style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #bfdbfe", background: "white", color: "#1e40af", cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                  Start Fresh…
                </button>
              </div>
            )}

            {/* Start Fresh options */}
            {runtimeHasSaved && freshOpts && (
              <div style={{ background: "#fafafa", borderBottom: "1px solid #dee2e6", padding: "16px 20px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f1b2d", marginBottom: 10 }}>What would you like to reset?</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <button onClick={() => doReset(true)}
                    style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid #dee2e6", background: "white", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0f1b2d" }}>Clear checks, scores &amp; notes</div>
                    <div style={{ fontSize: 11, color: "#868e96", marginTop: 2 }}>Keep your provider list · reset all checkoffs and answers</div>
                  </button>
                  <button onClick={() => doReset(false)}
                    style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid #dee2e6", background: "white", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0f1b2d" }}>Reset everything</div>
                    <div style={{ fontSize: 11, color: "#868e96", marginTop: 2 }}>Restore original 5 providers and clear all data</div>
                  </button>
                  <button onClick={() => setFreshOpts(false)}
                    style={{ padding: "6px", border: "none", background: "none", color: "#868e96", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* User tiles */}
            <div style={{ padding: "20px 20px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#adb5bd", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Select your account</div>
              {USERS.map(u => {
                const isDir = u.role === "director";
                const c = isDir ? "#8b5cf6" : "#028090";
                const rl = isDir ? "Medical Director" : "Mentor";
                const initials = u.name.replace("Dr. ", "").split(" ").map(w => w[0]).join("").slice(0, 2);
                return (
                  <div key={u.id} onClick={() => navigate({ uid: u.id, selId: null, tab: "mentor", phase: null, mainTab: "roster" })}
                    style={{ padding: "12px 14px", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 8, border: "1.5px solid #e9ecef", transition: "border-color 0.15s, background 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = c; e.currentTarget.style.background = c + "08"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e9ecef"; e.currentTarget.style.background = "transparent"; }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: c + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: c, flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f1b2d" }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: "#868e96", marginTop: 1 }}>{rl}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 12, background: c + "15", color: c }}>{rl}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div onClick={() => setDept(null)}
            style={{ marginTop: 14, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.16)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}>
            <span style={{ fontSize: 22, color: "white", lineHeight: 1 }}>←</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Back to Department Selection</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Tap here to choose a different department</div>
            </div>
          </div>
        </CardPanel>
      </div>
    );
  }

  /* ─── Derived state ─── */
  const prov = selId ? PROVS.find(p => p.id === selId) : null;
  const mentorUser = prov ? USERS.find(u => u.id === prov.mentor) : null;
  const curIdx = prov ? phIdx(prov.phase) : -1;
  const isOps = tab === "ops";
  const isQ = tab === "quest";
  const isMd = tab === "md";
  const isProd = tab === "prod";
  const isCulture = tab === "culture";
  const phaseList = isOps ? OP : isQ ? QP : isMd ? MD_PHASES : (tab === "mentor" && prov && !isAPC(prov) ? MP_PHYS : MP);
  const curOpQuest = isOps && phase ? OP.find(x => x.id === phase) : null;
  const curChecklist = phase && !isQ && !isMd && !isOps && !isProd && !isCulture ? MP.find(x => x.id === phase) : null;
  const curQuest = isQ && phase ? QP.find(x => x.id === phase) : null;
  const curMdItems = isMd && phase ? (MD_ITEMS_BY_PHASE[phase] || []) : null;
  const pc = curChecklist && prov ? countChecks(checks, prov.id, phase) : null;
  const mdPc = curMdItems && prov ? (() => {
    const total = curMdItems.length;
    const done = curMdItems.filter(it => checks[prov.id + ".md." + it.id]).length;
    return { done, total, pct: total > 0 ? Math.round(done / total * 100) : 0 };
  })() : null;
  const curNotes = prov && phase ? (notes[prov.id + "." + phase] || []) : [];
  const canChk = isOps ? isDir : isMd ? isDir : (isDir || isMen);

  /* ─── MAIN LAYOUT ─── */
  return (
    <div style={{ background: "#f1f3f5", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#1c2b3a", display: "flex", flexDirection: "column" }}>

      {/* Go Back pill — fixed below the "meridian" launcher chevron */}
      {canGoBack && (
        <button
          onClick={goBack}
          style={{ position: "fixed", top: 62, left: 22, zIndex: 1000, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px 6px 10px", border: "1px solid rgba(15,30,22,0.12)", borderRadius: 999, cursor: "pointer", fontFamily: "system-ui, sans-serif", fontSize: 14, fontWeight: 500, letterSpacing: "0.08em", textTransform: "lowercase", background: "rgba(255,255,255,0.92)", color: "#1c2b3a", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxShadow: "0 1px 2px rgba(0,0,0,0.10), 0 6px 18px rgba(0,0,0,0.12), 0 16px 36px rgba(0,0,0,0.10)", transition: "background 120ms ease-out, transform 120ms ease-out" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateX(-2px)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,1)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.92)"; }}
        >
          <span style={{ fontSize: 22, fontWeight: 300, lineHeight: 1, marginTop: -2 }}>‹</span>
          <span>back</span>
        </button>
      )}

      {/* Top bar */}
      <div style={{ background: "#0f1b2d", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>Onboarding Tracker</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#868e96" }}>{user.name} — {isDir ? "Medical Director" : "Mentor"}</span>
            <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600, opacity: saveFlash ? 1 : 0, transition: "opacity 400ms ease" }}>✓ Autosaved</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {isDir && patterns.length > 0 && (
            <div style={{ padding: "5px 12px", borderRadius: 8, background: "#eab308", color: "#78350f", fontSize: 11, fontWeight: 700 }}>
              {"📊 " + patterns.length + " Alert" + (patterns.length !== 1 ? "s" : "")}
            </div>
          )}
          {isDir && (
            <button onClick={() => setMdViewAll(true)}
              style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.20)", background: "rgba(139,92,246,0.18)", color: "#e9d5ff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
              📋 Curriculum
            </button>
          )}
          {/* ⋯ admin menu */}
          {isDir && (
            <div style={{ position: "relative" }}>
              <button onClick={() => setMenuOpen(o => !o)}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.20)", background: menuOpen ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)", color: "white", cursor: "pointer", fontSize: 16, lineHeight: 1, fontWeight: 700 }}>
                ⋯
              </button>
              {menuOpen && (
                <>
                  {/* click-away backdrop */}
                  <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 1500 }} />
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 1501, background: "white", borderRadius: 10, border: "1px solid #dee2e6", boxShadow: "0 8px 24px rgba(0,0,0,0.14)", minWidth: 180, overflow: "hidden" }}>
                    <div style={{ padding: "6px 0" }}>
                      <button onClick={() => { exportJSON({ provs, checks, qa, notes, meetings, savedAt: new Date().toISOString() }); setMenuOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#1c2b3a", textAlign: "left" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8f9fb"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        <span style={{ fontSize: 15 }}>⬇</span> Export JSON
                      </button>
                      <button onClick={async () => { setMenuOpen(false); setExportingDocx(true); try { await exportDocx(provs, checks, qa, notes, meetings); } finally { setExportingDocx(false); } }}
                        disabled={exportingDocx}
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#1c2b3a", textAlign: "left", opacity: exportingDocx ? 0.5 : 1 }}
                        onMouseEnter={e => { if (!exportingDocx) e.currentTarget.style.background = "#f8f9fb"; }}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        <span style={{ fontSize: 15 }}>{exportingDocx ? "⏳" : "📄"}</span> {exportingDocx ? "Exporting…" : "Export DOCX"}
                      </button>
                      <div style={{ height: 1, background: "#dee2e6", margin: "4px 0" }} />
                      <button onClick={() => { setConfirmReset(true); setMenuOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#ef4444", textAlign: "left" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        <span style={{ fontSize: 15 }}>↺</span> Reset data…
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <button onClick={() => { setUid(null); setSelId(null); setNavHistory([]); }}
            style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.20)", background: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            Log out
          </button>
        </div>
      </div>
      <MdViewAllModal
        open={mdViewAll}
        onClose={() => setMdViewAll(false)}
        prov={prov}
        checks={checks}
        setChecks={setChecks}
        isDir={isDir}
        isMen={isMen}
        qa={qa}
      />

      {/* Director dashboard tabs when no provider selected */}
      {isDir && !selId && (() => {
        const flagCount = PROVS.filter(p => getStatus(p.id) !== "ok").length;
        return (
        <div style={{ background: "white", borderBottom: "1px solid #dee2e6", padding: "0 24px" }}>
          {[
            { k: "roster", l: "Provider Roster" },
            { k: "compare", l: "Comparison Grid" },
            { k: "trends", l: "Score Trends" },
            { k: "flags", l: flagCount > 0 ? "⚠️ Needs Attention" : "Needs Attention" },
            { k: "notes", l: "Recent Notes" },
          ].map(t => (
            <button key={t.k} onClick={() => { if (t.k !== mainTab) navigate({ mainTab: t.k }); }}
              style={{ padding: "12px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: mainTab === t.k ? 700 : 400, color: mainTab === t.k ? "#0f1b2d" : "#868e96", borderBottom: mainTab === t.k ? "3px solid #028090" : "3px solid transparent" }}>
              {t.l}
            </button>
          ))}
        </div>
        );
      })()}


      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ─── SIDEBAR ─── */}
        <div style={{ width: 330, background: "white", borderRight: "1px solid #dee2e6", overflowY: "auto", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 16px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>{isDir ? "New Primary Care Providers" : "My Mentees"}</h2>
              {sidebarFilter && (
                <button onClick={() => setSidebarFilter(null)}
                  style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: sidebarFilter === "ok" ? "#dcfce7" : "#fee2e2", color: sidebarFilter === "ok" ? "#166534" : "#991b1b" }}>
                  {sidebarFilter === "ok" ? "On Track ×" : "Behind ×"}
                </button>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search providers…"
                style={{ width: "100%", padding: "7px 30px 7px 10px", borderRadius: 7, border: "1px solid #dee2e6", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#f8f9fb" }}
              />
              {search && (
                <button onClick={() => setSearch("")}
                  style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#adb5bd", fontSize: 14, lineHeight: 1, padding: "2px" }}>×</button>
              )}
            </div>
          </div>
          <div style={{ flex: 1 }}>
          {myProvs.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).filter(p => {
            if (sidebarFilter === "ok") return getStatus(p.id) === "ok";
            if (sidebarFilter === "behind") return getStatus(p.id) !== "ok";
            return true;
          }).map(p => {
            const m = USERS.find(u => u.id === p.mentor);
            const isSel = selId === p.id;
            const mn = mentorPct(checks, p.id);
            const md = isDir ? mdCurriculumPct(checks, p.id) : 0;
            const op = isDir ? opsPct(qa, p.id) : 0;
            const qp = isDir ? questPct(qa, p.id) : 0;
            const st = getStatus(p.id);
            const sc = st === "overdue" ? "#ef4444" : st === "due" ? "#eab308" : mn >= 70 ? "#22c55e" : "#eab308";
            const phLabel = (MP.find(x => x.id === p.phase) || {}).label || "";

            const mentorLastName = m ? m.name.replace(/^Dr\.\s*/, "") : "—";
            return (
              <div key={p.id} style={{ borderLeft: isSel ? "3px solid #028090" : "3px solid transparent", borderBottom: "1px solid #f1f3f5" }}>
                <div onClick={() => navigate({ selId: p.id, tab: "mentor", phase: p.phase })}
                  style={{ padding: "11px 14px 12px", cursor: "pointer", background: isSel ? "rgba(2,128,144,0.04)" : "transparent" }}>

                  {/* Row 1: status dot · name · badge · remove */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: sc, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                    {st === "overdue" && <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: "#fef2f2", color: "#ef4444", flexShrink: 0 }}>LATE</span>}
                    {st === "due" && <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: "#fefce8", color: "#92400e", flexShrink: 0 }}>DUE</span>}
                    {isDir && (
                      <button onClick={e => { e.stopPropagation(); setConfirmRemove(p.id); }}
                        title="Remove provider"
                        style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 15, lineHeight: 1, padding: "1px 3px", borderRadius: 3 }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "#fef2f2"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#d1d5db"; e.currentTarget.style.background = "none"; }}>×</button>
                    )}
                  </div>

                  {/* Row 2: meta */}
                  <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 9, paddingLeft: 14 }}>
                    {p.role} · {phLabel} · Day {p.days} · <span style={{ color: "#c4c9d0" }}>{mentorLastName}</span>
                  </div>

                  {/* Row 3: MD curriculum bar + CII / Prod chips (director) or single bar (mentor) */}
                  {isDir ? (() => {
                    const mdc = md >= 70 ? "#22c55e" : md >= 30 ? "#8b5cf6" : md > 0 ? "#ef4444" : "#d1d5db";
                    const cs = cultureScore(qa, p.id, isAPC(p));
                    const band = cultureBand(cs.avg);
                    const overdueCII = cs.avg === null && getStatus(p.id) !== "ok";
                    const tr = cultureTrend(qa, p.id, isAPC(p));
                    const ps = prodSummary(p.id);
                    const prodCol = ps.total === 0 ? { fg: "#868e96", bg: "#f1f3f5" }
                      : ps.good >= ps.total - 0 ? { fg: "#15803d", bg: "#dcfce7" }
                      : ps.good <= 1 ? { fg: "#b91c1c", bg: "#fee2e2" }
                      : { fg: "#854d0e", bg: "#fef9c3" };
                    return (
                      <div style={{ paddingLeft: 14 }}>
                        {/* MD curriculum bar */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                          <div style={{ flex: 1, height: 4, borderRadius: 2, background: "#e9ecef", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: md + "%", background: mdc, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", whiteSpace: "nowrap" }}>MD {md}%</span>
                        </div>
                        {/* chips row */}
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            background: overdueCII ? "#fef9c3" : band.bg, color: overdueCII ? "#854d0e" : band.fg }}>
                            {overdueCII ? "C.I.I. overdue" : cs.avg === null ? "C.I.I. Future-Sched'd" : "C.I.I. " + band.label + " " + cs.display + (tr.arrow ? " " + tr.arrow : "")}
                          </span>
                          {ps.total > 0 && (
                            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 5, whiteSpace: "nowrap", flexShrink: 0, background: prodCol.bg, color: prodCol.fg }}>
                              Prod {ps.good}/{ps.total}{ps.good <= 1 ? " ⚠" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })() : (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 14 }}>
                      <div style={{ flex: 1, height: 3, borderRadius: 2, background: "#e9ecef", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: mn + "%", background: sc, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: sc }}>{mn}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {search && myProvs.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
            <div style={{ padding: "20px 16px", textAlign: "center", color: "#adb5bd", fontSize: 13 }}>No providers match "{search}"</div>
          )}
          </div>
          {isDir && (
            <div style={{ padding: "12px 16px", borderTop: "1px solid #dee2e6" }}>
              <button onClick={() => { setAddProvForm({ name: "", role: "MD", mentor: "mt1", phase: "w0", days: 1 }); setAddProvModal(true); }}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "2px dashed #dee2e6", background: "none", color: "#028090", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                + Add Provider
              </button>
            </div>
          )}
        </div>

        {/* ─── RIGHT CONTENT ─── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          {!prov ? (
            <div>
              {/* ── CROSS-PROVIDER PATTERN ALERTS (always at top, all tabs) ── */}
              {isDir && patterns.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>⚠️ Cross-Provider Pattern Alerts</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: "#b91c1c" }}>{"(" + patterns.length + " phase" + (patterns.length !== 1 ? "s" : "") + " — sorted by severity)"}</span>
                  </div>
                  {patterns.map(function(a) {
                    const isExp = !!expandedAlerts[a.phaseId];
                    const toggleAlert = function() { setExpandedAlerts(function(prev) { const n = Object.assign({}, prev); n[a.phaseId] = !prev[a.phaseId]; return n; }); };
                    const omPhaseLabel = (OP.find(function(x) { return x.id === a.omPhaseId; }) || {label: "—"}).label;
                    return (
                      <div key={a.phaseId} style={{ background: "white", borderRadius: 10, border: "2px solid #fecaca", marginBottom: 10, overflow: "hidden" }}>
                        {/* Component 1 — Header */}
                        <button onClick={toggleAlert} style={{ width: "100%", padding: "13px 18px", background: "#fef2f2", border: "none", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: isExp ? "1px solid #fecaca" : "none" }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#b91c1c" }}>{a.label + ": " + a.affected + " of " + a.total + " providers scored below 6.0 (overall avg: " + a.avg + ")"}</div>
                            <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>{isExp ? "Click to collapse" : "Click to view details"}</div>
                          </div>
                          <span style={{ fontSize: 14, color: "#ef4444", marginLeft: 12, flexShrink: 0 }}>{isExp ? "▲" : "▼"}</span>
                        </button>
                        {isExp && (
                          <div>
                            {/* Component 2 — Individual provider scores */}
                            <div style={{ padding: "12px 18px", borderBottom: "1px solid #dee2e6" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Individual Provider Scores</div>
                              {a.providerScores.map(function(ps) {
                                const below = ps.avg < 6;
                                return (
                                  <div key={ps.pid} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #f3f4f6" }}>
                                    <span style={{ fontSize: 13, color: "#0f1b2d" }}>{ps.name}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: below ? "#ef4444" : "#22c55e" }}>{ps.avg.toFixed(1) + (below ? " ●" : " ●")}</span>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Component 3 — Question-level breakdown */}
                            {a.questionBreakdown.length > 0 && (
                              <div style={{ padding: "12px 18px", borderBottom: "1px solid #dee2e6" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Question-Level Breakdown (lowest → highest)</div>
                                {a.questionBreakdown.map(function(q, qi) {
                                  const qc = q.avg >= 7 ? "#22c55e" : q.avg >= 5 ? "#eab308" : "#ef4444";
                                  return (
                                    <div key={qi} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #f3f4f6" }}>
                                      <span style={{ fontSize: 12, color: "#374151", flex: 1, marginRight: 12 }}>{q.text}</span>
                                      <span style={{ fontSize: 13, fontWeight: 700, color: qc, whiteSpace: "nowrap" }}>{q.avg.toFixed(1)}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {/* Component 4 — Phase comparison bar */}
                            <div style={{ padding: "12px 18px", borderBottom: "1px solid #dee2e6" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Phase Comparison — All Periods</div>
                              {a.phaseComparison.filter(function(ph) { return ph.avg !== null; }).map(function(ph) {
                                const isTrig = ph.id === a.phaseId;
                                const bc = ph.avg >= 7 ? "#22c55e" : ph.avg >= 5 ? "#eab308" : "#ef4444";
                                return (
                                  <div key={ph.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px " + (isTrig ? "6px" : "0"), background: isTrig ? "#fef2f2" : "transparent", borderRadius: 4, marginBottom: 2 }}>
                                    <div style={{ width: 64, fontSize: 10, color: isTrig ? "#b91c1c" : "#868e96", fontWeight: isTrig ? 700 : 400, flexShrink: 0 }}>{ph.label}</div>
                                    <div style={{ flex: 1, height: 10, background: "#e9ecef", borderRadius: 5, overflow: "hidden" }}>
                                      <div style={{ height: "100%", width: (ph.avg / 10 * 100) + "%", background: bc, borderRadius: 5 }} />
                                    </div>
                                    <div style={{ width: 28, fontSize: 11, fontWeight: 700, color: bc, textAlign: "right", flexShrink: 0 }}>{ph.avg.toFixed(1)}</div>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Component 5 — Office Manager cross-reference */}
                            <div style={{ padding: "12px 18px", borderBottom: "1px solid #dee2e6" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>{"Office Manager Cross-Reference (" + omPhaseLabel + ")"}</div>
                              {a.omCategoryAvgs ? (
                                a.omCategoryAvgs.map(function(cat, ci) {
                                  const below = cat.avg < 6;
                                  return (
                                    <div key={ci} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #f3f4f6" }}>
                                      <span style={{ fontSize: 12, color: "#374151" }}>{cat.label}</span>
                                      <span style={{ fontSize: 13, fontWeight: 700, color: below ? "#ef4444" : "#22c55e" }}>{cat.avg.toFixed(1)}</span>
                                    </div>
                                  );
                                })
                              ) : (
                                <div style={{ fontSize: 12, color: "#adb5bd", fontStyle: "italic" }}>No Office Manager data available for this timeframe yet.</div>
                              )}
                            </div>
                            {/* Component 6 — Sharpest decline */}
                            {a.sharpestDecline && (
                              <div style={{ padding: "12px 18px", background: "#fef2f2" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Sharpest Decline</div>
                                <div style={{ fontSize: 13, color: "#b91c1c", fontWeight: 600 }}>
                                  {a.sharpestDecline.name + " dropped " + a.sharpestDecline.drop.toFixed(1) + " points from " + a.sharpestDecline.prevPhase + " (" + a.sharpestDecline.prevAvg.toFixed(1) + ") to " + a.label + " (" + a.sharpestDecline.curAvg.toFixed(1) + ") — sharpest decline at this phase."}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Score Trends tab */}
              {isDir && mainTab === "trends" && (
                <div>
                  <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", overflow: "hidden", marginBottom: 16 }}>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid #dee2e6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>Score Trends — Office Manager Touchpoints</div>
                        <div style={{ fontSize: 12, color: "#868e96", marginTop: 3 }}>Avg score per assessment period &nbsp;·&nbsp; <span style={{ color: "#22c55e", fontWeight: 700 }}>● ≥7 on track</span> &nbsp;<span style={{ color: "#eab308", fontWeight: 700 }}>● 5–6 watch</span> &nbsp;<span style={{ color: "#ef4444", fontWeight: 700 }}>● &lt;5 concern</span></div>
                      </div>
                    </div>
                    {PROVS.map(p => {
                      const allOPScores = OP.map((ph, i) => {
                        const scores = ph.qs.filter(q => q.ty === "s").map(q => {
                          const v = qa[p.id + "." + ph.id + "." + q.qid];
                          return v !== undefined && v !== "" ? parseFloat(v) : null;
                        }).filter(v => v !== null);
                        const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
                        return { ph, avg, i };
                      });
                      const provScores = allOPScores.filter(x => x.avg !== null);

                      const W = 800, H = 150;
                      const PL = 32, PR = 16, PT = 26, PB = 28;
                      const cw = W - PL - PR;
                      const ch = H - PT - PB;
                      const xOf = (i) => PL + (OP.length > 1 ? (i / (OP.length - 1)) : 0.5) * cw;
                      const yOf = (s) => PT + (1 - s / 10) * ch;
                      const y7 = yOf(7), y5 = yOf(5);

                      const delta = provScores.length >= 2
                        ? provScores[provScores.length - 1].avg - provScores[0].avg : 0;
                      const trendColor = delta > 0.4 ? "#22c55e" : delta < -0.4 ? "#ef4444" : "#868e96";
                      const trendLabel = delta > 0.4 ? ("↑ +" + delta.toFixed(1)) : delta < -0.4 ? ("↓ " + delta.toFixed(1)) : "→ stable";

                      const polyPts = allOPScores.filter(x => x.avg !== null).map(x => xOf(x.i) + "," + yOf(x.avg)).join(" ");

                      return (
                        <div key={p.id} style={{ padding: "14px 20px 10px", borderBottom: "1px solid #dee2e6" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f1b2d" }}>{p.name}</span>
                              <span style={{ fontSize: 10, fontWeight: 400, color: "#868e96", marginLeft: 8 }}>{(MP.find(x => x.id === p.phase) || {}).label}</span>
                            </div>
                            {provScores.length >= 2 && (
                              <span style={{ fontSize: 12, fontWeight: 700, color: trendColor }}>{trendLabel} over period</span>
                            )}
                          </div>
                          <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: "auto", display: "block" }}>
                            <rect x={PL} y={PT} width={cw} height={ch} fill="#f8f9fb" rx={3} />
                            <line x1={PL} y1={y7} x2={PL + cw} y2={y7} stroke="#22c55e" strokeWidth={1} strokeDasharray="5 3" opacity={0.55} />
                            <text x={PL - 4} y={y7 + 3.5} textAnchor="end" fontSize={9} fill="#22c55e" fontWeight={700}>7</text>
                            <line x1={PL} y1={y5} x2={PL + cw} y2={y5} stroke="#eab308" strokeWidth={1} strokeDasharray="5 3" opacity={0.55} />
                            <text x={PL - 4} y={y5 + 3.5} textAnchor="end" fontSize={9} fill="#eab308" fontWeight={700}>5</text>
                            <line x1={PL} y1={PT} x2={PL + cw} y2={PT} stroke="#dee2e6" strokeWidth={0.75} />
                            <text x={PL - 4} y={PT + 3.5} textAnchor="end" fontSize={8} fill="#adb5bd">10</text>
                            <line x1={PL} y1={PT + ch} x2={PL + cw} y2={PT + ch} stroke="#dee2e6" strokeWidth={0.75} />
                            <text x={PL - 4} y={PT + ch + 3.5} textAnchor="end" fontSize={8} fill="#adb5bd">0</text>
                            {provScores.length > 1 && (
                              <polyline points={polyPts} fill="none" stroke="#0ea5e9" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                            )}
                            {allOPScores.map(({ ph, avg, i }) => {
                              const cx = xOf(i);
                              const dc = avg !== null ? (avg >= 7 ? "#22c55e" : avg >= 5 ? "#eab308" : "#ef4444") : null;
                              return (
                                <g key={ph.id} onClick={avg !== null ? function() { setDotModal({ pid: p.id, phaseId: ph.id, type: "om" }); } : undefined} style={{ cursor: avg !== null ? "pointer" : "default" }}>
                                  {avg !== null && (
                                    <>
                                      <circle cx={cx} cy={yOf(avg)} r={14} fill="transparent" />
                                      <circle cx={cx} cy={yOf(avg)} r={7} fill={dc} stroke="white" strokeWidth={2} />
                                      <text x={cx} y={yOf(avg) - 11} textAnchor="middle" fontSize={10} fontWeight={700} fill={dc}>{avg.toFixed(1)}</text>
                                    </>
                                  )}
                                  <text x={cx} y={PT + ch + 15} textAnchor="middle" fontSize={9} fill={avg !== null ? "#868e96" : "#d1d5db"}>{ph.label}</text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      );
                    })}
                  </div>

                  {/* Medical Director Touchpoints chart */}
                  <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", overflow: "hidden", marginBottom: 16 }}>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid #dee2e6" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>Score Trends — Medical Director Touchpoints</div>
                      <div style={{ fontSize: 12, color: "#868e96", marginTop: 3 }}>Avg score per check-in period &nbsp;·&nbsp; <span style={{ color: "#22c55e", fontWeight: 700 }}>● ≥7 on track</span> &nbsp;<span style={{ color: "#eab308", fontWeight: 700 }}>● 5–6 watch</span> &nbsp;<span style={{ color: "#ef4444", fontWeight: 700 }}>● &lt;5 concern</span></div>
                    </div>
                    {PROVS.map(p => {
                      const allQPScores = QP.map((ph, i) => {
                        const avg = avgScore(qa, p.id, ph.id);
                        return { ph, avg, i };
                      });
                      const provScores = allQPScores.filter(x => x.avg !== null);

                      const W = 1600, H = 150;
                      const PL = 32, PR = 16, PT = 26, PB = 28;
                      const cw = W - PL - PR;
                      const ch = H - PT - PB;
                      const xOf = (i) => PL + (QP.length > 1 ? (i / (QP.length - 1)) : 0.5) * cw;
                      const yOf = (s) => PT + (1 - s / 10) * ch;
                      const y7 = yOf(7), y5 = yOf(5);

                      const delta = provScores.length >= 2
                        ? provScores[provScores.length - 1].avg - provScores[0].avg : 0;
                      const trendColor = delta > 0.4 ? "#22c55e" : delta < -0.4 ? "#ef4444" : "#868e96";
                      const trendLabel = delta > 0.4 ? ("↑ +" + delta.toFixed(1)) : delta < -0.4 ? ("↓ " + delta.toFixed(1)) : "→ stable";

                      const polyPts = allQPScores.filter(x => x.avg !== null).map(x => xOf(x.i) + "," + yOf(x.avg)).join(" ");

                      return (
                        <div key={p.id} style={{ padding: "14px 20px 10px", borderBottom: "1px solid #dee2e6" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f1b2d" }}>{p.name}</span>
                              <span style={{ fontSize: 10, fontWeight: 400, color: "#868e96", marginLeft: 8 }}>{(MP.find(x => x.id === p.phase) || {}).label}</span>
                            </div>
                            {provScores.length >= 2 && (
                              <span style={{ fontSize: 12, fontWeight: 700, color: trendColor }}>{trendLabel} over period</span>
                            )}
                          </div>
                          <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: "auto", display: "block" }}>
                            <rect x={PL} y={PT} width={cw} height={ch} fill="#f8f9fb" rx={3} />
                            <line x1={PL} y1={y7} x2={PL + cw} y2={y7} stroke="#22c55e" strokeWidth={1} strokeDasharray="5 3" opacity={0.55} />
                            <text x={PL - 4} y={y7 + 3.5} textAnchor="end" fontSize={9} fill="#22c55e" fontWeight={700}>7</text>
                            <line x1={PL} y1={y5} x2={PL + cw} y2={y5} stroke="#eab308" strokeWidth={1} strokeDasharray="5 3" opacity={0.55} />
                            <text x={PL - 4} y={y5 + 3.5} textAnchor="end" fontSize={9} fill="#eab308" fontWeight={700}>5</text>
                            <line x1={PL} y1={PT} x2={PL + cw} y2={PT} stroke="#dee2e6" strokeWidth={0.75} />
                            <text x={PL - 4} y={PT + 3.5} textAnchor="end" fontSize={8} fill="#adb5bd">10</text>
                            <line x1={PL} y1={PT + ch} x2={PL + cw} y2={PT + ch} stroke="#dee2e6" strokeWidth={0.75} />
                            <text x={PL - 4} y={PT + ch + 3.5} textAnchor="end" fontSize={8} fill="#adb5bd">0</text>
                            {provScores.length > 1 && (
                              <polyline points={polyPts} fill="none" stroke="#eab308" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                            )}
                            {allQPScores.map(({ ph, avg, i }) => {
                              const cx = xOf(i);
                              const dc = avg !== null ? (avg >= 7 ? "#22c55e" : avg >= 5 ? "#eab308" : "#ef4444") : null;
                              return (
                                <g key={ph.id} onClick={avg !== null ? function() { setDotModal({ pid: p.id, phaseId: ph.id, type: "qp" }); } : undefined} style={{ cursor: avg !== null ? "pointer" : "default" }}>
                                  {avg !== null && (
                                    <>
                                      <circle cx={cx} cy={yOf(avg)} r={14} fill="transparent" />
                                      <circle cx={cx} cy={yOf(avg)} r={7} fill={dc} stroke="white" strokeWidth={2} />
                                      <text x={cx} y={yOf(avg) - 11} textAnchor="middle" fontSize={10} fontWeight={700} fill={dc}>{avg.toFixed(1)}</text>
                                    </>
                                  )}
                                  <text x={cx} y={PT + ch + 15} textAnchor="middle" fontSize={9} fill={avg !== null ? "#868e96" : "#d1d5db"}>{ph.label}</text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      );
                    })}
                  </div>

                  {/* Culture Integration Trend */}
                  <div style={{ background: "white", borderRadius: 10, border: "1px solid #fef3c7", overflow: "hidden", marginBottom: 16 }}>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid #fef3c7", background: "#fffbeb" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#78350f" }}>Culture Integration Trend</div>
                      <div style={{ fontSize: 12, color: "#92400e", marginTop: 3 }}>Avg of 4 culture questions per phase &nbsp;·&nbsp; <span style={{ color: "#22c55e", fontWeight: 700 }}>● ≥7 thriving</span> &nbsp;<span style={{ color: "#eab308", fontWeight: 700 }}>● 5–6 watch</span> &nbsp;<span style={{ color: "#ef4444", fontWeight: 700 }}>● &lt;5 at risk</span></div>
                    </div>
                    {PROVS.map(function(p) {
                      const cPhases = isAPC(p) ? [...CULTURE_PHASES, ...CULTURE_PHASES_APC_EXT] : CULTURE_PHASES;
                      const cLabels = {m3:"Mo 3",m6:"Mo 6",m9:"Mo 9",m12:"Mo 12",m15:"Mo 15",m18:"Mo 18",m21:"Mo 21",m24:"Mo 24"};
                      const scores = cPhases.map(function(phid, i) {
                        return { phid: phid, label: cLabels[phid] || phid, avg: culturePhaseScore(qa, p.id, phid), i: i };
                      });
                      const answered = scores.filter(function(x) { return x.avg !== null; });
                      const W = 480, H = 120;
                      const PL = 32, PR = 16, PT = 20, PB = 24;
                      const cw = W - PL - PR, ch = H - PT - PB;
                      const xOfC = function(i) { return PL + (cPhases.length > 1 ? (i / (cPhases.length - 1)) : 0.5) * cw; };
                      const yOfC = function(v) { return PT + (1 - v / 10) * ch; };
                      const polyPts = answered.map(function(x) { return xOfC(x.i) + "," + yOfC(x.avg); }).join(" ");
                      const cs = cultureScore(qa, p.id, isAPC(p));
                      const summaryColor = cs.avg === null ? "#adb5bd" : cs.avg >= 7 ? "#22c55e" : cs.avg >= 5 ? "#eab308" : "#ef4444";
                      return (
                        <div key={p.id} style={{ padding: "12px 20px", borderBottom: "1px solid #fef3c7" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f1b2d" }}>{p.name}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: summaryColor }}>{cs.avg !== null ? cs.display + " / 10" : "Future-Scheduled"}</div>
                          </div>
                          <div style={{ overflowX: "auto" }}>
                            <svg viewBox={"0 0 " + W + " " + H} width="100%" style={{ display: "block" }}>
                              {[0, 5, 10].map(function(v) {
                                const y = yOfC(v);
                                return (
                                  <g key={v}>
                                    <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#fef3c7" strokeWidth={1} />
                                    <text x={PL - 4} y={y + 4} textAnchor="end" fontSize={8} fill="#92400e">{v}</text>
                                  </g>
                                );
                              })}
                              {answered.length >= 2 && <polyline points={polyPts} fill="none" stroke="#22c55e" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
                              {scores.map(function(s) {
                                const cx = xOfC(s.i);
                                const dc = s.avg === null ? null : s.avg >= 7 ? "#22c55e" : s.avg >= 5 ? "#eab308" : "#ef4444";
                                return (
                                  <g key={s.label} onClick={s.avg !== null ? function() { setDotModal({ pid: p.id, phaseId: s.phid, type: "cii" }); } : undefined} style={{ cursor: s.avg !== null ? "pointer" : "default" }}>
                                    {s.avg !== null && (
                                      <>
                                        <circle cx={cx} cy={yOfC(s.avg)} r={14} fill="transparent" />
                                        <circle cx={cx} cy={yOfC(s.avg)} r={7} fill={dc} stroke="white" strokeWidth={2} />
                                        <text x={cx} y={yOfC(s.avg) - 11} textAnchor="middle" fontSize={10} fontWeight={700} fill={dc}>{s.avg.toFixed(1)}</text>
                                      </>
                                    )}
                                    <text x={cx} y={PT + ch + 15} textAnchor="middle" fontSize={9} fill={s.avg !== null ? "#868e96" : "#d1d5db"}>{s.label}</text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dot-click questionnaire modal */}
                  {dotModal && (function() {
                    const mp = PROVS.find(function(x) { return x.id === dotModal.pid; });
                    const provName = mp ? mp.name : dotModal.pid;
                    var phaseLabel = "", qs = [], typeLabel = "", accentColor = "#868e96", borderColor = "#dee2e6", bgColor = "white";
                    if (dotModal.type === "om") {
                      const ph = OP.find(function(x) { return x.id === dotModal.phaseId; });
                      phaseLabel = ph ? ph.label : dotModal.phaseId;
                      qs = ph ? ph.qs : [];
                      typeLabel = "Office Manager Touchpoints";
                      accentColor = "#0ea5e9";
                    } else if (dotModal.type === "qp") {
                      const ph = QP.find(function(x) { return x.id === dotModal.phaseId; });
                      phaseLabel = ph ? ph.label : dotModal.phaseId;
                      qs = ph ? ph.qs.filter(function(q) { return !q.culture; }) : [];
                      typeLabel = "Medical Director Touchpoints";
                      accentColor = "#eab308";
                    } else {
                      const ph = QP.find(function(x) { return x.id === dotModal.phaseId; });
                      phaseLabel = ph ? ph.label : dotModal.phaseId;
                      qs = ph ? ph.qs.filter(function(q) { return q.culture === true; }) : [];
                      typeLabel = "Culture Integration Index";
                      accentColor = "#92400e";
                      borderColor = "#fef3c7";
                      bgColor = "#fffbeb";
                    }
                    return (
                      <div onClick={function() { setDotModal(null); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                        <div onClick={function(e) { e.stopPropagation(); }} style={{ background: "white", borderRadius: 12, width: "min(560px, 100%)", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
                          <div style={{ padding: "16px 20px", borderBottom: "1px solid " + borderColor, background: bgColor, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f1b2d" }}>{provName + " — " + phaseLabel}</div>
                              <div style={{ fontSize: 12, color: accentColor, marginTop: 3, fontWeight: 600 }}>{typeLabel}</div>
                            </div>
                            <button onClick={function() { setDotModal(null); }} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9ca3af", lineHeight: 1, padding: "2px 6px", borderRadius: 4, marginLeft: 12, flexShrink: 0 }}>✕</button>
                          </div>
                          <div style={{ overflowY: "auto", padding: "20px" }}>
                            {qs.length === 0 ? (
                              <div style={{ fontSize: 13, color: "#adb5bd", fontStyle: "italic" }}>No questions found for this phase.</div>
                            ) : qs.map(function(q, qi) {
                              const val = qa[dotModal.pid + "." + dotModal.phaseId + "." + q.qid] || "";
                              const score = q.ty === "s" && val !== "" ? Number(val) : null;
                              const scoreColor = score === null ? "#adb5bd" : score >= 7 ? "#22c55e" : score >= 5 ? "#eab308" : "#ef4444";
                              const isLast = qi === qs.length - 1;
                              return (
                                <div key={q.qid} style={{ marginBottom: isLast ? 0 : 20, paddingBottom: isLast ? 0 : 20, borderBottom: isLast ? "none" : "1px solid #f3f4f6" }}>
                                  {q.label && (
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{q.label}</div>
                                  )}
                                  <div style={{ fontSize: 13, color: "#374151", marginBottom: 10, lineHeight: 1.55 }}>{q.text}</div>
                                  {q.ty === "s" ? (
                                    val !== "" ? (
                                      <div>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 7 }}>
                                          <div style={{ fontSize: 26, fontWeight: 700, color: scoreColor, lineHeight: 1 }}>{val}</div>
                                          <div style={{ fontSize: 12, color: "#9ca3af" }}>/ 10</div>
                                        </div>
                                        <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                                          <div style={{ height: "100%", width: (Number(val) * 10) + "%", background: scoreColor, borderRadius: 3 }} />
                                        </div>
                                        {q.anchor_low && q.anchor_high && (
                                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                                            <div style={{ fontSize: 10, color: "#d1d5db", maxWidth: "48%" }}>{q.anchor_low}</div>
                                            <div style={{ fontSize: 10, color: "#d1d5db", maxWidth: "48%", textAlign: "right" }}>{q.anchor_high}</div>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div style={{ fontSize: 12, color: "#adb5bd", fontStyle: "italic" }}>No response recorded</div>
                                    )
                                  ) : (
                                    val !== "" ? (
                                      <div style={{ fontSize: 13, color: "#374151", background: "#f9fafb", borderRadius: 8, padding: "10px 14px", lineHeight: 1.6, borderLeft: "3px solid " + accentColor }}>{val}</div>
                                    ) : (
                                      <div style={{ fontSize: 12, color: "#adb5bd", fontStyle: "italic" }}>No written response</div>
                                    )
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Comparison grid */}
              {isDir && mainTab === "compare" && (
                <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", overflow: "hidden", marginBottom: 16 }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #dee2e6" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>All-Providers Comparison</div>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#f8f9fb" }}>
                        <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, borderBottom: "2px solid #dee2e6" }}>Provider</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#8b5cf6", borderBottom: "2px solid #dee2e6" }}>Medical Director Curriculum</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#028090", borderBottom: "2px solid #dee2e6" }}>Mentor: Physician</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#0ea5e9", borderBottom: "2px solid #dee2e6" }}>OM Touchpoints</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#eab308", borderBottom: "2px solid #dee2e6" }}>Medical Director Touchpoints</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#92400e", borderBottom: "2px solid #dee2e6" }}>Culture</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, borderBottom: "2px solid #dee2e6" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PROVS.map(p => {
                        const vals = [mdCurriculumPct(checks, p.id), mentorPct(checks, p.id), opsPct(qa, p.id), questPct(qa, p.id)];
                        const cols = ["#8b5cf6", "#028090", "#0ea5e9", "#eab308"];
                        const st = getStatus(p.id);
                        const getDueItems = () => {
                          const ci = phIdx(p.phase);
                          const d = p.days;
                          let expected = 0;
                          if (d >= 270) expected = 13; else if (d >= 180) expected = 11;
                          else if (d >= 150) expected = 10; else if (d >= 120) expected = 9;
                          else if (d >= 90) expected = 8; else if (d >= 56) expected = 7;
                          else expected = Math.floor(d / 7);
                          const items = [];
                          for (let i = ci; i < Math.min(expected, MP.length); i++) {
                            const ph = MP[i];
                            const cc = countChecks(checks, p.id, ph.id);
                            if (cc.total > 0 && cc.pct < 100) items.push({ phase: ph, done: cc.done, total: cc.total });
                          }
                          return items;
                        };
                        const cs = cultureScore(qa, p.id, isAPC(p));
                        const cultureColor = cs.avg === null ? "#adb5bd" : cs.avg >= 7 ? "#22c55e" : cs.avg >= 5 ? "#eab308" : "#ef4444";
                        return (
                          <tr key={p.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                            <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                              {p.name}
                              <div style={{ fontSize: 10, fontWeight: 400, color: "#868e96" }}>{(MP.find(x => x.id === p.phase) || {}).label}</div>
                            </td>
                            {vals.map((v, j) => (
                              <td key={j} style={{ padding: "12px 8px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                  <div style={{ flex: 1, height: 8, background: "#e9ecef", borderRadius: 4, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: v + "%", background: cols[j], borderRadius: 4 }} />
                                  </div>
                                  <span style={{ fontSize: 11, fontWeight: 700, color: v >= 70 ? "#22c55e" : cols[j], minWidth: 28, textAlign: "right" }}>{v}%</span>
                                </div>
                              </td>
                            ))}
                            <td style={{ padding: "12px 8px", textAlign: "center" }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: cultureColor }}>{cs.display}</span>
                              {cs.avg !== null && <div style={{ fontSize: 9, color: "#adb5bd" }}>/ 10</div>}
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "center" }}>
                              {(st === "due" || st === "overdue") ? (
                                <button
                                  onClick={(e) => {
                                    const items = getDueItems();
                                    if (items.length === 1) {
                                      navigate({ selId: p.id, tab: "mentor", phase: items[0].phase.id });
                                    } else if (items.length > 1) {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setDueMenu({ pid: p.id, items, x: rect.left, y: rect.bottom + 6 });
                                    } else {
                                      navigate({ selId: p.id, tab: "mentor", phase: p.phase });
                                    }
                                  }}
                                  style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 8, border: "none", cursor: "pointer", background: st === "overdue" ? "#fef2f2" : "#fefce8", color: st === "overdue" ? "#ef4444" : "#92400e" }}>
                                  {st === "overdue" ? "OVERDUE ↗" : "DUE ↗"}
                                </button>
                              ) : (
                                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8, background: "#dcfce7", color: "#166534" }}>ON TRACK</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Needs Attention tab */}
              {isDir && mainTab === "flags" && (() => {
                const flagged = PROVS.map(p => {
                  const st = getStatus(p.id);
                  if (st === "ok") return null;
                  const track = isAPC(p) ? MP : MP_PHYS;
                  const curPhLabel = (track.find(x => x.id === p.phase) || {}).label || p.phase;
                  const mentor = USERS.find(u => u.id === p.mentor);
                  const scoreHistory = QP.map(qp => avgScore(qa, p.id, qp.id)).filter(s => s !== null);
                  const trending = scoreHistory.length >= 2 ? (scoreHistory[scoreHistory.length - 1] - scoreHistory[scoreHistory.length - 2]) : null;
                  const trendIcon = trending === null ? "" : trending < -0.5 ? " · score ↓" : trending > 0.5 ? " · score ↑" : "";
                  return { p, st, curPhLabel, mentor, trendIcon };
                }).filter(Boolean);
                return (
                  <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", overflow: "hidden", marginBottom: 16 }}>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid #dee2e6", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>Needs Attention</div>
                      {flagged.length > 0 && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 10, background: "#fee2e2", color: "#b91c1c" }}>{flagged.length} provider{flagged.length !== 1 ? "s" : ""}</span>}
                      <span style={{ fontSize: 12, color: "#868e96", marginLeft: 4 }}>providers behind on touchpoints or overdue for a check-in</span>
                    </div>
                    <div style={{ padding: "16px 20px" }}>
                      {flagged.length === 0 ? (
                        <div style={{ padding: "24px 0", textAlign: "center", color: "#16a34a", fontSize: 13, fontWeight: 600 }}>🎉 All providers are on schedule — nothing needs attention right now.</div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {flagged.map(({ p, st, curPhLabel, mentor, trendIcon }) => (
                            <div key={p.id}
                              onClick={() => navigate({ uid, selId: p.id, tab: "mentor", phase: p.phase, mainTab: "roster" })}
                              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: st === "overdue" ? "#fff5f5" : "#fffbeb", borderRadius: 9, border: "1px solid " + (st === "overdue" ? "#fca5a5" : "#fde68a"), cursor: "pointer" }}
                              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(0.97)"; }}
                              onMouseLeave={e => { e.currentTarget.style.filter = ""; }}>
                              {avatar(p.name, st === "overdue")}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f1b2d" }}>{p.name}</div>
                                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                                  {curPhLabel} · Day {p.days}{trendIcon}
                                  {mentor ? <span style={{ color: "#adb5bd" }}> · {mentor.name.split(",")[0].replace("Dr. ", "")}</span> : ""}
                                </div>
                              </div>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6, background: st === "overdue" ? "#ef4444" : "#f97316", color: "white", flexShrink: 0 }}>
                                {st === "overdue" ? "OVERDUE" : "DUE"}
                              </span>
                              <span style={{ fontSize: 12, color: "#9ca3af", flexShrink: 0 }}>→</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Recent notes hub */}
              {isDir && mainTab === "notes" && (
                <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", overflow: "hidden", marginBottom: 16 }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #dee2e6" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>Recent Notes — All Providers</div>
                  </div>
                  <div style={{ padding: "12px 20px" }}>
                    {recentNotes.length === 0 ? (
                      <div style={{ padding: 20, textAlign: "center", color: "#868e96" }}>No notes yet — notes will appear here as they are added</div>
                    ) : recentNotes.slice(0, 10).map((n, i) => (
                      <div key={i} style={{ padding: "10px 12px", borderRadius: 6, marginBottom: 6, background: "#f8f9fb", border: "1px solid #dee2e6" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <strong style={{ fontSize: 13 }}>{n.provider}</strong>
                            <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: "#e9ecef", color: "#868e96" }}>{n.phase}</span>
                          </div>
                          <span style={{ fontSize: 10, color: "#868e96" }}>{n.at} — {n.by}</span>
                        </div>
                        <div style={{ fontSize: 12 }}>{n.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── MEDICAL DIRECTOR DASHBOARD — executive cohort overview ── */}
              {isDir && mainTab === "roster" && (() => {
                const totalProv = PROVS.length;
                const onTrack = PROVS.filter(p => getStatus(p.id) === "ok").length;


                /* ── Per-provider derived data ── */
                const cultureData = PROVS.map(p => {
                  const apc = isAPC(p);
                  const cs = cultureScore(qa, p.id, apc);
                  const band = cultureBand(cs.avg);
                  const tr = cultureTrend(qa, p.id, apc);
                  const overdue = cs.avg === null && getStatus(p.id) !== "ok";
                  return { p, apc, cs, band, tr, overdue };
                });
                const bandCount = { thriving: 0, developing: 0, atrisk: 0, sched: 0 };
                cultureData.forEach(c => { bandCount[c.band.key]++; });

                const prodData = PROVS.map(p => ({ p, sum: prodSummary(p.id), dots: prodMetricDots(p.id) })).filter(x => x.sum.total > 0);
                const prodFlagged = prodData.filter(x => x.sum.good <= 1);
                const prodOnTrack = prodData.length - prodFlagged.length;

                /* ── Needs-attention flags ── */
                const flags = [];
                cultureData.forEach(c => {
                  if (c.cs.avg !== null && c.cs.avg < 5)
                    flags.push({ pid: c.p.id, name: c.p.name, tag: "C.I.I. ⚠", tone: "red", reason: "C.I.I. " + c.cs.display + " · At Risk — culture integration score below threshold" + (c.tr.dir === "down" ? " · trending ↓" : ""), go: () => navigate({ selId: c.p.id, tab: "culture", phase: c.p.phase }) });
                });
                prodFlagged.forEach(x => {
                  const bad = x.dots.filter(d => d.color === "red").map(d => d.short.toLowerCase());
                  flags.push({ pid: x.p.id, name: x.p.name, tag: "Prod ⚠", tone: "red", reason: "Prod " + x.sum.good + "/" + x.sum.total + (bad.length ? " · " + bad.join(" + ") + " trending wrong direction" : ""), go: () => navigate({ selId: x.p.id, tab: "prod", phase: x.p.phase }) });
                });
                cultureData.forEach(c => {
                  if (c.overdue)
                    flags.push({ pid: c.p.id, name: c.p.name, tag: "Overdue", tone: "warn", reason: "Culture checkpoint overdue · questionnaire not yet submitted", go: () => navigate({ selId: c.p.id, tab: "culture", phase: c.p.phase }) });
                });

                /* ── Cohort-by-stage buckets ── */
                const stageOf = (phase) => {
                  const m = /^([wm])(\d+)$/.exec(phase || "");
                  if (!m) return 1;
                  const t = m[1], n = +m[2];
                  if (t === "w") return n <= 4 ? 0 : 1;
                  if (n <= 2) return 1; if (n <= 6) return 2; if (n <= 12) return 3; return 4;
                };
                const stages = [
                  { label: "Weeks 1–4", color: "#c084fc" },
                  { label: "Weeks 5–12", color: "#028090" },
                  { label: "Months 3–6", color: "#0284c7" },
                  { label: "Months 6–12", color: "#0284c7" },
                  { label: "Post Month 12", color: "#64748b" },
                ];
                const stageCounts = [0, 0, 0, 0, 0];
                PROVS.forEach(p => { stageCounts[stageOf(p.phase)]++; });
                const maxStage = Math.max(1, ...stageCounts);
                const first90 = stageCounts[0] + stageCounts[1] + stageCounts[2];

                /* ── Touchpoint status counts (live, from getStatus) ── */
                const dueList = PROVS.filter(p => getStatus(p.id) === "due");
                const overdueList = PROVS.filter(p => getStatus(p.id) === "overdue");
                const tpAttention = [...overdueList, ...dueList];

                /* Sort culture list by band severity then score desc */
                const bandOrder = { thriving: 0, developing: 1, atrisk: 2, sched: 3 };
                const cultureSorted = [...cultureData].sort((a, b) => {
                  const oa = a.overdue ? 2.5 : bandOrder[a.band.key], ob = b.overdue ? 2.5 : bandOrder[b.band.key];
                  if (oa !== ob) return oa - ob;
                  return (b.cs.avg || 0) - (a.cs.avg || 0);
                });

                /* Shared panel shell */
                const Panel = ({ icon, title, sub, children }) => (
                  <div style={{ background: "white", border: "1px solid #e9ecef", borderRadius: 11, overflow: "hidden" }}>
                    <div style={{ padding: "12px 15px", borderBottom: "1px solid #f0f1f3", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{icon}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0f1b2d" }}>{title}</span>
                      {sub && <span style={{ fontSize: 10.5, color: "#adb5bd", marginLeft: "auto" }}>{sub}</span>}
                    </div>
                    <div style={{ padding: "13px 15px" }}>{children}</div>
                  </div>
                );

                return (
                  <div>
                    {/* ── KPI ROW ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 11, marginBottom: 16 }}>
                      {/* Active Providers */}
                      <div onClick={() => setSidebarFilter(null)}
                        style={{ background: "white", border: sidebarFilter === null ? "2px solid #028090" : "1px solid #e9ecef", borderRadius: 11, padding: "15px 16px", cursor: "pointer" }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: "#028090", lineHeight: 1 }}>{totalProv}</div>
                        <div style={{ fontSize: 10.5, color: "#868e96", marginTop: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>Active Providers</div>
                        <div style={{ fontSize: 10, marginTop: 5, fontWeight: 700, color: "#028090" }}>show all · {totalProv} in program</div>
                      </div>
                      {/* Productivity On Track — slot 2 */}
                      <div onClick={() => setShowProdModal(true)}
                        style={{ background: "white", border: "1px solid #e9ecef", borderTop: "3px solid #4f46e5", borderRadius: 11, padding: "15px 16px", cursor: "pointer" }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: prodFlagged.length > 0 ? "#d97706" : "#16a34a", lineHeight: 1 }}>{prodOnTrack}<span style={{ fontSize: 16, fontWeight: 600, color: "#868e96" }}>/{prodData.length}</span></div>
                        <div style={{ fontSize: 10.5, color: "#868e96", marginTop: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>Trending to Goal</div>
                        <div style={{ fontSize: 10, marginTop: 5, fontWeight: 700, color: prodFlagged.length > 0 ? "#d97706" : "#16a34a" }}>{prodFlagged.length > 0 ? prodFlagged.length + " metrics stalled — tap to review" : "all metrics improving · tap to review"}</div>
                      </div>
                      {/* On Track */}
                      <div onClick={() => setSidebarFilter(sidebarFilter === "ok" ? null : "ok")}
                        style={{ background: "white", border: sidebarFilter === "ok" ? "2px solid #16a34a" : "1px solid #e9ecef", borderRadius: 11, padding: "15px 16px", cursor: "pointer" }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: "#16a34a", lineHeight: 1 }}>{onTrack}</div>
                        <div style={{ fontSize: 10.5, color: "#868e96", marginTop: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>On Track</div>
                        <div style={{ fontSize: 10, marginTop: 5, fontWeight: 700, color: "#16a34a" }}>{totalProv ? Math.round(onTrack / totalProv * 100) + "% of cohort" : "—"}</div>
                      </div>
                      {/* Need Attention */}
                      <div onClick={() => setSidebarFilter(sidebarFilter === "behind" ? null : "behind")}
                        style={{ background: "white", border: sidebarFilter === "behind" ? "2px solid #d97706" : "1px solid #e9ecef", borderRadius: 11, padding: "15px 16px", cursor: "pointer" }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: "#d97706", lineHeight: 1 }}>{flags.length}</div>
                        <div style={{ fontSize: 10.5, color: "#868e96", marginTop: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>Need Attention</div>
                        <div style={{ fontSize: 10, marginTop: 5, fontWeight: 700, color: "#d97706" }}>C.I.I. · Prod · checkpoint flags</div>
                      </div>
                      {/* Culture CII */}
                      <div onClick={() => setShowCiiModal(true)}
                        style={{ background: "white", border: "1px solid #e9ecef", borderTop: "3px solid #92400e", borderRadius: 11, padding: "15px 16px", cursor: "pointer" }}>
                        <div style={{ fontSize: 17, fontWeight: 800, color: "#78350f", lineHeight: 1.2 }}>C.I.I.</div>
                        <div style={{ fontSize: 9.5, fontWeight: 600, color: "#92400e", marginTop: 2, letterSpacing: "0.02em" }}>Culture Integration Index</div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 7 }}>
                          {bandCount.thriving > 0 && <span style={{ fontSize: 8.5, fontWeight: 700, padding: "2px 6px", borderRadius: 5, background: "#dcfce7", color: "#15803d" }}>{bandCount.thriving} Thriving</span>}
                          {bandCount.developing > 0 && <span style={{ fontSize: 8.5, fontWeight: 700, padding: "2px 6px", borderRadius: 5, background: "#fef9c3", color: "#854d0e" }}>{bandCount.developing} Developing</span>}
                          {bandCount.atrisk > 0 && <span style={{ fontSize: 8.5, fontWeight: 700, padding: "2px 6px", borderRadius: 5, background: "#fee2e2", color: "#b91c1c" }}>{bandCount.atrisk} At Risk</span>}
                          {bandCount.sched > 0 && <span style={{ fontSize: 8.5, fontWeight: 700, padding: "2px 6px", borderRadius: 5, background: "#f1f3f5", color: "#868e96" }}>{bandCount.sched} Sched'd</span>}
                        </div>
                        <div style={{ fontSize: 10, marginTop: 6, fontWeight: 700, color: "#92400e" }}>m3 · m6 · m9 · m12 cadence</div>
                      </div>
                    </div>

                    {/* ── ROW: Cohort by Stage | Needs Attention | Culture CII ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr 1fr", gap: 12, marginBottom: 12 }}>

                      {/* Cohort by Stage */}
                      <Panel icon="📊" title="Cohort by Stage" sub="Today">
                        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                          {stages.map((s, i) => (
                            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#495057", width: 88, flexShrink: 0 }}>{s.label}</span>
                              <div style={{ flex: 1, background: "#f1f3f5", borderRadius: 4, height: 10, overflow: "hidden" }}>
                                <div style={{ height: "100%", borderRadius: 4, width: (stageCounts[i] / maxStage * 100) + "%", background: s.color }} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#0f1b2d", width: 14, textAlign: "right", flexShrink: 0 }}>{stageCounts[i]}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f4f5f7", fontSize: 10.5, color: "#868e96" }}>
                          <span style={{ fontWeight: 700, color: "#0f1b2d" }}>{totalProv ? Math.round(first90 / totalProv * 100) : 0}%</span> of cohort in first 90 days — highest-intensity supervision period
                        </div>
                      </Panel>

                      {/* Needs Attention */}
                      <Panel icon="⚠️" title="Needs Attention" sub={flags.length + " flag" + (flags.length !== 1 ? "s" : "")}>
                        {flags.length === 0 ? (
                          <div style={{ fontSize: 12, color: "#16a34a", padding: "8px 2px" }}>🎉 No flags — every provider is on track.</div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {flags.map((f, i) => (
                              <div key={i} onClick={f.go}
                                style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "9px 10px", borderRadius: 8, cursor: "pointer", background: f.tone === "red" ? "#fff5f5" : "#fffbeb", border: "1px solid " + (f.tone === "red" ? "#fca5a5" : "#fde68a") }}>
                                {avatar(f.name, f.tone === "red")}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#0f1b2d" }}>{f.name}</div>
                                  <div style={{ fontSize: 10.5, marginTop: 2, color: f.tone === "red" ? "#991b1b" : "#854d0e" }}>{f.reason}</div>
                                </div>
                                <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 6, whiteSpace: "nowrap", flexShrink: 0, background: f.tone === "red" ? "#fee2e2" : "#fef9c3", color: f.tone === "red" ? "#991b1b" : "#854d0e" }}>{f.tag}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </Panel>

                      {/* Culture CII */}
                      <Panel icon="🌡️" title={<span><span style={{ fontWeight: 800 }}>C.I.I.</span><span style={{ display: "block", fontSize: 9, fontWeight: 500, color: "#92400e", letterSpacing: "0.02em", marginTop: 1 }}>Culture Integration Index</span></span>} sub="Latest per provider">
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          {cultureSorted.map(c => {
                            const trColor = c.tr.dir === "up" ? "#16a34a" : c.tr.dir === "down" ? "#dc2626" : "#16a34a";
                            return (
                              <div key={c.p.id} onClick={() => navigate({ selId: c.p.id, tab: "culture", phase: c.p.phase })}
                                style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                                <span style={{ fontSize: 11, fontWeight: 600, color: "#0f1b2d", width: 102, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.p.name}</span>
                                <span style={{ fontSize: 8.5, fontWeight: 700, padding: "2px 5px", borderRadius: 5, flexShrink: 0, whiteSpace: "nowrap", background: c.overdue ? "#fef9c3" : c.band.bg, color: c.overdue ? "#854d0e" : c.band.fg, fontStyle: c.band.key === "sched" && !c.overdue ? "italic" : "normal" }}>
                                  {c.overdue ? "Overdue" : c.band.label}
                                </span>
                                <div style={{ flex: 1, background: "#f1f3f5", borderRadius: 3, height: 5, overflow: "hidden" }}>
                                  <div style={{ height: "100%", borderRadius: 3, width: (c.cs.avg !== null ? c.cs.pct : 0) + "%", background: c.band.bar }} />
                                </div>
                                <span style={{ fontSize: c.cs.avg !== null ? 12 : 9, fontWeight: 800, width: 32, textAlign: "right", flexShrink: 0, color: c.cs.avg !== null ? c.band.fg : "#adb5bd" }}>{c.cs.avg !== null ? c.cs.display : "—"}</span>
                                <span style={{ fontSize: 12, width: 14, textAlign: "center", flexShrink: 0, color: trColor }}>{c.tr.arrow}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #f4f5f7", fontSize: 9.5, color: "#868e96" }}>
                          Bands: Thriving ≥7 · Developing 5–6 · At Risk &lt;5 · scored at m3/m6/m9/m12 (APCs +m15–m24)
                        </div>
                      </Panel>
                    </div>

                    {/* ── ROW: Touchpoint Summary | Epic Productivity ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                      {/* Touchpoint Summary */}
                      <Panel icon="📅" title="Touchpoint Summary" sub="All providers">
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 13 }}>
                          <div style={{ borderRadius: 8, padding: "9px 11px", textAlign: "center", background: "#fef9c3", border: "1px solid #fde68a" }}>
                            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, color: "#854d0e" }}>{dueList.length}</div>
                            <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", marginTop: 3, color: "#92400e" }}>Due Now</div>
                          </div>
                          <div style={{ borderRadius: 8, padding: "9px 11px", textAlign: "center", background: "#fee2e2", border: "1px solid #fca5a5" }}>
                            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, color: "#b91c1c" }}>{overdueList.length}</div>
                            <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", marginTop: 3, color: "#991b1b" }}>Overdue</div>
                          </div>
                          <div style={{ borderRadius: 8, padding: "9px 11px", textAlign: "center", background: "#dcfce7", border: "1px solid #86efac" }}>
                            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, color: "#15803d" }}>{onTrack}</div>
                            <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", marginTop: 3, color: "#166534" }}>On Track</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          {tpAttention.length === 0 ? (
                            <div style={{ fontSize: 11.5, color: "#868e96", padding: "4px 0" }}>No due or overdue touchpoints.</div>
                          ) : tpAttention.map(p => {
                            const ov = getStatus(p.id) === "overdue";
                            const phLabel = (MP.find(x => x.id === p.phase) || {}).label || p.phase;
                            return (
                              <div key={p.id} onClick={() => navigate({ selId: p.id, tab: "mentor", phase: p.phase })}
                                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f4f5f7", cursor: "pointer" }}>
                                {avatar(p.name, false)}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 11.5, fontWeight: 600, color: "#0f1b2d" }}>{p.name}</div>
                                  <div style={{ fontSize: 10, color: "#868e96", marginTop: 1 }}>Review · {phLabel}</div>
                                </div>
                                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: ov ? "#fee2e2" : "#fef9c3", color: ov ? "#b91c1c" : "#854d0e" }}>{ov ? "Overdue" : "Due now"}</span>
                              </div>
                            );
                          })}
                        </div>
                      </Panel>

                      {/* Epic Productivity */}
                      <Panel icon="📈" title="Epic Productivity" sub={prodOnTrack + " / " + prodData.length + " trending to goal"}>
                        {/* header */}
                        <div style={{ display: "flex", alignItems: "center", padding: "0 0 7px", borderBottom: "1.5px solid #e9ecef", marginBottom: 2 }}>
                          <div style={{ width: 33, flexShrink: 0 }} />
                          <div style={{ flex: 1, fontSize: 9.5, fontWeight: 700, color: "#868e96", textTransform: "uppercase", letterSpacing: ".04em" }}>Provider</div>
                          {["V", "R", "I", "N", "Rf"].map(h => (
                            <div key={h} style={{ width: 20, textAlign: "center", fontSize: 9, fontWeight: 700, color: "#adb5bd", flexShrink: 0 }}>{h}</div>
                          ))}
                          <div style={{ width: 30, textAlign: "right", fontSize: 9, fontWeight: 700, color: "#868e96", flexShrink: 0 }}>Track</div>
                        </div>
                        {prodData.map(x => {
                          const flagged = x.sum.good <= 1;
                          const pillColor = x.sum.good === x.sum.total ? "#15803d" : x.sum.good <= 1 ? "#dc2626" : x.sum.good >= x.sum.total - 1 ? "#16a34a" : "#d97706";
                          return (
                            <div key={x.p.id} onClick={() => navigate({ selId: x.p.id, tab: "prod", phase: x.p.phase })}
                              style={{ display: "flex", alignItems: "center", padding: flagged ? "5px 5px" : "5px 0", borderBottom: "1px solid #f4f5f7", cursor: "pointer", background: flagged ? "#fff5f5" : "transparent", border: flagged ? "1px solid #fca5a5" : "none", borderRadius: flagged ? 6 : 0, margin: flagged ? "2px 0" : 0 }}>
                              <div style={{ marginRight: 7 }}>{avatar(x.p.name, flagged)}</div>
                              <div style={{ flex: 1, fontSize: 11, fontWeight: flagged ? 700 : 600, color: flagged ? "#b91c1c" : "#0f1b2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.p.name}</div>
                              {x.dots.map(d => (
                                <div key={d.key} style={{ width: 20, textAlign: "center", flexShrink: 0 }}>
                                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: dotColor(d.color), verticalAlign: "middle" }} />
                                </div>
                              ))}
                              <div style={{ width: 30, textAlign: "right", fontSize: 10, fontWeight: 700, flexShrink: 0, color: pillColor }}>{x.sum.good}/{x.sum.total}</div>
                            </div>
                          );
                        })}
                        <div style={{ display: "flex", gap: 12, marginTop: 9, paddingTop: 8, borderTop: "1px solid #f4f5f7", fontSize: 9, color: "#868e96", flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />On track</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308", display: "inline-block" }} />Variable</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />Needs attention</span>
                          <span style={{ marginLeft: "auto", fontStyle: "italic", color: "#adb5bd" }}>V·Volume R·RVU I·Inbox N·Note Rf·Refill</span>
                        </div>
                      </Panel>
                    </div>

                    <div style={{ fontSize: 12, color: "#adb5bd", textAlign: "center", marginTop: 16 }}>
                      Select a provider from the list or a card above to open their profile
                    </div>
                  </div>
                );
              })()}

              {/* ── MY PANEL — mentor landing page ── */}
              {!isDir && !selId && (() => {
                const panel = myProvs;
                const behind = panel.filter(p => getStatus(p.id) !== "ok");
                return (
                  <div>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#0f1b2d" }}>My Panel</div>
                      <div style={{ fontSize: 13, color: "#868e96" }}>{panel.length} provider{panel.length !== 1 ? "s" : ""}</div>
                    </div>

                    {/* Behind-schedule notice */}
                    {behind.length > 0 && (
                      <div style={{ background: "#fff8f0", border: "1px solid #fed7aa", borderRadius: 8, padding: "9px 14px", marginBottom: 14, fontSize: 12, color: "#9a3412" }}>
                        ⚠️ {behind.map(p => p.name.split(",")[0].replace("Dr. ", "")).join(", ")} {behind.length === 1 ? "is" : "are"} behind schedule — check their Mentor tab
                      </div>
                    )}

                    {/* Mentee cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {panel.map(p => {
                        const st = getStatus(p.id);
                        const dot = st === "overdue" ? "#ef4444" : st === "due" ? "#f97316" : "#22c55e";
                        const borderCol = st === "overdue" ? "#fca5a5" : st === "due" ? "#fdba74" : "#dee2e6";
                        const phLabel = (MP.find(x => x.id === p.phase) || {}).label || p.phase;
                        const menPct = mentorPct(checks, p.id);
                        const barCol = menPct >= 70 ? "#22c55e" : menPct >= 40 ? "#eab308" : "#ef4444";
                        // Next unchecked mentor item in current phase
                        const curMPh = MP.find(x => x.id === p.phase);
                        const nextIdx = curMPh ? curMPh.items.findIndex((_, i) => !checks[p.id + "." + p.phase + "." + i]) : -1;
                        const nextItem = nextIdx >= 0 && curMPh ? curMPh.items[nextIdx] : null;
                        // Most recent note across all phases
                        const allNotes = Object.entries(notes)
                          .filter(([k]) => k.startsWith(p.id + "."))
                          .flatMap(([, arr]) => (arr as any[]))
                          .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
                        const lastNote = allNotes[0];
                        return (
                          <div key={p.id}
                            onClick={() => navigate({ selId: p.id, tab: "mentor", phase: p.phase })}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#028090"; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = borderCol; }}
                            style={{ background: "white", borderRadius: 10, border: "1px solid " + borderCol, padding: "14px 18px", cursor: "pointer", transition: "box-shadow 0.15s, border-color 0.15s" }}>
                            {/* Row 1: status dot + name + badges + phase */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#0f1b2d", flex: 1 }}>{p.name}</span>
                              {st === "overdue" && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6, background: "#ef4444", color: "white" }}>LATE</span>}
                              {st === "due"     && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6, background: "#f97316", color: "white" }}>DUE</span>}
                              <span style={{ fontSize: 11, color: "#adb5bd" }}>{phLabel} · Day {p.days}</span>
                            </div>
                            {/* Row 2: mentor progress bar */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ flex: 1, height: 5, borderRadius: 3, background: "#f1f3f5", overflow: "hidden" }}>
                                <div style={{ width: menPct + "%", height: "100%", borderRadius: 3, background: barCol }} />
                              </div>
                              <span style={{ fontSize: 11, color: "#868e96", whiteSpace: "nowrap" }}>Mentor {menPct}%</span>
                            </div>
                            {/* Row 3: next item (or phase-complete chip) + last note */}
                            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
                              {nextItem ? (
                                <div style={{ flex: 1, fontSize: 11, color: "#028090", background: "#f0fdfe", borderRadius: 6, padding: "4px 9px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  <span style={{ fontWeight: 700 }}>Next: </span>{nextItem}
                                </div>
                              ) : curMPh ? (
                                <div style={{ flex: 1, fontSize: 11, color: "#166534", background: "#f0fdf4", borderRadius: 6, padding: "4px 9px" }}>
                                  ✓ {curMPh.label} complete
                                </div>
                              ) : <div style={{ flex: 1 }} />}
                              <div style={{ fontSize: 10, color: "#adb5bd", whiteSpace: "nowrap", flexShrink: 0 }}>
                                {lastNote ? "📝 " + lastNote.at : "no notes yet"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div>
              {/* ENHANCED PROFILE CARD */}
              <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", padding: "18px 22px", marginBottom: 16 }}>
                {/* Top row: avatar + name + Advance button */}
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 14 }}>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(2,128,144,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#028090", flexShrink: 0 }}>
                    {prov.name.split(" ").pop().substring(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#0f1b2d" }}>{prov.name}</div>
                    <div style={{ fontSize: 12, color: "#868e96" }}>{prov.role} — Mentor: {mentorUser ? mentorUser.name : "—"}</div>
                  </div>
                  {isDir && (function() {
                    const track = isAPC(prov) ? MP : MP_PHYS;
                    const ci = track.findIndex(ph => ph.id === prov.phase);
                    const canAdv = ci >= 0 && ci < track.length - 1;
                    return canAdv ? (
                      <button onClick={() => { const next = track[ci + 1].id; setProvs(prev => prev.map(x => x.id === prov.id ? { ...x, phase: next } : x)); setPhase(next); }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 16px", borderRadius: 8, border: "none", background: "#028090", color: "white", cursor: "pointer", flexShrink: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>Advance →</span>
                        <span style={{ fontSize: 10, opacity: 0.8, marginTop: 2, whiteSpace: "nowrap" }}>{track[ci + 1].label}</span>
                      </button>
                    ) : null;
                  })()}
                </div>
                {/* Stats row: Days · Score · Overall */}
                <div style={{ display: "flex", gap: 24, paddingLeft: 66 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#868e96", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>Days</div>
                    {isDir && editDays === prov.id ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <input type="number" value={editDaysVal} onChange={e => setEditDaysVal(e.target.value)}
                          style={{ width: 64, textAlign: "center", fontSize: 16, fontWeight: 700, padding: "2px 4px", border: "2px solid #028090", borderRadius: 6, outline: "none" }}
                          onKeyDown={e => {
                            if (e.key === "Enter") { const n = parseInt(editDaysVal, 10); if (!isNaN(n) && n >= 0) { setProvs(prev => prev.map(x => x.id === prov.id ? { ...x, days: n } : x)); } setEditDays(null); }
                            if (e.key === "Escape") setEditDays(null);
                          }} autoFocus />
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => { const n = parseInt(editDaysVal, 10); if (!isNaN(n) && n >= 0) { setProvs(prev => prev.map(x => x.id === prov.id ? { ...x, days: n } : x)); } setEditDays(null); }}
                            style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, border: "none", background: "#028090", color: "white", cursor: "pointer" }}>Save</button>
                          <button onClick={() => setEditDays(null)}
                            style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, border: "1px solid #dee2e6", background: "none", cursor: "pointer" }}>✕</button>
                        </div>
                      </div>
                    ) : (
                      <div onClick={isDir ? () => { setEditDays(prov.id); setEditDaysVal(String(prov.days)); } : undefined}
                        style={{ cursor: isDir ? "pointer" : "default" }} title={isDir ? "Click to edit" : undefined}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "#0f1b2d" }}>{prov.days}</div>
                        <div style={{ fontSize: 9, color: "#868e96" }}>{isDir ? "click to edit" : "of 365"}</div>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#868e96", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>Score</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#0f1b2d" }}>
                      {(() => { for (let i = curIdx; i >= 0; i--) { const s = avgScore(qa, prov.id, MP[i].id); if (s !== null) return s.toFixed(1); } return "—"; })()}
                    </div>
                    <div style={{ fontSize: 9, color: "#868e96" }}>latest</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#868e96", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>Overall</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: mentorPct(checks, prov.id) >= 70 ? "#22c55e" : "#0f1b2d" }}>{mentorPct(checks, prov.id)}%</div>
                    <div style={{ fontSize: 9, color: "#868e96" }}>mentor</div>
                  </div>
                </div>
                {(() => {
                  const phases = isAPC(prov) ? MP : MP_PHYS;
                  const curI = phases.findIndex(p => p.id === prov.phase);
                  const chipGroupLabel = (id) => {
                    if (["w0","w1","w2","w3","m1","w5","w6","w7","w8","m2"].includes(id)) return "Wk 0–Mo 2";
                    if (["m15","m18","m24"].includes(id)) return "Mo 15–24";
                    return "Mo 3–12";
                  };
                  const groups = [];
                  const seen = {};
                  phases.forEach(ph => {
                    const g = chipGroupLabel(ph.id);
                    if (!seen[g]) { seen[g] = true; groups.push({ label: g, phases: [] }); }
                    groups.find(x => x.label === g).phases.push(ph);
                  });
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 12 }}>
                      {groups.map(({ label, phases: gPhases }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#c4c9d0", minWidth: 52, flexShrink: 0 }}>{label}</span>
                          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                            {gPhases.map(ph => {
                              const i = phases.findIndex(p => p.id === ph.id);
                              const done = i < curI || (i === curI && countChecks(checks, prov.id, ph.id).pct === 100);
                              return (
                                <span key={ph.id} style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 8, background: done ? "rgba(34,197,94,0.12)" : "#e9ecef", color: done ? "#166534" : "#868e96" }}>
                                  {(done ? "✓ " : "○ ") + ph.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* JOURNEY TIMELINE */}
              <Timeline phases={prov && isAPC(prov) ? MP : MP_PHYS} currentPhaseId={prov ? prov.phase : null} />

              {/* METRIC CARDS — clickable tab selectors (director only) */}
              {isDir && (function() {
                const apc = isAPC(prov);
                const hasProd = hasProductivity(prov.id);
                // base cards (incl. single mentor tile) + culture card + (productivity card?)
                const colCount = 4 + 1 + (hasProd ? 1 : 0);
                const cols = "repeat(" + colCount + ", 1fr)";
                // APCs run the same year-1 curriculum as physicians, then continue into
                // year-2 APC phases — so they get ONE comprehensive "Mentor: APC" tile
                // spanning the whole MP track, not a separate physician + APC pair.
                const mentorCard = apc
                  ? { label: "Mentor: APC", pct: mentorFullPct(checks, prov.id), color: "#028090", key: "mentor", def: prov.phase }
                  : { label: "Mentor: Physician", pct: mentorPhysPct(checks, prov.id), color: "#028090", key: "mentor", def: prov.phase };
                const cards = [
                  { label: "Medical Director Curriculum", pct: mdCurriculumPct(checks, prov.id), color: "#8b5cf6", key: "md", def: "pre0" },
                  mentorCard,
                  { label: "Office Manager Touchpoints", pct: opsPct(qa, prov.id), color: "#0ea5e9", key: "ops", def: "om1" },
                  { label: "Medical Director Touchpoints", pct: questPct(qa, prov.id), color: "#eab308", key: "quest", def: "w1" },
                ];
                const cs = cultureScore(qa, prov.id, apc);
                const cultureActive = tab === "culture" || (tab === "quest" && CULTURE_PHASES.indexOf(phase) !== -1);
                const cultureColor = cs.avg === null ? "#adb5bd" : cs.avg >= 7 ? "#22c55e" : cs.avg >= 5 ? "#eab308" : "#ef4444";
                return (
                  <div style={{ display: "grid", gridTemplateColumns: cols, gap: 10, marginBottom: 16 }}>
                    {cards.map((m) => {
                      const isActive = tab === m.key;
                      const dc = m.pct >= 70 ? "#22c55e" : m.pct >= 30 ? m.color : m.pct > 0 ? "#ef4444" : "#adb5bd";
                      return (
                        <div key={m.key} onClick={() => { setTab(m.key); setPhase(m.def); }}
                          style={{ background: isActive ? m.color + "12" : "white", borderRadius: 10, border: "2px solid " + (isActive ? m.color : "#dee2e6"), padding: "12px 14px", cursor: "pointer", transition: "border-color 120ms, background 120ms" }}>
                          <div style={{ fontSize: 11, color: isActive ? m.color : "#868e96", marginBottom: 4, fontWeight: isActive ? 700 : 400 }}>{m.label}</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: dc }}>{m.pct}%</div>
                          <div style={{ height: 5, background: "#e9ecef", borderRadius: 3, overflow: "hidden", marginTop: 6 }}>
                            <div style={{ height: "100%", width: m.pct + "%", background: m.color, borderRadius: 3 }} />
                          </div>
                        </div>
                      );
                    })}
                    {/* Culture Integration card */}
                    <div onClick={function() { setTab("culture"); }}
                      style={{ background: cultureActive ? "#78350f12" : "white", borderRadius: 10, border: "2px solid " + (cultureActive ? "#92400e" : "#dee2e6"), padding: "12px 14px", cursor: "pointer", transition: "border-color 120ms, background 120ms" }}>
                      <div style={{ fontSize: 11, color: cultureActive ? "#78350f" : "#868e96", marginBottom: 4, fontWeight: cultureActive ? 700 : 400 }}>Culture Integration</div>
                      <div style={{ fontSize: cs.avg === null ? 13 : 24, fontWeight: 700, color: cultureColor, marginTop: cs.avg === null ? 5 : 0 }}>{cs.display}</div>
                      <div style={{ fontSize: 9, color: "#adb5bd", marginTop: 2 }}>{apc ? "avg / 10 · m3–m24" : "avg / 10 · m3, m6, m9, m12"}</div>
                      <div style={{ height: 5, background: "#e9ecef", borderRadius: 3, overflow: "hidden", marginTop: 4 }}>
                        <div style={{ height: "100%", width: cs.pct + "%", background: cultureColor, borderRadius: 3 }} />
                      </div>
                    </div>
                    {/* Productivity card — only when Epic data is piped in */}
                    {hasProd && (function() {
                      const prodActive = tab === "prod";
                      const ps = prodSummary(prov.id);
                      const pColor = "#0d9488";
                      const dc = ps.total > 0 && ps.good === ps.total ? "#22c55e" : ps.good > 0 ? pColor : "#ef4444";
                      return (
                        <div onClick={function() { setTab("prod"); }}
                          style={{ background: prodActive ? pColor + "12" : "white", borderRadius: 10, border: "2px solid " + (prodActive ? pColor : "#dee2e6"), padding: "12px 14px", cursor: "pointer", transition: "border-color 120ms, background 120ms" }}>
                          <div style={{ fontSize: 11, color: prodActive ? pColor : "#868e96", marginBottom: 4, fontWeight: prodActive ? 700 : 400 }}>Productivity</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: dc }}>{ps.good}/{ps.total}</div>
                          <div style={{ fontSize: 9, color: "#adb5bd", marginTop: 2 }}>trending to goal · Epic</div>
                          <div style={{ height: 5, background: "#e9ecef", borderRadius: 3, overflow: "hidden", marginTop: 4 }}>
                            <div style={{ height: "100%", width: (ps.total > 0 ? ps.good / ps.total * 100 : 0) + "%", background: pColor, borderRadius: 3 }} />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}

              {/* SCORE TREND */}
              {(isDir || isMen) && <ScoreTrend qa={qa} pid={prov.id} />}

              {/* DIR. CURRICULUM — read-only collapsed card for mentors */}
              {isMen && !isDir && (() => {
                const mdPct = mdCurriculumPct(checks, prov.id);
                const allMdItems = Object.values(MD_ITEMS_BY_PHASE).flat() as any[];
                const doneCount = allMdItems.filter((it: any) => checks[prov.id + ".md." + it.id]).length;
                return (
                  <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", marginBottom: 14, overflow: "hidden" }}>
                    <button onClick={() => setMdCurrOpen(o => !o)}
                      style={{ width: "100%", padding: "11px 16px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
                      <span style={{ fontSize: 11, color: "#8b5cf6", transition: "transform 0.2s", display: "inline-block", transform: mdCurrOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", flex: 1 }}>Director Curriculum</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6" }}>{mdPct}%</span>
                      <div style={{ width: 72, height: 5, borderRadius: 3, background: "#f1f3f5", overflow: "hidden" }}>
                        <div style={{ width: mdPct + "%", height: "100%", background: "#8b5cf6", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 9, color: "#adb5bd", letterSpacing: "0.04em", textTransform: "uppercase" }}>read only</span>
                    </button>
                    {mdCurrOpen && (
                      <div style={{ borderTop: "1px solid #f1f3f5", padding: "8px 16px 14px", maxHeight: 280, overflowY: "auto" }}>
                        <div style={{ fontSize: 10, color: "#adb5bd", marginBottom: 8 }}>{doneCount} of {allMdItems.length} items completed by Medical Director</div>
                        {MD_PHASES.map(ph => {
                          const phItems = MD_ITEMS_BY_PHASE[ph.id] || [];
                          if (phItems.length === 0) return null;
                          const phDone = phItems.filter((it: any) => checks[prov.id + ".md." + it.id]).length;
                          return (
                            <div key={ph.id} style={{ marginBottom: 10 }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#adb5bd", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                                {ph.label} — {phDone}/{phItems.length}
                              </div>
                              {phItems.map((it: any) => {
                                const done = !!checks[prov.id + ".md." + it.id];
                                return (
                                  <div key={it.id} style={{ display: "flex", alignItems: "flex-start", gap: 7, padding: "3px 0" }}>
                                    <span style={{ fontSize: 13, color: done ? "#22c55e" : "#d1d5db", flexShrink: 0, marginTop: 1 }}>{done ? "✓" : "○"}</span>
                                    <span style={{ fontSize: 11, color: done ? "#374151" : "#9ca3af", lineHeight: 1.4 }}>{it.text}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* NEXT MENTOR TOUCHPOINT — prompt for mentors */}
              {isMen && !isDir && (() => {
                const curMPh = MP.find(x => x.id === phase);
                if (!curMPh) return null;
                const nextIdx = curMPh.items.findIndex((_, i) => !checks[prov.id + "." + phase + "." + i]);
                if (nextIdx < 0) return (
                  <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "9px 14px", marginBottom: 14, fontSize: 12, color: "#166534" }}>
                    ✓ All {curMPh.items.length} items complete for {curMPh.label}
                  </div>
                );
                return (
                  <div style={{ background: "#f0fdfe", border: "1px solid #67e8f9", borderRadius: 8, padding: "9px 14px", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Up next · {curMPh.label}</div>
                    <div style={{ fontSize: 12, color: "#0f172a" }}>{curMPh.items[nextIdx]}</div>
                  </div>
                );
              })()}

              {/* PRODUCTIVITY — Epic metrics (replaces phase selector + checklist) */}
              {tab === "prod" && <ProductivityPanel prov={prov} />}

              {/* CULTURE — CII panel (replaces phase selector + checklist) */}
              {tab === "culture" && <CulturePanel prov={prov} qa={qa} apc={isAPC(prov)} />}

              {/* PHASE SELECTOR */}
              {!isProd && !isCulture && (() => {
                const accent = isOps ? "#0ea5e9" : isQ ? "#eab308" : isMd ? "#8b5cf6" : "#028090";

                const renderPhBtn = (ph) => {
                  const isAct = phase === ph.id;
                  const isCur = tab === "mentor" && ph.id === prov.phase;
                  let cc = null;
                  if (isMd) {
                    const items = MD_ITEMS_BY_PHASE[ph.id] || [];
                    const done = items.filter(it => checks[prov.id + ".md." + it.id]).length;
                    cc = items.length > 0 ? { done, total: items.length } : null;
                  } else if (isOps) {
                    const op = OP.find(p => p.id === ph.id);
                    if (op) {
                      const total = op.qs.length;
                      const done = op.qs.filter(q => { const v = qa[prov.id + "." + ph.id + "." + q.qid]; return v !== undefined && v !== ""; }).length;
                      cc = { done, total };
                    }
                  } else if (!isQ) {
                    cc = countChecks(checks, prov.id, ph.id);
                  }
                  return (
                    <button key={ph.id} onClick={() => setPhase(ph.id)}
                      style={{ padding: "7px 12px", borderRadius: 6, border: "2px solid " + (isAct ? accent : isCur ? "#028090" : "#dee2e6"), background: isAct ? accent : "white", cursor: "pointer", minWidth: 54 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: isAct ? "white" : "#1c2b3a" }}>{ph.label}</div>
                      {cc && <div style={{ fontSize: 9, color: isAct ? "rgba(255,255,255,0.7)" : "#868e96" }}>{cc.done}/{cc.total}</div>}
                      {isCur && !isAct && <div style={{ fontSize: 8, color: "#028090", fontWeight: 700 }}>CURRENT</div>}
                    </button>
                  );
                };

                // OP (4 phases) and QP (6 phases) stay flat — no group labels needed
                if (isOps || isQ) {
                  return (
                    <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
                      {phaseList.map(renderPhBtn)}
                    </div>
                  );
                }

                // Group phases into labelled rows
                const getGroupLabel = (id) => {
                  if (isMd) {
                    if (id === "pre0" || id === "pre1") return "Pre-Start";
                    if (["w1","w2","w3","w4"].includes(id)) return "Wks 1–4";
                    if (["w5","w6","w7","w8"].includes(id)) return "Wks 5–8";
                    return "Months";
                  }
                  if (["w0","w1","w2","w3","m1","w5","w6","w7","w8","m2"].includes(id)) return "Wk 0–Mo 2";
                  if (["m15","m18","m24"].includes(id)) return "Mo 15–24";
                  return "Mo 3–12";
                };

                const groups = [];
                const seenGroups = {};
                phaseList.forEach(ph => {
                  const g = getGroupLabel(ph.id);
                  if (!seenGroups[g]) { seenGroups[g] = true; groups.push({ label: g, phases: [] }); }
                  groups.find(x => x.label === g).phases.push(ph);
                });

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
                    {groups.map(({ label, phases }) => (
                      <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#adb5bd", minWidth: 56, paddingTop: 9, flexShrink: 0 }}>{label}</span>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {phases.map(renderPhBtn)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* MEDICAL DIRECTOR CURRICULUM CHECKLIST */}
              {isMd && curMdItems && (
                <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", maxWidth: 740, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #dee2e6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>{(MD_PHASES.find(p => p.id === phase) || {}).label}</h3>
                      <div style={{ fontSize: 11, color: "#868e96", marginTop: 3 }}>Master curriculum — {curMdItems.length} item{curMdItems.length === 1 ? "" : "s"} this phase</div>
                    </div>
                    {mdPc && <div style={{ fontSize: 22, fontWeight: 700, color: mdPc.pct === 100 ? "#22c55e" : "#0f1b2d" }}>{mdPc.pct}%</div>}
                  </div>
                  {curMdItems.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center", color: "#868e96", fontSize: 13 }}>No curriculum items in this phase.</div>
                  ) : curMdItems.map((item) => (
                    <MdCurriculumRow
                      key={item.id}
                      item={item}
                      checked={!!checks[prov.id + ".md." + item.id]}
                      canEdit={canChk}
                      onToggle={() => {
                        const k = prov.id + ".md." + item.id;
                        setChecks(prev => { const n = { ...prev }; if (n[k]) delete n[k]; else n[k] = true; return n; });
                      }}
                    />
                  ))}
                </div>
              )}

              {/* CHECKLIST */}
              {curChecklist && (
                <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", maxWidth: 740, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #dee2e6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>{curChecklist.label}</h3>
                      <div style={{ fontSize: 11, color: "#868e96", marginTop: 3 }}>{isOps ? "Medical Director + Office Manager" : "Mentor check-in"}</div>
                    </div>
                    {pc && <div style={{ fontSize: 22, fontWeight: 700, color: pc.pct === 100 ? "#22c55e" : "#0f1b2d" }}>{pc.pct}%</div>}
                  </div>
                  {curChecklist.items.map((item, i) => (
                    <CheckItem key={i} text={item} checked={!!checks[prov.id + "." + phase + "." + i]} canEdit={canChk} onToggle={() => toggle(prov.id, phase, i)} />
                  ))}
                  <MeetingLogSection pid={prov.id} phid={phase} canEdit={canChk} meetings={meetings} onAdd={addMeeting} onToggleAction={toggleMeetingAction} />
                  <div style={{ padding: "14px 20px", background: "#f8f9fb", borderTop: "1px solid #dee2e6" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 6 }}>NOTES</div>
                    {curNotes.map((n, i) => (
                      <div key={i} style={{ padding: "6px 10px", background: "white", borderRadius: 5, marginBottom: 4, border: "1px solid #dee2e6", display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12 }}>{n.text}</div>
                          <div style={{ fontSize: 9, color: "#868e96", marginTop: 2 }}>{n.by} — {n.at}</div>
                        </div>
                        {canChk && (
                          <button onClick={() => removeNote(prov.id, phase, i)} title="Remove note"
                            style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#adb5bd", fontSize: 14, lineHeight: 1, padding: "0 2px", marginTop: 1 }}>×</button>
                        )}
                      </div>
                    ))}
                    {canChk && (
                      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                        <input value={noteIn} onChange={e => setNoteIn(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addNote(prov.id, phase); }}
                          placeholder="Add note..." style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #dee2e6", fontSize: 13, flex: 1, outline: "none", fontFamily: "inherit" }} />
                        <button onClick={() => addNote(prov.id, phase)}
                          style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#0f1b2d", color: "white", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Add</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* OM QUESTIONNAIRE */}
              {curOpQuest && (
                <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", maxWidth: 740, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #dee2e6" }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>{curOpQuest.label}</h3>
                    <div style={{ fontSize: 11, color: "#868e96", marginTop: 3 }}>Office Manager assessment — Director view only</div>
                  </div>
                  {curOpQuest.qs.map((q) => {
                    const val = qa[prov.id + "." + phase + "." + q.qid] || "";
                    return (
                      <div key={q.qid} style={{ padding: "16px 20px", borderBottom: "1px solid #dee2e6" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0ea5e9", textTransform: "uppercase", marginBottom: 4 }}>{q.label}</div>
                        <div style={{ fontSize: 14, color: "#1c2b3a", lineHeight: 1.5, marginBottom: 12 }}>{q.text}</div>
                        {q.ty === "s" ? (
                          <ScaleInput value={val} onChange={v => setAnswer(prov.id, phase, q.qid, v)} anchorLow={q.anchor_low} anchorHigh={q.anchor_high} />
                        ) : (
                          <textarea value={val} onChange={e => setAnswer(prov.id, phase, q.qid, e.target.value)}
                            placeholder="Record provider's response word for word..." style={{ padding: "10px 12px", borderRadius: 6, border: "1px solid #dee2e6", fontSize: 14, width: "100%", height: 100, boxSizing: "border-box", resize: "vertical", outline: "none", fontFamily: "inherit" }} />
                        )}
                      </div>
                    );
                  })}
                  <div style={{ padding: "14px 20px", background: "#f0f9ff", borderTop: "2px solid #bae6fd" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#0369a1", marginBottom: 4 }}>📋 Microsoft Forms Integration</div>
                    <div style={{ fontSize: 11, color: "#0369a1" }}>These questions are designed to be distributed to the Office Manager via Microsoft Forms. Responses entered here serve as the director's record of the OM's assessment.</div>
                  </div>
                </div>
              )}

              {/* QUESTIONNAIRE */}
              {curQuest && (
                <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", maxWidth: 740, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #dee2e6" }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>{curQuest.label} Questionnaire</h3>
                    <div style={{ fontSize: 11, color: "#868e96", marginTop: 3 }}>Record provider responses</div>
                  </div>
                  {curQuest.qs.flatMap(function(q, i) {
                    const val = qa[prov.id + "." + phase + "." + q.qid] || "";
                    const isCulture = q.culture === true;
                    const isFirstCulture = isCulture && !curQuest.qs.slice(0, i).some(function(x) { return x.culture; });
                    const items = [];
                    if (isFirstCulture) {
                      items.push(
                        <div key="culture-header" style={{ padding: "12px 20px 10px", background: "#fdf2f8", borderTop: "2px solid #fce7f3", borderBottom: "1px solid #fce7f3" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#78350f", textTransform: "uppercase", letterSpacing: "0.06em" }}>Culture Integration Index</div>
                          <div style={{ fontSize: 11, color: "#92400e", marginTop: 3 }}>Provider self-assessment · belonging, safety, connection, advocacy</div>
                        </div>
                      );
                    }
                    items.push(
                      <div key={q.qid} style={{ padding: "16px 20px", borderBottom: "1px solid " + (isCulture ? "#fce7f3" : "#dee2e6"), background: isCulture ? "#fdf2f8" : "transparent" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: isCulture ? "#9d174d" : "#0f1b2d" }}>{(i + 1) + ". " + q.text}</div>
                        {q.ty === "s" ? (
                          <ScaleInput value={val} onChange={function(v) { setAnswer(prov.id, phase, q.qid, v); }} anchorLow={q.anchor_low} anchorHigh={q.anchor_high} />
                        ) : (
                          <textarea value={val} onChange={function(e) { setAnswer(prov.id, phase, q.qid, e.target.value); }}
                            placeholder="Type response..." style={{ padding: "10px 12px", borderRadius: 6, border: "1px solid #dee2e6", fontSize: 14, width: "100%", height: 80, boxSizing: "border-box", resize: "vertical", outline: "none", fontFamily: "inherit" }} />
                        )}
                      </div>
                    );
                    return items;
                  })}
                  <MeetingLogSection pid={prov.id} phid={phase} canEdit={canChk} meetings={meetings} onAdd={addMeeting} onToggleAction={toggleMeetingAction} />
                  <div style={{ padding: "14px 20px", background: "#f8f9fb", borderTop: "1px solid #dee2e6" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 6 }}>NOTES</div>
                    {curNotes.map((n, i) => (
                      <div key={i} style={{ padding: "6px 10px", background: "white", borderRadius: 5, marginBottom: 4, border: "1px solid #dee2e6", display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12 }}>{n.text}</div>
                          <div style={{ fontSize: 9, color: "#868e96", marginTop: 2 }}>{n.by} — {n.at}</div>
                        </div>
                        {canChk && (
                          <button onClick={() => removeNote(prov.id, phase, i)} title="Remove note"
                            style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#adb5bd", fontSize: 14, lineHeight: 1, padding: "0 2px", marginTop: 1 }}>×</button>
                        )}
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                      <input value={noteIn} onChange={e => setNoteIn(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addNote(prov.id, phase); }}
                        placeholder="Add note..." style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #dee2e6", fontSize: 13, flex: 1, outline: "none", fontFamily: "inherit" }} />
                      <button onClick={() => addNote(prov.id, phase)}
                        style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#0f1b2d", color: "white", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Add</button>
                    </div>
                  </div>
                </div>
              )}

              {isQ && !curQuest && (
                <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", padding: 32, textAlign: "center" }}>
                  <div style={{ fontSize: 16, color: "#868e96" }}>No questionnaire for this phase</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Due-items popover */}
      {dueMenu && (
        <div onClick={() => setDueMenu(null)}
          style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ position: "fixed", left: dueMenu.x, top: dueMenu.y, background: "white", borderRadius: 10, border: "1px solid #dee2e6", boxShadow: "0 8px 24px rgba(0,0,0,0.14)", minWidth: 240, maxWidth: 320, zIndex: 1001 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid #dee2e6" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f1b2d" }}>Due checklist phases</div>
              <button onClick={() => setDueMenu(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#868e96", lineHeight: 1, padding: "0 2px" }}>✕</button>
            </div>
            {dueMenu.items.map(it => (
              <button key={it.phase.id}
                onClick={() => { navigate({ selId: dueMenu.pid, tab: "mentor", phase: it.phase.id }); setDueMenu(null); }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 14px", background: "none", border: "none", borderBottom: "1px solid #f1f3f5", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f1b2d" }}>{it.phase.label}</span>
                <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 }}>{it.done}/{it.total} done</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Cohort Productivity Modal ── */}
      {showProdModal && (() => {
        const DOT_COLOR = { green: "#22c55e", amber: "#eab308", red: "#ef4444", none: "#e9ecef" };
        const METRIC_LABELS = ["Pts/Day", "wRVU/wk", "Inbox", "Note", "Refill"];
        const METRIC_GOALS = PROD_METRICS.map(m => m.goal);

        // build per-provider rows with current wRVU and overall status
        const rows = PROVS.filter(p => hasProductivity(p.id)).map(p => {
          const sum = prodSummary(p.id);
          const dots = prodMetricDots(p.id);
          const rvuSeries = PROD_SERIES[p.id]?.rvu;
          const curRvu = rvuSeries ? rvuSeries[rvuSeries.length - 1] : null;
          const rvuGoal = PROD_METRICS.find(m => m.key === "rvu").goal;
          const rvuPct = curRvu != null ? Math.round(curRvu / rvuGoal * 100) : null;
          const flagged = sum.good <= 1;
          const allGreen = sum.total > 0 && sum.good === sum.total;
          return { p, sum, dots, curRvu, rvuPct, flagged, allGreen };
        }).sort((a, b) => (a.sum.good / (a.sum.total || 1)) - (b.sum.good / (b.sum.total || 1)));

        // cohort wRVU stats
        const rvuRows = rows.filter(r => r.curRvu != null);
        const cohortAvgRvu = rvuRows.length ? Math.round(rvuRows.reduce((s, r) => s + r.curRvu, 0) / rvuRows.length) : null;
        const rvuGoal = PROD_METRICS.find(m => m.key === "rvu").goal;
        const atOrAboveRvu = rvuRows.filter(r => r.curRvu >= rvuGoal * 0.97).length;
        const flaggedCount = rows.filter(r => r.flagged).length;
        const onTrackCount = rows.filter(r => !r.flagged).length;

        return (
          <div onClick={() => setShowProdModal(false)}
            style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(10,15,30,0.55)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 40, paddingBottom: 40, overflowY: "auto" }}>
            <div onClick={e => e.stopPropagation()}
              style={{ background: "#f8f9fa", borderRadius: 18, width: "min(920px, 96vw)", boxShadow: "0 24px 80px rgba(0,0,0,0.22)", overflow: "hidden" }}>

              {/* Header */}
              <div style={{ background: "white", borderBottom: "1px solid #e9ecef", padding: "22px 28px 18px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>⚡ Epic Productivity · Cohort View</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f1b2d", lineHeight: 1.2 }}>Epic Productivity — Trending to Goal</div>
                  <div style={{ fontSize: 13, color: "#868e96", marginTop: 4 }}>Trajectory toward practice benchmarks, not absolute standing — a provider can be trending well while still building volume</div>
                </div>
                <button onClick={() => setShowProdModal(false)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 20, color: "#adb5bd", lineHeight: 1, padding: "2px 6px", borderRadius: 6 }}>✕</button>
              </div>

              {/* Headline stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, borderBottom: "1px solid #e9ecef", background: "white" }}>
                {[
                  { label: "Providers with data", value: rows.length, color: "#0f1b2d", sub: "in this cohort" },
                  { label: "Trending to Goal", value: onTrackCount, color: "#16a34a", sub: "≥2 metrics improving" },
                  { label: "Needs Attention", value: flaggedCount, color: flaggedCount > 0 ? "#dc2626" : "#16a34a", sub: flaggedCount > 0 ? "≤1 metric green" : "none flagged" },
                  cohortAvgRvu != null
                    ? { label: "Cohort Avg wRVU / wk", value: cohortAvgRvu, color: cohortAvgRvu >= rvuGoal * 0.97 ? "#16a34a" : cohortAvgRvu >= rvuGoal * 0.8 ? "#d97706" : "#dc2626", sub: `goal ${rvuGoal} · ${atOrAboveRvu}/${rvuRows.length} at goal` }
                    : { label: "wRVU Data", value: "—", color: "#adb5bd", sub: "not yet available" },
                ].map((s, i) => (
                  <div key={i} style={{ padding: "16px 22px", borderLeft: i > 0 ? "1px solid #f0f1f3" : "none" }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "#868e96", textTransform: "uppercase", letterSpacing: ".04em", marginTop: 5 }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: "#adb5bd", fontWeight: 600, marginTop: 3 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div style={{ padding: "16px 20px 24px" }}>
                {(() => {
                  const METRIC_COL_W = 52;
                  const METRIC_LABELS_DISPLAY = [["Pts/Day", null], ["wRVU/wk", null], ["Inbox", "Time"], ["Note", "Time"], ["Refill", "Time"]];
                  const colW = { avatar: 28, phase: 46, metrics: METRIC_COL_W * 5, rvu: 60, status: 68 };
                  return (
                    <>
                {/* Column headers */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, padding: "0 12px 10px", borderBottom: "2px solid #e9ecef", marginBottom: 4 }}>
                  <div style={{ width: colW.avatar, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 80, fontSize: 10, fontWeight: 700, color: "#868e96", textTransform: "uppercase", letterSpacing: ".05em" }}>Provider</div>
                  <div style={{ width: colW.phase, textAlign: "center", fontSize: 10, fontWeight: 700, color: "#868e96", textTransform: "uppercase", letterSpacing: ".04em", flexShrink: 0 }}>Phase</div>
                  <div style={{ width: colW.metrics, display: "flex", flexShrink: 0 }}>
                    {PROD_METRICS.map((m, i) => {
                      const [top, sub] = METRIC_LABELS_DISPLAY[i];
                      return (
                        <div key={m.key} style={{ width: METRIC_COL_W, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", whiteSpace: "nowrap", lineHeight: 1.3 }}>{top}</span>
                          {sub && <span style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", lineHeight: 1.3 }}>{sub}</span>}
                          <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, marginTop: 2 }}>goal {m.goal}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ width: colW.rvu, textAlign: "right", fontSize: 10, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: ".04em", flexShrink: 0 }}>wRVU/wk</div>
                  <div style={{ width: colW.status, textAlign: "right", fontSize: 10, fontWeight: 700, color: "#868e96", textTransform: "uppercase", letterSpacing: ".04em", flexShrink: 0 }}>Status</div>
                </div>

                {rows.length === 0 && (
                  <div style={{ textAlign: "center", padding: "32px 0", fontSize: 13, color: "#adb5bd" }}>
                    No Epic productivity data available yet for this cohort.
                  </div>
                )}

                {rows.map(({ p, sum, dots, curRvu, rvuPct, flagged, allGreen }) => {
                  const rowBg = flagged ? "#fff5f5" : "white";
                  const rowBorder = flagged ? "1px solid #fca5a5" : "1px solid #f0f1f3";
                  const statusColor = allGreen ? "#15803d" : flagged ? "#dc2626" : "#d97706";
                  const statusBg = allGreen ? "#dcfce7" : flagged ? "#fee2e2" : "#fef9c3";
                  const statusLabel = allGreen ? "At Goal" : flagged ? "Stalled" : "Improving";
                  const rvuColor = curRvu == null ? "#adb5bd" : curRvu >= rvuGoal * 0.97 ? "#15803d" : curRvu >= rvuGoal * 0.8 ? "#d97706" : "#dc2626";
                  return (
                    <div key={p.id}
                      onClick={() => { setShowProdModal(false); navigate({ selId: p.id, tab: "prod", phase: p.phase }); }}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", marginBottom: 5, borderRadius: 10, background: rowBg, border: rowBorder, cursor: "pointer" }}>
                      <div style={{ width: colW.avatar, flexShrink: 0 }}>{avatar(p.name, flagged)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: flagged ? "#b91c1c" : "#0f1b2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: "#868e96", marginTop: 1 }}>{p.role}</div>
                      </div>
                      <div style={{ width: colW.phase, flexShrink: 0, textAlign: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 5, background: "#eef2ff", color: "#4f46e5" }}>{p.phase}</span>
                      </div>
                      <div style={{ width: colW.metrics, display: "flex", alignItems: "center", flexShrink: 0 }}>
                        {dots.map(d => (
                          <div key={d.key} style={{ width: METRIC_COL_W, textAlign: "center" }}>
                            <span style={{ display: "inline-block", width: 13, height: 13, borderRadius: "50%", background: DOT_COLOR[d.color] || "#e9ecef", verticalAlign: "middle" }} />
                          </div>
                        ))}
                      </div>
                      <div style={{ width: colW.rvu, flexShrink: 0, textAlign: "right" }}>
                        {curRvu != null ? (
                          <span style={{ fontSize: 15, fontWeight: 800, color: rvuColor }}>{curRvu}</span>
                        ) : (
                          <span style={{ fontSize: 11, color: "#adb5bd" }}>—</span>
                        )}
                        {rvuPct != null && <div style={{ fontSize: 9, color: "#adb5bd", fontWeight: 600 }}>{rvuPct}% of goal</div>}
                      </div>
                      <div style={{ width: colW.status, flexShrink: 0, textAlign: "right" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "4px 8px", borderRadius: 6, background: statusBg, color: statusColor, whiteSpace: "nowrap" }}>{statusLabel}</span>
                        <div style={{ fontSize: 9, color: "#adb5bd", marginTop: 3, textAlign: "right" }}>{sum.good}/{sum.total} metrics</div>
                      </div>
                    </div>
                  );
                })}

                {/* Legend */}
                <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 12, borderTop: "1px solid #e9ecef", flexWrap: "wrap", alignItems: "center" }}>
                  {[["#22c55e","On track / Near goal"],["#eab308","Variable"],["#ef4444","Falling behind"]].map(([c,l]) => (
                    <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: "#868e96", fontWeight: 600 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block", flexShrink: 0 }} />{l}
                    </span>
                  ))}
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "#adb5bd", fontStyle: "italic" }}>
                    Click any row to open that provider's productivity detail
                  </span>
                </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── C.I.I. Cohort Modal ── */}
      {showCiiModal && (() => {
        const BAND_STYLE = {
          thriving:   { bg: "#dcfce7", fg: "#15803d", label: "Thriving" },
          developing: { bg: "#fef9c3", fg: "#854d0e", label: "Developing" },
          atrisk:     { bg: "#fee2e2", fg: "#b91c1c", label: "At Risk" },
          sched:      { bg: "#f1f3f5", fg: "#868e96", label: "Sched'd" },
        };
        const TREND_LABEL = { up: "↑ Improving", down: "↓ Declining", flat: "→ Stable", none: "—" };
        const TREND_COLOR = { up: "#16a34a", down: "#dc2626", flat: "#6b7280", none: "#adb5bd" };

        const rows = PROVS.map(p => {
          const cs = cultureScore(qa, p.id, isAPC(p));
          const band = cultureBand(cs.avg);
          const tr = cultureTrend(qa, p.id, isAPC(p));
          const overdue = cs.avg === null && getStatus(p.id) !== "ok";
          return { p, cs, band, tr, overdue };
        }).sort((a, b) => {
          const order = { atrisk: 0, developing: 1, sched: 2, thriving: 3 };
          if (a.overdue && !b.overdue) return -1;
          if (!a.overdue && b.overdue) return 1;
          const oa = order[a.band.key] ?? 2, ob = order[b.band.key] ?? 2;
          if (oa !== ob) return oa - ob;
          return (a.cs.avg ?? 999) - (b.cs.avg ?? 999);
        });

        const withScores = rows.filter(r => r.cs.avg !== null);
        const cohortAvg = withScores.length ? (withScores.reduce((s, r) => s + r.cs.avg, 0) / withScores.length).toFixed(1) : null;
        const overdueCount = rows.filter(r => r.overdue).length;
        const atRiskCount = rows.filter(r => r.band.key === "atrisk").length;
        const thrivingCount = rows.filter(r => r.band.key === "thriving").length;

        return (
          <div onClick={() => setShowCiiModal(false)}
            style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(10,15,30,0.55)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 40, paddingBottom: 40, overflowY: "auto" }}>
            <div onClick={e => e.stopPropagation()}
              style={{ background: "#f8f9fa", borderRadius: 18, width: "min(780px, 94vw)", boxShadow: "0 24px 80px rgba(0,0,0,0.22)", overflow: "hidden" }}>

              {/* Header */}
              <div style={{ background: "white", borderBottom: "1px solid #e9ecef", padding: "22px 28px 18px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>🌡️ Culture Integration Index · Cohort View</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f1b2d", lineHeight: 1.2 }}>C.I.I. — All Providers</div>
                  <div style={{ fontSize: 13, color: "#868e96", marginTop: 4 }}>Sorted At Risk first — click any row to open that provider's Culture tab</div>
                </div>
                <button onClick={() => setShowCiiModal(false)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 20, color: "#adb5bd", lineHeight: 1, padding: "2px 6px", borderRadius: 6 }}>✕</button>
              </div>

              {/* Headline stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, borderBottom: "1px solid #e9ecef", background: "white" }}>
                {[
                  { label: "Cohort Avg Score", value: cohortAvg ? cohortAvg + " / 10" : "—", color: cohortAvg >= 7 ? "#16a34a" : cohortAvg >= 5 ? "#d97706" : "#dc2626", sub: withScores.length + " providers with data" },
                  { label: "Thriving", value: thrivingCount, color: "#15803d", sub: "score ≥ 7.5" },
                  { label: "At Risk", value: atRiskCount, color: atRiskCount > 0 ? "#dc2626" : "#16a34a", sub: atRiskCount > 0 ? "needs direct outreach" : "none at risk" },
                  { label: "Overdue Checkpoints", value: overdueCount, color: overdueCount > 0 ? "#d97706" : "#16a34a", sub: overdueCount > 0 ? "C.I.I. not yet collected" : "all checkpoints current" },
                ].map((s, i) => (
                  <div key={i} style={{ padding: "16px 22px", borderLeft: i > 0 ? "1px solid #f0f1f3" : "none" }}>
                    <div style={{ fontSize: i === 0 ? 22 : 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "#868e96", textTransform: "uppercase", letterSpacing: ".04em", marginTop: 5 }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: "#adb5bd", fontWeight: 600, marginTop: 3 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div style={{ padding: "16px 20px 24px" }}>
                {/* Column headers */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px 8px", borderBottom: "2px solid #e9ecef", marginBottom: 4 }}>
                  <div style={{ width: 32, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 9.5, fontWeight: 700, color: "#868e96", textTransform: "uppercase", letterSpacing: ".05em" }}>Provider</div>
                  <div style={{ width: 56, textAlign: "center", fontSize: 9.5, fontWeight: 700, color: "#868e96", textTransform: "uppercase", letterSpacing: ".04em", flexShrink: 0 }}>Phase</div>
                  <div style={{ width: 80, textAlign: "center", fontSize: 9.5, fontWeight: 700, color: "#868e96", textTransform: "uppercase", letterSpacing: ".04em", flexShrink: 0 }}>Score</div>
                  <div style={{ width: 100, textAlign: "center", fontSize: 9.5, fontWeight: 700, color: "#868e96", textTransform: "uppercase", letterSpacing: ".04em", flexShrink: 0 }}>Trend</div>
                  <div style={{ width: 90, textAlign: "right", fontSize: 9.5, fontWeight: 700, color: "#868e96", textTransform: "uppercase", letterSpacing: ".04em", flexShrink: 0 }}>Band</div>
                </div>

                {rows.map(({ p, cs, band, tr, overdue }) => {
                  const bs = BAND_STYLE[band.key] || BAND_STYLE.sched;
                  const rowBg = band.key === "atrisk" || overdue ? "#fff5f5" : "white";
                  const rowBorder = band.key === "atrisk" || overdue ? "1px solid #fca5a5" : "1px solid #f0f1f3";
                  const trendKey = tr.dir === "up" ? "up" : tr.dir === "down" ? "down" : cs.avg !== null ? "flat" : "none";
                  return (
                    <div key={p.id}
                      onClick={() => { setShowCiiModal(false); navigate({ selId: p.id, tab: "culture", phase: p.phase }); }}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", marginBottom: 5, borderRadius: 10, background: rowBg, border: rowBorder, cursor: "pointer" }}>
                      <div style={{ width: 32, flexShrink: 0 }}>{avatar(p.name, band.key === "atrisk" || overdue)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: band.key === "atrisk" || overdue ? "#b91c1c" : "#0f1b2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: "#868e96", marginTop: 1 }}>{p.role}</div>
                      </div>
                      <div style={{ width: 56, flexShrink: 0, textAlign: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 5, background: "#eef2ff", color: "#4f46e5" }}>{p.phase}</span>
                      </div>
                      <div style={{ width: 80, flexShrink: 0, textAlign: "center" }}>
                        {cs.avg !== null
                          ? <span style={{ fontSize: 16, fontWeight: 800, color: bs.fg }}>{cs.avg.toFixed(1)}<span style={{ fontSize: 10, fontWeight: 600, color: "#adb5bd" }}> /10</span></span>
                          : <span style={{ fontSize: 11, color: overdue ? "#d97706" : "#adb5bd", fontWeight: overdue ? 700 : 400 }}>{overdue ? "Overdue" : "Pending"}</span>
                        }
                      </div>
                      <div style={{ width: 100, flexShrink: 0, textAlign: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: TREND_COLOR[trendKey] }}>{TREND_LABEL[trendKey]}</span>
                        {tr.delta != null && Math.abs(tr.delta) >= 0.2 && (
                          <div style={{ fontSize: 9, color: "#adb5bd", marginTop: 1 }}>{(tr.delta > 0 ? "+" : "") + tr.delta.toFixed(1)} since last</div>
                        )}
                      </div>
                      <div style={{ width: 90, flexShrink: 0, textAlign: "right" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "4px 9px", borderRadius: 6, background: bs.bg, color: bs.fg, whiteSpace: "nowrap" }}>{bs.label}</span>
                      </div>
                    </div>
                  );
                })}

                <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 12, borderTop: "1px solid #e9ecef", flexWrap: "wrap", alignItems: "center" }}>
                  {Object.entries(BAND_STYLE).map(([, s]) => (
                    <span key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: "#868e96", fontWeight: 600 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.fg, display: "inline-block", flexShrink: 0 }} />{s.label}
                    </span>
                  ))}
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "#adb5bd", fontStyle: "italic" }}>
                    Checkpoints at m3 · m6 · m9 · m12 (extended to m24 for APC)
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Confirm Remove Provider modal */}
      {confirmRemove && (
        <div onClick={() => setConfirmRemove(null)}
          style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "white", borderRadius: 14, padding: "28px 32px", maxWidth: 380, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f1b2d", marginBottom: 8 }}>Remove provider?</div>
            <div style={{ fontSize: 14, color: "#868e96", marginBottom: 20 }}>
              {(provs.find(x => x.id === confirmRemove) || {}).name || "This provider"} will be removed along with all their check data, scores, and notes.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => {
                setProvs(prev => prev.filter(x => x.id !== confirmRemove));
                if (selId === confirmRemove) setSelId(null);
                setConfirmRemove(null);
              }} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#ef4444", color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                Remove
              </button>
              <button onClick={() => setConfirmRemove(null)}
                style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #dee2e6", background: "white", cursor: "pointer", fontSize: 14 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reset modal */}
      {confirmReset && (
        <div onClick={() => setConfirmReset(false)}
          style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "white", borderRadius: 14, padding: "28px 32px", maxWidth: 400, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f1b2d", marginBottom: 6 }}>Reset session data</div>
            <div style={{ fontSize: 13, color: "#868e96", marginBottom: 20 }}>Choose what to reset:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <button onClick={() => {
                setChecks(makeSeedChecks()); setQa(makeSeedQA()); setNotes({}); setMeetings({});
                setConfirmReset(false);
              }} style={{ padding: "14px 16px", borderRadius: 10, border: "1px solid #dee2e6", background: "#f8f9fb", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f1b2d" }}>Clear checks, scores &amp; notes</div>
                <div style={{ fontSize: 12, color: "#868e96", marginTop: 3 }}>Keep your provider list · reset all checkoffs, questionnaire answers, notes, and meeting logs to seed data</div>
              </button>
              <button onClick={() => {
                setProvs(SEED_PROVS); setChecks(makeSeedChecks()); setQa(makeSeedQA()); setNotes({}); setMeetings({});
                if (selId && !SEED_PROVS.find(x => x.id === selId)) setSelId(null);
                setConfirmReset(false);
              }} style={{ padding: "14px 16px", borderRadius: 10, border: "1px solid #dee2e6", background: "#f8f9fb", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f1b2d" }}>Reset everything</div>
                <div style={{ fontSize: 12, color: "#868e96", marginTop: 3 }}>Restore original 5 providers and clear all data</div>
              </button>
            </div>
            <button onClick={() => setConfirmReset(false)}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #dee2e6", background: "none", cursor: "pointer", color: "#868e96", fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Provider modal */}
      {addProvModal && (
        <div onClick={() => setAddProvModal(false)}
          style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "white", borderRadius: 14, padding: "28px 32px", maxWidth: 420, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f1b2d", marginBottom: 20 }}>Add Provider</div>
            {[
              { label: "Full name", field: "name", type: "text", placeholder: "Dr. Smith" },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 5, textTransform: "uppercase" }}>{label}</div>
                <input type={type} value={addProvForm[field]} placeholder={placeholder}
                  onChange={e => setAddProvForm(prev => ({ ...prev, [field]: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #dee2e6", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 5, textTransform: "uppercase" }}>Role</div>
                <select value={addProvForm.role} onChange={e => setAddProvForm(prev => ({ ...prev, role: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #dee2e6", fontSize: 14, outline: "none", background: "white", fontFamily: "inherit" }}>
                  <option value="MD">MD</option>
                  <option value="DO">DO</option>
                  <option value="NP">NP</option>
                  <option value="PA">PA</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 5, textTransform: "uppercase" }}>Mentor</div>
                <select value={addProvForm.mentor} onChange={e => setAddProvForm(prev => ({ ...prev, mentor: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #dee2e6", fontSize: 14, outline: "none", background: "white", fontFamily: "inherit" }}>
                  {USERS.filter(u => u.role === "mentor").map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 5, textTransform: "uppercase" }}>Starting Phase</div>
                <select value={addProvForm.phase} onChange={e => setAddProvForm(prev => ({ ...prev, phase: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #dee2e6", fontSize: 14, outline: "none", background: "white", fontFamily: "inherit" }}>
                  {(["NP","PA"].includes(addProvForm.role) ? MP : MP_PHYS).map(ph => (
                    <option key={ph.id} value={ph.id}>{ph.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 5, textTransform: "uppercase" }}>Days in Practice</div>
                <input type="number" min="0" value={addProvForm.days}
                  onChange={e => setAddProvForm(prev => ({ ...prev, days: parseInt(e.target.value, 10) || 0 }))}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #dee2e6", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                disabled={!addProvForm.name.trim()}
                onClick={() => {
                  if (!addProvForm.name.trim()) return;
                  const newProv = { id: "p" + Date.now(), name: addProvForm.name.trim(), role: addProvForm.role, mentor: addProvForm.mentor, phase: addProvForm.phase, days: addProvForm.days };
                  setProvs(prev => [...prev, newProv]);
                  setAddProvModal(false);
                }}
                style={{ flex: 1, padding: "11px", borderRadius: 8, border: "none", background: addProvForm.name.trim() ? "#028090" : "#dee2e6", color: "white", cursor: addProvForm.name.trim() ? "pointer" : "default", fontWeight: 700, fontSize: 14 }}>
                Add Provider
              </button>
              <button onClick={() => setAddProvModal(false)}
                style={{ flex: 1, padding: "11px", borderRadius: 8, border: "1px solid #dee2e6", background: "white", cursor: "pointer", fontSize: 14 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

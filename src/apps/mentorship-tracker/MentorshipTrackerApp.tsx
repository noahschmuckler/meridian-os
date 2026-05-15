// @ts-nocheck
import { useState } from "react";
import masterChecklist from "../../data/seed/mentorship-master-checklist.json";
import { focusEpicReferenceEntry } from "../../data/epicReferenceFocus";
import { setLauncherApp } from "../../data/launcherState";

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

/* ─── Phase Data (same as v3) ─── */
const MP = [
  {id:"w1",label:"Week 1",items:["Checked in on first-day experience","Confirmed Epic login and EHR access","Reviewed clinic layout and team intros","Discussed schedule and ramp-up expectations","Answered workflow or logistics questions"]},
  {id:"w2",label:"Week 2",items:["Checked in on EHR comfort level","Reviewed SmartPhrase or order set progress","Observed at least one patient encounter","Discussed In Basket management setup","Answered workflow or clinical questions"]},
  {id:"w3",label:"Week 3",items:["Reviewed order sets and preference lists","Discussed care gap identification","Reviewed Problem List management","Observed documentation quality","Addressed emerging concerns"]},
  {id:"w4",label:"Week 4",items:["End-of-month progress discussion","Reviewed volume and readiness to ramp","Assessed EHR efficiency","Discussed schedule adjustments","Prepared for Medical Director review"]},
  {id:"w5",label:"Week 5",items:["Volume ramp-up comfort check","Reviewed referral and order routing","Discussed BPA navigation","Observed encounter closing and billing","Answered clinical questions"]},
  {id:"w6",label:"Week 6",items:["Reviewed MyChart response quality","Discussed medication reconciliation","Assessed care gap closure consistency","Reviewed workspace personalization","Addressed emerging concerns"]},
  {id:"w7",label:"Week 7",items:["Assessed independence readiness","Reviewed quality metrics together","Discussed billable encounter types","Observed complex patient management","Answered remaining questions"]},
  {id:"w8",label:"Week 8",items:["End-of-weekly-phase assessment","Reviewed overall EHR proficiency","Assessed readiness for monthly cadence","Discussed ongoing learning goals","Prepared for Medical Director review"]},
  {id:"m3",label:"Month 3",items:["Volume vs target review","Care gap and Problem List assessment","Referral routing accuracy","Billing/coding proficiency","Semi-independent readiness"]},
  {id:"m4",label:"Month 4",items:["Optimization check-in","EHR efficiency review","Complex case discussion","Workload sustainability","Emerging issues addressed"]},
  {id:"m5",label:"Month 5",items:["Full capacity assessment","Burnout and wellbeing check","Quality and care gap rates","Professional development goals","Month 6 review readiness"]},
  {id:"m6",label:"Month 6",items:["6-month milestone assessment","Full capacity confirmation","Quality dashboard review","Quarterly transition plan","Medical Director summary prep"]},
  {id:"q3",label:"Month 9",items:["Continued development and CE planning","Professional goals check-in","Quality and satisfaction review","Emerging support needs"]},
  {id:"q4",label:"Month 12",items:["Annual comprehensive review","Full performance assessment","Mentorship transition planning","Year 2 development plan"]},
];

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
  {id:"w1",label:"Week 1",qs:[{qid:"a",text:"How comfortable navigating the clinic?",ty:"s"},{qid:"b",text:"How supported by your team?",ty:"s"},{qid:"c",text:"Confident with Epic basics?",ty:"s"},{qid:"d",text:"What has gone well?",ty:"t"},{qid:"e",text:"What could we improve?",ty:"t"}]},
  {id:"w2",label:"Week 2",qs:[{qid:"a",text:"Comfortable with documentation?",ty:"s"},{qid:"b",text:"Understand In Basket workflow?",ty:"s"},{qid:"c",text:"Supported by your mentor?",ty:"s"},{qid:"d",text:"Current challenges?",ty:"t"}]},
  {id:"w3",label:"Week 3",qs:[{qid:"a",text:"Confident managing order sets?",ty:"s"},{qid:"b",text:"Comfortable with care gap ID?",ty:"s"},{qid:"c",text:"Overall onboarding experience?",ty:"s"},{qid:"d",text:"Anything you need?",ty:"t"}]},
  {id:"w4",label:"Week 4",qs:[{qid:"a",text:"Ready to increase volume?",ty:"s"},{qid:"b",text:"Efficient with documentation?",ty:"s"},{qid:"c",text:"Connected to team?",ty:"s"},{qid:"d",text:"Biggest difference needed?",ty:"t"},{qid:"e",text:"Concerns?",ty:"t"}]},
  {id:"w5",label:"Week 5",qs:[{qid:"a",text:"Comfortable with current volume?",ty:"s"},{qid:"b",text:"Confident with referrals?",ty:"s"},{qid:"c",text:"Managing In Basket end of day?",ty:"s"},{qid:"d",text:"What is working well?",ty:"t"}]},
  {id:"w6",label:"Week 6",qs:[{qid:"a",text:"Confident with MyChart messaging?",ty:"s"},{qid:"b",text:"Comfortable with med reconciliation?",ty:"s"},{qid:"c",text:"Work-life balance?",ty:"s"},{qid:"d",text:"Workflow changes needed?",ty:"t"}]},
  {id:"w7",label:"Week 7",qs:[{qid:"a",text:"Ready for independence?",ty:"s"},{qid:"b",text:"Comfortable with complex patients?",ty:"s"},{qid:"c",text:"Satisfied with onboarding?",ty:"s"},{qid:"d",text:"Advice for next provider?",ty:"t"}]},
  {id:"w8",label:"Week 8",qs:[{qid:"a",text:"Overall Epic proficiency?",ty:"s"},{qid:"b",text:"Ready for monthly check-ins?",ty:"s"},{qid:"c",text:"Supported by leadership?",ty:"s"},{qid:"d",text:"Goals for next 3 months?",ty:"t"}]},
  {id:"m3",label:"Month 3",qs:[{qid:"a",text:"Confident with full panel?",ty:"s"},{qid:"b",text:"Integrated into team?",ty:"s"},{qid:"c",text:"Quality metrics?",ty:"s"},{qid:"d",text:"Support still needed?",ty:"t"},{qid:"ci1",text:"Do you feel like a valued member of the team?",ty:"s",culture:true},{qid:"ci2",text:"Do you have at least one colleague you would consider a friend or close ally here?",ty:"s",culture:true},{qid:"ci3",text:"Do you feel comfortable asking for help when you need it?",ty:"s",culture:true},{qid:"ci4",text:"Would you recommend this organization to a colleague considering a similar role?",ty:"s",culture:true}]},
  {id:"m6",label:"Month 6",qs:[{qid:"a",text:"Confident at full capacity?",ty:"s"},{qid:"b",text:"Satisfied with role?",ty:"s"},{qid:"c",text:"Rate onboarding?",ty:"s"},{qid:"d",text:"Most valuable part?",ty:"t"},{qid:"ci1",text:"Do you feel like a valued member of the team?",ty:"s",culture:true},{qid:"ci2",text:"Do you have at least one colleague you would consider a friend or close ally here?",ty:"s",culture:true},{qid:"ci3",text:"Do you feel comfortable asking for help when you need it?",ty:"s",culture:true},{qid:"ci4",text:"Would you recommend this organization to a colleague considering a similar role?",ty:"s",culture:true}]},
  {id:"q3",label:"Month 9",qs:[{qid:"a",text:"Satisfied in current role?",ty:"s"},{qid:"b",text:"Organization supports growth?",ty:"s"},{qid:"c",text:"Development needs?",ty:"t"}]},
  {id:"q4",label:"Month 12",qs:[{qid:"a",text:"Rate your first year?",ty:"s"},{qid:"b",text:"Likely to stay long-term?",ty:"s"},{qid:"c",text:"Best part of year one?",ty:"t"},{qid:"ci1",text:"Do you feel like a valued member of the team?",ty:"s",culture:true},{qid:"ci2",text:"Do you have at least one colleague you would consider a friend or close ally here?",ty:"s",culture:true},{qid:"ci3",text:"Do you feel comfortable asking for help when you need it?",ty:"s",culture:true},{qid:"ci4",text:"Would you recommend this organization to a colleague considering a similar role?",ty:"s",culture:true}]},
];

const QP_TO_OM = {w1:"om1",w2:"om1",w3:"om1",w4:"om1",w5:"om2",w6:"om2",w7:"om2",w8:"om2",m3:"om3",m6:"om6",q3:"om9",q4:"om12"};
const USERS = [{id:"md1",name:"Dr. Rivera",role:"director"},{id:"mt1",name:"Dr. Smith",role:"mentor"},{id:"mt2",name:"Dr. Lee",role:"mentor"}];
const PROVS = [
  {id:"p1",name:"Dr. Johnson",role:"MD",mentor:"mt1",phase:"m4",days:110},
  {id:"p2",name:"Dr. Patel",role:"DO",mentor:"mt1",phase:"m3",days:87},
  {id:"p3",name:"Dr. Williams",role:"MD",mentor:"mt2",phase:"w7",days:52},
  {id:"p4",name:"Dr. Garcia",role:"DO",mentor:"mt2",phase:"w5",days:38},
];

/* ─── Seed Data ─── */
function makeSeedChecks() {
  const c = {};
  const fill = (pid, ids) => {
    ids.forEach(phid => {
      const ph = MP.find(x => x.id === phid);
      if (ph) ph.items.forEach((_, i) => { c[pid + "." + phid + "." + i] = true; });
    });
  };
  fill("p1", ["w1","w2","w3","w4","w5","w6","w7","w8","m3"]);
  fill("p2", ["w1","w2","w3","w4","w5","w6","w7","w8"]);
  fill("p3", ["w1","w2","w3","w4","w5","w6"]);
  fill("p4", ["w1","w2","w3","w4"]);
  return c;
}

function makeSeedQA() {
  const qa = {};
  const scores = {p1:{w1:5,w2:6,w3:7,w4:7,w5:4,w6:7,w7:8,w8:8,m3:9},p2:{w1:6,w2:6,w3:7,w4:7,w5:4,w6:7,w7:7,w8:8},p3:{w1:5,w2:6,w3:6,w4:7,w5:5,w6:7},p4:{w1:5,w2:6,w3:6,w4:7,w5:5}};
  Object.entries(scores).forEach(([pid, phases]) => {
    Object.entries(phases).forEach(([phid, avg]) => {
      const qp = QP.find(x => x.id === phid);
      if (qp) qp.qs.forEach(q => { qa[pid + "." + phid + "." + q.qid] = q.ty === "s" ? String(avg) : "Demo response"; });
    });
  });
  const omScores = {p1:{om1:7,om2:8,om3:9},p2:{om1:6,om2:7},p3:{om1:5}};
  Object.entries(omScores).forEach(([pid, phases]) => {
    Object.entries(phases).forEach(([phid, avg]) => {
      const op = OP.find(x => x.id === phid);
      if (op) op.qs.forEach(q => {
        qa[pid + "." + phid + "." + q.qid] = q.ty === "s" ? String(avg) : "Seems to be adjusting well. Mentioned Epic is taking some getting used to but overall positive.";
      });
    });
  });
  return qa;
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

function mentorPct(checks, pid) {
  const prov = PROVS.find(x => x.id === pid);
  const max = phIdx(prov.phase);
  let t = 0, d = 0;
  MP.forEach((ph, i) => { if (i > max) return; ph.items.forEach((_, j) => { t++; if (checks[pid + "." + ph.id + "." + j]) d++; }); });
  return t > 0 ? Math.round(d / t * 100) : 0;
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
const CULTURE_PHASES = ["m3", "m6", "q4"];
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
function cultureScore(qa, pid) {
  let sum = 0, cnt = 0;
  CULTURE_PHASES.forEach(function(phid) {
    CULTURE_QIDS.forEach(function(qid) {
      const v = qa[pid + "." + phid + "." + qid];
      if (v !== undefined && v !== "") { sum += Number(v); cnt++; }
    });
  });
  if (cnt === 0) return { avg: null, pct: 0, display: "—" };
  const avg = sum / cnt;
  return { avg: avg, pct: Math.round(avg * 10), display: avg.toFixed(1) };
}

/* NEW: Overdue status based on days */
function getStatus(pid) {
  const prov = PROVS.find(x => x.id === pid);
  const ci = phIdx(prov.phase);
  const d = prov.days;
  let expected = 0;
  if (d >= 270) expected = 13; else if (d >= 180) expected = 11;
  else if (d >= 150) expected = 10; else if (d >= 120) expected = 9;
  else if (d >= 90) expected = 8; else if (d >= 56) expected = 7;
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

/* NEW: Journey timeline */
function Timeline({ currentIdx }) {
  return (
    <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", padding: "14px 20px", marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 10 }}>ONBOARDING JOURNEY</div>
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {MP.map((ph, i) => {
          const done = i < currentIdx;
          const isCur = i === currentIdx;
          const c = done ? "#22c55e" : isCur ? "#028090" : "#e9ecef";
          return (
            <div key={ph.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "100%", height: 6, background: c, borderRadius: i === 0 ? "3px 0 0 3px" : i === MP.length - 1 ? "0 3px 3px 0" : 0 }} />
              <div style={{ width: isCur ? 12 : 6, height: isCur ? 12 : 6, borderRadius: "50%", background: c, marginTop: 4, border: isCur ? "2px solid #028090" : "none", boxShadow: isCur ? "0 0 0 3px rgba(2,128,144,0.2)" : "none" }} />
              <div style={{ fontSize: 7, color: done ? "#22c55e" : isCur ? "#028090" : "#adb5bd", marginTop: 2, fontWeight: isCur ? 700 : 400 }}>
                {ph.label.replace("Week ", "W").replace("Month ", "M")}
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
  let mpTotal = 0, mpDone = 0;
  MP.forEach(ph => ph.items.forEach((_, i) => {
    mpTotal++;
    if (prov && checks[prov.id + "." + ph.id + "." + i]) mpDone++;
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
      key: "mp",
      title: "Mentor Check-Ins",
      subtitle: `${mpTotal} prompts, Week 1 → Month 12`,
      gradient: "linear-gradient(135deg, #028090, #014a52)",
      accent: "#028090",
      done: mpDone,
      total: mpTotal,
      groups: MP.map(ph => ({ phase: ph, items: ph.items })),
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
              Medical Director Curriculum + Mentor Check-Ins + Office Manager.
              {prov ? ` · ${prov.name}: ${mdDone}/${mdItems.length} Medical Director · ${mpDone}/${mpTotal} mentor · ${opDone}/${opTotal} ops` : ""}
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
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 22px", borderTop: "1px solid #dee2e6", background: "#f8f9fb", fontSize: 11, color: "#868e96", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          <span>Medical Director ⚠ misstep-risk items: 12 / 19 / 43 / 48 / 56 — keep verbatim when teaching.</span>
          <span>Medical Director source: Master Checklist · Mentor + Ops: Mentorship Tracker phases</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [uid, setUid] = useState(null);
  const [selId, setSelId] = useState(null);
  const [tab, setTab] = useState("mentor");
  const [phase, setPhase] = useState(null);
  const [checks, setChecks] = useState(makeSeedChecks);
  const [qa, setQa] = useState(makeSeedQA);
  const [noteIn, setNoteIn] = useState("");
  const [notes, setNotes] = useState({});
  const [mainTab, setMainTab] = useState("roster");
  const [mdViewAll, setMdViewAll] = useState(false);
  const [dueMenu, setDueMenu] = useState(null);
  const [expandedAlerts, setExpandedAlerts] = useState({});

  const user = USERS.find(u => u.id === uid);
  const isDir = user && user.role === "director";
  const isMen = user && user.role === "mentor";
  const myProvs = user ? (isDir ? PROVS : PROVS.filter(p => p.mentor === uid)) : [];
  const patterns = detectPatterns(qa);

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
  if (!uid) {
    return (
      <div style={{ background: "#f1f3f5", minHeight: "100vh", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>👥</div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#0f1b2d" }}>Mentorship Tracker</h1>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "#868e96" }}>Provider onboarding follow-ups</p>
          </div>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #dee2e6", padding: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#868e96", marginBottom: 14, textTransform: "uppercase" }}>Log in as:</div>
            {USERS.map(u => {
              const c = u.role === "director" ? "#8b5cf6" : "#028090";
              const rl = u.role === "director" ? "Medical Director" : "Mentor";
              return (
                <div key={u.id} onClick={() => { setUid(u.id); setSelId(null); setTab("mentor"); setPhase(null); setMainTab("roster"); }}
                  style={{ padding: "16px 18px", borderRadius: 10, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, background: "#f8f9fb", border: "2px solid #dee2e6" }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: 13, color: "#868e96" }}>{rl}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 16, background: c + "20", color: c }}>{rl}</span>
                </div>
              );
            })}
          </div>
        </div>
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
  const phaseList = isOps ? OP : isQ ? QP : isMd ? MD_PHASES : MP;
  const curOpQuest = isOps && phase ? OP.find(x => x.id === phase) : null;
  const curChecklist = phase && !isQ && !isMd && !isOps ? MP.find(x => x.id === phase) : null;
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

      {/* Top bar */}
      <div style={{ background: "#0f1b2d", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>Mentorship Tracker</div>
          <div style={{ fontSize: 12, color: "#868e96" }}>{user.name} — {isDir ? "Medical Director" : "Mentor"}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {isDir && patterns.length > 0 && (
            <div style={{ padding: "5px 12px", borderRadius: 8, background: "#eab308", color: "#78350f", fontSize: 11, fontWeight: 700 }}>
              {"📊 " + patterns.length + " Pattern Alert" + (patterns.length !== 1 ? "s" : "")}
            </div>
          )}
          {isDir && (
            <button onClick={() => setMdViewAll(true)}
              style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(139,92,246,0.18)", color: "#e9d5ff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
              📋 View All Curriculum
            </button>
          )}
          <button onClick={() => { setUid(null); setSelId(null); }}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.12)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Log Out
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
      {isDir && !selId && (
        <div style={{ background: "white", borderBottom: "1px solid #dee2e6", padding: "0 24px" }}>
          {[{ k: "roster", l: "Provider Roster" }, { k: "compare", l: "Comparison Grid" }, { k: "trends", l: "Score Trends" }, { k: "notes", l: "Recent Notes" }].map(t => (
            <button key={t.k} onClick={() => setMainTab(t.k)}
              style={{ padding: "12px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: mainTab === t.k ? 700 : 400, color: mainTab === t.k ? "#0f1b2d" : "#868e96", borderBottom: mainTab === t.k ? "3px solid #028090" : "3px solid transparent" }}>
              {t.l}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ─── SIDEBAR ─── */}
        <div style={{ width: 330, background: "white", borderRight: "1px solid #dee2e6", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "16px 16px 8px" }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>{isDir ? "All Providers" : "My Mentees"}</h2>
          </div>
          {myProvs.map(p => {
            const m = USERS.find(u => u.id === p.mentor);
            const isSel = selId === p.id;
            const mn = mentorPct(checks, p.id);
            const md = isDir ? mdCurriculumPct(checks, p.id) : 0;
            const op = isDir ? opsPct(qa, p.id) : 0;
            const qp = isDir ? questPct(qa, p.id) : 0;
            const st = getStatus(p.id);
            const sc = st === "overdue" ? "#ef4444" : st === "due" ? "#eab308" : mn >= 70 ? "#22c55e" : "#eab308";
            const phLabel = (MP.find(x => x.id === p.phase) || {}).label || "";

            return (
              <div key={p.id}
                onClick={() => { setSelId(p.id); setTab("mentor"); setPhase(p.phase); }}
                style={{ padding: "14px 16px", cursor: "pointer", borderLeft: isSel ? "4px solid #028090" : "4px solid transparent", background: isSel ? "rgba(2,128,144,0.05)" : "transparent", borderBottom: "1px solid #dee2e6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: sc, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</span>
                      {st === "overdue" && <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 6, background: "#fef2f2", color: "#ef4444" }}>OVERDUE</span>}
                      {st === "due" && <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 6, background: "#fefce8", color: "#92400e" }}>DUE</span>}
                    </div>
                    <div style={{ fontSize: 10, color: "#868e96" }}>{p.role} — {phLabel} — Day {p.days}</div>
                  </div>
                </div>
                {isDir ? (
                  <div>
                    <Bar label="Medical Director Curriculum" pct={md} color="#8b5cf6" />
                    <Bar label="Mentor" pct={mn} color="#028090" />
                    <Bar label="Ops" pct={op} color="#0ea5e9" />
                    <Bar label="Questionnaires" pct={qp} color="#eab308" />
                  </div>
                ) : (
                  <Bar label="Checklist" pct={mn} color={sc} />
                )}
                <div style={{ fontSize: 9, color: "#868e96", marginTop: 3 }}>Mentor: {m ? m.name : ""}</div>
              </div>
            );
          })}
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
                                <g key={ph.id}>
                                  {avg !== null && (
                                    <>
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
                                <g key={ph.id}>
                                  {avg !== null && (
                                    <>
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
                </div>

                {/* Culture Integration Trend */}
                <div style={{ background: "white", borderRadius: 10, border: "1px solid #fce7f3", overflow: "hidden", marginBottom: 16 }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #fce7f3", background: "#fdf2f8" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#9d174d" }}>Culture Integration Trend</div>
                    <div style={{ fontSize: 12, color: "#be185d", marginTop: 3 }}>Avg of 4 culture questions per phase &nbsp;·&nbsp; <span style={{ color: "#22c55e", fontWeight: 700 }}>● ≥7 thriving</span> &nbsp;<span style={{ color: "#ec4899", fontWeight: 700 }}>● 5–6 watch</span> &nbsp;<span style={{ color: "#ef4444", fontWeight: 700 }}>● &lt;5 at risk</span></div>
                  </div>
                  {PROVS.map(function(p) {
                    const scores = CULTURE_PHASES.map(function(phid, i) {
                      return { label: phid === "m3" ? "Month 3" : phid === "m6" ? "Month 6" : "Month 12", avg: culturePhaseScore(qa, p.id, phid), i: i };
                    });
                    const answered = scores.filter(function(x) { return x.avg !== null; });
                    const W = 480, H = 120;
                    const PL = 32, PR = 16, PT = 20, PB = 24;
                    const cw = W - PL - PR, ch = H - PT - PB;
                    const xOf = function(i) { return PL + (CULTURE_PHASES.length > 1 ? (i / (CULTURE_PHASES.length - 1)) : 0.5) * cw; };
                    const yOf = function(v) { return PT + (1 - v / 10) * ch; };
                    const polyPts = answered.map(function(x) { return xOf(x.i) + "," + yOf(x.avg); }).join(" ");
                    const cs = cultureScore(qa, p.id);
                    const summaryColor = cs.avg === null ? "#adb5bd" : cs.avg >= 7 ? "#22c55e" : cs.avg >= 5 ? "#ec4899" : "#ef4444";
                    return (
                      <div key={p.id} style={{ padding: "12px 20px", borderBottom: "1px solid #fce7f3" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f1b2d" }}>{p.name}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: summaryColor }}>{cs.display !== "—" ? cs.display + " / 10" : "No data yet"}</div>
                        </div>
                        <div style={{ overflowX: "auto" }}>
                          <svg viewBox={"0 0 " + W + " " + H} width="100%" style={{ display: "block" }}>
                            {[0, 5, 10].map(function(v) {
                              const y = yOf(v);
                              return (
                                <g key={v}>
                                  <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#fce7f3" strokeWidth={1} />
                                  <text x={PL - 4} y={y + 4} textAnchor="end" fontSize={8} fill="#be185d">{v}</text>
                                </g>
                              );
                            })}
                            {answered.length >= 2 && <polyline points={polyPts} fill="none" stroke="#ec4899" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
                            {scores.map(function(s) {
                              const cx = xOf(s.i);
                              const dc = s.avg === null ? null : s.avg >= 7 ? "#22c55e" : s.avg >= 5 ? "#ec4899" : "#ef4444";
                              return (
                                <g key={s.label}>
                                  {s.avg !== null && (
                                    <>
                                      <circle cx={cx} cy={yOf(s.avg)} r={7} fill={dc} stroke="white" strokeWidth={2} />
                                      <text x={cx} y={yOf(s.avg) - 11} textAnchor="middle" fontSize={10} fontWeight={700} fill={dc}>{s.avg.toFixed(1)}</text>
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
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#028090", borderBottom: "2px solid #dee2e6" }}>Mentor Curriculum</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#0ea5e9", borderBottom: "2px solid #dee2e6" }}>OM Touchpoints</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#eab308", borderBottom: "2px solid #dee2e6" }}>Medical Director Touchpoints</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#ec4899", borderBottom: "2px solid #dee2e6" }}>Culture</th>
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
                        const cs = cultureScore(qa, p.id);
                        const cultureColor = cs.avg === null ? "#adb5bd" : cs.avg >= 7 ? "#22c55e" : cs.avg >= 5 ? "#ec4899" : "#ef4444";
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
                                      setSelId(p.id); setTab("mentor"); setPhase(items[0].phase.id);
                                    } else if (items.length > 1) {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setDueMenu({ pid: p.id, items, x: rect.left, y: rect.bottom + 6 });
                                    } else {
                                      setSelId(p.id); setTab("mentor"); setPhase(p.phase);
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

              {/* Default */}
              {(mainTab === "roster" || !isDir) && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#868e96", fontSize: 16 }}>
                  ← Select a provider from the list
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* ENHANCED PROFILE CARD */}
              <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", padding: "18px 22px", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(2,128,144,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#028090", flexShrink: 0 }}>
                    {prov.name.split(" ").pop().substring(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#0f1b2d" }}>{prov.name}</div>
                    <div style={{ fontSize: 12, color: "#868e96" }}>{prov.role} — Mentor: {mentorUser ? mentorUser.name : "—"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#868e96", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>Days</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#0f1b2d" }}>{prov.days}</div>
                      <div style={{ fontSize: 9, color: "#868e96" }}>of 365</div>
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
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 12, flexWrap: "wrap" }}>
                  {MP.map((ph, i) => {
                    const done = i < curIdx || (i === curIdx && countChecks(checks, prov.id, ph.id).pct === 100);
                    return (
                      <span key={ph.id} style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 8, background: done ? "rgba(34,197,94,0.12)" : "#e9ecef", color: done ? "#166534" : "#868e96" }}>
                        {(done ? "✓ " : "○ ") + ph.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* JOURNEY TIMELINE */}
              <Timeline currentIdx={curIdx} />

              {/* 5 METRIC CARDS — clickable tab selectors (director only) */}
              {isDir && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "Medical Director Curriculum", pct: mdCurriculumPct(checks, prov.id), color: "#8b5cf6", key: "md", def: "pre0" },
                    { label: "Mentor Curriculum", pct: mentorPct(checks, prov.id), color: "#028090", key: "mentor", def: prov.phase },
                    { label: "Office Manager Touchpoints", pct: opsPct(qa, prov.id), color: "#0ea5e9", key: "ops", def: "om1" },
                    { label: "Medical Director Touchpoints", pct: questPct(qa, prov.id), color: "#eab308", key: "quest", def: "w1" },
                  ].map((m) => {
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
                  {/* Culture Integration card — shows raw 0-10 avg; navigates to quest tab at m3 */}
                  {(function() {
                    const cs = cultureScore(qa, prov.id);
                    const isActive = tab === "quest" && CULTURE_PHASES.indexOf(phase) !== -1;
                    const dc = cs.avg === null ? "#adb5bd" : cs.avg >= 7 ? "#22c55e" : cs.avg >= 5 ? "#ec4899" : "#ef4444";
                    return (
                      <div onClick={function() { setTab("quest"); setPhase("m3"); }}
                        style={{ background: isActive ? "#ec489912" : "white", borderRadius: 10, border: "2px solid " + (isActive ? "#ec4899" : "#dee2e6"), padding: "12px 14px", cursor: "pointer", transition: "border-color 120ms, background 120ms" }}>
                        <div style={{ fontSize: 11, color: isActive ? "#ec4899" : "#868e96", marginBottom: 4, fontWeight: isActive ? 700 : 400 }}>Culture Integration</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: dc }}>{cs.display}</div>
                        <div style={{ fontSize: 9, color: "#adb5bd", marginTop: 2 }}>avg / 10 · m3, m6, m12</div>
                        <div style={{ height: 5, background: "#e9ecef", borderRadius: 3, overflow: "hidden", marginTop: 4 }}>
                          <div style={{ height: "100%", width: cs.pct + "%", background: "#ec4899", borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* SCORE TREND */}
              {isDir && <ScoreTrend qa={qa} pid={prov.id} />}

              {/* PHASE SELECTOR */}
              <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
                {phaseList.map(ph => {
                  const isAct = phase === ph.id;
                  const isCur = tab === "mentor" && ph.id === prov.phase;
                  const accent = isOps ? "#0ea5e9" : isQ ? "#eab308" : isMd ? "#8b5cf6" : "#028090";
                  let cc = null;
                  if (isMd) {
                    const items = MD_ITEMS_BY_PHASE[ph.id] || [];
                    const done = items.filter(it => checks[prov.id + ".md." + it.id]).length;
                    cc = items.length > 0 ? { done, total: items.length } : null;
                  } else if (isOps) {
                    const op = OP.find(p => p.id === ph.id);
                    if (op) {
                      const total = op.qs.length;
                      const done = op.qs.filter(q => {
                        const v = qa[prov.id + "." + ph.id + "." + q.qid];
                        return v !== undefined && v !== "";
                      }).length;
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
                })}
              </div>

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
                  <div style={{ padding: "14px 20px", background: "#f8f9fb", borderTop: "1px solid #dee2e6" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 6 }}>NOTES</div>
                    {curNotes.map((n, i) => (
                      <div key={i} style={{ padding: "6px 10px", background: "white", borderRadius: 5, marginBottom: 4, border: "1px solid #dee2e6" }}>
                        <div style={{ fontSize: 12 }}>{n.text}</div>
                        <div style={{ fontSize: 9, color: "#868e96", marginTop: 2 }}>{n.by} — {n.at}</div>
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
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#ec4899", textTransform: "uppercase", letterSpacing: "0.06em" }}>Culture Integration Index</div>
                          <div style={{ fontSize: 11, color: "#9d4073", marginTop: 3 }}>Provider self-assessment · belonging, safety, connection, advocacy</div>
                        </div>
                      );
                    }
                    items.push(
                      <div key={q.qid} style={{ padding: "16px 20px", borderBottom: "1px solid " + (isCulture ? "#fce7f3" : "#dee2e6"), background: isCulture ? "#fdf2f8" : "transparent" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: isCulture ? "#9d174d" : "#0f1b2d" }}>{(i + 1) + ". " + q.text}</div>
                        {q.ty === "s" ? (
                          <ScaleInput value={val} onChange={function(v) { setAnswer(prov.id, phase, q.qid, v); }} />
                        ) : (
                          <textarea value={val} onChange={function(e) { setAnswer(prov.id, phase, q.qid, e.target.value); }}
                            placeholder="Type response..." style={{ padding: "10px 12px", borderRadius: 6, border: "1px solid #dee2e6", fontSize: 14, width: "100%", height: 80, boxSizing: "border-box", resize: "vertical", outline: "none", fontFamily: "inherit" }} />
                        )}
                      </div>
                    );
                    return items;
                  })}
                  <div style={{ padding: "14px 20px", background: "#f8f9fb", borderTop: "1px solid #dee2e6" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#868e96", marginBottom: 6 }}>NOTES</div>
                    {curNotes.map((n, i) => (
                      <div key={i} style={{ padding: "6px 10px", background: "white", borderRadius: 5, marginBottom: 4, border: "1px solid #dee2e6" }}>
                        <div style={{ fontSize: 12 }}>{n.text}</div>
                        <div style={{ fontSize: 9, color: "#868e96", marginTop: 2 }}>{n.by} — {n.at}</div>
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
                onClick={() => { setSelId(dueMenu.pid); setTab("mentor"); setPhase(it.phase.id); setDueMenu(null); }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 14px", background: "none", border: "none", borderBottom: "1px solid #f1f3f5", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f1b2d" }}>{it.phase.label}</span>
                <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 }}>{it.done}/{it.total} done</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

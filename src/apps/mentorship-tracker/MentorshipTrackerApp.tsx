// @ts-nocheck
import { useState } from "react";

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
  {id:"om1",label:"Month 1 Ops",items:["On time and on schedule?","Front desk handling flow?","Patient complaints or compliments?","Operational bottlenecks?","Staff adapting to workflow?"]},
  {id:"om2",label:"Month 2 Ops",items:["Volume ramping as expected?","Orders routing correctly?","Encounter closure impacting billing?","Staff concerns?","No-show rates normal?"]},
  {id:"om3",label:"Month 3 Ops",items:["Functioning independently?","Patient satisfaction trends?","Billing cycle and denials?","Staff satisfaction?","Changes needed?"]},
  {id:"om6",label:"Month 6 Ops",items:["At target volume?","Revenue and coding accuracy?","Patients rebooking?","Friction points?","Overall assessment"]},
  {id:"om9",label:"Month 9 Ops",items:["Performance review","Access challenges?","Team morale impact?","Upcoming needs?"]},
  {id:"om12",label:"Month 12 Ops",items:["Year assessment","Benchmark comparison?","Year 2 recommendations?","Formal evaluation"]},
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
  {id:"m3",label:"Month 3",qs:[{qid:"a",text:"Confident with full panel?",ty:"s"},{qid:"b",text:"Integrated into team?",ty:"s"},{qid:"c",text:"Quality metrics?",ty:"s"},{qid:"d",text:"Support still needed?",ty:"t"}]},
  {id:"m6",label:"Month 6",qs:[{qid:"a",text:"Confident at full capacity?",ty:"s"},{qid:"b",text:"Satisfied with role?",ty:"s"},{qid:"c",text:"Rate onboarding?",ty:"s"},{qid:"d",text:"Most valuable part?",ty:"t"}]},
  {id:"q3",label:"Month 9",qs:[{qid:"a",text:"Satisfied in current role?",ty:"s"},{qid:"b",text:"Organization supports growth?",ty:"s"},{qid:"c",text:"Development needs?",ty:"t"}]},
  {id:"q4",label:"Month 12",qs:[{qid:"a",text:"Rate your first year?",ty:"s"},{qid:"b",text:"Likely to stay long-term?",ty:"s"},{qid:"c",text:"Best part of year one?",ty:"t"}]},
];

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
      const ph = MP.find(x => x.id === phid) || OP.find(x => x.id === phid);
      if (ph) ph.items.forEach((_, i) => { c[pid + "." + phid + "." + i] = true; });
    });
  };
  fill("p1", ["w1","w2","w3","w4","w5","w6","w7","w8","m3","om1","om2","om3"]);
  fill("p2", ["w1","w2","w3","w4","w5","w6","w7","w8","om1","om2"]);
  fill("p3", ["w1","w2","w3","w4","w5","w6","om1"]);
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
  return qa;
}

/* ─── Helpers ─── */
function phIdx(id) { return MP.findIndex(x => x.id === id); }

function countChecks(checks, pid, phid) {
  const ph = MP.find(x => x.id === phid) || OP.find(x => x.id === phid);
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

function opsPct(checks, pid) {
  let t = 0, d = 0;
  OP.forEach(ph => { ph.items.forEach((_, j) => { t++; if (checks[pid + "." + ph.id + "." + j]) d++; }); });
  return t > 0 ? Math.round(d / t * 100) : 0;
}

function mdReviewPct(checks, pid) {
  const prov = PROVS.find(x => x.id === pid);
  const max = phIdx(prov.phase);
  const mdIds = ["w4","w8","m3","m6","q3","q4"];
  let t = 0, d = 0;
  mdIds.forEach(id => { if (phIdx(id) > max) return; const ph = MP.find(x => x.id === id); if (ph) ph.items.forEach((_, j) => { t++; if (checks[pid + "." + id + "." + j]) d++; }); });
  return t > 0 ? Math.round(d / t * 100) : 0;
}

function questPct(qa, pid) {
  const prov = PROVS.find(x => x.id === pid);
  const max = phIdx(prov.phase);
  let t = 0, a = 0;
  QP.forEach(qp => { if (phIdx(qp.id) > max) return; qp.qs.forEach(q => { t++; const v = qa[pid + "." + qp.id + "." + q.qid]; if (v !== undefined && v !== "") a++; }); });
  return t > 0 ? Math.round(a / t * 100) : 0;
}

/* NEW: Average questionnaire score for a provider at a phase */
function avgScore(qa, pid, phid) {
  const qp = QP.find(x => x.id === phid);
  if (!qp) return null;
  let sum = 0, cnt = 0;
  qp.qs.forEach(q => {
    if (q.ty === "s") {
      const v = qa[pid + "." + phid + "." + q.qid];
      if (v !== undefined && v !== "") { sum += Number(v); cnt++; }
    }
  });
  return cnt > 0 ? sum / cnt : null;
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

/* NEW: Cross-provider pattern detection */
function detectPatterns(qa) {
  const alerts = [];
  MP.forEach(ph => {
    const qp = QP.find(x => x.id === ph.id);
    if (!qp) return;
    const scores = [];
    PROVS.forEach(prov => {
      const a = avgScore(qa, prov.id, ph.id);
      if (a !== null) scores.push({ name: prov.name, avg: a });
    });
    if (scores.length >= 2) {
      const below = scores.filter(s => s.avg < 6);
      if (below.length >= 2 && below.length / scores.length >= 0.5) {
        const overall = scores.reduce((s, x) => s + x.avg, 0) / scores.length;
        alerts.push({ phaseId: ph.id, label: ph.label, affected: below.length, total: scores.length, avg: overall.toFixed(1) });
      }
    }
  });
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

function ScaleInput({ value, onChange }) {
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
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#868e96", marginTop: 4 }}>
        <span>Not at all</span>
        <span>Completely</span>
      </div>
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
  const phaseList = isOps ? OP : isQ ? QP : MP;
  const curChecklist = phase && !isQ ? (isOps ? OP : MP).find(x => x.id === phase) : null;
  const curQuest = isQ && phase ? QP.find(x => x.id === phase) : null;
  const pc = curChecklist && prov ? countChecks(checks, prov.id, phase) : null;
  const curNotes = prov && phase ? (notes[prov.id + "." + phase] || []) : [];
  const canChk = isOps ? isDir : (isDir || isMen);

  /* ─── MAIN LAYOUT ─── */
  return (
    <div style={{ background: "#f1f3f5", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#1c2b3a", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ background: "#0f1b2d", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>Mentorship Tracker</div>
          <div style={{ fontSize: 12, color: "#868e96" }}>{user.name} — {isDir ? "Medical Director" : "Mentor"}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isDir && patterns.length > 0 && (
            <div style={{ padding: "5px 12px", borderRadius: 8, background: "#eab308", color: "#78350f", fontSize: 11, fontWeight: 700 }}>
              {"📊 " + patterns.length + " Pattern Alert" + (patterns.length !== 1 ? "s" : "")}
            </div>
          )}
          <button onClick={() => { setUid(null); setSelId(null); }}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.12)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Log Out
          </button>
        </div>
      </div>

      {/* MD tabs when no provider selected */}
      {isDir && !selId && (
        <div style={{ background: "white", borderBottom: "1px solid #dee2e6", padding: "0 24px" }}>
          {[{ k: "roster", l: "Provider Roster" }, { k: "compare", l: "Comparison" }, { k: "notes", l: "Recent Notes" }].map(t => (
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
            const md = isDir ? mdReviewPct(checks, p.id) : 0;
            const op = isDir ? opsPct(checks, p.id) : 0;
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
                    <Bar label="MD Reviews" pct={md} color="#8b5cf6" />
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
              {/* Pattern alerts */}
              {isDir && patterns.length > 0 && (
                <div style={{ background: "white", borderRadius: 10, border: "2px solid #fecaca", marginBottom: 16, overflow: "hidden" }}>
                  <div style={{ padding: "12px 18px", background: "#fef2f2", borderBottom: "1px solid #fecaca" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#ef4444" }}>⚠️ Cross-Provider Pattern Alerts</div>
                  </div>
                  {patterns.map((a, i) => (
                    <div key={i} style={{ padding: "12px 18px", borderBottom: "1px solid #dee2e6" }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{a.label}: {a.affected} of {a.total} providers scored below 6.0 (avg: {a.avg})</div>
                      <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, marginTop: 4 }}>Possible program-level issue at this phase</div>
                    </div>
                  ))}
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
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#8b5cf6", borderBottom: "2px solid #dee2e6" }}>MD</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#028090", borderBottom: "2px solid #dee2e6" }}>Mentor</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#0ea5e9", borderBottom: "2px solid #dee2e6" }}>Ops</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#eab308", borderBottom: "2px solid #dee2e6" }}>Surveys</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, borderBottom: "2px solid #dee2e6" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PROVS.map(p => {
                        const vals = [mdReviewPct(checks, p.id), mentorPct(checks, p.id), opsPct(checks, p.id), questPct(qa, p.id)];
                        const cols = ["#8b5cf6", "#028090", "#0ea5e9", "#eab308"];
                        const st = getStatus(p.id);
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
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8, background: st === "overdue" ? "#fef2f2" : st === "due" ? "#fefce8" : "#dcfce7", color: st === "overdue" ? "#ef4444" : st === "due" ? "#92400e" : "#166534" }}>
                                {st === "overdue" ? "OVERDUE" : st === "due" ? "DUE" : "ON TRACK"}
                              </span>
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

              {/* 4 METRIC CARDS */}
              {isDir && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "MD Reviews", pct: mdReviewPct(checks, prov.id), color: "#8b5cf6" },
                    { label: "Mentor", pct: mentorPct(checks, prov.id), color: "#028090" },
                    { label: "Ops", pct: opsPct(checks, prov.id), color: "#0ea5e9" },
                    { label: "Questionnaires", pct: questPct(qa, prov.id), color: "#eab308" },
                  ].map((m, i) => {
                    const dc = m.pct >= 70 ? "#22c55e" : m.pct >= 30 ? m.color : m.pct > 0 ? "#ef4444" : "#adb5bd";
                    return (
                      <div key={i} style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", padding: "12px 14px" }}>
                        <div style={{ fontSize: 11, color: "#868e96", marginBottom: 4 }}>{m.label}</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: dc }}>{m.pct}%</div>
                        <div style={{ height: 5, background: "#e9ecef", borderRadius: 3, overflow: "hidden", marginTop: 6 }}>
                          <div style={{ height: "100%", width: m.pct + "%", background: m.color, borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SCORE TREND */}
              {isDir && <ScoreTrend qa={qa} pid={prov.id} />}

              {/* TRACK TABS */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {[
                  { key: "mentor", label: "Mentor Check-Ins", color: "#028090", def: prov.phase },
                  ...(isDir ? [
                    { key: "ops", label: "Office Manager", color: "#0ea5e9", def: "om1" },
                    { key: "quest", label: "Questionnaires", color: "#8b5cf6", def: "w1" },
                  ] : []),
                ].map(t => (
                  <button key={t.key} onClick={() => { setTab(t.key); setPhase(t.def); }}
                    style={{ padding: "9px 20px", borderRadius: 8, border: "2px solid " + (tab === t.key ? t.color : "#dee2e6"), background: tab === t.key ? t.color : "white", color: tab === t.key ? "white" : "#868e96", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* PHASE SELECTOR */}
              <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
                {phaseList.map(ph => {
                  const isAct = phase === ph.id;
                  const isCur = tab === "mentor" && ph.id === prov.phase;
                  const accent = isOps ? "#0ea5e9" : isQ ? "#8b5cf6" : "#028090";
                  const cc = !isQ ? countChecks(checks, prov.id, ph.id) : null;
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

              {/* CHECKLIST */}
              {curChecklist && (
                <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", maxWidth: 740, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #dee2e6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>{curChecklist.label}</h3>
                      <div style={{ fontSize: 11, color: "#868e96", marginTop: 3 }}>{isOps ? "MD + Office Manager" : "Mentor check-in"}</div>
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

              {/* QUESTIONNAIRE */}
              {curQuest && (
                <div style={{ background: "white", borderRadius: 10, border: "1px solid #dee2e6", maxWidth: 740, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #dee2e6" }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f1b2d" }}>{curQuest.label} Questionnaire</h3>
                    <div style={{ fontSize: 11, color: "#868e96", marginTop: 3 }}>Record provider responses</div>
                  </div>
                  {curQuest.qs.map((q, i) => {
                    const val = qa[prov.id + "." + phase + "." + q.qid] || "";
                    return (
                      <div key={q.qid} style={{ padding: "16px 20px", borderBottom: "1px solid #dee2e6" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{(i + 1) + ". " + q.text}</div>
                        {q.ty === "s" ? (
                          <ScaleInput value={val} onChange={v => setAnswer(prov.id, phase, q.qid, v)} />
                        ) : (
                          <textarea value={val} onChange={e => setAnswer(prov.id, phase, q.qid, e.target.value)}
                            placeholder="Type response..." style={{ padding: "10px 12px", borderRadius: 6, border: "1px solid #dee2e6", fontSize: 14, width: "100%", height: 80, boxSizing: "border-box", resize: "vertical", outline: "none", fontFamily: "inherit" }} />
                        )}
                      </div>
                    );
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
    </div>
  );
}

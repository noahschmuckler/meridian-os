// @ts-nocheck
// Productivity panel for the Onboarding Tracker provider profile.
//
// Surfaces Epic-sourced provider productivity (patient volume, RVUs, in-basket
// time, time in notes, Rx refill time) as a weekly trend compared to a practice
// benchmark. Five compact tiles; click any tile to expand it into a full trend
// chart with a plain-language verdict.
//
// DATA SOURCE: today the weekly series + benchmarks are seeded here (PROD_SEED /
// PROD_METRICS). The shape is deliberately Epic-pipe-ready — when the Epic
// integration lands, it populates PROD_SERIES[providerId][metric] (an array of
// weekly values) and PROD_METRICS[].goal (the practice benchmark) without any
// change to the rendering below.

import { useState } from "react";

/* ─── Benchmarks (one per metric) — "better" = which direction is good ─── */
export const PROD_METRICS = [
  { key: "volume",   label: "Patients / Day",  short: "pts/day", goal: 18,  better: "high" },
  { key: "rvu",      label: "RVUs / Week",     short: "wRVU/wk", goal: 185, better: "high" },
  { key: "inbasket", label: "In-Basket / Day", short: "min",     goal: 22,  better: "low"  },
  { key: "note",     label: "Time per Note",   short: "min",     goal: 14,  better: "low"  },
  { key: "refill",   label: "Refill Time",     short: "min",     goal: 6.5, better: "low"  },
];

/* ─── Per-provider weekly descriptors (stand-in for the Epic pipe) ─────────
   Each metric: {from, to, pat, swing?}. pat "climb" interpolates from→to;
   "vary" oscillates around the midpoint (swing = peak-to-peak) ending at `to`. */
const PROD_SEED = {
  p1: { weeks: 7, volume:{from:8,to:14,pat:"climb"}, rvu:{from:148,to:149,pat:"vary",swing:22}, inbasket:{from:42,to:29,pat:"climb"}, note:{from:27,to:18,pat:"climb"}, refill:{from:11,to:7.8,pat:"climb"} },
  p2: { weeks: 8, volume:{from:6,to:12,pat:"climb"},  rvu:{from:120,to:150,pat:"vary",swing:30}, inbasket:{from:45,to:33,pat:"climb"}, note:{from:30,to:22,pat:"climb"}, refill:{from:12,to:9,pat:"climb"} },
  p3: { weeks: 7, volume:{from:9,to:15,pat:"climb"},  rvu:{from:150,to:178,pat:"climb"},          inbasket:{from:38,to:24,pat:"climb"}, note:{from:25,to:16,pat:"climb"}, refill:{from:10,to:7,pat:"climb"} },
  p4: { weeks: 5, volume:{from:7,to:9,pat:"vary",swing:4}, rvu:{from:110,to:118,pat:"vary",swing:28}, inbasket:{from:38,to:41,pat:"climb"}, note:{from:24,to:28,pat:"climb"}, refill:{from:11,to:10.5,pat:"climb"} },
  p5: { weeks: 8, volume:{from:15,to:18,pat:"climb"}, rvu:{from:170,to:186,pat:"climb"},          inbasket:{from:30,to:21,pat:"climb"}, note:{from:20,to:13,pat:"climb"}, refill:{from:9,to:6,pat:"climb"} },
  p6: { weeks: 3, volume:{from:5,to:8,pat:"climb"},   rvu:{from:90,to:120,pat:"climb"},           inbasket:{from:50,to:44,pat:"climb"}, note:{from:32,to:28,pat:"climb"}, refill:{from:13,to:11,pat:"climb"} },
  p7: { weeks: 3, volume:{from:4,to:6,pat:"climb"},   rvu:{from:85,to:100,pat:"vary",swing:20},   inbasket:{from:52,to:48,pat:"climb"}, note:{from:34,to:31,pat:"climb"}, refill:{from:14,to:12,pat:"climb"} },
  p8: { weeks: 7, volume:{from:8,to:14,pat:"climb"},  rvu:{from:140,to:170,pat:"climb"},          inbasket:{from:40,to:26,pat:"climb"}, note:{from:26,to:17,pat:"climb"}, refill:{from:11,to:7.5,pat:"climb"} },
  p9: { weeks: 8, volume:{from:10,to:16,pat:"climb"}, rvu:{from:150,to:180,pat:"climb"},          inbasket:{from:35,to:23,pat:"climb"}, note:{from:24,to:15,pat:"climb"}, refill:{from:10,to:7,pat:"climb"} },
};

function genSeries(from, to, weeks, pat, swing) {
  const a = [];
  if (pat === "vary") {
    const mid = (from + to) / 2, sw = (swing || 16) / 2;
    for (let i = 0; i < weeks; i++) a.push(Math.round((mid + (i % 2 === 0 ? sw : -sw)) * 10) / 10);
    a[0] = from; a[weeks - 1] = to;
    return a;
  }
  for (let i = 0; i < weeks; i++) {
    const t = weeks === 1 ? 1 : i / (weeks - 1);
    a.push(Math.round((from + (to - from) * t) * 10) / 10);
  }
  a[weeks - 1] = to;
  return a;
}

/* Build the weekly series for every provider at module load. */
export const PROD_SERIES = {};
Object.keys(PROD_SEED).forEach((pid) => {
  const d = PROD_SEED[pid];
  PROD_SERIES[pid] = {};
  PROD_METRICS.forEach((m) => {
    const s = d[m.key];
    PROD_SERIES[pid][m.key] = s ? genSeries(s.from, s.to, d.weeks, s.pat, s.swing) : null;
  });
});

export function hasProductivity(pid) {
  return !!PROD_SERIES[pid] && PROD_METRICS.some((m) => PROD_SERIES[pid][m.key]);
}

/* ─── Status palette — green = good, amber = variable, red = wrong direction ─ */
const STATUS = {
  green: { bg:"#dcfce7", fg:"#15803d", line:"#16a34a", fill:"#22c55e", soft:"#f0fdf4", border:"#bbf7d0" },
  amber: { bg:"#fef9c3", fg:"#854d0e", line:"#eab308", fill:"#eab308", soft:"#fffbeb", border:"#fde68a" },
  red:   { bg:"#fee2e2", fg:"#b91c1c", line:"#ef4444", fill:"#ef4444", soft:"#fff5f5", border:"#fca5a5" },
};

/* Analyze a weekly series against its benchmark. */
function analyzeProd(series, m) {
  const n = series.length, cur = series[n - 1], first = series[0];
  const goal = m.goal, sign = m.better === "high" ? 1 : -1;
  const atGoal = sign > 0 ? cur >= goal * 0.97 : cur <= goal * 1.03;
  const deltas = [];
  for (let i = 1; i < n; i++) deltas.push((series[i] - series[i - 1]) * sign); // + = toward goal
  const net = (cur - first) * sign;
  const mn = Math.min(...series), mx = Math.max(...series), range = mx - mn;
  let flips = 0, prev = 0;
  deltas.forEach((d) => { if (Math.abs(d) > 0.05) { if (prev !== 0 && Math.sign(d) !== prev) flips++; prev = Math.sign(d); } });
  const avgAbs = deltas.reduce((s, d) => s + Math.abs(d), 0) / (deltas.length || 1);
  const variable = flips >= 2 && net < avgAbs; // swings dominate net progress

  let key, label, color;
  if (atGoal)            { key = "near";  label = "Near Goal";                                   color = "green"; }
  else if (variable)     { key = "vary";  label = "Variable";                                     color = "amber"; }
  else if (net > 0.05)   { key = "climb"; label = m.better === "high" ? "Climbing" : "Improving"; color = "green"; }
  else                   { key = "down";  label = "Falling Behind";                               color = "red";   }

  const denom = (n - 1) || 1;
  const gainPerWeek = net / denom;            // toward-goal per week
  const rawPerWeek = (cur - first) / denom;   // raw signed per week
  const etaWeeks = key === "climb" && gainPerWeek > 0 ? Math.ceil(((goal - cur) * sign) / gainPerWeek) : null;
  const arrow = key === "near" ? "✓" : key === "vary" ? "⚠"
    : key === "climb" ? (m.better === "high" ? "↑" : "↓")
    : (m.better === "high" ? "↓" : "↑");

  return { n, cur, first, goal, net, mn, mx, range, key, label, color, gainPerWeek, rawPerWeek, etaWeeks, arrow, swing: Math.round(range) };
}

/* Progress toward goal, 0–100, for the tile gauge. */
function prodPct(cur, goal, better) {
  const p = better === "high" ? cur / goal : goal / cur;
  return Math.max(4, Math.min(100, Math.round(p * 100)));
}

function verdictText(name, m, a) {
  const u = m.short, lower = m.label.toLowerCase();
  if (a.key === "near") return `${name} is essentially at the practice goal — ${a.cur} against a goal of ${a.goal}. Holding steady here is exactly what you want to see.`;
  if (a.key === "vary") return `${name}'s ${lower} has been up one week, down the next — no clear trend yet. It ranges from ${a.mn} to ${a.mx} week to week. Worth a conversation to understand what's driving the inconsistency before drawing any conclusions.`;
  if (a.key === "down") return `${name}'s ${lower} is moving the wrong way — from ${a.first} to ${a.cur} ${u}. Worth checking in on soon.`;
  const verb = m.better === "high"
    ? `gaining ground — from ${a.first} to ${a.cur} ${u}`
    : `bringing ${lower} down — from ${a.first} to ${a.cur} ${u}`;
  const eta = a.etaWeeks != null ? ` On pace to reach the goal of ${a.goal} around Week ${a.n + a.etaWeeks}.` : "";
  return `${name} has been steadily ${verb}.${eta}`;
}

/* ─── Trend chart ─── */
function ProdChart({ series, a, m, c }) {
  const n = series.length;
  const yMax = Math.max(m.goal, a.mx) * 1.15;
  const X0 = 40, X1 = 1040, Y0 = 30, Y1 = 200;
  const xFor = (i) => X0 + (X1 - X0) * (n === 1 ? 1 : i / (n - 1));
  const yFor = (v) => Y1 - (v / yMax) * (Y1 - Y0);
  const goalY = yFor(m.goal);
  const pts = series.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ");
  const showAll = a.key === "vary";

  return (
    <svg viewBox="0 0 1080 240" width="100%" height="220" style={{ overflow: "visible" }}>
      {/* gridlines */}
      {[Y0, Y0 + (Y1 - Y0) / 3, Y0 + (2 * (Y1 - Y0)) / 3].map((y, i) => (
        <line key={i} x1={X0} y1={y} x2={X1} y2={y} stroke="#f1f3f5" strokeWidth="1" />
      ))}
      <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke="#e9ecef" strokeWidth="1.5" />

      {/* benchmark goal line */}
      <line x1={X0} y1={goalY} x2={X1} y2={goalY} stroke="#d4a72c" strokeWidth="2.5" strokeDasharray="9,6" />
      <text x={X1 + 8} y={goalY + 4} fontSize="14" fill="#b8860b" fontWeight="800">{m.goal}</text>

      {/* shaded area + line */}
      <polygon points={`${pts} ${xFor(n - 1)},${Y1} ${xFor(0)},${Y1}`} fill={c.fill + "14"} />
      <polyline points={pts} fill="none" stroke={c.line} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* projected dashed segment for a steady climb */}
      {a.key === "climb" && a.etaWeeks != null && (
        <line x1={xFor(n - 1)} y1={yFor(a.cur)} x2={X1} y2={yFor(Math.min(a.goal, yMax))} stroke={c.line + "55"} strokeWidth="2.5" strokeDasharray="6,4" />
      )}

      {/* points */}
      {showAll
        ? series.map((v, i) => <circle key={i} cx={xFor(i)} cy={yFor(v)} r={i === n - 1 ? 7 : 5} fill={c.line} stroke="#fff" strokeWidth={i === n - 1 ? 3 : 0} />)
        : (<>
            <circle cx={xFor(0)} cy={yFor(series[0])} r="5" fill={c.line} />
            <circle cx={xFor(n - 1)} cy={yFor(a.cur)} r="7" fill={c.line} stroke="#fff" strokeWidth="3" />
          </>)}

      {/* value labels */}
      {showAll
        ? series.map((v, i) => <text key={i} x={xFor(i)} y={yFor(v) - 12} fontSize="12" fill={c.fg} textAnchor="middle" fontWeight="700">{v}</text>)
        : (<>
            <text x={xFor(0) + 12} y={yFor(series[0]) - 8} fontSize="14" fill={c.fg} fontWeight="800">{series[0]}</text>
            <text x={xFor(n - 1)} y={yFor(a.cur) - 14} fontSize="15" fill={c.fg} textAnchor="end" fontWeight="800">{a.cur}</text>
          </>)}

      {/* x labels: Week 1 … Now */}
      <text x={xFor(0)} y={Y1 + 24} fontSize="13" fill="#adb5bd" textAnchor="middle">Week 1</text>
      {n > 3 && <text x={xFor(Math.floor((n - 1) / 2))} y={Y1 + 24} fontSize="13" fill="#adb5bd" textAnchor="middle">Week {Math.floor((n - 1) / 2) + 1}</text>}
      <text x={xFor(n - 1)} y={Y1 + 24} fontSize="13" fill="#0f1b2d" textAnchor="middle" fontWeight="700">Now</text>
    </svg>
  );
}

/* ─── Expanded card ─── */
function ProdExpanded({ name, m, series, onClose }) {
  const a = analyzeProd(series, m);
  const c = STATUS[a.color];
  const stat1 = a.key === "vary" ? { v: a.cur, l: "This Week" } : { v: a.cur, l: `Now (Week ${a.n})` };
  const stat3 = a.key === "vary"
    ? { v: "±" + a.swing, l: "Week-to-week swing", color: c.fg }
    : { v: (a.rawPerWeek > 0 ? "+" : "") + a.rawPerWeek.toFixed(1) + " / wk", l: "Avg change per week since Week 1", color: c.fg };

  return (
    <div style={{ background: "#fff", border: "1px solid " + c.border, borderRadius: 16, overflow: "hidden", marginTop: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
      <div style={{ padding: "18px 22px 14px", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f1b2d" }}>{m.label} — Weekly Trend</div>
          <div style={{ fontSize: 12, color: "#868e96", marginTop: 3 }}>
            Weekly average since start · goal: {m.goal}{m.better === "low" ? " min or under" : ""}
          </div>
        </div>
        <button onClick={onClose} style={{ marginLeft: "auto", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#adb5bd", fontWeight: 600 }}>✕ Close</button>
      </div>

      {/* plain-language verdict */}
      <div style={{ margin: "0 22px 18px", padding: "14px 18px", borderRadius: 12, background: c.soft, border: "1px solid " + c.border, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 1, color: c.fg }}>{a.arrow}</span>
        <span style={{ fontSize: 13.5, lineHeight: 1.5, color: c.fg, fontWeight: 500 }}>{verdictText(name, m, a)}</span>
      </div>

      {/* three headline stats */}
      <div style={{ display: "flex", padding: "0 22px 6px" }}>
        {[stat1, { v: m.goal, l: "Practice Goal", color: "#0f1b2d" }, stat3].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: i === 0 ? "6px 10px 6px 0" : "6px 10px", borderLeft: i === 0 ? "none" : "1px solid #f0f1f3", paddingLeft: i === 0 ? 0 : 22 }}>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", color: s.color || "#0f1b2d" }}>{s.v}</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "#adb5bd", marginTop: 5 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* legend + chart */}
      <div style={{ padding: "12px 26px 22px" }}>
        <div style={{ display: "flex", gap: 22, marginBottom: 6, paddingLeft: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, color: "#495057" }}>
            <div style={{ width: 26, height: 4, borderRadius: 2, background: c.line }} /> {name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, color: "#495057" }}>
            <div style={{ width: 26, borderTop: "3px dashed #d4a72c" }} /> Practice goal ({m.goal})
          </div>
        </div>
        <ProdChart series={series} a={a} m={m} c={c} />
      </div>
    </div>
  );
}

/* ─── Compact tile ─── */
function ProdTile({ m, series, active, onClick }) {
  const a = analyzeProd(series, m);
  const c = STATUS[a.color];
  const pct = prodPct(a.cur, m.goal, m.better);
  const lowLeft = m.better === "low" ? `Goal ${m.goal}` : "0";
  const lowRight = m.better === "low" ? `now ${a.cur}` : `Goal ${m.goal}`;
  return (
    <div onClick={onClick}
      style={{ background: "#fff", border: "1px solid " + (active ? c.line : "#e9ecef"), borderRadius: 16, padding: "18px 18px 16px", cursor: "pointer", transition: "box-shadow .15s, transform .15s", boxShadow: active ? "0 6px 20px rgba(0,0,0,0.08)" : "none", transform: active ? "translateY(-2px)" : "none" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#868e96", marginBottom: 12 }}>{m.label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 3 }}>
        <span style={{ fontSize: 34, fontWeight: 800, color: "#0f1b2d", lineHeight: 1, letterSpacing: "-1px" }}>{a.cur}</span>
        <span style={{ fontSize: 11.5, color: "#adb5bd", fontWeight: 600 }}>{m.better === "high" ? `/ ${m.goal} goal` : m.short}</span>
      </div>
      <div style={{ fontSize: 11.5, color: "#868e96", marginBottom: 14, minHeight: 15 }}>
        {m.better === "low" ? `Goal: under ${m.goal} min` : " "}
      </div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 999, background: c.bg, color: c.fg }}>
        <span style={{ fontSize: 13 }}>{a.arrow}</span> {a.label}
      </span>
      <div style={{ marginTop: 14, position: "relative", height: 8, background: "#eef0f2", borderRadius: 999 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: pct + "%", borderRadius: 999, background: c.fill }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, fontSize: 10, color: "#adb5bd", fontWeight: 600 }}>
        <span>{lowLeft}</span><span>{lowRight}</span>
      </div>
    </div>
  );
}

/* ─── Panel ─── */
export default function ProductivityPanel({ prov }) {
  const series = PROD_SERIES[prov.id];
  const [expanded, setExpanded] = useState("volume");

  if (!series || !PROD_METRICS.some((m) => series[m.key])) {
    return (
      <div style={{ padding: "28px 20px", textAlign: "center", color: "#868e96", fontSize: 13, background: "#fff", border: "1px solid #e9ecef", borderRadius: 14 }}>
        No Epic productivity data has been piped in for {prov.name} yet.
      </div>
    );
  }

  const metrics = PROD_METRICS.filter((m) => series[m.key]);
  const expMetric = metrics.find((m) => m.key === expanded) || null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: "#0f1b2d" }}>Productivity</span>
        <span style={{ fontSize: 12, color: "#adb5bd" }}>How {prov.name} is performing vs. the practice benchmark</span>
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "4px 11px", borderRadius: 7, background: "#eef2ff", color: "#4f46e5" }}>⚡ Source: Epic</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {metrics.map((m) => (
          <ProdTile key={m.key} m={m} series={series[m.key]} active={expanded === m.key}
            onClick={() => setExpanded(expanded === m.key ? null : m.key)} />
        ))}
      </div>

      {!expMetric && (
        <div style={{ textAlign: "center", fontSize: 12, color: "#adb5bd", marginTop: 14, fontWeight: 600 }}>
          Click any tile above to see its full weekly trend.
        </div>
      )}
      {expMetric && (
        <ProdExpanded name={prov.name} m={expMetric} series={series[expMetric.key]} onClose={() => setExpanded(null)} />
      )}
    </div>
  );
}

// @ts-nocheck
import React, { useState } from "react";

const CULTURE_QUESTIONS = [
  { id: "ci1", label: "Team Belonging",       text: "Do you feel like a valued member of the team?" },
  { id: "ci2", label: "Social Connection",    text: "Do you have at least one colleague you would consider a friend or close ally here?" },
  { id: "ci3", label: "Psychological Safety", text: "Do you feel comfortable asking for help when you need it?" },
  { id: "ci4", label: "Advocacy",             text: "Would you recommend this organization to a colleague considering a similar role?" },
];

export const CULTURE_PHASES_PHYS    = ["m3", "m6", "m9", "m12"];
export const CULTURE_PHASES_APC_EXT = ["m15", "m18", "m21", "m24"];

const PHASE_LABEL: Record<string, string> = {
  m3:"Month 3", m6:"Month 6", m9:"Month 9", m12:"Month 12",
  m15:"Month 15", m18:"Month 18", m21:"Month 21", m24:"Month 24",
};

function phaseDetail(qa, pid, phid) {
  const entries = CULTURE_QUESTIONS.map(q => {
    const v = qa[pid + "." + phid + "." + q.id];
    return (v !== undefined && v !== "") ? { ...q, score: Number(v) } : null;
  }).filter(Boolean);
  if (entries.length === 0) return null;
  const avg = entries.reduce((s, e) => s + e.score, 0) / entries.length;
  return { avg: parseFloat(avg.toFixed(2)), entries };
}

function scoreColor(v) {
  return v >= 7 ? "#22c55e" : v >= 5 ? "#eab308" : "#ef4444";
}
function scoreBg(v) {
  return v >= 7 ? "#f0fdf4" : v >= 5 ? "#fffbeb" : "#fef2f2";
}
function bandLabel(v) {
  return v >= 7 ? "Thriving" : v >= 5 ? "Developing" : "At Risk";
}

export default function CulturePanel({ prov, qa, apc }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const phases = apc
    ? [...CULTURE_PHASES_PHYS, ...CULTURE_PHASES_APC_EXT]
    : CULTURE_PHASES_PHYS;

  const phaseData = phases.map(phid => ({
    phid,
    label: PHASE_LABEL[phid] || phid,
    detail: phaseDetail(qa, prov.id, phid),
  }));

  const answered = phaseData.filter(p => p.detail !== null);

  let totalScore = 0, totalPoints = 0;
  answered.forEach(p => p.detail.entries.forEach(e => { totalScore += e.score; totalPoints++; }));
  const overall = totalPoints > 0 ? totalScore / totalPoints : null;

  const trend = answered.length >= 2
    ? answered[answered.length - 1].detail.avg - answered[answered.length - 2].detail.avg
    : null;

  /* ─── Verdict ─── */
  function verdictText() {
    if (overall === null) {
      return `Culture checkpoints begin at Month 3. Data will appear as ${prov.name} reaches each milestone — and will tell a meaningful story over time.`;
    }
    if (overall >= 8.5) return `${prov.name} is deeply connected here. Scores like these reflect months of intentional investment by this team.`;
    if (overall >= 7) {
      if (trend !== null && trend > 0.3)
        return `${prov.name} is thriving and gaining momentum — the upward trend reflects growing integration.`;
      return `${prov.name} is thriving. A high CII at this stage is real evidence that the onboarding investment is paying off.`;
    }
    if (overall >= 5) {
      if (trend !== null && trend > 0.3)
        return `${prov.name} is developing — and moving in the right direction. A brief check-in can accelerate this trajectory.`;
      if (trend !== null && trend < -0.3)
        return `${prov.name}'s culture score has dipped. A short, personal conversation now typically turns this around quickly.`;
      return `${prov.name} is in the developing range. Consider a focused check-in around team belonging and support.`;
    }
    return `${prov.name}'s CII warrants direct attention. Early, personal outreach from a Medical Director makes a measurable difference at this stage.`;
  }

  const vBorder = overall === null ? "#e9ecef" : overall >= 7 ? "#bbf7d0" : overall >= 5 ? "#fde68a" : "#fecaca";
  const vBg     = overall === null ? "#f8f9fa"  : overall >= 7 ? "#f0fdf4" : overall >= 5 ? "#fffbeb" : "#fef2f2";
  const vColor  = overall === null ? "#6b7280"  : overall >= 7 ? "#15803d" : overall >= 5 ? "#92400e" : "#b91c1c";

  /* ─── Chart ─── */
  const W = 560, H = 170, PL = 38, PR = 20, PT = 20, PB = 28;
  const cw = W - PL - PR, ch = H - PT - PB;
  const yOf  = (v) => PT + ch - (Math.max(0, Math.min(10, v)) / 10) * ch;
  const xOf  = (i) => PL + (phases.length > 1 ? (i / (phases.length - 1)) : 0.5) * cw;
  const xOfPh = (phid) => xOf(phases.indexOf(phid));

  const pts      = answered.map(p => [xOfPh(p.phid), yOf(p.detail.avg)] as [number, number]);
  const polyPts  = pts.map(([x, y]) => `${x},${y}`).join(" ");
  let areaPath   = "";
  if (pts.length >= 2) {
    areaPath = `M${pts[0][0]},${pts[0][1]}` +
      pts.slice(1).map(([x, y]) => ` L${x},${y}`).join("") +
      ` L${pts[pts.length - 1][0]},${PT + ch} L${pts[0][0]},${PT + ch} Z`;
  }

  const cards = [...phaseData].reverse();

  return (
    <div style={{ paddingBottom: 24 }}>

      {/* Verdict banner */}
      <div style={{ marginBottom: 16, padding: "13px 16px", background: vBg, border: `1px solid ${vBorder}`, borderRadius: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: vColor, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
            <span style={{ fontSize: 13, fontWeight: 800 }}>C.I.I.</span>
            <span style={{ display: "block", fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 1, marginBottom: 4 }}>Culture Integration Index</span>
            {overall !== null && (
              <span style={{ marginLeft: 8 }}>
                {overall.toFixed(1)} / 10 &nbsp;·&nbsp; {bandLabel(overall)}
                {trend !== null && (
                  <span style={{ marginLeft: 6, fontSize: 13 }}>
                    {Math.abs(trend) < 0.2 ? " →" : trend > 0 ? " ↑" : " ↓"}
                    {Math.abs(trend) >= 0.2 && (
                      <span style={{ fontSize: 10, marginLeft: 2, fontWeight: 500 }}>
                        {(trend > 0 ? "+" : "") + trend.toFixed(1)} since last checkpoint
                      </span>
                    )}
                  </span>
                )}
              </span>
            )}
          </div>
          {totalPoints > 0 && (
            <div style={{ fontSize: 10, color: "#9ca3af", whiteSpace: "nowrap" as const, marginLeft: 12 }}>
              {totalPoints} / {phases.length * 4} checkpoints answered
            </div>
          )}
        </div>
        <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.55 }}>{verdictText()}</div>
      </div>

      {/* Chart */}
      {answered.length >= 1 && (
        <div style={{ marginBottom: 16, background: "white", borderRadius: 10, border: "1px solid #e9ecef", padding: "14px 16px 4px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>
            C.I.I. Trend — All Checkpoints
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
            <defs>
              <linearGradient id="cii-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#22c55e" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            {/* Grid */}
            {[0, 5, 7, 10].map(v => (
              <g key={v}>
                <line x1={PL} y1={yOf(v)} x2={W - PR} y2={yOf(v)}
                  stroke={v === 7 ? "#22c55e" : "#f3f4f6"}
                  strokeWidth={v === 7 ? 1.5 : 1}
                  strokeDasharray={v === 7 ? "5 4" : undefined} />
                <text x={PL - 4} y={yOf(v) + 4} textAnchor="end" fontSize={9}
                  fill={v === 7 ? "#16a34a" : "#d1d5db"}>
                  {v === 7 ? "7▸" : v}
                </text>
              </g>
            ))}
            <text x={W - PR} y={yOf(7) - 5} textAnchor="end" fontSize={9} fill="#16a34a" fontStyle="italic">thriving</text>

            {/* Phase labels */}
            {phases.map((phid, i) => (
              <text key={phid} x={xOf(i)} y={H - 2} textAnchor="middle" fontSize={9} fill="#9ca3af">
                {(PHASE_LABEL[phid] || phid).replace("Month ", "Mo ")}
              </text>
            ))}

            {/* Area fill */}
            {areaPath && <path d={areaPath} fill="url(#cii-area-grad)" />}

            {/* Trend line */}
            {pts.length >= 2 && (
              <polyline points={polyPts} fill="none" stroke="#22c55e" strokeWidth={2.5}
                strokeLinejoin="round" strokeLinecap="round" />
            )}

            {/* Future-phase placeholder rings */}
            {phaseData.filter(p => !p.detail).map(p => (
              <circle key={p.phid} cx={xOfPh(p.phid)} cy={yOf(5)} r={4.5}
                fill="none" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="2 2" />
            ))}

            {/* Data dots + score labels */}
            {answered.map(p => {
              const cx = xOfPh(p.phid), cy = yOf(p.detail.avg);
              const c  = scoreColor(p.detail.avg);
              return (
                <g key={p.phid}>
                  <circle cx={cx} cy={cy} r={7} fill="white" stroke={c} strokeWidth={2.5} />
                  <text x={cx} y={cy - 12} textAnchor="middle" fontSize={10} fontWeight="700" fill={c}>
                    {p.detail.avg.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </svg>

          <div style={{ display: "flex", gap: 14, fontSize: 10, color: "#9ca3af", marginTop: 2, justifyContent: "flex-end" }}>
            <span><span style={{ color: "#16a34a" }}>──</span> Thriving threshold (7.0)</span>
            <span style={{ color: "#d1d5db" }}>○ Future-Scheduled</span>
          </div>
        </div>
      )}

      {/* Reverse-chrono phase cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cards.map(card => {
          const { phid, label, detail } = card;
          const hasData = detail !== null;
          const isExp   = expanded === phid;
          const lbColor = hasData ? scoreColor(detail.avg) : "#e2e8f0";

          return (
            <div key={phid}
              style={{
                background: hasData ? scoreBg(detail.avg) : "white",
                borderRadius: 10,
                border: "1px solid " + (hasData ? lbColor + "55" : "#e9ecef"),
                borderLeft: `4px solid ${lbColor}`,
                opacity: hasData ? 1 : 0.52,
                cursor: hasData ? "pointer" : "default",
                overflow: "hidden",
                transition: "opacity 100ms",
              }}
              onClick={() => hasData && setExpanded(isExp ? null : phid)}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px" }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1c2b3a" }}>{label}</span>
                  {!hasData && <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}>Future-Scheduled</span>}
                </div>
                {hasData && (
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: scoreColor(detail.avg),
                      background: scoreColor(detail.avg) + "18", padding: "2px 8px", borderRadius: 20,
                    }}>{bandLabel(detail.avg)}</span>
                    <span style={{ fontSize: 22, fontWeight: 700, color: scoreColor(detail.avg) }}>{detail.avg.toFixed(1)}</span>
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>/ 10</span>
                    <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 2 }}>{isExp ? "▲" : "▼"}</span>
                  </div>
                )}
              </div>

              {/* Mini progress bars (always visible when answered) */}
              {hasData && (
                <div style={{ padding: "0 16px 10px", display: "flex", gap: 5 }}>
                  {detail.entries.map(e => (
                    <div key={e.id} style={{ flex: 1, textAlign: "center" as const }}>
                      <div style={{ height: 5, background: "#e9ecef", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: (e.score * 10) + "%", background: scoreColor(e.score), borderRadius: 3, transition: "width 0.3s" }} />
                      </div>
                      <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>{e.score}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Expanded question detail */}
              {hasData && isExp && (
                <div style={{ borderTop: "1px solid " + lbColor + "30", background: "rgba(255,255,255,0.75)", padding: "12px 16px" }}>
                  {detail.entries.map((e, i) => (
                    <div key={e.id} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      marginBottom: i < detail.entries.length - 1 ? 12 : 0,
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: scoreColor(e.score), flexShrink: 0, marginTop: 4 }} />
                      <div style={{ flex: 1, fontSize: 12, color: "#374151", lineHeight: 1.45 }}>{e.text}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <div style={{ width: 64, height: 5, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: (e.score * 10) + "%", background: scoreColor(e.score), borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(e.score), minWidth: 16 }}>{e.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

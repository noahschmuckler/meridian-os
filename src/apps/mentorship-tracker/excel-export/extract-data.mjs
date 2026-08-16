// extract-data.mjs — pulls the curriculum/questionnaire constants out of
// MentorshipTrackerApp.tsx + the master-checklist seed JSON, and writes them
// as one curriculum-data.json for the Excel workbook generator
// (build_workbooks.py). Run from anywhere:
//
//   node src/apps/mentorship-tracker/excel-export/extract-data.mjs
//
// The TSX constants are pure data literals, so we slice them out by name and
// evaluate them — no bundler needed. If a constant is renamed or stops being
// a literal, this script fails loudly rather than emitting stale data.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = join(here, "..");
const tsx = readFileSync(join(appDir, "MentorshipTrackerApp.tsx"), "utf8");
const prodTsx = readFileSync(join(appDir, "ProductivityPanel.tsx"), "utf8");
const masterChecklist = JSON.parse(
  readFileSync(join(appDir, "../../data/seed/mentorship-master-checklist.json"), "utf8"),
);

// Slice `const NAME = [ ... ];` (or { ... };) from source and evaluate it.
function extract(src, name, open = "[", close = "]") {
  const marker = `const ${name} = ${open}`;
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`Could not find "const ${name}" in source`);
  const from = start + marker.length - 1;
  // Walk to the matching close bracket, skipping strings.
  let depth = 0, i = from, inStr = null;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === "\\") i++;
      else if (ch === inStr) inStr = null;
    } else if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
    else if (ch === open) depth++;
    else if (ch === close) { depth--; if (depth === 0) break; }
    else if (ch === "/" && src[i + 1] === "/") { i = src.indexOf("\n", i); }
    else if (ch === "/" && src[i + 1] === "*") { i = src.indexOf("*/", i) + 1; }
  }
  if (depth !== 0) throw new Error(`Unbalanced brackets extracting ${name}`);
  const literal = src.slice(from, i + 1);
  return new Function(`return (${literal});`)();
}

const data = {
  generated_from: "MentorshipTrackerApp.tsx + ProductivityPanel.tsx + mentorship-master-checklist.json",
  master_checklist: masterChecklist,
  mentor_physician_track: extract(tsx, "MP_PHYS"),
  mentor_apc_track: extract(tsx, "MP_APC"),
  office_manager_reviews: extract(tsx, "OP"),
  provider_questionnaires: extract(tsx, "QP"),
  seed_providers: extract(tsx, "SEED_PROVS"),
  seed_users: extract(tsx, "USERS"),
  productivity_metrics: extract(prodTsx, "PROD_METRICS"),
  // Demo score seeds (from makeSeedQA) — keyed provider -> phase -> avg score.
  seed_scores: extract(tsx, "scores", "{", "}"),
  seed_om_scores: extract(tsx, "omScores", "{", "}"),
  seed_cii_scores: extract(tsx, "ciiScores", "{", "}"),
};

const out = join(here, "curriculum-data.json");
writeFileSync(out, JSON.stringify(data, null, 2));
console.log(`Wrote ${out}`);
console.log(`  master checklist items: ${masterChecklist.items.length}`);
console.log(`  mentor physician phases: ${data.mentor_physician_track.length}`);
console.log(`  mentor APC phases: ${data.mentor_apc_track.length}`);
console.log(`  office manager checkpoints: ${data.office_manager_reviews.length}`);
console.log(`  questionnaire checkpoints: ${data.provider_questionnaires.length}`);
console.log(`  seed providers: ${data.seed_providers.length}`);

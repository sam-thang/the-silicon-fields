// Applies an approved research batch to the per-project files in data/projects/.
// Usage: node scripts/apply_date_batch.mjs scripts/date_batches/<batch>.json
// Adds sources (skipping URLs already present), merges a `dates` block (kept
// right after `expected_completion`), and applies approved status/field changes.
// Batches 1-5 (Nov 2026) were applied to the old single data/projects.json.
import { existsSync, readFileSync } from "node:fs";
import { projectPath, saveProject } from "./lib/projects.mjs";

const batchPath = process.argv[2];
if (!batchPath) throw new Error("Pass a batch file path");
const batch = JSON.parse(readFileSync(batchPath, "utf8"));

for (const [slug, change] of Object.entries(batch.projects)) {
  const file = projectPath(slug);
  if (!existsSync(file)) throw new Error(`Unknown slug: ${slug}`);
  const p = JSON.parse(readFileSync(file, "utf8"));

  for (const s of change.add_sources ?? []) {
    if (p.sources.some((x) => x.url === s.url)) continue;
    if (p.sources.some((x) => x.id === s.id)) throw new Error(`${slug}: duplicate source id ${s.id}`);
    p.sources.push({ ...s, accessed: batch.accessed });
  }

  const ids = new Set(p.sources.map((s) => s.id));
  for (const [kind, d] of Object.entries(change.dates ?? {})) {
    for (const id of d.source_ids) {
      if (!ids.has(id)) throw new Error(`${slug}: dates.${kind} cites unknown source ${id}`);
    }
  }

  for (const [k, v] of Object.entries(change.set ?? {})) p[k] = v;
  if (change.status) p.status = change.status;
  if (change.status_note) p.status_note = change.status_note;
  if (change.review_append) {
    p.review_notes = [p.review_notes, change.review_append].filter(Boolean).join(" ");
  }

  const rebuilt = {};
  for (const [k, v] of Object.entries(p)) {
    if (k === "dates") continue;
    rebuilt[k] = v;
    if (k === "expected_completion") rebuilt.dates = { ...(p.dates ?? {}), ...change.dates };
  }
  rebuilt.last_verified = batch.accessed;
  saveProject(rebuilt);
}

console.log(`Applied ${Object.keys(batch.projects).length} projects from ${batchPath}`);

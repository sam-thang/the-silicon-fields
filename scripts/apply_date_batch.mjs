// Applies an approved date-research batch to data/projects.json.
// Usage: node scripts/apply_date_batch.mjs scripts/date_batches/batch1.json
// Adds sources (skipping URLs already present), inserts a `dates` block after
// `expected_completion`, and applies any approved status changes.
import { readFileSync, writeFileSync } from "node:fs";

const DATA = new URL("../data/projects.json", import.meta.url);
const batchPath = process.argv[2];
if (!batchPath) throw new Error("Pass a batch file path");

const batch = JSON.parse(readFileSync(batchPath, "utf8"));
const projects = JSON.parse(readFileSync(DATA, "utf8"));
const bySlug = new Map(projects.map((p) => [p.slug, p]));

for (const [slug, change] of Object.entries(batch.projects)) {
  const p = bySlug.get(slug);
  if (!p) throw new Error(`Unknown slug: ${slug}`);

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

  if (change.status) p.status = change.status;
  if (change.status_note) p.status_note = change.status_note;
  if (change.review_append) {
    p.review_notes = [p.review_notes, change.review_append].filter(Boolean).join(" ");
  }

  // Rebuild the record so `dates` sits right after `expected_completion`.
  const rebuilt = {};
  for (const [k, v] of Object.entries(p)) {
    if (k === "dates") continue;
    rebuilt[k] = v;
    if (k === "expected_completion") rebuilt.dates = { ...(p.dates ?? {}), ...change.dates };
  }
  p.last_verified = batch.accessed;
  rebuilt.last_verified = batch.accessed;
  bySlug.set(slug, rebuilt);
}

const out = projects.map((p) => bySlug.get(p.slug));
writeFileSync(DATA, JSON.stringify(out, null, 2) + "\n");
console.log(`Applied ${Object.keys(batch.projects).length} projects from ${batchPath}`);

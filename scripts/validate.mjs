// Validates every record in data/projects/ against the JSON Schema plus the
// cross-field rules from CLAUDE.md. Exits non-zero on any error (used in CI).
// Usage: npm run validate
import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { loadProjects, SCHEMA_PATH, BUILDING_STATUSES, EVIDENCE_KINDS, periodStart } from "./lib/projects.mjs";

const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateSchema = ajv.compile(schema);

const PRECISION_PATTERN = { year: /^\d{4}$/, quarter: /^\d{4}-Q[1-4]$/, month: /^\d{4}-\d{2}$/ };
const errors = [];
const warnings = [];
const seenSlugs = new Set();

for (const { file, slug, record: p } of loadProjects()) {
  const err = (msg) => errors.push(`${file}: ${msg}`);

  if (!validateSchema(p)) {
    for (const e of validateSchema.errors) err(`schema ${e.instancePath || "/"} ${e.message}`);
    continue; // cross-field checks assume a schema-valid record
  }

  if (p.slug !== slug) err(`slug "${p.slug}" does not match file name`);
  if (seenSlugs.has(p.slug)) err(`duplicate slug`);
  seenSlugs.add(p.slug);

  // Sources
  const sources = new Map();
  for (const s of p.sources) {
    if (sources.has(s.id)) err(`duplicate source id "${s.id}"`);
    sources.set(s.id, s);
  }
  const isEvidence = (id) => EVIDENCE_KINDS.has(sources.get(id)?.kind);

  // Capacity
  const { low, high, type } = p.capacity_mw;
  if ((low === null) !== (high === null)) err("capacity low/high must both be set or both be null");
  if (low !== null && low > high) err(`capacity low (${low}) > high (${high})`);
  if (low === null && type !== "unknown") err(`capacity is null but type is "${type}" (use "unknown")`);

  // Dates
  const d = p.dates;
  const iso = {};
  for (const [kind, dated] of Object.entries(d)) {
    if (!PRECISION_PATTERN[dated.precision].test(dated.value)) {
      err(`dates.${kind}: value "${dated.value}" does not match precision "${dated.precision}"`);
    }
    for (const id of dated.source_ids) if (!sources.has(id)) err(`dates.${kind} cites unknown source "${id}"`);
    if (!dated.source_ids.some(isEvidence)) {
      err(`dates.${kind} needs at least one primary, news or satellite source (trackers alone are not enough)`);
    }
    if (dated.basis && kind !== "construction_start") err(`dates.${kind}: "basis" is only allowed on construction_start`);
    iso[kind] = periodStart(dated.value);
    if (iso[kind] > p.last_verified) err(`dates.${kind} (${dated.value}) is after last_verified (${p.last_verified})`);
  }
  if (Object.keys(d).length === 0) err("record has no dates; the timeline cannot place it");
  if (iso.operational && iso.construction_start && iso.operational < iso.construction_start) {
    err("dates.operational is before dates.construction_start");
  }

  // Status ↔ dates consistency (never call something under construction without a source)
  if (BUILDING_STATUSES.has(p.status) && !d.construction_start && !d.operational) {
    err(`status "${p.status}" needs dates.construction_start or dates.operational`);
  }
  if ((p.status === "operational" || p.status === "partially_operational") && !d.operational) {
    err(`status "${p.status}" needs dates.operational`);
  }
  if (["announced", "permitting"].includes(p.status) && (d.construction_start || d.operational)) {
    err(`status "${p.status}" but has construction/operational dates; update the status`);
  }
  if (p.status === "paused" && !d.paused) err(`status "paused" needs dates.paused`);
  if (p.status === "cancelled" && !d.cancelled) err(`status "cancelled" needs dates.cancelled`);
  if (d.paused && p.status !== "paused") err(`has dates.paused but status is "${p.status}"`);

  // Local context references
  for (const lc of p.local_context ?? []) {
    if (!sources.has(lc.source_id)) err(`local_context cites unknown source "${lc.source_id}"`);
  }

  // Publication rules
  if (p.approved) {
    if (p.verification === "tracker_only") err("approved but verification is tracker_only (never publish tracker-only records)");
    if (![...sources.values()].some((s) => EVIDENCE_KINDS.has(s.kind))) {
      err("approved but has no primary, news or satellite source");
    }
    if (p.verification === "primary" && ![...sources.values()].some((s) => s.kind === "primary")) {
      err(`verification "primary" but no source has kind "primary"`);
    }
  }

  if (p.review_notes?.trim()) warnings.push(`${file}: review note: ${p.review_notes.trim()}`);
}

const count = seenSlugs.size;
if (warnings.length && process.argv.includes("--verbose")) console.log(warnings.join("\n") + "\n");
if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n✗ ${errors.length} error(s) in ${count} record(s).`);
  process.exit(1);
}
console.log(`✓ ${count} records valid. ${warnings.length} with open review notes (run with --verbose to list).`);

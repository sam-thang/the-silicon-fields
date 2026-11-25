// Shared helpers for reading and writing project records in data/projects/<slug>.json.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

export const ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const PROJECTS_DIR = join(ROOT, "data", "projects");
export const SCHEMA_PATH = join(ROOT, "data", "schema", "project.schema.json");

export function projectPath(slug) {
  return join(PROJECTS_DIR, `${slug}.json`);
}

/** Load every record as { file, slug, record }, sorted by file name. */
export function loadProjects() {
  return readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => ({
      file,
      slug: file.replace(/\.json$/, ""),
      record: JSON.parse(readFileSync(join(PROJECTS_DIR, file), "utf8")),
    }));
}

export function saveProject(record) {
  writeFileSync(projectPath(record.slug), JSON.stringify(record, null, 2) + "\n");
}

/** Statuses that are evidence of construction having started. */
export const BUILDING_STATUSES = new Set(["under_construction", "partially_operational", "operational"]);

/** Source kinds that count as evidence (trackers and secondary blogs never do on their own). */
export const EVIDENCE_KINDS = new Set(["primary", "news", "satellite"]);

/**
 * Convert a dated value ("2024", "2024-07", "2024-Q3") to the ISO date of the
 * start of that period. The timeline uses period starts; the UI shows the
 * precision ("2024", "Q3 2024") so a year-precision date is never presented
 * as a specific month.
 */
export function periodStart(value) {
  const m = /^(\d{4})(?:-(\d{2})|-Q([1-4]))?$/.exec(value);
  if (!m) throw new Error(`Bad date value: ${value}`);
  const [, y, month, q] = m;
  const mm = month ?? (q ? String((Number(q) - 1) * 3 + 1).padStart(2, "0") : "01");
  return `${y}-${mm}-01`;
}

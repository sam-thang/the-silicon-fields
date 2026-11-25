// Adds new owner-approved project records from a batch under scripts/project_batches/.
// Usage:
//   node scripts/add_projects.mjs scripts/project_batches/<batch>.json --check   (dry run: validate only)
//   node scripts/add_projects.mjs scripts/project_batches/<batch>.json           (write, after approval)
// Each record gets approved: true, verification "news" unless set, `accessed` on every source and
// last_verified = batch.accessed. Existing slugs are refused (use apply_date_batch.mjs to change them).
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { projectPath, saveProject, ROOT } from "./lib/projects.mjs";

const [batchPath, flag] = process.argv.slice(2);
if (!batchPath) throw new Error("Pass a batch file path");
const check = flag === "--check";
const batch = JSON.parse(readFileSync(batchPath, "utf8"));

const ORDER = ["slug", "name", "owner", "developer", "tenant", "country", "region", "locality", "lat", "lon", "location_precision", "capacity_mw", "status", "status_note", "expected_completion", "dates", "investment_usd", "area_acres", "imagery", "local_context", "sources", "verification", "approved", "review_notes", "last_verified"];

const records = batch.projects.map((p) => {
  if (existsSync(projectPath(p.slug))) throw new Error(`${p.slug} already exists`);
  const r = {
    ...p,
    sources: p.sources.map((s) => ({ ...s, accessed: s.accessed ?? batch.accessed })),
    verification: p.verification ?? "news",
    approved: true,
    last_verified: batch.accessed,
  };
  return Object.fromEntries(ORDER.filter((k) => r[k] !== undefined).map((k) => [k, r[k]]));
});

if (check) {
  // Validate in a scratch copy of the repo's data folder so nothing real changes.
  const dir = mkdtempSync(join(tmpdir(), "sf-batch-"));
  try {
    execFileSync(process.execPath, ["-e", `
      const fs=require("fs"),path=require("path");
      fs.cpSync(${JSON.stringify(join(ROOT, "data"))}, ${JSON.stringify(join(dir, "data"))}, {recursive:true});
      fs.cpSync(${JSON.stringify(join(ROOT, "scripts"))}, ${JSON.stringify(join(dir, "scripts"))}, {recursive:true});
      fs.symlinkSync(${JSON.stringify(join(ROOT, "node_modules"))}, ${JSON.stringify(join(dir, "node_modules"))}, "junction");
      fs.copyFileSync(${JSON.stringify(join(ROOT, "package.json"))}, ${JSON.stringify(join(dir, "package.json"))});`]);
    for (const r of records) writeFileSync(join(dir, "data", "projects", `${r.slug}.json`), JSON.stringify(r, null, 2) + "\n");
    const out = execFileSync(process.execPath, [join(dir, "scripts", "validate.mjs")], { encoding: "utf8" });
    console.log(out.trim());
    console.log(`✓ Dry run: ${records.length} new records would validate.`);
  } catch (e) {
    console.error(e.stdout || "", e.stderr || e.message);
    process.exitCode = 1;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
} else {
  for (const r of records) saveProject(r);
  console.log(`Added ${records.length} projects from ${batchPath}`);
}

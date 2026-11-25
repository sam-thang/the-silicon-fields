// One-off migration (2026-11-25): data/projects.json -> data/projects/<slug>.json.
// - renames `users` to `tenant` (CLAUDE.md data model)
// - classifies sources that have no `kind`, by publisher (see KIND_BY_PUBLISHER)
// Run once: node scripts/migrate_split.mjs
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { ROOT, PROJECTS_DIR, saveProject } from "./lib/projects.mjs";

const KIND_BY_PUBLISHER = {
  // Companies, governments, regulators and their press-release wires.
  primary: [
    "Microsoft", "Amazon", "OpenAI", "IREN", "IREN (GlobeNewswire)", "NEOM", "Business Wire",
    "Google Cloud Press Corner", "Utah Governor's Office of Economic Opportunity",
    "Texas Commission on Environmental Quality", "Pennsylvania Department of General Services",
  ],
  // Established news and trade press.
  news: [
    "Data Center Frontier", "DatacenterDynamics", "Data Center Knowledge", "Fierce Network",
    "NEI Magazine", "Utah Business", "EnergyTech", "Dallas Innovates", "The National", "TechRepublic",
    "Free Press Journal", "Outlook Business", "Zawya / Reuters", "MEED", "The Register",
  ],
  // Epoch AI pages are satellite-imagery based (owner rule, 2026-11-25).
  satellite: ["Epoch AI"],
  // Listings and trackers: never evidence on their own.
  tracker: ["Baxtel", "Cleanview", "Electric Choice", "Blackridge Research", "LLM Pulse", "Finish Line"],
  // Blogs and newsletters summarising others: never evidence on their own.
  secondary: ["New Market Pitch", "Smart Labor Management", "Glenn K. Lockwood", "Measured AI"],
};

const kindOf = new Map(Object.entries(KIND_BY_PUBLISHER).flatMap(([k, pubs]) => pubs.map((p) => [p, k])));
const SEED = join(ROOT, "data", "projects.json");
if (!existsSync(SEED)) throw new Error("data/projects.json not found; migration already run?");

const projects = JSON.parse(readFileSync(SEED, "utf8"));
mkdirSync(PROJECTS_DIR, { recursive: true });

for (const p of projects) {
  const out = {};
  for (const [k, v] of Object.entries(p)) out[k === "users" ? "tenant" : k] = v;
  for (const s of out.sources) {
    if (s.kind) continue;
    const kind = kindOf.get(s.publisher);
    if (!kind) throw new Error(`${p.slug}: no kind mapping for publisher "${s.publisher}"`);
    // Keep key order stable: insert kind before accessed.
    const { accessed, ...rest } = s;
    Object.keys(s).forEach((k) => delete s[k]);
    Object.assign(s, rest, { kind, accessed });
  }
  saveProject(out);
}

rmSync(SEED);
console.log(`Split ${projects.length} records into data/projects/ and removed data/projects.json`);

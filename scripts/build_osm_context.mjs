// Pulls the existing data centers mapped in OpenStreetMap into
// data/context/osm-datacenters.json: the faint "existing data center world" layer under
// the curated project columns. Context only: never counted in totals, no capacity.
// Data © OpenStreetMap contributors, ODbL 1.0 (see data/context/README.md).
// Usage: npm run context:osm
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib/projects.mjs";

const QUERY = `[out:json][timeout:240];
(nwr["telecom"="data_center"];nwr["building"="data_center"];);
out center tags qt;`;
const ENDPOINTS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
const MERGE_M = 250; // a building and a site tagged separately count once

async function fetchOverpass() {
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "User-Agent": "the-silicon-fields-data-script", "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: QUERY }),
        signal: AbortSignal.timeout(300_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return { json, url };
    } catch (e) {
      console.warn(`  ${url} failed: ${e.message}`);
    }
  }
  throw new Error("All Overpass endpoints failed");
}

const { json, url } = await fetchOverpass();
const raw = json.elements
  .map((e) => ({ id: `${e.type[0]}${e.id}`, lat: e.lat ?? e.center?.lat, lon: e.lon ?? e.center?.lon }))
  .filter((e) => Number.isFinite(e.lat) && Number.isFinite(e.lon));

// Merge points closer than MERGE_M (grid hash + neighbour check).
const cell = MERGE_M / 111_000;
const grid = new Map();
const kept = [];
const dist = (a, b) => {
  const dx = (a.lon - b.lon) * Math.cos((a.lat * Math.PI) / 180);
  return Math.hypot(dx, a.lat - b.lat) * 111_000;
};
for (const p of raw.sort((a, b) => a.id.localeCompare(b.id))) {
  const gx = Math.floor(p.lon / cell), gy = Math.floor(p.lat / cell);
  let dup = false;
  for (let dx = -1; dx <= 1 && !dup; dx++) {
    for (let dy = -1; dy <= 1 && !dup; dy++) {
      for (const q of grid.get(`${gx + dx},${gy + dy}`) ?? []) if (dist(p, q) < MERGE_M) { dup = true; break; }
    }
  }
  if (dup) continue;
  const key = `${gx},${gy}`;
  grid.set(key, [...(grid.get(key) ?? []), p]);
  kept.push(p);
}

const out = {
  source: "OpenStreetMap: telecom=data_center or building=data_center",
  license: "ODbL 1.0, © OpenStreetMap contributors",
  osm_base: json.osm3s?.timestamp_osm_base ?? null,
  endpoint: url,
  fetched: new Date().toISOString().slice(0, 10),
  merged_within_m: MERGE_M,
  count: kept.length,
  // [lon, lat, osm id] rounded to ~100 m: the layer is context, not site locations.
  points: kept.map((p) => [Math.round(p.lon * 1000) / 1000, Math.round(p.lat * 1000) / 1000, p.id]),
};
const dir = join(ROOT, "data", "context");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "osm-datacenters.json"), JSON.stringify(out) + "\n");
console.log(`✓ ${raw.length} OSM features -> ${kept.length} points (merged within ${MERGE_M} m), data as of ${out.osm_base}`);

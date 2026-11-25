// Compiles approved records in data/projects/ into data/projects.geojson for the
// globe, list and cards. Run validate first (npm run data does both).
// Usage: npm run build:geojson
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadProjects, periodStart } from "./lib/projects.mjs";

const OUT = join(ROOT, "data", "projects.geojson");
const APPROXIMATE = new Set(["region", "state"]);

/**
 * Column height rule (methodology page must state it):
 * - operational: the low figure (what is running)
 * - everything else (announced, permitting, under construction, partially
 *   operational, paused): the high figure, labelled "up to"
 */
function column(p) {
  const { low, high } = p.capacity_mw;
  if (low === null) return { column_mw: null, column_basis: null };
  return p.status === "operational"
    ? { column_mw: low, column_basis: "low" }
    : { column_mw: high, column_basis: "high" };
}

function dateProps(dates) {
  const props = {};
  for (const [kind, d] of Object.entries(dates)) {
    props[`${kind}_date`] = periodStart(d.value);
    props[`${kind}_precision`] = d.precision;
    props[`${kind}_label`] = d.value;
    if (d.basis) props[`${kind}_basis`] = d.basis;
  }
  const all = Object.values(dates).map((d) => periodStart(d.value)).sort();
  props.appears_date = all[0];
  return props;
}

const published = loadProjects()
  .map((x) => x.record)
  .filter((p) => p.approved && p.verification !== "tracker_only");

const features = published.map((p) => ({
  type: "Feature",
  id: p.slug,
  geometry: { type: "Point", coordinates: [p.lon, p.lat] },
  properties: {
    slug: p.slug,
    name: p.name,
    owner: p.owner,
    tenant: p.tenant?.trim() || null,
    country: p.country,
    region: p.region,
    locality: p.locality,
    location_precision: p.location_precision,
    approximate_location: APPROXIMATE.has(p.location_precision),
    status: p.status,
    status_note: p.status_note,
    capacity_low_mw: p.capacity_mw.low,
    capacity_high_mw: p.capacity_mw.high,
    capacity_type: p.capacity_mw.type,
    capacity_disclosed: p.capacity_mw.low !== null,
    ...column(p),
    ...dateProps(p.dates),
    expected_completion: p.expected_completion ?? null,
    source_count: p.sources.length,
    last_verified: p.last_verified,
  },
}));

const geojson = {
  type: "FeatureCollection",
  meta: {
    generated: new Date().toISOString(),
    count: features.length,
    column_rule: "operational: low; all other statuses: high, shown as 'up to'",
    date_rule: "dates are the start of their period; *_precision says how exact they are",
  },
  features,
};

writeFileSync(OUT, JSON.stringify(geojson) + "\n");
console.log(`✓ Wrote ${features.length} features to data/projects.geojson`);

// Builds the dotted-land layer (mockup style): an evenly spaced grid of points on the
// sphere, kept where they fall on land (Natural Earth 1:50m, public domain).
// Output: prototypes/globe/src/land-dots.json  [[lon, lat], ...]
// Usage: node prototypes/globe/build-dots.mjs [spacingDegrees=1.4]
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/land-50m.json"), "utf8"));
const land = feature(topo, topo.objects.land);
const SPACING = Number(process.argv[2] ?? 1.4);

// Polygons as rings with bounding boxes for a quick reject.
const polys = [];
for (const f of land.features) {
  const list = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const rings of list) {
    const xs = rings[0].map((p) => p[0]);
    const ys = rings[0].map((p) => p[1]);
    polys.push({ rings, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] });
  }
}
function inRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function onLand(pt) {
  for (const { rings, box } of polys) {
    if (pt[0] < box[0] || pt[0] > box[2] || pt[1] < box[1] || pt[1] > box[3]) continue;
    if (inRing(pt, rings[0]) && !rings.slice(1).some((h) => inRing(pt, h))) return true;
  }
  return false;
}

const dots = [];
for (let lat = -84 + SPACING / 2; lat < 84; lat += SPACING) {
  // Widen the longitude step toward the poles so dots stay evenly spaced on the sphere.
  const step = SPACING / Math.max(0.05, Math.cos((lat * Math.PI) / 180));
  const n = Math.floor(360 / step);
  const offset = (Math.round(lat / SPACING) % 2) * (step / 2); // stagger rows slightly
  for (let i = 0; i < n; i++) {
    const lon = -180 + offset + i * (360 / n);
    const pt = [Math.round(lon * 100) / 100, Math.round(lat * 100) / 100];
    if (onLand(pt)) dots.push(pt);
  }
}
const out = new URL("./src/land-dots.json", import.meta.url);
writeFileSync(out, JSON.stringify(dots));
console.log(`✓ ${dots.length} land dots at ${SPACING}° spacing`);

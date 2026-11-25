// MapLibre GL JS prototype: globe projection + fill-extrusion columns.
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// MapLibre 6 ships its worker as a separate ES module; let Vite bundle it.
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
maplibregl.setWorkerUrl(workerUrl);
import {
  COLOR, STAGE_COLOR, COLUMN_RADIUS_M, APPROX_RADIUS_M, landDots, heightFor, items, stageAt,
  mountChrome, mountTimeline, createCard, autoRotate, webglAvailable, dimHex, fitGlobe, placeShade,
} from "./shared.js";

const { meter, loadTest } = mountChrome("MapLibre");
const all = items(loadTest);

if (!webglAvailable()) {
  document.querySelector("#globe").innerHTML = `<p class="nowebgl">This browser has no WebGL, so the globe can't be drawn. The site would show the 2D map here.</p>`;
  throw new Error("no webgl");
}

// A circle as a polygon ring (fill-extrusion needs polygons).
function circle(lon, lat, r, n = 16) {
  const ring = [];
  const dLat = (r / 6371000) * (180 / Math.PI);
  const dLon = dLat / Math.cos((lat * Math.PI) / 180);
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * 2 * Math.PI;
    ring.push([lon + Math.cos(a) * dLon, lat + Math.sin(a) * dLat]);
  }
  return [ring];
}
const shapes = new Map(all.map((it) => [it.id, { col: circle(it.lon, it.lat, COLUMN_RADIUS_M), approx: circle(it.lon, it.lat, APPROX_RADIUS_M, 32) }]));

let selectedId = null; // the picked project; the others dim while it is shown

function collections(iso) {
  const cols = [], dots = [], approx = [];
  for (const it of all) {
    const stage = stageAt(it.p, iso);
    if (!stage) continue;
    const dim = selectedId !== null && it.id !== selectedId;
    const props = { id: it.id, stage, color: dim ? dimHex(STAGE_COLOR[stage]) : STAGE_COLOR[stage] };
    if (it.p.column_mw === null) {
      dots.push({ type: "Feature", properties: props, geometry: { type: "Point", coordinates: [it.lon, it.lat] } });
    } else {
      cols.push({ type: "Feature", properties: { ...props, height: heightFor(it.p.column_mw) }, geometry: { type: "Polygon", coordinates: shapes.get(it.id).col } });
    }
    if (it.p.approximate_location) {
      approx.push({ type: "Feature", properties: props, geometry: { type: "Polygon", coordinates: shapes.get(it.id).approx } });
    }
  }
  const fc = (features) => ({ type: "FeatureCollection", features });
  return { cols: fc(cols), dots: fc(dots), approx: fc(approx) };
}

const map = new maplibregl.Map({
  container: "globe",
  center: [-96, 30],
  zoom: innerWidth < 600 ? 1.1 : 2.0,
  pitch: 28,
  maxPitch: 70,
  attributionControl: { compact: true, customAttribution: "Land: Natural Earth" },
  style: {
    version: 8,
    projection: { type: "globe" },
    sky: { "atmosphere-blend": 0 },
    // Flat status colors: no side shading on columns (keeps the Lightness Ladder intact).
    light: { anchor: "viewport", intensity: 0 },
    sources: {
      land: { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "MultiPoint", coordinates: landDots } } },
      cols: { type: "geojson", data: { type: "FeatureCollection", features: [] } },
      dots: { type: "geojson", data: { type: "FeatureCollection", features: [] } },
      approx: { type: "geojson", data: { type: "FeatureCollection", features: [] } },
    },
    layers: [
      // Ocean is transparent: the lit sphere behind the canvas (#shade) shows through.
      { id: "ocean", type: "background", paint: { "background-color": COLOR.ocean, "background-opacity": 0 } },
      {
        id: "land", type: "circle", source: "land",
        paint: {
          "circle-color": COLOR.landDot,
          "circle-radius": ["interpolate", ["exponential", 2], ["zoom"], 0, 0.9, 2, 1.9, 5, 7],
          "circle-pitch-alignment": "map",
          "circle-pitch-scale": "map",
        },
      },
      { id: "approx", type: "fill", source: "approx", paint: { "fill-color": ["get", "color"], "fill-opacity": 0.16 } },
      { id: "dots", type: "circle", source: "dots", paint: { "circle-radius": 4, "circle-color": ["get", "color"], "circle-pitch-alignment": "map" } },
      {
        id: "cols-solid", type: "fill-extrusion", source: "cols", filter: ["!=", ["get", "stage"], "planned"],
        paint: { "fill-extrusion-color": ["get", "color"], "fill-extrusion-height": ["get", "height"], "fill-extrusion-opacity": 1, "fill-extrusion-vertical-gradient": false },
      },
      {
        id: "cols-planned", type: "fill-extrusion", source: "cols", filter: ["==", ["get", "stage"], "planned"],
        paint: { "fill-extrusion-color": ["get", "color"], "fill-extrusion-height": ["get", "height"], "fill-extrusion-opacity": 0.8, "fill-extrusion-vertical-gradient": false },
      },
    ],
  },
});

let currentIso = null;
let ready = false;
function render(iso) {
  currentIso = iso;
  if (!ready) return;
  const c = collections(iso);
  map.getSource("cols").setData(c.cols);
  map.getSource("dots").setData(c.dots);
  map.getSource("approx").setData(c.approx);
}
const timeline = mountTimeline(render);

map.on("load", () => {
  ready = true;
  render(currentIso);
  map.once("idle", () => {
    meter.firstGlobe();
    timeline.autoplay();
  });
});

// Picking: nearest feature within 10 px, so dense clusters stay selectable.
const card = createCard();
const byId = new Map(all.map((it) => [it.id, it]));
const PICK_LAYERS = ["cols-solid", "cols-planned", "dots"];
function pick(point) {
  const r = 10;
  const hits = map.queryRenderedFeatures([[point.x - r, point.y - r], [point.x + r, point.y + r]], { layers: PICK_LAYERS });
  let best = null, bestD = Infinity;
  for (const h of hits) {
    const it = byId.get(h.properties.id);
    const s = map.project([it.lon, it.lat]);
    const d = Math.hypot(s.x - point.x, s.y - point.y);
    if (d < bestD) { best = { it, stage: h.properties.stage }; bestD = d; }
  }
  return best;
}
function select(hit, point) {
  const id = hit ? hit.it.id : null;
  hit ? card.show(hit.it, hit.stage, point.x, point.y) : card.hide();
  if (id !== selectedId) {
    selectedId = id;
    render(currentIso);
  }
}
map.on("mousemove", (e) => {
  const hit = pick(e.point);
  map.getCanvas().style.cursor = hit ? "pointer" : "";
  select(hit, e.point);
});
map.on("click", (e) => select(pick(e.point), e.point));

// Keep the lit sphere behind the canvas fitted to the globe.
function updateShade() {
  const c = map.project(map.getCenter());
  placeShade(fitGlobe(
    ([lng, lat]) => { const p = map.project([lng, lat]); return [p.x, p.y]; },
    ([x, y]) => { const ll = map.unproject([x, y]); return ll ? [ll.lng, ll.lat] : null; },
    [c.x, c.y],
  ));
}
map.on("move", updateShade);
map.on("resize", updateShade);
map.on("load", updateShade);

autoRotate((deg) => {
  const c = map.getCenter();
  map.jumpTo({ center: [c.lng + deg, c.lat] });
});

window.__proto = { map, engine: "maplibre" };

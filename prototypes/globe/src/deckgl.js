// deck.gl prototype: GlobeView + ColumnLayer.
import { Deck, _GlobeView as GlobeView, COORDINATE_SYSTEM } from "@deck.gl/core";
import { ColumnLayer, ScatterplotLayer, BitmapLayer } from "@deck.gl/layers";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { SphereGeometry } from "@luma.gl/engine";
import {
  COLOR, STAGE_COLOR, COLUMN_RADIUS_M, APPROX_RADIUS_M, LAND_DOT_RADIUS_M, landDots, heightFor, items, stageAt, hexToRgb, params,
  mountChrome, mountTimeline, createCard, autoRotate, webglAvailable, dimHex, fitGlobe, placeShade, mountCounter, mountCredit, contextDots, CONTEXT_OPACITY, OSM_CREDIT,
} from "./shared.js";

const { meter, loadTest } = mountChrome("deck.gl");
const counter = mountCounter();
mountCredit(`Land: Natural Earth · ${OSM_CREDIT}`);
const contextColor = [...hexToRgb(COLOR.context), Math.round(255 * CONTEXT_OPACITY)];
const all = items(loadTest);

if (!webglAvailable()) {
  document.querySelector("#globe").innerHTML = `<p class="nowebgl">This browser has no WebGL, so the globe can't be drawn. The site would show the 2D map here.</p>`;
  throw new Error("no webgl");
}

// ?earth=night | satellite: comparison screenshots only (NASA imagery, fetched by fetch-earth.mjs).
const EARTH = {
  night: { url: "earth/night.jpg", desaturate: 0.2, tint: [150, 170, 215] },
  satellite: { url: "earth/day.jpg", desaturate: 0.75, tint: [95, 115, 160] },
}[params.get("earth")];

const rgb = Object.fromEntries(Object.entries(STAGE_COLOR).map(([k, v]) => [k, hexToRgb(v)]));
let viewState = { longitude: -88, latitude: 12, zoom: innerWidth < 600 ? 0.75 : 1.9 };
let iso = null;
let hover = null; // the picked project; the others dim while it is shown
const dimRgb = Object.fromEntries(Object.entries(STAGE_COLOR).map(([k, v]) => [k, hexToRgb(dimHex(v))]));
const colorOf = (v) => (hover && v.it.id !== hover.it.id ? dimRgb : rgb)[v.stage];

function layers() {
  const visible = [];
  for (const it of all) {
    const stage = stageAt(it.p, iso);
    if (stage) visible.push({ it, stage });
  }
  const cols = visible.filter((v) => v.it.p.column_mw !== null);
  const solid = cols.filter((v) => v.stage !== "planned");
  const planned = cols.filter((v) => v.stage === "planned");
  const dots = visible.filter((v) => v.it.p.column_mw === null);
  const approx = visible.filter((v) => v.it.p.approximate_location);
  const common = {
    getPosition: (v) => [v.it.lon, v.it.lat],
    getElevation: (v) => heightFor(v.it.p.column_mw),
    radius: COLUMN_RADIUS_M,
    diskResolution: 14,
    extruded: true,
    pickable: true,
    material: false,
    updateTriggers: { getFillColor: [iso, hover?.it.id], getLineColor: [iso, hover?.it.id] },
  };
  return [
    new SimpleMeshLayer({
      id: "sphere",
      data: [0],
      mesh: new SphereGeometry({ radius: 6.3e6, nlat: 36, nlong: 72 }),
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      getPosition: [0, 0, 0],
      // Invisible, depth only: hides the far side; the lit sphere behind the canvas (#shade) shows through.
      getColor: [0, 0, 0, 0],
      material: false,
    }),
    EARTH
      ? new BitmapLayer({
          id: "earth-image",
          image: EARTH.url,
          bounds: [-180, -90, 180, 90],
          _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
          desaturate: EARTH.desaturate,
          tintColor: EARTH.tint,
        })
      : new ScatterplotLayer({
          id: "land-dots", data: landDots, getPosition: (d) => d, getRadius: LAND_DOT_RADIUS_M,
          radiusMinPixels: 0.6, getFillColor: hexToRgb(COLOR.landDot),
        }),
    // Existing data centers (OpenStreetMap): pale specks, context only.
    new ScatterplotLayer({
      id: "context", data: contextDots, getPosition: (d) => d, radiusUnits: "pixels", getRadius: 1.6,
      getFillColor: contextColor,
    }),
    new ScatterplotLayer({
      id: "approx", data: approx, getPosition: common.getPosition, getRadius: APPROX_RADIUS_M,
      getFillColor: (v) => [...rgb[v.stage], 40], updateTriggers: { getFillColor: iso },
    }),
    new ScatterplotLayer({
      id: "dots", data: dots, pickable: true, getPosition: common.getPosition, radiusUnits: "pixels", getRadius: 4,
      getFillColor: colorOf, updateTriggers: { getFillColor: [iso, hover?.it.id] },
    }),
    new ColumnLayer({ id: "cols-solid", data: solid, ...common, getFillColor: colorOf }),
    // Planned: translucent body plus a crisp outline (DESIGN.md), via the wireframe.
    new ColumnLayer({
      id: "cols-planned", data: planned, ...common, wireframe: true,
      getFillColor: (v) => [...colorOf(v), 100], getLineColor: colorOf,
      parameters: { depthWriteEnabled: false },
    }),
  ];
}

const card = createCard();
const deck = new Deck({
  parent: document.querySelector("#globe"),
  views: new GlobeView({ resolution: 5 }),
  viewState,
  controller: { inertia: true },
  pickingRadius: 10,
  layers: [],
  onViewStateChange: ({ viewState: vs }) => {
    viewState = vs;
    deck.setProps({ viewState });
  },
  getCursor: ({ isDragging }) => (isDragging ? "grabbing" : hover ? "pointer" : "grab"),
  onHover: (info) => showPick(info),
  onClick: (info) => showPick(info),
  onAfterRender: () => {
    meter.firstGlobe();
    updateShade();
  },
});

function showPick(info) {
  const next = info.object ?? null;
  next ? card.show(next.it, next.stage, info.x, info.y) : card.hide();
  if ((next?.it.id ?? null) !== (hover?.it.id ?? null)) {
    hover = next;
    deck.setProps({ layers: layers() });
  }
}

// Keep the lit sphere behind the canvas fitted to the globe (only when the view changes).
let shadeKey = "";
function updateShade() {
  const vp = deck.getViewports()[0];
  if (!vp) return;
  const key = [vp.width, vp.height, viewState.longitude, viewState.latitude, viewState.zoom].join();
  if (key === shadeKey) return;
  shadeKey = key;
  const o = vp.project([viewState.longitude, viewState.latitude, 0]);
  placeShade(fitGlobe(
    (ll) => vp.project([ll[0], ll[1], 0]),
    (xy) => vp.unproject(xy),
    [o[0], o[1]],
  ));
}

function render(nextIso) {
  iso = nextIso;
  counter.update(iso);
  deck.setProps({ layers: layers() });
}
const timeline = mountTimeline(render);
timeline.autoplay();

autoRotate((deg) => {
  viewState = { ...viewState, longitude: viewState.longitude + deg };
  deck.setProps({ viewState });
});

window.__proto = { deck, engine: "deckgl" };

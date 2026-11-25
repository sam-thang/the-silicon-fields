// deck.gl prototype: GlobeView + ColumnLayer.
import { Deck, _GlobeView as GlobeView, COORDINATE_SYSTEM } from "@deck.gl/core";
import { ColumnLayer, ScatterplotLayer, BitmapLayer } from "@deck.gl/layers";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { SphereGeometry } from "@luma.gl/engine";
import {
  COLOR, STAGE_COLOR, COLUMN_RADIUS_M, APPROX_RADIUS_M, LAND_DOT_RADIUS_M, landDots, heightFor, items, stageAt, hexToRgb, params,
  mountChrome, mountTimeline, createCard, autoRotate, webglAvailable,
} from "./shared.js";

const { meter, loadTest } = mountChrome("deck.gl");
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
let hover = null;

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
    updateTriggers: { getFillColor: iso },
  };
  return [
    new SimpleMeshLayer({
      id: "sphere",
      data: [0],
      mesh: new SphereGeometry({ radius: 6.3e6, nlat: 36, nlong: 72 }),
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      getPosition: [0, 0, 0],
      getColor: hexToRgb(COLOR.ocean),
      material: { ambient: 1, diffuse: 0, shininess: 0, specularColor: [0, 0, 0] },
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
    new ScatterplotLayer({
      id: "approx", data: approx, getPosition: common.getPosition, getRadius: APPROX_RADIUS_M,
      getFillColor: (v) => [...rgb[v.stage], 40], updateTriggers: { getFillColor: iso },
    }),
    new ScatterplotLayer({
      id: "dots", data: dots, pickable: true, getPosition: common.getPosition, radiusUnits: "pixels", getRadius: 4,
      getFillColor: (v) => rgb[v.stage], updateTriggers: { getFillColor: iso },
    }),
    new ColumnLayer({ id: "cols-solid", data: solid, ...common, getFillColor: (v) => rgb[v.stage] }),
    // Planned: translucent body plus a crisp outline (DESIGN.md), via the wireframe.
    new ColumnLayer({
      id: "cols-planned", data: planned, ...common, wireframe: true,
      getFillColor: [...rgb.planned, 100], getLineColor: rgb.planned,
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
  onAfterRender: () => meter.firstGlobe(),
});

function showPick(info) {
  hover = info.object ?? null;
  hover ? card.show(hover.it, hover.stage, info.x, info.y) : card.hide();
}

function render(nextIso) {
  iso = nextIso;
  deck.setProps({ layers: layers() });
}
const timeline = mountTimeline(render);
timeline.autoplay();

autoRotate((deg) => {
  viewState = { ...viewState, longitude: viewState.longitude + deg };
  deck.setProps({ viewState });
});

window.__proto = { deck, engine: "deckgl" };

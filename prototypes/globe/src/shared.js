// Shared by both engine prototypes: data, timeline status, colors, fps meter,
// timeline UI and the hover card. Engines only differ in how they draw.
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-grotesk/700.css";
import "./style.css";
import raw from "../../../data/projects.geojson?raw";
// Dotted land, as in the mockup (built by build-dots.mjs from Natural Earth 1:50m).
import landDots from "./land-dots.json";
export { landDots };
import factors from "../../../data/factors.json";

export const params = new URLSearchParams(location.search);
export const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// DESIGN.md tokens (status colors and surfaces).
export const COLOR = {
  construction: "#FFC233",
  planned: "#6FB4FF",
  operational: "#DCE3EE",
  paused: "#6B7280",
  ocean: "#16294A",
  landDot: "#4A6290", // DESIGN.md Land Dot
};
export const LAND_DOT_RADIUS_M = 26000;
export const STAGE_LABEL = {
  planned: "Planned",
  construction: "Under construction",
  partial: "Under construction · partly online",
  operational: "Operational",
  paused: "Paused",
};
// Stage -> column color. Partly online stays amber: it is still being built.
export const STAGE_COLOR = {
  planned: COLOR.planned,
  construction: COLOR.construction,
  partial: COLOR.construction,
  operational: COLOR.operational,
  paused: COLOR.paused,
};
export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const geojson = JSON.parse(raw);

// Column height: linear in column_mw. The tallest project sets MAX_HEIGHT_M.
export const MAX_MW = Math.max(...geojson.features.map((f) => f.properties.column_mw ?? 0));
export const MAX_HEIGHT_M = Number(params.get("h") ?? 2500) * 1000; // ?h= tallest column in km
export const heightFor = (mw) => (mw / MAX_MW) * MAX_HEIGHT_M;
export const COLUMN_RADIUS_M = 28000;
export const APPROX_RADIUS_M = 160000;

// ---- Timeline: month index 0 = 2020-01 ... 131 = 2030-12 ----
export const MONTHS = 132;
export const monthIso = (i) => `${2020 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}-01`;
const lastVerified = geojson.features.map((f) => f.properties.last_verified).sort().at(-1);
export const TODAY_INDEX = (Number(lastVerified.slice(0, 4)) - 2020) * 12 + Number(lastVerified.slice(5, 7)) - 1;

/** Status of a project at a date, from its sourced dates. null = not on the globe yet. */
export function stageAt(p, iso) {
  if (!p.appears_date || iso < p.appears_date) return null;
  if (p.cancelled_date && iso >= p.cancelled_date) return null;
  if (p.paused_date && iso >= p.paused_date) return "paused";
  if (p.operational_date && iso >= p.operational_date) {
    return p.status === "operational" ? "operational" : "partial";
  }
  if (p.construction_start_date && iso >= p.construction_start_date) return "construction";
  return "planned";
}

// ---- Load test: repeat the real projects, labelled, never shown as data ----
export const LOAD_MULTIPLIER = 10;
export function items(loadTest) {
  const base = geojson.features.map((f) => ({
    id: f.id,
    p: f.properties,
    lon: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
    copy: false,
  }));
  if (!loadTest) return base;
  const out = [...base];
  for (let k = 1; k < LOAD_MULTIPLIER; k++) {
    for (const b of base) {
      // Deterministic scatter so runs are comparable.
      const a = (k * 137.5 + b.lon * 7 + b.lat * 13) * (Math.PI / 180);
      out.push({ ...b, id: `${b.id}~${k}`, lon: b.lon + Math.cos(a) * 3 * k, lat: Math.max(-70, Math.min(75, b.lat + Math.sin(a) * 2 * k)), copy: true });
    }
  }
  return out;
}

// ---- Frame meter ----
export function createMeter(el) {
  const frames = [];
  let last = performance.now();
  let firstPaint = null;
  const start = performance.now();
  function tick(now) {
    frames.push(now - last);
    last = now;
    if (frames.length > 180) frames.shift(); // ~3 s at 60 fps
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  setInterval(() => {
    if (frames.length < 10) return;
    const sorted = [...frames].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const worst = sorted[Math.floor(sorted.length * 0.99)];
    el.fps.textContent = Math.round(1000 / median);
    el.worst.textContent = Math.round(1000 / worst);
  }, 500);
  addEventListener("load", () => {
    const res = performance.getEntriesByType("resource");
    const nav = performance.getEntriesByType("navigation")[0];
    const bytes = res.reduce((s, r) => s + (r.transferSize || 0), nav?.transferSize || 0);
    el.weight.textContent = bytes ? `${(bytes / 1024).toFixed(0)} KB` : "cached";
  });
  return {
    firstGlobe() {
      if (firstPaint !== null) return;
      firstPaint = performance.now() - start;
      el.first.textContent = `${(firstPaint / 1000).toFixed(2)} s`;
    },
  };
}

// ---- Page chrome: engine switch, meter, load test toggle ----
export function mountChrome(engine) {
  const other = engine === "MapLibre" ? ["deck.gl", "deckgl.html"] : ["MapLibre", "maplibre.html"];
  const keep = new URLSearchParams(params);
  const loadTest = params.get("load") === "1";
  const toggle = new URLSearchParams(params);
  loadTest ? toggle.delete("load") : toggle.set("load", "1");
  document.querySelector("#chrome").innerHTML = `
    <div class="engine">
      <p class="engine-name">${engine}</p>
      <a class="engine-switch" href="${other[1]}?${keep}">Switch to ${other[0]}</a>
    </div>
    <dl class="meter" aria-live="off">
      <div><dt>fps</dt><dd data-m="fps">–</dd></div>
      <div><dt>worst</dt><dd data-m="worst">–</dd></div>
      <div><dt>first globe</dt><dd data-m="first">–</dd></div>
      <div><dt>transfer</dt><dd data-m="weight">–</dd></div>
    </dl>
    <a class="load-toggle" href="?${toggle}" aria-pressed="${loadTest}">
      ${loadTest ? `Load test on: ${LOAD_MULTIPLIER}× columns, not data` : "Run load test"}
    </a>
    <a class="back" href="index.html">Scorecard</a>`;
  const q = (k) => document.querySelector(`[data-m="${k}"]`);
  const meter = createMeter({ fps: q("fps"), worst: q("worst"), first: q("first"), weight: q("weight") });
  return { meter, loadTest };
}

// ---- Timeline: play once, then rest ----
const ICON_PLAY = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>`;
const ICON_PAUSE = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2"/><rect x="13.5" y="5" width="4" height="14" rx="1.2"/></svg>`;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function mountTimeline(onChange) {
  const el = document.querySelector("#timeline");
  const ticks = [2020, 2022, 2024, 2026, 2028, 2030]
    .map((y) => `<span style="left:${(((y - 2020) * 12) / (MONTHS - 1)) * 100}%">${y}</span>`)
    .join("");
  el.innerHTML = `
    <button class="play" type="button" aria-label="Play timeline">${ICON_PLAY}</button>
    <div class="scrub">
      <input type="range" min="0" max="${MONTHS - 1}" step="1" value="${TODAY_INDEX}" aria-label="Timeline month" />
      <div class="ticks" aria-hidden="true">${ticks}</div>
    </div>
    <p class="now"><span class="now-month"></span> <span class="now-year"></span></p>`;
  const input = el.querySelector("input");
  const btn = el.querySelector(".play");
  const month = el.querySelector(".now-month");
  const year = el.querySelector(".now-year");
  let playing = false;
  let raf = 0;

  function set(i) {
    i = Math.max(0, Math.min(MONTHS - 1, Math.round(i)));
    input.value = i;
    input.style.setProperty("--p", `${(i / (MONTHS - 1)) * 100}%`);
    month.textContent = MONTH_NAMES[i % 12];
    year.textContent = 2020 + Math.floor(i / 12);
    input.setAttribute("aria-valuetext", `${MONTH_NAMES[i % 12]} ${2020 + Math.floor(i / 12)}${i > TODAY_INDEX ? " (expected)" : ""}`);
    el.classList.toggle("future", i > TODAY_INDEX);
    onChange(monthIso(i), i);
  }
  function stop() {
    playing = false;
    cancelAnimationFrame(raf);
    btn.innerHTML = ICON_PLAY;
    btn.setAttribute("aria-label", "Play timeline");
  }
  function play() {
    const from = Number(input.value) >= TODAY_INDEX ? 0 : Number(input.value);
    const duration = ((TODAY_INDEX - from) / TODAY_INDEX) * 7000;
    const t0 = performance.now();
    playing = true;
    btn.innerHTML = ICON_PAUSE;
    btn.setAttribute("aria-label", "Pause timeline");
    const step = (now) => {
      const k = Math.min(1, (now - t0) / duration);
      set(from + (TODAY_INDEX - from) * k);
      if (k < 1 && playing) raf = requestAnimationFrame(step);
      else stop();
    };
    raf = requestAnimationFrame(step);
  }
  btn.addEventListener("click", () => (playing ? stop() : play()));
  input.addEventListener("input", () => {
    stop();
    set(Number(input.value));
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      stop();
      set(Number(input.value) + (e.key === "PageUp" ? 12 : -12));
    }
  });
  addEventListener("keydown", (e) => {
    if (e.code === "Space" && e.target === document.body) {
      e.preventDefault();
      playing ? stop() : play();
    }
  });

  const autoplay = !reducedMotion && params.get("play") !== "0";
  set(autoplay ? 0 : TODAY_INDEX);
  return { autoplay: () => autoplay && play() };
}

// ---- Hover card ----
const fmtGW = (mw) => (mw >= 1000 ? `${(mw / 1000).toFixed(mw % 1000 ? 1 : 0)} GW` : `${mw} MW`);
export function capacityText(p) {
  if (p.column_mw === null) return "Capacity not disclosed";
  return p.column_basis === "high" ? `Up to ${fmtGW(p.column_mw)}` : fmtGW(p.column_mw);
}
export function createCard() {
  const card = document.querySelector("#card");
  return {
    show(item, stage, x, y) {
      const p = item.p;
      card.innerHTML = `
        <p class="card-status"><span class="swatch" style="--c:${STAGE_COLOR[stage]}"></span>${STAGE_LABEL[stage]}${item.copy ? " · load-test copy" : ""}</p>
        <p class="card-name">${p.name}</p>
        <p class="card-meta">${p.owner} · ${p.locality}${p.approximate_location ? " (approximate location)" : ""}</p>
        <p class="card-figure">${capacityText(p)}</p>`;
      card.hidden = false;
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      const left = Math.min(innerWidth - w - 12, Math.max(12, x + 16));
      const top = Math.min(innerHeight - h - 120, Math.max(12, y - h - 12));
      card.style.transform = `translate(${left}px, ${top}px)`;
    },
    hide() {
      card.hidden = true;
    },
  };
}

/**
 * Auto-rotation until the first interaction (off with reduced motion).
 * Real Earth spin: the surface moves west to east, so the view's longitude decreases
 * (US -> Pacific -> East Asia -> India -> Middle East -> Europe).
 */
export function autoRotate(stepFn) {
  let on = !reducedMotion && params.get("rotate") !== "0";
  const stopIt = () => (on = false);
  for (const ev of ["pointerdown", "wheel", "touchstart", "keydown"]) addEventListener(ev, stopIt, { passive: true, capture: true });
  let last = performance.now();
  const loop = (now) => {
    if (on) stepFn(((now - last) / 1000) * -4); // 4 degrees per second, westward view
    last = now;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

// ---- Counter (top left, as in the mockup) ----
// Homes: capacity x hours x utilisation / average US home (data/factors.json, est.).
const F = factors.factors;
const homesPerMW = (1000 * F.hours_per_year.value * F.capacity_utilisation.value) / F.us_home_kwh_per_year.value;
const LEGEND = [
  ["construction", "Under construction", ["construction", "partial"]],
  ["planned", "Planned", ["planned"]],
  ["operational", "Operational", ["operational"]],
  ["paused", "Paused", ["paused"]],
];
const fmt = new Intl.NumberFormat("en-US");
const gw = (mw) => (mw / 1000).toFixed(mw >= 10000 ? 0 : 1);

export function mountCounter() {
  const el = document.createElement("section");
  el.id = "counter";
  el.setAttribute("aria-label", "Totals at the selected date");
  el.innerHTML = `
    <p class="big"><span class="big-num">0</span><span class="big-unit">GW</span></p>
    <p class="lead"></p>
    <ul class="legend">
      ${LEGEND.map(([k, label]) => `<li data-k="${k}"><span class="sw sw-${k}"></span><span class="lg-label">${label}</span><span class="lg-val"></span></li>`).join("")}
    </ul>
    <p class="foot">Column height: capacity, “up to” unless fully operational. Homes: est., at full power, ${fmt.format(F.us_home_kwh_per_year.value)} kWh a year per average US home (EIA 2024).</p>`;
  document.body.append(el);
  // Sit below the prototype's test controls, whatever height they wrap to.
  const place = () => {
    const chrome = document.querySelector("#chrome");
    if (chrome) el.style.top = `${Math.round(chrome.getBoundingClientRect().bottom + (innerWidth < 900 ? 16 : 48))}px`;
  };
  place();
  addEventListener("resize", place);
  document.fonts?.ready.then(place);
  const num = el.querySelector(".big-num");
  const lead = el.querySelector(".lead");
  const vals = Object.fromEntries(LEGEND.map(([k]) => [k, el.querySelector(`[data-k="${k}"] .lg-val`)]));
  return {
    update(iso) {
      const by = { construction: 0, planned: 0, operational: 0, paused: 0 };
      const sites = { construction: 0, planned: 0, operational: 0, paused: 0 };
      let total = 0, projects = 0;
      for (const f of geojson.features) {
        const p = f.properties;
        const stage = stageAt(p, iso);
        if (!stage) continue;
        projects++;
        const mw = p.column_mw ?? 0;
        total += mw;
        const k = stage === "partial" ? "construction" : stage;
        by[k] += mw;
        sites[k]++;
      }
      const [y, m] = iso.split("-");
      const month = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" });
      num.textContent = gw(total);
      const homes = Math.round((total * homesPerMW) / 1e6);
      lead.textContent = `across ${projects} AI megaprojects built, being built or planned, as of ${month} ${y}. Enough for up to ${homes} million US homes (est.).`;
      // A status whose sites have no published capacity says so instead of showing 0 GW.
      for (const [k] of LEGEND) vals[k].textContent = by[k] ? `${gw(by[k])} GW` : sites[k] ? "undisclosed" : "0 GW";
    },
  };
}

/** Attribution line for engines without their own control (deck.gl). */
export function mountCredit(html) {
  const el = document.createElement("p");
  el.id = "credit";
  el.innerHTML = html;
  document.body.append(el);
}

/** Mix a hex color toward the ocean navy: used to dim the other columns while one is picked. */
export function dimHex(hex, k = 0.6) {
  const a = hexToRgb(hex);
  const b = hexToRgb(COLOR.ocean);
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, "0")).join("");
}

// ---- Globe volume (DESIGN.md): lit gradient sphere, 1px edge, faint halo ----
// The engines draw the ocean transparent; this element sits behind the canvas and is
// fitted to the globe's on-screen outline each frame.
const shade = document.createElement("div");
shade.id = "shade";
shade.innerHTML = `<div class="halo"></div><div class="sphere"></div>`;
document.body.prepend(shade);

/**
 * Finds the globe's outline on screen: walks rays out from a point on the globe,
 * binary-searching where a pixel stops round-tripping through unproject/project,
 * then fits a circle through those edge points.
 */
export function fitGlobe(project, unproject, origin) {
  const onGlobe = (x, y) => {
    const ll = unproject([x, y]);
    if (!ll || !Number.isFinite(ll[0]) || !Number.isFinite(ll[1])) return false;
    const p = project(ll);
    return p && Math.hypot(p[0] - x, p[1] - y) < 1.5;
  };
  const pts = [];
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * 2 * Math.PI;
    let lo = 0, hi = 4000;
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2;
      if (onGlobe(origin[0] + Math.cos(a) * mid, origin[1] + Math.sin(a) * mid)) lo = mid;
      else hi = mid;
    }
    if (lo > 2) pts.push([origin[0] + Math.cos(a) * lo, origin[1] + Math.sin(a) * lo]);
  }
  if (pts.length < 6) return null;
  // Least-squares circle fit (Kasa): x² + y² + Dx + Ey + F = 0.
  let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, sz = 0, sxz = 0, syz = 0;
  const n = pts.length;
  for (const [x, y] of pts) {
    const z = x * x + y * y;
    sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; sz += z; sxz += x * z; syz += y * z;
  }
  const M = [[sxx, sxy, sx], [sxy, syy, sy], [sx, sy, n]];
  const v = [-sxz, -syz, -sz];
  const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const d0 = det(M);
  if (!d0) return null;
  const col = (i) => M.map((row, r) => row.map((c, j) => (j === i ? v[r] : c)));
  const D = det(col(0)) / d0, E = det(col(1)) / d0, F = det(col(2)) / d0;
  const cx = -D / 2, cy = -E / 2;
  return { cx, cy, r: Math.sqrt(cx * cx + cy * cy - F) };
}

export function placeShade(fit) {
  if (!fit) return;
  shade.style.setProperty("--cx", `${fit.cx}px`);
  shade.style.setProperty("--cy", `${fit.cy}px`);
  shade.style.setProperty("--r", `${fit.r}px`);
}

export function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

---
version: 1
slug: "prototypes-globe-index-html"
primary_target: "prototypes/globe/index.html"
related_targets: ["prototypes/globe/maplibre.html","prototypes/globe/deckgl.html"]
---

# Surface brief: Globe engine prototypes

Confirmed with the owner 2026-11-25 via `/impeccable shape globe`.

## Job
- Decide MapLibre vs deck.gl on evidence from a real phone. Throwaway test pages, not the home page (the home brief `src-pages-index-astro` owns the final experience).
- Mode: Experience (the globe is the content), test-harness chrome kept minimal.

## Must prove (scored side by side)
1. Smoothness on the owner's recent iPhone: fps while auto-rotating, dragging/zooming and scrubbing; on-screen meter (median and worst). A "load test" toggle repeats the 41 columns ~10x, labelled "load test, not data", because the test phone is above mid-range.
2. Faithful columns: height proportional to `column_mw`; DESIGN.md status colors; planned translucent (+ outline where the engine allows); dot for no disclosed capacity; soft circle at the base for approximate locations; Matador grey.
3. Timeline 2020-2030: recolors from sourced dates (planned -> amber at groundbreaking -> frost when operational -> grey when paused). Plays once, then rests. Reduced motion: no autoplay, no auto-rotation.
4. Picking: tap and hover work in dense Texas / Midwest clusters.
5. Weight: JS + data transfer size, time to first globe.

## Surface
- Navy land shapes on a darker ocean from Natural Earth (public domain) in both prototypes.
- Screenshots of all three Earth styles for the owner: navy land, dimmed NASA Black Marble night lights, muted NASA Blue Marble satellite (licensing noted in `docs/imagery-licensing.md`).

## Delivery
- `prototypes/globe/`: index (scorecard), maplibre, deckgl pages reading `data/projects.geojson`.
- Served on the LAN for the owner's phone (same Wi-Fi), e.g. http://192.168.1.121:5173/.

## Out of scope
- Header, counter, legend, ranked list, cards, search, URL state, 2D fallback (WebGL availability is checked).

## Open decisions (builder must not invent)
- Final engine: the owner's call after testing.
- Column height scale: linear in capacity; tallest (Hyperion 17 GW) vs smallest (214 MW) shown to the owner for judgment.
- Partially operational color on the timeline (prototype uses amber: still building, partly online) to confirm with the owner.

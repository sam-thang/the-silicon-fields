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
- **Dotted land, as in `mockups/desktop-globe-home.html`** (owner decision 2026-11-25, after seeing filled land shapes): an evenly spaced dot grid (~1.4°) on land from Natural Earth 1:50m, dots in Land Dot #4A6290 on the ocean navy. Built by `prototypes/globe/build-dots.mjs`.
- Comparison screenshots of filled navy land, dimmed NASA night lights and muted NASA satellite were shown to the owner (`?earth=night|satellite` on the deck.gl page; NASA public-domain images via Wikimedia Commons).

## Scale: more projects, not context dots (owner decisions 2026-11-25)
- 41 megaprojects alone did not deliver the "wow". An OpenStreetMap layer of ~3,500 existing data centers as pale specks was tried and **rejected by the owner as messy**. Do not reintroduce it.
- Instead the curated set grows to every sourced **100 MW+** project (research batches 6+, owner-approved). Columns stay the only marks on the globe besides land dots.
- The prototypes gain the counter (top left, as in the mockup): GW total and project count following the timeline, the homes line (draft wording, est., from `data/factors.json`), and a legend with status totals. No eyebrow/dateline label (the date goes in the sentence).

## Delivery
- `prototypes/globe/`: index (scorecard), maplibre, deckgl pages reading `data/projects.geojson`.
- Served on the LAN for the owner's phone (same Wi-Fi), e.g. http://192.168.1.121:5173/.

## Out of scope
- Header, ranked list, site cards, search, URL state, 2D fallback (WebGL availability is checked).

## Open decisions (builder must not invent)
- Final engine: the owner's call after testing.
- Column height scale: linear in capacity; tallest (Hyperion 17 GW) vs smallest (214 MW) shown to the owner for judgment.
- Partially operational color on the timeline (prototype uses amber: still building, partly online) to confirm with the owner.

## Outcome (2026-11-25)
- Owner chose **MapLibre GL JS** after testing on an iPhone. deck.gl prototype kept only as a record.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static pages generated from JSON data, with islands for the globe, before/after slider and address search). Globe engine: MapLibre GL JS globe projection with extruded columns (chosen by the owner after phone prototypes, Nov 2026). Node scripts in `scripts/` handle validation, the GeoJSON build and imagery prep. Hosted on Cloudflare Pages. v1 has no database, user accounts or paid services.

## Users

**Primary: curious residents.** They saw a headline or a shared link, usually on a phone, and want to know whether an AI megaproject is coming near them and what it uses. When audiences conflict, this user wins: the home page, globe, site cards and Near me are built for plain-language understanding in seconds.

**Secondary: journalists, planners and local officials.** They want a quick, sourced, citable overview of a project or region. They are served by the dossier pages and the methodology page, not the front door.

**Tertiary: students and researchers** (GIS, planning). They need the definitions, sources and conversion factors to be transparent and reusable.

## Product Purpose

A free, informational site that tracks the world's largest data center construction projects (mostly AI campuses of 100 MW or more) and explains, in plain language, what each one is and what it means for the place where it is built.

The hook: *"How close is the nearest AI megaproject to you, and what does it use?"* Within five seconds a visitor should grasp how many projects have been built, are being built and are planned.

Three layers:
1. **Wow:** the full-screen globe on the home page, with one capacity column per project and a timeline from 2020 to 2030.
2. **Easy:** a compact site card for each project.
3. **Depth:** a sourced dossier page for each project.

Near me runs across all three: enter an address and see the nearest projects, with distances and comparisons.

**What success means for v1:**
- **Shared on social.** Every site card and timeline state has its own URL and a good social preview image.
- **Cited by press.** Journalists and officials use the dossiers and numbers as a reference.
- **Near me gets used.** People search their own location and learn what is nearby.

## Positioning

A curated, sourced, project-level view of the AI data center build-out, at planetary scale and on a timeline. Each project is a discrete object on a globe with its capacity, status and dates. Every number carries a source and a date, and the status labels are strictly defined. Trackers list data centers, and news covers single projects. This site shows the whole scale at once, links it to where the reader lives, and keeps the evidence one tap away.

## Operating Context

- Most traffic arrives from shared links opened on phones. The globe must run smoothly on a mid-range phone, with a 2D map fallback when WebGL performance is poor.
- Journalists and planners use dossiers on desktop as a reference and cite them.
- Data workflow: one JSON record per project in `data/projects/<slug>.json`, validated against a JSON Schema in CI (`scripts/validate.py`) and compiled to `data/projects.geojson` at build time. The owner approves every record and its sources before it is added.
- Imagery: Sentinel-2 cloud-free yearly composites for the before/after views. Higher-resolution imagery is used only where its terms allow (`docs/imagery-licensing.md`).

## Capabilities and Constraints

**v1 scope:** the globe home page with capacity columns, status colors, a timeline animation (2020–2030) and a live counter, plus a ranked list as a secondary view; a site card on tap with a before/after slider; Near me (address geocoding through a free-tier, Nominatim-based service that respects its usage policy, with distances computed in the browser); one dossier per project; a shareable URL and social preview for every card and timeline state; a methodology page.

**Not in v1:** change alerts or newsletter, automated construction-progress detection, an opposition or ballot tracker view, embeddable widgets.

**Locale:** English only. The homes comparison is universal: every visitor sees "US homes" (EIA average, est.), so totals compare the same way wherever a link is shared (owner decision, Nov 2026). Area units switch by the visitor's region: US visitors get acres and US football fields (1.32 acres including end zones); Norwegian visitors get hectares. Wherever no sourced factor exists for a region, the site falls back to plain metric (hectares, GWh). MW and GW are used everywhere. Every factor lives in `data/factors.json` with its source and date.

**Terminology:**
- **Groundbroken** labels the construction start date (e.g. "Groundbroken Dec 2024").
- **Status** must be one of: announced, permitting, under_construction, partially_operational, operational, paused, cancelled. Nothing is called under construction without a source that says so.
- **Capacity type** (planned_campus, it_load_estimate, facility_power_permit, estimate, mixed, unknown) is always labelled. "Planned campus GW" and "IT load MW" are not comparable.

**Data display rules:**
- Where sources disagree, show the range (e.g. "8–10 GW") and name both sources.
- Column height uses `high` for planned sites and `low` for operational ones. The methodology page documents this.
- Records with no capacity figure appear as a small dot labelled "capacity not disclosed".
- Paused projects (e.g. Fermi Project Matador) show their status note and are never presented as active construction.
- Approximate locations (`location_precision` of region, state, county or town) say so on the card. Region- or state-level points get a soft circle instead of a sharp column base.
- Only `approved: true` records are published. `tracker_only` records are never published.
- Water use appears only where a source gives a figure for that site. Estimates are marked "est.".

**Undecided:** refined coordinates (the seed coordinates are approximate and need refining from imagery or filings before launch).

## Brand Commitments

- **Name:** The Silicon Fields. The wordmark is set in caps (THE SILICON FIELDS); running text says "the Silicon Fields". Always *silicon*, never *silicone*. The name names a place, like Silicon Valley or the oil fields; copy never treats it as a pun.
- **Domain:** thesiliconfields.com (groundbroken.com may redirect here).
- **Tagline:** Mapping the land and power behind AI.
- **Copy phrases:** "Welcome to the Silicon Fields", "new in the Silicon Fields this year".
- **Voice:** neutral, factual and numbers-first, never activist. No loaded words ("monster", "destroying"). State the numbers and sources and let readers judge. Dramatic in scale, sober in tone.
- **Independence:** the owner also runs Landturned (landturned.com). This site never references it in the UI and never reuses its visual identity.
- **Binding visual decisions** (agreed with the owner; the mockups in `/mockups/` are the source of truth for the look): navy background #0B1426; amber #FFC233 for under construction; translucent light blue #6FB4FF for planned; soft blue-grey, not pure white, for operational; neutral grey for paused or stalled. Column glow is a user setting, off by default. DESIGN.md owns tokens once it is written.

## Evidence on Hand

- `data/projects.json`: seed dataset of 41 projects, compiled and approved in Nov 2026, each with sources, a verification level and review notes. Coordinates are approximate.
- `mockups/desktop-globe-home.html`, `mockups/mobile-site-card.html`: agreed static mockups. Their numbers are placeholders.
- `mockups/accent-color-options.html`: reference only; the amber accent was chosen from it.
- Not yet on hand, and must not be fabricated: refined coordinates, before/after imagery, water-use figures, investment figures beyond the sourced ones, and social preview images.

## Product Principles

1. **Scale first, evidence one tap away.** The first impression is the size of the build-out; every number on screen leads to its source and date.
2. **Neutral by construction.** Strict status definitions, labelled capacity types, ranges where sources disagree, and "est." on estimates. The design never editorialises.
3. **Make it local.** Distance and comparisons in units that mean something where the reader lives turn a global story into a personal one.
4. **Built for the shared link on a phone.** Every state is addressable and shareable, and the experience holds up on a mid-range phone.
5. **Curate, don't aggregate.** A smaller set of verified, approved projects beats a large unverified list.

## Accessibility & Inclusion

- WCAG AA contrast.
- Status colors differ in lightness as well as hue so they work for color-blind users.
- Keyboard navigation for the map's project list and the before/after slider.
- Alt text for all imagery.
- A 2D map fallback when WebGL performance is poor.
- Lazy-loaded imagery and a fast home page on mobile.

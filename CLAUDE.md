# CLAUDE.md — The Silicon Fields: AI data center tracker

## Name and brand

- **Name:** The Silicon Fields. Wordmark in caps: THE SILICON FIELDS. In running text: "the Silicon Fields".
- **Domain:** thesiliconfields.com (groundbroken.com may also be registered and redirect here).
- **Tagline:** Mapping the land and power behind AI.
- **Spelling:** always *silicon* (the chip element), never *silicone*.
- **Meaning:** farmland ("fields") turning into AI infrastructure ("silicon": chips, GPUs, data centers). The name names a place, like Silicon Valley or the oil fields. Never treat it as a joke or pun in copy.
- **In-site verb:** "Groundbroken" is the label for the date construction started, e.g. on cards: "Groundbroken Dec 2024". Copy can also say "Welcome to the Silicon Fields" or "new in the Silicon Fields this year".
- The owner also runs **Landturned** (landturned.com). This site is independent: do not reference it in the UI or reuse its visual identity.

## What this site is

A free, informational website that tracks the world's largest data center construction projects (mostly AI campuses, 100 MW+) and shows, in plain language, what each one is and what it means for the place it is built in.

**The hook:** *"How close is the nearest AI megaproject to you, and what does it use?"*

The first five seconds must deliver a "wow, there are SO many built, being built and planned" reaction. The site is built in three layers:

1. **Wow: the globe (home page hero).** A 3D globe with a column rising from every project. Column height = capacity (GW), color = status (operational / under construction / planned). A timeline scrubber with a play button animates projects appearing from 2020 to 2030 while a big counter climbs ("42 GW → 160 GW"). A running total compares the capacity to whole countries' electricity use.
2. **Easy: the site card.** Tap a column → a compact card: name, owner, capacity, status, before/after satellite slider, distance from the user (if "near me" is used), and a link to the dossier.
3. **Depth: site dossiers.** One page per project: who builds it, who uses it, capacity, cost, status, timeline, local context (tax incentives, permits, opposition, ballot measures), all sourced. These are for journalists, planners and the curious, not the front door.

Plus **Near me:** enter an address, the globe flies to it, and nearby projects are listed with distance and plain-language comparisons.

## How it differs from Landturned (do not drift)

| | Landturned | The Silicon Fields |
|---|---|---|
| Purpose | Explore land change anywhere | See the scale of the data center build-out |
| Primary UI | Flat map, explore by place | 3D globe with data columns + timeline animation |
| Unit | Any location / pixel | A curated project (an object on the globe) |
| Tone | Calm, exploratory | Dramatic scale, but factual and numbers-first |

Never reuse Landturned's visual identity (colors, type, layout). Code and tile techniques can be reused.

## Tone rules (important)

- **Neutral and factual. Not activist.** This is a contested topic. No loaded words ("monster", "destroying"). State the numbers and sources and let readers judge.
- Every number shows its source and date. If sources disagree, show the range and name both sources.
- Mark estimates clearly as estimates ("est.").
- Status labels are strictly defined (see data model). Never call something "under construction" without a source saying so.

## Design direction

"Earth from space, with the build-out rising out of it." Wow first, but clean and credible.

- **Home = full-screen globe.** Deep navy space background (not pure black), a realistic but slightly muted Earth (satellite or night-lights texture), slow auto-rotation until the user interacts.
- **Columns** rise from each site; height ∝ capacity. One strong, distinct color per status (e.g. white = operational, signal orange = under construction, cool blue outline/translucent = planned). Colors must also differ in lightness so they work for color-blind users.
- **Timeline scrubber + play button** at the bottom; a big animated counter (GW and number of projects) top-left. This animation is the signature moment of the site: make it smooth and satisfying.
- **Big, confident numbers** with tabular figures. A strong grotesk display face for numbers and headings, a readable text face for cards and dossiers.
- **Site cards** slide in over the globe (bottom sheet on mobile).
- **Dossier pages** switch to a light, readable editorial layout: headline number → before/after slider → key facts → timeline → local context → sources.
- **Mobile first:** most traffic will come from shared links on phones. The globe must run smoothly on a mid-range phone; offer a 2D map fallback if WebGL performance is poor.
- Restraint: one accent per status, no extra effects.

**Anti-references (avoid):** neon grid lines and sci-fi HUD overlays, "hacker" terminal styling, glowing server-rack stock photos, gradient hero sections, card grids of identical stats, anything that looks like a data center company's marketing site, and Landturned's look.

## Design mockups (source of truth for the look)

`/mockups/` holds static HTML mockups agreed with the owner. Match them closely:
- `desktop-globe-home.html` – home page: globe, columns, counter, legend, largest-projects list, timeline.
- `mobile-site-card.html` – phone layout with the site card open as a bottom sheet.
- `accent-color-options.html` – reference only. Chosen accent: **amber #FFC233** for "under construction".

Decisions already made:
- Navy background (#0B1426), amber accent, light blue (#6FB4FF, translucent) for planned, and a soft blue-grey (not pure white) for operational so it stays distinct from amber.
- Paused/stalled projects (e.g. Fermi Project Matador) in neutral grey.
- Column glow is a user-toggleable setting, **off by default**.
- Mockup numbers are placeholders; real numbers come from `data/projects.json`.
- The mockups are static: the globe rotation, timeline animation and interactions are to be built.

### Using Impeccable

Impeccable is installed as a Claude Code skill (`npx skills add pbakaus/impeccable` or the plugin marketplace).

1. Run `/impeccable init` first. Feed it the purpose, audience, tone rules and constraints above so it writes `PRODUCT.md` (done Nov 2026). `init` does not write `DESIGN.md`: run `/impeccable document` to generate it from the agreed mockups in `/mockups/` (design direction, decided colors, anti-references).
2. Use `/impeccable shape` before building each new page type (home, near-me result, dossier, methodology).
3. After building: `/impeccable critique`, then `/impeccable audit`, then `/impeccable polish`.
4. `DESIGN.md` is the source of truth for tokens (colors, type scale, spacing). Do not hardcode design values outside it.

**Mandatory rule for ALL frontend/UI work (never skip, even for small UI changes):**
- Use the Impeccable skill for every frontend/UI task in this project.
- Before building any new screen or component, run `/impeccable shape` for it.
- After building it, run `/impeccable critique` and `/impeccable audit`, fix the issues they raise, then run `/impeccable polish`.
- Always follow `PRODUCT.md` and `DESIGN.md`.
- At the end of each step, tell the owner which Impeccable commands were run.

## Audience

1. Curious residents who saw a headline and want to know "is one coming near me?"
2. Journalists, planners and local officials looking for a quick, sourced overview
3. Students and researchers (GIS / planning)

## Scope

### v1 (ship this first)
- Curated dataset of ~30–50 of the largest projects worldwide (US megaprojects, Stargate sites, Meta/Google/Microsoft/AWS campuses, plus Europe incl. Norway, Middle East, Asia).
- Home page: full-screen 3D globe with capacity columns, status colors, timeline animation (2020–2030) and live counter; ranked list as a secondary view.
- Site card on tap, with before/after slider.
- "Near me": address search → globe flies to location → nearest projects with distance and comparisons.
- One dossier page per project with sources.
- Share: every site card and timeline state has its own URL and a good social preview image.
- Methodology page: definitions, sources, conversion factors, update date.

### Later (do not build yet)
- Change alerts / newsletter ("new project announced near you").
- Automated construction-progress detection from satellite imagery.
- Local opposition / ballot tracker as its own view.
- Embeddable widgets for news sites.

## Data model

One record per project, stored as JSON in `data/projects/<slug>.json`, compiled to `data/projects.geojson` at build time.

```json
{
  "slug": "meta-hyperion-louisiana",
  "name": "Hyperion",
  "owner": "Meta",
  "developer": "Meta / Blue Owl",
  "tenant": "Meta",
  "country": "US",
  "region": "Louisiana",
  "locality": "Richland Parish",
  "lat": 0.0,
  "lon": 0.0,
  "location_precision": "site | town | county",
  "capacity_mw": { "low": 5000, "high": 5000, "type": "planned_campus | it_load_estimate | facility_power_permit | estimate | mixed | unknown" },
  "status_note": "short sourced explanation of the status",
  "verification": "primary | news | tracker_only",
  "approved": false,
  "review_notes": "what still needs checking",
  "investment_usd": { "value": null, "est": true },
  "area_acres": null,
  "status": "announced | permitting | under_construction | partially_operational | operational | paused | cancelled",
  "construction_start": "2024-12",
  "expected_completion": null,
  "imagery": { "before_date": "", "after_date": "" },
  "local_context": [ { "type": "tax_incentive | permit | opposition | ballot | utility_deal", "summary": "", "source_id": "" } ],
  "sources": [ { "id": "s1", "title": "", "url": "", "publisher": "", "accessed": "YYYY-MM-DD" } ],
  "last_verified": "YYYY-MM-DD"
}
```

Rules:
- The seed dataset is `data/projects.json` (41 projects, compiled and approved Nov 2026). Split it into one file per project. Only records with `"approved": true` are shown on the site (all 41 are currently approved). Records without a capacity figure are drawn as a small dot labelled "capacity not disclosed", not a column.
- `verification: "tracker_only"` records are never published until a primary or news source is added.
- When `low` and `high` differ, show the range ("8–10 GW") and both sources. Column height uses `high` for planned sites and `low` for operational ones; document this on the methodology page.
- `status: "paused"` (e.g. Fermi Project Matador) is shown in a neutral grey with the status note, never as active construction.
- `location_precision` of `region` or `state` means the point is approximate: show a soft circle instead of a sharp column base, and say so on the card.
- Coordinates in the seed are approximate (town/county level). Refine them from imagery or filings before launch.
- Coordinates must come from a source (filings, tracker, imagery). If only the town is known, set `location_precision` accordingly and show it on the page.
- `capacity_mw.type` matters: "planned campus GW" and "IT load MW" are not comparable. Always label which one is shown.
- Validate all records with a JSON Schema in CI (`scripts/validate.py`).

## Conversion factors (single source of truth)

Keep in `data/factors.json`, each with source and date, shown on the methodology page:
- Average household electricity use (US: EIA; Norway: SSB/NVE) → "homes powered" equivalent. **Verify current figures before using.**
- Football field area (US field incl. end zones = 1.32 acres).
- Never invent water-use figures. Show water only where a source gives a number for that site.

## Data sources (check licenses before copying data)

- **Epoch AI – AI data center directory** (satellite-based construction status per site). Cite and link; check license before reusing data.
- **Data Center Index**, **Electric Choice US data center tracker**, **Baxtel**: discovery and cross-checking.
- Company announcements, utility filings, county/municipal permits, local news: primary sources for each record.
- Rule: a project needs at least one primary or reputable news source; trackers alone are not enough.
- Exception (owner decision, Nov 2026): **Epoch AI satellite observation** counts as news-level evidence for status and construction dates. Cite it as "Epoch AI (satellite imagery, <date>)" with `kind: "satellite"`. Other trackers (Baxtel, Cleanview, Data Center Map, Electric Choice) still never count on their own.

### Imagery
- Before/after: Sentinel-2 (Copernicus, free, ~10 m) works everywhere; use cloud-free composites per year.
- Higher-resolution historical imagery (e.g. Esri World Imagery Wayback) only if its terms allow this use. Check and document in `docs/imagery-licensing.md`.
- Reuse Landturned's tile/imagery code where it fits.

## Tech stack

Keep it simple and cheap. Mostly static.

- **Framework:** Astro (static pages per project from the JSON data, islands for the map and slider).
- **Globe:** MapLibre GL JS globe projection with extruded columns, or deck.gl (ColumnLayer) on a globe view. Prototype both quickly and pick the one that runs smoothest on a phone. Columns need a date field so the timeline can filter them.
- **Before/after slider:** small custom component, keyboard accessible.
- **Address search:** a geocoding API with a free tier (e.g. a Nominatim-based service, respecting its usage policy). Distance is computed in the browser.
- **Hosting:** Cloudflare Pages (domain also on Cloudflare).
- **Scripts:** Python in `scripts/` for validation, GeoJSON build and imagery prep (same language as Landturned's backend).
- No database, user accounts or paid services in v1.

## Project structure

```
/data/projects/*.json     one file per project
/data/factors.json        conversion factors with sources
/scripts/                 validate.py, build_geojson.py, imagery tools
/src/pages/               index, near-me, projects/[slug], methodology
/src/components/          Map, BeforeAfter, BigNumber, SourceList, Timeline
/docs/                    data-collection.md, imagery-licensing.md
PRODUCT.md, DESIGN.md     written by /impeccable init
```

## Working rules for Claude Code

- Windows development machine; give commands that work in PowerShell.
- Commit often with clear messages; never commit API keys (use `.env`, listed in `.gitignore`).
- Before adding a project record, show me the sources and the proposed values for approval.
- When a figure is uncertain, ask instead of guessing.
- Accessibility: WCAG AA contrast, keyboard navigation for map list and slider, alt text for imagery.
- Performance: the home page should load fast on mobile; lazy-load imagery.

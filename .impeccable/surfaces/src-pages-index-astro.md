---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

# Surface brief: Home (globe)

Confirmed with the owner 2026-11-25 via `/impeccable shape home`.

## Scope and mode
- Mode: **Experience**. The globe is the content; the UI recedes to the edges.
- In scope: globe, header (wordmark, nav, address search), headline counter and comparison, legend, top-5 panel, timeline, hover card, opening the site card.
- Shaped separately: site card content, Near me results, List page, dossiers, methodology.
- Composition authority: `mockups/desktop-globe-home.html` (desktop) and `mockups/mobile-site-card.html` (mobile chrome). No concept round was run because the layout is agreed.

## Audience and job
- A curious resident, usually on a phone from a shared link, who knows nothing about the project yet.
- In five seconds: "there are SO many built, being built and planned", then "is one near me?"
- Main action: watch the build-out, then tap a column (site card) or search an address (Near me).
- Success: the visitor can state roughly how much capacity and how many projects, opens one project, and can share a link to the exact state.

## Signature moment: plays once, then rests
- On a first visit the timeline plays 2020 → today (about 7 s) and then stops at today.
- Columns rise in Planned Blue when announced, turn amber at groundbreaking, and turn Operational Frost when operational.
- The headline number and the legend totals count up with tabular figures.
- Repeat visits, reduced-motion users and shared links start at their state without playing.
- 2027–2030: columns appear only where a sourced expected date exists, drawn as "expected"; the label becomes "expected by 2030".

## Counting rules (confirmed)
- The headline total **includes paused projects** (e.g. Fermi Project Matador). They keep Paused Slate and their own grey legend row, and are never shown as active construction.
- **Column height: `low` only for fully operational sites; every other status uses `high`, labelled "up to"** (owner decisions 2026-11-25: under construction, partially operational and paused all use `high`). The methodology page states these rules.
- Where low and high differ, the headline shows the column-basis total, and the line under it gives the low–high range.
- **No published construction start** (owner decision 2026-11-25): an under-construction project turns amber at its first sourced evidence of construction (`dates.construction_start.basis: "first_evidence"`). The site card then says "construction start date not published".
- Projects with no capacity figure count toward the project total, not toward GW, and are drawn as dots.
- Comparison (changed 2026-11-25): **households, not countries**. "Enough for up to N US homes", one universal figure for every visitor (owner decision 2026-11-25: EIA 2024, 10,380 kWh/yr), marked "est., at full power" (assumes full capacity all year; 1 GW ≈ 844,000 homes). Factors live in `data/factors.json`. Headline wording stays open, because tens of millions of homes is abstract; consider pairing it with a sourced local anchor. Country comparison is dropped from v1.

## States and ranges
- 41 projects; capacity 214 MW – 17 GW; 2 with no capacity figure; 2 at region- or state-level precision (soft circle at the base); 1 paused.
- Loading: the counter and list render before the globe.
- WebGL unavailable or slow → 2D map fallback.
- Address not found; geocoder down.
- Reduced motion: no autoplay, no auto-rotation, instant camera moves.
- Dense clusters (Texas, Midwest): overlapping columns must stay selectable.

## Interaction and layout
- **Desktop:** as in the mockup. Hover or focus shows the hover card; click opens the site card as a side panel over the top-5 panel. Slow auto-rotation until the first interaction, then still.
- **Mobile:**
  - Header with wordmark and search button.
  - Headline number with a single-row legend under it.
  - The globe fills the middle; the timeline is pinned to the bottom.
  - A "Largest projects" pull-up tab sits above the timeline.
  - Tapping a column replaces that tab with the site card sheet.
- **Keyboard:** the ranked list is the keyboard route to every project. The timeline is a slider (arrow keys = 1 month, Page Up/Down = 1 year). Space plays and pauses. Escape closes the card.
- **URL state:** `?year=YYYY&project=<slug>` restores the timeline year and the open card.

## Anti-goals
- HUD styling, glow on by default, pure white columns, invented numbers or dates, paused projects shown as active.

## Open decisions (a builder must not invent these)
- **Data pass:** sourced `announced`, `construction_start` and `operational` dates, each with a precision (month/quarter/year), for all 41 records, approved by the owner. Until then, the engine prototype runs on current status only. No placeholder dates.
- Exact headline wording for the homes comparison (verified factors first).
- ~~Globe engine~~ Decided 2026-11-25: **MapLibre GL JS** (owner, after phone-testing both prototypes). Carry over from `prototypes/globe/`: dotted land (Land Dot), lit sphere + edge + halo behind a transparent ocean, flat column lighting, hover/tap dimming, real west-to-east spin.
- Where the column-glow setting lives (suggested: a "View" menu next to the legend).
- Schema mismatches in the seed: capacity types `power_generation` and `grid_switchyard`, location precision `city`, field `users` vs `tenant`.

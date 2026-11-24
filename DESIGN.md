---
name: The Silicon Fields
description: Mapping the land and power behind AI.
colors:
  space-navy: "#0B1426"
  sheet-navy: "#0F1D36"
  panel-navy: "#0D1A32"
  tile-navy: "#13264A"
  ocean-light: "#16294A"
  ocean-deep: "#0A1529"
  line-subtle: "#1E3157"
  line-strong: "#2A4170"
  status-construction: "#FFC233"
  status-planned: "#6FB4FF"
  status-operational: "#DCE3EE"
  status-paused: "#6B7280"
  text-primary: "#F4F6FA"
  text-body: "#C9D3E6"
  text-secondary: "#B5C2DA"
  text-muted: "#93A3C2"
  text-faint: "#7F90B0"
  marker-white: "#FFFFFF"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "96px"
    fontWeight: 700
    lineHeight: "92px"
    letterSpacing: "-3px"
    fontFeature: "tnum"
  display-mobile:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: "44px"
    letterSpacing: "-1px"
    fontFeature: "tnum"
  numeral:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    fontFeature: "tnum"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "26px"
    fontWeight: 700
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "20px"
    fontWeight: 700
  wordmark:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    letterSpacing: "2.5px"
  body-lead:
    fontFamily: "Inter, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "25px"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  body-small:
    fontFamily: "Inter, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "1.5px"
rounded:
  track: "3px"
  chip: "6px"
  tile: "10px"
  card: "12px"
  panel: "14px"
  sheet: "22px"
  pill: "999px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  xxl: "32px"
  gutter-mobile: "20px"
  gutter-desktop: "48px"
components:
  button-primary:
    backgroundColor: "{colors.status-construction}"
    textColor: "{colors.space-navy}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 24px"
  button-icon:
    backgroundColor: "{colors.sheet-navy}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    size: "44px"
  button-play:
    backgroundColor: "{colors.status-construction}"
    textColor: "{colors.space-navy}"
    rounded: "{rounded.pill}"
    size: "52px"
  input-search:
    backgroundColor: "{colors.sheet-navy}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 16px"
  panel-overlay:
    backgroundColor: "{colors.panel-navy}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.panel}"
    padding: "18px 20px"
  card-hover:
    backgroundColor: "{colors.panel-navy}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "14px 16px"
    width: "236px"
  sheet-site-card:
    backgroundColor: "{colors.sheet-navy}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sheet}"
    padding: "12px 20px 20px"
  tile-stat:
    backgroundColor: "{colors.tile-navy}"
    textColor: "{colors.text-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.tile}"
    padding: "10px"
  chip-image-date:
    backgroundColor: "rgba(11,20,38,0.75)"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "3px 7px"
  timeline-track:
    backgroundColor: "{colors.line-subtle}"
    rounded: "{rounded.track}"
    height: "6px"
  timeline-progress:
    backgroundColor: "{colors.status-construction}"
    rounded: "{rounded.track}"
    height: "6px"
  timeline-thumb:
    backgroundColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    size: "20px"
---

# Design System: The Silicon Fields

## Overview

**Creative North Star: "The Night Survey"**

Earth seen from orbit at night, measured like a survey. The ground is a deep navy that is never pure black, and the globe is a muted, slightly cooler navy sphere. The only bright things on screen are the measurements: capacity columns rising from the surface, and the big numbers that sum them. Drama comes from how many columns there are and how tall they stand, not from effects. The interface is a set of quiet translucent navy panels, set at the edges so the globe stays central.

Density is low on the globe surfaces and rises in steps. The home page shows one headline number, a three-row legend, a five-row ranked list and a timeline. The site card adds three stat tiles and a before/after image. The dossier, the deepest layer, switches to a light editorial reading layout; its tokens are not designed yet (see Colors). Every number is set in Space Grotesk with tabular figures. All prose and labels are in Inter.

The system rejects sci-fi HUD language: no neon grid lines, no terminal styling, no glowing server-rack imagery, no gradient hero sections, no grids of identical stat cards, and nothing that reads as a data center company's marketing site. It also shares nothing with Landturned's look.

**Key Characteristics:**
- Deep navy space (#0B1426), never pure black; a cooler navy sphere for the globe.
- Four status colors that differ in lightness as well as hue, so they work in greyscale.
- Amber is the only warm color, and it means "under construction" and the primary action.
- Big, confident Space Grotesk numerals with tabular figures; Inter for everything you read.
- Translucent navy panels with hairline borders; no shadows, no glow by default.
- Pill-shaped controls, softly rounded panels, and a 22px-radius bottom sheet on mobile.

## Colors

A cold, dark navy world where status colors are the only saturated notes, and amber is the only warm one.

### Primary
- **Survey Amber** (#FFC233): status color for *under construction* (columns, legend swatch, status eyebrow, ranked-list figures) and the single primary-action color (play button, "Full dossier" button, timeline progress, active-nav underline). Text placed on amber is Space Navy.

### Secondary
- **Planned Blue** (#6FB4FF): status color for *planned* projects. Always drawn translucent: a column body at 35% opacity with a crisp 1.2px outline, and a legend swatch with a 35% fill and a 1.5px solid border. It reads as "not there yet".

### Tertiary
- **Operational Frost** (#DCE3EE): status color for *operational* projects. A pale blue-grey, deliberately not white, so it stays distinct from amber and from the white UI text. It is the lightest status color.
- **Paused Slate** (#6B7280): status color for *paused or stalled* projects (e.g. Fermi Project Matador). Neutral grey and the darkest status color, so it never reads as active construction. At 3.8:1 against Space Navy it passes the 3:1 rule for graphics but **not** for text (see the Slate Is a Swatch Rule).

### Neutral
- **Space Navy** (#0B1426): page background behind the globe, and text on amber.
- **Sheet Navy** (#0F1D36): bottom sheet, search field and icon-button fills.
- **Panel Navy** (#0D1A32): overlay panels and the globe hover card, used translucent (94% for the hover card, 80% for the side panel) so the globe shows faintly through.
- **Tile Navy** (#13264A): stat tiles inside the site card; also the faint outer halo around the globe (25% opacity).
- **Ocean Light → Ocean Deep** (#16294A → #0A1529): radial gradient on the globe sphere, lit from upper left. This is the one sanctioned gradient, and it is a surface, not a decoration.
- **Line Subtle** (#1E3157): list dividers, side-panel border, timeline track.
- **Line Strong** (#2A4170): input and card borders, the globe edge, the bottom-sheet top border and drag handle, outline buttons.
- **Text Primary** (#F4F6FA): headings, project names, figures, active nav and links.
- **Text Body** (#C9D3E6): supporting sentences under the headline number, legend labels.
- **Text Secondary** (#B5C2DA): owner and location lines on cards, stat-tile captions.
- **Text Muted** (#93A3C2): tagline, inactive nav, panel headings, list sub-lines, search placeholder.
- **Text Faint** (#7F90B0): timeline years, footnotes, image captions, the column-height explanation. At 5.7:1 on Space Navy it is the lowest-contrast text allowed.
- **Marker White** (#FFFFFF): only the before/after slider divider and handle, which must read over any satellite image.

The dossier's light editorial palette is **[to be resolved during `/impeccable shape dossier`]**. Do not invent light-theme tokens before then.

### Named Rules
**The Lightness Ladder Rule.** In order of lightness: Operational Frost (lightest), Survey Amber, Planned Blue (translucent), Paused Slate (darkest). A new status color, or any change to these, must keep each step distinct in greyscale.

**The One Warm Note Rule.** Amber is the only warm color in the system. It means "under construction" or "the main thing to do next". Never use it for decoration, emphasis or charts with another meaning.

**The Slate Is a Swatch Rule.** Paused Slate is never text. A paused status eyebrow uses Text Muted beside a slate swatch, and the status words carry the meaning.

## Typography

**Display Font:** Space Grotesk (with sans-serif), weights 500 and 700
**Body Font:** Inter (with sans-serif), weights 400, 500 and 600

**Character:** Space Grotesk is a slightly engineered grotesk that makes numbers feel measured and confident. Inter is a calm, neutral reading face for names, sentences and labels. Numbers belong to Space Grotesk; words belong to Inter.

### Hierarchy
- **Display** (700, 96px / 92px, −3px tracking, tabular): the home headline figure ("71 GW"). The unit drops to 44px with normal tracking.
- **Display Mobile** (700, 44px / 44px, −1px tracking, tabular): the same headline figure on phones.
- **Numeral** (700, 28px, tabular): the current timeline year next to the scrubber.
- **Headline** (700, 26px): the project name heading the mobile site card; it is the page's h1 there.
- **Title** (700, 20px): project name on the globe hover card, and stat-tile values ("1.2 GW", "~1,100"). Also used at body size (14px, 700) for figures in legend and list rows.
- **Wordmark** (700, 20px desktop / 16px mobile, 2.5px / 2px tracking, all caps): THE SILICON FIELDS. No other text uses this tracking.
- **Body Lead** (400, 17px / 25px): the sentence under the headline number. Keep it to about 40 characters per line in the left column.
- **Body** (400, 14px; 600 for names): nav, legend labels, list rows, search field.
- **Body Small** (400, 13px; 600 for links): owner and location lines, card facts, "Open site card →".
- **Caption** (400, 12px): tagline, timeline years, footnotes, list sub-lines.
- **Label** (600, 11–13px, 1.5–2px tracking, all caps): status eyebrows ("UNDER CONSTRUCTION · PARTLY ONLINE"), section headings ("LARGEST PROJECTS"), the dateline ("AI DATA CENTERS · NOV 2026"), image date chips.

### Named Rules
**The Tabular Figures Rule.** Every figure that can change or be compared (GW, MW, counts, years, distances, acres) uses tabular figures (`font-variant-numeric: tabular-nums`), so the counter doesn't jitter while it animates.

**The Numbers Speak Grotesk Rule.** Figures are set in Space Grotesk 700 even inside Inter rows. Words never are, except the wordmark and names in headings.

## Layout

The home page is a full-bleed globe with UI anchored to the edges. The mockup reference frames are a 1440×900 desktop and a 390×844 phone.

- **Desktop:** 48px side gutter. A 76px header holds the wordmark and tagline, the nav (24px gap) and a 320px pill search field pushed right. The left column is 340px wide, starts 136px from the top and holds the dateline, headline number, legend and column-height note, stacked with 20px gaps. The right panel is 280px wide, also at 136px. The timeline row sits 36px from the bottom across the full width: play button, scrubber with year ticks, current year (24px gaps). The globe is centered slightly right and below center.
- **Mobile:** 20px gutter. A 60px header holds the wordmark and a 44px search icon button. The headline number sits under the header at the top left. The globe takes the upper half. The site card is a bottom sheet about 430px tall with 12px top / 20px side padding and 14px gaps between its sections.
- **Rhythm:** spacing comes from the 4px-based steps in the frontmatter (4, 8, 12, 16, 20, 24, 32, 48). Inside dense groups use 2–6px between label and value. Between groups use 12–20px.
- Breakpoints are **[to be resolved during implementation]**; the mockups define only the two reference frames.

### Named Rules
**The Globe Owns the Center Rule.** Panels hug the edges and leave the globe's middle clear. A site card opens over the globe (a side card on desktop, a bottom sheet on mobile) and never sends the visitor to another page to see the basics.

## Elevation & Depth

The system uses no shadows. Depth comes from translucent navy panels over the globe, hairline borders (Line Subtle or Line Strong), and the globe's own lit gradient and faint halo. Surfaces step up in lightness as they come forward: Space Navy (ground) → Panel Navy (translucent overlays) → Sheet Navy (bottom sheet, inputs) → Tile Navy (stat tiles inside a sheet).

### Named Rules
**The No-Glow Default Rule.** Column glow (a 14px soft stroke under each column, blurred 5px) exists only as a user setting and is off by default. Nothing else glows: no text glow, no neon, no outer shadows.

**The Borders, Not Shadows Rule.** When a surface needs separating from the globe, give it a 1px Line Subtle or Line Strong border and a translucent Panel Navy fill. Never use a drop shadow.

## Shapes

The form language is soft and pill-heavy. Every interactive control is a pill or a circle (44–52px tall). Containers have moderate radii that grow with their size: 6px for image date chips, 10px for stat tiles, 12px for the hover card and the before/after image, 14px for overlay panels, 22px for the top corners of the bottom sheet. The timeline track and progress bar use 3px ends on a 6px bar.

The signature shape is the **capacity column**: a vertical stroke with round caps rising from the project's point on the globe, with a small elliptical base at 50% opacity.
- Under construction and operational columns are solid 4.5px strokes.
- Planned columns are a 5px stroke at 35% opacity with a 1.2px solid outline.
- Legend swatches echo the column as small rounded bars (10×22px, 5px radius).
- Approximate locations (region- or state-level) get a soft circle at the base instead of a sharp ellipse.
- Projects with no disclosed capacity are drawn as a small dot, not a column.

## Components

### Buttons
Confident pills. Primary actions are amber; everything else is outline or navy.
- **Shape:** full pill (999px radius); 48px tall in cards.
- **Primary:** Survey Amber fill, Space Navy text, Inter 600 15px ("Full dossier"). One per view.
- **Secondary:** transparent with a 1px Line Strong border, Text Primary, Inter 600 15px ("Share").
- **Icon button:** 44px circle, Sheet Navy fill, 1px Line Strong border (mobile search).
- **Play button:** 52px amber circle with a navy play glyph; the main control of the timeline.
- **Hover / Focus:** **[to be resolved during implementation]**. The mockups are static. Focus must be clearly visible on navy and on amber (WCAG AA).

### Inputs / Fields
- **Search:** 44px pill, Sheet Navy fill, 1px Line Strong border, search glyph in Text Muted, 14px Inter. The placeholder ("Find projects near your address") is in Text Muted. The field has a visually hidden label.
- **Focus / Error:** **[to be resolved during implementation]**.

### Navigation
Inter 14px. The active item is Text Primary with a 2px amber underline (4px below the text). Inactive items are Text Muted with no underline. Items: Globe, List, Methodology. On mobile the nav collapses; only the wordmark and the search button remain in the header.

### Overlay panel (Largest Projects)
A 280px panel: Panel Navy at 80%, 1px Line Subtle border, 14px radius, 18px / 20px padding. Its heading is a Label in Text Muted. Rows are split by 1px Line Subtle rules with 10px vertical padding: the name in Inter 600 Text Primary over the owner in 12px Text Muted, and the figure right-aligned in Space Grotesk 700, colored by the project's status.

### Globe hover card
A 236px card anchored near the hovered column: Panel Navy at 94%, 1px Line Strong border, 12px radius, 14px / 16px padding, 6px gaps. Content from top to bottom: status eyebrow (Label in the status color), project name (Title), owner · locality (Body Small, Text Secondary), capacity · "Groundbroken" date (Body Small, tabular), "Open site card →" link.

### Site card (bottom sheet)
Sheet Navy, 1px Line Strong top border, 22px top radius, a 40×4px Line Strong drag handle centered at the top. Contents in order:
1. Status eyebrow.
2. Project name (Headline, h1).
3. Owners and place (Body Small, Text Secondary).
4. A row of three stat tiles.
5. The before/after image.
6. Imagery caption (Caption, Text Faint).
7. Action row: primary "Full dossier" and secondary "Share".

### Stat tile
Tile Navy fill, 10px radius, 10px padding. The value is in Title Space Grotesk 700 with tabular figures, and the unit is a caption beneath (11px, Text Secondary). Up to three in a row, never used as a decorative grid. A value marked as an estimate carries "est." or "~" in the value.

### Before/after slider
A 128px-tall image in a 12px-radius frame, with the "before" year chip at top left and the "after" year chip at top right. A 3px Marker White divider runs through it, with a 32px white circular handle in the middle holding a two-way arrow glyph. It must be keyboard operable (arrow keys move the divider) and have alt text for both images.

### Timeline scrubber
A 6px Line Subtle track with an amber progress fill and a 20px Text Primary thumb. Year ticks (2020–2030, every two years) sit below in Caption, Text Faint. The current year is in Text Primary, and is repeated large at the right in Numeral. The play button sits at the left.

### Legend row
A 10×22px swatch shaped like a column (5px radius), the status name (Body, Text Body), and the total in Space Grotesk 700 Text Primary, right-aligned. Under the legend, one Caption line in Text Faint explains what column height means.

## Do's and Don'ts

### Do:
- **Do** keep every status color distinct in lightness, in the order Operational Frost (#DCE3EE) > Survey Amber (#FFC233) > Planned Blue (#6FB4FF, translucent) > Paused Slate (#6B7280).
- **Do** color a ranked-list figure or column by the project's *actual* status. A paused project like Project Matador takes Paused Slate, not amber. (The current desktop mockup shows Matador in amber; that is a mockup error, not the rule.)
- **Do** set every figure in Space Grotesk 700 with tabular figures.
- **Do** separate panels from the globe with translucent Panel Navy and a 1px border, never a shadow.
- **Do** use amber for exactly one primary action per view.
- **Do** keep text at Text Faint (#7F90B0) or lighter on any navy surface; every text color in this file passes WCAG AA on Space Navy, Panel Navy and Sheet Navy.

### Don't:
- **Don't** use pure white (#FFFFFF) for operational columns or legend swatches. It belongs only to the before/after slider marker.
- **Don't** turn column glow on by default, or add glow, neon or outer shadows anywhere else.
- **Don't** use neon grid lines, sci-fi HUD overlays, terminal styling, glowing server-rack photos, gradient hero sections, or grids of identical stat cards.
- **Don't** make anything look like a data center company's marketing site, or borrow anything from Landturned's visual identity.
- **Don't** use pure black (#000000) for the background; space is Space Navy (#0B1426).
- **Don't** use Paused Slate for text.
- **Don't** invent the dossier's light-theme tokens outside `/impeccable shape dossier`.

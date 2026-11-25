# Context layers

## osm-datacenters.json

Existing data centers mapped in OpenStreetMap (`telecom=data_center` or `building=data_center`), as faint context dots under the curated project columns.

- **License:** this file is a derived database of OpenStreetMap data and is available under the [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1-0/). © OpenStreetMap contributors. Any page that shows it credits "© OpenStreetMap contributors" with a link to https://www.openstreetmap.org/copyright.
- **Built by:** `npm run context:osm` (`scripts/build_osm_context.mjs`). Points closer than 250 m are merged, so a site tagged both as a building and as a facility counts once. Coordinates are rounded to about 100 m.
- **What it is not:** not project records. It carries no capacity, status or dates, is never counted in GW, project or homes totals, and coverage is uneven (dense in the US and Europe, patchy elsewhere). The UI labels it "Existing data centers (OpenStreetMap)".
- **Owner decision 2026-11-25:** added as a context layer after the 41-project globe alone did not show the scale of the existing data center world.

// Downloads the two comparison textures into public/earth/ (git-ignored).
// Both are NASA imagery in the public domain, via Wikimedia Commons copies
// (NASA's eoimages server refused TLS from the dev machine). See docs/imagery-licensing.md.
//   night.jpg: "The earth at night" (NASA Earth Observatory, Black Marble 2012)
//   day.jpg:   "Whole world - land and oceans" (NASA Visible Earth, Blue Marble)
// Usage: node prototypes/globe/fetch-earth.mjs
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("./public/earth/", import.meta.url));
mkdirSync(dir, { recursive: true });
const FILES = {
  "night.jpg": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/The_earth_at_night.jpg/3840px-The_earth_at_night.jpg",
  "day.jpg": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Whole_world_-_land_and_oceans.jpg/3840px-Whole_world_-_land_and_oceans.jpg",
};
for (const [name, url] of Object.entries(FILES)) {
  if (existsSync(dir + name)) continue;
  const res = await fetch(url, { headers: { "User-Agent": "silicon-fields-prototype/0.1" } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  writeFileSync(dir + name, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${name}`);
}

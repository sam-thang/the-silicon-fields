// Globe engine prototypes (throwaway). Brief: .impeccable/surfaces/prototypes-globe-index-html.md
// Dev:   npm run proto        (http://localhost:5173, also on the LAN)
// Phone: npm run proto:serve  (production build, served on the LAN at port 5173)
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const here = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(here, "../..");

export default defineConfig({
  root: here,
  server: { host: true, port: 5173, fs: { allow: [projectRoot] } },
  preview: { host: true, port: 5173 },
  build: {
    outDir: resolve(projectRoot, "dist-prototypes/globe"),
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      input: {
        index: resolve(here, "index.html"),
        maplibre: resolve(here, "maplibre.html"),
        deckgl: resolve(here, "deckgl.html"),
      },
    },
  },
});

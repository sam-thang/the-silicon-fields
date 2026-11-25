// Screenshots of the prototypes with local Chrome (puppeteer-core). Needs the server running.
// Usage: node prototypes/globe/screenshot.mjs <outDir> <name>=<path> [...]
//   e.g. node prototypes/globe/screenshot.mjs shots maplibre=maplibre.html?play=0&rotate=0
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const [outDir, ...jobs] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--use-angle=d3d11", "--enable-webgl"],
});
for (const job of jobs) {
  const [name, path] = job.split(/=(.*)/s);
  const mobile = name.endsWith("-mobile");
  const page = await browser.newPage();
  await page.setViewport(mobile ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900 });
  const logs = [];
  page.on("console", (m) => logs.push(`${m.type()}: ${m.text()}`));
  page.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));
  await page.goto(`http://localhost:5173/${path}`, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4000));
  await page.screenshot({ path: `${outDir}/${name}.png` });
  const meter = await page.$$eval(".meter dd", (els) => els.map((e) => e.textContent)).catch(() => []);
  console.log(`${name}: meter ${meter.join(" | ")}`);
  for (const l of logs.filter((l) => /error|warn/i.test(l)).slice(0, 6)) console.log("   ", l.slice(0, 300));
  await page.close();
}
await browser.close();

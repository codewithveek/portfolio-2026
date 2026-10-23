/**
 * Captures design screenshots for review: `node tools/screenshots/capture.ts <baseUrl> <outDir> [paths...]`.
 * Set COLOR_SCHEME=light for the light theme. Desktop 1440×900 and mobile 390×844: first viewport, then one viewport per section.
 */
import { chromium } from "@playwright/test";

const [baseUrl = "http://localhost:5173", outputDirectory = "screenshots", ...paths] =
  process.argv.slice(2);
const routePaths = paths.length > 0 ? paths : ["/"];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

// PLAYWRIGHT_CHROMIUM lets cloud sessions use a preinstalled browser build.
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || undefined,
});
for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: process.env.REDUCED_MOTION === "1" ? "reduce" : "no-preference",
    colorScheme: process.env.COLOR_SCHEME === "light" ? "light" : "dark",
  });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") console.error(`[${viewport.name}] ${message.text()}`);
  });
  page.on("pageerror", (error) => console.error(`[${viewport.name}] pageerror ${error.message}`));
  for (const routePath of routePaths) {
    await page.goto(`${baseUrl}${routePath}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const slug =
      routePath === "/" ? "home" : routePath.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
    await page.screenshot({ path: `${outputDirectory}/${slug}-${viewport.name}-fold.png` });
    // One viewport shot per section, scrolled into place, so sticky and pinned parts look real.
    const sectionOffsets = await page.evaluate(() =>
      [...document.querySelectorAll("main section, footer")].map((element) => ({
        id: element.id || element.getAttribute("aria-labelledby") || element.tagName.toLowerCase(),
        top: element.getBoundingClientRect().top + window.scrollY,
      })),
    );
    for (const section of sectionOffsets) {
      await page.evaluate((top) => window.scrollTo(0, top), section.top);
      await page.waitForTimeout(900);
      await page.screenshot({
        path: `${outputDirectory}/${slug}-${viewport.name}-${section.id}.png`,
      });
    }
  }
  await context.close();
}
await browser.close();

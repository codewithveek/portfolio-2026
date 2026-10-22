/**
 * Builds Open Graph cards (1200×630) into public/og/ (PRD §9.8): black, lime label, display
 * title and a small portrait crop. Rendered with Playwright's Chromium so the cards use the
 * site's own variable fonts (see docs/decisions/0004-og-images-with-chromium.md).
 *
 * Usage: node scripts/build-og-images.ts   (PLAYWRIGHT_CHROMIUM may point at a browser binary)
 */
import { chromium } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";

import { site } from "../app/content/site.ts";

interface OgCard {
  name: string;
  label: string;
  title: string;
  subtitle: string;
}

const projectFiles = ["zia", "afriex-ecosystem", "driftwatch", "cutroom", "nippyy-backend"];

async function readProjectCard(slug: string): Promise<OgCard> {
  const source = await readFile(
    new URL(`../app/content/projects/${slug}.mdx`, import.meta.url),
    "utf8",
  );
  const readField = (field: string) =>
    new RegExp(`^${field}: (.+)$`, "m").exec(source)?.[1]?.trim() ?? "";
  return {
    name: `work-${slug}`,
    label: "Case study · veek.me",
    title: readField("title"),
    subtitle: readField("tagline"),
  };
}

function toDataUrl(bytes: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (character) => `&#${character.charCodeAt(0)};`);
}

function renderCardHtml(
  card: OgCard,
  assets: { sans: string; mono: string; portrait: string },
): string {
  return `<!doctype html><html><head><style>
@font-face{font-family:"Sans";src:url(${assets.sans}) format("woff2");font-weight:1 1000;font-stretch:25% 151%}
@font-face{font-family:"Mono";src:url(${assets.mono}) format("woff2");font-weight:100 800}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#08080A;color:#EDEDED;font-family:"Sans";position:relative;overflow:hidden;
background-image:linear-gradient(to right,rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.03) 1px,transparent 1px);background-size:96px 96px}
.copy{position:absolute;left:72px;top:72px;bottom:72px;width:760px;display:flex;flex-direction:column;justify-content:space-between}
.label{font-family:"Mono";font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#C6F432;display:flex;gap:14px;align-items:center}
.dot{width:12px;height:12px;border-radius:50%;background:#C6F432}
h1{font-size:${card.title.length > 14 ? 76 : 104}px;font-stretch:130%;font-weight:800;line-height:.92;text-transform:uppercase}
p{font-size:30px;line-height:1.35;color:#A1A1A8;max-width:700px}
.footer{font-family:"Mono";font-size:18px;letter-spacing:.14em;text-transform:uppercase;color:#A1A1A8}
.portrait{position:absolute;right:-40px;bottom:0;height:600px}
.fade{position:absolute;inset:0;background:linear-gradient(to right,#08080A 52%,rgba(8,8,10,.2) 78%,transparent)}
.glow{position:absolute;right:120px;top:120px;width:360px;height:360px;border-radius:50%;background:#C6F432;opacity:.1;filter:blur(120px)}
</style></head><body>
<div class="glow"></div><img class="portrait" src="${assets.portrait}"><div class="fade"></div>
<div class="copy"><div class="label"><span class="dot"></span>${escapeHtml(card.label)}</div>
<div><h1>${escapeHtml(card.title)}</h1><p style="margin-top:28px">${escapeHtml(card.subtitle)}</p></div>
<div class="footer">${escapeHtml(site.name)} · veek.me</div></div></body></html>`;
}

const fontDirectory = new URL("../node_modules/@fontsource-variable/", import.meta.url);
const assets = {
  sans: toDataUrl(
    await readFile(
      new URL("google-sans-flex/files/google-sans-flex-latin-wdth-normal.woff2", fontDirectory),
    ),
    "font/woff2",
  ),
  mono: toDataUrl(
    await readFile(
      new URL("jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", fontDirectory),
    ),
    "font/woff2",
  ),
  portrait: toDataUrl(
    await readFile(new URL("../public/media/portrait/portrait-800.webp", import.meta.url)),
    "image/webp",
  ),
};

const cards: OgCard[] = [
  {
    name: "home",
    label: "Open to roles · Lagos · UTC+1",
    title: site.name,
    subtitle:
      "Backend & full-stack engineer: payment systems, AI agent tooling and developer tools.",
  },
  {
    name: "writing",
    label: "Writing · veek.me",
    title: "I write what I build",
    subtitle: "Guides and deep dives on AI agents, payments, databases and security.",
  },
  ...(await Promise.all(projectFiles.map(readProjectCard))),
];

const outputDirectory = new URL("../public/og/", import.meta.url);
await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || undefined,
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const card of cards) {
  await page.setContent(renderCardHtml(card, assets), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL(`${card.name}.png`, outputDirectory).pathname });
  console.log(`og/${card.name}.png`);
}
await browser.close();

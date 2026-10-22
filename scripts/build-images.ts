/**
 * Exports the hero portrait as AVIF and WebP with alpha (PRD §7.5) and builds the film-grain
 * texture (PRD §7.4). Writes public/media/portrait/* and app/content/generated/portrait.json.
 *
 * Target heights are 800, 1200 and 1800 px. Heights larger than the source are skipped rather
 * than upscaled; the largest export is then the source height (PRD §7.5 "Ask").
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const sourcePath = new URL("../assets-src/portrait/graded-master.png", import.meta.url).pathname;
const outputDirectory = new URL("../public/media/portrait/", import.meta.url).pathname;
const manifestPath = new URL("../app/content/generated/portrait.json", import.meta.url).pathname;
const grainPath = new URL("../public/media/grain.png", import.meta.url).pathname;
const targetHeights = [800, 1200, 1800];
const avifBudgetBytes = 180 * 1024;

async function exportPortrait() {
  await mkdir(outputDirectory, { recursive: true });
  const source = sharp(sourcePath);
  const metadata = await source.metadata();
  if (!metadata.width || !metadata.height) throw new Error("Portrait has no dimensions");
  const sourceHeight = metadata.height;
  const heights = [...new Set(targetHeights.map((height) => Math.min(height, sourceHeight)))];

  const variants = [];
  for (const height of heights) {
    const width = Math.round((metadata.width / sourceHeight) * height);
    const resized = sharp(sourcePath).resize({ height });
    const avifBuffer = await resized.clone().avif({ quality: 52, effort: 6 }).toBuffer();
    const webpBuffer = await resized.clone().webp({ quality: 74, alphaQuality: 80 }).toBuffer();
    await writeFile(`${outputDirectory}portrait-${height}.avif`, avifBuffer);
    await writeFile(`${outputDirectory}portrait-${height}.webp`, webpBuffer);
    variants.push({ height, width, avifBytes: avifBuffer.length, webpBytes: webpBuffer.length });
    console.log(`portrait-${height}: avif ${avifBuffer.length} B, webp ${webpBuffer.length} B`);
  }

  const budgetVariant = variants.find((variant) => variant.height === 1200);
  if (budgetVariant && budgetVariant.avifBytes > avifBudgetBytes) {
    throw new Error(`1200 px AVIF is ${budgetVariant.avifBytes} B, over the 180 KB budget`);
  }

  const placeholder = await sharp(sourcePath)
    .resize({ height: 24 })
    .blur(1)
    .webp({ quality: 40 })
    .toBuffer();

  const manifest = {
    width: metadata.width,
    height: sourceHeight,
    variants,
    placeholder: `data:image/webp;base64,${placeholder.toString("base64")}`,
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

/** Static 128 px monochrome noise, kept under 10 KB (PRD §7.4). */
async function buildGrain() {
  const size = 128;
  const pixels = Buffer.alloc(size * size);
  let seed = 2026;
  for (let pixelIndex = 0; pixelIndex < pixels.length; pixelIndex += 1) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    pixels[pixelIndex] = seed % 256;
  }
  const grain = await sharp(pixels, { raw: { width: size, height: size, channels: 1 } })
    .png({ palette: true, colours: 16, compressionLevel: 9 })
    .toBuffer();
  await writeFile(grainPath, grain);
  console.log(`grain.png: ${grain.length} B`);
}

await exportPortrait();
await buildGrain();

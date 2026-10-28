/**
 * Reads last-month npm downloads for maintained packages (PRD §9.3) and writes
 * app/content/generated/package-stats.json. Keeps the committed snapshot on failure.
 */
import { writeFile } from "node:fs/promises";
import { z } from "zod";

import { downloadTotalFamilies, maintainedPackages } from "../app/content/proof.ts";

const outputPath = new URL("../app/content/generated/package-stats.json", import.meta.url);

const downloadsResponseSchema = z.object({
  downloads: z.number().int().nonnegative(),
  start: z.string(),
  end: z.string(),
  package: z.string(),
});

async function fetchPackageDownloads(packageName: string) {
  const response = await fetch(`https://api.npmjs.org/downloads/point/last-month/${packageName}`);
  if (!response.ok) throw new Error(`npm API responded ${response.status} for ${packageName}`);
  const body = downloadsResponseSchema.parse(await response.json());
  return {
    name: packageName,
    downloadsLastMonth: body.downloads,
    period: { start: body.start, end: body.end },
  };
}

const registryMetadataSchema = z.object({ time: z.object({ created: z.string() }) });
/** npm's downloads API serves ranges of at most 18 months. */
const maximumRangeDays = 540;

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Downloads from first publish (capped at the range limit) up to yesterday. */
async function fetchDownloadsSincePublish(packageName: string) {
  const metadataResponse = await fetch(
    `https://registry.npmjs.org/${packageName.replace("/", "%2f")}`,
  );
  if (!metadataResponse.ok) throw new Error(`npm registry responded ${metadataResponse.status}`);
  const created = new Date(
    registryMetadataSchema.parse(await metadataResponse.json()).time.created,
  );
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const earliest = new Date(yesterday.getTime() - maximumRangeDays * 24 * 60 * 60 * 1000);
  const start = toIsoDate(created > earliest ? created : earliest);
  const end = toIsoDate(yesterday);
  const response = await fetch(
    `https://api.npmjs.org/downloads/point/${start}:${end}/${packageName}`,
  );
  if (!response.ok) throw new Error(`npm API responded ${response.status} for ${packageName}`);
  return { downloads: downloadsResponseSchema.parse(await response.json()).downloads, start, end };
}

async function fetchFamilyTotal(family: (typeof downloadTotalFamilies)[number]) {
  const results = await Promise.all(family.packages.map(fetchDownloadsSincePublish));
  return {
    id: family.id,
    packages: [...family.packages],
    downloads: results.reduce((sum, result) => sum + result.downloads, 0),
    period: {
      start: results.map((result) => result.start).sort()[0] ?? "",
      end: results[0]?.end ?? "",
    },
  };
}

try {
  const packages = await Promise.all(maintainedPackages.map(fetchPackageDownloads));
  const totals = await Promise.all(downloadTotalFamilies.map(fetchFamilyTotal));
  const output = {
    fetchedAt: new Date().toISOString(),
    source: "https://api.npmjs.org/downloads/point/{period}/{package}",
    packages,
    totals,
  };
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote stats for ${packages.length} packages`);
} catch (error) {
  console.warn("::warning::npm stats fetch failed; keeping the committed snapshot.", error);
}

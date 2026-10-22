/**
 * Reads last-month npm downloads for maintained packages (PRD §9.3) and writes
 * app/content/generated/package-stats.json. Keeps the committed snapshot on failure.
 */
import { writeFile } from "node:fs/promises";
import { z } from "zod";

import { maintainedPackages } from "../app/content/proof.ts";

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

try {
  const packages = await Promise.all(maintainedPackages.map(fetchPackageDownloads));
  const output = {
    fetchedAt: new Date().toISOString(),
    source: "https://api.npmjs.org/downloads/point/last-month/{package}",
    packages,
  };
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote stats for ${packages.length} packages`);
} catch (error) {
  console.warn("::warning::npm stats fetch failed; keeping the committed snapshot.", error);
}

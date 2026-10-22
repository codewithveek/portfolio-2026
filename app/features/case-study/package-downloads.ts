import { packageStats } from "~/content/articles";
import { minimumDisplayedDownloads } from "~/content/proof";

export interface PackageDownloads {
  name: string;
  downloadsLastMonth: number;
  period: { start: string; end: string };
}

/** Packages linked from a project's npm URL, shown only at ≥ 100 downloads/month (PRD §9.3). */
export function getDisplayedDownloads(npmUrl: string | undefined): PackageDownloads[] {
  if (!npmUrl) return [];
  const packageName = decodeURIComponent(npmUrl.replace("https://www.npmjs.com/package/", ""));
  return packageStats.packages.filter(
    (stats) => stats.name === packageName && stats.downloadsLastMonth >= minimumDisplayedDownloads,
  );
}

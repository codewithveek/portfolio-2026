/** Proof strip sources (PRD §6.4, §10.5). Counts come from these lists, never typed by hand. */

/** npm packages Lucky maintains. Download counts come from generated/package-stats.json. */
export const maintainedPackages = [
  "@afriex/sdk",
  "medusa-payment-afriex",
  "@driftwatch/sdk",
  "cutroom",
  "@fluxmedia/core",
  "@hymem/core",
  "@pii-mask/core",
] as const;

export interface HackathonWin {
  event: string;
  project: string;
  placement: string;
  href?: string;
}

/**
 * Hackathon wins (PRD §14, item 3). Empty until Lucky supplies the list; while empty, the stat
 * is not shown in production.
 */
export const hackathonWins: readonly HackathonWin[] = [];

export const scrimbaRole = {
  label: "Scrimba community",
  value: "Community manager",
  detail: "2021–present",
  source: "PRD §6.4 (current status to confirm, PRD §14 item 4)",
} as const;

/**
 * Package families whose combined npm downloads are shown on their card (PRD §10.5). Totals are
 * fetched by scripts/fetch-package-stats.ts from each package's first publish (capped at 540
 * days, the npm range limit) to yesterday.
 */
export const downloadTotalFamilies = [
  {
    id: "pii-mask",
    packages: ["@pii-mask/core", "@pii-mask/cli", "@pii-mask/nlp", "@pii-mask/react"],
  },
] as const;

/** Packages whose monthly downloads are shown (PRD §9.3: only when ≥ 100/month). */
export const minimumDisplayedDownloads = 100;

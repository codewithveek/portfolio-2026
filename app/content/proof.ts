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

/** Packages whose monthly downloads are shown (PRD §9.3: only when ≥ 100/month). */
export const minimumDisplayedDownloads = 100;

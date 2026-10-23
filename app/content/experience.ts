import type { ExperienceEntry } from "./schemas";

/**
 * Experience timeline, newest first, max five rows (PRD §6.6). Rows marked `[Lucky]` need
 * confirmation (PRD §14, items 1, 2 and 4) and do not render in production.
 */
export const experience: readonly ExperienceEntry[] = [
  { role: "Founder & engineer", organisation: "Zia", years: "2026–present" },
  { role: "[Lucky] role", organisation: "Afriex", years: "Apr–Oct 2026" },
  {
    role: "Backend engineer [Lucky] confirm title",
    organisation: "Nippyy",
    years: "[Lucky] years",
  },
  { role: "Community manager", organisation: "Scrimba", years: "2021–present" },
];

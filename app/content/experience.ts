import type { ExperienceEntry } from "./schemas";

/**
 * Experience timeline, newest first, max five rows (PRD §6.6). Sources: Lucky's résumés
 * (Oct 2026) for Zia, Afriex, Nippyy and freelance work; PRD §6.4 for Scrimba.
 */
export const experience: readonly ExperienceEntry[] = [
  { role: "Founder & engineer", organisation: "Zia", years: "Sep 2026–present" },
  { role: "Developer Relations Engineer", organisation: "Afriex", years: "Apr–Oct 2026" },
  {
    role: "Software Engineer (part-time, remote)",
    organisation: "Nippyy",
    years: "Oct 2025–present",
  },
  { role: "Freelance software developer", organisation: "Self-employed", years: "2024–Sep 2025" },
  { role: "Community manager", organisation: "Scrimba", years: "2021–present" },
];

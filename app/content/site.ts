/** Identity, links and core copy (PRD §3, §4, §9.8). */
export const site = {
  name: "Lucky Victory",
  legalName: "Lucky Victory Success",
  alternateNames: ["Lucky Victory", "Veek", "CodewithVeek"],
  wordmark: "VEEK",
  origin: "https://veek.me",
  email: "hello@veek.me",
  jobTitle: "Software Engineer",
  locationLine: "Lagos, Nigeria · WAT (UTC+1) · open to remote and relocation",
  heroLabel: "Open to roles · Lagos · WAT (UTC+1)",
  heroSentence:
    "Backend & full-stack engineer building payment systems, AI agent tooling and developer tools — and writing about all three.",
  title: "Lucky Victory — Backend & Full-Stack Engineer",
  description:
    "Lucky Victory (Veek) builds payment systems, AI agent tooling and developer tools. Open to backend, full-stack and DevRel roles. Lagos, UTC+1, remote.",
  closingHeadline: ["Let's build", "what's next"],
  /** Cal.com (or similar) booking link for "Book a 20-min call" (PRD §14, item 8). */
  bookingUrl: "[Lucky] booking link",
} as const;

export interface SocialLink {
  label: string;
  href: string;
}

/** Footer and JSON-LD `sameAs` (PRD §6.9, §9.8). X handle sourced from the DEV profile. */
export const socialLinks: readonly SocialLink[] = [
  { label: "GitHub", href: "https://github.com/codewithveek" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lucky-victory-success" },
  { label: "X", href: "https://x.com/CodewithVeek" },
  { label: "DEV", href: "https://dev.to/codewithveek" },
];

export const resumeVariants = [
  { id: "backend", label: "Backend résumé", href: "/resume/lucky-victory-backend-engineer.pdf" },
  { id: "frontend", label: "Frontend résumé", href: "/resume/lucky-victory-frontend-engineer.pdf" },
] as const;

export type ResumeVariant = (typeof resumeVariants)[number]["id"];

import { site } from "~/content/site";

/** About copy (PRD §6.6). Keywords in asterisks end lime in `word-highlight`. */
export const aboutStatement =
  "I like the unglamorous parts: the access-control matrix, the *webhook* that arrives twice, the SDK error message someone reads at *2 a.m.*";

export const aboutParagraphs = [
  "I'm Lucky Victory, also known as Veek. I build backend systems for payments and tools for AI agents: the official Afriex TypeScript SDK and its commerce plugins, Zia for Shopify merchants, and DriftWatch, an open-source SDK for watching agents in production.",
  `I'm based in ${site.locationLine.replace(" · open to remote and relocation", "")}, and I work remotely and am open to relocation. UTC+1 overlaps the full European working day and US East Coast mornings. I'm looking for a backend, full-stack, frontend or DevRel role, and I write about what I build along the way.`,
] as const;

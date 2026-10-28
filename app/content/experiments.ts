import type { Experiment } from "./schemas";

/** Experiments grid under the work stack (PRD §6.5, §10.4). */
export const experiments: readonly Experiment[] = [
  {
    name: "pii-mask",
    label: "@pii-mask/core · open source",
    description:
      "Zero-dependency TypeScript PII masking with 31 detectors (including Nigerian NIN and BVN), six modes including reversible tokenization, and React bindings.",
    links: [
      { label: "Repo", href: "https://github.com/codewithveek/pii-mask" },
      { label: "npm", href: "https://www.npmjs.com/package/@pii-mask/core" },
    ],
    downloadTotalId: "pii-mask",
  },
  {
    name: "Vetit",
    label: "Agent Harness Hackathon · Aug 2026",
    description:
      "Reviews an MCP server, probes how its tools behave, and writes a least-privilege grant a human approves.",
    links: [
      {
        label: "Article",
        href: "https://dev.to/codewithveek/introducing-vetit-ai-agent-that-audits-mcps-44o9",
      },
    ],
  },
  {
    name: "hymem",
    label: "@hymem/core",
    description: "Bitemporal, multi-tenant memory for AI agents with pluggable storage.",
    links: [{ label: "npm", href: "https://www.npmjs.com/package/@hymem/core" }],
  },
  {
    name: "FluxMedia",
    label: "@fluxmedia/core",
    description: "One TypeScript upload API across Cloudinary, S3 and R2.",
    links: [
      { label: "fluxmedia.dev", href: "https://fluxmedia.dev" },
      { label: "npm", href: "https://www.npmjs.com/package/@fluxmedia/core" },
    ],
  },
  {
    name: "MediWatch",
    label: "Hackathon",
    description: "Vision-agent pipeline (YOLO + Moondream + Gemini) on Stream's Vision Agents SDK.",
    links: [{ label: "Repo", href: "https://github.com/codewithveek/medi-watch" }],
  },
  {
    name: "Claude skills",
    label: "Open source",
    description: "Public skills including product videos and database schema engineering.",
    links: [{ label: "codewithveek/skills", href: "https://github.com/codewithveek/skills" }],
  },
];

import type { WritingTopic } from "./schemas";

/** Featured articles, in order (PRD §10.3). Matched against the DEV feed by URL. */
export const featuredArticleUrls: readonly string[] = [
  "https://dev.to/codewithveek/from-rag-to-agents-how-tidb-powers-modern-ai-applications-3blc",
  "https://dev.to/codewithveek/ai-memory-systems-everything-you-need-to-know-35n0",
  "https://dev.to/afriex/afriex-webhook-integration-guide-signature-verification-event-handling-and-production-best-3c9o",
  "https://dev.to/codewithveek/detecting-ai-agent-behavioral-drift-with-opentelemetry-and-signoz-3d98",
  "https://dev.to/afriex/build-a-digital-marketplace-with-afriex-fastify-and-postgres-part-1-data-model-and-the-storefront-mej",
  "https://dev.to/codewithveek/understanding-toctou-the-race-condition-hiding-in-your-code-43nh",
];

/** Non-technical posts kept out of the feed (PRD §10.3). Matched by title. */
export const excludedArticleTitles: readonly string[] = [
  "Your Phone Is Stealing Your Life: Here's How to Take It Back",
  "The Architecture of Self: Why You Keep Building the Wrong Life",
];

export const writingTopics: ReadonlyArray<{ id: WritingTopic; label: string }> = [
  { id: "ai-agents", label: "AI & agents" },
  { id: "payments", label: "Payments & fintech" },
  { id: "databases", label: "Databases" },
  { id: "security", label: "Security" },
  { id: "web", label: "Web" },
];

/** DEV tags that place an article in a topic. An article can sit in several topics. */
export const topicTags: Readonly<Record<WritingTopic, readonly string[]>> = {
  "ai-agents": [
    "ai",
    "agents",
    "mcp",
    "otel",
    "opentelemetry",
    "observability",
    "signoz",
    "openai",
    "claude",
  ],
  payments: [
    "payments",
    "payment",
    "fintech",
    "crossborder",
    "afriex",
    "mobilemoney",
    "stripe",
    "crypto",
    "webhook",
  ],
  databases: ["database", "tidb", "vectordatabase", "sql"],
  security: ["security", "vulnerabilities"],
  web: ["webdev", "nextjs", "react", "javascript", "api", "tutorial", "beginners"],
};

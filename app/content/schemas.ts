import { z } from "zod";

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");
const kebabCase = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use kebab-case");

/** Every number on the site needs a source (PRD §10.5). */
export const sourcedMetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  source: z.string().min(1),
});

export const projectStatusSchema = z.enum(["live", "open-source", "private", "hackathon"]);

const decisionSchema = z.object({
  chose: z.string().min(1),
  over: z.string().min(1),
  because: z.string().min(1),
  cost: z.string().min(1),
});

/** One bar in the trace-style architecture diagram (PRD §7.6, §6.10). */
const architectureSpanSchema = z.object({
  label: z.string().min(1),
  detail: z.string().min(1),
  depth: z.number().int().min(0).max(4),
  /** Horizontal start and width as fractions of the diagram (0–1). */
  start: z.number().min(0).max(1),
  width: z.number().gt(0).max(1),
});

/** Project frontmatter (PRD §10.2), extended with the structured case-study sections (§6.10). */
export const projectFrontmatterSchema = z
  .object({
    slug: kebabCase,
    order: z.number().int().positive(),
    title: z.string().min(1),
    tagline: z.string().min(1).max(90),
    summary: z.string().min(1).max(200),
    role: z.string().min(1),
    period: z.object({ start: yearMonth.or(z.literal("[Lucky]")), end: yearMonth.nullable() }),
    status: projectStatusSchema,
    stack: z.array(z.string().min(1)).min(1),
    links: z.object({
      live: z.url().optional(),
      repo: z.url().optional(),
      npm: z.url().optional(),
      docs: z.url().optional(),
      article: z.url().optional(),
    }),
    /** Without `image`, the card shows a generated trace cover drawn from `architecture`. */
    cover: z.object({
      image: z.string().min(1).optional(),
      alt: z.string().min(1),
      video: z.object({ mp4: z.string(), webm: z.string(), poster: z.string() }).optional(),
    }),
    metrics: z.array(sourcedMetricSchema),
    confidentiality: z.string().optional(),
    problem: z.array(z.string().min(1)).min(1).max(4),
    architecture: z.array(architectureSpanSchema).min(1),
    decisions: z.array(decisionSchema).min(2).max(4),
    shipped: z.array(z.string().min(1)).min(1),
    next: z.array(z.string().min(1)).min(1),
  })
  .strict();

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type ArchitectureSpan = z.infer<typeof architectureSpanSchema>;
export type ProjectDecision = z.infer<typeof decisionSchema>;

export const experimentSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  links: z.array(z.object({ label: z.string().min(1), href: z.url() })),
  /** Id in `downloadTotalFamilies` whose combined npm downloads the card shows. */
  downloadTotalId: z.string().optional(),
});
export type Experiment = z.infer<typeof experimentSchema>;

export const testimonialSchema = z.object({
  quote: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  isFeatured: z.boolean(),
});
export type Testimonial = z.infer<typeof testimonialSchema>;

export const experienceEntrySchema = z.object({
  role: z.string().min(1),
  organisation: z.string().min(1),
  years: z.string().min(1),
});
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;

export const writingTopicSchema = z.enum(["ai-agents", "payments", "databases", "security", "web"]);
export type WritingTopic = z.infer<typeof writingTopicSchema>;

export const publicationSchema = z.enum(["codewithveek", "Afriex"]);

export const articleSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
  publishedAt: z.iso.datetime({ offset: true }),
  readingTimeMinutes: z.number().int().positive(),
  tags: z.array(z.string()),
  publication: publicationSchema,
});
export type Article = z.infer<typeof articleSchema>;

export const devArticlesFileSchema = z.object({
  fetchedAt: z.iso.datetime({ offset: true }),
  source: z.string(),
  articles: z.array(articleSchema),
});

export const packageStatsFileSchema = z.object({
  fetchedAt: z.iso.datetime({ offset: true }),
  source: z.string(),
  packages: z.array(
    z.object({
      name: z.string().min(1),
      downloadsLastMonth: z.number().int().nonnegative(),
      period: z.object({ start: z.string(), end: z.string() }),
    }),
  ),
  totals: z
    .array(
      z.object({
        id: z.string().min(1),
        packages: z.array(z.string().min(1)).min(1),
        downloads: z.number().int().nonnegative(),
        period: z.object({ start: z.string(), end: z.string() }),
      }),
    )
    .default([]),
});
export type PackageStatsFile = z.infer<typeof packageStatsFileSchema>;

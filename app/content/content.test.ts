import { describe, expect, it } from "vitest";

import { experience } from "./experience";
import { experiments } from "./experiments";
import { devArticles, getFeaturedArticles, packageStats } from "./articles";
import { featuredArticleUrls } from "./featured-writing";
import { getProjects, parseProjects } from "./projects.server";
import {
  experienceEntrySchema,
  experimentSchema,
  projectFrontmatterSchema,
  testimonialSchema,
} from "./schemas";
import { testimonials } from "./testimonials";

describe("content", () => {
  it("loads the five featured projects in PRD order", () => {
    expect(getProjects().map((project) => project.slug)).toEqual([
      "zia",
      "afriex-ecosystem",
      "driftwatch",
      "cutroom",
      "nippyy-backend",
    ]);
  });

  it("rejects invalid frontmatter so the build fails", () => {
    const [validProject] = getProjects();
    expect(() =>
      parseProjects({ "./projects/zia.mdx": { ...validProject, tagline: "x".repeat(91) } }),
    ).toThrow(/Invalid frontmatter/);
    expect(() =>
      parseProjects({
        "./projects/zia.mdx": { ...validProject, metrics: [{ label: "Users", value: "10" }] },
      }),
    ).toThrow(/Invalid frontmatter/);
    expect(() => parseProjects({ "./projects/other.mdx": validProject })).toThrow(/does not match/);
    expect(projectFrontmatterSchema.safeParse(validProject).success).toBe(true);
  });

  it("validates typed content arrays", () => {
    for (const testimonial of testimonials)
      expect(testimonialSchema.parse(testimonial)).toBeTruthy();
    for (const entry of experience) expect(experienceEntrySchema.parse(entry)).toBeTruthy();
    for (const experiment of experiments) expect(experimentSchema.parse(experiment)).toBeTruthy();
    expect(experience.length).toBeLessThanOrEqual(5);
  });

  it("resolves every featured article from the DEV snapshot", () => {
    expect(getFeaturedArticles()).toHaveLength(featuredArticleUrls.length);
    expect(devArticles.articles.length).toBeGreaterThanOrEqual(30);
    expect(packageStats.packages.length).toBeGreaterThan(0);
  });
});

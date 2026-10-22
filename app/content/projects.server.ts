import { projectFrontmatterSchema, type ProjectFrontmatter } from "./schemas";

/**
 * Case-study frontmatter, loaded at build time and validated with Zod (PRD §9.3).
 * A schema error throws while the server bundle loads, which fails the build's route discovery
 * and every request, so invalid content cannot ship.
 */
const frontmatterModules = import.meta.glob<unknown>("./projects/*.mdx", {
  eager: true,
  import: "frontmatter",
});

export function parseProjects(modules: Record<string, unknown>): ProjectFrontmatter[] {
  return Object.entries(modules)
    .map(([filePath, frontmatter]) => {
      const result = projectFrontmatterSchema.safeParse(frontmatter);
      if (!result.success) {
        throw new Error(`Invalid frontmatter in ${filePath}: ${result.error.message}`);
      }
      const expectedSlug = filePath
        .split("/")
        .pop()
        ?.replace(/\.mdx$/, "");
      if (result.data.slug !== expectedSlug) {
        throw new Error(`Slug "${result.data.slug}" does not match file name in ${filePath}`);
      }
      return result.data;
    })
    .sort((first, second) => first.order - second.order);
}

const projects = parseProjects(frontmatterModules);

export function getProjects(): ProjectFrontmatter[] {
  return projects;
}

export function getProjectBySlug(slug: string): ProjectFrontmatter | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): ProjectFrontmatter | undefined {
  const currentIndex = projects.findIndex((project) => project.slug === slug);
  if (currentIndex === -1) return undefined;
  return projects[(currentIndex + 1) % projects.length];
}

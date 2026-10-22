import type { ProjectFrontmatter } from "~/content/schemas";

/** The slice of a project the home page needs (keeps the loader payload small). */
export type ProjectSummary = Pick<
  ProjectFrontmatter,
  "slug" | "order" | "title" | "tagline" | "summary" | "stack" | "status" | "cover" | "architecture"
>;

export function toProjectSummary(project: ProjectFrontmatter): ProjectSummary {
  const { slug, order, title, tagline, summary, stack, status, cover, architecture } = project;
  return { slug, order, title, tagline, summary, stack, status, cover, architecture };
}

export const statusLabels: Record<ProjectSummary["status"], string> = {
  live: "Live",
  "open-source": "Open source",
  private: "Private",
  hackathon: "Hackathon",
};

export function formatProjectIndex(order: number, total: number): string {
  return `${String(order).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

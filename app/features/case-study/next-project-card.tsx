import { Link } from "react-router";

import type { ProjectFrontmatter } from "~/content/schemas";

/** `Next project →` card (PRD §6.10 item 8). */
export function NextProjectCard({
  project,
}: {
  project: Pick<ProjectFrontmatter, "slug" | "title" | "tagline">;
}) {
  return (
    <Link
      to={`/work/${project.slug}`}
      viewTransition
      className="group flex flex-col gap-4 rounded-card border border-border bg-surface p-8 transition-colors hover:border-accent-text md:flex-row md:items-end md:justify-between md:p-12"
    >
      <span>
        <span className="type-label text-text-muted">Next project</span>
        <span className="type-display-lg mt-4 block text-text">{project.title}</span>
        <span className="mt-3 block text-text-muted">{project.tagline}</span>
      </span>
      <span
        aria-hidden="true"
        className="type-display-lg text-accent-text transition-transform group-hover:translate-x-2"
      >
        →
      </span>
    </Link>
  );
}

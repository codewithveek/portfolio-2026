import type { CSSProperties } from "react";
import { Link } from "react-router";

import { formatProjectIndex, type ProjectSummary } from "./project-summary";
import { StackTags } from "./stack-tags";

interface ProjectDetailsProps {
  project: ProjectSummary;
  total: number;
  /** The index panel names its title for the view transition; card copies do not. */
  hasTransitionName?: boolean;
  headingLevel?: "h3" | "p";
}

/** Index, title, summary, tags and case-study link for one project. */
export function ProjectDetails({
  project,
  total,
  hasTransitionName = false,
  headingLevel: Heading = "h3",
}: ProjectDetailsProps) {
  const titleStyle = hasTransitionName
    ? ({ viewTransitionName: `project-title-${project.slug}` } as CSSProperties)
    : undefined;
  return (
    <div className="flex flex-col gap-5">
      <p className="type-label text-accent-text">{formatProjectIndex(project.order, total)}</p>
      <Heading
        className="type-heading-md text-[clamp(1.75rem,2.6vw,2.5rem)] text-text"
        style={titleStyle}
      >
        {project.title}
      </Heading>
      <p className="type-body-lg max-w-[30rem] text-text-muted">{project.summary}</p>
      <StackTags stack={project.stack} />
      <Link
        to={`/work/${project.slug}`}
        viewTransition
        aria-label={`Read case study: ${project.title}`}
        className="type-label group inline-flex w-fit items-center gap-2 border-b border-accent-text pb-1 text-text"
      >
        Read case study
        <span
          aria-hidden="true"
          className="text-accent-text transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </div>
  );
}

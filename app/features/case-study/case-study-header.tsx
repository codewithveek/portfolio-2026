import type { CSSProperties } from "react";
import { Link } from "react-router";

import type { ProjectFrontmatter } from "~/content/schemas";
import { statusLabels } from "~/features/work/project-summary";
import { placeholderSafe } from "~/shared/lib/placeholder";

import { formatPeriod } from "./format-period";

const linkLabels: Record<keyof ProjectFrontmatter["links"], string> = {
  live: "Live",
  repo: "Repo",
  npm: "npm",
  docs: "Docs",
  article: "Article",
};

/** Back link, kicker, title, tagline, meta row and link buttons (PRD §6.10, item 1). */
export function CaseStudyHeader({ project }: { project: ProjectFrontmatter }) {
  const role = placeholderSafe(project.role);
  const period = placeholderSafe(project.period.start) ? formatPeriod(project.period) : undefined;
  const metaRows = [
    { label: "Role", value: role },
    { label: "Period", value: period },
    { label: "Stack", value: project.stack.join(", ") },
    { label: "Status", value: statusLabels[project.status] },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));
  const links = (Object.keys(linkLabels) as Array<keyof typeof linkLabels>).flatMap((key) => {
    const href = project.links[key];
    return href ? [{ key, href, label: linkLabels[key] }] : [];
  });

  return (
    <header className="layout-container pt-8 pb-16">
      <Link
        to="/#work"
        className="type-label inline-flex items-center gap-2 text-text-muted hover:text-text"
      >
        <span aria-hidden="true">←</span> All work
      </Link>
      <p className="type-label mt-16 text-accent">
        Case study · {String(project.order).padStart(2, "0")}
      </p>
      <h1
        className="type-display-xl mt-6 text-text"
        style={{ viewTransitionName: `project-title-${project.slug}` } as CSSProperties}
      >
        {project.title}
      </h1>
      <p className="type-heading-xl mt-6 max-w-[48rem] text-text-muted">{project.tagline}</p>
      <dl className="mt-12 grid gap-6 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {metaRows.map((row) => (
          <div key={row.label}>
            <dt className="type-label text-text-muted">{row.label}</dt>
            <dd className="mt-2 text-text">{row.value}</dd>
          </div>
        ))}
      </dl>
      {links.length > 0 ? (
        <ul className="mt-10 flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="button button-outline"
              >
                <span>{link.label}</span>
                <span className="button-arrow" aria-hidden="true">
                  ↗
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {project.confidentiality && placeholderSafe(project.confidentiality) ? (
        <p className="type-label mt-8 max-w-[48rem] border-l-2 border-accent pl-4 text-text-muted normal-case tracking-normal">
          {project.confidentiality}
        </p>
      ) : null}
    </header>
  );
}

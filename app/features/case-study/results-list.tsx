import type { ProjectFrontmatter } from "~/content/schemas";
import { withoutPlaceholders } from "~/shared/lib/placeholder";

import type { PackageDownloads } from "./package-downloads";

interface ResultsListProps {
  project: ProjectFrontmatter;
  packageDownloads: readonly PackageDownloads[];
}

/**
 * Results (PRD §6.10 item 6): only sourced metrics (§10.5). npm downloads come from the
 * generated stats file and show only at ≥ 100/month. Otherwise, what shipped and its status.
 */
export function ResultsList({ project, packageDownloads }: ResultsListProps) {
  const metrics = withoutPlaceholders(project.metrics);
  return (
    <div className="flex flex-col gap-12">
      {metrics.length > 0 || packageDownloads.length > 0 ? (
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="border-t border-border pt-4">
              <dt className="type-label text-text-muted">{metric.label}</dt>
              <dd className="type-display-lg mt-3 text-[clamp(2rem,4vw,3.5rem)] text-text">
                {metric.value}
              </dd>
              <dd className="mt-2 text-sm text-text-muted">Source: {metric.source}</dd>
            </div>
          ))}
          {packageDownloads.map((stats) => (
            <div key={stats.name} className="border-t border-border pt-4">
              <dt className="type-label text-text-muted">{stats.name} · npm downloads / month</dt>
              <dd className="type-display-lg mt-3 text-[clamp(2rem,4vw,3.5rem)] text-text">
                {stats.downloadsLastMonth.toLocaleString("en-GB")}
              </dd>
              <dd className="mt-2 text-sm text-text-muted">
                Source: npm downloads API, {stats.period.start} to {stats.period.end}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      <div>
        <h3 className="type-label text-text-muted">What shipped</h3>
        <ul className="mt-4 flex flex-col border-t border-border">
          {project.shipped.map((item) => (
            <li key={item} className="flex gap-4 border-b border-border py-4 text-text">
              <span aria-hidden="true" className="text-accent">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

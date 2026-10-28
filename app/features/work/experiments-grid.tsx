import { experiments } from "~/content/experiments";
import { FadeUp } from "~/shared/motion/fade-up";

export interface DownloadTotal {
  downloads: number;
  period: { start: string; end: string };
}

interface ExperimentsGridProps {
  /** Combined npm downloads by family id, from the loader (PRD §10.5). */
  downloadTotals: Readonly<Record<string, DownloadTotal>>;
}

/** Compact text-only experiments grid (PRD §6.5, §10.4). */
export function ExperimentsGrid({ downloadTotals }: ExperimentsGridProps) {
  return (
    <div className="mt-32">
      <h3 className="type-label text-text-muted">Experiments</h3>
      <ul className="mt-6 grid gap-px overflow-hidden rounded-card border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
        {experiments.map((experiment, experimentIndex) => (
          <FadeUp
            as="li"
            key={experiment.name}
            index={experimentIndex % 3}
            className="flex flex-col gap-3 bg-bg p-6 md:p-8"
          >
            <p className="type-label text-accent-text">{experiment.label}</p>
            <p className="type-heading-md text-text">{experiment.name}</p>
            <p className="text-text-muted">{experiment.description}</p>
            {experiment.downloadTotalId && downloadTotals[experiment.downloadTotalId] ? (
              <DownloadCount total={downloadTotals[experiment.downloadTotalId]} />
            ) : null}
            {experiment.links.length > 0 ? (
              <ul className="mt-auto flex flex-wrap gap-4 pt-2">
                {experiment.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      rel="noreferrer"
                      target="_blank"
                      className="type-label text-text underline decoration-border underline-offset-4 hover:decoration-accent-text"
                    >
                      {link.label} <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </FadeUp>
        ))}
      </ul>
    </div>
  );
}

function DownloadCount({ total }: { total: DownloadTotal | undefined }) {
  if (!total) return null;
  const source = `npm downloads API, ${total.period.start} to ${total.period.end}`;
  return (
    <p className="type-label text-text" title={`Source: ${source}`}>
      {total.downloads.toLocaleString("en-GB")} npm downloads
      <span className="sr-only"> (source: {source})</span>
    </p>
  );
}

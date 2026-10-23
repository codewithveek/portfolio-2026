import { experiments } from "~/content/experiments";
import { FadeUp } from "~/shared/motion/fade-up";

/** Compact text-only experiments grid (PRD §6.5, §10.4). */
export function ExperimentsGrid() {
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

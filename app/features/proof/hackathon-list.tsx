import type { HackathonWin } from "~/content/proof";

/** The wins behind the count, revealed on hover, focus or tap (PRD §6.4). */
export function HackathonList({ wins }: { wins: readonly HackathonWin[] }) {
  return (
    <details className="group">
      <summary className="type-label cursor-pointer list-none text-accent [&::-webkit-details-marker]:hidden">
        See the list <span aria-hidden="true">↓</span>
      </summary>
      <ul className="mt-3 flex flex-col gap-2 text-sm text-text-muted">
        {wins.map((win) => (
          <li key={`${win.event}-${win.project}`}>
            {win.href ? (
              <a
                href={win.href}
                className="underline decoration-border underline-offset-4 hover:text-text"
              >
                {win.project}
              </a>
            ) : (
              win.project
            )}{" "}
            · {win.event} · {win.placement}
          </li>
        ))}
      </ul>
    </details>
  );
}

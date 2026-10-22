import { positioningStatements } from "./positioning-content";

/** All four statements stacked: the no-JS, pre-hydration and reduced-motion view (PRD §6.3). */
export function StaticStatementList() {
  return (
    <ol className="mt-8 flex flex-col gap-8">
      {positioningStatements.map((statement) => (
        <li key={statement.word}>
          <p className="type-display-lg text-text">{statement.word}</p>
          <p className="type-body-lg mt-3 max-w-[40rem] text-text-muted">{statement.caption}</p>
        </li>
      ))}
    </ol>
  );
}

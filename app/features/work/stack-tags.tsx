/** Mono stack tags (PRD §6.5). */
export function StackTags({
  stack,
  isOnPaper = false,
}: {
  stack: readonly string[];
  isOnPaper?: boolean;
}) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Stack">
      {stack.map((technology) => (
        <li
          key={technology}
          className={`type-label rounded-full border px-3 py-1.5 ${
            isOnPaper ? "border-paper-muted/40 text-paper-muted" : "border-border text-text-muted"
          }`}
        >
          {technology}
        </li>
      ))}
    </ul>
  );
}

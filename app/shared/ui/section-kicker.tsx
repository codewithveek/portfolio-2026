interface SectionKickerProps {
  number: string;
  text: string;
  /** On paper, the number uses the deep accent (lime is never text on paper, PRD §7.1). */
  isOnPaper?: boolean;
}

/** Numbered kicker, `01 · SELECTED WORK` (PRD §6, §7.2). */
export function SectionKicker({ number, text, isOnPaper = false }: SectionKickerProps) {
  return (
    <p className={`type-label ${isOnPaper ? "text-paper-text" : "text-text"}`}>
      <span className={isOnPaper ? "text-accent-deep" : "text-accent"}>{number}</span>
      <span aria-hidden="true"> · </span>
      <span className="sr-only"> </span>
      {text}
    </p>
  );
}

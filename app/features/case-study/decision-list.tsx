import type { ProjectDecision } from "~/content/schemas";
import { withoutPlaceholders } from "~/shared/lib/placeholder";
import { FadeUp } from "~/shared/motion/fade-up";

/** "We chose X over Y because Z; the cost was W." (PRD §6.10 item 5). */
export function DecisionList({ decisions }: { decisions: readonly ProjectDecision[] }) {
  const visibleDecisions = withoutPlaceholders(decisions);
  if (visibleDecisions.length === 0) return null;
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {visibleDecisions.map((decision, decisionIndex) => (
        <FadeUp
          as="li"
          key={decision.chose}
          index={decisionIndex % 2}
          className="rounded-card border border-border bg-surface p-6 md:p-8"
        >
          <p className="type-label text-accent-text">
            Decision {String(decisionIndex + 1).padStart(2, "0")}
          </p>
          <p className="type-body-lg mt-4 text-text">
            Chose <strong className="font-semibold">{decision.chose}</strong> over{" "}
            {decision.over.charAt(0).toLowerCase() + decision.over.slice(1)}.
          </p>
          <p className="mt-3 text-text-muted">
            <span className="text-text">Why: </span>
            {decision.because}
          </p>
          <p className="mt-3 text-text-muted">
            <span className="text-text">Cost: </span>
            {decision.cost}
          </p>
        </FadeUp>
      ))}
    </ol>
  );
}

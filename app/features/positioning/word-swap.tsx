import { AnimatePresence, m, useMotionValueEvent, type MotionValue } from "motion/react";
import { useState } from "react";

import { duration, easing } from "~/shared/motion/motion-tokens";

import { positioningStatements } from "./positioning-content";
import { ProofCaption } from "./proof-caption";

const statementCount = positioningStatements.length;

export function progressToStatementIndex(progress: number): number {
  return Math.min(statementCount - 1, Math.max(0, Math.floor(progress * statementCount)));
}

interface WordSwapProps {
  progress: MotionValue<number>;
}

/**
 * `pinned-word-swap` (PRD §8.4). Only the active word is visible; every word stays in the
 * DOM (visually hidden) so tabbing and screen readers reach all four (PRD §12.1).
 */
export function WordSwap({ progress }: WordSwapProps) {
  const [activeIndex, setActiveIndex] = useState(() => progressToStatementIndex(progress.get()));
  const [filledTicks, setFilledTicks] = useState(0);

  useMotionValueEvent(progress, "change", (latest) => {
    setActiveIndex(progressToStatementIndex(latest));
    setFilledTicks(Math.min(statementCount, Math.floor(latest * statementCount + 0.0001)));
  });

  const activeStatement = positioningStatements[activeIndex] ?? positioningStatements[0];

  return (
    <div className="mt-6 flex w-full flex-col items-center">
      <ol className="sr-only">
        {positioningStatements.map((statement) => (
          <li key={statement.word}>
            {statement.word}. {statement.caption}
          </li>
        ))}
      </ol>
      <div
        aria-hidden="true"
        className="relative grid h-[2.2em] w-full place-items-center overflow-hidden type-display-lg"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <m.p
            key={activeStatement.word}
            className="col-start-1 row-start-1 text-center text-text"
            initial={{ y: "40%", opacity: 0, filter: "blur(8px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-40%", opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: duration.base, ease: easing.outExpo }}
          >
            {activeStatement.word}
          </m.p>
        </AnimatePresence>
      </div>
      <ol aria-hidden="true" className="mt-8 flex gap-2">
        {positioningStatements.map((statement, tickIndex) => (
          <li
            key={statement.word}
            className={`h-1 w-10 rounded-full transition-colors duration-[180ms] ${
              tickIndex < Math.max(filledTicks, activeIndex + 1) ? "bg-accent" : "bg-border"
            }`}
          />
        ))}
      </ol>
      <ProofCaption caption={activeStatement.caption} />
    </div>
  );
}

import { AnimatePresence, m } from "motion/react";

import { duration, easing } from "~/shared/motion/motion-tokens";

/** One-line proof under the active word (PRD §6.3). */
export function ProofCaption({ caption }: { caption: string }) {
  return (
    <div
      aria-hidden="true"
      className="mt-6 grid min-h-[3.5em] w-full max-w-[40rem] place-items-start"
    >
      <AnimatePresence initial={false} mode="wait">
        <m.p
          key={caption}
          className="type-body-lg col-start-1 row-start-1 w-full text-center text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: easing.outQuart }}
        >
          {caption}
        </m.p>
      </AnimatePresence>
    </div>
  );
}

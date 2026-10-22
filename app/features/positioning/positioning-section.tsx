import { useRef } from "react";

import { useMotionPreference } from "~/shared/motion/use-motion-preference";
import { useSectionProgress } from "~/shared/motion/use-section-progress";
import { OrbitMotif } from "~/shared/ui/orbit-motif";

import { positioningKicker } from "./positioning-content";
import { StaticStatementList } from "./static-statement-list";
import { TypedKicker } from "./typed-kicker";
import { WordSwap } from "./word-swap";

/**
 * Pinned positioning section (PRD §6.3). The outer block is 300 vh only when scripting is on
 * and motion is allowed (CSS media queries, so the height is right in the server HTML and
 * nothing shifts on hydration). Otherwise it is a static stacked list.
 */
export function PositioningSection() {
  const outerRef = useRef<HTMLElement>(null);
  const { allowsRichMotion } = useMotionPreference();
  const progress = useSectionProgress(outerRef, ["start start", "end end"]);

  return (
    <section
      ref={outerRef}
      id="positioning"
      aria-labelledby="positioning-kicker"
      className="positioning-outer relative"
    >
      <div className="positioning-inner relative flex flex-col items-center justify-center overflow-hidden">
        <OrbitMotif
          mode={allowsRichMotion ? "scroll" : "static"}
          progress={progress}
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[min(120vw,90svh)] -translate-x-1/2 -translate-y-1/2 opacity-25"
        />
        <div className="layout-container flex flex-col items-center text-center">
          <TypedKicker
            id="positioning-kicker"
            text={positioningKicker}
            isAnimated={allowsRichMotion}
          />
          {allowsRichMotion ? (
            <WordSwap progress={progress} />
          ) : (
            <div className="text-left md:text-center">
              <StaticStatementList />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

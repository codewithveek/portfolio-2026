import { m, useScroll } from "motion/react";

import { useMotionPreference } from "~/shared/motion/use-motion-preference";

/** 2 px lime line bound to page scroll (PRD §6.1, §8.4 `progress-line`). Hidden under reduced motion. */
export function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();
  const { allowsRichMotion } = useMotionPreference();
  if (!allowsRichMotion) return null;
  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

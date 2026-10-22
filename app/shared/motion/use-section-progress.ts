import { useScroll, type MotionValue } from "motion/react";
import type { RefObject } from "react";

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/** Scroll progress (0–1) of one element through the viewport (PRD §8.5). */
export function useSectionProgress(
  targetRef: RefObject<HTMLElement | null>,
  offset: ScrollOffset,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: targetRef, offset });
  return scrollYProgress;
}

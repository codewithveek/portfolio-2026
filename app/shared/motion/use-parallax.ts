import { useTransform, type MotionValue } from "motion/react";

/** Maps section progress to a numeric range, e.g. portrait `y` 0 → 120 (PRD §8.4). */
export function useParallax(
  progress: MotionValue<number>,
  outputRange: readonly [number, number],
): MotionValue<number> {
  return useTransform(progress, [0, 1], [outputRange[0], outputRange[1]]);
}

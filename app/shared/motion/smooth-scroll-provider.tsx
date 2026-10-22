import type Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

import { setSmoothScroller } from "./scroll-to";
import { useMotionPreference } from "./use-motion-preference";

/**
 * One Lenis instance for smooth wheel scrolling (PRD §8.2). Created only on fine pointers
 * without reduced motion, and loaded with a dynamic import so touch devices never download it.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { prefersReducedMotion, isCoarsePointer } = useMotionPreference();
  const shouldSmoothScroll = !prefersReducedMotion && !isCoarsePointer;

  useEffect(() => {
    if (!shouldSmoothScroll) return;
    let lenisInstance: Lenis | null = null;
    let isCancelled = false;
    void import("lenis").then(({ default: LenisConstructor }) => {
      if (isCancelled) return;
      lenisInstance = new LenisConstructor({ autoRaf: true, syncTouch: false, lerp: 0.1 });
      setSmoothScroller(lenisInstance);
    });
    return () => {
      isCancelled = true;
      lenisInstance?.destroy();
      setSmoothScroller(null);
    };
  }, [shouldSmoothScroll]);

  return children;
}

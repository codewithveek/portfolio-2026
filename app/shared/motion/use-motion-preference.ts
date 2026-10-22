import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

const coarsePointerQuery = "(pointer: coarse)";

function subscribeToPointer(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia(coarsePointerQuery);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function readIsCoarsePointer(): boolean {
  return window.matchMedia(coarsePointerQuery).matches;
}

export interface MotionPreference {
  /** True when the visitor asked for reduced motion. */
  prefersReducedMotion: boolean;
  /** True when the primary pointer is touch. */
  isCoarsePointer: boolean;
  /** True when rich, scroll-linked motion should run. False on the server and before hydration. */
  allowsRichMotion: boolean;
  /** False during SSR and the hydration render, so the first client render matches the server. */
  isHydrated: boolean;
}

/** The one wrapper around motion preferences (PRD §8.5). */
export function useMotionPreference(): MotionPreference {
  const isHydrated = useIsHydrated();
  const systemPrefersReducedMotion = useReducedMotion() ?? false;
  const prefersReducedMotion = isHydrated && systemPrefersReducedMotion;
  const isCoarsePointer = useSyncExternalStore(
    subscribeToPointer,
    readIsCoarsePointer,
    () => false,
  );
  return {
    prefersReducedMotion,
    isCoarsePointer,
    allowsRichMotion: isHydrated && !prefersReducedMotion,
    isHydrated,
  };
}

function subscribeToNothing(): () => void {
  return () => undefined;
}

/** False during SSR and the hydration render, true afterwards. */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

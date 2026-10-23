import { useEffect, type RefObject } from "react";

let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Also reveal elements a jump (End key, anchor link) skipped past, so nothing above
          // the viewport is left hidden.
          const isScrolledPast = entry.boundingClientRect.bottom < 0;
          if (entry.isIntersecting || isScrolledPast) {
            entry.target.setAttribute("data-in-view", "");
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3 },
    );
  }
  return sharedObserver;
}

function isInViewport(element: Element): boolean {
  const bounds = element.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}

/**
 * Registers an element for a triggered reveal (fade-up, blur-in, mask, line-draw).
 * Elements already on screen are marked visible before `data-motion-ready` applies, so nothing
 * that was painted by the server ever disappears.
 */
export function useReveal(elementRef: RefObject<Element | null>): void {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (isInViewport(element)) {
      element.setAttribute("data-in-view", "");
      return;
    }
    const observer = getSharedObserver();
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [elementRef]);
}

/** Sets `<html data-motion-ready>` once, after the first client effects have run. */
export function markMotionReady(): void {
  // Wait one frame so every useReveal effect has already marked on-screen elements.
  requestAnimationFrame(() => {
    document.documentElement.setAttribute("data-motion-ready", "");
  });
}

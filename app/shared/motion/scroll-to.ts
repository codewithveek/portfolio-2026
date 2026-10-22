import type Lenis from "lenis";

let smoothScroller: Lenis | null = null;

export function setSmoothScroller(instance: Lenis | null): void {
  smoothScroller = instance;
}

/**
 * Scrolls to an in-page anchor. Uses Lenis when it exists, native `scrollIntoView` otherwise
 * (PRD §8.2). Moves focus to the target so keyboard and screen-reader users land there too.
 */
export function scrollToSection(sectionId: string): void {
  const target = document.getElementById(sectionId);
  if (!target) return;
  if (smoothScroller) {
    smoothScroller.scrollTo(target, { offset: 0 });
  } else {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  history.replaceState(null, "", `#${sectionId}`);
}

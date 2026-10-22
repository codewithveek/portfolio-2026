import { useEffect, useRef } from "react";

import type { SectionId } from "./section-ids";

interface DockActiveIndicatorProps {
  activeSection: SectionId | null;
}

/**
 * Active-section background that slides between dock items (PRD §8.4 `active-indicator`).
 * It animates `clip-path` (allowed by §8.1) instead of a layout animation, so Motion's
 * larger layout bundle is not needed. Reduced motion swaps instantly via CSS.
 */
export function DockActiveIndicator({ activeSection }: DockActiveIndicatorProps) {
  const indicatorRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const indicator = indicatorRef.current;
    const list = indicator?.parentElement;
    if (!indicator || !list) return;
    const activeLabel = activeSection
      ? list.querySelector<HTMLElement>(`[data-dock-item="${activeSection}"]`)
      : null;
    const activeLink = activeLabel?.closest("a");
    if (!activeLink || activeLink.offsetParent === null) {
      indicator.style.opacity = "0";
      return;
    }
    const listBounds = list.getBoundingClientRect();
    const linkBounds = activeLink.getBoundingClientRect();
    const insetLeft = linkBounds.left - listBounds.left;
    const insetRight = listBounds.right - linkBounds.right;
    indicator.style.opacity = "1";
    indicator.style.clipPath = `inset(0 ${insetRight}px 0 ${insetLeft}px round 10px)`;
  }, [activeSection]);

  return (
    <li
      ref={indicatorRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-surface-raised opacity-0 transition-[clip-path,opacity] duration-[180ms] ease-[var(--ease-in-out-cubic)] motion-reduce:transition-none"
      style={{ clipPath: "inset(0 100% 0 0 round 10px)" }}
    />
  );
}

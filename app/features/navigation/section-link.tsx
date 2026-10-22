import type { MouseEvent, ReactNode } from "react";
import { useLocation } from "react-router";

import { trackEvent } from "~/features/analytics/track-event";
import { scrollToSection } from "~/shared/motion/scroll-to";

import type { SectionId } from "./section-ids";

interface SectionLinkProps {
  sectionId: SectionId;
  children: ReactNode;
  className?: string;
  /** Analytics id for `cta_click` (PRD §9.7). */
  trackingId?: string;
  ariaCurrent?: boolean;
}

/**
 * Link to a home-page section. On the home page it scrolls with Lenis or `scrollIntoView`;
 * elsewhere (and without JS) it is a normal link to `/#section`.
 */
export function SectionLink({
  sectionId,
  children,
  className,
  trackingId,
  ariaCurrent = false,
}: SectionLinkProps) {
  const location = useLocation();
  const isOnHome = location.pathname === "/";
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (trackingId) trackEvent("cta_click", trackingId);
    if (!isOnHome || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    scrollToSection(sectionId);
  };
  return (
    <a
      href={isOnHome ? `#${sectionId}` : `/#${sectionId}`}
      className={className}
      onClick={handleClick}
      aria-current={ariaCurrent ? "location" : undefined}
    >
      {children}
    </a>
  );
}

import { useEffect, useState } from "react";

import { sectionIds } from "./section-ids";

/** True once less than 10 % of the hero is visible (PRD §8.4 `dock-enter`). */
export function useIsHeroOutOfView(hasHero: boolean): boolean {
  // Pages without a hero (case studies, writing) show the dock straight away.
  const [isHeroOutOfView, setIsHeroOutOfView] = useState(!hasHero);

  useEffect(() => {
    const hero = hasHero ? document.getElementById(sectionIds.home) : null;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroOutOfView((entry?.intersectionRatio ?? 0) < 0.1),
      { threshold: [0, 0.1, 0.2] },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [hasHero]);

  return isHeroOutOfView;
}

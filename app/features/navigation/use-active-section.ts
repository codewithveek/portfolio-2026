import { useEffect, useState } from "react";

import type { SectionId } from "./section-ids";

/** The section crossing the middle of the viewport (PRD §8.4 `active-indicator`). */
export function useActiveSection(sectionIdList: readonly SectionId[]): SectionId | null {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const sectionId of sectionIdList) {
      const section = document.getElementById(sectionId);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [sectionIdList]);

  return activeSection;
}

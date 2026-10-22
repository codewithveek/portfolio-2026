import { createRef, useEffect, useMemo, useState, type RefObject } from "react";

import { ProjectStackCard } from "./project-stack-card";
import type { ProjectSummary } from "./project-summary";

interface ProjectStackProps {
  projects: readonly ProjectSummary[];
  onActiveIndexChange: (activeIndex: number) => void;
}

/** The stack of sticky cards; reports which card is active for the index panel. */
export function ProjectStack({ projects, onActiveIndexChange }: ProjectStackProps) {
  const cardRefs = useMemo<RefObject<HTMLElement | null>[]>(
    () => projects.map(() => createRef<HTMLElement>()),
    [projects],
  );
  const [observedIndex, setObservedIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const cardIndex = Number(entry.target.getAttribute("data-project-card"));
          if (Number.isInteger(cardIndex)) setObservedIndex(cardIndex);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const cardRef of cardRefs) {
      if (cardRef.current) observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, [cardRefs]);

  useEffect(() => onActiveIndexChange(observedIndex), [observedIndex, onActiveIndexChange]);

  return (
    <div className="flex flex-col gap-24 lg:gap-[40vh]">
      {projects.map((project, cardIndex) => (
        <ProjectStackCard
          key={project.slug}
          project={project}
          cardIndex={cardIndex}
          total={projects.length}
          cardRef={cardRefs[cardIndex] ?? createRef<HTMLElement>()}
          nextCardRef={cardRefs[cardIndex + 1] ?? null}
        />
      ))}
    </div>
  );
}

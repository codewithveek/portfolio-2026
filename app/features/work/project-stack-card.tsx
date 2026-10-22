import { m, useTransform } from "motion/react";
import { lazy, Suspense, useRef, type CSSProperties, type RefObject } from "react";
import { Link } from "react-router";

import { useMotionPreference } from "~/shared/motion/use-motion-preference";
import { useSectionProgress } from "~/shared/motion/use-section-progress";

import { ProjectCover } from "./project-cover";
import { ProjectDetails } from "./project-details";
import type { ProjectSummary } from "./project-summary";

const CursorLabel = lazy(() => import("~/shared/motion/cursor-label"));

interface ProjectStackCardProps {
  project: ProjectSummary;
  cardIndex: number;
  total: number;
  /** The next card; as it rises over this one, this card scales down and dims. */
  nextCardRef: RefObject<HTMLElement | null> | null;
  cardRef: RefObject<HTMLElement | null>;
}

/** One sticky media card in the work stack (PRD §6.5, §8.4 `stack-cards`). */
export function ProjectStackCard({
  project,
  cardIndex,
  total,
  nextCardRef,
  cardRef,
}: ProjectStackCardProps) {
  const mediaRef = useRef<HTMLAnchorElement>(null);
  const { allowsRichMotion, isCoarsePointer } = useMotionPreference();
  const fallbackRef = useRef<HTMLElement>(null);
  const nextProgress = useSectionProgress(nextCardRef ?? fallbackRef, ["start end", "start start"]);
  const scale = useTransform(nextProgress, [0, 1], [1, 0.94]);
  const dimFilter = useTransform(nextProgress, [0, 1], ["brightness(1)", "brightness(0.6)"]);
  const isStackAnimated = allowsRichMotion && nextCardRef !== null;

  return (
    <article
      ref={cardRef}
      data-project-card={cardIndex}
      aria-labelledby={`project-title-${project.slug}`}
      className="work-stack-card flex flex-col gap-8"
      style={{ "--card-index": cardIndex } as CSSProperties}
    >
      <m.div
        className="origin-top"
        style={isStackAnimated ? { scale, filter: dimFilter } : undefined}
      >
        <Link
          ref={mediaRef}
          to={`/work/${project.slug}`}
          viewTransition
          tabIndex={-1}
          aria-hidden="true"
          className="relative block"
        >
          <ProjectCover
            slug={project.slug}
            title={project.title}
            spans={project.architecture}
            image={project.cover.image}
            alt={project.cover.alt}
          />
          {allowsRichMotion && !isCoarsePointer ? (
            <Suspense fallback={null}>
              <CursorLabel areaRef={mediaRef} label="View case study" />
            </Suspense>
          ) : (
            <span className="type-label absolute right-4 bottom-4 rounded-full bg-bg/80 px-3 py-2 text-text">
              View case study →
            </span>
          )}
        </Link>
      </m.div>
      <div className="work-card-details">
        <ProjectDetails project={project} total={total} headingLevel="h3" />
      </div>
      <span id={`project-title-${project.slug}`} className="sr-only">
        {project.title}
      </span>
    </article>
  );
}

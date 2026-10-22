import { AnimatePresence, m } from "motion/react";

import { duration, easing } from "~/shared/motion/motion-tokens";

import { ProjectDetails } from "./project-details";
import type { ProjectSummary } from "./project-summary";

interface ProjectIndexPanelProps {
  projects: readonly ProjectSummary[];
  activeIndex: number;
  isAnimated: boolean;
}

/**
 * Sticky left column (PRD §6.5): details of the active project plus a vertical tick list.
 * `index-crossfade` swaps the details when the active card changes. Shown only on desktop
 * with scripting; otherwise each card carries its own details.
 */
export function ProjectIndexPanel({ projects, activeIndex, isAnimated }: ProjectIndexPanelProps) {
  const activeProject = projects[activeIndex] ?? projects[0];
  if (!activeProject) return null;
  return (
    <div className="work-index-panel sticky top-[12vh] flex gap-8" aria-live="polite">
      <ol aria-label="Projects" className="flex flex-col gap-2 pt-1">
        {projects.map((project, projectIndex) => (
          <li
            key={project.slug}
            aria-current={projectIndex === activeIndex ? "true" : undefined}
            className={`h-8 w-0.5 rounded-full transition-colors duration-[180ms] ${
              projectIndex === activeIndex ? "bg-accent" : "bg-border"
            }`}
          >
            <span className="sr-only">{project.title}</span>
          </li>
        ))}
      </ol>
      <div className="min-h-[26rem] flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={activeProject.slug}
            initial={isAnimated ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={isAnimated ? { opacity: 0, y: -12 } : { opacity: 0 }}
            transition={{ duration: isAnimated ? duration.base * 0.66 : 0, ease: easing.outExpo }}
          >
            <ProjectDetails project={activeProject} total={projects.length} hasTransitionName />
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

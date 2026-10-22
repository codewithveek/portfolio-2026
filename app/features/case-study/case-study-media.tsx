import { m, useTransform } from "motion/react";
import { useRef } from "react";

import type { ProjectFrontmatter } from "~/content/schemas";
import { ProjectCover } from "~/features/work/project-cover";
import { useMotionPreference } from "~/shared/motion/use-motion-preference";
import { useSectionProgress } from "~/shared/motion/use-section-progress";

/**
 * Hero media (PRD §6.10 item 2). `expand-media`: grows from an inset card to full width as the
 * reader scrolls; full size before hydration and with reduced motion. Target of the
 * `card-to-case-study` view transition.
 */
export function CaseStudyMedia({ project }: { project: ProjectFrontmatter }) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const { allowsRichMotion } = useMotionPreference();
  const progress = useSectionProgress(mediaRef, ["start end", "start start"]);
  const scale = useTransform(progress, [0, 1], [0.86, 1]);
  const clipPath = useTransform(progress, [0, 1], ["inset(0% round 16px)", "inset(0% round 0px)"]);
  return (
    <div ref={mediaRef} className="layout-container">
      <m.div style={allowsRichMotion ? { scale, clipPath } : undefined}>
        <ProjectCover
          slug={project.slug}
          title={project.title}
          spans={project.architecture}
          image={project.cover.image}
          alt={project.cover.alt}
        />
      </m.div>
    </div>
  );
}

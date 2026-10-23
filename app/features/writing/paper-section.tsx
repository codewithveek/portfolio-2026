import { m, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

import { useMotionPreference } from "~/shared/motion/use-motion-preference";
import { useSectionProgress } from "~/shared/motion/use-section-progress";

interface PaperSectionProps {
  id: string;
  labelledBy: string;
  children: ReactNode;
}

/**
 * The light "new chapter" section (PRD §6.8). `section-reveal`: the clip-path opens from an
 * inset rounded rectangle to full width as it enters. No clip before hydration or with
 * reduced motion.
 */
export function PaperSection({ id, labelledBy, children }: PaperSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { allowsRichMotion } = useMotionPreference();
  const progress = useSectionProgress(sectionRef, ["start end", "start 0.4"]);
  const clipPath = useTransform(
    progress,
    [0, 1],
    ["inset(6% 4% 0% 4% round 24px)", "inset(0% 0% 0% 0% round 0px)"],
  );
  return (
    <m.section
      ref={sectionRef}
      id={id}
      aria-labelledby={labelledBy}
      className="paper paper-flip bg-paper text-paper-text"
      style={allowsRichMotion ? { clipPath } : undefined}
    >
      {children}
    </m.section>
  );
}

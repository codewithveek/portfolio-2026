import { useState } from "react";

import { useMotionPreference } from "~/shared/motion/use-motion-preference";
import { SectionKicker } from "~/shared/ui/section-kicker";

import { ExperimentsGrid, type DownloadTotal } from "./experiments-grid";
import { ProjectIndexPanel } from "./project-index-panel";
import { ProjectStack } from "./project-stack";
import type { ProjectSummary } from "./project-summary";

/** Selected work (PRD §6.5): sticky index on the left, stacking media cards on the right. */
interface WorkSectionProps {
  projects: readonly ProjectSummary[];
  downloadTotals: Readonly<Record<string, DownloadTotal>>;
}

export function WorkSection({ projects, downloadTotals }: WorkSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { allowsRichMotion } = useMotionPreference();

  return (
    <section id="work" aria-labelledby="work-heading" className="section-padding layout-container">
      <SectionKicker number="01" text="Selected work" />
      <h2 id="work-heading" className="type-display-lg mt-6 text-text">
        Things I've built
      </h2>
      <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-8">
        <div className="work-index-column lg:col-span-4">
          <ProjectIndexPanel
            projects={projects}
            activeIndex={activeIndex}
            isAnimated={allowsRichMotion}
          />
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <ProjectStack projects={projects} onActiveIndexChange={setActiveIndex} />
        </div>
      </div>
      <ExperimentsGrid downloadTotals={downloadTotals} />
    </section>
  );
}

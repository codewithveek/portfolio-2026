import { m } from "motion/react";

import { springs } from "~/shared/motion/motion-tokens";
import { useMotionPreference } from "~/shared/motion/use-motion-preference";

import { DockActiveIndicator } from "./dock-active-indicator";
import { ResumeMenu } from "./resume-menu";
import { dockItems, type SectionId } from "./section-ids";
import { SectionLink } from "./section-link";
import { useActiveSection } from "./use-active-section";
import { useIsHeroOutOfView } from "./use-is-hero-out-of-view";

const observedSections: readonly SectionId[] = dockItems.map((item) => item.id);
const mobileItemIds: readonly SectionId[] = ["work", "writing"];

/**
 * Fixed bottom dock (PRD §6.1). Enters when the hero leaves the viewport (`dock-enter`),
 * highlights the active section (`active-indicator`). Without JS it is simply always visible.
 */
export function DockNav({ hasHero = false }: { hasHero?: boolean }) {
  const { isHydrated, prefersReducedMotion } = useMotionPreference();
  const isHeroOutOfView = useIsHeroOutOfView(hasHero);
  const activeSection = useActiveSection(observedSections);
  const isDockVisible = !isHydrated || isHeroOutOfView;

  const dockContent = (
    <div className="relative flex items-center gap-1 rounded-dock border border-border bg-surface/90 p-1.5 backdrop-blur-md">
      <ul className="relative flex items-center" data-dock-list>
        <DockActiveIndicator activeSection={activeSection} />
        {dockItems.map((item) => (
          <li key={item.id} className={mobileItemIds.includes(item.id) ? "" : "max-md:hidden"}>
            <SectionLink
              sectionId={item.id}
              ariaCurrent={activeSection === item.id}
              className="type-label relative z-10 flex h-11 items-center px-3 text-text-muted transition-colors hover:text-text aria-[current=location]:text-text md:px-4"
            >
              <span data-dock-item={item.id}>{item.label}</span>
            </SectionLink>
          </li>
        ))}
      </ul>
      <SectionLink
        sectionId="contact"
        trackingId="hire_me_dock"
        className="type-label flex h-11 items-center rounded-[10px] bg-accent px-4 text-accent-ink"
      >
        Hire me
      </SectionLink>
      <div className="max-md:hidden">
        <ResumeMenu triggerVariant="icon" placement="above" />
      </div>
    </div>
  );

  const wrapperClassName =
    "fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]";

  if (!isHydrated) {
    // Server render and the hydration pass: a plain nav, visible without JavaScript.
    return (
      <nav aria-label="Sections" className={wrapperClassName}>
        {dockContent}
      </nav>
    );
  }

  return (
    <m.nav
      aria-label="Sections"
      className={wrapperClassName}
      inert={!isDockVisible}
      initial={false}
      animate={
        prefersReducedMotion
          ? { opacity: isDockVisible ? 1 : 0 }
          : { opacity: isDockVisible ? 1 : 0, y: isDockVisible ? 0 : 24 }
      }
      transition={springs.dock}
    >
      {dockContent}
    </m.nav>
  );
}

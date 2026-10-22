import { m } from "motion/react";
import { useRef } from "react";

import { ResumeMenu } from "~/features/navigation/resume-menu";
import { SectionLink } from "~/features/navigation/section-link";
import { TopBar } from "~/features/navigation/top-bar";
import { useMotionPreference } from "~/shared/motion/use-motion-preference";
import { useParallax } from "~/shared/motion/use-parallax";
import { useSectionProgress } from "~/shared/motion/use-section-progress";
import { OrbitMotif } from "~/shared/ui/orbit-motif";

import { HeroHeadline } from "./hero-headline";
import { HeroPortrait } from "./hero-portrait";

/** Hero (PRD §6.2). Complete without JavaScript; parallax is added after hydration. */
export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { allowsRichMotion } = useMotionPreference();
  const progress = useSectionProgress(heroRef, ["start start", "end start"]);
  const portraitY = useParallax(progress, [0, 120]);
  const portraitScale = useParallax(progress, [1, 1.08]);
  const copyY = useParallax(progress, [0, -40]);
  const glowOpacity = useParallax(progress, [0.12, 0]);

  return (
    <section
      ref={heroRef}
      id="home"
      aria-label="Introduction"
      className="grid-texture relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[18%] right-[12%] -z-10 size-[42vmax] rounded-full bg-accent blur-[140px]"
        style={{ opacity: allowsRichMotion ? glowOpacity : 0.12 }}
      />
      <OrbitMotif
        mode="time"
        className="pointer-events-none absolute top-[6%] right-[-10%] -z-10 size-[110vw] opacity-30 lg:top-[14%] lg:right-[22%] lg:size-[40vw]"
      />
      <HeroPortrait
        parallax={allowsRichMotion ? { y: portraitY, scale: portraitScale } : undefined}
      />
      <div className="layout-container relative z-10 flex flex-1 flex-col">
        <TopBar />
        <m.div
          className="flex flex-1 flex-col justify-end pt-[38svh] pb-24 lg:w-1/2 lg:justify-center lg:pt-0 lg:pb-32"
          style={allowsRichMotion ? { y: copyY } : undefined}
        >
          <HeroHeadline />
          <div className="hero-intro-fade mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <SectionLink
              sectionId="work"
              className="button button-primary"
              trackingId="see_my_work"
            >
              <span>See my work</span>
              <span className="button-arrow" aria-hidden="true">
                →
              </span>
            </SectionLink>
            <ResumeMenu triggerVariant="outline" />
          </div>
        </m.div>
        <p className="type-label absolute bottom-8 left-[var(--gutter)] text-text-muted max-lg:hidden">
          Scroll <span aria-hidden="true">↓</span>
        </p>
      </div>
    </section>
  );
}

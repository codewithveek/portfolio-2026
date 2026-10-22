import { FadeUp } from "~/shared/motion/fade-up";
import { WordHighlight } from "~/shared/motion/word-highlight";
import { SectionKicker } from "~/shared/ui/section-kicker";

import { aboutParagraphs, aboutStatement } from "./about-content";
import { ExperienceTimeline } from "./experience-timeline";

/** About (PRD §6.6): statement left; paragraphs and experience right. */
export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-padding layout-container"
    >
      <SectionKicker number="02" text="About" />
      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <span id="about-heading" className="sr-only">
            About Lucky
          </span>
          <WordHighlight statement={aboutStatement} className="type-heading-xl" />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          {aboutParagraphs.map((paragraph, paragraphIndex) => (
            <FadeUp
              as="p"
              key={paragraph.slice(0, 24)}
              variant="blur-in"
              index={paragraphIndex}
              className="type-body-lg mb-6 text-text-muted"
            >
              {paragraph}
            </FadeUp>
          ))}
          <ExperienceTimeline />
        </div>
      </div>
    </section>
  );
}

import { ResumeMenu } from "~/features/navigation/resume-menu";
import { SectionLink } from "~/features/navigation/section-link";

/** "Want this kind of work on your team?" (PRD §6.10 item 8). */
export function CaseStudyCta() {
  return (
    <div className="flex flex-col gap-8 rounded-card bg-accent p-8 text-accent-ink md:flex-row md:items-center md:justify-between md:p-12">
      <p className="type-heading-md text-[clamp(1.5rem,3vw,2.5rem)]">
        Want this kind of work on your team?
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <SectionLink
          sectionId="contact"
          trackingId="hire_me_case_study"
          className="button bg-accent-ink text-accent"
        >
          <span>Hire me</span>
          <span className="button-arrow" aria-hidden="true">
            →
          </span>
        </SectionLink>
        <div className="[&_.button-outline]:border-accent-ink [&_.button-outline]:text-accent-ink">
          <ResumeMenu triggerVariant="outline" placement="above" />
        </div>
      </div>
    </div>
  );
}

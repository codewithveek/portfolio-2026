import type { ReactNode } from "react";

interface CaseStudySectionProps {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}

/** A numbered case-study section with a sticky label on desktop. */
export function CaseStudySection({ id, number, title, children }: CaseStudySectionProps) {
  return (
    <section
      aria-labelledby={id}
      className="layout-container grid gap-8 border-t border-border py-16 lg:grid-cols-12 lg:gap-8 lg:py-24"
    >
      <div className="lg:col-span-3">
        <h2 id={id} className="type-label lg:sticky lg:top-24">
          <span className="text-accent">{number}</span> <span aria-hidden="true">·</span> {title}
        </h2>
      </div>
      <div className="lg:col-span-9">{children}</div>
    </section>
  );
}

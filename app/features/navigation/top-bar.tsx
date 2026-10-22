import { Link } from "react-router";

import { site } from "~/content/site";

import { SectionLink } from "./section-link";

/** Top bar inside the hero, not fixed (PRD §6.1). */
export function TopBar() {
  return (
    <header className="relative z-20 flex items-center justify-between py-6">
      <Link
        to="/"
        className="type-heading-md tracking-[0.08em] text-text"
        aria-label={`${site.wordmark}, home`}
      >
        {site.wordmark}
      </Link>
      <SectionLink sectionId="contact" className="button button-outline" trackingId="hire_me_top">
        <span>Hire me</span>
        <span className="button-arrow" aria-hidden="true">
          →
        </span>
      </SectionLink>
    </header>
  );
}

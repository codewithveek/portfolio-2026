import { site } from "~/content/site";
import { MaskRevealText } from "~/shared/motion/mask-reveal-text";

/** Label, name and sentence (PRD §4, §6.2). Name lines rise with the CSS `hero-intro`. */
export function HeroHeadline() {
  const [firstName = "", lastName = ""] = site.name.toUpperCase().split(" ");
  return (
    <div>
      <p className="hero-intro-fade type-label flex items-center gap-2 text-accent">
        <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
        {site.heroLabel}
      </p>
      <MaskRevealText
        as="h1"
        trigger="intro"
        lines={[firstName, lastName]}
        className="type-display-xl relative z-10 mt-6 text-text"
      />
      <p className="hero-intro-fade type-body-lg mt-8 max-w-[34rem] text-text-muted md:text-[1.25rem]">
        {site.heroSentence}
      </p>
    </div>
  );
}

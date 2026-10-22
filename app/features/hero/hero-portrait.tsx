import { m, type MotionValue } from "motion/react";

import portrait from "~/content/generated/portrait.json";

function buildSrcSet(format: "avif" | "webp"): string {
  return portrait.variants
    .map((variant) => `/media/portrait/portrait-${variant.height}.${format} ${variant.width}w`)
    .join(", ");
}

const largestVariant = portrait.variants[portrait.variants.length - 1];
const imageSizes = "(min-width: 1024px) 50vw, 100vw";

interface HeroPortraitProps {
  /** Scroll-linked values from `portrait-parallax`; absent before hydration or with reduced motion. */
  parallax?: { y: MotionValue<number>; scale: MotionValue<number> };
}

/**
 * Graded portrait (PRD §7.5): AVIF/WebP srcset, high fetch priority, explicit dimensions,
 * never lazy. Fades to black toward the copy and the bottom so text sits on near-black.
 */
export function HeroPortrait({ parallax }: HeroPortraitProps) {
  return (
    <div className="hero-intro-portrait pointer-events-none absolute inset-x-0 top-16 h-[50svh] lg:inset-y-0 lg:top-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[54%]">
      <m.div className="relative h-full w-full" style={parallax}>
        <picture>
          <source type="image/avif" srcSet={buildSrcSet("avif")} sizes={imageSizes} />
          <source type="image/webp" srcSet={buildSrcSet("webp")} sizes={imageSizes} />
          <img
            src={`/media/portrait/portrait-${largestVariant?.height ?? 1200}.webp`}
            alt="Lucky Victory, in a black T-shirt, lit from the left with a faint lime rim light."
            width={portrait.width}
            height={portrait.height}
            fetchPriority="high"
            decoding="async"
            className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom lg:left-auto lg:right-[4%] lg:translate-x-0"
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-bg)_2%,transparent_45%)] lg:bg-[linear-gradient(to_right,var(--color-bg)_0%,transparent_38%),linear-gradient(to_top,var(--color-bg)_0%,transparent_30%)]"
        />
      </m.div>
    </div>
  );
}

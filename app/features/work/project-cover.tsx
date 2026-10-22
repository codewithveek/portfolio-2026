import type { CSSProperties } from "react";

import type { ArchitectureSpan } from "~/content/schemas";
import { traceBarMix, traceTextClass } from "~/shared/ui/trace-colors";
import { OrbitMotif } from "~/shared/ui/orbit-motif";

interface ProjectCoverProps {
  slug: string;
  title: string;
  spans: readonly ArchitectureSpan[];
  image?: string;
  alt: string;
  className?: string;
}

/**
 * Project media. Until real screenshots or loops exist (PRD §14 item 12), the cover is a
 * trace-style rendering of the project's own architecture spans (PRD §7.6): honest, light and
 * on-brand. The element carries the `card-to-case-study` view-transition name (PRD §8.4).
 */
export function ProjectCover({
  slug,
  title,
  spans,
  image,
  alt,
  className = "",
}: ProjectCoverProps) {
  const transitionStyle = { viewTransitionName: `project-media-${slug}` } as CSSProperties;
  if (image) {
    return (
      <img
        src={image}
        alt={alt}
        className={`aspect-[16/10] w-full rounded-card object-cover ${className}`}
        style={transitionStyle}
        loading="lazy"
      />
    );
  }
  const maxDepth = Math.max(...spans.map((span) => span.depth));
  return (
    <div
      role="img"
      aria-label={alt}
      style={transitionStyle}
      className={`relative isolate flex aspect-[16/10] w-full flex-col justify-between overflow-hidden rounded-card border border-border bg-surface p-5 [--trace-row:26px] md:p-8 md:[--trace-row:36px] ${className}`}
    >
      <OrbitMotif
        mode="static"
        className="pointer-events-none absolute -top-1/4 -right-1/4 -z-10 size-[80%] opacity-20"
      />
      <div
        aria-hidden="true"
        className="type-label flex items-center justify-between text-text-muted"
      >
        <span>trace · {slug}</span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent" />
          {title}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="relative w-full"
        style={{ height: `calc(${maxDepth + 1} * var(--trace-row))` }}
      >
        {spans.map((span, spanIndex) => (
          <div
            key={`${span.label}-${spanIndex}`}
            className="absolute flex items-center overflow-hidden rounded-[3px] px-2"
            style={{
              top: `calc(${span.depth} * var(--trace-row))`,
              height: "calc(var(--trace-row) - 6px)",
              left: `${span.start * 100}%`,
              width: `calc(${span.width * 100}% - 4px)`,
              backgroundColor: `color-mix(in srgb, var(--color-accent) ${traceBarMix(span.depth)}%, var(--color-surface))`,
            }}
          >
            <span
              className={`truncate font-mono text-[10px] font-medium tracking-[0.08em] uppercase md:text-[11px] ${traceTextClass(span.depth)}`}
            >
              {span.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

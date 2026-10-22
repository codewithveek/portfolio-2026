import { useRef, type CSSProperties } from "react";

import type { ArchitectureSpan } from "~/content/schemas";
import { traceBarMix, traceTextClass } from "~/shared/ui/trace-colors";
import { useReveal } from "~/shared/motion/use-reveal";

/**
 * "What I built" diagram (PRD §6.10 item 4): spans drawn like a trace, each with its detail.
 * The bars draw in with `line-draw` (scaleX from the left); the text is always in the HTML.
 */
export function ArchitectureDiagram({ spans }: { spans: readonly ArchitectureSpan[] }) {
  const diagramRef = useRef<HTMLOListElement>(null);
  useReveal(diagramRef);
  return (
    <ol
      ref={diagramRef}
      data-reveal="bars"
      className="flex flex-col gap-3"
      aria-label="Architecture, outermost layer first"
    >
      {spans.map((span, spanIndex) => (
        <li
          key={`${span.label}-${spanIndex}`}
          className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] md:items-center md:gap-6"
          style={{ "--draw-index": spanIndex } as CSSProperties}
        >
          <div className="relative h-10">
            <div
              data-bar
              className="absolute inset-y-0 flex origin-left items-center overflow-hidden rounded-[3px] px-3"
              style={{
                left: `${span.start * 100}%`,
                width: `${span.width * 100}%`,
                backgroundColor: `color-mix(in srgb, var(--color-accent) ${traceBarMix(span.depth)}%, var(--color-surface))`,
              }}
            >
              <span
                className={`truncate font-mono text-[11px] font-medium tracking-[0.08em] uppercase ${traceTextClass(span.depth)}`}
              >
                {span.label}
              </span>
            </div>
          </div>
          <p className="text-sm text-text-muted">
            <span className="sr-only">{span.label}: </span>
            {span.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}

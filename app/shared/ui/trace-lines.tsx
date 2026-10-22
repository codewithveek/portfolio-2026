import { useRef, type CSSProperties } from "react";

import { useReveal } from "../motion/use-reveal";

export interface TraceSpan {
  label: string;
  depth: number;
  /** Fractions of the full width (0–1). */
  start: number;
  width: number;
}

interface TraceLinesProps {
  spans: readonly TraceSpan[];
  className?: string;
  /** Rows are drawn this many units apart. */
  rowHeight?: number;
}

const viewWidth = 1000;

/**
 * Flame-graph style span bars (PRD §7.6). Used as section dividers and for generated project
 * covers. Strokes draw in with `line-draw` (PRD §8.4). Decorative; the text lives elsewhere.
 */
export function TraceLines({ spans, className = "", rowHeight = 28 }: TraceLinesProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useReveal(svgRef);
  const maxDepth = Math.max(...spans.map((span) => span.depth));
  const viewHeight = (maxDepth + 1) * rowHeight;
  return (
    <svg
      ref={svgRef}
      data-reveal="line-draw"
      className={className}
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {spans.map((span, spanIndex) => {
        const x = span.start * viewWidth;
        const y = span.depth * rowHeight + rowHeight * 0.5;
        const width = span.width * viewWidth;
        return (
          <line
            key={`${span.label}-${spanIndex}`}
            data-draw
            pathLength={1}
            x1={x + 2}
            x2={x + width - 2}
            y1={y}
            y2={y}
            stroke="var(--color-accent)"
            strokeOpacity={1 - span.depth * 0.15}
            strokeWidth={rowHeight * 0.5}
            style={{ "--draw-index": spanIndex } as CSSProperties}
          />
        );
      })}
    </svg>
  );
}

import type { ReactNode } from "react";

import { CountUp } from "~/shared/motion/count-up";
import { FadeUp } from "~/shared/motion/fade-up";

interface StatBlockProps {
  label: string;
  /** A number counts up; text is shown as is. */
  value: number | string;
  suffix?: string;
  /** Source note for the number (PRD §10.5), exposed as a tooltip and to screen readers. */
  source: string;
  index: number;
  children?: ReactNode;
}

/** Mono label above a display number (PRD §6.4). */
export function StatBlock({ label, value, suffix, source, index, children }: StatBlockProps) {
  return (
    <FadeUp index={index} className="flex flex-col gap-3 border-t border-border pt-6">
      <dt className="type-label text-text-muted">{label}</dt>
      <dd className="flex flex-col gap-3">
        <span
          className={
            typeof value === "number"
              ? "type-display-lg tabular-nums-strict text-[clamp(2.5rem,4.8vw,4.5rem)] text-text"
              : "type-heading-md pt-2 text-[clamp(1.25rem,2vw,1.75rem)] text-text"
          }
          title={source}
        >
          {typeof value === "number" ? <CountUp value={value} suffix={suffix} /> : value}
        </span>
        <span className="sr-only">Source: {source}</span>
        {children}
      </dd>
    </FadeUp>
  );
}

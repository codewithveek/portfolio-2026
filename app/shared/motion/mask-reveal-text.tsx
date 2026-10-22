import { useRef, type CSSProperties, type ElementType } from "react";

import { useReveal } from "./use-reveal";

interface MaskRevealTextProps {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  /** "intro" plays on load with CSS (hero); "scroll" plays when the text enters the viewport. */
  trigger?: "intro" | "scroll";
}

/** `hero-intro` and `mask-reveal` (PRD §8.4): each line rises from behind a mask. */
export function MaskRevealText({
  lines,
  as: Element = "h2",
  className,
  trigger = "scroll",
}: MaskRevealTextProps) {
  const elementRef = useRef<HTMLElement>(null);
  useReveal(elementRef);
  const lineClassName = trigger === "intro" ? "mask-line hero-intro-line" : "mask-line";
  return (
    <Element
      ref={elementRef}
      className={className}
      data-reveal={trigger === "scroll" ? "mask" : undefined}
    >
      {lines.map((line, lineIndex) => (
        <span
          key={line}
          className={lineClassName}
          style={{ "--line-index": lineIndex } as CSSProperties}
        >
          <span>{line}</span>
        </span>
      ))}
    </Element>
  );
}

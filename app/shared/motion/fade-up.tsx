import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

import { useReveal } from "./use-reveal";

type RevealVariant = "fade-up" | "blur-in";

interface FadeUpProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Position in a staggered group (multiplied by `stagger.base`). */
  index?: number;
  variant?: RevealVariant;
  id?: string;
}

/** Triggered `fade-up` / `blur-in` (PRD §8.4). Content is visible in server HTML. */
export function FadeUp({
  children,
  as: Element = "div",
  className,
  index = 0,
  variant = "fade-up",
  id,
}: FadeUpProps) {
  const elementRef = useRef<HTMLElement>(null);
  useReveal(elementRef);
  const style = { "--reveal-index": index } as CSSProperties;
  return (
    <Element ref={elementRef} id={id} data-reveal={variant} className={className} style={style}>
      {children}
    </Element>
  );
}

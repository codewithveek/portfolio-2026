import type { ElementType, ReactNode } from "react";

interface MonoLabelProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/** JetBrains Mono uppercase label (PRD §7.2 `label`). */
export function MonoLabel({ children, as: Element = "span", className = "" }: MonoLabelProps) {
  return <Element className={`type-label ${className}`}>{children}</Element>;
}

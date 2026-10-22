import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, type RefObject } from "react";

import { duration, springs } from "./motion-tokens";

interface CursorLabelProps {
  /** The element the label follows the pointer over. */
  areaRef: RefObject<HTMLElement | null>;
  label: string;
}

/**
 * `cursor-label` (PRD §8.4): a pill that follows a fine pointer over project media. Loaded with a
 * dynamic import only on fine pointers; the system cursor stays visible.
 */
export default function CursorLabel({ areaRef, label }: CursorLabelProps) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, springs.cursorLabel);
  const springY = useSpring(pointerY, springs.cursorLabel);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = area.getBoundingClientRect();
      pointerX.set(event.clientX - bounds.left + 16);
      pointerY.set(event.clientY - bounds.top + 16);
    };
    const showLabel = () => setIsVisible(true);
    const hideLabel = () => setIsVisible(false);
    area.addEventListener("pointermove", handlePointerMove);
    area.addEventListener("pointerenter", showLabel);
    area.addEventListener("pointerleave", hideLabel);
    return () => {
      area.removeEventListener("pointermove", handlePointerMove);
      area.removeEventListener("pointerenter", showLabel);
      area.removeEventListener("pointerleave", hideLabel);
    };
  }, [areaRef, pointerX, pointerY]);

  return (
    <m.span
      aria-hidden="true"
      className="type-label pointer-events-none absolute top-0 left-0 z-20 rounded-full bg-accent px-3 py-2 whitespace-nowrap text-accent-ink"
      style={{ x: springX, y: springY }}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: duration.fast }}
    >
      {label} →
    </m.span>
  );
}

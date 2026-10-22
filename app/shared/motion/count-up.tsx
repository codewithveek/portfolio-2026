import { animate } from "motion/react";
import { useEffect, useRef } from "react";

import { duration, easing } from "./motion-tokens";
import { useMotionPreference } from "./use-motion-preference";

interface CountUpProps {
  value: number;
  /** Text after the number, such as "+". */
  suffix?: string;
  className?: string;
}

/**
 * `count-up` (PRD §8.4). The final value is in the server HTML; the count from 0 starts only
 * after hydration, when the number enters the viewport, and never under reduced motion.
 */
export function CountUp({ value, suffix = "", className }: CountUpProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const { allowsRichMotion } = useMotionPreference();

  useEffect(() => {
    const element = numberRef.current;
    if (!element || !allowsRichMotion) return;
    const bounds = element.getBoundingClientRect();
    // Already on screen at hydration: keep the final value rather than flashing back to 0.
    if (bounds.top < window.innerHeight && bounds.bottom > 0) return;

    element.textContent = `0${suffix}`;
    let stopAnimation: (() => void) | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const controls = animate(0, value, {
          duration: duration.scenic,
          ease: easing.outExpo,
          onUpdate: (latest) => {
            element.textContent = `${Math.round(latest)}${suffix}`;
          },
        });
        stopAnimation = () => controls.stop();
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      stopAnimation?.();
      element.textContent = `${value}${suffix}`;
    };
  }, [allowsRichMotion, value, suffix]);

  return (
    <span ref={numberRef} className={className}>
      {value}
      {suffix}
    </span>
  );
}

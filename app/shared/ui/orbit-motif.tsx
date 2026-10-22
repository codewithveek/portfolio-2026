import { useMotionValueEvent, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";

import { useMotionPreference } from "../motion/use-motion-preference";

const radius = 100;
/** Meridian widths as a share of the radius, with phase offsets (PRD §7.6). */
const meridians = [
  { baseRatio: 1, phase: 0 },
  { baseRatio: 0.55, phase: Math.PI / 3 },
  { baseRatio: 0.15, phase: (2 * Math.PI) / 3 },
] as const;

const secondsPerCycle = 24;

interface OrbitMotifProps {
  className?: string;
  /** "time": one cycle per 24 s while visible. "scroll": angle follows `progress`. */
  mode: "time" | "scroll" | "static";
  /** Section progress 0–1; one half-turn per quarter (PRD §8.4 orbit-rotate). */
  progress?: MotionValue<number>;
  turnsPerProgress?: number;
}

/** Orbit: one circle, three meridians, a dashed equator. Decorative (PRD §7.6). */
export function OrbitMotif({
  className = "",
  mode,
  progress,
  turnsPerProgress = 2,
}: OrbitMotifProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const meridianRefs = useRef<Array<SVGEllipseElement | null>>([]);
  const { allowsRichMotion } = useMotionPreference();

  const applyAngle = (angle: number) => {
    meridians.forEach((meridian, meridianIndex) => {
      const ellipse = meridianRefs.current[meridianIndex];
      if (!ellipse) return;
      const width = Math.abs(Math.cos(angle + meridian.phase)) * radius;
      ellipse.setAttribute("rx", width.toFixed(2));
    });
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (mode !== "time" || !allowsRichMotion || !svg) return;
    let frameId = 0;
    let isVisible = false;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsedSeconds = (now - startTime) / 1000;
      applyAngle((elapsedSeconds / secondsPerCycle) * Math.PI * 2);
      if (isVisible) frameId = requestAnimationFrame(tick);
    };
    // Pause when off-screen (PRD §8.5).
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? false;
      cancelAnimationFrame(frameId);
      if (isVisible) frameId = requestAnimationFrame(tick);
    });
    observer.observe(svg);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [mode, allowsRichMotion]);

  return (
    <svg
      ref={svgRef}
      className={`orbit-motif ${className}`}
      viewBox="-102 -102 204 204"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
      focusable="false"
    >
      <circle r={radius} />
      {meridians.map((meridian, meridianIndex) => (
        <ellipse
          key={meridian.baseRatio}
          ref={(element) => {
            meridianRefs.current[meridianIndex] = element;
          }}
          rx={meridian.baseRatio * radius}
          ry={radius}
        />
      ))}
      <ellipse rx={radius} ry={radius * 0.22} strokeDasharray="3 4" />
      <line x1={-radius} x2={radius} y1="0" y2="0" strokeOpacity="0.4" />
      {mode === "scroll" && progress && allowsRichMotion ? (
        <ScrollAngle progress={progress} turnsPerProgress={turnsPerProgress} onAngle={applyAngle} />
      ) : null}
    </svg>
  );
}

interface ScrollAngleProps {
  progress: MotionValue<number>;
  turnsPerProgress: number;
  onAngle: (angle: number) => void;
}

function ScrollAngle({ progress, turnsPerProgress, onAngle }: ScrollAngleProps) {
  useMotionValueEvent(progress, "change", (latest) => {
    onAngle(latest * turnsPerProgress * Math.PI * 2);
  });
  return null;
}

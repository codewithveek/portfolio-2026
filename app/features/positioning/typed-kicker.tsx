import { useEffect, useRef, useState } from "react";

const millisecondsPerCharacter = 18;

/** Kicker types out once on first entry (PRD §8.4 `pinned-word-swap`). Full text in SSR. */
interface TypedKickerProps {
  id: string;
  text: string;
  isAnimated: boolean;
}

export function TypedKicker({ id, text, isAnimated }: TypedKickerProps) {
  const kickerRef = useRef<HTMLHeadingElement>(null);
  const [visibleLength, setVisibleLength] = useState(text.length);

  useEffect(() => {
    const kicker = kickerRef.current;
    if (!isAnimated || !kicker) return;
    setVisibleLength(0);
    let intervalId = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      intervalId = window.setInterval(() => {
        setVisibleLength((length) => {
          if (length >= text.length) window.clearInterval(intervalId);
          return Math.min(text.length, length + 1);
        });
      }, millisecondsPerCharacter);
    });
    observer.observe(kicker);
    return () => {
      observer.disconnect();
      window.clearInterval(intervalId);
      setVisibleLength(text.length);
    };
  }, [isAnimated, text]);

  return (
    <h2 ref={kickerRef} id={id} className="type-label text-accent" aria-label={text}>
      <span aria-hidden="true">{text.slice(0, visibleLength)}</span>
      <span aria-hidden="true" className="invisible">
        {text.slice(visibleLength)}
      </span>
    </h2>
  );
}

import { m, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { useMotionPreference } from "./use-motion-preference";
import { useSectionProgress } from "./use-section-progress";

export interface HighlightWord {
  text: string;
  /** Keywords end lime (PRD §6.6). */
  isKeyword: boolean;
}

/** Splits a statement into words; keywords are wrapped in asterisks and may span words, e.g. "*2 a.m.*". */
export function parseHighlightStatement(statement: string): HighlightWord[] {
  let isInsideKeyword = false;
  return statement
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      const opensKeyword = token.startsWith("*");
      const closesKeyword = /\*[.,:;!?]?$/.test(token);
      const isKeyword = isInsideKeyword || opensKeyword;
      if (opensKeyword) isInsideKeyword = true;
      if (closesKeyword) isInsideKeyword = false;
      return { text: token.replace(/\*/g, ""), isKeyword };
    });
}

interface WordHighlightProps {
  statement: string;
  className?: string;
}

/** `word-highlight` (PRD §8.4): words brighten from muted to white as they scroll through. */
export function WordHighlight({ statement, className }: WordHighlightProps) {
  const statementRef = useRef<HTMLHeadingElement>(null);
  const words = parseHighlightStatement(statement);
  const progress = useSectionProgress(statementRef, ["start 0.85", "end 0.35"]);
  const { allowsRichMotion } = useMotionPreference();

  return (
    <h2 ref={statementRef} className={className}>
      {words.map((word, wordIndex) => {
        const sliceStart = wordIndex / words.length;
        const sliceEnd = (wordIndex + 1) / words.length;
        const key = `${word.text}-${wordIndex}`;
        const colorClass = word.isKeyword ? "text-accent" : "text-text";
        if (!allowsRichMotion) {
          return (
            <span key={key} className={colorClass}>
              {word.text}{" "}
            </span>
          );
        }
        return (
          <HighlightedWord
            key={key}
            word={word}
            progress={progress}
            slice={[sliceStart, sliceEnd]}
          />
        );
      })}
    </h2>
  );
}

interface HighlightedWordProps {
  word: HighlightWord;
  progress: MotionValue<number>;
  slice: [number, number];
}

function HighlightedWord({ word, progress, slice }: HighlightedWordProps) {
  const opacity = useTransform(progress, slice, [0.25, 1]);
  return (
    <>
      <m.span style={{ opacity }} className={word.isKeyword ? "text-accent" : "text-text"}>
        {word.text}
      </m.span>{" "}
    </>
  );
}

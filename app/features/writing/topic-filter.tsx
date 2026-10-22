import type { MouseEvent } from "react";

import { writingTopics } from "~/content/featured-writing";
import type { WritingTopic } from "~/content/schemas";

interface TopicFilterProps {
  activeTopic: WritingTopic | null;
  onSelect: (topic: WritingTopic | null) => void;
}

/**
 * Topic chips (PRD §6.11). Each chip is a real `?topic=` link, so filtering works without JS;
 * with JS the click filters in place and updates the URL.
 */
export function TopicFilter({ activeTopic, onSelect }: TopicFilterProps) {
  const chips: Array<{ id: WritingTopic | null; label: string }> = [
    { id: null, label: "All" },
    ...writingTopics,
  ];
  return (
    <nav aria-label="Filter by topic">
      <ul className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const isActive = chip.id === activeTopic;
          const href = chip.id ? `/writing?topic=${chip.id}` : "/writing";
          const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey) return;
            event.preventDefault();
            onSelect(chip.id);
          };
          return (
            <li key={chip.label}>
              <a
                href={href}
                onClick={handleClick}
                aria-current={isActive ? "page" : undefined}
                className={`type-label inline-flex h-10 items-center rounded-full border px-4 transition-colors ${
                  isActive
                    ? "border-paper-text bg-paper-text text-paper"
                    : "border-paper-text/25 text-paper-text hover:border-paper-text"
                }`}
              >
                {chip.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

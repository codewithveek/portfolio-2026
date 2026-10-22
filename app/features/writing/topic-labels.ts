import { writingTopics } from "~/content/featured-writing";
import type { WritingTopic } from "~/content/schemas";

export const topicLabels = Object.fromEntries(
  writingTopics.map((topic) => [topic.id, topic.label]),
) as Record<WritingTopic, string>;

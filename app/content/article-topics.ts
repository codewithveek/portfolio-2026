import { topicTags } from "./featured-writing";
import type { Article, WritingTopic } from "./schemas";

/** Topics an article belongs to, from its DEV tags (PRD §6.11). Client-safe. */
export function getArticleTopics(article: Pick<Article, "tags">): WritingTopic[] {
  const tags = new Set(article.tags.map((tag) => tag.toLowerCase()));
  return (Object.keys(topicTags) as WritingTopic[]).filter((topic) =>
    topicTags[topic].some((tag) => tags.has(tag)),
  );
}

/** The topic shown on a card: the first matching topic, if any. */
export function getPrimaryTopicLabel(
  article: Pick<Article, "tags">,
  labels: Record<WritingTopic, string>,
): string {
  const [primaryTopic] = getArticleTopics(article);
  return primaryTopic ? labels[primaryTopic] : "Engineering";
}

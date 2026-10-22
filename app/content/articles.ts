import devArticlesFile from "./generated/dev-articles.json";
import packageStatsFile from "./generated/package-stats.json";
import { featuredArticleUrls, topicTags } from "./featured-writing";
import {
  devArticlesFileSchema,
  packageStatsFileSchema,
  type Article,
  type WritingTopic,
} from "./schemas";

/** Generated snapshots, validated at module load so a bad file fails the build (PRD §9.3). */
export const devArticles = devArticlesFileSchema.parse(devArticlesFile);
export const packageStats = packageStatsFileSchema.parse(packageStatsFile);

export function getAllArticles(): Article[] {
  return devArticles.articles;
}

export function getFeaturedArticles(): Article[] {
  const articlesByUrl = new Map(devArticles.articles.map((article) => [article.url, article]));
  return featuredArticleUrls.flatMap((url) => {
    const article = articlesByUrl.get(url);
    return article ? [article] : [];
  });
}

export function getArticleTopics(article: Article): WritingTopic[] {
  const tags = new Set(article.tags.map((tag) => tag.toLowerCase()));
  return (Object.keys(topicTags) as WritingTopic[]).filter((topic) =>
    topicTags[topic].some((tag) => tags.has(tag)),
  );
}

/** The topic shown on a card: the first matching topic, if any. */
export function getPrimaryTopicLabel(article: Article, labels: Record<WritingTopic, string>) {
  const [primaryTopic] = getArticleTopics(article);
  return primaryTopic ? labels[primaryTopic] : "Engineering";
}

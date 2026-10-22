import devArticlesFile from "./generated/dev-articles.json";
import packageStatsFile from "./generated/package-stats.json";
import { featuredArticleUrls } from "./featured-writing";
import { devArticlesFileSchema, packageStatsFileSchema, type Article } from "./schemas";

/**
 * Server-only in practice: import this from loaders, never from components, so the feed JSON
 * stays out of the client bundle.
 * Generated snapshots, validated at module load so a bad file fails the build (PRD §9.3). */
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

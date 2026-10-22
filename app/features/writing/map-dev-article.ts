import { z } from "zod";

import type { Article } from "~/content/schemas";

/** The fields we read from `https://dev.to/api/articles` (PRD §9.3). Validated, never trusted. */
export const devApiArticleSchema = z.object({
  title: z.string(),
  url: z.url(),
  published_at: z.string(),
  reading_time_minutes: z.number(),
  tag_list: z.array(z.string()),
});
export type DevApiArticle = z.infer<typeof devApiArticleSchema>;

const afriexPublicationPrefix = "https://dev.to/afriex/";

export function mapDevArticle(apiArticle: DevApiArticle): Article {
  return {
    title: apiArticle.title,
    url: apiArticle.url,
    publishedAt: new Date(apiArticle.published_at).toISOString(),
    readingTimeMinutes: Math.max(1, Math.round(apiArticle.reading_time_minutes)),
    tags: apiArticle.tag_list,
    publication: apiArticle.url.startsWith(afriexPublicationPrefix) ? "Afriex" : "codewithveek",
  };
}

/** Maps, removes excluded (non-technical) posts and duplicates, and sorts newest first. */
export function buildArticleList(
  apiArticles: readonly DevApiArticle[],
  excludedTitles: readonly string[],
): Article[] {
  const excluded = new Set(excludedTitles.map((title) => title.trim().toLowerCase()));
  const seenUrls = new Set<string>();
  const articles: Article[] = [];
  for (const apiArticle of apiArticles) {
    if (excluded.has(apiArticle.title.trim().toLowerCase())) continue;
    if (seenUrls.has(apiArticle.url)) continue;
    seenUrls.add(apiArticle.url);
    articles.push(mapDevArticle(apiArticle));
  }
  return articles.sort((first, second) => second.publishedAt.localeCompare(first.publishedAt));
}

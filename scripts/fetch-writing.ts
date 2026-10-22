/**
 * Fetches every article by codewithveek from the DEV API and writes
 * app/content/generated/dev-articles.json (PRD §9.3). On failure, keeps the last committed
 * snapshot and exits 0 with a warning so CI can still build.
 */
import { writeFile } from "node:fs/promises";
import { z } from "zod";

import { excludedArticleTitles } from "../app/content/featured-writing.ts";
import { buildArticleList, devApiArticleSchema } from "../app/features/writing/map-dev-article.ts";

const devUsername = "codewithveek";
const pageSize = 100;
const outputPath = new URL("../app/content/generated/dev-articles.json", import.meta.url);

async function fetchAllPages(): Promise<z.infer<typeof devApiArticleSchema>[]> {
  const collected: z.infer<typeof devApiArticleSchema>[] = [];
  for (let page = 1; page <= 20; page += 1) {
    const url = `https://dev.to/api/articles?username=${devUsername}&per_page=${pageSize}&page=${page}`;
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`DEV API responded ${response.status} for page ${page}`);
    const pageArticles = z.array(devApiArticleSchema).parse(await response.json());
    if (pageArticles.length === 0) break;
    collected.push(...pageArticles);
    if (pageArticles.length < pageSize) break;
  }
  return collected;
}

try {
  const apiArticles = await fetchAllPages();
  const articles = buildArticleList(apiArticles, excludedArticleTitles);
  const output = {
    fetchedAt: new Date().toISOString(),
    source: `https://dev.to/api/articles?username=${devUsername}`,
    articles,
  };
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${articles.length} articles to ${outputPath.pathname}`);
} catch (error) {
  console.warn("::warning::DEV fetch failed; keeping the committed snapshot.", error);
}

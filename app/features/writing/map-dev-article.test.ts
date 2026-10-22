import { describe, expect, it } from "vitest";

import { buildArticleList, mapDevArticle, type DevApiArticle } from "./map-dev-article";

const sampleArticle = (overrides: Partial<DevApiArticle> = {}): DevApiArticle => ({
  title: "A technical post",
  url: "https://dev.to/codewithveek/a-technical-post-1",
  published_at: "2026-05-01T10:00:00Z",
  reading_time_minutes: 6,
  tag_list: ["ai"],
  ...overrides,
});

describe("DEV feed mapping", () => {
  it("maps fields and detects the Afriex publication by URL", () => {
    expect(mapDevArticle(sampleArticle())).toMatchObject({
      publication: "codewithveek",
      readingTimeMinutes: 6,
    });
    expect(
      mapDevArticle(sampleArticle({ url: "https://dev.to/afriex/webhooks-2" })).publication,
    ).toBe("Afriex");
  });

  it("excludes non-technical posts, removes duplicates and sorts newest first", () => {
    const articles = buildArticleList(
      [
        sampleArticle({
          title: "Older",
          url: "https://dev.to/codewithveek/older",
          published_at: "2025-01-01T00:00:00Z",
        }),
        sampleArticle({
          title: "Your Phone Is Stealing Your Life: Here's How to Take It Back",
          url: "https://dev.to/codewithveek/phone",
        }),
        sampleArticle({
          title: "Newer",
          url: "https://dev.to/codewithveek/newer",
          published_at: "2026-09-01T00:00:00Z",
        }),
        sampleArticle({
          title: "Newer",
          url: "https://dev.to/codewithveek/newer",
          published_at: "2026-09-01T00:00:00Z",
        }),
      ],
      ["Your Phone Is Stealing Your Life: Here's How to Take It Back"],
    );
    expect(articles.map((article) => article.title)).toEqual(["Newer", "Older"]);
  });
});

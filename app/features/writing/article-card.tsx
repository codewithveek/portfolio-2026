import type { Article } from "~/content/schemas";
import { FadeUp } from "~/shared/motion/fade-up";

interface ArticleCardProps {
  article: Article;
  topicLabel: string;
  index: number;
}

const publicationLabels: Record<Article["publication"], string> = {
  codewithveek: "DEV · codewithveek",
  Afriex: "DEV · Afriex",
};

/** Article card on paper: title, publication, reading time, topic (PRD §6.8). Links out. */
export function ArticleCard({ article, topicLabel, index }: ArticleCardProps) {
  return (
    <FadeUp as="li" index={index % 3} className="h-full">
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="group flex h-full flex-col justify-between gap-8 rounded-card border border-paper-text/12 bg-paper p-6 transition-colors hover:border-paper-text/40 md:p-8"
      >
        <div className="flex flex-col gap-4">
          <p className="type-label text-accent-deep">{topicLabel}</p>
          <h3 className="text-[1.25rem] leading-snug font-semibold text-paper-text">
            {article.title}
          </h3>
        </div>
        <div className="type-label flex items-center justify-between gap-4 text-paper-muted">
          <span>{publicationLabels[article.publication]}</span>
          <span>
            {article.readingTimeMinutes} min read{" "}
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              ↗
            </span>
          </span>
        </div>
        <span className="sr-only"> (opens DEV in a new tab)</span>
      </a>
    </FadeUp>
  );
}

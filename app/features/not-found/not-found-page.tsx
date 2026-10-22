import { Link } from "react-router";

import { site } from "~/content/site";
import { OrbitMotif } from "~/shared/ui/orbit-motif";

interface NotFoundPageProps {
  title?: string;
  message?: string;
}

/** 404 in the site's style, with links home and to /writing (PRD §5). */
export function NotFoundPage({
  title = "Page not found",
  message = "This page does not exist, or it moved.",
}: NotFoundPageProps) {
  return (
    <main
      id="main"
      className="grid-texture relative isolate flex min-h-svh flex-col items-start justify-center overflow-hidden"
    >
      <OrbitMotif
        mode="static"
        className="pointer-events-none absolute top-1/2 right-[-20%] -z-10 size-[90vmin] -translate-y-1/2 opacity-25"
      />
      <div className="layout-container">
        <p className="type-label text-accent">404 · {site.wordmark}</p>
        <h1 className="type-display-xl mt-6 text-text">{title}</h1>
        <p className="type-body-lg mt-6 max-w-[32rem] text-text-muted">{message}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to="/" className="button button-primary">
            <span>Back home</span>
            <span className="button-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <Link to="/writing" className="button button-outline">
            <span>Read my writing</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

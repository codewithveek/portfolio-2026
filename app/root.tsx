import sansFontUrl from "@fontsource-variable/google-sans-flex/files/google-sans-flex-latin-wdth-normal.woff2?url";
import monoFontUrl from "@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url";
import { domAnimation, LazyMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import { NotFoundPage } from "./features/not-found/not-found-page";
import { SmoothScrollProvider } from "./shared/motion/smooth-scroll-provider";
import { markMotionReady } from "./shared/motion/use-reveal";
import "./styles/app.css";
import "./styles/motion.css";

/** Latin subsets only, self-hosted (PRD §7.2). Declared here so the files can be preloaded. */
const fontFaceCss = `
@font-face{font-family:"Google Sans Flex";font-style:normal;font-display:swap;font-weight:1 1000;font-stretch:25% 151%;src:url(${sansFontUrl}) format("woff2-variations");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2191-2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:"JetBrains Mono";font-style:normal;font-display:swap;font-weight:100 800;src:url(${monoFontUrl}) format("woff2-variations");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2191-2193,U+2212,U+2215,U+FEFF,U+FFFD;}
`;

export const links: Route.LinksFunction = () => [
  { rel: "preload", href: sansFontUrl, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: monoFontUrl, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#08080A" />
        <style dangerouslySetInnerHTML={{ __html: fontFaceCss }} />
        <Meta />
        <Links />
      </head>
      <body>
        <a
          href="#main"
          className="type-label sr-only z-[100] bg-accent px-4 py-3 text-accent-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        {children}
        <div className="film-grain" aria-hidden="true" />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    markMotionReady();
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <SmoothScrollProvider>
        <Outlet />
      </SmoothScrollProvider>
    </LazyMotion>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (import.meta.env.DEV && error instanceof Error) {
    console.error(error);
  }
  return <NotFoundPage title="Something broke" message="An unexpected error occurred." />;
}

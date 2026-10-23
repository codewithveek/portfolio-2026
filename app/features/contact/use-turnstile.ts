import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { useTheme } from "~/features/theme/theme-preference";

import { contactTurnstileAction } from "./turnstile-action";

interface TurnstileApi {
  render(
    container: HTMLElement,
    options: { sitekey: string; theme: "dark" | "light"; action: string },
  ): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const scriptUrl = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Loads Turnstile only when the contact form approaches the viewport (PRD §12.2), then renders
 * the widget into `containerRef`. Returns a reset function for after a submission.
 */
export function useTurnstile(containerRef: RefObject<HTMLElement | null>, siteKey: string) {
  const widgetIdRef = useRef<string | null>(null);
  // The widget's colours follow the site theme chosen when it renders.
  const theme = useTheme();
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let isCancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        loadTurnstileScript()
          .then(() => {
            if (isCancelled || !window.turnstile || widgetIdRef.current) return;
            widgetIdRef.current = window.turnstile.render(container, {
              sitekey: siteKey,
              theme,
              action: contactTurnstileAction,
            });
          })
          .catch(() => setHasLoadError(true));
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(container);
    return () => {
      isCancelled = true;
      observer.disconnect();
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [containerRef, siteKey, theme]);

  const resetTurnstile = useCallback(() => {
    if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
  }, []);

  return { hasLoadError, resetTurnstile };
}

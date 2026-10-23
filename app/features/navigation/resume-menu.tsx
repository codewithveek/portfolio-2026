import { useEffect, useRef, type KeyboardEvent } from "react";

import { resumeVariants } from "~/content/site";
import { trackEvent } from "~/features/analytics/track-event";

interface ResumeMenuProps {
  /** Visual style of the trigger. */
  triggerVariant: "outline" | "icon";
  /** Opens upwards (in the dock) or downwards (in the hero). */
  placement?: "above" | "below";
}

/**
 * Two-item résumé menu (PRD §4). Built on `<details>` so it works without JavaScript;
 * Escape and outside clicks close it (PRD §12.1).
 */
export function ResumeMenu({ triggerVariant, placement = "below" }: ResumeMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      const details = detailsRef.current;
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) {
        details.open = false;
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  const closeOnEscape = (event: KeyboardEvent<HTMLDetailsElement>) => {
    const details = detailsRef.current;
    if (event.key !== "Escape" || !details?.open) return;
    details.open = false;
    details.querySelector("summary")?.focus();
  };

  const triggerClassName =
    triggerVariant === "icon"
      ? "flex size-11 items-center justify-center rounded-[10px] text-text-muted hover:bg-surface-raised hover:text-text"
      : "button button-outline w-full sm:w-auto";
  const panelPosition = placement === "above" ? "bottom-full mb-3" : "top-full mt-2";

  return (
    <details
      ref={detailsRef}
      className={`group relative ${triggerVariant === "outline" ? "w-full sm:w-auto" : ""}`}
      onKeyDown={closeOnEscape}
    >
      <summary className={`${triggerClassName} list-none [&::-webkit-details-marker]:hidden`}>
        {triggerVariant === "icon" ? (
          <>
            <ResumeIcon />
            <span className="sr-only">Résumé</span>
          </>
        ) : (
          <span>Résumé</span>
        )}
      </summary>
      <ul
        className={`absolute left-0 z-40 min-w-56 rounded-control border border-border bg-surface p-1 ${panelPosition}`}
      >
        {resumeVariants.map((variant) => (
          <li key={variant.id}>
            <a
              href={variant.href}
              className="type-label flex items-center justify-between gap-4 rounded-control px-3 py-3 text-text hover:bg-surface-raised"
              onClick={() => trackEvent("resume_download", variant.id)}
            >
              {variant.label}
              <span aria-hidden="true" className="text-accent-text">
                ↓
              </span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

function ResumeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

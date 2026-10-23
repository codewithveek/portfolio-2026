import { setTheme, useTheme, type Theme } from "./theme-preference";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Switches between the default dark theme and light. `aria-pressed` reports whether light is
 * on. Without JavaScript the button does nothing and the site stays dark.
 */
export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const theme = useTheme();
  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label="Light theme"
      aria-pressed={isLight}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={`flex size-11 shrink-0 items-center justify-center rounded-[10px] text-text-muted transition-colors hover:bg-surface-raised hover:text-text ${className}`}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}

/** Shows the theme a press switches to: a sun in dark mode, a moon in light mode. */
/** Shows the theme a press switches to: a sun while dark, a moon while light. */
function ThemeIcon({ theme }: { theme: Theme }) {
  const sharedProps = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (theme === "dark") {
    return (
      <svg {...sharedProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  return (
    <svg {...sharedProps}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

import { useSyncExternalStore } from "react";

import { themeStorageKey } from "./theme-script";

/** Dark is the default regardless of the system setting; light is an explicit choice. */
export type Theme = "dark" | "light";

const changeEventName = "veek-theme-change";

function readTheme(): Theme {
  try {
    return localStorage.getItem(themeStorageKey) === "light" ? "light" : "dark";
  } catch {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(changeEventName, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(changeEventName, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Stores the choice and applies it to <html data-theme>. Dark clears both. */
export function setTheme(theme: Theme): void {
  try {
    if (theme === "light") localStorage.setItem(themeStorageKey, "light");
    else localStorage.removeItem(themeStorageKey);
  } catch {
    // Storage can be unavailable (private mode); the choice then lasts for this page only.
  }
  if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
  else document.documentElement.removeAttribute("data-theme");
  window.dispatchEvent(new Event(changeEventName));
}

/** The active theme. "dark" during SSR and hydration, so markup matches. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => "dark");
}

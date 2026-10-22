import type { AnalyticsEventName } from "./event-names";

/** Sends a conversion event with `sendBeacon` (PRD §9.7). Never blocks navigation. */
export function trackEvent(name: AnalyticsEventName, detail = ""): void {
  if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") return;
  const body = JSON.stringify({ name, detail, path: window.location.pathname });
  navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
}

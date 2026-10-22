import { analyticsEventSchema, type AnalyticsEvent } from "./event-names";

/** Parses a beacon body; returns null for anything not on the allowlist (PRD §9.7). */
export function parseAnalyticsEvent(body: unknown): AnalyticsEvent | null {
  const result = analyticsEventSchema.safeParse(body);
  return result.success ? result.data : null;
}

/** One data point per event. No personal data is recorded. */
export function recordEvent(dataset: AnalyticsEngineDataset, event: AnalyticsEvent): void {
  dataset.writeDataPoint({
    blobs: [event.name, event.detail, event.path],
    doubles: [1],
    indexes: [event.name],
  });
}

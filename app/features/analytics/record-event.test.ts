import { describe, expect, it, vi } from "vitest";

import { parseAnalyticsEvent, recordEvent } from "./record-event.server";

describe("analytics events", () => {
  it("accepts allowlisted events", () => {
    expect(parseAnalyticsEvent({ name: "cta_click", detail: "email", path: "/" })).toEqual({
      name: "cta_click",
      detail: "email",
      path: "/",
    });
  });

  it("drops unknown names, free text and bad paths", () => {
    expect(parseAnalyticsEvent({ name: "page_view", detail: "", path: "/" })).toBeNull();
    expect(
      parseAnalyticsEvent({ name: "cta_click", detail: "ada@example.com is me", path: "/" }),
    ).toBeNull();
    expect(
      parseAnalyticsEvent({ name: "cta_click", detail: "", path: "https://evil.example" }),
    ).toBeNull();
    expect(parseAnalyticsEvent("nonsense")).toBeNull();
  });

  it("writes one data point per event", () => {
    const writeDataPoint = vi.fn();
    recordEvent({ writeDataPoint } as unknown as AnalyticsEngineDataset, {
      name: "case_study_view",
      detail: "zia",
      path: "/work/zia",
    });
    expect(writeDataPoint).toHaveBeenCalledWith({
      blobs: ["case_study_view", "zia", "/work/zia"],
      doubles: [1],
      indexes: ["case_study_view"],
    });
  });
});

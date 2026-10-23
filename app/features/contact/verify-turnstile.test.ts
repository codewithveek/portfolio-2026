import { describe, expect, it, vi } from "vitest";

import { parseHostnames, verifyTurnstile } from "./verify-turnstile.server";

function siteverifyReturning(body: unknown, status = 200): typeof fetch {
  return vi.fn(async () => Response.json(body, { status })) as unknown as typeof fetch;
}

const baseOptions = {
  token: "token-from-widget",
  secret: "secret",
  remoteIp: "203.0.113.7",
  expectedAction: "contact",
  expectedHostnames: new Set(["veek.me"]),
};

describe("verifyTurnstile", () => {
  it("passes when success, action and hostname all match", async () => {
    const fetcher = siteverifyReturning({ success: true, action: "contact", hostname: "veek.me" });
    await expect(verifyTurnstile({ ...baseOptions, fetcher })).resolves.toBe(true);
    const [, init] = vi.mocked(fetcher).mock.calls[0] ?? [];
    expect(init?.body).toBeInstanceOf(URLSearchParams);
    expect(String(init?.body)).toContain("remoteip=203.0.113.7");
  });

  it("rejects a token issued for another action or hostname", async () => {
    await expect(
      verifyTurnstile({
        ...baseOptions,
        fetcher: siteverifyReturning({ success: true, action: "login", hostname: "veek.me" }),
      }),
    ).resolves.toBe(false);
    await expect(
      verifyTurnstile({
        ...baseOptions,
        fetcher: siteverifyReturning({
          success: true,
          action: "contact",
          hostname: "evil.example",
        }),
      }),
    ).resolves.toBe(false);
  });

  it("rejects failures, HTTP errors, malformed bodies and network errors", async () => {
    await expect(
      verifyTurnstile({ ...baseOptions, fetcher: siteverifyReturning({ success: false }) }),
    ).resolves.toBe(false);
    await expect(
      verifyTurnstile({ ...baseOptions, fetcher: siteverifyReturning({}, 500) }),
    ).resolves.toBe(false);
    await expect(
      verifyTurnstile({ ...baseOptions, fetcher: siteverifyReturning("nonsense") }),
    ).resolves.toBe(false);
    const failingFetch = vi.fn(async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    await expect(verifyTurnstile({ ...baseOptions, fetcher: failingFetch })).resolves.toBe(false);
  });

  it("rejects missing or oversized tokens and an empty hostname allowlist without calling siteverify", async () => {
    const fetcher = siteverifyReturning({ success: true, action: "contact", hostname: "veek.me" });
    await expect(verifyTurnstile({ ...baseOptions, token: undefined, fetcher })).resolves.toBe(
      false,
    );
    await expect(
      verifyTurnstile({ ...baseOptions, token: "x".repeat(2049), fetcher }),
    ).resolves.toBe(false);
    await expect(
      verifyTurnstile({ ...baseOptions, expectedHostnames: new Set(), fetcher }),
    ).resolves.toBe(false);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("accepts Cloudflare's test key, which returns no action, only on its own hostname", async () => {
    const testKeyResponse = {
      success: true,
      hostname: "example.com",
      metadata: { result_with_testing_key: true },
    };
    await expect(
      verifyTurnstile({
        ...baseOptions,
        expectedHostnames: new Set(["example.com"]),
        fetcher: siteverifyReturning(testKeyResponse),
      }),
    ).resolves.toBe(true);
    await expect(
      verifyTurnstile({ ...baseOptions, fetcher: siteverifyReturning(testKeyResponse) }),
    ).resolves.toBe(false);
  });
});

describe("parseHostnames", () => {
  it("splits and trims the comma-separated var", () => {
    expect(parseHostnames(" veek.me , veek-portfolio.codewithveek.workers.dev,")).toEqual(
      new Set(["veek.me", "veek-portfolio.codewithveek.workers.dev"]),
    );
    expect(parseHostnames(undefined).size).toBe(0);
  });
});

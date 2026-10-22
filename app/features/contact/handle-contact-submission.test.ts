import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ContactStore } from "./contact-store.server";
import {
  handleContactSubmission,
  type ContactDependencies,
} from "./handle-contact-submission.server";

const now = 1_800_000_000_000;

function buildForm(overrides: Record<string, string> = {}): FormData {
  const formData = new FormData();
  const fields = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: "Analytical Engines",
    message: "I would like to talk about a backend role on our payments team.",
    website: "",
    startedAt: String(now - 10_000),
    "cf-turnstile-response": "token",
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) formData.append(key, value);
  return formData;
}

function turnstileFetcher(isSuccess: boolean): typeof fetch {
  return vi.fn(async () => Response.json({ success: isSuccess })) as unknown as typeof fetch;
}

describe("handleContactSubmission", () => {
  let store: ContactStore & {
    insert: ReturnType<typeof vi.fn>;
    markSent: ReturnType<typeof vi.fn>;
    markFailed: ReturnType<typeof vi.fn>;
  };
  let send: ReturnType<typeof vi.fn>;
  let limit: ReturnType<typeof vi.fn>;
  let dependencies: ContactDependencies;

  beforeEach(() => {
    store = {
      insert: vi.fn(async () => undefined),
      markSent: vi.fn(async () => undefined),
      markFailed: vi.fn(async () => undefined),
    };
    send = vi.fn(async () => ({ messageId: "message-1" }));
    limit = vi.fn(async () => ({ success: true }));
    dependencies = {
      store,
      emailBinding: { send } as unknown as SendEmail,
      rateLimiter: { limit } as unknown as RateLimit,
      turnstileSecret: "secret",
      contactInbox: "inbox@example.com",
      ipHashSalt: "salt",
      fetcher: turnstileFetcher(true),
      now: () => now,
      logError: vi.fn(),
    };
  });

  const submit = (formData: FormData) =>
    handleContactSubmission({
      formData,
      clientIp: "203.0.113.7",
      userAgent: "vitest",
      dependencies,
    });

  it("stores, sends and reports success", async () => {
    await expect(submit(buildForm())).resolves.toEqual({ status: "success" });
    const [inserted] = store.insert.mock.calls[0] ?? [];
    expect(inserted).toMatchObject({ name: "Ada Lovelace", status: "received" });
    expect(inserted.ipHash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(inserted)).not.toContain("203.0.113.7");
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "inbox@example.com",
        replyTo: { email: "ada@example.com", name: "Ada Lovelace" },
      }),
    );
    expect(store.markSent).toHaveBeenCalledWith(inserted.id);
    expect(limit).toHaveBeenCalledWith({ key: "contact:203.0.113.7" });
  });

  it("returns field errors and keeps values", async () => {
    const result = await submit(buildForm({ name: "A", email: "not-an-email", message: "short" }));
    expect(result).toMatchObject({
      status: "invalid",
      fieldErrors: {
        name: expect.any(String),
        email: expect.any(String),
        message: expect.any(String),
      },
      values: { name: "A", email: "not-an-email" },
    });
    expect(store.insert).not.toHaveBeenCalled();
  });

  it("rejects a filled honeypot", async () => {
    await expect(submit(buildForm({ website: "https://spam.example" }))).resolves.toMatchObject({
      status: "rejected",
      reason: "spam",
    });
  });

  it("rejects forms submitted faster than three seconds", async () => {
    await expect(submit(buildForm({ startedAt: String(now - 1_000) }))).resolves.toMatchObject({
      reason: "spam",
    });
  });

  it("rejects a failed Turnstile check", async () => {
    dependencies.fetcher = turnstileFetcher(false);
    await expect(submit(buildForm())).resolves.toMatchObject({ reason: "turnstile" });
    expect(store.insert).not.toHaveBeenCalled();
  });

  it("rejects a missing Turnstile token without calling siteverify", async () => {
    const formData = buildForm();
    formData.delete("cf-turnstile-response");
    await expect(submit(formData)).resolves.toMatchObject({ reason: "turnstile" });
    expect(dependencies.fetcher).not.toHaveBeenCalled();
  });

  it("rejects when rate limited", async () => {
    limit.mockResolvedValueOnce({ success: false });
    await expect(submit(buildForm())).resolves.toMatchObject({ reason: "rate-limited" });
    expect(store.insert).not.toHaveBeenCalled();
  });

  it.each(["E_SENDER_NOT_VERIFIED", "E_RECIPIENT_NOT_ALLOWED", "E_RATE_LIMIT_EXCEEDED"])(
    "stores %s and still reports success when sending fails",
    async (errorCode) => {
      send.mockRejectedValueOnce(Object.assign(new Error("send failed"), { code: errorCode }));
      await expect(submit(buildForm())).resolves.toEqual({ status: "success" });
      expect(store.markFailed).toHaveBeenCalledWith(expect.any(String), errorCode);
      expect(store.markSent).not.toHaveBeenCalled();
    },
  );

  it("records E_UNKNOWN for errors without a code", async () => {
    send.mockRejectedValueOnce(new Error("boom"));
    await submit(buildForm());
    expect(store.markFailed).toHaveBeenCalledWith(expect.any(String), "E_UNKNOWN");
  });
});

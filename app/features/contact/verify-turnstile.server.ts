import { z } from "zod";

const siteverifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const maximumTokenLength = 2048;
const siteverifyTimeoutMs = 10_000;

const siteverifyResponseSchema = z.object({
  success: z.boolean(),
  action: z.string().optional(),
  hostname: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
  metadata: z.object({ result_with_testing_key: z.boolean().optional() }).optional(),
});

interface VerifyTurnstileOptions {
  token: string | undefined;
  secret: string;
  remoteIp: string;
  /** The widget's `action`, e.g. "contact"; the response must match it. */
  expectedAction: string;
  /** Frontend hostnames this deployment serves; the response hostname must be one of them. */
  expectedHostnames: ReadonlySet<string>;
  fetcher?: typeof fetch;
}

/** Splits the comma-separated `TURNSTILE_HOSTNAMES` var into a set. */
export function parseHostnames(commaSeparated: string | undefined): Set<string> {
  return new Set(
    (commaSeparated ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );
}

/**
 * Canonical server-side Turnstile check (PRD §9.4 step 2, Cloudflare Turnstile Spin): requires
 * `success`, the expected action and an approved hostname. Any failure, timeout or malformed
 * response counts as "not verified".
 *
 * Cloudflare's test secret (used in development and e2e) returns no action and the hostname
 * `example.com`, flagged with `metadata.result_with_testing_key`. Only then is the action check
 * skipped; that flag comes from Cloudflare's answer to our own secret, so it cannot be forged.
 */
export async function verifyTurnstile({
  token,
  secret,
  remoteIp,
  expectedAction,
  expectedHostnames,
  fetcher = fetch,
}: VerifyTurnstileOptions): Promise<boolean> {
  if (!token || token.length > maximumTokenLength || expectedHostnames.size === 0) return false;
  try {
    const response = await fetcher(siteverifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(siteverifyTimeoutMs),
      body: new URLSearchParams({ secret, response: token, remoteip: remoteIp }),
    });
    if (!response.ok) return false;
    const parsed = siteverifyResponseSchema.safeParse(await response.json());
    if (!parsed.success || !parsed.data.success) return false;
    const result = parsed.data;
    const isTestingKey = result.metadata?.result_with_testing_key === true;
    const isExpectedAction = isTestingKey || result.action === expectedAction;
    const isExpectedHostname =
      result.hostname !== undefined && expectedHostnames.has(result.hostname);
    return isExpectedAction && isExpectedHostname;
  } catch {
    return false;
  }
}

import { z } from "zod";

const siteverifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const siteverifyResponseSchema = z.object({
  success: z.boolean(),
  "error-codes": z.array(z.string()).optional(),
});

interface VerifyTurnstileOptions {
  token: string | undefined;
  secret: string;
  remoteIp: string;
  fetcher?: typeof fetch;
}

/** Server-side Turnstile check (PRD §9.4 step 2). Any failure counts as "not verified". */
export async function verifyTurnstile({
  token,
  secret,
  remoteIp,
  fetcher = fetch,
}: VerifyTurnstileOptions): Promise<boolean> {
  if (!token) return false;
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  body.append("remoteip", remoteIp);
  try {
    const response = await fetcher(siteverifyUrl, { method: "POST", body });
    if (!response.ok) return false;
    const result = siteverifyResponseSchema.safeParse(await response.json());
    return result.success && result.data.success;
  } catch {
    return false;
  }
}

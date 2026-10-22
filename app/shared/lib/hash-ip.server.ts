/** SHA-256 of the client IP with a secret salt (PRD §9.4). The raw IP is never stored. */
export async function hashIp(ipAddress: string, salt: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${salt}:${ipAddress}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

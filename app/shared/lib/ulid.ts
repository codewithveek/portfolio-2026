const crockfordAlphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** A ULID: 48-bit timestamp + 80 random bits, Crockford base32 (sortable by time). */
export function createUlid(timestampMs: number = Date.now()): string {
  let timePart = "";
  let remainingTime = timestampMs;
  for (let position = 0; position < 10; position += 1) {
    timePart = crockfordAlphabet.charAt(remainingTime % 32) + timePart;
    remainingTime = Math.floor(remainingTime / 32);
  }
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  let randomPart = "";
  for (const byte of randomBytes) {
    randomPart += crockfordAlphabet.charAt(byte % 32);
  }
  return timePart + randomPart;
}

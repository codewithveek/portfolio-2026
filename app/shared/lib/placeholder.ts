/**
 * `[Lucky]` marks facts that still need Lucky's input (PRD §10, §14). They are shown, clearly
 * marked, in development and removed from production builds (PRD §10.5, §13).
 */
export const PLACEHOLDER_MARK = "[Lucky]";

export const shouldShowPlaceholders: boolean = import.meta.env.DEV;

export function containsPlaceholder(value: unknown): boolean {
  if (typeof value === "string") return value.includes(PLACEHOLDER_MARK);
  if (Array.isArray(value)) return value.some(containsPlaceholder);
  if (value !== null && typeof value === "object") {
    return Object.values(value).some(containsPlaceholder);
  }
  return false;
}

/** Drops items that contain a placeholder unless placeholders are allowed (development). */
export function withoutPlaceholders<Item>(
  items: readonly Item[],
  showPlaceholders: boolean = shouldShowPlaceholders,
): Item[] {
  if (showPlaceholders) return [...items];
  return items.filter((item) => !containsPlaceholder(item));
}

/** Returns the value, or `undefined` when it is a placeholder that must not render. */
export function placeholderSafe<Value>(
  value: Value,
  showPlaceholders: boolean = shouldShowPlaceholders,
): Value | undefined {
  if (!showPlaceholders && containsPlaceholder(value)) return undefined;
  return value;
}

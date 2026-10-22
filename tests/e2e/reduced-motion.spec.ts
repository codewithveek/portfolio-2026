import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("reduced motion shows static content with no pinning (PRD §8.1)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion-ready", "");
  const positioning = page.locator("#positioning");
  for (const word of ["Moves money", "Watches agents", "Ships to customers", "Explains itself"]) {
    await expect(positioning.getByText(word, { exact: true })).toBeVisible();
  }
  const position = await positioning
    .locator(".positioning-inner")
    .evaluate((element) => getComputedStyle(element).position);
  expect(position).not.toBe("sticky");
  const outerHeight = await positioning.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  expect(outerHeight).toBeLessThan(page.viewportSize()!.height * 2.5); // eslint-disable-line @typescript-eslint/no-non-null-assertion -- viewport is configured per project
});

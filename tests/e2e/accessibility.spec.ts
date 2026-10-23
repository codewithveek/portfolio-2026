import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const theme of ["dark", "light"] as const) {
  for (const path of ["/", "/work/zia", "/writing"]) {
    test(`no serious or critical axe violations on ${path} (${theme} theme)`, async ({ page }) => {
      if (theme === "light") {
        await page.addInitScript(() => localStorage.setItem("veek-theme", "light"));
      }
      await page.goto(path);
      // Scroll to the end so triggered reveals settle. Scroll-linked states such as
      // word-highlight's muted words (PRD §8.4) are transient and finish once scrolled past.
      // Wheel scrolling, like a visitor, so Lenis (desktop smooth scroll) moves too.
      for (let step = 0; step < 60; step += 1) {
        await page.mouse.wheel(0, 700);
        await page.waitForTimeout(40);
        const isAtBottom = await page.evaluate(
          () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4,
        );
        if (isAtBottom) break;
      }
      // Wait until every triggered reveal has fired and its transition has finished, so axe never
      // measures contrast on half-faded text.
      await page.waitForFunction(() =>
        [...document.querySelectorAll("[data-reveal]")].every((element) =>
          element.hasAttribute("data-in-view"),
        ),
      );
      await page.waitForFunction(() =>
        document.getAnimations().every((animation) => animation.playState !== "running"),
      );
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();
      const blocking = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      );
      expect(
        blocking.map(
          (violation) =>
            `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
        ),
      ).toEqual([]);
    });
  }
}

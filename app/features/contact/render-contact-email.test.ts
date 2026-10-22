import { describe, expect, it } from "vitest";

import { escapeHtml, renderContactHtml, renderContactText } from "./render-contact-email";

describe("contact email rendering", () => {
  const hostile = {
    name: `<script>alert("x")</script>`,
    email: "a@example.com",
    company: `Acme & "Co"`,
    message: "Hello <img src=x onerror=alert(1)>\n\nSecond paragraph",
  };

  it("escapes every piece of user input in the HTML body", () => {
    const html = renderContactHtml(hostile);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Acme &amp; &quot;Co&quot;");
    expect(html).toContain("<p>Second paragraph</p>");
  });

  it("renders a plain-text body", () => {
    expect(renderContactText({ ...hostile, company: undefined })).toContain("Company: —");
    expect(escapeHtml(`'`)).toBe("&#39;");
  });
});

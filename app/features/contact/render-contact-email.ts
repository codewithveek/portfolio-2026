import type { ContactSubmission } from "./contact-schema";

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => htmlEscapes[character] ?? character);
}

type EmailFields = Pick<ContactSubmission, "name" | "email" | "company" | "message">;

/** Plain-text notification body. */
export function renderContactText(submission: EmailFields): string {
  return [
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Company: ${submission.company ?? "—"}`,
    "",
    submission.message,
    "",
    "Sent from the veek.me contact form.",
  ].join("\n");
}

/** HTML notification body. Every piece of user input is escaped (PRD §9.4). */
export function renderContactHtml(submission: EmailFields): string {
  const paragraphs = escapeHtml(submission.message)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
  return [
    '<!doctype html><html><body style="font-family:system-ui,sans-serif;line-height:1.5">',
    `<p><strong>Name:</strong> ${escapeHtml(submission.name)}<br>`,
    `<strong>Email:</strong> ${escapeHtml(submission.email)}<br>`,
    `<strong>Company:</strong> ${escapeHtml(submission.company ?? "—")}</p>`,
    paragraphs,
    '<p style="color:#666">Sent from the veek.me contact form.</p>',
    "</body></html>",
  ].join("");
}

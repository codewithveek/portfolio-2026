import type { ContactSubmission } from "./contact-schema";
import { renderContactHtml, renderContactText } from "./render-contact-email";

export type SendOutcome = { isSent: true } | { isSent: false; errorCode: string };

interface SendContactEmailOptions {
  emailBinding: SendEmail;
  inbox: string;
  submission: Pick<ContactSubmission, "name" | "email" | "company" | "message">;
}

function readErrorCode(error: unknown): string {
  if (error !== null && typeof error === "object" && "code" in error) {
    const { code } = error;
    if (typeof code === "string" && code.length > 0) return code.slice(0, 64);
  }
  return "E_UNKNOWN";
}

/** Notification via the `send_email` binding's structured `send()` (PRD §9.4 step 5). */
export async function sendContactEmail({
  emailBinding,
  inbox,
  submission,
}: SendContactEmailOptions): Promise<SendOutcome> {
  try {
    await emailBinding.send({
      from: { email: "contact@veek.me", name: "veek.me contact form" },
      to: inbox,
      replyTo: { email: submission.email, name: submission.name },
      subject: `New message from ${submission.name}`,
      text: renderContactText(submission),
      html: renderContactHtml(submission),
    });
    return { isSent: true };
  } catch (error) {
    return { isSent: false, errorCode: readErrorCode(error) };
  }
}

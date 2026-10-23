import { z } from "zod";

export const minimumFillTimeMs = 3_000;

/** Contact form fields (PRD §9.4 step 1). */
export const contactSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "Keep your name under 80 characters."),
  email: z.email("Please enter a valid email address.").trim().max(254),
  company: z
    .string()
    .trim()
    .max(120, "Keep the company under 120 characters.")
    .optional()
    .transform((company) => (company ? company : undefined)),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters.")
    .max(4000, "Keep the message under 4,000 characters."),
  /** Honeypot: hidden from people, filled by bots. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** When the form was rendered (ms since epoch). */
  startedAt: z.coerce.number().int().positive(),
  turnstileToken: z.string().optional(),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

export const contactFieldNames = ["name", "email", "company", "message"] as const;
export type ContactFieldName = (typeof contactFieldNames)[number];
export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;
export type ContactFieldValues = Partial<Record<ContactFieldName, string>>;

export type ContactResult =
  | { status: "success" }
  | { status: "invalid"; fieldErrors: ContactFieldErrors; values: ContactFieldValues }
  | {
      status: "rejected";
      reason: "spam" | "turnstile" | "rate-limited" | "unavailable";
      values: ContactFieldValues;
    };

export function readFormValues(formData: FormData): ContactFieldValues {
  const values: ContactFieldValues = {};
  for (const fieldName of contactFieldNames) {
    const value = formData.get(fieldName);
    if (typeof value === "string") values[fieldName] = value;
  }
  return values;
}

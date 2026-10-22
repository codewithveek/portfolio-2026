import { z } from "zod";

/** Allowed conversion events (PRD §9.7). Anything else is dropped. */
export const analyticsEventNames = [
  "cta_click",
  "resume_download",
  "case_study_view",
  "contact_submit",
  "voice_note_play",
  "outbound_click",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export const analyticsEventSchema = z.object({
  name: z.enum(analyticsEventNames),
  detail: z
    .string()
    .max(120)
    .regex(/^[a-z0-9._:/-]*$/i, "Only simple identifiers are allowed"),
  path: z.string().max(200).startsWith("/"),
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

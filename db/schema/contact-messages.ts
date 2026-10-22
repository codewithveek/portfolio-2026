import { sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Contact messages (PRD §9.4 step 4). Raw IPs are never stored, only a salted hash. */
export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  ipHash: text("ip_hash").notNull(),
  userAgent: text("user_agent"),
  status: text("status", { enum: ["received", "sent", "failed"] })
    .notNull()
    .default("received"),
  errorCode: text("error_code"),
  createdAt: text("created_at").notNull(),
});

export type ContactMessageInsert = typeof contactMessages.$inferInsert;

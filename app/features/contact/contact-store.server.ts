import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import { contactMessages, type ContactMessageInsert } from "../../../db/schema/contact-messages";

/** D1 access for contact messages, behind a small interface so the handler is testable. */
export interface ContactStore {
  insert(message: ContactMessageInsert): Promise<void>;
  markSent(id: string): Promise<void>;
  markFailed(id: string, errorCode: string): Promise<void>;
}

export function createD1ContactStore(database: D1Database): ContactStore {
  const db = drizzle(database);
  return {
    async insert(message) {
      await db.insert(contactMessages).values(message);
    },
    async markSent(id) {
      await db.update(contactMessages).set({ status: "sent" }).where(eq(contactMessages.id, id));
    },
    async markFailed(id, errorCode) {
      await db
        .update(contactMessages)
        .set({ status: "failed", errorCode })
        .where(eq(contactMessages.id, id));
    },
  };
}

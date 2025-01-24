import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { eventsTable } from "./events-schema"

export const commentsTable = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  eventId: uuid("event_id")
    .references(() => eventsTable.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type InsertComment = typeof commentsTable.$inferInsert
export type SelectComment = typeof commentsTable.$inferSelect 
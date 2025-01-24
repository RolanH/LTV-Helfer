import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const eventsTable = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  eventDate: timestamp("event_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type InsertEvent = typeof eventsTable.$inferInsert
export type SelectEvent = typeof eventsTable.$inferSelect 
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { eventsTable, commentsTable } from "@/db/schema"
import type { PgTable } from "drizzle-orm/pg-core"

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString, { ssl: process.env.DATABASE_SSL === "true" })

// Add typed schema configuration
const schema = {
  events: eventsTable as PgTable,
  comments: commentsTable as PgTable
}

export const db = drizzle(client, { schema }) 
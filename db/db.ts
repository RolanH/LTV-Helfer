import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { eventsTable, commentsTable } from "@/db/schema"

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString, { ssl: process.env.DATABASE_SSL === "true" })

// Add schema configuration
const schema = {
  events: eventsTable,
  comments: commentsTable
}

export const db = drizzle(client, { schema }) 
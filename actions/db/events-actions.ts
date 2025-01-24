"use server"

import { db } from "@/db/db"
import { eventsTable, InsertEvent, SelectEvent } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"
import { checkAdminAction } from "@/actions/auth-actions"

/**
 * Legt ein neues Event an.
 */
export async function createEventAction(
  event: InsertEvent
): Promise<ActionState<SelectEvent>> {
  try {
    // Optional: Role-Check -> Nur Admin darf Events anlegen:
    const isAdmin = await checkAdminAction()
    if (!isAdmin.isSuccess || !isAdmin.data) {
      return {
        isSuccess: false,
        message: "Zugriff verweigert. Nur Admins können Events anlegen."
      }
    }

    // Event erstellen
    const [newEvent] = await db.insert(eventsTable).values(event).returning()
    return {
      isSuccess: true,
      message: "Event created successfully",
      data: newEvent,
    }
  } catch (error) {
    console.error("Error creating event:", error)
    return { isSuccess: false, message: "Failed to create event" }
  }
}

/**
 * Gibt eine Liste aller Events zurück.
 */
export async function getEventsAction(): Promise<ActionState<SelectEvent[]>> {
  try {
    const events = await db.select().from(eventsTable)
    return {
      isSuccess: true,
      message: "Events retrieved successfully",
      data: events,
    }
  } catch (error) {
    console.error("Error getting events:", error)
    return { isSuccess: false, message: "Failed to get events" }
  }
}

/**
 * Gibt ein einzelnes Event anhand der ID zurück.
 */
export async function getEventAction(
  id: string
): Promise<ActionState<SelectEvent>> {
  try {
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id))
    if (!event) {
      return { isSuccess: false, message: "Event not found" }
    }
    return {
      isSuccess: true,
      message: "Event retrieved successfully",
      data: event,
    }
  } catch (error) {
    console.error("Error getting event:", error)
    return { isSuccess: false, message: "Failed to get event" }
  }
}

/**
 * Aktualisiert ein Event.
 */
export async function updateEventAction(
  id: string,
  data: Partial<InsertEvent>
): Promise<ActionState<SelectEvent>> {
  try {
    // Optional: Role-Check -> Nur Admin darf Events updaten:
    const isAdmin = await checkAdminAction()
    if (!isAdmin.isSuccess || !isAdmin.data) {
      return {
        isSuccess: false,
        message: "Zugriff verweigert. Nur Admins können Events bearbeiten."
      }
    }

    const [updatedEvent] = await db
      .update(eventsTable)
      .set(data)
      .where(eq(eventsTable.id, id))
      .returning()

    if (!updatedEvent) {
      return {
        isSuccess: false,
        message: "Event nicht gefunden."
      }
    }

    return {
      isSuccess: true,
      message: "Event updated successfully",
      data: updatedEvent,
    }
  } catch (error) {
    console.error("Error updating event:", error)
    return { isSuccess: false, message: "Failed to update event" }
  }
}

/**
 * Löscht ein Event anhand der ID.
 * Da Slots onCascade=delete haben, werden zugehörige Slots automatisch gelöscht.
 */
export async function deleteEventAction(id: string): Promise<ActionState<void>> {
  try {
    // Optional: Role-Check
    const isAdmin = await checkAdminAction()
    if (!isAdmin.isSuccess || !isAdmin.data) {
      return {
        isSuccess: false,
        message: "Zugriff verweigert. Nur Admins können Events löschen."
      }
    }

    await db.delete(eventsTable).where(eq(eventsTable.id, id))
    return {
      isSuccess: true,
      message: "Event deleted successfully",
      data: undefined,
    }
  } catch (error) {
    console.error("Error deleting event:", error)
    return { isSuccess: false, message: "Failed to delete event" }
  }
} 
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
  eventData: InsertEvent
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
    const [newEvent] = await db.insert(eventsTable).values(eventData).returning()
    return {
      isSuccess: true,
      message: "Event erfolgreich erstellt.",
      data: newEvent
    }
  } catch (error) {
    console.error("Error creating event:", error)
    return { isSuccess: false, message: "Fehler beim Erstellen des Events." }
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
      message: "Events erfolgreich abgerufen.",
      data: events
    }
  } catch (error) {
    console.error("Error getting events:", error)
    return { isSuccess: false, message: "Fehler beim Abrufen der Events." }
  }
}

/**
 * Gibt ein einzelnes Event anhand der ID zurück.
 */
export async function getEventByIdAction(
  eventId: string
): Promise<ActionState<SelectEvent>> {
  try {
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId))
    if (!event) {
      return {
        isSuccess: false,
        message: "Event nicht gefunden."
      }
    }

    return {
      isSuccess: true,
      message: "Event erfolgreich abgerufen.",
      data: event
    }
  } catch (error) {
    console.error("Error getting event by id:", error)
    return { isSuccess: false, message: "Fehler beim Abrufen des Events." }
  }
}

/**
 * Aktualisiert ein Event.
 */
export async function updateEventAction(
  eventId: string,
  eventData: Partial<InsertEvent>
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
      .set(eventData)
      .where(eq(eventsTable.id, eventId))
      .returning()

    if (!updatedEvent) {
      return {
        isSuccess: false,
        message: "Event nicht gefunden."
      }
    }

    return {
      isSuccess: true,
      message: "Event erfolgreich aktualisiert.",
      data: updatedEvent
    }
  } catch (error) {
    console.error("Error updating event:", error)
    return { isSuccess: false, message: "Fehler beim Aktualisieren des Events." }
  }
}

/**
 * Löscht ein Event anhand der ID.
 * Da Slots onCascade=delete haben, werden zugehörige Slots automatisch gelöscht.
 */
export async function deleteEventAction(
  eventId: string
): Promise<ActionState<void>> {
  try {
    // Optional: Role-Check
    const isAdmin = await checkAdminAction()
    if (!isAdmin.isSuccess || !isAdmin.data) {
      return {
        isSuccess: false,
        message: "Zugriff verweigert. Nur Admins können Events löschen."
      }
    }

    const result = await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, eventId))
      .returning()

    // Prüfen, ob tatsächlich etwas gelöscht wurde.
    if (result.length === 0) {
      return {
        isSuccess: false,
        message: "Event nicht gefunden."
      }
    }

    return {
      isSuccess: true,
      message: "Event erfolgreich gelöscht",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting event:", error)
    return { isSuccess: false, message: "Fehler beim Löschen des Events." }
  }
} 
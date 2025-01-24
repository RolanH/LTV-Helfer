"use server"

import { db } from "@/db/db"
import { slotsTable, InsertSlot, SelectSlot } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"
import { checkAdminAction } from "@/actions/auth-actions"

/**
 * Erzeugt einen neuen Slot für ein bestimmtes Event.
 */
export async function createSlotAction(
  slotData: InsertSlot
): Promise<ActionState<SelectSlot>> {
  try {
    // Nur Admin darf Slots erstellen
    const isAdmin = await checkAdminAction()
    if (!isAdmin.isSuccess || !isAdmin.data) {
      return {
        isSuccess: false,
        message: "Zugriff verweigert. Nur Admins können Slots erstellen."
      }
    }

    const [newSlot] = await db.insert(slotsTable).values(slotData).returning()
    return {
      isSuccess: true,
      message: "Slot erfolgreich erstellt.",
      data: newSlot
    }
  } catch (error) {
    console.error("Error creating slot:", error)
    return { isSuccess: false, message: "Fehler beim Erstellen des Slots." }
  }
}

/**
 * Liest alle Slots eines bestimmten Events aus.
 */
export async function getSlotsByEventAction(
  eventId: string
): Promise<ActionState<SelectSlot[]>> {
  try {
    const slots = await db
      .select()
      .from(slotsTable)
      .where(eq(slotsTable.eventId, eventId))
    return {
      isSuccess: true,
      message: "Slots erfolgreich abgerufen.",
      data: slots
    }
  } catch (error) {
    console.error("Error getting slots by event:", error)
    return { isSuccess: false, message: "Fehler beim Abrufen der Slots." }
  }
}

/**
 * Aktualisiert einen bestehenden Slot.
 */
export async function updateSlotAction(
  slotId: string,
  slotData: Partial<InsertSlot>
): Promise<ActionState<SelectSlot>> {
  try {
    // Nur Admin darf Slots bearbeiten
    const isAdmin = await checkAdminAction()
    if (!isAdmin.isSuccess || !isAdmin.data) {
      return {
        isSuccess: false,
        message: "Zugriff verweigert. Nur Admins können Slots bearbeiten."
      }
    }

    const [updatedSlot] = await db
      .update(slotsTable)
      .set(slotData)
      .where(eq(slotsTable.id, slotId))
      .returning()

    if (!updatedSlot) {
      return {
        isSuccess: false,
        message: "Slot nicht gefunden."
      }
    }

    return {
      isSuccess: true,
      message: "Slot erfolgreich aktualisiert.",
      data: updatedSlot
    }
  } catch (error) {
    console.error("Error updating slot:", error)
    return { isSuccess: false, message: "Fehler beim Aktualisieren des Slots." }
  }
}

/**
 * Löscht einen Slot anhand der ID.
 */
export async function deleteSlotAction(
  slotId: string
): Promise<ActionState<void>> {
  try {
    // Nur Admin darf Slots löschen
    const isAdmin = await checkAdminAction()
    if (!isAdmin.isSuccess || !isAdmin.data) {
      return {
        isSuccess: false,
        message: "Zugriff verweigert. Nur Admins können Slots löschen."
      }
    }

    const result = await db
      .delete(slotsTable)
      .where(eq(slotsTable.id, slotId))
      .returning()

    if (result.length === 0) {
      return {
        isSuccess: false,
        message: "Slot nicht gefunden."
      }
    }

    return {
      isSuccess: true,
      message: "Slot erfolgreich gelöscht.",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting slot:", error)
    return { isSuccess: false, message: "Fehler beim Löschen des Slots." }
  }
} 
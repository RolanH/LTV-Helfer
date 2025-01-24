"use server"

import { ActionState } from "@/types"
import { createEvent } from "ics"
import { getEventAction } from "@/actions/db/events-actions"

export async function generateIcalAction(eventId: string): Promise<ActionState<string>> {
  try {
    // Get the event
    const eventResult = await getEventAction(eventId)
    if (!eventResult.isSuccess || !eventResult.data) {
      return { isSuccess: false, message: "Event nicht gefunden." }
    }

    const event = eventResult.data

    // ICS event object
    const eventObj = {
      start: convertTimestampToArray(event.eventDate),
      duration: { hours: 2 }, // Example: Default 2 hours
      title: event.title,
      description: event.description,
      location: "Lüdenscheider Turnverein 1861 e.V."
    }

    const { error, value } = createEvent(eventObj)
    if (error) {
      console.error("Error creating ICS:", error)
      return { isSuccess: false, message: "Fehler beim Erstellen der ICS-Datei." }
    }

    return {
      isSuccess: true,
      message: "ICS-Datei generiert",
      data: value
    }
  } catch (error) {
    console.error("Error generating ical:", error)
    return { isSuccess: false, message: "Fehler beim Generieren der ICS-Datei." }
  }
}

/**
 * Helper function: Convert timestamp to [YYYY, M, D, H, Min]
 */
function convertTimestampToArray(date: Date): [number, number, number, number, number] {
  const d = new Date(date)
  return [
    d.getFullYear(),
    d.getMonth() + 1, // JS months: 0-11
    d.getDate(),
    d.getHours(),
    d.getMinutes()
  ]
} 
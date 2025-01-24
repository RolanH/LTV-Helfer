"use client"

import { SelectEvent } from "@/db/schema"
import { formatDate } from "@/lib/utils"

interface EventsListProps {
  events: SelectEvent[]
}

export default function EventsList({ events }: EventsListProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
          <p className="text-gray-600 mb-2">{event.description}</p>
          <p className="text-sm text-gray-500">
            Datum: {formatDate(event.eventDate)}
          </p>
        </div>
      ))}

      {events.length === 0 && (
        <div className="text-center text-gray-500">
          Keine Events vorhanden.
        </div>
      )}
    </div>
  )
} 
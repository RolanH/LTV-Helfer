"use server"

import { Suspense } from "react"
import { getEventsAction } from "@/actions/db/events-actions"
import EventsList from "./_components/events-list"
import EventsSkeleton from "./_components/events-skeleton"

export default async function EventsPage() {
  return (
    <Suspense fallback={<EventsSkeleton />}>
      <EventsPageFetcher />
    </Suspense>
  )
}

async function EventsPageFetcher() {
  const eventsResult = await getEventsAction()

  if (!eventsResult.isSuccess) {
    return <div>Fehler: {eventsResult.message}</div>
  }

  return <EventsList events={eventsResult.data} />
} 
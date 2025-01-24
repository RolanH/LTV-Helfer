"use server"

import { NextResponse } from "next/server"
import { generateIcalAction } from "@/actions/ical-actions"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get("eventId")

  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 })
  }

  const result = await generateIcalAction(eventId)

  if (!result.isSuccess || !result.data) {
    return NextResponse.json({ error: result.message }, { status: 400 })
  }

  const icsData = result.data
  return new NextResponse(icsData, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="event_${eventId}.ics"`
    }
  })
} 
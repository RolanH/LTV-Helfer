"use server"

import { auth } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const { userId } = auth()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <h1 className="text-4xl font-bold mb-4">
        Willkommen bei der Helfer-App
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Organisiere und koordiniere Helfer für deine Veranstaltungen.
      </p>
      {!userId ? (
        <div className="space-x-4">
          <Link href="/sign-in">
            <Button size="lg">Anmelden</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="lg">
              Registrieren
            </Button>
          </Link>
        </div>
      ) : (
        <Link href="/events">
          <Button size="lg">Zu den Events</Button>
        </Link>
      )}
    </div>
  )
} 
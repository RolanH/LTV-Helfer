"use server"

import { Suspense } from "react"
import { checkAdminAction } from "@/actions/auth-actions"

export default async function AdminPage() {
  // Wir führen die Server Action aus, um zu checken, ob der User Admin ist
  const adminCheck = await checkAdminAction()

  // Wenn kein Admin -> "Access Denied"
  if (!adminCheck.isSuccess || !adminCheck.data) {
    return <div>Zugriff verweigert – nur für Admins.</div>
  }

  // Admin-Content
  return (
    <Suspense fallback={<div>Lädt...</div>}>
      <AdminContentFetcher />
    </Suspense>
  )
}

async function AdminContentFetcher() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin-Bereich</h1>
      <p>Hier können nur Admins zugreifen und z.B.:</p>
      <ul className="list-disc list-inside mt-2">
        <li>Events anlegen und verwalten</li>
        <li>User-Rollen ändern</li>
        <li>System-Einstellungen anpassen</li>
      </ul>
    </div>
  )
} 
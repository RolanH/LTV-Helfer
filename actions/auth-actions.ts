"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { ActionState } from "@/types"

/**
 * Prüfen, ob der aktuelle User Admin-Rechte hat.
 * Wir verwenden dafür das Feld publicMetadata.role bei Clerk, 
 * wo wir z.B. 'admin' oder 'user' speichern.
 */
export async function checkAdminAction(): Promise<ActionState<boolean>> {
  try {
    const { userId } = auth()
    if (!userId) {
      return { isSuccess: false, message: "Not authenticated" }
    }

    // Clerk-User abrufen, um auf publicMetadata zuzugreifen
    const user = await clerkClient.users.getUser(userId)
    const role = user.publicMetadata?.role

    // Wir gehen davon aus, dass 'role' entweder 'admin' oder 'user' sein kann
    const isAdmin = role === "admin"

    return {
      isSuccess: true,
      message: "Role check successful",
      data: isAdmin
    }
  } catch (error) {
    console.error("Error checking admin role:", error)
    return { isSuccess: false, message: "Failed to check admin role" }
  }
}

/**
 * Setzen oder ändern der Rolle eines Users. 
 * Nur ein Admin sollte diese Action aufrufen dürfen.
 */
export async function setUserRoleAction(
  targetUserId: string,
  role: string
): Promise<ActionState<void>> {
  try {
    const { userId } = auth()
    if (!userId) {
      return { isSuccess: false, message: "Not authenticated" }
    }

    // Prüfen, ob der aufrufende User Admin ist
    const callingUser = await clerkClient.users.getUser(userId)
    if (callingUser.publicMetadata?.role !== "admin") {
      return { isSuccess: false, message: "Access denied" }
    }

    // Rolle für den Ziel-User setzen
    await clerkClient.users.updateUser(targetUserId, {
      publicMetadata: { role }
    })

    return {
      isSuccess: true,
      message: "User role updated successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error updating user role:", error)
    return { isSuccess: false, message: "Failed to update user role" }
  }
} 
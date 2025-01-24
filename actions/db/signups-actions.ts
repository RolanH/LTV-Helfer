"use server"

import { db } from "@/db/db"
import {
  InsertSignup,
  SelectSignup,
  signupsTable,
  slotsTable
} from "@/db/schema"
import { ActionState } from "@/types"
import { and, eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"

export async function createSignupAction(
  data: Omit<InsertSignup, "id" | "createdAt" | "updatedAt" | "userId">
): Promise<ActionState<SelectSignup>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    // Check if slot exists
    const slot = await db.query.slots.findFirst({
      where: eq(slotsTable.id, data.slotId)
    })

    if (!slot) {
      return { isSuccess: false, message: "Slot not found" }
    }

    // Check if user is already signed up for this slot
    const existingSignup = await db.query.signups.findFirst({
      where: and(
        eq(signupsTable.slotId, data.slotId),
        eq(signupsTable.userId, userId)
      )
    })

    if (existingSignup) {
      return { isSuccess: false, message: "Already signed up for this slot" }
    }

    // Count current signups for this slot
    const currentSignups = await db.query.signups.findMany({
      where: eq(signupsTable.slotId, data.slotId)
    })

    if (currentSignups.length >= slot.neededHelpers) {
      return { isSuccess: false, message: "Slot is already full" }
    }

    const [newSignup] = await db
      .insert(signupsTable)
      .values({ ...data, userId })
      .returning()

    return {
      isSuccess: true,
      message: "Signup created successfully",
      data: newSignup
    }
  } catch (error) {
    console.error("Error creating signup:", error)
    return { isSuccess: false, message: "Failed to create signup" }
  }
}

export async function getSignupsBySlotIdAction(
  slotId: string
): Promise<ActionState<SelectSignup[]>> {
  try {
    const signups = await db.query.signups.findMany({
      where: eq(signupsTable.slotId, slotId),
      orderBy: (signups, { asc }) => [asc(signups.createdAt)]
    })

    return {
      isSuccess: true,
      message: "Signups retrieved successfully",
      data: signups
    }
  } catch (error) {
    console.error("Error getting signups:", error)
    return { isSuccess: false, message: "Failed to get signups" }
  }
}

export async function getSignupsByUserIdAction(
  userId: string
): Promise<ActionState<SelectSignup[]>> {
  try {
    const signups = await db.query.signups.findMany({
      where: eq(signupsTable.userId, userId),
      orderBy: (signups, { asc }) => [asc(signups.createdAt)]
    })

    return {
      isSuccess: true,
      message: "Signups retrieved successfully",
      data: signups
    }
  } catch (error) {
    console.error("Error getting signups:", error)
    return { isSuccess: false, message: "Failed to get signups" }
  }
}

export async function updateSignupAction(
  id: string,
  data: Partial<Omit<InsertSignup, "userId" | "slotId">>
): Promise<ActionState<SelectSignup>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    // Check if signup exists and belongs to user
    const signup = await db.query.signups.findFirst({
      where: eq(signupsTable.id, id)
    })

    if (!signup) {
      return { isSuccess: false, message: "Signup not found" }
    }

    if (signup.userId !== userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    const [updatedSignup] = await db
      .update(signupsTable)
      .set(data)
      .where(eq(signupsTable.id, id))
      .returning()

    return {
      isSuccess: true,
      message: "Signup updated successfully",
      data: updatedSignup
    }
  } catch (error) {
    console.error("Error updating signup:", error)
    return { isSuccess: false, message: "Failed to update signup" }
  }
}

export async function deleteSignupAction(id: string): Promise<ActionState<void>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    // Check if signup exists and belongs to user
    const signup = await db.query.signups.findFirst({
      where: eq(signupsTable.id, id)
    })

    if (!signup) {
      return { isSuccess: false, message: "Signup not found" }
    }

    if (signup.userId !== userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    await db.delete(signupsTable).where(eq(signupsTable.id, id))

    return {
      isSuccess: true,
      message: "Signup deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting signup:", error)
    return { isSuccess: false, message: "Failed to delete signup" }
  }
} 
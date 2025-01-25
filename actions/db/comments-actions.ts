"use server"

import { db } from "@/db/db"
import {
  InsertComment,
  SelectComment,
  commentsTable,
  eventsTable
} from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"

export async function createCommentAction(
  data: Omit<InsertComment, "id" | "createdAt" | "updatedAt" | "userId">
): Promise<ActionState<SelectComment>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    // Check if event exists
    const event = await db.query.events.findFirst({
      columns: {
        id: true,
        userId: true,
        title: true,
        description: true,
        location: true,
        eventDate: true,
        createdAt: true,
        updatedAt: true
      },
      where: eq(eventsTable.id, data.eventId)
    })

    if (!event) {
      return { isSuccess: false, message: "Event not found" }
    }

    const [newComment] = await db
      .insert(commentsTable)
      .values({ ...data, userId })
      .returning()

    return {
      isSuccess: true,
      message: "Comment created successfully",
      data: newComment
    }
  } catch (error) {
    console.error("Error creating comment:", error)
    return { isSuccess: false, message: "Failed to create comment" }
  }
}

export async function getCommentsByEventIdAction(
  eventId: string
): Promise<ActionState<SelectComment[]>> {
  try {
    const comments = await db.query.comments.findMany({
      columns: {
        id: true,
        userId: true,
        eventId: true,
        content: true,
        createdAt: true,
        updatedAt: true
      },
      where: eq(commentsTable.eventId, eventId),
      orderBy: (tbl, { desc }) => [desc(tbl.createdAt)]
    })

    // Telling TypeScript these records match our SelectComment shape
    return {
      isSuccess: true,
      message: "Comments retrieved successfully",
      data: comments as SelectComment[]
    }
  } catch (error) {
    console.error("Error getting comments:", error)
    return { isSuccess: false, message: "Failed to get comments" }
  }
}

export async function updateCommentAction(
  id: string,
  data: Partial<Omit<InsertComment, "userId" | "eventId">>
): Promise<ActionState<SelectComment>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    // Check if comment exists and belongs to user
    const comment = await db.query.comments.findFirst({
      columns: {
        id: true,
        userId: true,
        eventId: true,
        content: true,
        createdAt: true,
        updatedAt: true
      },
      where: eq(commentsTable.id, id)
    })

    if (!comment) {
      return { isSuccess: false, message: "Comment not found" }
    }

    if (comment.userId !== userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    const [updatedComment] = await db
      .update(commentsTable)
      .set(data)
      .where(eq(commentsTable.id, id))
      .returning()

    return {
      isSuccess: true,
      message: "Comment updated successfully",
      data: updatedComment
    }
  } catch (error) {
    console.error("Error updating comment:", error)
    return { isSuccess: false, message: "Failed to update comment" }
  }
}

export async function deleteCommentAction(id: string): Promise<ActionState<void>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    // Check if comment exists and belongs to user
    const comment = await db.query.comments.findFirst({
      columns: {
        id: true,
        userId: true,
        eventId: true,
        content: true,
        createdAt: true,
        updatedAt: true
      },
      where: eq(commentsTable.id, id)
    })

    if (!comment) {
      return { isSuccess: false, message: "Comment not found" }
    }

    // Allow both comment author and event creator to delete comments
    const event = await db.query.events.findFirst({
      columns: {
        id: true,
        userId: true,
        title: true,
        description: true,
        location: true,
        eventDate: true,
        createdAt: true,
        updatedAt: true
      },
      where: eq(eventsTable.id, comment.eventId)
    })

    if (!event) {
      return { isSuccess: false, message: "Event not found" }
    }

    if (comment.userId !== userId && event.userId !== userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    await db.delete(commentsTable).where(eq(commentsTable.id, id))

    return {
      isSuccess: true,
      message: "Comment deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting comment:", error)
    return { isSuccess: false, message: "Failed to delete comment" }
  }
} 
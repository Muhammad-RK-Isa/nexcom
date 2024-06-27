"use server"

import { db } from "~/server/db"
import { users } from "~/server/db/schema"
import { eq } from "drizzle-orm"

export const getUserByEmail = async (email: string) => {
  const user = await db.select().from(users).where(eq(users.email, email))
  return user[0]
}

export const getUserById = async (id: string) => {
  const user = await db.select().from(users).where(eq(users.id, id))
  return user[0]
}

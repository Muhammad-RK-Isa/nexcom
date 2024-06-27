import type { Adapter, AdapterAccount, AdapterUser } from "@auth/core/adapters"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { and, eq } from "drizzle-orm"

import { generateId } from "~/lib/utils"

import { db } from "./db"
import { accounts, users } from "./db/schema"

export const drizzleAdapter: Adapter = {
  ...DrizzleAdapter(db),
  async createUser(data: AdapterUser) {
    return await db
      .insert(users)
      .values({ ...data, id: generateId({ prefix: "user" }) })
      .returning()
      .then((res) => res[0] ?? data)
  },
  async getUser(data) {
    return await db
      .select()
      .from(users)
      .where(eq(users.id, data))
      .then((res) => res[0] ?? null)
  },
  async getUserByEmail(data) {
    return await db
      .select()
      .from(users)
      .where(eq(users.email, data))
      .then((res) => res[0] ?? null)
  },
  async updateUser(data) {
    if (!data.id) {
      throw new Error("No user id.")
    }

    return await db
      .update(users)
      .set(data)
      .where(eq(users.id, data.id))
      .returning()
      .then((res) => res[0]!)
  },
  async getUserByAccount(account: AdapterAccount) {
    const dbAccount =
      (await db
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .leftJoin(users, eq(accounts.userId, users.id))
        .then((res) => res[0])) ?? null

    return dbAccount?.user ?? null
  },
}

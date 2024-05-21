import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { Adapter, AdapterAccount, AdapterUser } from "@auth/core/adapters";
import { and, eq } from "drizzle-orm";

import { db } from "./db";
import { accounts, users } from "./db/schema";
import { generateId } from "~/lib/utils";

export const drizzleAdapter: Adapter = {
  ...DrizzleAdapter(db),
  async createUser(data: AdapterUser) {
    return await db
      .insert(users)
      .values({ ...data, id: generateId({ prefix: "user" }) })
      .returning()
      .then((res) => res[0] ?? data);
  },
  async getUserByAccount(account: AdapterAccount) {
    const dbAccount =
      (await db
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider),
          ),
        )
        .leftJoin(users, eq(accounts.userId, users.id))
        .then((res) => res[0])) ?? null;

    return dbAccount?.user ?? null;
  },
};

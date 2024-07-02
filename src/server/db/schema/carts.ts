import { boolean, json, pgTable, text, varchar } from "drizzle-orm/pg-core"

import type { CartItem } from "~/types"
import { generateId } from "~/lib/utils"

import { lifecycleDates } from "./utils"

export const carts = pgTable("carts", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId({ prefix: "cart" }))
    .primaryKey(),
  paymentIntentId: varchar("payment_intent_id", { length: 256 }),
  clientSecret: text("client_secret"),
  items: json("items").$type<CartItem[] | null>().default(null),
  closed: boolean("closed").notNull().default(false),
  ...lifecycleDates,
})

import { json, pgTable, text, varchar } from "drizzle-orm/pg-core"

import type { CheckoutItem } from "~/types"
import { generateOrderId } from "~/lib/utils"

import { lifecycleDates } from "./utils"

export const orders = pgTable("orders", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateOrderId()),
  items: json("items").$type<CheckoutItem[] | null>().default(null),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  stripePaymentIntentStatus: text("stripe_payment_intent_status").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  // addressId: varchar("address_id", { length: 30 })
  //   .references(() => addresses.id, { onDelete: "cascade" })
  //   .notNull(),
  ...lifecycleDates,
})

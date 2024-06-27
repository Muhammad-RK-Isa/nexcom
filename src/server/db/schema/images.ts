import { relations } from "drizzle-orm"
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

import { productVariants } from "./product-variants"
import { productsImages } from "./products-images"

export const images = pgTable("images", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
})

export const imagesRelations = relations(images, ({ many }) => ({
  productsImages: many(productsImages),
  productVariants: many(productVariants),
}))

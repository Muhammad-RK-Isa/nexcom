import { relations } from "drizzle-orm"
import { pgTable, real, varchar } from "drizzle-orm/pg-core"

import { generateId } from "~/lib/utils"

import { images } from "./images"
import { products } from "./products"
import { lifecycleDates, productFields } from "./utils"
import { variantsOptionValues } from "./variants-option-values"

export const productVariants = pgTable("product_variants", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId({ prefix: "variant" })),
  title: varchar("title", { length: 255 }),
  productId: varchar("product_id", { length: 255 })
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  imageId: varchar("image_id", { length: 255 }).references(() => images.id, {
    onDelete: "set null",
  }),
  ...productFields,
  weight: real("weight"),
  ...lifecycleDates,
})

export const variantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    image: one(images, {
      fields: [productVariants.imageId],
      references: [images.id],
    }),
    variantsOptionValues: many(variantsOptionValues),
  })
)

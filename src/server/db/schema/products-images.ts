import { relations } from "drizzle-orm"
import { integer, pgTable, unique, varchar } from "drizzle-orm/pg-core"

import { generateId } from "~/lib/utils"

import { images } from "./images"
import { products } from "./products"

export const productsImages = pgTable(
  "products_images",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId({ prefix: "pdimg" })),
    productId: varchar("product_id", { length: 255 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    imageId: varchar("image_id", { length: 255 })
      .notNull()
      .references(() => images.id, { onDelete: "cascade" }),
    rank: integer("rank").notNull().default(0),
  },
  (t) => ({
    unq: unique().on(t.productId, t.imageId),
  })
)

export const productsImagesRelations = relations(productsImages, ({ one }) => ({
  product: one(products, {
    fields: [productsImages.productId],
    references: [products.id],
  }),
  image: one(images, {
    fields: [productsImages.imageId],
    references: [images.id],
  }),
}))

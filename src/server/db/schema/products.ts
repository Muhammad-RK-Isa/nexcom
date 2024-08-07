import { relations, sql } from "drizzle-orm"
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core"

import { generateId } from "~/lib/utils"

import { productOptions } from "./product-options"
import { productVariants } from "./product-variants"
import { productsImages } from "./products-images"
import { lifecycleDates, productFields } from "./utils"

export const pgProductStatuses = pgEnum("productStatuses", ["active", "draft"])

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId({ prefix: "product" })),
    title: text("title").notNull(),
    metaTitle: text("meta_title").notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    content: jsonb("content"),
    description: text("description").notNull(),
    status: pgProductStatuses("status").default("draft").notNull(),
    mrp: real("mrp").notNull().default(0),
    vendor: text("vendor"),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    ...productFields,
    ...lifecycleDates,
  },
  (t) => ({
    titleIdx: index("title_index").on(t.title),
    slugIdx: uniqueIndex("slug_index").on(t.slug),
  })
)

export const productsRelations = relations(products, ({ many }) => ({
  options: many(productOptions),
  variants: many(productVariants),
  productImages: many(productsImages),
}))

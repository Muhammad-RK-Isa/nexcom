import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  real,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { generateId } from "~/lib/utils";
import { variantsOptionValues } from "./variants-option-values";
import { products } from "./products";
import { images } from "./images";

export const productVariants = pgTable("product_variants", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId({ prefix: "variant" })),
  price: real("price").notNull().default(0),
  inventoryQuantity: integer("inventory_quantity").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  productId: varchar("product_id", { length: 255 })
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  imageId: varchar("image_id", { length: 255 }).references(() => images.id, {
    onDelete: "set null",
  }),
});

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
  }),
);

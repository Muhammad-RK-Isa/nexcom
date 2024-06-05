import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  real,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { generateId } from "~/lib/utils";
import { products } from "./products";
import { productsImages } from "./products-images";
import { variantsOptionValues } from "./variants-option-values";

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
  productImageId: varchar("product_image_id", { length: 255 }).references(
    () => products.id,
    {
      onDelete: "set null",
    },
  ),
});

export const variantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    productImage: one(productsImages, {
      fields: [productVariants.productImageId],
      references: [productsImages.id],
    }),
    variantsOptionValues: many(variantsOptionValues),
  }),
);

import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { generateId } from "~/lib/utils";
import { products } from "./products";
import { productOptionValue } from "./product-option-value";
import { productsImages } from "./products-images";

export const productVariants = pgTable("product_variants", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId({ prefix: "variant" })),
  title: text("title").notNull(),
  price: numeric("price").notNull().default("0"),
  mrp: numeric("mrp").notNull().default("0"),
  inventoryQuantity: integer("inventory_quantity").notNull().default(0),
  allowBackorder: boolean("allow_backorder").notNull().default(false),
  manageInventory: boolean("manage_inventory").notNull().default(false),
  weight: numeric("weight").notNull().default("0"),
  length: numeric("length").notNull().default("0"),
  height: numeric("height").notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  productId: varchar("product_id", { length: 255 })
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  productImageId: varchar("product_image_id", { length: 255 }).references(
    () => products.id,
    { onDelete: "set null" },
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
    optionValues: many(productOptionValue),
  }),
);

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { generateId } from "~/lib/utils";
import { productOptions } from "./product-options";
import { productVariants } from "./product-variants";

export const pgProductStatuses = pgEnum("productStatus", ["active", "draft"]);

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId({ prefix: "products" })),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    status: pgProductStatuses("status").default("draft").notNull(),
    vendor: text("vendor"),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
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
  },
  (t) => ({
    slugIdx: index("slug_index").on(t.slug),
  }),
);

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  options: many(productOptions),
}));

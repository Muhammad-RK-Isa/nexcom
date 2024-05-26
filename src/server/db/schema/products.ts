import { relations, sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { generateId } from "~/lib/utils";
import { productOptions } from "./product-options";
import { productVariants } from "./product-variants";

export const pgProductStatuses = pgEnum("productStatuses", ["active", "draft"]);
export const pgWeightUnits = pgEnum("weightUnit", ["kg", "g", "lb", "oz"]);
export const pgSizeUnits = pgEnum("pgSizeUnit", ["m", "cm", "mm", "in", "ft"]);

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId({ prefix: "product" })),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    status: pgProductStatuses("status").default("draft").notNull(),
    vendor: text("vendor"),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    price: real("price").notNull().default(0),
    mrp: real("mrp").notNull().default(0),
    inventoryQuantity: integer("inventory_quantity").notNull().default(0),
    allowBackorder: boolean("allow_backorder").notNull().default(false),
    manageInventory: boolean("manage_inventory").notNull().default(false),
    weight: real("weight").notNull(),
    length: real("length"),
    height: real("height"),
    weightUnit: pgWeightUnits("weightUnit").notNull().default("kg"),
    heightUnit: pgSizeUnits("heightUnit").notNull().default("m"),
    lengthUnit: pgSizeUnits("lengthUnit").notNull().default("m"),
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

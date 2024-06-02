import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { generateId } from "~/lib/utils";
import { productOptions } from "./product-options";
import { productVariants } from "./product-variants";

export const productOptionValues = pgTable("option_values", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId({ prefix: "optval" })),
  value: text("value").notNull(),
  rank: integer("rank").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  optionId: varchar("option_id", { length: 255 })
    .notNull()
    .references(() => productOptions.id, { onDelete: "cascade" }),
  variantId: varchar("variant_id", { length: 255 })
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

export const productOptionValuesRelations = relations(
  productOptionValues,
  ({ one, many }) => ({
    option: one(productOptions, {
      fields: [productOptionValues.optionId],
      references: [productOptions.id],
    }),
    variant: many(productVariants),
  }),
);

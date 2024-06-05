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
import { variantsOptionValues } from "./variants-option-values";

export const productOptionValues = pgTable("option_values", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId({ prefix: "optval" })),
  value: text("value").notNull(),
  rank: integer("rank").notNull().default(1),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date(),
  ),
  optionId: varchar("option_id", { length: 255 })
    .notNull()
    .references(() => productOptions.id, { onDelete: "cascade" }),
});

export const productOptionValuesRelations = relations(
  productOptionValues,
  ({ one, many }) => ({
    option: one(productOptions, {
      fields: [productOptionValues.optionId],
      references: [productOptions.id],
    }),
    variantsOptionValues: many(variantsOptionValues),
  }),
);

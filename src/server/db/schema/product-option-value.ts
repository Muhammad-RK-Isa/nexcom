import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { generateId } from "~/lib/utils";
import { productOptions } from "./product-options";
import { productVariants } from "./product-variants";

export const productOptionValue = pgTable("option_values", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId({ prefix: "optval" })),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  optionId: varchar("option_id", { length: 255 })
    .notNull()
    .references(() => productOptions.id, { onDelete: "cascade" }),
  variantId: varchar("variant_id", { length: 255 })
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

export const productOptionValueRelations = relations(
  productOptionValue,
  ({ one }) => ({
    option: one(productOptions, {
      fields: [productOptionValue.optionId],
      references: [productOptions.id],
    }),
    variant: one(productVariants, {
      fields: [productOptionValue.id],
      references: [productVariants.id],
    }),
  }),
);

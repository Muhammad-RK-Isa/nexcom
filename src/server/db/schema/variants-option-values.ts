import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

import { productOptionValues, productVariants } from ".";

export const variantsOptionValues = pgTable(
  "variants_option_values",
  {
    variantId: varchar("variant_id", { length: 255 })
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    optionValueId: varchar("option_value_id", { length: 255 })
      .notNull()
      .references(() => productOptionValues.id, { onDelete: "cascade" }),
  },
  (t) => ({
    compundKey: primaryKey({
      columns: [t.variantId, t.optionValueId],
    }),
  }),
);

export const variantOptionValuesRelations = relations(
  variantsOptionValues,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [variantsOptionValues.variantId],
      references: [productVariants.id],
    }),
    optionValue: one(productOptionValues, {
      fields: [variantsOptionValues.optionValueId],
      references: [productOptionValues.id],
    }),
  }),
);

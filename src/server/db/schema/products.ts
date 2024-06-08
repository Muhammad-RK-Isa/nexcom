import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import type { StoredFile } from "~/types";
import { generateId } from "~/lib/utils";
import { productOptions, productVariants, productsImages } from ".";

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
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      precision: 3,
    }).$onUpdate(() => new Date()),
  },
  (t) => ({
    slugIdx: index("slug_index").on(t.slug),
  }),
);

export const productsRelations = relations(products, ({ many }) => ({
  options: many(productOptions),
  variants: many(productVariants),
  productImages: many(productsImages),
}));

export const productStatuses = z.enum(pgProductStatuses.enumValues);

export const weightUnits = z.enum(pgWeightUnits.enumValues);
export const sizeUnits = z.enum(pgSizeUnits.enumValues);

export const baseProductSchema = createSelectSchema(products)
  .extend({
    title: z
      .string()
      .trim()
      .min(3, { message: "Please give a title for the product" }),
    description: z.string().nullable(),
    vendor: z.string().optional().nullable(),
    price: z.coerce
      .number({ message: "Please enter the price" })
      .nonnegative({ message: "Price cannot be negative" }),
    mrp: z.coerce
      .number({ message: "Please enter the MRP" })
      .nonnegative({ message: "MRP cannot be negative" }),
    inventoryQuantity: z.coerce
      .number({
        message: "Please enter the quantity",
      })
      .nonnegative({ message: "Quantity cannot be negative" }),
    tags: z.string().array().optional(),
    weight: z.object({
      value: z.coerce
        .number({ message: "Please enter the weight" })
        .nonnegative({ message: "Weight cannot be negative" }),
      unit: weightUnits,
    }),
    length: z
      .object({
        value: z.coerce
          .number()
          .nonnegative({ message: "Length cannot be negative" })
          .nullable()
          .optional(),
        unit: sizeUnits,
      })
      .nullable()
      .optional(),
    height: z
      .object({
        value: z.coerce
          .number()
          .nonnegative({ message: "Height cannot be negative" })
          .nullable()
          .optional(),
        unit: sizeUnits,
      })
      .nullable()
      .optional(),
    images: z
      .custom<StoredFile[] | undefined | null>()
      .optional()
      .nullable()
      .default(null),
  })
  .omit({
    createdAt: true,
    updatedAt: true,
    weightUnit: true,
    heightUnit: true,
    lengthUnit: true,
  });

export const optionValueSchema = z.object({
  id: z.string().default(generateId({ prefix: "optval" })),
  value: z.string().min(1, { message: "Option value cannot be empty" }),
  rank: z.number().nonnegative(),
  optionId: z.string(),
});

export const productOptionSchema = z.object({
  id: z.string().default(generateId({ prefix: "opt" })),
  title: z.string().min(1, { message: "Option title cannot be empty" }),
  rank: z.number().nonnegative(),
  values: z
    .array(optionValueSchema)
    .min(1, { message: "At least one value is required" }),
});

export const productVariantSchema = z.object({
  id: z
    .string()
    .default(generateId({ prefix: "variant" }))
    .optional(),
  price: z.coerce
    .number()
    .nonnegative({ message: "Price must be a positive number" })
    .default(0),
  inventoryQuantity: z.coerce
    .number()
    .nonnegative({ message: "Inventory must be a positive number" })
    .default(0),
  productId: z.string().optional(),
  productImageId: z.string().nullable().optional(),
  optionValues: z.array(optionValueSchema).default([]).optional(),
  createdAt: z.date().nullable().optional(),
});

export const updateProductSchema = baseProductSchema.extend({
  options: z.array(productOptionSchema).optional().default([]),
  variants: z.array(productVariantSchema).optional().default([]),
});

export const updateProductStatusSchema = baseProductSchema.pick({
  id: true,
  status: true,
});
export const productIdSchema = baseProductSchema.pick({ id: true });
export const productIdsSchema = z.array(productIdSchema);
export const insertProductSchema = updateProductSchema.omit({
  id: true,
});
export const updateProductsStatusSchema = z.object({
  productIds: productIdsSchema,
  status: productStatuses,
});

export const searchProductParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

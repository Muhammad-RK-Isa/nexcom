import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { generateId } from "~/lib/utils";

import {
  pgProductStatuses,
  pgSizeUnits,
  pgWeightUnits,
  products,
} from "~/server/db/schema";

export const productStatuses = z.enum(pgProductStatuses.enumValues);

export const weightUnits = z.enum(pgWeightUnits.enumValues);
export const sizeUnits = z.enum(pgSizeUnits.enumValues);

export const baseSchema = createSelectSchema(products)
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
    weight: z.coerce
      .number({
        message: "Please enter the weight of the product",
      })
      .nonnegative({ message: "Weight cannot be negative" }),
    length: z.coerce
      .number()
      .nonnegative({ message: "Length cannot be negative" })
      .nullable()
      .optional(),
    height: z.coerce
      .number()
      .nonnegative({ message: "Height cannot be negative" })
      .nullable()
      .optional(),
  })
  .omit({
    createdAt: true,
    updatedAt: true,
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

export const updateProductSchema = baseSchema.extend({
  options: z.array(productOptionSchema).optional().default([]),
  variants: z.array(productVariantSchema).optional().default([]),
});

export const updateProductStatusSchema = baseSchema.pick({
  id: true,
  status: true,
});
export const productIdSchema = baseSchema.pick({ id: true });
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

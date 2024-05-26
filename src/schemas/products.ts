import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

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
    vendor: z.string().nullable(),
    price: z.coerce.number({ message: "Please enter the price" }),
    mrp: z.coerce.number({ message: "Please enter the MRP" }),
    inventoryQuantity: z.coerce.number(),
    tags: z.string().array(),
    weight: z.coerce.number(),
    length: z.coerce.number().nullable(),
    height: z.coerce.number().nullable(),
  })
  .omit({
    createdAt: true,
    updatedAt: true,
  });

export const updateProductSchema = baseSchema;
export const updateProductStatusSchema = baseSchema.pick({
  id: true,
  status: true,
});
export const updateProductsStatusSchema = z.array(updateProductStatusSchema);
export const productIdSchema = baseSchema.pick({ id: true });
export const productIdsSchema = z.array(productIdSchema);
export const insertProductSchema = updateProductSchema.omit({
  id: true,
});

export const searchProductParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  status: productStatuses.optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

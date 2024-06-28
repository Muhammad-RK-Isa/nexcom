import {
  images,
  pgProductStatuses,
  pgSizeUnits,
  pgWeightUnits,
  products,
} from "~/server/db/schema"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { generateId } from "~/lib/utils"

export const baseImageSchema = createSelectSchema(images)

export const insertImageSchema = baseImageSchema.omit({
  createdAt: true,
  updatedAt: true,
})

export const imageIdSchema = baseImageSchema.pick({ id: true })
export const imageIdsSchema = z.array(imageIdSchema)

export const updateImageSchema = z.object({
  id: imageIdSchema,
  title: z.string().min(1, { message: "Please enter a title" }),
  description: z.string().optional(),
  url: z.string().min(1, { message: "Please enter a url" }),
  isThumbnail: z.boolean().optional().default(false),
})

export const imageSchema = baseImageSchema.omit({
  createdAt: true,
  updatedAt: true,
})

export const productStatuses = z.enum(pgProductStatuses.enumValues)

export const weightUnits = z.enum(pgWeightUnits.enumValues)
export const sizeUnits = z.enum(pgSizeUnits.enumValues)

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
    images: z.array(imageSchema),
  })
  .omit({
    createdAt: true,
    updatedAt: true,
    weightUnit: true,
    heightUnit: true,
    lengthUnit: true,
  })

export const searchImageParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const updateProductStatusSchema = baseProductSchema.pick({
  id: true,
  status: true,
})
export const productIdSchema = baseProductSchema.pick({ id: true })
export const productSlugSchema = baseProductSchema.pick({ slug: true })
export const productIdsSchema = z.array(productIdSchema)

export const updateProductsStatusSchema = z.object({
  productIds: productIdsSchema,
  status: productStatuses,
})

export const searchTableProductParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const searchProductParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  bestSelling: z.boolean().optional(),
  featured: z.boolean().optional(),
})

export const optionValueSchema = z.object({
  id: z.string().default(generateId({ prefix: "optval" })),
  value: z.string().min(1, { message: "Option value cannot be empty" }),
  rank: z.number().nonnegative(),
  optionId: z.string(),
})

export const productOptionSchema = z.object({
  id: z.string().default(generateId({ prefix: "opt" })),
  title: z.string().min(1, { message: "Option title cannot be empty" }),
  rank: z.number().nonnegative(),
  values: z
    .array(optionValueSchema)
    .min(1, { message: "At least one value is required" }),
})

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
  image: imageSchema.nullable().optional(),
  createdAt: z.date().nullable().optional(),
})

export const updateProductSchema = baseProductSchema.extend({
  options: z.array(productOptionSchema).optional().default([]),
  variants: z.array(productVariantSchema).optional().default([]),
})

export const insertProductSchema = updateProductSchema.omit({
  id: true,
})

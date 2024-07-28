import { images } from "~/server/db/schema"
import { createSelectSchema } from "drizzle-zod"
import * as z from "zod"

export const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().nullable(),
  quantity: z.coerce
    .number()
    .nonnegative({ message: "Quantity must be a positive number" }),
})

export const checkoutItemSchema = cartItemSchema.extend({
  price: z.number(),
})

export const cartLineItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  images: z.array(createSelectSchema(images)),
  price: z.number(),
  inventory: z.number(),
  quantity: z.number(),
  variant: z.object({
    id: z.string(),
    price: z.number(),
    image: createSelectSchema(images),
    inventoryQuantity: z.number(),
    optionValues: z
      .array(
        z.object({
          value: z.string(),
          rank: z.number(),
        })
      )
      .default([]),
  }),
})

export const deleteCartItemSchema = z.object({
  productId: z.string(),
})

export const deleteCartItemsSchema = z.object({
  productIds: z.array(z.string()),
})

export const addCartItemSchema = z.object({
  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be at least 1" })
    .max(10, { message: "Quantity must be at most 10" })
    .default(1),
})

export const updateCartItemSchema = z.object({
  quantity: z.coerce
    .number()
    .nonnegative({ message: "Quantity must be a positive number" })
    .default(1),
})

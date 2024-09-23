import type { z } from "zod"

import type {
  cartItemSchema,
  cartLineItemSchema,
  checkoutItemSchema,
} from "~/lib/validations/cart"

export type CartItem = z.infer<typeof cartItemSchema>
export type CheckoutItem = z.infer<typeof checkoutItemSchema>
export type CartLineItem = z.infer<typeof cartLineItemSchema>

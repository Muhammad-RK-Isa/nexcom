import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

import { addToCart } from "~/lib/api/carts/mutations"
import { getCart, getCartItems } from "~/lib/api/carts/queries"
import { cartItemSchema } from "~/lib/validations/cart"

export const cartsRouter = createTRPCRouter({
  getCart: publicProcedure.query(async () => {
    return getCart()
  }),
  getCartItems: publicProcedure.query(async () => {
    return getCartItems()
  }),
  addToCart: publicProcedure
    .input(cartItemSchema)
    .mutation(async ({ input }) => {
      return addToCart({
        input,
      })
    }),
})

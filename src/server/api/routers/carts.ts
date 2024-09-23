import { addToCart } from "~/features/cart/api/mutations"
import { getCart } from "~/features/cart/api/queries"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

import { cartItemSchema } from "~/lib/validations/cart"

export const cartsRouter = createTRPCRouter({
  getCart: publicProcedure.query(async () => {
    return getCart()
  }),
  addToCart: publicProcedure
    .input(cartItemSchema)
    .mutation(async ({ input }) => {
      return addToCart({
        input,
      })
    }),
})

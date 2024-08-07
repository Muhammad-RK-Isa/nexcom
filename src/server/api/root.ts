import { imagesRouter } from "~/server/api/routers/images"
import { productsRouter } from "~/server/api/routers/products"
import { usersRouter } from "~/server/api/routers/users"
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc"

import { cartsRouter } from "./routers/carts"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  products: productsRouter,
  images: imagesRouter,
  carts: cartsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)

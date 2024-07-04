import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { db } from "~/server/db"
import { carts } from "~/server/db/schema"
import { getCookie } from "cookies-next"
import { eq } from "drizzle-orm"

export const getCart = async () => {
  noStore()
  try {
    const cartId = getCookie("cartId", { cookies })
    if (!cartId) return null
    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
    })
    return cart
  } catch (error) {
    throw error
  }
}

import "server-only"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { db } from "~/server/db"
import { products } from "~/server/db/schema"
import { carts } from "~/server/db/schema/carts"
import { getCookie, setCookie } from "cookies-next"
import { eq } from "drizzle-orm"

import type { CartItem } from "~/types"

export const addToCart = async ({ input }: { input: CartItem }) => {
  try {
    const product = await db.query.products.findFirst({
      columns: {
        inventoryQuantity: true,
      },
      with: {
        variants: true,
      },
      where: eq(products.id, input.productId),
    })

    if (!product) {
      throw new Error("Product not found, please try again.")
    }

    if (product.variants.length > 0 && !input.variantId) {
      throw new Error("This product has variants. Please specify a variantId.")
    }

    const productVariant = product.variants.find(
      (v) => v.id === input.variantId
    )

    const availableQuantity = productVariant
      ? productVariant.inventoryQuantity
      : product.inventoryQuantity

    const maxorderQuantity = Math.min(availableQuantity, 10)

    if (input.quantity > maxorderQuantity) {
      throw new Error(`Maximum order quantity is ${maxorderQuantity}.`)
    }

    if (availableQuantity < input.quantity) {
      throw new Error(`Only ${availableQuantity} item(s) available.`)
    }

    const cartId = getCookie("cartId", { cookies })

    if (!cartId) {
      const rows = await db
        .insert(carts)
        .values({
          items: [input],
        })
        .returning({ insertedId: carts.id })

      if (rows[0]) setCookie("cartId", rows[0].insertedId, { cookies })

      revalidatePath("/")
      return [input]
    }

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
    })

    if (!cart) {
      await db.delete(carts).where(eq(carts.id, cartId))

      const newCart = await db
        .insert(carts)
        .values({
          items: [input],
        })
        .returning({ insertedId: carts.id })

      setCookie("cartId", String(newCart[0]?.insertedId), { cookies })

      revalidatePath("/")
      return [input]
    }

    if (cart.closed) {
      await db.delete(carts).where(eq(carts.id, cartId))

      const newCart = await db
        .insert(carts)
        .values({
          items: [input],
        })
        .returning({ insertedId: carts.id })

      setCookie("cartId", String(newCart[0]?.insertedId), { cookies })

      revalidatePath("/")
      return [input]
    }

    const cartItem = cart.items?.find(
      (item) =>
        item.productId === input.productId && item.variantId === input.variantId
    )

    if (cartItem) {
      const newQuantity = cartItem.quantity + input.quantity

      if (newQuantity > maxorderQuantity) {
        throw new Error(`Maximum order quantity is ${maxorderQuantity}.`)
      }

      cartItem.quantity = newQuantity
    } else {
      cart.items?.push(input)
    }

    await db
      .update(carts)
      .set({
        items: cart.items,
      })
      .where(eq(carts.id, cartId))

    revalidatePath("/")
    return cart.items
  } catch (err) {
    throw err
  }
}

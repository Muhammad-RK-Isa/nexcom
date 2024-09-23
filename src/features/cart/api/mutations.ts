import "server-only"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { TRPCError } from "@trpc/server"
import { db } from "~/server/db"
import { products } from "~/server/db/schema"
import { carts } from "~/server/db/schema/carts"
import { getCookie, setCookie } from "cookies-next"
import { eq } from "drizzle-orm"

import type { CartItem } from "~/types"

export const addToCart = async ({ input }: { input: CartItem }) => {
  const product = await db.query.products.findFirst({
    columns: {
      inventoryQuantity: true,
    },
    with: {
      variants: true,
    },
    where: eq(products.id, input.productId),
  })

  if (!product)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product not found, please try again.",
      cause: "INVALID_PRODUCT_ID",
    })

  if (product.variants.length && !input.variantId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This product has variants. Please specify a variantId.",
      cause: "VARIANT_ID_REQUIRED",
    })
  }

  const specifiedVariant = product.variants.find(
    (v) => v.id === input.variantId
  )

  const availableQuantity = specifiedVariant
    ? specifiedVariant.inventoryQuantity
    : product.inventoryQuantity

  if (input.quantity > availableQuantity) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Only ${availableQuantity} item${availableQuantity > 1 ? "s" : ""} available.`,
      cause: "INVALID_QUANTITY",
    })
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

    if (newQuantity > availableQuantity) {
      throw new Error(
        `Only ${availableQuantity} item${availableQuantity > 1 ? "s" : ""} available.`
      )
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

  return cart.items
}

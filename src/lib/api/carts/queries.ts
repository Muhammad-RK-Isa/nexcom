import "server-only"

import { cookies } from "next/headers"
import { db } from "~/server/db"
import {
  carts,
  images,
  productOptionValues,
  products,
  productsImages,
  productVariants,
  variantsOptionValues,
} from "~/server/db/schema"
import { getCookie } from "cookies-next"
import { eq, sql } from "drizzle-orm"

import type { CartLineItem } from "~/types"

export const getCart = async () => {
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

export const getCartItems = async (): Promise<CartLineItem[]> => {
  try {
    const cartId = getCookie("cartId", { cookies })
    if (!cartId) throw new Error("Cart not found")

    const variantInfo = db
      .select({
        variantId: productVariants.id,
        variantPrice: productVariants.price,
        variantInventoryQuantity: productVariants.inventoryQuantity,
        variantImage: sql<{
          id: string
          name: string
          url: string
          createdAt: Date
          updatedAt: Date | null
        }>`json_build_object(
        'id', ${images.id},
        'name', ${images.name},
        'url', ${images.url},
        'createdAt', ${images.createdAt},
        'updatedAt', ${images.updatedAt}
      )`,
        optionValues: sql<
          { value: string; rank: number }[]
        >`json_agg(json_build_object('value', ${productOptionValues.value}, 'rank', ${productOptionValues.rank}))`,
      })
      .from(productVariants)
      .leftJoin(
        productsImages,
        eq(productsImages.productId, productVariants.id)
      )
      .leftJoin(images, eq(images.id, productsImages.imageId))
      .leftJoin(
        variantsOptionValues,
        eq(variantsOptionValues.variantId, productVariants.id)
      )
      .leftJoin(
        productOptionValues,
        eq(productOptionValues.id, variantsOptionValues.optionValueId)
      )
      .groupBy(
        productVariants.id,
        images.id,
        images.name,
        images.url,
        images.createdAt,
        images.updatedAt
      )
      .as("variant_info")

    // Main query
    const cartItems = await db
      .select({
        quantity: sql<number>`(items->>'quantity')::int`,
        price: products.price,
        id: products.id,
        title: products.title,
        images: sql<
          {
            id: string
            name: string
            url: string
            createdAt: Date
            updatedAt: Date | null
          }[]
        >`json_agg(json_build_object(
        'id', ${images.id},
        'name', ${images.name},
        'url', ${images.url},
        'createdAt', ${images.createdAt},
        'updatedAt', ${images.updatedAt}
      ))`,
        inventory: products.inventoryQuantity,
        variant: sql<{
          price: number
          id: string
          image: {
            id: string
            name: string
            url: string
            createdAt: Date
            updatedAt: Date | null
          }
          inventoryQuantity: number
          optionValues: { value: string; rank: number }[]
        }>`json_build_object(
        'price', ${variantInfo.variantPrice},
        'id', ${variantInfo.variantId},
        'image', ${variantInfo.variantImage},
        'inventoryQuantity', ${variantInfo.variantInventoryQuantity},
        'optionValues', ${variantInfo.optionValues}
      )`,
      })
      .from(carts)
      .where(eq(carts.id, cartId))
      .innerJoin(sql`json_array_elements(${carts.items}) as items`, sql`true`)
      .innerJoin(products, sql`${products.id}::text = items->>'productId'`)
      .leftJoin(productsImages, eq(products.id, productsImages.productId))
      .leftJoin(images, eq(productsImages.imageId, images.id))
      .leftJoin(
        variantInfo,
        sql`${variantInfo.variantId}::text = items->>'variantId'`
      )
      .groupBy(
        sql`(items->>'quantity')::int`,
        products.price,
        products.id,
        products.title,
        products.inventoryQuantity,
        variantInfo.variantPrice,
        variantInfo.variantId,
        variantInfo.variantImage,
        variantInfo.variantInventoryQuantity,
        variantInfo.optionValues
      )
      .execute()

    console.log(cartItems)

    return []
  } catch (error) {
    throw error
  }
}

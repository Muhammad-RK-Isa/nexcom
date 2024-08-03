import "server-only"

import { db } from "~/server/db"
import {
  productOptions,
  productOptionValues,
  products,
  productsImages,
  productVariants,
  variantsOptionValues,
} from "~/server/db/schema"
import { and, eq, inArray, ne } from "drizzle-orm"

import type {
  CreateProductInput,
  ProductId,
  ProductOptionValue,
  UpdateProductInput,
  UpdateProductsStatusInput,
  UpdateProductStatusInput,
} from "~/types"

export const createProduct = async (product: CreateProductInput) => {
  try {
    const p = await db.transaction(async (tx) => {
      const [productRecord] = await tx
        .insert(products)
        .values({
          ...product,
          weight: product.weight.value,
          weightUnit: product.weight.unit,
          length: product.length?.value ?? null,
          lengthUnit: product.length?.unit,
          height: product.height?.value ?? null,
          heightUnit: product.height?.unit,
          width: product.width?.value ?? null,
          widthUnit: product.width?.unit,
        })
        .returning()

      if (productRecord) {
        product.images?.map(
          async (image) =>
            await tx.insert(productsImages).values({
              imageId: image.id,
              productId: productRecord.id,
              rank: product.images?.findIndex((i) => i.id === image.id),
            })
        )

        for (const option of product.options) {
          const [newOption] = await tx
            .insert(productOptions)
            .values({
              title: option.title,
              id: option.id,
              rank: option.rank,
              productId: productRecord.id,
            })
            .returning()

          if (newOption)
            for (const value of option.values) {
              await tx.insert(productOptionValues).values({
                ...value,
                optionId: newOption.id,
              })
            }
        }
        return productRecord
      }
    })
    return { product: p }
  } catch (err) {
    throw err
  }
}

export const updateProduct = async (product: UpdateProductInput) => {
  try {
    return true
  } catch (err) {
    throw err
  }
}

export const updateProductStatus = async ({
  id,
  status,
}: UpdateProductStatusInput) => {
  try {
    const [p] = await db
      .update(products)
      .set({ status })
      .where(eq(products.id, id))
      .returning()
    return p
  } catch (err) {
    throw err
  }
}

export const updateProductsStatus = async ({
  status,
  productIds,
}: UpdateProductsStatusInput) => {
  if (productIds.length < 1)
    throw new Error(
      "At least one product must be selected to perform this action"
    )
  try {
    const result = await db
      .update(products)
      .set({ status })
      .where(
        inArray(
          products.id,
          productIds.map(({ id }) => id)
        )
      )
    return result
  } catch (err) {
    throw err
  }
}

export const deleteProduct = async ({ id }: ProductId) => {
  try {
    const [p] = await db.delete(products).where(eq(products.id, id)).returning()
    return p
  } catch (err) {
    throw err
  }
}

export const deleteProducts = async (ids: ProductId[]) => {
  const productIdArray = ids.map(({ id }) => id)
  try {
    const rows = await db
      .delete(products)
      .where(inArray(products.id, productIdArray))
      .returning()
    return rows
  } catch (error) {
    throw error
  }
}

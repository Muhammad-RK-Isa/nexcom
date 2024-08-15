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
import { eq, inArray } from "drizzle-orm"

import type {
  CreateProductInput,
  ProductId,
  UpdateProductsStatusInput,
  UpdateProductStatusInput,
} from "~/types"

export const createProduct = async (product: CreateProductInput) => {
  try {
    const productWithRelations = await db.transaction(async (tx) => {
      // Insert product general information
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

      if (!productRecord) throw new Error("Failed to create product")

      const productId = productRecord.id

      // Insert product images
      const images = await Promise.all(
        product.images?.map(
          async (image) =>
            await tx
              .insert(productsImages)
              .values({
                imageId: image.id,
                productId,
                rank: product.images?.findIndex((i) => i.id === image.id),
              })
              .returning()
        ) || []
      )

      // Insert options and their values
      const optionsWithValues = await Promise.all(
        product.options.map(async (option) => {
          const [newOption] = await tx
            .insert(productOptions)
            .values({
              id: option.id,
              title: option.title,
              rank: option.rank,
              productId,
            })
            .returning()

          if (!newOption) throw new Error("Failed to create product option")

          const optionValues = await Promise.all(
            option.values.map(async (value) => {
              const [newValue] = await tx
                .insert(productOptionValues)
                .values({
                  ...value,
                  optionId: newOption.id,
                })
                .returning()
              return newValue
            })
          )

          return {
            ...newOption,
            values: optionValues,
          }
        })
      )

      // Insert variants and their options
      const variantsWithOptions = await Promise.all(
        product.variants.map(async (variant) => {
          const [v] = await tx
            .insert(productVariants)
            .values({
              ...variant,
              productId,
              imageId: variant.image?.id,
              weight: variant.weight.value,
              weightUnit: variant.weight.unit,
              length: variant.length?.value ?? null,
              lengthUnit: variant.length?.unit,
              height: variant.height?.value ?? null,
              heightUnit: variant.height?.unit,
              width: variant.width?.value ?? null,
              widthUnit: variant.width?.unit,
            })
            .returning()

          if (!v) throw new Error("Failed to create product variant")

          const variantOptions = await Promise.all(
            variant.options.map(async (option) => {
              const valueId = Object.values(option)[0]
              if (valueId) {
                await tx.insert(variantsOptionValues).values({
                  variantId: v.id,
                  optionValueId: valueId,
                })
              }
              return { optionId: Object.keys(option)[0], valueId }
            })
          )

          return {
            ...v,
            options: variantOptions,
          }
        })
      )

      return {
        ...productRecord,
        images,
        options: optionsWithValues,
        variants: variantsWithOptions,
      }
    })

    return { product: productWithRelations }
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

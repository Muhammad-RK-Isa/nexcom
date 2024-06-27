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
    const [existingRow] = await db
      .select()
      .from(products)
      .where(eq(products.title, product.title))
    if (existingRow) throw new Error("Existing product")

    const p = await db.transaction(async (tx) => {
      const [productRecord] = await tx
        .insert(products)
        .values({
          ...product,
          weight: product.weight.value,
          weightUnit: product.weight.unit,
          length: product.length?.value,
          lengthUnit: product.length?.unit,
          height: product.height?.value,
          heightUnit: product.height?.unit,
        })
        .returning()

      if (productRecord) {
        product.images?.map(
          async (image) =>
            await tx.insert(productsImages).values({
              imageId: image.id,
              productId: productRecord.id,
              isThumbnail:
                product.images?.findIndex((i) => i.id === image.id) === 0,
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

        for (const variant of product.variants) {
          const [variantRecord] = await tx
            .insert(productVariants)
            .values({
              id: variant.id,
              price: variant.price,
              inventoryQuantity: variant.inventoryQuantity,
              productId: productRecord.id,
              imageId: variant.image?.id,
            })
            .returning()

          if (variantRecord && variant.optionValues) {
            for (const optionValue of variant.optionValues) {
              await tx.insert(variantsOptionValues).values({
                variantId: variantRecord.id,
                optionValueId: optionValue.id,
              })
            }
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
    const [existingRow] = await db
      .select()
      .from(products)
      .where(
        and(eq(products.title, product.title), ne(products.id, product.id!))
      )

    if (existingRow) throw new Error("Existing product")

    const p = await db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({
          ...product,
          weight: product.weight.value,
          weightUnit: product.weight.unit,
          length: product.length?.value,
          lengthUnit: product.length?.unit,
          height: product.height?.value,
          heightUnit: product.height?.unit,
        })
        .where(eq(products.id, product.id))

      const productRecord = await tx.query.products.findFirst({
        where: (t, { eq }) => eq(t.id, product.id),
        with: {
          options: true,
          variants: true,
        },
      })

      await tx
        .delete(productsImages)
        .where(eq(productsImages.productId, product.id))

      await Promise.all(
        product.images?.map(async (image) => {
          await tx.insert(productsImages).values({
            imageId: image.id,
            productId: product.id,
            isThumbnail:
              product.images?.findIndex((i) => i.id === image.id) === 0,
            rank: product.images?.findIndex((i) => i.id === image.id),
          })
        }) ?? []
      )

      const optionValueRecords = await tx.query.productOptionValues.findMany({
        where: (t, { inArray }) =>
          inArray(t.optionId, [
            ...(productRecord?.options.map(({ id }) => id) ?? []),
          ]),
        with: {
          option: true,
        },
      })

      if (productRecord) {
        const updatableOptions = product.options.filter(({ id, title, rank }) =>
          productRecord.options.some(
            (o) => o.id === id && o.title === title && o.rank === rank
          )
        )

        const updatableOptionValues = new Set<ProductOptionValue>()
        product.options.forEach(({ values }) => {
          values.forEach((v) => {
            if (
              optionValueRecords.some(
                ({ id, value }) => v.id === id && v.value === value
              )
            ) {
              updatableOptionValues.add(v)
            }
          })
        })

        const updatableVariants = product.variants.filter(
          ({ id, price, inventoryQuantity, image }) =>
            productRecord.variants.some(
              (v) =>
                v.id === id &&
                v.price === price &&
                v.inventoryQuantity === inventoryQuantity &&
                v.imageId === image?.id
            )
        )

        if (
          updatableOptions.length === product.options.length &&
          updatableOptionValues.size === optionValueRecords.length &&
          updatableVariants.length === product.variants.length
        ) {
          console.log("✅ Updatable. Updating...")
          for (const option of updatableOptions) {
            await tx
              .update(productOptions)
              .set({
                title: option.title,
                rank: option.rank,
                productId: productRecord.id,
              })
              .where(eq(productOptions.id, option.id))
              .returning()
          }

          for (const optVal of updatableOptionValues) {
            await tx
              .update(productOptionValues)
              .set(optVal)
              .where(eq(productOptionValues.id, optVal.id))
          }

          for (const variant of updatableVariants) {
            await tx
              .update(productVariants)
              .set({
                price: variant.price,
                inventoryQuantity: variant.inventoryQuantity,
                imageId: variant.image?.id,
                productId: variant.productId,
              })
              .where(eq(productVariants.id, variant.id!))
          }
          return
        }

        console.log("❌ Not Updatable. Recreating everything...")
        await tx.delete(productOptions).where(
          inArray(
            productOptions.id,
            productRecord.options.map(({ id }) => id)
          )
        )

        await tx.delete(productOptionValues).where(
          inArray(
            productOptionValues.id,
            optionValueRecords.map(({ id }) => id)
          )
        )

        await tx
          .delete(productVariants)
          .where(eq(productVariants.productId, productRecord.id))

        for (const option of product.options) {
          const [newOption] = await tx
            .insert(productOptions)
            .values({
              title: option.title,
              id: option.id,
              rank: option.rank,
              productId: productRecord.id,
            })
            .onConflictDoUpdate({
              target: [productOptions.id],
              set: {
                title: option.title,
                rank: option.rank,
                productId: productRecord.id,
              },
            })
            .returning()

          if (newOption) {
            await Promise.all(
              option.values.map((value) =>
                tx
                  .insert(productOptionValues)
                  .values({
                    ...value,
                    optionId: newOption.id,
                  })
                  .onConflictDoUpdate({
                    target: [productOptionValues.id],
                    set: value,
                  })
              )
            )
          }
        }

        console.log("📦 Variants", product.variants)
        for (const variant of product.variants) {
          const [variantRecord] = await tx
            .insert(productVariants)
            .values({
              id: variant.id,
              price: variant.price,
              inventoryQuantity: variant.inventoryQuantity,
              imageId: variant.image?.id,
              productId: productRecord.id,
            })
            .onConflictDoUpdate({
              target: [productVariants.id],
              set: {
                price: variant.price,
                inventoryQuantity: variant.inventoryQuantity,
                imageId: variant.image?.id,
                productId: productRecord.id,
              },
            })
            .returning()

          if (variantRecord && variant.optionValues) {
            await Promise.all(
              variant.optionValues.map((optionValue) =>
                tx
                  .insert(variantsOptionValues)
                  .values({
                    variantId: variantRecord.id,
                    optionValueId: optionValue.id,
                  })
                  .onConflictDoUpdate({
                    target: [
                      variantsOptionValues.variantId,
                      variantsOptionValues.optionValueId,
                    ],
                    set: {
                      variantId: variantRecord.id,
                      optionValueId: optionValue.id,
                    },
                  })
              )
            )
          }
        }
        return productRecord
      }
    })

    return p
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

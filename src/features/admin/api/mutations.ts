import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { TRPCError } from "@trpc/server"
import { db } from "~/server/db"
import {
  productOptions,
  productOptionValues,
  products,
  productsImages,
  productVariants,
  variantsOptionValues,
} from "~/server/db/schema"
import { and, eq, notInArray, sql } from "drizzle-orm"

import type { InsertProductInput, UpdateProductInput } from "~/types"
import { isPostgresError } from "~/lib/utils"

export const createProduct = async (product: InsertProductInput) => {
  noStore()
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

      if (!productRecord)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create product",
        })

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

          if (!newOption)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Failed to create product option",
            })

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
              weight: variant.weight?.value,
              weightUnit: variant.weight?.unit,
              length: variant.length?.value,
              lengthUnit: variant.length?.unit,
              height: variant.height?.value,
              heightUnit: variant.height?.unit,
              width: variant.width?.value,
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
  } catch (error) {
    if (isPostgresError(error) && error.code === "23505") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A product with the same slug already exists",
        cause: "DUPLICATE_SLUG",
      })
    }
    throw error
  }
}

export const updateProduct = async (product: UpdateProductInput) => {
  noStore()
  try {
    if (!product.id)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Product id is required",
      })
    const updatedProductWithRelations = await db.transaction(async (tx) => {
      const [productRecord] = await tx
        .update(products)
        .set({
          title: product.title,
          slug: product.slug,
          metaTitle: product.metaTitle,
          content: product.content,
          description: product.description,
          price: product.price,
          mrp: product.mrp,
          manageInventory: product.manageInventory,
          allowBackorder: product.allowBackorder,
          inventoryQuantity: product.inventoryQuantity,
          weight: product.weight.value,
          weightUnit: product.weight.unit,
          length: product.length?.value,
          height: product.height?.value,
          heightUnit: product.height?.unit,
          width: product.width?.value,
          widthUnit: product.width?.unit,
          status: product.status,
          originCountry: product.originCountry,
          material: product.material,
        })
        .where(eq(products.id, product.id!))
        .returning()

      if (!productRecord) throw new TRPCError({ code: "NOT_FOUND" })

      const productId = productRecord.id

      if (product.images.length) {
        // Delete product images that are not in the input array
        await tx.delete(productsImages).where(
          and(
            eq(productsImages.productId, productId),
            notInArray(
              productsImages.imageId,
              product.images.map((image) => image.id)
            )
          )
        )
      }

      // Upsert existing product images
      const upsertedImages = await Promise.all(
        product.images.map(async (image) => {
          const [imageRecord] = await tx
            .insert(productsImages)
            .values({
              imageId: image.id,
              productId,
              rank: product.images.findIndex((i) => i.id === image.id),
            })
            .onConflictDoUpdate({
              target: [productsImages.productId, productsImages.imageId],
              set: {
                rank: sql`excluded.rank`,
              },
            })
            .returning()

          return imageRecord
        })
      )

      if (product.options.length) {
        // Delete product options that are not in the input array
        await tx.delete(productOptions).where(
          and(
            eq(productOptions.productId, productId),
            notInArray(
              productOptions.id,
              product.options.map((option) => option.id)
            )
          )
        )

        // Upsert product options
        const upsertedOptions = await Promise.all(
          product.options.map(async (option) => {
            const [optionRecord] = await tx
              .insert(productOptions)
              .values({
                id: option.id,
                title: option.title,
                rank: option.rank,
                productId,
              })
              .onConflictDoUpdate({
                target: productOptions.id,
                set: {
                  title: option.title,
                  rank: option.rank,
                  productId,
                },
              })
              .returning()

            if (!optionRecord)
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Failed to update product option",
                cause: "Invalid option id",
              })

            await tx.delete(productOptionValues).where(
              and(
                eq(productOptionValues.optionId, optionRecord.id),
                notInArray(
                  productOptionValues.value,
                  option.values.map((value) => value.value)
                )
              )
            )

            const optionValues = await Promise.all(
              option.values.map(async (value) => {
                const [newValue] = await tx
                  .insert(productOptionValues)
                  .values({
                    id: value.id,
                    optionId: optionRecord.id,
                    value: value.value,
                  })
                  .onConflictDoUpdate({
                    target: productOptionValues.id,
                    set: {
                      value: sql`excluded.value`,
                    },
                  })
                  .returning()
                return newValue
              })
            )

            return {
              ...optionRecord,
              values: optionValues,
            }
          })
        )

        // Delete product variants that are not in the input array
        await tx.delete(productVariants).where(
          product.variants.length
            ? and(
                eq(productVariants.productId, productId),
                notInArray(
                  productVariants.id,
                  product.variants.map((variant) => variant.id)
                )
              )
            : eq(productVariants.productId, productId)
        )

        // Upsert product_variants
        const upsertedVariants = [
          await Promise.all(
            product.variants.map(async (variant) => {
              const [v] = await tx
                .insert(productVariants)
                .values({
                  ...variant,
                  productId,
                  imageId: variant.image?.id,
                  weight: variant.weight?.value,
                  weightUnit: variant.weight?.unit,
                  length: variant.length?.value ?? null,
                  lengthUnit: variant.length?.unit,
                  height: variant.height?.value ?? null,
                  heightUnit: variant.height?.unit,
                  width: variant.width?.value ?? null,
                  widthUnit: variant.width?.unit,
                })
                .onConflictDoUpdate({
                  target: productVariants.id,
                  set: {
                    ...variant,
                    productId,
                    imageId: variant.image?.id,
                    weight: variant.weight?.value,
                    weightUnit: variant.weight?.unit,
                    length: variant.length?.value ?? null,
                    lengthUnit: variant.length?.unit,
                    height: variant.height?.value ?? null,
                    heightUnit: variant.height?.unit,
                    width: variant.width?.value ?? null,
                    widthUnit: variant.width?.unit,
                  },
                })
                .returning()

              if (!v) throw new Error("Failed to update product variant")

              // Delete variants_option_values
              await tx.delete(variantsOptionValues).where(
                and(
                  eq(variantsOptionValues.variantId, v.id),
                  notInArray(
                    variantsOptionValues.optionValueId,
                    variant.options
                      .map(
                        (optionValueRecord) =>
                          Object.values(optionValueRecord)[0]
                      )
                      .filter((id): id is string => id !== undefined)
                  )
                )
              )

              const variantOptions = await Promise.all(
                variant.options.map(async (option) => {
                  const valueId = Object.values(option)[0]
                  if (valueId) {
                    await tx
                      .insert(variantsOptionValues)
                      .values({
                        variantId: v.id,
                        optionValueId: valueId,
                      })
                      .onConflictDoUpdate({
                        target: [
                          variantsOptionValues.variantId,
                          variantsOptionValues.optionValueId,
                        ],
                        set: {
                          optionValueId: valueId,
                        },
                      })
                      .returning()
                  }
                  return { optionId: Object.keys(option)[0], valueId }
                })
              )

              return {
                ...v,
                options: variantOptions,
              }
            })
          ),
        ]
        // const upsertedVariants = await Promise.all(
        //   product.variants.map(async (variant) => {
        //     const [v] = await tx
        //       .insert(productVariants)
        //       .values({
        //         ...variant,
        //         productId,
        //         imageId: variant.image?.id,
        //         weight: variant.weight?.value,
        //         weightUnit: variant.weight?.unit,
        //         length: variant.length?.value ?? null,
        //         lengthUnit: variant.length?.unit,
        //         height: variant.height?.value ?? null,
        //         heightUnit: variant.height?.unit,
        //         width: variant.width?.value ?? null,
        //         widthUnit: variant.width?.unit,
        //       })
        //       .onConflictDoUpdate({
        //         target: productVariants.id,
        //         set: {
        //           ...variant,
        //           productId,
        //           imageId: variant.image?.id,
        //           weight: variant.weight?.value,
        //           weightUnit: variant.weight?.unit,
        //           length: variant.length?.value ?? null,
        //           lengthUnit: variant.length?.unit,
        //           height: variant.height?.value ?? null,
        //           heightUnit: variant.height?.unit,
        //           width: variant.width?.value ?? null,
        //           widthUnit: variant.width?.unit,
        //         }
        //       })
        //       .returning()

        //     if (!v) throw new Error("Failed to update product variant")

        //     // Delete variants_option_values
        //     await tx.delete(variantsOptionValues).where(
        //       and(
        //         eq(variantsOptionValues.variantId, v.id),
        //         notInArray(
        //           variantsOptionValues.optionValueId,
        //           variant.options.map((optionValueRecord) =>
        //             Object.values(optionValueRecord)[0]).filter((id) => id !== undefined
        //             )
        //         )
        //       )
        //     )

        //     const variantOptions = await Promise.all(
        //       variant.options.map(async (option) => {
        //         const valueId = Object.values(option)[0]
        //         if (valueId) {
        //           await tx
        //             .insert(variantsOptionValues)
        //             .values({
        //               variantId: v.id,
        //               optionValueId: valueId,
        //             })
        //             .onConflictDoUpdate({
        //               target: [variantsOptionValues.variantId, variantsOptionValues.optionValueId],
        //               set: {
        //                 optionValueId: valueId,
        //               }
        //             })
        //             .returning()
        //         }
        //         return { optionId: Object.keys(option)[0], valueId }
        //       })
        //     )

        //     return {
        //       ...v,
        //       options: variantOptions,
        //     }
        //   })
        // )

        return {
          ...productRecord,
          images: upsertedImages,
          options: upsertedOptions,
          variants: upsertedVariants,
        }
      }

      return {
        ...productRecord,
        options: [],
        variants: [],
        images: upsertedImages,
      }
    })
    return { product: updatedProductWithRelations }
  } catch (error) {
    console.log(error)
    if (isPostgresError(error) && error.code === "23505") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A product with the same slug already exists",
        cause: "DUPLICATE_SLUG",
      })
    }
    throw error
  }
}

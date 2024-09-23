import "server-only"

import { TRPCError } from "@trpc/server"
import { db } from "~/server/db"
import { products } from "~/server/db/schema"
import { and, asc, count, desc, eq, sql } from "drizzle-orm"

import type { FilterProductParams, ProductEntity, ProductSlug } from "~/types"

export const getFilteredProducts = async (input: FilterProductParams) => {
  try {
    const { page, per_page, sort, title } = input

    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ProductEntity | undefined, "asc" | "desc" | undefined]

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const dbProducts = await tx
        .select()
        .from(products)
        .limit(per_page)
        .offset(offset)
        .where(
          and(
            title
              ? sql`to_tsvector('english', ${products.title}) @@ to_tsquery('english', ${title})`
              : undefined,
            eq(products.status, "active")
          )
        )
        .orderBy(
          column && column in products
            ? order === "asc"
              ? asc(products[column])
              : desc(products[column])
            : desc(products.id)
        )

      const productImages = await tx.query.productsImages.findMany({
        where: (t, { inArray, and }) =>
          and(
            inArray(
              t.productId,
              dbProducts.map(({ id }) => id)
            )
          ),
        with: {
          image: true,
        },
      })

      const data = dbProducts.map((product) => ({
        ...product,
        images: productImages
          .filter(({ productId }) => productId === product.id)
          .map(({ rank, image }) => ({
            rank,
            ...image,
          })),
      }))

      const total = await tx
        .select({
          count: count(),
        })
        .from(products)
        .where(
          title
            ? sql`to_tsvector('english', ${products.title}) @@ to_tsquery('english', ${title})`
            : undefined
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { data: [], pageCount: 0 }
  }
}

export const getPublicProduct = async ({ slug }: ProductSlug) => {
  const product = await db.query.products.findFirst({
    where: (t, { eq }) => eq(t.slug, slug),
    with: {
      options: {
        with: {
          values: true,
        },
      },
      variants: {
        with: {
          variantsOptionValues: {
            with: {
              optionValue: true,
            },
          },
          image: true,
        },
      },
      productImages: {
        with: {
          image: true,
        },
      },
    },
  })

  if (!product)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product not found",
      cause: "Invalid product slug",
    })

  const variants = product?.variants
    .map((variant) => ({
      ...variant,
      optionValues:
        product?.variants
          ?.find((v) => v.id === variant.id)
          ?.variantsOptionValues.map((vOptVals) => vOptVals.optionValue) || [],
    }))
    .map((v) => ({
      id: v.id,
      title: v.title,
      optionValues: v.optionValues,
      image: v.image,
      price: v.price,
      material: v.material,
      originCountry: v.originCountry,
      manageInventory: v.manageInventory,
      allowBackorder: v.allowBackorder,
      inventoryQuantity: v.inventoryQuantity,
      weight: {
        value: v.weight,
        unit: v.weightUnit,
      },
      length: {
        value: v.length,
        unit: v.lengthUnit,
      },
      height: {
        value: v.height,
        unit: v.heightUnit,
      },
      width: {
        value: v.width,
        unit: v.widthUnit,
      },
    }))

  const options = product?.options
    .sort((a, b) => a.rank - b.rank)
    .map((opt) => ({
      ...opt,
      values: opt.values.sort((a, b) => a.rank - b.rank),
    }))

  let images = product?.productImages.map(({ image, rank }) => ({
    rank,
    ...image,
  }))

  product.variants.map((v) => {
    const existingImage = images.find((img) => img.id === v.image?.id)
    if (!existingImage && v.image !== null)
      images.push({ ...v.image, rank: images.length + 1 })
  })

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    slug: product.slug,
    price: product.price,
    mrp: product.mrp,
    vendor: product.vendor,
    originCountry: product.originCountry,
    metaTitle: product.metaTitle,
    content: product.content,
    status: product.status,
    manageInventory: product.manageInventory,
    allowBackorder: product.allowBackorder,
    inventoryQuantity: product.inventoryQuantity,
    weight: {
      value: product?.weight,
      unit: product?.weightUnit,
    },
    length: {
      value: product?.length ?? null,
      unit: product?.lengthUnit,
    },
    height: {
      value: product?.height ?? null,
      unit: product?.heightUnit,
    },
    width: {
      value: product?.width ?? null,
      unit: product?.widthUnit,
    },
    variants,
    options,
    images,
  }
}

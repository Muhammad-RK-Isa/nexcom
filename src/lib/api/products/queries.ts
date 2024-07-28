import "server-only"

import { db } from "~/server/db"
import { products } from "~/server/db/schema"
import { and, asc, count, desc, gte, lte, or, sql, type SQL } from "drizzle-orm"

import type {
  DrizzleWhere,
  Product,
  ProductId,
  ProductSlug,
  SearchProductParams,
  TableProductsParams,
} from "~/types"
import { filterColumn } from "~/lib/filter-column"

export const getProducts = async (input: SearchProductParams) => {
  const { page, per_page, sort, title, bestSelling, featured } = input

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Product | undefined, "asc" | "desc" | undefined]

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const dbProducts = await tx
        .select()
        .from(products)
        .limit(per_page)
        .offset(offset)
        .where(
          title
            ? sql`to_tsvector('english', ${products.title}) @@ to_tsquery('english', ${title})`
            : undefined
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
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

export const getProductById = async ({ id }: ProductId) => {
  const product = await db.query.products.findFirst({
    where: (t, { eq }) => eq(t.id, id),
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

  if (!product) return null

  const options = product?.options
    .sort((a, b) => a.rank - b.rank)
    .map((opt) => ({
      ...opt,
      values: opt.values.sort((a, b) => a.rank - b.rank),
    }))

  const images = product?.productImages.map(({ image, rank }) => ({
    rank,
    ...image,
  }))

  const variants = product?.variants.map((variant) => ({
    ...variant,
    optionValues: product?.variants
      ?.find((v) => v.id === variant.id)
      ?.variantsOptionValues.map((vOptVals) => vOptVals.optionValue),
  }))

  const { productImages, ...productWithoutImages } = product

  return {
    ...productWithoutImages,
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
    options,
    images,
    variants,
  }
}

export const getProductBySlug = async ({ slug }: ProductSlug) => {
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

  if (!product) return null

  const variants = product?.variants.map((variant) => ({
    ...variant,
    optionValues: product?.variants
      ?.find((v) => v.id === variant.id)
      ?.variantsOptionValues.map((vOptVals) => vOptVals.optionValue),
  }))

  const options = product?.options
    .sort((a, b) => a.rank - b.rank)
    .map((opt) => ({
      ...opt,
      values: opt.values.sort((a, b) => a.rank - b.rank),
    }))

  const images = product?.productImages.map(({ image, rank }) => ({
    rank,
    ...image,
  }))

  const { productImages, ...productWithoutImages } = product

  return {
    ...productWithoutImages,
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
    variants,
    options,
    images,
  }
}

export async function getTableProducts(input: TableProductsParams) {
  const { page, per_page, sort, title, status, operator, from, to } = input

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Product | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to Date objects
    const fromDay = from ? new Date(from) : undefined
    const toDay = to ? new Date(to) : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      title
        ? filterColumn({
            column: products.title,
            value: title,
          })
        : undefined,
      // Filter tasks by status
      !!status
        ? filterColumn({
            column: products.status,
            value: status,
            isSelectable: true,
          })
        : undefined,
      // Filter by createdAt
      fromDay && toDay
        ? and(gte(products.createdAt, fromDay), lte(products.createdAt, toDay))
        : undefined,
    ]
    const where: DrizzleWhere<Product> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const dbProducts = await tx
        .select()
        .from(products)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in products
            ? order === "asc"
              ? asc(products[column])
              : desc(products[column])
            : desc(products.id)
        )

      const productImages = await tx.query.productsImages.findMany({
        where: (t, { inArray, and, eq }) =>
          and(
            inArray(
              t.productId,
              dbProducts.map(({ id }) => id)
            ),
            eq(t.rank, 0)
          ),
        with: {
          image: true,
        },
      })

      const data = dbProducts.map((product) => ({
        ...product,
        thumbnailImage: productImages.find(
          ({ productId }) => productId === product.id
        )?.image,
      }))

      const total = await tx
        .select({
          count: count(),
        })
        .from(products)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

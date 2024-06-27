import "server-only"

import { db } from "~/server/db"
import { products } from "~/server/db/schema"
import { and, asc, count, desc, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "~/lib/filter-column"
import type {
  DrizzleWhere,
  Product,
  ProductId,
  TableProductsParams,
} from "~/types"

export const getProducts = async () => {
  const rows = await db.select().from(products)
  return rows
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

  const images = product?.productImages.map(({ image, rank, isThumbnail }) => ({
    rank,
    isThumbnail,
    ...image,
  }))

  return {
    ...product,
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
            eq(t.isThumbnail, true)
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

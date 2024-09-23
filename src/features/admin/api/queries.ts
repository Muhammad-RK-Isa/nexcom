import "server-only"

import { TRPCError } from "@trpc/server"
import type { TableProductsParams } from "~/features/admin/types"
import { db } from "~/server/db"
import { products } from "~/server/db/schema"
import { and, asc, count, desc, gte, lte, or, type SQL } from "drizzle-orm"

import type { DrizzleWhere, ProductEntity, ProductId } from "~/types"
import { filterColumn } from "~/lib/filter-column"

export const getEditableProduct = async ({ id }: ProductId) => {
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

  if (!product)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product not found",
      cause: "Invalid product id",
    })

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
    id: variant.id,
    title: variant.title,
    options: variant.variantsOptionValues.map((vOptVals) => {
      return { [vOptVals.optionValue.optionId]: vOptVals.optionValue.id }
    }),
    image: variant.image,
    price: variant.price,
    material: variant.material,
    originCountry: variant.originCountry,
    manageInventory: variant.manageInventory,
    allowBackorder: variant.allowBackorder,
    inventoryQuantity: variant.inventoryQuantity,
    weight: {
      value: variant.weight,
      unit: variant.weightUnit,
    },
    length: {
      value: variant.length,
      unit: variant.lengthUnit,
    },
    height: {
      value: variant.height,
      unit: variant.heightUnit,
    },
    width: {
      value: variant.width,
      unit: variant.widthUnit,
    },
  }))

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    content: product.content,
    price: product.price,
    mrp: product.mrp,
    material: product.material,
    vendor: product.vendor,
    originCountry: product.originCountry,
    metaTitle: product.metaTitle,
    description: product.description,
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
    status: product.status,
    options,
    images,
    variants,
  }
}

export async function getTableProducts(input: TableProductsParams) {
  try {
    const { page, per_page, sort, title, status, operator, from, to } = input

    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ProductEntity | undefined, "asc" | "desc" | undefined]

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
    const where: DrizzleWhere<ProductEntity> =
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
    return {
      data: data,
      pageCount: pageCount,
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return { data: [], total: 0 }
  }
}

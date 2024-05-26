import { filterColumn } from "~/lib/filter-column";
import { and, gte, lte, or, eq, type SQL, asc, desc, count } from "drizzle-orm";

import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import type {
  TableProduct,
  DrizzleWhere,
  ProductId,
  TableProductsParams,
} from "~/types";

export const getProducts = async () => {
  const rows = await db.select().from(products);
  return rows;
};

export const getProductById = async ({ id }: ProductId) => {
  const [row] = await db.select().from(products).where(eq(products.id, id));
  return row;
};

export async function getTableProducts(input: TableProductsParams) {
  const { page, per_page, sort, title, status, operator, from, to } = input;

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page;
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof TableProduct | undefined, "asc" | "desc" | undefined];

    // Convert the date strings to Date objects
    const fromDay = from ? new Date(from) : undefined;
    const toDay = to ? new Date(to) : undefined;

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
    ];
    const where: DrizzleWhere<TableProduct> =
      !operator || operator === "and"
        ? and(...expressions)
        : or(...expressions);

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
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
            : desc(products.id),
        );

      const total = await tx
        .select({
          count: count(),
        })
        .from(products)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0);

      return {
        data,
        total,
      };
    });

    const pageCount = Math.ceil(total / per_page);
    return { data, pageCount };
  } catch (err) {
    return { data: [], pageCount: 0 };
  }
}

export async function getTaskCountByStatus() {
  try {
    return await db
      .select({
        status: products.status,
        count: count(),
      })
      .from(products)
      .groupBy(products.status)
      .execute();
  } catch (err) {
    return [];
  }
}

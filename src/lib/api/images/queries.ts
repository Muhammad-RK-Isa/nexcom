import "server-only";

import { type SQL, and, asc, count, desc, gte, lte, or } from "drizzle-orm";

import { db } from "~/server/db";
import { filterColumn } from "~/lib/filter-column";
import { images } from "~/server/db/schema";
import type {
  DrizzleWhere,
  ImageId,
  TableImage,
  TableImageParams,
} from "~/types";

export const getAllImages = async () => {
  const rows = await db.select().from(images);
  return rows;
};

export const getImageById = async ({ id }: ImageId) => {
  const image = await db.query.images.findFirst({
    where: (t, { eq }) => eq(t.id, id),
  });
  return image;
};

export const getTableImages = async (input: TableImageParams) => {
  const { page, per_page, sort, name, from, to, operator } = input;

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page;
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "name.desc" => ["name", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof TableImage | undefined, "asc" | "desc" | undefined];

    // Convert the date strings to Date objects
    const fromDay = from ? new Date(from) : undefined;
    const toDay = to ? new Date(to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      name
        ? filterColumn({
            column: images.name,
            value: name,
          })
        : undefined,
      // Filter tasks by status
      !!fromDay && !!toDay
        ? and(gte(images.createdAt, fromDay), lte(images.createdAt, toDay))
        : undefined,
    ];
    const where: DrizzleWhere<TableImage> =
      !operator || operator === "and"
        ? and(...expressions)
        : or(...expressions);

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(images)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in images
            ? order === "asc"
              ? asc(images[column])
              : desc(images[column])
            : desc(images.id),
        );

      const total = await tx
        .select({
          count: count(),
        })
        .from(images)
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
};

import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { generateId } from "~/lib/utils";

const pgProductStatus = pgEnum("productStatus", ["active", "draft"]);
const categoryEnum = pgEnum("category", ["Apparel", ""]);

export const products = pgTable("products", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId({ prefix: "PRODUCTS" })),
  title: text("title"),
  description: text("description"),
  status: pgProductStatus("status").default("draft"),
  category: categoryEnum("category"),
  vendor: text("vendor"),
  collection: text("collection"),
  tags: text("tags")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
});

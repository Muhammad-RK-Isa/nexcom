import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

import { products } from "./products";
import { images } from "./images";
import { generateId } from "~/lib/utils";

export const productsImages = pgTable(
  "products_images",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId({ prefix: "pdimg" })),
    productId: varchar("product_id", { length: 255 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    imageId: varchar("image_id", { length: 255 })
      .notNull()
      .references(() => images.id, { onDelete: "cascade" }),
    isThumbnail: boolean("is_thumbnail").notNull().default(false),
    rank: integer("rank"),
  },
  (t) => ({
    uniqueThumbnail: unique("unique_thumbnail_constraint").on(
      t.productId,
      t.isThumbnail,
    ),
  }),
);

export const productsImagesRelations = relations(productsImages, ({ one }) => ({
  product: one(products, {
    fields: [productsImages.productId],
    references: [products.id],
  }),
  image: one(images, {
    fields: [productsImages.imageId],
    references: [images.id],
  }),
}));

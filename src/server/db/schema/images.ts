import { relations } from "drizzle-orm";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { productsImages } from "./products-images";

export const images = pgTable("images", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  url: varchar("url", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const imagesRelations = relations(images, ({ many }) => ({
  productsImages: many(productsImages),
}));

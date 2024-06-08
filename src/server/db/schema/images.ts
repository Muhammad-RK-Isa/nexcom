import { relations } from "drizzle-orm";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";

import { productsImages } from "./products-images";

export const images = pgTable("images", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export const imagesRelations = relations(images, ({ many }) => ({
  productsImages: many(productsImages),
}));

export const searchImageParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

export const baseImageSchema = createSelectSchema(images);

export const insertImageSchema = baseImageSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const imageIdSchema = baseImageSchema.pick({ id: true });

export const updateImageSchema = z.object({
  id: imageIdSchema,
  title: z.string().min(1, { message: "Please enter a title" }),
  description: z.string().optional(),
  url: z.string().min(1, { message: "Please enter a url" }),
  isThumbnail: z.boolean().optional().default(false),
});

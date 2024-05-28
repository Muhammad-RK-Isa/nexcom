import {
  type SQLChunk,
  and,
  eq,
  inArray,
  ne,
  sql,
  type SQL,
} from "drizzle-orm";

import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import type {
  CreateProductInput,
  ProductId,
  UpdateProductInput,
  UpdateProductStatusInput,
  UpdateProductsStatusInput,
} from "~/types";

export const createProduct = async (product: CreateProductInput) => {
  try {
    const [existingRow] = await db
      .select()
      .from(products)
      .where(eq(products.title, product.title));
    if (existingRow) throw new Error("Existing product");

    const [p] = await db.insert(products).values(product).returning();
    return { product: p };
  } catch (err) {
    throw err;
  }
};

export const updateProduct = async (product: UpdateProductInput) => {
  try {
    const [existingRow] = await db
      .select()
      .from(products)
      .where(
        and(eq(products.title, product.title), ne(products.id, product.id!)),
      );

    if (existingRow) throw new Error("Existing product");

    const [p] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, product.id!))
      .returning();
    return p;
  } catch (err) {
    throw err;
  }
};

export const updateProductStatus = async ({
  id,
  status,
}: UpdateProductStatusInput) => {
  try {
    const [p] = await db
      .update(products)
      .set({ status })
      .where(eq(products.id, id))
      .returning();
    return p;
  } catch (err) {
    throw err;
  }
};

export const updateProductsStatus = async ({
  status,
  productIds,
}: UpdateProductsStatusInput) => {
  if (productIds.length < 1)
    throw new Error(
      "At least one product must be selected to perform this action",
    );
  try {
    const updatedProducts = await db.transaction(async (tx) => {
      const result = await tx
        .update(products)
        .set({ status })
        .where(
          inArray(
            products.id,
            productIds.map(({ id }) => id),
          ),
        );
      return result;
    });
    return updatedProducts;
  } catch (err) {
    throw err;
  }
};

export const deleteProduct = async ({ id }: ProductId) => {
  try {
    const [p] = await db
      .delete(products)
      .where(eq(products.id, id!))
      .returning();
    return p;
  } catch (err) {
    throw err;
  }
};

export const deleteProducts = async (ids: ProductId[]) => {
  const productIdArray = ids.map(({ id }) => id);
  try {
    const deletedProducts = await db.transaction(async (tx) => {
      const rows = await tx
        .delete(products)
        .where(inArray(products.id, productIdArray))
        .returning();
      return rows;
    });
    return deletedProducts;
  } catch (error) {
    throw error;
  }
};

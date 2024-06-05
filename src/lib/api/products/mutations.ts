import { and, eq, inArray, ne } from "drizzle-orm";

import { db } from "~/server/db";
import {
  productOptionValues,
  productOptions,
  productVariants,
  products,
  variantsOptionValues,
} from "~/server/db/schema";
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

    const p = await db.transaction(async (tx) => {
      const [productRecord] = await tx
        .insert(products)
        .values(product)
        .returning();

      if (productRecord) {
        for (const option of product.options) {
          const [newOption] = await tx
            .insert(productOptions)
            .values({
              title: option.title,
              id: option.id,
              rank: option.rank,
              productId: productRecord.id,
            })
            .returning();

          if (newOption)
            for (const value of option.values) {
              await tx.insert(productOptionValues).values({
                ...value,
                optionId: newOption.id,
              });
            }
        }

        for (const variant of product.variants) {
          const [variantRecord] = await tx
            .insert(productVariants)
            .values({
              id: variant.id,
              price: variant.price,
              inventoryQuantity: variant.inventoryQuantity,
              productImageId: variant.productImageId,
              productId: productRecord.id,
            })
            .returning();

          if (variantRecord && variant.optionValues) {
            for (const optionValue of variant.optionValues) {
              await tx.insert(variantsOptionValues).values({
                variantId: variantRecord.id,
                optionValueId: optionValue.id,
              });
            }
          }
        }
        return productRecord;
      }
      throw new Error("Product insertion failed");
    });

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
